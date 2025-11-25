import {
  ILoginData,
  IProfileData,
  IRefreshTokenResponse,
  ILogoutResponse,
} from '@/models/auth.model';
import { AuthStorageService } from '@/utils/auth-storage.service';
import { BaseService } from '../base.service';
import axios from 'axios';

export interface IAuthenticationService {
  userLoginOauth(code: string): Promise<ILoginData | null>;
  getProfile(): Promise<IProfileData>;
  refreshToken(refreshToken: string): Promise<IRefreshTokenResponse>;
  logout(): Promise<ILogoutResponse>;
  userLogout(): Promise<void>;
  initiateOAuthLogin(): void;
}

export class AuthenticationService extends BaseService implements IAuthenticationService {
  public constructor() {
    super('auth');
  }

  /**
   * Initiate OAuth login by redirecting to backend OAuth2 authorize endpoint
   */
  public initiateOAuthLogin(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Get backend base URL - MUST be set to backend server (e.g., http://localhost:8080)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

    if (!baseUrl) {
      console.error(
        'NEXT_PUBLIC_BASE_URL is not set! Please create .env.local file with:\n' +
        'NEXT_PUBLIC_BASE_URL=http://localhost:8080\n' +
        'NEXT_PUBLIC_PREFIX_API=\n' +
        'NEXT_PUBLIC_OAUTH_CLIENT_ID=95ea7a03-43d6-44d0-86ce-505abe444951'
      );
      alert(
        'Configuration error: NEXT_PUBLIC_BASE_URL is not set.\n' +
        'Please check your .env.local file and ensure it points to the backend server (e.g., http://localhost:8080)'
      );
      return;
    }

    // Ensure baseUrl is a valid absolute URL
    let backendBaseUrl = baseUrl.trim();
    if (!backendBaseUrl.startsWith('http://') && !backendBaseUrl.startsWith('https://')) {
      console.error(
        `Invalid NEXT_PUBLIC_BASE_URL: "${backendBaseUrl}". It must start with http:// or https://`
      );
      alert(
        `Configuration error: NEXT_PUBLIC_BASE_URL must be a valid URL starting with http:// or https://\n` +
        `Current value: "${backendBaseUrl}"`
      );
      return;
    }

    // Remove trailing slash from baseUrl
    backendBaseUrl = backendBaseUrl.replace(/\/$/, '');

    const prefix = (process.env.NEXT_PUBLIC_PREFIX_API || '').trim().replace(/^\/|\/$/g, '');

    // Build OAuth2 authorize endpoint: /oauth2/authorize
    const pathSegments = [prefix, 'oauth2', 'authorize'].filter(Boolean);
    const path = pathSegments.join('/');
    const authorizeUrl = `${backendBaseUrl}/${path}`;

    // OAuth2 parameters
    const clientId = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID || 'ecommerce-app';
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = 'openid profile';
    const responseType = 'code';

    // Generate state for CSRF protection
    const state = this.generateState();

    // Build query string
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope,
      response_type: responseType,
      state: state,
    });

    const fullUrl = `${authorizeUrl}?${params.toString()}`;
    console.log('Redirecting to OAuth2 authorize endpoint:', fullUrl);
    window.location.href = fullUrl;
  }

  /**
   * Generate a random state string for OAuth2 CSRF protection
   */
  private generateState(): string {
    const array = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      // Fallback for environments without crypto API
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Exchange OAuth code for tokens (alternative flow using demo endpoint)
   */
  public async userLoginOauth(code: string): Promise<ILoginData | null> {
    try {
      // Gọi trực tiếp với axios, không qua BaseService
      const customBaseUrl = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8000';
      const response = await axios.post<ILoginData>(
        `${customBaseUrl}/api/auth/login`,
        { code },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      const loginData = response.data;

      if (!loginData?.accessToken) {
        return null;
      }

      await AuthStorageService.setLoginData(loginData);
      this.clearTokenCache();
      return loginData;
    } catch (error) {
      console.error('OAuth login failed', error);
      await AuthStorageService.clearAll();
      return null;
    }
  } // Sau này hãy điều chỉnh endpoint api cho hợp lý

  /**
   * Get user profile
   * GET /auth/profile
   */
  public async getProfile(): Promise<IProfileData> {
    return this.GET<IProfileData>({
      url: 'profile',
    });
  }

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  public async refreshToken(refreshToken: string): Promise<IRefreshTokenResponse> {
    const response = await this.POST<{ success: boolean; data: IRefreshTokenResponse }>({
      url: 'refresh',
      body: { refresh_token: refreshToken },
      includeAuth: false,
    });

    if (response && response.data) {
      // Update stored tokens
      const currentData = await AuthStorageService.getLoginData();
      if (currentData) {
        const updatedData: ILoginData = {
          ...currentData,
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token || currentData.refreshToken,
        };
        await AuthStorageService.setLoginData(updatedData);
        this.clearTokenCache(); // Clear cache to force refresh
      }
      return response.data;
    }

    throw new Error('Failed to refresh token');
  }

  /**
   * Logout - calls backend and handles IdP logout redirect
   * POST /auth/logout
   */
  public async logout(): Promise<ILogoutResponse> {
    try {
      const response = await this.POST<ILogoutResponse>({
        url: 'logout',
      });

      // Clear local storage
      await AuthStorageService.clearAll();
      this.clearTokenCache();

      // If IdP logout URL is provided, redirect to it
      if (response.idpLogoutUrl && typeof window !== 'undefined') {
        window.location.href = response.idpLogoutUrl;
        return response;
      }

      return response;
    } catch (error) {
      // Even if backend call fails, clear local storage
      await AuthStorageService.clearAll();
      this.clearTokenCache();
      throw error;
    }
  }

  /**
   * Simple logout - only clears local storage (for backward compatibility)
   */
  public async userLogout(): Promise<void> {
    await AuthStorageService.clearAll();
    this.clearTokenCache();
  }

  /**
   * Health check
   * GET /auth/health
   */
  public async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.GET_WITHOUT_TOKEN<{ status: string; timestamp: string }>({
      url: 'health',
    });
  }
}
