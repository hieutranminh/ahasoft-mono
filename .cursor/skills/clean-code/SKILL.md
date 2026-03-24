---
name: clean-code
description: The Foundation Skill. LLM Firewall + 2025 Security + Cross-Skill Coordination. Use for ALL code output - prevents hallucinations, enforces security, ensures quality.
---

<domain_overview>

# 🛡️ CLEAN CODE: THE FOUNDATION

> **Philosophy:** This skill is the baseline for all code output. It enforces reliability, security, and maintainability for production systems.
> **ALGORITHMIC ELEGANCE MANDATE (CRITICAL):** Prefer intent-revealing, boring code over clever abstractions. Reject any implementation that increases cognitive complexity without clear performance or scalability benefit. Use proven patterns over hype.
> </domain_overview>
> <iron_laws>

## 🚨 IRON LAWS

```
1. NO HALLUCINATED PACKAGES OR APIS - Verify before usage
2. NO SECURITY SHORTCUTS - Threat model first, safe defaults always
3. NO INCOMPLETE LOGIC IN PROTECTED BRANCHES - Runnable and testable code only
4. NO OVER-ENGINEERING - Choose the simplest sufficient design
5. NO TYPE BLIND SPOTS - Critical paths must be strictly typed
```

</iron_laws>
<security_protocols>

## 📦 PROTOCOL 1: SUPPLY CHAIN SECURITY

LLMs can hallucinate dependencies and API surfaces. Verify before adding or importing.

1. **Verify package legitimacy** - check registry, maintenance activity, and issue history
2. **Prefer mature ecosystem choices** - avoid niche packages for core concerns
3. **Run security checks** - `pnpm audit` (or project equivalent) in CI and before merge
4. **Lockfile is mandatory** - rely on reviewed lockfile changes, not ad-hoc installs
5. **Check license compatibility** for production distribution
   **AI-related package risks:**

- Use official vendor SDKs for model providers
- Avoid unverified AI wrappers in critical code paths
- Validate generated integration code against official docs

## 🔐 PROTOCOL 2: SECURITY-FIRST DEFAULTS

**Frontend Security:**
| Forbidden | Required |
|-----------|----------|
| `eval()`, `new Function()`, dynamic script injection | Static code and trusted build artifacts |
| Rendering unsanitized HTML | Sanitization (DOMPurify or equivalent) with allowlist |
| Missing CSP in production | CSP with nonce/hash strategy and monitoring |
| Blind token storage decisions | Session design based on threat model (BFF/httpOnly preferred for web) |
**Backend Security:**
| Forbidden | Required |
|-----------|----------|
| `CORS: *` on private APIs | Explicit origin allowlist |
| Raw SQL concatenation | Parameterized queries |
| Hardcoded secrets | Secret manager or validated environment variables |
| Silent auth failures | Explicit authz/authn errors with audit context |
**API Security (2025):**

- Rate limiting on ALL public endpoints
- Input validation at boundary (Zod/Valibot/Pydantic)
- Output encoding/sanitization when rendering untrusted content
- Use JWT or PASETO based on interoperability, threat model, and platform constraints
  </security_protocols>
  <modularity_and_placeholder_rules>

## 🏗️ PROTOCOL 3: COMPLETENESS & DELIVERY QUALITY

**Forbidden in protected branches (main/release/hotfix):**

```javascript
// ❌ BANNED
// TODO: Implement this
// ... logic goes here
function placeholder() {}
throw new Error('Not implemented')
```

**Allowed only when controlled:**

- Temporary TODOs must include ticket ID and removal criteria
- Stubs are allowed only in draft branches with explicit scope and tests guarding usage
  **Required before merge:**
- Every shipped function is runnable in target environment
- Edge cases are handled or explicitly rejected with actionable errors
- Behavior changes include tests proportional to risk

## 📐 PROTOCOL 4: MODULARITY & STRUCTURE

**Complexity Heuristics (guidelines, not hard law):**

- Functions above ~50 lines require justification
- Files above ~300 lines should be reviewed for split opportunities
  **Frontend-first architecture preference:**
- Functional core + imperative shell
- Isolate side effects in clear boundaries (API, storage, router, DOM)
- Prefer composables and pure utilities over class-heavy structures

