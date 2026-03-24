import type {
  DataTableFilterEvent,
  DataTableFilterMeta,
  DataTablePageEvent,
  DataTableSortEvent,
} from 'primevue/datatable'
import type { Ref } from 'vue'

// Column text alignment
export type AppColumnAlign = 'left' | 'center' | 'right'

// Action types available in the actions column
export type AppRowActionType = 'view' | 'edit' | 'delete'

// Loading display strategy for the table
export type AppTableLoadingMode = 'spinner' | 'skeleton'

// Column definition for AppDataTable
export interface AppColumnDef {
  field: string
  header: string
  sortable?: boolean
  filterable?: boolean
  filterMatchMode?: string
  width?: string
  minWidth?: string
  align?: AppColumnAlign
  frozen?: boolean
  alignFrozen?: 'left' | 'right'
  visible?: boolean
  exportable?: boolean
}

// Pagination state
export interface AppTablePagination {
  first: number
  rows: number
  totalRecords: number
  rowsPerPageOptions: number[]
}

// Sort state for single-column sorting
export interface AppTableSortState {
  sortField: string | null
  sortOrder: number
}

// Combined lazy parameters sent to the fetch function
export interface AppTableLazyParams {
  first: number
  rows: number
  sortField: string | null
  sortOrder: number
  filters: DataTableFilterMeta
}

// Action column configuration
export interface AppActionColumnConfig {
  view?: boolean
  edit?: boolean
  delete?: boolean
  width?: string
  header?: string
}

// Row action event payload
export interface AppRowActionEvent<T = unknown> {
  type: AppRowActionType
  data: T
}

// Configuration for the useDataTable composable
export interface UseDataTableConfig<T> {
  fetchFn: (params: AppTableLazyParams) => Promise<{ data: T[]; totalRecords: number }>
  dataKey: keyof T & string
  initialRows?: number
  rowsPerPageOptions?: number[]
  initialSortField?: keyof T & string
  initialSortOrder?: number
  initialFilters?: DataTableFilterMeta
  autoLoad?: boolean
}

// Return type of the useDataTable composable
export interface UseDataTableReturn<T> {
  data: Ref<T[]>
  loading: Ref<boolean>
  pagination: Ref<AppTablePagination>
  sortState: Ref<AppTableSortState>
  filters: Ref<DataTableFilterMeta>
  selectedItems: Ref<T[]>
  expandedRows: Ref<Record<string, boolean>>
  onPageChange: (event: DataTablePageEvent) => void
  onSortChange: (event: DataTableSortEvent) => void
  onFilterChange: (event: DataTableFilterEvent) => void
  onSelectionChange: (selection: T[]) => void
  onExpandedRowsChange: (rows: Record<string, boolean>) => void
  fetchData: () => Promise<void>
  refresh: () => Promise<void>
  resetFilters: () => Promise<void>
}
