---
feature_name: "Mega Menu Navigation"
feature_slug: "mega-menu"
owner: "ciaran-nash"
status: "draft"
created_date: "2026-05-13"
target_date: ""
phase: "Phase 13: Mega Menu"
scope_type: "new-feature"
github_project: ""
links: []
checkpoint_refs: []
cross_feature_blockers: []
---

# PRD: Mega Menu Navigation

## 1. Executive Summary

**One-liner:** Replace PharmaLink's flat 9-link navbar with a Stripe-fidelity hover-triggered mega menu organised under 5 client-specified top-level sections.

**What's changing:** Today the navbar renders a flat array of 9 links with no grouping or hierarchy. After this ships, 5 top-level items (About Us, Community, Data Insights, Podcast, Contact Us) trigger full-width animated dropdown panels with grouped sub-links, one-line descriptors, and featured content cards — matching the Stripe.com mega menu pattern.

**Who it's for:** All visitors. The new structure reflects the user journey (discover → engage → learn → listen → connect) and reduces cognitive load by grouping the 9+ pages into meaningful sections.

**Why now:** The site has grown to 15+ routes across 12 phases. Flat navigation no longer scales. Client has explicitly requested this restructure before further feature work.

**Done looks like:** Hovering "Community" reveals a full-width panel with Forum, Community Hub, Member Spotlights, and Careers sub-links (each with descriptor) plus a featured card. All 5 top-level items work. Mobile collapses to hamburger accordion. Dark mode fully supported.

**Primary risk:** Mobile menu architecture — no hamburger exists yet, must be built from scratch with correct focus management and z-index layering.

---

## 2. Problem & Context

**Problem statement:** 9 flat nav links with no hierarchy forces users to scan every item to find their destination. Pages like Member Spotlights and Careers have no contextual relationship in the current nav.

**Supporting data / evidence:** Client specification (2026-05-13): top-level = About Us, Community, Data Insights, Podcast, Contact Us. Stripe megamenu screenshot provided as fidelity reference.

**What happens if we don't build this:** Nav becomes unmanageable as more pages ship. User journeys stay fragmented.

**Strategic fit:** Enables clean IA for all future phases. Podcast page (Phase 13 sub-task) establishes the /podcast route for future content expansion.

---

## 3. Goals, Non-Goals & Success Metrics

### Goals

1. 5 top-level nav items replace current 9 flat links
2. Hover-triggered full-width mega menu panels with Stripe-fidelity layout
3. All existing pages reachable via new navigation hierarchy
4. Mobile hamburger + accordion collapse
5. Full dark mode support via HDS tokens
6. /podcast route created with embedded player and episodes list

### Non-Goals

- Sanity-driven nav data (static TypeScript only for now)
- Animated sub-link stagger on panel open (future enhancement)
- Mega menu search integration (handled by existing SearchModal)
- Creating new pages beyond /podcast

### Success Metrics

| Metric | Baseline | Target | How Measured |
|--------|----------|--------|--------------|
| All 15 existing routes reachable | 9 flat links | 5 top-level + sub-links cover all routes | Manual click-through |
| Dark mode coverage | Partial (undefined tokens) | 0 undefined token references | CSS audit |
| Mobile menu | None | Hamburger + accordion at ≤940px | Viewport resize test |

---

## 4. Requirements

### Must Have (blocks launch)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R1 | 5 top-level nav items replace flat array | Navbar renders exactly: About Us, Community, Data Insights, Podcast, Contact Us |
| R2 | Hover opens full-width mega menu panel | Panel appears on mouseenter, closes on mouseleave with Framer Motion animation |
| R3 | Each panel has grouped sub-links with descriptors | Link title + one-line descriptor per sub-item, matching approved copy |
| R4 | Each panel has featured content card | Rightmost column shows image/icon + title + CTA link |
| R5 | All existing pages mapped into new hierarchy | No orphaned routes — every page reachable via new nav |
| R6 | Undefined HDS tokens resolved | No `--hds-color-bg`, `--hds-color-border`, `--hds-color-primary`, `--hds-shadow-lg` undefined refs |
| R7 | /podcast page created | Route exists, embedded podcast player widget, static episodes list |
| R8 | Mobile menu works at ≤940px | Hamburger icon, accordion expand/collapse, all links accessible |
| R9 | Dark mode correct | All dropdown surfaces use defined HDS tokens, no light-mode leaks |

### Should Have (important, not blocking)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R10 | Keyboard navigation | Tab moves through top-level items, Enter/Space opens panel, Escape closes |
| R11 | ARIA roles | `role="navigation"`, `aria-expanded`, `aria-haspopup` on triggers |

### Could Have (nice to have, cut first)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R12 | Focus trap in open panel | Focus contained within open panel when navigating by keyboard |

---

## 5. UX & Interaction Notes

**User Experience:**

- Hover top-level link → panel opens (Framer Motion spring, opacity 0→1, y -10→0)
- Move mouse into panel → stays open
- Mouse leaves both trigger and panel → closes after 150ms delay (prevents accidental close)
- Click sub-link → navigate, panel closes
- Escape key → closes panel, returns focus to trigger

**Visual Design:**

Stripe reference pattern:
- Full-width dropdown (matches nav container width, ~1264px max)
- White background (light) / deep navy with backdrop blur (dark)
- Column grid: 2–4 content columns + 1 featured card column
- Column headers: uppercase, xs text, HDS primary colour, underline separator
- Sub-links: bold title (HDS text-main) + one-line descriptor (HDS text-quiet, smaller)
- Featured card: image/icon top, title, 2-line description, arrow CTA link
- Arrow pointer at top of panel pointing to active trigger

