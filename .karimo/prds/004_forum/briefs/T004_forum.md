# Task Brief: T004

**Title:** Add server-side rules gate to forum/page.tsx
**PRD:** forum
**Priority:** must
**Complexity:** 3/10
**Model:** sonnet
**Wave:** 3
**Feature Issue:** Forum Rules Acceptance Gate (PRD 004)

---

## Objective

Insert a server-side acceptance gate near the top of `src/app/forum/page.tsx` that checks whether the authenticated user has accepted the current forum rules. If acceptance is required, render only `<ForumRulesModal>` — the forum listing is not sent to the client. If the `forumRules` Sanity document has not been seeded yet, allow forum access gracefully rather than blocking all users.

---

## Context

**Parent Feature:** Forum Rules Acceptance Gate (PRD 004)

`forum/page.tsx` is an async server component. It currently calls `auth()` and redirects unauthenticated users, then fetches forum posts from Sanity and renders the full listing. The gate is inserted between the auth check and the posts fetch, so if the user needs to accept rules, the expensive post queries are skipped entirely.

The gate logic requires two new async calls:
1. Fetch the `forumRules` Sanity document (version + rule cards)
2. Fetch the user's Clerk `publicMetadata` to read `forumRulesAcceptedAt` and `forumRulesAcceptedVersion`

If either field is missing, or acceptance is older than 30 days, or the version does not match the Sanity document, `needsRules` is `true` and only `<ForumRulesModal rulesDoc={rulesDoc} />` is returned.

This task is part of **Wave 3** — the final integration. It requires both T001 (Sanity schema) and T003 (the modal component) to be complete first.

---

## Research Context

### Patterns to Follow

- **Existing auth pattern:** `src/app/forum/page.tsx:28-31` — `const { userId } = await auth()` then `redirect('/sign-in')`. The gate goes directly after this block.
- **clerkClient import:** `import { auth, clerkClient } from '@clerk/nextjs/server'` — add `clerkClient` to the existing `auth` import
- **Sanity client:** `import { client } from '@/sanity/lib/client'` — already imported in `forum/page.tsx`. Use the same `client` for the new `forumRules` fetch.
- **Sanity singleton query pattern:** `*[_id == "forumRules"][0]{ ... }` — note `_id ==` not `_type ==` because forumRules is a singleton with a fixed ID

### Known Issues to Address

- The `clerkClient` import must be added to the existing `@clerk/nextjs/server` import line (currently only `auth` is imported)
- The new `ForumRulesModal` import must be added at the top of the file

### Dependencies

**File Dependencies:**
- `src/components/forum/ForumRulesModal.tsx` — created by T003, imported here
- `src/sanity/schemaTypes/forumRules.ts` — created by T001, must be registered so Sanity Studio can seed the document

---

## Requirements

1. Modify `src/app/forum/page.tsx` only — do not touch any other file
2. Add `clerkClient` to the `@clerk/nextjs/server` import
3. Add `import ForumRulesModal from '@/components/forum/ForumRulesModal'` at the top
4. After the `auth()` + redirect block, insert the gate logic:
   a. Fetch `rulesDoc` from Sanity using `_id == "forumRules"`
   b. Fetch user metadata from Clerk via `clerkClient().users.getUser(userId)`
   c. Compute `needsRules` using the 30-day + version check
   d. If `needsRules && rulesDoc`, return early with only `<ForumRulesModal>`
   e. If `rulesDoc` is null/undefined, log a warning and continue (graceful degradation)
5. Keep ALL existing forum rendering code (posts fetch, JSX, pagination) completely unchanged below the gate block

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] User without `forumRulesAcceptedAt` in Clerk metadata sees only `<ForumRulesModal>` — no forum listing
- [ ] User with fresh acceptance (< 30 days, matching version) sees the full forum listing
- [ ] User whose acceptance is > 30 days old sees `<ForumRulesModal>` again
- [ ] User with a stale `forumRulesAcceptedVersion` (Sanity version bumped) sees `<ForumRulesModal>`
- [ ] If Sanity `forumRules` document does not exist (null rulesDoc), forum loads normally
- [ ] Existing forum features unchanged: pagination, category filter, post listing all work
- [ ] No TypeScript errors
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` passes

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/app/forum/page.tsx` | modify | Add gate logic after auth check; add two imports |

### File Ownership Notes

This is the only file modified in Wave 3. The gate block is additive — it inserts new code between the auth check (line 31) and the posts fetch (line 34). The existing code below line 34 is untouched.

---

## Implementation Guidance

### Exact Diff to Apply

The current `forum/page.tsx` structure (relevant section):

```ts
// Line 1-11: existing imports
import * as React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import PostCard from '@/components/forum/PostCard';
import ForumSync from '@/components/forum/ForumSync';
import Navbar from '@/components/stripe/Navbar';
import Footer from '@/components/stripe/Footer';
import FooterCTA from '@/components/stripe/FooterCTA';
import styles from './ForumListing.module.css';
```

**Change 1 — update auth import and add modal import:**

```ts
import { auth, clerkClient } from '@clerk/nextjs/server';   // add clerkClient
import ForumRulesModal from '@/components/forum/ForumRulesModal';  // add after existing imports
```

The current function body starts at line 23. The auth check is at lines 28-31:

```ts
export default async function ForumListingPage({ searchParams }: ...) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const { category, page } = await searchParams   // <-- gate goes HERE, before this line
  const offset = ...
```

**Change 2 — insert gate block between auth check and searchParams destructure:**

