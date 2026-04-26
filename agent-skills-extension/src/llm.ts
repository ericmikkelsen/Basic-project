import * as vscode from 'vscode';

/**
 * Sends a request to the best available Copilot language model, streaming the
 * response back to the chat participant response stream.
 *
 * @param systemPrompt - The skill instructions to inject as the system message.
 * @param userMessage  - The user's message / prompt from the chat request.
 * @param stream       - The chat response stream to write output to.
 * @param token        - Cancellation token.
 */
export async function sendSkillRequest(
  systemPrompt: string,
  userMessage: string,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<vscode.ChatResult> {
  const models = await vscode.lm.selectChatModels({
    vendor: 'copilot',
    family: 'gpt-4o',
  });

  // Fall back to any available Copilot model if gpt-4o is not available.
  const model = models[0] ?? (await vscode.lm.selectChatModels({ vendor: 'copilot' }))[0];

  if (!model) {
    stream.markdown('**Error:** No Copilot language model available. Make sure GitHub Copilot is installed and signed in.');
    return {};
  }

  const messages: vscode.LanguageModelChatMessage[] = [
    vscode.LanguageModelChatMessage.User(
      `<system>\n${systemPrompt}\n</system>\n\n${userMessage}`
    ),
  ];

  try {
    const response = await model.sendRequest(messages, {}, token);

    for await (const fragment of response.text) {
      if (token.isCancellationRequested) {
        break;
      }
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

/**
 * Builds the initial user message from a chat request, including the user's
 * prompt and any referenced files (e.g. workspace content from #file mentions).
 */
export function buildUserMessage(request: vscode.ChatRequest): string {
  const parts: string[] = [];

  if (request.prompt.trim()) {
    parts.push(request.prompt.trim());
  }

  return parts.join('\n\n') || '(no additional context provided)';
}
