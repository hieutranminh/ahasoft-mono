<template>
  <div class="datatable-examples">
    <!-- Section 1: Basic Table with Pagination & Sorting -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-table" />
        Basic Table (Lazy Pagination &amp; Sorting)
      </h3>
      <p class="section-description">
        Server-side pagination and sorting using <code>useDataTable</code> composable with
        <code>AppDataTable</code> component.
      </p>
      <AppDataTable
        :data="basic.data.value"
        :columns="basicColumns"
        data-key="id"
        :loading="basic.loading.value"
        :pagination="basic.pagination.value"
        :sort-field="basic.sortState.value.sortField"
        :sort-order="basic.sortState.value.sortOrder"
        striped-rows
        @page="basic.onPageChange"
        @sort="basic.onSortChange"
      />
      <div class="code-block">
        <pre><code>&lt;AppDataTable
  :data="table.data.value"
  :columns="columns"
  data-key="id"
  :loading="table.loading.value"
  :pagination="table.pagination.value"
  :sort-field="table.sortState.value.sortField"
  :sort-order="table.sortState.value.sortOrder"
  @page="table.onPageChange"
  @sort="table.onSortChange"
/&gt;

// In script setup:
const table = useDataTable&lt;Product&gt;({
  fetchFn: fetchProducts,
  dataKey: 'id',
  initialRows: 5,
  initialSortField: 'name',
})</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Section 2: Filterable Table -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-filter" />
        Filterable Table
      </h3>
      <p class="section-description">
        Server-side filtering with column-specific filter inputs. Filters are sent as lazy params to
        the fetch function.
      </p>
      <AppDataTable
        :data="filterable.data.value"
        :columns="filterableColumns"
        data-key="id"
        :loading="filterable.loading.value"
        :pagination="filterable.pagination.value"
        :sort-field="filterable.sortState.value.sortField"
        :sort-order="filterable.sortState.value.sortOrder"
        :filters="filterable.filters.value"
        filter-display="row"
        show-toolbar
        @page="filterable.onPageChange"
        @sort="filterable.onSortChange"
        @filter="filterable.onFilterChange"
      >
        <template #toolbar-start>
          <Button
            label="Clear Filters"
            icon="pi pi-filter-slash"
            severity="secondary"
            text
            @click="filterable.resetFilters()"
          />
        </template>
      </AppDataTable>
      <div class="code-block">
        <pre><code>&lt;AppDataTable
  :filters="table.filters.value"
  filter-display="row"
  show-toolbar
  @filter="table.onFilterChange"
&gt;
  &lt;template #toolbar-start&gt;
    &lt;Button label="Clear Filters" @click="table.resetFilters()" /&gt;
  &lt;/template&gt;
&lt;/AppDataTable&gt;</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Section 3: Selectable Table -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-check-square" />
        Selectable Table (Multi-select)
      </h3>
      <p class="section-description">Multi-row selection with checkbox column.</p>
      <AppDataTable
        :data="selectable.data.value"
        :columns="basicColumns"
        data-key="id"
        :loading="selectable.loading.value"
        :pagination="selectable.pagination.value"
        :sort-field="selectable.sortState.value.sortField"
        :sort-order="selectable.sortState.value.sortOrder"
        :selection="selectable.selectedItems.value"
        selection-mode="multiple"
        @page="selectable.onPageChange"
        @sort="selectable.onSortChange"
        @update:selection="selectable.onSelectionChange"
      />
      <div v-if="selectable.selectedItems.value.length > 0" class="result-box">
        <Tag severity="info"> {{ selectable.selectedItems.value.length }} row(s) selected </Tag>
        <span class="result-detail">
          {{ selectable.selectedItems.value.map((item) => item.name).join(', ') }}
        </span>
      </div>
      <div class="code-block">
        <pre><code>&lt;AppDataTable
  :selection="table.selectedItems.value"
  selection-mode="multiple"
  @update:selection="table.onSelectionChange"
