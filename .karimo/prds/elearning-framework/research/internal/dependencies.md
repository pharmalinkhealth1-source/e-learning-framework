# Internal Dependencies — elearning-framework

## Present Clerk Packages

- `@clerk/nextjs ^7.3.0` — primary package, provides:
  - `ClerkProvider`, `useUser`, `useAuth` (client)
  - `auth()`, `clerkClient()`, `clerkMiddleware`, `createRouteMatcher` (server)
  - `WebhookEvent` type (for webhook handlers)
- `svix ^1.92.2` — webhook signature verification (Clerk uses Svix under the hood)

No other `@clerk/*` packages installed. `@clerk/nextjs` v7 is compatible with Next.js 16.2.4 and React 19.

## Present Sanity Packages

- `sanity ^5.23.0` — core studio + schema definitions
- `next-sanity ^12.4.0` — `createClient`, `PortableText` (via `@portabletext/react` re-export)
- `@sanity/image-url ^2.1.1` — URL builder for image assets
- `@sanity/vision ^5.23.0` — GROQ playground in studio (dev only)

`@portabletext/react` is used in `src/app/forum/[slug]/page.tsx` via direct import — it must be a transitive dep of `next-sanity` or `sanity`. Not listed in `package.json` directly.

## Present Media/Animation Packages

- `framer-motion ^12.38.0` — available for lesson transitions/animations
- `@react-three/fiber ^9.6.1` + `@react-three/drei ^10.7.7` + `three ^0.184.0` — 3D (used in hero sections, likely not needed for LMS)
- `@lottiefiles/dotlottie-react ^0.19.2` — Lottie animations
- `cobe ^2.0.1` — globe animation
- No video library of any kind

## Present Utility Packages

- `slugify ^1.6.9` — used in forum post creation, reusable for course slugs
- `clsx ^2.1.1` — className utility (compatible with CSS Modules)
- `d3 ^7.9.0` — data viz (not LMS-relevant but available)
- `maplibre-gl ^5.24.0` + `react-map-gl ^8.1.1` — maps (not LMS-relevant)
- `resend ^6.12.3` — email (could be used for course completion notifications)
- `styled-components ^6.4.1` — present but discouraged per project style rules; one component uses it (CommentForm.tsx)
- `tailwind-merge ^3.5.0` — present but Tailwind itself is not installed; used purely as a utility
- `lucide-react ^1.14.0` — icon library (useful for LMS UI)
- `@phosphor-icons/react ^2.1.10` — second icon library

## Missing — Must Add for LMS

### Video Lesson Type
| Package | Purpose | Notes |
|---------|---------|-------|
| `@mux/mux-player-react` | Mux video playback | Official React component, requires `"use client"` wrapper |
| OR `next-video` | Mux + Vercel-native video | Higher-level abstraction, easier setup |

### SCORM Lesson Type
| Package | Purpose | Notes |
|---------|---------|-------|
| `scorm-again` | SCORM 1.2/2004 API bridge | Injects `window.API` / `window.API_1484_11`, cross-frame support in v3+ |
| `@vercel/blob` | SCORM ZIP storage + serving | Server upload SDK; `BLOB_READ_WRITE_TOKEN` env var required |
| `jszip` or `adm-zip` | Server-side ZIP extraction | For extracting uploaded SCORM packages to Blob storage |

### LTI 1.3 Lesson Type
| Package | Purpose | Notes |
|---------|---------|-------|
| `ltijs` | LTI 1.3 Tool Provider | **Incompatible with Next.js edge runtime**; requires Node.js `http` module — must run as serverless with `{ serverless: true }` mounted at a subpath, or be replaced with custom OIDC implementation |
| `jose` | JWT verification | Lightweight; can replace ltijs's JWT handling for custom OIDC |
| `uuid` | State nonce generation | For OIDC state parameter |

### TypeScript / DX
| Package | Purpose | Notes |
|---------|---------|-------|
| `sanity typegen` (CLI) | Auto-generate TS types from schemas | Not a dep — run via `npx sanity typegen generate`; outputs to `sanity.types.ts` |

## Transitive Dependencies of Note

- `babel-plugin-react-compiler 1.0.0` (devDep) — confirms React Compiler is wired in via Babel plugin, not the Vite/SWC transform
- `typescript ^5` (devDep) — TypeScript strict mode not confirmed but `tsconfig` likely exists
- `@types/node ^20` (devDep) — Node.js types available for Route Handler code
