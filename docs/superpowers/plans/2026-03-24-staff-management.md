# Staff Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a mock-backed Staff Management module (list, create, detail, edit) at `/staff/*` with Yup validation, i18n (en/vi/ko), and a visible nav link, ready to swap `staffApi` for `gatewayService` later.

**Architecture:** Follow `src/modules/admin/` routing (parent `StaffView` + `RouterView` outlet, child routes). Business data flows through `src/modules/staff/api/staffApi.ts` as the only persistence boundary (in-memory array for now). Views load data via async calls; forms use VeeValidate + shared Yup schema. No Pinia store unless a later task proves necessary.

**Tech stack:** Vue 3 (`<script setup>`), TypeScript, Vue Router 4, PrimeVue 4 (DataTable, Button, InputText, Select, DatePicker, Card), VeeValidate, Yup, vue-i18n, Luxon for dates if needed, Vitest for unit tests on `staffApi`.

**Spec:** @ `docs/superpowers/specs/2026-03-24-staff-management-design.md`

---

## File map (create / modify)

| File                                       | Responsibility                                                                                                               |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `src/modules/staff/types/staff.ts`         | `Staff`, `StaffStatus`, create/update payload types, `StaffListItem` if distinct                                             |
| `src/modules/staff/api/staffApi.ts`        | Mock `getList`, `getById`, `create`, `update`; in-memory state; `throw new Error(...)` for unknown id                        |
| `src/modules/staff/api/staffApi.test.ts`   | Vitest: list after create, getById throws when missing                                                                       |
| `src/modules/staff/schemas/staffSchema.ts` | Yup object for create/edit (align field names with `Staff`)                                                                  |
| `src/modules/staff/routes.ts`              | `STAFF_ROUTE_NAMES`, `StaffRouteNameType`, `staffRoutes` (mirror `admin/routes.ts` order: `''`, `create`, `:id`, `:id/edit`) |
| `src/modules/staff/views/StaffView.vue`    | Layout shell with `<RouterView />` only                                                                                      |
| `src/modules/staff/views/StaffList.vue`    | DataTable, links to detail/create, optional client filter                                                                    |
| `src/modules/staff/views/StaffDetail.vue`  | Read-only fields, button to edit (`useRouter` + `STAFF_ROUTE_NAMES`)                                                         |
| `src/modules/staff/views/StaffCreate.vue`  | Form + submit → `create` → navigate to detail                                                                                |
| `src/modules/staff/views/StaffEdit.vue`    | Load by route `id`, form + `update` → navigate to detail or stay                                                             |
| `src/modules/staff/index.ts`               | Re-export `STAFF_ROUTE_NAMES`, `StaffRouteNameType`                                                                          |
| `src/router/index.ts`                      | `import { staffRoutes } from '@/modules/staff/routes'` and `...staffRoutes` in authenticated children                        |
| `src/components/layouts/AppHeader.vue`     | `RouterLink` to `staff-list` (or `Button` + `@click` with `router.push`)                                                     |
| `src/locales/en.ts`                        | Nested `staff: { ... }` keys                                                                                                 |
| `src/locales/vi.ts`                        | Same structure                                                                                                               |
| `src/locales/ko.ts`                        | Same structure                                                                                                               |

**Note:** `useRouterNavigation().navigateTo()` is typed to `RouteNameType` from `src/constants/routeNames.ts` (global routes only). For staff routes, use `useRouter()` from `vue-router` with `{ name: STAFF_ROUTE_NAMES.STAFF_LIST, ... }` and `import type { StaffRouteNameType }` where a name union is needed.

---

### Task 1: Types and mock API

**Files:**

- Create: `src/modules/staff/types/staff.ts`
- Create: `src/modules/staff/api/staffApi.ts`

