<template>
  <BaseField
    :field-id="name"
    :label="label"
    :help-text="helpText"
    :error="error"
    :required="required"
  >
    <template #default="{ ariaDescribedBy }">
      <DatePicker
        :model-value="displayValue"
        :input-id="name"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :invalid="!!error"
        :size="size"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled-dates="disabledDates"
        :disabled-days="disabledDays"
        :date-format="computedDateFormat"
        :show-time="showTime"
        :time-only="timeOnly"
        :hour-format="hourFormat"
        :show-seconds="showSeconds"
        :show-icon="showIcon"
        :icon-display="iconDisplay"
        :show-button-bar="showButtonBar"
        :selection-mode="selectionMode"
        :number-of-months="numberOfMonths"
        :show-week="showWeek"
        :manual-input="manualInput"
        :aria-describedby="ariaDescribedBy"
        fluid
        v-bind="$attrs"
        @update:model-value="handleValueChange"
        @date-select="handleDateSelect"
      />
    </template>
  </BaseField>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { DateTime } from 'luxon'

import { PRIMEVUE_DATE_FORMAT, PRIMEVUE_DATETIME_FORMAT } from '@/constants'

import BaseField from './BaseField.vue'
import type { FieldSize } from './types'

defineOptions({ inheritAttrs: false })

type DateMode = 'date' | 'dateTime' | 'time'
type SelectionMode = 'single' | 'multiple' | 'range'
type HourFormat = '12' | '24'
type IconDisplay = 'button' | 'input'

interface Props {
  modelValue?: Date | null
  name: string
  label?: string
  placeholder?: string
  helpText?: string
  error?: string | null
  disabled?: boolean
  required?: boolean
  size?: FieldSize
  mode?: DateMode
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  disabledDays?: number[]
  timezone?: string
  dateFormat?: string
  selectionMode?: SelectionMode
  numberOfMonths?: number
  showWeek?: boolean
  showButtonBar?: boolean
  showIcon?: boolean
  iconDisplay?: IconDisplay
  hourFormat?: HourFormat
  showSeconds?: boolean
  manualInput?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: undefined,
  placeholder: 'Select date',
  helpText: undefined,
  error: null,
  disabled: false,
  required: false,
  size: undefined,
  mode: 'date',
  minDate: undefined,
  maxDate: undefined,
  disabledDates: undefined,
  disabledDays: undefined,
  timezone: undefined,
  dateFormat: undefined,
  selectionMode: 'single',
  numberOfMonths: 1,
  showWeek: false,
  showButtonBar: false,
  showIcon: true,
  iconDisplay: 'input',
  hourFormat: '24',
  showSeconds: false,
  manualInput: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: Date | null): void
  (event: 'dateSelect', value: Date): void
}>()

// Computed properties for mode-based settings
const showTime = computed((): boolean => props.mode === 'dateTime')
const timeOnly = computed((): boolean => props.mode === 'time')

// Convert UTC date to timezone-aware display date
function toDisplayDate(utcDate: Date | null): Date | null {
  if (!utcDate) return null
  if (!props.timezone) return utcDate

  const dt = DateTime.fromJSDate(utcDate, { zone: 'utc' })
  const localDt = dt.setZone(props.timezone)
  // Create a new Date object with the local time values
  // This ensures the DatePicker displays the correct time in the target timezone
  return new Date(
    localDt.year,
    localDt.month - 1,
    localDt.day,
    localDt.hour,
    localDt.minute,
    localDt.second,
    localDt.millisecond,
  )
}

// Convert timezone-aware display date back to UTC
function toUtcDate(displayDate: Date | null): Date | null {
  if (!displayDate) return null
  if (!props.timezone) return displayDate

  // Create DateTime from the display values in the target timezone
  const localDt = DateTime.fromObject(
    {
      year: displayDate.getFullYear(),
      month: displayDate.getMonth() + 1,
      day: displayDate.getDate(),
      hour: displayDate.getHours(),
      minute: displayDate.getMinutes(),
      second: displayDate.getSeconds(),
      millisecond: displayDate.getMilliseconds(),
    },
    { zone: props.timezone },
  )
  // Convert to UTC and return as JS Date
  return localDt.toUTC().toJSDate()
}

// Display value (converted from UTC to local timezone for display)
const displayValue = computed((): Date | null => {
  return toDisplayDate(props.modelValue)
})

// Handle value changes from DatePicker
function handleValueChange(value: Date | Date[] | (Date | null)[] | null | undefined): void {
  // Handle null/undefined
  if (value === null || value === undefined) {
    emit('update:modelValue', null)
    return
  }
  // Handle single date selection
  if (value instanceof Date) {
    const utcValue = toUtcDate(value)
    emit('update:modelValue', utcValue)
    return
  }
  // Handle array values (multiple or range selection)
  // For now, emit the first valid date for single modelValue
  if (Array.isArray(value) && value.length > 0) {
    const firstDate = value[0]
    if (firstDate instanceof Date) {
      const utcValue = toUtcDate(firstDate)
      emit('update:modelValue', utcValue)
    } else {
      emit('update:modelValue', null)
    }
  }
}

function handleDateSelect(value: Date): void {
  emit('dateSelect', value)
}

// Get default date format based on mode
// Note: For time-only mode, dateFormat is not used (time is rendered separately)
function getDefaultDateFormat(mode: DateMode): string {
  switch (mode) {
    case 'date':
      return PRIMEVUE_DATE_FORMAT.ISO
    case 'dateTime':
      return PRIMEVUE_DATETIME_FORMAT.ISO
    case 'time':
      // For timeOnly mode, dateFormat is ignored by PrimeVue DatePicker
      return PRIMEVUE_DATE_FORMAT.ISO
    default:
      return PRIMEVUE_DATE_FORMAT.ISO
  }
}

const computedDateFormat = computed((): string => {
  return props.dateFormat ?? getDefaultDateFormat(props.mode)
})
</script>
