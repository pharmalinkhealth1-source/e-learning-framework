# Phase 11 Plan: Careers & Job Board

## Goal
Build a professional, high-fidelity Careers portal at `/careers` with Sanity-powered listings, individual detail pages, and a seamless application experience that aligns with the "Clinical Luxury" design system.

## Wave 1: Schema Evolution & Content (Plans 01-02)

### Plan 01 — Update `jobOpening` Schema
**File:** `src/sanity/schemaTypes/jobOpening.ts`
**Tasks:**
- [ ] Add `slug` field (source: `title`).
- [ ] Add `category` field (options: `Clinical`, `Technical`, `Operations`, `Research`).
- [ ] Add `excerpt` field for card previews.
- [ ] Add `publishedAt` field.
- [ ] Add `responsibilities` (array of strings) and `requirements` (array of strings).
- [ ] Update `src/sanity/schemaTypes/index.ts` if necessary (it should already be there).

### Plan 02 — Seed Sample Job Openings
**File:** `scripts/seed-jobs.ts` (New)
**Tasks:**
- [ ] Create a seeding script to populate Sanity with at least 4 diverse job openings across categories.
- [ ] Run the script using `npx ts-node`.

## Wave 2: Careers Listing Page (Plans 03-05)

### Plan 03 — Create `JobCard` Component
**File:** `src/components/careers/JobCard.tsx` (New)
**Tasks:**
- [ ] Design a bento-style card using HDS tokens.
- [ ] Include title, company, location, type badge, and excerpt.
- [ ] Add a `TactileButton` for "View Position".

### Plan 04 — Build `/careers` Listing Page
**Files:**
- `src/app/careers/page.tsx`
- `src/app/careers/CareersClient.tsx`
- `src/app/careers/Careers.module.css`
**Tasks:**
- [ ] Implement the server component for fetching data.
- [ ] Build the client component with filtering logic by category and job type.
- [ ] Apply "Clinical Luxury" visuals (MeshGradient hero, grid lines, radial glow).

### Plan 05 — Navbar Update
**File:** `src/components/stripe/Navbar.tsx`
**Tasks:**
- [ ] Add "Careers" link to the navigation (likely under "Company" or "About").

## Wave 3: Job Detail Pages (Plans 06-07)

### Plan 06 — Build `/careers/[slug]` Detail Page
**Files:**
- `src/app/careers/[slug]/page.tsx`
- `src/app/careers/[slug]/JobDetail.module.css`
**Tasks:**
- [ ] Implement dynamic routing and data fetching by slug.
- [ ] Design a high-readability layout for responsibilities and requirements.
- [ ] Include a sticky "Apply Now" CTA.

### Plan 07 — Application Modal/Form
**Files:**
- `src/components/careers/ApplyModal.tsx`
- `src/components/careers/ApplyForm.tsx`
**Tasks:**
- [ ] Build a glassmorphism modal for applications.
- [ ] Integrate Clerk to pre-fill user name and email.
- [ ] (Optional) Add a simple success toast or state.

## Wave 4: Polish & SEO (Plan 08)

### Plan 08 — Metadata & Transitions
**Tasks:**
- [ ] Add proper SEO metadata to careers and detail pages.
- [ ] Add page transition animations using `framer-motion`.

## Dependency Map
```
Plan 01 (Schema) ──→ Plan 02 (Seed) ──→ Plan 04 (Listing) ──→ Plan 06 (Detail)
                 ├──→ Plan 03 (Card) ──┘
                 └──→ Plan 05 (Navbar)
Plan 06 (Detail) ──→ Plan 07 (Apply Modal) ──→ Plan 08 (Polish)
```

## Verification Loop (UAT)
- [ ] `/careers` renders correctly with HDS styling.
- [ ] Filtering jobs by category updates the grid instantly.
- [ ] Clicking a job card routes to the correct `/[slug]` page.
- [ ] Detail page displays all Sanity content (responsibilities, requirements).
- [ ] Apply modal opens and shows authenticated user data.
- [ ] Mobile responsiveness verified.
