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

## Testing Policy

- Before adding, splitting, modifying, or running tests, apply `.claude/rules/deterministic-testing.md` as the canonical policy for admission, coverage ownership, pruning, fixtures, and execution scope.
