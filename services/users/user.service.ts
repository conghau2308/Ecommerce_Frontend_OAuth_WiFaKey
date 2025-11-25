import { IUserInfo } from '@/models/auth.model';
import { BaseService } from '../base.service';

export interface IUserService {
    getCurrentUser(): Promise<IUserInfo>;
    updatePreferences(preferences: Record<string, any>): Promise<{ preferences: Record<string, any> }>;
}

export class UserService extends BaseService implements IUserService {
    public constructor() {
        super('users');
    }

    /**
     * Get current user info
     * GET /users/me
     */
    public async getCurrentUser(): Promise<IUserInfo> {
        const response = await this.GET<{ success: boolean; data: IUserInfo }>({
            url: 'me',
        });

        return response.data || response;
    }

    /**
     * Update user preferences
     * PUT /users/me/preferences
     */
    public async updatePreferences(
        preferences: Record<string, any>,
    ): Promise<{ preferences: Record<string, any> }> {
        const response = await this.PUT<{
            success: boolean;
            data: { preferences: Record<string, any> };
        }>({
            url: 'me/preferences',
            body: preferences,
        });

        return response.data || response;
    }
}

