# Basic-project

A code repository starter template with conventional commits, automated versioning, and Addy Osmani's **agent-skills** workflows wired into GitHub Copilot Chat.

## Agent Skills for Copilot

This repo ships agent-skills workflows via Copilot custom chat modes.

`.github/chat-modes/` contains seven [Copilot custom chat modes](https://code.visualstudio.com/docs/copilot/chat/chat-modes) (VS Code 1.99+). Select a mode from the Copilot Chat UI to activate its workflow instructions:

| Mode file | Activates |
|---|---|
| `spec.chatmode.md` | Spec-driven development — write `SPEC.md` before any code |
| `plan.chatmode.md` | Break a spec into ordered tasks with acceptance criteria |
| `build.chatmode.md` | Implement the next task — RED→GREEN→commit (TDD) |
| `test.chatmode.md` | TDD cycle for features / Prove-It pattern for bugs |
| `review.chatmode.md` | Five-axis code review: correctness, readability, architecture, security, performance |
| `ship.chatmode.md` | Pre-launch checklist → GO/NO-GO decision with rollback plan |
| `simplify.chatmode.md` | Reduce complexity without changing behavior |

## Agent Skills

The `.github/skills/` directory contains the underlying [agent skill](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills) files loaded by the Copilot cloud agent and agent mode in VS Code:

- `spec-driven-development` — spec-before-code workflow
- `incremental-implementation` — thin vertical slices, scope discipline
- `test-driven-development` — TDD cycle and Prove-It pattern
- `code-review-and-quality` — five-axis review checklist
- `git-workflow-and-versioning` — conventional commits, branching
- `ci-cd-and-automation` — quality gate pipelines

For a plain-language developer flow, see [docs/developer-workflow.md](./docs/developer-workflow.md).

## Conventional Commits & Versioning

- Every commit must follow [Conventional Commits](https://www.conventionalcommits.org/) format
- Versions are managed automatically by [Release Please](https://github.com/googleapis/release-please)
- `fix:` → patch · `feat:` → minor · `feat!:` → major
