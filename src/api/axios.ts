import axios from 'axios'

import { appConfig } from '@/config/app'

import { setupRequestInterceptors } from './interceptors/request'
import { setupResponseInterceptors } from './interceptors/response'

const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: appConfig.gatewayBaseUrl,
    timeout: appConfig.apiTimeout,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  setupRequestInterceptors(instance)
  setupResponseInterceptors(instance)

  return instance
}

export const apiClient = createAxiosInstance()
