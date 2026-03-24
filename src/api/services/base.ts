import type { ServiceCmdOnlyConfig, ServiceConfig, ServiceReadOnlyConfig } from '@/config/services'

import type { ApiRequestConfig, ApiResponse } from '@/types/api'

import { apiClient } from '../axios'
import { aggrUrl, cmdUrl, readUrl } from '../url-builder'

// ---- Low-level HTTP transport (internal only) ----

const httpClient = {
  async get<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.get<ApiResponse<T>>(url, config)
    return response.data
  },

  async post<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config)
    return response.data
  },

  async put<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config)
    return response.data
  },

  async delete<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.delete<ApiResponse<T>>(url, config)
    return response.data
  },
}

// ---- CQRS gateway service (public API for all domain services) ----

export const gatewayService = {
  /** POST to a read (query) endpoint */
  async read<T>(
    service: ServiceConfig | ServiceReadOnlyConfig,
    endpoint: string,
    data?: unknown,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return httpClient.post<T>(readUrl(service, endpoint), data, config)
  },

  /** POST to a cmd (mutation) endpoint */
  async command<T>(
    service: ServiceConfig | ServiceCmdOnlyConfig,
    endpoint: string,
    data?: unknown,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return httpClient.post<T>(cmdUrl(service, endpoint), data, config)
  },

  /** PUT to a cmd (mutation) endpoint */
  async commandPut<T>(
    service: ServiceConfig | ServiceCmdOnlyConfig,
    endpoint: string,
    data?: unknown,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return httpClient.put<T>(cmdUrl(service, endpoint), data, config)
  },

  /** DELETE to a cmd (mutation) endpoint */
  async commandDelete<T>(
    service: ServiceConfig | ServiceCmdOnlyConfig,
    endpoint: string,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return httpClient.delete<T>(cmdUrl(service, endpoint), config)
  },

  /** POST to an aggregator endpoint */
  async aggregate<T>(
    serviceName: string,
    endpoint: string,
    version: number,
    data?: unknown,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return httpClient.post<T>(aggrUrl(serviceName, endpoint, version), data, config)
  },
}
