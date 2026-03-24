import { definePreset, usePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import Lara from '@primeuix/themes/lara'
import Material from '@primeuix/themes/material'
import Nora from '@primeuix/themes/nora'
import type { Preset } from '@primeuix/themes/types'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import type { App } from 'vue'

import { type ColorPalette, generateColorPalette, isValidHexColor } from '@/utils/colorUtils'

// Available theme presets
export const THEME_PRESETS = {
  aura: Aura,
  material: Material,
  lara: Lara,
  nora: Nora,
} as const

export type ThemePresetName = keyof typeof THEME_PRESETS

// Available primary colors for customization
export const PRIMARY_COLORS = [
  'emerald',
  'green',
  'lime',
  'red',
  'orange',
  'amber',
  'yellow',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'custom', // Special value for custom hex color
] as const

export type PrimaryColorName = (typeof PRIMARY_COLORS)[number]

// Available surface colors for customization
// Tailwind colors + PrimeVue custom palettes (soho, viva, ocean)
export const SURFACE_COLORS = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'soho',
  'viva',
  'ocean',
] as const

export type SurfaceColorName = (typeof SURFACE_COLORS)[number]

// Custom surface palettes (not from Tailwind)
// These are PrimeVue's custom surface color definitions
export const CUSTOM_SURFACE_PALETTES: Record<string, Record<string, string>> = {
  soho: {
    0: '#ffffff',
    50: '#f4f4f4',
    100: '#e8e9e9',
    200: '#d2d2d4',
    300: '#bbbcbe',
    400: '#a5a5a9',
    500: '#8e8f93',
    600: '#77787d',
    700: '#616268',
    800: '#4a4b52',
    900: '#34353d',
    950: '#1d1e27',
  },
  viva: {
    0: '#ffffff',
    50: '#f3f3f3',
    100: '#e7e7e8',
    200: '#cfd0d0',
    300: '#b7b8b9',
    400: '#9fa1a1',
    500: '#87898a',
    600: '#6e7173',
    700: '#565a5b',
    800: '#3e4244',
    900: '#262b2c',
    950: '#0e1315',
  },
  ocean: {
    0: '#ffffff',
    50: '#fbfcfc',
    100: '#F7F9F8',
    200: '#EFF3F2',
    300: '#DADEDD',
    400: '#B1B7B6',
    500: '#828787',
    600: '#5F7274',
    700: '#415B61',
    800: '#29444E',
    900: '#183240',
    950: '#0c1920',
  },
}

// Tailwind color hex values for preview swatches (500 shade)
export const COLOR_HEX_MAP: Record<string, string> = {
  emerald: '#10b981',
  green: '#22c55e',
  lime: '#84cc16',
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#0ea5e9',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  fuchsia: '#d946ef',
  pink: '#ec4899',
  rose: '#f43f5e',
  slate: '#64748b',
  gray: '#6b7280',
  zinc: '#71717a',
  neutral: '#737373',
  stone: '#78716c',
  soho: '#8e8f93',
  viva: '#87898a',
  ocean: '#5F7274',
  custom: '#000000',
}

// Dark mode class selector (CSS selector format)
export const DARK_MODE_SELECTOR = '.app-dark'
// Class name derived from selector for DOM manipulation
const DARK_MODE_CLASS = DARK_MODE_SELECTOR.replace('.', '')

// Theme preferences storage key
export const THEME_STORAGE_KEY = 'app-theme-preferences'

// Theme preferences interface
export interface ThemePreferences {
  preset: ThemePresetName
  primaryColor: PrimaryColorName
  customHexColor?: string // Hex color when primaryColor is 'custom'
  surfaceColor: SurfaceColorName
  darkMode: boolean
}

// Default theme preferences
export const DEFAULT_THEME_PREFERENCES: ThemePreferences = {
  preset: 'aura',
  primaryColor: 'emerald',
  surfaceColor: 'slate',
  darkMode: false,
}

/**
 * Load theme preferences from localStorage
 * @returns Saved preferences or defaults
 */
