import { useAuthStore } from '@/stores/auth'

import { AUTH_ERROR_MESSAGES, HTTP_STATUS, ROUTE_NAMES } from '@/constants'

import router from '@/router'

import type { ApiRequestConfig } from '@/types/api'

interface StatusHandlerParams {
  message: string
  config?: ApiRequestConfig
}

// Handle 401 Unauthorized
// Token refresh is handled upstream in the response interceptor.
// This handler runs only after refresh has been attempted (or skipped).
export const handle401Unauthorized = ({ config }: StatusHandlerParams): void => {
  const shouldSkipRedirect = config?.skipAuthRedirect === true

  // Early return for explicit skip (e.g., login or refresh request)
  if (shouldSkipRedirect) {
    console.warn(`[API] ${AUTH_ERROR_MESSAGES.AUTHENTICATION_FAILED}`)
    return
  }

  // Clear Pinia store state + sessionStorage, then redirect to login
  const authStore = useAuthStore()
  authStore.clearAuthData()
  void router.push({ name: ROUTE_NAMES.LOGIN })
  console.warn(`[API] ${AUTH_ERROR_MESSAGES.SESSION_EXPIRED}`)
}

// Handle 403 Forbidden
export const handle403Forbidden = ({ message }: StatusHandlerParams): void => {
  if (import.meta.env.DEV) {
    console.error(`[API] ${AUTH_ERROR_MESSAGES.ACCESS_FORBIDDEN}:`, message)
  }
}

// Handle 404 Not Found
export const handle404NotFound = ({ message }: StatusHandlerParams): void => {
  if (import.meta.env.DEV) {
    console.error('[API] Resource not found:', message)
  }
}

// Handle 500+ Server Errors
export const handle500ServerError = ({ message }: StatusHandlerParams): void => {
  if (import.meta.env.DEV) {
    console.error('[API] Server error:', message)
  }
}

// Main status handler dispatcher
export const handleErrorStatus = (status: number, params: StatusHandlerParams): void => {
  switch (status) {
    case HTTP_STATUS.UNAUTHORIZED:
      handle401Unauthorized(params)
      break
    case HTTP_STATUS.FORBIDDEN:
      handle403Forbidden(params)
      break
    case HTTP_STATUS.NOT_FOUND:
      handle404NotFound(params)
      break
    default:
      if (status >= HTTP_STATUS.SERVER_ERROR) {
        handle500ServerError(params)
      }
      break
  }
}
