# Briefs Overview: blog-typography-redesign (005)

## Task Summary

| Task | Title | Wave | Complexity | Model | File |
|------|-------|------|------------|-------|------|
| [T001](T001_blog-typography-redesign.md) | Add IBM Plex Sans weight 600 import | 1 | 1 | sonnet | `globals.css` |
| [T002](T002_blog-typography-redesign.md) | Fix 7 undefined token references | 1 | 2 | sonnet | `BlogPostDetail.module.css` |
| [T003](T003_blog-typography-redesign.md) | Redesign article H1 title typography | 2 | 2 | sonnet | `BlogPostDetail.module.css` |
| [T004](T004_blog-typography-redesign.md) | Body copy, lead, H2, add H3 rule | 2 | 3 | sonnet | `BlogPostDetail.module.css` |
| [T005](T005_blog-typography-redesign.md) | Simplify category badge and meta row | 2 | 2 | sonnet | `BlogPostDetail.module.css` |
| [T006](T006_blog-typography-redesign.md) | Layout, hero image, cards, sidebar share | 2 | 3 | sonnet | `BlogPostDetail.module.css` |
| [T007](T007_blog-typography-redesign.md) | Listing card titles and featured title | 3 | 2 | sonnet | `Blog.module.css` |
| [T008](T008_blog-typography-redesign.md) | Meta sizes and remove date border | 3 | 2 | sonnet | `Blog.module.css` |

## Wave Breakdown

### Wave 1 — Bug fixes (parallel, no dependencies)

- **T001** — Add `@import '@fontsource/ibm-plex-sans/600.css'` to `globals.css`. Prerequisite for all heading weight changes. Require-review file — flag in PR.
- **T002** — Replace 7 undefined `--hds-*` token names in `BlogPostDetail.module.css` with verified valid equivalents. Prerequisite for all visual changes to that file.

### Wave 2 — Post detail page redesign (sequential, all in `BlogPostDetail.module.css`)

T003–T006 all edit the same file and depend on T001 and T002 both completing first. They can be run in any order among themselves, but each agent should read the current file state before editing to avoid conflicts.

- **T003** — H1 `.title`: clamp ceiling 52px, line-height 1.12, letter-spacing -0.02em, weight 600.
- **T004** — Body `.content` 17px, `.lead` 20px, `.content p` margin 24px, `.content h2` 24px, add `.content h3` 19px.
- **T005** — Strip `.categoryBadge` pill style; normalize `.authorName`/`.authorRole`/`.publishLabel`/`.publishDate`/`.relatedTag` to 14px/13px hierarchy.
- **T006** — `.container` tokenized max-width; `.heroImageContainer` aspect-ratio 16/9 + radius 8px; `.relatedCard` radius 8px, no translateY hover; `.relatedTitle` 28px; `.shareTitle` no rotation.

### Wave 3 — Index page redesign (sequential, all in `Blog.module.css`)

- **T007** — `.BlogIndexPost__title` base 22px, featured 32px weight 600, letter-spacing normalized.
- **T008** — `.BlogIndexPost__body` desktop 15px; `.CopyTitle--variantDetail` 13px no uppercase; `.BlogPostDate` 13px no `::before`; author/role 14px/13px.

## File Overlap Analysis

| File | Tasks | Coordination note |
|------|-------|-------------------|
| `src/styles/globals.css` | T001 only | No overlap. Require-review file. |
| `src/app/blog/BlogPostDetail.module.css` | T002, T003, T004, T005, T006 | Five tasks edit this file. T002 must land first (token names). T003–T006 can run after T002 but should each read the current file state before editing. |
| `src/app/blog/Blog.module.css` | T007, T008 | Two tasks edit this file. No strict ordering between T007 and T008 — no selector overlap. |

## Quick Links

- [PRD](../PRD_blog-typography-redesign.md)
- [Tasks](../tasks.yaml)
- [Research Findings](../research/findings.md)

---
*PRD 005 | blog-typography-redesign | 8 tasks across 3 waves*