export function loadThemePreferences(): ThemePreferences {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<ThemePreferences>
      const result: ThemePreferences = { ...DEFAULT_THEME_PREFERENCES }

      // Validate preset
      if (parsed.preset && parsed.preset in THEME_PRESETS) {
        result.preset = parsed.preset
      }

      // Validate primary color
      if (parsed.primaryColor && PRIMARY_COLORS.includes(parsed.primaryColor)) {
        result.primaryColor = parsed.primaryColor
      }

      // Validate custom hex color if using custom primary color
      const isCustomColor = result.primaryColor === 'custom'
      const hasValidCustomHex = parsed.customHexColor && isValidHexColor(parsed.customHexColor)
      if (isCustomColor && hasValidCustomHex) {
        result.customHexColor = parsed.customHexColor
      } else if (isCustomColor) {
        // Fall back if custom color is invalid
        result.primaryColor = 'emerald'
      }

      // Validate surface color
      if (parsed.surfaceColor && SURFACE_COLORS.includes(parsed.surfaceColor)) {
        result.surfaceColor = parsed.surfaceColor
      }

      // Validate dark mode
      if (typeof parsed.darkMode === 'boolean') {
        result.darkMode = parsed.darkMode
      }

      return result
    }
  } catch {
    // Ignore parse errors, return defaults
  }
  return { ...DEFAULT_THEME_PREFERENCES }
}

/**
 * Save theme preferences to localStorage
 */
export function saveThemePreferences(preferences: ThemePreferences): void {
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(preferences))
}

// PrimeVue palette shade keys used across color configs
const PALETTE_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

/**
 * Build a shade record from a token prefix (e.g. "indigo" -> { 50: "{indigo.50}", ... })
 */
function buildTokenPalette(tokenPrefix: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const shade of PALETTE_SHADES) {
    result[shade] = `{${tokenPrefix}.${shade}}`
  }
  return result
}

/**
 * Build primary color config from color name or custom palette
 */
function buildPrimaryColorConfig(
  primaryColor: PrimaryColorName,
  customHexColor?: string,
): Record<string, string> | null {
  if (primaryColor === 'custom' && customHexColor && isValidHexColor(customHexColor)) {
    const palette: ColorPalette = generateColorPalette(customHexColor)
    const result: Record<string, string> = {}
    for (const shade of PALETTE_SHADES) {
      result[shade] = palette[shade]
    }
    return result
  }

  if (primaryColor !== 'emerald' && primaryColor !== 'custom') {
    return buildTokenPalette(primaryColor)
  }

  return null
}

/**
 * Build surface color palette from color name
 */
function buildSurfacePalette(surfaceColor: SurfaceColorName): Record<string, string> {
  if (surfaceColor in CUSTOM_SURFACE_PALETTES) {
    return CUSTOM_SURFACE_PALETTES[surfaceColor]
  }

  return { 0: '#ffffff', ...buildTokenPalette(surfaceColor) }
}

interface ColorSchemeEntry {
  surface?: Record<string, string>
  ground?: { background: string }
}

interface ColorSchemeConfig {
  light: ColorSchemeEntry
  dark: ColorSchemeEntry
}

/**
 * Build colorScheme config for surface colors and ground background.
 * Always includes ground.background token for page-level backgrounds.
 * Surface overrides are only added when not using the default (slate).
 */
function buildColorSchemeConfig(surfaceColor: SurfaceColorName): ColorSchemeConfig {
  const config: ColorSchemeConfig = {
    light: { ground: { background: '{surface.50}' } },
    dark: { ground: { background: '{surface.950}' } },
  }

  if (surfaceColor !== 'slate') {
    const surfacePalette = buildSurfacePalette(surfaceColor)
    config.light.surface = surfacePalette
    config.dark.surface = surfacePalette
  }

  return config
}

/**
 * Apply dark mode by toggling class on document element
 */
export function setDarkMode(isDark: boolean): void {
  if (isDark) {
    document.documentElement.classList.add(DARK_MODE_CLASS)
  } else {
    document.documentElement.classList.remove(DARK_MODE_CLASS)
  }
}

