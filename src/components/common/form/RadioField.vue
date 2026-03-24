<template>
  <BaseField :field-id="name" :help-text="helpText" :error="error">
    <template #default="{ ariaDescribedBy }">
      <!-- Use fieldset/legend for proper radio group semantics (not <label for>) -->
      <fieldset
        class="radio-fieldset"
        role="radiogroup"
        :aria-required="required"
        :aria-invalid="!!error"
        :aria-describedby="ariaDescribedBy"
      >
        <legend v-if="label" class="radio-fieldset__legend">
          {{ label }}
          <span v-if="required" class="radio-fieldset__required">*</span>
        </legend>
        <div class="radio-group" :class="{ 'radio-group--horizontal': horizontal }">
          <div v-for="option in options" :key="String(getOptionValue(option))" class="radio-item">
            <RadioButton
              v-model="internalValue"
              :input-id="`${name}-${String(getOptionValue(option))}`"
              :name="name"
              :value="getOptionValue(option)"
              :disabled="disabled || isOptionDisabled(option)"
              :invalid="!!error"
              v-bind="$attrs"
            />
            <label :for="`${name}-${String(getOptionValue(option))}`" class="radio-item__label">
              {{ getOptionLabel(option) }}
            </label>
          </div>
        </div>
      </fieldset>
    </template>
  </BaseField>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import BaseField from './BaseField.vue'

defineOptions({ inheritAttrs: false })

interface RadioOption {
  label?: string
  value?: unknown
  disabled?: boolean
  [key: string]: unknown
}

interface Props {
  modelValue?: unknown
  name: string
  label?: string
  helpText?: string
  error?: string | null
  disabled?: boolean
  required?: boolean
  options: RadioOption[]
  optionLabel?: string
  optionValue?: string
  optionDisabled?: string
  horizontal?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  label: undefined,
  helpText: undefined,
  error: null,
  disabled: false,
  required: false,
  optionLabel: 'label',
  optionValue: 'value',
  optionDisabled: 'disabled',
  horizontal: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: unknown): void
}>()

const internalValue = computed({
  get(): unknown {
    return props.modelValue
  },
  set(value: unknown): void {
    emit('update:modelValue', value)
  },
})

function getOptionLabel(option: RadioOption): string {
  if (typeof option === 'string' || typeof option === 'number') {
    return String(option)
  }
  return String(option[props.optionLabel] ?? '')
}

function getOptionValue(option: RadioOption): unknown {
  if (typeof option === 'string' || typeof option === 'number') {
    return option
  }
  return option[props.optionValue]
}

function isOptionDisabled(option: RadioOption): boolean {
  if (typeof option === 'string' || typeof option === 'number') {
    return false
  }
  return Boolean(option[props.optionDisabled])
}
</script>

<style scoped lang="scss">
.radio-fieldset {
  border: none;
  margin: 0;
  padding: 0;

  &__legend {
    font-weight: 500;
    font-size: 0.875rem;
    color: var(--p-text-color);
    margin-bottom: 0.5rem;
    padding: 0;
  }

  &__required {
    color: var(--p-red-500);
    margin-left: 0.125rem;
  }
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &--horizontal {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &__label {
    font-size: 0.875rem;
    color: var(--p-text-color);
    cursor: pointer;
    user-select: none;
  }
}
</style>
