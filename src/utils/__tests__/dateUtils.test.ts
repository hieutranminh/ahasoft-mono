import { describe, expect, it } from 'vitest'

import { formatDate, formatDateOnly, formatTimeOnly } from '../dateUtils'

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = '2024-01-15T10:30:00Z'
      const formatted = formatDate(date)
      expect(formatted).toBeTruthy()
      expect(typeof formatted).toBe('string')
      expect(formatted).toContain('15/01/2024')
    })

    it('should handle invalid date', () => {
      const invalidDate = 'invalid-date'
      const formatted = formatDate(invalidDate)
      expect(formatted).toBe('invalid-date')
    })

    it('should handle null/undefined', () => {
      expect(formatDate(null)).toBe('-')
      expect(formatDate(undefined)).toBe('-')
    })

    it('should use custom format', () => {
      const date = '2024-01-15T10:30:00Z'
      const formatted = formatDate(date, 'YYYY-MM-DD')
      expect(formatted).toBe('2024-01-15')
    })
  })

  describe('formatDateOnly', () => {
    it('should format date without time', () => {
      const date = '2024-01-15T10:30:00Z'
      const formatted = formatDateOnly(date)
      expect(formatted).toBe('15/01/2024')
    })
  })

  describe('formatTimeOnly', () => {
    it('should format time only', () => {
      const date = '2024-01-15T10:30:00Z'
      const formatted = formatTimeOnly(date)
      expect(formatted).toMatch(/\d{2}:\d{2}/)
    })
  })
})
