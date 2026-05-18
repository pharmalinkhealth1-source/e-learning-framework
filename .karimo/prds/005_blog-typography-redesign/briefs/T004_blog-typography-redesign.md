# Brief: Redesign body copy, lead, H2, and add H3 rule in BlogPostDetail.module.css

**Task ID:** T004
**PRD:** blog-typography-redesign (005)
**Wave:** 2
**Model:** sonnet
**Complexity:** 3

## Objective

Reduce article body copy from 20px to 17px, reduce the lead paragraph from 24px to 20px, reduce H2 section headings and tighten their margins, and add a missing `.content h3` rule that PortableText may emit but the stylesheet does not currently style.

## Files to Modify

- `src/app/blog/BlogPostDetail.module.css`

## Context

Current state of the relevant selectors (from reading the file):

**`.lead` (lines 223–230):**
```css
.lead {
  font-size: 1.5rem;        /* 24px — too large */
  line-height: 1.5;
  color: var(--hds-color-text-primary);
  font-weight: 500;          /* weight 500 not loaded — silently renders as 400 */
  margin-bottom: 48px;
  letter-spacing: -0.02em;
}
```

**`.content` (lines 215–222):**
```css
.content {
  font-family: var(--hds-font-sans);   /* undefined — fixed by T002 */
  font-size: 1.25rem;                   /* 20px — too large */
  line-height: 1.7;
  color: var(--hds-color-text-primary);
  max-width: 720px;
}
```

**`.content p` (lines 232–234):**
```css
.content p {
  margin-bottom: 32px;   /* too loose */
}
```

**`.content h2` (lines 236–242):**
```css
.content h2 {
  font-size: 2.25rem;    /* 36px — too large */
  font-weight: 700;       /* renders as 400 until T001 */
  margin: 80px 0 32px;   /* excessive top margin */
  letter-spacing: -0.04em;
  line-height: 1.1;
}
```

**`.content h3`:** Does not exist. PortableText may emit `<h3>` tags that receive no styling at all.

The `max-width: 720px` on `.content` is intentional and must not change. The `line-height: 1.7` on `.content` is also correct — keep it.

All `font-weight: 500` values are a bug — weight 500 is not loaded and renders as 400. Convert to 400 (body context) or 600 (heading context).

## Implementation

1. Read `src/app/blog/BlogPostDetail.module.css` in full before editing.

2. Update `.lead`:
   ```css
   .lead {
     font-size: 20px;
     line-height: 1.5;
     color: var(--hds-color-text-primary);
     font-weight: 400;        /* was 500 — convert */
     margin-bottom: 48px;
     letter-spacing: -0.01em; /* was -0.02em — slightly loosened */
   }
   ```

3. Update `.content` (change only `font-size` and `font-family`; leave all other properties):
   ```css
   .content {
     font-family: var(--hds-font-family);  /* was --hds-font-sans, may already be fixed by T002 */
     font-size: 17px;                        /* was 1.25rem */
     line-height: 1.7;                       /* keep */
     color: var(--hds-color-text-primary);   /* keep */
     max-width: 720px;                       /* keep — do not change */
   }
   ```

4. Update `.content p`:
   ```css
   .content p {
     margin-bottom: 24px;   /* was 32px */
   }
   ```

5. Update `.content h2`:
   ```css
   .content h2 {
     font-size: 24px;          /* was 2.25rem / 36px */
     font-weight: 600;          /* was 700 */
     line-height: 1.2;          /* was 1.1 — slightly open */
     letter-spacing: -0.01em;   /* was -0.04em */
     margin: 48px 0 16px;       /* was 80px 0 32px */
   }
   ```

6. Add a new `.content h3` rule directly after `.content h2`. It does not currently exist — insert it:
   ```css
   .content h3 {
     font-size: 19px;
     font-weight: 600;
     line-height: 1.3;
     letter-spacing: -0.01em;
     margin: 32px 0 12px;
   }
   ```

7. Confirm no `rem` units remain in `.lead`, `.content`, `.content p`, `.content h2`, or the new `.content h3`.

## Validation

- `.lead` is `font-size: 20px`, `font-weight: 400`, `letter-spacing: -0.01em`
- `.content` is `font-size: 17px`; `max-width: 720px` is unchanged; `line-height: 1.7` is unchanged
- `.content p` is `margin-bottom: 24px`
- `.content h2` is `font-size: 24px`, `font-weight: 600`, `margin: 48px 0 16px`, `letter-spacing: -0.01em`
- `.content h3` rule exists with `font-size: 19px`, `font-weight: 600`, `margin: 32px 0 12px`
- No `rem` units in any of the above selectors
- `npx tsc --noEmit` passes

## Dependencies

- T001 must complete first — weight 600 on h2/h3 must load correctly
- T002 must complete first — `--hds-font-sans` on `.content` must resolve to a valid token
