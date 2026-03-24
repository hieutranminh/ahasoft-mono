/**
 * Reusable Yup custom validation test functions.
 *
 * Usage with Yup:
 *   Yup.string().test('strong-password', 'Error message', isStrongPassword)
 *   Yup.string().test('phone', 'Error message', isValidPhone)
 */

/**
 * Test if password meets strength requirements:
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character
 *
 * Returns true for empty/undefined values (let .required() handle that).
 */
export function isStrongPassword(value: string | undefined): boolean {
  if (!value) return true
  return (
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /\d/.test(value) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(value)
  )
}

/**
 * Test if phone number matches international format:
 * 10-15 digits, optionally starting with +
 *
 * Returns true for empty/undefined values (let .required() handle that).
 */
export function isValidPhone(value: string | undefined): boolean {
  if (!value) return true
  return /^\+?[0-9]{10,15}$/.test(value)
}

/**
 * Collect validation errors from a Yup ValidationError.
 * Only keeps the FIRST error per field (priority order),
 * so chained rules like .required().min(2) only show the first failure.
 */
export function extractYupErrors(error: unknown): {
  messages: string[]
  fieldErrors: Record<string, string>
} {
  const messages: string[] = []
  const fieldErrors: Record<string, string> = {}

  if (error && typeof error === 'object' && 'inner' in error) {
    const yupError = error as { inner: Array<{ path?: string; message: string }> }
    for (const e of yupError.inner) {
      if (e.path && !fieldErrors[e.path]) {
        fieldErrors[e.path] = e.message
        messages.push(e.message)
      }
    }
  }

  return { messages, fieldErrors }
}
