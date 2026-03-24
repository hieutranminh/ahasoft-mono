import type { UserRole } from '@/constants'

import 'vue-router'

/**
 * Route meta fields type definition
 * Extends vue-router RouteMeta interface
 */
declare module 'vue-router' {
  interface RouteMeta {
    // Authentication
    requiresAuth?: boolean
    requiresGuest?: boolean

    // Authorization
    requiredRoles?: UserRole[]

    // UI
    title?: string

    // Identifies which feature module this route belongs to
    module?: string
  }
}
