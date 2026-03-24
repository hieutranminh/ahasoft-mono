import type { RouteRecordRaw } from 'vue-router'

export const CALENDAR_ROUTE_NAMES = {
  CALENDAR_VIEW: 'calendar-view',
  BOOKING_CREATE: 'booking-create',
  BOOKING_DETAIL: 'booking-detail',
} as const

export type CalendarRouteNameType = (typeof CALENDAR_ROUTE_NAMES)[keyof typeof CALENDAR_ROUTE_NAMES]

export const calendarRoutes: RouteRecordRaw[] = [
  {
    path: 'calendar',
    meta: { title: 'Calendar', module: 'calendar' },
    children: [
      {
        path: '',
        name: CALENDAR_ROUTE_NAMES.CALENDAR_VIEW,
        component: () => import('./views/CalendarView.vue'),
        meta: { title: 'Calendar', module: 'calendar' },
      },
      {
        path: 'booking/new',
        name: CALENDAR_ROUTE_NAMES.BOOKING_CREATE,
        component: () => import('./views/BookingCreate.vue'),
        meta: { title: 'Create Booking', module: 'calendar' },
      },
      {
        path: 'booking/:id',
        name: CALENDAR_ROUTE_NAMES.BOOKING_DETAIL,
        component: () => import('./views/BookingDetail.vue'),
        meta: { title: 'Booking Detail', module: 'calendar' },
      },
    ],
  },
]
