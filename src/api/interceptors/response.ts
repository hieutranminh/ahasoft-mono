import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import { useAuthStore } from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'

import { HTTP_STATUS } from '@/constants'

import type { ApiError, ApiRequestConfig } from '@/types/api'

import { handleErrorStatus } from './handlers/statusHandlers'
import { callRefreshTokenApi } from './tokenRefresh'
import { createApiError, extractErrorMessage, logError, logResponse } from './utils/errorUtils'

// Extended config type with retry flag to prevent infinite refresh loops
interface RetryableAxiosConfig extends InternalAxiosRequestConfig {
  _isRetry?: boolean
}

// Custom Error class that wraps ApiError for proper Promise rejection
// This allows catching errors as Error instances while preserving API error data
class ApiResponseError extends Error implements ApiError {
  readonly success = false as const
  readonly errors?: string[]
  readonly status?: number
  readonly code?: string
  readonly details?: unknown

  constructor(apiError: ApiError) {
    super(apiError.message)
    this.name = 'ApiResponseError'
    this.errors = apiError.errors
    this.status = apiError.status
    this.code = apiError.code
    this.details = apiError.details
  }
}

// Export for use in error handling elsewhere
export { ApiResponseError }

// Captured axios instance for retrying requests after token refresh
let axiosInstance: AxiosInstance | null = null

// Decrement global loading counter if this request was tracked
const decrementLoading = (config: InternalAxiosRequestConfig | undefined): void => {
  const customConfig = config as (InternalAxiosRequestConfig & ApiRequestConfig) | undefined
  if (!customConfig?.skipLoading) {
    const loadingStore = useLoadingStore()
    loadingStore.stopLoading()
  }
}

// Success response handler
const handleSuccessResponse = (response: AxiosResponse): AxiosResponse => {
  decrementLoading(response.config)
  logResponse(response.status, response.config.url)
  return response
}

// Error response handler with token refresh support
const handleErrorResponse = async (error: AxiosError): Promise<AxiosResponse | never> => {
  decrementLoading(error.config)

  const status = error.response?.status
  const config = error.config as (RetryableAxiosConfig & ApiRequestConfig) | undefined

  // Attempt token refresh on 401 (unless skipped or already retried)
  if (
    status === HTTP_STATUS.UNAUTHORIZED &&
    config &&
    !config.skipAuthRedirect &&
    !config._isRetry &&
    axiosInstance
  ) {
    const authStore = useAuthStore()

    // Read current tokens from Pinia store (single source of truth)
    if (authStore.token && authStore.refreshToken) {
      const refreshResult = await callRefreshTokenApi(authStore.token, authStore.refreshToken)

      if (refreshResult) {
        // Update Pinia store + sessionStorage via store action
        authStore.updateTokens(refreshResult)

        // Retry the original request with new token
        config.headers.Authorization = `Bearer ${refreshResult.authToken}`
        config._isRetry = true
        return axiosInstance(config)
      }
    }

    // Refresh failed - fall through to handleErrorStatus which clears store + redirects
  }

  // Standard error handling (including redirect on 401 after failed refresh)
  const message = extractErrorMessage(error)

  if (status) {
    handleErrorStatus(status, { message, config })
  }

  const apiError = createApiError(error, message)
  logError(apiError)

  return Promise.reject(new ApiResponseError(apiError))
}

// Main setup function - captures the instance for retry support
export const setupResponseInterceptors = (instance: AxiosInstance): void => {
  axiosInstance = instance
  instance.interceptors.response.use(handleSuccessResponse, handleErrorResponse)
}
