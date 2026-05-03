# Phase 6: Custom Forum Layer

## Goal
Build a high-fidelity, interactive forum layer where authenticated users can engage in threaded discussions. The design must match Stripe's "Clinical Luxury" aesthetic.

## Objectives
- Implement a paginated list of forum posts.
- Create a detailed view for individual posts with threaded comments.
- Enable post creation and commenting for authenticated users.
- Secure access using Clerk (only authenticated users can view/post).
- Synchronize content with Sanity CMS.

## Tech Stack
- **Auth**: Clerk (Metadata-based access).
- **Backend**: Sanity CMS (Content storage).
- **Frontend**: Next.js App Router (Server Components for speed, Client Components for interaction).
- **Styling**: CSS Modules + HDS Tokens.

## Key Files
- `src/app/forum/page.tsx`: Post listing.
- `src/app/forum/[slug]/page.tsx`: Single post view.
- `src/components/forum/PostCard.tsx`: Visual post preview.
- `src/components/forum/CommentThread.tsx`: Threaded interaction component.
