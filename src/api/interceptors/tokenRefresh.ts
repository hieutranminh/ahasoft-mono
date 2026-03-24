/**
 * Token refresh logic for the response interceptor.
 *
 * Uses raw axios (not apiClient) to avoid circular dependency.
 * This module is a PURE API caller - it does NOT manage state.
 * State (sessionStorage + Pinia) is managed by the auth store.
 *
 * Handles concurrent 401s: only one refresh request is made at a time,
 * subsequent callers wait for the same result via a subscriber queue.
 */
import axios from 'axios'

import { appConfig } from '@/config/app'

import type { ApiResponse } from '@/types/api'
import type { RefreshTokenResult } from '@/types/auth'

let isRefreshing = false
let refreshSubscribers: Array<(result: RefreshTokenResult | null) => void> = []

const notifySubscribers = (result: RefreshTokenResult | null): void => {
  refreshSubscribers.forEach((callback) => callback(result))
  refreshSubscribers = []
}

/**
 * Calls the refresh token API endpoint.
 * Returns the new token data on success, or null on failure.
 *
 * Does NOT read/write sessionStorage or Pinia -- that is the caller's
 * responsibility (via the auth store).
 *
 * Handles concurrency: if a refresh is already in flight, queues and waits.
 */
export const callRefreshTokenApi = async (
  authToken: string,
  refreshToken: string,
): Promise<RefreshTokenResult | null> => {
  // If already refreshing, queue this caller and wait for the result
  if (isRefreshing) {
    return new Promise<RefreshTokenResult | null>((resolve) => {
      refreshSubscribers.push(resolve)
    })
  }

  isRefreshing = true

  try {
    const response = await axios.post<ApiResponse<RefreshTokenResult>>(
      `${appConfig.gatewayBaseUrl}/api/aggr/v1/auth/RefreshToken`,
      { refreshToken, authToken },
      {
        params: { culture: 'ko-KR', 'ui-culture': 'ko-KR' },
        headers: { 'Content-Type': 'application/json' },
      },
    )

    const data = response.data

    if (data.isOK && data.result) {
      notifySubscribers(data.result)
      return data.result
    }

    notifySubscribers(null)
    return null
  } catch {
    notifySubscribers(null)
    return null
  } finally {
    isRefreshing = false
  }
}
