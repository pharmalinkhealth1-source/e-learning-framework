# Phase 13: Search & Discovery Plan

Unified global search experience across the PharmaLink ecosystem (Directory, Forum, and Blog).

## Goal
Implement a high-performance, unified search interface that allows users to discover locations, discussions, and insights in a single view, maintaining the "Clinical Luxury" aesthetic.

## Objectives
1. **Sanity Integration (Blog):**
   - Create `blogPost` schema in Sanity.
   - Migrate hardcoded articles from `src/app/blog/page.tsx` to Sanity.
2. **Unified Search API:**
   - Create a centralized GROQ query to fetch results from `directoryItem`, `forumPost`, and `blogPost`.
3. **Global Search UI:**
   - Implement a search modal (triggered by a shortcut or Navbar icon).
   - Create a dedicated `/search` results page.
4. **Clinical Luxury Styling:**
   - High-fidelity result cards with highlighted matches.
   - Dark mode support using HDS tokens.

## Implementation Steps

### Task 1: Blog Schema & Migration
- [ ] Create `src/sanity/schemaTypes/blogPost.ts`.
- [ ] Register `blogPost` in `src/sanity/schemaTypes/index.ts`.
- [ ] (Manual/Optional) Seed initial articles into Sanity.

### Task 2: Search UI Infrastructure
- [ ] Create `src/components/search/SearchModal.tsx` using Framer Motion.
- [ ] Update `src/components/stripe/Navbar.tsx` with search trigger.
- [ ] Create `src/app/search/page.tsx` for full results.

### Task 3: Unified Search Logic
- [ ] Implement `getSearchResults` in a new `src/lib/search.ts`.
- [ ] Add type-ahead suggestions in the modal.

### Task 4: Visual Polish
- [ ] Ensure consistent spacing and typography (IBM Plex).
- [ ] Verify dark mode transitions for search results.

## Verification
- [ ] Search for a known location (e.g., "Lagos") -> shows Directory result.
- [ ] Search for a discussion topic (e.g., "Inventory") -> shows Forum result.
- [ ] Search for a blog keyword -> shows Blog result.
- [ ] Verify search works in dark mode.
