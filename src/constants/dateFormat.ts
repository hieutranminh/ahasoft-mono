/**
 * Date format constants for consistent date formatting across the application.
 *
 * This file contains format tokens for:
 * 1. PRIMEVUE_* - For PrimeVue DatePicker component
 * 2. LUXON_* - For Luxon DateTime formatting (data processing)
 *
 * PrimeVue DatePicker Format Tokens:
 * - d: day of month (no leading zero)
 * - dd: day of month (2 digits)
 * - m: month of year (no leading zero)
 * - mm: month of year (2 digits)
 * - M: month name short
 * - MM: month name long
 * - y: year (2 digits)
 * - yy: year (4 digits)
 *
 * Luxon Format Tokens:
 * - yyyy: 4-digit year (2024)
 * - MM: 2-digit month (01-12)
 * - dd: 2-digit day (01-31)
 * - HH: 2-digit hour 24h (00-23)
 * - hh: 2-digit hour 12h (01-12)
 * - mm: 2-digit minute (00-59)
 * - ss: 2-digit second (00-59)
 * - a: am/pm
 * - EEEE: Full weekday name
 * - EEE: Short weekday name
 * - LLLL: Full month name (standalone)
 * - LLL: Short month name (standalone)
 */

// ============================================================================
// PRIMEVUE DATEPICKER FORMAT TOKENS
// ============================================================================

/**
 * PrimeVue DatePicker date format tokens
 * Reference: https://primevue.org/datepicker/#format
 */
export const PRIMEVUE_DATE_FORMAT = {
  /** ISO format: 2024-12-10 */
  ISO: 'yy-mm-dd',
  /** US format: 12/10/2024 */
  US: 'mm/dd/yy',
  /** EU format: 10/12/2024 */
  EU: 'dd/mm/yy',
  /** Long format: December 10, 2024 */
  LONG: 'MM dd, yy',
  /** Short format: Dec 10, 2024 */
  SHORT: 'M dd, yy',
} as const

/**
 * PrimeVue datetime formats
 * Note: Time portion is controlled by showTime and hourFormat props, not dateFormat
 */
export const PRIMEVUE_DATETIME_FORMAT = {
  /** ISO format: 2024-12-10 */
  ISO: 'yy-mm-dd',
  /** US format: 12/10/2024 */
  US: 'mm/dd/yy',
  /** EU format: 10/12/2024 */
  EU: 'dd/mm/yy',
} as const

// ============================================================================
// LUXON FORMAT TOKENS (for DateTime formatting in code)
// ============================================================================

/** Luxon date formats for data processing */
export const LUXON_DATE_FORMAT = {
  /** ISO format: 2024-12-10 */
  ISO: 'yyyy-MM-dd',
  /** US format: 12/10/2024 */
  US: 'MM/dd/yyyy',
  /** EU format: 10/12/2024 */
  EU: 'dd/MM/yyyy',
  /** Long format: December 10, 2024 */
  LONG: 'LLLL dd, yyyy',
  /** Short format: Dec 10, 2024 */
  SHORT: 'LLL dd, yyyy',
  /** Compact: 20241210 */
  COMPACT: 'yyyyMMdd',
} as const

/** Luxon datetime formats for data processing */
export const LUXON_DATETIME_FORMAT = {
  /** ISO with time: 2024-12-10 14:30 */
  ISO: 'yyyy-MM-dd HH:mm',
  /** ISO with seconds: 2024-12-10 14:30:00 */
  ISO_SECONDS: 'yyyy-MM-dd HH:mm:ss',
  /** US with 12h: 12/10/2024 2:30 PM */
  US_12H: 'MM/dd/yyyy hh:mm a',
  /** EU with 24h: 10/12/2024 14:30 */
  EU_24H: 'dd/MM/yyyy HH:mm',
  /** Full datetime: Wednesday, December 10, 2024 14:30 */
  FULL: 'EEEE, LLLL dd, yyyy HH:mm',
  /** Compact with time: 20241210_1430 */
  COMPACT: 'yyyyMMdd_HHmm',
} as const

/** Luxon time formats for data processing */
export const LUXON_TIME_FORMAT = {
  /** 24-hour: 14:30 */
  H24: 'HH:mm',
  /** 24-hour with seconds: 14:30:00 */
  H24_SECONDS: 'HH:mm:ss',
  /** 12-hour: 2:30 PM */
  H12: 'hh:mm a',
  /** 12-hour with seconds: 2:30:00 PM */
  H12_SECONDS: 'hh:mm:ss a',
} as const

