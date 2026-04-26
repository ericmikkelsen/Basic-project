# Basic-project

A code repository starter template with conventional commits, automated versioning, and Addy Osmani's **agent-skills** workflows wired into GitHub Copilot Chat.

## Agent Skills for Copilot

This repo ships two ways to use the agent-skills workflows in Copilot Chat:

### Option A — Custom Chat Modes (zero infrastructure)

`.github/chat-modes/` contains seven [Copilot custom chat modes](https://code.visualstudio.com/docs/copilot/chat/chat-modes) (VS Code 1.99+). Select a mode from the Copilot Chat UI to activate its workflow instructions:

| Mode file | Activates |
|---|---|
| `spec.chatmode.md` | Spec-driven development — write `SPEC.md` before any code |
| `plan.chatmode.md` | Break a spec into ordered tasks → `tasks/plan.md` + `tasks/todo.md` |
| `build.chatmode.md` | Implement the next task — RED→GREEN→commit (TDD) |
| `test.chatmode.md` | TDD cycle for features / Prove-It pattern for bugs |
| `review.chatmode.md` | Five-axis code review: correctness, readability, architecture, security, performance |
| `ship.chatmode.md` | Pre-launch checklist → GO/NO-GO decision with rollback plan |
| `simplify.chatmode.md` | Reduce complexity without changing behavior |

### Option B — VS Code Extension (slash commands)

`agent-skills-extension/` is a VS Code extension that registers `@agent-skills` as a Copilot Chat participant with the same seven workflows as slash commands:

```
@agent-skills /spec    → start spec-driven development
@agent-skills /plan    → break spec into tasks
@agent-skills /build   → implement next task with TDD
@agent-skills /test    → TDD cycle or Prove-It bug fix
@agent-skills /review  → five-axis code review
@agent-skills /ship    → GO/NO-GO launch decision
@agent-skills /simplify → reduce complexity
```

See [`agent-skills-extension/README.md`](./agent-skills-extension/README.md) for installation and publishing instructions.

## Agent Skills

The `.github/skills/` directory contains the underlying [agent skill](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills) files loaded by the Copilot cloud agent and agent mode in VS Code:

- `spec-driven-development` — spec-before-code workflow
- `incremental-implementation` — thin vertical slices, scope discipline
- `test-driven-development` — TDD cycle and Prove-It pattern
- `code-review-and-quality` — five-axis review checklist
- `git-workflow-and-versioning` — conventional commits, branching
- `ci-cd-and-automation` — quality gate pipelines

## Conventional Commits & Versioning

- Every commit must follow [Conventional Commits](https://www.conventionalcommits.org/) format
- Versions are managed automatically by [Release Please](https://github.com/googleapis/release-please)
- `fix:` → patch · `feat:` → minor · `feat!:` → major
