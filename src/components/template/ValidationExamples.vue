<template>
  <div class="validation-examples">
    <!-- Section 1: Field-level Validation -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-pencil" />
        Field-level Validation
      </h3>
      <p class="section-description">
        Individual field validation using <code>useField</code> with standalone Yup rules. Each
        field validates independently on value change. Includes blur validation (focus then click
        away to trigger).
      </p>
      <div class="demo-grid">
        <div>
          <InputTextField
            v-model="fieldName"
            name="field-name"
            label="Name"
            placeholder="Enter name (min 3 chars)"
            :error="fieldNameError"
            required
            @blur="fieldNameBlur"
          />
          <div class="field-meta">
            <Tag
              :severity="fieldNameMeta.valid ? 'success' : 'danger'"
              :value="fieldNameMeta.valid ? 'Valid' : 'Invalid'"
            />
            <Tag
              :severity="fieldNameMeta.touched ? 'info' : 'secondary'"
              :value="fieldNameMeta.touched ? 'Touched' : 'Untouched'"
            />
            <Tag
              :severity="fieldNameMeta.dirty ? 'warn' : 'secondary'"
              :value="fieldNameMeta.dirty ? 'Dirty' : 'Pristine'"
            />
          </div>
        </div>
        <div>
          <InputTextField
            v-model="fieldEmail"
            name="field-email"
            label="Email"
            placeholder="Enter email address"
            :error="fieldEmailError"
            required
            @blur="fieldEmailBlur"
          />
          <div class="field-meta">
            <Tag
              :severity="fieldEmailMeta.valid ? 'success' : 'danger'"
              :value="fieldEmailMeta.valid ? 'Valid' : 'Invalid'"
            />
            <Tag
              :severity="fieldEmailMeta.touched ? 'info' : 'secondary'"
              :value="fieldEmailMeta.touched ? 'Touched' : 'Untouched'"
            />
          </div>
        </div>
        <div>
          <InputTextField
            v-model="fieldWebsite"
            name="field-website"
            label="Website"
            placeholder="https://example.com"
            :error="fieldWebsiteError"
            help-text="Optional - must be a valid URL"
            @blur="fieldWebsiteBlur"
          />
          <div class="field-meta">
            <Tag
              :severity="fieldWebsiteMeta.valid ? 'success' : 'danger'"
              :value="fieldWebsiteMeta.valid ? 'Valid' : 'Invalid'"
            />
          </div>
        </div>
      </div>
      <div class="hint-box">
        <i class="pi pi-info-circle" />
        <span>
          Click on a field, then click away (blur) to trigger validation. The <code>Touched</code>
          tag shows when a field has been focused and blurred.
        </span>
      </div>
      <div class="code-block">
        <pre><code>import { useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as Yup from 'yup'

// Standalone field with blur validation
const { value, errorMessage, meta, handleBlur, validate } = useField&lt;string&gt;(
  'name',
  toTypedSchema(Yup.string().required('Required').min(3, 'Min 3 chars')),
  { standalone: true }
)

// handleBlur only marks touched, need validate() to trigger errors
function onBlur() {
  handleBlur()   // marks meta.touched = true
  validate()     // triggers validation rules
}
// Bind: @blur="onBlur"</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Section 2: Form-level Validation -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-file-edit" />
        Form-level Validation
      </h3>
      <p class="section-description">
        Complete form validation using <code>useForm</code> with a Yup object schema. All fields
        validate together on submit.
      </p>
      <form @submit="onRegSubmit">
        <div class="demo-grid">
          <InputTextField
            v-model="regFullName"
            name="fullName"
            label="Full Name"
            placeholder="Enter full name"
            :error="regFullNameError"
            required
          />
          <InputTextField
            v-model="regEmail"
            name="regEmail"
            label="Email"
            placeholder="Enter email"
            :error="regEmailError"
            required
          />
          <SelectField
            v-model="regRole"
            name="role"
            label="Role"
            :options="roleOptions"
            placeholder="Select a role"
            :error="regRoleError"
            required
          />
          <CheckboxField
            v-model="regTerms"
            name="agreeTerms"
            label="I agree to the terms and conditions"
            :error="regTermsError"
          />
        </div>
        <div class="controls-row">
          <Button type="submit" label="Submit" icon="pi pi-check" />
          <Button
            type="button"
            label="Reset"
            icon="pi pi-refresh"
            severity="secondary"
            variant="outlined"
            @click="resetRegForm()"
          />
          <div class="form-meta-inline">
            <Tag
              :severity="regFormMeta.valid ? 'success' : 'danger'"
              :value="regFormMeta.valid ? 'Form Valid' : 'Form Invalid'"
            />
            <Tag
              :severity="regFormMeta.dirty ? 'warn' : 'secondary'"
              :value="regFormMeta.dirty ? 'Modified' : 'Unchanged'"
            />
          </div>
        </div>
      </form>
      <details v-if="regSubmittedValues" class="raw-details" open>
        <summary>Submitted Values</summary>
        <div class="raw-output">
          <pre>{{ JSON.stringify(regSubmittedValues, null, 2) }}</pre>
        </div>
      </details>
      <div class="code-block">
        <pre><code>import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as Yup from 'yup'

const schema = toTypedSchema(Yup.object({
  fullName: Yup.string().required('Required').min(2, 'Min 2 chars'),
  email: Yup.string().required('Required').email('Invalid email'),
  role: Yup.string().required('Select a role').nullable(),
  agreeTerms: Yup.boolean().oneOf([true], 'Must agree'),
}))

const { handleSubmit, resetForm, meta } = useForm({
  validationSchema: schema,
  initialValues: { fullName: '', email: '', role: null, agreeTerms: false },
})

const { value: fullName, errorMessage } = useField&lt;string&gt;('fullName')

const onSubmit = handleSubmit((values) =&gt; {
  console.log('Valid!', values)
})</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Section 3: Cross-field Validation -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-link" />
        Cross-field Validation
      </h3>
      <p class="section-description">
        Validation rules that depend on other fields using <code>Yup.ref()</code>. Password
        confirmation and date range validation.
      </p>
      <div class="demo-grid">
        <PasswordField
          v-model="crossPassword"
          name="cross-password"
          label="Password"
          placeholder="Enter password (min 8)"
          :error="crossErrors.password"
          required
        />
        <PasswordField
          v-model="crossConfirm"
          name="cross-confirm"
          label="Confirm Password"
          placeholder="Re-enter password"
          :error="crossErrors.confirmPassword"
          required
        />
        <DatePickerField
          v-model="crossStartDate"
          name="cross-start"
          label="Start Date"
          placeholder="Select start date"
          :error="crossErrors.startDate"
          required
        />
        <DatePickerField
          v-model="crossEndDate"
          name="cross-end"
          label="End Date"
          placeholder="Select end date"
          :error="crossErrors.endDate"
          required
        />
      </div>
      <div class="controls-row">
        <Button
          label="Validate Cross-fields"
          icon="pi pi-check-circle"
          @click="validateCrossFields"
        />
        <Button
          label="Clear"
          icon="pi pi-eraser"
          severity="secondary"
          variant="outlined"
          @click="clearCrossFields"
        />
        <Tag v-if="crossValid" severity="success" value="All validations passed!" />
      </div>
      <div class="code-block">
        <pre><code>const schema = Yup.object({
  password: Yup.string().required().min(8),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  startDate: Yup.date().nullable().required(),
  endDate: Yup.date().nullable().required()
    .min(Yup.ref('startDate'), 'End date must be after start date'),
})

// Validate with abortEarly: false to collect all errors
await schema.validate(values, { abortEarly: false })</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Section 4: Async Validation (API Check) -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-cloud" />
        Async Validation (API Check)
      </h3>
      <p class="section-description">
        Debounced async validation that checks data against an API (simulated). Shows loading states
        during validation.
      </p>
      <div class="demo-grid">
        <div>
          <InputTextField
            v-model="asyncUsername"
            name="async-username"
            label="Username"
            placeholder="Type a username"
            :error="asyncUsernameError"
            :help-text="asyncUsernameHelp"
            required
          />
          <div v-if="asyncUsernamePending" class="async-status">
            <ProgressSpinner style="width: 16px; height: 16px" stroke-width="6" />
            <span>Checking availability...</span>
          </div>
        </div>
        <div>
          <InputTextField
            v-model="asyncEmail"
            name="async-email"
            label="Email"
            placeholder="Type an email"
            :error="asyncEmailError"
            :help-text="asyncEmailHelp"
            required
          />
          <div v-if="asyncEmailPending" class="async-status">
            <ProgressSpinner style="width: 16px; height: 16px" stroke-width="6" />
            <span>Checking availability...</span>
          </div>
        </div>
      </div>
      <div class="hint-box">
        <i class="pi pi-info-circle" />
        <span>
          Taken usernames: <code>admin</code>, <code>user</code>, <code>test</code>,
          <code>demo</code>, <code>root</code>
          <br />
          Taken emails: <code>admin@example.com</code>, <code>test@example.com</code>,
          <code>user@example.com</code>
        </span>
      </div>
      <div class="code-block">
        <pre><code>// Simulated API check
async function checkUsername(value: string): Promise&lt;boolean&gt; {
  await new Promise((r) =&gt; setTimeout(r, 1000))
  return !takenUsernames.includes(value.toLowerCase())
}

// Debounced watcher
let timer: ReturnType&lt;typeof setTimeout&gt;
watch(username, (newVal) =&gt; {
  clearTimeout(timer)
  if (!newVal || newVal.length &lt; 3) return
  pending.value = true
  timer = setTimeout(async () =&gt; {
    const available = await checkUsername(newVal)
    pending.value = false
    if (!available) error.value = 'Username is already taken'
  }, 800)
})</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Section 5: Custom Validation Rules -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-cog" />
        Custom Validation Rules
      </h3>
      <p class="section-description">
        Custom validation using Yup's <code>.matches()</code> and <code>.test()</code> methods for
        complex rules like strong passwords and phone number patterns.
      </p>
      <div class="demo-grid">
        <div>
          <PasswordField
            v-model="customPassword"
            name="custom-password"
            label="Strong Password"
            placeholder="Enter a strong password"
            :error="customPasswordError"
            required
          />
          <div class="strength-meter">
            <div
              class="strength-bar"
              :style="{ width: `${strengthScore * 20}%` }"
              :class="strengthClass"
            />
          </div>
          <div class="strength-checks">
            <div
              v-for="(check, key) in passwordChecks"
              :key="key"
              class="check-item"
              :class="{ valid: check.passed }"
            >
              <i :class="check.passed ? 'pi pi-check-circle' : 'pi pi-circle'" />
              <span>{{ check.label }}</span>
            </div>
          </div>
        </div>
        <div>
          <InputTextField
            v-model="customPhone"
            name="custom-phone"
            label="Phone Number"
            placeholder="+84901234567"
            :error="customPhoneError"
            required
          />
          <small class="hint-text">Format: 10-15 digits, optionally starting with +</small>
        </div>
      </div>
      <div class="code-block">
        <pre><code>// Strong password with multiple criteria
const passwordSchema = Yup.string()
  .required('Password is required')
  .min(8, 'Min 8 characters')
  .matches(/[A-Z]/, 'Must contain uppercase')
  .matches(/[a-z]/, 'Must contain lowercase')
  .matches(/\d/, 'Must contain number')
  .matches(/[!@#$%^&amp;*]/, 'Must contain special character')

// Phone with custom pattern
const phoneSchema = Yup.string()
  .required('Phone is required')
  .matches(/^\+?[0-9]{10,15}$/, 'Invalid phone format')

// Custom test with async logic
Yup.string().test('custom-rule', 'Custom error', async (value) =&gt; {
  // Return true if valid, false if invalid
  return someCustomValidation(value)
})</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Section 6: Error Messages i18n -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-globe" />
        Error Messages i18n
      </h3>
      <p class="section-description">
        Validation error messages translated using <code>vue-i18n</code>. Switch locale to see
        messages change dynamically.
      </p>
      <div class="locale-switcher">
        <span class="locale-label">Current Locale:</span>
        <SelectButton
          v-model="currentLocale"
          :options="localeOptions"
          option-label="label"
          option-value="value"
        />
      </div>
      <div class="demo-grid">
        <InputTextField
          v-model="i18nName"
          name="i18n-name"
          label="Name"
          placeholder="Leave empty and validate"
          :error="i18nNameError"
          required
        />
        <InputTextField
          v-model="i18nEmail"
          name="i18n-email"
          label="Email"
          placeholder="Enter invalid email"
          :error="i18nEmailError"
          required
        />
      </div>
      <div class="controls-row">
        <Button label="Validate" icon="pi pi-check-circle" @click="validateI18nForm" />
        <Button
          label="Clear"
          icon="pi pi-eraser"
          severity="secondary"
          variant="outlined"
          @click="clearI18nForm"
        />
      </div>
      <div class="code-block">
        <pre><code>import { useI18n } from 'vue-i18n'
import * as Yup from 'yup'

const { t, locale } = useI18n()

// Create schema with translated messages (recreated on validate)
function validateForm() {
  const schema = Yup.object({
    name: Yup.string()
      .required(t('validation.required', { field: t('user.name') }))
      .min(2, t('validation.minLength', { field: t('user.name'), min: 2 })),
    email: Yup.string()
      .required(t('validation.required', { field: t('user.email') }))
      .email(t('validation.email')),
  })

  schema.validateSync(values, { abortEarly: false })
}

// Schema is created inside the function so t() uses current locale</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Section 7: Error Summary (Multi-Error Message) -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-exclamation-circle" />
        Error Summary (Multi-Error Message)
      </h3>
      <p class="section-description">
        Display all validation errors in a single PrimeVue <code>Message</code> component. Useful
        for showing a form-level error summary alongside per-field errors.
      </p>
      <div class="demo-grid">
        <InputTextField
          v-model="summaryName"
          name="summary-name"
          label="Full Name"
          placeholder="Enter full name"
          :error="summaryFieldErrors.name"
          required
        />
        <InputTextField
          v-model="summaryEmail"
          name="summary-email"
          label="Email"
          placeholder="Enter email"
          :error="summaryFieldErrors.email"
          required
        />
        <InputTextField
          v-model="summaryPhone"
          name="summary-phone"
          label="Phone"
          placeholder="+84901234567"
          :error="summaryFieldErrors.phone"
          required
        />
        <InputTextField
          v-model="summaryWebsite"
          name="summary-website"
          label="Website"
          placeholder="https://example.com"
          :error="summaryFieldErrors.website"
        />
        <PasswordField
          v-model="summaryPassword"
          name="summary-password"
          label="Password"
          placeholder="Min 8 characters"
          :error="summaryFieldErrors.password"
          required
        />
      </div>
      <div class="controls-row">
        <Button label="Validate All" icon="pi pi-check-circle" @click="validateSummaryForm" />
        <Button
          label="Clear"
          icon="pi pi-eraser"
          severity="secondary"
          variant="outlined"
          @click="clearSummaryForm"
        />
        <Tag v-if="summaryValid" severity="success" value="All fields are valid!" />
      </div>
      <Message v-if="summaryErrors.length > 0" severity="error" :closable="false">
        <ul class="error-summary-list">
          <li v-for="(error, index) in summaryErrors" :key="index">{{ error }}</li>
        </ul>
      </Message>
      <div class="code-block">
        <pre><code>import * as Yup from 'yup'
import { extractYupErrors } from '@/schemas'

const schema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().required('Email is required').email('Invalid email'),
  phone: Yup.string().required('Phone is required'),
})

const summaryErrors = ref&lt;string[]&gt;([])
const fieldErrors = ref&lt;Record&lt;string, string&gt;&gt;({})

async function validateForm() {
  try {
    await schema.validate(values, { abortEarly: false })
  } catch (err) {
    // Extract all errors into flat array + field map
    const { messages, fieldErrors: fields } = extractYupErrors(err)
    summaryErrors.value = messages
    fieldErrors.value = fields
  }
}

// Template: Single Message with error list
// &lt;Message v-if="summaryErrors.length" severity="error"&gt;
//   &lt;ul&gt;
//     &lt;li v-for="err in summaryErrors"&gt;&#123;&#123; err &#125;&#125;&lt;/li&gt;
//   &lt;/ul&gt;
// &lt;/Message&gt;</code></pre>
      </div>
    </div>

    <Divider />

    <!-- API Reference -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-book" />
        API Reference
      </h3>
      <div class="api-grid">
        <div class="api-group">
          <h4 class="group-title">useField Options</h4>
          <div class="api-list">
            <div class="api-item">
              <code>value: Ref&lt;T&gt;</code>
              <span>Reactive field value</span>
            </div>
            <div class="api-item">
              <code>errorMessage: ComputedRef</code>
              <span>First error message</span>
            </div>
            <div class="api-item">
              <code>errors: ComputedRef&lt;string[]&gt;</code>
              <span>All error messages</span>
            </div>
            <div class="api-item">
              <code>meta: FieldMeta</code>
              <span>valid, touched, dirty, pending</span>
            </div>
            <div class="api-item">
              <code>validate(): Promise</code>
              <span>Trigger validation manually</span>
            </div>
            <div class="api-item">
              <code>resetField(): void</code>
              <span>Reset field to initial state</span>
            </div>
          </div>
        </div>
        <div class="api-group">
          <h4 class="group-title">useForm Options</h4>
          <div class="api-list">
            <div class="api-item">
              <code>handleSubmit(cb)</code>
              <span>Returns submit handler (validates first)</span>
            </div>
            <div class="api-item">
              <code>resetForm(state?)</code>
              <span>Reset all fields to initial values</span>
            </div>
            <div class="api-item">
              <code>meta: FormMeta</code>
              <span>valid, dirty, touched, pending</span>
            </div>
            <div class="api-item">
              <code>values: ComputedRef</code>
              <span>All current form values</span>
            </div>
            <div class="api-item">
              <code>errors: ComputedRef</code>
              <span>All current form errors</span>
            </div>
            <div class="api-item">
              <code>validate(): Promise</code>
              <span>Validate entire form</span>
            </div>
          </div>
        </div>
        <div class="api-group">
          <h4 class="group-title">Yup Common Methods</h4>
          <div class="api-list">
            <div class="api-item">
              <code>.required(msg?)</code>
              <span>Mark field as required</span>
            </div>
            <div class="api-item">
              <code>.min(n, msg?) / .max(n, msg?)</code>
              <span>Min/max length or value</span>
            </div>
            <div class="api-item">
              <code>.email(msg?)</code>
              <span>Email format validation</span>
            </div>
            <div class="api-item">
              <code>.matches(regex, msg?)</code>
              <span>Regex pattern matching</span>
            </div>
            <div class="api-item">
              <code>.oneOf([Yup.ref('field')])</code>
              <span>Cross-field reference</span>
            </div>
            <div class="api-item">
              <code>.test(name, msg, fn)</code>
              <span>Custom sync/async validation</span>
            </div>
          </div>
        </div>
        <div class="api-group">
          <h4 class="group-title">Integration Patterns</h4>
          <div class="api-list">
            <div class="api-item">
              <code>toTypedSchema(yupSchema)</code>
              <span>Convert Yup schema for VeeValidate</span>
            </div>
            <div class="api-item">
              <code>{ standalone: true }</code>
              <span>Field independent of any form</span>
            </div>
            <div class="api-item">
              <code>schema.validate(data, opts)</code>
              <span>Manual Yup validation</span>
            </div>
            <div class="api-item">
              <code>{ abortEarly: false }</code>
              <span>Collect all errors, not just first</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Divider />

    <!-- Setup Guide -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-wrench" />
        Setup Guide
      </h3>
      <div class="setup-steps">
        <div class="setup-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <div class="step-title">Install Dependencies</div>
            <div class="code-block compact">
              <pre><code>pnpm add vee-validate @vee-validate/yup yup</code></pre>
            </div>
          </div>
        </div>
        <div class="setup-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <div class="step-title">Field-level: useField (standalone)</div>
            <div class="code-block compact">
              <pre><code>import { useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as Yup from 'yup'

const { value, errorMessage, meta } = useField&lt;string&gt;(
  'fieldName',
  toTypedSchema(Yup.string().required()),
  { standalone: true }
)
// Bind: v-model="value" :error="errorMessage"</code></pre>
            </div>
          </div>
        </div>
        <div class="setup-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <div class="step-title">Form-level: useForm + useField</div>
            <div class="code-block compact">
              <pre><code>const schema = toTypedSchema(Yup.object({ ... }))
const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: { ... },
})
const { value, errorMessage } = useField&lt;string&gt;('fieldName')