/&gt;</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Section 4: Expandable Rows -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-angle-down" />
        Expandable Rows
      </h3>
      <p class="section-description">
        Click the arrow to expand a row and show detailed information.
      </p>
      <AppDataTable
        :data="expandable.data.value"
        :columns="basicColumns"
        data-key="id"
        :loading="expandable.loading.value"
        :pagination="expandable.pagination.value"
        :sort-field="expandable.sortState.value.sortField"
        :sort-order="expandable.sortState.value.sortOrder"
        :expanded-rows="expandable.expandedRows.value"
        expandable
        @page="expandable.onPageChange"
        @sort="expandable.onSortChange"
        @update:expanded-rows="expandable.onExpandedRowsChange"
      >
        <template #expansion="{ data: rowData }">
          <div class="expansion-content">
            <h4>Details for {{ (rowData as MockProduct).name }}</h4>
            <div class="expansion-grid">
              <div><strong>ID:</strong> {{ (rowData as MockProduct).id }}</div>
              <div><strong>Category:</strong> {{ (rowData as MockProduct).category }}</div>
              <div><strong>Price:</strong> {{ formatPrice((rowData as MockProduct).price) }}</div>
              <div><strong>Stock:</strong> {{ (rowData as MockProduct).stock }} units</div>
              <div><strong>Rating:</strong> {{ (rowData as MockProduct).rating }}/5</div>
              <div><strong>Status:</strong> {{ (rowData as MockProduct).status }}</div>
            </div>
          </div>
        </template>
      </AppDataTable>
      <div class="code-block">
        <pre><code>&lt;AppDataTable expandable
  :expanded-rows="table.expandedRows.value"
  @update:expanded-rows="table.onExpandedRowsChange"
&gt;
  &lt;template #expansion="{ data: rowData }"&gt;
    &lt;div&gt;Detail content here&lt;/div&gt;
  &lt;/template&gt;
&lt;/AppDataTable&gt;</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Section 5: Actions Column -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-cog" />
        Actions Column
      </h3>
      <p class="section-description">
        Built-in action buttons (view, edit, delete) with configurable visibility.
      </p>
      <AppDataTable
        :data="actions.data.value"
        :columns="basicColumns"
        data-key="id"
        :loading="actions.loading.value"
        :pagination="actions.pagination.value"
        :sort-field="actions.sortState.value.sortField"
        :sort-order="actions.sortState.value.sortOrder"
        :actions="{ view: true, edit: true, delete: true, width: '10rem' }"
        @page="actions.onPageChange"
        @sort="actions.onSortChange"
        @row-action="onRowAction"
      />
      <div v-if="lastAction" class="result-box">
        <Tag severity="secondary">Last action</Tag>
        <span class="result-detail">{{ lastAction }}</span>
      </div>
      <div class="code-block">
        <pre><code>&lt;AppDataTable
  :actions="{ view: true, edit: true, delete: true }"
  @row-action="onRowAction"
/&gt;

function onRowAction(event: AppRowActionEvent) {
  // event.type: 'view' | 'edit' | 'delete'
  // event.data: row data object
}</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Section 6: Column Toggle -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-eye" />
        Column Toggle
      </h3>
      <p class="section-description">Show/hide columns dynamically via the toolbar MultiSelect.</p>
      <AppDataTable
        :data="columnToggle.data.value"
        :columns="allColumns"
        data-key="id"
        :loading="columnToggle.loading.value"
        :pagination="columnToggle.pagination.value"
        :sort-field="columnToggle.sortState.value.sortField"
        :sort-order="columnToggle.sortState.value.sortOrder"
        column-toggle
        show-toolbar
        @page="columnToggle.onPageChange"
        @sort="columnToggle.onSortChange"
      />
      <div class="code-block">
        <pre><code>&lt;AppDataTable
  :columns="allColumns"
  column-toggle
  show-toolbar
/&gt;</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Section 7: Custom Body Templates & Visual Variants -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-palette" />
        Custom Body Templates &amp; Visual Variants
      </h3>
      <p class="section-description">
        Custom cell rendering with body slots, plus grid lines and size options.
      </p>
      <div class="controls-row">
        <SelectButton
          v-model="tableSize"
          :options="sizeOptions"
          option-label="label"
          option-value="value"
        />
        <ToggleSwitch v-model="showGrid" />
        <span>Grid lines</span>
      </div>
      <AppDataTable
        :data="variants.data.value"
        :columns="variantColumns"
        data-key="id"
        :loading="variants.loading.value"
        :pagination="variants.pagination.value"
        :sort-field="variants.sortState.value.sortField"
        :sort-order="variants.sortState.value.sortOrder"
        :show-gridlines="showGrid"
        :size="tableSize"
        @page="variants.onPageChange"
        @sort="variants.onSortChange"
      >
        <template #body-price="{ data: rowData }">
          <span class="font-semibold text-green-600">
            {{ formatPrice((rowData as MockProduct).price) }}
          </span>
        </template>
        <template #body-status="{ data: rowData }">
          <Tag
            :value="(rowData as MockProduct).status"
            :severity="statusSeverity((rowData as MockProduct).status)"
          />
        </template>
        <template #body-rating="{ data: rowData }">
          <Rating :model-value="(rowData as MockProduct).rating" readonly :cancel="false" />
        </template>
      </AppDataTable>
      <div class="code-block">
        <pre><code>&lt;AppDataTable :show-gridlines="true" size="small"&gt;
  &lt;template #body-price="{ data: rowData }"&gt;
    &lt;span class="text-green-600"&gt;formatted price&lt;/span&gt;
  &lt;/template&gt;
  &lt;template #body-status="{ data: rowData }"&gt;
    &lt;Tag :value="rowData.status" :severity="getSeverity(rowData.status)" /&gt;
  &lt;/template&gt;
