---
paths:
  - "**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"
---

# Feature Colocation Rules

Organize shared and local resources through strict architectural separation. Centralize cross-module capabilities in global shared directories, while collocating feature-local constants, helpers, utilities, and types in sibling files.

## Global Shared vs. Local Feature Boundaries

- **Global Shared Capabilities**: Located in centralized directories (e.g. `src/shared/constants/`, `test/helpers/`) equipped with folder-wrapped barrel `index.ts`. Reserved exclusively for assets consumed across two or more independent feature domains.
- **Local Feature-Scoped Capabilities**: Located directly alongside the core feature implementation or test file as siblings using dedicated extension suffixes:
  - `<name>.constant.ts` for static values, limits, and message templates.
  - `<name>.helper.ts` for domain runner wrappers, assertions, and test fixtures.
  - `<name>.util.ts` for pure algorithmic transformations and parsers.
  - `<name>.type.ts` for TypeScript type aliases, interfaces, and schemas.

## Prohibition on Inlining and Nested Subfolders

- Never declare constants, helper routines, utilities, or TypeScript type definitions inline within primary implementation files (`<name>.ts`) or test suites (`*.test.ts`).
- Never create nested subfolders or barrel wrappers for module-local concerns (e.g. do not create `button/constants/` or `auth/constants/`). Sibling files provide clean encapsulation without directory nesting debt.
- Primary files import sibling capabilities directly via `./<name>.<kind>` following the repository's configured module resolution.
- Barrel `index.ts` files inside feature directories must export only the public contract of the feature, keeping internal sibling files encapsulated.

## Verification

- Inspect all changed source and test files to confirm zero inlined constants, helpers, or types.
- Verify that module-local resources use `<name>.<kind>.ts` sibling naming without nested subfolders.
- Confirm shared cross-module resources reside in authorized global shared directories.
- Run the repository's configured linter and type check to ensure sibling imports resolve cleanly.
