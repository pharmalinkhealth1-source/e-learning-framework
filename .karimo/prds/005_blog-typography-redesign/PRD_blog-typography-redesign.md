# PRD: Blog Typography & Layout Redesign

**Slug:** blog-typography-redesign
**PRD Number:** 005
**Status:** ready
**Created:** 2026-05-18
**Feature:** Align blog page templates with Stripe newsroom typography and layout standards

---

## Problem Statement

PharmaLink's blog pages use typography and layout conventions that feel over-designed relative to modern editorial benchmarks. Font sizes are too large for their context (38px listing card titles, 20px body copy), letter-spacing is excessively compressed, decorative elements (32px border-radius on hero images, pill-style category badges, rotated sidebar text) add visual noise without hierarchy benefit.

Additionally, a pre-existing bug means font-weight declarations of 600 and 700 silently render as 400 because the heavier IBM Plex Sans weights are not loaded — all heading weight contrast is currently invisible to users.

---

## Goals

1. Align blog typography scale with Stripe newsroom benchmark (sizes, weights, line-heights, spacing)
2. Fix pre-existing font-weight rendering bug (weight 600 not loaded)
3. Fix 7 undefined token references in BlogPostDetail.module.css causing broken colors/borders
4. Reduce decorative excess (hero image radius, category pill, sidebar share rotation)
5. Update layout: hero image height → aspect-ratio based; container → tokenized
6. All changes CSS Modules only — no new global tokens, no Sanity schema changes

---

## Non-Goals

- New typography scale tokens in `tokens.css` — local CSS variables only
- Changes to any Sanity schema
- Changes to React component logic or structure
- Changes to any page outside `src/app/blog/`
- Blog.module.css structural layout changes (column layout stays)

---

## Architecture

### Styling approach

CSS Modules + HDS Design Tokens (`--hds-*`). No Tailwind. No inline styles.

Blog-specific sizes use local CSS variables set on root selectors (continue the `.main` pattern in `Blog.module.css`). Do not add to `tokens.css`.

### Font weight fix

`globals.css` currently imports IBM Plex Sans at weights 300 and 400 only. Add weight 600 import. This is a global change (require_review) that makes all existing `font-weight: 600/700` declarations site-wide functional for the first time.

All `font-weight: 500` uses in blog files → convert to 400 (body) or 600 (heading) since 500 is not loaded and will not be loaded.

### Unit standardization

`BlogPostDetail.module.css` mixes `rem` and `px`. Standardize all values to `px` to match `Blog.module.css` convention.

### Token replacements (bug fix)

These undefined references in `BlogPostDetail.module.css` must be replaced before visual changes:

| Current (undefined) | Replace with |
|---|---|
| `--hds-font-sans` | `--hds-font-family` |
| `--hds-color-bg-primary` | `--hds-color-surface-bg-quiet` |
| `--hds-color-bg-subdued` | `--hds-color-surface-bg-subdued` |
| `--hds-color-bg-tertiary` | `--hds-color-core-neutral-50` |
| `--hds-color-accent-primary` | `--hds-color-util-brand-500` |
| `--hds-color-accent-secondary` | `--hds-color-core-secondary-500` |
| `--hds-color-border-subtle` | `--hds-color-surface-border-quiet` |

All replacement tokens have verified dark mode variants.

---

## Typography Targets

### Post detail page (BlogPostDetail.module.css)