&lt;/AppDataTable&gt;</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Section 8: Loading Modes -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-spin pi-spinner" />
        Loading Modes
      </h3>
      <p class="section-description">
        Two loading strategies: default spinner overlay or skeleton rows for initial page loads.
      </p>
      <div class="controls-row">
        <SelectButton
          v-model="loadingDemo"
          :options="loadingDemoOptions"
          option-label="label"
          option-value="value"
        />
      </div>
      <AppDataTable
        :data="loadingDemo === 'none' ? loadingDemoData.data.value : []"
        :columns="basicColumns"
        data-key="id"
        :loading="loadingDemo !== 'none'"
        :loading-mode="loadingDemo === 'skeleton' ? 'skeleton' : 'spinner'"
        :skeleton-rows="5"
        :pagination="loadingDemoData.pagination.value"
        :sort-field="loadingDemoData.sortState.value.sortField"
        :sort-order="loadingDemoData.sortState.value.sortOrder"
        @page="loadingDemoData.onPageChange"
        @sort="loadingDemoData.onSortChange"
      >
        <template v-if="loadingDemo === 'custom-icon'" #loadingicon>
          <i class="pi pi-spin pi-cog" />
        </template>
      </AppDataTable>
      <div class="code-block">
        <pre><code>&lt;!-- Default spinner overlay --&gt;
&lt;AppDataTable :loading="true" /&gt;

&lt;!-- Skeleton rows (great for initial page load) --&gt;
&lt;AppDataTable :loading="true" loading-mode="skeleton" :skeleton-rows="5" /&gt;

&lt;!-- Custom loading icon --&gt;
&lt;AppDataTable :loading="true"&gt;
  &lt;template #loadingicon&gt;
    &lt;i class="pi pi-spin pi-cog" /&gt;
  &lt;/template&gt;
&lt;/AppDataTable&gt;</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Section 9: Empty State -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-inbox" />
        Empty State
      </h3>
      <p class="section-description">Custom empty title and message when the table has no data.</p>
      <AppDataTable
        :data="[]"
        :columns="basicColumns"
        data-key="id"
        :pagination="emptyPagination"
        empty-title="No products found"
        empty-message="Try adjusting your filters or check back later"
      />
      <div class="code-block">
        <pre><code>&lt;AppDataTable
  :data="[]"
  empty-title="No products found"
  empty-message="Try adjusting your filters"
/&gt;</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Section 10: Custom Styling (PT / rowClass / rowStyle) -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-sliders-h" />
        Custom Styling (PT / rowClass / rowStyle)
      </h3>
      <p class="section-description">
        Customize header, body, and cell colors using PrimeVue Pass Through (<code>pt</code>),
        <code>rowClass</code>, and <code>rowStyle</code>. All pass through
        <code>v-bind="$attrs"</code>.
      </p>
      <AppDataTable
        :data="styling.data.value"
        :columns="basicColumns"
        data-key="id"
        :loading="styling.loading.value"
        :pagination="styling.pagination.value"
        :sort-field="styling.sortState.value.sortField"
        :sort-order="styling.sortState.value.sortOrder"
        :pt="tablePt"
        :row-class="rowClassFn"
        @page="styling.onPageChange"
        @sort="styling.onSortChange"
      />
      <div class="code-block">
        <pre><code>&lt;!-- Pass Through: customize header cell and body cell background --&gt;
&lt;AppDataTable
  :pt="{
    column: {
      headerCell: { style: { background: '#1e3a5f', color: '#fff' } },
      bodyCell: { style: { background: '#f8fafc' } },
    },
  }"
  :row-class="(data) =&gt; ({
    'row-low-stock': data.stock &lt; 20,
    'row-out-of-stock': data.status === 'Out of Stock',
  })"
/&gt;

&lt;!-- You can also use :row-style for inline styles per row --&gt;
&lt;AppDataTable
  :row-style="(data) =&gt; ({
    fontWeight: data.status === 'Out of Stock' ? 'bold' : 'normal',
  })"
