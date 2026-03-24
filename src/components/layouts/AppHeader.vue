<template>
  <header>
    <div>
      <h1>App Header</h1>
    </div>
    <div>
      <Button
        :label="$t('auth.logout')"
        :loading="authStore.loading"
        :disabled="authStore.loading"
        @click="handleLogout"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

import { useRouterNavigation } from '@/composables/useRouterNavigation'

import { ROUTE_NAMES } from '@/constants'

const authStore = useAuthStore()
const { navigateTo } = useRouterNavigation()

const handleLogout = async (): Promise<void> => {
  try {
    authStore.logout()
    await navigateTo(ROUTE_NAMES.LOGIN)
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>
