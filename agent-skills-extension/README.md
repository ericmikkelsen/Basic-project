# Agent Skills for Copilot Chat

A VS Code extension that brings [Addy Osmani's agent-skills](https://github.com/addyosmani/agent-skills) slash commands into GitHub Copilot Chat.

## Slash Commands

Type `@agent-skills` followed by a slash command in the Copilot Chat panel:

| Command | Description |
|---|---|
| `@agent-skills /spec` | Start spec-driven development — ask clarifying questions and write a structured `SPEC.md` before any code |
| `@agent-skills /plan` | Read `SPEC.md` and break work into ordered tasks with acceptance criteria → saves `tasks/plan.md` and `tasks/todo.md` |
| `@agent-skills /build` | Pick the next pending task from `tasks/todo.md`, implement it RED→GREEN→commit using TDD |
| `@agent-skills /test` | Run the TDD cycle for new features, or the Prove-It pattern to reproduce and fix bugs |
| `@agent-skills /review` | Five-axis code review: correctness, readability, architecture, security, performance |
| `@agent-skills /ship` | Pre-launch checklist — runs code review, security audit, and test coverage analysis, then synthesizes a GO/NO-GO decision with a rollback plan |
| `@agent-skills /simplify` | Reduce code complexity without changing behavior — one simplification at a time with test verification |

## Usage

```
@agent-skills /spec I want to build a REST API for a to-do list app
```

```
@agent-skills /review #file:src/auth.ts
```

```
@agent-skills /ship
```

## Installation (Development)

1. Clone the repo
2. `cd agent-skills-extension && npm install`
3. `npm run compile`
4. Open the `agent-skills-extension` folder in VS Code
5. Press `F5` to launch a new Extension Development Host window
6. Open Copilot Chat and type `@agent-skills /spec`

## Publishing

To publish to the VS Code Marketplace:

```bash
npm install -g @vscode/vsce
cd agent-skills-extension
vsce package
vsce publish
```

You'll need a [Personal Access Token](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token) from Azure DevOps.

## How It Works

The extension registers a VS Code **chat participant** (`@agent-skills`) with seven slash commands. When you invoke a command, the extension:

1. Injects the skill's workflow instructions as a system prompt
2. Sends your message and the system prompt to the Copilot language model via `vscode.lm`
3. Streams the response back into the chat panel

The `/ship` command runs three specialist personas (code reviewer, security auditor, test engineer) sequentially, then merges their reports into a single GO/NO-GO decision with a rollback plan.

## Relationship to `.github/chat-modes/`

This repo also ships [`.github/chat-modes/`](../.github/chat-modes/) — a zero-infrastructure version of the same workflows as **Copilot custom chat modes**. You can use those without installing any extension by selecting the mode from the Copilot Chat UI (VS Code 1.99+).

Use the chat modes for quick, repo-level workflow activation. Use this extension for the full slash command experience with the `@agent-skills` participant.

## Requirements

- VS Code 1.90+
- GitHub Copilot extension installed and signed in