**Panel content:**

| Panel | Columns | Featured Card |
|-------|---------|---------------|
| About Us | About PharmaLink | "Join the Network" — sign up CTA |
| Community | Community Hub, Forum, Member Spotlights, Careers | Latest community activity (static) |
| Data Insights | Data Insights, Directory, Blog, e-Learning | "Explore the Data" featured report card |
| Podcast | Latest Episodes | Podcast cover art + subscribe CTA |
| Contact Us | (no sub-links) | Office/contact card with email + social icons |

**Responsive:**

- ≥941px: full mega menu (hover)
- ≤940px: hamburger toggle (existing breakpoint), accordion list replacing mega menu panels, full-screen overlay

**Accessibility:**

- `aria-expanded` on top-level triggers
- `aria-haspopup="true"` on dropdown triggers
- `role="region"` on panel content
- Focus returns to trigger on Escape
- Colour contrast ≥4.5:1 for all text

---

## 6. Dependencies & Risks

### Cross-Feature Blockers

_None — all pages this references are already merged._

### External Blockers

| Blocker | Status | Fallback |
|---------|--------|---------|
| Podcast embed URL | Public example feed used | Spotify iframe with public podcast example |

### Internal Dependencies

- `framer-motion` — already installed
- `src/styles/tokens.css` — T04 adds `--hds-shadow-*` tokens
- All route pages (about-us, community, forum, etc.) — already exist except /podcast

### Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Mobile menu z-index conflicts with SearchModal | Medium | High | Assign explicit z-index layers in tokens or module CSS |
| Hover delay causing accidental panel close | Low | Medium | 150ms mouseleave debounce on panel wrapper |
| React Compiler conflict with manual state management | Low | Medium | Use simple useState — no useMemo/useCallback |
| Undefined shadow tokens breaking other components | Low | Low | Add tokens additively — don't remove existing fallbacks |

---

## 7. Rollout Plan

**Phase/level:** Phase 13 — Mega Menu Navigation.

**Deployment strategy:** Direct merge to main after Wave 3 passes visual review.

**Rollback plan:** Revert Navbar.tsx to flat link array (git revert). Data file and panel components are additive.

**Monitoring:** Visual check on desktop and mobile. Dark mode toggle test. All 5 panels open/close correctly.

---

## 8. Milestones & Release Criteria

| Milestone | What's True When Done | Target Date |
|-----------|----------------------|-------------|
| Wave 1 complete | Nav data file exists with all 5 panels defined | — |
| Wave 2 complete | All panels render correctly in desktop light + dark mode | — |
| Wave 3 complete | Mobile menu works, keyboard nav passes, /podcast live | — |

**Release criteria:**
- All 5 mega menu panels open on hover
- All sub-links navigate to correct routes
- Dark mode: no undefined token references
- Mobile: hamburger opens accordion at 940px
- /podcast page loads with embedded player
- TypeScript compiles with `npx tsc --noEmit`
- `npm run lint` passes

---

## 9. Open Questions

| # | Question | Status | Resolution |
|---|----------|--------|-----------|
| Q1 | Podcast real feed URL for future | Open | Use public example feed for now |
| Q2 | Contact Us featured card — real office address? | Open | Use placeholder copy for now |

---

## 10. Checkpoint Learnings

**Patterns to reinforce:**
- CSS Modules only — no Tailwind
- HDS semantic token names (`--hds-color-surface-bg-quiet` not `--hds-color-bg`)
- Dark mode via `:root[data-theme='dark']` in tokens.css

**Anti-patterns to avoid:**
- Manual `useMemo`/`useCallback` (React Compiler is active)
- Adding new undefined token references to component CSS
- Touching `src/sanity/lib/client.ts` or `.env*`

---

## 11. Agent Boundaries

**Files to reference for patterns:**
- `src/components/stripe/Navbar.module.css` — HDS token usage pattern
- `src/styles/tokens.css` — full token inventory
- `src/components/stripe/Megamenu.tsx` — existing animation structure
- `src/components/stripe/Hero.module.css` — glass/surface token usage

**Files NOT to touch:**
- `src/sanity/lib/client.ts`
- `src/middleware.ts`
- `src/styles/tokens.css` — T04 only (other tasks must not touch)
- `.env*`, `package-lock.json`

**Architecture decisions already made:**
- Hover-triggered (not click) on desktop
- Static TypeScript data (not Sanity-driven)
- Framer Motion for animation (already installed)
- `/podcast` gets real embedded player (public feed), not a stub

**Known gotchas:**
- `Megamenu.module.css` uses 6 undefined tokens — T04 must fix before any visual work references these classes
- `.section` class used in `Megamenu.tsx` but never defined in CSS — T04 adds it
- `layoutId="dropdown-container"` on AnimatePresence — remove layoutId to prevent unmount animation glitch
- No hamburger component exists — T06 builds from scratch
- `src/app/podcast/` directory does not exist — T05 creates it

---

## Agent Tasks

See `./tasks.yaml` for full task definitions.

| ID | Title | Complexity | Priority | Dependencies |
|----|-------|-----------|---------|--------------|
| T01 | Nav data structure | 1 | must | — |
| T02 | Navbar rewire | 3 | must | T01 |
| T03 | Panel content components | 3 | must | T01 |
| T04 | Megamenu CSS overhaul | 3 | must | T01 |
| T05 | Podcast page | 2 | must | — |
| T06 | Mobile responsive | 3 | must | T02, T03 |
| T07 | Accessibility | 2 | should | T02, T03 |

---

*Generated by KARIMO v9.7 interview system — 2026-05-13*
