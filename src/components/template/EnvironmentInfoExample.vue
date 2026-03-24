<template>
  <div class="environment-info-example">
    <!-- Environment Status Cards -->
    <div class="status-cards">
      <div
        v-for="env in getEnvironmentComparison()"
        :key="env.env"
        class="status-card"
        :class="{ current: env.isCurrent }"
        :style="env.isCurrent ? { borderColor: env.display.color } : {}"
      >
        <i :class="env.display.icon" :style="env.isCurrent ? { color: env.display.color } : {}" />
        <span>{{ env.display.label }}</span>
        <i v-if="env.isCurrent" class="pi pi-check-circle current-indicator" />
      </div>
    </div>

    <Divider />

    <!-- Application Info -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-box" />
        Application Info
      </h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">App Name</span>
          <Tag :value="info.appName" severity="info" />
        </div>
        <div class="info-item">
          <span class="info-label">Version</span>
          <Tag :value="info.appVersion" severity="secondary" />
        </div>
        <div class="info-item">
          <span class="info-label">Environment</span>
          <Tag :value="environmentDisplay.label" :severity="environmentDisplay.severity" />
        </div>
        <div class="info-item">
          <span class="info-label">Build Mode</span>
          <Tag :value="info.buildMode" severity="secondary" />
        </div>
        <div class="info-item full-width">
          <span class="info-label">Build Time</span>
          <code class="info-code">{{ formatBuildTime() }}</code>
        </div>
      </div>
    </div>

    <Divider />

    <!-- Gateway & API Configuration -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-server" />
        Gateway & API Configuration
      </h3>
      <div class="info-grid">
        <div class="info-item full-width">
          <span class="info-label">Gateway Base URL</span>
          <code class="info-code">{{ info.gatewayBaseUrl }}</code>
        </div>
        <div class="info-item">
          <span class="info-label">Timeout</span>
          <Tag :value="`${getApiTimeoutSeconds()}s`" severity="secondary" />
        </div>
        <div class="info-item">
          <span class="info-label">Mock API</span>
          <Tag
            :value="info.enableMockApi ? 'Enabled' : 'Disabled'"
            :severity="info.enableMockApi ? 'warn' : 'secondary'"
          />
        </div>
      </div>
    </div>

    <Divider />

    <!-- Notification Configuration -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-bell" />
        Notification (SignalR)
      </h3>
      <div class="info-grid">
        <div class="info-item full-width">
          <span class="info-label">Notification URL</span>
          <code v-if="info.notificationUrl" class="info-code">{{ info.notificationUrl }}</code>
          <Tag v-else value="Not configured" severity="secondary" />
        </div>
      </div>
    </div>

    <Divider />

    <!-- Login URLs -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-sign-in" />
        Login URLs
      </h3>
      <div class="info-grid">
        <div class="info-item full-width">
          <span class="info-label">Default Login URL</span>
          <code v-if="info.loginUrlDefault" class="info-code">{{ info.loginUrlDefault }}</code>
          <Tag v-else value="Not configured" severity="secondary" />
        </div>
        <div class="info-item full-width">
          <span class="info-label">KR Login URL</span>
          <code v-if="info.loginUrlKr" class="info-code">{{ info.loginUrlKr }}</code>
          <Tag v-else value="Not configured" severity="secondary" />
        </div>
        <div class="info-item">
          <span class="info-label">Mobile App Param</span>
          <code v-if="info.paramMobileApp" class="info-code">{{ info.paramMobileApp }}</code>
          <Tag v-else value="Not set" severity="secondary" />
        </div>
        <div class="info-item">
          <span class="info-label">Version Param</span>
          <code v-if="info.paramVersion" class="info-code">{{ info.paramVersion }}</code>
          <Tag v-else value="Not set" severity="secondary" />
        </div>
      </div>
    </div>

    <Divider />

    <!-- Azure Storage URLs -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-cloud-upload" />
        Azure Storage URLs
      </h3>
      <div class="info-grid">
        <div
          v-for="storage in getAzureStorageUrls()"
          :key="storage.name"
          class="info-item full-width"
        >
          <span class="info-label">{{ storage.name }}</span>
          <code v-if="storage.url" class="info-code">{{ storage.url }}</code>
          <Tag v-else value="Not configured" severity="secondary" />
        </div>
      </div>
    </div>

    <Divider />

    <!-- Third-party Integrations -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-link" />
        Third-party Integrations
      </h3>
      <div class="feature-flags">
        <div
          v-for="integration in getThirdPartyStatus()"
          :key="integration.name"
          class="feature-flag"
        >
          <span class="flag-name">{{ integration.name }}</span>
          <Tag
            :value="integration.configured ? 'Configured' : 'Not configured'"
            :severity="integration.configured ? 'success' : 'secondary'"
          />
        </div>
      </div>
    </div>

    <Divider />

    <!-- Feature Flags -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-flag" />
        Feature Flags
      </h3>
      <div class="feature-flags">
        <div v-for="flag in getFeatureFlags()" :key="flag.name" class="feature-flag">
          <span class="flag-name">{{ flag.name }}</span>
          <Tag
            :value="flag.enabled ? 'ON' : 'OFF'"
            :severity="flag.enabled ? 'success' : 'secondary'"
          />
        </div>
      </div>
    </div>

    <Divider />

    <!-- PWA Configuration -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-mobile" />
        PWA Configuration
      </h3>

      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">PWA Enabled (Build)</span>
          <Tag
            :value="info.enablePwa ? 'Enabled' : 'Disabled'"
            :severity="info.enablePwa ? 'success' : 'secondary'"
          />
        </div>
        <div class="info-item">
          <span class="info-label">SW Supported</span>
          <Tag
            :value="pwaStatus.swSupported ? 'Yes' : 'No'"
            :severity="pwaStatus.swSupported ? 'success' : 'danger'"
          />
        </div>
        <div class="info-item">
          <span class="info-label">SW State</span>
          <Tag :value="pwaStatus.swState ?? 'Not active'" :severity="pwaSwStateSeverity" />
        </div>
        <div class="info-item">
          <span class="info-label">Standalone Mode</span>
          <Tag
            :value="pwaStatus.isStandalone ? 'Yes (Installed)' : 'No (Browser)'"
            :severity="pwaStatus.isStandalone ? 'success' : 'secondary'"
          />
        </div>
        <div class="info-item full-width">
          <span class="info-label">SW Controller URL</span>
          <code v-if="pwaStatus.swController" class="info-code">{{ pwaStatus.swController }}</code>
          <Tag v-else value="No active controller" severity="secondary" />
        </div>
        <div class="info-item full-width">
          <span class="info-label">Cache Storage ({{ pwaStatus.cacheNames.length }} caches)</span>
          <div v-if="pwaStatus.cacheNames.length > 0" class="pwa-cache-list">
            <code v-for="cacheName in pwaStatus.cacheNames" :key="cacheName" class="pwa-cache-item">
              {{ cacheName }}
            </code>
          </div>
          <Tag v-else value="No caches" severity="secondary" />
        </div>
      </div>

      <div class="pwa-refresh-action">
        <Button
          label="Refresh Status"
          icon="pi pi-refresh"
          severity="secondary"
          size="small"
          outlined
          @click="refreshPwaStatus"
        />
      </div>
    </div>

    <Divider />

    <!-- Build Configuration -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-cog" />
        Build Configuration
      </h3>
      <div class="feature-flags">
        <div v-for="setting in getBuildSettings()" :key="setting.name" class="feature-flag">
          <span class="flag-name">{{ setting.name }}</span>
          <Tag :value="setting.value" :severity="setting.enabled ? 'success' : 'secondary'" />
        </div>
      </div>
    </div>

    <Divider />

    <!-- Logging -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-chart-line" />
        Logging
      </h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Log Level</span>
          <Tag :value="logLevelDisplay.label" :severity="logLevelDisplay.severity" />
        </div>
      </div>
    </div>

    <Divider />

    <!-- Environment Flags -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-sliders-h" />
        Environment Flags
      </h3>
      <div class="env-flags">
        <div class="env-flag">
          <span>isDevelopment</span>
          <Tag
            :value="String(info.isDevelopment)"
            :severity="info.isDevelopment ? 'info' : 'secondary'"
          />
        </div>
        <div class="env-flag">
          <span>isProduction</span>
          <Tag
            :value="String(info.isProduction)"
            :severity="info.isProduction ? 'success' : 'secondary'"
          />
        </div>
        <div class="env-flag">
          <span>isLocalhost</span>
          <Tag
            :value="String(info.isLocalhost)"
            :severity="info.isLocalhost ? 'info' : 'secondary'"
          />
        </div>
        <div class="env-flag">
          <span>isStaging</span>
          <Tag :value="String(info.isStaging)" :severity="info.isStaging ? 'warn' : 'secondary'" />
        </div>
      </div>
    </div>

    <Divider />

    <!-- Debug Information -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-code" />
        Debug Information
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
import { useEnvironmentInfo } from '@/composables/useEnvironmentInfo'

