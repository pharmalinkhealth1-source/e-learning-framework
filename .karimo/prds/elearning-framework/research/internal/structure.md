# File Structure — elearning-framework

## Current `src/app/` Route Map

```
src/app/
├── (auth)/                     # Route group (no URL segment)
│   ├── onboarding/page.tsx     # "use client" — Clerk metadata write
│   ├── sign-in/[[...sign-in]]/page.tsx
│   └── sign-up/[[...sign-up]]/page.tsx
├── api/
│   ├── auth/onboarding/route.ts          # POST — publicMetadata write via clerkClient
│   ├── careers/apply/route.ts            # POST — Resend email, auth-gated
│   ├── forum/
│   │   ├── comment/route.ts              # POST — Sanity write, auth-gated
│   │   └── post/route.ts                 # POST — Sanity write, auth-gated
│   └── webhooks/clerk/route.ts           # POST — svix-verified Clerk events
├── about-us/
├── blog/[slug]/
├── careers/[slug]/
├── community/
├── contact-us/
├── data-insights/
├── directory/
├── elearning/
│   └── page.tsx                          # "use client" marketing stub — NO sub-routes
├── forum/
│   ├── [slug]/                           # Dynamic route with layout + CommentForm
│   └── new/
├── member-spotlights/[slug]/
├── podcast/
├── search/
├── studio/[[...tool]]/                   # Sanity Studio
├── icon.svg
├── layout.tsx                            # Root layout — ClerkProvider, fonts, ThemeProvider
├── page.module.css
└── page.tsx                              # Marketing homepage
```

## Current `src/components/` Organization

Feature-first directory structure (not atomic/shared-first):

```
src/components/
├── animations/         # Animation components (MeshGradient, etc.)
├── base/               # Base/primitive components
├── careers/            # CareersList, ApplyForm, ApplyModal, JobCard
├── charts/             # D3 chart wrappers
├── community/          # SpotlightCarousel, community UI
├── forum/              # CommentForm, CommentThread, CreatePostForm, ForumSync, PostCard
├── map/                # MapLibre directory map
├── search/             # Global search
├── shared/             # CountrySelect (only one file)
└── stripe/             # Core UI system: Navbar, Footer, Hero, ThemeProvider, StripeUI, AuthLayout, etc.
```

The `stripe/` directory holds the main design system components. New LMS components should go in a new `elearning/` or `lms/` directory following the feature-first pattern.

## Sanity Schema File Conventions

```
src/sanity/
├── env.ts                           # projectId, dataset, apiVersion, useCdn
├── lib/
│   ├── client.ts                    # Read client with mock-data fallback
│   ├── write-client.ts              # Write client (token-bearing)
│   └── image.ts                     # urlForImage helper
├── schemaTypes/
│   ├── index.ts                     # Registers all schemas in types[] array
│   ├── author.ts                    # export const author = defineType(...)
│   ├── blogPost.ts                  # export default defineType(...)  [default export anomaly]
│   ├── comment.ts
│   ├── dataInsight.ts
│   ├── directoryItem.ts
│   ├── forumPost.ts
│   ├── jobOpening.ts
│   └── memberSpotlight.ts
└── structure.ts                     # (likely exists for studio desk structure)
```

New LMS schemas to create:
- `src/sanity/schemaTypes/course.ts` — named export `course`
- `src/sanity/schemaTypes/module.ts` — named export `courseModule` (avoid `module` — reserved word in Node.js)
- `src/sanity/schemaTypes/lesson.ts` — named export `lesson`
- `src/sanity/schemaTypes/lessonProgress.ts` — named export `lessonProgress`

Each must be registered in `src/sanity/schemaTypes/index.ts`.

## Hooks Directory

```
src/hooks/
└── useForumSync.ts    # Custom hook for forum real-time sync
```

Small — LMS will need to add hooks for SCORM bridge (`useScormBridge`), progress polling (`useLessonProgress`), etc.

## Middleware Location

`src/middleware.ts` — single file, project root of `src/`. Matcher config uses standard Next.js patterns. Protected routes currently: `/forum(.*)` only.

## CSS / Styles

```
src/styles/
├── globals.css     # Layer resets, base HDS classes, imports tokens.css
└── tokens.css      # All --hds-* CSS custom properties (spacing, color, shadow, typography)
```

All page CSS modules co-located with their page file. Component CSS modules co-located with their component. No global component classes — styling is module-scoped throughout.

## Proposed LMS Route Structure

```
src/app/elearning/
  courses/
    page.tsx                           # Course catalogue (Server Component)
    [slug]/
      layout.tsx                       # Persistent player shell ("use client")
      page.tsx                         # Course overview / module list
      lesson/
        [id]/
          page.tsx                     # Lesson renderer (Server Component fetches, delegates to client)

src/app/api/
  lms/
    progress/route.ts                  # POST — write progress to Sanity + Clerk publicMetadata
    scorm-commit/route.ts              # POST — receive SCORM API bridge commits
    lti/
      login/route.ts                   # POST — LTI OIDC initiation
      launch/route.ts                  # POST — LTI OIDC callback + JWT verification
      keyset/route.ts                  # GET — public JWK keyset for platforms

src/components/elearning/
  PlayerShell/
    PlayerShell.tsx
    PlayerShell.module.css
  LessonRenderer/
    LessonRenderer.tsx
    TextLesson.tsx
    VideoLesson.tsx
    ScormLesson.tsx
    LtiLesson.tsx
  ProgressBar/
  CourseCard/
```
