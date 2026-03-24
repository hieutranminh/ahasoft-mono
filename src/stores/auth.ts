import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { AUTH_STORAGE_KEYS } from '@/constants'
import { SOLUTION_ID } from '@/config/services'

import { authApi } from '@/api'

import type { ApiResponse } from '@/types/api'
import type { LoginRequest, LoginResult, RefreshTokenResult, UserAuthInfo } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(sessionStorage.getItem(AUTH_STORAGE_KEYS.TOKEN))
  const refreshToken = ref<string | null>(sessionStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN))
  const userAuthInfo = ref<UserAuthInfo | null>(loadUserAuthInfo())
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  function loadUserAuthInfo(): UserAuthInfo | null {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEYS.USER_AUTH_INFO)
    if (!stored) {
      return null
    }
    try {
      return JSON.parse(stored) as UserAuthInfo
    } catch {
      sessionStorage.removeItem(AUTH_STORAGE_KEYS.USER_AUTH_INFO)
      return null
    }
  }

  const setAuthData = (authInfo: UserAuthInfo): void => {
    token.value = authInfo.authToken
    refreshToken.value = authInfo.refreshToken
    userAuthInfo.value = authInfo

    sessionStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, authInfo.authToken)
    sessionStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, authInfo.refreshToken)
    sessionStorage.setItem(AUTH_STORAGE_KEYS.USER_AUTH_INFO, JSON.stringify(authInfo))
  }

  const clearAuthData = (): void => {
    token.value = null
    refreshToken.value = null
    userAuthInfo.value = null

    sessionStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN)
    sessionStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
    sessionStorage.removeItem(AUTH_STORAGE_KEYS.USER_AUTH_INFO)
  }

  const login = async (
    formData: Pick<LoginRequest, 'userID' | 'password'>,
  ): Promise<ApiResponse<LoginResult>> => {
    loading.value = true

    try {
      const requestPayload: LoginRequest = {
        userID: formData.userID,
        password: formData.password,
        solutionId: String(SOLUTION_ID),
      }

      const response = await authApi.login(requestPayload)

      if (response.isOK && response.result) {
        setAuthData(response.result.userAuthInfo)
      }

      return response
    } finally {
      loading.value = false
    }
  }

  const updateTokens = (result: RefreshTokenResult): void => {
    token.value = result.authToken
    refreshToken.value = result.refreshToken

    sessionStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, result.authToken)
    sessionStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, result.refreshToken)

    // Update token fields within userAuthInfo
    if (userAuthInfo.value) {
      userAuthInfo.value = {
        ...userAuthInfo.value,
        authToken: result.authToken,
        refreshToken: result.refreshToken,
        tokenExpiredDateTimeTS: result.tokenExpiredDateTimeTS,
        refreshTokenExpiredDateTimeTS: result.refreshTokenExpiredDateTimeTS,
      }
      sessionStorage.setItem(AUTH_STORAGE_KEYS.USER_AUTH_INFO, JSON.stringify(userAuthInfo.value))
    }
  }

  const logout = (): void => {
    clearAuthData()
  }

  return {
    // State
    token,
    refreshToken,
    userAuthInfo,
    loading,

    // Computed
    isAuthenticated,

    // Actions
    login,
    logout,
    updateTokens,
    clearAuthData,
  }
})