/&gt;</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Section 11: Column Group (Rowspan / Colspan) -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-th-large" />
        Column Group (Rowspan / Colspan)
      </h3>
      <p class="section-description">
        Use <code>ColumnGroup</code>, <code>Row</code>, and <code>Column</code> with
        <code>colspan</code>/<code>rowspan</code> for grouped headers/footers via
        <code>column-group-header</code> and <code>column-group-footer</code> slots.
      </p>
      <AppDataTable
        :data="colGroupData"
        :columns="colGroupColumns"
        data-key="product"
        :pagination="colGroupPagination"
        :paginator="false"
        show-gridlines
      >
        <template #column-group-header>
          <ColumnGroup type="header">
            <Row>
              <Column header="Product" :rowspan="2" />
              <Column header="Sale Details" :colspan="2" />
              <Column header="Finance" :colspan="2" />
            </Row>
            <Row>
              <Column header="Last Sale" sortable field="lastSale" />
              <Column header="Quantity" sortable field="quantity" />
              <Column header="Revenue" sortable field="revenue" />
              <Column header="Profit" sortable field="profit" />
            </Row>
          </ColumnGroup>
        </template>
        <template #body-revenue="{ data: row }">
          {{ formatPrice(row.revenue) }}
        </template>
        <template #body-profit="{ data: row }">
          {{ formatPrice(row.profit) }}
        </template>
        <template #column-group-footer>
          <ColumnGroup type="footer">
            <Row>
              <Column
                footer="Totals:"
                :colspan="2"
                footer-style="text-align:right;font-weight:bold"
              />
              <Column :footer="String(colGroupTotals.quantity)" />
              <Column :footer="formatPrice(colGroupTotals.revenue)" />
              <Column :footer="formatPrice(colGroupTotals.profit)" />
            </Row>
          </ColumnGroup>
        </template>
      </AppDataTable>
      <div class="code-block">
        <pre><code>&lt;AppDataTable
  :data="data"
  :columns="columns"
  data-key="product"
  :pagination="pagination"
  :paginator="false"
  show-gridlines
&gt;
  &lt;template #column-group-header&gt;
    &lt;ColumnGroup type="header"&gt;
      &lt;Row&gt;
        &lt;Column header="Product" :rowspan="2" /&gt;
        &lt;Column header="Sale Details" :colspan="2" /&gt;
        &lt;Column header="Finance" :colspan="2" /&gt;
      &lt;/Row&gt;
      &lt;Row&gt;
        &lt;Column header="Last Sale" field="lastSale" /&gt;
        &lt;Column header="Quantity" field="quantity" /&gt;
        &lt;Column header="Revenue" field="revenue" /&gt;
        &lt;Column header="Profit" field="profit" /&gt;
      &lt;/Row&gt;
    &lt;/ColumnGroup&gt;
  &lt;/template&gt;
  &lt;template #body-revenue="{ data: row }"&gt;
    &#123;&#123; formatPrice(row.revenue) &#125;&#125;
  &lt;/template&gt;
  &lt;template #body-profit="{ data: row }"&gt;
    &#123;&#123; formatPrice(row.profit) &#125;&#125;
  &lt;/template&gt;
  &lt;template #column-group-footer&gt;
    &lt;ColumnGroup type="footer"&gt;
      &lt;Row&gt;
        &lt;Column footer="Totals:" :colspan="2" /&gt;
        &lt;Column :footer="totals.quantity" /&gt;
        &lt;Column :footer="totals.revenue" /&gt;
        &lt;Column :footer="totals.profit" /&gt;
      &lt;/Row&gt;
    &lt;/ColumnGroup&gt;
  &lt;/template&gt;
&lt;/AppDataTable&gt;</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Section 12: Frozen Columns with Horizontal Scroll -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-arrows-h" />
        Frozen Columns with Horizontal Scroll
      </h3>
      <p class="section-description">
        When there are many columns, enable <code>scrollable</code> with a fixed
        <code>table-style</code> width. Use <code>frozen</code> and <code>alignFrozen</code> in
        column definitions to pin columns.
      </p>
      <AppDataTable
        :data="frozenScroll.data.value"
        :columns="frozenScrollColumns"
        data-key="id"
        :loading="frozenScroll.loading.value"
        :pagination="frozenScroll.pagination.value"
        :sort-field="frozenScroll.sortState.value.sortField"
        :sort-order="frozenScroll.sortState.value.sortOrder"
        scrollable
        :table-style="{ minWidth: '80rem' }"
        :actions="{ view: true, edit: true, delete: true, width: '10rem' }"
        @page="frozenScroll.onPageChange"
        @sort="frozenScroll.onSortChange"
      />
      <div class="code-block">
        <pre><code>const columns: AppColumnDef[] = [
  { field: 'id', header: 'ID', frozen: true, width: '5rem' },
  { field: 'name', header: 'Name', frozen: true, minWidth: '14rem' },
  { field: 'col1', header: 'Column 1', minWidth: '12rem' },
  // ... many columns ...
  { field: 'total', header: 'Total', frozen: true, alignFrozen: 'right' },
]

