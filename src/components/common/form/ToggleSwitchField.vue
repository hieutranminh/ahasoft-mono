<template>
  <BaseField :field-id="name" :help-text="helpText" :error="error">
    <template #default="{ ariaDescribedBy }">
      <div class="toggle-wrapper">
        <ToggleSwitch
          v-model="internalValue"
          :input-id="name"
          :name="name"
          :disabled="disabled"
          :invalid="!!error"
          :aria-describedby="ariaDescribedBy"
          v-bind="$attrs"
        />
        <label v-if="label" :for="name" class="toggle-label">
          {{ label }}
          <span v-if="required" class="toggle-label__required">*</span>
        </label>
      </div>
    </template>
  </BaseField>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import BaseField from './BaseField.vue'

defineOptions({ inheritAttrs: false })

interface Props {
  modelValue?: boolean
  name: string
  label?: string
  helpText?: string
  error?: string | null
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: undefined,
  helpText: undefined,
  error: null,
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const internalValue = computed({
  get(): boolean {
    return props.modelValue ?? false
  },
  set(value: boolean): void {
    emit('update:modelValue', value)
  },
})
</script>

<style scoped lang="scss">
.toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toggle-label {
  font-size: 0.875rem;
  color: var(--p-text-color);
  cursor: pointer;
  user-select: none;

  &__required {
    color: var(--p-red-500);
    margin-left: 0.125rem;
  }
}
</style>
