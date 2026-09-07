---
paths:
  - "**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"
---

# No Fat File Rules

Keep modules single-responsibility, narrowly scoped, and strictly focused. Structure discrete capabilities into dedicated folder-wrapped units with pure re-export barrels.

## Single Responsibility Modules

- Keep every module dedicated to one discrete responsibility, domain concept, or capability.
- Separate distinct concerns across dedicated sibling modules rather than co-locating them in a single monolithic file.
- Extract independent capabilities (such as runners, parsers, and assertions) into focused modules with explicit contracts.

## Folder-Wrap and Pure Barrel Architecture

- Enclose modular utilities, helpers, scripts, and components in dedicated folders using the uniform folder-wrap pattern:
  ```
  <module-name>/
  ├── <module-name>.ts   # Implementation and execution logic
  └── index.ts           # Pure re-export entrypoint
  <parent-dir>/index.ts  # Aggregator barrel exporting all submodules
  ```
- Contain all domain execution logic in implementation files corresponding to their named responsibility.
- Keep entrypoint `index.ts` files strictly dedicated to re-exporting symbols as pure dispatchers without execution steps, helpers, or business logic.
- Provide a top-level aggregator barrel (`index.ts`) in parent directories to re-export submodules.
- Import domain capabilities from the top-level aggregator barrel rather than deep-importing internal implementation files.

## Verification

- Inspect changed and newly created files to confirm each module owns one discrete responsibility.
- Verify that folder-wrapped modules follow `<name>/<name>.ts` and `<name>/index.ts` structure.
- Verify that barrel `index.ts` files contain zero business logic or implementation steps.
- Run the repository's configured linter and type check to confirm export contracts resolve cleanly without cycles.
