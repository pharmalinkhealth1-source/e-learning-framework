# PRD: Forum Rules Acceptance Gate

**Slug:** forum  
**PRD Number:** 004  
**Status:** ready  
**Created:** 2026-05-18  
**Feature:** Forum rules modal that gates access to the community forum

---

## Problem Statement

The forum currently allows any authenticated user to access and post immediately. The client requires users to read and accept 11 community rules before participating. Acceptance must be re-prompted every 30 days and whenever the rules are updated by an administrator.

---

## Goals

1. Show an 11-step rules modal to users on first forum visit
2. Re-show modal if >30 days since last acceptance
3. Re-show modal if the admin has published a new rules version
4. Store acceptance server-side (not localStorage) — cross-device, compliance-grade
5. Gate is enforced server-side — no flash of forum content before modal

---

## Non-Goals

- Rules content editing in this PRD (content pre-approved by client, seeded via script)
- Email notifications for rule updates
- Audit log of acceptances

---

## Architecture

### Storage: Clerk `publicMetadata`

Two new fields stored per-user in Clerk:
```ts
publicMetadata: {
  forumRulesAcceptedAt: string    // ISO timestamp of last acceptance
  forumRulesAcceptedVersion: string  // e.g. "v1.0"
}
```

Written only via server API route (not `unsafeMetadata`). Must spread existing metadata on write to preserve `role`, `onboarded`.

### Rules Versioning: Sanity Singleton

Sanity document (`_id: 'forumRules'`) holds:
```ts
{
  version: string          // admin bumps to re-trigger all users
  updatedAt: datetime
  rules: [{ title, body }] // array of 11 rule cards
}
```

Admin updates version string in Sanity Studio → all users re-prompted on next forum visit. No code deploy needed.

### Gate Logic (Server-Side)

Computed in `src/app/forum/page.tsx`:
```ts
const needsRules =
  !acceptedAt ||
  new Date(acceptedAt).getTime() < Date.now() - 30 * 24 * 60 * 60 * 1000 ||
  acceptedVersion !== rulesDoc.version;
```

If `needsRules === true`, render only `<ForumRulesModal>` — not the forum listing.

---

## User Flow

1. Authenticated user navigates to `/forum`
2. Server fetches user's `publicMetadata` + current Sanity rules version
3. **If acceptance required:** render only `<ForumRulesModal rulesDoc={rulesDoc} />` — forum content not rendered
4. User steps through 11 rule cards (Next/Back navigation, progress bar)
5. On step 11: checkbox + "Accept & Enter Forum" button
6. Accept → `POST /api/forum/rules/accept` → updates Clerk metadata → `router.refresh()` → forum loads
7. "I Do Not Agree" → `router.push('/')` (exit platform)

---

## Constraints

- Port Elementor modal copy verbatim (11 steps, client-approved)
- "I Do Not Agree" must redirect to `/` not just close
- Spread existing `publicMetadata` on update (preserve `role`, `onboarded`)
- Modal renders server-side conditional — no client-side flash

---

## Research Findings

See `research/summary.md` for full findings.

**Key decisions:**
- Clerk `publicMetadata` (not localStorage, not unsafeMetadata)
- Sanity singleton for rules + versioning
- Server-side gate in page.tsx
- `router.refresh()` after accept (re-runs server component without full navigation)

---

## Tasks

See `tasks.yaml`.

---

## Success Criteria

- [ ] New user sees modal on first `/forum` visit
- [ ] Accepting rules allows access to forum listing
- [ ] Declining redirects to `/`
- [ ] User who accepted >30 days ago sees modal again
- [ ] Admin bumping Sanity `version` field re-prompts all users
- [ ] Acceptance persists across devices/browsers (server-side)
- [ ] No flash of forum content before modal
