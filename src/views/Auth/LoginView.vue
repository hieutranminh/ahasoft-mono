<template>
  <main class="login">
    <Card class="login-card">
      <template #title>
        <h1>{{ $t('auth.login') }}</h1>
      </template>

      <template #content>
        <form @submit="onFormSubmit">
          <!-- User ID Field -->
          <div class="field">
            <label for="userID" class="sr-only">{{ $t('auth.username') }}</label>
            <InputText
              id="userID"
              v-model="userID"
              name="userID"
              :placeholder="$t('auth.username')"
              :disabled="authStore.loading"
              :invalid="!!userIDError"
              autofocus
              autocomplete="username"
              aria-describedby="userID-error"
            />
            <Message
              v-if="userIDError"
              id="userID-error"
              severity="error"
              size="small"
              variant="simple"
              role="alert"
            >
              {{ userIDError }}
            </Message>
          </div>

          <!-- Password Field -->
          <div class="field">
            <label for="password" class="sr-only">{{ $t('auth.password') }}</label>
            <Password
              id="password"
              v-model="password"
              name="password"
              :placeholder="$t('auth.password')"
              :feedback="false"
              toggle-mask
              :disabled="authStore.loading"
              :invalid="!!passwordError"
              autocomplete="current-password"
              aria-describedby="password-error"
            />
            <Message
              v-if="passwordError"
              id="password-error"
              severity="error"
              size="small"
              variant="simple"
              role="alert"
            >
              {{ passwordError }}
            </Message>
          </div>

          <!-- Global Error Message -->
          <Message
            v-if="errorMessage"
            severity="error"
            size="small"
            role="alert"
            aria-live="polite"
          >
            {{ errorMessage }}
          </Message>

          <!-- Submit Button -->
          <Button
            type="submit"
            :label="$t('auth.login')"
            :loading="authStore.loading"
            :disabled="authStore.loading"
            class="w-full"
            aria-describedby="login-button-help"
          />
        </form>
      </template>

      <template #footer>
        <div class="text-center">
          <RouterLink
            to="/auth/forgot-password"
            class="text-primary forgot-password-link"
            :aria-label="$t('auth.forgotPasswordAriaLabel')"
          >
            {{ $t('auth.forgotPassword') }}
          </RouterLink>
        </div>
      </template>
    </Card>
  </main>
</template>

<script setup lang="ts">
// Vue imports
import { nextTick, ref } from 'vue'

import { toTypedSchema } from '@vee-validate/yup'
// Form validation
import { useField, useForm } from 'vee-validate'

// Store and composables
import { useAuthStore } from '@/stores/auth'

import { mapBackendLanguageToLocale, persistLocale } from '@/composables/useI18n'
import { useRouterNavigation } from '@/composables/useRouterNavigation'

// Constants
import { ROUTE_NAMES } from '@/constants'

import { loginSchema } from '@/schemas'

// Form setup with vee-validate + yup
const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: { userID: '', password: '' },
})

const { value: userID, errorMessage: userIDError } = useField<string>('userID')
const { value: password, errorMessage: passwordError } = useField<string>('password')

// Composables and state
const { navigateTo } = useRouterNavigation()
const authStore = useAuthStore()
const errorMessage = ref<string>('')

// Constants
const ERROR_MESSAGES = {
  LOGIN_FAILED: 'Invalid user ID or password. Please try again.',
  GENERIC_ERROR: 'An error occurred during login. Please try again.',
} as const

// Form submission handler
const onFormSubmit = handleSubmit(async (values) => {
  try {
    // Clear previous error and ensure UI updates
    errorMessage.value = ''
    await nextTick()

    const response = await authStore.login({
      userID: values.userID.trim(),
      password: values.password,
    })

    if (response.isOK && response.result) {
      // Set i18n locale based on user's language from backend
      const locale = mapBackendLanguageToLocale(response.result.userAuthInfo.language)
      persistLocale(locale)

      await navigateTo(ROUTE_NAMES.HOME)
    } else {
      // Extract error message from backend errorMessages array
      const backendError = response.errorMessages[0]
      errorMessage.value = backendError?.errorMessage ?? ERROR_MESSAGES.LOGIN_FAILED
    }
  } catch (error: unknown) {
    handleLoginError(error)
  }
})

// Centralized error handling for login (HTTP-level errors)
const handleLoginError = (error: unknown): void => {
  if (error instanceof Error) {
    errorMessage.value = error.message
  } else {
    errorMessage.value = ERROR_MESSAGES.GENERIC_ERROR
  }

  // Log error in development for debugging
  if (import.meta.env.DEV) {
    console.error('[Login Error]', error)
  }
}
</script>

<style scoped lang="scss"></style>
