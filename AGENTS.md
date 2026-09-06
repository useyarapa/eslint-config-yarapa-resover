# Repository Guidelines

Architectural and workflow constraints when working in this repository.

## Agent Guidelines

- Never run lint, test, build, typecheck, or verify commands unprompted. Let Git hooks (`.husky/pre-commit`, `.husky/pre-push`) and CI automate verification unless the user explicitly requests a command run.
- Never suppress or disable a check to make it pass; fix root causes.
- Point pull-request preparation to `CONTRIBUTING.md` and package release intent to `.changeset/README.md`.

## Architecture & Build Boundaries

- `packages/eslint-config` is a strict, deterministic ESLint Flat Config package. Source lives in `packages/eslint-config/src/`; generated artifacts live in `packages/eslint-config/dist/`.
- Edit `src/` and tests, never generated `dist/` files.
- The root `eslint.config.mjs` consumes built package output from `packages/eslint-config/dist/index.mjs`. Root linting therefore requires a package build first. Use `pnpm lint` (which builds first) or build the package before invoking ESLint directly at repository root. Package-scoped linting (`pnpm --filter @yarapa/eslint-config lint`) lints source files directly.

## Verification Requirements

- Preset changes: add or update tests for both config composition / profile shape and at least one observable lint behavior in `packages/eslint-config/test/`.
- Export or package metadata changes: run `pnpm --filter @yarapa/eslint-config test:consumer` (or `verify`), which tests the packed tarball against a real consumer project.

## Testing Architecture & Fixture Policy

- Fixtures in `packages/eslint-config/fixtures/` are static declarative test inputs for ESLint Flat Config integration testing.
- Type-aware testing requires concrete disk fixtures with `tsconfig.json` to configure TypeScript compiler services deterministically.
- Do not replace static declarative fixtures with bespoke dynamic setup, temporary filesystem generation, or bespoke mock harnesses.
- Follow official ESLint test patterns and maintained capabilities.
