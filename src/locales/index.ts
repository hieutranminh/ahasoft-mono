import en from './en'
import ko from './ko'
import vi from './vi'

export const messages = {
  en,
  vi,
  ko,
}

export const availableLocales = ['en', 'vi', 'ko'] as const

export type Locale = (typeof availableLocales)[number]

export const defaultLocale: Locale = 'ko'
