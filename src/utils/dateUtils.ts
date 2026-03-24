/**
 * Date utility functions using Luxon for consistent date handling across the application.
 *
 * @example
 * // Basic formatting
 * formatDate(new Date()) // '11/12/2024 14:30'
 * formatDateISO(new Date()) // '2024-12-11'
 *
 * // Parsing
 * parseISO('2024-12-11') // DateTime object
 * parseTimestamp(1702300000) // DateTime object
 *
 * // Timezone conversion
 * toTimezone(new Date(), 'Asia/Seoul') // DateTime in Seoul timezone
 * formatInTimezone(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm') // '2024-12-11 22:30'
 *
 * // Time manipulation
 * startOfDay(new Date()) // Start of current day
 * endOfMonth(new Date()) // End of current month
 * startOfQuarter(new Date()) // Start of current quarter
 */

import { DateTime } from 'luxon'

import { LUXON_DATE_FORMAT, LUXON_DATETIME_FORMAT, LUXON_TIME_FORMAT } from '@/constants/dateFormat'

// ============================================================================
// TYPES
// ============================================================================

/** Input types accepted by date utility functions */
export type DateInput = Date | string | number | null | undefined

/** Valid Luxon DateTime or null */
export type DateTimeResult = DateTime | null

// ============================================================================
// INTERNAL HELPERS
// ============================================================================

/**
 * Safely convert various input types to Luxon DateTime
 * @internal
 */
function toDateTime(input: DateInput): DateTimeResult {
  if (!input) return null

  try {
    if (input instanceof Date) {
      return DateTime.fromJSDate(input)
    }
    if (typeof input === 'number') {
      // Assume seconds if number is small (before year 3000 in seconds)
      // Otherwise assume milliseconds
      return input < 32503680000 ? DateTime.fromSeconds(input) : DateTime.fromMillis(input)
    }
    if (typeof input === 'string') {
      // Try ISO format first
      const isoResult = DateTime.fromISO(input)
      if (isoResult.isValid) return isoResult

      // Try SQL format
      const sqlResult = DateTime.fromSQL(input)
      if (sqlResult.isValid) return sqlResult

      return null
    }
    return null
  } catch {
    return null
  }
}

/**
 * Check if DateTime is valid
 * @internal
 */
function isValidDateTime(dt: DateTimeResult): dt is DateTime {
  return dt?.isValid === true
}

// ============================================================================
// FORMATTING FUNCTIONS
// ============================================================================

/**
 * Format date to readable string
 * @param input - Date input (Date, string, number, null, undefined)
 * @param format - Luxon format string (default: 'dd/MM/yyyy HH:mm')
 * @param fallback - Fallback value if date is invalid (default: '-')
 * @returns Formatted date string or fallback
 *
 * @example
 * formatDate(new Date()) // '11/12/2024 14:30'
 * formatDate('2024-12-11', 'yyyy-MM-dd') // '2024-12-11'
 * formatDate(null) // '-'
 */
export function formatDate(
  input: DateInput,
  format: string = LUXON_DATETIME_FORMAT.EU_24H,
  fallback: string = '-',
): string {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return fallback
  return dt?.toFormat(format)
}

/**
 * Format date to ISO date string (yyyy-MM-dd)
 * @param input - Date input
 * @param fallback - Fallback value if date is invalid
 * @returns ISO date string
 *
 * @example
 * formatDateISO(new Date()) // '2024-12-11'
 */
export function formatDateISO(input: DateInput, fallback: string = '-'): string {
  return formatDate(input, LUXON_DATE_FORMAT.ISO, fallback)
}

/**
 * Format date to EU format (dd/MM/yyyy)
 * @param input - Date input
 * @param fallback - Fallback value if date is invalid
 * @returns EU date string
 *
 * @example
 * formatDateEU(new Date()) // '11/12/2024'
 */
export function formatDateEU(input: DateInput, fallback: string = '-'): string {
  return formatDate(input, LUXON_DATE_FORMAT.EU, fallback)
}

/**
 * Format date to US format (MM/dd/yyyy)
 * @param input - Date input
 * @param fallback - Fallback value if date is invalid
 * @returns US date string
 *
 * @example
 * formatDateUS(new Date()) // '12/11/2024'
 */
export function formatDateUS(input: DateInput, fallback: string = '-'): string {
  return formatDate(input, LUXON_DATE_FORMAT.US, fallback)
}

