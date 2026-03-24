import type { Router } from 'vue-router'

import { checkAuth } from './auth.guard'
import { checkPermission } from './permission.guard'

/**
 * Combine all guards - runs them in sequence using return-based pattern
 * First checks authentication, then checks permissions
 */
export const setupRouterGuards = (router: Router): void => {
  router.beforeEach((to) => {
    // Step 1: Authentication check
    const authResult = checkAuth(to)

    if (!authResult.shouldContinue) {
      return authResult.redirect ?? false
    }

    // Step 2: Permission check (only if auth guard passed)
    const permissionResult = checkPermission(to)

    if (!permissionResult.shouldContinue) {
      return permissionResult.redirect ?? false
    }

    // Both guards passed, continue navigation
    return true
  })
}