const onSubmit = handleSubmit((values) =&gt; { ... })</code></pre>
            </div>
          </div>
        </div>
        <div class="setup-step">
          <div class="step-number">4</div>
          <div class="step-content">
            <div class="step-title">Integration with Form Field Components</div>
            <div class="code-block compact">
              <pre><code>&lt;InputTextField
  v-model="value"         &lt;!-- from useField --&gt;
  name="fieldName"
  label="Label"
  :error="errorMessage"   &lt;!-- from useField --&gt;
  required
/&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as Yup from 'yup'
import { useI18n } from 'vue-i18n'
import { useAlert } from '@/composables/useAlert'
import { isStrongPassword, extractYupErrors } from '@/schemas'
import {
  InputTextField,
  PasswordField,
  SelectField,
  CheckboxField,
  DatePickerField,
} from '@/components/common'

const alert = useAlert()

// ============================================
// Section 1: Field-level Validation (standalone)
// ============================================

const {
  value: fieldName,
  errorMessage: fieldNameError,
  meta: fieldNameMeta,
  handleBlur: _fieldNameBlur,
  validate: _fieldNameValidate,
} = useField<string>(
  'fieldName',
  toTypedSchema(Yup.string().required('Name is required').min(3, 'Must be at least 3 characters')),
  { standalone: true },
)

