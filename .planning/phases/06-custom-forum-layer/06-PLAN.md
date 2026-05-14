# Phase 6: Custom Forum Layer — Plan

**Phase Goal:** Implement full-featured threaded discussions and post creation, integrated with the Sanity backend and styled with the Clinical Luxury design system.

---

## Wave 1: Post Creation & Listing Polish

### Plan 01: High-Fidelity Forum Listing & Navigation

```yaml
wave: 1
depends_on: []
files_modified:
  - src/app/forum/page.tsx
  - src/app/forum/ForumListing.module.css
autonomous: true
requirements_addressed: [REQ-FORUM-01]
```

<objective>
Update the forum listing page to match the Clinical Luxury design system (grid lines, radial glow) and improve the layout of post cards.
</objective>

<action>
1. Create `src/app/forum/ForumListing.module.css` with:
   - Grid lines and radial glow patterns from `elearning/page.module.css`.
   - Hero section styles.
   - Post grid layout.
2. Update `src/app/forum/page.tsx`:
   - Add Navbar, Footer, and GridLinesContainer.
   - Use the new CSS module.
   - Add a "Create Post" button that opens a dialog or navigates to a form.
</action>

### Plan 02: Post Creation Functionality

```yaml
wave: 1
depends_on: [01]
files_modified:
  - src/app/api/forum/post/route.ts
  - src/components/forum/CreatePostForm.tsx
autonomous: true
requirements_addressed: [REQ-FORUM-01]
```

<objective>
Implement the backend and frontend for creating new forum posts.
</objective>

<action>
1. Create `src/app/api/forum/post/route.ts`:
   - POST handler to create a `forumPost` document in Sanity.
   - Link the post to the authenticated Clerk user's author profile.
2. Create `src/components/forum/CreatePostForm.tsx`:
   - A form component for title and content (using a simple editor or textarea).
   - Integration with the new API route.
3. Integrate the form into the `/forum` page (e.g., via a Modal).
</action>

---

## Wave 2: Threaded Conversations

### Plan 03: Threaded Comments UI & Detail Page Polish

```yaml
wave: 2
depends_on: [01]
files_modified:
  - src/app/forum/[slug]/page.tsx
  - src/app/forum/[slug]/ForumDetail.module.css
  - src/components/forum/CommentThread.tsx
autonomous: true
requirements_addressed: [REQ-FORUM-01]
```

<objective>
Transform the forum detail page into a high-fidelity threaded discussion UI, supporting nested replies.
</objective>

<action>
1. Create `src/app/forum/[slug]/ForumDetail.module.css`.
2. Create `src/components/forum/CommentThread.tsx`:
   - A recursive component to render comments and their children.
   - Support for "Reply" action on individual comments.
3. Update `src/app/forum/[slug]/page.tsx`:
   - Fetch comments with their parent relationships.
   - Organize comments into a tree structure on the client or server.
   - Apply the Clinical Luxury design shell.
</action>

---

## Wave 3: Real-time Updates & Final Polish

### Plan 04: Real-time Sanity Listeners

```yaml
wave: 3
depends_on: [03]
files_modified:
  - src/hooks/useForumSync.ts
  - src/app/forum/page.tsx
  - src/app/forum/[slug]/page.tsx
autonomous: true
requirements_addressed: [REQ-FORUM-01]
```

<objective>
Implement real-time sync using Sanity listeners so new posts and comments appear instantly without page refreshes.
</objective>

<action>
1. Create `src/hooks/useForumSync.ts` using `client.listen()`.
2. Integrate the hook into the forum listing and detail pages to trigger revalidation or update local state.
</action>
