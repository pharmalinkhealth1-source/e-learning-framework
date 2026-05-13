# PRD: Careers & Job Board

**Slug:** careers-job-board
**Status:** Ready
**Date:** 2026-05-13
**Author:** KARIMO Interviewer (automated from research)

---

## 1. Overview

Build a professional, high-fidelity Careers portal at `/careers` that integrates Sanity CMS for content management, Clerk for authenticated applications, and the "Clinical Luxury" HDS design system for visual consistency with the rest of the PharmaLink platform.

The portal surfaces open positions, supports category-based filtering, provides detailed individual job pages routed by slug, and offers an authenticated application modal that pre-fills user data from Clerk.

---

## 2. Goals

- Establish `/careers` as the canonical job listing page for PharmaLink
- Enable Sanity Studio editors to manage job postings without developer involvement
- Provide a seamless, branded application experience for authenticated users
- Match the visual quality of the existing platform (MeshGradient hero, grid lines, bento cards, HDS tokens)
- Ensure SEO coverage for each individual job posting

---

## 3. Non-Goals

- External Applicant Tracking System (ATS) integration (Phase 2)
- Email notification pipeline for submitted applications (Phase 2)
- Resume/CV file upload (Phase 2)
- Admin dashboard for reviewing applications (Phase 2)

---

## 4. User Stories

**Job Seeker (unauthenticated)**
- As a visitor, I can browse all open positions at `/careers` filtered by category
- As a visitor, I can read a full job description at `/careers/[slug]`
- As a visitor, I can see a sticky "Apply Now" CTA on the detail page

**Job Seeker (authenticated)**
- As a signed-in user, I can open an application modal with my name and email pre-filled from Clerk
- As a signed-in user, I can submit an application and receive a success confirmation

**Content Editor**
- As a Sanity editor, I can create, edit, and publish job openings with title, category, location, type, excerpt, responsibilities, requirements, and an optional external apply URL

---

## 5. UX Notes

### Listing Page (`/careers`)

- MeshGradient hero (cool blue palette: `#f6f9fc`, `#eef2f7`, `#e5edf5`, `#f0f4f8`)
- Vertical grid lines overlay for HDS visual language
- Hero headline: "Build the future of African Healthcare" with brand-colour accent
- Segmented control filter bar: All / Clinical / Technical / Operations / Research
- Responsive bento card grid with `AnimatePresence` exit/enter transitions
- Empty state message when filter returns no results
- `FooterCTA` prompting open applications before `Footer`

### Job Card

- HDS bento card with category badge, location + type metadata icons, excerpt text
- `TactileButton` ("View Position") with diagonal arrow icon
- Links to `/careers/[slug]`

### Detail Page (`/careers/[slug]`)

- Back link to `/careers`
- Category badge + `<h1>` title
- Metadata grid: location, type, posted date
- Sections: About the Role, Responsibilities (bulleted), Requirements (bulleted)
- Sticky "Apply Now" CTA — opens `ApplyModal` (or redirects to `applyUrl` if set)

### Application Modal

- Glassmorphism panel centred on overlay
- Pre-fills `firstName + lastName` and `email` from Clerk `useUser()`
- Additional fields: cover note (textarea), phone (optional)
- Success state with confirmation message and close button
- Close on overlay click or X button

---

## 6. Technical Architecture

### Routing

```
/careers                  →  src/app/careers/page.tsx (Server Component)
/careers/[slug]           →  src/app/careers/[slug]/page.tsx (Server Component)
```

### Data Flow

```
Sanity Studio
  └─ jobOpening documents
       └─ client.fetch() in page.tsx (ISR: revalidate 60s)
            └─ passed as props to Client Components
```

### Component Tree

```
CareersPage (server)
  ├─ Navbar
  ├─ PageTransition
  │    ├─ Hero (MeshGradient + grid lines)
  │    └─ CareersClient (client)
  │         ├─ Segmented filter control
  │         └─ JobCard[] (AnimatePresence grid)
  ├─ FooterCTA
  └─ Footer

JobPage (server)
  ├─ Navbar
  ├─ Back link
  ├─ PageTransition
  │    ├─ Article (header + content sections)
  │    └─ JobDetailClient (client)
  │         └─ ApplyModal
  │              └─ ApplyForm
  └─ Footer
```

### Sanity Schema

`src/sanity/schemaTypes/jobOpening.ts` — all fields present:
`title`, `slug`, `category`, `company`, `location`, `type`, `excerpt`, `description`, `responsibilities[]`, `requirements[]`, `publishedAt`, `applyUrl`

### Key Constraints

- CSS Modules + `--hds-*` tokens only — no Tailwind
- React Compiler active — avoid manual `useMemo`/`useCallback` unless justified
- Clerk `useUser()` for authentication state in modal
- `src/sanity/schemaTypes/` in `require_review` — schema changes need gate sign-off
- No test runner — verification is manual UAT

---

## 7. Acceptance Criteria (Feature Level)

- [ ] `/careers` renders with HDS hero, grid lines, and bento card grid
- [ ] Category filter updates grid instantly with animated transitions
- [ ] No results state displays correctly
- [ ] Clicking a card navigates to the correct `/careers/[slug]` page
- [ ] Detail page renders all Sanity content: description, responsibilities, requirements
- [ ] `generateMetadata` produces correct title and description per job
- [ ] `notFound()` is triggered for invalid slugs
- [ ] "Apply Now" CTA opens modal (or redirects to `applyUrl` if set)
- [ ] Modal pre-fills name and email from Clerk for authenticated users
- [ ] Modal shows success state after form submission
- [ ] "Careers" link is present and functional in the Navbar
- [ ] Mobile layout is responsive across all breakpoints
- [ ] `npm run build` passes with no TypeScript errors
- [ ] `npm run lint` passes clean

---

## 8. Dependencies

- `@clerk/nextjs` ^7.3.0 — authentication (already installed)
- `next-sanity` / `sanity` ^5.23.0 — CMS client (already installed)
- `framer-motion` — AnimatePresence + PageTransition (already installed)
- `scripts/seed-jobs.ts` — content seeding (requires `SANITY_API_WRITE_TOKEN`)

---

## 9. Open Questions

1. Where does `ApplyForm` submit to? No API route exists at `src/app/api/forum/apply` or equivalent. Needs confirmation: email service, external endpoint, or new API route?
2. Is `useMemo` in `CareersClient.tsx` intentional or should it be removed now React Compiler is active?
3. Should unauthenticated users be blocked from opening the modal (redirect to `/login`) or allowed to apply as guests?

---

## 10. Out of Scope (Captured for Phase 2)

- ATS integration (Greenhouse, Lever, Workday)
- Application email notifications
- Resume/CV file upload via Sanity asset pipeline
- Internal applications dashboard
- Job posting expiry / archive workflow
