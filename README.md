# starter-template

A code repository starter template with conventional commits, automated versioning, and Addy Osmani's **agent-skills** workflows wired into GitHub Copilot Chat.

## Agent Skills for Copilot

This repo ships agent-skills workflows via Copilot custom chat modes.

`.github/chat-modes/` contains ten [Copilot custom chat modes](https://code.visualstudio.com/docs/copilot/chat/chat-modes) (VS Code 1.99+). Select a mode from the Copilot Chat UI to activate its workflow instructions:

| Mode file | Activates |
|---|---|
| `spec.chatmode.md` | Spec-driven development — write `SPEC.md` before any code |
| `plan.chatmode.md` | Break a spec into ordered tasks with acceptance criteria |
| `story.chatmode.md` | Organize work as a story with chapter branches |
| `build.chatmode.md` | Implement the next task — RED→GREEN→commit (TDD) |
| `test.chatmode.md` | TDD cycle for features / Prove-It pattern for bugs |
| `review.chatmode.md` | Five-axis code review: correctness, readability, architecture, security, performance |
| `visualize.chatmode.md` | Generate a Mermaid change map for a PR |
| `ship.chatmode.md` | Pre-launch checklist → GO/NO-GO decision with rollback plan |
| `simplify.chatmode.md` | Reduce complexity without changing behavior |
| `rescue.chatmode.md` | Decompose an oversized branch into reviewable chapters |

## Agent Skills

The `.github/skills/` directory contains the underlying [agent skill](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills) files loaded by the Copilot cloud agent and agent mode in VS Code:

- `spec-driven-development` — spec-before-code workflow
- `incremental-implementation` — thin vertical slices, scope discipline
- `narrative-branching` — story/chapter branch structure for reviewable AI-generated code
- `test-driven-development` — TDD cycle and Prove-It pattern
- `code-review-and-quality` — five-axis review checklist
- `visual-pr-communication` — Mermaid change map and PR narrative
- `git-workflow-and-versioning` — conventional commits, branching
- `ci-cd-and-automation` — quality gate pipelines
- `prototype-decomposition` — rescue oversized branches into story + chapters

For a plain-language developer flow, see [docs/developer-workflow.md](./docs/developer-workflow.md).

## Conventional Commits & Versioning

- Every commit must follow [Conventional Commits](https://www.conventionalcommits.org/) format
- Versions are managed automatically by [Release Please](https://github.com/googleapis/release-please)
- `fix:` → patch · `feat:` → minor · `feat!:` → major
