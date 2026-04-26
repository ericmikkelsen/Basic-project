# Plan: SMART Goal Instrumentation

## Motivation

The skills in this repo declare SMART goals (e.g., "change map ≤ 10 nodes",
"PR body ≤ 30 lines") but rely on humans to enforce them. This plan automates
enforcement so the skills' cognitive-load principles are mechanically guaranteed.

## Acceptance Criteria

- [ ] A script can validate a PR body file against `visual-pr-communication` SMART goals
- [ ] The script exits non-zero when limits are exceeded
- [ ] The script has unit tests (Jest)
- [ ] The script is invokable from the command line: `node scripts/check-pr-body.js <file>`

## Tasks

### Task 1: PR body validator (`scripts/check-pr-body.js`)

**Acceptance:**
- Reads a Markdown PR body from a file path argument
- Validates: ≤ 30 lines total, ≤ 10 Mermaid nodes, contains a `mermaid` block
- Returns structured result `{ ok, violations: [...] }`
- Exits 0 if `ok: true`, 1 otherwise
- Has Jest tests covering: passing case, line-count violation, node-count violation, missing diagram

### Task 2: Wire validator into CI

**Acceptance:**
- GitHub Actions workflow runs validator on PR body when a PR is opened or synchronized
- Failure surfaces a clear comment on the PR

### Task 3: Document the validator in `visual-pr-communication`

**Acceptance:**
- Add a "Mechanical enforcement" subsection pointing to the script
- Link from the SMART Goals table to the script

### Task 4: Skill testing environment (deferred)

**Acceptance:**
- A separate, optional testing environment is defined for validating skill outputs.
- The starter template remains editor-agnostic and does not require VS Code API runtime dependencies.
