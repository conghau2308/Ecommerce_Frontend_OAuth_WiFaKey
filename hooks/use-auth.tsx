"use client";

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { unitOfWork } from '@/services/di/unit-of-work';
import { AuthStorageService } from '@/utils/auth-storage.service';
import { ILoginData, IUserInfo, IProfileData } from '@/models/auth.model';

export interface UseAuthReturn {
    user: IUserInfo | null;
    profile: IProfileData | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    loginData: ILoginData | null;
    refreshProfile: () => Promise<void>;
    refreshUser: () => Promise<void>;
    logout: () => Promise<void>;
    updatePreferences: (preferences: Record<string, any>) => Promise<void>;
}

// Create Auth Context
const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

// Internal hook implementation
function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<IUserInfo | null>(null);
    const [profile, setProfile] = useState<IProfileData | null>(null);
    const [loginData, setLoginData] = useState<ILoginData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadAuthData = useCallback(async () => {
        try {
            const stored = await AuthStorageService.getLoginData();
            setLoginData(stored);

            if (stored?.accessToken) {
                // Try to load user profile
                try {
                    const profileData = await unitOfWork.authenticationService.getProfile();
                    setProfile(profileData);
                    if (profileData) {
                        setUser({
                            email: profileData.email,
                            userId: profileData.userId,
                            name: profileData.name,
                            preferences: profileData.preferences,
                        });
                    }
                } catch (error) {
                    console.error('Failed to load profile:', error);
                    // Try to load user info instead
                    try {
                        const userData = await unitOfWork.userService.getCurrentUser();
                        setUser(userData);
                    } catch (userError) {
                        console.error('Failed to load user:', userError);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load auth data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAuthData();
    }, [loadAuthData]);

    const refreshProfile = useCallback(async () => {
        try {
            const profileData = await unitOfWork.authenticationService.getProfile();
            setProfile(profileData);
            if (profileData) {
                setUser({
                    email: profileData.email,
                    userId: profileData.userId,
                    name: profileData.name,
                    preferences: profileData.preferences,
                });
            }
        } catch (error) {
            console.error('Failed to refresh profile:', error);
            throw error;
        }
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const userData = await unitOfWork.userService.getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error('Failed to refresh user:', error);
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await unitOfWork.authenticationService.logout();
        } catch (error) {
            console.error('Logout error:', error);
            // Clear local storage anyway
            await unitOfWork.authenticationService.userLogout();
        } finally {
            setUser(null);
            setProfile(null);
            setLoginData(null);
        }
    }, []);

    const updatePreferences = useCallback(async (preferences: Record<string, any>) => {
        try {
            const result = await unitOfWork.userService.updatePreferences(preferences);
            // Update local user state
            setUser((prev) => (prev ? { ...prev, preferences: result.preferences } : null));
            setProfile((prev) => (prev ? { ...prev, preferences: result.preferences } : null));
        } catch (error) {
            console.error('Failed to update preferences:', error);
            throw error;
        }
    }, []);

    return {
        user,
        profile,
        isLoading,
        isAuthenticated: !!loginData?.accessToken,
        loginData,
        refreshProfile,
        refreshUser,
        logout,
        updatePreferences,
    };
}

// AuthProvider Component
export function AuthProvider({ children }: { children: ReactNode }) {
    const authValue = useAuth();
    return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuthContext(): UseAuthReturn {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}

// Export useAuth hook for direct use (optional)
export { useAuth };

