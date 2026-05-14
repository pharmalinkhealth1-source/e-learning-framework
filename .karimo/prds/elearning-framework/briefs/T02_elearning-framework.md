# Brief: Clerk Roles + Registration Flow
**Task ID:** T02
**PRD:** elearning-framework
**Wave:** 1
**Complexity:** 4
**Priority:** critical
**Model:** sonnet
**Depends On:** none
**Require Review:** true

---

## Objective
Extend the Clerk middleware to protect LMS routes and create the learner registration Route Handler that writes role metadata to Clerk. This task gates the entire LMS route tree behind authentication and establishes the `publicMetadata` shape that all downstream progress-tracking tasks depend on.

---

## Context

**`src/middleware.ts` is a `require_review` file.** Changes must be reviewed before merging. The review gate is specifically to confirm that existing `/forum(.*)` protection and onboarding redirect logic are fully preserved.

**Patterns to follow:**

- `isProtectedRoute` in middleware uses `createRouteMatcher` from `@clerk/nextjs/server`. Add new LMS paths to the existing array — do NOT replace or restructure the matcher.
- The existing protected paths include `/forum(.*)` — the new paths to add are `/elearning/courses(.*)` and `/elearning/dashboard(.*)`.
- The onboarding redirect logic (checking `sessionClaims?.metadata?.onboarded`) must not be touched.
- The registration Route Handler pattern is established at `src/app/api/auth/onboarding/route.ts` — use `auth()` then `clerkClient().users.updateUserMetadata(userId, { publicMetadata: {...} })`. This is the direct template.
- Auth guard in every Route Handler: `import { auth } from '@clerk/nextjs/server'`, destructure `userId`, return `Response.json({ error: 'Unauthorized' }, { status: 401 })` if `!userId`. See `src/app/api/forum/post/route.ts` and `src/app/api/forum/comment/route.ts`.
- TypeScript: extend the `sessionClaims` metadata type by adding an augmentation of Clerk's `CustomSessionClaims` interface to `src/types/clerk.d.ts`. The Clerk session claims type extension should be added to `src/types/clerk.d.ts` as an augmentation of Clerk's `CustomSessionClaims` interface — not inline in middleware — so all files (`src/middleware.ts`, Route Handlers) share the same extended type definition.

**Username generation rule:**
- Input: `phoneNumber` field (e.g., `+254712345678` for Kenya or `0712345678` local format)
- Strip `+` character
- Strip leading `0`s after the country code is confirmed
- Result: `254712345678` — this is the auto-generated username
- Phone number is the unique user identifier; duplicate phone = duplicate username = reject with 409

**`publicMetadata` shape written on registration:**
```typescript
{
  role: 'learner',
  country: string,        // ISO country code from registration form
  lms_registered: true,
  completedLessons: [],   // empty array, updated by T03/T05 progress API
}
```

---

## Files to Create / Modify
| Path | Action | Notes |
|------|--------|-------|
| `src/middleware.ts` | modify | Add LMS routes to `isProtectedRoute` array |
| `src/types/clerk.d.ts` | create | Augment `CustomSessionClaims` with LMS metadata fields |
| `src/app/api/lms/register/route.ts` | create | POST handler for learner registration |

---

## Implementation Steps

### Step 1 — Extend `src/middleware.ts`

Open `src/middleware.ts` and locate the `createRouteMatcher` call. Add the two new LMS paths to the existing array:
```typescript
const isProtectedRoute = createRouteMatcher([
  '/forum(.*)',
  // --- existing paths ---
  '/elearning/courses(.*)',      // ADD
  '/elearning/dashboard(.*)',    // ADD
])
```

Create (or update) `src/types/clerk.d.ts` with an augmentation of Clerk's `CustomSessionClaims` interface:
```typescript
export {}

declare global {
  interface CustomSessionClaims {
    metadata?: {
      onboarded?: boolean
      role?: 'learner' | 'program_manager' | 'partner_donor' | 'system_admin'
      country?: string
      completedLessons?: string[]
      lms_registered?: boolean
    }
  }
}
```
Do NOT add the type extension inline in `src/middleware.ts`. Do NOT modify the onboarding redirect block. Do NOT reorder or restructure any existing middleware logic.

