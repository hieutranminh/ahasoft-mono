<template>
  <BaseField
    :field-id="name"
    :label="label"
    :help-text="helpText"
    :error="error"
    :required="required"
  >
    <template #default="{ ariaDescribedBy }">
      <InputText
        :id="name"
        v-model="internalValue"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :invalid="!!error"
        :size="size"
        :aria-describedby="ariaDescribedBy"
        :autocomplete="autocomplete"
        fluid
        v-bind="$attrs"
      />
    </template>
  </BaseField>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import BaseField from './BaseField.vue'
import type { FieldSize } from './types'

defineOptions({ inheritAttrs: false })

interface Props {
  modelValue?: string | null
  name: string
  label?: string
  placeholder?: string
  helpText?: string
  error?: string | null
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  size?: FieldSize
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: undefined,
  placeholder: undefined,
  helpText: undefined,
  error: null,
  disabled: false,
  readonly: false,
  required: false,
  size: undefined,
  autocomplete: 'off',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | null): void
}>()

const internalValue = computed({
  get(): string {
    return props.modelValue ?? ''
  },
  set(value: string): void {
    emit('update:modelValue', value || null)
  },
})
</script>
