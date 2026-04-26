#!/usr/bin/env node
// Run a skill's system prompt against an input file using @github/copilot-sdk.
//
// Usage:
//   npm run skill:run -- <skill> <input-file>
//   npm run skill:run -- story tests/fixtures/story-example.md
//
// Output is written to tmp/skill-runs/<skill>-<timestamp>.md so you can
// review what the skill produces without committing it.
//
// Requires GitHub Copilot CLI auth (run `copilot auth login` once) or
// COPILOT_GITHUB_TOKEN / GH_TOKEN env vars.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

async function main() {
	const [, , skillName, inputPath] = process.argv;
	if (!skillName || !inputPath) {
		console.error('Usage: node scripts/run-skill.mjs <skill> <input-file>');
		console.error('       skill ∈ { story, visualize, rescue }');
		process.exit(2);
	}

	// Lazy-load the SDK so a missing dep does not break the test suite.
	let sdk;
	try {
		sdk = await import('@github/copilot-sdk');
	} catch (err) {
		console.error(
			'Could not load @github/copilot-sdk. Install with:\n  npm install --save-dev @github/copilot-sdk',
		);
		process.exit(1);
	}
	const { CopilotClient, approveAll } = sdk;

	const SUPPORTED = ['story', 'visualize', 'rescue'];
	if (!SUPPORTED.includes(skillName)) {
		console.error(
			`Unsupported skill "${skillName}". Supported: ${SUPPORTED.join(', ')}`,
		);
		process.exit(2);
	}
	// Read SYSTEM_PROMPT from the .ts source so we don't pull in the
	// `vscode` module (which only exists inside the editor host).
	const sourcePath = resolve(repoRoot, 'src', 'commands', `${skillName}.ts`);
	const source = await readFile(sourcePath, 'utf8');
	const match = source.match(
		/SYSTEM_PROMPT\s*=\s*`([\s\S]*?)`\.trim\(\)\s*;/,
	);
	if (!match) {
		throw new Error(`Could not extract SYSTEM_PROMPT from ${sourcePath}`);
	}
	const systemPrompt = match[1].trim();

	const userMessage = await readFile(resolve(process.cwd(), inputPath), 'utf8');

	const gitHubToken =
		process.env.COPILOT_GITHUB_TOKEN ||
		process.env.GH_TOKEN ||
		process.env.GITHUB_TOKEN;

	const client = new CopilotClient(
		gitHubToken ? { gitHubToken } : undefined,
	);
	await client.start();

	let assistantContent = '';
	let allEvents = [];
	try {
		const session = await client.createSession({
			model: process.env.COPILOT_MODEL ?? 'gpt-5',
			onPermissionRequest: approveAll,
			systemMessage: { mode: 'replace', content: systemPrompt },
			...(gitHubToken ? { gitHubToken } : {}),
		});

		session.on((event) => {
			allEvents.push({ type: event.type, data: event.data });
			if (event.type === 'assistant.message' && event.data?.content) {
				assistantContent = event.data.content;
			}
		});

		const finalEvent = await session.sendAndWait({ prompt: userMessage });
		if (!assistantContent && finalEvent?.data?.content) {
			assistantContent = finalEvent.data.content;
		}
		// Fallback: ask the session for its full message history.
		if (!assistantContent) {
			const messages = await session.getMessages();
			const lastAssistant = [...messages]
				.reverse()
				.find((m) => m.type === 'assistant.message');
			if (lastAssistant?.data?.content) {
				assistantContent = lastAssistant.data.content;
			}
		}
		await session.disconnect();
	} finally {
		await client.stop();
	}

	const outDir = resolve(repoRoot, 'tmp', 'skill-runs');
	await mkdir(outDir, { recursive: true });
	const stamp = new Date().toISOString().replace(/[:.]/g, '-');
	const outPath = resolve(outDir, `${skillName}-${stamp}.md`);

	const body = `# Skill run: /${skillName}\n\nInput: ${inputPath}\n\n## Output\n\n${assistantContent || '(no assistant.message content captured)'}\n\n## Event log\n\n\`\`\`json\n${JSON.stringify(allEvents, null, 2)}\n\`\`\`\n`;
	await writeFile(outPath, body, 'utf8');
	console.log(outPath);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
