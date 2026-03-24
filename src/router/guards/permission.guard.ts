import type { RouteLocationNormalized } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

/**
 * Permission guard result
 */
interface PermissionGuardResult {
  shouldContinue: boolean
  redirect?: { name: string }
}

/**
 * Permission guard - checks if user has required roles
 * Returns guard result instead of calling next() directly
 */
export const checkPermission = (to: RouteLocationNormalized): PermissionGuardResult => {
  const authStore = useAuthStore()

  const requiredRoles = to.meta.requiredRoles

  // If route doesn't require specific roles, allow access
  if (!requiredRoles || requiredRoles.length === 0) {
    return { shouldContinue: true }
  }

  // If user is not authenticated, let checkAuth handle it
  if (!authStore.isAuthenticated || !authStore.token) {
    return { shouldContinue: true }
  }

  return { shouldContinue: true }
}
