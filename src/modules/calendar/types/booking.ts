import type { BookingStatusType } from '../constants/bookingStatus'

export interface BookingClient {
  clientId: number
  clientName: string
  mobileNumber: string | null
}

export interface BookingService {
  serviceId: number
  serviceName: string
  duration: number
  price: number
}

export interface BookingStaff {
  staffId: number
  staffName: string
}

export interface Booking {
  bookingId: number
  shopId: number
  client: BookingClient
  staff: BookingStaff
  services: BookingService[]
  bookingDate: string
  startTime: string
  endTime: string
  status: BookingStatusType
  totalAmount: number
  notes: string | null
  createdAt: string
  modifiedAt: string
}

export interface BookingCreatePayload {
  clientId: number
  staffId: number
  serviceIds: number[]
  bookingDate: string
  startTime: string
  notes: string | null
}

export interface BookingListParams {
  shopId: number
  fromDate: string
  toDate: string
  staffId: number | null
  status: BookingStatusType | null
  first: number
  rows: number
}

export interface BookingListResult {
  data: Booking[]
  totalRecords: number
}
