import type { RouteRecordRaw } from 'vue-router'

import { ROUTE_NAMES } from '@/constants'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: () => import('@/components/layouts/AuthLayout.vue'),
    meta: {
      requiresGuest: true,
    },
    children: [
      {
        path: 'login',
        name: ROUTE_NAMES.LOGIN,
        component: () => import('@/views/Auth/LoginView.vue'),
        meta: {
          title: 'Login',
        },
      },
      {
        path: 'forgot-password',
        name: ROUTE_NAMES.FORGOT_PASSWORD,
        component: () => import('@/views/Auth/ForgotPassword.vue'),
        meta: {
          title: 'Forgot Password',
        },
      },
      {
        path: 'reset-password/:token',
        name: ROUTE_NAMES.RESET_PASSWORD,
        component: () => import('@/views/Auth/ResetPassword.vue'),
        meta: {
          title: 'Reset Password',
        },
      },
    ],
  },
  // Redirect /login to /auth/login for backward compatibility
  {
    path: '/login',
    redirect: { name: ROUTE_NAMES.LOGIN },
  },
  {
    path: '/forgot-password',
    redirect: { name: ROUTE_NAMES.FORGOT_PASSWORD },
  },
]