// ============================================================================
// TIMEZONE CONSTANTS
// ============================================================================

/**
 * Comprehensive timezone identifiers (IANA Time Zone Database)
 * Organized by region for easy navigation
 */
export const TIMEZONE = {
  // UTC
  UTC: 'UTC',

  // Asia
  VIETNAM: 'Asia/Ho_Chi_Minh',
  KOREA: 'Asia/Seoul',
  CHINA: 'Asia/Shanghai',
  JAPAN: 'Asia/Tokyo',
  SINGAPORE: 'Asia/Singapore',
  HONG_KONG: 'Asia/Hong_Kong',
  TAIWAN: 'Asia/Taipei',
  THAILAND: 'Asia/Bangkok',
  MALAYSIA: 'Asia/Kuala_Lumpur',
  PHILIPPINES: 'Asia/Manila',
  INDONESIA_JAKARTA: 'Asia/Jakarta',
  INDONESIA_BALI: 'Asia/Makassar',
  INDIA: 'Asia/Kolkata',
  UAE: 'Asia/Dubai',
  ISRAEL: 'Asia/Jerusalem',
  TURKEY: 'Europe/Istanbul',

  // Europe
  LONDON: 'Europe/London',
  PARIS: 'Europe/Paris',
  BERLIN: 'Europe/Berlin',
  AMSTERDAM: 'Europe/Amsterdam',
  BRUSSELS: 'Europe/Brussels',
  ROME: 'Europe/Rome',
  MADRID: 'Europe/Madrid',
  LISBON: 'Europe/Lisbon',
  ATHENS: 'Europe/Athens',
  MOSCOW: 'Europe/Moscow',
  ZURICH: 'Europe/Zurich',
  VIENNA: 'Europe/Vienna',
  STOCKHOLM: 'Europe/Stockholm',
  OSLO: 'Europe/Oslo',
  COPENHAGEN: 'Europe/Copenhagen',
  HELSINKI: 'Europe/Helsinki',
  WARSAW: 'Europe/Warsaw',
  PRAGUE: 'Europe/Prague',
  BUDAPEST: 'Europe/Budapest',
  DUBLIN: 'Europe/Dublin',

  // Americas
  NEW_YORK: 'America/New_York',
  LOS_ANGELES: 'America/Los_Angeles',
  CHICAGO: 'America/Chicago',
  DENVER: 'America/Denver',
  PHOENIX: 'America/Phoenix',
  TORONTO: 'America/Toronto',
  VANCOUVER: 'America/Vancouver',
  MEXICO_CITY: 'America/Mexico_City',
  SAO_PAULO: 'America/Sao_Paulo',
  BUENOS_AIRES: 'America/Argentina/Buenos_Aires',
  LIMA: 'America/Lima',
  BOGOTA: 'America/Bogota',
  SANTIAGO: 'America/Santiago',

  // Oceania
  SYDNEY: 'Australia/Sydney',
  MELBOURNE: 'Australia/Melbourne',
  BRISBANE: 'Australia/Brisbane',
  PERTH: 'Australia/Perth',
  AUCKLAND: 'Pacific/Auckland',
  FIJI: 'Pacific/Fiji',

  // Africa
  CAIRO: 'Africa/Cairo',
  JOHANNESBURG: 'Africa/Johannesburg',
  LAGOS: 'Africa/Lagos',
  NAIROBI: 'Africa/Nairobi',
  CASABLANCA: 'Africa/Casablanca',
} as const

/**
 * Timezone options for Select component
 * Organized by region with UTC offset for clarity
 * Note: UTC offsets shown are standard time (may differ during DST)
 */
