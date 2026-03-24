import { type AppEnvironment, type BuildConfig, envConfig, type LogLevel } from './env'

export interface AppConfig {
  readonly name: string
  readonly version: string
  readonly environment: AppEnvironment
  readonly isDevelopment: boolean
  readonly isProduction: boolean
  readonly isLocalhost: boolean
  readonly isStaging: boolean
  readonly gatewayBaseUrl: string
  readonly apiTimeout: number
  readonly enableDevTools: boolean
  readonly enableMockApi: boolean
  readonly enableDebugMode: boolean
  readonly logLevel: LogLevel
  readonly sentryDsn: string | null
  readonly gaTrackingId: string | null
  readonly buildTime: string
  readonly buildMode: string
  readonly buildConfig: BuildConfig

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

export const appConfig: AppConfig = {
  name: envConfig.appName,
  version: envConfig.appVersion,
  environment: envConfig.appEnv,
  isDevelopment: envConfig.isDevelopment,
  isProduction: envConfig.isProduction,
  isLocalhost: envConfig.isLocalhost,
  isStaging: envConfig.isStaging,
  gatewayBaseUrl: envConfig.gatewayBaseUrl,
  apiTimeout: envConfig.apiTimeout,
  enableDevTools: envConfig.enableDevTools,
  enableMockApi: envConfig.enableMockApi,
  enableDebugMode: envConfig.enableDebugMode,
  logLevel: envConfig.logLevel,
  sentryDsn: envConfig.sentryDsn,
  gaTrackingId: envConfig.gaTrackingId,
  buildTime: envConfig.buildTime,
  buildMode: envConfig.buildMode,
  buildConfig: envConfig.buildConfig,
  notificationUrl: envConfig.notificationUrl,
  loginUrlDefault: envConfig.loginUrlDefault,
  loginUrlKr: envConfig.loginUrlKr,
  paramMobileApp: envConfig.paramMobileApp,
  paramVersion: envConfig.paramVersion,
  azureStorageBoardUrl: envConfig.azureStorageBoardUrl,
  azureStorageMessageUrl: envConfig.azureStorageMessageUrl,
  azureStorageClientUrl: envConfig.azureStorageClientUrl,
  azureStorageAdminsUrl: envConfig.azureStorageAdminsUrl,
  iamportKey: envConfig.iamportKey,
  arsMidId: envConfig.arsMidId,
  enablePwa: envConfig.enablePwa,
}
