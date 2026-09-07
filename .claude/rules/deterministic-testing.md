---
paths:
  - "**/test/**"
  - "**/fixtures/**"
  - "**/*.test.*"
---

# Deterministic Testing Rules

Keep tests as small, deterministic protections for observable contracts. A source change alone is not evidence that another test is needed.

## Test Admission

- Name the contract and the distinct defect a proposed test can detect before writing it.
- Admit tests only for externally observable behavior, public contracts, demonstrated regressions, non-trivial invariants, meaningful failure modes, or an explicit repository verification requirement.
- Reject tests that restate static guarantees, assert implementation details, exercise impossible states, or increase coverage without increasing defect detection.
- Treat coverage percentage as a measurement, not a reason to add tests.
- Leave tests unchanged when no proposed case survives admission.

## Coverage Ownership

- Search existing coverage before adding a case. Extend the test file that already owns the contract whenever one exists.
- Create a test file only when the contract has no owner or requires a materially different execution harness or fixture lifecycle. File length, naming symmetry, and case count do not establish a boundary.
- Follow the nearest existing directory and naming pattern; never create files, directories, helpers, or fixtures solely to mirror sibling structure.
- Keep setup local until multiple tests share live runtime logic, then extract one canonical helper.

## Case Budget And Pruning

- Use the minimum distinguishing cases needed to protect the admitted contract.
- Require every case to detect a defect that the remaining cases would miss; remove cases dominated by existing coverage.
- Represent data-only variants in one parameterized test rather than parallel cases or files.
- Before finishing, prune new and modified tests that duplicate an execution path, assertion, fixture, or behavioral boundary.

## Static Declarative Fixtures

- Use an inline source snippet unless filesystem paths, module resolution, or TypeScript compiler services are part of the contract.
- Keep required fixtures declarative and read-only under `fixtures/`.
- Use concrete disk fixtures with valid `tsconfig.json` for type-aware lint behavior.
- Use maintained ESLint and Vitest capabilities instead of temporary filesystem generation, virtual disks, or bespoke mock harnesses.

## Execution Scope

- Follow the command authority in `AGENTS.md`; testing policy never grants permission to run a command.
- When test execution is requested, run the narrowest owning test file or filter during iteration.
- A passing result remains authoritative until relevant source, configuration, helper, or fixture input changes; never repeat the same command against an unchanged tree.
- Reserve the full package suite for one final run when explicitly requested. Git hooks and CI own unrequested repository-wide verification.
- Run consumer tests only for export or package metadata boundaries, and coverage only when explicitly requested.

## Verification

- Map every added or modified test to its admitted contract and distinct detectable defect.
- Confirm each new test file has an independent owner or execution boundary that an existing file cannot represent.
- Remove every dominated case and unnecessary test artifact before concluding the task.
- Report exactly which checks ran and which remained delegated to Git hooks or CI.
