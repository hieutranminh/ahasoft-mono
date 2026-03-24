# SignalR Integration Guide

A guide to the SignalR integration in the Vue 3 project, intended for new developers or anyone unfamiliar with SignalR.

---

## Table of Contents

1. [What is SignalR?](#1-what-is-signalr)
2. [Architecture Overview](#2-architecture-overview)
3. [Folder Structure](#3-folder-structure)
4. [Connection Flow in Detail](#4-connection-flow-in-detail)
5. [Message Flow in Detail](#5-message-flow-in-detail)
6. [File-by-File Explanation](#6-file-by-file-explanation)
7. [Usage in Components](#7-usage-in-components)
8. [Adding a New Event Type](#8-adding-a-new-event-type)
9. [Environment Configuration](#9-environment-configuration)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. What is SignalR?

**SignalR** is a Microsoft library that allows the server to **push real-time data** to the client without the client having to poll repeatedly.

### Comparison with Regular REST APIs

|                  | REST API (pull)                    | SignalR (push)                             |
| ---------------- | ---------------------------------- | ------------------------------------------ |
| **How it works** | Client calls API → Server responds | Server pushes data → Client receives       |
| **Real-time**    | No (requires polling)              | Yes                                        |
| **Use case**     | CRUD, fetching data                | Notifications, live updates                |
| **Example**      | Fetch booking list                 | Receive "new booking created" notification |

### In This Project

The backend (Azure SignalR Service) pushes **notification events** to the client when data changes. For example:

- A new booking is created → server pushes `bookings_created`
- Staff status changes → server pushes `staff_status_changed`
- Shop settings updated → server pushes `shop_environment_setup_updated`

The client receives these events and can update the UI immediately without a page refresh.

### Transport Protocols

The SignalR SDK automatically selects the best transport protocol in order of priority:

1. **WebSocket** (best — bidirectional, persistent connection)
2. **Server-Sent Events** (fallback — unidirectional, server→client)
3. **Long Polling** (last resort — similar to REST but holds the connection open)

---

## 2. Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                     Azure SignalR Service                  │
│              (Hub: salonadmin)                             │
└──────────────────────┬───────────────────────────────────┘
                       │  WebSocket / SSE / Long Polling
                       ▼
┌──────────────────────────────────────────────────────────┐
│  SignalRConnection (class)                                │
│  └─ @microsoft/signalr HubConnection                     │
│     • Manages connection (start / stop / auto-reconnect)  │
│     • Receives messages from hub method "SendMessage"     │
│     • Parses JSON and dispatches to event handlers        │
└──────────────────────┬───────────────────────────────────┘
                       │  onStateChange / onMessage / dispatch
                       ▼
┌──────────────────────────────────────────────────────────┐
│  signalRStore (Pinia)                                     │
│     • Reactive state: connectionState, logs, error        │
│     • Actions: connect, disconnect, dispose               │
│     • Event subscription: onEvent / offEvent              │
└──────────────────────┬───────────────────────────────────┘
                       │  storeToRefs / computed
                       ▼
┌──────────────────────────────────────────────────────────┐
│  useSignalR (composable)                                  │
│     • Read-only reactive refs for components              │
│     • onEvent() with auto-cleanup on component unmount    │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│  Vue Components                                           │
│     • Display connection status                           │
│     • Listen to events and update UI                      │
└──────────────────────────────────────────────────────────┘
```

### Design Principles

| Principle                  | How It's Applied                                                             |
| -------------------------- | ---------------------------------------------------------------------------- |
| **OOP for connectors**     | `SignalRConnection` is a class because it interfaces with an external system |
| **Functional for logic**   | Store and composable use Composition API + pure functions                    |
| **markRaw**                | Connection instance is not wrapped by Vue's proxy (prevents SDK errors)      |
| **Auto-cleanup**           | Composable automatically unsubscribes when the component unmounts            |
| **Separation of concerns** | Connection (service) ↔ State (store) ↔ UI (composable)                     |

---

## 3. Folder Structure

```
src/modules/signalr/
├── api/
│   └── signalrApi.ts           # Calls backend API to get JWT token for the hub
├── composables/
│   └── useSignalR.ts           # Composable for components (auto-cleanup)
├── constants/
│   └── signalrEvents.ts        # Hub name, event names, constants
├── services/
│   └── SignalRConnection.ts    # Class managing HubConnection lifecycle
├── stores/
│   └── signalRStore.ts         # Pinia store (reactive state)
└── types/
    └── signalr.ts              # TypeScript types & interfaces
```

Related files outside the module:

```
src/components/layouts/MainLayout.vue    # Initializes SignalR when user logs in
src/components/template/SignalRExample.vue  # Debug/example component
src/config/app.ts                        # notificationUrl config
.env                                     # VITE_NOTIFICATION_URL
```

---

## 4. Connection Flow in Detail

When a user successfully logs in, the following flow takes place:

```
Step 1: User logs in
   └─▶ LoginView calls authStore.login()
       └─▶ Navigates to MainLayout (route with requiresAuth)

Step 2: MainLayout mounts
   └─▶ onMounted() checks:
       • authStore.isAuthenticated === true ?
       • signalRStore.isDisconnected === true ?
       └─▶ Calls signalRStore.connectWithAppConfig(shopId)

Step 3: Store calls the token API
   └─▶ signalrApi.getToken({
         shopId: 608232,
         hubName: "salonadmin",
         lifeTime: "1"            // 1 day
       })
   └─▶ Backend returns JWT: "eyJhbGci..."

Step 4: SDK connects to the hub
   └─▶ HubConnectionBuilder
         .withUrl(hubUrl, { accessTokenFactory })
         .withAutomaticReconnect()
         .build()
   └─▶ connection.start()
       └─▶ SDK calls accessTokenFactory() → obtains JWT
       └─▶ SDK opens WebSocket to Azure SignalR Service
       └─▶ Sends JWT in handshake → Hub authenticates successfully

Step 5: State updates
   └─▶ connectionState: "disconnected" → "connecting" → "connected"
   └─▶ UI reflects the new state
```

### On Disconnection (auto-reconnect)

```
Network drops
  └─▶ SDK detects connection lost
      └─▶ connectionState: "connected" → "reconnecting"
      └─▶ SDK retries with backoff (0s, 2s, 10s, 30s)
          └─▶ Each attempt: calls accessTokenFactory() → fresh token
          └─▶ If successful: "reconnecting" → "connected"
          └─▶ If retries exhausted: "reconnecting" → "disconnected" (onclose)
```

### On User Logout

```
User clicks logout
  └─▶ Router navigates to /auth (unmounts MainLayout)
      └─▶ MainLayout.onUnmounted()
          └─▶ signalRStore.dispose()
              └─▶ connection.stop() → WebSocket closes
              └─▶ Clears handlers, resets state
```

---

## 5. Message Flow in Detail

When the server pushes a notification:

```
Step 1: Server calls the hub method
   Hub.Clients.Group("shop-608232").SendMessage("bookings_created", "{...json...}")

Step 2: SDK receives the message
   └─▶ connection.on("SendMessage", callback) fires
       └─▶ callback(notiType="bookings_created", plainText="{...}")

Step 3: SignalRConnection processes the message
   └─▶ JSON.parse(plainText) → data object
   └─▶ notifyMessage("bookings_created", data)  ← for logging
   └─▶ dispatchEvent("bookings_created", data)  ← for handlers

Step 4: Event dispatch
   └─▶ Finds handlers registered for "bookings_created"
   └─▶ Calls each handler(data)

Step 5: Component receives the event
   └─▶ onEvent("bookings_created", (data) => {
         // Update UI, refresh data, show notification, etc.
       })
```

---

## 6. File-by-File Explanation

### `types/signalr.ts`

Contains all TypeScript types. This file serves as a "map" to understand data structures in the module:

- `SignalRConnectionState` — 5 connection states
- `SignalRConfig` — configuration needed to create a connection
- `GetSignalRTokenRequest` — payload sent to the token API
- `SignalRLogEntry` — a single log entry
- `SignalREventHandler` — callback signature for event handling

### `constants/signalrEvents.ts`

Contains the hub name (`salonadmin`), method name (`SendMessage`), and the list of notification event types. When the backend adds a new event, simply add it to `SIGNALR_EVENTS`.

### `services/SignalRConnection.ts`

**The only class in the module** (OOP for the external connector). Responsibilities:

- Creates the `HubConnection` from the SDK
- Manages lifecycle: `start()`, `stop()`, `dispose()`
- Routing: receives `SendMessage` → parses → dispatches to handlers
- Observer pattern: `on()`, `onStateChange()`, `onMessage()`

### `api/signalrApi.ts`

Calls the backend API at `/api/cmd/v1/bookings/Booking/getToken` to obtain a JWT for Azure SignalR Service.

> **Important note**: This endpoint returns a raw string (not an `ApiResponse<T>` wrapper), so it uses `apiClient` directly instead of `gatewayService`.

### `stores/signalRStore.ts`

Pinia store that bridges `SignalRConnection` (non-reactive) with Vue components (reactive). Manages:

- Reactive state: `connectionState`, `logs`, `error`, `connectionId`
- Connection lifecycle: `connect()`, `disconnect()`, `dispose()`
- Event subscription: `onEvent()`, `offEvent()`
- Log management: `addLog()`, `clearLogs()`, `toggleLogsEnabled()`

**Why `shallowRef` + `markRaw`?**
The SDK's `HubConnection` has complex internal state. If Vue wraps it in a Proxy (reactive), the SDK will break. `markRaw` marks the object as "not reactive", and `shallowRef` only tracks reference changes.

### `composables/useSignalR.ts`

Composable designed for components. Advantages over using the store directly:

- **Deferred subscription**: `onEvent()` works regardless of whether the connection is ready. If not yet connected, subscriptions are buffered and automatically registered once the connection is established. Components never need `watch(isConnected)`.
- **Auto-cleanup**: all subscriptions are automatically removed when the component unmounts
- **Read-only refs**: components cannot accidentally mutate state
- **Consistent API**: all components use the same interface

### `MainLayout.vue`

Where the SignalR connection is initialized. Chosen because:

- Only rendered for authenticated routes (token + shopId always available)
- Unmounts on logout → automatically disposes the connection

---

## 7. Usage in Components

### Reading Connection Status

```vue
<template>
  <Tag v-if="isConnected" value="Online" severity="success" />
  <Tag v-else value="Offline" severity="danger" />
</template>

<script setup lang="ts">
import { useSignalR } from '@/modules/signalr/composables/useSignalR'

const { isConnected } = useSignalR()
</script>
```

### Listening to Events

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useSignalR } from '@/modules/signalr/composables/useSignalR'
import { SIGNALR_EVENTS } from '@/modules/signalr/constants/signalrEvents'

const { onEvent } = useSignalR()
const latestBooking = ref(null)

// Call directly — the composable buffers if the connection is not yet ready
onEvent(SIGNALR_EVENTS.BOOKINGS_CREATED, (data) => {
  latestBooking.value = data
  // Could also: reload a list, show a toast, etc.
})
</script>
```

### Viewing Logs (debug)

```vue
<script setup lang="ts">
import { useSignalR } from '@/modules/signalr/composables/useSignalR'

const { logs, logCount, clearLogs, toggleLogsEnabled } = useSignalR()
</script>
```

---

## 8. Adding a New Event Type

When the backend adds a new notification type:

### Step 1: Add the constant

```typescript
// src/modules/signalr/constants/signalrEvents.ts
export const SIGNALR_EVENTS = {
  // ... existing events ...

  // Add new event
  INVENTORY_UPDATED: 'inventory_updated',
} as const
```

### Step 2: Use it in a component

```typescript
import { SIGNALR_EVENTS } from '@/modules/signalr/constants/signalrEvents'

onEvent(SIGNALR_EVENTS.INVENTORY_UPDATED, (data) => {
  // Handle the event
})
```

No other files need to be modified — the system automatically routes messages based on the event name.

---

## 9. Environment Configuration

### `.env`

```bash
# Azure SignalR Service hub URL
VITE_NOTIFICATION_URL="https://ahasoft-salon-solution-notification-dev.service.signalr.net/client/?hub=salonadmin"
```

### Other Environments

| Environment | URL pattern                                                 |
| ----------- | ----------------------------------------------------------- |
| localhost   | `...-local.service.signalr.net/client/?hub=salonadmin`      |
| development | `...-dev.service.signalr.net/client/?hub=salonadmin`        |
| staging     | `...-staging.service.signalr.net/client/?hub=salonadmin`    |
| production  | `...-production.service.signalr.net/client/?hub=salonadmin` |

### Token API

The token is obtained from the gateway (same base URL as other APIs):

```
POST /api/cmd/v1/bookings/Booking/getToken
Body: { "shopId": 608232, "hubName": "salonadmin", "lifeTime": "1" }
Response: "eyJhbGci..." (raw JWT string)
```

---

## 10. Troubleshooting

### "SignalR connection failed: 401 Unauthorized"

**Cause**: Token is invalid or expired.

**Check**:

1. Does the `getToken` API return 200 OK? (check the Network tab)
2. Does the token have the correct audience (hub URL)?
3. Does `VITE_NOTIFICATION_URL` match the current environment?

### "Failed to obtain SignalR access token: empty response"

**Cause**: The `getToken` API returned an empty response.

**Check**:

1. Has the user logged in successfully? (an auth token is needed for the API call)
2. Is the `shopId` valid?
3. Is the backend bookings service running?

### Connection continuously reconnecting

**Cause**: Unstable network or hub server restart.

**Behavior**: The SDK retries automatically with backoff (0s → 2s → 10s → 30s). After 4 failed attempts it transitions to `disconnected`. When the user returns to the tab, MainLayout will attempt to reconnect.

### Events not being received

**Check**:

1. Is the connection state `connected`?
2. Does the event name exactly match the backend? (case-sensitive)
3. Have you subscribed to the event via `onEvent()`?
4. Are you subscribing **after** the connection is ready? (use `watch(isConnected, ...)`)

### Debugging with SignalRExample

Navigate to the route containing `ExamplesHost` → select "SignalR Example" from the dropdown to:

- See real-time connection state
- See the connection ID
- Monitor all incoming events in the log
- Check which notification URL is being used

---

## Dependencies

| Package              | Version | Purpose                |
| -------------------- | ------- | ---------------------- |
| `@microsoft/signalr` | ^10.0.0 | SignalR JavaScript SDK |

Install: `pnpm add @microsoft/signalr`
