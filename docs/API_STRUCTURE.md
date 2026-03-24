# API Structure Documentation

This document outlines the API handling structure implemented for the Vue 3 project using Axios, TypeScript, and functional programming principles.

## Architecture Overview

```
src/
├── api/
│   ├── axios.ts                          # Axios instance + interceptor setup
│   ├── url-builder.ts                    # Type-safe CQRS URL builder
│   ├── interceptors/
│   │   ├── request.ts                    # Attach Bearer token from Pinia store
│   │   ├── response.ts                   # Error handling, 401 + token refresh
│   │   ├── tokenRefresh.ts              # Pure refresh API call (raw axios)
│   │   ├── handlers/
│   │   │   └── statusHandlers.ts         # Per-status error handlers
│   │   ├── utils/
│   │   │   └── errorUtils.ts             # Error extraction, logging
│   │   └── index.ts                      # Barrel exports
│   ├── services/
│   │   ├── base.ts                       # Gateway service (CQRS pattern)
│   │   └── auth.ts                       # Authentication API
│   └── index.ts                          # Public API exports
├── types/
│   ├── api.ts                            # ApiResponse, ApiError, ApiRequestConfig
│   └── auth.ts                           # LoginRequest, UserAuthInfo, etc.
├── config/
│   ├── app.ts                            # App-level config (env vars)
│   └── services.ts                       # Service definitions + SOLUTION_ID
└── composables/
    └── useApi.ts                         # (Optional) Vue composable for API usage
```

## Key Features

### Function-Based Architecture

- No class-based wrappers
- Pure functions with clear input/output
- Easy to test and maintain

### CQRS Gateway Pattern

The backend follows a CQRS (Command Query Responsibility Segregation) pattern through a gateway:

```
/api/{type}/v{version}/{serviceName}/{endpoint}
```

| Type   | Purpose                      | HTTP Method         |
| ------ | ---------------------------- | ------------------- |
| `read` | Queries (read data)          | POST                |
| `cmd`  | Mutations (write data)       | POST / PUT / DELETE |
| `aggr` | Aggregations (cross-service) | POST                |

### Separated Interceptors

- **Request Interceptor**: Attaches Bearer token from Pinia auth store
- **Response Interceptor**: 401 detection with automatic token refresh, error normalization

### Type Safety

All API calls return `ApiResponse<T>`:

```typescript
interface ApiResponse<T = unknown> {
  result: T | null
  errorMessages: ApiErrorMessage[]
  isOK: boolean
}
```

HTTP-level errors are wrapped in `ApiError`:

```typescript
interface ApiError {
  success: false
  message: string
  errors?: string[]
  status?: number
  code?: string
  details?: unknown
}
```

Custom request options via `ApiRequestConfig`:

```typescript
interface ApiRequestConfig {
  headers?: Record<string, string>
  params?: Record<string, unknown>
  timeout?: number
  withCredentials?: boolean
  skipAuth?: boolean // Skip Bearer token attachment
  skipAuthRedirect?: boolean // Skip 401 redirect to login
}
```

---

## Gateway Service (`src/api/services/base.ts`)

The gateway service is the public API for all domain services. It wraps the low-level HTTP client with CQRS semantics:

```typescript
export const gatewayService = {
  // Query endpoint (POST to /api/read/...)
  read<T>(service, endpoint, data?, config?): Promise<ApiResponse<T>>

  // Mutation endpoint (POST to /api/cmd/...)
  command<T>(service, endpoint, data?, config?): Promise<ApiResponse<T>>

  // Mutation endpoint (PUT to /api/cmd/...)
  commandPut<T>(service, endpoint, data?, config?): Promise<ApiResponse<T>>

  // Mutation endpoint (DELETE to /api/cmd/...)
  commandDelete<T>(service, endpoint, config?): Promise<ApiResponse<T>>

  // Aggregator endpoint (POST to /api/aggr/...)
  aggregate<T>(serviceName, endpoint, version, data?, config?): Promise<ApiResponse<T>>
}
```

