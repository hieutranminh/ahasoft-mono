<template>
  <div class="form-examples">
    <!-- Input Text Fields Section -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-pencil" />
        Input Text Field
      </h3>
      <p class="section-description">
        Text input component with label, placeholder, and validation support.
      </p>
      <div class="demo-grid">
        <InputTextField
          v-model="formData.username"
          name="username"
          label="Username"
          placeholder="Enter username"
          help-text="Your unique username"
          required
        />
        <InputTextField
          v-model="formData.email"
          name="email"
          label="Email"
          placeholder="Enter email"
          :error="emailError"
          required
        />
        <InputTextField
          v-model="formData.disabledField"
          name="disabledField"
          label="Disabled Field"
          placeholder="Cannot edit"
          disabled
        />
      </div>
      <div class="code-block">
        <pre><code>&lt;InputTextField
  v-model="username"
  name="username"
  label="Username"
  placeholder="Enter username"
  help-text="Your unique username"
  required
/&gt;

&lt;!-- With error --&gt;
&lt;InputTextField
  v-model="email"
  name="email"
  label="Email"
  :error="emailError"
/&gt;</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Input Number Field Section -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-calculator" />
        Input Number Field
      </h3>
      <p class="section-description">
        Numeric input with formatting options using vue-currency-input. Supports decimal and
        currency modes with locale-aware formatting.
      </p>
      <div class="demo-grid">
        <InputNumberField
          v-model="formData.quantity"
          name="quantity"
          label="Quantity (with min/max)"
          placeholder="Enter quantity"
          :min="0"
          :max="100"
          :precision="0"
        />
        <InputNumberField
          v-model="formData.amount"
          name="amount"
          label="Amount (no limit)"
          placeholder="Enter amount"
          :precision="0"
        />
        <InputNumberField
          v-model="formData.price"
          name="price"
          label="Price (USD)"
          mode="currency"
          currency="USD"
          locale="en-US"
        />
      </div>
      <div class="code-block">
        <pre><code>&lt;InputNumberField
  v-model="quantity"
  name="quantity"
  label="Quantity"
  :min="0"
  :max="100"
  :precision="0"
/&gt;

&lt;!-- Currency mode --&gt;
&lt;InputNumberField
  v-model="price"
  name="price"
  label="Price"
  mode="currency"
  currency="USD"
  locale="en-US"
/&gt;</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Password Field Section -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-lock" />
        Password Field
      </h3>
      <p class="section-description">
        Password input with toggle mask and optional strength feedback.
      </p>
      <div class="demo-grid">
        <PasswordField
          v-model="formData.password"
          name="password"
          label="Password"
          placeholder="Enter password"
          required
        />
        <PasswordField
          v-model="formData.passwordWithFeedback"
          name="passwordWithFeedback"
          label="Password with Feedback"
          feedback
          help-text="Strength indicator enabled"
        />
        <PasswordField
          v-model="formData.confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          :error="passwordMatchError"
        />
      </div>
      <div class="code-block">
        <pre><code>&lt;PasswordField
  v-model="password"
  name="password"
  label="Password"
  required
/&gt;

&lt;!-- With strength feedback --&gt;
&lt;PasswordField
  v-model="password"
  name="password"
  label="Password"
  feedback
/&gt;</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Date Picker Field Section -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-calendar" />
        Date Picker Field
      </h3>
      <p class="section-description">Date picker with different modes: date, dateTime, and time.</p>
      <div class="demo-grid">
        <DatePickerField
          v-model="formData.birthDate"
          name="birthDate"
          label="Birth Date"
          placeholder="Select date"
          required
        />
      </div>
      <div class="code-block">
        <pre><code>&lt;DatePickerField
  v-model="birthDate"
  name="birthDate"
  label="Birth Date"
  placeholder="Select date"
  required
