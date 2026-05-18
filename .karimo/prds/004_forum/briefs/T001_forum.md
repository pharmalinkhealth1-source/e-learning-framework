# Task Brief: T001

**Title:** Create forumRules Sanity schema and seed initial document
**PRD:** forum
**Priority:** must
**Complexity:** 2/10
**Model:** sonnet
**Wave:** 1
**Feature Issue:** Forum Rules Acceptance Gate (PRD 004)

---

## Objective

Create the Sanity schema for the `forumRules` singleton document so that the admin can seed the 11 community rule cards and manage versioning. Register the schema in `index.ts` so it appears in Sanity Studio. This is a Wave 1 foundation task with no dependencies — it can be started immediately alongside T002.

---

## Context

**Parent Feature:** Forum Rules Acceptance Gate (PRD 004)

PharmaLink requires all authenticated users to read and accept 11 community rules before posting in the forum. Acceptance must be re-triggered every 30 days or whenever an admin bumps the rules version. Rules content is stored in Sanity so an admin can update copy and version without a code deploy.

The `forumRules` document is a Sanity singleton — there is exactly one document with `_id: 'forumRules'`. T004 will query this document server-side in `forum/page.tsx` to fetch the current version and rule cards.

This task is part of **Wave 1** — Foundation tasks that run in parallel. T002 (the API accept route) also runs in Wave 1. T003 and T004 depend on this task being complete.

---

## Research Context

### Patterns to Follow

- **defineType/defineField pattern:** Use `import { defineField, defineType } from 'sanity'` — same as `src/sanity/schemaTypes/forumPost.ts`
- **Schema registration:** Add named export to `src/sanity/schemaTypes/index.ts` in the `types` array — same pattern as all existing schemas
- **No write-client needed:** This task only creates the schema definition; the admin seeds the document manually in Sanity Studio

### Known Issues to Address

- No `forumRules` schema exists anywhere in the codebase — this is a net-new file

### Dependencies

**File Dependencies:**
- `src/sanity/schemaTypes/index.ts` — register `forumRules` here (modify, do not replace existing entries)

---

## Requirements

1. Create `src/sanity/schemaTypes/forumRules.ts` with a `defineType` document schema
2. Fields required:
   - `version` — `string`, required, description: "Bump this (e.g. v1.1) to re-prompt all users"
   - `updatedAt` — `datetime`, label "Updated At"
   - `rules` — `array` of objects, each with `title` (string) and `body` (text)
3. Set `__experimental_actions` to hide "Create" in Studio (singleton — admin should never create a second document):
   ```ts
   __experimental_actions: ['update', 'publish'],
   ```
4. Register the schema in `src/sanity/schemaTypes/index.ts`
5. Add a block comment in the schema file listing all 11 rule card titles so the admin knows what to create when seeding the document

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `src/sanity/schemaTypes/forumRules.ts` exists and compiles without TypeScript errors
- [ ] Schema exports `forumRules` using `defineType` with `type: 'document'`
- [ ] `version` field is present (string, required)
- [ ] `updatedAt` field is present (datetime)
- [ ] `rules` field is present as an array of objects with `title` (string) and `body` (text)
- [ ] `__experimental_actions` is set to `['update', 'publish']` (blocks duplicate creation)
- [ ] `forumRules` is imported and added to the `types` array in `src/sanity/schemaTypes/index.ts`
- [ ] Seed comment lists all 11 rule card titles
- [ ] `pnpm build` or `pnpm typecheck` passes with no new errors

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/sanity/schemaTypes/forumRules.ts` | create | New Sanity schema for the forumRules singleton document |
| `src/sanity/schemaTypes/index.ts` | modify | Add `forumRules` import and register in the `types` array |

### File Ownership Notes

`index.ts` is shared — add the new import without removing or reordering any existing imports.

---

## Implementation Guidance

### Full Schema Code

Model exactly after `forumPost.ts`. Complete implementation:

```ts
import { defineField, defineType } from 'sanity'

/**
 * Singleton document — _id must be 'forumRules'.
 * Admin: create this document once in Sanity Studio with the following 11 rules:
 *
 *  1. Welcome to PharmaLink
 *  2. The Non-Negotiable Rule
 *  3. Rule #1: Protect Patient Confidentiality
 *  4. Rule #2: Protect Facility & Organizational Information
 *  5. Rule #3: Be Accurate and Evidence-Based
 *  6. Rule #4: Respect Every Member
 *  7. Rule #5: Only Share Appropriate Images and Files
 *  8. Rule #6: Keep Content Professional and On-Topic
 *  9. Rule #7: Report Violations Promptly
 * 10. Rule #8: Understand the Consequences
 * 11. Your Legal Obligations & Moderation
 *
 * Set version to 'v1.0'. Bump version to re-prompt all users.
 */
export const forumRules = defineType({
  name: 'forumRules',
  title: 'Forum Rules',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'version',
      title: 'Version',
      type: 'string',
      description: 'Bump this string (e.g. v1.1) to re-prompt all users to accept rules.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
    }),
    defineField({
      name: 'rules',
      title: 'Rules',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'body', title: 'Body', type: 'text' }),
          ],
        },
      ],
    }),
  ],
})
```

### Registering in index.ts

Add after the last existing import:

```ts
import { forumRules } from './forumRules'
```

Add `forumRules` to the existing `types` array — do NOT replace the array. The array already contains all registered schemas; append `forumRules` at the end:

```ts
import { forumRules } from './forumRules'
```

```ts
// append forumRules to the existing types array in index.ts
// Example — add forumRules to the end of whatever types array already exists:
types: [...existingTypes, forumRules]
```

Do not reproduce or overwrite the full `types` array. Read the current contents of `index.ts` and insert `forumRules` as the last element only.

### Edge Cases

- Do not add a `slug` field — forumRules uses a fixed `_id` (`'forumRules'`), not a slug
- `body` uses `type: 'text'` (plain multiline string), not `'array'` of blocks — keeps querying simple in T004
- The schema does NOT need a seed script — admin creates the document manually in Studio

---

## Boundaries

### Files You MUST NOT Touch

- Any file outside `src/sanity/schemaTypes/`
- `src/app/forum/page.tsx` (T004's file)
- `src/components/forum/` (T003's directory)
- `src/app/api/` (T002's directory)

### Files Requiring Review

None for this task.

---

## Dependencies

### Upstream Tasks

None — T001 has no dependencies. Start immediately.

### Downstream Impact

Tasks that depend on this one: **T003** (component uses the `rulesDoc` shape), **T004** (page queries this schema)

---

## GitHub Context

**PRD:** 004_forum
**Branch:** `worktree/forum-T001`
**Worktree:** `.worktrees/forum/T001`
**Brief:** `.karimo/prds/004_forum/briefs/T001_forum.md`

---

## Commit Guidelines

```
feat(sanity): add forumRules singleton schema

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before marking complete:
- [ ] All success criteria met
- [ ] `pnpm typecheck` passes
- [ ] No files outside `src/sanity/schemaTypes/` modified
- [ ] `forumRules.ts` compiles (no TypeScript errors)
- [ ] `index.ts` still exports all previously registered types

---

*Generated by KARIMO Brief Writer*
*PRD: forum | Task: T001 | Wave: 1*
