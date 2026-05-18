# Brief: Simplify category badge and normalize meta row in BlogPostDetail.module.css

**Task ID:** T005
**PRD:** blog-typography-redesign (005)
**Wave:** 2
**Model:** sonnet
**Complexity:** 2

## Objective

Strip the over-designed pill style from `.categoryBadge` and normalize the author/role/date/tag meta elements to a consistent 14px/13px size hierarchy with no uppercase transforms.

## Files to Modify

- `src/app/blog/BlogPostDetail.module.css`

## Context

Current state of the affected selectors (from reading the file):

**`.categoryBadge` (lines 40–52):**
```css
.categoryBadge {
  display: inline-block;
  padding: 6px 14px;
  background: var(--hds-color-bg-tertiary);      /* pill background — remove */
  color: var(--hds-color-accent-primary);
  border-radius: 100px;                            /* pill shape — remove */
  font-size: 0.7rem;                               /* ~11px */
  font-weight: 700;
  text-transform: uppercase;                       /* remove */
  letter-spacing: 0.08em;                          /* remove positive tracking */
  margin-bottom: 24px;
  border: 1px solid var(--hds-color-border-subtle); /* pill border — remove */
}
```

Note: After T002 runs, `--hds-color-bg-tertiary` becomes `--hds-color-core-neutral-50` and `--hds-color-border-subtle` becomes `--hds-color-surface-border-quiet`. The `background` and `border` properties are being removed entirely in this task, so their token names do not matter.

**`.authorName` (lines 105–109):** `font-size: 1.05rem` (~17px), `font-weight: 600` — correct weight, wrong size.

**`.authorRole` (lines 111–115):** `font-size: 0.8rem` (~13px), `font-weight: 500` — weight 500 not loaded.

**`.publishLabel` (lines 124–131):** `font-size: 0.7rem` (~11px), `font-weight: 700`, `text-transform: uppercase`, `letter-spacing: 0.05em` — all decorative, remove.

**`.publishDate` (lines 133–137):** `font-size: 0.95rem` (~15px), `font-weight: 500` — weight 500 not loaded.

**`.relatedTag` (lines 298–306):** `font-size: 0.65rem` (~10px), `font-weight: 700`, `text-transform: uppercase` — oversized tracking, remove decorative treatment.

All `font-weight: 500` and `font-weight: 700` on non-heading elements are being normalized: body-context elements go to 400, label elements to 500 where appropriate.

## Implementation

1. Read `src/app/blog/BlogPostDetail.module.css` in full before editing.

2. Update `.categoryBadge` — remove decorative pill, keep position and color:
   ```css
   .categoryBadge {
     display: inline-block;
     font-size: 13px;
     font-weight: 500;
     letter-spacing: 0;
     color: var(--hds-color-util-brand-500);  /* use valid token from T002 */
     margin-bottom: 24px;
   }
   ```
   Remove `padding: 6px 14px`, `background`, `border-radius: 100px`, `text-transform: uppercase`, `letter-spacing: 0.08em`, and `border`.
   Keep `display: inline-block` and `margin-bottom: 24px`.

3. Update `.authorName`:
   ```css
   .authorName {
     font-weight: 600;
     color: var(--hds-color-text-primary);
     font-size: 14px;   /* was 1.05rem */
   }
   ```

4. Update `.authorRole`:
   ```css
   .authorRole {
     color: var(--hds-color-text-secondary);
     font-size: 13px;    /* was 0.8rem */
     font-weight: 400;   /* was 500 — convert */
   }
   ```

5. Update `.publishLabel`:
   ```css
   .publishLabel {
     font-size: 13px;           /* was 0.7rem */
     color: var(--hds-color-text-secondary);
     font-weight: 400;          /* was 700 */
     margin-bottom: 4px;
   }
   ```
   Remove `text-transform: uppercase` and `letter-spacing: 0.05em`.

6. Update `.publishDate`:
   ```css
   .publishDate {
     color: var(--hds-color-text-primary);
     font-size: 13px;    /* was 0.95rem */
     font-weight: 400;   /* was 500 — convert */
   }
   ```

7. Update `.relatedTag`:
   ```css
   .relatedTag {
     font-size: 12px;                           /* was 0.65rem */
     font-weight: 500;                          /* was 700 */
     color: var(--hds-color-util-brand-500);   /* valid token from T002 */
     margin-bottom: 12px;
     display: block;
   }
   ```
   Remove `text-transform: uppercase` and `letter-spacing: 0.05em`.

8. Confirm no `rem` units remain in any of the above selectors.

## Validation

- `.categoryBadge` has no `background`, `border`, or `border-radius` property; `font-size: 13px`; `font-weight: 500`; no `text-transform`
- `.authorName` is `font-size: 14px`
- `.authorRole` is `font-size: 13px`, `font-weight: 400`
- `.publishLabel` is `font-size: 13px`, `font-weight: 400`, no `text-transform`, no `letter-spacing`
- `.publishDate` is `font-size: 13px`, `font-weight: 400`
- `.relatedTag` is `font-size: 12px`, `font-weight: 500`, no `text-transform`
- No `rem` units in any of the above selectors
- `npx tsc --noEmit` passes

## Dependencies

- T001 must complete first — font-weight behavior must be stable before normalizing weight values
- T002 must complete first — token names must be valid before this task edits selectors that use them
