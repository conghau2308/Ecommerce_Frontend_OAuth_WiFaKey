// src/services/users/user.service.ts
import axios from "axios";
import { BaseService } from "../base.service";
import { AuthStorageService } from "@/utils/auth-storage.service";

/**
 * User info từ /users/me (full database info)
 */
export interface IUserInfo {
  id: string; // NestJS DB UUID
  idpUserId: string; // IdP user ID (stable)
  email?: string;
  name?: string;
  picture?: string;
  preferences?: Record<string, unknown>;
  membershipLevel?: string;
  createdAt: string;
  lastLoginAt?: string;
  lastLogoutAt?: string;
  roles?: string[];
}

/**
 * User profile từ /users/profile (chỉ JWT claims)
 * Lightweight, không query database
 */
export interface IUserProfile {
  idpUserId: string;
  username: string;
  email?: string;
  name?: string;
  roles?: string[];
}

/**
 * Preferences update payload
 */
export interface IUpdatePreferencesPayload {
  preferences: Record<string, unknown>;
}

export interface IUserService {
  getCurrentUser(): Promise<UserInfoResponse>;
  getUserProfile(): Promise<IUserProfile>;
  updatePreferences(
    preferences: Record<string, unknown>
  ): Promise<IUpdatePreferencesPayload>;
}

export interface UserInfoResponse {
  success: boolean;
  data: UserInfo;
}

export interface UserInfo {
  id: string;
  idpUserId: string;
  name: string;
  email: string | null;
  picture: string | null;
  roles: string[];
  preferences: Record<string, unknown>;
  createdAt: string; // ISO date string
  lastLoginAt: string; // ISO date string
  lastLogoutAt: string | null;
}

export class UserService extends BaseService implements IUserService {
  public constructor() {
    super("users"); // ✅ Base path là "users", không phải "auth"
  }

  /**
   * ✅ Get current user full info từ database
   * GET /users/me
   * Requires: Authorization header (tự động thêm bởi BaseService)
   */
  public async getCurrentUser(): Promise<UserInfoResponse> {
    const customBaseUrl =
      process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:8000";

    const token = (await AuthStorageService.getLoginData())?.accessToken ?? "";

    console.log("ACCESS TOKEN FRONTEND:", token);

    try {
      const response = await axios.get<UserInfoResponse>(
      `${customBaseUrl}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response.data; // 👈 trả đúng IUserInfo
    } catch(error) {
      // handleInterceptorError(error)
      console.log(error);
      throw error;
    }
  }

  /**
   * ✅ Get user profile từ JWT only (không query DB)
   * GET /users/profile
   * Lightweight alternative to /users/me
   */
  public async getUserProfile(): Promise<IUserProfile> {
    const response = await this.GET<{
      success: boolean;
      data: IUserProfile;
    }>({
      url: "/profile", // ✅ Đúng endpoint
      // ✅ Token được BaseService tự động thêm
    });

    return response.data || response;
  }

  /**
   * ✅ Update user preferences
   * PUT /users/me/preferences
   */
  public async updatePreferences(
    preferences: Record<string, unknown>
  ): Promise<IUpdatePreferencesPayload> {
    const response = await this.PUT<{
      success: boolean;
      message: string;
      data: IUpdatePreferencesPayload;
    }>({
      url: "/me/preferences",
      body: { preferences }, // ✅ Wrap trong object theo NestJS controller
    });

    return response.data || response;
  }
}
