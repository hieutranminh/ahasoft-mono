<template>
  <div class="theme-examples">
    <!-- Controls Section -->
    <div class="controls-section">
      <div class="control-item">
        <label class="control-label">Theme Preset</label>
        <Select
          v-model="preferences.preset"
          :options="presetOptions"
          option-label="label"
          option-value="value"
          placeholder="Select preset"
          class="w-full"
          @change="onThemeChange"
        />
      </div>
      <div class="control-item">
        <label class="control-label">Primary Color</label>
        <Select
          v-model="preferences.primaryColor"
          :options="colorOptions"
          option-label="label"
          option-value="value"
          placeholder="Select color"
          class="w-full"
          @change="onColorSelectChange"
        >
          <template #value="slotProps">
            <ColorOption
              v-if="slotProps.value"
              :color-hex="getColorHex(slotProps.value)"
              :label="formatColorLabel(slotProps.value)"
            />
          </template>
          <template #option="slotProps">
            <ColorOption
              :color-hex="getColorHex(slotProps.option.value)"
              :label="slotProps.option.label"
            />
          </template>
        </Select>
      </div>
      <div v-if="preferences.primaryColor === 'custom'" class="control-item">
        <label class="control-label">Custom Color</label>
        <div class="custom-color-picker">
          <ColorPicker
            v-model="customColorValue"
            format="hex"
            @update:model-value="onCustomColorChange"
          />
          <InputText
            v-model="customHexInput"
            placeholder="#000000"
            class="hex-input"
            @blur="onHexInputBlur"
            @keyup.enter="onHexInputBlur"
          />
        </div>
      </div>
      <div class="control-item">
        <label class="control-label">Surface Color</label>
        <Select
          v-model="preferences.surfaceColor"
          :options="surfaceOptions"
          option-label="label"
          option-value="value"
          placeholder="Select surface"
          class="w-full"
          @change="onThemeChange"
        >
          <template #value="slotProps">
            <ColorOption
              v-if="slotProps.value"
              :color-hex="getColorHex(slotProps.value)"
              :label="formatColorLabel(slotProps.value)"
            />
          </template>
          <template #option="slotProps">
            <ColorOption
              :color-hex="getColorHex(slotProps.option.value)"
              :label="slotProps.option.label"
            />
          </template>
        </Select>
      </div>
      <div class="control-item">
        <label class="control-label"
          >Mode ( {{ preferences.darkMode ? 'Dark Mode' : 'Light Mode' }} )</label
        >
        <div class="dark-mode-toggle">
          <ToggleSwitch v-model="preferences.darkMode" @change="onDarkModeChange" />
        </div>
      </div>
    </div>

    <Divider />

    <!-- Primary Color Palette -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-palette" />
        Primary Color Palette
        <span v-if="customPalette" class="section-subtitle"
          >(Generated from {{ preferences.customHexColor }})</span
        >
      </h3>
      <div class="color-palette">
        <div
          v-for="shade in primaryShades"
          :key="shade.name"
          class="color-swatch"
          :style="{ backgroundColor: shade.cssVar }"
        >
          <span class="color-name">{{ shade.name }}</span>
          <span class="color-value">{{ shade.hexValue ?? shade.cssVar }}</span>
        </div>
      </div>
    </div>

    <Divider />

    <!-- Surface Colors -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-th-large" />
        Surface Colors
      </h3>
      <div class="color-palette">
        <div
          v-for="surface in surfaceColors"
          :key="surface.name"
          class="color-swatch surface-swatch"
          :style="{ backgroundColor: surface.cssVar }"
        >
          <span class="color-name">{{ surface.name }}</span>
          <span class="color-value">{{ surface.cssVar }}</span>
        </div>
      </div>
    </div>

    <Divider />

    <!-- Component Preview -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-eye" />
        Component Preview
      </h3>
      <div class="component-preview">
        <div class="preview-row">
          <Button label="Primary" />
          <Button label="Secondary" severity="secondary" />
          <Button label="Success" severity="success" />
          <Button label="Info" severity="info" />
          <Button label="Warn" severity="warn" />
          <Button label="Danger" severity="danger" />
          <Button label="Contrast" severity="contrast" />
        </div>
        <div class="preview-row">
          <Button label="Primary" outlined />
          <Button label="Secondary" severity="secondary" outlined />
          <Button label="Success" severity="success" outlined />
          <Button label="Info" severity="info" outlined />
          <Button label="Warn" severity="warn" outlined />
          <Button label="Danger" severity="danger" outlined />
        </div>
        <div class="preview-row">
          <InputText placeholder="Input text" />
          <InputNumber placeholder="Input number" />
          <Checkbox v-model="demoCheckbox" binary />
          <ToggleSwitch v-model="demoSwitch" />
        </div>
        <div class="preview-row">
          <Tag value="Primary" />
          <Tag value="Success" severity="success" />
          <Tag value="Info" severity="info" />
          <Tag value="Warn" severity="warn" />
          <Tag value="Danger" severity="danger" />
          <Tag value="Secondary" severity="secondary" />
          <Tag value="Contrast" severity="contrast" />
        </div>
        <div class="preview-row">
          <Badge value="5" />
          <Badge value="10" severity="success" />
          <Badge value="2" severity="info" />
          <Badge value="!" severity="warn" />
          <Badge value="X" severity="danger" />
          <Badge value="0" severity="secondary" />
          <Badge value="99+" severity="contrast" />
        </div>
      </div>
    </div>

    <Divider />

    <!-- Card Preview -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-id-card" />
        Card Preview
      </h3>
      <div class="card-preview">
        <Card>
          <template #title>Card Title</template>
          <template #subtitle>Card Subtitle</template>
          <template #content>
            <p>
              This is a sample card content to demonstrate the theme styling. The card uses surface
              colors and border styles from the current theme.
            </p>
          </template>
          <template #footer>
            <Button label="Save" icon="pi pi-check" />
            <Button label="Cancel" icon="pi pi-times" severity="secondary" outlined />
          </template>
        </Card>
      </div>
    </div>

    <Divider />

    <!-- Message Preview -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-info-circle" />
        Message Preview
      </h3>
      <div class="message-preview">
        <Message severity="success">Success message</Message>
        <Message severity="info">Info message</Message>
        <Message severity="warn">Warning message</Message>
        <Message severity="error">Error message</Message>
        <Message severity="secondary">Secondary message</Message>
        <Message severity="contrast">Contrast message</Message>
      </div>
    </div>

    <Divider />

    <!-- CSS Variables Reference -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-code" />
        CSS Variables Reference
      </h3>
      <div class="css-reference">
        <div v-for="group in cssVariableGroups" :key="group.name" class="css-group">
          <h4 class="group-title">{{ group.name }}</h4>
          <div class="variable-list">
            <div v-for="variable in group.variables" :key="variable" class="variable-item">
              <code>{{ variable }}</code>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Divider />

    <!-- Current Preferences (Debug) -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-database" />
        Current Preferences (localStorage)
      </h3>
      <details class="raw-details" open>
        <summary>View Raw JSON</summary>
        <div class="raw-output">
          <pre>{{ JSON.stringify(preferences, null, 2) }}</pre>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {
  THEME_PRESETS,
  PRIMARY_COLORS,
  SURFACE_COLORS,
  COLOR_HEX_MAP,
  updateThemePreset,
  loadThemePreferences,
  saveThemePreferences,
  setDarkMode,
  type ThemePreferences,
} from '@/plugins/primevue'
import { isValidHexColor, generateColorPalette } from '@/utils/colorUtils'
import ColorOption from './partials/ColorOption.vue'

