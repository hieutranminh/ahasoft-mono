import { BOOKINGS_SERVICE } from '@/config/services'

import { apiClient } from '@/api/axios'
import { cmdUrl } from '@/api/url-builder'

import type { ApiRequestConfig } from '@/types/api'

import type { GetSignalRTokenRequest } from '../types/signalr'

export const signalrApi = {
  /**
   * Obtain a JWT access token for the Azure SignalR Service hub.
   * The token is used in the HubConnection's accessTokenFactory.
   *
   * NOTE: This endpoint returns a raw JWT string, not the standard
   * ApiResponse<T> wrapper. We use apiClient directly instead of
   * gatewayService to handle this non-standard response format.
   *
   * Backend endpoint: /api/cmd/v1/bookings/Booking/getToken
   */
  async getToken(request: GetSignalRTokenRequest): Promise<string> {
    const url = cmdUrl(BOOKINGS_SERVICE, 'Booking/getToken')

    const response = await apiClient.post<string>(url, request, {
      skipLoading: true,
    } as ApiRequestConfig)

    const token =
      typeof response.data === 'string'
        ? response.data.replace(/^"|"$/g, '')
        : String(response.data)

    if (!token) {
      throw new Error('Failed to obtain SignalR access token: empty response')
    }

    return token
  },
}