const {
  value: fieldEmail,
  errorMessage: fieldEmailError,
  meta: fieldEmailMeta,
  handleBlur: _fieldEmailBlur,
  validate: _fieldEmailValidate,
} = useField<string>(
  'fieldEmail',
  toTypedSchema(Yup.string().required('Email is required').email('Invalid email format')),
  { standalone: true },
)

const {
  value: fieldWebsite,
  errorMessage: fieldWebsiteError,
  meta: fieldWebsiteMeta,
  handleBlur: _fieldWebsiteBlur,
  validate: _fieldWebsiteValidate,
} = useField<string>(
  'fieldWebsite',
  toTypedSchema(Yup.string().url('Must be a valid URL (https://...)')),
  { standalone: true },
)

// Blur handlers: mark as touched AND trigger validation
function fieldNameBlur(): void {
  _fieldNameBlur()
  _fieldNameValidate()
}

function fieldEmailBlur(): void {
  _fieldEmailBlur()
  _fieldEmailValidate()
}

function fieldWebsiteBlur(): void {
  _fieldWebsiteBlur()
  _fieldWebsiteValidate()
}

// ============================================
// Section 2: Form-level Validation (useForm)
// ============================================

const registrationSchema = toTypedSchema(
  Yup.object({
    fullName: Yup.string()
      .required('Full name is required')
      .min(2, 'Must be at least 2 characters'),
    email: Yup.string().required('Email is required').email('Invalid email format'),
    role: Yup.string().nullable().required('Please select a role'),
    agreeTerms: Yup.boolean().oneOf([true], 'You must agree to the terms'),
  }),
)

