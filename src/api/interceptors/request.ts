import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

import { useAuthStore } from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'

import type { ApiRequestConfig } from '@/types/api'

export const setupRequestInterceptors = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const customConfig = config as InternalAxiosRequestConfig & ApiRequestConfig

      // Track global loading state unless explicitly skipped
      if (!customConfig.skipLoading) {
        const loadingStore = useLoadingStore()
        loadingStore.startLoading()
      }

      // Add authentication token unless explicitly skipped
      if (!customConfig.skipAuth) {
        const authStore = useAuthStore()
        if (authStore.token) {
          config.headers.Authorization = `Bearer ${authStore.token}`
        }
      }

      if (import.meta.env.DEV) {
        console.warn(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
      }

      return config
    },
    (error: unknown) => {
      // Decrement loading counter on request error
      const loadingStore = useLoadingStore()
      loadingStore.stopLoading()

      console.error('[API Request Error]', error)
      if (error instanceof Error) {
        return Promise.reject(error)
      }
      return Promise.reject(new Error(String(error)))
    },
  )
}
