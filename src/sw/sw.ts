/// <reference lib="webworker" />

/**
 * Service Worker Entry Point
 *
 * This is the main SW file that Workbox injects the precache manifest into.
 * Architecture is modular: each concern is in its own file.
 *
 * To add new SW features (push notifications, background sync, etc.),
 * create a handler in ./handlers/ and import it here.
 * No existing code needs to change.
 */

import { setupLifecycle } from './lifecycle'
import { setupPrecache } from './precache'
import { setupRouting } from './routing'

// ── Core Setup ──────────────────────────────────
// Order matters: lifecycle first, then precache, then routing
setupLifecycle()
setupPrecache()
setupRouting()

// ── Future Handlers ─────────────────────────────
// Uncomment and import when needed:
// import { registerPushHandler } from './handlers/push.handler'
// import { registerSyncHandler } from './handlers/sync.handler'
// import { registerMessageHandler } from './handlers/message.handler'
// registerPushHandler()
// registerSyncHandler()
// registerMessageHandler()