const {
  handleSubmit: handleRegSubmit,
  resetForm: resetRegForm,
  meta: regFormMeta,
} = useForm({
  validationSchema: registrationSchema,
  initialValues: {
    fullName: '',
    email: '',
    role: undefined as string | undefined,
    agreeTerms: false,
  },
})

const { value: regFullName, errorMessage: regFullNameError } = useField<string>('fullName')
const { value: regEmail, errorMessage: regEmailError } = useField<string>('email')
const { value: regRole, errorMessage: regRoleError } = useField<string | undefined>('role')
const { value: regTerms, errorMessage: regTermsError } = useField<boolean>('agreeTerms')

const regSubmittedValues = ref<Record<string, unknown> | null>(null)

const onRegSubmit = handleRegSubmit((values) => {
  regSubmittedValues.value = { ...values }
  alert.success('Form Submitted', 'All validations passed!')
})

const roleOptions = [
  { label: 'Developer', value: 'developer' },
  { label: 'Designer', value: 'designer' },
  { label: 'Manager', value: 'manager' },
  { label: 'QA Engineer', value: 'qa' },
]

// ============================================
// Section 3: Cross-field Validation (manual Yup)
// ============================================

const crossPassword = ref('')
const crossConfirm = ref('')
const crossStartDate = ref<Date | null>(null)
const crossEndDate = ref<Date | null>(null)
const crossErrors = ref<Record<string, string>>({})
const crossValid = ref(false)

