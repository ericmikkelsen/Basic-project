---
name: narrative-branching
description: Structures work as a story with chapters. Use when starting any feature that spans more than one concern. Use when you need to organize AI-generated code so that reviewers can read it like a book instead of parsing a wall of diff.
---

# Narrative Branching

## Overview

Treat every feature as a story and every reviewable chunk as a chapter. The story branch is a table of contents; each chapter branch is one page. Reviewers read in order, understand incrementally, and never face a thousand-line diff.

## When to Use

- Starting a feature that will touch more than one concern
- Any time a change would exceed the reviewability budget (see `code-review-and-quality`)
- When an AI agent is about to generate a large body of code
- When a team needs to parallelise work on a single feature

## Branch Naming

```
story/<short-name>                        story/user-auth
chapter/<story-name>/<seq>-<slug>         chapter/user-auth/01-add-schema
                                          chapter/user-auth/02-add-api
                                          chapter/user-auth/03-add-ui
```

- Sequence numbers are zero-padded two digits (`01`, `02`, …) so `ls` and GitHub show chapters in reading order.
- Story names and chapter slugs use `kebab-case`.
- Chapter slugs name the *concern*, not the layer: `add-schema` not `backend-changes`.

## The STORY.md File

Create `STORY.md` at the root of the story branch before any chapter branch is created.

```markdown
# Story: [Short Title]

## Motivation
[Why are we doing this? One or two sentences. Link to issue/ticket if available.]

## Acceptance Criteria
- [ ] [Specific, testable condition]
- [ ] [Specific, testable condition]

## Chapters

| # | Branch | One-sentence scope |
|---|--------|--------------------|
| 01 | `chapter/<story>/01-<slug>` | [What this chapter does and nothing more] |
| 02 | `chapter/<story>/02-<slug>` | [What this chapter does and nothing more] |

## Out of Scope
[Anything that is explicitly NOT part of this story. Prevents scope creep.]

## Dependencies
[Other stories or external work this story depends on.]
```

## Workflow

```
main
 │
 └──→ story/<name>          ← created first, holds STORY.md
        │
        ├──→ chapter/<name>/01-…   PR targets story branch, reviewed, merged
        ├──→ chapter/<name>/02-…   PR targets story branch, reviewed, merged
        └──→ chapter/<name>/03-…   PR targets story branch, reviewed, merged
              │
              └──→ story PR to main   Auto-generated summary from STORY.md
```

### Step 1 — Plan the story

1. Identify the complete set of concerns the feature touches.
2. Assign each concern to exactly one chapter — chapters must not overlap.
3. Order chapters so that each one can compile and pass tests independently (no chapter depends on a later chapter).
4. Write `STORY.md` with all chapters listed.
5. **Present the chapter list to the human for approval before creating any branches.**

### Step 2 — Create story branch

```bash
git checkout -b story/<name>
# create STORY.md
git add STORY.md
git commit -m "docs(story): add STORY.md for <name>"
git push -u origin story/<name>
```

### Step 3 — Work chapter by chapter

For each chapter:

```bash
git checkout story/<name>
git checkout -b chapter/<name>/<seq>-<slug>
# implement only what the chapter title says
# use visual-pr-communication skill to generate PR description
git push -u origin chapter/<name>/<seq>-<slug>
# open PR targeting story/<name>
```

**Chapter rules:**
- A chapter must not touch files that belong to a different chapter's concern.
- A chapter must not anticipate or partially implement the next chapter.
- When a chapter is merged, delete its branch.

### Step 4 — Merge story to main

When all chapters are merged into the story branch:

1. Open a PR from `story/<name>` to `main`.
2. PR description is auto-generated from `STORY.md`: motivation, acceptance criteria, ordered chapter list with links to the merged chapter PRs.
3. This PR should be a green, working feature — all tests pass.

## Slicing a Concern Into Chapters

Slice **horizontally by concern**, not vertically by layer:

| ✅ Good chapter scope | ❌ Bad chapter scope |
|---|---|
| `01-add-schema` — data model only | `01-full-stack` — schema + API + UI |
| `02-add-api` — HTTP handlers only | `02-everything-else` — whatever didn't fit |
| `03-add-ui` — view layer only | |

When uncertain whether something belongs in this chapter or the next, it goes in the next.

## Verification

Before creating any chapter branch:

- [ ] `STORY.md` exists on the story branch with all chapters listed
- [ ] Human has approved the chapter breakdown
- [ ] Each chapter scope is one sentence and does not overlap with another chapter
- [ ] Chapter sequence is valid — no chapter depends on a later chapter
- [ ] Branch names follow the naming convention
