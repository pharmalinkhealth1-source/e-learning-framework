---
id: 01-01
wave: 1
autonomous: true
objective: Establish the design foundation and implement the high-fidelity global navigation.
files_modified:
  - src/styles/tokens.css
  - src/styles/globals.css
  - src/app/layout.tsx
  - src/components/stripe/Navbar.tsx
  - src/components/stripe/Navbar.module.css
  - src/components/stripe/Megamenu.tsx
  - src/components/stripe/Megamenu.module.css
---
# Plan: Phase 1 — Global Navigation & Brand


Establish the design foundation and implement the high-fidelity global navigation.

## Task 1: Design Tokens & Global CSS
**Goal**: Define HDS CSS variables and base styles.
1. Create `src/styles/tokens.css` with color, spacing, and typography tokens.
2. Setup `src/styles/globals.css` with resets and font loading (Inter).
3. Implement a base layout component in `src/app/layout.tsx`.

## Task 2: Sticky Navigation Shell
**Goal**: Create the glassmorphism header.
1. Create `src/components/stripe/Navbar.tsx`.
2. Implement sticky positioning with `backdrop-filter` and glassmorphism styling.
3. Add the Stripe logo (SVG) and primary NavLinks.

## Task 3: Animated Megamenus
**Goal**: Implement the morphing dropdown effect.
1. Create `src/components/stripe/Megamenu.tsx`.
2. Use Framer Motion to create a morphing container that tracks hovered NavLinks.
3. Implement content panes for "Products", "Solutions", and "Developers".

## Task 4: Dark Mode Toggle
**Goal**: Implement context-aware theme switching.
1. Create a `ThemeProvider` using React Context.
2. Add a `ThemeToggle` component to the Navbar.
3. Ensure all HDS tokens have `[data-theme='dark']` overrides.

---
*Verification: Run `/gsd-verify-work` after Task 4.*