&lt;AppDataTable
  :columns="columns"
  scrollable
  :table-style="{ minWidth: '80rem' }"
/&gt;</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Section 13: Expandable Row Groups -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-users" />
        Expandable Row Groups
      </h3>
      <p class="section-description">
        When <code>expandableRowGroups</code> is present in subheader based row grouping, groups can
        be expanded and collapsed. State of the expansions are controlled using the
        <code>expandedRowGroups</code> property and <code>rowgroup-expand</code> /
        <code>rowgroup-collapse</code> events.
      </p>
      <DataTable
        :value="rowGroupData"
        row-group-mode="subheader"
        group-rows-by="representative"
        expandable-row-groups
        :expanded-row-groups="expandedGroups"
        sort-mode="single"
        sort-field="representative"
        :sort-order="1"
        scrollable
        scroll-height="450px"
        table-style="min-width: 50rem"
        @rowgroup-expand="onGroupExpand"
        @rowgroup-collapse="onGroupCollapse"
        @update:expanded-row-groups="onExpandedGroupsChange"
      >
        <Column field="representative" header="Name" style="width: 25%">
          <template #body="slotProps">
            {{ slotProps.data.name }}
          </template>
        </Column>
        <Column field="country" header="Country" style="width: 20%" />
        <Column field="company" header="Company" style="width: 25%" />
        <Column field="status" header="Status" style="width: 15%">
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.status"
              :severity="customerStatusSeverity(slotProps.data.status)"
            />
          </template>
        </Column>
        <Column field="date" header="Date" style="width: 15%" />
        <template #groupheader="slotProps">
          <div class="group-header-content">
            <Avatar
              label="U"
              class="mr-2"
              style="background-color: #dee9fc; color: #1a2551"
              shape="circle"
            />
            <span class="group-header-name">{{ slotProps.data.representative }}</span>
          </div>
        </template>
        <template #groupfooter="slotProps">
          <div class="group-footer-content">
            <strong
              >Total Customers: {{ calculateGroupTotal(slotProps.data.representative) }}</strong
            >
          </div>
        </template>
      </DataTable>
      <div class="code-block">
        <pre><code>&lt;DataTable
  :value="data"
  row-group-mode="subheader"
  group-rows-by="representative"
  expandable-row-groups
  :expanded-row-groups="expandedGroups"
  sort-mode="single"
  sort-field="representative"
  :sort-order="1"
  @rowgroup-expand="onGroupExpand"
  @rowgroup-collapse="onGroupCollapse"
  @update:expanded-row-groups="onExpandedGroupsChange"
&gt;
  &lt;Column field="representative" header="Name" /&gt;
  &lt;Column field="country" header="Country" /&gt;
  &lt;Column field="company" header="Company" /&gt;
  &lt;Column field="status" header="Status" /&gt;
  &lt;Column field="date" header="Date" /&gt;

  &lt;template #groupheader="slotProps"&gt;
    &lt;span&gt;&#123;&#123; slotProps.data.representative &#125;&#125;&lt;/span&gt;
  &lt;/template&gt;
  &lt;template #groupfooter="slotProps"&gt;
    &lt;strong&gt;Total: &#123;&#123; getGroupCount(slotProps.data.representative) &#125;&#125;&lt;/strong&gt;
  &lt;/template&gt;
&lt;/DataTable&gt;</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataTable } from '@/composables/useDataTable'
import type {
  AppColumnDef,
  AppTableLazyParams,
  AppTablePagination,
  AppRowActionEvent,
} from '@/types/dataTable'

// --- Mock Data ---

interface MockProduct {
  id: number
  name: string
  category: string
  price: number
  stock: number
  status: string
  rating: number
}

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Food', 'Toys']
const STATUSES = ['In Stock', 'Low Stock', 'Out of Stock']
const PRODUCT_NAMES = [
  'Wireless Mouse',
  'USB Keyboard',
  'Monitor Stand',
  'Desk Lamp',
  'Notebook',
  'Pen Set',
  'Headphones',
  'Webcam',
  'Power Bank',
  'Phone Case',
  'Tablet Cover',
  'Charger Cable',
  'Mouse Pad',
  'Screen Protector',
  'Earbuds',
  'Smart Watch',
  'Bluetooth Speaker',
  'External SSD',
  'Microphone',
  'Ring Light',
  'Laptop Bag',
  'Mechanical Keyboard',
  'Gaming Mouse',
  'Desk Organizer',
  'Cable Hub',
  'Portable Fan',
  'LED Strip',
  'Mini Projector',
  'Drawing Tablet',
  'Router',
]

