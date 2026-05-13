# Task Brief: T04

**Title:** Megamenu CSS overhaul
**PRD:** mega-menu
**Priority:** must
**Complexity:** 5/10
**Model:** opus
**Wave:** 2
**Feature Issue:** (see tasks.yaml)

---

## Objective

Fix all 6 undefined CSS custom property references in `Megamenu.module.css`, add a `--hds-shadow-*` token family to `tokens.css`, define all new layout classes needed by the panel components (T03), and implement Stripe-fidelity visual design for the dropdown panels. Both files must reach zero undefined `var()` references.

---

## Context

**Parent Feature:** Phase 13 — Mega Menu Navigation

`Megamenu.module.css` currently references 6 CSS custom properties that do not exist in `src/styles/tokens.css`. This means the dropdown has no background, no border, no shadow, and incorrect typography in both light and dark modes. T03 (panel content components) depends on new layout classes defined here — T04 runs in Wave 2 so T03 can use these classes in Wave 3.

This task is part of **Wave 2** — alongside T02. T03 depends on this task.

**IMPORTANT: `src/styles/tokens.css` is in the `require_review` list in config.yaml.** Apply changes additively and carefully. Only add new tokens — do not remove or rename any existing token. After you complete this task, flag for review before merging.

---

## Critical: The 6 Undefined Tokens

Run this check to confirm the problem before starting:
```bash
grep -n 'var(--hds-' src/components/stripe/Megamenu.module.css
```

Current `Megamenu.module.css` references these undefined tokens. Each one must be replaced with a correct mapping:

| Undefined Token | Correct HDS Replacement | Notes |
|-----------------|------------------------|-------|
| `--hds-color-bg` | `--hds-color-surface-bg-quiet` | Panel background in light mode |
| `--hds-color-border` | `--hds-color-surface-border-quiet` | Panel border colour |
| `--hds-color-primary` | `--hds-color-button-primary-bg` | Column header accent colour (`#6c30c0` in light) |
| `--hds-shadow-lg` | `--hds-shadow-lg` | Add this token to `tokens.css` (see below) |
| `--hds-font-weight-med` | `500` | Use literal value — no token exists for this weight |
| `--hds-size-text-xs` | `0.75rem` | Use literal value — `--hds-font-text-xs-size` in tokens.css is `0.875rem` which is too large; column headers use `0.75rem` |

**For `--hds-shadow-lg`:** Add a `--hds-shadow-*` token family to `tokens.css` (see below) then reference `var(--hds-shadow-lg)` in the CSS.

**For `--hds-font-weight-med` and `--hds-size-text-xs`:** Replace with the literal values directly — do not add new token variables for these, as the existing token naming convention uses a different scale.

---

## Token Audit: tokens.css Current State

From `src/styles/tokens.css`, confirmed existing tokens (do NOT change these):

**Spacing tokens available for use in layout:**
- `--hds-space-core-100: 8px`
- `--hds-space-core-150: 12px`
- `--hds-space-core-200: 16px`
- `--hds-space-core-300: 24px`
- `--hds-space-core-400: 32px`
- `--hds-space-core-600: 48px`
- `--hds-space-layout-content-maxWidth: 1264px`
- `--hds-space-layout-content-margin: 20px` (via `--hds-space-core-200`)

**Semantic colour tokens confirmed in light mode (`:root`):**
- `--hds-color-surface-bg-quiet: var(--hds-color-core-neutral-0)` → `#ffffff`
- `--hds-color-surface-bg-subdued: var(--hds-color-core-neutral-25)` → `#f8fafd`
- `--hds-color-surface-border-quiet: var(--hds-color-core-neutral-50)` → `#e5edf5`
- `--hds-color-button-primary-bg: #6c30c0`
- `--hds-color-text-main: #25084a`
- `--hds-color-text-subdued: var(--hds-color-core-neutral-600)` → `#4f566b`
- `--hds-color-nav-bg: var(--hds-color-surface-bg-quiet)`

**Dark mode overrides confirmed in `:root[data-theme='dark']`:**
- `--hds-color-surface-bg-quiet: #061b31`
- `--hds-color-surface-bg-subdued: #0a2540`
- `--hds-color-surface-border-quiet: var(--hds-color-core-neutral-100)` → `#2a2f45`
- `--hds-color-text-main: #f8fafd`
- `--hds-color-nav-bg: var(--hds-color-surface-bg-quiet)`

