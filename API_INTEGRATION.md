# API Integration Summary

Tài liệu này mô tả các API đã được tích hợp từ backend NestJS vào frontend Next.js.

## Các Service Đã Tạo

### 1. AuthenticationService (`services/auth/authenticate.service.ts`)

Service xử lý các API liên quan đến authentication:

- **`initiateOAuthLogin()`**: Khởi tạo OAuth login bằng cách redirect đến backend `/auth/login`
- **`userLoginOauth(code: string)`**: Exchange OAuth code để lấy tokens (alternative flow)
- **`getProfile()`**: Lấy thông tin profile của user hiện tại (`GET /auth/profile`)
- **`refreshToken(refreshToken: string)`**: Refresh access token (`POST /auth/refresh`)
- **`logout()`**: Logout và xử lý IdP logout redirect (`POST /auth/logout`)
- **`healthCheck()`**: Health check endpoint (`GET /auth/health`)

### 2. UserService (`services/users/user.service.ts`)

Service xử lý các API liên quan đến user:

- **`getCurrentUser()`**: Lấy thông tin user hiện tại (`GET /users/me`)
- **`updatePreferences(preferences)`**: Cập nhật preferences của user (`PUT /users/me/preferences`)

### 3. DemoService (`services/demo/demo.service.ts`)

Service cho demo endpoint:

- **`exchangeToken(code: string)`**: Exchange OAuth code cho tokens (`POST /demo/exchange-token`)

## Models Đã Cập Nhật

### `models/auth.model.ts`

- **`ILoginData`**: Bao gồm `accessToken`, `refreshToken`, `tokenType`, `userInfo`
- **`IUserInfo`**: Thông tin user với các field: `userId`, `email`, `name`, `roles`, `preferences`, etc.
- **`IProfileData`**: Dữ liệu profile từ `/auth/profile`
- **`IRefreshTokenResponse`**: Response từ refresh token endpoint
- **`ILogoutResponse`**: Response từ logout endpoint

## Pages Đã Tạo/Cập Nhật

### 1. Login Page (`app/auth/page.tsx`)

- Button "Tiếp tục với WiFaKey" đã được kết nối với `initiateOAuthLogin()`
- Khi click, sẽ redirect đến backend `/auth/login` để bắt đầu OAuth flow

### 2. OAuth Callback Page (`app/auth/callback/page.tsx`)

- Xử lý callback từ backend sau khi OAuth thành công
- Nhận tokens từ URL params (`access_token`, `refresh_token`, `token_type`)
- Lưu tokens vào localStorage
- Fetch user profile và lưu vào storage
- Redirect về trang chủ sau khi hoàn tất

## Hooks

### `hooks/use-auth.ts`

Custom React hook để quản lý authentication state:

```typescript
const {
    user,              // IUserInfo | null
    profile,           // IProfileData | null
    isLoading,         // boolean
    isAuthenticated,   // boolean
    loginData,         // ILoginData | null
    refreshProfile,    // () => Promise<void>
    refreshUser,       // () => Promise<void>
    logout,            // () => Promise<void>
    updatePreferences, // (preferences) => Promise<void>
} = useAuth();
```

## UnitOfWork

`services/di/unit-of-work.ts` đã được cập nhật để include:
- `authenticationService`: IAuthenticationService
- `userService`: IUserService

## Cải Tiến BaseService

`services/base.service.ts` đã được cải thiện với:
- **Auto token refresh**: Tự động refresh token khi gặp 401 error
- **Retry mechanism**: Retry request ban đầu sau khi refresh token thành công
- **Better error handling**: Xử lý lỗi tốt hơn với các status codes khác nhau

## Cách Sử Dụng

### 1. OAuth Login Flow

```typescript
// Trong component
import { unitOfWork } from '@/services/di/unit-of-work';

const handleLogin = () => {
    unitOfWork.authenticationService.initiateOAuthLogin();
};
```

### 2. Sử dụng useAuth Hook

```typescript
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
    const { user, isAuthenticated, isLoading, logout } = useAuth();

    if (isLoading) return <div>Loading...</div>;
    if (!isAuthenticated) return <div>Please login</div>;

    return (
        <div>
            <p>Welcome, {user?.name}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
```

### 3. Gọi API trực tiếp

```typescript
import { unitOfWork } from '@/services/di/unit-of-work';

// Get user profile
const profile = await unitOfWork.authenticationService.getProfile();

// Get current user
const user = await unitOfWork.userService.getCurrentUser();

// Update preferences
await unitOfWork.userService.updatePreferences({
    theme: 'dark',
    language: 'vi',
});

// Refresh token
const tokens = await unitOfWork.authenticationService.refreshToken(refreshToken);

// Logout
await unitOfWork.authenticationService.logout();
```

## Environment Variables Cần Thiết

Đảm bảo các biến môi trường sau được cấu hình:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Backend base URL
NEXT_PUBLIC_PREFIX_API=api                   # API prefix (optional)
```

## Lưu Ý

1. **Token Storage**: Tokens được lưu trong localStorage với key `ecommerce-app:login`
2. **Auto Refresh**: BaseService tự động refresh token khi gặp 401, nhưng chỉ retry 1 lần
3. **Logout Flow**: Khi logout, nếu backend trả về `idpLogoutUrl`, frontend sẽ redirect đến đó
4. **Error Handling**: Các lỗi 401/403 sẽ tự động clear tokens và redirect về `/auth`
5. **Server Errors**: Các lỗi 500+ sẽ redirect đến `/error`

## API Endpoints Mapping

| Frontend Method | Backend Endpoint | Method | Auth Required |
|----------------|-----------------|--------|---------------|
| `initiateOAuthLogin()` | `/auth/login` | GET | No |
| `getProfile()` | `/auth/profile` | GET | Yes (JWT) |
| `refreshToken()` | `/auth/refresh` | POST | No |
| `logout()` | `/auth/logout` | POST | Yes (JWT) |
| `healthCheck()` | `/auth/health` | GET | No |
| `getCurrentUser()` | `/users/me` | GET | Yes (JWT) |
| `updatePreferences()` | `/users/me/preferences` | PUT | Yes (JWT) |
| `exchangeToken()` | `/demo/exchange-token` | POST | No |