### Service Definitions

Services are defined in `src/config/services.ts` with typed version info:

```typescript
export const GOODS_SERVICE: ServiceConfig = {
  name: 'goods',
  api: { readVersion: 1, cmdVersion: 1 },
}

export const BOOKINGS_SERVICE: ServiceConfig = {
  name: 'bookings',
  api: { readVersion: 1, cmdVersion: 1 },
}

// Read-only services
export const BOOKINGS_BKG_TASKS_SERVICE: ServiceReadOnlyConfig = {
  name: 'bookings-bkg-tasks',
  api: { readVersion: 1 },
}

// Command-only services
export const MESSAGE_AUTOS_SERVICE: ServiceCmdOnlyConfig = {
  name: 'messageautos',
  api: { cmdVersion: 1 },
}
```

### URL Builder (`src/api/url-builder.ts`)

Type-safe URL construction, ensuring read-only services cannot be used for commands and vice versa:

```typescript
readUrl(service, endpoint) // /api/read/v1/goods/GetList
cmdUrl(service, endpoint) // /api/cmd/v1/goods/Create
aggrUrl(name, endpoint, v) // /api/aggr/v1/auth/Login/Subscriber
```

---

## Auth Service (`src/api/services/auth.ts`)

Authentication-specific API call:

```typescript
export const authApi = {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResult>> {
    return gatewayService.aggregate<LoginResult>('auth', 'Login/Subscriber', 1, credentials, {
      skipAuth: true,
      skipAuthRedirect: true,
      params: { culture: 'ko-KR', 'ui-culture': 'ko-KR' },
    })
  },
}
```

Token refresh is handled separately in `tokenRefresh.ts` using raw axios to avoid circular dependencies. See [AUTHENTICATION.md](./AUTHENTICATION.md) for details.

---

## Interceptors

### Request Interceptor (`src/api/interceptors/request.ts`)

- Reads the auth token from **Pinia auth store** (not directly from sessionStorage)
- Attaches `Authorization: Bearer <token>` header
- Skipped when `skipAuth: true` is set in config
- Logs requests in development mode

### Response Interceptor (`src/api/interceptors/response.ts`)

- Detects 401 responses and triggers automatic token refresh
- Retries the original request with new token after successful refresh
- Falls through to `handleErrorStatus` on refresh failure
- Wraps errors in `ApiResponseError` (extends both `Error` and `ApiError`)
- Logs responses in development mode

### Status Handlers (`src/api/interceptors/handlers/statusHandlers.ts`)

| Status | Handler                 | Action                              |
| ------ | ----------------------- | ----------------------------------- |
| 401    | `handle401Unauthorized` | Clear auth store, redirect to login |
| 403    | `handle403Forbidden`    | Log access denied                   |
| 404    | `handle404NotFound`     | Log resource not found              |
| 500+   | `handle500ServerError`  | Log server error                    |

### Token Refresh (`src/api/interceptors/tokenRefresh.ts`)

- Pure API function using raw `axios` (not `apiClient`)
- Handles concurrent 401s with subscriber queue
- Returns `RefreshTokenResult | null`
- Does NOT manage state (store manages state)

---

## Usage Examples

### 1. In Pinia Stores (Recommended)

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/api'
import type { LoginRequest } from '@/types/auth'
import type { ApiResponse } from '@/types/api'

export const useAuthStore = defineStore('auth', () => {
  const loading = ref(false)

  const login = async (
    formData: Pick<LoginRequest, 'userID' | 'password'>,
  ): Promise<ApiResponse<LoginResult>> => {
    loading.value = true
    try {
      const payload: LoginRequest = {
        ...formData,
        solutionId: String(SOLUTION_ID),
      }
      const response = await authApi.login(payload)

      if (response.isOK && response.result) {
        // handle success
      }

      return response
    } finally {
      loading.value = false
    }
  }

  return { loading, login }
})
```

### 2. Domain Service Usage (CQRS Pattern)

```typescript
import { gatewayService } from '@/api'
import { GOODS_SERVICE } from '@/config/services'

