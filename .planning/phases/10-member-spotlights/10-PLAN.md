# Phase 10: Member Spotlights & Success Stories

## Goal
Build a fully editorial **Member Spotlights** system powered by Sanity CMS — a dedicated listing page at `/member-spotlights`, individual detail pages at `/member-spotlights/[slug]`, and a dynamic flip-card carousel on the Community page that replaces the current hardcoded `<SuccessStories />` component.

## Architecture Overview

```
Sanity Studio                    Frontend
─────────────                    ────────
memberSpotlight (schema)  ──→  /member-spotlights           (listing page)
  ├─ name                 ──→  /member-spotlights/[slug]    (detail page)
  ├─ slug                 ──→  /community                   (carousel section)
  ├─ jobTitle
  ├─ country
  ├─ quote
  ├─ excerpt
  ├─ body (Portable Text)
  ├─ image
  ├─ featured (boolean)
  └─ publishedAt
```

## Component Strategy

| Component | Location | Purpose | Data Source |
|---|---|---|---|
| `SuccessStories` (existing) | `src/components/community/SuccessStories.tsx` | **Preserved** — reusable hardcoded version for embedding on any page | Static array |
| `SpotlightCarousel` (new) | `src/components/community/SpotlightCarousel.tsx` | **New** — Sanity-powered flip-card stack for the Community page | Props from server fetch |
| `SpotlightCard` (new) | `src/componen## Wave 1: Schema & Seed Data (Plans 01–02) — [DONE]

### Plan 01 — Sanity `memberSpotlight` Schema — [DONE]
### Plan 02 — Seed 3 Spotlights into Sanity — [DONE]

---

## Wave 2: Pages (Plans 03–04) — [DONE]

### Plan 03 — Listing Page `/member-spotlights` — [DONE]
### Plan 04 — Detail Page `/member-spotlights/[slug]` — [DONE]

---

## Wave 3: Community Integration & Navigation (Plans 05–06) — [DONE]

### Plan 05 — `SpotlightCarousel` Flip-Card Component — [DONE]
### Plan 06 — Community Page Integration & Navbar Update — [DONE]

---

## Wave 4: Polishing & Standardization (Plans 07–09) — [IN PROGRESS]

### Plan 07 — Interactive Filtering on Listing Page — [DONE]
**Accomplished:**
- Migrated listing page to use `MemberSpotlightsClient`.
- Integrated `StripeSelect` for branded dropdowns.
- Implemented client-side search and sorting.

### Plan 08 — Design System Alignment (Fixes) — [DONE]
**Tasks:**
- [x] Replace raw `<Link>` and `<button>` with `TactileButton` in listing and carousel.
- [x] Replace remaining hardcoded colors with HDS tokens in `SpotlightDetail.module.css`.
- [x] Verify IBM Plex Sans application.

### Plan 09 — Community Page Refactor — [DONE]
**Goal:** Optimize the `/community` page for performance and fix potential hydration issues.
**Tasks:**
- [x] Review `page.tsx` and `CommunityClient.tsx` for any `framer-motion` leaks in server components.
- [x] Ensure `SpotlightCarousel` (Client Component) is correctly handled within the server-rendered page.
- [x] Consolidate animation logic to avoid layout shifts.

---

## Dependency Map

```
Plan 01 (Schema) [DONE] ──→ Plan 02 (Seed) [DONE]
                 ├──→ Plan 03 (Listing) [DONE] ──→ Plan 04 (Detail) [DONE] ──→ Plan 07 (Filtering) [DONE]
                 └──→ Plan 05 (Carousel) [DONE] ──→ Plan 06 (Integration) [DONE] ──→ Plan 09 (Refactor) [DONE]
                                                                     └──→ Plan 08 (Standardization) [DONE]
```
es use `hds-*` tokens for colors and spacing.
- Resolve font weight issues (ensure IBM Plex Sans is correctly applied).

### Plan 09 — Community Page Refactor
**Files:**
- `src/app/community/page.tsx`
- `src/app/community/CommunityClient.tsx`

**Refinements:**
- Move all `framer-motion` dependent sections (Members Grid, Join CTA) from the server page to `CommunityClient`.
- Fix hydration warnings and server/client boundary errors.

---

## Dependency Map

```
Plan 01 (Schema) ──→ Plan 02 (Seed)
                 ├──→ Plan 03 (Listing) ──→ Plan 04 (Detail) ──→ Plan 07 (Filtering)
                 └──→ Plan 05 (Carousel) ──→ Plan 06 (Integration) ──→ Plan 09 (Refactor)
                                                                    └──→ Plan 08 (Standardization)
```

## New Dependencies
- None.

## Files Created / Modified

| Action | File |
|---|---|
| **Create** | `src/sanity/schemaTypes/memberSpotlight.ts` |
| **Modify** | `src/sanity/schemaTypes/index.ts` |
| **Create** | `scripts/seed-spotlights.ts` |
| **Create** | `src/app/member-spotlights/page.tsx` |
| **Create** | `src/app/member-spotlights/MemberSpotlightsClient.tsx` |
| **Modify** | `src/components/community/SpotlightCard.tsx` |
| **Modify** | `src/app/community/page.tsx` |
| **Modify** | `src/app/community/CommunityClient.tsx` |
