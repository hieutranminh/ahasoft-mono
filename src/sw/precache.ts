/// <reference lib="webworker" />

import { cleanupOutdatedCaches, precacheAndRoute, type PrecacheEntry } from 'workbox-precaching'

// Workbox injects the precache manifest into this variable at build time
declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: (PrecacheEntry | string)[]
}

/**
 * Setup precaching for all build-time assets.
 * Workbox injects the manifest list into self.__WB_MANIFEST at build time.
 * This ensures JS/CSS/HTML are cached immediately on SW install.
 */
export function setupPrecache(): void {
  // Clean up old precache entries from previous SW versions
  cleanupOutdatedCaches()

  // Precache all build output (JS chunks, CSS, index.html, manifest)
  // self.__WB_MANIFEST is replaced by Workbox at build time with the actual file list
  precacheAndRoute(self.__WB_MANIFEST)
}
