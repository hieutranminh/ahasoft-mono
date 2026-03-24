/**
 * SignalR type definitions.
 *
 * Architecture overview:
 * - SignalRConnection (class)  → manages the raw @microsoft/signalr HubConnection
 * - signalRStore (Pinia)       → reactive state for the UI layer
 * - useSignalR (composable)    → component-level API with auto-cleanup
 *
 * Data flow:
 *   Server hub ──SendMessage──▶ SignalRConnection ──dispatch──▶ eventHandlers
 *                                      │
 *                               onStateChange / onMessage
 *                                      │
 *                                      ▼
 *                                signalRStore (reactive refs)
 *                                      │
 *                                      ▼
 *                                useSignalR (components)
 */

import { HubConnectionState } from '@microsoft/signalr'

/**
 * Simplified connection state used across the app.
 * We use string literals instead of the SDK's numeric enum
 * for readability in templates and devtools.
 */
export type SignalRConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnecting'

/** A single log entry captured from an incoming hub message. */
export interface SignalRLogEntry {
  readonly id: string
  readonly eventName: string
  readonly data: unknown
  readonly timestamp: string
}

/**
 * Configuration needed to establish a SignalR hub connection.
 * `accessTokenFactory` is called on every connect/reconnect attempt,
 * ensuring a fresh JWT is used each time.
 */
export interface SignalRConfig {
  readonly hubUrl: string
  readonly accessTokenFactory: () => Promise<string>
}

/**
 * Request payload for the backend getToken API.
 * The backend returns a short-lived JWT scoped to the given hub.
 */
export interface GetSignalRTokenRequest {
  readonly shopId: number
  readonly hubName: string
  /** Token validity period in days (e.g. "1" = 24 hours). */
  readonly lifeTime: string
}

/** Handler for a specific notification event type (e.g. "bookings_created"). */
export type SignalREventHandler = (data: unknown) => void

/** Handler invoked whenever the connection state transitions. */
export type SignalRStateChangeHandler = (
  newState: SignalRConnectionState,
  oldState: SignalRConnectionState,
) => void

/** Handler invoked for every raw hub message (used for logging). */
export type SignalRMessageHandler = (eventName: string, data: unknown) => void

/**
 * Maps HubConnectionState enum to our string-based state type
 */
export function mapHubState(hubState: HubConnectionState): SignalRConnectionState {
  switch (hubState) {
    case HubConnectionState.Disconnected:
      return 'disconnected'
    case HubConnectionState.Connecting:
      return 'connecting'
    case HubConnectionState.Connected:
      return 'connected'
    case HubConnectionState.Disconnecting:
      return 'disconnecting'
    case HubConnectionState.Reconnecting:
      return 'reconnecting'
    default:
      return 'disconnected'
  }
}
