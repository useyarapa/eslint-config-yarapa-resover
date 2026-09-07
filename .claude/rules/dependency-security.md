---
paths:
  - "**/package.json"
  - "pnpm-lock.yaml"
---

# Dependency Security Rules

Enforce strict supply chain security, dependency vetting, and deterministic lockfile integrity for the banking baseline.

## Dependency Screening Criteria

- Require thorough evaluation of maintenance status, release cadence, license, and security advisory history before introducing any dependency.
- Prioritize native platform capabilities and existing lockfile dependencies over adding new external packages.
- Restrict ESLint plugins to reputable, actively maintained community standards (e.g. `@typescript-eslint`, `eslint-plugin-unicorn`, `eslint-plugin-sonarjs`).
- Reject dependencies with unmaintained transitive trees, obsolete peer dependency warnings, or unverified binary postinstall scripts.

## Lockfile and Version Pinning

- Pin exact versions for build tooling and linting utilities in `package.json` where deterministic execution is critical.
- Maintain `pnpm-lock.yaml` as the sole authoritative source of truth; never bypass lockfile integrity checks.
- Keep peer dependencies explicitly bounded with validated version ranges matching supported upstream runtimes.
- Prohibit speculative, unused, or duplicate packages across root and workspace manifests.

## Security Audit and Vulnerability Policy

- Maintain zero known vulnerabilities across all dependencies; address audit findings at the root cause immediately.
- Never use `--audit-level` bypasses, inline suppression, or ignoring flags to silence security warnings.
- Update outdated dependencies proactively following verified release notes and compatibility checks.

## Verification

- Run dependency security auditing (`pnpm audit`) to confirm zero reported vulnerabilities.
- Run unused dependency analysis (`knip`) to verify that no orphaned dependencies exist in any workspace package.
- Inspect `package.json` and `pnpm-lock.yaml` diffs to confirm no unauthorized packages or broad version ranges were added.
