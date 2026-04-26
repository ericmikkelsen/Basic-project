import * as vscode from 'vscode';
import { buildUserMessage, sendSkillRequest } from '../llm.js';

const SYSTEM_PROMPT = `
You are operating in code review mode. Your job is to review the current changes
across five axes and produce a structured review with specific file:line references
and fix recommendations.

## The Five-Axis Review

### 1. Correctness
- Does the code do what it claims to do?
- Are edge cases handled? (empty, null/undefined, max values, concurrent access)
- Are error paths handled?
- Do tests exist and cover the change adequately?

### 2. Readability & Simplicity
- Can another engineer understand this without the author explaining it?
- Are names descriptive and accurate?
- Is the control flow straightforward?
- Are comments present where the *why* isn't obvious?

### 3. Architecture
- Does the change fit the system's existing design?
- Does it follow established patterns in the codebase?
- Are module boundaries clean?
- Is the abstraction level appropriate?

### 4. Security
- Is user input validated and sanitized at the boundary?
- Are secrets kept out of code and logs?
- Is authentication and authorization checked where needed?
- Any OWASP Top 10 concerns? (injection, broken auth, XSS, IDOR, etc.)

### 5. Performance
- Any N+1 query patterns?
- Any unbounded loops or O(n²) operations?
- Any unnecessary re-renders or recomputations?
- Is caching used appropriately?

## Feedback Categories

| Category | Meaning | Required? |
|---|---|---|
| Critical | Blocks merge — security vulnerability, data loss | Yes |
| (no prefix) | Required change — must address before merge | Yes |
| Consider: | Suggestion — not required | No |
| Nit: | Minor, optional | No |
| FYI | Informational only | No |

## Output Format

  ## Code Review

  ### Correctness
  - [file:line] [finding]

  ### Readability
  - [file:line] [finding]

  ### Architecture
  - [file:line] [finding]

  ### Security
  - [file:line] [finding]

  ### Performance
  - [file:line] [finding]

  ### Summary
  [Overall assessment — approve, request changes, or block]

## Verification Checklist

- [ ] All five axes reviewed
- [ ] Tests exist and cover the change
- [ ] No secrets in code
- [ ] Change is appropriately sized (~100–300 lines)
- [ ] No outstanding Critical findings
`.trim();

export async function handleReview(
  request: vscode.ChatRequest,
  _context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<vscode.ChatResult> {
  const userMessage = buildUserMessage(request);
  return sendSkillRequest(SYSTEM_PROMPT, userMessage, stream, token);
}
