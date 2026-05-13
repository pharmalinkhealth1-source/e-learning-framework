# Research Findings: careers-job-board

## Key Finding: Feature Already Implemented

All 8 planned tasks are substantially implemented. Agents should treat tasks as **verification passes**, not greenfield builds.

## Confirmed Implemented Files

- `src/app/careers/page.tsx` — listing server component
- `src/app/careers/CareersClient.tsx` — client with filter logic
- `src/app/careers/Careers.module.css`
- `src/app/careers/[slug]/page.tsx` — detail page
- `src/app/careers/[slug]/JobDetailClient.tsx`
- `src/app/careers/[slug]/JobDetail.module.css`
- `src/components/careers/JobCard.tsx`
- `src/components/careers/JobCard.module.css`
- `src/components/careers/ApplyModal.tsx`
- `src/components/careers/ApplyModal.module.css`
- `src/components/careers/ApplyForm.tsx`
- Navbar: "Careers" link present in Navbar.tsx

## Schema State

`src/sanity/schemaTypes/jobOpening.ts` already contains: `slug`, `category` (Clinical/Technical/Operations/Research), `excerpt`, `publishedAt`, `responsibilities[]`, `requirements[]`, `applyUrl`.

## Patterns Observed

- Server → Client component split (matches `/blog`, `/elearning`, `/member-spotlights`)
- CSS Modules + `--hds-*` tokens only (no Tailwind)
- `framer-motion` `AnimatePresence` for grid transitions
- `TactileButton` for CTAs
- `MeshGradient` in hero
- `useUser()` from `@clerk/nextjs` for modal pre-fill

## Open Questions / Gaps

1. **ApplyForm submission target** — Where does form data go? No email service, API route, or external endpoint confirmed. Highest-priority gap.
2. **Unauthenticated apply flow** — Redirect to `/sign-in` or allow guest apply?
3. **useMemo in CareersClient** — React Compiler is active; manual `useMemo` may be redundant.

## Risks

- `src/sanity/schemaTypes/` is `require_review` — any future schema changes need gate
- No test runner — verification is manual UAT only
- React Compiler constraint conflicts with `useMemo` in CareersClient.tsx

## Dependency Map

```
T01 → T02
T01 → T03 → T04
T01 → T05
T03 + T04 → T06
T06 → T07
T04 + T07 → T08
```
