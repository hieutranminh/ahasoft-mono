import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import pluginVue from 'eslint-plugin-vue'

// =============================================================================
// ESLint Configuration for Vue 3 + TypeScript Production Application
// =============================================================================
// This configuration is optimized for:
// - Vue 3 Composition API with <script setup>
// - TypeScript strict mode
// - Large-scale team development with i18n
// - CI/CD pipeline integration
// =============================================================================

// CI environment detection for stricter rules in CI pipeline
const isCI = process.env.CI === 'true'

export default defineConfigWithVueTs(
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. FILE TARGETING
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/.git/**',
      '**/public/**',
      '**/*.config.*.timestamp-*',
      '**/components.d.ts',
      '**/auto-imports.d.ts',
      '**/__snapshots__/**',
      // Example/demo components - not production code
      '**/src/components/template/**',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. BASE PRESETS
  // ═══════════════════════════════════════════════════════════════════════════
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. SECURITY RULES (Always Error - Critical)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'app/security',
    rules: {
      // Prevent dynamic code execution (XSS vectors)
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',

      // Warn about v-html usage (XSS risk - should be reviewed)
      'vue/no-v-html': 'warn',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. VUE 3 COMPOSITION API RULES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'app/vue-composition',
    rules: {
      // ========= Enforce modern Vue 3 patterns =========
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/block-lang': ['error', { script: { lang: 'ts' } }],
      'vue/define-emits-declaration': ['error', 'type-based'],
      'vue/define-props-declaration': ['error', 'type-based'],

      // ========= Prevent common reactivity mistakes =========
      // Prevents destructuring props without toRefs (breaks reactivity)
      'vue/no-setup-props-reactivity-loss': 'error',
      // Prevents using ref without .value (common mistake)
      'vue/no-ref-as-operand': 'error',
      // Prevents watch() after await (watcher won't be cleaned up)
      'vue/no-watch-after-await': 'error',
      // Prevents lifecycle hooks after await (won't be bound to component)
      'vue/no-lifecycle-after-await': 'error',

      // ========= Component naming & structure =========
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: ['App', 'Index'],
        },
      ],
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: false,
        },
      ],
      'vue/custom-event-name-casing': ['error', 'camelCase'],

      // ========= Template best practices =========
      'vue/no-unused-vars': 'error',
      'vue/prefer-true-attribute-shorthand': 'error',
      'vue/prefer-import-from-vue': 'error',
      // Require explicit keys in v-for
      'vue/require-v-for-key': 'error',
      // Prevent v-if and v-for on same element (performance issue)
      'vue/no-use-v-if-with-v-for': 'error',

      // ========= Enforce attribute ordering for readability =========
      'vue/attributes-order': [
        'warn',
        {
          order: [
            'DEFINITION', // is, v-is
            'LIST_RENDERING', // v-for
            'CONDITIONALS', // v-if, v-else-if, v-else, v-show, v-cloak
            'RENDER_MODIFIERS', // v-pre, v-once
            'GLOBAL', // id
            ['UNIQUE', 'SLOT'], // ref, key, v-slot
            'TWO_WAY_BINDING', // v-model
            'OTHER_DIRECTIVES', // custom directives
            'OTHER_ATTR', // all unspecified attributes
            'EVENTS', // @click, v-on
            'CONTENT', // v-text, v-html
          ],
          alphabetical: false,
        },
      ],

      // ========= Disable Vue 2 specific rules (not applicable to Vue 3) =========
      'vue/no-multiple-template-root': 'off',
      'vue/no-v-model-argument': 'off',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. VUE TEMPLATE STYLE & CSS RULES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'app/vue-style',
    rules: {
      // ========= Static class ordering (better CSS specificity management) =========
      // Warn when static classes are placed after dynamic :class binding
      'vue/prefer-separate-static-class': 'warn',

      // ========= Scoped styles best practices =========
      // Require scoped attribute on <style> to prevent CSS leaks
      // Set to 'warn' as global styles are sometimes needed intentionally
      'vue/enforce-style-attribute': [
        'warn',
        {
          allow: ['scoped'],
        },
      ],

      // ========= Prevent unused CSS variables in v-bind =========
      // Detects when CSS variables bound with v-bind() are never defined
      'vue/no-useless-v-bind': 'error',

      // ========= Component structure ordering =========
      // Enforce consistent order: template > script > style
      'vue/block-order': [
        'error',
        {
          order: ['template', 'script', 'style'],
        },
      ],

      // ========= Prevent redundant mustache interpolation =========
      // {{ "static text" }} should just be static text
      'vue/no-useless-mustaches': 'error',

      // ========= Prevent duplicate attributes =========
      'vue/no-duplicate-attributes': [
        'error',
        {
          allowCoexistClass: true,
          allowCoexistStyle: true,
        },
      ],

      // ========= Prevent inline styles (prefer CSS classes) =========
      // Warn on static inline styles - they're harder to maintain
      'vue/no-static-inline-styles': 'warn',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. I18N & HARDCODED STRINGS RULES
  // ═══════════════════════════════════════════════════════════════════════════
  // Helps identify hardcoded text that should use $t() for translations
  {
    name: 'app/i18n-guidelines',
    rules: {
      // ========= Detect bare strings in templates =========
      // This rule has limited configurability in eslint-plugin-vue
      // For comprehensive i18n linting, consider: @intlify/eslint-plugin-vue-i18n
      // Install: pnpm add -D @intlify/eslint-plugin-vue-i18n
      //
      // Disabled because the rule's attribute ignore configuration doesn't work well
      // and causes too many false positives for technical attributes
      // 'vue/no-bare-strings-in-template': 'off',

      // ========= Warn on static text in accessibility attributes =========
      // These attributes should typically use $t() for translations
      'vue/no-restricted-static-attribute': [
        'warn',
        {
          key: 'title',
          message: 'Consider using :title="$t(\'...\')" for translatable title attributes.',
        },
        {
          key: 'aria-label',
          message:
            'Consider using :aria-label="$t(\'...\')" for translatable aria-label attributes.',
        },
        {
          key: 'placeholder',
          message: 'Consider using :placeholder="$t(\'...\')" for translatable placeholders.',
        },
        {
          key: 'label',
          message: 'Consider using :label="$t(\'...\')" for translatable labels.',
        },
        {
          key: 'alt',
          message: 'Consider using :alt="$t(\'...\')" for translatable alt text.',
        },
      ],

      // ========= Prefer defineOptions for component options =========
      'vue/prefer-define-options': 'error',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. TYPESCRIPT STRICT RULES (Always Error - Critical for type safety)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'app/typescript-strict',
    rules: {
      // ========= Type imports - critical for bundle optimization =========
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/consistent-type-exports': [
        'error',
        {
          fixMixedExportsWithInlineTypeSpecifier: true,
        },
      ],

      // ========= Unused code detection =========
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // ========= Controlled ts-comments =========
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': true,
          'ts-nocheck': true,
          'ts-check': false,
          minimumDescriptionLength: 10,
        },
      ],

      // ========= Exhaustive checks - prevent missing cases =========
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. ASYNC/PROMISE SAFETY RULES (Critical for runtime stability)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'app/async-safety',
    rules: {
      // ========= Prevent unhandled promise rejections =========
      // Requires all promises to be handled (with await, .then, .catch, or void)
      '@typescript-eslint/no-floating-promises': [
        'error',
        {
          ignoreVoid: true, // Allow void operator for intentionally ignored promises
          ignoreIIFE: true, // Allow IIFE for lifecycle hooks
        },
      ],

      // ========= Prevent common promise mistakes =========
      // Prevents passing async functions where sync callbacks are expected
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            // Allow async event handlers in Vue (common pattern)
            attributes: false,
          },
        },
      ],

      // ========= Prevent awaiting non-Promise values =========
      '@typescript-eslint/await-thenable': 'error',

      // ========= Require returning promises in async functions =========
      // Warns when async function doesn't return a value (missing return)
      '@typescript-eslint/require-await': 'warn',

      // ========= Prefer async/await over raw promises =========
      // Encourages cleaner async code with try/catch
      '@typescript-eslint/promise-function-async': 'off', // Too strict for composables

      // ========= Ensure proper promise rejection handling =========
      // Warns when rejecting with non-Error objects
      '@typescript-eslint/prefer-promise-reject-errors': 'warn',

      // ========= Prevent returning value in Promise executor =========
      // new Promise(resolve => { return value }) - the return is ignored
      'no-promise-executor-return': 'error',

      // ========= Prevent nested callbacks (callback hell prevention) =========
      'max-nested-callbacks': ['warn', { max: 3 }],

      // ========= Require error handling in callbacks =========
      // For Node.js style callbacks (error, result)
      'n/handle-callback-err': 'off', // Not applicable for frontend
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. TYPESCRIPT SOFT RULES (Guidelines - Warn in dev, Error in CI)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'app/typescript-soft',
    rules: {
      // ========= Type safety warnings - stricter in CI =========
      '@typescript-eslint/no-explicit-any': isCI ? 'error' : 'warn',
      '@typescript-eslint/no-non-null-assertion': isCI ? 'error' : 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',

      // ========= Modern syntax preferences =========
      '@typescript-eslint/prefer-nullish-coalescing': [
        'warn',
        {
          ignoreConditionalTests: true,
          ignoreMixedLogicalExpressions: true,
        },
      ],
      '@typescript-eslint/prefer-optional-chain': 'warn',

      // ========= Naming conventions =========
      '@typescript-eslint/naming-convention': [
        'warn',
        // Interfaces should be PascalCase (not I prefix)
        { selector: 'interface', format: ['PascalCase'] },
        // Type aliases should be PascalCase
        { selector: 'typeAlias', format: ['PascalCase'] },
        // Enum members should be PascalCase or UPPER_CASE
        { selector: 'enumMember', format: ['PascalCase', 'UPPER_CASE'] },
      ],

      // ========= Turn off - handled by TypeScript or too restrictive =========
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. IMPORT ORDER RULES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'app/import-order',
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // 1. Vue core ecosystem
            ['^vue$', '^vue-router', '^vue-i18n', '^pinia'],
            // 2. Third-party libraries
            ['^@?\\w'],
            // 3. Stores
            ['^@/stores'],
            // 4. Composables
            ['^@/composables'],
            // 5. Constants & Config (static values)
            ['^@/constants', '^@/config'],
            // 6. Other internal modules (api, schemas, utils, plugins, router, locales...)
            ['^@/'],
            // 7. Type-only imports from @/types (compile-time only, stripped at build)
            ['^@/types'],
            // 8. Relative imports
            ['^\\.'],
            // 9. Side-effect imports (CSS, SCSS, polyfills)
            ['^.+\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 11. CODE QUALITY RULES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'app/code-quality',
    rules: {
      // ========= Production code - prevent debug artifacts =========
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-console': [
        isCI ? 'error' : 'warn',
        {
          allow: ['warn', 'error'],
        },
      ],

      // ========= Modern JavaScript best practices =========
      'no-var': 'error',
      'prefer-const': 'error',
      'object-shorthand': ['error', 'always'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],

      // ========= Prevent common mistakes =========
      'no-self-compare': 'error',
      'no-template-curly-in-string': 'warn',
      'no-unmodified-loop-condition': 'error',

      // ========= Complexity controls =========
      // Warn when functions get too complex (consider refactoring)
      complexity: ['warn', { max: 15 }],
      // Limit depth of nested blocks
      'max-depth': ['warn', { max: 4 }],

      // ========= Best practices =========
      'default-case-last': 'error',
      'grouped-accessor-pairs': ['error', 'getBeforeSet'],
      'no-constructor-return': 'error',
      'no-return-assign': ['error', 'except-parens'],
      'prefer-object-has-own': 'error',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 12. TEST FILES CONFIGURATION (Relaxed rules for test flexibility)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'app/test-files',
    files: ['**/*.test.ts', '**/*.spec.ts', '**/test/**/*.ts', '**/__tests__/**/*.ts'],
    rules: {
      // Allow any in test files for mocking flexibility
      '@typescript-eslint/no-explicit-any': 'off',
      // Allow non-null assertions for cleaner test assertions
      '@typescript-eslint/no-non-null-assertion': 'off',
      // Allow console in tests for debugging
      'no-console': 'off',
      // Allow more complexity in tests
      complexity: 'off',
      'max-nested-callbacks': 'off',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 13. EXAMPLE/DEMO FILES CONFIGURATION (Relaxed i18n rules)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'app/example-files',
    files: ['**/template/**/*.vue', '**/examples/**/*.vue', '**/demo/**/*.vue'],
    rules: {
      // Allow hardcoded strings in example/demo files
      'vue/no-restricted-static-attribute': 'off',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 14. PRETTIER INTEGRATION (Skip formatting rules)
  // ═══════════════════════════════════════════════════════════════════════════
  skipFormatting,
)
