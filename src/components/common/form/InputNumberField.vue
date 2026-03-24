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
        ref="inputRef"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :invalid="!!error"
        :size="size"
        :maxlength="maxLength"
        :aria-describedby="ariaDescribedBy"
        fluid
        v-bind="$attrs"
      />
    </template>
  </BaseField>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

import { CurrencyDisplay, type CurrencyInputOptions, useCurrencyInput } from 'vue-currency-input'

import BaseField from './BaseField.vue'
import type { FieldSize } from './types'

defineOptions({ inheritAttrs: false })

type NumberMode = 'decimal' | 'currency' | undefined

interface Props {
  modelValue?: number | null
  name: string
  label?: string
  placeholder?: string
  helpText?: string
  error?: string | null
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  size?: FieldSize
  min?: number
  max?: number
  precision?: number | { min: number; max: number }
  currency?: string
  mode?: NumberMode
  locale?: string
  hideCurrencySymbolOnFocus?: boolean
  hideGroupingSeparatorOnFocus?: boolean
  useGrouping?: boolean
  accountingSign?: boolean
  maxLength?: number
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
  min: undefined,
  max: undefined,
  precision: undefined,
  currency: undefined,
  mode: 'decimal',
  locale: undefined,
  hideCurrencySymbolOnFocus: true,
  hideGroupingSeparatorOnFocus: false,
  useGrouping: true,
  accountingSign: false,
  maxLength: 15,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: number | null): void
}>()

// Build currency input options based on props
const currencyInputOptions = computed((): CurrencyInputOptions => {
  // Handle currency mode
  if (props.mode === 'currency' && props.currency) {
    return {
      currency: props.currency,
      locale: props.locale,
      hideCurrencySymbolOnFocus: props.hideCurrencySymbolOnFocus,
      hideGroupingSeparatorOnFocus: props.hideGroupingSeparatorOnFocus,
      useGrouping: props.useGrouping,
      accountingSign: props.accountingSign,
      precision: props.precision,
      valueRange:
        props.min !== undefined || props.max !== undefined
          ? { min: props.min, max: props.max }
          : undefined,
    }
  }

  // For decimal mode, use a dummy currency but hide the symbol
  return {
    currency: 'USD',
    currencyDisplay: CurrencyDisplay.hidden,
    locale: props.locale,
    hideCurrencySymbolOnFocus: props.hideCurrencySymbolOnFocus,
    hideGroupingSeparatorOnFocus: props.hideGroupingSeparatorOnFocus,
    useGrouping: props.useGrouping,
    accountingSign: props.accountingSign,
    precision: props.precision,
    valueRange:
      props.min !== undefined || props.max !== undefined
        ? { min: props.min, max: props.max }
        : undefined,
  }
})

// Use vue-currency-input composable with autoEmit disabled to have full control
const { inputRef, numberValue, setValue, setOptions } = useCurrencyInput(
  currencyInputOptions.value,
  false,
)

// Watch numberValue changes and emit to parent
watch(numberValue, (newValue) => {
  emit('update:modelValue', newValue)
})

// Watch for external value changes and sync to input
watch(
  () => props.modelValue,
  (newValue) => {
    // Only update if different from current numberValue to avoid loops
    if (newValue !== numberValue.value) {
      setValue(newValue)
    }
  },
  { immediate: true },
)

// Watch for options changes and update the input
watch(currencyInputOptions, (newOptions) => {
  setOptions(newOptions)
})

defineExpose({
  inputRef,
})
</script>
