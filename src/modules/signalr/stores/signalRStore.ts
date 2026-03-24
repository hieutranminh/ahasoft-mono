import { computed, markRaw, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'

import { appConfig } from '@/config/app'

import { signalrApi } from '../api/signalrApi'
import { SIGNALR_HUB_NAME, SIGNALR_TOKEN_LIFETIME } from '../constants/signalrEvents'
import { SignalRConnection } from '../services/SignalRConnection'
import type {
  SignalRConfig,
  SignalRConnectionState,
  SignalREventHandler,
  SignalRLogEntry,
  SignalRMessageHandler,
} from '../types/signalr'

const MAX_LOG_ENTRIES = 200

let logIdCounter = 0

function createLogId(): string {
  logIdCounter += 1
  return `log-${Date.now()}-${logIdCounter}`
}

/**
 * Central Pinia store for the SignalR connection.
 *
 * This store bridges the non-reactive SignalRConnection class with
 * Vue's reactivity system. Components should NOT use SignalRConnection
 * directly — use this store (or the useSignalR composable) instead.
 *
 * Key design decisions:
 * - `shallowRef` + `markRaw` for the connection instance: prevents Vue
 *   from wrapping the SDK's HubConnection in a Proxy (which would break it).
 * - Logs are capped at MAX_LOG_ENTRIES to prevent memory leaks during
 *   long-running sessions.
 */
export const useSignalRStore = defineStore('signalr', () => {
  // -- Reactive state exposed to the UI --
  const connectionState = ref<SignalRConnectionState>('disconnected')
  const logs = ref<SignalRLogEntry[]>([])
  const isLogsEnabled = ref(true)
  const isLogsVisible = ref(false)
  const error = ref<string | null>(null)
  const connectionId = ref<string | null>(null)

  // The connection instance must NOT be deeply reactive.
  // shallowRef prevents Vue from traversing the SDK internals;
  // markRaw (applied in connect()) prevents accidental wrapping.
  const connectionRef = shallowRef<SignalRConnection | null>(null)

  // Getters
  const isConnected = computed<boolean>(() => connectionState.value === 'connected')
  const isDisconnected = computed<boolean>(() => connectionState.value === 'disconnected')
  const isReconnecting = computed<boolean>(() => connectionState.value === 'reconnecting')
  const logCount = computed<number>(() => logs.value.length)

  // Actions
  async function connect(config: SignalRConfig): Promise<void> {
    if (connectionRef.value) {
      connectionRef.value.dispose()
    }

    error.value = null

    const connection = markRaw(new SignalRConnection(config))
    connectionRef.value = connection

    connection.onStateChange((newState) => {
      connectionState.value = newState
      connectionId.value = connection.connectionId
    })

    connection.onMessage((eventName: string, data: unknown) => {
      if (isLogsEnabled.value) {
        addLog(eventName, data)
      }
    })

    try {
      await connection.start()
      connectionId.value = connection.connectionId
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'SignalR connection failed'
      error.value = message
      throw err
    }
  }

  async function disconnect(): Promise<void> {
    if (!connectionRef.value) {
      return
    }

    try {
      await connectionRef.value.stop()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'SignalR disconnect failed'
      error.value = message
    }

    connectionState.value = 'disconnected'
    connectionId.value = null
  }

  function dispose(): void {
    if (connectionRef.value) {
      connectionRef.value.dispose()
      connectionRef.value = null
    }
    connectionState.value = 'disconnected'
    connectionId.value = null
    error.value = null
  }

  /**
   * Subscribe to a specific SignalR event type.
   * Returns an unsubscribe function.
   */
  function onEvent(eventName: string, handler: SignalREventHandler): () => void {
    if (!connectionRef.value) {
      throw new Error('SignalR connection is not initialized. Call connect() first.')
    }
    return connectionRef.value.on(eventName, handler)
  }

  /**
   * Unsubscribe from a specific SignalR event type.
   */
  function offEvent(eventName: string, handler: SignalREventHandler): void {
    connectionRef.value?.off(eventName, handler)
  }

  /**
   * Register a raw message handler (invoked for every incoming hub message).
   */
  function onMessage(handler: SignalRMessageHandler): () => void {
    if (!connectionRef.value) {
      throw new Error('SignalR connection is not initialized. Call connect() first.')
    }
    return connectionRef.value.onMessage(handler)
  }

  // Log management
  function addLog(eventName: string, data: unknown): void {
    const entry: SignalRLogEntry = {
      id: createLogId(),
      eventName,
      data,
      timestamp: new Date().toISOString(),
    }
    logs.value = [entry, ...logs.value].slice(0, MAX_LOG_ENTRIES)
  }

  function clearLogs(): void {
    logs.value = []
  }

  function toggleLogsEnabled(): void {
    isLogsEnabled.value = !isLogsEnabled.value
  }

  function toggleLogsVisible(): void {
    isLogsVisible.value = !isLogsVisible.value
  }

  /**
   * High-level connect: reads hub URL from appConfig and handles token
   * negotiation automatically.
   *
   * Token flow:
   *   1. SDK starts connection → calls accessTokenFactory
   *   2. Factory calls signalrApi.getToken({ shopId, hubName, lifeTime })
   *   3. Backend returns a short-lived JWT scoped to the hub
   *   4. SDK sends the JWT in the WebSocket handshake → hub accepts
   *   5. On reconnect the SDK calls the factory again → fresh token
   *
   * Called from MainLayout.vue after authentication succeeds.
   */
  async function connectWithAppConfig(shopId: number): Promise<void> {
    const hubUrl = appConfig.notificationUrl
    if (!hubUrl) {
      throw new Error('Notification URL (VITE_NOTIFICATION_URL) is not configured')
    }

    await connect({
      hubUrl,
      accessTokenFactory: () =>
        signalrApi.getToken({
          shopId,
          hubName: SIGNALR_HUB_NAME,
          lifeTime: SIGNALR_TOKEN_LIFETIME,
        }),
    })
  }

  return {
    // State
    connectionState,
    logs,
    isLogsEnabled,
    isLogsVisible,
    error,
    connectionId,

    // Getters
    isConnected,
    isDisconnected,
    isReconnecting,
    logCount,

    // Connection actions
    connect,
    connectWithAppConfig,
    disconnect,
    dispose,

    // Event subscription
    onEvent,
    offEvent,
    onMessage,

    // Log actions
    clearLogs,
    toggleLogsEnabled,
    toggleLogsVisible,
  }
})
