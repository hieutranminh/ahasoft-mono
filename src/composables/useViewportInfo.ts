import { computed, type DeepReadonly, onMounted, onUnmounted, reactive, readonly, ref } from 'vue'

// Breakpoint configuration type
export interface BreakpointConfig {
  name: string
  minWidth: number
}

// Viewport orientation type
export type ViewportOrientation = 'portrait' | 'landscape'

// Device type enum - specific device types
export type DeviceType =
  | 'iphone'
  | 'ipad'
  | 'android-phone'
  | 'android-tablet'
  | 'windows-phone'
  | 'windows-tablet'
  | 'windows-pc'
  | 'mac'
  | 'linux'
  | 'chromebook'
  | 'unknown'

// Device category enum - broad categories
export type DeviceCategory = 'mobile' | 'tablet' | 'desktop' | 'unknown'

// Device info interface
export interface DeviceInfo {
  type: DeviceType
  category: DeviceCategory
  os: string
  browser: string
  isTouchDevice: boolean
  isStandalone: boolean // PWA standalone mode
}

// Device display info for UI
export interface DeviceDisplayInfo {
  type: DeviceType
  label: string
  icon: string
  category: DeviceCategory
  categoryLabel: string
  os: string
  browser: string
}

// Viewport info interface
export interface ViewportInfo {
  width: number
  height: number
  devicePixelRatio: number
  orientation: ViewportOrientation
  breakpoint: string
  device: DeviceInfo
}

// Default breakpoints matching SCSS mixins ($breakpoints in mixins.scss)
const DEFAULT_BREAKPOINTS: BreakpointConfig[] = [
  { name: 'xxl', minWidth: 1920 },
  { name: 'xl', minWidth: 1440 },
  { name: 'lg', minWidth: 1280 },
  { name: 'md', minWidth: 1024 },
  { name: 'sm', minWidth: 768 },
  { name: 'xs', minWidth: 480 },
  { name: 'xxs', minWidth: 0 },
]

/**
 * Detect operating system from user agent
 */
function detectOS(ua: string): string {
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS'
  if (/Android/.test(ua)) return 'Android'
  if (/Windows Phone/.test(ua)) return 'Windows Phone'
  if (/Windows/.test(ua)) return 'Windows'
  if (/Macintosh|Mac OS X/.test(ua)) return 'macOS'
  if (/Linux/.test(ua)) return 'Linux'
  if (/CrOS/.test(ua)) return 'Chrome OS'
  return 'Unknown'
}

/**
 * Detect browser from user agent
 */