| Element | Current | Target |
|---|---|---|
| `.title` H1 font-size | `clamp(40px, 5vw, 64px)` | `clamp(36px, 5vw, 52px)` |
| `.title` line-height | `1.05` | `1.12` |
| `.title` letter-spacing | `-0.05em` | `-0.02em` |
| `.title` font-weight | `700` (renders 400) | `600` (will render correctly after T001) |
| `.lead` font-size | `1.5rem (24px)` | `20px` |
| `.lead` font-weight | `500` | `400` |
| `.content` font-size | `1.25rem (20px)` | `17px` |
| `.content p` margin-bottom | `32px` | `24px` |
| `.content h2` font-size | `2.25rem (36px)` | `24px` |
| `.content h2` font-weight | `700` | `600` |
| `.content h2` letter-spacing | `-0.04em` | `-0.01em` |
| `.content h2` margin | `80px 0 32px` | `48px 0 16px` |
| `.content h3` | (missing) | `19px`, weight `600`, margin `32px 0 12px` |
| `.categoryBadge` | pill + bg + uppercase | plain label, `13px`, weight `500`, no bg/border/uppercase |
| `.authorName` | `1.05rem (~17px)`, weight `600` | `14px`, weight `600` |
| `.authorRole` | `0.8rem (~13px)`, weight `500` | `13px`, weight `400` |
| `.publishLabel` | `0.7rem (~11px)`, uppercase, weight `700` | `13px`, weight `400`, no uppercase |
| `.publishDate` | `0.95rem (~15px)`, weight `500` | `13px`, weight `400` |
| `.relatedTitle` | `2.5rem (40px)`, weight `700` | `28px`, weight `600` |
| `.relatedPostTitle` | `1.25rem (20px)`, weight `600` | `20px`, weight `600` (keep) |
| `.relatedTag` | `0.65rem (~10px)`, uppercase | `12px`, weight `500`, no uppercase |
| `.shareTitle` | `0.65rem`, weight `800`, rotated 90deg | Remove rotation, `12px`, weight `500`, no uppercase |
| `.heroImageContainer` | `height: 560px`, `border-radius: 32px` | `aspect-ratio: 16/9`, `border-radius: 8px`, remove fixed height |
| `.relatedCard` | `border-radius: 24px`, hover `translateY(-8px)` | `border-radius: 8px`, remove translateY |
| `.container` max-width | `1000px` hardcoded | `var(--hds-space-layout-content-maxWidth)` |

### Index page (Blog.module.css)

| Element | Current | Target |
|---|---|---|
| `.BlogIndexPost__title` (featured, 600px+) | `38px`, weight `500`, letter-spacing `-1.2px` | `32px`, weight `600`, letter-spacing `-0.02em` |
| `.BlogIndexPost__title` (desktop 900px+) | `38px`, weight `700`, letter-spacing `-0.2px` | `22px`, weight `600`, letter-spacing `-0.01em` |
| `.BlogIndexPost__title` (mobile) | `28px` | `22px` |
| `.BlogIndexPost__body` (desktop 600px+) | `18px` | `15px` |
| `.CopyTitle--variantDetail` | `15px`, uppercase | `13px`, retain left-border bar, no uppercase |
| `.BlogPostDate` | `15px` + left-border decoration | `13px`, remove `::before` border decoration |
| `.BlogAuthor__link` | `15px`, weight `600` | `14px`, weight `600` |
| `.BlogAuthor__role` | `15px`, weight `400` | `13px`, weight `400` |

---

## User Flow

No user flow changes — purely visual. Typography and layout changes affect presentation only.

---

## Research Findings

See `.karimo/prds/blog-typography-redesign/research/findings.md` for full analysis.

Key: the font-weight bug (T001) and broken token bug (T002) must land before any visual tasks. Dark mode verified safe for all token replacements.

---

## Risks

| Risk | Mitigation |
|---|---|
| `globals.css` weight import affects all pages | Require review gate on T001; additive import only |
| `font-weight: 500` renders as 400 | Convert all 500 uses to 400 (body) or 600 (heading) |
| PortableText h3 output gap | T004 adds `.content h3` rule |
| Dark mode token replacement | All 7 replacements have dark mode variants — verified |

---

## Acceptance Criteria

- IBM Plex Sans weight 600 visibly renders on all heading elements across site
- All 7 undefined token references in BlogPostDetail.module.css replaced with valid tokens
- Article H1 renders at ≤52px max, line-height 1.12, letter-spacing -0.02em
- Article body renders at 17px with 24px paragraph spacing
- Section H2 renders at 24px with 48px top margin
- H3 rule exists and renders at 19px
- Category badge renders as plain text label (no pill background)
- Meta row (author/role/date) uses 14px/13px/13px hierarchy
- Hero image uses aspect-ratio: 16/9, border-radius 8px
- Related cards use border-radius 8px, no translateY hover
- Related section title renders at 28px
- Sidebar share has no rotation, no weight 800
- Index listing card titles render at 22px
- Featured post title renders at 32px
- BlogPostDate has no left-border decoration
- No Sanity schema files modified
- No TypeScript errors (`npx tsc --noEmit` passes)
- Dark mode visually correct
