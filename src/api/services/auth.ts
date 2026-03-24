import type { ApiResponse } from '@/types/api'
import type { LoginRequest, LoginResult } from '@/types/auth'

import { gatewayService } from './base'

export const authApi = {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResult>> {
    return gatewayService.aggregate<LoginResult>('auth', 'Login/Subscriber', 1, credentials, {
      skipAuth: true,
      skipAuthRedirect: true,
      params: { culture: 'ko-KR', 'ui-culture': 'ko-KR' },
    })
  },
}
