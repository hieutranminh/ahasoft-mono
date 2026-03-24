<template>
  <BaseField :field-id="name" :help-text="helpText" :error="error">
    <template #default="{ ariaDescribedBy }">
      <!-- Editor (Quill) is not a labelable element, use aria-labelledby instead -->
      <span v-if="label" :id="`${name}-label`" class="editor-label">
        {{ label }}
        <span v-if="required" class="editor-label__required">*</span>
      </span>
      <Editor
        v-model="internalValue"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :modules="modules"
        :formats="formats"
        :aria-labelledby="label ? `${name}-label` : undefined"
        :aria-describedby="ariaDescribedBy"
        :class="{ 'p-invalid': !!error, 'p-disabled': disabled }"
        v-bind="$attrs"
      >
        <template v-if="$slots.toolbar" #toolbar>
          <slot name="toolbar" />
        </template>
      </Editor>
    </template>
  </BaseField>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import BaseField from './BaseField.vue'

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
  modules?: object
  formats?: string[]
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
  modules: undefined,
  formats: undefined,
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

<style scoped lang="scss">
.editor-label {
  display: block;
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--p-text-color);
  margin-bottom: 0.25rem;

  &__required {
    color: var(--p-red-500);
    margin-left: 0.125rem;
  }
}

:deep(.p-editor) {
  &.p-invalid {
    .p-editor-container {
      border-color: var(--p-red-500);
    }
  }
}
</style>
