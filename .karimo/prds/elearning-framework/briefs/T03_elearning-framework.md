# Brief: Course Journey + PlayerShell
**Task ID:** T03
**PRD:** elearning-framework
**Wave:** 2a
**Complexity:** 5
**Priority:** critical
**Model:** sonnet
**Depends On:** T00, T01, T02
**Require Review:** true

---

## Objective
Build the complete course journey UI: a Server Component course catalogue, course overview page, the persistent PlayerShell layout, the lesson renderer (with typed placeholder slots for SCORM and Survey), and the progress Route Handler. This is the structural backbone of the LMS — T04, T05, and T06 integrate against the renderer page and progress API created here without modifying them.

---

## Context

**Patterns to follow from existing codebase:**
- Server Components by default — only add `'use client'` when the component uses event handlers or browser APIs.
- `src/app/elearning/page.tsx` currently exists as a `'use client'` marketing stub — replace it entirely with a Server Component. Preserve any Navbar/Footer/FooterCTA wrappers and `--hds-*` token patterns from the existing `page.module.css`.
- The App Router persistent layout pattern: `layout.tsx` files at `src/app/elearning/courses/[slug]/layout.tsx` — follow the same pattern used at `src/app/layout.tsx` and other existing marketing layout files. This ensures the PlayerShell is mounted once and persists across `[moduleSlug]` route changes without re-mount.
- CSS Modules only: all styling via `*.module.css` files with `--hds-*` tokens. Zero Tailwind. Zero inline styles.
- GROQ reads use `client` (CDN) from `src/sanity/lib/client.ts`. Mutations use `writeClient` from `src/sanity/lib/write-client.ts`.
- Auth guard pattern for Route Handlers: `const { userId } = await auth()` → return 401 if `!userId` (see `src/app/api/forum/comment/route.ts`).
- Sanity types: import from the generated `sanity.types.ts` (produced by T01). Use typed GROQ result shapes.

**PlayerShell is a layout, not a component:** Implement it as `src/app/elearning/courses/[slug]/layout.tsx`. T03 also creates a `src/components/lms/PlayerShell.tsx` that contains the actual shell markup — the layout file imports and renders it, passing children as the lesson content area. This satisfies both Next.js route persistence and reusability.

**Slot exports are contracts for T05 and T06:**
- Define `ScormPlayerSlot` and `SurveyFormSlot` in a dedicated file `src/components/lms/slots.tsx` — NOT in the page file itself. The page file imports and renders them from that module.
- `ScormPlayerSlot` renders `null`, accepts typed props `{ lessonId: string; entryUrl: string; scormVersion: '1.2' | '2004' }`.
- `SurveyFormSlot` renders `null`, accepts typed props `{ courseId: string }`.
- T05 will replace `ScormPlayerSlot` in `src/components/lms/slots.tsx` with the real `ScormPlayer` component.
- T06 will replace `SurveyFormSlot` in `src/components/lms/slots.tsx` with the real `SurveyForm` component.
- **The renderer page (`[moduleSlug]/page.tsx`) must NOT be modified by T05 or T06** — they modify `src/components/lms/slots.tsx` only.

**Progress API — denormalized fields:** When writing a `lessonProgress` document, the Route Handler must read `gender`, `country`, and `healthWorkerType` from Clerk `sessionClaims.metadata`. For `ageGroup`, derive it from the user's DOB stored in Clerk `publicMetadata` using these bands: `'<18'`, `'18-24'`, `'25-34'`, `'35-44'`, `'45+'`. These denormalized fields enable T08 dashboard GROQ filters without a Clerk API join.

**Clerk metadata completedLessons cap:** `publicMetadata.completedLessons` is a `string[]` of 8-char short lesson IDs. When the array length exceeds 25, fall back to a GROQ query against `lessonProgress` documents instead of reading from `publicMetadata`. The 8-char `lessonShortId` matches the `lessonShortId` field on the `lessonProgress` schema (T01).

**WCAG 2.1 AA on PlayerShell:**
- Keyboard navigation: sidebar items must be focusable and activatable with Enter/Space.
- `aria-label` on sidebar `<nav>` element and on each lesson link.
- Focus management: when navigating to a new lesson, move focus to the main content area.
- Progress bar: use `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`.

---