function detectBrowser(ua: string): string {
  // Order matters - check more specific patterns first
  if (/Edg\//.test(ua)) return 'Edge'
  if (/OPR\/|Opera\//.test(ua)) return 'Opera'
  if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) return 'Chrome'
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return 'Safari'
  if (/Firefox\//.test(ua)) return 'Firefox'
  if (/MSIE|Trident\//.test(ua)) return 'Internet Explorer'
  return 'Unknown'
}

/**
 * Check if device supports touch
 */
function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * Check if app is running in standalone mode (PWA)
 */
function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

/**
 * Check if device is likely an iPad running iPadOS 13+
 * iPadOS 13+ reports as "Macintosh" in user agent by default
 */
function isIPadOS(ua: string): boolean {
  // iPad with iPadOS 13+ reports as Mac but has touch support
  const isMacUA = /Macintosh|Mac OS X/.test(ua)
  const hasTouch = isTouchDevice()
  // Check for Safari on "Mac" with touch - likely iPad
  // Also check maxTouchPoints > 1 as Mac trackpads report maxTouchPoints = 0 or 1
  const hasMultiTouch = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1

  return isMacUA && hasTouch && hasMultiTouch
}

/**
 * Detect device type from user agent and screen properties
 * Note: High cyclomatic complexity is acceptable here as each branch handles
 * a specific device type detection. Refactoring would reduce readability.
 */
// eslint-disable-next-line complexity
function detectDeviceType(ua: string, width: number): DeviceType {
  const isIOS = /iPhone|iPad|iPod/.test(ua)
  const isAndroid = /Android/.test(ua)
  const isWindowsPhone = /Windows Phone/.test(ua)
  const isWindows = /Windows/.test(ua) && !isWindowsPhone
  const isMac = /Macintosh|Mac OS X/.test(ua)
  const isLinux = /Linux/.test(ua) && !isAndroid
  const isChromeOS = /CrOS/.test(ua)

  // iOS devices (explicit iPad/iPhone in UA)
  if (isIOS) {
    if (/iPhone/.test(ua)) return 'iphone'
    if (/iPad/.test(ua)) return 'ipad'
    // iPod treated as iPhone-like
    return 'iphone'
  }

  // iPad with iPadOS 13+ (reports as Mac with touch)
  if (isIPadOS(ua)) {
    return 'ipad'
  }

  // Android devices - distinguish phone vs tablet by screen width
  if (isAndroid) {
    // Android tablets typically have larger screens
    // Also check if "Mobile" is in the UA - tablets often don't have it
    const isMobile = /Mobile/.test(ua)
    if (isMobile || width < 768) return 'android-phone'
    return 'android-tablet'
  }

  // Windows devices
  if (isWindowsPhone) return 'windows-phone'
  if (isWindows) {
    // Check for Windows tablets (touch + specific viewport)
    if (isTouchDevice() && width <= 1366) return 'windows-tablet'
    return 'windows-pc'
  }

  // macOS (after iPad check to avoid false positives)
  if (isMac) return 'mac'

  // Linux
  if (isLinux) return 'linux'

  // Chrome OS
  if (isChromeOS) return 'chromebook'

  return 'unknown'
}

/**
 * Get device category from device type
 */
function getDeviceCategory(deviceType: DeviceType): DeviceCategory {
  const mobileDevices: DeviceType[] = ['iphone', 'android-phone', 'windows-phone']
  const tabletDevices: DeviceType[] = ['ipad', 'android-tablet', 'windows-tablet']
  const desktopDevices: DeviceType[] = ['windows-pc', 'mac', 'linux', 'chromebook']

  if (mobileDevices.includes(deviceType)) return 'mobile'
  if (tabletDevices.includes(deviceType)) return 'tablet'
  if (desktopDevices.includes(deviceType)) return 'desktop'
  return 'unknown'
}

/**
 * Create device info from current environment
 */
function createDeviceInfo(width: number): DeviceInfo {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  const deviceType = detectDeviceType(ua, width)

  return {
    type: deviceType,
    category: getDeviceCategory(deviceType),
    os: detectOS(ua),
    browser: detectBrowser(ua),
    isTouchDevice: isTouchDevice(),
    isStandalone: isStandaloneMode(),
  }
}

// Breakpoint display info for UI
export interface BreakpointDisplayInfo {
  name: string
  label: string
  minWidth: number
  maxWidth: number | null
  icon: string
  description: string
}

/**
 * Get orientation from window dimensions
 */
function getOrientation(width: number, height: number): ViewportOrientation {
  return width >= height ? 'landscape' : 'portrait'
}

/**
 * Get current breakpoint name from width
 */
function getBreakpointName(width: number, breakpoints: BreakpointConfig[]): string {
  // Breakpoints should be sorted by minWidth descending
  const sorted = [...breakpoints].sort((a, b) => b.minWidth - a.minWidth)
  const match = sorted.find((bp) => width >= bp.minWidth)
  return match?.name ?? sorted[sorted.length - 1]?.name ?? 'unknown'
}

/**
 * Create initial viewport info snapshot
 */
function createViewportInfo(breakpoints: BreakpointConfig[]): ViewportInfo {
  const width = typeof window !== 'undefined' ? window.innerWidth : 0
  const height = typeof window !== 'undefined' ? window.innerHeight : 0
  const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1

  return {
    width,
    height,
    devicePixelRatio,
    orientation: getOrientation(width, height),
    breakpoint: getBreakpointName(width, breakpoints),
    device: createDeviceInfo(width),
  }
}

/**
 * Composable for tracking and displaying viewport information
 * Provides reactive updates on resize and orientation change
 *
 * @param customBreakpoints - Optional custom breakpoint configuration
 */
export function useViewportInfo(customBreakpoints?: BreakpointConfig[]) {
  const breakpoints = customBreakpoints ?? DEFAULT_BREAKPOINTS

  // Reactive viewport info
  const info = reactive<ViewportInfo>(createViewportInfo(breakpoints))

  // Throttle flag to prevent excessive updates
  const isThrottled = ref(false)
  const throttleMs = 16 // ~60fps

  /**
   * Update viewport info from current window state
   */
  const updateViewportInfo = (): void => {
    if (isThrottled.value) return

    isThrottled.value = true

    const width = window.innerWidth
    const height = window.innerHeight

    info.width = width
    info.height = height
    info.devicePixelRatio = window.devicePixelRatio
    info.orientation = getOrientation(width, height)
    info.breakpoint = getBreakpointName(width, breakpoints)
    // Update device info (in case of resize affecting tablet detection, etc.)
    const newDeviceInfo = createDeviceInfo(width)
    info.device.type = newDeviceInfo.type
    info.device.category = newDeviceInfo.category
    info.device.os = newDeviceInfo.os
    info.device.browser = newDeviceInfo.browser
    info.device.isTouchDevice = newDeviceInfo.isTouchDevice
    info.device.isStandalone = newDeviceInfo.isStandalone

    setTimeout(() => {
      isThrottled.value = false
    }, throttleMs)
  }

  /**
   * Handle resize event
   */
  const handleResize = (): void => {
    updateViewportInfo()
  }

  /**
   * Handle orientation change event
   */
  const handleOrientationChange = (): void => {
    // Small delay to ensure dimensions are updated after orientation change
    setTimeout(() => {
      updateViewportInfo()
    }, 100)
  }

  // Computed: Check if viewport is in portrait mode
  const isPortrait = computed((): boolean => info.orientation === 'portrait')

  // Computed: Check if viewport is in landscape mode
  const isLandscape = computed((): boolean => info.orientation === 'landscape')

  // Computed: Check if device has high pixel density (retina)
  const isHighDensity = computed((): boolean => info.devicePixelRatio > 1)

  // Computed: Get aspect ratio
  const aspectRatio = computed((): number => {
    if (info.height === 0) return 0
    return Math.round((info.width / info.height) * 100) / 100
  })

  // Computed: Get formatted aspect ratio string
  const aspectRatioFormatted = computed((): string => {
    const ratio = aspectRatio.value
    if (ratio === 0) return 'N/A'

    // Common aspect ratios
    if (Math.abs(ratio - 1.78) < 0.05) return '16:9'
    if (Math.abs(ratio - 1.6) < 0.05) return '16:10'
    if (Math.abs(ratio - 1.33) < 0.05) return '4:3'
    if (Math.abs(ratio - 1) < 0.05) return '1:1'
    if (Math.abs(ratio - 0.56) < 0.05) return '9:16'
    if (Math.abs(ratio - 0.75) < 0.05) return '3:4'

    return `${ratio}:1`
  })

  /**
   * Check if current breakpoint matches the given name
   */
  const isBreakpoint = (breakpointName: string): boolean => {
    return info.breakpoint === breakpointName
  }

  /**
   * Check if current width is at least the given breakpoint
   */
  const isAtLeast = (breakpointName: string): boolean => {
    const bp = breakpoints.find((b) => b.name === breakpointName)
    if (!bp) return false
    return info.width >= bp.minWidth
  }

  /**
   * Check if current width is below the given breakpoint
   */
  const isBelow = (breakpointName: string): boolean => {
    const bp = breakpoints.find((b) => b.name === breakpointName)
    if (!bp) return false
    return info.width < bp.minWidth
  }

  /**
   * Get all breakpoints with display info
   */
  const getBreakpointsDisplay = (): BreakpointDisplayInfo[] => {
    const sorted = [...breakpoints].sort((a, b) => a.minWidth - b.minWidth)

    return sorted.map((bp, index) => {
      const nextBp = sorted[index + 1]
      const maxWidth = nextBp ? nextBp.minWidth - 1 : null

      // Icon mapping based on breakpoint
      const iconMap: Record<string, string> = {
        xxs: 'pi pi-mobile',
        xs: 'pi pi-mobile',
        sm: 'pi pi-tablet',
        md: 'pi pi-tablet',
        lg: 'pi pi-desktop',
        xl: 'pi pi-desktop',
        xxl: 'pi pi-display',
      }

      // Description mapping
      const descriptionMap: Record<string, string> = {
        xxs: 'Extra small phones',
        xs: 'Small phones',
        sm: 'Large phones / Small tablets',
        md: 'Tablets / Small laptops',
        lg: 'Laptops / Small desktops',
        xl: 'Large desktops',
        xxl: 'Extra large screens',
      }

      return {
        name: bp.name,
        label: bp.name.toUpperCase(),
        minWidth: bp.minWidth,
        maxWidth,
        icon: iconMap[bp.name] ?? 'pi pi-desktop',
        description: descriptionMap[bp.name] ?? `Breakpoint ${bp.name}`,
      }
    })
  }

  /**
   * Get current breakpoint display info
   */
  const getCurrentBreakpointDisplay = (): BreakpointDisplayInfo | null => {
    const displays = getBreakpointsDisplay()
    return displays.find((d) => d.name === info.breakpoint) ?? null
  }

  /**
   * Get device display info for UI
   */
  const getDeviceDisplayInfo = (): DeviceDisplayInfo => {
    const device = info.device

    // Device type labels
    const typeLabels: Record<DeviceType, string> = {
      iphone: 'iPhone',
      ipad: 'iPad',
      'android-phone': 'Android Phone',
      'android-tablet': 'Android Tablet',
      'windows-phone': 'Windows Phone',
      'windows-tablet': 'Windows Tablet',
      'windows-pc': 'Windows PC',
      mac: 'Mac',
      linux: 'Linux',
      chromebook: 'Chromebook',
      unknown: 'Unknown Device',
    }

    // Device type icons
    const typeIcons: Record<DeviceType, string> = {
      iphone: 'pi pi-apple',
      ipad: 'pi pi-tablet',
      'android-phone': 'pi pi-android',
      'android-tablet': 'pi pi-tablet',
      'windows-phone': 'pi pi-mobile',
      'windows-tablet': 'pi pi-tablet',
      'windows-pc': 'pi pi-microsoft',
      mac: 'pi pi-apple',
      linux: 'pi pi-server',
      chromebook: 'pi pi-chrome',
      unknown: 'pi pi-question-circle',
    }

    // Category labels
    const categoryLabels: Record<DeviceCategory, string> = {
      mobile: 'Mobile',
      tablet: 'Tablet',
      desktop: 'Desktop',
      unknown: 'Unknown',
    }

    return {
      type: device.type,
      label: typeLabels[device.type],
      icon: typeIcons[device.type],
      category: device.category,
      categoryLabel: categoryLabels[device.category],
      os: device.os,
      browser: device.browser,
    }
  }

  // Computed: Check if device is mobile
  const isMobile = computed((): boolean => info.device.category === 'mobile')

  // Computed: Check if device is tablet
  const isTablet = computed((): boolean => info.device.category === 'tablet')

  // Computed: Check if device is desktop
  const isDesktop = computed((): boolean => info.device.category === 'desktop')

  // Computed: Check if device is iOS (iPhone or iPad)
  const isIOS = computed(
    (): boolean => info.device.type === 'iphone' || info.device.type === 'ipad',
  )

  // Computed: Check if device is Android
  const isAndroid = computed(
    (): boolean => info.device.type === 'android-phone' || info.device.type === 'android-tablet',
  )

  // Computed: Check if device supports touch
  const isTouchEnabled = computed((): boolean => info.device.isTouchDevice)

  // Computed: Check if app is in standalone/PWA mode
  const isPWA = computed((): boolean => info.device.isStandalone)

  // Computed: Check if OS is Windows
  const isWindowsOS = computed((): boolean => info.device.os === 'Windows')

  // Computed: Check if OS is macOS
  const isMacOS = computed((): boolean => info.device.os === 'macOS')

  // Computed: Check if OS is Linux
  const isLinuxOS = computed((): boolean => info.device.os === 'Linux')

  // Computed: Check if OS is Chrome OS
  const isChromeOS = computed((): boolean => info.device.os === 'Chrome OS')

  /**
   * Force refresh viewport info
   */
  const refresh = (): void => {
    isThrottled.value = false
    updateViewportInfo()
  }

  // Store media query reference for cleanup
  let mediaQuery: MediaQueryList | null = null

  // Setup event listeners
  onMounted(() => {
    // Initialize with current values
    updateViewportInfo()

    // Add event listeners
    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true })

    // Also listen to media query changes for devicePixelRatio
    mediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
    mediaQuery.addEventListener('change', handleResize)
  })

  // Cleanup event listeners
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('orientationchange', handleOrientationChange)

    // Cleanup media query listener
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', handleResize)
      mediaQuery = null
    }
  })

  return {
    // Reactive state
    info: readonly(info) as DeepReadonly<ViewportInfo>,

    // Computed properties - Viewport
    isPortrait,
    isLandscape,
    isHighDensity,
    aspectRatio,
    aspectRatioFormatted,

    // Computed properties - Device Category
    isMobile,
    isTablet,
    isDesktop,

    // Computed properties - Device Platform
    isIOS,
    isAndroid,
    isWindowsOS,
    isMacOS,
    isLinuxOS,
    isChromeOS,

    // Computed properties - Device Features
    isTouchEnabled,
    isPWA,

    // Helper methods
    isBreakpoint,
    isAtLeast,
    isBelow,
    getBreakpointsDisplay,
    getCurrentBreakpointDisplay,
    getDeviceDisplayInfo,

    // Actions
    refresh,

    // Configuration
    breakpoints: readonly(breakpoints) as Readonly<BreakpointConfig[]>,
  }
}

// Export default breakpoints for external use
export const DEFAULT_VIEWPORT_BREAKPOINTS = DEFAULT_BREAKPOINTS