**NOT in tokens.css (must be added):**
- `--hds-shadow-sm`, `--hds-shadow-md`, `--hds-shadow-lg`, `--hds-shadow-xl`

---

## Requirements

### Part 1: Add shadow tokens to `src/styles/tokens.css`

Add the following block inside the `:root {}` block, after the existing `--hds-space-core-radius-*` tokens (around line 46):

```css
/* HDS Shadow Tokens */
--hds-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
--hds-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06);
--hds-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.05);
--hds-shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.10), 0 10px 10px rgba(0, 0, 0, 0.04);
```

Add dark mode overrides inside `:root[data-theme='dark'] {}` (after the existing overrides, before the closing `}`):

```css
/* Shadow Overrides (dark) */
--hds-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.30), 0 1px 2px rgba(0, 0, 0, 0.25);
--hds-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.28), 0 2px 4px rgba(0, 0, 0, 0.25);
--hds-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.32), 0 4px 6px rgba(0, 0, 0, 0.22);
--hds-shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.38), 0 10px 10px rgba(0, 0, 0, 0.20);
```

### Part 2: Overhaul `src/components/stripe/Megamenu.module.css`

Replace the entire file with the implementation below. This fixes all 6 undefined tokens and adds all new layout classes.

**Full replacement content:**