const crossFieldSchema = Yup.object({
  password: Yup.string().required('Password is required').min(8, 'Must be at least 8 characters'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
  startDate: Yup.date().nullable().required('Start date is required'),
  endDate: Yup.date()
    .nullable()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after start date'),
})

async function validateCrossFields(): Promise<void> {
  crossErrors.value = {}
  crossValid.value = false
  try {
    await crossFieldSchema.validate(
      {
        password: crossPassword.value,
        confirmPassword: crossConfirm.value,
        startDate: crossStartDate.value,
        endDate: crossEndDate.value,
      },
      { abortEarly: false },
    )
    crossValid.value = true
    alert.success('Valid', 'All cross-field validations passed!')
  } catch (err: unknown) {
    if (err instanceof Yup.ValidationError) {
      for (const e of err.inner) {
        if (e.path) {
          crossErrors.value[e.path] = e.message
        }
      }
    }
  }
}

function clearCrossFields(): void {
  crossPassword.value = ''
  crossConfirm.value = ''
  crossStartDate.value = null
  crossEndDate.value = null
  crossErrors.value = {}
  crossValid.value = false
}

// ============================================
// Section 4: Async Validation (debounced)
// ============================================

const asyncUsername = ref('')
const asyncEmail = ref('')
const asyncUsernameError = ref<string | null>(null)
const asyncEmailError = ref<string | null>(null)
const asyncUsernamePending = ref(false)
const asyncEmailPending = ref(false)

const TAKEN_USERNAMES = ['admin', 'user', 'test', 'demo', 'root']
const TAKEN_EMAILS = ['admin@example.com', 'test@example.com', 'user@example.com']

async function checkUsernameAvailability(username: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return !TAKEN_USERNAMES.includes(username.toLowerCase())
}

async function checkEmailAvailability(email: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 1200))
  return !TAKEN_EMAILS.includes(email.toLowerCase())
}

