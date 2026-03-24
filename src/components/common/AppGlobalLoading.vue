<template>
  <Transition name="fade">
    <div v-if="loadingStore.isLoading" class="global-loading-overlay">
      <ProgressSpinner stroke-width="3" animation-duration="0.8s" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useLoadingStore } from '@/stores/loading'

const loadingStore = useLoadingStore()
</script>

<style scoped lang="scss">
.global-loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.6);
  pointer-events: all;
}

// Fade transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
