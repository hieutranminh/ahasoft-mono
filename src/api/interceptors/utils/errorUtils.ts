import type { AxiosError } from 'axios'

import { AUTH_ERROR_MESSAGES } from '@/constants'

import type { ApiError } from '@/types/api'

// Extract error message from response with multiple fallback strategies
export const extractErrorMessage = (error: AxiosError): string => {
  // Try to extract message from response data
  const responseData = error.response?.data as { message?: string; error?: string } | undefined

  if (responseData?.message) {
    return responseData.message
  }

  if (responseData?.error) {
    return responseData.error
  }

  // Fallback to axios error message
  if (error.message) {
    return error.message
  }

  // Final fallback
  return AUTH_ERROR_MESSAGES.GENERIC_ERROR
}

// Create standardized API error object
export const createApiError = (error: AxiosError, message: string): ApiError => {
  const status = error.response?.status ?? 0
  const finalMessage = message || AUTH_ERROR_MESSAGES.GENERIC_ERROR

  return {
    success: false,
    message: finalMessage,
    errors: [finalMessage],
    status,
    code: error.code,
    details: error.response?.data,
  }
}

// Development logging utilities with structured output
export const logResponse = (status: number, url?: string): void => {
  if (import.meta.env.DEV && url) {
    console.warn(`[API Response] ${status} ${url}`)
  }
}

export const logError = (apiError: ApiError): void => {
  if (import.meta.env.DEV) {
    console.error('[API Error]')
    console.error('Status:', apiError.status)
    console.error('Message:', apiError.message)
    if (apiError.code) {
      console.error('Code:', apiError.code)
    }
    if (apiError.details) {
      console.error('Details:', apiError.details)
    }
  }
}
