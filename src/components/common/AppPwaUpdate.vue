<template>
  <!-- Update available banner -->
  <Transition name="pwa-slide">
    <div v-if="needRefresh" class="pwa-banner pwa-banner--update" role="alert">
      <div class="pwa-banner__content">
        <i class="pi pi-refresh pwa-banner__icon" />
        <span class="pwa-banner__text">
          {{ $t('pwa.updateAvailable', 'A new version is available.') }}
        </span>
      </div>
      <div class="pwa-banner__actions">
        <button class="pwa-btn pwa-btn--primary" type="button" @click="onUpdate">
          {{ $t('pwa.update', 'Update') }}
        </button>
        <button class="pwa-btn pwa-btn--ghost" type="button" @click="onDismiss">
          {{ $t('pwa.dismiss', 'Later') }}
        </button>
      </div>
    </div>
  </Transition>

  <!-- Offline ready banner -->
  <Transition name="pwa-slide">
    <div v-if="showOfflineReady" class="pwa-banner pwa-banner--offline" role="status">
      <div class="pwa-banner__content">
        <i class="pi pi-check-circle pwa-banner__icon" />
        <span class="pwa-banner__text">
          {{ $t('pwa.offlineReady', 'App is ready to work offline.') }}
        </span>
      </div>
      <div class="pwa-banner__actions">
        <button class="pwa-btn pwa-btn--ghost" type="button" @click="onDismissOffline">
          {{ $t('pwa.ok', 'OK') }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import { usePwaUpdate } from '@/composables/usePwaUpdate'

const { needRefresh, offlineReady, updateServiceWorker, close } = usePwaUpdate()

const showOfflineReady = ref(false)

// Auto-dismiss offline banner after 4 seconds
let offlineTimer: ReturnType<typeof setTimeout> | undefined

watch(offlineReady, (isReady: boolean) => {
  if (isReady) {
    showOfflineReady.value = true
    offlineTimer = setTimeout(() => {
      showOfflineReady.value = false
      close()
    }, 4000)
  }
})

const onUpdate = async (): Promise<void> => {
  await updateServiceWorker()
}

const onDismiss = (): void => {
  close()
}

const onDismissOffline = (): void => {
  if (offlineTimer) {
    clearTimeout(offlineTimer)
  }
  showOfflineReady.value = false
  close()
}
</script>

<style scoped lang="scss">
.pwa-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1.5rem;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
}

.pwa-banner--update {
  background-color: var(--p-primary-color, #3b82f6);
  color: #fff;
}

.pwa-banner--offline {
  background-color: var(--p-green-500, #22c55e);
  color: #fff;
}

.pwa-banner__content {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.pwa-banner__icon {
  font-size: 1.125rem;
}

.pwa-banner__text {
  font-size: 0.875rem;
  font-weight: 500;
}

.pwa-banner__actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.pwa-btn {
  padding: 0.375rem 0.875rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }

  &:active {
    opacity: 0.7;
  }
}

.pwa-btn--primary {
  background-color: #fff;
  color: var(--p-primary-color, #3b82f6);
}

.pwa-btn--ghost {
  background-color: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

// Slide-up transition
.pwa-slide-enter-active,
.pwa-slide-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.pwa-slide-enter-from,
.pwa-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
