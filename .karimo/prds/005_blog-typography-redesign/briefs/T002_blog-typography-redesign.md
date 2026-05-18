# Brief: Fix 7 undefined token references in BlogPostDetail.module.css

**Task ID:** T002
**PRD:** blog-typography-redesign (005)
**Wave:** 1
**Model:** sonnet
**Complexity:** 2

## Objective

Replace all 7 undefined `--hds-*` token references in `BlogPostDetail.module.css` with valid tokens from `tokens.css`, fixing invisible borders, wrong backgrounds, and broken accent colors on the article detail page.

## Files to Modify

- `src/app/blog/BlogPostDetail.module.css`

## Context

`BlogPostDetail.module.css` references 7 token names that do not exist in `src/styles/tokens.css`. Every one of these resolves to the CSS initial value (transparent for colors, browser default for font-family), meaning:

- The article background (`--hds-color-bg-primary`) renders as transparent
- The subdued section backgrounds (`--hds-color-bg-subdued`, `--hds-color-bg-tertiary`) render as transparent
- The accent color on category badge, share button hover, and related tag (`--hds-color-accent-primary`, `--hds-color-accent-secondary`) renders as transparent
- The border lines (`--hds-color-border-subtle`) are invisible
- The font-family on `.title` and `.content` (`--hds-font-sans`) falls through to browser default

All 7 replacement tokens have been verified to exist in `tokens.css` and have correct dark mode variants. This task must land before any visual typography changes (T003–T006) because those tasks assume the token names are already valid.

Current token occurrences by selector (from reading the file):

| Undefined token | Appears on |
|---|---|
| `--hds-font-sans` | `.title`, `.content` (font-family) |
| `--hds-color-bg-primary` | `.main`, `.authorAvatar` border, `.shareButton` bg, `.relatedCard` bg |
| `--hds-color-bg-subdued` | `.relatedSection` bg |
| `--hds-color-bg-tertiary` | `.categoryBadge` bg, `.authorAvatar` bg, `.avatarPlaceholder` gradient start |
| `--hds-color-accent-primary` | `.categoryBadge` color, `.backLink:hover` color, `.avatarPlaceholder` gradient, `.relatedTag` color, `.relatedCard:hover` border-color, `.shareButton:hover` border+color |
| `--hds-color-accent-secondary` | `.avatarPlaceholder` gradient end |
| `--hds-color-border-subtle` | `.meta` border-top, `.categoryBadge` border, `.shareButton` border, `.relatedCard` border, `.relatedSection` border-top |

## Implementation

1. Read `src/app/blog/BlogPostDetail.module.css` in full before making any changes.
2. Perform the following 7 find-and-replace operations across the entire file. Replace every occurrence of each undefined token — do not miss occurrences in hover states or media queries:

   | Find (undefined) | Replace with (valid) |
   |---|---|
   | `--hds-font-sans` | `--hds-font-family` |
   | `--hds-color-bg-primary` | `--hds-color-surface-bg-quiet` |
   | `--hds-color-bg-subdued` | `--hds-color-surface-bg-subdued` |
   | `--hds-color-bg-tertiary` | `--hds-color-core-neutral-50` |
   | `--hds-color-accent-primary` | `--hds-color-util-brand-500` |
   | `--hds-color-accent-secondary` | `--hds-color-core-secondary-500` |
   | `--hds-color-border-subtle` | `--hds-color-surface-border-quiet` |

3. Do not change any font-size, font-weight, spacing, padding, margin, border-radius, or layout values. Only token names change.
4. After replacing, scan the file to confirm zero remaining references to the 7 old token names.

## Validation

- `grep --hds-font-sans src/app/blog/BlogPostDetail.module.css` returns no matches
- `grep --hds-color-bg-primary src/app/blog/BlogPostDetail.module.css` returns no matches
- `grep --hds-color-bg-subdued src/app/blog/BlogPostDetail.module.css` returns no matches (note: `--hds-color-surface-bg-subdued` is the valid token and will remain)
- `grep --hds-color-bg-tertiary src/app/blog/BlogPostDetail.module.css` returns no matches
- `grep --hds-color-accent-primary src/app/blog/BlogPostDetail.module.css` returns no matches
- `grep --hds-color-accent-secondary src/app/blog/BlogPostDetail.module.css` returns no matches
- `grep --hds-color-border-subtle src/app/blog/BlogPostDetail.module.css` returns no matches
- All 7 replacement token names are present in the file
- No font-size, font-weight, margin, padding, or border-radius values changed
- `npx tsc --noEmit` passes

## Dependencies

None — this task has no upstream dependencies and can run in parallel with T001.