/&gt;</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Select Field Section -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-list" />
        Select Field
      </h3>
      <p class="section-description">
        Dropdown select with filtering, clear button, and custom templates.
      </p>
      <div class="demo-grid">
        <SelectField
          v-model="formData.country"
          name="country"
          label="Country"
          :options="countryOptions"
          placeholder="Select a country"
          required
        />
        <SelectField
          v-model="formData.countryWithFilter"
          name="countryWithFilter"
          label="Country (Filterable)"
          :options="countryOptions"
          filter
          show-clear
        />
        <SelectField
          v-model="formData.status"
          name="status"
          label="Status"
          :options="statusOptions"
        />
      </div>
      <div class="code-block">
        <pre><code>&lt;SelectField
  v-model="country"
  name="country"
  label="Country"
  :options="countryOptions"
  required
/&gt;

&lt;!-- With filter --&gt;
&lt;SelectField
  v-model="country"
  name="country"
  label="Country"
  :options="countryOptions"
  filter
  show-clear
/&gt;

// Options format
const countryOptions = [
  { label: 'Vietnam', value: 'VN' },
  { label: 'United States', value: 'US' },
]</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Multi Select Field Section -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-check-square" />
        Multi Select Field
      </h3>
      <p class="section-description">
        Multi-selection dropdown with chip display and selection limit.
      </p>
      <div class="demo-grid">
        <MultiSelectField
          v-model="formData.skills"
          name="skills"
          label="Skills"
          :options="skillOptions"
          placeholder="Select skills"
          display="chip"
        />
        <MultiSelectField
          v-model="formData.categories"
          name="categories"
          label="Categories (Max 3)"
          :options="categoryOptions"
          :selection-limit="3"
          filter
          help-text="Select up to 3 categories"
        />
        <MultiSelectField
          v-model="formData.cities"
          name="cities"
          label="Cities (Custom Label)"
          :options="cityOptions"
          :max-selected-labels="1"
          :selected-items-label="getSelectedItemsLabel(formData.cities.length, cityOptions.length)"
          filter
          help-text="Shows '{n} items selected' or 'All' when all selected"
        />
      </div>
      <div class="code-block">
        <pre><code>&lt;MultiSelectField
  v-model="skills"
  name="skills"
  label="Skills"
  :options="skillOptions"
  display="chip"
/&gt;

&lt;!-- With selection limit --&gt;
&lt;MultiSelectField
  v-model="categories"
  name="categories"
  label="Categories"
  :options="categoryOptions"
  :selection-limit="3"
/&gt;

&lt;!-- Custom selected items label --&gt;
&lt;MultiSelectField
  v-model="cities"
  name="cities"
  label="Cities"
  :options="cityOptions"
  :max-selected-labels="1"
  :selected-items-label="getSelectedItemsLabel(cities.length, cityOptions.length)"
/&gt;

// Helper function for custom label
function getSelectedItemsLabel(selected: number, total: number): string {
  if (selected === total) return 'All'
  return `${selected} items selected`
}

</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Textarea Field Section -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-align-left" />
        Textarea Field
      </h3>
      <p class="section-description">Multi-line text input with auto-resize option.</p>
      <div class="demo-grid">
        <TextareaField
          v-model="formData.description"
          name="description"
          label="Description"
          placeholder="Enter description..."
          :rows="4"
        />
        <TextareaField
          v-model="formData.notes"
          name="notes"
          label="Notes (Auto Resize)"
          placeholder="Start typing..."
          auto-resize
          help-text="Textarea will grow as you type"
        />
      </div>
      <div class="code-block">
        <pre><code>&lt;TextareaField
  v-model="description"
  name="description"
  label="Description"
  :rows="4"
/&gt;

&lt;!-- Auto resize --&gt;
&lt;TextareaField
  v-model="notes"
  name="notes"
  label="Notes"
  auto-resize
/&gt;</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Checkbox Field Section -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-check" />
        Checkbox Field
      </h3>
      <p class="section-description">Binary checkbox for boolean values.</p>
      <div class="demo-row">
        <CheckboxField
          v-model="formData.agreeTerms"
          name="agreeTerms"
          label="I agree to the terms and conditions"
          required
        />
        <CheckboxField
          v-model="formData.subscribe"
          name="subscribe"
          label="Subscribe to newsletter"
        />
      </div>
      <div class="code-block">
        <pre><code>&lt;CheckboxField
  v-model="agreeTerms"
  name="agreeTerms"
  label="I agree to the terms"
  required