function generateMockProducts(count: number): MockProduct[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: PRODUCT_NAMES[i % PRODUCT_NAMES.length],
    category: CATEGORIES[i % CATEGORIES.length],
    price: Math.round((Math.random() * 200 + 10) * 100) / 100,
    stock: Math.floor(Math.random() * 100),
    status: STATUSES[i % STATUSES.length],
    rating: Math.floor(Math.random() * 5) + 1,
  }))
}

const ALL_PRODUCTS = generateMockProducts(87)

function mockFetch(
  params: AppTableLazyParams,
): Promise<{ data: MockProduct[]; totalRecords: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...ALL_PRODUCTS]

      if (params.filters) {
        Object.entries(params.filters).forEach(([field, meta]) => {
          if (typeof meta === 'object' && 'value' in meta && meta.value) {
            filtered = filtered.filter((item) => {
              const val = String(item[field as keyof MockProduct] ?? '').toLowerCase()
              return val.includes(String(meta.value).toLowerCase())
            })
          }
        })
      }

      if (params.sortField) {
        const field = params.sortField as keyof MockProduct
        const order = params.sortOrder
        filtered.sort((a, b) => {
          const aVal = a[field]
          const bVal = b[field]
          if (aVal < bVal) return -1 * order
          if (aVal > bVal) return 1 * order
          return 0
        })
      }

      const totalRecords = filtered.length
      const paged = filtered.slice(params.first, params.first + params.rows)

      resolve({ data: paged, totalRecords })
    }, 400)
  })
}

function formatPrice(value: number): string {
  return '$' + value.toFixed(2)
}

// --- Column Definitions ---

const basicColumns: AppColumnDef[] = [
  { field: 'id', header: 'ID', sortable: true, width: '5rem', align: 'center' },
  { field: 'name', header: 'Name', sortable: true, minWidth: '12rem' },
  { field: 'category', header: 'Category', sortable: true },
  { field: 'price', header: 'Price', sortable: true, align: 'right' },
  { field: 'stock', header: 'Stock', sortable: true, align: 'center' },
]

const filterableColumns: AppColumnDef[] = [
  { field: 'id', header: 'ID', sortable: true, width: '5rem', align: 'center' },
  { field: 'name', header: 'Name', sortable: true, filterable: true, minWidth: '12rem' },
  { field: 'category', header: 'Category', sortable: true, filterable: true },
  { field: 'price', header: 'Price', sortable: true, align: 'right' },
  { field: 'stock', header: 'Stock', sortable: true, align: 'center' },
]

const allColumns: AppColumnDef[] = [
  { field: 'id', header: 'ID', sortable: true, width: '5rem', align: 'center', frozen: true },
  { field: 'name', header: 'Name', sortable: true, minWidth: '12rem' },
  { field: 'category', header: 'Category', sortable: true },
  { field: 'price', header: 'Price', sortable: true, align: 'right' },
  { field: 'stock', header: 'Stock', sortable: true, align: 'center' },
  { field: 'status', header: 'Status', sortable: true },
  { field: 'rating', header: 'Rating', sortable: true, align: 'center' },
]

const variantColumns: AppColumnDef[] = [
  { field: 'id', header: 'ID', sortable: true, width: '5rem', align: 'center' },
  { field: 'name', header: 'Name', sortable: true },
  { field: 'category', header: 'Category', sortable: true },
  { field: 'price', header: 'Price', sortable: true, align: 'right' },
  { field: 'status', header: 'Status', sortable: true },
  { field: 'rating', header: 'Rating', sortable: true, align: 'center' },
]

// --- Table Instances ---

const TABLE_CONFIG = { dataKey: 'id' as const, initialRows: 5, rowsPerPageOptions: [5, 10] }

const basic = useDataTable<MockProduct>({
  fetchFn: mockFetch,
  ...TABLE_CONFIG,
  rowsPerPageOptions: [5, 10, 25],
  initialSortField: 'name',
})

const filterable = useDataTable<MockProduct>({
  fetchFn: mockFetch,
  ...TABLE_CONFIG,
  rowsPerPageOptions: [5, 10, 25],
  initialFilters: {
    name: { value: '', matchMode: 'contains' },
    category: { value: '', matchMode: 'contains' },
  },
})

