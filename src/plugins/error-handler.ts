import type { App, ComponentPublicInstance } from 'vue'

const logError = (error: Error, info?: string): void => {
  if (import.meta.env.DEV) {
    console.error('Vue Error:', error)
    if (info) console.error('Error Info:', info)
  } else {
    // In production, you might want to send to error tracking service
    // Example: Sentry.captureException(error, { extra: { info } })
    console.error('Application Error:', error.message)
  }
}

export function setupGlobalErrorHandler(app: App): void {
  // Global error handler for uncaught errors
  app.config.errorHandler = (error: unknown, _vm: ComponentPublicInstance | null, info: string) => {
    const errorInstance = error instanceof Error ? error : new Error(String(error))
    logError(errorInstance, info)
  }

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(new Error(event.reason), 'Unhandled Promise Rejection')

    // Prevent the default browser error logging
    if (!import.meta.env.DEV) {
      event.preventDefault()
    }
  })
}
