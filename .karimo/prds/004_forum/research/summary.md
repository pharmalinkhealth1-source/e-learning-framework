# Research Summary: Forum Rules Modal

**Feature**: Forum rules acceptance gate — shows on first visit, re-shows every 30 days or on rules update.

---

## Architecture Decision

**Store acceptance in Clerk `publicMetadata`** (server-writable, cross-device, per-user):
- `forumRulesAcceptedAt` — ISO timestamp of last acceptance
- `forumRulesAcceptedVersion` — version string matched against current rules

**Store rules content + version in Sanity** (`_id: 'forumRules'` singleton):
- Admin bumps `version` string in Studio when rules change → all users re-prompted
- No code deploy needed for rules updates

**Gate is server-side** — computed in `src/app/forum/page.tsx` before any HTML is sent. No flash.

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/sanity/schemaTypes/forumRules.ts` | New Sanity schema: singleton rules doc with version + rule cards |
| `src/components/forum/ForumRulesModal.tsx` | Client component: 11-step modal, accept/exit logic |
| `src/app/api/forum/rules/accept/route.ts` | POST: updates Clerk publicMetadata with timestamp + version |

## Files to Modify

| File | Change |
|------|--------|
| `src/sanity/schemaTypes/index.ts` | Register `forumRules` schema |
| `src/app/forum/page.tsx` | Fetch rules version + user acceptance; pass `needsRules` + `rulesDoc` to modal |

---

## Gate Logic (30-day + version check)

```ts
const needsRules =
  !acceptedAt ||
  new Date(acceptedAt).getTime() < Date.now() - 30 * 24 * 60 * 60 * 1000 ||
  acceptedVersion !== currentRulesVersion;
```

---

## Key Constraints

- Must spread existing `publicMetadata` when updating to preserve `role`/`onboarded`
- "I Do Not Agree" → `router.push('/')` (not just close)
- Modal content ports the 11-step Elementor design verbatim (client already approved copy)
- Do not use `unsafeMetadata` (client-spoofable) or `localStorage` (per-device)
