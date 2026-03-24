import { createPinia } from 'pinia'

import type { App } from 'vue'

import router from '@/router'

import { setupGlobalErrorHandler } from './error-handler'
import { setupGlobalComponents } from './global-components'
import { i18n } from './i18n'
import { setupPrimeVue } from './primevue'

export function setupPlugins(app: App): void {
  // State management
  app.use(createPinia())

  // Router
  app.use(router)

  // I18n
  app.use(i18n)

  // UI Library
  setupPrimeVue(app)

  // Global components
  setupGlobalComponents(app)

  // Error handling
  setupGlobalErrorHandler(app)
}