const asyncUsernameHelp = computed((): string | undefined => {
  if (asyncUsernamePending.value) return undefined
  if (asyncUsername.value && asyncUsername.value.length >= 3 && !asyncUsernameError.value) {
    return 'Username is available'
  }
  return 'Try: admin, user, test (taken)'
})

const asyncEmailHelp = computed((): string | undefined => {
  if (asyncEmailPending.value) return undefined
  if (
    asyncEmail.value &&
    !asyncEmailError.value &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(asyncEmail.value)
  ) {
    return 'Email is available'
  }
  return 'Try: admin@example.com (taken)'
})

let usernameTimer: ReturnType<typeof setTimeout>
let emailTimer: ReturnType<typeof setTimeout>

watch(asyncUsername, (newVal) => {
  clearTimeout(usernameTimer)
  asyncUsernameError.value = null
  asyncUsernamePending.value = false

  if (!newVal) {
    asyncUsernameError.value = 'Username is required'
    return
  }
  if (newVal.length < 3) {
    asyncUsernameError.value = 'Must be at least 3 characters'
    return
  }

  asyncUsernamePending.value = true
  usernameTimer = setTimeout(async () => {
    const available = await checkUsernameAvailability(newVal)
    asyncUsernamePending.value = false
    if (!available) {
      asyncUsernameError.value = 'Username is already taken'
    }
  }, 800)
})

