<template>
  <div class="viewport-info-example">
    <!-- Quick Status Cards -->
    <div class="status-cards">
      <div class="status-card dimensions">
        <i class="pi pi-arrows-alt" />
        <span>{{ info.width }} × {{ info.height }}</span>
      </div>
      <div class="status-card" :class="{ portrait: isPortrait, landscape: isLandscape }">
        <i :class="isPortrait ? 'pi pi-arrows-v' : 'pi pi-arrows-h'" />
        <span>{{ info.orientation }}</span>
      </div>
      <div class="status-card breakpoint">
        <i :class="currentBreakpointDisplay?.icon ?? 'pi pi-desktop'" />
        <span>{{ info.breakpoint.toUpperCase() }}</span>
      </div>
      <div class="status-card device-type">
        <i :class="deviceDisplay.icon" />
        <span>{{ deviceDisplay.label }}</span>
      </div>
      <div class="status-card" :class="{ 'high-density': isHighDensity }">
        <i class="pi pi-image" />
        <span>{{ info.devicePixelRatio }}x DPR</span>
      </div>
    </div>

    <Divider />

    <!-- Viewport Dimensions -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-window-maximize" />
        Viewport Dimensions
      </h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Width</span>
          <Tag :value="`${info.width}px`" severity="info" />
        </div>
        <div class="info-item">
          <span class="info-label">Height</span>
          <Tag :value="`${info.height}px`" severity="info" />
        </div>
        <div class="info-item">
          <span class="info-label">Aspect Ratio</span>
          <Tag :value="aspectRatioFormatted" severity="secondary" />
        </div>
        <div class="info-item">
          <span class="info-label">Device Pixel Ratio</span>
          <Tag
            :value="`${info.devicePixelRatio}x`"
            :severity="isHighDensity ? 'success' : 'secondary'"
          />
        </div>
      </div>
    </div>

    <Divider />

    <!-- Device Information -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-microchip-ai" />
        Device Information
      </h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Device Type</span>
          <Tag :value="deviceDisplay.label" severity="info" />
        </div>
        <div class="info-item">
          <span class="info-label">Category</span>
          <Tag
            :value="deviceDisplay.categoryLabel"
            :severity="
              deviceDisplay.category === 'mobile'
                ? 'warn'
                : deviceDisplay.category === 'tablet'
                  ? 'info'
                  : 'success'
            "
          />
        </div>
        <div class="info-item">
          <span class="info-label">Operating System</span>
          <Tag :value="deviceDisplay.os" severity="secondary" />
        </div>
        <div class="info-item">
          <span class="info-label">Browser</span>
          <Tag :value="deviceDisplay.browser" severity="secondary" />
        </div>
        <div class="info-item">
          <span class="info-label">Touch Support</span>
          <Tag
            :value="isTouchEnabled ? 'Yes' : 'No'"
            :severity="isTouchEnabled ? 'success' : 'secondary'"
          />
        </div>
        <div class="info-item">
          <span class="info-label">PWA Mode</span>
          <Tag
            :value="isPWA ? 'Standalone' : 'Browser'"
            :severity="isPWA ? 'success' : 'secondary'"
          />
        </div>
      </div>
    </div>

    <Divider />

    <!-- Device Category Visualization -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-objects-column" />
        Device Categories
      </h3>
      <div class="device-categories-display">
        <div class="device-category-card" :class="{ active: isMobile }">
          <div class="device-category-icon">
            <i class="pi pi-mobile" />
          </div>
          <span class="device-category-label">Mobile</span>
          <span class="device-category-examples">iPhone, Android Phone</span>
          <i v-if="isMobile" class="pi pi-check-circle active-indicator" />
        </div>
        <div class="device-category-card" :class="{ active: isTablet }">
          <div class="device-category-icon">
            <i class="pi pi-tablet" />
          </div>
          <span class="device-category-label">Tablet</span>
          <span class="device-category-examples">iPad, Android Tablet</span>
          <i v-if="isTablet" class="pi pi-check-circle active-indicator" />
        </div>
        <div class="device-category-card" :class="{ active: isDesktop }">
          <div class="device-category-icon">
            <i class="pi pi-desktop" />
          </div>
          <span class="device-category-label">Desktop</span>
          <span class="device-category-examples">Mac, Windows PC, Linux</span>
          <i v-if="isDesktop" class="pi pi-check-circle active-indicator" />
        </div>
      </div>
    </div>

    <Divider />

    <!-- Device Helpers -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-bolt" />
        Device Helpers
      </h3>

      <!-- Category Helpers -->
      <h4 class="subsection-title">Category</h4>
      <div class="helpers-grid">
        <div class="helper-item">
          <code class="helper-code">isMobile</code>
          <Tag :value="String(isMobile)" :severity="isMobile ? 'success' : 'secondary'" />
        </div>
        <div class="helper-item">
          <code class="helper-code">isTablet</code>
          <Tag :value="String(isTablet)" :severity="isTablet ? 'success' : 'secondary'" />
        </div>
        <div class="helper-item">
          <code class="helper-code">isDesktop</code>
          <Tag :value="String(isDesktop)" :severity="isDesktop ? 'success' : 'secondary'" />
        </div>
      </div>

      <!-- Platform Helpers -->
      <h4 class="subsection-title">Platform</h4>
      <div class="helpers-grid">
        <div class="helper-item">
          <code class="helper-code">isIOS</code>
          <Tag :value="String(isIOS)" :severity="isIOS ? 'success' : 'secondary'" />
        </div>
        <div class="helper-item">
          <code class="helper-code">isAndroid</code>
          <Tag :value="String(isAndroid)" :severity="isAndroid ? 'success' : 'secondary'" />
        </div>
        <div class="helper-item">
          <code class="helper-code">isWindowsOS</code>
          <Tag :value="String(isWindowsOS)" :severity="isWindowsOS ? 'success' : 'secondary'" />
        </div>
        <div class="helper-item">
          <code class="helper-code">isMacOS</code>
          <Tag :value="String(isMacOS)" :severity="isMacOS ? 'success' : 'secondary'" />
        </div>
        <div class="helper-item">
          <code class="helper-code">isLinuxOS</code>
          <Tag :value="String(isLinuxOS)" :severity="isLinuxOS ? 'success' : 'secondary'" />
        </div>
        <div class="helper-item">
          <code class="helper-code">isChromeOS</code>
          <Tag :value="String(isChromeOS)" :severity="isChromeOS ? 'success' : 'secondary'" />
        </div>
      </div>

      <!-- Feature Helpers -->
      <h4 class="subsection-title">Features</h4>
      <div class="helpers-grid">
        <div class="helper-item">
          <code class="helper-code">isTouchEnabled</code>
          <Tag
            :value="String(isTouchEnabled)"
            :severity="isTouchEnabled ? 'success' : 'secondary'"
          />
        </div>
        <div class="helper-item">
          <code class="helper-code">isPWA</code>
          <Tag :value="String(isPWA)" :severity="isPWA ? 'success' : 'secondary'" />
        </div>
      </div>
    </div>

    <Divider />

    <!-- Orientation -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-sync" />
        Orientation
      </h3>
      <div class="orientation-display">
        <div class="orientation-card" :class="{ active: isPortrait }">
          <div class="orientation-icon portrait-icon">
            <i class="pi pi-mobile" />
          </div>
          <span class="orientation-label">Portrait</span>
          <i v-if="isPortrait" class="pi pi-check-circle active-indicator" />
        </div>
        <div class="orientation-card" :class="{ active: isLandscape }">
          <div class="orientation-icon landscape-icon">
            <i class="pi pi-desktop" />
          </div>
          <span class="orientation-label">Landscape</span>
          <i v-if="isLandscape" class="pi pi-check-circle active-indicator" />
        </div>
      </div>
    </div>

    <Divider />

    <!-- Breakpoint Information -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-th-large" />
        Responsive Breakpoints
      </h3>
      <div class="breakpoints-display">
        <div
          v-for="bp in getBreakpointsDisplay()"
          :key="bp.name"
          class="breakpoint-card"
          :class="{ active: info.breakpoint === bp.name }"
        >
          <div class="breakpoint-header">
            <i :class="bp.icon" />
            <span class="breakpoint-name">{{ bp.label }}</span>
          </div>
          <div class="breakpoint-range">
            <span>{{ bp.minWidth }}px</span>
            <span v-if="bp.maxWidth">- {{ bp.maxWidth }}px</span>
            <span v-else>+</span>
          </div>
          <div class="breakpoint-description">{{ bp.description }}</div>
          <i v-if="info.breakpoint === bp.name" class="pi pi-check-circle active-indicator" />
        </div>
      </div>
    </div>

    <Divider />

    <!-- Breakpoint Helpers -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-code" />
        Breakpoint Helpers
      </h3>
      <div class="helpers-grid">
        <div v-for="bp in breakpoints" :key="`helper-${bp.name}`" class="helper-item">
          <code class="helper-code">isAtLeast('{{ bp.name }}')</code>
          <Tag
            :value="String(isAtLeast(bp.name))"
            :severity="isAtLeast(bp.name) ? 'success' : 'secondary'"
          />
        </div>
      </div>
    </div>

    <Divider />

    <!-- Debug Information -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-info-circle" />
        Debug Information
        <Button
          label="Refresh"
          icon="pi pi-refresh"
          size="small"
          severity="secondary"
          text
          @click="refresh"
        />
      </h3>
      <details class="raw-details" open>
        <summary>View Raw JSON</summary>
        <div class="raw-output">
          <pre>{{ JSON.stringify(info, null, 2) }}</pre>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useViewportInfo } from '@/composables/useViewportInfo'

