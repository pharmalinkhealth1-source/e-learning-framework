# PRD: Global Dark Mode
**Slug:** dark-mode  
**Created:** 2026-05-13  
**Status:** ready  

## Summary

Implement token-driven dark mode across the PharmaLink platform with system preference detection, localStorage persistence, and zero flash on load. Feature is fully implemented — this PRD governs verification.

## Goals

- Dark mode toggled via ThemeToggle in Navbar (light / dark / system)
- `[data-theme='dark']` on `<html>` drives all colour changes via `--hds-*` tokens
- No FOUC on reload
- System preference respected automatically

## User Stories

- As a user, I can toggle dark mode from the Navbar
- As a user, my preference persists across page loads
- As a user, the site respects my OS dark mode preference by default

## Architecture

- **State:** `ThemeProvider` (React context) at `src/components/stripe/ThemeProvider.tsx`
- **Toggle UI:** `ThemeToggle` at `src/components/stripe/ThemeToggle.tsx`
- **Tokens:** `:root[data-theme='dark']` overrides in `src/styles/tokens.css`
- **Anti-flicker:** Inline `<script>` in `src/app/layout.tsx` runs before hydration

## Acceptance Criteria

- Toggling ThemeToggle cycles light → dark → system → light
- Dark theme applies deep navy palette (`#0a2540` base)
- Preference survives full page reload
- System mode updates automatically when OS preference changes
- No flash of unstyled content on load

## Research Findings

See `research/findings.md`. Feature fully built — verification only.

## Open Questions

- Hardcoded hex colours in component CSS Modules not fully audited
