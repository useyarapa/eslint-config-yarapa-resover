---
paths:
  - "**/src/**"
  - "**/package.json"
---

# Export Boundaries Rules

Enforce strict encapsulation and public API boundaries for the ESLint configuration package.

## Canonical Public Contract

- Maintain `src/index.ts` as the sole canonical entrypoint and public export contract for the package.
- Export only complete, deterministic Flat Config arrays or designated profile entrypoints.
- Never export internal implementation modules, rule maps, or raw plugin instances directly from the package root.
- Never re-export local sibling capabilities (`*.type.ts`, `*.constant.ts`, `*.helper.ts`) through public barrel files.

## Package Manifest Boundaries

- Configure `package.json` `exports` field with explicit subpath mappings targeting built `dist/` artifacts.
- Do not expose wildcards or raw internal directories in `package.json#exports`.
- Ensure all public exports declare corresponding TypeScript type definitions (`types` field preceding `import`/`default`).
- Maintain `dist/` as a generated artifact directory; never edit files in `dist/` directly.

## Module Encapsulation

- Collocate module-internal types, constants, and utilities in sibling files alongside implementation files.
- Restrict cross-module imports to designated shared directories (`src/shared/`, `src/configs/constants/`) via folder-wrapped barrel files.
- Keep dependency on external ESLint plugins encapsulated inside their respective configuration modules.

## Verification

- Inspect `package.json#exports` to ensure no unverified internal paths or wildcards are exposed.
- Verify that public export signatures remain backwards-compatible and adhere to Flat Config specifications.
- Confirm all build artifacts in `dist/` align symmetrically with source definitions in `src/`.