/**
 * Format datetime to ISO string with seconds (yyyy-MM-dd HH:mm:ss)
 * @param input - Date input
 * @param fallback - Fallback value if date is invalid
 * @returns ISO datetime string
 *
 * @example
 * formatDateTimeISO(new Date()) // '2024-12-11 14:30:45'
 */
export function formatDateTimeISO(input: DateInput, fallback: string = '-'): string {
  return formatDate(input, LUXON_DATETIME_FORMAT.ISO_SECONDS, fallback)
}

/**
 * Format time only (HH:mm)
 * @param input - Date input
 * @param fallback - Fallback value if date is invalid
 * @returns Time string
 *
 * @example
 * formatTime(new Date()) // '14:30'
 */
export function formatTime(input: DateInput, fallback: string = '-'): string {
  return formatDate(input, LUXON_TIME_FORMAT.H24, fallback)
}

/**
 * Format time with seconds (HH:mm:ss)
 * @param input - Date input
 * @param fallback - Fallback value if date is invalid
 * @returns Time string with seconds
 *
 * @example
 * formatTimeSeconds(new Date()) // '14:30:45'
 */
export function formatTimeSeconds(input: DateInput, fallback: string = '-'): string {
  return formatDate(input, LUXON_TIME_FORMAT.H24_SECONDS, fallback)
}

// ============================================================================
// PARSING FUNCTIONS
// ============================================================================

/**
 * Parse ISO string to DateTime
 * @param isoString - ISO date string
 * @returns DateTime object or null if invalid
 *
 * @example
 * parseISO('2024-12-11') // DateTime object
 * parseISO('2024-12-11T14:30:00') // DateTime object
 */
export function parseISO(isoString: string): DateTimeResult {
  const dt = DateTime.fromISO(isoString)
  return isValidDateTime(dt) ? dt : null
}

/**
 * Parse Unix timestamp (seconds) to DateTime
 * @param timestamp - Unix timestamp in seconds
 * @returns DateTime object or null if invalid
 *
 * @example
 * parseTimestamp(1702300000) // DateTime object
 */
export function parseTimestamp(timestamp: number): DateTimeResult {
  const dt = DateTime.fromSeconds(timestamp)
  return isValidDateTime(dt) ? dt : null
}

/**
 * Parse milliseconds timestamp to DateTime
 * @param millis - Timestamp in milliseconds
 * @returns DateTime object or null if invalid
 *
 * @example
 * parseMillis(1702300000000) // DateTime object
 */
export function parseMillis(millis: number): DateTimeResult {
  const dt = DateTime.fromMillis(millis)
  return isValidDateTime(dt) ? dt : null
}

/**
 * Parse SQL datetime string to DateTime
 * @param sqlString - SQL datetime string
 * @returns DateTime object or null if invalid
 *
 * @example
 * parseSQL('2024-12-11 14:30:00') // DateTime object
 */
export function parseSQL(sqlString: string): DateTimeResult {
  const dt = DateTime.fromSQL(sqlString)
  return isValidDateTime(dt) ? dt : null
}

// ============================================================================
// TIMEZONE FUNCTIONS
// ============================================================================

/**
 * Convert date to specific timezone
 * @param input - Date input
 * @param timezone - IANA timezone string
 * @returns DateTime in specified timezone or null if invalid
 *
 * @example
 * toTimezone(new Date(), 'Asia/Seoul') // DateTime in Seoul timezone
 * toTimezone(new Date(), 'UTC') // DateTime in UTC
 */
export function toTimezone(input: DateInput, timezone: string): DateTimeResult {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.setZone(timezone)
}

/**
 * Convert date to UTC
 * @param input - Date input
 * @returns DateTime in UTC or null if invalid
 *
 * @example
 * toUTC(new Date()) // DateTime in UTC
 */
export function toUTC(input: DateInput): DateTimeResult {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.toUTC()
}

/**
 * Format date in specific timezone
 * @param input - Date input
 * @param timezone - IANA timezone string
 * @param format - Luxon format string
 * @param fallback - Fallback value if date is invalid
 * @returns Formatted date string in specified timezone
 *
 * @example
 * formatInTimezone(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm') // '2024-12-11 22:30'
 */
export function formatInTimezone(
  input: DateInput,
  timezone: string,
  format: string = LUXON_DATETIME_FORMAT.ISO_SECONDS,
  fallback: string = '-',
): string {
  const dt = toTimezone(input, timezone)
  if (!isValidDateTime(dt)) return fallback
  return dt.toFormat(format)
}

