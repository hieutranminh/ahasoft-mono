// Main interceptor setup functions
export { setupRequestInterceptors } from './request'
export { setupResponseInterceptors } from './response'

// Status handlers (for testing/reuse)
export {
  handle401Unauthorized,
  handle403Forbidden,
  handle404NotFound,
  handle500ServerError,
  handleErrorStatus,
} from './handlers/statusHandlers'

// Token refresh (for testing/reuse)
export { callRefreshTokenApi } from './tokenRefresh'

// Utility functions (for testing/reuse)
export { createApiError, extractErrorMessage, logError, logResponse } from './utils/errorUtils'
