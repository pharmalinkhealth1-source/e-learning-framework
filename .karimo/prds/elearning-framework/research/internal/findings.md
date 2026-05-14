# Internal Research Findings — elearning-framework

## Key Patterns to Leverage

- **Sanity schemas:** `defineField`/`defineType`, named exports, registered in `schemaTypes/index.ts`. Every doc schema: `title`, `slug` (source: title), `publishedAt`. Reference via `{ type: 'reference', to: [{ type: '...' }] }`.
- **Clerk auth guard:** Every Route Handler: `import { auth }`, destructure `userId`, return 401 if null. Pattern established in `/api/forum/post/route.ts` and `/api/forum/comment/route.ts`.
- **Clerk metadata write:** `clerkClient().users.updateUserMetadata(userId, { publicMetadata: {...} })` — used in `/api/auth/onboarding/route.ts`. Direct template for progress tracking.
- **Clerk webhook:** `/api/webhooks/clerk/route.ts` with `svix` verification — reusable for `user.updated` hooks on progress sync.
- **Portable Text:** Array of blocks pattern + `@portabletext/react` rendering in use (forum). Drop-in for Text lesson type.
- **Persistent layout shell:** App Router `layout.tsx` files already present at app root and marketing sections. LMS can add `src/app/elearning/courses/[slug]/layout.tsx` following same pattern.
- **CSS Modules:** All components use `*.module.css` with `--hds-*` tokens. No Tailwind. No exceptions.
- **Sanity GROQ read client:** CDN-enabled with mock fallback in `src/sanity/lib/client.ts`. Mock map needs LMS entries for local dev.
- **Sanity write client:** `writeClient` in `src/sanity/lib/write-client.ts` (token-bearing). Use for `lessonProgress` document mutations.

## Gaps (Phase 1 Blockers)

- `course`, `courseModule`, `lesson`, `lessonProgress` schemas do not exist
- No `/elearning/courses/` route tree exists — `src/app/elearning/page.tsx` is a marketing stub only
- Middleware `isProtectedRoute` only covers `/forum(.*)` — LMS routes not protected
- No video, SCORM, LTI, or blob packages installed

## Important Constraints

- `courseModule` — do NOT name schema `module` (Node.js reserved identifier)
- `styled-components` seen in `CommentForm.tsx` — DO NOT follow this precedent in LMS
- React Compiler active — SCORM `window.API` assignment must be inside `useEffect` only
- Error boundaries via `error.tsx` files; do NOT use try-catch in render
- Clerk `publicMetadata` session token cap ~1.2KB ≈ 30 full UUIDs; use short IDs or tiered approach
