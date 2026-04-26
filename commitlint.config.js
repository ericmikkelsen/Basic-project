/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [
    // Pre-conventional-commits messages that can't be rewritten without a force-push
    (commit) => commit.startsWith('Initial plan'),
  ],
  rules: {
    // URLs appended automatically (e.g. Agent-Logs-Url) can exceed 100 chars
    'body-max-line-length': [0, 'always', Infinity],
  },
};