/**
 * Get timezone offset name
 * @param input - Date input
 * @param timezone - IANA timezone string
 * @returns Timezone offset string (e.g., 'GMT+9') or null
 *
 * @example
 * getTimezoneOffset(new Date(), 'Asia/Seoul') // 'GMT+9'
 */
export function getTimezoneOffset(input: DateInput, timezone: string): string | null {
  const dt = toTimezone(input, timezone)
  if (!isValidDateTime(dt)) return null
  return dt.offsetNameShort
}

// ============================================================================
// TIME MANIPULATION FUNCTIONS
// ============================================================================

/**
 * Get start of day
 * @param input - Date input
 * @returns DateTime at start of day (00:00:00) or null
 *
 * @example
 * startOfDay(new Date()) // 2024-12-11 00:00:00
 */
export function startOfDay(input: DateInput): DateTimeResult {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.startOf('day')
}

/**
 * Get end of day
 * @param input - Date input
 * @returns DateTime at end of day (23:59:59.999) or null
 *
 * @example
 * endOfDay(new Date()) // 2024-12-11 23:59:59.999
 */
export function endOfDay(input: DateInput): DateTimeResult {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.endOf('day')
}

/**
 * Get start of week (Monday)
 * @param input - Date input
 * @returns DateTime at start of week or null
 *
 * @example
 * startOfWeek(new Date()) // Start of current week (Monday)
 */
export function startOfWeek(input: DateInput): DateTimeResult {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.startOf('week')
}

/**
 * Get end of week (Sunday)
 * @param input - Date input
 * @returns DateTime at end of week or null
 *
 * @example
 * endOfWeek(new Date()) // End of current week (Sunday)
 */
export function endOfWeek(input: DateInput): DateTimeResult {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.endOf('week')
}

/**
 * Get start of month
 * @param input - Date input
 * @returns DateTime at start of month or null
 *
 * @example
 * startOfMonth(new Date()) // 2024-12-01 00:00:00
 */
export function startOfMonth(input: DateInput): DateTimeResult {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.startOf('month')
}

/**
 * Get end of month
 * @param input - Date input
 * @returns DateTime at end of month or null
 *
 * @example
 * endOfMonth(new Date()) // 2024-12-31 23:59:59.999
 */
export function endOfMonth(input: DateInput): DateTimeResult {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.endOf('month')
}

/**
 * Get start of quarter
 * @param input - Date input
 * @returns DateTime at start of quarter or null
 *
 * @example
 * startOfQuarter(new Date()) // Start of Q4 2024 (2024-10-01)
 */
export function startOfQuarter(input: DateInput): DateTimeResult {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.startOf('quarter')
}

/**
 * Get end of quarter
 * @param input - Date input
 * @returns DateTime at end of quarter or null
 *
 * @example
 * endOfQuarter(new Date()) // End of Q4 2024 (2024-12-31)
 */
export function endOfQuarter(input: DateInput): DateTimeResult {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.endOf('quarter')
}

/**
 * Get start of year
 * @param input - Date input
 * @returns DateTime at start of year or null
 *
 * @example
 * startOfYear(new Date()) // 2024-01-01 00:00:00
 */
export function startOfYear(input: DateInput): DateTimeResult {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.startOf('year')
}

/**
 * Get end of year
 * @param input - Date input
 * @returns DateTime at end of year or null
 *
 * @example
 * endOfYear(new Date()) // 2024-12-31 23:59:59.999
 */
export function endOfYear(input: DateInput): DateTimeResult {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.endOf('year')
}

// ============================================================================
// CONVERSION FUNCTIONS
// ============================================================================

/**
 * Convert to Unix timestamp (seconds)
 * @param input - Date input
 * @returns Unix timestamp in seconds or null
 *
 * @example
 * toTimestamp(new Date()) // 1702300000
 */
export function toTimestamp(input: DateInput): number | null {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.toUnixInteger()
}

/**
 * Convert to milliseconds timestamp
 * @param input - Date input
 * @returns Timestamp in milliseconds or null
 *
 * @example
 * toMillis(new Date()) // 1702300000000
 */
export function toMillis(input: DateInput): number | null {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.toMillis()
}

/**
 * Convert to JavaScript Date object
 * @param input - Date input
 * @returns JavaScript Date or null
 *
 * @example
 * toJSDate('2024-12-11') // Date object
 */
export function toJSDate(input: DateInput): Date | null {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.toJSDate()
}

