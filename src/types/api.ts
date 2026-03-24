// API error message from backend response
export interface ApiErrorMessage {
  errorCode: string
  errorMessage: string
  errorValues: string[]
}

// Base API response structure (matches backend gateway format)
export interface ApiResponse<T = unknown> {
  result: T | null
  errorMessages: ApiErrorMessage[]
  isOK: boolean
}

// HTTP-level error structure (used by response interceptor for axios errors)
export interface ApiError {
  success: false
  message: string
  errors?: string[]
  status?: number
  code?: string
  details?: unknown
}

// Request configuration for API calls
export interface ApiRequestConfig {
  headers?: Record<string, string>
  params?: Record<string, unknown>
  timeout?: number
  withCredentials?: boolean
  skipAuth?: boolean
  skipAuthRedirect?: boolean
  // When true, the global loading spinner will NOT be shown for this request.
  // Useful for pages that use skeleton loading or background polling.
  skipLoading?: boolean
}