- [ ] **Step 1.1:** Define `Staff` with `id: string` (or `number` — pick one and use consistently for route params), `code`, `fullName`, `email`, `phone`, `department`, `role`, `hireDate` (ISO date string), `status` (`'active' | 'inactive'` or const object in `staff.ts`).
- [ ] **Step 1.2:** In `staffApi.ts`, hold private `let staffRecords: Staff[]` seeded with 3–5 rows. Export `getList(): Promise<Staff[]>`, `getById(id): Promise<Staff>`, `create(payload): Promise<Staff>`, `update(id, payload): Promise<Staff>`. On unknown id for get/update, `throw new Error('Staff not found')` with a stable message for optional i18n mapping later.
- [ ] **Step 1.3:** Add file header comment in `staffApi.ts`: replace this module with `gatewayService` + `STAFFS_SERVICE` when backend endpoints exist; list expected endpoint names as TODO.

**Verify:** No Vue imports in `staffApi.ts`; TypeScript compiles.

**Commit:** `feat(staff): add types and mock staffApi`

---

### Task 2: Unit tests for staffApi

**Files:**

- Create: `src/modules/staff/api/staffApi.test.ts`

- [ ] **Step 2.1:** Import `staffApi` and test that `getList()` returns seed length ≥ 1.
- [ ] **Step 2.2:** Test `create` increases list length and returned staff has new `id`.
- [ ] **Step 2.3:** Test `getById('non-existent')` throws.

**Run:** `pnpm exec vitest run src/modules/staff/api/staffApi.test.ts`  
**Expected:** all tests PASS.

**Commit:** `test(staff): add staffApi mock tests`

---

### Task 3: Routes and shell view

**Files:**

- Create: `src/modules/staff/routes.ts`
- Create: `src/modules/staff/views/StaffView.vue`
- Create: `src/modules/staff/index.ts`
- Modify: `src/router/index.ts`

- [ ] **Step 3.1:** Copy structure from `src/modules/admin/routes.ts`: `path: 'staff'`, parent name `staff`, component `StaffView`, children with `meta.title` and `module: 'staff'`. Use route names: `staff`, `staff-list`, `staff-create`, `staff-detail`, `staff-edit`.
- [ ] **Step 3.2:** `StaffView.vue`: single `<main>` or wrapper + `<RouterView />` (match `AdminView.vue` pattern if it has more — check `AdminView.vue`).
- [ ] **Step 3.3:** Register `...staffRoutes` in `src/router/index.ts` after imports, same level as `adminRoutes`.
- [ ] **Step 3.4:** Export `STAFF_ROUTE_NAMES` from `src/modules/staff/index.ts`.

**Verify:** `pnpm type-check` passes; manual navigation to `/staff` in dev (empty child view OK).

**Commit:** `feat(staff): register routes and StaffView shell`

---

### Task 4: i18n strings (staff namespace)

**Files:**

- Modify: `src/locales/en.ts`, `src/locales/vi.ts`, `src/locales/ko.ts`

- [ ] **Step 4.1:** Add `staff` object with keys for: page titles (list, create, detail, edit), table columns, form labels, status labels, `notFound`, `loadError`, actions (`addStaff`, `viewDetail`).
- [ ] **Step 4.2:** Keep key parity across all three locale files (same nesting).

**Verify:** No missing keys referenced from views in later tasks (add keys as you build views if needed).

**Commit:** `i18n: add staff namespace (en, vi, ko)`

---

### Task 5: Yup schema

**Files:**

- Create: `src/modules/staff/schemas/staffSchema.ts`

- [ ] **Step 5.1:** Export `staffFormSchema` using `yup` with required fields matching `Staff` (except `id`). Use `validation.*` from locales where possible via labels, or inline messages keyed later.
- [ ] **Step 5.2:** Export inferred type helper if the project uses `yup.InferType` for form models.

**Reference:** @ `.cursor/rules/form-validation.mdc`

**Commit:** `feat(staff): add staff Yup schema`

---

### Task 6: Staff list page

**Files:**

- Create: `src/modules/staff/views/StaffList.vue`

