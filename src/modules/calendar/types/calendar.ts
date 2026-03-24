import type { BookingStatusType } from '../constants/bookingStatus'

export type CalendarViewMode = 'day' | 'week' | 'month'

export interface CalendarEvent {
  bookingId: number
  title: string
  start: string
  end: string
  staffId: number
  staffName: string
  status: BookingStatusType
  clientName: string
}

export interface TimeSlot {
  startTime: string
  endTime: string
  available: boolean
  staffId: number
}

export interface TimeSlotQuery {
  shopId: number
  staffId: number
  date: string
  serviceIds: number[]
}
