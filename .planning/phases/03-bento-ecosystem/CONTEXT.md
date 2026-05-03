# Phase Context: Phase 3 — The Bento Ecosystem

## Objective
Build a modular, interactive Bento grid system utilizing CSS Grid, glassmorphism, and Framer Motion micro-animations.

## Technical Approach
- **Grid System**: Native CSS Grid with flexible spanning (`grid-column: span X`).
- **Styling**: `backdrop-filter` for glassmorphism, aligned with HDS tokens for consistency.
- **Interactivity**: 
  - **Lifting Effect**: Framer Motion `whileHover={{ y: -4, scale: 1.01 }}`.
  - **Reveal Content**: Hover-triggered opacity/translate transitions for hidden card details.
  - **Shared Transitions**: Using `layoutId` for smooth layout changes if cards expand.
- **Components**:
  - `BentoGrid`: The parent container managing spacing and columns.
  - `BentoCard`: The base tile with glass styling and hover logic.
  - `BentoTag`: Utility for metadata tags inside cards.

## Requirements
- **Consistency**: All cards must share a unified border-radius and shadow profile defined in Phase 1.
- **Accessibility**: Cards must be focusable and provide screen-reader-friendly content structure.
- **Responsiveness**: Grid must collapse to 1 column on mobile and 2 columns on tablet.
- **Performance**: High-fidelity blurs should be optimized to prevent stutter on lower-end devices.

## Key Files
- `src/components/stripe/Bento.tsx`: The grid and card components.
- `src/components/stripe/Bento.module.css`: CSS Grid and glassmorphism definitions.
- `src/app/page.tsx`: Integration of the Bento section into the landing page.

## References
- Linear/Stripe/Framer Bento patterns
- HDS Shadow/Border tokens
