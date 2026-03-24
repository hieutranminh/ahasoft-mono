import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', () => {
  // Counter tracks concurrent API requests (not a boolean, to handle overlapping calls)
  const activeRequests = ref(0)

  const isLoading = computed<boolean>(() => activeRequests.value > 0)

  function startLoading(): void {
    activeRequests.value++
  }

  function stopLoading(): void {
    if (activeRequests.value > 0) {
      activeRequests.value--
    }
  }

  function $reset(): void {
    activeRequests.value = 0
  }

  return {
    // State
    activeRequests,

    // Getters
    isLoading,

    // Actions
    startLoading,
    stopLoading,
    $reset,
  }
})
