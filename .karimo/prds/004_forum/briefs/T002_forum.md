# Task Brief: T002

**Title:** Create POST /api/forum/rules/accept route
**PRD:** forum
**Priority:** must
**Complexity:** 2/10
**Model:** sonnet
**Wave:** 1
**Feature Issue:** Forum Rules Acceptance Gate (PRD 004)

---

## Objective

Create the API route that records a user's acceptance of the forum rules by writing two fields to Clerk `publicMetadata`. This is the server-side write endpoint that `ForumRulesModal` (T003) calls after the user checks the acceptance checkbox. It must spread existing metadata to preserve `role` and `onboarded` fields.

---

## Context

**Parent Feature:** Forum Rules Acceptance Gate (PRD 004)

Clerk `publicMetadata` is the chosen persistence layer for forum rules acceptance because it is server-writable only (not spoofable from the client), cross-device, and already used by this project for `role` and `onboarded` state.

When a user accepts the forum rules, the modal (T003) will POST to this route with the current rules version string. This route reads the user's existing metadata, then writes back the full metadata object with two new fields appended: `forumRulesAcceptedAt` (ISO timestamp) and `forumRulesAcceptedVersion` (the version string from Sanity). T004's gate logic compares these fields against the current Sanity document to decide whether to show the modal.

This task is part of **Wave 1** — it runs in parallel with T001. No dependencies.

---

## Research Context

### Patterns to Follow

- **Exact pattern reference:** `src/app/api/auth/onboarding/route.ts` — same auth flow, same `clerkClient()` call, same `updateUserMetadata()` call
- **Auth import:** `import { auth, clerkClient } from '@clerk/nextjs/server'`
- **Response pattern:** `return NextResponse.json({ success: true })` on success; `return new NextResponse("Unauthorized", { status: 401 })` for auth failures
- **No Sanity write-client needed** — this route only touches Clerk

### Known Issues to Address

- **CRITICAL — spread existing metadata:** The onboarding route (`onboarding/route.ts:31`) does NOT spread existing metadata when it writes, which means if it were called again it would overwrite other fields. This accept route MUST spread `existingUser.publicMetadata` before appending the new fields. Failure to spread will wipe `role` and `onboarded`.

### Recommended Approach

1. Call `auth()` and reject 401 if no userId
2. Parse body, reject 400 if `version` is missing
3. Fetch existing user via `clerk.users.getUser(userId)` to get current metadata
4. Write back with spread: `{ ...existingUser.publicMetadata, forumRulesAcceptedAt: ..., forumRulesAcceptedVersion: ... }`
5. Return 200 `{ success: true }`

---

## Requirements

1. Create `src/app/api/forum/rules/accept/route.ts`
2. Export only a `POST` handler (no GET, no PUT)
3. Request body schema: `{ version: string }`
4. Auth guard: `auth()` → 401 if no userId
5. Validation: 400 if `version` is missing or empty string
6. Get existing user metadata before writing (required to spread)
7. Write to Clerk `publicMetadata` with spread to preserve existing fields
8. Return `{ success: true }` on success
9. Wrap in try/catch, return 500 with error message on unexpected failure

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `src/app/api/forum/rules/accept/route.ts` exists and compiles without TypeScript errors
- [ ] Unauthenticated request returns 401
- [ ] Request missing `version` field returns 400
- [ ] Authenticated request with valid body sets `forumRulesAcceptedAt` in Clerk publicMetadata (ISO string)
- [ ] Authenticated request with valid body sets `forumRulesAcceptedVersion` in Clerk publicMetadata (matches sent version)
- [ ] After write, pre-existing `role` and `onboarded` fields are preserved (spread confirmed)
- [ ] Route returns `{ success: true }` with status 200 on success
- [ ] Route returns 500 with error message on unexpected Clerk errors
- [ ] `pnpm typecheck` passes

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/app/api/forum/rules/accept/route.ts` | create | POST handler that writes forum rules acceptance to Clerk publicMetadata |

### File Ownership Notes

This is a new file in a new directory. No conflicts with other tasks.

The directory path `src/app/api/forum/rules/accept/` must be created — Next.js App Router will treat `route.ts` as the handler automatically once the file exists at that path.

---

## Implementation Guidance

### Full Implementation

Model directly after `src/app/api/auth/onboarding/route.ts`. Complete implementation:

```ts
import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const { version } = body;

    if (!version || typeof version !== 'string') {
      return NextResponse.json({ error: 'version is required' }, { status: 400 });
    }

    const clerk = await clerkClient();

    // Fetch existing user to preserve current publicMetadata fields
    const existingUser = await clerk.users.getUser(userId);

    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...existingUser.publicMetadata,          // CRITICAL: preserve role, onboarded, etc.
        forumRulesAcceptedAt: new Date().toISOString(),
        forumRulesAcceptedVersion: version,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forum rules accept error:', error);
    return NextResponse.json({ error: 'Failed to record acceptance' }, { status: 500 });
  }
}
```

### Why Spread is Critical

The Clerk `updateUserMetadata` call replaces `publicMetadata` entirely — it does not merge. Without the spread, calling this route would set `publicMetadata` to only:
```ts
{
  forumRulesAcceptedAt: "...",
  forumRulesAcceptedVersion: "v1.0"
}
```
...wiping `role` and `onboarded`, which breaks all role-based access checks across the app.

### Why Get User First

The `auth()` call does not return `publicMetadata` in App Router API routes — only `userId`. You must call `clerk.users.getUser(userId)` to read the existing metadata before writing.

### Comparison to onboarding/route.ts

The onboarding route sets `role` and `onboarded` as initial values (they were not previously set), so it doesn't spread. This accept route must spread because `role` and `onboarded` already exist and must be preserved. Do not copy the onboarding route's metadata write verbatim — use the spread pattern shown above.

---

## Boundaries

### Files You MUST NOT Touch

- `src/app/api/auth/onboarding/route.ts` (reference only, do not modify)
- `src/app/forum/page.tsx` (T004's file)
- `src/components/forum/` (T003's directory)
- `src/sanity/schemaTypes/` (T001's directory)

### Files Requiring Review

None for this task.

---

## Dependencies

### Upstream Tasks

None — T002 has no dependencies. Start immediately.

### Downstream Impact

Tasks that depend on this one: **T003** (the modal calls `POST /api/forum/rules/accept`)

Before T003 can be fully validated end-to-end, this route must be deployed/running.

---

## GitHub Context

**PRD:** 004_forum
**Branch:** `worktree/forum-T002`
**Worktree:** `.worktrees/forum/T002`
**Brief:** `.karimo/prds/004_forum/briefs/T002_forum.md`

---

## Commit Guidelines

```
feat(api): add POST /api/forum/rules/accept route

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before marking complete:
- [ ] All success criteria met
- [ ] `pnpm typecheck` passes
- [ ] Only `src/app/api/forum/rules/accept/route.ts` created — no other files touched
- [ ] Spread of `existingUser.publicMetadata` is present in the write call
- [ ] No imports from Sanity (this route is Clerk-only)

---

*Generated by KARIMO Brief Writer*
*PRD: forum | Task: T002 | Wave: 1*
