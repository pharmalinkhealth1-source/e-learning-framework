# Internal Patterns — elearning-framework

## Sanity Schema Conventions

All schemas use `defineField` and `defineType` from `'sanity'`. Named exports (except `blogPost` which uses default export). Registered in `src/sanity/schemaTypes/index.ts` by adding to the `types` array.

**Standard field set every document schema includes:**
- `title` — `type: 'string'`, usually with `validation: (Rule) => Rule.required()`
- `slug` — `type: 'slug'`, `options: { source: 'title', maxLength: 96 }`, usually required
- `publishedAt` — `type: 'datetime'`

**Reference pattern:** `{ type: 'reference', to: [{ type: 'authorName' }] }` — used in forumPost, comment, blogPost.

**Conditional field visibility:** The user PRD sketch uses `hidden: ({document}) => document.type !== 'scorm'` — this pattern is not yet in the codebase but is valid Sanity v5 syntax.

**File field:** Not yet used in any schema. Sanity's `type: 'file'` creates `{ asset: { _type: 'reference', _ref: '...' } }`. GROQ dereference: `scormPackage.asset->url`.

**Image field with external URL fallback:** Used in `author.ts` and `memberSpotlight.ts` — image field includes a nested `externalUrl: url` field as an escape hatch for externally-hosted images.

**Options list pattern (enum-like):** Used in `directoryItem.ts` and `jobOpening.ts`: `options: { list: [{ title: '...', value: '...' }] }`.

**Portable Text (block array):** Used in `blogPost`, `forumPost`, `memberSpotlight`. Pattern: `{ type: 'array', of: [{ type: 'block' }] }`. Rendered client-side with `@portabletext/react` — already in use in `src/app/forum/[slug]/page.tsx`.

**clerkId linkage:** `author.ts` has `clerkId: { type: 'string', readOnly: true }`. The webhook at `/api/webhooks/clerk/route.ts` upserts author documents with `_id: author-${clerkId}` on user.created/user.updated events. Route Handlers look up authors via `*[_type == "author" && clerkId == $userId][0]._id`.

## Clerk Usage Patterns

**Provider:** `<ClerkProvider>` wraps the app in `src/app/layout.tsx`.

**Middleware:** `src/middleware.ts` uses `clerkMiddleware` + `createRouteMatcher`. Currently protects `/forum(.*)`. The pattern reads `sessionClaims?.metadata` for the `onboarded` flag and redirects unauthenticated/unonboarded users.

**Server-side auth:** `auth()` from `@clerk/nextjs/server` used in Route Handlers (`/api/forum/post`, `/api/forum/comment`, `/api/auth/onboarding`, `/api/careers/apply`). Pattern: `const { userId } = await auth(); if (!userId) return 401`.

**Client-side hook:** `useUser()` used in `onboarding/page.tsx`, `ApplyForm.tsx`, `ApplyModal.tsx`, `JobDetailClient.tsx`. Pattern: `const { user, isLoaded } = useUser()`.

**publicMetadata write:** `/api/auth/onboarding/route.ts` uses `clerkClient()` then `client.users.updateUserMetadata(userId, { publicMetadata: { role, onboarded, companyName, useCase } })`. This is the established pattern for server-side metadata writes.

**Webhook pattern:** `/api/webhooks/clerk/route.ts` uses `svix` (already in deps) to verify Clerk webhook signatures, then acts on `user.created`/`user.updated` events. This exact infrastructure is reusable for a progress-sync webhook.

## Route Handler Patterns

All route handlers follow:
1. Import `auth` from `@clerk/nextjs/server`
2. Destructure `userId` and return 401 if missing
3. Parse `req.json()` for body
4. Validate required fields → return 400
5. Perform Sanity write via `writeClient`
6. Return `NextResponse.json({ success: true, ... })`

Error handling: try/catch with `console.error` and 500 response.

File: `src/sanity/lib/write-client.ts` — separate `writeClient` for mutations (token-bearing, `useCdn: false`). Read-only `client` in `src/sanity/lib/client.ts` has a mock-data fallback when `projectId === 'placeholder'`.

## CSS Module Patterns

**Token usage:** All production components use `var(--hds-*)` tokens. Tokens defined in `src/styles/tokens.css`, imported by `src/styles/globals.css`.

**Exception found:** `src/components/forum/CommentForm.tsx` uses `styled-components` (not CSS Modules). This is a deviation from the project standard — new LMS components should use CSS Modules only.

**Module structure:** Each page has a co-located `page.module.css`. Components have co-located `ComponentName.module.css`.

**Token categories in use:**
- `--hds-color-*` (fg, bg, surface, border, heading, primary, glass)
- `--hds-space-core-*` (spacing scale: 25–2100)
- `--hds-space-layout-*` (gaps, margins, maxWidth: 1264px)
- `--hds-shadow-*` (sm/md/lg/xl)
- `--hds-font-family`, `--hds-font-weight-*`

**Dark mode:** `data-theme` attribute set on `<html>` via inline script in `layout.tsx`. ThemeProvider component handles toggle.

## Dynamic Route Patterns

**Current pattern:** `src/app/forum/[slug]/page.tsx` — async Server Component, `params: Promise<{ slug: string }>`, `await params`. Fetches from Sanity inside the component. Uses `notFound()` for missing records.

**Auth group:** `src/app/(auth)/` — route group without URL segment, contains sign-in, sign-up, onboarding.

**Nested client:** `src/app/careers/[slug]/JobDetailClient.tsx` — page fetches data server-side, passes as props to a `"use client"` component for interactivity.

## Elearning Page Current State

`src/app/elearning/page.tsx` is a `"use client"` marketing stub. It contains:
- Static content (hero, featured course card, curriculum pillars)
- A `WaitlistDialog` open/close state
- No Sanity data fetching
- No routing to actual lesson content
- Uses `page.module.css` with HDS tokens

There are no subdirectories under `src/app/elearning/` — the entire LMS routing hierarchy (`/courses/[slug]/`, `/courses/[slug]/lesson/[id]`) must be built from scratch.

## Existing Dependencies Relevant to LMS

**Present:**
- `@clerk/nextjs ^7.3.0` — auth, metadata, webhooks
- `sanity ^5.23.0` + `next-sanity ^12.4.0` — CMS
- `svix ^1.92.2` — webhook verification (reusable for progress webhooks)
- `@portabletext/react` — implied by import in forum page, not in package.json directly (comes via next-sanity or sanity)
- `framer-motion ^12.38.0` — animation (useful for lesson transitions)
- `react 19.2.4` — React 19 with native use() hook

**Absent (must add):**
- No video library (`@mux/mux-player-react`, `next-video`, or Cloudflare Stream)
- No SCORM library (`scorm-again`)
- No LTI library (`ltijs` — with caveats)
- No blob storage (`@vercel/blob`)
- No ZIP extraction library (for server-side SCORM package handling)
- No TypeScript codegen for Sanity (`sanity typegen` is CLI-based, not a dep)
