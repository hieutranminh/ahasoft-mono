<template>
  <div class="app-data-table">
    <div v-if="showToolbar" class="app-data-table__toolbar">
      <div class="app-data-table__toolbar-start">
        <slot name="toolbar-start" />
      </div>
      <div class="app-data-table__toolbar-end">
        <MultiSelect
          v-if="columnToggle"
          v-model="visibleColumnFields"
          :options="toggleableColumns"
          option-label="header"
          option-value="field"
          :placeholder="$t('common.selectColumns')"
          display="chip"
          :max-selected-labels="3"
        />
        <slot name="toolbar-end" />
      </div>
    </div>

    <!-- Skeleton loading mode: renders Skeleton rows instead of a DataTable spinner -->
    <div v-if="showSkeleton" class="app-data-table__skeleton">
      <DataTable :value="skeletonPlaceholders">
        <Column
          v-for="col in displayedColumns"
          :key="col.field"
          :header="col.header"
          :style="columnStyle(col)"
        >
          <template #body>
            <Skeleton :width="col.width ?? '100%'" height="1.2rem" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Normal DataTable (hidden during skeleton mode) -->
    <DataTable
      v-show="!showSkeleton"
      :value="data"
      :data-key="dataKey"
      :loading="isSpinnerLoading"
      :lazy="lazy"
      :paginator="paginator"
      :first="pagination.first"
      :rows="pagination.rows"
      :total-records="pagination.totalRecords"
      :rows-per-page-options="pagination.rowsPerPageOptions"
      :sort-field="sortField ?? undefined"
      :sort-order="sortOrder"
      :removable-sort="removableSort"
      :filters="filters"
      :selection="selection"
      :selection-mode="selectionMode ?? undefined"
      :expanded-rows="expandedRows"
      :show-gridlines="showGridlines"
      :striped-rows="stripedRows"
      :scrollable="scrollable"
      :scroll-height="scrollHeight"
      :size="size"
      :table-style="tableStyle"
      :row-hover="rowHover"
      :current-page-report-template="currentPageReportTemplate"
      :paginator-template="paginatorTemplate"
      v-bind="$attrs"
      @page="onPage"
      @sort="onSort"
      @filter="onFilter"
      @update:selection="onSelectionUpdate"
      @update:expanded-rows="onExpandedRowsUpdate"
    >
      <template v-if="$slots.header" #header>
        <slot name="header" />
      </template>

      <template v-if="$slots.loadingicon" #loadingicon>
        <slot name="loadingicon" />
      </template>

      <slot name="column-group-header" />

      <Column
        v-if="selectionMode"
        :selection-mode="selectionMode === 'single' ? undefined : 'multiple'"
        header-style="width: 3rem"
      />

      <Column v-if="expandable" expander :style="EXPANDER_STYLE" />

      <Column
        v-for="col in displayedColumns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :sortable="col.sortable"
        :exportable="col.exportable"
        :style="columnStyle(col)"
        :frozen="col.frozen"
        :align-frozen="col.alignFrozen"
        :class="columnClass(col)"
      >
        <template v-if="hasBodySlot(col)" #body="slotProps">
          <slot :name="`body-${col.field}`" v-bind="slotProps" />
        </template>
        <template v-if="col.filterable" #filter="{ filterModel, filterCallback }">
          <slot
            :name="`filter-${col.field}`"
            :filter-model="filterModel"
            :filter-callback="filterCallback"
          >
            <InputText
              v-model="filterModel.value"
              type="text"
              :placeholder="`Search ${col.header}`"
              fluid
              @keydown.enter="filterCallback()"
            />
          </slot>
        </template>
      </Column>

      <Column
        v-if="actions"
        :header="actions.header ?? 'Actions'"
        :style="{ width: actions.width ?? '10rem' }"
        :exportable="false"
        frozen
        align-frozen="right"
      >
        <template #body="slotProps">
          <slot name="actions" v-bind="slotProps">
            <div class="app-data-table__actions">
              <Button
                v-if="actions!.view"
                v-tooltip.top="'View'"
                icon="pi pi-eye"
                severity="info"
                text
                rounded
                @click="emit('rowAction', { type: 'view', data: slotProps.data })"
              />
              <Button
                v-if="actions!.edit"
                v-tooltip.top="'Edit'"
                icon="pi pi-pencil"
                severity="warn"
                text
                rounded
                @click="emit('rowAction', { type: 'edit', data: slotProps.data })"
              />
              <Button
                v-if="actions!.delete"
                v-tooltip.top="'Delete'"
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                @click="emit('rowAction', { type: 'delete', data: slotProps.data })"
              />
            </div>
          </slot>
        </template>
      </Column>

      <template v-if="expandable" #expansion="slotProps">
        <slot name="expansion" v-bind="slotProps" />
      </template>

      <slot name="column-group-footer" />

      <template #empty>
        <slot name="empty">
          <AppEmpty :title="emptyTitle" :message="emptyMessage" />
        </slot>
      </template>

      <template v-if="$slots.footer" #footer>
        <slot name="footer" />
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
/**
 * Unified DataTable wrapper for the entire project.
 * Wraps PrimeVue DataTable with standardized features: lazy pagination, sorting,
 * filtering, column toggle, skeleton/spinner loading, selection, row expansion,
 * and configurable action buttons.
 *
 * Supports both server-side (lazy) and client-side pagination modes via the `lazy` prop.
 * Defaults to lazy mode; set `:lazy="false"` for client-side pagination.
 *
 * Pair with the `useDataTable` composable for state management and API integration.
 *
 * Slot conventions:
 *   - `body-{field}`   — custom cell renderer for a column (receives PrimeVue body slot props)
 *   - `filter-{field}` — custom filter input for a column (receives filterModel + filterCallback)
 *   - `column-group-header` / `column-group-footer` — ColumnGroup with Row/Column for
 *     grouped headers/footers (rowspan/colspan). When column-group-header is used,
 *     PrimeVue ignores individual column :header props in favor of the group structure.
 *
 * Any unrecognized props/attrs are forwarded to the inner PrimeVue DataTable via v-bind="$attrs"
 * (e.g. filterDisplay, rowClass, rowStyle, reorderableColumns, etc.).
 */