// Reactive preferences state - loaded from localStorage
const preferences = reactive<ThemePreferences>(loadThemePreferences())

// Custom color state
const customColorValue = ref<string>(preferences.customHexColor?.replace('#', '') ?? '10b981')
const customHexInput = ref<string>(preferences.customHexColor ?? '#10b981')

// Demo form controls
const demoCheckbox = ref(true)
const demoSwitch = ref(true)

// Select options
const presetOptions = Object.keys(THEME_PRESETS).map((key) => ({
  label: key.charAt(0).toUpperCase() + key.slice(1),
  value: key,
}))

const colorOptions = PRIMARY_COLORS.map((color) => ({
  label:
    color === 'custom' ? 'Custom (Pick Color)' : color.charAt(0).toUpperCase() + color.slice(1),
  value: color,
}))

const surfaceOptions = SURFACE_COLORS.map((color) => ({
  label: color.charAt(0).toUpperCase() + color.slice(1),
  value: color,
}))

// Get hex color for preview dot
const getColorHex = (colorName: string): string => {
  if (colorName === 'custom' && preferences.customHexColor) {
    return preferences.customHexColor
  }
  return COLOR_HEX_MAP[colorName] ?? '#888888'
}

// Format color label for display
const formatColorLabel = (colorName: string): string => {
  if (colorName === 'custom') {
    return 'Custom (Pick Color)'
  }
  return colorName.charAt(0).toUpperCase() + colorName.slice(1)
}

// Primary color shade names (cached outside computed for performance)
const PRIMARY_SHADE_NAMES = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const

// Primary color shades for palette display
const primaryShades = computed(() => {
  const palette = customPalette.value

  return PRIMARY_SHADE_NAMES.map((shade) => ({
    name: shade,
    cssVar: 'var(--p-primary-' + shade + ')',
    hexValue: palette ? palette[shade] : undefined,
  }))
})

