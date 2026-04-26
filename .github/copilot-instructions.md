# Project Coding Standards

## Commits
- Use [Conventional Commits](https://www.conventionalcommits.org/) for every commit
- Format: `<type>(<optional scope>): <description>`
- Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`, `ci`, `build`, `style`
- Breaking changes: append `!` after the type (e.g., `feat!:`) or add `BREAKING CHANGE:` in the footer
- Commits are linted automatically on every PR via the `Conventional Commits` workflow

## Versioning
- Versions are managed automatically by [Release Please](https://github.com/googleapis/release-please)
- `fix:` → patch bump · `feat:` → minor bump · `feat!:` / `BREAKING CHANGE:` → major bump
- Merging the release PR created by Release Please tags the release and updates `CHANGELOG.md`
- Never manually edit `package.json` version or `CHANGELOG.md`

## Testing
- Write tests before or alongside implementation (TDD)
- For bugs: write a failing test first, then fix (Prove-It pattern)
- Run tests before every commit: `npm test`

## Code Quality
- Review across five axes: correctness, readability, architecture, security, performance
- Every PR must pass: lint, type check, tests, build
- No secrets in code or version control — use environment variables

## Implementation
- Build in small, verifiable increments (one slice at a time)
- Each increment: implement → test → verify → commit
- Never mix formatting changes with behavior changes in the same commit
- Target ~100 lines per commit; split PRs over ~300 lines

## Boundaries
- **Always:** Run tests before commits, validate user input, follow conventional commit format
- **Ask first:** Database schema changes, new dependencies, breaking API changes
- **Never:** Commit secrets, remove failing tests without approval, skip CI verification

## Skills
The following [Addy Osmani agent skills](https://github.com/addyosmani/agent-skills) are available in `.github/skills/`:
- `git-workflow-and-versioning` — Commit discipline, branching strategy, conventional commits
- `ci-cd-and-automation` — Quality gate pipelines, GitHub Actions patterns
- `code-review-and-quality` — Five-axis review checklist
- `test-driven-development` — TDD cycle and Prove-It pattern for bug fixes
- `spec-driven-development` — Spec-before-code workflow with human review gates
- `incremental-implementation` — Thin vertical slices, scope discipline, rollback-friendly changes

## Chat Modes
Seven Copilot chat modes are available in `.github/chat-modes/`. Select a mode in the
Copilot Chat UI to activate its workflow, or use the `@agent-skills` VS Code extension
for slash command access (`/spec`, `/plan`, `/build`, `/test`, `/review`, `/ship`, `/simplify`).