const {
  info,
  isPortrait,
  isLandscape,
  isHighDensity,
  aspectRatioFormatted,
  isAtLeast,
  getBreakpointsDisplay,
  getCurrentBreakpointDisplay,
  getDeviceDisplayInfo,
  refresh,
  breakpoints,
  // Device category computed properties
  isMobile,
  isTablet,
  isDesktop,
  // Device platform computed properties
  isIOS,
  isAndroid,
  isWindowsOS,
  isMacOS,
  isLinuxOS,
  isChromeOS,
  // Device feature computed properties
  isTouchEnabled,
  isPWA,
} = useViewportInfo()

const currentBreakpointDisplay = computed(() => getCurrentBreakpointDisplay())
const deviceDisplay = computed(() => getDeviceDisplayInfo())
</script>

<style scoped lang="scss">
.viewport-info-example {
  margin: 0 auto;
}

.status-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: var(--p-content-background);
  border: 1px solid var(--p-content-border-color);
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--p-text-color);
  transition:
    background-color 0.2s,
    border-color 0.2s;

  i {
    font-size: 1.125rem;
    color: var(--p-text-muted-color);
  }

  &.dimensions {
    background: color-mix(in srgb, var(--p-primary-color) 10%, var(--p-content-background));
    border-color: var(--p-primary-color);

    i {
      color: var(--p-primary-color);
    }
  }

  &.portrait {
    background: color-mix(in srgb, var(--p-purple-500) 15%, var(--p-content-background));
    border-color: var(--p-purple-500);

    i {
      color: var(--p-purple-500);
    }
  }

  &.landscape {
    background: color-mix(in srgb, var(--p-teal-500) 15%, var(--p-content-background));
    border-color: var(--p-teal-500);

    i {
      color: var(--p-teal-500);
    }
  }

  &.breakpoint {
    background: color-mix(in srgb, var(--p-blue-500) 15%, var(--p-content-background));
    border-color: var(--p-blue-500);

    i {
      color: var(--p-blue-500);
    }
  }

  &.high-density {
    background: color-mix(in srgb, var(--p-green-500) 15%, var(--p-content-background));
    border-color: var(--p-green-500);

    i {
      color: var(--p-green-500);
    }
  }

  &.device-type {
    background: color-mix(in srgb, var(--p-orange-500) 15%, var(--p-content-background));
    border-color: var(--p-orange-500);

    i {
      color: var(--p-orange-500);
    }
  }
}

