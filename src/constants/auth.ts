// Authentication session storage keys
export const AUTH_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_AUTH_INFO: 'user_auth_info',
} as const

// Error messages
export const AUTH_ERROR_MESSAGES = {
  SESSION_EXPIRED: 'Session expired, redirected to login',
  AUTHENTICATION_FAILED: 'Authentication failed (redirect skipped)',
  AUTHENTICATION_REQUIRED: 'Authentication required',
  ACCESS_FORBIDDEN: 'Access forbidden',
  GENERIC_ERROR: 'An unexpected error occurred',
} as const

// HTTP status codes we handle
export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const
