# Briefs Overview: forum

Generated after all task briefs are complete. Provides quick navigation and context.

## Task Summary

| Task | Title | Wave | Complexity | Model | Status |
|------|-------|------|------------|-------|--------|
| [T001](T001_forum.md) | Create forumRules Sanity schema | 1 | 2 | sonnet | ready |
| [T002](T002_forum.md) | Create POST /api/forum/rules/accept route | 1 | 2 | sonnet | ready |
| [T003](T003_forum.md) | Create ForumRulesModal client component | 2 | 4 | sonnet | ready |
| [T004](T004_forum.md) | Add server-side rules gate to forum/page.tsx | 3 | 3 | sonnet | ready |

## Wave Breakdown

### Wave 1 (No dependencies — run in parallel)
- **T001** — Sanity `forumRules` schema + index.ts registration. Foundation for T003 and T004.
- **T002** — `POST /api/forum/rules/accept` API route. Writes acceptance to Clerk publicMetadata. Foundation for T003.

### Wave 2 (Depends on T002)
- **T003** — `ForumRulesModal` client component. 11-step modal with progress bar, accept/exit logic. Calls T002's API route.

### Wave 3 (Depends on T001 and T003)
- **T004** — Server-side gate in `forum/page.tsx`. Fetches Sanity version and Clerk metadata, renders modal or forum listing.

## File Overlap Analysis

| File | Tasks | Potential Conflict |
|------|-------|-------------------|
| `src/sanity/schemaTypes/index.ts` | T001 | None — T001 appends one line, no other task touches this file |
| `src/app/forum/page.tsx` | T004 | None — only T004 modifies this file |

No shared file conflicts. Each task owns its files exclusively.

## Key Architecture Notes

- **Clerk publicMetadata** stores `forumRulesAcceptedAt` (ISO string) and `forumRulesAcceptedVersion` (e.g. `"v1.0"`)
- **Sanity singleton** (`_id: 'forumRules'`) holds rules content + current version string
- **Gate is server-side** — no client-side flash; forum listing markup is not sent until user has accepted
- **Graceful degradation** — if Sanity doc not seeded, forum is accessible (T004 null guard)
- **Spread is critical** in T002 — must preserve `role` and `onboarded` when writing new fields

## Quick Links

- [PRD](../PRD_forum.md)
- [Tasks](../tasks.yaml)
- [Research Summary](../research/summary.md)

---
*For full briefs, see `T001_forum.md`, `T002_forum.md`, `T003_forum.md`, `T004_forum.md`*