const selectable = useDataTable<MockProduct>({ fetchFn: mockFetch, ...TABLE_CONFIG })
const expandable = useDataTable<MockProduct>({ fetchFn: mockFetch, ...TABLE_CONFIG })
const actions = useDataTable<MockProduct>({ fetchFn: mockFetch, ...TABLE_CONFIG })
const columnToggle = useDataTable<MockProduct>({ fetchFn: mockFetch, ...TABLE_CONFIG })
const variants = useDataTable<MockProduct>({ fetchFn: mockFetch, ...TABLE_CONFIG })
const loadingDemoData = useDataTable<MockProduct>({ fetchFn: mockFetch, ...TABLE_CONFIG })
const styling = useDataTable<MockProduct>({ fetchFn: mockFetch, ...TABLE_CONFIG })
const frozenScroll = useDataTable<MockProduct>({ fetchFn: mockFetch, ...TABLE_CONFIG })

// --- Actions ---

const lastAction = ref<string | null>(null)

function onRowAction(event: AppRowActionEvent<MockProduct>): void {
  lastAction.value = `${event.type} → ${event.data.name} (ID: ${event.data.id})`
}

// --- Visual Variants ---

const tableSize = ref<'small' | 'large' | undefined>(undefined)
const showGrid = ref<boolean>(false)

const sizeOptions = [
  { label: 'Small', value: 'small' as const },
  { label: 'Normal', value: undefined },
  { label: 'Large', value: 'large' as const },
]

function statusSeverity(status: string): 'success' | 'warn' | 'danger' {
  switch (status) {
    case 'In Stock':
      return 'success'
    case 'Low Stock':
      return 'warn'
    case 'Out of Stock':
      return 'danger'
    default:
      return 'success'
  }
}

// --- Loading Modes ---

const loadingDemo = ref<string>('none')
const loadingDemoOptions = [
  { label: 'Normal', value: 'none' },
  { label: 'Spinner', value: 'spinner' },
  { label: 'Skeleton', value: 'skeleton' },
  { label: 'Custom Icon', value: 'custom-icon' },
]

// --- Empty State ---

const emptyPagination: AppTablePagination = {
  first: 0,
  rows: 10,
  totalRecords: 0,
  rowsPerPageOptions: [10, 25],
}

// --- Section 10: Custom Styling ---

const tablePt = {
  column: {
    headerCell: { style: { background: '#1e3a5f', color: '#ffffff', borderColor: '#2d4a6f' } },
  },
}

function rowClassFn(data: unknown): Record<string, boolean> {
  const row = data as MockProduct
  return {
    'row-low-stock': row.stock < 20,
    'row-out-of-stock': row.status === 'Out of Stock',
  }
}

// --- Section 11: Column Group (Rowspan / Colspan) ---

interface SaleRecord {
  product: string
  lastSale: string
  quantity: number
  revenue: number
  profit: number
}

const colGroupData: SaleRecord[] = [
  { product: 'Wireless Mouse', lastSale: '2025-12-15', quantity: 120, revenue: 2400, profit: 960 },
  { product: 'USB Keyboard', lastSale: '2025-12-18', quantity: 85, revenue: 3400, profit: 1190 },
  { product: 'Monitor Stand', lastSale: '2025-12-20', quantity: 42, revenue: 1260, profit: 504 },
  { product: 'Headphones', lastSale: '2025-12-22', quantity: 200, revenue: 6000, profit: 2400 },
  { product: 'Webcam', lastSale: '2025-12-25', quantity: 65, revenue: 3250, profit: 1300 },
]

const colGroupColumns: AppColumnDef[] = [
  { field: 'product', header: 'Product' },
  { field: 'lastSale', header: 'Last Sale' },
  { field: 'quantity', header: 'Quantity' },
  { field: 'revenue', header: 'Revenue' },
  { field: 'profit', header: 'Profit' },
]

const colGroupPagination: AppTablePagination = {
  first: 0,
  rows: colGroupData.length,
  totalRecords: colGroupData.length,
  rowsPerPageOptions: [colGroupData.length],
}

const colGroupTotals = computed(() => {
  return colGroupData.reduce(
    (acc, row) => ({
      quantity: acc.quantity + row.quantity,
      revenue: acc.revenue + row.revenue,
      profit: acc.profit + row.profit,
    }),
    { quantity: 0, revenue: 0, profit: 0 },
  )
})

// --- Section 13: Expandable Row Groups ---

interface CustomerRecord {
  name: string
  country: string
  company: string
  representative: string
  status: string
  date: string
}