```ts
  // --- Forum Rules Gate ---
  const rulesDoc = await client.fetch<{
    version: string;
    rules: { title: string; body: string }[];
  } | null>(
    `*[_id == "forumRules"][0]{ version, rules[]{ title, body } }`
  );

  if (rulesDoc) {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const meta = user.publicMetadata as {
      forumRulesAcceptedAt?: string;
      forumRulesAcceptedVersion?: string;
    };

    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const needsRules =
      !meta.forumRulesAcceptedAt ||
      new Date(meta.forumRulesAcceptedAt).getTime() < Date.now() - THIRTY_DAYS ||
      meta.forumRulesAcceptedVersion !== rulesDoc.version;

    if (needsRules) {
      return (
        <main>
          <ForumRulesModal rulesDoc={rulesDoc} />
        </main>
      );
    }
  } else {
    console.warn('[ForumGate] forumRules Sanity document not found — allowing access');
  }
  // --- End Forum Rules Gate ---

  const { category, page } = await searchParams   // existing code continues here
```

### Complete Updated File

After applying both changes, the top of the file reads:

```ts
import * as React from 'react';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import PostCard from '@/components/forum/PostCard';
import ForumSync from '@/components/forum/ForumSync';
import Navbar from '@/components/stripe/Navbar';
import Footer from '@/components/stripe/Footer';
import FooterCTA from '@/components/stripe/FooterCTA';
import styles from './ForumListing.module.css';
import ForumRulesModal from '@/components/forum/ForumRulesModal';
```

And the function body starts:

```ts
export default async function ForumListingPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // --- Forum Rules Gate ---
  const rulesDoc = await client.fetch<{
    version: string;
    rules: { title: string; body: string }[];
  } | null>(
    `*[_id == "forumRules"][0]{ version, rules[]{ title, body } }`
  );

  if (rulesDoc) {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const meta = user.publicMetadata as {
      forumRulesAcceptedAt?: string;
      forumRulesAcceptedVersion?: string;
    };

    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const needsRules =
      !meta.forumRulesAcceptedAt ||
      new Date(meta.forumRulesAcceptedAt).getTime() < Date.now() - THIRTY_DAYS ||
      meta.forumRulesAcceptedVersion !== rulesDoc.version;

    if (needsRules) {
      return (
        <main>
          <ForumRulesModal rulesDoc={rulesDoc} />
        </main>
      );
    }
  } else {
    console.warn('[ForumGate] forumRules Sanity document not found — allowing access');
  }
  // --- End Forum Rules Gate ---

  const { category, page } = await searchParams
  // ... rest of existing code unchanged ...
```

### Why the Gate Is Wrapped in `if (rulesDoc)`

If the admin has not yet seeded the `forumRules` document in Sanity Studio (e.g., right after T001 is deployed), `rulesDoc` will be `null`. Without the null guard, `needsRules` would be `true` (because `rulesDoc.version` would throw), blocking all users from the forum. The null guard ensures the forum remains accessible during rollout.

### Sanity Query Detail

The query `*[_id == "forumRules"][0]` uses `_id ==` (not `_type ==`) because the document is a singleton with a fixed ID. Using `_type == 'forumRules'` would also work, but the fixed-ID query is more precise. The `[0]` returns a single object or `null` — not an array.

### TypeScript: Casting publicMetadata

Clerk's `publicMetadata` is typed as `Record<string, unknown>`. The `as { forumRulesAcceptedAt?: string; forumRulesAcceptedVersion?: string }` cast is correct — use optional fields since these may not be set on existing users.

### Performance Note

The gate adds two async calls (one Sanity, one Clerk) for every forum page load. Both are fast in practice (< 50ms each). The Sanity call is read-only and cacheable. If performance becomes a concern in future, the Sanity call can be wrapped in `next/cache` `unstable_cache`, but do not add caching in this task.

---

## Boundaries

### Files You MUST NOT Touch

- `src/components/forum/ForumRulesModal.tsx` (T003's file — import it, don't modify it)
- `src/app/api/forum/rules/accept/route.ts` (T002's file)
- `src/sanity/schemaTypes/` (T001's directory)
- Any other file in `src/app/forum/` besides `page.tsx`
- `ForumListing.module.css`

### Files Requiring Review

None for this task.

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|------------------|------------------------|
| T001 | `forumRules` Sanity schema registered | Confirm `src/sanity/schemaTypes/forumRules.ts` exists and is in `index.ts` |
| T003 | `ForumRulesModal` component | Confirm `src/components/forum/ForumRulesModal.tsx` exists with default export |

### Downstream Impact

Tasks that depend on this one: None — T004 is the final task for this PRD.

**Before starting:** Verify T001 and T003 are complete by checking that both files exist.

---

## GitHub Context

**PRD:** 004_forum
**Branch:** `worktree/forum-T004`
**Worktree:** `.worktrees/forum/T004`
**Brief:** `.karimo/prds/004_forum/briefs/T004_forum.md`

---

## Commit Guidelines

```
feat(forum): add server-side rules acceptance gate to forum page

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before marking complete:
- [ ] All success criteria met
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` passes
- [ ] Only `src/app/forum/page.tsx` modified
- [ ] All existing forum code (posts fetch, JSX, pagination) is intact below the gate block
- [ ] Gate block is wrapped in `if (rulesDoc)` null guard
- [ ] `console.warn` fires when rulesDoc is null (graceful degradation logged)
- [ ] No `any` types introduced (use proper cast for publicMetadata)

---

*Generated by KARIMO Brief Writer*
*PRD: forum | Task: T004 | Wave: 3*