```css
/* ── Dropdown wrapper ─────────────────────────────────── */
.dropdownWrapper {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  perspective: 1000px;
  z-index: 999;
}

/* ── Dropdown container ───────────────────────────────── */
.dropdownContainer {
  position: relative;
  width: 100%;
  max-width: calc(var(--hds-space-layout-content-maxWidth, 1264px) + 2px);
  background-color: var(--hds-color-surface-bg-quiet);
  border: 1px solid var(--hds-color-surface-border-quiet);
  border-radius: var(--hds-space-core-radius-lg);
  box-shadow: var(--hds-shadow-lg);
  overflow: hidden;
  transform-origin: top center;
  transition: width 0.3s ease, height 0.3s ease;
  margin-top: var(--hds-space-core-300);
}

/* ── Dropdown content ─────────────────────────────────── */
.dropdownContent {
  padding: var(--hds-space-core-600);
}

/* ── Arrow pointer ────────────────────────────────────── */
.arrow {
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 12px;
  height: 12px;
  background-color: var(--hds-color-surface-bg-quiet);
  border-left: 1px solid var(--hds-color-surface-border-quiet);
  border-top: 1px solid var(--hds-color-surface-border-quiet);
}

/* ── Legacy pane (keep for safety during transition) ──── */
.pane {
  display: flex;
  gap: var(--hds-space-core-800);
  white-space: nowrap;
}

/* ── Panel section wrapper ───────────────────────────── */
.section {
  width: 100%;
}

/* ── Column grid ─────────────────────────────────────── */
.columnGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--hds-space-core-400);
  align-items: start;
}

/* ── Single column ───────────────────────────────────── */
.column {
  display: flex;
  flex-direction: column;
  gap: var(--hds-space-core-100);
}

/* ── Column header ───────────────────────────────────── */
.columnHeader {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--hds-color-button-primary-bg);
  margin: 0 0 var(--hds-space-core-100) 0;
  padding-bottom: var(--hds-space-core-100);
  border-bottom: 1px solid var(--hds-color-surface-border-quiet);
}

/* ── Column separator ────────────────────────────────── */
.columnSeparator {
  border: none;
  border-top: 1px solid var(--hds-color-surface-border-quiet);
  margin: var(--hds-space-core-100) 0;
}

/* ── Nav link (sub-link item) ────────────────────────── */
.navLink {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--hds-space-core-100) var(--hds-space-core-100);
  border-radius: var(--hds-space-core-radius-md);
  text-decoration: none;
  transition: background-color 0.15s ease;
}

.navLink:hover {
  background-color: var(--hds-color-surface-bg-subdued);
}

/* ── Nav link title ──────────────────────────────────── */
.navLinkTitle {
  font-size: var(--hds-font-text-xs-size, 0.875rem);
  font-weight: 500;
  color: var(--hds-color-text-main);
  line-height: 1.3;
}

/* ── Nav link descriptor ─────────────────────────────── */
.navLinkDescriptor {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--hds-color-text-subdued);
  line-height: 1.4;
}

/* ── Featured card ───────────────────────────────────── */
.featuredCard {
  display: flex;
  flex-direction: column;
  gap: var(--hds-space-core-150);
  padding: var(--hds-space-core-200);
  background-color: var(--hds-color-surface-bg-subdued);
  border-radius: var(--hds-space-core-radius-lg);
  border: 1px solid var(--hds-color-surface-border-quiet);
}

/* ── Featured card image ─────────────────────────────── */
.featuredCardImage {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: var(--hds-space-core-radius-md);
}

/* ── Featured card body ──────────────────────────────── */
.featuredCardBody {
  display: flex;
  flex-direction: column;
  gap: var(--hds-space-core-50);
  flex: 1;
}

/* ── Featured card title ─────────────────────────────── */
.featuredCardTitle {
  font-size: var(--hds-font-text-xs-size, 0.875rem);
  font-weight: 500;
  color: var(--hds-color-text-main);
  margin: 0;
}

/* ── Featured card description ───────────────────────── */
.featuredCardDescription {
  font-size: 0.75rem;
  color: var(--hds-color-text-subdued);
  margin: 0;
  white-space: pre-line;
}

/* ── Featured card CTA ───────────────────────────────── */
.featuredCardCta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--hds-color-button-primary-bg);
  text-decoration: none;
  margin-top: auto;
  transition: opacity 0.15s ease;
}

.featuredCardCta:hover {
  opacity: 0.75;
}

/* ── Legacy classes (placeholder era — keep until T03 removes usages) */
.sectionTitle {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--hds-color-button-primary-bg);
  margin-bottom: var(--hds-space-core-300);
  font-weight: 500;
}

.list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--hds-space-core-200);
}

.list li {
  font-size: var(--hds-font-text-xs-size, 0.875rem);
  font-weight: 500;
  opacity: 0.8;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.list li:hover {
  opacity: 1;
}

/* ── Dark mode overrides ─────────────────────────────── */
[data-theme='dark'] .dropdownContainer {
  background-color: var(--hds-color-surface-bg-quiet);
  border-color: var(--hds-color-surface-border-quiet);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

[data-theme='dark'] .arrow {
  background-color: var(--hds-color-surface-bg-quiet);
  border-color: var(--hds-color-surface-border-quiet);
}

[data-theme='dark'] .featuredCard {
  background-color: var(--hds-color-surface-bg-subdued);
  border-color: var(--hds-color-surface-border-quiet);
}

[data-theme='dark'] .columnHeader {
  color: var(--hds-color-core-primary-400);
}

[data-theme='dark'] .featuredCardCta {
  color: var(--hds-color-core-primary-400);
}
```

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] Zero undefined `var()` references in `Megamenu.module.css` — verify with: `grep 'var(--hds-' src/components/stripe/Megamenu.module.css` and cross-check every `--hds-*` name against `tokens.css`
- [ ] `--hds-shadow-sm`, `--hds-shadow-md`, `--hds-shadow-lg`, `--hds-shadow-xl` defined in `:root {}` in `tokens.css`
- [ ] Dark mode shadow overrides defined in `:root[data-theme='dark'] {}` in `tokens.css`
- [ ] `.section` class defined in `Megamenu.module.css`
- [ ] `.columnGrid` class defined with `display: grid`
- [ ] `.columnHeader` class defined
- [ ] `.navLink`, `.navLinkTitle`, `.navLinkDescriptor` classes defined
- [ ] `.featuredCard`, `.featuredCardImage`, `.featuredCardBody`, `.featuredCardCta` classes defined
- [ ] `.dropdownContainer` uses `var(--hds-color-surface-bg-quiet)` not `var(--hds-color-bg)`
- [ ] `backdrop-filter: blur()` present in `[data-theme='dark'] .dropdownContainer` rule
- [ ] Panel max-width 1264px on `.dropdownContainer`
- [ ] `npm run lint` passes

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/stripe/Megamenu.module.css` | modify | Fix 6 undefined tokens; add all new layout classes |
| `src/styles/tokens.css` | modify | Add `--hds-shadow-*` token family with dark mode overrides |

### File Ownership Notes

`src/styles/tokens.css` is marked `require_review` in config.yaml. Changes must be reviewed before merging. Only add tokens — do not remove or rename any existing token. The shadow token block is purely additive.

No other task touches `Megamenu.module.css` or `tokens.css`.

---

## Implementation Guidance

### Token Resolution Process

Before writing any code, run these two greps to understand the full scope:

```bash
# Find all undefined token references
grep -n 'var(--hds-' src/components/stripe/Megamenu.module.css