// Query (read)
const goods = await gatewayService.read<GoodsList>(GOODS_SERVICE, 'GetList', { page: 1, limit: 10 })

// Mutation (command)
const created = await gatewayService.command<Good>(GOODS_SERVICE, 'Create', {
  name: 'New Item',
  price: 100,
})

// Aggregation (cross-service)
const result = await gatewayService.aggregate<LoginResult>('auth', 'Login/Subscriber', 1, payload)
```

### 3. Handling Responses

```typescript
const response = await gatewayService.read<Product[]>(GOODS_SERVICE, 'GetList')

if (response.isOK && response.result) {
  // Business success
  const products = response.result
} else {
  // Business error
  const errorMsg = response.errorMessages[0]?.errorMessage ?? 'Unknown error'
}
```

---

## Adding New API Services

To add a new domain service (e.g., for clients):

1. Define the service in `src/config/services.ts` (already done for most services).

2. Create `src/api/services/clients.ts`:

```typescript
import { gatewayService } from './base'
import { CLIENTS_SERVICE } from '@/config/services'
import type { ApiResponse } from '@/types/api'

interface ClientList {
  items: Client[]
  totalCount: number
}

export const clientsApi = {
  async getList(params: ClientListParams): Promise<ApiResponse<ClientList>> {
    return gatewayService.read<ClientList>(CLIENTS_SERVICE, 'GetList', params)
  },

  async create(data: CreateClientData): Promise<ApiResponse<Client>> {
    return gatewayService.command<Client>(CLIENTS_SERVICE, 'Create', data)
  },
}
```

3. Export from `src/api/index.ts`:

```typescript
export { clientsApi } from './services/clients'
```

---

## Error Handling

### Two Levels of Errors

1. **Business errors** (`isOK: false`): The HTTP request succeeded but the backend returned an error. Check `response.errorMessages`.

2. **HTTP errors** (4xx, 5xx): Caught by the response interceptor, wrapped in `ApiResponseError`, and rejected. Check `error.status`, `error.message`.

### Handling Pattern

```typescript
try {
  const response = await gatewayService.read<Data>(SERVICE, 'Endpoint', payload)

  if (response.isOK && response.result) {
    // Success
  } else {
    // Business error from backend
    const msg = response.errorMessages[0]?.errorMessage
  }
} catch (error) {
  // HTTP-level error (network, 500, etc.)
  if (error instanceof Error) {
    console.error(error.message)
  }
}
```

---

## Configuration

### Environment

Gateway URL is set in `.env`:

```
VITE_GATEWAY_BASE_URL="https://ahasoft-salon-admin-http-aggregator-staging.azurewebsites.net"
```

Accessed via `src/config/app.ts`:

```typescript
export const appConfig = {
  gatewayBaseUrl: import.meta.env.VITE_GATEWAY_BASE_URL,
}
```

### Service Constants

Static service config in `src/config/services.ts`:

- `SOLUTION_ID = 3002`
- `GATEWAY_VERSION = 1`
- Service definitions with API versions

---

## Best Practices

### Do's

- Use `gatewayService` methods for all API calls
- Use typed interfaces for all request/response payloads
- Use `skipAuth: true` for public endpoints (login, registration)
- Handle both business errors (`isOK: false`) and HTTP errors (`catch`)
- Keep domain API modules thin (delegate to `gatewayService`)

### Don'ts

- Don't use `apiClient` (axios instance) directly in service files
- Don't hardcode API URLs in components or stores
- Don't import `apiClient` in `tokenRefresh.ts` (use raw axios)
- Don't access `sessionStorage` for auth tokens outside the auth store
- Don't use `any` types for API responses
