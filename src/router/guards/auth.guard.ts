import type { RouteLocationNormalized } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

import { ROUTE_NAMES } from '@/constants'

/**
 * Authentication guard result
 */
interface AuthGuardResult {
  shouldContinue: boolean
  redirect?: { name: string; query?: Record<string, string> }
}

/**
 * Authentication guard - checks if user is authenticated
 * Returns guard result instead of calling next() directly
 */
export const checkAuth = (to: RouteLocationNormalized): AuthGuardResult => {
  const authStore = useAuthStore()

  // Check if route requires guest (login, forgot password, etc.)
  if (to.meta.requiresGuest === true) {
    // If user is already authenticated, redirect to home
    if (authStore.isAuthenticated) {
      return {
        shouldContinue: false,
        redirect: { name: ROUTE_NAMES.HOME },
      }
    }
    // Allow access to guest routes
    return { shouldContinue: true }
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth === true) {
    // If user is not authenticated, redirect to login
    if (!authStore.isAuthenticated) {
      return {
        shouldContinue: false,
        redirect: {
          name: ROUTE_NAMES.LOGIN,
          query: { redirect: to.fullPath },
        },
      }
    }
  }

  // Continue navigation
  return { shouldContinue: true }
}