// --- DataTable component token overrides (disabled by default) ---
// To enable: uncomment this block and uncomment componentOverrides in buildPresetOverrides.
// Token reference: https://primevue.org/datatable/#tokens
//
// import type { DataTableDesignTokens } from '@primeuix/themes/types/datatable'
// const DATATABLE_TOKEN_OVERRIDES: DataTableDesignTokens = {
//   headerCell: {
//     background: '{primary.700}',
//     hoverBackground: '{primary.600}',
//     selectedBackground: '{primary.800}',
//     color: '{primary.contrast.color}',
//     hoverColor: '{primary.contrast.color}',
//     selectedColor: '{primary.contrast.color}',
//     borderColor: '{primary.600}',
//   },
//   sortIcon: {
//     color: '{primary.200}',
//     hoverColor: '{primary.contrast.color}',
//   },
//   colorScheme: {
//     dark: {
//       headerCell: {
//         background: '{surface.800}',
//         hoverBackground: '{surface.700}',
//         selectedBackground: '{surface.600}',
//         color: '{surface.0}',
//         hoverColor: '{surface.0}',
//         selectedColor: '{surface.0}',
//         borderColor: '{surface.700}',
//       },
//       sortIcon: {
//         color: '{surface.400}',
//         hoverColor: '{surface.0}',
//       },
//     },
//   },
// }

interface SemanticOverrides {
  primary?: Record<string, string>
  colorScheme: ColorSchemeConfig
}

/**
 * Build full preset override config combining semantic tokens and component tokens.
 * Always includes ground.background token for page-level backgrounds.
 */
function buildPresetOverrides(
  primaryColor: PrimaryColorName,
  customHexColor?: string,
  surfaceColor?: SurfaceColorName,
): Preset {
  const primaryConfig = buildPrimaryColorConfig(primaryColor, customHexColor)
  const colorSchemeConfig = buildColorSchemeConfig(
    surfaceColor ?? DEFAULT_THEME_PREFERENCES.surfaceColor,
  )

  const semanticConfig: SemanticOverrides = { colorScheme: colorSchemeConfig }
  if (primaryConfig) {
    semanticConfig.primary = primaryConfig
  }

  // To add component token overrides (e.g. DataTable), extend the returned Preset:
  // return { semantic: semanticConfig, components: { datatable: DATATABLE_TOKEN_OVERRIDES } }

  return { semantic: semanticConfig }
}

/**
 * Build PrimeVue theme config from preferences
 */
function buildThemeConfig(preferences: ThemePreferences): {
  preset: unknown
  options: { darkModeSelector: string }
} {
  const basePreset = THEME_PRESETS[preferences.preset]
  const overrides = buildPresetOverrides(
    preferences.primaryColor,
    preferences.customHexColor,
    preferences.surfaceColor,
  )

  return {
    preset: definePreset(basePreset, overrides),
    options: { darkModeSelector: DARK_MODE_SELECTOR },
  }
}

export function setupPrimeVue(app: App): void {
  const preferences = loadThemePreferences()

  app.use(PrimeVue, {
    theme: buildThemeConfig(preferences),
  })

  app.use(ConfirmationService)
  app.use(ToastService)

  if (preferences.darkMode) {
    setDarkMode(true)
  }
}

/**
 * Update theme preset dynamically
 * @param presetName - Name of the preset (aura, material, lara, nora)
 * @param primaryColor - Primary color name or 'custom'
 * @param customHexColor - Hex color when primaryColor is 'custom'
 * @param surfaceColor - Surface color name
 */
export function updateThemePreset(
  presetName: ThemePresetName,
  primaryColor?: PrimaryColorName,
  customHexColor?: string,
  surfaceColor?: SurfaceColorName,
): void {
  const basePreset = THEME_PRESETS[presetName]
  const overrides = buildPresetOverrides(
    primaryColor ?? DEFAULT_THEME_PREFERENCES.primaryColor,
    customHexColor,
    surfaceColor,
  )

  usePreset(definePreset(basePreset, overrides))
}
