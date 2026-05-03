---
id: 02-01
wave: 1
autonomous: true
objective: Implement the animated mesh gradient hero section with pixel-perfect HDS typography.
files_modified:
  - src/components/stripe/MeshGradient.tsx
  - src/components/stripe/Hero.tsx
  - src/components/stripe/Hero.module.css
  - src/app/page.tsx
---
# Plan: Phase 2 — The Mesh Gradient Hero

Implement the signature animated mesh gradient hero section with high-performance WebGL and HDS-aligned typography.

## Task 1: WebGL Mesh Gradient Component
- [ ] Create `src/components/stripe/MeshGradient.tsx`.
- [ ] Implement `MiniGL` wrapper class for lightweight WebGL management.
- [ ] Port the Stripe-style fragment shader (GLSL) for the liquid gradient effect.
- [ ] Add props for custom colors and speed control.

## Task 2: Hero Section Layout
- [ ] Create `src/components/stripe/Hero.tsx`.
- [ ] Implement the layout with the `MeshGradient` as background.
- [ ] Add the primary headline and subheadline with HDS tokens.
- [ ] Implement the primary and secondary CTAs with glassmorphism effects.

## Task 3: Integration & Polish
- [ ] Update `src/app/page.tsx` to include the `Hero` section.
- [ ] Add scroll-based entrance animations using Framer Motion (reveal-on-scroll).
- [ ] Verify responsiveness across mobile, tablet, and desktop breakpoints.
- [ ] Test theme switching behavior (Light/Dark mode color shifts).

## Verification Criteria
- [ ] Hero section renders with 60fps animated gradient.
- [ ] Typography matches HDS specs (Inter, weight, spacing).
- [ ] Theme toggle correctly updates gradient background (if applicable).
- [ ] No layout shift on load.
