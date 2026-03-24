import { computed, onMounted, onUnmounted, reactive, readonly, ref } from 'vue'

import { type AppConfig, appConfig } from '@/config/app'
import type { AppEnvironment, BuildConfig, LogLevel } from '@/config/env'

// Environment display information
export interface EnvironmentDisplayInfo {
  label: string
  color: string
  icon: string
  severity: 'success' | 'info' | 'warn' | 'danger' | 'secondary'
}

// Full environment info interface
export interface EnvironmentInfo {
  // Application
  appName: string
  appVersion: string
  environment: AppEnvironment
  buildTime: string
  buildMode: string

  // Gateway & API Configuration
  gatewayBaseUrl: string
  apiTimeout: number

  // Notification Configuration
  notificationUrl: string | null

  // Login URLs
  loginUrlDefault: string | null
  loginUrlKr: string | null

  // Mobile App Parameters
  paramMobileApp: string | null
  paramVersion: string | null

  // Azure Storage URLs
  azureStorageBoardUrl: string | null
  azureStorageMessageUrl: string | null
  azureStorageClientUrl: string | null
  azureStorageAdminsUrl: string | null

  // Third-party Keys
  hasIamportKey: boolean
  hasArsMidId: boolean

  // Feature Flags
  enableDevTools: boolean
  enableMockApi: boolean
  enableDebugMode: boolean

  // Logging
  logLevel: LogLevel

  // Environment Flags
  isDevelopment: boolean
  isProduction: boolean
  isLocalhost: boolean
  isStaging: boolean

  // Analytics & Monitoring
  hasSentryDsn: boolean
  hasGaTrackingId: boolean

  // Build Configuration
  buildConfig: BuildConfig

  // PWA Configuration
  enablePwa: boolean
}

// Environment display configurations
const ENVIRONMENT_DISPLAY: Record<AppEnvironment, EnvironmentDisplayInfo> = {
  localhost: {
    label: 'Localhost',
    color: '#8b5cf6',
    icon: 'pi pi-desktop',
    severity: 'secondary',
  },
  development: {
    label: 'Development',
    color: '#3b82f6',
    icon: 'pi pi-code',
    severity: 'info',
  },
  staging: {
    label: 'Staging',
    color: '#f59e0b',
    icon: 'pi pi-server',
    severity: 'warn',
  },
  production: {
    label: 'Production',
    color: '#22c55e',
    icon: 'pi pi-cloud',
    severity: 'success',
  },
}

// Log level display configurations
const LOG_LEVEL_DISPLAY: Record<
  LogLevel,
  { label: string; severity: 'success' | 'info' | 'warn' | 'danger' }
> = {
  debug: { label: 'Debug', severity: 'info' },
  info: { label: 'Info', severity: 'success' },
  warn: { label: 'Warning', severity: 'warn' },
  error: { label: 'Error', severity: 'danger' },
}

/**
 * Create environment info from app config
 */
function createEnvironmentInfo(config: AppConfig): EnvironmentInfo {
  return {
    // Application
    appName: config.name,
    appVersion: config.version,
    environment: config.environment,
    buildTime: config.buildTime,
    buildMode: config.buildMode,

    // Gateway & API Configuration
    gatewayBaseUrl: config.gatewayBaseUrl,
    apiTimeout: config.apiTimeout,

    // Notification Configuration
    notificationUrl: config.notificationUrl,

    // Login URLs
    loginUrlDefault: config.loginUrlDefault,
    loginUrlKr: config.loginUrlKr,

    // Mobile App Parameters
    paramMobileApp: config.paramMobileApp,
    paramVersion: config.paramVersion,

    // Azure Storage URLs
    azureStorageBoardUrl: config.azureStorageBoardUrl,
    azureStorageMessageUrl: config.azureStorageMessageUrl,
    azureStorageClientUrl: config.azureStorageClientUrl,
    azureStorageAdminsUrl: config.azureStorageAdminsUrl,

    // Third-party Keys (boolean flags only, do not expose raw key values)
    hasIamportKey: config.iamportKey !== null,
    hasArsMidId: config.arsMidId !== null,

    // Feature Flags
    enableDevTools: config.enableDevTools,
    enableMockApi: config.enableMockApi,
    enableDebugMode: config.enableDebugMode,

    // Logging
    logLevel: config.logLevel,

    // Environment Flags
    isDevelopment: config.isDevelopment,
    isProduction: config.isProduction,
    isLocalhost: config.isLocalhost,
    isStaging: config.isStaging,

    // Analytics & Monitoring
    hasSentryDsn: config.sentryDsn !== null,
    hasGaTrackingId: config.gaTrackingId !== null,

    // Build Configuration
    buildConfig: config.buildConfig,

    // PWA Configuration
    enablePwa: config.enablePwa,
  }
}

/**
 * Composable for accessing environment configuration information
 * Provides reactive access to environment settings and helper methods
 */
