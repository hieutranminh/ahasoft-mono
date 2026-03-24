/**
 * Global route names shared across the entire application.
 * Module-specific route names live in their own module (e.g. modules/admin/routes.ts).
 */
export const ROUTE_NAMES = {
  HOME: 'home',

  // Auth routes
  LOGIN: 'login',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',

  // Error routes
  NOT_FOUND: 'not-found',
} as const

export type RouteNameType = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]