export const TIMEZONE_OPTIONS = [
  // UTC
  { label: 'UTC (±00:00)', value: TIMEZONE.UTC, region: 'UTC' },

  // Asia (sorted by offset, then alphabetically)
  { label: 'Vietnam (UTC+07:00)', value: TIMEZONE.VIETNAM, region: 'Asia' },
  { label: 'Thailand (UTC+07:00)', value: TIMEZONE.THAILAND, region: 'Asia' },
  { label: 'Indonesia - Jakarta (UTC+07:00)', value: TIMEZONE.INDONESIA_JAKARTA, region: 'Asia' },
  { label: 'China (UTC+08:00)', value: TIMEZONE.CHINA, region: 'Asia' },
  { label: 'Hong Kong (UTC+08:00)', value: TIMEZONE.HONG_KONG, region: 'Asia' },
  { label: 'Taiwan (UTC+08:00)', value: TIMEZONE.TAIWAN, region: 'Asia' },
  { label: 'Singapore (UTC+08:00)', value: TIMEZONE.SINGAPORE, region: 'Asia' },
  { label: 'Malaysia (UTC+08:00)', value: TIMEZONE.MALAYSIA, region: 'Asia' },
  { label: 'Philippines (UTC+08:00)', value: TIMEZONE.PHILIPPINES, region: 'Asia' },
  { label: 'Indonesia - Bali (UTC+08:00)', value: TIMEZONE.INDONESIA_BALI, region: 'Asia' },
  { label: 'Japan (UTC+09:00)', value: TIMEZONE.JAPAN, region: 'Asia' },
  { label: 'Korea (UTC+09:00)', value: TIMEZONE.KOREA, region: 'Asia' },
  { label: 'India (UTC+05:30)', value: TIMEZONE.INDIA, region: 'Asia' },
  { label: 'UAE - Dubai (UTC+04:00)', value: TIMEZONE.UAE, region: 'Asia' },
  { label: 'Israel (UTC+02:00)', value: TIMEZONE.ISRAEL, region: 'Asia' },
  { label: 'Turkey (UTC+03:00)', value: TIMEZONE.TURKEY, region: 'Asia' },

  // Europe (sorted by offset, then alphabetically)
  { label: 'London (UTC±00:00)', value: TIMEZONE.LONDON, region: 'Europe' },
  { label: 'Dublin (UTC±00:00)', value: TIMEZONE.DUBLIN, region: 'Europe' },
  { label: 'Lisbon (UTC±00:00)', value: TIMEZONE.LISBON, region: 'Europe' },
  { label: 'Paris (UTC+01:00)', value: TIMEZONE.PARIS, region: 'Europe' },
  { label: 'Berlin (UTC+01:00)', value: TIMEZONE.BERLIN, region: 'Europe' },
  { label: 'Amsterdam (UTC+01:00)', value: TIMEZONE.AMSTERDAM, region: 'Europe' },
  { label: 'Brussels (UTC+01:00)', value: TIMEZONE.BRUSSELS, region: 'Europe' },
  { label: 'Rome (UTC+01:00)', value: TIMEZONE.ROME, region: 'Europe' },
  { label: 'Madrid (UTC+01:00)', value: TIMEZONE.MADRID, region: 'Europe' },
  { label: 'Zurich (UTC+01:00)', value: TIMEZONE.ZURICH, region: 'Europe' },
  { label: 'Vienna (UTC+01:00)', value: TIMEZONE.VIENNA, region: 'Europe' },
  { label: 'Stockholm (UTC+01:00)', value: TIMEZONE.STOCKHOLM, region: 'Europe' },
  { label: 'Oslo (UTC+01:00)', value: TIMEZONE.OSLO, region: 'Europe' },
  { label: 'Copenhagen (UTC+01:00)', value: TIMEZONE.COPENHAGEN, region: 'Europe' },
  { label: 'Warsaw (UTC+01:00)', value: TIMEZONE.WARSAW, region: 'Europe' },
  { label: 'Prague (UTC+01:00)', value: TIMEZONE.PRAGUE, region: 'Europe' },
  { label: 'Budapest (UTC+01:00)', value: TIMEZONE.BUDAPEST, region: 'Europe' },
  { label: 'Athens (UTC+02:00)', value: TIMEZONE.ATHENS, region: 'Europe' },
  { label: 'Helsinki (UTC+02:00)', value: TIMEZONE.HELSINKI, region: 'Europe' },
  { label: 'Moscow (UTC+03:00)', value: TIMEZONE.MOSCOW, region: 'Europe' },

  // Americas (sorted by offset from west to east)
  { label: 'Los Angeles (UTC-08:00)', value: TIMEZONE.LOS_ANGELES, region: 'Americas' },
  { label: 'Vancouver (UTC-08:00)', value: TIMEZONE.VANCOUVER, region: 'Americas' },
  { label: 'Denver (UTC-07:00)', value: TIMEZONE.DENVER, region: 'Americas' },
  { label: 'Phoenix (UTC-07:00)', value: TIMEZONE.PHOENIX, region: 'Americas' },
  { label: 'Chicago (UTC-06:00)', value: TIMEZONE.CHICAGO, region: 'Americas' },
  { label: 'Mexico City (UTC-06:00)', value: TIMEZONE.MEXICO_CITY, region: 'Americas' },
  { label: 'New York (UTC-05:00)', value: TIMEZONE.NEW_YORK, region: 'Americas' },
  { label: 'Toronto (UTC-05:00)', value: TIMEZONE.TORONTO, region: 'Americas' },
  { label: 'Lima (UTC-05:00)', value: TIMEZONE.LIMA, region: 'Americas' },
  { label: 'Bogota (UTC-05:00)', value: TIMEZONE.BOGOTA, region: 'Americas' },
  { label: 'Santiago (UTC-04:00)', value: TIMEZONE.SANTIAGO, region: 'Americas' },
  { label: 'Buenos Aires (UTC-03:00)', value: TIMEZONE.BUENOS_AIRES, region: 'Americas' },
  { label: 'São Paulo (UTC-03:00)', value: TIMEZONE.SAO_PAULO, region: 'Americas' },

  // Oceania
  { label: 'Perth (UTC+08:00)', value: TIMEZONE.PERTH, region: 'Oceania' },
  { label: 'Brisbane (UTC+10:00)', value: TIMEZONE.BRISBANE, region: 'Oceania' },
  { label: 'Sydney (UTC+10:00)', value: TIMEZONE.SYDNEY, region: 'Oceania' },
  { label: 'Melbourne (UTC+10:00)', value: TIMEZONE.MELBOURNE, region: 'Oceania' },
  { label: 'Auckland (UTC+12:00)', value: TIMEZONE.AUCKLAND, region: 'Oceania' },
  { label: 'Fiji (UTC+12:00)', value: TIMEZONE.FIJI, region: 'Oceania' },

  // Africa
  { label: 'Casablanca (UTC±00:00)', value: TIMEZONE.CASABLANCA, region: 'Africa' },
  { label: 'Lagos (UTC+01:00)', value: TIMEZONE.LAGOS, region: 'Africa' },
  { label: 'Cairo (UTC+02:00)', value: TIMEZONE.CAIRO, region: 'Africa' },
  { label: 'Johannesburg (UTC+02:00)', value: TIMEZONE.JOHANNESBURG, region: 'Africa' },
  { label: 'Nairobi (UTC+03:00)', value: TIMEZONE.NAIROBI, region: 'Africa' },
] as const

