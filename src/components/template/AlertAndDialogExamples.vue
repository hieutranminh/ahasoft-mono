<template>
  <div class="alert-dialog-examples">
    <!-- Toast Notifications Section -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-bell" />
        Toast Notifications
      </h3>
      <p class="section-description">
        Toast notifications for success, info, warning, and error messages.
      </p>
      <div class="controls-row">
        <Button label="Success" severity="success" icon="pi pi-check" @click="showSuccessToast" />
        <Button label="Info" severity="info" icon="pi pi-info-circle" @click="showInfoToast" />
        <Button
          label="Warning"
          severity="warn"
          icon="pi pi-exclamation-triangle"
          @click="showWarnToast"
        />
        <Button label="Error" severity="danger" icon="pi pi-times-circle" @click="showErrorToast" />
        <Button
          label="Clear All"
          severity="secondary"
          icon="pi pi-trash"
          variant="outlined"
          @click="alert.clearToasts()"
        />
      </div>
      <div class="code-block">
        <pre><code>import { useAlert } from '@/composables/useAlert'

const alert = useAlert()

// Simple toast notifications
alert.success('Success', 'Operation completed successfully')
alert.info('Info', 'Here is some information')
alert.warn('Warning', 'Please be careful')
alert.error('Error', 'Something went wrong')

// With custom duration (5 seconds)
alert.success('Success', 'This will stay for 5 seconds', 5000)</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Confirmation Dialogs Section -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-question-circle" />
        Confirmation Dialogs
      </h3>
      <p class="section-description">
        Confirmation dialogs for user decisions with Accept/Reject options. Returns a Promise.
      </p>
      <div class="format-grid">
        <div class="format-card clickable" @click="showBasicConfirm">
          <div class="format-icon">
            <i class="pi pi-question-circle icon-primary" />
          </div>
          <div class="format-content">
            <div class="format-name">Basic Confirm</div>
            <div class="format-pattern">showConfirm(options)</div>
            <div class="format-description">Standard confirmation with Accept/Cancel buttons</div>
          </div>
        </div>
        <div class="format-card clickable" @click="showDeleteConfirm">
          <div class="format-icon">
            <i class="pi pi-trash icon-danger" />
          </div>
          <div class="format-content">
            <div class="format-name">Delete Confirm</div>
            <div class="format-pattern">showDeleteConfirm(options)</div>
            <div class="format-description">Danger-styled confirmation for delete actions</div>
          </div>
        </div>
        <div class="format-card clickable" @click="showCustomConfirm">
          <div class="format-icon">
            <i class="pi pi-save icon-success" />
          </div>
          <div class="format-content">
            <div class="format-name">Custom Confirm</div>
            <div class="format-pattern">Custom labels & icons</div>
            <div class="format-description">Customizable button labels and styling</div>
          </div>
        </div>
      </div>
      <div class="code-block">
        <pre><code>import { useAlert } from '@/composables/useAlert'

const alert = useAlert()

// Basic confirmation - returns Promise
async function handleConfirm() {
  try {
    await alert.showConfirm({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
    })
    alert.success('Confirmed', 'You accepted the action')
  } catch {
    alert.info('Cancelled', 'You cancelled the action')
  }
}

// Delete confirmation with danger styling
async function handleDelete() {
  try {
    await alert.showDeleteConfirm({
      message: 'This action cannot be undone. Delete this item?',
      header: 'Delete Item',
    })
    // Perform delete operation
  } catch {
    // User cancelled
  }
}</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Error Dialog Section -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-times-circle" />
        Error Dialog
      </h3>
      <p class="section-description">
        Error dialog displays error messages with only a Close button (no confirmation needed).
      </p>
      <div class="format-grid">
        <div class="format-card clickable" @click="showValidationError">
          <div class="format-icon">
            <i class="pi pi-exclamation-circle icon-danger" />
          </div>
          <div class="format-content">
            <div class="format-name">Validation Error</div>
            <div class="format-pattern">showErrorDialog(message)</div>
            <div class="format-description">Display validation or input errors (string)</div>
          </div>
        </div>
        <div class="format-card clickable" @click="showApiErrorDialog">
          <div class="format-icon">
            <i class="pi pi-server icon-warn" />
          </div>
          <div class="format-content">
            <div class="format-name">Server Error</div>
            <div class="format-pattern">API error handling</div>
            <div class="format-description">Display API or server error messages</div>
          </div>
        </div>
        <div class="format-card clickable" @click="showServerError">
          <div class="format-icon">
            <i class="pi pi-list icon-danger" />
          </div>
          <div class="format-content">
            <div class="format-name">Server Error Details</div>
            <div class="format-pattern">showErrorDialog({ errors })</div>
            <div class="format-description">
              Display API errors with expandable error code &amp; values
            </div>
          </div>
        </div>
      </div>
      <div class="code-block">
        <pre><code>import { useAlert } from '@/composables/useAlert'

const alert = useAlert()

