<template>
  <div class="language-switcher">
    <Select
      v-model="selectedLocale"
      :options="localeOptions"
      :placeholder="$t('common.language')"
      option-label="label"
      option-value="value"
    >
      <template #value="slotProps">
        <div v-if="slotProps.value" class="flex items-center gap-2">
          <span>{{ getLocaleLabel(slotProps.value) }}</span>
        </div>
      </template>
      <template #option="slotProps">
        <div class="flex items-center gap-2">
          <span>{{ slotProps.option.label }}</span>
        </div>
      </template>
    </Select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useI18n } from '@/composables/useI18n'

import type { Locale } from '@/locales'

const { changeLocale, currentLocale } = useI18n()

const localeOptions = [
  { label: 'English', value: 'en' },
  { label: 'Tiếng Việt', value: 'vi' },
]

const selectedLocale = computed({
  get: () => currentLocale.value,
  set: (value: Locale) => changeLocale(value),
})

const getLocaleLabel = (locale: Locale): string => {
  return localeOptions.find((option) => option.value === locale)?.label ?? 'English'
}
</script>

<style scoped>
.language-switcher {
  display: inline-block;
}
</style>
