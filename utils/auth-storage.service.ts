import { ILoginData } from '@/models/auth.model';

const STORAGE_KEY = 'ecommerce-app:login';

const isBrowser = () => typeof window !== 'undefined';

export class AuthStorageService {
    public static async getLoginData(): Promise<ILoginData | null> {
        if (!isBrowser()) {
            return null;
        }

        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return null;
            }

            return JSON.parse(raw) as ILoginData;
        } catch (error) {
            console.error('Failed to parse login data:', error);
            window.localStorage.removeItem(STORAGE_KEY);
            return null;
        }
    }

    public static async setLoginData(payload: ILoginData): Promise<void> {
        if (!isBrowser()) {
            return;
        }

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }

    public static async clearAll(): Promise<void> {
        if (!isBrowser()) {
            return;
        }

        window.localStorage.removeItem(STORAGE_KEY);
    }
}

