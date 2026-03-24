<template>
  <div class="app-empty">
    <i :class="icon" class="empty-icon" />
    <h3 v-if="title" class="empty-title">{{ title }}</h3>
    <p v-if="message" class="empty-message">{{ message }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  icon?: string
}

withDefaults(defineProps<Props>(), {
  title: 'No data',
  message: 'There is no data to display',
  icon: 'pi pi-inbox',
})
</script>

<style scoped lang="scss">
.app-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  color: var(--text-color-secondary);
  margin-bottom: 1rem;
}

.empty-title {
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
}

.empty-message {
  margin: 0;
  color: var(--text-color-secondary);
}
</style>
