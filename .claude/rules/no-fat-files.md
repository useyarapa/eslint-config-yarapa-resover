# No Fat File Rules

Keep modules single-responsibility, narrowly scoped, and strictly focused. Forbid aggregating unrelated responsibilities into monolithic files, while structuring modular units via folder-wrapped barrel architecture.

## Single Responsibility Modules

- Keep every module dedicated to one discrete responsibility, domain concept, or capability.
- Separate distinct concerns across dedicated modules rather than co-locating them in a single monolithic file.
- Do not combine multiple unrelated domain concepts, runners, assertions, or path utilities into a catch-all "fat file" (such as bundling test runners, path resolution, and assertion helpers in a single `.ts` file).

## Mandatory Folder-Wrap and Barrel Architecture

- Enclose all modular utilities, helpers, scripts, components, and test suites in dedicated folders using the uniform folder-wrap pattern:
  ```
  helpers/<module-name>/
  ├── <module-name>.ts   # Implementation and execution logic
  └── index.ts           # Pure re-export entrypoint
  helpers/index.ts       # Aggregator barrel exporting all submodules
  ```
- Implementation files must contain only domain logic corresponding to their named responsibility.
- Re-export entrypoints (`index.ts`) must act strictly as dispatchers without hosting business logic or execution steps.
- Parent directories must provide a top-level aggregator barrel (`index.ts`) re-exporting all submodules.
- Consumers import domain capabilities from the top-level aggregator barrel (`helpers/index.js`) rather than deep-importing internal implementation files directly.

## Company Standard Policy

- Folder-wrapped barrel structure is a mandatory architectural standard for encapsulation, maintainability, and clean dependency boundaries.
- Never simplify, flatten, combine, or bypass folder-wrap barrels under the premise of avoiding overengineering or adhering to YAGNI.
- Treat barrel architecture as a foundational company rule that applies to all shared and modular code across the repository.

## Verification

- Inspect changed and newly created files to ensure no module hosts multiple independent responsibilities.
- Confirm folder-wrapped modules follow `<name>/<name>.ts` and `<name>/index.ts` structure.
- Verify parent directories contain a top-level aggregator barrel (`index.ts`).
- Verify that barrel `index.ts` files contain zero business logic or implementation steps.
