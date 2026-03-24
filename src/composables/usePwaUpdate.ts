import { useRegisterSW } from 'virtual:pwa-register/vue'

interface PwaUpdateState {
  readonly needRefresh: ReturnType<typeof useRegisterSW>['needRefresh']
  readonly offlineReady: ReturnType<typeof useRegisterSW>['offlineReady']
  updateServiceWorker: () => Promise<void>
  close: () => void
}

/**
 * Composable for PWA service worker update management.
 *
 * Wraps the virtual:pwa-register/vue module and provides:
 * - needRefresh: true when a new SW version is available
 * - offlineReady: true when the app is ready to work offline
 * - updateServiceWorker: trigger SW update (skipWaiting + reload)
 * - close: dismiss the update prompt
 *
 * When PWA plugin is disabled (dev/localhost), useRegisterSW returns
 * safe no-op refs that never become true.
 */
export function usePwaUpdate(): PwaUpdateState {
  const { needRefresh, offlineReady, updateServiceWorker } = useRegisterSW({
    onRegisteredSW(_swUrl: string, registration: ServiceWorkerRegistration | undefined) {
      // Check for SW updates periodically (every hour)
      if (registration) {
        setInterval(
          () => {
            void registration.update()
          },
          60 * 60 * 1000,
        )
      }
    },
    onRegisterError(error: Error) {
      console.error('SW registration error:', error)
    },
  })

  const close = (): void => {
    needRefresh.value = false
    offlineReady.value = false
  }

  return {
    needRefresh,
    offlineReady,
    updateServiceWorker,
    close,
  }
}
