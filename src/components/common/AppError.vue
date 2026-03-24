<template>
  <div class="app-error">
    <Message severity="error" :closable="closable" @close="$emit('close')">
      <template v-if="title">
        <strong>{{ title }}</strong>
        <br />
      </template>
      {{ message }}
    </Message>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message: string
  closable?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Error',
  closable: true,
})

defineEmits<{
  close: []
}>()
</script>

<style scoped lang="scss">
.app-error {
  margin: 1rem 0;
}
</style>
