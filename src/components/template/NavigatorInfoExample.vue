<template>
  <div class="navigator-info-example">
    <!-- Quick Status Cards -->
    <div class="status-cards">
      <div class="status-card" :class="{ online: info.onLine, offline: !info.onLine }">
        <i :class="info.onLine ? 'pi pi-wifi' : 'pi pi-wifi-off'" />
        <span>{{ info.onLine ? 'Online' : 'Offline' }}</span>
      </div>
      <div class="status-card">
        <i class="pi pi-desktop" />
        <span>{{ getOSName() }}</span>
      </div>
      <div class="status-card">
        <i class="pi pi-globe" />
        <span>{{ getBrowserName() }}</span>
      </div>
      <div class="status-card" :class="{ touch: isTouchDevice(), mobile: isMobile() }">
        <i :class="isMobile() ? 'pi pi-mobile' : 'pi pi-desktop'" />
        <span>{{ isMobile() ? 'Mobile' : 'Desktop' }}</span>
      </div>
    </div>

    <Divider />

    <!-- Device & Performance -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-microchip" />
        Device & Performance
      </h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">CPU Cores</span>
          <Tag :value="String(info.hardwareConcurrency)" severity="info" />
        </div>
        <div class="info-item">
          <span class="info-label">Device Memory</span>
          <Tag
            :value="info.deviceMemory ? `${info.deviceMemory} GB` : 'N/A'"
            :severity="getMemorySeverity()"
          />
        </div>
        <div class="info-item">
          <span class="info-label">Touch Support</span>
          <Tag
            :value="info.maxTouchPoints > 0 ? `Yes (${info.maxTouchPoints} points)` : 'No'"
            :severity="info.maxTouchPoints > 0 ? 'info' : 'secondary'"
          />
        </div>
        <div class="info-item">
          <span class="info-label">Performance Tier</span>
          <Tag
            :value="isLowEndDevice() ? 'Low-End' : 'Standard'"
            :severity="isLowEndDevice() ? 'warn' : 'success'"
          />
        </div>
      </div>
    </div>

    <Divider />

    <!-- Network Information -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-wifi" />
        Network Information
      </h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Connection Type</span>
          <Tag
            :value="info.connection.effectiveType ?? 'N/A'"
            :severity="getConnectionSeverity()"
          />
        </div>
        <div class="info-item">
          <span class="info-label">Downlink Speed</span>
          <Tag
            :value="info.connection.downlink ? `${info.connection.downlink} Mbps` : 'N/A'"
            severity="secondary"
          />
        </div>
        <div class="info-item">
          <span class="info-label">Latency (RTT)</span>
          <Tag
            :value="info.connection.rtt ? `${info.connection.rtt} ms` : 'N/A'"
            severity="secondary"
          />
        </div>
        <div class="info-item">
          <span class="info-label">Data Saver Mode</span>
          <Tag
            :value="info.connection.saveData ? 'Enabled' : 'Disabled'"
            :severity="info.connection.saveData ? 'warn' : 'secondary'"
          />
        </div>
      </div>
    </div>

    <Divider />

    <!-- Language & Locale -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-language" />
        Language & Locale
      </h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Primary Language</span>
          <Tag :value="info.language" severity="info" />
        </div>
        <div class="info-item">
          <span class="info-label">Cookies Enabled</span>
          <Tag
            :value="info.cookieEnabled ? 'Yes' : 'No'"
            :severity="info.cookieEnabled ? 'success' : 'danger'"
          />
        </div>
        <div class="info-item full-width">
          <span class="info-label">Preferred Languages</span>
          <div class="tag-list">
            <Tag v-for="lang in info.languages" :key="lang" :value="lang" severity="secondary" />
          </div>
        </div>
      </div>
    </div>

    <Divider />

    <!-- Debug Information -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-code" />
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
      <div class="debug-content">
        <div class="debug-item">
          <span class="debug-label">User Agent</span>
          <code class="debug-code">{{ info.userAgent }}</code>
        </div>
        <div class="debug-item">
          <span class="debug-label">Platform</span>
          <code class="debug-code">{{ info.platform }}</code>
        </div>
      </div>
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
import { useNavigatorInfo } from '@/composables/useNavigatorInfo'

const { info, isTouchDevice, isMobile, getBrowserName, getOSName, isLowEndDevice, refresh } =
  useNavigatorInfo()

// Severity helpers for visual feedback
const getMemorySeverity = (): 'success' | 'warn' | 'danger' | 'secondary' => {
  const memory = info.deviceMemory
  if (memory === null) return 'secondary'
  if (memory >= 8) return 'success'
  if (memory >= 4) return 'warn'
  return 'danger'
}

const getConnectionSeverity = (): 'success' | 'warn' | 'danger' | 'secondary' => {
  const effectiveType = info.connection.effectiveType
  if (effectiveType === null) return 'secondary'
  if (effectiveType === '4g') return 'success'
  if (effectiveType === '3g') return 'warn'
  return 'danger'
}
</script>

<style scoped lang="scss">
.navigator-info-example {
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

  &.online {
    background: color-mix(in srgb, var(--p-green-500) 15%, var(--p-content-background));
    border-color: var(--p-green-500);

    i {
      color: var(--p-green-500);
    }
  }

  &.offline {
    background: color-mix(in srgb, var(--p-red-500) 15%, var(--p-content-background));
    border-color: var(--p-red-500);

    i {
      color: var(--p-red-500);
    }
  }

  &.mobile {
    background: color-mix(in srgb, var(--p-blue-500) 15%, var(--p-content-background));
    border-color: var(--p-blue-500);

    i {
      color: var(--p-blue-500);
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

  // Push refresh button to the right
  .p-button {
    margin-left: auto;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  &.full-width {
    grid-column: 1 / -1;
  }

  // Fix Tag width on Safari
  :deep(.p-tag) {
    width: fit-content;
  }
}

.info-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--p-text-muted-color);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.debug-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.debug-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.debug-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--p-text-muted-color);
}

.debug-code {
  font-family: monospace;
  font-size: 0.8rem;
  color: var(--p-text-color);
  background: var(--p-content-background);
  border: 1px solid var(--p-content-border-color);
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  word-break: break-all;
  line-height: 1.4;
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
