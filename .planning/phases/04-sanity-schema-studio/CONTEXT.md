# Phase Context: Phase 4 — Sanity Schema & Studio

## Objective
Establish the content engine by integrating Sanity CMS, defining schemas for the client's core features (Forum, Directory, Careers, Insights), and setting up the embedded Sanity Studio.

## Technical Approach
- **Integration**: `next-sanity` for seamless App Router integration.
- **Studio**: Embedded Sanity Studio v3 accessible via `/studio`.
- **Schemas**: 
  - `forumPost`: Content, author, and thread metadata.
  - `directoryItem`: Name, category, location (lat/lng), and website.
  - `jobOpening`: Title, company, role, and application link.
  - `dataInsight`: Metrics and metadata for D3.js visualization.
- **Client**: Configured for `stega` (visual editing) and high-performance CDN delivery.

## Requirements
- **Structure**: Schemas must be modular and extensible for future platform growth.
- **Stega Support**: Enable visual editing tokens for the "pixel-perfect" editing experience.
- **Security**: Environment variables (`SANITY_PROJECT_ID`, etc.) must be handled securely via `process.env`.
- **Embedded Studio**: Fully functional Studio interface within the Next.js app.

## Key Files
- `src/sanity/schemaTypes/`: Directory for individual schema definitions.
- `src/sanity/lib/client.ts`: Shared fetching client.
- `src/app/studio/[[...tool]]/page.tsx`: Embedded studio route.

## References
- Sanity.io Next.js Documentation
- Stripe-style content modeling patterns
