# Phase Context: Phase 2 — The Mesh Gradient Hero

## Objective
Implement the signature animated mesh gradient hero section with high-performance WebGL and HDS-aligned typography.

## Technical Approach
- **Rendering**: HTML5 `<canvas>` with a lightweight WebGL wrapper (MiniGL pattern).
- **Shader**: Custom GLSL fragment shader utilizing time-based noise and multi-point color blending to achieve the "Stripe" liquid effect.
- **Typography**: Hero headline using `HDS-size-heading-xxl` with tight letter-spacing and responsive scaling.
- **Glassmorphism**: Integrated CTA buttons and feature tags utilizing the `.glass` utility created in Phase 1.

## Requirements
- **High Performance**: 60fps animation without CPU bottlenecks.
- **Responsive**: Mesh should adapt to aspect ratio changes without stretching artifacts.
- **Theme Support**: Gradient colors should shift subtly in Dark Mode to maintain readability.
- **Editability**: Shader code and color tokens must be easily editable in the component file.

## Key Files
- `src/components/stripe/MeshGradient.tsx`: Core WebGL logic and shaders.
- `src/components/stripe/Hero.tsx`: Layout and content for the hero section.
- `src/components/stripe/Hero.module.css`: Layout-specific styles and glassmorphism refinements.

## References
- Stripe HDS (Heading Design System)
- MiniGL implementation patterns