- [ ] **Step 6.1:** On mount, `await staffApi.getList()` into `ref`; handle errors with `useAlert` or project-standard toast (check `useAlert` / plugin pattern in codebase).
- [ ] **Step 6.2:** PrimeVue `DataTable` with columns: code, fullName, department, role, status, hireDate; optional `Paginator` with `:rows="10"` client-side.
- [ ] **Step 6.3:** Actions column: RouterLink or button to `staff-detail` with `params: { id }`; top toolbar: button to `staff-create` via `router.push({ name: STAFF_ROUTE_NAMES.STAFF_CREATE })`.
- [ ] **Step 6.4:** Use `$t('staff.*')` for headers and buttons.

**Verify:** List shows seed data; navigation to create/detail works.

**Commit:** `feat(staff): add StaffList view`

---

### Task 7: Staff detail page

**Files:**

- Create: `src/modules/staff/views/StaffDetail.vue`

- [ ] **Step 7.1:** `const route = useRoute(); const id = computed(() => route.params.id as string)` (adjust type if numeric).
- [ ] **Step 7.2:** `onMounted` / `watch` load `staffApi.getById(id)`; on error show message and optional redirect.
- [ ] **Step 7.3:** Display fields read-only (definition list or `Card` + rows). Button “Edit” → `router.push({ name: STAFF_ROUTE_NAMES.STAFF_EDIT, params: { id } })`.

**Commit:** `feat(staff): add StaffDetail view`

---

### Task 8: Staff create and edit (forms)

**Files:**

- Create: `src/modules/staff/views/StaffCreate.vue`
- Create: `src/modules/staff/views/StaffEdit.vue`
- Optional: `src/modules/staff/components/StaffFormFields.vue` if duplication is high

- [ ] **Step 8.1:** Use `<Form>` from VeeValidate + `staffFormSchema` (see `README.md` form conventions and existing form field components under `src/components/common/form/`).
- [ ] **Step 8.2:** `StaffCreate`: on submit call `staffApi.create`, then `router.push({ name: STAFF_ROUTE_NAMES.STAFF_DETAIL, params: { id: created.id } })`.
- [ ] **Step 8.3:** `StaffEdit`: load existing staff; initial values; on submit `staffApi.update`.
- [ ] **Step 8.4:** Date field: PrimeVue `DatePicker` with format from `PRIMEVUE_DATE_FORMAT` in `@/constants` if used project-wide.

**Reference:** @ `.cursor/rules/form-validation.mdc`, @ `.cursor/skills/vue-best-practices/SKILL.md`

**Commit:** `feat(staff): add StaffCreate and StaffEdit forms`

---

### Task 9: Navigation entry

**Files:**

- Modify: `src/components/layouts/AppHeader.vue`

- [ ] **Step 9.1:** Add a `RouterLink` (or PrimeVue `Button` + `router.push`) next to the title area: label from `staff.nav` or `menu.staff` i18n key; target `name: STAFF_ROUTE_NAMES.STAFF_LIST`.
- [ ] **Step 9.2:** Import `STAFF_ROUTE_NAMES` from `@/modules/staff/routes` or `@/modules/staff`.

**Verify:** From any authenticated page, user can open staff list in one click.

**Commit:** `feat(staff): add header link to staff list`

---

### Task 10: Final verification

- [ ] **Step 10.1:** Run `pnpm validate` from repo root.

**Expected:** exit code 0 (type-check, lint, format, stylelint per `package.json`).

**Commit (if only fixes):** `chore(staff): fix lint after staff module`

---

## Docs to read during implementation

- `docs/superpowers/specs/2026-03-24-staff-management-design.md` — scope and out-of-scope
- `README.md` — sections 5–11 (Vue, composables, forms, API)
- `docs/I18N.md` — if key naming questions arise
- `src/modules/admin/routes.ts` — routing template

---

## Execution handoff

Plan complete. Use **subagent-driven-development** or **executing-plans** to run tasks in order; do not skip Task 2 if you want regression safety on mock persistence.