const REPRESENTATIVES = [
  'Amy Elsner',
  'Anna Fali',
  'Asiya Javayant',
  'Bernardo Dominic',
  'Elwin Sharvill',
  'Ioni Bowcher',
  'Ivan Magalhaes',
  'Onyama Limba',
  'Stephen Shaw',
  'Xuxue Feng',
]

const COUNTRIES = [
  'Australia',
  'Brazil',
  'Canada',
  'France',
  'Germany',
  'Japan',
  'Romania',
  'USA',
  'Venezuela',
]
const COMPANIES = [
  'Benton & Partners',
  'Chanay Corp',
  'Crown Media',
  'Dorl, James J Esq',
  'Century Communications',
  'Rapid Trading Intl',
  'Simona Morasca Ltd',
  'Verizon Wireless',
]
const CUSTOMER_STATUSES = ['qualified', 'unqualified', 'negotiation', 'new', 'renewal']

const rowGroupData: CustomerRecord[] = REPRESENTATIVES.flatMap((rep) => {
  const count = Math.floor(Math.random() * 4) + 2
  return Array.from({ length: count }, (_, i) => ({
    name: `${rep.split(' ')[0]} Customer ${i + 1}`,
    country: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
    company: COMPANIES[Math.floor(Math.random() * COMPANIES.length)],
    representative: rep,
    status: CUSTOMER_STATUSES[Math.floor(Math.random() * CUSTOMER_STATUSES.length)],
    date: `201${7 + Math.floor(Math.random() * 3)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
  }))
}).sort((a, b) => a.representative.localeCompare(b.representative))

const expandedGroups = ref<string[]>([])

function onExpandedGroupsChange(value: unknown): void {
  if (Array.isArray(value)) {
    expandedGroups.value = value as string[]
  }
}

function onGroupExpand(event: { data: string }): void {
  console.info('Row group expanded:', event.data)
}

function onGroupCollapse(event: { data: string }): void {
  console.info('Row group collapsed:', event.data)
}

function calculateGroupTotal(representative: string): number {
  return rowGroupData.filter((r) => r.representative === representative).length
}

function customerStatusSeverity(
  status: string,
): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
  switch (status) {
    case 'qualified':
      return 'success'
    case 'unqualified':
      return 'danger'
    case 'negotiation':
      return 'warn'
    case 'new':
      return 'info'
    case 'renewal':
      return 'secondary'
    default:
      return 'info'
  }
}

// --- Section 12: Frozen Columns with Horizontal Scroll ---

const frozenScrollColumns: AppColumnDef[] = [
  { field: 'id', header: 'ID', sortable: true, width: '5rem', align: 'center', frozen: true },
  { field: 'name', header: 'Name', sortable: true, minWidth: '14rem', frozen: true },
  { field: 'category', header: 'Category', sortable: true, minWidth: '12rem' },
  { field: 'price', header: 'Price', sortable: true, align: 'right', minWidth: '10rem' },
  { field: 'stock', header: 'Stock', sortable: true, align: 'center', minWidth: '10rem' },
  { field: 'status', header: 'Status', sortable: true, minWidth: '12rem' },
  { field: 'rating', header: 'Rating', sortable: true, align: 'center', minWidth: '10rem' },
]
</script>

<style scoped lang="scss">
.datatable-examples {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--p-text-color);

  i {
    color: var(--p-primary-color);
  }
}

.section-description {
  color: var(--p-text-muted-color);
  margin-bottom: 1rem;

  code {
    font-family: monospace;
    font-size: 0.85rem;
    color: var(--p-primary-color);
    background: var(--p-surface-100);
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
  }
}

.controls-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.result-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
  padding: 0.625rem 0.875rem;
  background: var(--p-surface-50);
  border: 1px solid var(--p-surface-200);
  border-radius: 6px;

  .result-detail {
    color: var(--p-text-muted-color);
    font-size: 0.9rem;
  }
}

.code-block {
  background: var(--p-surface-900);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  margin-top: 1rem;

  pre {
    margin: 0;
  }

  code {
    font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
    font-size: 0.8rem;
    color: var(--p-surface-100);
    white-space: pre;
    line-height: 1.5;
  }
}

.expansion-content {
  padding: 1rem;

  h4 {
    margin: 0 0 0.75rem 0;
  }
}

.expansion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
}

.group-header-content {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.group-header-name {
  font-weight: 600;
}

.group-footer-content {
  display: flex;
  justify-content: flex-end;
  padding: 0.25rem 0;
}

:deep(.row-low-stock) {
  background: #fef9c3 !important;
}

:deep(.row-out-of-stock) {
  background: #fee2e2 !important;
  color: #991b1b;
}
</style>
