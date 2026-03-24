<template>
  <BaseField :field-id="name" :help-text="helpText" :error="error">
    <template #default="{ ariaDescribedBy }">
      <div class="checkbox-wrapper">
        <Checkbox
          v-model="internalValue"
          :input-id="name"
          :name="name"
          :binary="binary"
          :value="value"
          :disabled="disabled"
          :invalid="!!error"
          :aria-describedby="ariaDescribedBy"
          v-bind="$attrs"
        />
        <label v-if="label" :for="name" class="checkbox-label">
          {{ label }}
          <span v-if="required" class="checkbox-label__required">*</span>
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
  modelValue?: boolean | unknown[] | null
  name: string
  label?: string
  helpText?: string
  error?: string | null
  disabled?: boolean
  required?: boolean
  binary?: boolean
  value?: unknown
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: undefined,
  helpText: undefined,
  error: null,
  disabled: false,
  required: false,
  binary: true,
  value: undefined,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean | unknown[] | null): void
}>()

const internalValue = computed({
  get(): boolean | unknown[] | null {
    return props.modelValue
  },
  set(value: boolean | unknown[] | null): void {
    emit('update:modelValue', value)
  },
})
</script>

<style scoped lang="scss">
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-label {
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
