import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import checker from 'vite-plugin-checker'
import { VitePWA } from 'vite-plugin-pwa'
import stylelint from 'vite-plugin-stylelint'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
// Build configuration type
interface BuildConfigInfo {
  sourcemap: boolean | 'hidden'
  minify: boolean
  cssSourcemap: boolean
}

// Build configuration based on mode
const getBuildConfig = (mode: string): BuildConfigInfo => {
  const isLocalhostOrDev = mode === 'localhost' || mode === 'development'
  const isProdOrStaging = mode === 'production' || mode === 'staging'

  return {
    sourcemap: mode === 'staging' ? 'hidden' : !isProdOrStaging,
    minify: isProdOrStaging,
    cssSourcemap: isLocalhostOrDev,
  }
}

export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '')

  // Determine if devtools should be enabled
  const enableDevTools = mode === 'localhost' || mode === 'development'

  // Determine if PWA should be enabled (only in staging/production)
  const enablePwa = env.VITE_ENABLE_PWA === 'true'

  // Get build configuration
  const buildConfig = getBuildConfig(mode)

  return {
    plugins: [
      vue(),
      // Only enable devtools in local/development modes
      ...(enableDevTools ? [vueDevTools()] : []),
      Components({
        resolvers: [PrimeVueResolver()],
      }),
      // PWA support - always included, disabled when VITE_ENABLE_PWA !== 'true'
      // Plugin must always be present so virtual:pwa-register/vue module is resolvable
      VitePWA({
        disable: !enablePwa,
        strategies: 'injectManifest',
        srcDir: 'src/sw',
        filename: 'sw.ts',
        registerType: 'prompt',
        injectRegister: false,
        manifest: {
          name: env.VITE_APP_NAME ?? 'Ahasoft System',
          short_name: env.VITE_APP_NAME ?? 'Ahasoft',
          description: 'Ahasoft Management System',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        injectManifest: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        },
        devOptions: {
          enabled: false,
        },
      }),
      // Only enable checker in non-production builds
      ...(mode !== 'production'
        ? [
            checker({
              // TypeScript type checking
              typescript: {
                buildMode: true,
                tsconfigPath: './tsconfig.app.json',
              },
              // ESLint checking with flat config
              eslint: {
                useFlatConfig: true,
                lintCommand: 'eslint "./src/**/*.{ts,vue}"',
                // Ensure errors are shown, not just in terminal
                dev: {
                  logLevel: ['error', 'warning'],
                },
              },
              // Overlay configuration for error display
              overlay: {
                initialIsOpen: true,
                position: 'br',
                badgeStyle:
                  'margin: 0; padding: 8px; background: #ef4444; color: white; border-radius: 8px 0 0 0;',
              },
              // Don't block build on errors
              enableBuild: false,
              // Terminal output settings
              terminal: true,
            }),
            // Stylelint checking for CSS/SCSS
            stylelint({
              // Lint Vue, SCSS, and CSS files
              include: ['src/**/*.{vue,scss,css}'],
              // Show errors in dev server overlay
              dev: true,
              // Don't block build on errors
              build: false,
              // Cache for better performance
              cache: true,
              // Fix auto-fixable issues on save (optional, set to true if desired)
              fix: false,
            }),
          ]
        : []),
    ],
    define: {
      __APP_ENV__: JSON.stringify(mode),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __BUILD_CONFIG__: JSON.stringify(buildConfig),
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      // Enable source maps in dev mode to see which file styles come from in devtools
      devSourcemap: enableDevTools,
      preprocessorOptions: {
        scss: {
          api: 'modern',
          additionalData: `@use "@/assets/scss/mixins.scss" as *;`,
        },
      },
    },
    build: {
      // Production optimizations
      sourcemap: buildConfig.sourcemap,
      // Minification settings based on environment
      minify: buildConfig.minify ? 'esbuild' : false,
      // Chunk size warning
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia'],
            primevue: ['primevue'],
            utils: ['luxon', 'axios'],
          },
        },
      },
    },
    server: {
      host: true,
      port: parseInt(env.VITE_DEV_PORT ?? '8080', 10),
      // Proxy configuration for localhost development
      proxy:
        mode === 'localhost'
          ? {
              '/api': {
                target: env.VITE_GATEWAY_BASE_URL ?? 'https://localhost:44001',
                changeOrigin: true,
                rewrite: (path: string) => path.replace(/^\/api/, ''),
              },
            }
          : undefined,
    },
    preview: {
      port: parseInt(env.VITE_PREVIEW_PORT ?? '8000', 10),
    },
    optimizeDeps: {
      // Pre-bundle PrimeVue components and other lazy-loaded dependencies
      // to prevent page reload when switching between async components
      include: [
        // PrimeVue components
        'primevue/avatar',
        'primevue/badge',
        'primevue/button',
        'primevue/calendar',
        'primevue/card',
        'primevue/checkbox',
        'primevue/colorpicker',
        'primevue/column',
        'primevue/columngroup',
        'primevue/datatable',
        'primevue/datepicker',
        'primevue/dialog',
        'primevue/divider',
        'primevue/dropdown',
        'primevue/editor',
        'primevue/fileupload',
        'primevue/iconfield',
        'primevue/inputicon',
        'primevue/inputmask',
        'primevue/inputnumber',
        'primevue/inputtext',
        'primevue/message',
        'primevue/multiselect',
        'primevue/panel',
        'primevue/password',
        'primevue/progressspinner',
        'primevue/radiobutton',
        'primevue/rating',
        'primevue/row',
        'primevue/select',
        'primevue/selectbutton',
        'primevue/skeleton',
        'primevue/tag',
        'primevue/textarea',
        'primevue/togglebutton',
        'primevue/toggleswitch',
        'primevue/tooltip',
        'primevue/useconfirm',
        'primevue/usetoast',
        'primevue/breadcrumb',
        'primevue/autocomplete',
        'primevue/inputgroup',
        'primevue/toast',
        'primevue/ripple',
        'primevue/menu',
        // Third-party dependencies
        'yup',
        'axios',
        'luxon',
        'quill',
        'vue-currency-input',
      ],
    },
  }
})
