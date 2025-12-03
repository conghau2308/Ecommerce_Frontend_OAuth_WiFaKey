export interface IUserInfo {
    id?: number;
    userId?: string;
    email: string;
    username?: string;
    name?: string;
    picture?: string;
    roles?: string[];
    preferences?: Record<string, unknown>;
    createdAt?: string;
    lastLoginAt?: string;
}

export interface ILoginData {
    success?: boolean;
    accessToken: string;
    refreshToken?: string;
    tokenType: string;
    expiresIn?: number;
    userInfo?: IUserInfo;
}

export interface IProfileData {
    userId: string;
    email: string;
    name: string;
    preferences?: Record<string, unknown>;
    lastLoginAt?: string;
}

export interface IRefreshTokenResponse {
    access_token: string;
    refresh_token?: string;
    token_type?: string;
    expires_in?: number;
}

export interface IRefreshResponse {
    data: IRefreshTokenResponse;
}

export interface ILogoutResponse {
    success: boolean;
    message: string;
    idpLogoutUrl?: string;
}