# Story: Narrative Workflow Improvements

## Motivation

This story improves the AI-assisted development workflow: enforcing consistent code formatting, tightening story/chapter generation determinism, refining chapter planning policy, and adding documentation quality + narrative clarity requirements.

## Acceptance Criteria

- [ ] Prettier is configured and enforced in CI across the repository
- [ ] Story chatmode generates new GitHub branches and PRs (not local-only)
- [ ] Narrative-branching skill includes deterministic verification steps
- [ ] Chapter naming, combined-concern rule, and budget exclusions are documented
- [ ] JSDoc and clarifying comments are required in the build/review workflow
- [ ] Narrative clarity guidance (clear presentation path) is present in all relevant docs

## Chapters

| #   | Branch                                                                  | Estimated              | One-sentence scope                                                                   |
| --- | ----------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------ |
| 01  | `chapter/narrative-workflow-improvements/01-prettier-ci`                | ~30 files / ~830 lines | Add prettier formatting and CI enforcement across the repository                     |
| 02  | `chapter/narrative-workflow-improvements/02-story-chatmode-determinism` | ~2 files / ~65 lines   | Make the story chatmode deterministically create GitHub branches and PRs             |
| 03  | `chapter/narrative-workflow-improvements/03-chapter-planning-policy`    | ~8 files / ~263 lines  | Refine chapter naming convention, combined-concern rule, and budget exclusion policy |
| 04  | `chapter/narrative-workflow-improvements/04-workflow-docs-quality`      | ~9 files / ~65 lines   | Require JSDoc/clarifying comments and add narrative clarity guidance to the workflow |

## Out of Scope

- Branch validator regex tightening (chapter number enforcement left as-is)
- Changes to `package.json` version or `CHANGELOG.md`

## Dependencies

- `story-fix` — base branch; all chapters target this story branch which is rebased on `story-fix`
