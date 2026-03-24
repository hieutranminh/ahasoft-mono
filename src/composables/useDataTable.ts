import { onMounted, type Ref, ref } from 'vue'

import type {
  DataTableFilterEvent,
  DataTableFilterMeta,
  DataTablePageEvent,
  DataTableSortEvent,
} from 'primevue/datatable'

import type {
  AppTableLazyParams,
  AppTablePagination,
  AppTableSortState,
  UseDataTableConfig,
  UseDataTableReturn,
} from '@/types/dataTable'

const DEFAULTS = {
  ROWS: 10,
  ROWS_PER_PAGE_OPTIONS: [10, 25, 50],
  SORT_ORDER: 1,
} as const

/**
 * Composable for managing DataTable state in lazy/server-side mode.
 * Handles pagination, sorting, filtering, selection, and expansion state.
 * Provides handlers that map PrimeVue DataTable events to API fetch calls.
 *
 * Error handling is NOT included — API errors should be caught by the caller
 * and displayed via showErrorDialog or similar global error handling.
 */
export function useDataTable<T>(config: UseDataTableConfig<T>): UseDataTableReturn<T> {
  const {
    fetchFn,
    initialRows,
    rowsPerPageOptions,
    initialSortField,
    initialSortOrder,
    initialFilters,
    autoLoad,
  } = config

  const resolvedRows = initialRows ?? DEFAULTS.ROWS
  const resolvedRowsPerPageOptions: number[] = rowsPerPageOptions ?? [
    ...DEFAULTS.ROWS_PER_PAGE_OPTIONS,
  ]
  const resolvedAutoLoad = autoLoad ?? true

  const data = ref<T[]>([]) as Ref<T[]>
  const loading = ref<boolean>(false)

  const pagination = ref<AppTablePagination>({
    first: 0,
    rows: resolvedRows,
    totalRecords: 0,
    rowsPerPageOptions: resolvedRowsPerPageOptions,
  })

  const sortState = ref<AppTableSortState>({
    sortField: (initialSortField as string) ?? null,
    sortOrder: initialSortOrder ?? DEFAULTS.SORT_ORDER,
  })

  const filters = ref<DataTableFilterMeta>(initialFilters ?? {})

  const selectedItems = ref<T[]>([]) as Ref<T[]>
  const expandedRows = ref<Record<string, boolean>>({})

  function buildLazyParams(): AppTableLazyParams {
    return {
      first: pagination.value.first,
      rows: pagination.value.rows,
      sortField: sortState.value.sortField,
      sortOrder: sortState.value.sortOrder,
      filters: filters.value,
    }
  }

  async function fetchData(): Promise<void> {
    loading.value = true

    try {
      const params = buildLazyParams()
      const result = await fetchFn(params)
      data.value = result.data
      pagination.value.totalRecords = result.totalRecords
    } finally {
      loading.value = false
    }
  }

  function onPageChange(event: DataTablePageEvent): void {
    pagination.value.first = event.first
    pagination.value.rows = event.rows
    void fetchData()
  }

  function onSortChange(event: DataTableSortEvent): void {
    const field = (event.sortField as string | undefined) ?? null
    sortState.value.sortField = field
    sortState.value.sortOrder = field ? (event.sortOrder ?? DEFAULTS.SORT_ORDER) : 0
    pagination.value.first = 0
    void fetchData()
  }

  function onFilterChange(event: DataTableFilterEvent): void {
    filters.value = event.filters
    pagination.value.first = 0
    void fetchData()
  }

  function onSelectionChange(selection: T[]): void {
    selectedItems.value = selection
  }

  function onExpandedRowsChange(rows: Record<string, boolean>): void {
    expandedRows.value = rows
  }

  async function refresh(): Promise<void> {
    await fetchData()
  }

  async function resetFilters(): Promise<void> {
    filters.value = initialFilters ?? {}
    pagination.value.first = 0
    await fetchData()
  }

  if (resolvedAutoLoad) {
    onMounted(() => {
      void fetchData()
    })
  }

  return {
    data,
    loading,
    pagination,
    sortState,
    filters,
    selectedItems,
    expandedRows,
    onPageChange,
    onSortChange,
    onFilterChange,
    onSelectionChange,
    onExpandedRowsChange,
    fetchData,
    refresh,
    resetFilters,
  }
}
