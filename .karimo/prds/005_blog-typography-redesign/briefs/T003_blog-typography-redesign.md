# Brief: Redesign article H1 title typography in BlogPostDetail.module.css

**Task ID:** T003
**PRD:** blog-typography-redesign (005)
**Wave:** 2
**Model:** sonnet
**Complexity:** 2

## Objective

Update the `.title` selector in `BlogPostDetail.module.css` to match Stripe newsroom H1 conventions: reduced clamp ceiling, corrected line-height, reduced letter-spacing, and weight 600.

## Files to Modify

- `src/app/blog/BlogPostDetail.module.css`

## Context

The current `.title` rule (lines 54–62 of `BlogPostDetail.module.css`) reads:

```css
.title {
  font-family: var(--hds-font-sans);      /* undefined — fixed by T002 */
  font-size: clamp(2.5rem, 5vw, 4rem);   /* 40px–64px — too large */
  font-weight: 700;                        /* renders as 400 until T001 lands */
  line-height: 1.05;                       /* too tight */
  color: var(--hds-color-text-primary);
  margin-bottom: 48px;
  letter-spacing: -0.05em;               /* over-compressed */
}
```

There is also a media query override at `@media (max-width: 768px)` that sets `.title { font-size: 2.75rem; }`. This must be updated to a px value to match the standardization requirement.

After T001 lands, `font-weight: 600` will render correctly. After T002 lands, `font-family: var(--hds-font-family)` will resolve correctly (T002 renames `--hds-font-sans` to `--hds-font-family` — if T002 has already run, the `font-family` line will already be correct; leave it as-is if so).

The target aligns with the Stripe newsroom benchmark: display-size H1 with a tighter clamp ceiling (52px max), less optical compression (-0.02em), and slightly open line-height (1.12).

## Implementation

1. Read `src/app/blog/BlogPostDetail.module.css` in full before editing.
2. Locate the `.title` rule and update these properties only:

   | Property | Current value | New value |
   |---|---|---|
   | `font-size` | `clamp(2.5rem, 5vw, 4rem)` | `clamp(36px, 5vw, 52px)` |
   | `font-weight` | `700` | `600` |
   | `line-height` | `1.05` | `1.12` |
   | `letter-spacing` | `-0.05em` | `-0.02em` |
   | `font-family` | `var(--hds-font-sans)` | `var(--hds-font-family)` (only if not already fixed by T002) |

3. Do not change `color`, `margin-bottom`, or any other property on `.title`.
4. Locate the `@media (max-width: 768px)` block. It contains `.title { font-size: 2.75rem; }`. Update that to:
   ```css
   .title { font-size: clamp(28px, 7vw, 36px); }
   ```
   This keeps the mobile experience proportional while removing rem units.
5. Confirm no rem units remain in any `.title` rule or media query override for `.title`.

## Validation

- `.title` `font-size` is `clamp(36px, 5vw, 52px)`
- `.title` `line-height` is `1.12`
- `.title` `letter-spacing` is `-0.02em`
- `.title` `font-weight` is `600`
- No `rem` units appear in any `.title` selector or `.title` media query override
- `color`, `margin-bottom` on `.title` are unchanged
- `npx tsc --noEmit` passes

## Dependencies

- T001 must complete first — weight 600 must be loaded before this change has visible effect
- T002 must complete first — `--hds-font-sans` token must be replaced before font-family resolves correctly