/&gt;</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Radio Field Section -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-circle" />
        Radio Field
      </h3>
      <p class="section-description">Radio button group for single selection from options.</p>
      <div class="demo-grid">
        <RadioField
          v-model="formData.gender"
          name="gender"
          label="Gender"
          :options="genderOptions"
          horizontal
        />
        <RadioField
          v-model="formData.priority"
          name="priority"
          label="Priority"
          :options="priorityOptions"
        />
      </div>
      <div class="code-block">
        <pre><code>&lt;RadioField
  v-model="gender"
  name="gender"
  label="Gender"
  :options="genderOptions"
  horizontal
/&gt;

// Options format
const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
]</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Toggle Switch Field Section -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-sliders-h" />
        Toggle Switch Field
      </h3>
      <p class="section-description">Toggle switch for on/off states.</p>
      <div class="demo-row">
        <ToggleSwitchField
          v-model="formData.notifications"
          name="notifications"
          label="Enable notifications"
        />
        <ToggleSwitchField
          v-model="formData.darkMode"
          name="darkMode"
          label="Dark mode"
          help-text="Toggle dark theme"
        />
      </div>
      <div class="code-block">
        <pre><code>&lt;ToggleSwitchField
  v-model="notifications"
  name="notifications"
  label="Enable notifications"
/&gt;</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Input Mask Field Section -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-hashtag" />
        Input Mask Field
      </h3>
      <p class="section-description">
        Masked input for formatted data like phone numbers, dates, etc.
      </p>
      <div class="demo-grid">
        <InputMaskField
          v-model="formData.phone"
          name="phone"
          label="Phone Number"
          mask="(999) 999-9999"
          placeholder="(___) ___-____"
        />
        <InputMaskField
          v-model="formData.creditCard"
          name="creditCard"
          label="Credit Card"
          mask="9999-9999-9999-9999"
          placeholder="____-____-____-____"
        />
      </div>
      <div class="code-block">
        <pre><code>&lt;InputMaskField
  v-model="phone"
  name="phone"
  label="Phone Number"
  mask="(999) 999-9999"
  placeholder="(___) ___-____"
/&gt;

// Mask patterns:
// 9 = digit (0-9)
// a = letter (a-z, A-Z)
// * = alphanumeric</code></pre>
      </div>
    </div>

    <Divider />

    <!-- Editor Field Section -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-file-edit" />
        Editor Field
      </h3>
      <p class="section-description">Rich text editor for formatted content.</p>
      <div class="demo-single">
        <EditorField
          v-model="formData.content"
          name="content"
          label="Content"
          placeholder="Write your content here..."
        />
      </div>
      <div class="code-block">
        <pre><code>&lt;EditorField
  v-model="content"
  name="content"
  label="Content"
  placeholder="Write your content..."