// Simple string message (no error details toggle)
alert.showErrorDialog('Unable to connect to the server.')

// With i18n translation
alert.showErrorDialog(t('general.validate-required'))

// With options: message + custom header
alert.showErrorDialog({
  message: 'Unable to connect to the server.',
  header: 'Connection Error',
  onClose: () => console.log('closed'),
})

// With API errors (shows expandable error details)
alert.showErrorDialog({
  errors: [
    {
      errorCode: 'BBT05R',
      errorMessage: "Date range can't exceed one year",
      errorValues: ['fromDateTs: 1767225600', 'shopId: 601030'],
    },
  ],
})

// Handling API response errors
async function fetchData() {
  const response = await api.get&lt;ApiResponse&gt;('/data')
  if (!response.isOK) {
    alert.showErrorDialog({ errors: response.errorMessages })
  }
}</code></pre>
      </div>
    </div>

    <Divider />

    <!-- API Reference Section -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-book" />
        API Reference
      </h3>
      <div class="api-grid">
        <div class="api-group">
          <h4 class="group-title">Toast Methods</h4>
          <div class="api-list">
            <div class="api-item">
              <code>success(summary, detail?, life?)</code>
              <span>Success notification</span>
            </div>
            <div class="api-item">
              <code>info(summary, detail?, life?)</code>
              <span>Info notification</span>
            </div>
            <div class="api-item">
              <code>warn(summary, detail?, life?)</code>
              <span>Warning notification</span>
            </div>
            <div class="api-item">
              <code>error(summary, detail?, life?)</code>
              <span>Error notification</span>
            </div>
            <div class="api-item">
              <code>showToast(severity, options)</code>
              <span>Generic toast with full options</span>
            </div>
            <div class="api-item">
              <code>clearToasts()</code>
              <span>Clear all toasts</span>
            </div>
          </div>
        </div>
        <div class="api-group">
          <h4 class="group-title">Dialog Methods</h4>
          <div class="api-list">
            <div class="api-item">
              <code>showConfirm(options)</code>
              <span>Confirmation dialog</span>
            </div>
            <div class="api-item">
              <code>showDeleteConfirm(options)</code>
              <span>Delete confirmation</span>
            </div>
            <div class="api-item">
              <code>showErrorDialog(message | options)</code>
              <span>Error dialog (string or options)</span>
            </div>
          </div>
        </div>
        <div class="api-group">
          <h4 class="group-title">ConfirmOptions Interface</h4>
          <div class="api-list">
            <div class="api-item">
              <code>message: string</code>
              <span>Dialog message (required)</span>
            </div>
            <div class="api-item">
              <code>header?: string</code>
              <span>Dialog title</span>
            </div>
            <div class="api-item">
              <code>icon?: string</code>
              <span>Icon class (pi pi-*)</span>
            </div>
            <div class="api-item">
              <code>acceptLabel?: string</code>
              <span>Accept button text</span>
            </div>
            <div class="api-item">
              <code>rejectLabel?: string</code>
              <span>Reject button text</span>
            </div>
            <div class="api-item">
              <code>acceptSeverity?: string</code>
              <span>Accept button severity</span>
            </div>
            <div class="api-item">
              <code>rejectSeverity?: string</code>
              <span>Reject button severity</span>
            </div>
          </div>
        </div>
        <div class="api-group">
          <h4 class="group-title">ErrorDialogOptions Interface</h4>
          <div class="api-list">
            <div class="api-item">
              <code>message?: string</code>
              <span>Simple error message</span>
            </div>
            <div class="api-item">
              <code>errors?: ApiErrorMessage[]</code>
              <span>API errors (shows expandable details)</span>
            </div>
            <div class="api-item">
              <code>header?: string</code>
              <span>Dialog title (default: "Error")</span>
            </div>
            <div class="api-item">
              <code>onClose?: () => void</code>
              <span>Callback when dialog closes</span>
            </div>
          </div>
        </div>
        <div class="api-group">
          <h4 class="group-title">ApiErrorMessage Interface</h4>
          <div class="api-list">
            <div class="api-item">
              <code>errorCode: string</code>
              <span>Error code from server</span>
            </div>
            <div class="api-item">
              <code>errorMessage: string</code>
              <span>Human-readable error message</span>
            </div>
            <div class="api-item">
              <code>errorValues: string[]</code>
              <span>Additional error context values</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Divider />

    <!-- Setup Guide Section -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-cog" />
        Setup Guide
      </h3>
      <div class="setup-steps">
        <div class="setup-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <div class="step-title">App.vue Setup</div>
            <div class="code-block compact">
              <pre><code>&lt;template&gt;
  &lt;Toast /&gt;
  &lt;ConfirmDialog /&gt;
  &lt;AppErrorDialog /&gt;
  &lt;RouterView /&gt;
&lt;/template&gt;</code></pre>
            </div>
          </div>
        </div>
        <div class="setup-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <div class="step-title">Plugin Registration</div>
            <div class="code-block compact">
              <pre><code>// plugins/primevue.ts
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'

