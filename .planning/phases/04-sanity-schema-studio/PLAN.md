---
id: 04
wave: 1
autonomous: true
objective: Define Sanity schemas and setup the embedded Studio for content management.
files_modified:
  - package.json
  - src/sanity/schemaTypes/forumPost.ts
  - src/sanity/schemaTypes/directoryItem.ts
  - src/sanity/schemaTypes/jobOpening.ts
  - src/sanity/schemaTypes/dataInsight.ts
  - src/sanity/schemaTypes/index.ts
  - src/sanity/lib/client.ts
  - src/app/studio/[[...tool]]/page.tsx
---

# Plan: Phase 4 — Sanity Schema & Studio

Define Sanity schemas and setup the embedded Studio for content management.

## Task 1: Sanity Initialization
- [ ] Install `next-sanity`, `sanity`, and `@sanity/image-url`.
- [ ] Scaffold `src/sanity` with client, environment, and base structure files.
- [ ] Implement the embedded studio route at `src/app/studio/[[...tool]]/page.tsx`.

## Task 2: Core Schema Definitions
- [ ] Create `src/sanity/schemaTypes/forumPost.ts`.
- [ ] Create `src/sanity/schemaTypes/directoryItem.ts` (with geo-coordinates).
- [ ] Create `src/sanity/schemaTypes/jobOpening.ts`.
- [ ] Create `src/sanity/schemaTypes/dataInsight.ts`.
- [ ] Register all schemas in `src/sanity/schemaTypes/index.ts`.

## Task 3: Client & Data Layer
- [ ] Configure `src/sanity/lib/client.ts` for public CDN access.
- [ ] Add basic GROQ queries for fetching Bento-grid-ready content.
- [ ] Verify Studio accessibility locally.

## Verification Criteria
- [ ] `npm run dev` starts without Sanity-related errors.
- [ ] `/studio` route renders the Sanity Studio login/interface.
- [ ] All 4 schemas (Forum, Directory, Careers, Insights) are visible in the Studio.
- [ ] Data can be queried via the Sanity client in the console/app.