# Check which tokens actually exist in tokens.css
grep -n '^\s*--hds-' src/styles/tokens.css | grep -v ':' | head -60
```

### Where to Insert Shadow Tokens in tokens.css

Insert the `/* HDS Shadow Tokens */` block immediately after the `--hds-space-core-radius-*` block (currently ends around line 46). Do not move any existing declarations. The file currently ends at line 209 — the dark mode shadow overrides go at the bottom of the `:root[data-theme='dark'] {}` block, before its closing `}`.

### CSS Grid Column Layout for Panels

The `.columnGrid` uses `repeat(auto-fit, minmax(160px, 1fr))` so it adapts to panels with different numbers of columns (1 column for Contact Us, 4+ for Community). The featured card always occupies the rightmost column because T03 renders it last in the grid.

For panels where you want more explicit column control, T03 can add inline `style` overrides — but do not add panel-specific CSS classes in T04.

### Dark Mode: Why backdrop-filter?

The dark nav panel uses `backdrop-filter: blur(20px)` to create a frosted glass effect consistent with the dark navbar background. The `--hds-color-surface-bg-quiet` in dark mode is `#061b31` (deep navy). Combined with backdrop blur, panels feel layered without being fully opaque.

`-webkit-backdrop-filter` is required for Safari support.

### No Hardcoded Hex Colours

The only hardcoded values in the CSS should be:
- `0.75rem` (font size for xs text — no token exists for this specific size)
- `500` (font weight — no `--hds-font-weight-med` token exists)
- `2px` (gap value — below the smallest space token `--hds-space-core-25: 2px`, can use the token instead)
- Shadow rgba values (these are the shadow definitions themselves in tokens.css)

All surface colours, border colours, and text colours must use `var(--hds-*)` references.

---

## Boundaries

### Files You MUST NOT Touch

- `package-lock.json`
- `.env` / `.env*`
- `src/sanity/lib/client.ts`
- `src/middleware.ts`
- `src/components/stripe/Navbar.tsx`
- `src/components/stripe/Navbar.module.css`
- `src/components/stripe/Megamenu.tsx`
- `src/styles/globals.css`

### Files Requiring Review

**`src/styles/tokens.css` requires review before merge.** Flag this PR for review with the note: "tokens.css — additive shadow token addition only, no existing tokens modified."

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|------------------|------------------------|
| T01 | `src/lib/nav-data.ts` exists | Check file exists — not directly imported but confirms project is progressing correctly |

### Downstream Impact

Tasks that depend on this one: **T03** (panel content uses CSS classes defined here)

T03 cannot render correctly until all layout classes (`.columnGrid`, `.navLink`, `.featuredCard`, etc.) are defined.

---

## GitHub Context

**Branch:** `worktree/mega-menu-T04`
**Target:** main

---

## Commit Guidelines

```
fix(megamenu): resolve 6 undefined HDS tokens, add layout classes and shadow tokens

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:
- [ ] All success criteria met
- [ ] `npm run build` passes
- [ ] `npx tsc --noEmit` passes (CSS changes don't affect TS, but confirms no regressions)
- [ ] `npm run lint` passes
- [ ] No `never_touch` files modified
- [ ] No existing tokens removed or renamed in `tokens.css`
- [ ] PR description notes that `tokens.css` change is additive shadow tokens only
- [ ] Flagged for review (require_review policy)

---

*Generated by KARIMO Brief Writer*
*PRD: mega-menu | Task: T04 | Wave: 2*
