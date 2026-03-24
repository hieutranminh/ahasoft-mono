import { computed } from 'vue'
import { useI18n as vueUseI18n } from 'vue-i18n'

import { availableLocales, defaultLocale, type Locale } from '@/locales'
import { setI18nLanguage } from '@/plugins/i18n'

const LOCALE_STORAGE_KEY = 'app_locale'

// Mapping from backend language codes (uppercase) to app locale codes (lowercase)
const BACKEND_LANGUAGE_TO_LOCALE: Record<string, Locale> = {
  EN: 'en',
  KO: 'ko',
  VI: 'vi',
}

/**
 * Maps a backend language code (e.g. "EN", "KO") to our app Locale.
 * Returns defaultLocale if the code is unknown.
 */
export function mapBackendLanguageToLocale(backendLanguage: string): Locale {
  return BACKEND_LANGUAGE_TO_LOCALE[backendLanguage.toUpperCase()] ?? defaultLocale
}

export function getStoredLocale(): Locale | null {
  const stored = sessionStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored && (availableLocales as readonly string[]).includes(stored)) {
    return stored as Locale
  }
  return null
}

export function persistLocale(locale: Locale): void {
  setI18nLanguage(locale)
  sessionStorage.setItem(LOCALE_STORAGE_KEY, locale)
}

export function useI18n() {
  const i18n = vueUseI18n()

  const changeLocale = (newLocale: Locale): void => {
    persistLocale(newLocale)
  }

  return {
    ...i18n,
    changeLocale,
    currentLocale: computed(() => i18n.locale.value as Locale),
  }
}
