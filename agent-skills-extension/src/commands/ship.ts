import * as vscode from 'vscode';
import { buildUserMessage } from '../llm.js';

const CODE_REVIEWER_PROMPT = `
You are a code reviewer specialist. Run a five-axis review (correctness, readability,
architecture, security, performance) on the provided changes. Categorize findings as
Critical, Important, or Suggestion. Output a structured report with file:line references.
`.trim();

const SECURITY_AUDITOR_PROMPT = `
You are a security auditor specialist. Run a vulnerability and threat-model pass:
- OWASP Top 10 checklist (injection, broken auth, XSS, IDOR, SSRF, etc.)
- Secrets handling (no secrets in code, logs, or error messages)
- Authentication and authorization boundaries
- Dependency CVEs (note any that should be checked with npm audit)
- Input validation at all external boundaries
Categorize findings as Critical, High, Medium, or Low. Output a structured audit report.
`.trim();

const TEST_ENGINEER_PROMPT = `
You are a test engineer specialist. Analyze test coverage for the provided changes:
- Happy path coverage
- Edge case coverage (empty, null, max values, concurrent access)
- Error path coverage
- Integration test coverage at component boundaries
- Identify gaps that could mask bugs in production
Output a structured coverage analysis with specific recommendations.
`.trim();

const MERGE_PROMPT = `
You are synthesizing the outputs of three specialist review passes (code review, security
audit, and test coverage analysis) into a single ship decision.

Produce this output:

  ## Ship Decision: GO | NO-GO

  ### Blockers (must fix before shipping)
  - [Source: Critical finding + file:line]

  ### Recommended fixes (should fix before shipping)
  - [Source: Important finding + file:line]

  ### Acknowledged risks (shipping anyway)
  - [Risk + mitigation]

  ### Rollback Plan
  - **Trigger conditions:** [What signals would prompt rollback]
  - **Rollback procedure:** [Exact steps]
  - **Recovery time objective:** [Target time to restore service]

  ---
  ### Specialist Reports

  #### Code Review
  [Full findings]

  #### Security Audit
  [Full findings]

  #### Test Coverage Analysis
  [Full findings]

Rules:
1. If any Critical finding exists → default verdict is NO-GO unless user explicitly accepts risk.
2. Rollback plan is mandatory before any GO decision.
3. Resolve duplicates between the three reports.
`.trim();

async function runPersona(
  systemPrompt: string,
  userMessage: string,
  token: vscode.CancellationToken
): Promise<string> {
  const models = await vscode.lm.selectChatModels({ vendor: 'copilot', family: 'gpt-4o' });
  const model = models[0] ?? (await vscode.lm.selectChatModels({ vendor: 'copilot' }))[0];

  if (!model) {
    return '(model unavailable)';
  }

  const messages: vscode.LanguageModelChatMessage[] = [
    vscode.LanguageModelChatMessage.User(
      `<system>\n${systemPrompt}\n</system>\n\n${userMessage}`
    ),
  ];

  const chunks: string[] = [];
  try {
    const response = await model.sendRequest(messages, {}, token);
    for await (const fragment of response.text) {
      if (token.isCancellationRequested) break;
      chunks.push(fragment);
    }
  } catch (err) {
    if (err instanceof vscode.LanguageModelError) {
      return `(error: ${err.message})`;
    }
    throw err;
  }

  return chunks.join('');
}

export async function handleShip(
  request: vscode.ChatRequest,
  _context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<vscode.ChatResult> {
  const userMessage = buildUserMessage(request);

  stream.markdown('## Running pre-launch review…\n\n');

  // Phase A — run three specialist personas (sequential in VS Code LM API)
  stream.markdown('**Phase A — Specialist reviews**\n\n');

  stream.markdown('_Running code review…_\n');
  const codeReviewReport = await runPersona(CODE_REVIEWER_PROMPT, userMessage, token);
  if (token.isCancellationRequested) return {};

  stream.markdown('_Running security audit…_\n');
  const securityReport = await runPersona(SECURITY_AUDITOR_PROMPT, userMessage, token);
  if (token.isCancellationRequested) return {};

  stream.markdown('_Running test coverage analysis…_\n\n');
  const testReport = await runPersona(TEST_ENGINEER_PROMPT, userMessage, token);
  if (token.isCancellationRequested) return {};

  // Phase B — merge reports into a single GO/NO-GO decision
  stream.markdown('**Phase B — Synthesizing decision…**\n\n');

  const mergeUserMessage = [
    '### Code Review Report',
    codeReviewReport,
    '',
    '### Security Audit Report',
    securityReport,
    '',
    '### Test Coverage Analysis',
    testReport,
    '',
    `### Change Context`,
    userMessage,
  ].join('\n');

  const models = await vscode.lm.selectChatModels({ vendor: 'copilot', family: 'gpt-4o' });
  const model = models[0] ?? (await vscode.lm.selectChatModels({ vendor: 'copilot' }))[0];

  if (!model) {
    stream.markdown('**Error:** No Copilot language model available.');
    return {};
  }

  const mergeMessages: vscode.LanguageModelChatMessage[] = [
    vscode.LanguageModelChatMessage.User(
      `<system>\n${MERGE_PROMPT}\n</system>\n\n${mergeUserMessage}`
    ),
  ];

  try {
    const response = await model.sendRequest(mergeMessages, {}, token);
    for await (const fragment of response.text) {
      if (token.isCancellationRequested) break;
      stream.markdown(fragment);
    }
  } catch (err) {
    if (err instanceof vscode.LanguageModelError) {
      stream.markdown(`**Error:** ${err.message} (${err.code})`);
    } else {
      throw err;
    }
  }

  return {};
}
