# External References — elearning-framework

## SCORM Standards

- [SCORM 1.2 Developer's Guide — scorm.com](https://scorm.com/scorm-explained/technical-scorm/scorm-12-overview-for-developers/)
  SCORM 1.2 API signature, CMI data model, LMS communication protocol overview.

- [SCORM 2004 Developer's Guide — scorm.com](https://scorm.com/scorm-explained/technical-scorm/scorm-2004-overview-for-developers/)
  SCORM 2004 4th Edition API, sequencing, navigation, CMI data model.

- [SCORM Run-Time Environment — scorm.com](https://scorm.com/scorm-explained/technical-scorm/run-time/)
  Explains the window API search algorithm — how SCOs find the LMS API object.

- [scorm-again GitHub](https://github.com/jcputney/scorm-again)
  Source code, cross-frame documentation, release notes.

- [scorm-again Documentation](https://jcputney.github.io/scorm-again/docs/getting-started/introduction/)
  Official getting-started guide for `scorm-again`.

## LTI 1.3

- [IMS LTI 1.3 Implementation Guide — Blackboard](https://blackboard.github.io/lti/tutorials/implementation-guide)
  Step-by-step OIDC flow, JWT structure, state management for LTI Tool Providers.

- [ltijs GitHub (Cvmcosta)](https://github.com/Cvmcosta/ltijs)
  Source and documentation for `ltijs`. Reference even if not using directly — explains required LTI endpoints.

- [ltijs Provider Docs](https://github.com/Cvmcosta/ltijs/blob/master/docs/provider.md)
  Serverless mode and route structure reference.

- [Next.js + LTI Example (kulla)](https://github.com/kulla/2024-07-05-using-lti-in-nextjs)
  Documents why ltijs is incompatible with Next.js and explores workarounds. Important reading before Phase 3.

## Clerk

- [Clerk User Metadata Docs](https://clerk.com/docs/guides/users/extending)
  publicMetadata, privateMetadata, unsafeMetadata — definitions and size limits (8KB total, ~1.2KB for session token).

- [Clerk updateUserMetadata API](https://clerk.com/docs/reference/backend/user/update-user-metadata)
  Backend SDK method — the pattern already used in `/api/auth/onboarding/route.ts`.

- [Clerk Webhook Sync Docs](https://clerk.com/docs/guides/development/webhooks/syncing)
  Data synchronization via Clerk webhooks — the pattern used in `/api/webhooks/clerk/route.ts`.

- [Clerk RBAC with Metadata](https://clerk.com/docs/guides/secure/basic-rbac)
  Pattern for reading publicMetadata in middleware via sessionClaims — used in current middleware.

## Mux / Video

- [Mux + Next.js Integration Guide](https://www.mux.com/docs/integrations/next-js)
  Official guide for `@mux/mux-player-react` in Next.js App Router.

- [Mux Player React GitHub](https://github.com/muxinc/next-video)
  `next-video` package source — alternative higher-level abstraction.

- [Next.js Video Guide](https://nextjs.org/docs/app/guides/videos)
  Official Next.js documentation on video integration patterns.

## Sanity v5

- [Sanity TypeGen Docs](https://www.sanity.io/docs/apis-and-sdks/sanity-typegen)
  Official TypeScript code generation — replaces deprecated `sanity-codegen`.

- [Sanity File Type Docs](https://www.sanity.io/docs/studio/file-type)
  `type: 'file'` schema field, `accept` option, asset reference structure.

- [Sanity Asset Management](https://www.sanity.io/docs/content-lake/manage-assets)
  Upload, query, and delete file/image assets. GROQ `asset->url` dereference pattern.

- [Sanity TypeGen GA Blog Post](https://www.sanity.io/blog/sanity-typegen-ga)
  Announcement and migration guide from sanity-codegen → TypeGen.

## Next.js App Router

- [Layouts and Pages — Next.js Docs](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
  Persistent layout shell mechanics — how layouts preserve state across child navigations.

- [Server and Client Components — Next.js Docs](https://nextjs.org/docs/app/getting-started/server-and-client-components)
  "use client" boundary rules — essential for ScormPlayer, VideoLesson architecture.

## React Compiler

- [React Compiler v1.0 Announcement](https://react.dev/blog/2025/10/07/react-compiler-1)
  Stable release notes, incompatible patterns list.

- [incompatible-library lint rule — React Docs](https://react.dev/reference/eslint-plugin-react-hooks/lints/incompatible-library)
  How to identify and annotate patterns the compiler cannot optimize.

## Vercel Blob

- [Vercel Blob Docs](https://vercel.com/docs/vercel-blob)
  Full SDK reference for `@vercel/blob` — put, list, del, server upload patterns.

- [Vercel Blob Server Upload](https://vercel.com/docs/vercel-blob/server-upload)
  Server-side upload route handler pattern.
