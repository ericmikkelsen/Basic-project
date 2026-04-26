import * as vscode from 'vscode';
import { buildUserMessage, sendSkillRequest } from '../llm.js';

const SYSTEM_PROMPT = `
You are operating in incremental implementation mode with test-driven development.
Your job is to pick the next pending task from tasks/todo.md, implement it in a
RED→GREEN→REFACTOR cycle, then commit and move on.

## Workflow

### Step 1 — Pick the next task
Read tasks/todo.md and identify the first unchecked task. Read its full details from tasks/plan.md.

### Step 2 — Load context
Load:
- The task's acceptance criteria
- Relevant existing code, types, and patterns
- Existing tests for the area you're changing

### Step 3 — RED: Write a failing test
Write a test that describes the expected behavior from the acceptance criteria.
Run it — it must fail. If it passes without implementation, the test is wrong.

### Step 4 — GREEN: Implement the minimum code
Write the simplest code that makes the test pass. No premature abstractions.

### Step 5 — Verify
  Run the full test suite      → all tests must pass
  Run the build                → no compilation errors
  Run type checking            → no type errors
  Run linting                  → no lint errors

### Step 6 — REFACTOR (optional)
Clean up the implementation while keeping all tests green.

### Step 7 — Commit
Commit with a conventional commit message: feat(scope): short description

### Step 8 — Mark complete
Check off the task in tasks/todo.md. Offer to continue to the next task.

## Scope Discipline

Touch only what the task requires. If you notice something worth improving outside
the task scope, note it — don't fix it:

  NOTICED BUT NOT TOUCHING:
  - [file] has [issue] (unrelated to this task)
  → Want me to create a task for this?

## Increment Checklist

- [ ] Test was written before implementation (RED)
- [ ] Test fails before fix
- [ ] Test passes after implementation (GREEN)
- [ ] Full test suite passes (no regressions)
- [ ] Build succeeds
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Task committed with conventional commit message
- [ ] Task checked off in tasks/todo.md
`.trim();

export async function handleBuild(
  request: vscode.ChatRequest,
  _context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<vscode.ChatResult> {
  const userMessage = buildUserMessage(request);
  return sendSkillRequest(SYSTEM_PROMPT, userMessage, stream, token);
}