import { computed, ref, watch } from 'vue'

import type {
  DataTableFilterEvent,
  DataTableFilterMeta,
  DataTablePageEvent,
  DataTableSortEvent,
} from 'primevue/datatable'

import type {
  AppActionColumnConfig,
  AppColumnDef,
  AppRowActionEvent,
  AppTableLoadingMode,
  AppTablePagination,
} from '@/types/dataTable'

// Attrs go to the inner DataTable (not root div) so consumers can pass any PrimeVue DataTable prop
defineOptions({ inheritAttrs: false })

const EXPANDER_STYLE = { width: '3rem' }

interface Props {
  data: unknown[]
  columns: AppColumnDef[]
  dataKey: string
  loading?: boolean
  loadingMode?: AppTableLoadingMode
  skeletonRows?: number
  lazy?: boolean
  paginator?: boolean
  pagination: AppTablePagination
  sortField?: string | null
  sortOrder?: number
  removableSort?: boolean
  filters?: DataTableFilterMeta
  selection?: unknown[]
  selectionMode?: 'single' | 'multiple' | null
  expandedRows?: Record<string, boolean>
  expandable?: boolean
  actions?: AppActionColumnConfig | null
  columnToggle?: boolean
  showGridlines?: boolean
  stripedRows?: boolean
  scrollable?: boolean
  scrollHeight?: string
  size?: 'small' | 'large'
  tableStyle?: string | object
  rowHover?: boolean
  emptyTitle?: string
  emptyMessage?: string
  showToolbar?: boolean
  currentPageReportTemplate?: string
  paginatorTemplate?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loadingMode: 'spinner',
  skeletonRows: 5,
  lazy: true,
  paginator: true,
  sortField: null,
  sortOrder: 1,
  removableSort: true,
  filters: undefined,
  selection: undefined,
  selectionMode: null,
  expandedRows: undefined,
  expandable: false,
  actions: null,
  columnToggle: false,
  showGridlines: false,
  stripedRows: true,
  scrollable: false,
  scrollHeight: undefined,
  size: undefined,
  tableStyle: undefined,
  rowHover: true,
  emptyTitle: 'No data',
  emptyMessage: 'There is no data to display',
  showToolbar: false,
  currentPageReportTemplate: 'Showing {first} to {last} of {totalRecords} entries',
  paginatorTemplate:
    'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport',
})

