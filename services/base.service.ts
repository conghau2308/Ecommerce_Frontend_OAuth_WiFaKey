import { AuthStorageService } from '@/utils/auth-storage.service';
import axios, {
    AxiosError,
    AxiosInstance,
    AxiosProgressEvent,
    AxiosRequestConfig,
    AxiosRequestHeaders,
    InternalAxiosRequestConfig,
} from 'axios';

type Primitive = string | number | boolean | null | undefined;

export interface IRequestParams {
    [key: string]: Primitive | Primitive[] | IRequestParams;
}

export interface IRequestOptions<TBody = unknown, TParams extends IRequestParams = IRequestParams> {
    url: string;
    params?: TParams;
    body?: TBody;
    headers?: Record<string, string>;
    includeAuth?: boolean;
    responseType?: AxiosRequestConfig['responseType'];
    timeout?: number;
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export interface IApiEnvelope<T> {
    success?: boolean;
    data?: T;
    message?: string;
    error?: unknown;
}

export class ApiError<TPayload = unknown> extends Error {
    public readonly status?: number;
    public readonly payload?: TPayload;

    constructor(message: string, status?: number, payload?: TPayload) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.payload = payload;
    }
}

interface IBaseServiceOptions {
    hasPrefix?: boolean;
    baseUrl?: string;
    timeout?: number;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export class BaseService {
    private readonly axiosClient: AxiosInstance;
    private readonly defaultTimeout: number;
    private readonly baseURL: string;
    private tokenCache: string | null = null;
    private tokenCacheTime = 0;
    private readonly TOKEN_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    protected constructor(baseAPI: string, options: IBaseServiceOptions = {}) {
        const { hasPrefix = true, baseUrl, timeout = 30000 } = options;
        const baseURL = this.buildBaseURL(baseAPI, hasPrefix, baseUrl);
        this.baseURL = baseURL;

        this.defaultTimeout = timeout;
        this.axiosClient = axios.create({
            baseURL,
            timeout: this.defaultTimeout,
            withCredentials: true,
        });

        this.setupInterceptors();
    }

    private buildBaseURL(baseAPI: string, hasPrefix: boolean, customBaseUrl?: string): string {
        const root = this.normalizeUrl(customBaseUrl ?? process.env.NEXT_PUBLIC_BASE_URL ?? '');
        const prefix = hasPrefix ? this.normalizePath(process.env.NEXT_PUBLIC_PREFIX_API ?? '') : '';
        const apiPath = this.normalizePath(baseAPI);

        const segments = [root, prefix, apiPath].filter(Boolean);
        return segments.join('/');
    }

    private normalizeUrl(url: string): string {
        if (!url) return '';
        return url.endsWith('/') ? url.slice(0, -1) : url;
    }

    private normalizePath(path: string): string {
        if (!path) return '';
        const trimmed = path.replace(/^\//, '');
        return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
    }

    private setupInterceptors() {
        this.axiosClient.interceptors.request.use(
            async (config) => this.handleRequest(config),
            (error) => Promise.reject(error),
        );

        this.axiosClient.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => this.handleInterceptorError(error),
        );
    }

    private async handleRequest(
        config: InternalAxiosRequestConfig,
    ): Promise<InternalAxiosRequestConfig> {
        const includeAuth = config.headers?.['X-Include-Auth'] !== 'false';

        const headers = (config.headers ?? {}) as AxiosRequestHeaders;

        if (includeAuth && typeof window !== 'undefined') {
            const token = await this.getCachedToken();
            if (token) {
                headers.Authorization = token;
            }
        }

        if (headers['X-Include-Auth']) {
            // Remove internal flag before request is sent
            delete headers['X-Include-Auth'];
        }

        headers.Accept = headers.Accept ?? 'application/json';

        if (!headers['Content-Type'] && config.data && !(config.data instanceof FormData)) {
            headers['Content-Type'] = 'application/json; charset=utf-8';
        }

        config.headers = headers;
        config.timeout = config.timeout ?? this.defaultTimeout;

        return config;
    }

    // Cache token to avoid reading from storage repeatedly
    private async getCachedToken(): Promise<string> {
        const now = Date.now();

        if (this.tokenCache && now - this.tokenCacheTime < this.TOKEN_CACHE_DURATION) {
            return this.tokenCache;
        }

        try {
            const loginData = await AuthStorageService.getLoginData();
            if (!loginData?.accessToken) {
                this.clearTokenCache();
                return '';
            }

            this.tokenCache = `Bearer ${loginData.accessToken}`;
            this.tokenCacheTime = now;

            return this.tokenCache;
        } catch (error) {
            console.error('Error retrieving token:', error);
            return '';
        }
    }

    public clearTokenCache() {
        this.tokenCache = null;
        this.tokenCacheTime = 0;
    }

    private async handleInterceptorError(error: AxiosError): Promise<never> {
        const status = error.response?.status;
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (!status) {
            if (typeof window !== 'undefined') {
                // window.location.href = '/error';
            }
            return Promise.reject(
                new ApiError(error.message || 'Network error', undefined, error.toJSON()),
            );
        }

        // Handle 401 Unauthorized - try to refresh token
        if (status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
            originalRequest._retry = true;

            try {
                const loginData = await AuthStorageService.getLoginData();
                if (loginData?.refreshToken) {
                    // Try to refresh token
                    // Build auth service base URL
                    const root = this.normalizeUrl(process.env.NEXT_PUBLIC_BASE_URL ?? '');
                    const prefix = this.normalizePath(process.env.NEXT_PUBLIC_PREFIX_API ?? '');
                    const apiPath = this.normalizePath('auth');
                    const authBaseUrl = [root, prefix, apiPath].filter(Boolean).join('/');

                    const refreshResponse = await axios.post<{
                        success: boolean;
                        data: { access_token: string; refresh_token?: string };
                    }>(
                        `http://localhost:8000/api/auth/refresh`,
                        { refresh_token: loginData.refreshToken },
                        {
                            headers: { 'Content-Type': 'application/json' },
                            withCredentials: true,
                        },
                    );

                    console.log("Refresh response", refreshResponse)

                    if (refreshResponse.data?.success && refreshResponse.data.data) {
                        // Update stored tokens
                        const updatedData = {
                            ...loginData,
                            accessToken: refreshResponse.data.data.access_token,
                            refreshToken:
                                refreshResponse.data.data.refresh_token || loginData.refreshToken,
                        };
                        await AuthStorageService.setLoginData(updatedData);
                        this.clearTokenCache();

                        // Retry original request with new token
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.data.access_token}`;
                        }

                        return this.axiosClient.request(originalRequest);
                    }
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Fall through to logout
            }

            // If refresh failed or no refresh token, logout
            this.clearTokenCache();
            await AuthStorageService.clearAll();

            if (typeof window !== 'undefined') {
                window.location.href = '/auth';
            }
        }

        // if (status === 403) {
        //     this.clearTokenCache();
        //     await AuthStorageService.clearAll();

        //     if (typeof window !== 'undefined') {
        //         window.location.href = '/auth';
        //     }
        // }

        if (status >= 500 && typeof window !== 'undefined') {
            window.location.href = '/error';
        }

        const message =
            (error.response?.data as { message?: string })?.message ?? error.message ?? 'Request error';

        return Promise.reject(new ApiError(message, status, error.response?.data));
    }

    private unwrapResponse<T>(payload: IApiEnvelope<T> | T): T {
        if (payload && typeof payload === 'object' && 'data' in payload) {
            const envelope = payload as IApiEnvelope<T>;

            if (envelope.success === false) {
                throw new ApiError(envelope.message ?? 'Request failed');
            }

            if (typeof envelope.data !== 'undefined') {
                return envelope.data as T;
            }
        }

        return payload as T;
    }

    private async request<T>(
        method: HttpMethod,
        options: IRequestOptions,
    ): Promise<T> {
        const {
            url,
            params,
            body,
            headers,
            includeAuth = true,
            onUploadProgress,
            responseType,
            timeout,
        } = options;

        const config: AxiosRequestConfig = {
            method,
            url,
            params,
            data: body,
            headers: {
                ...headers,
                ...(includeAuth ? {} : { 'X-Include-Auth': 'false' }),
            },
            onUploadProgress,
            responseType,
            timeout,
        };

        try {
            const response = await this.axiosClient.request<IApiEnvelope<T> | T>(config);
            return this.unwrapResponse<T>(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new ApiError(
                    error.message,
                    error.response?.status,
                    error.response?.data,
                );
            }

            throw error;
        }
    }

    // HTTP Methods
    protected GET<T>(options: IRequestOptions) {
        return this.request<T>('GET', options);
    }

    protected GET_WITHOUT_TOKEN<T>(options: IRequestOptions) {
        return this.request<T>('GET', { ...options, includeAuth: false });
    }

    protected POST<T>(options: IRequestOptions) {
        return this.request<T>('POST', options);
    }

    protected POST_WITHOUT_TOKEN<T>(options: IRequestOptions) {
        return this.request<T>('POST', { ...options, includeAuth: false });
    }

    protected POST_FORMDATA<T>(
        options: IRequestOptions<FormData>,
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
    ) {
        if (!(options.body instanceof FormData)) {
            throw new Error('POST_FORMDATA requires body to be an instance of FormData');
        }

        return this.request<T>('POST', {
            ...options,
            headers: {
                ...options.headers,
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });
    }

    protected PUT<T>(options: IRequestOptions) {
        return this.request<T>('PUT', options);
    }

    protected PUT_WITHOUT_TOKEN<T>(options: IRequestOptions) {
        return this.request<T>('PUT', { ...options, includeAuth: false });
    }

    protected DELETE<T>(options: IRequestOptions) {
        return this.request<T>('DELETE', options);
    }

    protected DELETE_WITHOUT_TOKEN<T>(options: IRequestOptions) {
        return this.request<T>('DELETE', { ...options, includeAuth: false });
    }

    protected getServerSide<T>(options: IRequestOptions, token?: string) {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json; charset=utf-8',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        return this.request<T>('GET', { ...options, headers });
    }
}