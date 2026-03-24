import { onMounted, onUnmounted, reactive, readonly, ref } from 'vue'

// Network connection info interface
export interface NetworkConnectionInfo {
  effectiveType: string | null
  downlink: number | null
  rtt: number | null
  saveData: boolean
}

// Navigator info interface
export interface NavigatorInfo {
  // User Agent & Platform
  userAgent: string
  platform: string
  vendor: string

  // Language
  language: string
  languages: readonly string[]

  // Device capabilities
  hardwareConcurrency: number
  deviceMemory: number | null
  maxTouchPoints: number

  // Features
  cookieEnabled: boolean
  pdfViewerEnabled: boolean
  webdriver: boolean

  // Network
  onLine: boolean
  connection: NetworkConnectionInfo
}

// Extended connection type for Network Information API
interface NetworkInformation extends EventTarget {
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
  addEventListener(type: string, listener: EventListener): void
  removeEventListener(type: string, listener: EventListener): void
}

// Extended navigator type
interface ExtendedNavigator extends Navigator {
  deviceMemory?: number
  connection?: NetworkInformation
}

/**
 * Get network connection info from Navigator
 */
function getConnectionInfo(nav: ExtendedNavigator): NetworkConnectionInfo {
  const connection = nav.connection
  return {
    effectiveType: connection?.effectiveType ?? null,
    downlink: connection?.downlink ?? null,
    rtt: connection?.rtt ?? null,
    saveData: connection?.saveData ?? false,
  }
}

/**
 * Create initial navigator info snapshot
 */
function createNavigatorInfo(nav: ExtendedNavigator): NavigatorInfo {
  return {
    // User Agent & Platform
    userAgent: nav.userAgent,
    platform: nav.platform,
    vendor: nav.vendor,

    // Language
    language: nav.language,
    languages: nav.languages,

    // Device capabilities
    hardwareConcurrency: nav.hardwareConcurrency,
    deviceMemory: nav.deviceMemory ?? null,
    maxTouchPoints: nav.maxTouchPoints,

    // Features
    cookieEnabled: nav.cookieEnabled,
    pdfViewerEnabled: nav.pdfViewerEnabled ?? false,
    webdriver: nav.webdriver,

    // Network
    onLine: nav.onLine,
    connection: getConnectionInfo(nav),
  }
}

/**
 * Composable for accessing and tracking Navigator information
 * Provides reactive updates for online status and network changes
 */
export function useNavigatorInfo() {
  const nav = navigator as ExtendedNavigator

  // Reactive navigator info
  const info = reactive<NavigatorInfo>(createNavigatorInfo(nav))

  // Loading state for async operations
  const isLoading = ref(false)

  // Event handlers
  const handleOnlineChange = (): void => {
    info.onLine = nav.onLine
  }

  const handleConnectionChange = (): void => {
    const connectionInfo = getConnectionInfo(nav)
    info.connection.effectiveType = connectionInfo.effectiveType
    info.connection.downlink = connectionInfo.downlink
    info.connection.rtt = connectionInfo.rtt
    info.connection.saveData = connectionInfo.saveData
  }

  const handleLanguageChange = (): void => {
    info.language = nav.language
    info.languages = nav.languages
  }

  // Computed helpers
  const isTouchDevice = (): boolean => {
    return info.maxTouchPoints > 0
  }

  const isMobile = (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(info.userAgent)
  }

  const getBrowserName = (): string => {
    const ua = info.userAgent
    if (ua.includes('Firefox')) return 'Firefox'
    if (ua.includes('Edg')) return 'Edge'
    if (ua.includes('Chrome')) return 'Chrome'
    if (ua.includes('Safari')) return 'Safari'
    if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera'
    return 'Unknown'
  }

  const getOSName = (): string => {
    const ua = info.userAgent
    if (ua.includes('Windows')) return 'Windows'
    if (ua.includes('Mac OS')) return 'macOS'
    if (ua.includes('Linux')) return 'Linux'
    if (ua.includes('Android')) return 'Android'
    if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'
    return 'Unknown'
  }

  const isSlowConnection = (): boolean => {
    const effectiveType = info.connection.effectiveType
    return effectiveType === 'slow-2g' || effectiveType === '2g'
  }

  const isLowEndDevice = (): boolean => {
    const memory = info.deviceMemory
    const cores = info.hardwareConcurrency
    return (memory !== null && memory <= 2) || cores <= 2
  }

  // Setup event listeners
  onMounted(() => {
    window.addEventListener('online', handleOnlineChange)
    window.addEventListener('offline', handleOnlineChange)
    window.addEventListener('languagechange', handleLanguageChange)

    if (nav.connection) {
      nav.connection.addEventListener('change', handleConnectionChange)
    }
  })

  // Cleanup event listeners
  onUnmounted(() => {
    window.removeEventListener('online', handleOnlineChange)
    window.removeEventListener('offline', handleOnlineChange)
    window.removeEventListener('languagechange', handleLanguageChange)

    if (nav.connection) {
      nav.connection.removeEventListener('change', handleConnectionChange)
    }
  })

  // Refresh all navigator info
  const refresh = (): void => {
    const freshInfo = createNavigatorInfo(nav)
    Object.assign(info, freshInfo)
  }

  return {
    // Reactive state
    info: readonly(info),
    isLoading: readonly(isLoading),

    // Helper methods
    isTouchDevice,
    isMobile,
    getBrowserName,
    getOSName,
    isSlowConnection,
    isLowEndDevice,

    // Actions
    refresh,
  }
}
