import { type LocationQueryRaw, type NavigationFailure, useRouter } from 'vue-router'

import type { RouteNameType } from '@/constants'

interface NavigateOptions {
  params?: Record<string, string | number>
  query?: LocationQueryRaw
}

/**
 * Router navigation composable for type-safe navigation using route name constants
 */
export const useRouterNavigation = () => {
  const router = useRouter()

  /**
   * Navigate to a route by name with optional params and query
   * @param name - The route name to navigate to
   * @param options - Optional params and query parameters
   * @returns Promise that resolves when navigation completes
   */
  const navigateTo = (
    name: RouteNameType,
    options?: NavigateOptions,
  ): Promise<NavigationFailure | void | undefined> => {
    return router.push({ name, ...options })
  }

  /**
   * Replace current route with a new route by name
   * @param name - The route name to replace with
   * @param options - Optional params and query parameters
   * @returns Promise that resolves when navigation completes
   */
  const replaceTo = (
    name: RouteNameType,
    options?: NavigateOptions,
  ): Promise<NavigationFailure | void | undefined> => {
    return router.replace({ name, ...options })
  }

  /**
   * Safely navigate to a route with error handling
   * @param name - The route name to navigate to
   * @param options - Optional params and query parameters
   * @returns Promise that resolves to true if navigation succeeded, false otherwise
   */
  const navigateToSafely = async (
    name: RouteNameType,
    options?: NavigateOptions,
  ): Promise<boolean> => {
    try {
      await router.push({ name, ...options })
      return true
    } catch (error) {
      console.error('Navigation failed:', error)
      return false
    }
  }

  /**
   * Check if the current route matches the given route name
   * @param name - The route name to check against
   * @returns True if current route matches the given name
   */
  const isCurrentRoute = (name: RouteNameType): boolean => {
    return router.currentRoute.value.name === name
  }

  /**
   * Check if the current route matches any of the given route names
   * @param names - Array of route names to check against
   * @returns True if current route matches any of the given names
   */
  const isCurrentRouteIn = (names: RouteNameType[]): boolean => {
    return names.includes(router.currentRoute.value.name as RouteNameType)
  }

  /**
   * Get the current route name
   * @returns Current route name or null if not found
   */
  const getCurrentRouteName = (): RouteNameType | null => {
    return router.currentRoute.value.name as RouteNameType | null
  }

  /**
   * Navigate back in history
   */
  const goBack = (): void => {
    router.back()
  }

  /**
   * Navigate forward in history
   */
  const goForward = (): void => {
    router.forward()
  }

  return {
    // Navigation functions
    navigateTo,
    replaceTo,
    navigateToSafely,

    // Route matching functions
    isCurrentRoute,
    isCurrentRouteIn,
    getCurrentRouteName,

    // History navigation
    goBack,
    goForward,
  }
}
