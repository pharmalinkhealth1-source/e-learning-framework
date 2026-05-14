# Brief: Notifications (email + in-app)
**Task ID:** T10
**PRD:** elearning-framework
**Wave:** 3
**Complexity:** 3
**Priority:** must
**Model:** sonnet
**Depends On:** T01, T02, T03, T07
**Require Review:** false

---

## Objective
Build the notification infrastructure that closes the learner feedback loop: expiry warnings, inactivity nudges, and in-app notification feed. T02 handles enrollment email; T07 handles certificate-ready email. T10 adds the remaining two automated events (expiry + inactivity) and the in-app UI.

## Context
- Notification Sanity schema: `notification` document defined in T01 (`_id` pattern: `notif_{userId}_{type}_{courseId_or_week}`)
- Clerk email API: use `const clerk = await clerkClient(); await clerk.emails.createEmail({...})` — check installed Clerk version's exact API in `src/app/api/auth/onboarding/route.ts` for the established pattern
- `writeClient` from `src/sanity/lib/write-client.ts` for all Sanity mutations
- `auth()` from `@clerk/nextjs/server` — guard all Route Handlers
- `getExpiringCertificates` and `getInactiveLearners` queries available from T08 (`src/sanity/lib/dashboardQueries.ts`)
- `NotificationFeed` renders inside `/elearning/my-learning` (T03) — the feed is a client component receiving notifications as props from the Server Component
- PlayerShell (T03) should have a notification bell slot in the header — T10 adds unread count badge

## Files to Create / Modify
| Path | Action | Notes |
|------|--------|-------|
| `src/app/api/lms/notifications/route.ts` | CREATE | GET — returns user's notifications |
| `src/app/api/lms/notifications/mark-read/route.ts` | CREATE | POST — marks read |
| `src/app/api/lms/notifications/send-expiry-warnings/route.ts` | CREATE | POST — admin/cron only |
| `src/components/lms/NotificationFeed.tsx` | CREATE | Client component |
| `src/components/lms/NotificationFeed.module.css` | CREATE | CSS Module |

## Implementation Steps

1. **GET /api/lms/notifications**: auth guard → query `*[_type == "notification" && userId == $userId] | order(createdAt desc) [0..19]` → return array

2. **POST /api/lms/notifications/mark-read**: auth guard → accept `{ notificationId?: string; all?: boolean }` → if `all`, patch all unread notifications for userId; if `notificationId`, patch single → use writeClient

3. **POST /api/lms/notifications/send-expiry-warnings**: auth guard → role check: `system_admin` only (403 otherwise) → call `getExpiringCertificates({ daysAhead: 30 })` → for each result: check if notification `notif_${userId}_certexpiring_${courseId}` exists → if not: write notification doc + send email via Clerk API with message "Your certificate for [course] expires on [date]." → return `{ sent: N, skipped: M }`

4. **POST /api/lms/notifications/send-inactivity-nudges** (add to send-expiry-warnings route file or separate): auth guard → system_admin only → call `getInactiveLearners({ daysSince: 7 })` → for each userId: derive week key `YYYY-WW` → check if `notif_${userId}_inactive_${weekKey}` exists → if not: write notification doc + send email "We miss you — continue your learning journey" → idempotent

5. **NotificationFeed component** (`'use client'`): accepts `notifications: SanityNotification[]` prop → renders list with unread dot indicator, message, relative timestamp, "Mark all read" button that calls `POST /api/lms/notifications/mark-read` → CSS Module with `--hds-*` tokens → WCAG: `role="list"`, `aria-label="Notifications"`

6. **Wire into My Learning page** (note for T03 executor): `NotificationFeed` should be importable from `@/components/lms/NotificationFeed`. The My Learning Server Component fetches notifications via `GET /api/lms/notifications` and passes as props. T03 leaves a `{/* NotificationFeed slot */}` comment placeholder — T10 replaces it with the real import and data fetch.

## Acceptance Criteria
- [ ] `GET /api/lms/notifications` returns 20 most recent notifications for current user
- [ ] `POST /api/lms/notifications/mark-read` marks single notification or all as read
- [ ] `send-expiry-warnings` writes notification docs + sends emails; idempotent on re-run
- [ ] Inactivity nudge is weekly-idempotent (one email per user per calendar week)
- [ ] `system_admin` gate enforced on `send-expiry-warnings` and inactivity routes (403 for others)
- [ ] `NotificationFeed` renders with read/unread states and mark-all-read button
- [ ] CSS Modules + `--hds-*` tokens; no styled-components, no Tailwind
- [ ] `npx tsc --noEmit` passes

## Dependencies
- T01 must be complete: `notification` Sanity schema and `sanity.types.ts` available
- T02 must be complete: `clerkClient()` email pattern established
- T03 must be complete: `/elearning/my-learning` page exists for NotificationFeed integration
- T07 must be complete: certificate documents have `expiresAt` field for expiry queries
- T08 must be complete: `getExpiringCertificates` and `getInactiveLearners` queries available

## Do Not
- Do not send enrollment emails (T02) or certificate-ready emails (T07) — those are handled in their respective tasks
- Do not modify `src/sanity/lib/client.ts` or `src/sanity/lib/write-client.ts`
- Do not use styled-components or Tailwind
- Do not use manual `useMemo`/`useCallback` (React Compiler active)
- Do not expose `send-expiry-warnings` or inactivity routes to non-`system_admin` roles
- Do not re-send notifications that already have a matching `_id` (idempotency is enforced by the `_id` check, not by catching errors)

---

*Generated by KARIMO Brief Corrector*
*PRD: elearning-framework | Task: T10 | Wave: 3*
