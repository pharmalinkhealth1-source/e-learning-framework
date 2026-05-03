---
id: 03
wave: 1
autonomous: true
objective: Build modular bento-card components with glassmorphism and interactive hover effects.
files_modified:
  - src/components/stripe/Bento.tsx
  - src/components/stripe/Bento.module.css
  - src/app/page.tsx
---

---
id: 03-01
wave: 1
autonomous: true
objective: Build modular bento-card components with glassmorphism and interactive hover effects.
files_modified:
  - src/components/stripe/Bento.tsx
  - src/components/stripe/Bento.module.css
  - src/app/page.tsx
---
# Plan: Phase 3 — The Bento Ecosystem


Build modular bento-card components with glassmorphism and interactive hover effects.

## Task 1: Base Bento Components
- [ ] Create `src/components/stripe/Bento.tsx`.
- [ ] Implement `BentoGrid` with CSS Grid layout (`repeat(4, 1fr)`).
- [ ] Implement `BentoCard` with `backdrop-filter` and HDS border/shadow tokens.
- [ ] Setup Framer Motion hover animations (lift and glow).

## Task 2: Bento Section Implementation
- [ ] Define content for 4-5 sample Bento cards (Forum, Directory, Careers, Insights).
- [ ] Implement the Bento section in `src/app/page.tsx`.
- [ ] Add section headings and subheadings with HDS typography.

## Task 3: Interactive Polish
- [ ] Implement "Reveal" state on hover (e.g., secondary text or action button appearing).
- [ ] Ensure dark mode parity for glassmorphism blurs and borders.
- [ ] Optimize mobile responsiveness (responsive column spans).

## Verification Criteria
- [ ] Grid layout is responsive and matches the Bento pattern.
- [ ] Glassmorphism effect is consistent across all cards.
- [ ] Hover interactions are smooth (60fps) and reactive.
- [ ] Dark mode toggle preserves visual quality.
