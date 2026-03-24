/**
 * Environment configuration with validation
 * Ensures all required environment variables are present
 */

export type AppEnvironment = 'localhost' | 'development' | 'staging' | 'production'
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface BuildConfig {
  readonly sourcemap: boolean | 'hidden'
  readonly minify: boolean
  readonly cssSourcemap: boolean
}

// Declare global build config injected by Vite
declare const __BUILD_CONFIG__: BuildConfig

export interface EnvConfig {
  readonly appName: string
  readonly appVersion: string
  readonly appEnv: AppEnvironment
  readonly apiTimeout: number
  readonly enableDevTools: boolean
  readonly enableMockApi: boolean
  readonly enableDebugMode: boolean
  readonly logLevel: LogLevel
  readonly sentryDsn: string | null
  readonly gaTrackingId: string | null
  readonly isDevelopment: boolean
  readonly isProduction: boolean
  readonly isLocalhost: boolean
  readonly isStaging: boolean
  readonly buildTime: string
  readonly buildMode: string
  readonly buildConfig: BuildConfig

  // Gateway Configuration
  readonly gatewayBaseUrl: string

  // Notification Configuration
  readonly notificationUrl: string | null

  // Login URLs
  readonly loginUrlDefault: string | null
  readonly loginUrlKr: string | null

  // Mobile App Parameters
  readonly paramMobileApp: string | null
  readonly paramVersion: string | null

  // Azure Storage URLs
  readonly azureStorageBoardUrl: string | null
  readonly azureStorageMessageUrl: string | null
  readonly azureStorageClientUrl: string | null
  readonly azureStorageAdminsUrl: string | null

  // Third-party Keys
  readonly iamportKey: string | null
  readonly arsMidId: string | null

  // PWA Configuration
  readonly enablePwa: boolean
}

/**
 * Validates environment value against allowed values
 */
const validateAppEnv = (value: string | undefined): AppEnvironment => {
  const validEnvs: AppEnvironment[] = ['localhost', 'development', 'staging', 'production']
  if (value && validEnvs.includes(value as AppEnvironment)) {
    return value as AppEnvironment
  }
  return import.meta.env.DEV ? 'localhost' : 'production'
}

/**
 * Validates log level value against allowed values
 */
const validateLogLevel = (value: string | undefined): LogLevel => {
  const validLevels: LogLevel[] = ['debug', 'info', 'warn', 'error']
  if (value && validLevels.includes(value as LogLevel)) {
    return value as LogLevel
  }
  return import.meta.env.DEV ? 'debug' : 'error'
}

/**
 * Validates and extracts environment variables
 */
// eslint-disable-next-line complexity
const getEnvConfig = (): EnvConfig => {
  // Application Configuration
  const appName = import.meta.env.VITE_APP_NAME
  const appVersion = import.meta.env.VITE_APP_VERSION
  const appEnv = validateAppEnv(import.meta.env.VITE_APP_ENV)
  const apiTimeout = parseInt(import.meta.env.VITE_API_TIMEOUT ?? '30000', 10)
  const enableDevTools = import.meta.env.VITE_ENABLE_DEVTOOLS === 'true'
  const enableMockApi = import.meta.env.VITE_ENABLE_MOCK_API === 'true'
  const enableDebugMode = import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true'
  const logLevel = validateLogLevel(import.meta.env.VITE_LOG_LEVEL)
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN ?? null
  const gaTrackingId = import.meta.env.VITE_GA_TRACKING_ID ?? null

  // Gateway Configuration
  const gatewayBaseUrl = import.meta.env.VITE_GATEWAY_BASE_URL

  // Notification Configuration
  const notificationUrl = import.meta.env.VITE_NOTIFICATION_URL ?? null

  // Login URLs
  const loginUrlDefault = import.meta.env.VITE_LOGIN_URL_DEFAULT ?? null
  const loginUrlKr = import.meta.env.VITE_LOGIN_URL_KR ?? null

  // Mobile App Parameters
  const paramMobileApp = import.meta.env.VITE_PARAM_MOBILE_APP ?? null
  const paramVersion = import.meta.env.VITE_PARAM_VERSION ?? null

  // Azure Storage URLs
  const azureStorageBoardUrl = import.meta.env.VITE_AZURE_STORAGE_BOARD_URL ?? null
  const azureStorageMessageUrl = import.meta.env.VITE_AZURE_STORAGE_MESSAGE_URL ?? null
  const azureStorageClientUrl = import.meta.env.VITE_AZURE_STORAGE_CLIENT_URL ?? null
  const azureStorageAdminsUrl = import.meta.env.VITE_AZURE_STORAGE_ADMINS_URL ?? null

  // Third-party Keys
  const iamportKey = import.meta.env.VITE_IAMPORT_KEY ?? null
  const arsMidId = import.meta.env.VITE_ARS_MID_ID ?? null

  // PWA Configuration
  const enablePwa = import.meta.env.VITE_ENABLE_PWA === 'true'

  // Validate required environment variables
  if (!appName) {
    throw new Error('VITE_APP_NAME is required but not set')
  }

  if (!appVersion) {
    throw new Error('VITE_APP_VERSION is required but not set')
  }

  if (!gatewayBaseUrl) {
    throw new Error('VITE_GATEWAY_BASE_URL is required but not set')
  }

  return {
    appName,
    appVersion,
    appEnv,
    apiTimeout,
    enableDevTools: enableDevTools || import.meta.env.DEV,
    enableMockApi,
    enableDebugMode: enableDebugMode || import.meta.env.DEV,
    logLevel,
    sentryDsn,
    gaTrackingId,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    isLocalhost: appEnv === 'localhost',
    isStaging: appEnv === 'staging',
    buildTime: new Date().toISOString(),
    buildMode: import.meta.env.MODE,
    buildConfig: __BUILD_CONFIG__,
    gatewayBaseUrl,
    notificationUrl,
    loginUrlDefault,
    loginUrlKr,
    paramMobileApp,
    paramVersion,
    azureStorageBoardUrl,
    azureStorageMessageUrl,
    azureStorageClientUrl,
    azureStorageAdminsUrl,
    iamportKey,
    arsMidId,
    enablePwa,
  }
}

export const envConfig = getEnvConfig()
