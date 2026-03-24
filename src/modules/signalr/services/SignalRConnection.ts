import {
  type HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr'

import { SIGNALR_HUB_METHOD } from '../constants/signalrEvents'
import type {
  SignalRConfig,
  SignalRConnectionState,
  SignalREventHandler,
  SignalRMessageHandler,
  SignalRStateChangeHandler,
} from '../types/signalr'
import { mapHubState } from '../types/signalr'

/**
 * OOP connector class for managing the SignalR HubConnection lifecycle.
 *
 * Responsibilities:
 *   1. Build and configure the @microsoft/signalr HubConnection
 *   2. Handle start / stop / auto-reconnect lifecycle
 *   3. Route incoming "SendMessage" hub calls to registered event handlers
 *   4. Notify observers about state transitions and raw messages
 *   5. Clean up all listeners on dispose
 *
 * Why a class?
 *   Per project convention, OOP classes are reserved for connectors to
 *   external systems. SignalR is a persistent WebSocket connection to an
 *   Azure service — a textbook connector use-case.
 *
 * This class is NOT reactive. The Pinia store wraps it with Vue reactivity.
 */
export class SignalRConnection {
  private connection: HubConnection | null = null
  /** Map<eventName, Set<handler>> — fan-out for per-event subscriptions. */
  private eventHandlers: Map<string, Set<SignalREventHandler>> = new Map()
  private stateChangeHandlers: Set<SignalRStateChangeHandler> = new Set()
  private messageHandlers: Set<SignalRMessageHandler> = new Set()
  private disposed = false

  constructor(private readonly config: SignalRConfig) {}

  get state(): SignalRConnectionState {
    if (!this.connection) {
      return 'disconnected'
    }
    return mapHubState(this.connection.state)
  }

  get connectionId(): string | null {
    return this.connection?.connectionId ?? null
  }

  async start(): Promise<void> {
    if (this.disposed) {
      throw new Error('SignalRConnection has been disposed')
    }

    if (this.connection?.state === HubConnectionState.Connected) {
      return
    }

    if (this.connection?.state === HubConnectionState.Connecting) {
      return
    }

    this.connection = this.buildConnection()
    this.registerConnectionCallbacks(this.connection)

    const previousState = this.state
    this.notifyStateChange(previousState, 'connecting')

    try {
      await this.connection.start()
      this.notifyStateChange('connecting', 'connected')
    } catch (error: unknown) {
      this.notifyStateChange('connecting', 'disconnected')
      const message = error instanceof Error ? error.message : 'Failed to start SignalR connection'
      throw new Error(`SignalR connection failed: ${message}`)
    }
  }

  async stop(): Promise<void> {
    if (!this.connection) {
      return
    }

    const previousState = this.state
    this.notifyStateChange(previousState, 'disconnecting')

    try {
      await this.connection.stop()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to stop SignalR connection'
      throw new Error(`SignalR stop failed: ${message}`)
    }
  }

  /**
   * Subscribe to a specific SignalR event (notification type).
   * Returns an unsubscribe function for cleanup.
   */
  on(eventName: string, handler: SignalREventHandler): () => void {
    let handlers = this.eventHandlers.get(eventName)
    if (!handlers) {
      handlers = new Set()
      this.eventHandlers.set(eventName, handlers)
    }
    handlers.add(handler)

    return () => {
      this.off(eventName, handler)
    }
  }

  off(eventName: string, handler: SignalREventHandler): void {
    const handlers = this.eventHandlers.get(eventName)
    if (handlers) {
      handlers.delete(handler)
      if (handlers.size === 0) {
        this.eventHandlers.delete(eventName)
      }
    }
  }

  /**
   * Register a callback invoked on every connection state change.
   */
  onStateChange(handler: SignalRStateChangeHandler): () => void {
    this.stateChangeHandlers.add(handler)
    return () => {
      this.stateChangeHandlers.delete(handler)
    }
  }

  /**
   * Register a callback invoked on every incoming message (for logging).
   */
  onMessage(handler: SignalRMessageHandler): () => void {
    this.messageHandlers.add(handler)
    return () => {
      this.messageHandlers.delete(handler)
    }
  }

  /**
   * Clean up all resources. Connection cannot be reused after disposal.
   */
  dispose(): void {
    this.disposed = true
    this.eventHandlers.clear()
    this.stateChangeHandlers.clear()
    this.messageHandlers.clear()

    if (this.connection) {
      this.connection.stop().catch(() => {
        // Suppress errors during disposal
      })
      this.connection = null
    }
  }

  /**
   * Create a new HubConnection using the SDK's builder.
   *
   * - withUrl: passes the hub URL and a token factory that the SDK calls
   *   on every connect/reconnect to obtain a fresh JWT.
   * - withAutomaticReconnect: the SDK will retry with exponential backoff
   *   (0s, 2s, 10s, 30s) before giving up and firing onclose.
   */
  private buildConnection(): HubConnection {
    return new HubConnectionBuilder()
      .withUrl(this.config.hubUrl, {
        accessTokenFactory: this.config.accessTokenFactory,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build()
  }

  /**
   * Wire up the SDK's lifecycle callbacks to our internal observer system.
   *
   * Message flow:
   *   Server hub calls "SendMessage(notiType, jsonPayload)"
   *     → connection.on("SendMessage") fires
   *       → JSON.parse the payload
   *       → notifyMessage (for logging)
   *       → dispatchEvent (for per-event handlers)
   */
  private registerConnectionCallbacks(connection: HubConnection): void {
    connection.on(SIGNALR_HUB_METHOD, (notiType: string, plainText: string) => {
      let data: unknown
      try {
        data = JSON.parse(plainText)
      } catch {
        data = plainText
      }

      this.notifyMessage(notiType, data)
      this.dispatchEvent(notiType, data)
    })

    connection.onclose((error) => {
      this.notifyStateChange('disconnecting', 'disconnected')
      if (error) {
        console.error('SignalR connection closed with error:', error)
      }
    })

    connection.onreconnecting((error) => {
      this.notifyStateChange('connected', 'reconnecting')
      if (error) {
        console.warn('SignalR reconnecting due to error:', error)
      }
    })

    connection.onreconnected((_connectionId) => {
      this.notifyStateChange('reconnecting', 'connected')
    })
  }

  private dispatchEvent(eventName: string, data: unknown): void {
    const handlers = this.eventHandlers.get(eventName)
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(data)
        } catch (error: unknown) {
          console.error(`Error in SignalR event handler for "${eventName}":`, error)
        }
      }
    }
  }

  private notifyStateChange(
    oldState: SignalRConnectionState,
    newState: SignalRConnectionState,
  ): void {
    for (const handler of this.stateChangeHandlers) {
      try {
        handler(newState, oldState)
      } catch (error: unknown) {
        console.error('Error in SignalR state change handler:', error)
      }
    }
  }

  private notifyMessage(eventName: string, data: unknown): void {
    for (const handler of this.messageHandlers) {
      try {
        handler(eventName, data)
      } catch (error: unknown) {
        console.error('Error in SignalR message handler:', error)
      }
    }
  }
}
