// Public API — only export what other modules may need

// Types for cross-module use (e.g. dashboard showing upcoming bookings)
export type { BookingStatusType } from './constants/bookingStatus'
export { BOOKING_STATUS } from './constants/bookingStatus'
export type { Booking, BookingClient, BookingService, BookingStaff } from './types/booking'
export type { CalendarEvent, CalendarViewMode } from './types/calendar'

// Route names for cross-module navigation
export type { CalendarRouteNameType } from './routes'
export { CALENDAR_ROUTE_NAMES } from './routes'