.info-section {
  margin-bottom: 0.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--p-text-color);

  i {
    color: var(--p-primary-color);
  }

  .p-button {
    margin-left: auto;
  }
}

.subsection-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--p-text-muted-color);
  margin: 0.75rem 0 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:first-of-type {
    margin-top: 0;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  :deep(.p-tag) {
    width: fit-content;
  }
}

.info-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--p-text-muted-color);
}

.orientation-display {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.orientation-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: var(--p-content-background);
  border: 2px solid var(--p-content-border-color);
  border-radius: 8px;
  position: relative;
  transition: all 0.2s;
  min-width: 100px;

  &.active {
    border-color: var(--p-primary-color);
    background: color-mix(in srgb, var(--p-primary-color) 10%, var(--p-content-background));

    .orientation-icon {
      color: var(--p-primary-color);
    }

    .orientation-label {
      color: var(--p-primary-color);
      font-weight: 600;
    }
  }

  .active-indicator {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    color: var(--p-green-500);
    font-size: 0.875rem;
  }
}

.orientation-icon {
  font-size: 1.5rem;
  color: var(--p-text-muted-color);

  &.portrait-icon i {
    transform: rotate(0deg);
  }

  &.landscape-icon i {
    transform: rotate(-90deg);
  }
}

.orientation-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--p-text-color);
  text-transform: capitalize;
}

