---
paths:
  - "**/test/**"
  - "**/fixtures/**"
  - "**/*.test.*"
---

# Deterministic Testing Rules

Enforce static, declarative, and deterministic testing architecture for ESLint Flat Config verification.

## Static Declarative Fixtures

- Keep all test fixtures declarative and static on disk under `fixtures/`.
- Do not create dynamic temporary filesystem files, in-memory virtual disks, or bespoke mock harnesses during test runs.
- Require concrete disk fixtures with valid `tsconfig.json` for all type-aware lint testing to guarantee compiler service stability.
- Treat fixtures as read-only declarative inputs; never mutate fixture contents during test execution.

## Dual-Layer Verification Policy

- Preset changes must include both configuration composition assertions and observable lint behavior tests.
- Composition tests (`configuration.test.ts`): verify Flat Config array shape, lexical scoping (`files`/`ignores`), plugins, and rule severity maps.
- Behavior tests (`behavior.test.ts`): execute ESLint against valid and invalid snippets to verify concrete diagnostic messages and rule triggers.
- Consumer tests (`test:consumer`): verify the packed tarball against a representative downstream consumer project before releases.

## Deterministic Test Execution

- Test observable diagnostic outcomes and rule IDs, not incidental implementation internals.
- Parameterize parallel variants using `it.each` instead of copy-pasting test cases.
- Reuse canonical test helpers and assertion utilities (`test/helpers/`) rather than writing local ad-hoc test logic.

## Verification

- Confirm that every preset modification has matching composition and behavior tests.
- Verify that all new test inputs use static declarative files under `fixtures/`.
- Run consumer integration testing when public exports or package metadata change.
