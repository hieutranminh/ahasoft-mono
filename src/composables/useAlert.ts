import { reactive } from 'vue'

import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

import type { ApiErrorMessage } from '@/types/api'

// Shared severity type for buttons
export type ButtonSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger'

// Toast severity types
export type ToastSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'

// Toast options interface
export interface ToastOptions {
  summary: string
  detail?: string
  life?: number
  closable?: boolean
}

// Confirm dialog options interface
export interface ConfirmOptions {
  message: string
  header?: string
  icon?: string
  group?: string
  acceptLabel?: string
  rejectLabel?: string
  acceptSeverity?: ButtonSeverity
  rejectSeverity?: ButtonSeverity
  onAccept?: () => void
  onReject?: () => void
}

// Error dialog options interface (supports both simple string messages and API errors)
export interface ErrorDialogOptions {
  message?: string
  errors?: ApiErrorMessage[]
  header?: string
  onClose?: () => void
}

// Error dialog reactive state (module-level singleton)
export interface ErrorDialogState {
  visible: boolean
  message: string | null
  errors: ApiErrorMessage[]
  header: string
  onClose?: () => void
}

export const errorDialogState = reactive<ErrorDialogState>({
  visible: false,
  message: null,
  errors: [],
  header: 'Error',
  onClose: undefined,
})

// Default values as constants for maintainability
const DEFAULTS = {
  TOAST_LIFE: 3000,
  CONFIRM_HEADER: 'Confirmation',
  CONFIRM_ICON: 'pi pi-exclamation-triangle',
  CONFIRM_ACCEPT_LABEL: 'Confirm',
  CONFIRM_REJECT_LABEL: 'Cancel',
  DELETE_HEADER: 'Delete Confirmation',
  DELETE_ICON: 'pi pi-trash',
  DELETE_ACCEPT_LABEL: 'Delete',
  ERROR_HEADER: 'Error',
  ERROR_ICON: 'pi pi-times-circle',
  ERROR_CLOSE_LABEL: 'Close',
} as const

/**
 * Composable for global alert and dialog management
 * Provides unified API for Toast notifications and ConfirmDialog
 */
export function useAlert() {
  const toast = useToast()
  const confirm = useConfirm()

  /**
   * Show a toast notification
   */
  function showToast(severity: ToastSeverity, options: ToastOptions): void {
    toast.add({
      severity,
      summary: options.summary,
      detail: options.detail,
      life: options.life ?? DEFAULTS.TOAST_LIFE,
      closable: options.closable ?? true,
    })
  }

  /**
   * Show success toast
   */
  function success(summary: string, detail?: string, life?: number): void {
    showToast('success', { summary, detail, life })
  }

  /**
   * Show info toast
   */
  function info(summary: string, detail?: string, life?: number): void {
    showToast('info', { summary, detail, life })
  }

  /**
   * Show warning toast
   */
  function warn(summary: string, detail?: string, life?: number): void {
    showToast('warn', { summary, detail, life })
  }

  /**
   * Show error toast
   */
  function error(summary: string, detail?: string, life?: number): void {
    showToast('error', { summary, detail, life })
  }

  /**
   * Clear all toast notifications
   */
  function clearToasts(): void {
    toast.removeAllGroups()
  }

  /**
   * Show confirmation dialog
   * Returns a Promise that resolves when user confirms and rejects when user cancels
   */
  function showConfirm(options: ConfirmOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      confirm.require({
        message: options.message,
        header: options.header ?? DEFAULTS.CONFIRM_HEADER,
        icon: options.icon ?? DEFAULTS.CONFIRM_ICON,
        group: options.group,
        rejectProps: {
          label: options.rejectLabel ?? DEFAULTS.CONFIRM_REJECT_LABEL,
          severity: options.rejectSeverity ?? 'secondary',
          outlined: true,
        },
        acceptProps: {
          label: options.acceptLabel ?? DEFAULTS.CONFIRM_ACCEPT_LABEL,
          severity: options.acceptSeverity ?? 'primary',
        },
        accept: () => {
          options.onAccept?.()
          resolve()
        },
        reject: () => {
          options.onReject?.()
          reject(new Error('User cancelled'))
        },
      })
    })
  }

  /**
   * Show delete confirmation dialog with danger styling
   */
  function showDeleteConfirm(
    options: Omit<ConfirmOptions, 'acceptSeverity' | 'icon'>,
  ): Promise<void> {
    return showConfirm({
      ...options,
      icon: DEFAULTS.DELETE_ICON,
      header: options.header ?? DEFAULTS.DELETE_HEADER,
      acceptLabel: options.acceptLabel ?? DEFAULTS.DELETE_ACCEPT_LABEL,
      acceptSeverity: 'danger',
    })
  }

  /**
   * Show error dialog with optional expandable error details.
   * Accepts a simple string or ErrorDialogOptions with message/errors.
   * When called with a string, shows only the message (no error details toggle).
   * When called with errors (ApiErrorMessage[]), shows expandable error details.
   */
  function showErrorDialog(messageOrOptions: string | ErrorDialogOptions): void {
    if (typeof messageOrOptions === 'string') {
      errorDialogState.message = messageOrOptions
      errorDialogState.errors = []
      errorDialogState.header = DEFAULTS.ERROR_HEADER
      errorDialogState.onClose = undefined
    } else {
      errorDialogState.message = messageOrOptions.message ?? null
      errorDialogState.errors = messageOrOptions.errors ?? []
      errorDialogState.header = messageOrOptions.header ?? DEFAULTS.ERROR_HEADER
      errorDialogState.onClose = messageOrOptions.onClose
    }
    errorDialogState.visible = true
  }

  return {
    // Toast methods
    showToast,
    success,
    info,
    warn,
    error,
    clearToasts,
    // Dialog methods
    showConfirm,
    showDeleteConfirm,
    showErrorDialog,
  }
}
