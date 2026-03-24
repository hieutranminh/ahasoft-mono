<template>
  <BaseField
    :field-id="name"
    :label="label"
    :help-text="helpText"
    :error="error"
    :required="required"
  >
    <template #default="{ ariaDescribedBy }">
      <MultiSelect
        v-model="internalValue"
        :input-id="name"
        :name="name"
        :options="options"
        :option-label="optionLabel"
        :option-value="optionValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :invalid="!!error"
        :size="size"
        :loading="loading"
        :filter="filter"
        :filter-placeholder="filterPlaceholder"
        :show-clear="showClear"
        :display="display"
        :max-selected-labels="maxSelectedLabels"
        :selection-limit="selectionLimit"
        :selected-items-label="selectedItemsLabel"
        :virtual-scroller-options="virtualScrollerOptions"
        :aria-describedby="ariaDescribedBy"
        fluid
        v-bind="$attrs"
      >
        <template v-if="$slots.value" #value="slotProps">
          <slot name="value" v-bind="slotProps" />
        </template>
        <template v-if="$slots.option" #option="slotProps">
          <slot name="option" v-bind="slotProps" />
        </template>
        <template v-if="$slots.chip" #chip="slotProps">
          <slot name="chip" v-bind="slotProps" />
        </template>
      </MultiSelect>
    </template>
  </BaseField>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import BaseField from './BaseField.vue'
import type { FieldSize } from './types'

defineOptions({ inheritAttrs: false })

type DisplayMode = 'comma' | 'chip' | undefined

interface VirtualScrollerOptions {
  itemSize?: number
  [key: string]: unknown
}

interface Props {
  modelValue?: unknown[]
  name: string
  label?: string
  placeholder?: string
  helpText?: string
  error?: string | null
  disabled?: boolean
  required?: boolean
  size?: FieldSize
  options: unknown[]
  optionLabel?: string
  optionValue?: string
  loading?: boolean
  filter?: boolean
  filterPlaceholder?: string
  showClear?: boolean
  display?: DisplayMode
  maxSelectedLabels?: number
  selectionLimit?: number
  selectedItemsLabel?: string
  virtualScrollerOptions?: VirtualScrollerOptions
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  label: undefined,
  placeholder: 'Select options',
  helpText: undefined,
  error: null,
  disabled: false,
  required: false,
  size: undefined,
  optionLabel: 'label',
  optionValue: 'value',
  loading: false,
  filter: false,
  filterPlaceholder: 'Search...',
  showClear: false,
  display: 'comma',
  maxSelectedLabels: 3,
  selectionLimit: undefined,
  selectedItemsLabel: undefined,
  virtualScrollerOptions: undefined,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: unknown[]): void
}>()

const internalValue = computed({
  get(): unknown[] {
    return props.modelValue ?? []
  },
  set(value: unknown[]): void {
    emit('update:modelValue', value)
  },
})
</script>
