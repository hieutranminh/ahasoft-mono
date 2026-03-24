# Authentication Documentation

This document describes the complete authentication flow: Login, Logout, and Token Refresh.

## Architecture Overview

```
src/
├── types/
│   └── auth.ts                          # Auth domain types
├── api/
│   ├── services/
│   │   └── auth.ts                      # Login API call
│   └── interceptors/
│       ├── request.ts                   # Attach Bearer token from store
│       ├── response.ts                  # 401 detection, refresh orchestration
│       ├── tokenRefresh.ts              # Pure refresh API call (raw axios)
│       └── handlers/
│           └── statusHandlers.ts        # Clear store + redirect on 401
├── stores/
│   └── auth.ts                          # Single source of truth (Pinia)
├── views/
│   └── Auth/
│       └── LoginView.vue                # Login form UI
├── router/
│   └── guards/
│       ├── auth.guard.ts                # Route protection
│       └── permission.guard.ts          # Role-based access
├── schemas/
│   └── loginSchema.ts                   # Form validation (Yup)
└── constants/
    └── auth.ts                          # Storage keys, error messages
```

## Single Source of Truth

The Pinia auth store is the **only** place that manages auth state. Every module reads from and writes through the store:

```
                    ┌──────────────────┐
                    │   Pinia Store     │  <-- Single Source of Truth
                    │  (auth.ts)        │
                    │                   │
                    │  token            │──> sessionStorage (persist)
                    │  refreshToken     │──> sessionStorage (persist)
                    │  userAuthInfo     │──> sessionStorage (persist)
                    │                   │
                    │  setAuthData()    │  <-- login writes
                    │  updateTokens()   │  <-- refresh writes
                    │  clearAuthData()  │  <-- logout / 401 clears
                    └────────┬─────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    request.ts          response.ts        statusHandlers.ts
    (reads token)       (reads token,      (calls clearAuthData,
                         calls updateTokens) redirects to login)
```

No other module accesses `sessionStorage` directly for auth data.

## Storage

Auth data is stored in **sessionStorage** (not cookies, not localStorage):

| Key              | Value                          | Set by                             |
| ---------------- | ------------------------------ | ---------------------------------- |
| `auth_token`     | JWT auth token string          | `setAuthData()` / `updateTokens()` |
| `refresh_token`  | JWT refresh token string       | `setAuthData()` / `updateTokens()` |
| `user_auth_info` | JSON-serialized `UserAuthInfo` | `setAuthData()` / `updateTokens()` |

Keys are defined in `src/constants/auth.ts` (`AUTH_STORAGE_KEYS`).

---

## Login Flow

### Sequence

```
User enters userID + password
       │
       ▼
LoginView.vue (form validation via Yup)
       │
       ▼
authStore.login({ userID, password })
       │  adds solutionId from SOLUTION_ID config
       ▼
authApi.login(payload)
       │  POST /api/aggr/v1/auth/Login/Subscriber?culture=ko-KR&ui-culture=ko-KR
       │  flags: skipAuth=true, skipAuthRedirect=true
       ▼
Backend response: { result, errorMessages, isOK }
       │
       ├── isOK=true  ──> store.setAuthData(userAuthInfo)
       │                   ──> persistLocale(language)
       │                   ──> navigate to HOME
       │
       └── isOK=false ──> display errorMessages[0].errorMessage
```

### Request Payload

```json
{
  "userID": "hieushopkr1",
  "password": "abcd@1234",
  "solutionId": "3002"
}
```

`solutionId` is injected by the store from `SOLUTION_ID` in `src/config/services.ts`. The view only provides `userID` and `password`.

### Success Response

```json
{
  "result": {
    "userAuthInfo": {
      "authToken": "eyJ...",
      "tokenExpiredDateTimeTS": 1770831316,
      "refreshToken": "eyJ...",
      "refreshTokenExpiredDateTimeTS": 1773439200,
      "userAccountId": 1323,
      "language": "EN",
      "userRoleCode": "MASTER"
    },
    "shopBasicInfo": {}
  },
  "errorMessages": [],
  "isOK": true
}
```

### Error Response

```json
{
  "result": null,
  "errorMessages": [
    {
      "errorCode": "UA14C",
      "errorMessage": "User account does not exist",
      "errorValues": ["loginFailCount: 1", "isAccountLock: False"]
    }
  ],
  "isOK": false
}
```

### After Login Success

1. `setAuthData()` stores `authToken`, `refreshToken`, and full `userAuthInfo` in both Pinia refs and sessionStorage.
2. `mapBackendLanguageToLocale()` converts the backend `language` field (e.g. `"EN"`, `"KO"`) to app locale (`"en"`, `"ko"`).
3. `persistLocale()` sets vue-i18n locale and saves to sessionStorage.
4. Router navigates to HOME.

---

## Token Refresh Flow

### When It Triggers

Any API call that returns HTTP 401 triggers the refresh flow **automatically** in the response interceptor. Exceptions:

- Requests with `skipAuthRedirect: true` (login, refresh itself)
- Requests already retried once (`_isRetry` flag)

### Sequence

