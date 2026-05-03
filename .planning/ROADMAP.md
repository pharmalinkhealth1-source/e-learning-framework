# Roadmap: Stripe-Fidelity Client Basis

Phased execution plan to build a high-fidelity Stripe clone basis for a client platform.

## Phases

- [x] **Phase 1: Global Navigation & Brand** — Implement HDS CSS variables and design tokens. (Done: 2026-05-03)
- [x] **Phase 2: The Mesh Gradient Hero** — Implement the animated mesh gradient (WebGL or CSS Canvas). (Done: 2026-05-03)
- [x] **Phase 3: The Bento Ecosystem** — Build modular bento-card components with glassmorphism. (Done: 2026-05-03)
- [/] **Phase 4: Sanity Schema & Studio** — Define schemas for Forum, Directory, Careers, and Insights.
- [ ] **Phase 5: Clerk Authentication** — User signup/login and role-based access.
- [ ] **Phase 6: Custom Forum Layer** — Threaded discussions using Sanity backend.
- [ ] **Phase 7: MapLibre Location Directory** — High-performance vector map.
- [ ] **Phase 8: D3 Animated Insights** — Interactive data visualisations.

### Phase 5: Clerk Authentication
**Goal:** Implement secure user authentication and role-based access using Clerk.

**Objectives:**
- Install and configure Clerk SDK.
- Create middleware for route protection.
- Implement login/signup pages with Stripe branding.
- Define user roles (Client, Developer, Partner) for the platform.
- Integrate Clerk user metadata with Sanity forum authorship.

**Canonical Refs:**
- `src/middleware.ts`
- `src/app/layout.tsx`

---
*Next Step: Run `/gsd-plan-phase 5` to start implementation.*
