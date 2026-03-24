import { createI18n } from 'vue-i18n'

import { defaultLocale, type Locale, messages } from '@/locales'

export const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  messages,
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false,
})

export const setI18nLanguage = (locale: Locale): void => {
  i18n.global.locale.value = locale

  if (typeof document !== 'undefined') {
    document.querySelector('html')?.setAttribute('lang', locale)
  }
}
