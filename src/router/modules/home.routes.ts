import type { RouteRecordRaw } from 'vue-router'

import { ROUTE_NAMES } from '@/constants'

export const homeRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: ROUTE_NAMES.HOME,
    component: () => import('@/views/Home/HomeView.vue'),
    meta: {
      title: 'Home',
    },
  },
]
