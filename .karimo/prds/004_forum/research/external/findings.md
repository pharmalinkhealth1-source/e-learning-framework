# External Research: Forum Rules Modal

## Storage Strategy: Why Not localStorage

localStorage is per-device and per-browser — a user who clears their cache or switches devices sees the modal again immediately. For a professional compliance gate (patient confidentiality rules with legal consequences), this is unacceptable. Server-side acceptance is required.

## Recommended Storage: Clerk publicMetadata

Clerk `publicMetadata` is:
- Server-writable only (via `clerkClient().users.updateUserMetadata()`) — not writable from client JS
- Readable server-side via `auth()` + `clerkClient()` — zero extra DB call at page load
- Readable client-side via `useUser()` → `user.publicMetadata`
- Persists across devices and browsers

Store two fields:
```ts
publicMetadata: {
  forumRulesAcceptedAt: string // ISO timestamp
  forumRulesAcceptedVersion: string // e.g. "v1.2"
}
```

## Rules Versioning Strategy: Sanity Document

Store rules in Sanity as a singleton document (`_id: 'forumRules'`):
```ts
{
  _type: 'forumRules',
  version: 'v1.2',        // admin bumps this when rules change
  updatedAt: datetime,
  rules: [{ title, body }] // array matching the modal steps
}
```

Benefits:
- Admin can update rules content + bump version in Sanity Studio without code deploy
- Server component fetches current version at render time — no client-side version check needed
- Version string comparison is a simple string equality check

## Gate Logic (Server-Side)

In `src/app/forum/page.tsx` (server component):

```ts
const { userId } = await auth();
const clerk = await clerkClient();
const user = await clerk.users.getUser(userId);
const meta = user.publicMetadata;

const rulesDoc = await client.fetch(`*[_id == "forumRules"][0]{ version }`);

const acceptedAt = meta.forumRulesAcceptedAt as string | undefined;
const acceptedVersion = meta.forumRulesAcceptedVersion as string | undefined;
const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

const needsRules =
  !acceptedAt ||
  new Date(acceptedAt).getTime() < thirtyDaysAgo ||
  acceptedVersion !== rulesDoc?.version;
```

Pass `needsRules` + `rulesDoc` as props to a client component wrapper.

## Modal Component Pattern

```
src/components/forum/ForumRulesModal.tsx  // 'use client', dialog/modal
src/app/api/forum/rules/accept/route.ts   // POST → updates publicMetadata
```

The modal:
1. Shows step-through cards (port the existing 11-step Elementor flow)
2. On accept → POST to API route → API updates Clerk `publicMetadata`
3. On success → `router.refresh()` to re-run server component (modal gone)
4. "I Do Not Agree" → `router.push('/')` (exit forum)

## Preventing Flash / UX

Since `needsRules` is computed server-side, the modal is conditionally rendered server-side — no flash of forum content. The forum listing markup is still sent to the client but the modal overlay blocks interaction.

Better: render the modal with `pointer-events: none; user-select: none` on the forum content when modal is shown, or simply conditionally render only the modal (not the forum content) until accepted.

## Accept API Route

```ts
// POST /api/forum/rules/accept
// Body: { version: string }
const clerk = await clerkClient();
await clerk.users.updateUserMetadata(userId, {
  publicMetadata: {
    ...user.publicMetadata,
    forumRulesAcceptedAt: new Date().toISOString(),
    forumRulesAcceptedVersion: body.version,
  }
});
```

Must spread existing metadata to avoid overwriting `role`, `onboarded`, etc.

## Do Not Use

- `unsafeMetadata` — client-writable, can be spoofed; wrong for compliance state
- `localStorage` — per-device, clearable, not cross-device
- Separate Sanity acceptance log — overkill; Clerk already has the right user store
