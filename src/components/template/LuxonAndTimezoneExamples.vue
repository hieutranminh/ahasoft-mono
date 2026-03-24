<template>
  <div class="date-format-playground">
    <!-- Controls -->
    <div class="controls-section">
      <div class="control-item">
        <DatePickerField
          v-model="selectedDate"
          name="selectedDate"
          label="Select Date"
          placeholder="Choose a date and time"
        />
      </div>
      <div class="control-item">
        <label class="control-label">Timezone</label>
        <Select
          v-model="selectedTimezone"
          :options="timezoneOptions"
          option-label="label"
          option-value="value"
          placeholder="Select timezone"
          class="w-full"
        />
      </div>
    </div>

    <Divider />

    <!-- dateUtils Functions Demo -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-code" />
        dateUtils Functions (from @/utils/dateUtils)
      </h3>
      <div class="format-grid">
        <div v-for="item in dateUtilsDemo" :key="item.name" class="format-card">
          <div class="format-name">{{ item.name }}</div>
          <div class="format-pattern">{{ item.pattern }}</div>
          <div class="format-value">{{ item.value }}</div>
        </div>
      </div>
    </div>

    <Divider />

    <!-- Timezone Conversion -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-globe" />
        Timezone Conversion ({{ selectedTimezone }})
      </h3>
      <div class="format-grid">
        <div v-for="item in timezoneFormats" :key="item.name" class="format-card">
          <div class="format-name">{{ item.name }}</div>
          <div class="format-pattern">{{ item.pattern }}</div>
          <div class="format-value">{{ item.value }}</div>
          <template v-if="item.timestamp">
            <div class="format-timestamp">ts: {{ item.timestamp }}</div>
            <div class="format-timestamp">startOf: {{ item.startOfDay }}</div>
            <div class="format-timestamp">endOf: {{ item.endOfDay }}</div>
          </template>
        </div>
      </div>
    </div>

    <Divider />

    <!-- Common Date Formats -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-calendar-plus" />
        Common Date Formats
      </h3>
      <div class="format-grid">
        <div v-for="format in commonFormats" :key="format.name" class="format-card">
          <div class="format-name">{{ format.name }}</div>
          <div class="format-pattern">{{ format.pattern }}</div>
          <div class="format-value">{{ format.value }}</div>
        </div>
      </div>
    </div>

    <Divider />

    <!-- Timestamp Formats -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-clock" />
        Timestamp Formats
      </h3>
      <div class="format-grid">
        <div v-for="format in timestampFormats" :key="format.name" class="format-card">
          <div class="format-name">{{ format.name }}</div>
          <div class="format-pattern">{{ format.pattern }}</div>
          <div class="format-value timestamp">{{ format.value }}</div>
        </div>
      </div>
    </div>

    <Divider />

    <!-- Time Manipulation Formats -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-sliders-h" />
        Time Manipulation
      </h3>
      <div class="format-grid">
        <div v-for="format in manipulationFormats" :key="format.name" class="format-card">
          <div class="format-name">{{ format.name }}</div>
          <div class="format-pattern">{{ format.pattern }}</div>
          <div class="format-value">{{ format.value }}</div>
          <div v-if="format.timestamp" class="format-timestamp">{{ format.timestamp }}</div>
        </div>
      </div>
    </div>

    <Divider />

    <!-- Raw Date Object -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-database" />
        Raw Date Object
      </h3>
      <details class="raw-details" open>
        <summary>View Raw JSON</summary>
        <div class="raw-output">
          <pre>{{ rawDateInfo }}</pre>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DateTime } from 'luxon'
import { DatePickerField } from '@/components/common'
import {
  TIMEZONE_OPTIONS,
  TIMEZONE,
  LUXON_DATE_FORMAT,
  LUXON_DATETIME_FORMAT,
} from '@/constants/dateFormat'
import {
  formatDate,
  formatDateISO,
  formatDateEU,
  formatDateUS,
  formatDateTimeISO,
  formatTime,
  formatInTimezone,
  toTimestamp,
  toMillis,
  toISOString,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  getQuarter,
  getWeekNumber,
  getDayOfYear,
  isLeapYear,
  getDaysInMonth,
  getRelativeTime,
  getTimezoneOffset,
} from '@/utils/dateUtils'

interface FormatItem {
  name: string
  pattern: string
  value: string
  timestamp?: number
  startOfDay?: number
  endOfDay?: number
}

const selectedDate = ref<Date | null>(new Date())
const selectedTimezone = ref<string>(TIMEZONE.UTC)

// Convert readonly array to mutable for Select component
const timezoneOptions = [...TIMEZONE_OPTIONS]

