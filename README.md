# Ahasoft - Front-end Coding Convention

> Common naming, coding rules & best practices for Front-end developers.
> Based on the current **ahasoft-build** codebase (Vue 3 + TypeScript + PrimeVue 4).

---

## Table of Contents

1. [Project Overview & Tech Stack](#1-project-overview--tech-stack)
2. [Editor & Formatting Configuration](#2-editor--formatting-configuration)
3. [File & Folder Structure](#3-file--folder-structure)
4. [Naming Conventions](#4-naming-conventions)
5. [Vue Component Conventions](#5-vue-component-conventions)
6. [Script Setup Organization](#6-script-setup-organization)
7. [TypeScript Conventions](#7-typescript-conventions)
8. [Composable Conventions](#8-composable-conventions)
9. [Pinia Store Conventions](#9-pinia-store-conventions)
10. [API & Service Layer Conventions](#10-api--service-layer-conventions)
11. [Form & Validation Conventions](#11-form--validation-conventions)
12. [CSS / SCSS Conventions](#12-css--scss-conventions)
13. [Error Handling Conventions](#13-error-handling-conventions)
14. [Constants & Configuration](#14-constants--configuration)
15. [Security Rules](#15-security-rules)
16. [ESLint & CI Rules Reference](#16-eslint--ci-rules-reference)

---

## 1. Project Overview & Tech Stack

| Category         | Technology                                  |
| ---------------- | ------------------------------------------- |
| Framework        | Vue 3 (Composition API, `<script setup>`)   |
| Language         | TypeScript (strict mode)                    |
| Build Tool       | Vite                                        |
| UI Library       | PrimeVue 4                                  |
| State Management | Pinia (setup stores)                        |
| Routing          | Vue Router 4                                |
| Form Validation  | VeeValidate + Yup                           |
| i18n             | vue-i18n (en, vi, ko)                       |
| HTTP Client      | Axios (with CQRS gateway)                   |
| Real-time        | SignalR (@microsoft/signalr)                |
| Date Library     | Luxon                                       |
| CSS              | SCSS (scoped) + PrimeVue design tokens      |
| Linting          | ESLint (flat config) + Prettier + Stylelint |
| Testing          | Vitest + Vue Test Utils                     |
| PWA              | Vite PWA (workbox, injectManifest)          |
| Package Manager  | pnpm                                        |

---

## 2. Editor & Formatting Configuration

The project enforces consistent formatting through three configuration files. **Do not override these settings in personal editor config.**

### EditorConfig (`.editorconfig`)

- Indent: **2 spaces** (all file types)
- Charset: UTF-8
- End of line: LF
- Trim trailing whitespace: yes
- Insert final newline: yes

### Prettier (`.prettierrc.json`)

| Setting         | Value    |
| --------------- | -------- |
| Semi            | `false`  |
| Single Quote    | `true`   |
| Print Width     | `100`    |
| Trailing Comma  | `all`    |
| Tab Width       | `2`      |
| Arrow Parens    | `always` |
| Bracket Spacing | `true`   |

### Validation Commands

```bash
# Run ALL checks (type-check + lint + format + stylelint)
pnpm validate

# Individual checks
pnpm type-check      # TypeScript type checking
pnpm lint            # ESLint auto-fix
pnpm lint:check      # ESLint check only (no fix)
pnpm format          # Prettier auto-fix
pnpm format:check    # Prettier check only
pnpm stylelint       # Stylelint auto-fix
```

Always run `pnpm validate` before pushing code.

---

## 3. File & Folder Structure

```
src/
├── api/               # API client, gateway service, domain APIs, interceptors
│   ├── services/      #   Domain API services (base, auth, admins)
│   └── interceptors/  #   Request/response interceptors, token refresh
│       ├── handlers/  #     HTTP status handlers
│       └── utils/     #     Error utility helpers
├── assets/            # CSS, SCSS, images
├── components/        # Reusable Vue components
│   ├── common/        #   Shared components (AppDataTable, AppEmpty, AppError, LanguageSwitcher, ...)
│   │   └── form/      #   Form field wrappers (BaseField, InputTextField, SelectField, ...)
│   ├── layouts/       #   Layout components (MainLayout, AuthLayout, AppHeader, AppFooter)
│   └── template/      #   Example/demo components (FormExamples, DatatableExample, ...)
├── composables/       # Vue composables (useAlert, useDataTable, useI18n, useRouterNavigation, ...)
├── config/            # App configuration (env, services)
├── constants/         # Typed constants (routes, auth, roles, dateFormat)
├── locales/           # i18n translation files (en, vi, ko)
├── modules/           # Feature modules (see Module Pattern below)
│   ├── admin/         #   Admin management (views, routes)
│   ├── calendar/      #   Calendar & booking (api, components, composables, stores, views)
│   └── signalr/       #   Real-time SignalR (api, composables, services, stores)
├── plugins/           # Vue plugins (PrimeVue, i18n, error handler)
├── router/            # Vue Router config, guards, route modules
├── schemas/           # Yup validation schemas
├── stores/            # Pinia stores (auth, loading, shop)
├── sw/                # Service worker (Workbox injectManifest: lifecycle, precache, routing)
├── test/              # Test setup (Vitest configuration)
├── types/             # TypeScript type definitions
├── utils/             # Pure utility functions (dateUtils, colorUtils, storageUtils)
├── views/             # Top-level page components (non-module pages)
│   ├── Auth/          #   LoginView, ForgotPassword, ResetPassword
│   └── Home/          #   HomeView
├── NotFound.vue       # 404 catch-all page
├── App.vue
└── main.ts
```

### Module Pattern

Feature modules live in `src/modules/<name>/` with this structure:

```
src/modules/<name>/
├── index.ts           # Public API — exports only what other modules need
├── routes.ts          # Route definitions with module-scoped route name constants
├── views/             # Page-level components (lazy-loaded in routes)
├── components/        # Module-specific UI components
├── composables/       # Module-specific composables
├── stores/            # Module-specific Pinia stores
├── api/               # Module-specific API service objects
├── schemas/           # Module-specific Yup validation schemas
├── types/             # Module-specific TypeScript types
└── constants/         # Module-specific constants
```

**Rules:**

- Each module's `index.ts` is the **public API boundary** — other modules import ONLY from `@/modules/<name>` (the index), never from internal paths
- Routes are registered in `src/router/index.ts` by spreading into the main layout children
- Module route names are defined as `const` objects with `as const` assertion in `routes.ts` (e.g. `ADMIN_ROUTE_NAMES`, `CALENDAR_ROUTE_NAMES`)
- Global route names (`ROUTE_NAMES`) only contain shared routes (home, auth, 404); module-specific names stay in their module
- Not all subdirectories are required — only create what the module actually needs

### File Naming Rules

| File Type        | Convention                      | Example                              |
| ---------------- | ------------------------------- | ------------------------------------ |
| Vue components   | **PascalCase** `.vue`           | `LoginView.vue`, `AppHeader.vue`     |
| TypeScript files | **camelCase** `.ts`             | `dateUtils.ts`, `auth.ts`            |
| Composables      | **camelCase** with `use` prefix | `useAlert.ts`, `useDataTable.ts`     |
| Stores           | **camelCase** (domain name)     | `auth.ts`, `shop.ts`                 |
| Constants        | **camelCase** `.ts`             | `routeNames.ts`, `dateFormat.ts`     |
| Types            | **camelCase** `.ts`             | `api.ts`, `dataTable.ts`             |
| Schemas          | **camelCase** `.ts`             | `loginSchema.ts`, `rules.ts`         |
| Module API files | **camelCase** + `Api` suffix    | `bookingApi.ts`, `timeSlotApi.ts`    |
| Module routes    | **camelCase** `.ts`             | `routes.ts`                          |
| Test files       | **camelCase** `.test.ts`        | `dateUtils.test.ts`                  |

---

## 4. Naming Conventions

### 4.1 Variables - camelCase

**Should:**

```typescript
const userName = 'John'
const totalPrice = 100
const selectedItems = ref<Product[]>([])
```

**Should Not:**

```typescript
const user_name = 'John' // snake_case
const UserName = 'John' // PascalCase
const TOTALAPRICE = 100 // UPPER_CASE for non-constants
```

### 4.2 Constants - UPPER_SNAKE_CASE with `as const`

**Should:**

```typescript
const AUTH_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
} as const

const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
} as const
```

**Should Not:**

```typescript
const authStorageKeys = { token: 'auth_token' } // camelCase for constants
const AUTH_STORAGE_KEYS = { TOKEN: 'auth_token' } // missing "as const"
```

### 4.3 Boolean Variables - Question-form

Boolean variables should read as a yes/no question: `is`, `has`, `can`, `should`.

**Should:**

```typescript
const isLoading = ref(false)
const isAuthenticated = computed(() => !!token.value)
const hasError = computed(() => !!props.error)
const canEdit = ref(true)
const isInitialized = computed(() => shopBasic.value !== null)
```

**Should Not:**

```typescript
const loading = ref(false)      // ambiguous - could be a noun
const authenticated = true       // not a question form
const error = computed(...)      // reads as a noun, not boolean
const edit = ref(true)           // verb, not boolean question
```

### 4.4 Functions - Start with a Verb

Functions should start with an action verb describing what they do. Use clear, descriptive names even if longer.

**Should:**

```typescript
function fetchData(): Promise<void> { ... }
function buildLazyParams(): AppTableLazyParams { ... }
function clearAuthData(): void { ... }
function handleLogout(): Promise<void> { ... }
function mapBackendLanguageToLocale(language: string): Locale { ... }
function extractResult<T>(response: PromiseSettledResult<ApiResponse<T>>): T | null { ... }
```

**Should Not:**

```typescript
function data() { ... }           // noun, not a verb
function params() { ... }         // noun, no action
function auth() { ... }           // ambiguous
function proc(x: number) { ... }  // abbreviation, unclear
```

### 4.5 Avoid Abbreviations

Type the full name. Other developers should not have to guess the meaning.

**Should:**

```typescript
const errorMessage = ref('')
const userAuthInfo = ref<UserAuthInfo | null>(null)
const pagination = ref<AppTablePagination>({ ... })
const selectedItems = ref<Product[]>([])
```

**Should Not:**

```typescript
const errMsg = ref('')
const uInfo = ref(null)
const pgn = ref({ ... })
const selItms = ref([])
```

### 4.6 Avoid Magic Numbers

Give numbers meaningful names via constants.

**Should:**

```typescript
const DEFAULTS = {
  TOAST_LIFE: 3000,
  ROWS: 10,
  ROWS_PER_PAGE_OPTIONS: [10, 25, 50],
  SORT_ORDER: 1,
} as const

toast.add({ life: DEFAULTS.TOAST_LIFE })
```

**Should Not:**

```typescript
toast.add({ life: 3000 })
pagination.value.rows = 10
```

### 4.7 Component Names - PascalCase, Multi-word

Component names must be multi-word (enforced by ESLint) to avoid conflicts with HTML elements.

**Should:**

```
AppHeader.vue
LoginView.vue
BaseField.vue
SelectField.vue
AppDataTable.vue
```

**Should Not:**

```
Header.vue          // single word, conflicts with <header>
Login.vue           // single word
Field.vue           // single word
Table.vue           // single word, conflicts with <table>
```

### 4.8 Types & Interfaces - PascalCase, No "I" Prefix

**Should:**

```typescript
interface ApiResponse<T> { ... }
interface AppColumnDef { ... }
type AppRowActionType = 'view' | 'edit' | 'delete'
type RouteNameType = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]
```

**Should Not:**

```typescript
interface IApiResponse<T> { ... }    // "I" prefix
interface api_response<T> { ... }    // snake_case
type appRowActionType = '...'        // camelCase for type
```

### 4.9 CSS Classes - BEM Convention

Use Block Element Modifier (BEM): `block__element--modifier`.

**Should:**

```scss
.base-field { ... }
.base-field__label { ... }
.base-field__required { ... }
.base-field--error { ... }
.app-data-table { ... }
.app-data-table__toolbar { ... }
```

**Should Not:**

```scss
.baseField { ... }           // camelCase
.base_field_label { ... }    // snake_case
.label { ... }               // too generic, no block prefix
```

---

## 5. Vue Component Conventions

### 5.1 Block Order: template -> script -> style

Enforced by ESLint rule `vue/block-order`.

**Should:**

```vue
<template>
  <div>...</div>
</template>

<script setup lang="ts">
// ...
</script>

<style scoped lang="scss">
// ...
</style>
```

**Should Not:**

```vue
<script setup lang="ts">
// ...
</script>

<template>
  <div>...</div>
</template>
```

### 5.2 Always Use `<script setup lang="ts">`

Enforced by ESLint rules `vue/component-api-style` and `vue/block-lang`.

**Should:**

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>
```

**Should Not:**

```vue
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const count = ref(0)
    return { count }
  },
})
</script>
```

### 5.3 Props - Type-based with Interface

Enforced by ESLint rule `vue/define-props-declaration: type-based`.

**Should:**

```typescript
interface Props {
  fieldId: string
  label?: string
  helpText?: string
  error?: string | null
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  helpText: undefined,
  error: null,
  required: false,
})
```

**Should Not:**

```typescript
// Runtime declaration style
const props = defineProps({
  fieldId: { type: String, required: true },
  label: { type: String, default: '' },
})
```

### 5.4 Emits - Type-based

Enforced by ESLint rule `vue/define-emits-declaration: type-based`.

**Should:**

```typescript
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'page', payload: DataTablePageEvent): void
  (event: 'sort', payload: DataTableSortEvent): void
}>()
```

**Should Not:**

```typescript
const emit = defineEmits(['update:modelValue', 'page', 'sort'])
```

### 5.5 Auto-Imported Components (Do NOT Manually Import)

The following are auto-imported by `unplugin-vue-components` and **must not** be manually imported:

- **PrimeVue components:** `Button`, `InputText`, `Password`, `DataTable`, `Dialog`, `Message`, `Card`, `Select`, `DatePicker`, etc.
- **Vue Router:** `RouterView`, `RouterLink`
- **App components from `src/components/`:** `AppHeader`, `AppFooter`, `MainLayout`, `AuthLayout`, `AppEmpty`, `AppError`, `AppLoading`, `AppErrorDialog`, `AppGlobalLoading`, `AppPwaUpdate`, `LanguageSwitcher`

**Should:**

```vue
<template>
  <Button :label="$t('common.save')" />
  <RouterLink to="/home">Home</RouterLink>
  <AppEmpty title="No data" />
</template>

<script setup lang="ts">
// No imports needed for the above components
import { ref } from 'vue'
</script>
```

**Should Not:**

```vue
<script setup lang="ts">
import Button from 'primevue/button' // WRONG - auto-imported
import { RouterLink } from 'vue-router' // WRONG - auto-imported
import AppEmpty from '@/components/common/AppEmpty.vue' // WRONG - auto-imported
</script>
```

### 5.6 Manual Imports (Always Required)

These must always be manually imported:

```typescript
// Vue APIs
import { ref, computed, watch, onMounted, nextTick } from 'vue'

// Vue Router composables
import { useRouter, useRoute } from 'vue-router'

// Custom composables
import { useRouterNavigation } from '@/composables/useRouterNavigation'
import { useAlert } from '@/composables/useAlert'

// Stores
import { useAuthStore } from '@/stores/auth'

// Types (always use "import type")
import type { ApiResponse } from '@/types/api'

// Constants
import { ROUTE_NAMES } from '@/constants'
```

### 5.7 Template Attribute Ordering

Enforced by ESLint rule `vue/attributes-order`. Follow this order:

1. `v-is` (definition)
2. `v-for` (list rendering)
3. `v-if` / `v-else-if` / `v-else` / `v-show` (conditionals)
4. `v-pre` / `v-once` (render modifiers)
5. `id` (global)
6. `ref` / `key` / `v-slot` (unique/slot)
7. `v-model` (two-way binding)
8. Custom directives
9. Other attributes (`:prop`, `class`, etc.)
10. `@click`, `v-on` (events)
11. `v-text` / `v-html` (content)

**Should:**

```vue
<InputText
  v-if="isEditing"
  id="userID"
  v-model="userID"
  name="userID"
  :placeholder="$t('auth.username')"
  :disabled="authStore.loading"
  :invalid="!!userIDError"
  @update:model-value="handleChange"
/>
```

**Should Not:**

```vue
<InputText
  @update:model-value="handleChange"
  name="userID"
  v-model="userID"
  v-if="isEditing"
  :placeholder="$t('auth.username')"
  id="userID"
/>
```

### 5.8 No `v-if` with `v-for` on Same Element

Enforced by ESLint rule `vue/no-use-v-if-with-v-for`.

**Should:**

```vue
<template v-for="item in filteredItems" :key="item.id">
  <div>{{ item.name }}</div>
</template>
```

```typescript
const filteredItems = computed(() => items.value.filter((item) => item.isActive))
```

**Should Not:**

```vue
<div v-for="item in items" v-if="item.isActive" :key="item.id">
  {{ item.name }}
</div>
```

### 5.9 Always Provide `:key` in `v-for`

**Should:**

```vue
<div v-for="item in items" :key="item.id">{{ item.name }}</div>
```

**Should Not:**

```vue
<div v-for="item in items">{{ item.name }}</div>
```

### 5.10 i18n - Use `$t()` for All User-facing Text

All labels, messages, placeholders, and titles visible to users must use `$t()`. Translatable attributes must use dynamic binding.

**Should:**

```vue
<h1>{{ $t('auth.login') }}</h1>
<Button :label="$t('auth.login')" />
<InputText :placeholder="$t('auth.username')" />
<router-link :aria-label="$t('auth.forgotPasswordAriaLabel')">
  {{ $t('auth.forgotPassword') }}
</router-link>
```

**Should Not:**

```vue
<h1>Login</h1>
<Button label="Login" />
<InputText placeholder="Username" />
<router-link aria-label="Forgot Password">
  Forgot Password
</router-link>
```

### 5.11 Use `v-model:visible` for Dialogs/Modals

Use reactive `v-model:visible` instead of programmatic show/hide methods.

**Should:**

```vue
<Dialog v-model:visible="isDialogVisible" header="Confirm">
  <p>Are you sure?</p>
</Dialog>
```

```typescript
const isDialogVisible = ref(false)

function openDialog(): void {
  isDialogVisible.value = true
}
```

**Should Not:**

```typescript
// Programmatic show by ID - can break when component is used in multiple places
showDialogById('confirm-dialog')
```

### 5.12 Component Names in Template - PascalCase

Enforced by ESLint rule `vue/component-name-in-template-casing`.

**Should:**

```vue
<AppHeader />
<RouterLink to="/home">Home</RouterLink>
<BaseField :field-id="name" :label="label" />
```

**Should Not:**

```vue
<app-header />
<router-link to="/home">Home</router-link>
<base-field :field-id="name" :label="label" />
```

---

## 6. Script Setup Organization

### 6.1 Import Order (Grouped by Type)

Group imports by category with blank lines between groups. Sorting within each group is handled automatically by `eslint-plugin-simple-import-sort` (alphabetical). Run `pnpm lint` to auto-fix.

| Group | Pattern                                  | Description                                                               |
| ----- | ---------------------------------------- | ------------------------------------------------------------------------- |
| 1     | `vue`, `vue-router`, `vue-i18n`, `pinia` | Vue core ecosystem                                                        |
| 2     | `@?\\w`                                  | Third-party libraries                                                     |
| 3     | `@/stores`                               | Pinia stores                                                              |
| 4     | `@/composables`                          | Composables                                                               |
| 5     | `@/constants`, `@/config`                | Constants & configuration (static values)                                 |
| 6     | `@/` (remaining)                         | Other internal modules (api, schemas, utils, plugins, router, locales...) |
| 7     | `@/types`                                | Type-only imports (compile-time only, stripped at build)                  |
| 8     | `./`, `../`                              | Relative imports                                                          |
| 9     | `.css`, `.scss`                          | Side-effect imports (styles, polyfills)                                   |

**Should:**

```typescript
// 1. Vue core ecosystem
import { ref, computed, onMounted } from 'vue'

// 2. Third-party libraries
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'

// 3. Stores
import { useAuthStore } from '@/stores/auth'
import { useShopStore } from '@/stores/shop'

// 4. Composables
import { useAlert } from '@/composables/useAlert'
import { useRouterNavigation } from '@/composables/useRouterNavigation'

// 5. Constants & Config
import { ROUTE_NAMES } from '@/constants'
import { appConfig } from '@/config/app'

// 6. Other internal modules
import { loginSchema } from '@/schemas'
import { authApi } from '@/api'

// 7. Type-only imports (always use separate "import type")
import type { ApiResponse } from '@/types/api'
import type { LoginRequest, UserAuthInfo } from '@/types/auth'
```

**Should Not:**

```typescript
import { ROUTE_NAMES } from '@/constants'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { ApiResponse } from '@/types/api'
import { useForm } from 'vee-validate'
import { useAlert } from '@/composables/useAlert'
```

### 6.2 Script Setup Body Order

Organize the script body in this order with blank lines between each section:

1. **defineOptions** (if needed)
2. **Props / Emits / Slots**
3. **Composables and store initialization**
4. **Local state** (`ref`, `reactive`)
5. **Computed properties**
6. **Functions** (handlers, helpers)
7. **Watchers** (`watch`, `watchEffect`)
8. **Lifecycle hooks** (`onMounted`, `onUnmounted`)

**Should:**

```typescript
defineOptions({ inheritAttrs: false })

// Props & Emits
interface Props { ... }
const props = withDefaults(defineProps<Props>(), { ... })
const emit = defineEmits<{ ... }>()

// Composables and stores
const authStore = useAuthStore()
const { navigateTo } = useRouterNavigation()

// Local state
const errorMessage = ref<string>('')
const isDialogVisible = ref(false)

// Computed
const isFormValid = computed(() => ...)

// Functions
function handleSubmit(): void { ... }
function handleCancel(): void { ... }

// Watchers
watch(() => props.modelValue, (newVal) => { ... })

// Lifecycle
onMounted(() => { ... })
```

### 6.3 Use `const` Over `let`; Never Use `var`

Enforced by ESLint rules `prefer-const` and `no-var`.

**Should:**

```typescript
const userName = 'John'
const items = ref<Product[]>([])
const isLoading = computed(() => activeRequests.value > 0)
```

**Should Not:**

```typescript
var userName = 'John' // never use var
let items = ref([]) // ref itself doesn't get reassigned, use const
```

### 6.4 Spacing Between Logical Blocks

Add blank lines between logical sections to improve readability.

**Should:**

```typescript
const authStore = useAuthStore()
const { navigateTo } = useRouterNavigation()

const errorMessage = ref<string>('')

const onFormSubmit = handleSubmit(async (values) => {
  try {
    errorMessage.value = ''
    await nextTick()

    const response = await authStore.login({
      userID: values.userID.trim(),
      password: values.password,
    })

    if (response.isOK && response.result) {
      await navigateTo(ROUTE_NAMES.HOME)
    } else {
      const backendError = response.errorMessages[0]
      errorMessage.value = backendError?.errorMessage ?? ERROR_MESSAGES.LOGIN_FAILED
    }
  } catch (error: unknown) {
    handleLoginError(error)
  }
})
```

**Should Not:**

```typescript
const authStore = useAuthStore()
const { navigateTo } = useRouterNavigation()
const errorMessage = ref<string>('')
const onFormSubmit = handleSubmit(async (values) => {
  try {
    errorMessage.value = ''
    await nextTick()
    const response = await authStore.login({
      userID: values.userID.trim(),
      password: values.password,
    })
    if (response.isOK && response.result) {
      await navigateTo(ROUTE_NAMES.HOME)
    } else {
      const backendError = response.errorMessages[0]
      errorMessage.value = backendError?.errorMessage ?? ERROR_MESSAGES.LOGIN_FAILED
    }
  } catch (error: unknown) {
    handleLoginError(error)
  }
})
```

---

## 7. TypeScript Conventions

### 7.1 No `any` in Production Code

Enforced by ESLint rule `@typescript-eslint/no-explicit-any` (warn in dev, error in CI).

**Should:**

```typescript
function extractResult<T>(response: PromiseSettledResult<ApiResponse<T>>): T | null {
  if (response.status === 'rejected') return null
  const { value } = response
  if (!value.isOK || !value.result) return null
  return value.result
}
```

**Should Not:**

```typescript
function extractResult(response: any): any {
  return response?.value?.result
}
```

### 7.2 Use `interface` for Object Shapes, `type` for Unions/Primitives

**Should:**

```typescript
// Object shapes -> interface
interface AppTablePagination {
  first: number
  rows: number
  totalRecords: number
  rowsPerPageOptions: number[]
}

// Union types -> type
type AppRowActionType = 'view' | 'edit' | 'delete'
type AppTableLoadingMode = 'spinner' | 'skeleton'

// Derived const types -> type
type RouteNameType = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]
```

**Should Not:**

```typescript
// Don't use type for object shapes
type AppTablePagination = {
  first: number
  rows: number
}

// Don't use interface for simple unions
interface AppRowActionType {
  value: 'view' | 'edit' | 'delete'
}
```

### 7.3 Use `import type` for Type-only Imports

Enforced by ESLint rule `@typescript-eslint/consistent-type-imports`.

**Should:**

```typescript
import type { ApiResponse, ApiRequestConfig } from '@/types/api'
import type { LoginRequest, UserAuthInfo } from '@/types/auth'
import type { DataTablePageEvent, DataTableSortEvent } from 'primevue/datatable'
```

**Should Not:**

```typescript
import { ApiResponse, ApiRequestConfig } from '@/types/api'
import { DataTablePageEvent } from 'primevue/datatable'
```

### 7.4 Const Object + Derived Type Pattern

This pattern provides both a runtime constant and a compile-time type from the same source.

**Should:**

```typescript
export const ROUTE_NAMES = {
  HOME: 'home',
  LOGIN: 'login',
  ADMIN_LIST: 'admin-list',
} as const

export type RouteNameType = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]
// Result: 'home' | 'login' | 'admin-list'
```

**Should Not:**

```typescript
// Separate enum and type - harder to maintain, duplicated values
export enum RouteNames {
  HOME = 'home',
  LOGIN = 'login',
}

// Or string literal without const
export const ROUTE_NAMES = {
  HOME: 'home', // type is string, not 'home'
}
```

### 7.5 Generic Typing for API Responses

**Should:**

```typescript
async function read<T>(
  service: ServiceConfig,
  endpoint: string,
  data?: unknown,
  config?: ApiRequestConfig,
): Promise<ApiResponse<T>> {
  return httpClient.post<T>(readUrl(service, endpoint), data, config)
}

// Usage
const response = await gatewayService.read<ShopBasicInfo>(ADMINS_SERVICE, 'Shop/GetBasic', {
  shopId,
})
```

**Should Not:**

```typescript
async function read(service: any, endpoint: string, data?: any): Promise<any> {
  return httpClient.post(readUrl(service, endpoint), data)
}
```

### 7.6 Explicit Return Types on Functions

While ESLint does not strictly enforce return types (the rule is off for flexibility), prefer explicit return types on non-trivial functions for better readability.

**Should:**

```typescript
function clearAuthData(): void { ... }
async function fetchData(): Promise<void> { ... }
function buildLazyParams(): AppTableLazyParams { ... }
const isAuthenticated = computed((): boolean => !!token.value)
```

**Should Not:**

```typescript
function clearAuthData() { ... }        // void is not obvious
async function fetchData() { ... }      // return type ambiguous
function buildLazyParams() { ... }      // reader must infer return type
```

---

## 8. Composable Conventions

### 8.1 When to Use a Composable vs a Utility Function

| Use **Composable** when...                     | Use **Utility Function** when...      |
| ---------------------------------------------- | ------------------------------------- |
| Logic uses Vue reactivity (`ref`, `computed`)  | Logic is pure (no Vue dependency)     |
| Logic uses lifecycle hooks (`onMounted`, etc.) | Input in, output out, no side effects |
| Logic needs to share reactive state            | Can be used outside Vue context       |
| Logic wraps PrimeVue composables (`useToast`)  | String/date/number transformations    |

**Composable example:** `useDataTable` (uses `ref`, `onMounted`, returns reactive state)
**Utility example:** `hexToRgb` in `colorUtils.ts` (pure function, no Vue dependency)

### 8.2 Composable Structure

Use `export function useX()` with a typed return value. Prefix with `use`.

**Should:**

```typescript
import { ref, onMounted, type Ref } from 'vue'
import type { UseDataTableConfig, UseDataTableReturn } from '@/types/dataTable'

const DEFAULTS = {
  ROWS: 10,
  ROWS_PER_PAGE_OPTIONS: [10, 25, 50],
} as const

export function useDataTable<T>(config: UseDataTableConfig<T>): UseDataTableReturn<T> {
  const data = ref<T[]>([]) as Ref<T[]>
  const loading = ref<boolean>(false)

  async function fetchData(): Promise<void> {
    loading.value = true
    try {
      const result = await config.fetchFn(buildLazyParams())
      data.value = result.data
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    fetchData,
  }
}
```

**Should Not:**

```typescript
// Missing "use" prefix
export function dataTable() { ... }

// Default export
export default function useDataTable() { ... }

// Class-based
export class DataTableManager { ... }
```

### 8.3 Side-effect Isolation

Composables should clearly isolate side effects (API calls, DOM access, storage). Callers should understand what side effects occur.

**Should:**

```typescript
export function useAlert() {
  const toast = useToast() // Side-effect: PrimeVue toast service
  const confirm = useConfirm() // Side-effect: PrimeVue confirm service

  function success(summary: string, detail?: string): void {
    toast.add({ severity: 'success', summary, detail, life: DEFAULTS.TOAST_LIFE })
  }

  return { success /* ... */ }
}
```

**Should Not:**

```typescript
export function useAlert() {
  const toast = useToast()

  function success(summary: string): void {
    toast.add({ severity: 'success', summary })
    localStorage.setItem('last_toast', summary) // Hidden side-effect
    fetch('/api/log', { body: summary }) // Hidden side-effect
  }

  return { success }
}
```

---

## 9. Pinia Store Conventions

### 9.1 Use Setup Store Pattern (Function-based)

All stores in this project use the setup store syntax (function passed to `defineStore`).

**Should:**

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  // State
  const activeRequests = ref(0)

  // Getters
  const isLoading = computed<boolean>(() => activeRequests.value > 0)

  // Actions
  function startLoading(): void {
    activeRequests.value++
  }

  function stopLoading(): void {
    if (activeRequests.value > 0) activeRequests.value--
  }

  function $reset(): void {
    activeRequests.value = 0
  }

  return {
    // State
    activeRequests,
    // Getters
    isLoading,
    // Actions
    startLoading,
    stopLoading,
    $reset,
  }
})
```

**Should Not:**

```typescript
// Options store style - not used in this project
export const useLoadingStore = defineStore('loading', {
  state: () => ({
    activeRequests: 0,
  }),
  getters: {
    isLoading: (state) => state.activeRequests > 0,
  },
  actions: {
    startLoading() {
      this.activeRequests++
    },
  },
})
```

### 9.2 Return Object - Group by State / Getters / Actions

Always group the return object with comments separating state, getters (computed), and actions.

**Should:**

```typescript
return {
  // State
  token,
  refreshToken,
  userAuthInfo,
  loading,

  // Computed
  isAuthenticated,

  // Actions
  login,
  logout,
  updateTokens,
  clearAuthData,
}
```

**Should Not:**

```typescript
return {
  token,
  refreshToken,
  userAuthInfo,
  loading,
  isAuthenticated,
  login,
  logout,
  updateTokens,
  clearAuthData,
}
```

### 9.3 Provide `$reset()` Method

Setup stores do not get an automatic `$reset()` like options stores. Define one manually.

**Should:**

```typescript
function $reset(): void {
  activeRequests.value = 0
}

return { activeRequests, $reset }
```

### 9.4 When to Use Store Directly in Components

- **Use store directly** when the component reads shared global data (auth, user info, theme, settings) or calls a global action.
- **Do not** use a store for complex business logic that mixes UI and data processing. Extract that logic to a composable.

**Should:**

```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
// Reading global auth state directly - OK
const isLoggedIn = authStore.isAuthenticated
</script>
```

**Should Not:**

```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
// Complex business logic mixed with store - extract to composable
const filteredUsers = computed(() => {
  return authStore.allUsers
    .filter((u) => u.role === 'admin')
    .map((u) => ({ ...u, displayName: `${u.first} ${u.last}` }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
})
</script>
```

### 9.5 JSON.parse in Stores Must Use try/catch

**Should:**

```typescript
function loadUserAuthInfo(): UserAuthInfo | null {
  const stored = sessionStorage.getItem(AUTH_STORAGE_KEYS.USER_AUTH_INFO)
  if (!stored) return null
  try {
    return JSON.parse(stored) as UserAuthInfo
  } catch {
    sessionStorage.removeItem(AUTH_STORAGE_KEYS.USER_AUTH_INFO)
    return null
  }
}
```

**Should Not:**

```typescript
function loadUserAuthInfo(): UserAuthInfo | null {
  const stored = sessionStorage.getItem(AUTH_STORAGE_KEYS.USER_AUTH_INFO)
  return stored ? JSON.parse(stored) : null // Will crash on corrupted data
}
```

---

## 10. API & Service Layer Conventions

### 10.1 Gateway Pattern (CQRS)

All API calls go through `gatewayService` which provides a CQRS-style API:

| Method          | Purpose                   | HTTP Verb |
| --------------- | ------------------------- | --------- |
| `read`          | Query data (read-only)    | POST      |
| `command`       | Create / mutate data      | POST      |
| `commandPut`    | Update existing data      | PUT       |
| `commandDelete` | Delete data               | DELETE    |
| `aggregate`     | Cross-service aggregation | POST      |

**Should:**

```typescript
import { gatewayService } from '@/api'
import { ADMINS_SERVICE } from '@/config/services'
import type { ShopBasicInfo } from '@/types/auth'

export const adminsApi = {
  async getShopBasic(shopId: number): Promise<ApiResponse<ShopBasicInfo>> {
    return gatewayService.read<ShopBasicInfo>(ADMINS_SERVICE, 'Shop/GetBasic', { shopId })
  },
}
```

**Should Not:**

```typescript
// Direct axios calls bypassing the gateway
import axios from 'axios'

export async function getShopBasic(shopId: number) {
  const res = await axios.get(`/api/admins/shop/${shopId}`)
  return res.data
}
```

### 10.2 Typed API Responses

All API responses use the `ApiResponse<T>` wrapper.

**Should:**

```typescript
interface ApiResponse<T = unknown> {
  result: T | null
  errorMessages: ApiErrorMessage[]
  isOK: boolean
}

// Usage
const response: ApiResponse<LoginResult> = await authApi.login(payload)
if (response.isOK && response.result) {
  // response.result is LoginResult
}
```

### 10.3 Service File Structure

Each domain service gets its own file under `src/api/services/`.

```
api/
├── index.ts           # Barrel export: gatewayService, authApi, adminsApi
├── axios.ts           # Axios instance configuration
├── url-builder.ts     # URL construction helpers
├── services/
│   ├── base.ts        # gatewayService (used by all domain services)
│   ├── auth.ts        # authApi
│   └── admins.ts      # adminsApi
└── interceptors/
    ├── index.ts
    ├── request.ts     # Auth token injection
    ├── response.ts    # Error handling
    ├── tokenRefresh.ts
    ├── handlers/
    │   └── statusHandlers.ts  # HTTP status-specific error handlers
    └── utils/
        └── errorUtils.ts      # Error normalization helpers
```

Module-specific API services live in `src/modules/<name>/api/` (e.g. `bookingApi.ts`, `timeSlotApi.ts`).

### 10.4 SignalR (Real-time)

Real-time communication uses the `signalr` module at `src/modules/signalr/`:

```
modules/signalr/
├── api/
│   └── signalrApi.ts          # SignalR hub endpoint calls
├── composables/
│   └── useSignalR.ts          # Vue composable wrapping connection lifecycle
├── constants/
│   └── signalrEvents.ts       # Hub event name constants
├── services/
│   └── SignalRConnection.ts   # SignalR connection manager (class-based)
├── stores/
│   └── signalRStore.ts        # Connection state & received messages
└── types/
    └── signalr.ts             # SignalR-specific TypeScript types
```

**Rules:**

- `SignalRConnection.ts` is **the only class** in the project — justified as a connector to an external system
- Use `useSignalR` composable in components, not the connection service directly
- Hub event names must use constants from `signalrEvents.ts`

---

## 11. Form & Validation Conventions

### 11.1 VeeValidate + Yup Schema Approach

Define validation schemas in `src/schemas/`, use `useForm` + `useField` in components.

**Should:**

```typescript
// src/schemas/loginSchema.ts
import * as Yup from 'yup'

export const loginSchema = Yup.object({
  userID: Yup.string().required('User ID is required'),
  password: Yup.string().required('Password is required'),
})
```

```typescript
// In component
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { loginSchema } from '@/schemas'

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: { userID: '', password: '' },
})

const { value: userID, errorMessage: userIDError } = useField<string>('userID')
```

### 11.2 BaseField Wrapper Pattern

All form fields should use the `BaseField` wrapper for consistent label, error, and help text rendering.

**Should:**

```vue
<template>
  <BaseField
    :field-id="name"
    :label="label"
    :help-text="helpText"
    :error="error"
    :required="required"
  >
    <template #default="{ ariaDescribedBy }">
      <Select
        v-model="internalValue"
        :input-id="name"
        :aria-describedby="ariaDescribedBy"
        v-bind="$attrs"
      />
    </template>
  </BaseField>
</template>
```

### 11.3 v-model with Computed get/set

When building custom form components with `v-model`, use a computed property with getter and setter.

**Should:**

```typescript
interface Props {
  modelValue?: unknown
  name: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (event: 'update:modelValue', value: unknown): void
}>()

const internalValue = computed({
  get(): unknown {
    return props.modelValue
  },
  set(value: unknown): void {
    emit('update:modelValue', value)
  },
})
```

**Should Not:**

```typescript
// Directly mutating props
watch(
  () => props.modelValue,
  (val) => {
    localValue.value = val
  },
)

watch(localValue, (val) => {
  emit('update:modelValue', val)
})
```

---

## 12. CSS / SCSS Conventions

### 12.1 Always Use Scoped Styles

Enforced by ESLint rule `vue/enforce-style-attribute`.

**Should:**

```vue
<style scoped lang="scss">
.login-card { ... }
</style>
```

**Should Not:**

```vue
<style lang="scss">
.login-card { ... }  /* Leaks to other components */
</style>
```

### 12.2 BEM Naming with SCSS Nesting

Use `&__element` and `&--modifier` for BEM within scoped styles.

**Should:**

```scss
.base-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  &__label {
    display: block;
    font-weight: 500;
    color: var(--p-text-color);
  }

  &__required {
    color: var(--p-red-500);
  }

  &__help {
    color: var(--p-text-muted-color);
  }

  &--error {
    :deep(.p-inputtext) {
      border-color: var(--p-red-500);
    }
  }
}
```

**Should Not:**

```scss
// Deeply nested BEM selectors that are hard to search
.base-field {
  &__label {
    &--active {      // .base-field__label--active - not searchable as full string
      color: red;
    }
  }
}

// Generic class names without block prefix
.label { ... }
.error { ... }
.wrapper { ... }
```

### 12.3 Use PrimeVue CSS Variables for Colors

Use PrimeVue design tokens (CSS variables) for theming consistency. Only `color` and `background-color` should use variables. Other properties (padding, border-radius) can use direct values for flexibility.

**Should:**

```scss
.base-field__label {
  color: var(--p-text-color);
}

.base-field__required {
  color: var(--p-red-500);
}

.base-field__help {
  color: var(--p-text-muted-color);
}
```

**Should Not:**

```scss
.base-field__label {
  color: #333333; // Hardcoded color - breaks theming
}

.base-field__required {
  color: red; // Hardcoded color
}
```

### 12.4 No `!important` (Except 3rd-party Overrides)

**Should:**

```scss
// Create a more specific selector instead
.app-data-table__toolbar .custom-button {
  background-color: var(--p-primary-color);
}
```

**Should Not:**

```scss
.custom-button {
  background-color: var(--p-primary-color) !important;
}
```

Allowed exception: overriding 3rd-party library styles that cannot be customized otherwise.

### 12.5 No Static Inline Styles

Enforced by ESLint rule `vue/no-static-inline-styles`.

**Should:**

```vue
<div class="error-dialog-content">...</div>
```

```scss
.error-dialog-content {
  padding: 1rem;
  max-height: 400px;
}
```

**Should Not:**

```vue
<div style="padding: 1rem; max-height: 400px">...</div>
```

### 12.6 Use `:deep()` for Child Component Styling

When you need to style PrimeVue component internals from a scoped parent:

**Should:**

```scss
.base-field--error {
  :deep(.p-inputtext) {
    border-color: var(--p-red-500);
  }
}
```

**Should Not:**

```scss
// Removing scoped to style child components
// This leaks styles globally
```

---

## 13. Error Handling Conventions

### 13.1 Always Use try/catch for Async Operations

**Should:**

```typescript
const login = async (
  formData: Pick<LoginRequest, 'userID' | 'password'>,
): Promise<ApiResponse<LoginResult>> => {
  loading.value = true
  try {
    const response = await authApi.login(requestPayload)
    if (response.isOK && response.result) {
      setAuthData(response.result.userAuthInfo)
    }
    return response
  } finally {
    loading.value = false
  }
}
```

**Should Not:**

```typescript
const login = async (formData) => {
  loading.value = true
  const response = await authApi.login(formData) // Unhandled rejection if this throws
  loading.value = false
  return response
}
```

### 13.2 Type Errors as `unknown`, Check with `instanceof`

**Should:**

```typescript
try {
  await someAction()
} catch (error: unknown) {
  if (error instanceof Error) {
    errorMessage.value = error.message
  } else {
    errorMessage.value = 'An unexpected error occurred'
  }
}
```

**Should Not:**

```typescript
try {
  await someAction()
} catch (error: any) {
  errorMessage.value = error.message // May crash if error is not Error
}
```

### 13.3 Use `useAlert()` for User-facing Errors

**Should:**

```typescript
const { showErrorDialog, error: showErrorToast } = useAlert()

try {
  await deleteItem(itemId)
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : 'Delete failed'
  showErrorDialog(message)
}
```

### 13.4 Dev-only Logging with `import.meta.env.DEV`

**Should:**

```typescript
if (import.meta.env.DEV) {
  console.error('[Login Error]', error)
}
```

**Should Not:**

```typescript
console.log('error:', error) // Will appear in production
console.error(error) // No context, will appear in production
```

### 13.5 Never Silently Ignore Errors

**Should:**

```typescript
try {
  return JSON.parse(stored) as UserAuthInfo
} catch {
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.USER_AUTH_INFO)
  return null // Explicitly return fallback
}
```

**Should Not:**

```typescript
try {
  return JSON.parse(stored)
} catch {
  // silently ignore - caller has no idea something went wrong
}
```

### 13.6 Use `finally` for Cleanup (Loading States)

**Should:**

```typescript
loading.value = true
try {
  const result = await fetchFn(params)
  data.value = result.data
} finally {
  loading.value = false // Always resets, even on error
}
```

**Should Not:**

```typescript
loading.value = true
const result = await fetchFn(params)
data.value = result.data
loading.value = false // Never reached if fetchFn throws
```

---

## 14. Constants & Configuration

### 14.1 Date/Number Formats as Constants

Never hardcode date or number format strings. Use constants from `src/constants/dateFormat.ts`.

**Should:**

```typescript
import { LUXON_DATE_FORMAT, PRIMEVUE_DATE_FORMAT } from '@/constants'

// In a composable or utility
DateTime.now().toFormat(LUXON_DATE_FORMAT.ISO)

// In a template
<DatePicker :date-format="PRIMEVUE_DATE_FORMAT.ISO" />
```

**Should Not:**

```typescript
DateTime.now().toFormat('yyyy-MM-dd')

<DatePicker date-format="yy-mm-dd" />
```

### 14.2 Route Names as Typed Constants

Always use typed route name constants for navigation. Never hardcode route paths or names.

- **Global routes** (auth, home, 404): `ROUTE_NAMES` from `@/constants`
- **Module routes**: `MODULE_ROUTE_NAMES` from `@/modules/<name>` (e.g. `ADMIN_ROUTE_NAMES`, `CALENDAR_ROUTE_NAMES`)

**Should:**

```typescript
// Global routes — use ROUTE_NAMES from @/constants
import { ROUTE_NAMES } from '@/constants'

await navigateTo(ROUTE_NAMES.HOME)

// Module routes — use module-specific route name constants
import { ADMIN_ROUTE_NAMES } from '@/modules/admin'

await navigateTo(ADMIN_ROUTE_NAMES.ADMIN_DETAIL, { params: { id: '123' } })
```

**Should Not:**

```typescript
await router.push('/home')
await router.push({ name: 'admin-detail', params: { id: '123' } })
```

### 14.3 Storage Keys as Constants

**Should:**

```typescript
import { AUTH_STORAGE_KEYS } from '@/constants'

sessionStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token)
sessionStorage.getItem(AUTH_STORAGE_KEYS.USER_AUTH_INFO)
```

**Should Not:**

```typescript
sessionStorage.setItem('auth_token', token)
sessionStorage.getItem('user_auth_info')
```

### 14.4 The `as const` Pattern

Always use `as const` on constant objects to get literal types instead of widened `string`.

**Should:**

```typescript
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]
// Result: 'admin' | 'manager' | 'user'
```

**Should Not:**

```typescript
export const USER_ROLES = {
  ADMIN: 'admin', // type is string, not 'admin'
  MANAGER: 'manager',
  USER: 'user',
}

// Cannot derive literal union type without "as const"
```

---

## 15. Security Rules

### 15.1 No Dynamic Code Execution

Enforced by ESLint rules: `no-eval`, `no-implied-eval`, `no-new-func`, `no-script-url`.

**Should Not:**

```typescript
eval('alert("hello")')
new Function('return 1 + 1')()
setTimeout('alert("hello")', 1000) // string argument = implied eval
```

**Should:**

```typescript
setTimeout(() => {
  alert('hello')
}, 1000)
```

### 15.2 No Unsanitized `v-html`

Enforced by ESLint rule: `vue/no-v-html` (warn). Review all usages carefully.

**Should:**

```vue
<p>{{ userComment }}</p>
```

**Should Not:**

```vue
<p v-html="userComment"></p>
<!-- XSS risk if userComment comes from user input -->
```

If `v-html` is absolutely necessary (e.g., rich text from editor), sanitize with DOMPurify:

```typescript
import DOMPurify from 'dompurify'
const sanitizedHtml = DOMPurify.sanitize(rawHtml)
```

### 15.3 No Hardcoded Secrets

Environment-specific values must be in `.env` files, not in source code.

**Should:**

```typescript
// src/config/env.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
```

**Should Not:**

```typescript
const API_KEY = 'sk-abc123xyz789'
const API_BASE_URL = 'https://api.production.com'
```

### 15.4 Prefer `===` Over `==`

Enforced by ESLint rule: `eqeqeq` (null comparison is allowed).

**Should:**

```typescript
if (status === 'active') { ... }
if (value === undefined) { ... }
if (value == null) { ... }  // OK: checks both null and undefined
```

**Should Not:**

```typescript
if (status == 'active') { ... }
if (value == undefined) { ... }
```

---

## 16. ESLint & CI Rules Reference

### Key Rules Enforced

| Rule                                                | Severity      | Purpose                         |
| --------------------------------------------------- | ------------- | ------------------------------- |
| `vue/component-api-style: script-setup`             | error         | Enforce `<script setup>`        |
| `vue/block-lang: ts`                                | error         | TypeScript required in script   |
| `vue/define-emits-declaration: type-based`          | error         | Type-based emits                |
| `vue/define-props-declaration: type-based`          | error         | Type-based props                |
| `vue/block-order: template, script, style`          | error         | Consistent block order          |
| `vue/component-name-in-template-casing: PascalCase` | error         | PascalCase in templates         |
| `vue/no-setup-props-reactivity-loss`                | error         | Prevent reactivity bugs         |
| `vue/no-use-v-if-with-v-for`                        | error         | Performance best practice       |
| `vue/enforce-style-attribute: scoped`               | warn          | Scoped styles required          |
| `@typescript-eslint/consistent-type-imports`        | error         | `import type` for types         |
| `@typescript-eslint/no-explicit-any`                | warn/error    | No `any` (error in CI)          |
| `@typescript-eslint/no-floating-promises`           | error         | All promises must be handled    |
| `@typescript-eslint/no-misused-promises`            | error         | Prevent async callback mistakes |
| `@typescript-eslint/await-thenable`                 | error         | Only await Promises             |
| `@typescript-eslint/switch-exhaustiveness-check`    | error         | Exhaustive switch statements    |
| `no-eval`                                           | error         | Security: no eval               |
| `no-console`                                        | warn/error    | No console.log (error in CI)    |
| `no-debugger`                                       | error         | No debugger statements          |
| `prefer-const`                                      | error         | `const` over `let`              |
| `eqeqeq`                                            | error         | Strict equality                 |
| `complexity`                                        | warn (max 15) | Function complexity limit       |
| `max-depth`                                         | warn (max 4)  | Nesting depth limit             |

### CI vs Development Differences

Some rules are relaxed in development to avoid blocking work, but become errors in CI:

| Rule                                       | Development | CI    |
| ------------------------------------------ | ----------- | ----- |
| `@typescript-eslint/no-explicit-any`       | warn        | error |
| `@typescript-eslint/no-non-null-assertion` | warn        | error |
| `no-console` (except `warn`, `error`)      | warn        | error |

### Running Lint Checks

```bash
# Development: auto-fix what's possible
pnpm lint

# CI mode: check only, no auto-fix
pnpm lint:ci

# Full validation pipeline
pnpm validate
```

### Test File Relaxations

Files matching `**/*.test.ts`, `**/*.spec.ts` have relaxed rules:

- `any` is allowed (for mocking)
- `console` is allowed (for debugging)
- Complexity checks are disabled

---

## Quick Reference Cheatsheet

| Topic            | Convention                                       |
| ---------------- | ------------------------------------------------ |
| Variables        | `camelCase`                                      |
| Constants        | `UPPER_SNAKE_CASE` + `as const`                  |
| Booleans         | `isX`, `hasX`, `canX`, `shouldX`                 |
| Functions        | Start with verb: `fetchX`, `handleX`, `buildX`   |
| Components       | `PascalCase`, multi-word                         |
| Types/Interfaces | `PascalCase`, no `I` prefix                      |
| CSS classes      | BEM: `block__element--modifier`                  |
| File names (Vue) | `PascalCase.vue`                                 |
| File names (TS)  | `camelCase.ts`                                   |
| Composables      | `useX.ts`, `export function useX()`              |
| Stores           | Setup stores, `$reset()` method                  |
| API calls        | Through `gatewayService`, typed `ApiResponse<T>` |
| Imports          | Grouped by type, `import type` for types         |
| Errors           | `try/catch`, typed `unknown`, never silent       |
| Dates            | `LUXON_*` / `PRIMEVUE_*` constants               |
| Routes (global)  | `ROUTE_NAMES.X` constant                         |
| Routes (module)  | `MODULE_ROUTE_NAMES.X` from module index         |
| Modules          | `src/modules/<name>/`, public API via `index.ts`  |
| i18n             | `$t('key')` for all user-facing text             |
| Styles           | `scoped lang="scss"`, BEM, PrimeVue vars         |
