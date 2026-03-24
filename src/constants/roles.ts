/**
 * User role constants for role-based access control
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]