.device-categories-display {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.device-category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: var(--p-content-background);
  border: 2px solid var(--p-content-border-color);
  border-radius: 8px;
  position: relative;
  transition: all 0.2s;
  min-width: 140px;

  &.active {
    border-color: var(--p-primary-color);
    background: color-mix(in srgb, var(--p-primary-color) 10%, var(--p-content-background));

    .device-category-icon {
      color: var(--p-primary-color);
    }

    .device-category-label {
      color: var(--p-primary-color);
      font-weight: 600;
    }
  }

  .active-indicator {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    color: var(--p-green-500);
    font-size: 0.875rem;
  }
}

.device-category-icon {
  font-size: 2rem;
  color: var(--p-text-muted-color);
}

.device-category-label {
  font-size: 1rem;
  font-weight: 500;
  color: var(--p-text-color);
}

.device-category-examples {
  font-size: 0.7rem;
  color: var(--p-text-muted-color);
  text-align: center;
}

.breakpoints-display {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
}

.breakpoint-card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  background: var(--p-content-background);
  border: 2px solid var(--p-content-border-color);
  border-radius: 8px;
  position: relative;
  transition: all 0.2s;

  &.active {
    border-color: var(--p-primary-color);
    background: color-mix(in srgb, var(--p-primary-color) 10%, var(--p-content-background));

    .breakpoint-header i,
    .breakpoint-name {
      color: var(--p-primary-color);
    }

    .breakpoint-name {
      font-weight: 700;
    }
  }

  .active-indicator {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    color: var(--p-green-500);
    font-size: 0.875rem;
  }
}

.breakpoint-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    font-size: 1rem;
    color: var(--p-text-muted-color);
  }
}

.breakpoint-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--p-text-color);
}

.breakpoint-range {
  font-size: 0.75rem;
  font-family: monospace;
  color: var(--p-text-muted-color);
}

.breakpoint-description {
  font-size: 0.7rem;
  color: var(--p-text-muted-color);
  margin-top: 0.25rem;
}

.helpers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
}

.helper-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: var(--p-content-background);
  border: 1px solid var(--p-content-border-color);
  border-radius: 6px;
}

.helper-code {
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--p-text-color);
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