// ============================================================================
// dateUtils Functions Demo
// ============================================================================
const dateUtilsDemo = computed((): FormatItem[] => {
  const date = selectedDate.value
  if (!date) return []

  return [
    {
      name: 'formatDate(date)',
      pattern: 'Default: dd/MM/yyyy HH:mm',
      value: formatDate(date),
    },
    {
      name: 'formatDateISO(date)',
      pattern: LUXON_DATE_FORMAT.ISO,
      value: formatDateISO(date),
    },
    {
      name: 'formatDateEU(date)',
      pattern: LUXON_DATE_FORMAT.EU,
      value: formatDateEU(date),
    },
    {
      name: 'formatDateUS(date)',
      pattern: LUXON_DATE_FORMAT.US,
      value: formatDateUS(date),
    },
    {
      name: 'formatDateTimeISO(date)',
      pattern: LUXON_DATETIME_FORMAT.ISO_SECONDS,
      value: formatDateTimeISO(date),
    },
    {
      name: 'formatTime(date)',
      pattern: 'HH:mm',
      value: formatTime(date),
    },
    {
      name: 'toTimestamp(date)',
      pattern: 'Unix seconds',
      value: String(toTimestamp(date)),
    },
    {
      name: 'toMillis(date)',
      pattern: 'Milliseconds',
      value: String(toMillis(date)),
    },
    {
      name: 'toISOString(date)',
      pattern: 'ISO 8601',
      value: toISOString(date) ?? '-',
    },
    {
      name: 'getRelativeTime(date)',
      pattern: 'Relative',
      value: getRelativeTime(date) ?? '-',
    },
    {
      name: 'getQuarter(date)',
      pattern: 'Quarter (1-4)',
      value: `Q${getQuarter(date)}`,
    },
    {
      name: 'getWeekNumber(date)',
      pattern: 'Week of year',
      value: String(getWeekNumber(date)),
    },
    {
      name: 'getDayOfYear(date)',
      pattern: 'Day of year (1-366)',
      value: String(getDayOfYear(date)),
    },
    {
      name: 'isLeapYear(date)',
      pattern: 'Boolean',
      value: String(isLeapYear(date)),
    },
    {
      name: 'getDaysInMonth(date)',
      pattern: 'Days count',
      value: String(getDaysInMonth(date)),
    },
  ]
})

// ============================================================================
// Timezone Conversion
// ============================================================================
const timezoneFormats = computed((): FormatItem[] => {
  const date = selectedDate.value
  const tz = selectedTimezone.value
  if (!date) return []

  const dt = DateTime.fromJSDate(date)
  const dtInTz = dt.setZone(tz)
  const dtLocal = dt
  const dtUTC = dt.setZone('UTC')
  const dtKorea = dt.setZone(TIMEZONE.KOREA)
  const dtChina = dt.setZone(TIMEZONE.CHINA)

  return [
    {
      name: `Time in ${tz}`,
      pattern: `formatInTimezone(date, "${tz}")`,
      value: formatInTimezone(date, tz),
      timestamp: dtInTz.toUnixInteger(),
      startOfDay: dtInTz.startOf('day').toUnixInteger(),
      endOfDay: dtInTz.endOf('day').toUnixInteger(),
    },
    {
      name: 'Timezone Offset',
      pattern: `getTimezoneOffset(date, "${tz}")`,
      value: getTimezoneOffset(date, tz) ?? '-',
    },
    {
      name: 'Local Time',
      pattern: 'Browser timezone',
      value: formatDateTimeISO(date),
      timestamp: dtLocal.toUnixInteger(),
      startOfDay: dtLocal.startOf('day').toUnixInteger(),
      endOfDay: dtLocal.endOf('day').toUnixInteger(),
    },
    {
      name: 'UTC Time',
      pattern: 'formatInTimezone(date, "UTC")',
      value: formatInTimezone(date, 'UTC'),
      timestamp: dtUTC.toUnixInteger(),
      startOfDay: dtUTC.startOf('day').toUnixInteger(),
      endOfDay: dtUTC.endOf('day').toUnixInteger(),
    },
    {
      name: 'Korea Time',
      pattern: 'formatInTimezone(date, "Asia/Seoul")',
      value: formatInTimezone(date, TIMEZONE.KOREA),
      timestamp: dtKorea.toUnixInteger(),
      startOfDay: dtKorea.startOf('day').toUnixInteger(),
      endOfDay: dtKorea.endOf('day').toUnixInteger(),
    },
    {
      name: 'China Time',
      pattern: 'formatInTimezone(date, "Asia/Shanghai")',
      value: formatInTimezone(date, TIMEZONE.CHINA),
      timestamp: dtChina.toUnixInteger(),
      startOfDay: dtChina.startOf('day').toUnixInteger(),
      endOfDay: dtChina.endOf('day').toUnixInteger(),
    },
  ]
})

