# Roadmap: Stripe-Fidelity Client Basis

Phased execution plan to build a high-fidelity Stripe clone basis for a client platform.

## Phases

- [x] Phase 01: Global Navigation & Brand — Implement HDS CSS variables and design tokens. (Done: 2026-05-03)
- [x] Phase 02: The Mesh Gradient Hero — Implement the animated mesh gradient (WebGL or CSS Canvas). (Done: 2026-05-03)
- [x] Phase 03: The Bento Ecosystem — Build modular bento-card components with glassmorphism. (Done: 2026-05-03)
- [x] Phase 04: Sanity Schema & Studio — Define schemas for Forum, Directory, Careers, and Insights. (Done: 2026-05-03)
- [x] Phase 05: Clerk Authentication — User signup/login and role-based access. (Done: 2026-05-03)
- [x] Phase 06: Custom Forum Layer — Threaded discussions using Sanity backend. (Done: 2026-05-08)
- [x] Phase 07: MapLibre Location Directory — High-performance vector map. (Done: 2026-05-08)
- [x] Phase 08: D3 Animated Insights — Interactive data visualisations. (Done: 2026-05-08)
- [x] Phase 09: Community Hub Page — High-fidelity community page with forum integration and Clinical Luxury design. (Done: 2026-05-08)
- [x] Phase 10: Member Spotlights — Design and implement member spotlight/profile cards section. (Done: 2026-05-13)
- [x] Phase 11: Careers & Job Board — Implement Sanity-powered careers portal. (Done: 2026-05-13)
- [x] Phase 12: Global Dark Mode — Full HDS token-driven dark mode implementation. (Done: 2026-05-13)
- [ ] Phase 13: Search & Discovery — Global search for Directory, Forum, and Blog.
- [ ] Phase 14: User Dashboard — Personalized space for bookmarks, forum activity, and profile settings.

## Milestone 1: The Visual Shell (Complete)

### Phase 01: Global Navigation & Brand
**Goal:** Implement the foundation of the design system.

### Phase 02: The Mesh Gradient Hero
**Goal:** Create a high-fidelity animated hero section.

### Phase 03: The Bento Ecosystem
**Goal:** Build the primary UI components.

### Phase 04: Sanity Schema & Studio
**Goal:** Setup CMS for all dynamic content.

### Phase 05: Clerk Authentication
**Goal:** Implement secure user authentication and role-based access using Clerk.

### Phase 06: Custom Forum Layer
**Goal:** Build the forum infrastructure.

### Phase 07: MapLibre Location Directory
**Goal:** Implement geographic directory features.

### Phase 08: D3 Animated Insights
**Goal:** Data visualization layer.

### Phase 09: Community Hub Page
**Goal:** Build a high-fidelity `/community` page.

### Phase 10: Member Spotlights
**Goal:** Design and implement member spotlight/profile cards section.

## Milestone 2: Functional Ecosystem Expansion (Active)

### Phase 11: Careers & Job Board
**Goal:** Build a professional careers portal powered by the `jobOpening` Sanity schema.

**Objectives:**
- Create `/careers` listing page with category filters (Clinical, Tech, Operations).
- Build individual `/careers/[slug]` detail pages.
- Implement an application modal with Clerk user pre-fill.
- Ensure "Clinical Luxury" styling throughout.

### Phase 12: Global Dark Mode
**Goal:** Complete the HDS token system with native dark mode support.

**Objectives:**
- Define dark mode color palette in `tokens.css`.
- Implement theme-switching logic (local storage + system preference).
- Update all components to support token-based theme inheritance.

---
*Next Step: Run `/gsd-plan-phase 11` to start implementation.*
