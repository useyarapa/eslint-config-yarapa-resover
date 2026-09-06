# No Fat File Rules

Keep modules single-responsibility, narrowly scoped, and strictly focused. Forbid aggregating unrelated responsibilities into monolithic files, bloated directories, or pseudo-barrel nesting.

## Single Responsibility Modules

- Keep every module dedicated to one discrete responsibility, domain concept, or capability.
- Separate distinct concerns across dedicated sibling files (e.g. separate assertion logic, file-path resolution, and test runners instead of co-locating them).
- Do not combine multiple domain concepts or utility functions into a catch-all "fat file" (such as bundling `eslintForConfigs`, `packageRoot`, and `required` together).

## Strict Prohibition of Nested Barrel Nesting

- Do not create arbitrary subdirectories with intermediate `index.ts` files (such as `helpers/foo/index.ts`, `helpers/bar/index.ts`, `helpers/baz/index.ts`) that re-export sibling files.
- Keep helper and utility directories flat with explicit, descriptive file names (e.g. `helpers/assert.ts`, `helpers/paths.ts`, `helpers/eslint.ts`).
- Consumers must import directly from the specific module that owns the functionality; do not create aggregator barrels (`helpers/index.ts`) for internal test helpers or internal utilities.
- Never introduce dummy, generic, or fragmented placeholder folders (`foo`, `bar`, `baz`, `a`) or multi-layered barrel indirection.

## Architecture Boundaries

- Entrypoint barrels (`index.ts`) are reserved exclusively for the package's public export boundary (e.g. `packages/eslint-config/src/index.ts`).
- Internal directories, test helpers, and configurations must be imported directly by their concrete module path without intermediary re-export layers.

## Verification

- Inspect changed and newly created files to ensure no module hosts multiple independent responsibilities.
- Confirm internal helper directories remain flat without intermediate barrel files or nested wrapper folders.
- Verify that imports reference concrete sibling modules directly.
