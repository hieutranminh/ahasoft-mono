/// <reference lib="webworker" />

import type { RouteMatchCallbackOptions } from 'workbox-core/types.js'
import { ExpirationPlugin } from 'workbox-expiration'
import { createHandlerBoundToURL } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies'

/**
 * Setup runtime caching strategies for different request types.
 *
 * Strategy overview:
 * - API requests (/api/*): NETWORK-ONLY (never cache auth-protected data)
 * - Google Fonts: STALE-WHILE-REVALIDATE (fast display, update in background)
 * - Static images: CACHE-FIRST (rarely change, save bandwidth)
 * - Navigation: Serve precached index.html for SPA history mode routing
 */
export function setupRouting(): void {
  // ──────────────────────────────────────────────
  // 1. API Requests - NETWORK ONLY (CRITICAL)
  // Never cache API responses:
  // - Contains auth tokens and sensitive user data
  // - POST/PUT/DELETE must always hit server
  // - Token refresh must bypass SW completely
  // ──────────────────────────────────────────────
  registerRoute(
    ({ url }: RouteMatchCallbackOptions) => url.pathname.startsWith('/api'),
    new NetworkOnly(),
  )

  // ──────────────────────────────────────────────
  // 2. Google Fonts stylesheets - STALE WHILE REVALIDATE
  // Serve cached version instantly, update in background
  // ──────────────────────────────────────────────
  registerRoute(
    ({ url }: RouteMatchCallbackOptions) =>
      url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
    new StaleWhileRevalidate({
      cacheName: 'google-fonts',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
        }),
      ],
    }),
  )

  // ──────────────────────────────────────────────
  // 3. Static images - CACHE FIRST
  // Images rarely change; serve from cache, fallback to network
  // ──────────────────────────────────────────────
  registerRoute(
    ({ request }: RouteMatchCallbackOptions) => request.destination === 'image',
    new CacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        }),
      ],
    }),
  )

  // ──────────────────────────────────────────────
  // 4. SPA Navigation Fallback
  // For HTML5 History Mode: all navigation requests serve index.html
  // Denylist ensures /api/* requests are NOT intercepted
  // ──────────────────────────────────────────────
  const navigationHandler = createHandlerBoundToURL('/index.html')
  const navigationRoute = new NavigationRoute(navigationHandler, {
    denylist: [/^\/api\//],
  })
  registerRoute(navigationRoute)
}