**SOLID Principles:**
| Principle | Quick Check |
|-----------|-------------|
| **S**ingle Responsibility | Does this do ONE thing? |
| **O**pen/Closed | Can I extend without modifying? |
| **L**iskov Substitution | Can subtypes replace parent? |
| **I**nterface Segregation | Are interfaces minimal? |
| **D**ependency Inversion | Do I depend on abstractions? |
</modularity_and_placeholder_rules>
<complexity_and_dependencies>

## 🎯 PROTOCOL 5: COMPLEXITY CAP

**Native First:**

```javascript
// ❌ Don't install is-odd
npm install is-odd
// ✅ Use native
const isOdd = n => n % 2 !== 0;
```

**Anti-Patterns:**

- AbstractFactoryBuilderManager for simple functions
- 10 layers of abstraction for CRUD
- "Future-proofing" for requirements that don't exist
  **YAGNI:** You Aren't Gonna Need It. Build for today's requirements.

## 🔄 PROTOCOL 6: DEPENDENCY HYGIENE

**Freshness and Safety Checks:**

```bash
pnpm outdated      # Check updates
pnpm audit         # Check vulnerabilities
```

**Policy:**

- "Latest" is not always "safest"
- If update introduces critical risk, block and document decision
- Security fixes outrank feature upgrades
  **Recommended Frontend Stack Defaults (Vue ecosystem):**
  | Category | Recommended |
  |----------|-------------|
  | Validation | yup, zod, valibot |
  | HTTP | ofetch, ky |
  | State | pinia |
  | Router | vue-router |
  | Schema/API | openapi-typescript, typed clients |
  </complexity_and_dependencies>
  <frontend_production_gates>

## ✅ PROTOCOL 7: FRONTEND PRODUCTION GATES

**These checks are required before merge to protected branches:**

1. **Type safety gate** - `tsc`/`vue-tsc --noEmit` passes; no unchecked `any` in domain boundaries
2. **Quality gate** - lint and format checks pass in CI
3. **Test gate** - changed behavior is covered by unit/integration tests; critical user journeys have smoke e2e
4. **Performance gate** - bundle size and web vitals budgets are tracked and enforced
5. **Accessibility gate** - semantic HTML, keyboard navigation, and automated a11y checks
6. **Observability gate** - error tracking, request correlation, and actionable logs
   </frontend_production_gates>
   <ai_era_protocols>

## 🤖 PROTOCOL 8: AI-ERA CONSIDERATIONS

**When Building AI Features:**

1. **Validate AI outputs** - Never trust raw LLM responses
2. **Rate limit AI calls** - Prevent cost explosions
3. **Sanitize before display** - AI can generate malicious content
4. **Log AI interactions** - For debugging and compliance
   **When AI is Writing Code:**
5. **Verify imports exist** - AI hallucinates packages
6. **Check types are correct** - AI guesses at APIs
7. **Test edge cases** - AI misses boundary conditions
8. **Review security** - AI takes shortcuts
   </ai_era_protocols>
   <audit_and_reference>

## ✅ QUICK AUDIT CHECKLIST

Before committing ANY code:

- [ ] No hallucinated imports (verified packages exist)
- [ ] Security defaults applied and threat model assumptions documented
- [ ] No incomplete logic in protected branch code
- [ ] Complexity is justified (no accidental architecture)
- [ ] Dependencies and lockfile changes reviewed (`pnpm audit` considered)
- [ ] Type checks, lint, tests, and build pass in CI
- [ ] Performance and accessibility gates respected

---

## 🔗 CROSS-SKILL INTEGRATION

| When Using...                | Clean Code Adds...                                                  |
| ---------------------------- | ------------------------------------------------------------------- |
| `@vue-best-practices`        | Reactivity safety, composition-first structure, performance hygiene |
| `@pinia`                     | Typed stores, testability, and side-effect boundaries               |
| `@vue-router-best-practices` | Guard safety, route lifecycle correctness, navigation robustness    |
| `@skill-creator`             | Keep standards codified and reusable across teams                   |
| `@planning-mastery`          | Modularity guides task breakdown                                    |
| `@brainstorming`             | SOLID/YAGNI guide architecture decisions                            |
| `@debug-mastery`             | Logging standards, no silent failures                               |

</audit_and_reference>
