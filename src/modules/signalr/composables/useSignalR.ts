import { computed, onUnmounted, type Ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useSignalRStore } from '../stores/signalRStore'
import type { SignalRConnectionState, SignalREventHandler, SignalRLogEntry } from '../types/signalr'

interface PendingSubscription {
  readonly eventName: string
  readonly handler: SignalREventHandler
}

interface UseSignalRReturn {
  readonly connectionState: Ref<SignalRConnectionState>
  readonly isConnected: Ref<boolean>
  readonly isDisconnected: Ref<boolean>
  readonly isReconnecting: Ref<boolean>
  readonly logs: Ref<SignalRLogEntry[]>
  readonly logCount: Ref<number>
  readonly isLogsEnabled: Ref<boolean>
  readonly isLogsVisible: Ref<boolean>
  readonly error: Ref<string | null>
  readonly connectionId: Ref<string | null>

  /**
   * Subscribe to a SignalR event.
   *
   * Can be called at any time — if the connection is not yet ready the
   * subscription is buffered and automatically registered once connected.
   * All subscriptions are cleaned up when the component unmounts.
   */
  onEvent: (eventName: string, handler: SignalREventHandler) => void

  offEvent: (eventName: string, handler: SignalREventHandler) => void

  clearLogs: () => void
  toggleLogsEnabled: () => void
  toggleLogsVisible: () => void
}

/**
 * Composable for components to interact with the SignalR connection.
 *
 * Advantages over using the store directly:
 *   - Deferred subscription: onEvent() works regardless of connection state.
 *     Pending subscriptions are buffered and flushed when the connection
 *     becomes available. Components never need to watch isConnected.
 *   - Auto-cleanup: all subscriptions are removed when the component unmounts.
 *   - Read-only refs: components cannot accidentally mutate state.
 *
 * Usage:
 * ```ts
 * const { onEvent } = useSignalR()
 *
 * onEvent(SIGNALR_EVENTS.BOOKINGS_CREATED, (data) => {
 *   // Called whenever a BOOKINGS_CREATED message arrives.
 * })
 * ```
 */
export function useSignalR(): UseSignalRReturn {
  const store = useSignalRStore()
  const {
    connectionState,
    isConnected,
    isDisconnected,
    isReconnecting,
    logs,
    logCount,
    isLogsEnabled,
    isLogsVisible,
    error,
    connectionId,
  } = storeToRefs(store)

  const cleanupFunctions: Array<() => void> = []
  const pendingSubscriptions: PendingSubscription[] = []

  function flushPending(): void {
    const toFlush = [...pendingSubscriptions]
    pendingSubscriptions.length = 0

    for (const { eventName, handler } of toFlush) {
      subscribe(eventName, handler)
    }
  }

  function subscribe(eventName: string, handler: SignalREventHandler): void {
    try {
      const unsubscribe = store.onEvent(eventName, handler)
      cleanupFunctions.push(unsubscribe)
    } catch {
      pendingSubscriptions.push({ eventName, handler })
    }
  }

  function onEvent(eventName: string, handler: SignalREventHandler): void {
    subscribe(eventName, handler)
  }

  function offEvent(eventName: string, handler: SignalREventHandler): void {
    store.offEvent(eventName, handler)
  }

  const stopWatch = watch(isConnected, (connected) => {
    if (connected && pendingSubscriptions.length > 0) {
      flushPending()
    }
  })

  onUnmounted(() => {
    stopWatch()
    for (const cleanup of cleanupFunctions) {
      cleanup()
    }
    cleanupFunctions.length = 0
    pendingSubscriptions.length = 0
  })

  return {
    connectionState: computed(() => connectionState.value),
    isConnected: computed(() => isConnected.value),
    isDisconnected: computed(() => isDisconnected.value),
    isReconnecting: computed(() => isReconnecting.value),
    logs: computed(() => logs.value),
    logCount: computed(() => logCount.value),
    isLogsEnabled: computed(() => isLogsEnabled.value),
    isLogsVisible: computed(() => isLogsVisible.value),
    error: computed(() => error.value),
    connectionId: computed(() => connectionId.value),

    onEvent,
    offEvent,

    clearLogs: store.clearLogs,
    toggleLogsEnabled: store.toggleLogsEnabled,
    toggleLogsVisible: store.toggleLogsVisible,
  }
}
