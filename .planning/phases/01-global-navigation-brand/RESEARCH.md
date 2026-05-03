# Research: Phase 1 — Navigation & Brand

## Stripe HDS Tokens
Stripe uses a tiered token system. For this clone, we will implement:
- **Spacing**: Base unit is 4px (`--hds-space-core-100: 4px`). Scaling: 8px, 12px, 16px, 24px, 32px, 48px, 64px.
- **Colors**:
  - Primary: `#635bff` (Stripe Purple)
  - Background: `#ffffff` (Light), `#0a2540` (Dark)
  - Accents: `#00d4ff` (Cyan), `#7a73ff` (Lavendar)
- **Typography**:
  - Font: "Inter" or "Söhne" (using Inter as fallback).
  - Scale: Fluid typography based on viewport.

## Megamenu Animation (Framer Motion)
The signature Stripe menu uses a **Shared Layout** concept:
1. **Dynamic Container**: A single background `motion.div` that morphs size and position.
2. **Content Transition**: `AnimatePresence` for fading/sliding menu panes.
3. **State**: Track `hoveredIndex` and `prevHoveredIndex` to determine transition direction.

## Best Practices
- **Backdrop Blur**: Use `backdrop-filter: blur(20px)` on the sticky header for the glassmorphism effect.
- **Accessibility**: Ensure Keyboard navigation support (ARIA expanded/controls).
- **Performance**: Use CSS Modules for scoped styles to prevent design token leakage.

---
*Created: 2026-05-03*
