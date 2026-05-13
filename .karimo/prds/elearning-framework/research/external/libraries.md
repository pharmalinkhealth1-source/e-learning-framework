# Library Evaluation — elearning-framework

## SCORM Bridge

### `scorm-again` (RECOMMENDED)
- **npm:** `scorm-again`
- **Author:** jcputney (active fork of original)
- **Purpose:** SCORM 1.2 and SCORM 2004 window API injection — the only well-maintained modern SCORM runtime library
- **Install:** `npm install scorm-again`
- **Key APIs:**
  - `window.API = new Scorm12API({ autocommit: true, lmsCommitUrl: '...' })` — SCORM 1.2
  - `window.API_1484_11 = new Scorm2004API({ autocommit: true, lmsCommitUrl: '...' })` — SCORM 2004
  - Event hooks: `window.API.on("LMSSetValue", fn)` for intercepting all data writes
  - Cross-frame: `CrossFrameLMS` (parent) + `CrossFrameAPI` (child) for sandboxed iframes
- **Pros:**
  - Actively maintained, v3.0+ has cross-frame support
  - LMS-agnostic — works without a real LMS backend (logs calls if no `lmsCommitUrl`)
  - ES module import supported
  - Handles both SCORM standards in one package
- **Cons:**
  - Must be used in `"use client"` component (browser-only, mutates `window`)
  - React Compiler will not auto-memoize components using it (interior mutability via `window`)
- **Alternative:** `simplify-scorm` — simpler but lacks SCORM 2004 sequencing and cross-frame support. Not recommended.

---

## Video Player

### `@mux/mux-player-react` (RECOMMENDED)
- **npm:** `@mux/mux-player-react`
- **Purpose:** HLS video playback via Mux CDN with accessible custom player
- **Install:** `npm install @mux/mux-player-react`
- **Usage:** `<MuxPlayer playbackId={id} streamType="on-demand" />`
- **Pros:**
  - Official Mux package, well-documented Next.js integration
  - Built-in accessibility (captions, keyboard nav)
  - Custom styling via CSS custom properties (wrappable in CSS Module)
  - Supports `onEnded`, `onTimeUpdate` callbacks for progress tracking
- **Cons:**
  - Must be wrapped in `"use client"` component
  - Requires Mux account + playback IDs stored in Sanity
- **Alternative:** `next-video` — higher-level, handles uploads too, but couples video storage to Vercel. Less appropriate here where Sanity owns content metadata.

### Cloudflare Stream (ALTERNATIVE)
- Uses Cloudflare Stream SDK + `<stream>` web component
- Only choose if Cloudflare is already in the infrastructure stack
- More complex setup than Mux for a Next.js project
- **Not recommended** unless Mux pricing is a constraint

---

## Blob Storage (SCORM ZIP Storage)

### `@vercel/blob` (RECOMMENDED)
- **npm:** `@vercel/blob`
- **Purpose:** Store and serve SCORM ZIP packages (extracted HTML/JS/assets) via Vercel's global CDN
- **Install:** `npm install @vercel/blob`
- **Key APIs:**
  - `put(path, file, { access: 'public' })` — server upload
  - `list({ prefix })` — list blobs
  - `del(url)` — delete
- **Env var:** `BLOB_READ_WRITE_TOKEN` — auto-added when creating Blob store in Vercel dashboard
- **Pros:**
  - Native Vercel integration — no additional service accounts
  - Public access for SCORM content serving (iframes need direct URL access)
  - Supports any file type including ZIP, HTML, JS
- **Cons:**
  - Storage costs at scale
  - Server upload limit: 500MB per file (fine for SCORM ZIPs typically <50MB)
  - SCORM packages must be extracted server-side before storing — need a ZIP extraction step
- **Alternative:** AWS S3 / Cloudflare R2 — more configuration overhead; not recommended unless already used

### `jszip` (FOR ZIP EXTRACTION)
- **npm:** `jszip`
- **Purpose:** Extract SCORM ZIP contents server-side in a Route Handler before uploading individual files to Vercel Blob
- **Install:** `npm install jszip`
- **Pros:** Widely used, pure JavaScript, works in Node.js Route Handlers
- **Cons:** Loads entire ZIP into memory — set Route Handler `maxDuration` and watch memory limits on Vercel Hobby plan (1024MB)
- **Alternative:** `adm-zip` — similar feature set, synchronous API, slightly simpler for this use case

---

## LTI 1.3

### Custom Implementation with `jose` (RECOMMENDED)
- **npm:** `jose`
- **Purpose:** JWT signing and verification for LTI 1.3 OIDC flow
- **Install:** `npm install jose`
- **Usage:** `await jwtVerify(token, jwks, { issuer, audience })`
- **Pros:**
  - Web Crypto API based — works in Next.js App Router (both Node.js and edge runtime)
  - Lightweight (~10KB)
  - Handles RS256 JWTs used by LTI 1.3
- **Cons:**
  - Must implement the full OIDC state flow manually (3 route handlers)
  - More implementation work than ltijs

### `ltijs` (NOT RECOMMENDED for direct Next.js integration)
- **npm:** `ltijs`
- **Compatibility issue:** Requires Node.js `http` module + Express.js API — incompatible with Next.js App Router Route Handlers and Edge Runtime
- **Workaround exists:** Deploy as a separate standalone Node.js service, proxy from Next.js
- **Use if:** LTI grade passback (Assignment and Grade Services) is a Phase 3 hard requirement — ltijs handles AGS complexity that a custom implementation would need to replicate
- **Deployment:** Separate Vercel Function with `serverless: true` flag

### `@hubroeducation/ltijs`
- Maintained fork of ltijs with some fixes
- Same Express dependency problem — same incompatibility

---

## TypeScript Code Generation

### Sanity TypeGen (RECOMMENDED — already available)
- **CLI command:** `npx sanity typegen generate`
- **Part of:** `sanity ^5.23.0` (already installed)
- **Purpose:** Auto-generate TypeScript interfaces from Sanity schemas and GROQ query results
- **Output:** `sanity.types.ts` in project root (or configured path)
- **Integration:** Use `defineQuery` from `@sanity/client` when writing GROQ — TypeGen infers return types
- **No additional npm install required**
- **Pros:** Official, maintained by Sanity, generates both schema types AND query result types
- **Cons:** Must re-run after schema changes; output file should not be committed (add to `.gitignore`) or committed as generated artifact

### `sanity-codegen` (DEPRECATED — DO NOT USE)
- Community package superseded by Sanity TypeGen
- Not compatible with Sanity v5

---

## Summary Recommendation Table

| Need | Package | Status |
|------|---------|--------|
| SCORM runtime | `scorm-again` | Install |
| Video playback | `@mux/mux-player-react` | Install |
| Blob storage | `@vercel/blob` | Install |
| ZIP extraction | `jszip` | Install |
| LTI JWT | `jose` | Install |
| LTI full framework | `ltijs` | Avoid direct; use only as separate service |
| TS codegen | `sanity typegen` (CLI) | Already available |