## Files to Create / Modify
| Path | Action | Notes |
|------|--------|-------|
| `src/app/elearning/page.tsx` | modify | Replace marketing stub with Server Component course catalogue |
| `src/app/elearning/page.module.css` | modify | Update styles for catalogue grid layout using `--hds-*` tokens |
| `src/app/elearning/courses/[slug]/page.tsx` | create | Course overview page (Server Component) |
| `src/app/elearning/courses/[slug]/page.module.css` | create | Course overview styles |
| `src/app/elearning/courses/[slug]/layout.tsx` | create | PlayerShell layout (wraps `[moduleSlug]` routes) |
| `src/app/elearning/courses/[slug]/layout.module.css` | create | Layout-level styles |
| `src/app/elearning/courses/[slug]/[moduleSlug]/page.tsx` | create | Lesson renderer (Server Component shell, exports Slots) |
| `src/app/elearning/courses/[slug]/[moduleSlug]/page.module.css` | create | Lesson renderer styles |
| `src/components/lms/PlayerShell.tsx` | create | Persistent sidebar + progress bar component |
| `src/components/lms/PlayerShell.module.css` | create | PlayerShell styles |
| `src/components/lms/slots.tsx` | create | Slot stub exports for `ScormPlayerSlot` and `SurveyFormSlot` |
| `src/app/api/lms/progress/route.ts` | create | POST progress Route Handler |

---

## Implementation Steps

### Step 1 — Replace `src/app/elearning/page.tsx` (Course Catalogue)
1. Remove `'use client'` directive — this becomes a Server Component.
2. Add `async` to the component function.
3. GROQ query to fetch country-scoped + global courses:
   ```groq
   *[_type == "course" && ($userCountry in country || "global" in country)] {
     _id, title, slug, description, "moduleCount": count(modules)
   }
   ```
   Read `userCountry` from Clerk session: `const { sessionClaims } = await auth()` then `sessionClaims?.metadata?.country`.
4. Render course cards in a CSS Module grid. Each card links to `/elearning/courses/[slug]`.
5. Preserve any existing Navbar/Footer/FooterCTA wrapper structure from the old stub.

### Step 2 — Create Course Overview Page (`courses/[slug]/page.tsx`)
Server Component. Fetch course by slug from Sanity including full module and lesson list. Render:
- Hero section: course title and description
- Module list with lesson titles
- Enrol CTA button (links to first lesson: `/elearning/courses/[slug]/[firstModuleSlug]`)

### Step 3 — Create PlayerShell Layout (`courses/[slug]/layout.tsx`)
This is a Next.js App Router layout file. It wraps all `[moduleSlug]` pages:
```typescript
export default function PlayerShellLayout({ children, params }: { children: React.ReactNode; params: { slug: string } }) {
  return <PlayerShell slug={params.slug}>{children}</PlayerShell>
}
```
`PlayerShell` is a Server Component that fetches the course module/lesson tree for the sidebar.

### Step 4 — Create `src/components/lms/PlayerShell.tsx`
Server Component (no `'use client'`). Fetches course structure from Sanity. Renders:
- Sidebar: collapsible module sections, lesson links with completion indicators (✓ or pending icon based on `completedLessons` array from Clerk session claims)
- Progress bar: `completedLessons.length / totalLessons * 100`
- Breadcrumb: Course > Module > Lesson
- `<main>` content area where `children` (lesson content) is rendered
- WCAG AA: `<nav aria-label="Course navigation">`, `role="progressbar"` on progress element

Completion state logic:
- If `sessionClaims.metadata.completedLessons.length <= 25`: read from `completedLessons` string array
- If `> 25`: run GROQ query `*[_type == "lessonProgress" && userId == $userId && courseId == $courseId && completed == true].lessonShortId`

### Step 5 — Create Lesson Renderer (`[moduleSlug]/page.tsx`)
Server Component. Fetch lesson by `moduleSlug` from Sanity. The GROQ projection for the lesson must include `scormVersion` alongside `scormEntryUrl`:
```groq
*[_type == "lesson" && slug.current == $moduleSlug][0] {
  _id, title, type, content, scormEntryUrl, scormVersion, questions, quizRole
}
```
Determine lesson type:
- `type === 'text'`: render `<TextLesson content={lesson.content} />` (Portable Text via `@portabletext/react`)
- `type === 'scorm'`: render `<ScormPlayerSlot lessonId={lesson._id} entryUrl={lesson.scormEntryUrl} scormVersion={lesson.scormVersion} />` — `scormVersion` is available because the `lesson` schema includes this field (T01)
- `type === 'quiz'`: render `<QuizEngine ... />` (stub for T04 — can render a placeholder `<div>Quiz coming in T04</div>` or import from a file T04 will create)

At the bottom of the page (after lesson content): render `<SurveyFormSlot courseId={course._id} />`

Create `src/components/lms/slots.tsx` that exports:
```typescript
// Replaced by T05
export function ScormPlayerSlot(_props: { lessonId: string; entryUrl: string; scormVersion: '1.2' | '2004' }): null { return null }
// Replaced by T06
export function SurveyFormSlot(_props: { courseId: string }): null { return null }
```
In `[moduleSlug]/page.tsx`, import these from `'@/components/lms/slots'` and render them. The page file does NOT define the slots itself.

