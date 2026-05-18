# Research Findings: blog-typography-redesign

**Date:** 2026-05-18
**Research by:** karimo-researcher

---

## Executive Summary

Two blog CSS files need typography + layout alignment to Stripe's newsroom benchmark. A pre-existing bug (7 undefined token references, missing font-weight imports) makes the detail page visually broken today — the redesign fixes these as a prerequisite.

CSS Modules + HDS tokens architecture stays intact. No Sanity schema changes. No new global tokens needed — local CSS variables extend the existing pattern.

---

## Key Findings

### Finding 1: Missing font-weight imports (critical bug, pre-existing)
`globals.css` loads IBM Plex Sans at weights 300 and 400 only. All `font-weight: 600/700` declarations in both blog files silently render as 400. Heading weight contrast is invisible. Fix: add `@import '@fontsource/ibm-plex-sans/600.css'` to `globals.css` (require_review).

### Finding 2: 7 undefined token references in BlogPostDetail.module.css (bug)
References `--hds-font-sans`, `--hds-color-bg-primary`, `--hds-color-bg-subdued`, `--hds-color-bg-tertiary`, `--hds-color-accent-primary`, `--hds-color-accent-secondary`, `--hds-color-border-subtle` — none exist in tokens.css. Fix as standalone task before visual changes.

### Finding 3: Body copy too large (20px vs 17px target)
IBM Plex Sans has generous x-height; 17–18px reads comfortably. Current 20px creates loose, low-density feel.

### Finding 4: Index card titles oversized (38px vs 20–22px target)
Listing card titles should be reading-list labels, not headlines. 38px competes with H1 scale.

### Finding 5: Letter-spacing over-compressed on featured post title (-1.2px)
Stripe uses -0.02em at display sizes. Current -1.2px on 38px ≈ -0.032em — significantly tighter.

### Finding 6: Hero image over-styled (border-radius: 32px, height: 560px, heavy shadow)
Stripe: `aspect-ratio: 16/9`, minimal radius (≤8px), no large shadow on editorial images.

### Finding 7: Category badge over-designed
Pill + background + uppercase on post detail. Stripe: plain text label, no background, no uppercase.

### Finding 8: Missing `.content h3` rule
PortableText may emit `h3` tags but BlogPostDetail.module.css has no `h3` style. Add alongside H2 fix.

### Finding 9: Mixed unit systems
BlogPostDetail.module.css mixes `rem` and `px`. Standardize to `px` (matches Blog.module.css convention).

### Finding 10: Post detail container not tokenized
`max-width: 1000px` hardcoded. Blog index correctly uses `--hds-space-layout-content-maxWidth`.

---

## Recommended Approach

- **No new global tokens** for this PRD. Blog-specific sizes → local CSS variables on root selector (continue Blog.module.css pattern).
- **Fix broken tokens first** as an atomic standalone commit (separate from visual changes).
- **globals.css font-weight import** is a global change; flag for explicit reviewer sign-off.
- **Do not touch Sanity schema** or tokens.css (require_review, no changes needed).
- Standardize to `px` units in BlogPostDetail.module.css.

---

## Task Estimate: 8 tasks across 3 files

| Task | File | Description |
|---|---|---|
| T001 | `globals.css` | Add IBM Plex Sans weight 600 import |
| T002 | `BlogPostDetail.module.css` | Fix 7 undefined token references |
| T003 | `BlogPostDetail.module.css` | H1: size clamp, line-height, letter-spacing, weight |
| T004 | `BlogPostDetail.module.css` | Body copy size, lead, paragraph spacing; H2+H3 size and margins |
| T005 | `BlogPostDetail.module.css` | Category badge → plain label; meta row size normalization |
| T006 | `BlogPostDetail.module.css` | Hero image aspect-ratio, reduced radius; relatedCard radius; container tokenization; sidebar share simplification |
| T007 | `Blog.module.css` | Featured + listing title sizes and letter-spacing |
| T008 | `Blog.module.css` | Excerpt, author, date meta sizes; remove border from BlogPostDate |

---

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| globals.css font-weight import affects all pages | Medium | Require review, isolated import, additive only |
| Dark mode compatibility of token replacements | Low | All replacement tokens have verified dark mode variants |
| font-weight: 500 declarations → renders as 400 | Low | Convert to 400 (body) or 600 (heading) — do not load 500 |
| PortableText h3 gap | Low | Add .content h3 rule in T004 |
| tokens.css not touched | None | Local variable pattern avoids scope creep |
