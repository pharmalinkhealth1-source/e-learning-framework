# External Best Practices — elearning-framework

## SCORM Bridge Implementation (Browser / Next.js)

**Pattern:** SCORM content must find `window.API` (1.2) or `window.API_1484_11` (2004) in its window or a parent window. The recommended approach in Next.js App Router:

1. Create a `"use client"` `ScormPlayer` component
2. On mount (useEffect), instantiate `scorm-again` and assign to `window.API` or `window.API_1484_11`
3. Render an `<iframe>` pointing to the SCORM entry HTML (served from Vercel Blob)
4. Use `scorm-again`'s event system (`window.API.on("LMSSetValue", ...)`) to capture progress commits
5. Forward commits to a Route Handler (`/api/lms/scorm-commit`) which writes to Sanity

**Cross-frame consideration:** If the iframe is sandboxed or cross-origin, use `scorm-again`'s `CrossFrameLMS` (parent) and `CrossFrameAPI` (child) bridge — communicates via `postMessage`, no SharedArrayBuffer needed.

**React Compiler caution:** `window.API = new Scorm12API(...)` is interior mutability. Wrap in `useEffect` with an empty dep array. Do not attempt to track `window.API` as React state.

**SCORM 1.2 key API calls to handle:**
- `LMSInitialize("")` — session start
- `LMSSetValue("cmi.core.lesson_status", "passed")` — completion
- `LMSSetValue("cmi.core.score.raw", "85")` — score
- `LMSFinish("")` — session end (trigger commit)

**SCORM 2004 key API calls:**
- `Initialize("")`
- `SetValue("cmi.completion_status", "completed")`
- `SetValue("cmi.score.scaled", "0.85")`
- `Terminate("")`

## LTI 1.3 OIDC Flow (Tool Provider)

**The problem with ltijs in Next.js:** `ltijs` requires Express.js and Node.js `http` module. Next.js Route Handlers use the Fetch API. The edge runtime blocks Node.js modules. Even with `{ serverless: true }`, mounting ltijs inside Next.js requires Express request/response mocking.

**Recommended approach for this project:** Custom OIDC implementation using `jose` (JWT) and Next.js Route Handlers.

**LTI 1.3 launch flow (3 steps):**
1. **OIDC Login Init** — Platform POSTs to `/api/lms/lti/login` with `iss`, `login_hint`, `target_link_uri`. Tool saves `state` in a cookie, redirects to Platform's auth endpoint.
2. **Authentication Request** — Platform POSTs JWT to `/api/lms/lti/launch`. Tool verifies JWT signature against Platform's public JWK keyset, extracts launch claims.
3. **Launch** — Tool creates session, redirects to `target_link_uri` (the lesson page).

**Key Route Handler endpoints:**
- `POST /api/lms/lti/login` — receive OIDC init, set state cookie, redirect
- `POST /api/lms/lti/launch` — verify JWT, extract claims, create user session
- `GET /api/lms/lti/keyset` — serve tool's public JWK set (if grade passback needed)

**ltijs as separate service:** An alternative is deploying ltijs as a standalone Node.js service (e.g., a separate Vercel Function at `lti.yourdomain.com`) and proxying from Next.js. This fully isolates the Express dependency.

## Clerk publicMetadata for Progress Tracking

**Size limits:**
- Total metadata: 8KB
- Session token (via sessionClaims): recommended under 1.2KB

**Recommended pattern for this project:**
- `publicMetadata.completedLessons`: `string[]` of lesson IDs — lightweight UI flag (has user completed this lesson?)
- `privateMetadata.lessonScores`: `Record<lessonId, number>` — scores, time-on-page
- Deep activity log → Sanity `lessonProgress` documents (not Clerk metadata)

**Write pattern** (already used in project at `/api/auth/onboarding`):
```typescript
const client = await clerkClient();
await client.users.updateUserMetadata(userId, {
  publicMetadata: { completedLessons: [...existing, lessonId] }
});
```

**Read in middleware** (already used): `sessionClaims?.metadata` — available synchronously in middleware without extra API call.

**Scaling strategy:** Once `completedLessons` exceeds ~30 entries (approaching 1.2KB), switch to querying Sanity `lessonProgress` documents for completion state instead of relying on session claims.

## Mux Video Player — Next.js App Router Integration

**Official pattern:** `@mux/mux-player-react` requires `"use client"`. Create a wrapper:

```tsx
// components/elearning/VideoLesson.tsx
"use client";
import MuxPlayer from "@mux/mux-player-react";
import styles from "./VideoLesson.module.css";

export function VideoLesson({ playbackId }: { playbackId: string }) {
  return (
    <div className={styles.container}>
      <MuxPlayer playbackId={playbackId} streamType="on-demand" />
    </div>
  );
}
```

Server Component passes `playbackId` (from Sanity) to this client wrapper. Style with CSS Module + `--hds-*` tokens.

**Alternative:** `next-video` package provides higher-level abstraction including automatic Mux uploads, but requires more configuration. For this project where Sanity manages content, direct `@mux/mux-player-react` is more appropriate.

**Sanity schema field:** Store `muxPlaybackId: { type: 'string' }` in lesson schema — simpler than storing full Mux asset URLs.

## Persistent Player Shell Pattern

**Next.js App Router:** Layouts at `courses/[slug]/layout.tsx` persist across child route navigations (lesson ID changes) without unmounting. This is the native mechanism for the persistent player shell described in the PRD.

**Server/Client split:**
- `layout.tsx` should be `"use client"` if it holds sidebar navigation state, progress bar state, or current lesson context
- Or: keep layout as Server Component, pass state down via context from a client wrapper inside it

**Pattern:** `layout.tsx` (Server Component) wraps a `<PlayerShell>` Client Component that receives course data as props and manages lesson navigation state. This minimizes bundle size while enabling client interactivity.

## Sanity TypeGen (Official)

`sanity-codegen` (community package) is deprecated. The official solution is **Sanity TypeGen**, built into the Sanity CLI:

```bash
npx sanity typegen generate
```

This generates `sanity.types.ts` with TypeScript interfaces for all schemas and GROQ query results. Use `defineQuery` from `@sanity/client` when writing GROQ queries — TypeGen will infer return types automatically.

No additional npm package needed — TypeGen is part of `sanity ^5.23.0` already installed.