```
API call returns 401
       │
       ▼
response.ts detects 401
       │  checks: not skipAuthRedirect, not _isRetry
       ▼
Reads authStore.token + authStore.refreshToken
       │
       ▼
callRefreshTokenApi(authToken, refreshToken)
       │  POST /api/aggr/v1/auth/RefreshToken?culture=ko-KR&ui-culture=ko-KR
       │  Uses raw axios (NOT apiClient) to avoid circular dependency
       ▼
       ├── Success ──> authStore.updateTokens(result)
       │               ──> retry original request with new token
       │               ──> _isRetry=true (prevents infinite loop)
       │
       └── Failure ──> fall through to handleErrorStatus
                       ──> authStore.clearAuthData()
                       ──> redirect to LOGIN
```

### Concurrency Handling

When multiple API calls get 401 simultaneously:

1. First caller starts the refresh request, sets `isRefreshing = true`.
2. Subsequent callers are queued in `refreshSubscribers[]`.
3. When refresh completes, all subscribers are notified with the result.
4. Only **one** refresh request is ever in flight.

### Why Raw Axios?

`tokenRefresh.ts` uses `import axios from 'axios'` directly instead of `apiClient` for two reasons:

1. **No circular dependency**: `apiClient` -> `response.ts` -> `tokenRefresh.ts` -> `axios` (raw). If it imported `apiClient`, the chain would loop.
2. **No interceptor loop**: The refresh request bypasses all interceptors, preventing an infinite 401 -> refresh -> 401 cycle.

### Refresh Request Payload

```json
{
  "refreshToken": "eyJ...",
  "authToken": "eyJ..."
}
```

### Refresh Success Response

```json
{
  "result": {
    "authToken": "eyJ... (new)",
    "tokenExpiredDateTimeTS": 1770895458,
    "refreshToken": "eyJ... (new)",
    "refreshTokenExpiredDateTimeTS": 1773525600
  },
  "errorMessages": [],
  "isOK": true
}
```

---

## Logout Flow

### Sequence

```
Call authStore.logout()
       │
       ▼
clearAuthData()
       │  token.value = null
       │  refreshToken.value = null
       │  userAuthInfo.value = null
       │  sessionStorage: remove all 3 keys
       ▼
Auth guard sees isAuthenticated = false
       │
       ▼
Redirect to LOGIN (on next protected route navigation)
```

### Implicit Logout (401 After Failed Refresh)

When token refresh fails or no refresh token exists:

```
401 response
       │
       ▼
response.ts: refresh fails or no tokens
       │
       ▼
handleErrorStatus(401)
       │
       ▼
handle401Unauthorized()
       │  authStore.clearAuthData()  <-- clears Pinia + sessionStorage
       │  router.push(LOGIN)
       ▼
Auth guard allows LOGIN (isAuthenticated = false)
```

This avoids the infinite redirect bug: `clearAuthData()` sets `token.value = null`, so `isAuthenticated` becomes `false`, and the auth guard allows access to the login page (`requiresGuest`).

---

## Route Protection

### Auth Guard (`auth.guard.ts`)

Synchronous check, no async operations:

```
Route with meta.requiresGuest:
  authenticated?  --> redirect to HOME
  not?            --> allow

Route with meta.requiresAuth:
  not authenticated? --> redirect to LOGIN (with ?redirect=originalPath)
  authenticated?     --> allow

Other routes: allow
```

### Permission Guard (`permission.guard.ts`)

Checks `meta.requiredRoles` against `userAuthInfo.userRoleCode`. Currently passes through (ready for future implementation).

---

## Type Definitions

### `LoginRequest`

```typescript
interface LoginRequest {
  userID: string
  password: string
  solutionId: string
}
```

### `UserAuthInfo`

```typescript
interface UserAuthInfo {
  authToken: string
  tokenExpiredDateTimeTS: number
  refreshToken: string
  refreshTokenExpiredDateTimeTS: number
  userAccountId: number
  countryCode: string
  solutionId: number
  shopId: number
  userID: string
  name: string | null
  language: string // "EN" | "KO" etc.
  userRoleCode: string // "MASTER" etc.
  // ... other fields
}
```

### `RefreshTokenResult`

```typescript
interface RefreshTokenResult {
  authToken: string
  tokenExpiredDateTimeTS: number
  refreshToken: string
  refreshTokenExpiredDateTimeTS: number
}
```

### `ApiResponse<T>`

```typescript
interface ApiResponse<T = unknown> {
  result: T | null
  errorMessages: ApiErrorMessage[]
  isOK: boolean
}
```

---

## Configuration

### Environment

Gateway URL is set in `.env`:

```
VITE_GATEWAY_BASE_URL="https://ahasoft-salon-admin-http-aggregator-staging.azurewebsites.net"
```

### Static Config

`solutionId` is defined in `src/config/services.ts`:

```typescript
export const SOLUTION_ID = 3002
```

### API Endpoints

| Action  | Method | URL                                  |
| ------- | ------ | ------------------------------------ |
| Login   | POST   | `/api/aggr/v1/auth/Login/Subscriber` |
| Refresh | POST   | `/api/aggr/v1/auth/RefreshToken`     |

Both endpoints receive query params `?culture=ko-KR&ui-culture=ko-KR`.
