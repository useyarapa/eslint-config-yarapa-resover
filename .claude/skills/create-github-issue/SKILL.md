---
name: create-github-issue
description: >
  File GitHub issues matching repository templates (.github/ISSUE_TEMPLATE/).
  Triggers on issue creation, bug reporting, feature requests, or gh issue
  create.
argument-hint: "[bug|feature|question]"
license: MIT
---

# Create GitHub Issue

Guide agents through discovering repository issue templates and submitting well-formed, sanitized GitHub issues.

## Core Rules

1. **Template as Source of Truth**: Always inspect `.github/ISSUE_TEMPLATE/` or `.github/issue_template.md` before writing. Fill every required field specified by the repository's schema.
2. **Zero Emojis**: Never use emojis in issue titles or issue descriptions. Use clean ASCII indicators (`[x]`, `[ ]`, `PASS`, `FAIL`).
3. **Strict Sanitization**: Never include credentials, tokens, private keys, customer data, or internal URLs. Sanitize code snippets to minimal reproducible examples.
4. **Conventional Title**: Prefix titles with conventional types:
   - Bugs/Defects: `bug: <concise summary>`
   - Features/Enhancements: `feat: <concise summary>`
   - Questions/Discussions: Route to GitHub Discussions when configured.

## Step-by-Step Workflow

### Step 1: Discover Repository Template

Inspect available issue templates in the target repository:

```sh
ls -la .github/ISSUE_TEMPLATE/ 2>/dev/null || ls -la .github/*issue*.md 2>/dev/null
```

- **YAML Forms (`*.yml`, `*.yaml`)**: Read the file to extract field ids, required flags, and markdown headers.
- **Markdown Templates (`*.md`)**: Read the file and mirror its exact markdown headings and prompts.
- **No Template**: Fall back to the standard structure:
  - Bugs: Environment, Steps to Reproduce, Expected Behavior, Actual Behavior.
  - Features: Problem Statement, Proposed Solution, Alternatives Considered.

### Step 2: Extract Runtime and Environment Data Dynamically

Query the local environment directly rather than guessing or hardcoding versions:

```sh
# Extract target package or runtime version from manifest or toolchain
node -v 2>/dev/null || python3 --version 2>/dev/null || go version 2>/dev/null
```

Inspect `package.json`, lockfiles, or relevant config to identify exact package names, versions, and dependencies in use.

### Step 3: Handle Discussions Routing

If the user request is an open-ended question, general inquiry, or unvetted idea:

1. Check `.github/ISSUE_TEMPLATE/config.yml` or repo discussion status:
   ```sh
   gh repo view --json url,hasDiscussionsEnabled
   ```
2. If discussions are enabled, guide the user to GitHub Discussions instead of filing an issue.

### Step 4: Construct Body and Submit via GitHub CLI

Render the issue body strictly adhering to the discovered template's fields using a HEREDOC:

```sh
gh issue create --title "<type>: <concise summary>" --body "$(cat <<'EOF'
<rendered issue body matching discovered template>
EOF
)"
```

### Completion Criteria

1. Issue created via `gh issue create`.
2. Returned issue URL surfaced to the user.
3. Zero secrets, zero emojis, and complete template field coverage confirmed.
