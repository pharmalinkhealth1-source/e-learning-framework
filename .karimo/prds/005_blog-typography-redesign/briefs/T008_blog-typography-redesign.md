# Brief: Normalize meta sizes and remove date border decoration in Blog.module.css

**Task ID:** T008
**PRD:** blog-typography-redesign (005)
**Wave:** 3
**Model:** sonnet
**Complexity:** 2

## Objective

Reduce excerpt, author, and date meta text from 15–18px down to 13–15px, strip the decorative left-border pseudo-element from `.BlogPostDate` only, and remove the uppercase transform from `.CopyTitle--variantDetail`.

## Files to Modify

- `src/app/blog/Blog.module.css`

## Context

Current state of the affected selectors (from reading the file):

**`.BlogIndexPost__body` (lines 292–310):**
```css
.BlogIndexPost__body {
  grid-area: body;
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  color: var(--textColor);
  padding: 0 var(--columnPaddingLarge) 0 0;
  margin: 0;
}
@media (min-width: 600px) {
  .BlogIndexPost__body {
    font-size: 18px;
    line-height: 28px;
  }
}
```
The mobile base is already 15px (correct). The 600px+ override bumps it to 18px — that needs reducing to 15px.

**`.CopyTitle--variantDetail` (lines 383–404):**
```css
.CopyTitle--variantDetail {
  --titlePaddingLeft: 16px;
  --titlePaddingRight: var(--columnPaddingMedium);
  font-size: 15px;
  line-height: 1.6;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: var(--accentColor);
  position: relative;
  padding: 0 var(--titlePaddingRight) 0 var(--titlePaddingLeft);
  display: inline-block;
  text-transform: uppercase;    /* remove */
}
.CopyTitle--variantDetail::before {
  content: "";
  position: absolute;
  top: 5px;
  left: 0;
  width: 2px;
  height: 15px;
  background-color: var(--accentColor);
}
```
The `::before` left-border decoration on `.CopyTitle--variantDetail` must be **retained** — it is on-brand. Only remove `text-transform: uppercase` and reduce `font-size` to 13px.

**`.BlogPostDate` (lines 406–425):**
```css
.BlogPostDate {
  font-size: 15px;
  line-height: 1.6;
  color: var(--textColor);
  position: relative;
  padding: 0 var(--columnPaddingNormal) 0 0;
  display: inline-block;
}
.BlogIndexPost:not(.BlogIndexPost--variantFeatured) .BlogPostDate {
  padding-left: 16px;
}
.BlogPostDate::before {
  content: "";
  position: absolute;
  top: 5px;
  left: 0;
  width: 2px;
  height: 15px;
  background-color: var(--accentColor);
}
```
The `::before` on `.BlogPostDate` duplicates the brand-bar decoration from `.CopyTitle--variantDetail`. For dates this is visual noise — remove `.BlogPostDate::before` entirely. The `padding-left: 16px` on the non-featured variant exists as layout spacing; if it was added to compensate for the `::before` bar width visually, consider whether to keep it — keep it, as it's a grid spacing concern separate from the decoration.

**`.BlogAuthor__link` (lines 453–458):**
```css
.BlogAuthor__link {
  font-weight: 600;
  font-size: 15px;
  line-height: 1.6;
  color: var(--titleColor);
}
```

**`.BlogAuthor__role` (lines 459–463):**
```css
.BlogAuthor__role {
  font-weight: 400;
  font-size: 15px;
  line-height: 1.6;
  color: var(--textColor);
}
```

## Implementation

1. Read `src/app/blog/Blog.module.css` in full before editing.

2. Update `.BlogIndexPost__body` desktop override. There are two separate `@media (min-width: 600px)` blocks for `.BlogIndexPost__body` in the file. The first (around line 301) is a padding-left scoped override using `:not(.BlogIndexPost--variantFeatured)` — do not touch it. The second (around line 306) is an unscoped block that sets `font-size: 18px` on `.BlogIndexPost__body` — that is the block to update:
   ```css
   @media (min-width: 600px) {
     .BlogIndexPost__body {
       font-size: 15px;    /* was 18px */
       line-height: 24px;  /* keep — already correct */
     }
   }
   ```

3. Update `.CopyTitle--variantDetail` — reduce font-size and remove uppercase. Leave all other properties including `::before` unchanged:
   ```css
   .CopyTitle--variantDetail {
     --titlePaddingLeft: 16px;
     --titlePaddingRight: var(--columnPaddingMedium);
     font-size: 13px;      /* was 15px */
     line-height: 1.6;
     font-weight: 600;
     letter-spacing: 0.2px;
     color: var(--accentColor);
     position: relative;
     padding: 0 var(--titlePaddingRight) 0 var(--titlePaddingLeft);
     display: inline-block;
   }
   ```
   Remove `text-transform: uppercase`. The `.CopyTitle--variantDetail::before` block stays exactly as-is.

4. Update `.BlogPostDate` — reduce font-size only:
   ```css
   .BlogPostDate {
     font-size: 13px;    /* was 15px */
     line-height: 1.6;
     color: var(--textColor);
     position: relative;
     padding: 0 var(--columnPaddingNormal) 0 0;
     display: inline-block;
   }
   ```

5. Remove the `.BlogPostDate::before` block entirely. Delete these lines:
   ```css
   .BlogPostDate::before {
     content: "";
     position: absolute;
     top: 5px;
     left: 0;
     width: 2px;
     height: 15px;
     background-color: var(--accentColor);
   }
   ```
   Do NOT remove `.CopyTitle--variantDetail::before` — that one stays.

6. Update `.BlogAuthor__link`:
   ```css
   .BlogAuthor__link {
     font-weight: 600;
     font-size: 14px;    /* was 15px */
     line-height: 1.6;
     color: var(--titleColor);
   }
   ```

7. Update `.BlogAuthor__role`:
   ```css
   .BlogAuthor__role {
     font-weight: 400;
     font-size: 13px;    /* was 15px */
     line-height: 1.6;
     color: var(--textColor);
   }
   ```

## Validation

- `.BlogIndexPost__body` at `@media (min-width: 600px)` is `font-size: 15px`
- `.CopyTitle--variantDetail` is `font-size: 13px`; has no `text-transform` property; `::before` block is present and unchanged
- `.BlogPostDate` is `font-size: 13px`; `.BlogPostDate::before` block does not exist in the file
- `.BlogAuthor__link` is `font-size: 14px`
- `.BlogAuthor__role` is `font-size: 13px`
- `npx tsc --noEmit` passes

## Dependencies

- T001 must complete first — font rendering must be stable before finalizing meta sizes