// ============================================================================
// Common date formats
// ============================================================================
const commonFormats = computed((): FormatItem[] => {
  const date = selectedDate.value
  if (!date) return []

  const dt = DateTime.fromJSDate(date)
  return [
    { name: 'ISO Default', pattern: 'yyyy-MM-dd', value: dt.toFormat('yyyy-MM-dd') },
    { name: 'EU Format', pattern: 'dd/MM/yyyy', value: dt.toFormat('dd/MM/yyyy') },
    { name: 'US Format', pattern: 'MM/dd/yyyy', value: dt.toFormat('MM/dd/yyyy') },
    { name: 'Slash ISO', pattern: 'yyyy/MM/dd', value: dt.toFormat('yyyy/MM/dd') },
    {
      name: 'ISO DateTime',
      pattern: 'yyyy-MM-dd HH:mm:ss',
      value: dt.toFormat('yyyy-MM-dd HH:mm:ss'),
    },
    { name: 'Short Month', pattern: 'dd LLL yyyy', value: dt.toFormat('dd LLL yyyy') },
    { name: 'Long Month', pattern: 'dd LLLL yyyy', value: dt.toFormat('dd LLLL yyyy') },
    {
      name: 'Full DateTime',
      pattern: 'EEEE, dd LLLL yyyy HH:mm',
      value: dt.toFormat('EEEE, dd LLLL yyyy HH:mm'),
    },
    {
      name: '12-Hour Time',
      pattern: 'yyyy-MM-dd hh:mm a',
      value: dt.toFormat('yyyy-MM-dd hh:mm a'),
    },
    { name: 'Compact', pattern: 'yyyyMMdd', value: dt.toFormat('yyyyMMdd') },
    { name: 'SQL DateTime', pattern: 'toSQL()', value: dt.toSQL() ?? '' },
    { name: 'HTTP Date', pattern: 'toHTTP()', value: dt.toHTTP() ?? '' },
  ]
})

// ============================================================================
// Timestamp formats
// ============================================================================
const timestampFormats = computed((): FormatItem[] => {
  const date = selectedDate.value
  if (!date) return []

  const dt = DateTime.fromJSDate(date)
  return [
    {
      name: 'Unix Timestamp (seconds)',
      pattern: 'toUnixInteger()',
      value: String(dt.toUnixInteger()),
    },
    {
      name: 'Timestamp (milliseconds)',
      pattern: 'toMillis()',
      value: String(dt.toMillis()),
    },
    { name: 'ISO 8601', pattern: 'toISO()', value: dt.toISO() ?? '' },
    { name: 'ISO Date Only', pattern: 'toISODate()', value: dt.toISODate() ?? '' },
    { name: 'ISO Time Only', pattern: 'toISOTime()', value: dt.toISOTime() ?? '' },
    { name: 'UTC ISO', pattern: 'toUTC().toISO()', value: dt.toUTC().toISO() ?? '' },
    {
      name: 'Locale String (vi-VN)',
      pattern: 'setLocale("vi-VN").toLocaleString()',
      value: dt.setLocale('vi-VN').toLocaleString(DateTime.DATETIME_FULL),
    },
  ]
})