export function useEnvironmentInfo() {
  // Reactive environment info
  const info = reactive<EnvironmentInfo>(createEnvironmentInfo(appConfig))

  // Environment display info
  const environmentDisplay = computed((): EnvironmentDisplayInfo => {
    return ENVIRONMENT_DISPLAY[info.environment]
  })

  // Log level display info
  const logLevelDisplay = computed(() => {
    return LOG_LEVEL_DISPLAY[info.logLevel]
  })

  // Helper methods
  const isEnvironment = (env: AppEnvironment): boolean => {
    return info.environment === env
  }

  const isNotEnvironment = (env: AppEnvironment): boolean => {
    return info.environment !== env
  }

  const isLocalhostOrDev = (): boolean => {
    return info.isLocalhost || info.isDevelopment
  }

  const isStagingOrProd = (): boolean => {
    return info.isStaging || info.isProduction
  }

  const hasAnalytics = (): boolean => {
    return info.hasSentryDsn || info.hasGaTrackingId
  }

  const getApiTimeoutSeconds = (): number => {
    return info.apiTimeout / 1000
  }

  const formatBuildTime = (): string => {
    try {
      const date = new Date(info.buildTime)
      return date.toLocaleString()
    } catch {
      return info.buildTime
    }
  }

  // Get all feature flags as array for display
  const getFeatureFlags = (): Array<{ name: string; enabled: boolean }> => {
    return [
      { name: 'DevTools', enabled: info.enableDevTools },
      { name: 'Mock API', enabled: info.enableMockApi },
      { name: 'Debug Mode', enabled: info.enableDebugMode },
    ]
  }

  // Get Azure Storage URLs as array for display
  const getAzureStorageUrls = (): Array<{ name: string; url: string | null }> => {
    return [
      { name: 'Boards', url: info.azureStorageBoardUrl },
      { name: 'Messages', url: info.azureStorageMessageUrl },
      { name: 'Clients', url: info.azureStorageClientUrl },
      { name: 'Admins', url: info.azureStorageAdminsUrl },
    ]
  }

  // Get third-party integration status as array for display
  const getThirdPartyStatus = (): Array<{ name: string; configured: boolean }> => {
    return [
      { name: 'Iamport (Payment)', configured: info.hasIamportKey },
      { name: 'ARS MID', configured: info.hasArsMidId },
      { name: 'Sentry', configured: info.hasSentryDsn },
      { name: 'Google Analytics', configured: info.hasGaTrackingId },
    ]
  }

  // Get build configuration as array for display
  const getBuildSettings = (): Array<{ name: string; value: string; enabled: boolean }> => {
    const sourcemapValue =
      info.buildConfig.sourcemap === 'hidden'
        ? 'Hidden'
        : info.buildConfig.sourcemap
          ? 'Enabled'
          : 'Disabled'

    return [
      {
        name: 'Source Map',
        value: sourcemapValue,
        enabled: info.buildConfig.sourcemap !== false,
      },
      {
        name: 'Minify',
        value: info.buildConfig.minify ? 'Enabled' : 'Disabled',
        enabled: info.buildConfig.minify,
      },
      {
        name: 'CSS Source Map',
        value: info.buildConfig.cssSourcemap ? 'Enabled' : 'Disabled',
        enabled: info.buildConfig.cssSourcemap,
      },
    ]
  }

  // PWA runtime status (live detection from browser APIs)
  interface PwaRuntimeStatus {
    swSupported: boolean
    swController: string | null
    swState: string | null
    cacheNames: string[]
    isStandalone: boolean
  }

  const pwaStatus = ref<PwaRuntimeStatus>({
    swSupported: false,
    swController: null,
    swState: null,
    cacheNames: [],
    isStandalone: false,
  })

  let swStatusInterval: ReturnType<typeof setInterval> | undefined

  const refreshPwaStatus = async (): Promise<void> => {
    const swSupported = 'serviceWorker' in navigator
    let swController: string | null = null
    let swState: string | null = null
    let cacheNames: string[] = []
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator &&
        (navigator as unknown as { standalone: boolean }).standalone === true)

    if (swSupported) {
      const controller = navigator.serviceWorker.controller
      if (controller) {
        swController = controller.scriptURL
        swState = controller.state
      }

      try {
        cacheNames = await caches.keys()
      } catch {
        cacheNames = []
      }
    }

    pwaStatus.value = { swSupported, swController, swState, cacheNames, isStandalone }
  }

  onMounted(() => {
    void refreshPwaStatus()
    // Poll every 5 seconds to catch SW state changes
    swStatusInterval = setInterval(() => {
      void refreshPwaStatus()
    }, 5000)
  })

  onUnmounted(() => {
    if (swStatusInterval) {
      clearInterval(swStatusInterval)
    }
  })

  // Get environment comparison data for display
  const getEnvironmentComparison = (): Array<{
    env: AppEnvironment
    isCurrent: boolean
    display: EnvironmentDisplayInfo
  }> => {
    const environments: AppEnvironment[] = ['localhost', 'development', 'staging', 'production']
    return environments.map((env) => ({
      env,
      isCurrent: env === info.environment,
      display: ENVIRONMENT_DISPLAY[env],
    }))
  }

  return {
    // Reactive state
    info: readonly(info),
    environmentDisplay,
    logLevelDisplay,

    // Helper methods
    isEnvironment,
    isNotEnvironment,
    isLocalhostOrDev,
    isStagingOrProd,
    hasAnalytics,
    getApiTimeoutSeconds,
    formatBuildTime,
    getFeatureFlags,
    getBuildSettings,
    getEnvironmentComparison,
    getAzureStorageUrls,
    getThirdPartyStatus,
    pwaStatus,
    refreshPwaStatus,
  }
}
