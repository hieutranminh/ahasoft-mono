<template>
  <div class="color-option">
    <span class="color-dot" :style="{ backgroundColor: colorHex }" />
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  colorHex: string
  label: string
}>()
</script>

<style scoped lang="scss">
.color-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid var(--p-surface-300);
  flex-shrink: 0;
}
</style>