### Step 6 — Create `POST /api/lms/progress/route.ts`
1. Auth guard: return 401 if no `userId`.
2. Read from Clerk session: `gender`, `country`, `healthWorkerType`, `lms_registered` from `sessionClaims.metadata`. Derive `ageGroup` from DOB (fetch via `clerkClient().users.getUser(userId)` to get DOB if not in session claims, then compute age band).
3. Accept body: `{ lessonId: string; lessonShortId: string; courseId: string; completed: boolean; timeSpent?: number }`.
4. Upsert `lessonProgress` document via `writeClient`:
   ```typescript
   await writeClient.createOrReplace({
     _type: 'lessonProgress',
     _id: `lp_${userId}_${lessonId}`,
     userId, lessonId, lessonShortId, courseId, completed, timeSpent,
     completedAt: completed ? new Date().toISOString() : undefined,
     gender, ageGroup, healthWorkerType, country,
   })
   ```
5. If `completed === true`: update `publicMetadata.completedLessons`:
   - Fetch current `completedLessons` from Clerk.
   - Append `lessonShortId` if not already present.
   - Call using the two-step pattern: `const clerk = await clerkClient(); await clerk.users.updateUserMetadata(userId, { publicMetadata: { completedLessons: updated } })`.
   - If `completedLessons.length > 25` already: skip the metadata write (already falling back to GROQ) and only write to Sanity.
6. Return `200 { success: true }`.

---

## Acceptance Criteria
- [ ] Course catalogue page is a Server Component (no `'use client'` directive)
- [ ] Catalogue shows country-scoped + global courses from Sanity
- [ ] Course overview page shows module and lesson list with enrol CTA
- [ ] `layout.tsx` at `courses/[slug]/` level wraps all `[moduleSlug]` routes
- [ ] PlayerShell persists across lesson navigation without re-mount (no layout.tsx re-render)
- [ ] Sidebar shows correct completion state per lesson (checkmark for completed)
- [ ] Progress bar displays correct percentage and uses `role="progressbar"` with ARIA attributes
- [ ] Sidebar has `aria-label` on `<nav>`, keyboard navigable with Enter/Space
- [ ] Lesson renderer handles `text`, `scorm`, `quiz` lesson types
- [ ] TextLesson renders Portable Text with HDS typography tokens
- [ ] `src/components/lms/slots.tsx` created with `ScormPlayerSlot` (renders null, typed props)
- [ ] `src/components/lms/slots.tsx` created with `SurveyFormSlot` (renders null, typed props)
- [ ] `[moduleSlug]/page.tsx` imports slots from `'@/components/lms/slots'` — does not define them inline
- [ ] `POST /api/lms/progress` writes `lessonProgress` document to Sanity with denormalized `gender`, `ageGroup`, `healthWorkerType`, `country` fields
- [ ] `POST /api/lms/progress` updates `publicMetadata.completedLessons` with 8-char short ID
- [ ] Falls back to GROQ for completion state when `completedLessons.length > 25`
- [ ] All new styles use CSS Modules + `--hds-*` tokens; no Tailwind
- [ ] `npx tsc --noEmit` passes

---

## Dependencies
Before starting, verify:
- T00 complete: `scorm-again`, `@vercel/blob`, `jszip`, `@react-pdf/renderer` present in `package.json`.
- T01 complete: `sanity.types.ts` exists and exports types for `course`, `courseModule`, `lesson`, `lessonProgress`.
- T02 complete: `isProtectedRoute` in `src/middleware.ts` includes `/elearning/courses(.*)`.

---

## Do Not
- Do NOT add `'use client'` to `page.tsx` files (catalogue, course overview, lesson renderer) — they are Server Components.
- Do NOT implement `PlayerShell` as a standalone page-level component only — it MUST be the `courses/[slug]/layout.tsx` to get App Router persistence.
- Do NOT define slot stubs inline in `[moduleSlug]/page.tsx` — they must live in `src/components/lms/slots.tsx`. T05 and T06 modify `src/components/lms/slots.tsx` only; they must NOT modify `[moduleSlug]/page.tsx`.
- Do NOT use `useMemo` or `useCallback` — React Compiler is active.
- Do NOT touch `src/sanity/lib/client.ts`, `src/sanity/lib/write-client.ts`, `sanity.config.ts`, or `.env*` files.
- Do NOT follow the `styled-components` pattern from `CommentForm.tsx`.
- Do NOT add video (Mux) lesson type support — PRD-B scope only.

---

*Generated by KARIMO Brief Writer*
*PRD: elearning-framework | Task: T03 | Wave: 2a*
