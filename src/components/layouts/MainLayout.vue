<template>
  <div class="main-layout">
    <AppHeader />
    <main class="main-content">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

import { useAuthStore } from '@/stores/auth'
import { useShopStore } from '@/stores/shop'

import { useSignalRStore } from '@/modules/signalr/stores/signalRStore'

const authStore = useAuthStore()
const shopStore = useShopStore()
const signalRStore = useSignalRStore()

/**
 * Initialize shop configuration data when authenticated but not yet loaded.
 * Covers both: login navigation and page refresh (F5).
 */
onMounted(async () => {
  if (authStore.isAuthenticated && !shopStore.isInitialized && authStore.userAuthInfo) {
    await shopStore.initialize(authStore.userAuthInfo.shopId, authStore.userAuthInfo.countryCode)
  }

  // SignalR is initialized here (not in App.vue) because MainLayout
  // is only rendered for authenticated routes — so we're guaranteed
  // to have a valid auth token and shopId available.
  if (authStore.isAuthenticated && signalRStore.isDisconnected) {
    await initializeSignalR()
  }
})

// Dispose the connection when leaving the authenticated layout
// (e.g. logout navigates to /auth which unmounts MainLayout).
onUnmounted(() => {
  signalRStore.dispose()
})

async function initializeSignalR(): Promise<void> {
  if (!authStore.userAuthInfo) {
    return
  }

  try {
    await signalRStore.connectWithAppConfig(authStore.userAuthInfo.shopId)
  } catch (error: unknown) {
    console.error('Failed to initialize SignalR:', error)
  }
}
</script>

<style scoped lang="scss">
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>