// ============================================================================
// Time manipulation formats
// ============================================================================
const manipulationFormats = computed((): FormatItem[] => {
  const date = selectedDate.value
  if (!date) return []

  const format = LUXON_DATETIME_FORMAT.ISO_SECONDS
  const quarterNum = getQuarter(date)

  const sod = startOfDay(date)
  const eod = endOfDay(date)
  const sow = startOfWeek(date)
  const eow = endOfWeek(date)
  const som = startOfMonth(date)
  const eom = endOfMonth(date)
  const soq = startOfQuarter(date)
  const eoq = endOfQuarter(date)
  const soy = startOfYear(date)
  const eoy = endOfYear(date)

  return [
    {
      name: 'Start of Day',
      pattern: 'startOfDay(date)',
      value: sod?.toFormat(format) ?? '-',
      timestamp: sod?.toUnixInteger(),
    },
    {
      name: 'End of Day',
      pattern: 'endOfDay(date)',
      value: eod?.toFormat(format) ?? '-',
      timestamp: eod?.toUnixInteger(),
    },
    {
      name: 'Start of Week',
      pattern: 'startOfWeek(date)',
      value: sow?.toFormat(format) ?? '-',
      timestamp: sow?.toUnixInteger(),
    },
    {
      name: 'End of Week',
      pattern: 'endOfWeek(date)',
      value: eow?.toFormat(format) ?? '-',
      timestamp: eow?.toUnixInteger(),
    },
    {
      name: 'Start of Month',
      pattern: 'startOfMonth(date)',
      value: som?.toFormat(format) ?? '-',
      timestamp: som?.toUnixInteger(),
    },
    {
      name: 'End of Month',
      pattern: 'endOfMonth(date)',
      value: eom?.toFormat(format) ?? '-',
      timestamp: eom?.toUnixInteger(),
    },
    {
      name: `Start of Q${quarterNum}`,
      pattern: 'startOfQuarter(date)',
      value: soq?.toFormat(format) ?? '-',
      timestamp: soq?.toUnixInteger(),
    },
    {
      name: `End of Q${quarterNum}`,
      pattern: 'endOfQuarter(date)',
      value: eoq?.toFormat(format) ?? '-',
      timestamp: eoq?.toUnixInteger(),
    },
    {
      name: 'Start of Year',
      pattern: 'startOfYear(date)',
      value: soy?.toFormat(format) ?? '-',
      timestamp: soy?.toUnixInteger(),
    },
    {
      name: 'End of Year',
      pattern: 'endOfYear(date)',
      value: eoy?.toFormat(format) ?? '-',
      timestamp: eoy?.toUnixInteger(),
    },
  ]
})

// ============================================================================
// Raw date info
// ============================================================================
const rawDateInfo = computed((): string => {
  const date = selectedDate.value
  if (!date) return 'No date selected'

  const dt = DateTime.fromJSDate(date)
  const dtInTz = dt.setZone(selectedTimezone.value)

  return JSON.stringify(
    {
      'Date Object': date.toString(),
      Year: dt.year,
      Month: dt.month,
      'Month Name': dt.monthLong,
      Day: dt.day,
      Hour: dt.hour,
      Minute: dt.minute,
      Second: dt.second,
      Millisecond: dt.millisecond,
      'Weekday (1=Mon, 7=Sun)': dt.weekday,
      'Weekday Name': dt.weekdayLong,
      'Day of Year': dt.ordinal,
      Quarter: dt.quarter,
      'Week of Year': dt.weekNumber,
      'Days in Month': dt.daysInMonth,
      'Days in Year': dt.daysInYear,
      'Is Leap Year': dt.isInLeapYear,
      'Is Valid': dt.isValid,
      '--- Local Timezone ---': '---',
      'Local Zone': dt.zoneName,
      'Local Offset': dt.offsetNameShort,
      'Local Offset (minutes)': dt.offset,
      '--- Selected Timezone ---': '---',
      'Selected Zone': selectedTimezone.value,
      'Time in Selected Zone': dtInTz.toFormat('yyyy-MM-dd HH:mm:ss'),
      'Offset in Selected Zone': dtInTz.offsetNameShort,
    },
    null,
    2,
  )
})
</script>

<style scoped lang="scss">
.date-format-playground {
  margin: 0 auto;
}

.controls-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.control-item {
  display: flex;
  flex-direction: column;
}

.control-label {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--p-text-color);
  margin-bottom: 0.5rem;
}

.format-section {
  margin-bottom: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--p-text-color);

  i {
    color: var(--p-primary-color);
  }
}

.format-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
}

.format-card {
  background: var(--p-surface-0);
  border: 1px solid var(--p-surface-300);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--p-primary-color);
    background: var(--p-surface-50);
  }
}

.format-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--p-text-color);
  margin-bottom: 0.25rem;
}

.format-pattern {
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
  margin-bottom: 0.5rem;
}

.format-value {
  font-family: monospace;
  font-size: 0.95rem;
  color: var(--p-primary-color);
  font-weight: 500;
  word-break: break-all;
}

.format-timestamp {
  font-family: monospace;
  font-size: 0.95rem;
  color: var(--p-primary-color);
  margin-top: 0.25rem;
}

.raw-details {
  summary {
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--p-primary-color);
    padding: 0.5rem 0;
    user-select: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.raw-output {
  background: var(--p-surface-950);
  border: 1px solid var(--p-surface-700);
  border-radius: 6px;
  padding: 0.75rem;
  overflow-x: auto;
  margin-top: 0.5rem;

  pre {
    margin: 0;
    font-family: monospace;
    font-size: 0.8rem;
    color: var(--p-surface-50);
    white-space: pre-wrap;
    line-height: 1.5;
  }
}
</style>
