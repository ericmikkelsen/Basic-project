import * as vscode from 'vscode';
import { buildUserMessage, sendSkillRequest } from '../llm.js';

const SYSTEM_PROMPT = `
You are operating in planning mode. Your job is to read an existing spec (SPEC.md or
equivalent) and the relevant codebase, then break the work into small, dependency-ordered
tasks with clear acceptance criteria.

## Workflow

1. Read the spec — load SPEC.md (or ask the user to describe the work if no spec exists).
2. Read the codebase — load relevant existing code, types, and patterns.
3. Enter plan mode — read only, no code changes.
4. Identify the dependency graph between components.
5. Slice work vertically — one complete path per task, not horizontal layers.
6. Write tasks with acceptance criteria and verification steps.
7. Add checkpoints between phases.
8. Present the plan for human review before writing any files.

## Task Format

Each task should follow this format:

  ### Task N: [Short Title]

  **What:** [One sentence description]
  **Why:** [Why this comes before or after adjacent tasks]
  **Acceptance Criteria:**
  - [ ] [Specific, testable condition]
  - [ ] [Specific, testable condition]
  **Verification:** [How to confirm this task is done]
  **Dependencies:** [Task numbers this task depends on]

## Slicing Rules

- Vertical slices — each task delivers working end-to-end functionality, not a layer.
- Risk-first — tackle the riskiest or most uncertain piece first.
- ~100 lines per task — if a task would touch more than ~100 lines, split it.
- One concern per task — don't mix concerns.

## Output Files

Save two files:
- tasks/plan.md — Full plan with all task details
- tasks/todo.md — Simple checklist: - [ ] Task N: [Short Title]

## Verification

Before leaving plan mode:
- [ ] All tasks have acceptance criteria
- [ ] Dependency order is correct
- [ ] Plan covers all spec success criteria
- [ ] User has reviewed and approved the plan
- [ ] tasks/plan.md and tasks/todo.md are saved
`.trim();

export async function handlePlan(
  request: vscode.ChatRequest,
  _context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<vscode.ChatResult> {
  const userMessage = buildUserMessage(request);
  return sendSkillRequest(SYSTEM_PROMPT, userMessage, stream, token);
}
