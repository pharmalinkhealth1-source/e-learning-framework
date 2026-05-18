# Internal Research: Forum Rules Modal

## Auth Pattern
- Clerk via `@clerk/nextjs/server` — `auth()` in server components, `useAuth()`/`useUser()` in client components
- `publicMetadata` already used for `role` + `onboarded` state, updated via `PATCH /api/auth/onboarding` → `clerk.users.updateUserMetadata()`
- No `unsafeMetadata` usage anywhere in codebase
- Pattern for API-route metadata update is established and clean

## Forum Page Architecture
- `src/app/forum/page.tsx` — async server component; `auth()` call + Sanity fetch
- `src/components/forum/ForumSync.tsx` — client-side sync component already mounted in forum page
- Client components in forum: `PostLikeButton.tsx`, `CommentThread.tsx`, `CreatePostForm.tsx`
- Pattern: server component passes data as props to client components

## Storage Precedent
- `ThemeProvider.tsx` uses `localStorage` for theme preference (cosmetic)
- No existing localStorage usage for auth-gated or compliance state
- All user-identity state lives in Clerk `publicMetadata` or Sanity `author` doc

## Sanity Write Pattern
- `@/sanity/lib/write-client` exists for server-side mutations
- Webhook at `/api/webhooks/clerk` syncs Clerk user to Sanity `author` doc
- Sanity schema types live in `src/sanity/schemaTypes/` — all registered in `index.ts`

## Key Gap
- No `forumRules` Sanity schema exists
- No rules acceptance field in Clerk metadata or Sanity author schema
- No modal or gate component exists — forum page renders immediately for all authed users
