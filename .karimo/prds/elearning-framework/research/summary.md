# Research Summary — elearning-framework

## What We're Building
Bespoke Modular LMS on Next.js 16.2.4 App Router. Four lesson types: Text (Portable Text), Video (Mux), SCORM 1.2/2004 (iframe bridge), LTI 1.3 (OIDC Tool Provider). Clerk for auth + progress metadata. Sanity v5 for Course → Module → Lesson hierarchy. HDS tokens throughout.

## What Already Exists (Leverage These)
- Clerk auth guard pattern (Route Handlers) ✓
- Clerk webhook + Sanity sync infrastructure ✓
- Sanity write/read client separation ✓
- Portable Text rendering with `@portabletext/react` ✓
- CSS Modules + `--hds-*` token patterns ✓
- Persistent App Router `layout.tsx` shell pattern ✓
- `publicMetadata` write pattern (`updateUserMetadata`) ✓

## What Must Be Built
**Phase 1 — Core:**
1. Sanity schemas: `course`, `courseModule`, `lesson` (4 types), `lessonProgress`
2. Run `npx sanity typegen generate` → commit `sanity.types.ts`
3. Route tree: `elearning/courses/[slug]/layout.tsx` (PlayerShell) + `lesson/[id]/page.tsx`
4. Add `/elearning/courses(.*)` to middleware `isProtectedRoute`
5. Text lesson renderer (Portable Text — proven pattern)
6. `/api/lms/progress` Route Handler (update `publicMetadata.completedLessons`)
7. PlayerShell CSS Module + HDS tokens; sidebar nav; progress bar

**Phase 2 — SCORM:**
1. `npm install scorm-again @vercel/blob jszip`
2. `/api/lms/scorm-upload` Route Handler (ZIP → jszip extract → Blob upload)
3. `ScormPlayer` client component (`useEffect` mounts `window.API`; iframe; commit hooks)
4. `/api/lms/scorm-commit` Route Handler (Sanity `lessonProgress` + Clerk metadata)
5. Stage backdrop CSS (dark neutral container for iframe)

**Phase 3 — LTI:**
1. `npm install jose`
2. LTI config fields in `lesson` schema
3. Route Handlers: `/api/lms/lti/login`, `/api/lms/lti/launch`, `/api/lms/lti/keyset`
4. `LtiLesson` client component

**Phase 4 — Optimization:**
- Skeleton screens; Clerk metadata overflow fallback; `tsc --noEmit` clean pass

## Library Decisions
| Need | Package |
|------|---------|
| SCORM bridge | `scorm-again` |
| Video | `@mux/mux-player-react` |
| SCORM storage | `@vercel/blob` + `jszip` |
| LTI JWT | `jose` |
| TS codegen | `npx sanity typegen generate` (built-in) |

## Risk Register
| Risk | Severity | Mitigation |
|------|----------|-----------|
| `courseModule` naming | Low | Never use `module` as schema name |
| Clerk metadata overflow | Medium | Short IDs; fallback at >25 entries |
| SCORM cross-origin iframe | Medium | `CrossFrameLMS`/`CrossFrameAPI` pattern |
| `ltijs` incompatibility | High | Use `jose` directly for LTI OIDC |
| React Compiler + `window.API` | Low | All window writes in `useEffect` only |