/**
 * Grouped timezone options for Select component with optgroup support
 * Use this when you need to display timezones in grouped dropdown
 */
export const TIMEZONE_OPTIONS_GROUPED = {
  UTC: [{ label: 'UTC (±00:00)', value: TIMEZONE.UTC }],
  Asia: TIMEZONE_OPTIONS.filter((tz) => tz.region === 'Asia'),
  Europe: TIMEZONE_OPTIONS.filter((tz) => tz.region === 'Europe'),
  Oceania: TIMEZONE_OPTIONS.filter((tz) => tz.region === 'Oceania'),
  Africa: TIMEZONE_OPTIONS.filter((tz) => tz.region === 'Africa'),
} as const

// ============================================================================
// TYPE EXPORTS
// ============================================================================

// PrimeVue DatePicker format types
export type PrimeVueDateFormatType =
  (typeof PRIMEVUE_DATE_FORMAT)[keyof typeof PRIMEVUE_DATE_FORMAT]
export type PrimeVueDateTimeFormatType =
  (typeof PRIMEVUE_DATETIME_FORMAT)[keyof typeof PRIMEVUE_DATETIME_FORMAT]

// Luxon format types
export type LuxonDateFormatType = (typeof LUXON_DATE_FORMAT)[keyof typeof LUXON_DATE_FORMAT]
export type LuxonDateTimeFormatType =
  (typeof LUXON_DATETIME_FORMAT)[keyof typeof LUXON_DATETIME_FORMAT]
export type LuxonTimeFormatType = (typeof LUXON_TIME_FORMAT)[keyof typeof LUXON_TIME_FORMAT]

// Timezone type
export type TimezoneType = (typeof TIMEZONE)[keyof typeof TIMEZONE]
