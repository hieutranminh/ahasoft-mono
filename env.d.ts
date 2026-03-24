/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/vue" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

interface ImportMetaEnv {
  // Application Configuration
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENV?: string

  // Gateway & API Configuration
  readonly VITE_GATEWAY_BASE_URL: string
  readonly VITE_API_TIMEOUT?: string

  // Notification Configuration
  readonly VITE_NOTIFICATION_URL?: string

  // Login URLs
  readonly VITE_LOGIN_URL_DEFAULT?: string
  readonly VITE_LOGIN_URL_KR?: string

  // Mobile App Parameters
  readonly VITE_PARAM_MOBILE_APP?: string
  readonly VITE_PARAM_VERSION?: string

  // Azure Storage URLs
  readonly VITE_AZURE_STORAGE_BOARD_URL?: string
  readonly VITE_AZURE_STORAGE_MESSAGE_URL?: string
  readonly VITE_AZURE_STORAGE_CLIENT_URL?: string
  readonly VITE_AZURE_STORAGE_ADMINS_URL?: string

  // Third-party Keys
  readonly VITE_IAMPORT_KEY?: string
  readonly VITE_ARS_MID_ID?: string

  // Feature Flags
  readonly VITE_ENABLE_DEVTOOLS?: string
  readonly VITE_ENABLE_MOCK_API?: string
  readonly VITE_ENABLE_DEBUG_MODE?: string

  // Logging Configuration
  readonly VITE_LOG_LEVEL?: string

  // Analytics & Monitoring
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_GA_TRACKING_ID?: string

  // Dev Server Configuration
  readonly VITE_DEV_PORT?: string
  readonly VITE_PREVIEW_PORT?: string

  // PWA Configuration
  readonly VITE_ENABLE_PWA?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
