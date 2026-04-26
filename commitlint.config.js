/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
	extends: ['@commitlint/config-conventional'],
	ignores: [
		// Skip legacy commits that predate conventional commits enforcement
		// (they lack a "type: " prefix and cannot be rewritten without a force-push)
		(commit) => !/^[a-z]+(\([^)]+\))?!?: /i.test(commit.split('\n')[0]),
		// Skip legacy Dependabot commits that use the old "deps:" prefix
		// (pre-dates the dependabot.yml commit-message convention and cannot be rewritten)
		(commit) => /^deps(\([^)]+\))?!?: /i.test(commit.split('\n')[0]),
	],
	rules: {
		// URLs appended automatically (e.g. Agent-Logs-Url) can exceed 100 chars
		'body-max-line-length': [0, 'always', Infinity],
	},
};
