# SignalR Integration Guide

Tài liệu hướng dẫn tích hợp SignalR trong dự án Vue 3, dành cho developer mới hoặc người chưa biết về SignalR.

---

## Mục lục

1. [SignalR là gì?](#1-signalr-là-gì)
2. [Kiến trúc tổng quan](#2-kiến-trúc-tổng-quan)
3. [Cấu trúc thư mục](#3-cấu-trúc-thư-mục)
4. [Flow kết nối chi tiết](#4-flow-kết-nối-chi-tiết)
5. [Flow nhận message chi tiết](#5-flow-nhận-message-chi-tiết)
6. [Giải thích từng file](#6-giải-thích-từng-file)
7. [Cách sử dụng trong component](#7-cách-sử-dụng-trong-component)
8. [Thêm event type mới](#8-thêm-event-type-mới)
9. [Cấu hình environment](#9-cấu-hình-environment)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. SignalR là gì?

**SignalR** là thư viện của Microsoft cho phép server **đẩy dữ liệu real-time** tới client mà client không cần phải gọi API liên tục (polling).

### So sánh với REST API thông thường

|                    | REST API (pull)                | SignalR (push)                   |
| ------------------ | ------------------------------ | -------------------------------- |
| **Cách hoạt động** | Client gọi API → Server trả về | Server tự đẩy data → Client nhận |
| **Real-time**      | Không (phải polling)           | Có                               |
| **Use case**       | CRUD, lấy dữ liệu              | Notification, live update        |
| **Ví dụ**          | Lấy danh sách booking          | Nhận thông báo "có booking mới"  |

### Trong dự án này

Server backend (Azure SignalR Service) đẩy **notification events** tới client khi có thay đổi dữ liệu. Ví dụ:

- Booking mới được tạo → server push `bookings_created`
- Staff thay đổi trạng thái → server push `staff_status_changed`
- Cài đặt shop thay đổi → server push `shop_environment_setup_updated`

Client nhận các events này và có thể cập nhật UI ngay lập tức mà không cần refresh.

### Giao thức truyền tải

SignalR SDK tự chọn giao thức tốt nhất theo thứ tự ưu tiên:

1. **WebSocket** (tốt nhất, hai chiều, persistent connection)
2. **Server-Sent Events** (fallback, một chiều server→client)
3. **Long Polling** (fallback cuối, giống REST nhưng giữ connection)

---

## 2. Kiến trúc tổng quan

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
│     • Quản lý kết nối (start / stop / auto-reconnect)    │
│     • Nhận message từ hub method "SendMessage"            │
│     • Parse JSON và dispatch tới event handlers           │
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
│     • Read-only reactive refs cho components              │
│     • onEvent() với auto-cleanup khi component unmount    │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│  Vue Components                                           │
│     • Hiển thị trạng thái kết nối                         │
│     • Lắng nghe events và cập nhật UI                     │
└──────────────────────────────────────────────────────────┘
```

### Nguyên tắc thiết kế

| Nguyên tắc                 | Cách áp dụng                                                     |
| -------------------------- | ---------------------------------------------------------------- |
| **OOP cho connectors**     | `SignalRConnection` là class vì nó giao tiếp với external system |
| **Functional cho logic**   | Store và composable dùng Composition API + pure functions        |
| **markRaw**                | Connection instance không bị Vue proxy (tránh lỗi SDK)           |
| **Auto-cleanup**           | Composable tự hủy subscriptions khi component unmount            |
| **Separation of concerns** | Connection (service) ↔ State (store) ↔ UI (composable)         |

---

## 3. Cấu trúc thư mục

```
src/modules/signalr/
├── api/
│   └── signalrApi.ts           # Gọi backend API lấy JWT token cho hub
├── composables/
│   └── useSignalR.ts           # Composable cho components (auto-cleanup)
├── constants/
│   └── signalrEvents.ts        # Tên hub, event names, constants
├── services/
│   └── SignalRConnection.ts    # Class quản lý HubConnection lifecycle
├── stores/
│   └── signalRStore.ts         # Pinia store (reactive state)
└── types/
    └── signalr.ts              # TypeScript types & interfaces
```

Các file liên quan bên ngoài module:

```
src/components/layouts/MainLayout.vue    # Khởi tạo SignalR khi user đăng nhập
src/components/template/SignalRExample.vue  # Component debug/example
src/config/app.ts                        # notificationUrl config
.env                                     # VITE_NOTIFICATION_URL
```

---

## 4. Flow kết nối chi tiết

Khi user đăng nhập thành công, flow diễn ra như sau:

```
Step 1: User đăng nhập
   └─▶ LoginView gọi authStore.login()
       └─▶ Chuyển sang MainLayout (route có requiresAuth)

Step 2: MainLayout mount
   └─▶ onMounted() kiểm tra:
       • authStore.isAuthenticated === true ?
       • signalRStore.isDisconnected === true ?
       └─▶ Gọi signalRStore.connectWithAppConfig(shopId)

Step 3: Store gọi API lấy token
   └─▶ signalrApi.getToken({
         shopId: 608232,
         hubName: "salonadmin",
         lifeTime: "1"            // 1 ngày
       })
   └─▶ Backend trả về JWT: "eyJhbGci..."

Step 4: SDK kết nối hub
   └─▶ HubConnectionBuilder
         .withUrl(hubUrl, { accessTokenFactory })
         .withAutomaticReconnect()
         .build()
   └─▶ connection.start()
       └─▶ SDK gọi accessTokenFactory() → lấy JWT
       └─▶ SDK mở WebSocket tới Azure SignalR Service
       └─▶ Gửi JWT trong handshake → Hub xác thực thành công

Step 5: State cập nhật
   └─▶ connectionState: "disconnected" → "connecting" → "connected"
   └─▶ UI phản ánh trạng thái mới
```

### Khi mất kết nối (auto-reconnect)

```
Mạng bị ngắt
  └─▶ SDK phát hiện connection lost
      └─▶ connectionState: "connected" → "reconnecting"
      └─▶ SDK thử kết nối lại (0s, 2s, 10s, 30s)
          └─▶ Mỗi lần thử: gọi lại accessTokenFactory() → token mới
          └─▶ Nếu thành công: "reconnecting" → "connected"
          └─▶ Nếu hết retry: "reconnecting" → "disconnected" (onclose)
```

### Khi user logout

```
User click logout
  └─▶ Router chuyển sang /auth (unmount MainLayout)
      └─▶ MainLayout.onUnmounted()
          └─▶ signalRStore.dispose()
              └─▶ connection.stop() → WebSocket đóng
              └─▶ Clear handlers, state reset
```

---

## 5. Flow nhận message chi tiết

Khi server push một notification:

```
Step 1: Server gọi hub method
   Hub.Clients.Group("shop-608232").SendMessage("bookings_created", "{...json...}")

Step 2: SDK nhận message
   └─▶ connection.on("SendMessage", callback) fires
       └─▶ callback(notiType="bookings_created", plainText="{...}")

Step 3: SignalRConnection xử lý
   └─▶ JSON.parse(plainText) → data object
   └─▶ notifyMessage("bookings_created", data)  ← cho logging
   └─▶ dispatchEvent("bookings_created", data)  ← cho handlers

Step 4: Event dispatch
   └─▶ Tìm handlers đã đăng ký cho "bookings_created"
   └─▶ Gọi từng handler(data)

Step 5: Component nhận event
   └─▶ onEvent("bookings_created", (data) => {
         // Cập nhật UI, refresh data, show notification...
       })
```

---

## 6. Giải thích từng file

### `types/signalr.ts`

Chứa tất cả TypeScript types. File này là "bản đồ" giúp hiểu cấu trúc dữ liệu trong module:

- `SignalRConnectionState` — 5 trạng thái kết nối
- `SignalRConfig` — config cần để tạo connection
- `GetSignalRTokenRequest` — payload gửi lên API lấy token
- `SignalRLogEntry` — một dòng log
- `SignalREventHandler` — signature của callback xử lý event

### `constants/signalrEvents.ts`

Chứa tên hub (`salonadmin`), tên method (`SendMessage`), và danh sách notification event types. Khi backend thêm event mới, chỉ cần thêm vào `SIGNALR_EVENTS`.

### `services/SignalRConnection.ts`

**Class duy nhất trong module** (OOP cho external connector). Trách nhiệm:

- Tạo `HubConnection` từ SDK
- Quản lý lifecycle: `start()`, `stop()`, `dispose()`
- Routing: nhận `SendMessage` → parse → dispatch tới handlers
- Observer pattern: `on()`, `onStateChange()`, `onMessage()`

### `api/signalrApi.ts`

Gọi backend API `/api/cmd/v1/bookings/Booking/getToken` để lấy JWT cho Azure SignalR Service.

> **Lưu ý quan trọng**: Endpoint này trả về raw string (không phải `ApiResponse<T>` wrapper), nên dùng `apiClient` trực tiếp thay vì `gatewayService`.

### `stores/signalRStore.ts`

Pinia store làm cầu nối giữa `SignalRConnection` (non-reactive) và Vue components (reactive). Quản lý:

- Reactive state: `connectionState`, `logs`, `error`, `connectionId`
- Connection lifecycle: `connect()`, `disconnect()`, `dispose()`
- Event subscription: `onEvent()`, `offEvent()`
- Log management: `addLog()`, `clearLogs()`, `toggleLogsEnabled()`

**Tại sao dùng `shallowRef` + `markRaw`?**
`HubConnection` từ SDK có internal state phức tạp. Nếu Vue wrap nó trong Proxy (reactive), SDK sẽ bị lỗi. `markRaw` đánh dấu object này là "không reactive", `shallowRef` chỉ track reference thay đổi.

### `composables/useSignalR.ts`

Composable dành cho components. Ưu điểm so với dùng store trực tiếp:

- **Deferred subscription**: `onEvent()` hoạt động bất kể connection đã sẵn sàng hay chưa. Nếu connection chưa ready, subscription được buffer và tự đăng ký khi connected. Component không cần `watch(isConnected)`.
- **Auto-cleanup**: tất cả subscriptions tự hủy khi component unmount
- **Read-only refs**: components không thể vô tình mutate state
- **Consistent API**: tất cả components dùng cùng interface

### `MainLayout.vue`

Nơi khởi tạo SignalR connection. Được chọn vì:

- Chỉ render cho authenticated routes (luôn có token + shopId)
- Unmount khi logout → tự động dispose connection

---

## 7. Cách sử dụng trong component

### Đọc trạng thái kết nối

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

### Lắng nghe event

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useSignalR } from '@/modules/signalr/composables/useSignalR'
import { SIGNALR_EVENTS } from '@/modules/signalr/constants/signalrEvents'

const { onEvent } = useSignalR()
const latestBooking = ref(null)

// Gọi trực tiếp — composable tự buffer nếu connection chưa ready
onEvent(SIGNALR_EVENTS.BOOKINGS_CREATED, (data) => {
  latestBooking.value = data
  // Có thể: reload danh sách, show toast, v.v.
})
</script>
```

### Xem logs (debug)

```vue
<script setup lang="ts">
import { useSignalR } from '@/modules/signalr/composables/useSignalR'

const { logs, logCount, clearLogs, toggleLogsEnabled } = useSignalR()
</script>
```

---

## 8. Thêm event type mới

Khi backend thêm notification type mới:

### Bước 1: Thêm constant

```typescript
// src/modules/signalr/constants/signalrEvents.ts
export const SIGNALR_EVENTS = {
  // ... existing events ...

  // Thêm event mới
  INVENTORY_UPDATED: 'inventory_updated',
} as const
```

### Bước 2: Sử dụng trong component

```typescript
import { SIGNALR_EVENTS } from '@/modules/signalr/constants/signalrEvents'

onEvent(SIGNALR_EVENTS.INVENTORY_UPDATED, (data) => {
  // Xử lý event
})
```

Không cần sửa bất kỳ file nào khác — hệ thống tự động route message dựa trên event name.

---

## 9. Cấu hình environment

### `.env`

```bash
# URL của Azure SignalR Service hub
VITE_NOTIFICATION_URL="https://ahasoft-salon-solution-notification-dev.service.signalr.net/client/?hub=salonadmin"
```

### Các environment khác

| Environment | URL pattern                                                 |
| ----------- | ----------------------------------------------------------- |
| localhost   | `...-local.service.signalr.net/client/?hub=salonadmin`      |
| development | `...-dev.service.signalr.net/client/?hub=salonadmin`        |
| staging     | `...-staging.service.signalr.net/client/?hub=salonadmin`    |
| production  | `...-production.service.signalr.net/client/?hub=salonadmin` |

### Token API

Token được lấy từ gateway (cùng base URL với các API khác):

```
POST /api/cmd/v1/bookings/Booking/getToken
Body: { "shopId": 608232, "hubName": "salonadmin", "lifeTime": "1" }
Response: "eyJhbGci..." (raw JWT string)
```

---

## 10. Troubleshooting

### "SignalR connection failed: 401 Unauthorized"

**Nguyên nhân**: Token không hợp lệ hoặc hết hạn.

**Kiểm tra**:

1. API `getToken` có trả về 200 OK không? (check Network tab)
2. Token có đúng audience (hub URL) không?
3. `VITE_NOTIFICATION_URL` có khớp với environment không?

### "Failed to obtain SignalR access token: empty response"

**Nguyên nhân**: API `getToken` trả về response rỗng.

**Kiểm tra**:

1. User đã đăng nhập thành công chưa? (cần auth token cho API call)
2. `shopId` có hợp lệ không?
3. Backend bookings service có đang chạy không?

### Connection liên tục reconnecting

**Nguyên nhân**: Mạng không ổn định hoặc server hub restart.

**Hành vi**: SDK tự retry với backoff (0s → 2s → 10s → 30s). Sau 4 lần thất bại sẽ chuyển sang `disconnected`. Khi user quay lại tab, MainLayout sẽ thử kết nối lại.

### Events không nhận được

**Kiểm tra**:

1. Connection state có phải `connected` không?
2. Event name có khớp chính xác với backend không? (case-sensitive)
3. Đã subscribe event qua `onEvent()` chưa?
4. Có đang subscribe **sau** khi connection ready không? (dùng `watch(isConnected, ...)`)

### Debug bằng SignalRExample

Truy cập route có `ExamplesHost` → chọn "SignalR Example" từ dropdown để:

- Xem connection state real-time
- Xem connection ID
- Monitor tất cả incoming events trong log
- Kiểm tra notification URL đang dùng

---

## Dependencies

| Package              | Version | Purpose                |
| -------------------- | ------- | ---------------------- |
| `@microsoft/signalr` | ^10.0.0 | SignalR JavaScript SDK |

Cài đặt: `pnpm add @microsoft/signalr`
