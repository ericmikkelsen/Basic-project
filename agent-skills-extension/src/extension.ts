import * as vscode from 'vscode';
import { handleSpec } from './commands/spec.js';
import { handlePlan } from './commands/plan.js';
import { handleBuild } from './commands/build.js';
import { handleTest } from './commands/test.js';
import { handleReview } from './commands/review.js';
import { handleShip } from './commands/ship.js';
import { handleSimplify } from './commands/simplify.js';

const PARTICIPANT_ID = 'agent-skills.assistant';

type CommandHandler = (
  request: vscode.ChatRequest,
  context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
) => Promise<vscode.ChatResult>;

const COMMAND_HANDLERS: Record<string, CommandHandler> = {
  spec: handleSpec,
  plan: handlePlan,
  build: handleBuild,
  test: handleTest,
  review: handleReview,
  ship: handleShip,
  simplify: handleSimplify,
};

export function activate(context: vscode.ExtensionContext): void {
  const participant = vscode.chat.createChatParticipant(
    PARTICIPANT_ID,
    async (
      request: vscode.ChatRequest,
      chatContext: vscode.ChatContext,
      stream: vscode.ChatResponseStream,
      token: vscode.CancellationToken
    ): Promise<vscode.ChatResult> => {
      const command = request.command ?? '';
      const handler = COMMAND_HANDLERS[command];

      if (!handler) {
        return handleHelp(stream);
      }

      return handler(request, chatContext, stream, token);
    }
  );

  participant.iconPath = vscode.Uri.joinPath(context.extensionUri, 'icon.png');

  context.subscriptions.push(participant);
}

export function deactivate(): void {
  // nothing to clean up
}

function handleHelp(stream: vscode.ChatResponseStream): vscode.ChatResult {
  stream.markdown(
    [
      '## Agent Skills for Copilot Chat',
      '',
      'Available slash commands:',
      '',
      '| Command | Description |',
      '|---|---|',
      '| `/spec` | Start spec-driven development — write a structured specification before any code |',
      '| `/plan` | Break a spec into small, ordered tasks with acceptance criteria |',
      '| `/build` | Implement the next pending task — RED→GREEN→commit using TDD |',
      '| `/test` | Run the TDD cycle for features, or the Prove-It pattern for bugs |',
      '| `/review` | Five-axis code review: correctness, readability, architecture, security, performance |',
      '| `/ship` | Pre-launch checklist → GO/NO-GO decision with rollback plan |',
      '| `/simplify` | Reduce code complexity without changing behavior |',
      '',
      'Example: `@agent-skills /spec` — then describe what you want to build.',
    ].join('\n')
  );
  return {};
}
