---
paths:
  - ".changeset/**"
  - "**/package.json"
---

# Changeset Governance Rules

Govern package releases, semantic versioning, and changelog generation for regulated banking baseline environments.

## Semantic Versioning Discipline

- Treat any newly enabled rule or increased rule severity (e.g. `off` to `error`, `warn` to `error`) as a breaking change requiring a major release bump.
- Treat backward-compatible rule loosenings, documentation additions, or internal refactorings without lint diagnostic changes as minor or patch releases.
- Never publish unversioned or untracked changes; all user-facing modifications must have a corresponding changeset.

## Changeset Entry Standards

- Create changeset Markdown files via the standard changeset CLI (`pnpm changeset`).
- Keep changeset descriptions self-contained, formal, and objective; do not include emojis, subjective commentary, or external repository links.
- Structure changeset entries with a clear summary of the rule modification, the rationale, and actionable migration guidance for downstream teams.
- State affected rule names, severity changes, and targeted file patterns explicitly in the changeset body.

## Release Readiness

- Verify that release notes stand alone without requiring access to internal issue trackers or git history.
- Run consumer integration tests (`pnpm test:consumer`) before merging changesets intended for release.
- Ensure package version bumps synchronize symmetrically across workspace packages and lockfiles.

## Verification

- Confirm every PR modifying rule behavior, defaults, or public APIs includes a valid `.changeset/*.md` file.
- Inspect changeset text for formal tone, absence of emojis, and presence of migration instructions for breaking changes.
- Verify semver bump classification (major, minor, patch) matches the strictness impact on consumers.
