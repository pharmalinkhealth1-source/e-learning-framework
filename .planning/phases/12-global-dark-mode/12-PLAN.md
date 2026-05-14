# Phase 12: Global Dark Mode

Implement a robust, token-driven dark mode for the platform.

## Objectives
- [ ] Define dark mode color palette in `src/styles/tokens.css` using `[data-theme='dark']`.
- [ ] Implement `ThemeProvider` and `useTheme` hook for state management.
- [ ] Add a `ThemeToggle` component to the `Navbar`.
- [ ] Ensure persistence via `localStorage` and respect `prefers-color-scheme`.
- [ ] Audit and fix any components with hardcoded colors.

## Implementation Steps

### 1. Token Definition
- Identify all core background and text variables in `tokens.css`.
- Define dark mode overrides within `:root[data-theme='dark']`.
- Focus on "Clinical Luxury" aesthetic: deep navy/purples (`#0a2540`), vibrant accents, and high-contrast typography.

### 2. State Management
- Create `src/context/ThemeContext.tsx`.
- Use a script in `layout.tsx` to prevent theme flicker on load (critical for SSR).

### 3. UI Implementation
- Design a sleek `ThemeToggle` component with `framer-motion` animations.
- Integrate into the `Navbar` (likely next to the user profile).

### 4. Verification
- Test across all major pages: Home, Community, Directory, Careers.
- Verify system preference detection.
