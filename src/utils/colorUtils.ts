/**
 * Color utility functions for generating color palettes
 */

interface RGB {
  r: number
  g: number
  b: number
}

interface HSL {
  h: number
  s: number
  l: number
}

/**
 * Color palette with 11 shades (50-950)
 */
export interface ColorPalette {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): RGB {
  const cleanHex = hex.replace('#', '')
  const bigint = parseInt(cleanHex, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  }
}

/**
 * Convert RGB to hex color
 */
export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number): string => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  let h = 0
  let s = 0

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100,
  }
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360
  const s = hsl.s / 100
  const l = hsl.l / 100

  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

/**
 * Generate a color palette from a base hex color
 * The base color is used as the 500 shade
 */
export function generateColorPalette(baseHex: string): ColorPalette {
  const rgb = hexToRgb(baseHex)
  const hsl = rgbToHsl(rgb)

  // Lightness values for each shade
  // 50 is lightest, 950 is darkest
  const lightnessMap: Record<keyof ColorPalette, number> = {
    50: 97,
    100: 94,
    200: 86,
    300: 77,
    400: 66,
    500: hsl.l, // Keep original lightness for base color
    600: 45,
    700: 37,
    800: 30,
    900: 24,
    950: 14,
  }

  // Adjust saturation based on lightness
  const getSaturation = (lightness: number): number => {
    if (lightness > 90) return Math.max(hsl.s * 0.3, 20)
    if (lightness > 70) return Math.max(hsl.s * 0.6, 30)
    if (lightness < 30) return Math.min(hsl.s * 1.1, 100)
    return hsl.s
  }

  const shadeKeys: (keyof ColorPalette)[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  const palette: ColorPalette = {
    50: '',
    100: '',
    200: '',
    300: '',
    400: '',
    500: '',
    600: '',
    700: '',
    800: '',
    900: '',
    950: '',
  }

  for (const shadeKey of shadeKeys) {
    const lightness = lightnessMap[shadeKey]
    const newHsl: HSL = {
      h: hsl.h,
      s: getSaturation(lightness),
      l: lightness,
    }
    palette[shadeKey] = rgbToHex(hslToRgb(newHsl))
  }

  // Override 500 with exact base color
  palette[500] = baseHex.startsWith('#') ? baseHex : `#${baseHex}`

  return palette
}

/**
 * Validate hex color format
 */
export function isValidHexColor(hex: string): boolean {
  const cleanHex = hex.replace('#', '')
  return /^[0-9A-Fa-f]{6}$/.test(cleanHex)
}