### Step 2 — Create `src/app/api/lms/register/route.ts`

Create the directory path `src/app/api/lms/` if it does not exist.

The handler:

1. Auth guard: `const { userId } = await auth()` — return 401 if `!userId`.

2. Parse request body. Accept and validate these fields:
   - `firstName`: string, required
   - `lastName`: string, required
   - `dob`: string `YYYY-MM-DD`, required, validate age >= 18 (compare against today's date)
   - `gender`: string, required
   - `province`: string, required
   - `healthWorkerType`: string enum required — one of: `'community_pharmacist' | 'hospital_pharmacist' | 'regulatory_pharmacist' | 'industry_pharmacist' | 'informatics_pharmacist' | 'pharmacy_manager' | 'other'`
   - `pharmacy`: string, required
   - `email`: string, required, validate format (basic regex or `email.includes('@')`)
   - `phoneNumber`: string, required
   - `country`: string, required (ISO code)
   - `language`: string, required

3. Return `400` with field-level error object for any validation failure:
   ```json
   { "errors": { "dob": "Must be 18 or older", "email": "Invalid format" } }
   ```

4. Generate username from `phoneNumber`:
   - Remove `+`
   - Remove leading `0`s from the portion after the country code (or simply trim all leading zeros if the number starts with `0`)
   - Example: `+254712345678` → `254712345678`

5. Call the Clerk client using the two-step pattern matching `src/app/api/auth/onboarding/route.ts`:
   ```typescript
   const clerk = await clerkClient()
   await clerk.users.updateUserMetadata(userId, { publicMetadata: { role: 'learner', country, lms_registered: true, completedLessons: [] } })
   ```

6. Optionally update the Clerk user's `username` field to the generated username:
   ```typescript
   const clerk = await clerkClient()
   await clerk.users.updateUser(userId, { username: generatedUsername })
   ```

7. Return `200` with `{ success: true }`.

8. Return `409` if the phone number / username already exists (catch the Clerk API error and map to 409).

---

## Acceptance Criteria
- [ ] `/elearning/courses/*` routes redirect unauthenticated users to Clerk sign-in
- [ ] `/elearning/dashboard/*` routes redirect unauthenticated users to Clerk sign-in
- [ ] Existing `/forum(.*)` protection unchanged and functional
- [ ] Existing onboarding redirect logic unchanged
- [ ] `POST /api/lms/register` validates DOB >= 18 years old
- [ ] `POST /api/lms/register` validates email format
- [ ] `POST /api/lms/register` validates all required fields, returns 400 with field-level errors
- [ ] `POST /api/lms/register` sets `publicMetadata.role = 'learner'` on success
- [ ] `POST /api/lms/register` sets `publicMetadata.lms_registered = true` on success
- [ ] `POST /api/lms/register` sets `publicMetadata.completedLessons = []` on success
- [ ] Username generated correctly: strip `+` and leading `0`s from phone number
- [ ] `src/types/clerk.d.ts` augments `CustomSessionClaims` with `onboarded`, `role`, `country`, `completedLessons`, `lms_registered`
- [ ] `npx tsc --noEmit` passes

---

## Dependencies
- No upstream task dependencies — this task can start immediately.
- Clerk is already configured in the project (`src/middleware.ts` exists, `/api/auth/onboarding/route.ts` exists as a reference).

---

## Do Not
- Do NOT change or reorder existing `isProtectedRoute` paths — only add to the array.
- Do NOT touch the onboarding redirect logic in `src/middleware.ts` (the block checking `sessionClaims?.metadata?.onboarded`).
- Do NOT add `/elearning` (root path, without trailing wildcard) as a protected route — the marketing/catalogue page is public.
- Do NOT install `ltijs` — not needed for this task.
- Do NOT touch `src/sanity/lib/client.ts`, `src/sanity/lib/write-client.ts`, `sanity.config.ts`, or `.env*` files.
- Do NOT set `role` to anything other than `'learner'` in the registration handler — admin roles are provisioned separately.
- Do NOT follow the `styled-components` pattern from `CommentForm.tsx` in any UI code added by this task.

---

*Generated by KARIMO Brief Writer*
*PRD: elearning-framework | Task: T02 | Wave: 1*
