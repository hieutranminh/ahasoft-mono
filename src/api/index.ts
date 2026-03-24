// Gateway service (public API for all domain services)
export { gatewayService } from './services/base'

// Domain API modules
export { adminsApi } from './services/admins'
export { authApi } from './services/auth'

// Domain types re-exported for consumer convenience
export type { LoginRequest, LoginResult, ShopBasicInfo, UserAuthInfo } from '@/types/auth'
export type { ShopEnvironmentSetup, ShopMonthlyFee } from '@/types/shop'

// Core API types
export type { ApiError, ApiErrorMessage, ApiRequestConfig, ApiResponse } from '@/types/api'