const emit = defineEmits<{
  (event: 'page', payload: DataTablePageEvent): void
  (event: 'sort', payload: DataTableSortEvent): void
  (event: 'filter', payload: DataTableFilterEvent): void
  (event: 'update:selection', payload: unknown[]): void
  (event: 'update:expandedRows', payload: Record<string, boolean>): void
  (event: 'rowAction', payload: AppRowActionEvent): void
}>()

const slots = defineSlots<{
  'toolbar-start'?: () => unknown
  'toolbar-end'?: () => unknown
  header?: () => unknown
  footer?: () => unknown
  empty?: () => unknown
  loadingicon?: () => unknown
  'column-group-header'?: () => unknown
  'column-group-footer'?: () => unknown
  expansion?: (props: Record<string, unknown>) => unknown
  actions?: (props: Record<string, unknown>) => unknown
  [key: `body-${string}`]: (props: Record<string, unknown>) => unknown
  [key: `filter-${string}`]: (props: Record<string, unknown>) => unknown
}>()

// Skeleton mode: show skeleton table when loading + loadingMode is 'skeleton'
const showSkeleton = computed((): boolean => {
  return props.loading && props.loadingMode === 'skeleton'
})

// Spinner mode: use PrimeVue's built-in loading overlay
const isSpinnerLoading = computed((): boolean => {
  return props.loading && props.loadingMode === 'spinner'
})

const skeletonPlaceholders = computed((): Record<string, unknown>[] => {
  return Array.from({ length: props.skeletonRows }, (_, i) => ({ _skeletonId: i }))
})

// Column toggle state: tracks which columns the user has toggled on/off.
// Syncs with props.columns changes (e.g. when parent provides a new column set).
const visibleColumnFields = ref<string[]>([])

watch(
  () => props.columns,
  (newColumns) => {
    visibleColumnFields.value = newColumns
      .filter((col) => col.visible !== false)
      .map((col) => col.field)
  },
  { immediate: true },
)

const toggleableColumns = computed((): AppColumnDef[] => {
  return props.columns.filter((col) => !col.frozen)
})

const displayedColumns = computed((): AppColumnDef[] => {
  if (!props.columnToggle) {
    return props.columns.filter((col) => col.visible !== false)
  }
  return props.columns.filter((col) => col.frozen ?? visibleColumnFields.value.includes(col.field))
})

function columnStyle(col: AppColumnDef): Record<string, string> {
  const style: Record<string, string> = {}
  if (col.width) style.width = col.width
  if (col.minWidth) style.minWidth = col.minWidth
  return style
}

function columnClass(col: AppColumnDef): Record<string, boolean> {
  return {
    'text-center': col.align === 'center',
    'text-right': col.align === 'right',
  }
}

// Cast needed because defineSlots dynamic keys (`body-${string}`) aren't indexable at runtime
function hasBodySlot(col: AppColumnDef): boolean {
  const slotName = `body-${col.field}`
  return slotName in (slots as Record<string, unknown>)
}

// Event forwarding — kept as named functions for debuggability and future logging/middleware
function onPage(event: DataTablePageEvent): void {
  emit('page', event)
}

function onSort(event: DataTableSortEvent): void {
  emit('sort', event)
}

function onFilter(event: DataTableFilterEvent): void {
  emit('filter', event)
}

function onSelectionUpdate(value: unknown): void {
  emit('update:selection', value as unknown[])
}

function onExpandedRowsUpdate(value: unknown): void {
  emit('update:expandedRows', value as Record<string, boolean>)
}
</script>

<style scoped lang="scss">
.app-data-table {
  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  &__toolbar-start {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__toolbar-end {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
}
</style>