watch(asyncEmail, (newVal) => {
  clearTimeout(emailTimer)
  asyncEmailError.value = null
  asyncEmailPending.value = false

  if (!newVal) {
    asyncEmailError.value = 'Email is required'
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(newVal)) {
    asyncEmailError.value = 'Invalid email format'
    return
  }

  asyncEmailPending.value = true
  emailTimer = setTimeout(async () => {
    const available = await checkEmailAvailability(newVal)
    asyncEmailPending.value = false
    if (!available) {
      asyncEmailError.value = 'Email is already registered'
    }
  }, 800)
})

// ============================================
// Section 5: Custom Validation Rules
// ============================================

const { value: customPassword, errorMessage: customPasswordError } = useField<string>(
  'customPassword',
  toTypedSchema(
    Yup.string()
      .required('Password is required')
      .min(8, 'Must be at least 8 characters')
      .test(
        'strong-password',
        'Password does not meet all strength requirements',
        isStrongPassword,
      ),
  ),
  { standalone: true },
)

const { value: customPhone, errorMessage: customPhoneError } = useField<string>(
  'customPhone',
  toTypedSchema(
    Yup.string()
      .required('Phone number is required')
      .matches(/^\+?[0-9]{10,15}$/, 'Phone must be 10-15 digits, optionally starting with +'),
  ),
  { standalone: true },
)

