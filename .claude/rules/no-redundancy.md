# No Redundancy Rules

Eliminate semantic, conceptual, and architectural redundancy across code, tests, and configurations. Solve every engineering problem once in a single canonical location.

## Single Source of Truth

- Maintain one authoritative implementation, type definition, and configuration owner for each domain concept.
- Before writing new logic or helpers, search the repository for existing implementations that solve the requirement.
- Do not create parallel or competing abstractions that perform equivalent semantic roles with different syntax or naming.
- Consolidate duplicated logic into a shared canonical module (`utils/`, `helpers/`, `constants/`) rather than copy-pasting or reimplementing.

## No Competing Abstractions

- Do not introduce thin wrappers, pass-through functions, or adapter layers that only forward calls without adding domain rules.
- Do not create multiple variants of an operation when a single parameterized function satisfies all valid use cases.
- Separate concerns cleanly: assign clear, non-overlapping ownership to each module, profile, and capability.

## Test and Verification Redundancy

- Do not write repetitive tests that assert identical execution paths with trivial data variations; parameterize via tables (`it.each`).
- Reuse canonical test helpers and declarative fixtures instead of creating bespoke setup logic in individual test files.
- Ensure every test verifies a distinct failure mode, behavioral contract, or regression boundary.

## Semantic and Explanatory Redundancy

- Do not write comments or documentation that restate what well-named identifiers already make obvious.
- Keep documentation, rule files, and specifications focused on constraints, boundaries, and invariants, not mechanics.
- Eliminate redundant configuration options that mirror framework defaults or collide with an established owner.

## Verification

- Inspect changed files to confirm no duplicate logic, redundant wrappers, or parallel abstractions were introduced.
- Verify that common functionality is referenced from a single canonical source rather than duplicated.
- Confirm tests parameterize shared scenarios rather than repeating boilerplate assertions.