/&gt;</code></pre>
      </div>
    </div>

    <Divider />

    <!-- API Reference Section -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-book" />
        Common Props (All Fields)
      </h3>
      <div class="api-grid">
        <div class="api-group">
          <h4 class="group-title">Required Props</h4>
          <div class="api-list">
            <div class="api-item">
              <code>name: string</code>
              <span>Unique field identifier (required)</span>
            </div>
          </div>
        </div>
        <div class="api-group">
          <h4 class="group-title">Common Props</h4>
          <div class="api-list">
            <div class="api-item">
              <code>v-model</code>
              <span>Two-way binding value</span>
            </div>
            <div class="api-item">
              <code>label?: string</code>
              <span>Field label text</span>
            </div>
            <div class="api-item">
              <code>placeholder?: string</code>
              <span>Placeholder text</span>
            </div>
            <div class="api-item">
              <code>helpText?: string</code>
              <span>Help text below field</span>
            </div>
          </div>
        </div>
        <div class="api-group">
          <h4 class="group-title">State Props</h4>
          <div class="api-list">
            <div class="api-item">
              <code>error?: string</code>
              <span>Error message to display</span>
            </div>
            <div class="api-item">
              <code>disabled?: boolean</code>
              <span>Disable the field</span>
            </div>
            <div class="api-item">
              <code>required?: boolean</code>
              <span>Show required indicator (*)</span>
            </div>
            <div class="api-item">
              <code>size?: 'small' | 'large'</code>
              <span>Field size variant</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Divider />

    <!-- Form Data Preview -->
    <div class="format-section">
      <h3 class="section-title">
        <i class="pi pi-database" />
        Form Data Preview
      </h3>
      <details class="raw-details" open>
        <summary>View Raw JSON</summary>
        <div class="raw-output">
          <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  InputTextField,
  InputNumberField,
  PasswordField,
  SelectField,
  MultiSelectField,
  TextareaField,
  CheckboxField,
  DatePickerField,
  RadioField,
  ToggleSwitchField,
  InputMaskField,
  EditorField,
} from '@/components/common'

// Form data state
const formData = ref({
  // Text fields
  username: '',
  email: '',
  disabledField: 'Read only value',
  // Number fields
  quantity: 1,
  amount: null as number | null,
  price: 99.99,
  // Password fields
  password: '',
  passwordWithFeedback: '',
  confirmPassword: '',
  // Date fields
  birthDate: null as Date | null,
  // Select fields
  country: null as string | null,
  countryWithFilter: null as string | null,
  status: null as string | null,
  skills: [] as string[],
  categories: [] as string[],
  cities: [] as string[],
  // Text area
  description: '',
  notes: '',
  // Checkbox
  agreeTerms: false,
  subscribe: true,
  // Radio
  gender: null as string | null,
  priority: null as string | null,
  // Toggle switch
  notifications: true,
  darkMode: false,
  // Input mask
  phone: '',
  creditCard: '',
  // Editor
  content: '',
})

// Demo validation errors
const emailError = computed((): string | null => {
  if (formData.value.email && !formData.value.email.includes('@')) {
    return 'Please enter a valid email address'
  }
  return null
})

const passwordMatchError = computed((): string | null => {
  if (
    formData.value.confirmPassword &&
    formData.value.confirmPassword !== formData.value.password
  ) {
    return 'Passwords do not match'
  }
  return null
})

// Select options
const countryOptions = [
  { label: 'Vietnam', value: 'VN' },
  { label: 'United States', value: 'US' },
  { label: 'Japan', value: 'JP' },
  { label: 'South Korea', value: 'KR' },
  { label: 'Singapore', value: 'SG' },
  { label: 'Thailand', value: 'TH' },
]

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' },
]

const skillOptions = [
  { label: 'Vue.js', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Node.js', value: 'nodejs' },
  { label: 'Python', value: 'python' },
]

const categoryOptions = [
  { label: 'Technology', value: 'tech' },
  { label: 'Design', value: 'design' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Sales', value: 'sales' },
  { label: 'Support', value: 'support' },
]

const cityOptions = [
  { label: 'Ho Chi Minh', value: 'hcm' },
  { label: 'Ha Noi', value: 'hn' },
  { label: 'Da Nang', value: 'dn' },
  { label: 'Can Tho', value: 'ct' },
  { label: 'Hai Phong', value: 'hp' },
]

// Helper function for custom selected items label
function getSelectedItemsLabel(selectedCount: number, totalCount: number): string {
  if (selectedCount === totalCount) return 'All'
  return `${selectedCount} items selected`
}

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]

const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
]
</script>

<style scoped lang="scss">
.form-examples {
  margin: 0 auto;
}

.section-description {
  color: var(--p-text-muted-color);
  margin-bottom: 1rem;
  font-size: 0.9rem;
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

.demo-row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.demo-single {
  margin-bottom: 1rem;
}

.code-block {
  background: var(--p-surface-900);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;

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

.raw-details {
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
</style>