// Password strength computed properties
const passwordChecks = computed(() => {
  const pwd = customPassword.value || ''
  return {
    length: { passed: pwd.length >= 8, label: 'At least 8 characters' },
    uppercase: { passed: /[A-Z]/.test(pwd), label: 'Contains uppercase letter' },
    lowercase: { passed: /[a-z]/.test(pwd), label: 'Contains lowercase letter' },
    number: { passed: /\d/.test(pwd), label: 'Contains a number' },
    special: { passed: /[!@#$%^&*(),.?":{}|<>]/.test(pwd), label: 'Contains special character' },
  }
})

const strengthScore = computed(
  (): number => Object.values(passwordChecks.value).filter((c) => c.passed).length,
)

const strengthClass = computed((): string => {
  if (strengthScore.value <= 1) return 'strength-weak'
  if (strengthScore.value <= 2) return 'strength-fair'
  if (strengthScore.value <= 3) return 'strength-good'
  if (strengthScore.value <= 4) return 'strength-strong'
  return 'strength-excellent'
})

// ============================================
// Section 6: i18n Error Messages
// ============================================

const { t, locale } = useI18n()
const currentLocale = ref(locale.value)

const i18nName = ref('')
const i18nEmail = ref('')
const i18nNameError = ref<string | null>(null)
const i18nEmailError = ref<string | null>(null)

const localeOptions = [
  { label: 'English', value: 'en' },
  { label: 'Tiếng Việt', value: 'vi' },
  { label: '한국어', value: 'ko' },
]

// Sync locale changes
watch(currentLocale, (newLocale) => {
  locale.value = newLocale
  // Clear errors so user can re-validate with new locale
  i18nNameError.value = null
  i18nEmailError.value = null
})

function validateI18nForm(): void {
  i18nNameError.value = null
  i18nEmailError.value = null

  // Schema is created here so t() uses the current locale
  const schema = Yup.object({
    name: Yup.string()
      .required(t('validation.required', { field: t('user.name') }))
      .min(2, t('validation.minLength', { field: t('user.name'), min: 2 })),
    email: Yup.string()
      .required(t('validation.required', { field: t('user.email') }))
      .email(t('validation.email')),
  })

  try {
    schema.validateSync({ name: i18nName.value, email: i18nEmail.value }, { abortEarly: false })
    alert.success(t('common.success'), 'Validation passed!')
  } catch (err: unknown) {
    if (err instanceof Yup.ValidationError) {
      for (const e of err.inner) {
        if (e.path === 'name') i18nNameError.value = e.message
        if (e.path === 'email') i18nEmailError.value = e.message
      }
    }
  }
}

function clearI18nForm(): void {
  i18nName.value = ''
  i18nEmail.value = ''
  i18nNameError.value = null
  i18nEmailError.value = null
}

// ============================================
// Section 7: Error Summary (Multi-Error Message)
// ============================================

const summaryName = ref('')
const summaryEmail = ref('')
const summaryPhone = ref('')
const summaryWebsite = ref('')
const summaryPassword = ref('')
const summaryErrors = ref<string[]>([])
const summaryFieldErrors = ref<Record<string, string>>({})
const summaryValid = ref(false)

const summarySchema = Yup.object({
  name: Yup.string()
    .required('Full Name is required')
    .min(2, 'Full Name must be at least 2 characters'),
  email: Yup.string().required('Email is required').email('Invalid email format'),
  phone: Yup.string()
    .required('Phone is required')
    .matches(/^\+?[0-9]{10,15}$/, 'Phone must be 10-15 digits'),
  website: Yup.string().url('Website must be a valid URL'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .test(
      'strong-password',
      'Password must contain uppercase, lowercase, number, and special character',
      isStrongPassword,
    ),
})

async function validateSummaryForm(): Promise<void> {
  summaryErrors.value = []
  summaryFieldErrors.value = {}
  summaryValid.value = false

  try {
    await summarySchema.validate(
      {
        name: summaryName.value,
        email: summaryEmail.value,
        phone: summaryPhone.value,
        website: summaryWebsite.value || undefined,
        password: summaryPassword.value,
      },
      { abortEarly: false },
    )
    summaryValid.value = true
    alert.success('Valid', 'All fields are valid!')
  } catch (err: unknown) {
    const { messages, fieldErrors } = extractYupErrors(err)
    summaryErrors.value = messages
    summaryFieldErrors.value = fieldErrors
  }
}

function clearSummaryForm(): void {
  summaryName.value = ''
  summaryEmail.value = ''
  summaryPhone.value = ''
  summaryWebsite.value = ''
  summaryPassword.value = ''
  summaryErrors.value = []
  summaryFieldErrors.value = {}
  summaryValid.value = false
}
</script>

<style scoped lang="scss">
.validation-examples {
  margin: 0 auto;
}

.section-description {
  color: var(--p-text-muted-color);
  margin-bottom: 1rem;
  font-size: 0.9rem;

  code {
    font-family: monospace;
    font-size: 0.8rem;
    color: var(--p-primary-color);
    background: var(--p-surface-100);
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
  }
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

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.controls-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-meta-inline {
  display: flex;
  gap: 0.375rem;
  margin-left: auto;
}

.field-meta {
  display: flex;
  gap: 0.375rem;
  margin-top: 0.375rem;
}

// Async validation status
.async-status {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: var(--p-text-muted-color);
}

.hint-box {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  background: var(--p-surface-50);
  border: 1px solid var(--p-surface-200);
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: var(--p-text-muted-color);

  i {
    color: var(--p-primary-color);
    margin-top: 0.125rem;
  }

  code {
    font-family: monospace;
    font-size: 0.75rem;
    color: var(--p-primary-color);
    background: var(--p-surface-100);
    padding: 0.0625rem 0.25rem;
    border-radius: 3px;
  }
}

.hint-text {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: var(--p-text-muted-color);
}

// Password strength meter
.strength-meter {
  height: 6px;
  background: var(--p-surface-200);
  border-radius: 3px;
  margin-top: 0.5rem;
  overflow: hidden;
}

.strength-bar {
  height: 100%;
  border-radius: 3px;
  transition: all 0.3s ease;

  &.strength-weak {
    background: var(--p-red-500);
  }

  &.strength-fair {
    background: var(--p-orange-500);
  }

  &.strength-good {
    background: var(--p-yellow-500);
  }

  &.strength-strong {
    background: var(--p-green-400);
  }

  &.strength-excellent {
    background: var(--p-green-600);
  }
}

.strength-checks {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  color: var(--p-text-muted-color);
  transition: color 0.2s ease;

  i {
    font-size: 0.75rem;
  }

  &.valid {
    color: var(--p-green-600);
  }
}

// Error summary list inside Message
.error-summary-list {
  li {
    line-height: 1.5;
  }
}

// Locale switcher
.locale-switcher {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.locale-label {
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--p-text-color);
}

// Code blocks
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

// API Reference
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

// Raw output
.raw-details {
  margin-bottom: 1rem;

  summary {
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--p-primary-color);
    padding: 0.5rem 0;
    user-select: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.raw-output {
  background: var(--p-surface-950);
  border: 1px solid var(--p-surface-700);
  border-radius: 6px;
  padding: 0.75rem;
  overflow-x: auto;
  margin-top: 0.5rem;

  pre {
    margin: 0;
    font-family: monospace;
    font-size: 0.8rem;
    color: var(--p-surface-50);
    white-space: pre-wrap;
    line-height: 1.5;
  }
}

// Setup guide
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
