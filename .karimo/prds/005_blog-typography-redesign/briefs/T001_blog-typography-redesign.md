# Brief: Add IBM Plex Sans weight 600 import to globals.css

**Task ID:** T001
**PRD:** blog-typography-redesign (005)
**Wave:** 1
**Model:** sonnet
**Complexity:** 1

## Objective

Add the IBM Plex Sans 600-weight font import to `globals.css` so that all existing `font-weight: 600` and `font-weight: 700` declarations across the site render correctly instead of silently falling back to 400.

## Files to Modify

- `src/styles/globals.css`

## Context

`globals.css` currently imports IBM Plex Sans at weights 300 and 400 only:

```css
@import '@fontsource/ibm-plex-sans/300.css';
@import '@fontsource/ibm-plex-sans/400.css';
```

Every `font-weight: 600` or `font-weight: 700` declaration in the codebase silently renders as 400 because the browser has no heavier weight to fall back to. This affects heading weight contrast across all blog pages and potentially across the entire site. The `@fontsource/ibm-plex-sans` package is already installed — no npm install is required.

This is a **require_review** file. Flag this change explicitly in the PR description as a global-scope font-loading change. The change is strictly additive and has no expected visual regressions beyond making headings appear bolder (as intended).

Do NOT add weight 500 or 700. Weight 600 is sufficient and is the only weight being enabled by this PRD.

## Implementation

1. Read `src/styles/globals.css` in full before editing to confirm the current import order.
2. Locate the line `@import '@fontsource/ibm-plex-sans/400.css';` (line 2).
3. Add exactly one new line immediately after it:
   ```css
   @import '@fontsource/ibm-plex-sans/600.css';
   ```
4. The resulting import block at the top of the file must read:
   ```css
   @import '@fontsource/ibm-plex-sans/300.css';
   @import '@fontsource/ibm-plex-sans/400.css';
   @import '@fontsource/ibm-plex-sans/600.css';
   @import '@fontsource/ibm-plex-sans/400-italic.css';  /* only if present */
   @import '@fontsource/ibm-plex-mono/400.css';
   ```
   (The mono and any italic imports stay in their original positions — do not reorder them.)
5. Do not change any other line in the file.

## Validation

- `src/styles/globals.css` contains `@import '@fontsource/ibm-plex-sans/600.css'`
- No other lines in `globals.css` were modified
- `npx tsc --noEmit` exits with no errors
- In the browser, a heading element with `font-weight: 600` visibly renders heavier than body text with `font-weight: 400`

## Dependencies

None — this task has no upstream dependencies and can start immediately.
