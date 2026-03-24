import { createApp } from 'vue'

import App from './App.vue'
import { getStoredLocale } from './composables/useI18n'
import { appConfig } from './config/app'
import { defaultLocale } from './locales'
import { setupPlugins } from './plugins'
import { setI18nLanguage } from './plugins/i18n'

import './assets/css/global.css'
import 'primeicons/primeicons.css'

function bootstrap(): void {
  const app = createApp(App)

  // Setup all plugins
  setupPlugins(app)

  // Initialize locale from sessionStorage or default
  const initialLocale = getStoredLocale() ?? defaultLocale
  setI18nLanguage(initialLocale)

  // Development enhancements
  if (appConfig.enableDevTools) {
    // Enable Vue devtools in development
    app.config.performance = true
  }

  // Mount the app
  app.mount('#app')

  // Log app info in development
  if (appConfig.isDevelopment) {
    console.warn(`🚀 ${appConfig.name} v${appConfig.version} is running in development mode`)
  }
}

// Start the application
bootstrap()