const {
  info,
  environmentDisplay,
  logLevelDisplay,
  formatBuildTime,
  getApiTimeoutSeconds,
  getFeatureFlags,
  getBuildSettings,
  getEnvironmentComparison,
  getAzureStorageUrls,
  getThirdPartyStatus,
  pwaStatus,
  refreshPwaStatus,
} = useEnvironmentInfo()

// SW State severity: activated=success, disabled=secondary, other=warn
const pwaSwStateSeverity = computed((): 'success' | 'warn' | 'secondary' => {
  if (pwaStatus.value.swState === 'activated') return 'success'
  if (!info.enablePwa) return 'secondary'
  return 'warn'
})
</script>

<style scoped lang="scss">
.environment-info-example {
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
  color: var(--p-text-muted-color);
  transition:
    background-color 0.2s,
    border-color 0.2s,
    transform 0.2s;
  position: relative;

  i {
    font-size: 1.125rem;
    color: var(--p-text-muted-color);
  }

  &.current {
    color: var(--p-text-color);
    font-weight: 600;
    transform: scale(1.02);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    i:first-child {
      color: inherit;
    }
  }

  .current-indicator {
    color: var(--p-green-500);
    font-size: 0.875rem;
    margin-left: 0.25rem;
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

  :deep(.p-tag) {
    width: fit-content;
  }
}

.info-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--p-text-muted-color);
}

.info-code {
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

.feature-flags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.feature-flag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--p-content-background);
  border: 1px solid var(--p-content-border-color);
  border-radius: 6px;

  .flag-name {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--p-text-color);
  }
}

.env-flags {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;
}

.env-flag {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: var(--p-content-background);
  border: 1px solid var(--p-content-border-color);
  border-radius: 6px;

  span {
    font-size: 0.8rem;
    font-family: monospace;
    color: var(--p-text-muted-color);
  }
}

.pwa-cache-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.pwa-cache-item {
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--p-text-color);
  background: var(--p-content-background);
  border: 1px solid var(--p-content-border-color);
  border-radius: 4px;
  padding: 0.375rem 0.625rem;
  word-break: break-all;
  line-height: 1.4;
}

.pwa-refresh-action {
  margin-top: 0.75rem;
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
