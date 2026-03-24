import Cookies from 'js-cookie'

/**
 * Storage utility functions for localStorage, sessionStorage, and cookies
 * Provides strongly typed interfaces for common storage operations
 */

// ============================================================================
// LOCAL STORAGE UTILITIES
// ============================================================================

/**
 * Sets an item in localStorage with JSON serialization
 * @param key - The storage key
 * @param value - The value to store (will be JSON serialized)
 *
 * @example
 * // Store a user object
 * setLocalStorageItem('user', { id: 1, name: 'John', email: 'john@example.com' })
 * // Store a simple string
 * setLocalStorageItem('theme', 'dark')
 */
export const setLocalStorageItem = (key: string, value: unknown): void => {
  try {
    const serializedValue = JSON.stringify(value)
    localStorage.setItem(key, serializedValue)
  } catch (error) {
    throw new Error(
      `Failed to set localStorage item '${key}': ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

/**
 * Retrieves an item from localStorage with JSON deserialization
 * @param key - The storage key
 * @returns The deserialized value or null if not found
 *
 * @example
 * // Retrieve a user object
 * const user = getLocalStorageItem<User>('user')
 * // user: { id: 1, name: 'John', email: 'john@example.com' } | null
 *
 * // Retrieve a simple string
 * const theme = getLocalStorageItem<string>('theme')
 * // theme: 'dark' | null
 */
export const getLocalStorageItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return null
    }
    return JSON.parse(item) as T
  } catch (error) {
    throw new Error(
      `Failed to get localStorage item '${key}': ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

/**
 * Removes an item from localStorage
 * @param key - The storage key to remove
 */
export const removeLocalStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    throw new Error(
      `Failed to remove localStorage item '${key}': ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

/**
 * Clears all items from localStorage
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.clear()
  } catch (error) {
    throw new Error(
      `Failed to clear localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

// ============================================================================
// SESSION STORAGE UTILITIES
// ============================================================================

/**
 * Sets an item in sessionStorage with JSON serialization
 * @param key - The storage key
 * @param value - The value to store (will be JSON serialized)
 *
 * @example
 * // Store a temporary form data
 * setSessionStorageItem('formData', { step: 2, data: { name: 'John' } })
 * // Store a simple string
 * setSessionStorageItem('tempToken', 'abc123')
 */
export const setSessionStorageItem = (key: string, value: unknown): void => {
  try {
    const serializedValue = JSON.stringify(value)
    sessionStorage.setItem(key, serializedValue)
  } catch (error) {
    throw new Error(
      `Failed to set sessionStorage item '${key}': ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

/**
 * Retrieves an item from sessionStorage with JSON deserialization
 * @param key - The storage key
 * @returns The deserialized value or null if not found
 *
 * @example
 * // Retrieve form data
 * const formData = getSessionStorageItem<{ step: number; data: Record<string, unknown> }>('formData')
 * // formData: { step: 2, data: { name: 'John' } } | null
 *
 * // Retrieve a simple string
 * const tempToken = getSessionStorageItem<string>('tempToken')
 * // tempToken: 'abc123' | null
 */
export const getSessionStorageItem = <T>(key: string): T | null => {
  try {
    const item = sessionStorage.getItem(key)
    if (item === null) {
      return null
    }
    return JSON.parse(item) as T
  } catch (error) {
    throw new Error(
      `Failed to get sessionStorage item '${key}': ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

/**
 * Removes an item from sessionStorage
 * @param key - The storage key to remove
 */
export const removeSessionStorageItem = (key: string): void => {
  try {
    sessionStorage.removeItem(key)
  } catch (error) {
    throw new Error(
      `Failed to remove sessionStorage item '${key}': ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

/**
 * Clears all items from sessionStorage
 */
export const clearSessionStorage = (): void => {
  try {
    sessionStorage.clear()
  } catch (error) {
    throw new Error(
      `Failed to clear sessionStorage: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

// ============================================================================
// COOKIE UTILITIES
// ============================================================================

/**
 * Sets a cookie with JSON serialization
 * @param key - The cookie name
 * @param value - The value to store (will be JSON serialized)
 * @param options - Optional cookie attributes (expires, path, domain, secure, etc.)
 *
 * @example
 * // Set a user preference cookie
 * setCookie('userPreferences', { theme: 'dark', language: 'en' }, { expires: 7 })
 * // Set a simple string cookie
 * setCookie('sessionId', 'abc123', { secure: true, sameSite: 'strict' })
 */
export const setCookie = (
  key: string,
  value: unknown,
  options?: Cookies.CookieAttributes,
): void => {
  try {
    const serializedValue = JSON.stringify(value)
    Cookies.set(key, serializedValue, options)
  } catch (error) {
    throw new Error(
      `Failed to set cookie '${key}': ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

/**
 * Retrieves a cookie with JSON deserialization
 * @param key - The cookie name
 * @returns The deserialized value or null if not found
 *
 * @example
 * // Retrieve user preferences
 * const preferences = getCookie<{ theme: string; language: string }>('userPreferences')
 * // preferences: { theme: 'dark', language: 'en' } | null
 *
 * // Retrieve a simple string cookie
 * const sessionId = getCookie<string>('sessionId')
 * // sessionId: 'abc123' | null
 */
export const getCookie = <T>(key: string): T | null => {
  try {
    const cookieValue = Cookies.get(key)
    if (cookieValue === undefined) {
      return null
    }
    return JSON.parse(cookieValue) as T
  } catch (error) {
    throw new Error(
      `Failed to get cookie '${key}': ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

/**
 * Removes a cookie
 * @param key - The cookie name to remove
 * @param options - Optional cookie attributes for removal (path, domain)
 */
export const removeCookie = (key: string, options?: Cookies.CookieAttributes): void => {
  try {
    Cookies.remove(key, options)
  } catch (error) {
    throw new Error(
      `Failed to remove cookie '${key}': ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Checks if localStorage is available and accessible
 * @returns true if localStorage is available, false otherwise
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Checks if sessionStorage is available and accessible
 * @returns true if sessionStorage is available, false otherwise
 */
export const isSessionStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__'
    sessionStorage.setItem(testKey, 'test')
    sessionStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Gets the total size of localStorage in bytes
 * @returns The total size in bytes or null if not available
 */
export const getLocalStorageSize = (): number | null => {
  if (!isLocalStorageAvailable()) {
    return null
  }

  let totalSize = 0
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      const value = localStorage.getItem(key)
      if (value !== null) {
        totalSize += key.length + value.length
      }
    }
  }
  return totalSize
}

/**
 * Gets the total size of sessionStorage in bytes
 * @returns The total size in bytes or null if not available
 */
export const getSessionStorageSize = (): number | null => {
  if (!isSessionStorageAvailable()) {
    return null
  }

  let totalSize = 0
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i)
    if (key) {
      const value = sessionStorage.getItem(key)
      if (value !== null) {
        totalSize += key.length + value.length
      }
    }
  }
  return totalSize
}