// Surface colors for display
const surfaceColors = computed(() => [
  { name: 'Surface 0', cssVar: 'var(--p-surface-0)' },
  { name: 'Surface 50', cssVar: 'var(--p-surface-50)' },
  { name: 'Surface 100', cssVar: 'var(--p-surface-100)' },
  { name: 'Surface 200', cssVar: 'var(--p-surface-200)' },
  { name: 'Surface 300', cssVar: 'var(--p-surface-300)' },
  { name: 'Surface 400', cssVar: 'var(--p-surface-400)' },
  { name: 'Surface 500', cssVar: 'var(--p-surface-500)' },
  { name: 'Surface 600', cssVar: 'var(--p-surface-600)' },
  { name: 'Surface 700', cssVar: 'var(--p-surface-700)' },
  { name: 'Surface 800', cssVar: 'var(--p-surface-800)' },
  { name: 'Surface 900', cssVar: 'var(--p-surface-900)' },
  { name: 'Surface 950', cssVar: 'var(--p-surface-950)' },
])

// CSS variable groups for reference
const cssVariableGroups = [
  {
    name: 'Primary Colors',
    variables: [
      '--p-primary-color',
      '--p-primary-contrast-color',
      '--p-primary-hover-color',
      '--p-primary-active-color',
    ],
  },
  {
    name: 'Text Colors',
    variables: ['--p-text-color', '--p-text-muted-color', '--p-text-hover-color'],
  },
  {
    name: 'Surface & Background',
    variables: [
      '--p-surface-ground',
      '--p-surface-section',
      '--p-surface-card',
      '--p-surface-overlay',
      '--p-surface-border',
    ],
  },
  {
    name: 'Content Colors',
    variables: [
      '--p-content-background',
      '--p-content-hover-background',
      '--p-content-border-color',
      '--p-content-color',
      '--p-content-hover-color',
    ],
  },
]

// Event handler for preset changes
const onThemeChange = (): void => {
  updateThemePreset(
    preferences.preset,
    preferences.primaryColor,
    preferences.customHexColor,
    preferences.surfaceColor,
  )
  saveThemePreferences(preferences)
}

// Event handler for color select changes
const onColorSelectChange = (): void => {
  if (preferences.primaryColor === 'custom') {
    // When switching to custom, apply the current custom color
    const hexColor = `#${customColorValue.value}`
    preferences.customHexColor = hexColor
    customHexInput.value = hexColor
  }
  onThemeChange()
}

// Event handler for color picker changes
const onCustomColorChange = (value: string): void => {
  const hexColor = `#${value}`
  customHexInput.value = hexColor
  preferences.customHexColor = hexColor
  onThemeChange()
}

// Event handler for hex input blur
const onHexInputBlur = (): void => {
  let hex = customHexInput.value.trim()
  if (!hex.startsWith('#')) {
    hex = `#${hex}`
  }
  if (isValidHexColor(hex)) {
    customColorValue.value = hex.replace('#', '')
    preferences.customHexColor = hex
    customHexInput.value = hex
    onThemeChange()
  } else {
    // Revert to previous valid value
    customHexInput.value = preferences.customHexColor ?? '#10b981'
  }
}

// Event handler for dark mode toggle
const onDarkModeChange = (): void => {
  setDarkMode(preferences.darkMode)
  saveThemePreferences(preferences)
}

// Generated custom palette for display
const customPalette = computed(() => {
  if (preferences.primaryColor === 'custom' && preferences.customHexColor) {
    return generateColorPalette(preferences.customHexColor)
  }
  return null
})
</script>

<style scoped lang="scss">
.theme-examples {
  margin: 0 auto;
}

.controls-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--p-text-color);
}

.custom-color-picker {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.hex-input {
  width: 100px;
  font-family: monospace;
}

.dark-mode-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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

  .section-subtitle {
    font-size: 0.8rem;
    font-weight: 400;
    color: var(--p-text-muted-color);
  }
}

.color-palette {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.color-swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 1px solid var(--p-surface-300);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.surface-swatch {
  width: 100px;
}

.color-name {
  font-weight: 600;
  font-size: 0.75rem;
  color: var(--p-text-color);
  text-shadow:
    1px 1px 2px rgba(255, 255, 255, 0.8),
    -1px -1px 2px rgba(0, 0, 0, 0.3);
}

.color-value {
  font-family: monospace;
  font-size: 0.6rem;
  color: var(--p-text-muted-color);
  text-shadow:
    1px 1px 2px rgba(255, 255, 255, 0.8),
    -1px -1px 2px rgba(0, 0, 0, 0.3);
}

.component-preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.card-preview {
  max-width: 400px;

  :deep(.p-card-footer) {
    display: flex;
    gap: 0.5rem;
  }
}

.message-preview {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.css-reference {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.css-group {
  background: var(--p-surface-50);
  border: 1px solid var(--p-surface-200);
  border-radius: 8px;
  padding: 1rem;
}

.group-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--p-text-color);
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--p-surface-200);
}

.variable-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.variable-item {
  code {
    font-family: monospace;
    font-size: 0.8rem;
    color: var(--p-primary-color);
    background: var(--p-surface-100);
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
  }
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