/**
 * Convert to ISO string
 * @param input - Date input
 * @returns ISO string or null
 *
 * @example
 * toISOString(new Date()) // '2024-12-11T14:30:00.000+07:00'
 */
export function toISOString(input: DateInput): string | null {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.toISO()
}

// ============================================================================
// COMPARISON FUNCTIONS
// ============================================================================

/**
 * Check if two dates are the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if same day
 *
 * @example
 * isSameDay(new Date(), new Date()) // true
 */
export function isSameDay(date1: DateInput, date2: DateInput): boolean {
  const dt1 = toDateTime(date1)
  const dt2 = toDateTime(date2)
  if (!isValidDateTime(dt1) || !isValidDateTime(dt2)) return false
  return dt1.hasSame(dt2, 'day')
}

/**
 * Check if date1 is after date2
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if date1 is after date2
 *
 * @example
 * isAfter('2024-12-12', '2024-12-11') // true
 */
export function isAfter(date1: DateInput, date2: DateInput): boolean {
  const dt1 = toDateTime(date1)
  const dt2 = toDateTime(date2)
  if (!isValidDateTime(dt1) || !isValidDateTime(dt2)) return false
  return dt1 > dt2
}

/**
 * Check if date1 is before date2
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if date1 is before date2
 *
 * @example
 * isBefore('2024-12-10', '2024-12-11') // true
 */
export function isBefore(date1: DateInput, date2: DateInput): boolean {
  const dt1 = toDateTime(date1)
  const dt2 = toDateTime(date2)
  if (!isValidDateTime(dt1) || !isValidDateTime(dt2)) return false
  return dt1 < dt2
}

/**
 * Check if date is between start and end (inclusive)
 * @param date - Date to check
 * @param start - Start date
 * @param end - End date
 * @returns True if date is between start and end
 *
 * @example
 * isBetween('2024-12-11', '2024-12-10', '2024-12-12') // true
 */
export function isBetween(date: DateInput, start: DateInput, end: DateInput): boolean {
  const dt = toDateTime(date)
  const dtStart = toDateTime(start)
  const dtEnd = toDateTime(end)
  if (!isValidDateTime(dt) || !isValidDateTime(dtStart) || !isValidDateTime(dtEnd)) return false
  return dt >= dtStart && dt <= dtEnd
}

// ============================================================================
// DATE INFO FUNCTIONS
// ============================================================================

/**
 * Get quarter number (1-4)
 * @param input - Date input
 * @returns Quarter number or null
 *
 * @example
 * getQuarter(new Date('2024-12-11')) // 4
 */
export function getQuarter(input: DateInput): number | null {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.quarter
}

/**
 * Get week number of year
 * @param input - Date input
 * @returns Week number or null
 *
 * @example
 * getWeekNumber(new Date('2024-12-11')) // 50
 */
export function getWeekNumber(input: DateInput): number | null {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.weekNumber
}

/**
 * Get day of year (1-366)
 * @param input - Date input
 * @returns Day of year or null
 *
 * @example
 * getDayOfYear(new Date('2024-12-11')) // 346
 */
export function getDayOfYear(input: DateInput): number | null {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.ordinal
}

/**
 * Check if year is leap year
 * @param input - Date input
 * @returns True if leap year or null if invalid
 *
 * @example
 * isLeapYear(new Date('2024-12-11')) // true
 */
export function isLeapYear(input: DateInput): boolean | null {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.isInLeapYear
}

/**
 * Get days in month
 * @param input - Date input
 * @returns Number of days in month or null
 *
 * @example
 * getDaysInMonth(new Date('2024-02-11')) // 29 (leap year)
 */
export function getDaysInMonth(input: DateInput): number | null {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.daysInMonth ?? null
}

// ============================================================================
// RELATIVE TIME FUNCTIONS
// ============================================================================

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param input - Date input
 * @param locale - Locale for formatting (default: 'en')
 * @returns Relative time string or null
 *
 * @example
 * getRelativeTime(new Date(Date.now() - 3600000)) // '1 hour ago'
 */
export function getRelativeTime(input: DateInput, locale: string = 'en'): string | null {
  const dt = toDateTime(input)
  if (!isValidDateTime(dt)) return null
  return dt.setLocale(locale).toRelative()
}

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

/** @deprecated Use formatDateEU instead */
export const formatDateOnly = formatDateEU

/** @deprecated Use formatTime instead */
export const formatTimeOnly = formatTime
