# Plan: Phase 6 - Custom Forum Layer

## Wave 1: Foundation & Listing
- [ ] Create basic `/forum` listing page with mock data.
- [ ] Implement `PostCard` component with Stripe-fidelity styling (hover states, typography).
- [ ] Connect `/forum` to Sanity to fetch real posts.

## Wave 2: Detailed View & Threading
- [ ] Create `/forum/[slug]` dynamic route.
- [ ] Implement `CommentThread` component supporting nested replies.
- [ ] Add loading skeletons and error boundaries for a premium feel.

## Wave 3: Interactions (Write Access)
- [ ] Implement "New Post" modal/page.
- [ ] Implement comment submission logic.
- [ ] Add real-time optimistic updates for comments.

## Wave 4: Polish & Security
- [ ] Final visual audit (HDS alignment).
- [ ] Verify Clerk route protection is enforced at the component level.
- [ ] Add transition animations between listing and detail views.
