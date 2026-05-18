# Brief: Update layout, hero image, cards, related section, and sidebar share in BlogPostDetail.module.css

**Task ID:** T006
**PRD:** blog-typography-redesign (005)
**Wave:** 2
**Model:** sonnet
**Complexity:** 3

## Objective

Replace the fixed-height hero image with an aspect-ratio layout, reduce border-radii on the hero and related cards to 8px, tokenize the container max-width, reduce the related section title, and remove the decorative rotation from the sidebar share label.

## Files to Modify

- `src/app/blog/BlogPostDetail.module.css`

## Context

Current state of the affected selectors (from reading the file):

**`.container` (lines 11–15):**
```css
.container {
  max-width: 1000px;   /* hardcoded — should use token */
  margin: 0 auto;
  padding: 0 24px;
}
```

**`.heroImageContainer` (lines 139–147):**
```css
.heroImageContainer {
  width: 100%;
  height: 560px;           /* fixed height — replace with aspect-ratio */
  position: relative;
  border-radius: 32px;     /* too decorative */
  overflow: hidden;
  margin-bottom: 80px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12);  /* heavy shadow — remove */
}
```

There is a media query override at `@media (max-width: 768px)` that sets `.heroImageContainer { height: 340px; border-radius: 20px; }`. Both of these overrides must be removed since the main rule switches to `aspect-ratio`.

**`.relatedCard` (lines 265–274):**
```css
.relatedCard {
  background: var(--hds-color-bg-primary);  /* fixed by T002 */
  border-radius: 24px;    /* too decorative */
  overflow: hidden;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--hds-color-border-subtle);  /* fixed by T002 */
  display: flex;
  flex-direction: column;
}
```

**`.relatedCard:hover` (lines 276–280):**
```css
.relatedCard:hover {
  transform: translateY(-8px);   /* bouncy — remove */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border-color: var(--hds-color-accent-primary);   /* fixed by T002 */
}
```

**`.relatedTitle` (lines 251–257):**
```css
.relatedTitle {
  font-size: 2.5rem;      /* 40px — too large */
  font-weight: 700;
  letter-spacing: -0.04em;
  margin-bottom: 48px;
  color: var(--hds-color-text-primary);
}
```

**`.shareTitle` (lines 177–186):**
```css
.shareTitle {
  font-size: 0.65rem;
  font-weight: 800;        /* weight 800 not loaded */
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--hds-color-text-secondary);
  transform: rotate(-90deg);   /* decorative rotation — remove */
  margin-bottom: 20px;
  white-space: nowrap;
}
```

Note: The `@media (max-width: 900px)` block already removes the sidebar rotation with `transform: none` on `.shareTitle`. When you remove `transform: rotate(-90deg)` from the base rule, the media query override becomes redundant but leave it in place — it causes no harm and its removal is not in scope.

## Implementation

1. Read `src/app/blog/BlogPostDetail.module.css` in full before editing.

2. Update `.container`:
   ```css
   .container {
     max-width: var(--hds-space-layout-content-maxWidth);
     margin: 0 auto;
     padding: 0 24px;
   }
   ```

3. Update `.heroImageContainer` — switch from fixed height to aspect-ratio:
   ```css
   .heroImageContainer {
     width: 100%;
     aspect-ratio: 16 / 9;
     position: relative;
     border-radius: 8px;
     overflow: hidden;
     margin-bottom: 80px;
   }
   ```
   Remove `height: 560px` and `box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12)`.

4. In the `@media (max-width: 768px)` block, locate the `.heroImageContainer` override:
   ```css
   .heroImageContainer {
     height: 340px;
     border-radius: 20px;
   }
   ```
   Remove this entire block (both properties). The aspect-ratio on the base rule handles all viewports. Keep the rest of the 768px media query block intact.

5. Update `.relatedCard`:
   ```css
   .relatedCard {
     background: var(--hds-color-surface-bg-quiet);    /* already updated by T002 */
     border-radius: 8px;    /* was 24px */
     overflow: hidden;
     text-decoration: none;
     transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
     border: 1px solid var(--hds-color-surface-border-quiet);  /* already updated by T002 */
     display: flex;
     flex-direction: column;
   }
   ```

6. Update `.relatedCard:hover` — remove `translateY`:
   ```css
   .relatedCard:hover {
     box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
     border-color: var(--hds-color-util-brand-500);  /* already updated by T002 */
   }
   ```
   Remove `transform: translateY(-8px)` entirely.

7. Update `.relatedTitle`:
   ```css
   .relatedTitle {
     font-size: 28px;           /* was 2.5rem / 40px */
     font-weight: 600;          /* was 700 */
     letter-spacing: -0.02em;   /* was -0.04em */
     margin-bottom: 48px;
     color: var(--hds-color-text-primary);
   }
   ```

8. Update `.shareTitle`:
   ```css
   .shareTitle {
     font-size: 12px;           /* was 0.65rem */
     font-weight: 500;          /* was 800 */
     color: var(--hds-color-text-secondary);
     margin-bottom: 20px;
     white-space: nowrap;
   }
   ```
   Remove `text-transform: uppercase`, `letter-spacing: 0.1em`, and `transform: rotate(-90deg)`.

9. Confirm no `rem` units remain in any of the above selectors.

## Validation

- `.container` uses `max-width: var(--hds-space-layout-content-maxWidth)` — no hardcoded `1000px`
- `.heroImageContainer` has `aspect-ratio: 16 / 9`; has no `height` property; has `border-radius: 8px`; has no `box-shadow`
- No `.heroImageContainer` override in the `@media (max-width: 768px)` block
- `.relatedCard` has `border-radius: 8px`
- `.relatedCard:hover` has no `transform` property
- `.relatedTitle` is `font-size: 28px`, `font-weight: 600`, `letter-spacing: -0.02em`
- `.shareTitle` has no `transform` property; has no `text-transform`; `font-weight: 500`; `font-size: 12px`
- `npx tsc --noEmit` passes

## Dependencies

- T001 must complete first — weight 600 on `.relatedTitle` must load correctly
- T002 must complete first — token names on `.container`, `.relatedCard`, `.shareTitle` must be valid
