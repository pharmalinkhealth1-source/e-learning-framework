# External Research Findings — elearning-framework

## SCORM Bridge

- **Use `scorm-again`** — only actively maintained SCORM runtime for modern JS
- SCORM 1.2: `window.API = new Scorm12API({ autocommit: true, lmsCommitUrl: '/api/lms/scorm-commit' })`
- SCORM 2004: `window.API_1484_11 = new Scorm2004API({ autocommit: true, lmsCommitUrl: '/api/lms/scorm-commit' })`
- Cross-origin iframes (Vercel Blob): use `CrossFrameLMS` (parent) + `CrossFrameAPI` (child) — `window.API` direct injection doesn't cross origin
- All assignments must be in `useEffect` (React Compiler constraint)

## LTI 1.3

- **Avoid `ltijs` directly** — incompatible with Next.js App Router (Express internals, session middleware)
- Use `jose` (Web Crypto, Node.js compatible) for custom OIDC JWT handling
- 3-step flow: login init → state/nonce cookie → JWT verification + session
- Platform JWK keyset must be fetched and cached (not re-fetched per request)
- Phase 3 minimum: 5-day implementation task

## Video

- **`@mux/mux-player-react`** — official, `onEnded` callback for completion, CSS custom properties for HDS token integration

## Storage

- **`@vercel/blob`** — native integration, public access mode for iframe src, `BLOB_READ_WRITE_TOKEN` from Vercel dashboard
- **`jszip`** — pure JS ZIP extraction in Route Handlers; note: loads full ZIP into memory — watch Vercel function memory limits (default 1GB)

## TypeScript Codegen

- **`npx sanity typegen generate`** — built into `sanity ^5.23.0`, no new install; generates schema types + typed GROQ results; `sanity-codegen` is deprecated, do not use

## Key Risks

| Risk | Mitigation |
|------|-----------|
| SCORM iframe sandbox | `allow-scripts allow-same-origin`; add `allow-forms allow-popups` as needed per package |
| LTI OIDC replay attacks | Nonce + state cookie with short TTL; validate `iss`/`aud`/`exp` in JWT |
| Clerk metadata overflow | Short IDs (8-char slugs) ≈ 150 entries; fall back to Sanity query when `completedLessons.length > 25` |
| React Compiler + SCORM | Isolate all `window.*` writes in `useEffect`; acceptable to disable compiler optimization for `ScormPlayer` |