app.use(ConfirmationService)
app.use(ToastService)</code></pre>
            </div>
          </div>
        </div>
        <div class="setup-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <div class="step-title">Usage in Components</div>
            <div class="code-block compact">
              <pre><code>import { useAlert } from '@/composables/useAlert'

const alert = useAlert()

// Ready to use anywhere
alert.success('Done!', 'Task completed')
await alert.showConfirm({ message: 'Continue?' })</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAlert } from '@/composables/useAlert'

const alert = useAlert()

// Toast examples
function showSuccessToast(): void {
  alert.success('Success', 'Operation completed successfully!')
}

function showInfoToast(): void {
  alert.info('Information', 'Here is some useful information.')
}

function showWarnToast(): void {
  alert.warn('Warning', 'Please review before proceeding.')
}

function showErrorToast(): void {
  alert.error('Error', 'Something went wrong. Please try again.')
}

// Confirmation dialog examples
async function showBasicConfirm(): Promise<void> {
  try {
    await alert.showConfirm({
      message: 'Are you sure you want to proceed with this action?',
      header: 'Confirmation Required',
    })
    alert.success('Confirmed', 'You accepted the action!')
  } catch {
    alert.info('Cancelled', 'Action was cancelled.')
  }
}

async function showDeleteConfirm(): Promise<void> {
  try {
    await alert.showDeleteConfirm({
      message: 'This action cannot be undone. Are you sure you want to delete this item?',
      header: 'Delete Item',
    })
    alert.success('Deleted', 'Item has been deleted successfully.')
  } catch {
    alert.info('Cancelled', 'Delete operation cancelled.')
  }
}

async function showCustomConfirm(): Promise<void> {
  try {
    await alert.showConfirm({
      message: 'Do you want to save changes before leaving?',
      header: 'Unsaved Changes',
      icon: 'pi pi-save',
      acceptLabel: 'Save & Continue',
      rejectLabel: 'Discard',
      acceptSeverity: 'success',
    })
    alert.success('Saved', 'Changes have been saved.')
  } catch {
    alert.warn('Discarded', 'Changes were discarded.')
  }
}

// Error dialog examples
function showValidationError(): void {
  alert.showErrorDialog('Unable to process your request. Please check your input and try again.')
}

function showApiErrorDialog(): void {
  alert.showErrorDialog({
    message:
      'Failed to connect to the server (Error 500). The server might be temporarily unavailable. Please try again later or contact support if the problem persists.',
    header: 'Server Error',
  })
}

function showServerError(): void {
  alert.showErrorDialog({
    errors: [
      {
        errorCode: 'BBT05R',
        errorMessage: "Date range can't exceed one year",
        errorValues: ['fromDateTs: 1767225600', 'toDateTs: 1891468799', 'shopId: 601030'],
      },
    ],
  })
}
</script>

<style scoped lang="scss">
.alert-dialog-examples {
  margin: 0 auto;
}

.section-description {
  color: var(--p-text-muted-color);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.controls-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.format-section {
  margin-bottom: 1.5rem;
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

.format-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.format-card {
  display: flex;
  gap: 1rem;
  background: var(--p-surface-0);
  border: 1px solid var(--p-surface-300);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s ease;

  &.clickable {
    cursor: pointer;

    &:hover {
      border-color: var(--p-primary-color);
      background: var(--p-surface-50);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
}

.format-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--p-surface-100);
  border-radius: 8px;
  flex-shrink: 0;

  i {
    font-size: 1.25rem;

    &.icon-primary {
      color: var(--p-primary-color);
    }

    &.icon-success {
      color: var(--p-green-500);
    }

    &.icon-warn {
      color: var(--p-orange-500);
    }

    &.icon-danger {
      color: var(--p-red-500);
    }
  }
}

.format-content {
  flex: 1;
  min-width: 0;
}

.format-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--p-text-color);
  margin-bottom: 0.125rem;
}

.format-pattern {
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--p-primary-color);
  margin-bottom: 0.25rem;
}

.format-description {
  font-size: 0.8rem;
  color: var(--p-text-muted-color);
}

.code-block {
  background: var(--p-surface-900);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;

  &.compact {
    padding: 0.75rem;
  }

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

.api-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.api-group {
  background: var(--p-surface-50);
  border: 1px solid var(--p-surface-200);
  border-radius: 8px;
  padding: 1rem;
}

.group-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--p-text-color);
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--p-surface-200);
}

.api-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.api-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;

  code {
    font-family: monospace;
    font-size: 0.8rem;
    color: var(--p-primary-color);
    background: var(--p-surface-100);
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    width: fit-content;
  }

  span {
    font-size: 0.75rem;
    color: var(--p-text-muted-color);
  }
}

.setup-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setup-step {
  display: flex;
  gap: 1rem;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  min-width: 0;
}

.step-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--p-text-color);
  margin-bottom: 0.5rem;
}
</style>
