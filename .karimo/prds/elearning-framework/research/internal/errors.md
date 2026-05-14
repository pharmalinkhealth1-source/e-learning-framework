# Internal Gaps and Risks — elearning-framework

## Missing Sanity Schemas (Critical)

None of the three LMS document types exist:
- `course` — no schema, no mock data, not registered in `index.ts`
- `module` — no schema
- `lesson` — no schema

No `lessonProgress` / `activityLog` schema exists either. The PRD proposes syncing deep progress (scores, time-on-page) to a Sanity Activity table — this schema must be designed.

The `author` schema already has `clerkId`. The LMS will need to reference `author` documents for progress ownership, but the `author` schema may need an `initials` field (currently used in comment queries as `author->initials` but not defined in `author.ts` — likely a latent bug in the forum feature too).

## Missing Route Structure

The `/courses/[slug]/lesson/[id]` route tree does not exist. The current `src/app/elearning/page.tsx` is a standalone marketing page with no sub-routes. Required new structure:

```
src/app/elearning/
  courses/
    [slug]/
      layout.tsx          (persistent player shell)
      page.tsx            (course overview)
      lesson/
        [id]/
          page.tsx        (lesson renderer)
```

The persistent layout shell (layout.tsx at `courses/[slug]/`) is a new architectural pattern not yet used in this project.

## Middleware Gap

`src/middleware.ts` currently only protects `/forum(.*)`. The `/courses/(.*)` and `/elearning/courses/(.*)` routes will need to be added to `isProtectedRoute` matcher. Failing to do so means unauthenticated users can access lesson content.

## Clerk Metadata Constraints

**8KB total limit** on publicMetadata. Storing a "completed lessons" array as lesson IDs (UUIDs ~36 chars each) means the array can hold roughly 200 lesson IDs before hitting the ceiling. For a large course catalog this may be insufficient.

**Session token limit:** If `publicMetadata` is included in the session JWT (as it is via `sessionClaims`), browser cookie limits apply. The effective safe limit is ~1.2KB for metadata surfaced through session claims. A completed-lessons array with 30+ entries would exceed this.

**Risk:** The PRD's strategy of storing completed lessons in `publicMetadata` for UI state is viable for small catalogs but will not scale. A fallback query to Sanity for progress state will be necessary once users exceed ~30 completed lessons.

**No `privateMetadata` currently used** — scores and sensitive progress data should go in `privateMetadata` or a dedicated Sanity document, not `publicMetadata`.

## SCORM/LTI — Zero Infrastructure

No SCORM or LTI code exists anywhere in the codebase:
- No iframe component
- No `window.API` or `window.API_1484_11` bridge
- No OIDC handler routes
- No blob storage configuration
- No ZIP upload/extraction pipeline

SCORM content delivery requires the parent page to inject the API object into the iframe's `window`. In Next.js App Router, the SCORM bridge must be a `"use client"` component (cannot use Server Components for `window` manipulation).

## React Compiler Risk Areas

React Compiler is active (`reactCompiler: true` in `next.config.ts`). The following LMS patterns are potentially problematic:

1. **SCORM bridge:** The bridge uses `window.API` mutation (interior mutability via `window` global). The compiler cannot reason about side effects on `window`. The ScormPlayer component must use `// eslint-disable-next-line react-compiler` or be isolated outside React's render tree.

2. **useRef for iframe refs:** React Compiler skips optimization for `useRef`-dependent logic. Iframe ref-based SCORM communication is safe but won't be auto-memoized.

3. **try-catch in render:** The compiler has known issues with try-catch patterns. Avoid wrapping render logic in try-catch; move error boundaries to separate components.

4. **`styled-components` in CommentForm.tsx:** `styled-components` uses interior mutability internally. New LMS components must not use `styled-components`.

## Elearning Page Conflict

The existing `src/app/elearning/page.tsx` is a marketing stub (`"use client"`, no data fetching). It does not conflict structurally, but:
- The URL `/elearning` will remain a marketing page
- The LMS lives at `/elearning/courses/...` (or a separate root like `/courses/...`)
- The PRD specifies `/courses/[slug]/lesson/[id]` — this implies either renaming the route root or nesting under `/elearning/`
- Decision needed: keep `/elearning` as marketing + `/elearning/courses/` as LMS, or use `/courses/` at root

## Missing Sanity `initials` Field

The forum comment query uses `author->initials` but `author.ts` does not define an `initials` field. This will return `null` for all authors. The LMS player will likely want to display user initials too — add `initials: { type: 'string' }` to the `author` schema.

## No Existing Video Components

No video player component exists in `src/components/`. The LMS Video lesson type requires building a `VideoPlayer` wrapper from scratch with HDS CSS Module styling.

## write-client Token Not Scoped

`writeClient` uses a single `SANITY_API_WRITE_TOKEN` environment variable with no mention of token scoping. For LMS progress writes (potentially high frequency), a separate scoped token for the progress API route is advisable.
