---
paths:
  - "**/*.config.*"
  - "**/.*rc*"
  - "**/package.json"
  - "**/tsconfig*.json"
---

# No Speculative Configuration Rules

Keep configuration demand-driven, observable, and aligned with verified repository and consumer requirements.

## Demand-Driven Configuration

- Add or modify rules, plugins, parser options, environment flags, scripts, and workflow settings only for an active requirement.
- Prefer the smallest configuration that satisfies the current contract.
- Remove configuration that has no current consumer, test, or documented public purpose.
- Do not add options, fallback branches, compatibility modes, or feature flags for hypothetical future needs.

## Match Patterns and Boundaries

- Make repository-internal paths, extensions, and ignore patterns match actual files and supported boundaries.
- Use consumer-facing patterns only when they are part of a documented contract and covered by tests.
- Keep generated artifacts and external tool boundaries explicit rather than hiding them in broad patterns.

## Verification

- Confirm that each configuration option or rule override has a matching test case or diagnostic verification.
- Run the repository's configured linter and type check to verify the configuration resolves cleanly.
- Run the configured unused dependency and export analyzer to confirm no unneeded packages or options were introduced.
