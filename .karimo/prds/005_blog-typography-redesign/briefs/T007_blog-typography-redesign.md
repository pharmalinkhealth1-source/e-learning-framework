# Brief: Redesign listing card titles and featured post title in Blog.module.css

**Task ID:** T007
**PRD:** blog-typography-redesign (005)
**Wave:** 3
**Model:** sonnet
**Complexity:** 2

## Objective

Reduce standard listing card titles from 38px to 22px and the featured post title from 38px to 32px, correct letter-spacing, and fix font-weight to 600 across all breakpoints.

## Files to Modify

- `src/app/blog/Blog.module.css`

## Context

The current `.BlogIndexPost__title` rules span three breakpoint contexts (from reading the file):

**Base rule (lines 248–258) — applies at all sizes as default, overridden at 900px+ for desktop:**
```css
.BlogIndexPost__title {
  grid-area: title;
  --titlePaddingLeft: 0;
  --titlePaddingRight: var(--columnPaddingLarge);
  font-weight: 700;
  font-size: 38px;
  line-height: 48px;
  letter-spacing: -0.2px;
  color: var(--titleColor);
  margin-top: 16px;
  margin-bottom: 16px;
  padding-left: var(--titlePaddingLeft);
}
```

**`@media (min-width: 600px)` — featured variant override (lines 263–269):**
```css
.BlogIndexPost--variantFeatured .BlogIndexPost__title {
  font-size: 38px;
  line-height: 48px;
  font-weight: 500;
  letter-spacing: -1.2px;
  margin: 0;
}
```

**`@media (max-width: 600px)` — mobile override (lines 271–275):**
```css
.BlogIndexPost__title {
  font-size: 28px;
  line-height: 36px;
}
```

The base rule at 38px affects all standard listing cards at desktop. The featured variant override also sits at 38px with over-compressed `-1.2px` letter-spacing and `font-weight: 500` (weight 500 is not loaded — renders as 400). The mobile override at 28px also needs reduction.

`line-height: 48px` on the base rule is fine proportionally at 38px (1.26 ratio). At 22px the `line-height` should be re-evaluated — set `line-height: 1.3` in ratio form to be robust across sizes.

## Implementation

1. Read `src/app/blog/Blog.module.css` in full before editing.

2. Update the base `.BlogIndexPost__title` rule — change `font-size`, `font-weight`, `letter-spacing`, and `line-height`. Leave all other properties (grid-area, padding, color, margin, custom properties) unchanged:
   ```css
   .BlogIndexPost__title {
     grid-area: title;
     --titlePaddingLeft: 0;
     --titlePaddingRight: var(--columnPaddingLarge);
     font-weight: 600;       /* was 700 */
     font-size: 22px;        /* was 38px */
     line-height: 1.3;       /* was 48px — switch to unitless ratio */
     letter-spacing: -0.01em; /* was -0.2px — standardize to em */
     color: var(--titleColor);
     margin-top: 16px;
     margin-bottom: 16px;
     padding-left: var(--titlePaddingLeft);
   }
   ```

3. Update the featured variant override inside `@media (min-width: 600px)`:
   ```css
   .BlogIndexPost--variantFeatured .BlogIndexPost__title {
     font-size: 32px;          /* was 38px */
     line-height: 1.25;        /* was 48px */
     font-weight: 600;         /* was 500 — weight 500 not loaded */
     letter-spacing: -0.02em;  /* was -1.2px ≈ -0.032em at 38px — over-compressed */
     margin: 0;
   }
   ```

4. Update the mobile override inside `@media (max-width: 600px)`:
   ```css
   .BlogIndexPost__title {
     font-size: 22px;   /* was 28px — listing titles same scale mobile/desktop */
     line-height: 1.3;  /* was 36px */
   }
   ```

5. Do not change `line-height` on any other selectors. Do not change the non-featured `.BlogIndexPost__title` padding-left override in the `@media (min-width: 600px)` block (`--titlePaddingLeft: 16px`) — leave it untouched.

## Validation

- Base `.BlogIndexPost__title` is `font-size: 22px`, `font-weight: 600`, `letter-spacing: -0.01em`
- Featured variant override (`@media (min-width: 600px)`) is `font-size: 32px`, `font-weight: 600`, `letter-spacing: -0.02em`
- Mobile override (`@media (max-width: 600px)`) is `font-size: 22px`
- No listing title breakpoint renders above 32px
- `npx tsc --noEmit` passes

## Dependencies

- T001 must complete first — `font-weight: 600` must be a loaded weight before changing the declarations
