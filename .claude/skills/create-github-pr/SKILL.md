---
name: create-github-pr
description: >
  Open pull requests conforming to repository PR templates
  (.github/pull_request_template.md). Triggers on PR creation, submission, or gh
  pr create.
argument-hint: "[issue-number|title]"
license: MIT
---

# Create GitHub Pull Request

Guide agents through discovering repository pull request templates, running verification checklists, and submitting PRs via GitHub CLI.

## Core Rules

1. **Template as Source of Truth**: Read and populate the repository's `.github/pull_request_template.md` (or `.github/PULL_REQUEST_TEMPLATE.md`). Never omit required sections.
2. **Evidence-Based Checklists**: Never check a box (`[x]`) blindly. Execute each verification command specified in the template, confirm the result, and mark passed items.
3. **Zero Emojis**: Never use emojis in PR titles or bodies. Use clean ASCII indicators (`[x]`, `[ ]`, `PASS`, `FAIL`).
4. **Conventional Title**: Follow conventional commits: `<type>(<scope>): <concise description>`.
5. **No Secrets**: Confirm removal of credentials, tokens, and sensitive data from all committed files and diffs.

## Step-by-Step Workflow

### Step 1: Pre-flight Git State Inspection

Verify the working tree, branch divergence, and commit history:

```sh
git status
git diff origin/main...HEAD
git log origin/main...HEAD --oneline
```

Confirm that branch is pushed to remote and up to date.

### Step 2: Read Repository PR Template

Inspect the repository for PR templates:

```sh
cat .github/pull_request_template.md 2>/dev/null || cat .github/PULL_REQUEST_TEMPLATE.md 2>/dev/null
```

If no template exists, use the standard baseline:

- Summary of changes and motivation.
- Issue reference (`Fixes #<number>` or `None`).
- Verification checklist of executed commands.

### Step 3: Execute Verification Checklist

Parse the verification commands found in the template's checklist or test scripts from the repository manifest (`package.json`, `Makefile`, `Cargo.toml`):

- Run each check sequentially.
- If any check fails, resolve the root cause before continuing. Never submit a PR with failing checks.
- Check off passing commands with `[x]` in the final body.

### Step 4: Handle Release Metadata

Inspect repository release tooling if present:

- **Changeset Repositories (`.changeset/` exists)**:
  Check changeset status (`pnpm changeset status 2>/dev/null || npx changeset status 2>/dev/null`). If user-facing package changes occurred, confirm a changeset is committed; otherwise ensure an empty changeset (`--empty`) is included if required by the template.
- **Conventional / Semantic Release**:
  Confirm commit titles follow `<type>(<scope>): <summary>` for automated changelog generation.

### Step 5: Submit Pull Request via GitHub CLI

Format the PR body by filling out the discovered template and invoke `gh pr create` using a HEREDOC:

```sh
gh pr create --title "<type>(<scope>): <concise description>" --body "$(cat <<'EOF'
<populated PR body matching repository template with checked [x] items>
EOF
)"
```

### Completion Criteria

1. All verification checks executed and confirmed passing.
2. Pull request created via `gh pr create`.
3. Generated PR URL returned to the user.
