import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { adminsApi } from '@/api'

import type { ApiResponse } from '@/types/api'
import type { ShopBasicInfo } from '@/types/auth'
import type { ShopEnvironmentSetup, ShopMonthlyFee } from '@/types/shop'

/**
 * Extract result from API response or return null if the call failed.
 */
function extractResult<T>(response: PromiseSettledResult<ApiResponse<T>>): T | null {
  if (response.status === 'rejected') {
    return null
  }
  const { value } = response
  if (!value.isOK || !value.result) {
    return null
  }
  return value.result
}

export const useShopStore = defineStore('shop', () => {
  // State
  const shopBasic = ref<ShopBasicInfo | null>(null)
  const shopEnvironmentSetup = ref<ShopEnvironmentSetup | null>(null)
  const shopMonthlyFee = ref<ShopMonthlyFee | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isInitialized = computed<boolean>(
    () =>
      shopBasic.value !== null &&
      shopEnvironmentSetup.value !== null &&
      shopMonthlyFee.value !== null,
  )

  // Actions

  /**
   * Fetch all shop configuration data in parallel.
   * Each API is independent -- a single failure does not discard successful results.
   * Called on MainLayout mount (covers both login navigation and F5 refresh).
   */
  async function initialize(shopId: number, countryCode: string): Promise<void> {
    if (loading.value) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const [basicResult, setupResult, feeResult] = await Promise.allSettled([
        adminsApi.getShopBasic(shopId),
        adminsApi.getShopEnvironmentSetup(shopId, countryCode),
        adminsApi.getShopMonthlyFee(shopId),
      ])

      shopBasic.value = extractResult(basicResult)
      shopEnvironmentSetup.value = extractResult(setupResult)
      shopMonthlyFee.value = extractResult(feeResult)

      if (!isInitialized.value) {
        error.value = 'One or more shop configuration APIs failed'
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to initialize shop data'
      error.value = message
    } finally {
      loading.value = false
    }
  }

  function $reset(): void {
    shopBasic.value = null
    shopEnvironmentSetup.value = null
    shopMonthlyFee.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    shopBasic,
    shopEnvironmentSetup,
    shopMonthlyFee,
    loading,
    error,

    // Getters
    isInitialized,

    // Actions
    initialize,
    $reset,
  }
})
