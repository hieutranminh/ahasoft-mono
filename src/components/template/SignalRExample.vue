<template>
  <div class="signalr-example">
    <!-- Connection Status -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-wifi" />
        Connection Status
      </h3>
      <div class="status-cards">
        <div
          v-for="state in connectionStates"
          :key="state.value"
          class="status-card"
          :class="{ current: connectionState === state.value }"
          :style="connectionState === state.value ? { borderColor: state.color } : {}"
        >
          <i
            :class="state.icon"
            :style="connectionState === state.value ? { color: state.color } : {}"
          />
          <span>{{ state.label }}</span>
          <i v-if="connectionState === state.value" class="pi pi-check-circle current-indicator" />
        </div>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">State</span>
          <Tag :value="connectionState" :severity="connectionSeverity" />
        </div>
        <div class="info-item">
          <span class="info-label">Connection ID</span>
          <code v-if="connectionId" class="info-code">{{ connectionId }}</code>
          <Tag v-else value="N/A" severity="secondary" />
        </div>
        <div class="info-item full-width" v-if="error">
          <span class="info-label">Error</span>
          <Message severity="error" :closable="false">{{ error }}</Message>
        </div>
      </div>
    </div>

    <Divider />

    <!-- Hub Configuration -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-cog" />
        Hub Configuration
      </h3>
      <div class="info-grid">
        <div class="info-item full-width">
          <span class="info-label">Notification URL</span>
          <code v-if="envInfo.notificationUrl" class="info-code">
            {{ envInfo.notificationUrl }}
          </code>
          <Tag v-else value="Not configured" severity="warn" />
        </div>
      </div>
    </div>

    <Divider />

    <!-- Event Logs -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-list" />
        Event Logs
        <Tag :value="String(logCount)" severity="info" class="log-count-badge" />
      </h3>

      <div class="log-controls">
        <Button
          :label="isLogsEnabled ? 'Logging ON' : 'Logging OFF'"
          :icon="isLogsEnabled ? 'pi pi-eye' : 'pi pi-eye-slash'"
          :severity="isLogsEnabled ? 'success' : 'secondary'"
          size="small"
          outlined
          @click="toggleLogsEnabled"
        />
        <Button
          label="Clear Logs"
          icon="pi pi-trash"
          severity="danger"
          size="small"
          outlined
          :disabled="logCount === 0"
          @click="clearLogs"
        />
      </div>

      <div v-if="logs.length > 0" class="log-list">
        <div v-for="log in logs" :key="log.id" class="log-entry">
          <div class="log-header">
            <Tag :value="log.eventName" severity="info" />
            <span class="log-timestamp">{{ formatTimestamp(log.timestamp) }}</span>
          </div>
          <details class="log-details">
            <summary>View Data</summary>
            <pre class="log-data">{{ JSON.stringify(log.data, null, 2) }}</pre>
          </details>
        </div>
      </div>
      <div v-else class="log-empty">
        <i class="pi pi-inbox" />
        <span>No events received yet</span>
      </div>
    </div>

    <Divider />

    <!-- Event Test Subscription -->
    <div class="info-section">
      <h3 class="section-title">
        <i class="pi pi-bell" />
        Test Event Subscription
      </h3>
      <p class="section-description">
        Subscribed events will appear in the logs above when received from the server.
      </p>
      <div class="subscription-list">
        <div v-for="sub in subscriptions" :key="sub.event" class="subscription-item">
          <Tag :value="sub.event" severity="secondary" />
          <Tag
            :value="`${sub.count} received`"
            :severity="sub.count > 0 ? 'success' : 'secondary'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

import { useEnvironmentInfo } from '@/composables/useEnvironmentInfo'
import { useSignalR } from '@/modules/signalr/composables/useSignalR'
import { SIGNALR_EVENTS } from '@/modules/signalr/constants/signalrEvents'
import type { SignalRConnectionState } from '@/modules/signalr/types/signalr'

const { info: envInfo } = useEnvironmentInfo()
const {
  connectionState,
  connectionId,
  error,
  logs,
  logCount,
  isLogsEnabled,
  toggleLogsEnabled,
  clearLogs,
  onEvent,
} = useSignalR()

interface ConnectionStateDisplay {
  value: SignalRConnectionState
  label: string
  color: string
  icon: string
}

const connectionStates: ConnectionStateDisplay[] = [
  { value: 'disconnected', label: 'Disconnected', color: '#ef4444', icon: 'pi pi-times-circle' },
  { value: 'connecting', label: 'Connecting', color: '#f59e0b', icon: 'pi pi-spin pi-spinner' },
  { value: 'connected', label: 'Connected', color: '#22c55e', icon: 'pi pi-check-circle' },
  { value: 'reconnecting', label: 'Reconnecting', color: '#f97316', icon: 'pi pi-spin pi-sync' },
  { value: 'disconnecting', label: 'Disconnecting', color: '#6b7280', icon: 'pi pi-minus-circle' },
]

const connectionSeverity = computed((): 'success' | 'info' | 'warn' | 'danger' | 'secondary' => {
  const severityMap: Record<
    SignalRConnectionState,
    'success' | 'info' | 'warn' | 'danger' | 'secondary'
  > = {
    connected: 'success',
    connecting: 'warn',
    reconnecting: 'warn',
    disconnected: 'danger',
    disconnecting: 'secondary',
  }
  return severityMap[connectionState.value]
})

const eventCounts = reactive<Record<string, number>>({})

const TRACKED_EVENTS = [
  SIGNALR_EVENTS.BOOKINGS_CREATED,
  SIGNALR_EVENTS.BOOKINGS_UPDATED,
  SIGNALR_EVENTS.BOOKINGS_CANCELLED,
  SIGNALR_EVENTS.GOODS_CHANGED,
  SIGNALR_EVENTS.STAFF_STATUS_CHANGED,
]

for (const event of TRACKED_EVENTS) {
  eventCounts[event] = 0
}

for (const event of TRACKED_EVENTS) {
  onEvent(event, () => {
    eventCounts[event] = (eventCounts[event] ?? 0) + 1
  })
}

const subscriptions = computed(() =>
  TRACKED_EVENTS.map((event) => ({
    event,
    count: eventCounts[event] ?? 0,
  })),
)

function formatTimestamp(iso: string): string {
  try {
    const date = new Date(iso)
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    })
  } catch {
    return iso
  }
}
</script>

<style scoped lang="scss">
.signalr-example {
  margin: 0 auto;
}

.status-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
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

.section-description {
  font-size: 0.85rem;
  color: var(--p-text-muted-color);
  margin-bottom: 0.75rem;
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

.log-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.log-count-badge {
  margin-left: auto;
}

.log-list {
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.log-entry {
  background: var(--p-content-background);
  border: 1px solid var(--p-content-border-color);
  border-radius: 6px;
  padding: 0.75rem;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.log-timestamp {
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
}

.log-details {
  margin-top: 0.5rem;

  summary {
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--p-primary-color);
    user-select: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.log-data {
  background: var(--p-surface-950);
  border: 1px solid var(--p-surface-700);
  border-radius: 4px;
  padding: 0.5rem;
  margin-top: 0.375rem;
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--p-surface-50);
  white-space: pre-wrap;
  max-height: 200px;
  overflow-y: auto;
}

.log-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  color: var(--p-text-muted-color);
  font-size: 0.9rem;

  i {
    font-size: 1.25rem;
  }
}

.subscription-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.subscription-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--p-content-background);
  border: 1px solid var(--p-content-border-color);
  border-radius: 6px;
}
</style>
