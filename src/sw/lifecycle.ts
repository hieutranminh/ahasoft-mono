/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core'

declare const self: ServiceWorkerGlobalScope

/**
 * Setup SW lifecycle events.
 *
 * - skipWaiting: When app sends 'SKIP_WAITING' message, activate new SW immediately
 * - clientsClaim: After activation, take control of all open tabs without reload
 * - This enables the "prompt user to update" flow
 */
export function setupLifecycle(): void {
  // Listen for skip waiting message from the app
  // This is triggered when user clicks "Update" in the PWA update prompt
  self.addEventListener('message', (event: ExtendableMessageEvent) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      void self.skipWaiting()
    }
  })

  // Take control of all clients as soon as SW activates
  clientsClaim()
}
