# Staff Management — Design Specification

## 1. Context (current state)

- The app is Vue 3 + TypeScript + PrimeVue 4 + Pinia + Vue Router; API calls use `gatewayService` when integrated (`src/api/services/base.ts`, `src/config/services.ts`).
- **`STAFFS_SERVICE`** is already declared (`name: 'staffs'`) but there is no staff CRUD UI or `staffApi` wired to the gateway yet.
- The **admin** module provides a proven CRUD route pattern: parent layout + list, create, `:id` detail, `:id/edit` (`src/modules/admin/routes.ts`).
- Calendar types reference staff lightly (`staffId`, `staffName` only) — not sufficient for full staff management.
- **No MSW** in the repo; mock data will live in the staff module.
- **Authentication:** main layout uses `requiresAuth: true`. **`permission.guard`** does not enforce `requiredRoles` behavior yet; routes may still declare `requiredRoles` for future use — this feature explicitly does **not** add role restrictions in the first phase.

## 2. Target state (after implementation)

- A **standalone module** `staff` at routes such as `/staff`, `/staff/create`, `/staff/:id`, `/staff/:id/edit`, mirroring the admin nesting pattern.
- **Full CRUD in the UI for list, create, detail, and edit** backed by an **in-memory mock API layer** (phase C — UI/flow first; no real backend contract yet).
- **Extended mock fields:** employee code, full name, email, phone, department, role, hire date, status (e.g. active/inactive).
- **Forms** validated with **VeeValidate + Yup**; **i18n** keys under a `staff.*` namespace for **en, vi, ko**.
- **Minimal entry point** in the shell (e.g. link in `AppHeader` or `HomeView`) so users can open the staff list without typing the URL.
- **Out of scope for this phase:** delete, import/export, fine-grained permissions, real `gatewayService` integration (tracked as a follow-up when API is ready).

## 3. Files to change (descriptions only)

| Area | Action |
|------|--------|
| `src/modules/staff/routes.ts` | Define `STAFF_ROUTE_NAMES`, nested routes (list, create, detail, edit), `meta.title` / `module: 'staff'`. |
| `src/modules/staff/views/*.vue` | `StaffView` (outlet), `StaffList`, `StaffCreate`, `StaffDetail`, `StaffEdit` — follow admin view responsibilities. |
| `src/modules/staff/api/staffApi.ts` | Async functions `getList`, `getById`, `create`, `update` returning shapes compatible with future gateway replacement; in-memory array + optional small delay. |
| `src/modules/staff/types/staff.ts` | `Staff` interface and related types (status enum, payloads). |
| `src/modules/staff/schemas/staffSchema.ts` | Yup schema(s) for create/edit. |
| `src/modules/staff/index.ts` | Export public types / route names if other modules need them. |
| `src/router/index.ts` | Import and spread `staffRoutes` alongside `adminRoutes`. |
| `src/components/layouts/AppHeader.vue` or `src/views/Home/HomeView.vue` | Add navigation link to staff list (minimal). |
| `src/locales/en.ts`, `vi.ts`, `ko.ts` | Add `staff.*` strings for titles, labels, validation messages, table headers. |

*Exact filenames may follow existing module conventions if they differ slightly (e.g. composables only if shared logic emerges).*

## 4. Task checklist

- [ ] Add `Staff` model and status (or role) enums/types as needed.
- [ ] Implement `staffApi` mock with seed data; handle unknown `id` with explicit failure (reject / throw per project error pattern).
- [ ] Register routes and ensure authenticated layout wraps them.
- [ ] Build list view: PrimeVue DataTable, client-side sort/pagination acceptable for mock volume.
- [ ] Build create and edit views with shared form fields and Yup validation.
- [ ] Build detail view (read-only) with navigation to edit.
- [ ] Add i18n for all user-visible strings (en, vi, ko).
- [ ] Add at least one navigation entry to the staff list.
- [ ] Document in code (single TODO block or file header) where to swap mock `staffApi` for `gatewayService` + `STAFFS_SERVICE` when endpoints exist.
- [ ] Run `pnpm validate` before merge.

## 5. Optional follow-ups (not part of this spec)

- Wire real CQRS endpoints; align types with backend DTOs.
- Add delete, bulk actions, or server-side pagination/filtering.
- Enforce `requiredRoles` when product and `permission.guard` are ready.
- Extract Pinia store if cross-view caching or SignalR sync is required.
