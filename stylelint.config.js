// =============================================================================
// Stylelint Configuration for Vue 3 + SCSS
// =============================================================================
// This configuration helps catch:
// - Magic colors (hardcoded color values)
// - CSS best practices violations
// - SCSS-specific issues
// =============================================================================
//
// SETUP INSTRUCTIONS:
// 1. Install dependencies (all packages are well-maintained with high download counts):
//    pnpm add -D stylelint stylelint-config-recommended-scss stylelint-config-recommended-vue postcss-html
//
//    Package stats (as of 2025):
//    - stylelint: Core linter (~5M weekly downloads)
//    - stylelint-config-recommended-scss: 2.5M weekly downloads, 344 dependents
//    - stylelint-config-recommended-vue: 166 dependents (official Vue support)
//    - postcss-html: Required for Vue SFC parsing
//
// 2. Add scripts to package.json:
//    "stylelint": "stylelint \"src/**/*.{vue,scss,css}\" --fix",
//    "stylelint:check": "stylelint \"src/**/*.{vue,scss,css}\""
//
// 3. (Optional) Add VS Code extension: stylelint.vscode-stylelint
// =============================================================================

/** @type {import('stylelint').Config} */
export default {
  // Use "recommended" configs instead of "standard" for better compatibility
  // "recommended" = only catches errors, no stylistic rules (works better with Prettier)
  // "standard" = recommended + opinionated stylistic rules (may conflict with Prettier)
  extends: [
    // SCSS support with recommended rules (bundles postcss-scss + stylelint-scss)
    'stylelint-config-recommended-scss',
    // Vue SFC support (bundles postcss-html) - MUST be last
    'stylelint-config-recommended-vue/scss',
  ],

  rules: {
    // =========================================================================
    // COLOR RULES - Prevent magic colors
    // =========================================================================

    // Disallow named colors (use CSS variables or design tokens instead)
    // e.g., "red", "blue" should be "var(--p-red-500)" or design tokens
    'color-named': [
      'never',
      {
        message: 'Use CSS variables instead of named colors (e.g., var(--p-red-500))',
      },
    ],

    // Prefer short hex colors (#fff instead of #ffffff)
    'color-hex-length': 'short',

    // =========================================================================
    // SELECTOR RULES
    // =========================================================================

    // Vue deep selectors are handled by stylelint-config-recommended-vue
    // No need to configure selector-pseudo-class-no-unknown manually

    // Limit selector specificity to prevent CSS wars
    'selector-max-id': 0,
    'selector-max-specificity': [
      '0,4,2',
      {
        message: 'Selector specificity too high. Consider using classes.',
      },
    ],

    // =========================================================================
    // VALUE RULES
    // =========================================================================

    // Disallow !important - disabled as utility classes need it
    // Enable if you want strict enforcement: 'declaration-no-important': true
    'declaration-no-important': null,

    // Font-family quotes - disable to avoid noise from different conventions
    'font-family-name-quotes': null,

    // =========================================================================
    // SCSS SPECIFIC (stylelint-scss rules)
    // =========================================================================

    // Naming conventions for SCSS variables
    'scss/dollar-variable-pattern': [
      '^[a-z][a-z0-9-]*$',
      {
        message: 'SCSS variables should be kebab-case (e.g., $my-variable)',
      },
    ],

    // =========================================================================
    // PERFORMANCE
    // =========================================================================

    // Limit nesting depth for better CSS performance and readability
    'max-nesting-depth': [
      3,
      {
        ignore: ['blockless-at-rules', 'pseudo-classes'],
        message: 'Nesting too deep (max 3). Consider flattening your CSS structure.',
      },
    ],

    // =========================================================================
    // DISABLED RULES (Prettier compatibility & flexibility)
    // =========================================================================

    // Allow any class naming patterns (BEM, PrimeVue, etc.)
    'selector-class-pattern': null,

    // Allow any custom property naming (PrimeVue uses --p-*)
    'custom-property-pattern': null,

    // Disable at-rule-no-unknown - handled by stylelint-config-recommended-scss
    'at-rule-no-unknown': null,

    // Allow empty <style> blocks in Vue components (common for template-only components)
    'no-empty-source': null,

    // Allow deprecated properties (like 'clip' in visually-hidden patterns)
    // These are intentionally used for legacy browser support
    'property-no-deprecated': null,
  },

  // Ignore patterns
  ignoreFiles: ['**/dist/**', '**/node_modules/**', '**/coverage/**', '**/*.min.css'],
}
