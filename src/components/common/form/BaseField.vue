<template>
  <div class="base-field" :class="{ 'base-field--error': hasError }">
    <label v-if="label" :for="fieldId" class="base-field__label">
      {{ label }}
      <span v-if="required" class="base-field__required">*</span>
    </label>
    <slot :aria-described-by="ariaDescribedBy" />
    <small v-if="helpText && !hasError" :id="helpId" class="base-field__help">
      {{ helpText }}
    </small>
    <Message
      v-if="hasError"
      :id="errorId"
      severity="error"
      size="small"
      variant="simple"
      role="alert"
    >
      {{ error }}
    </Message>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  fieldId: string
  label?: string
  helpText?: string
  error?: string | null
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  helpText: undefined,
  error: null,
  required: false,
})

const hasError = computed((): boolean => !!props.error)

const helpId = computed((): string => `${props.fieldId}-help`)

const errorId = computed((): string => `${props.fieldId}-error`)

// Compute aria-describedby to include both help text and error message
const ariaDescribedBy = computed((): string | undefined => {
  const ids: string[] = []
  if (props.helpText && !hasError.value) {
    ids.push(helpId.value)
  }
  if (hasError.value) {
    ids.push(errorId.value)
  }
  return ids.length > 0 ? ids.join(' ') : undefined
})
</script>

<style scoped lang="scss">
.base-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  &__label {
    display: block;
    font-weight: 500;
    color: var(--p-text-color);
    margin-bottom: 0.125rem;
  }

  &__required {
    color: var(--p-red-500);
    margin-left: 0.125rem;
  }

  &__help {
    color: var(--p-text-muted-color);
  }

  &--error {
    :deep(.p-inputtext),
    :deep(.p-inputnumber-input),
    :deep(.p-select),
    :deep(.p-multiselect),
    :deep(.p-textarea),
    :deep(.p-password-input),
    :deep(.p-inputmask) {
      border-color: var(--p-red-500);
    }
  }
}
</style>
