import { createRouter, createWebHistory, type RouterScrollBehavior } from 'vue-router'

import { ROUTE_NAMES } from '@/constants'
import { appConfig } from '@/config/app'

import { adminRoutes } from '@/modules/admin/routes'
import { calendarRoutes } from '@/modules/calendar/routes'
import { authRoutes } from '@/router/modules/auth.routes'
import { homeRoutes } from '@/router/modules/home.routes'

import { setupRouterGuards } from './guards'

/**
 * Scroll behavior configuration
 * Handles scroll position restoration and smooth scrolling
 */
const scrollBehavior: RouterScrollBehavior = (to, from, savedPosition) => {
  // If there's a saved position (back/forward navigation), restore it
  if (savedPosition) {
    return savedPosition
  }

  // If route has a hash, scroll to the element with that hash
  if (to.hash) {
    return {
      el: to.hash,
      behavior: 'smooth',
      top: 80, // Offset for fixed header if needed
    }
  }

  // Check if both routes share the same parent route
  // If so, don't scroll to top (useful for sibling navigation within nested routes)
  if (to.matched.length > 1 && from.matched.length > 1) {
    const toParent = to.matched[to.matched.length - 2]
    const fromParent = from.matched[from.matched.length - 2]

    if (toParent === fromParent) {
      return false
    }
  }

  // Default: scroll to top with smooth behavior
  return { top: 0, behavior: 'smooth' }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior,
  routes: [
    // Auth routes (no layout wrapper, handled in auth.routes.ts)
    ...authRoutes,
    // Main application routes (with MainLayout wrapper)
    {
      path: '/',
      component: () => import('@/components/layouts/MainLayout.vue'),
      meta: {
        requiresAuth: true,
      },
      children: [
        ...homeRoutes,
        // Module routes — each module defines its own routes in modules/<name>/routes.ts
        ...adminRoutes,
        ...calendarRoutes,
      ],
    },
    // Catch-all 404 route
    {
      path: '/:pathMatch(.*)*',
      name: ROUTE_NAMES.NOT_FOUND,
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

// Setup router guards
setupRouterGuards(router)

// Update document title after each navigation
router.afterEach((to) => {
  const title = to.meta.title
  document.title = title ? `${title} | ${appConfig.name}` : appConfig.name
})

// Handle router errors (e.g., navigation failures)
router.onError((error) => {
  console.error('Router error:', error)
})

export default router
