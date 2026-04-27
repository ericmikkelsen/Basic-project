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
- `code-review-and-quality` — Five-axis review checklist with configurable reviewability budget
- `test-driven-development` — TDD cycle and Prove-It pattern for bug fixes
- `spec-driven-development` — Spec-before-code workflow with human review gates
- `incremental-implementation` — Thin vertical slices, scope discipline, rollback-friendly changes
- `narrative-branching` — Story/chapter branch structure for readable, reviewable AI-generated code
- `visual-pr-communication` — Mermaid change map, before/after narrative, junior-dev-friendly PR descriptions
- `prototype-decomposition` — Two-phase rescue of oversized prototype branches into story and chapters

See `.github/SKILLS-WORKFLOW.md` for the full workflow map showing how the nine skills connect across the story/chapter lifecycle.

## Chat Modes

Ten Copilot chat modes are available in `.github/chat-modes/`. Select a mode in the
Copilot Chat UI to activate its workflow.

- `spec` — Start spec-driven development: write a structured specification before writing any code
- `plan` — Break a spec into small, verifiable tasks with acceptance criteria and dependency ordering
- `story` — Plan a story branch with ordered chapter branches for reviewable, narrative-style delivery
- `build` — Implement the next pending task incrementally using the RED→GREEN→commit TDD cycle
- `test` — Run the TDD cycle for new features, or the Prove-It pattern for bug fixes
- `review` — Conduct a five-axis code review: correctness, readability, architecture, security, performance
- `visualize` — Generate a Mermaid change map, before/after narrative, and user-visible delta for a PR
- `ship` — Run the pre-launch checklist and produce a GO/NO-GO decision with rollback plan
- `simplify` — Reduce complexity without changing behavior, one simplification at a time
- `rescue` — Decompose an oversized prototype branch into a story with reviewable chapter branches

This `.github/copilot-instructions.md` file is the authoritative source for Copilot
instructions in this repository. Any mirrored copies must stay synchronized with this
file to avoid conflicting guidance for contributors.
