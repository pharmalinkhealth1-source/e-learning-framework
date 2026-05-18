# Internal Research: Blog Current State

**Date:** 2026-05-18
**Scope:** src/app/blog/

---

## Token System Inventory

### What exists in tokens.css

The HDS token file provides spacing, color, and limited typography tokens. Critically, it does NOT define font-size, line-height, or letter-spacing scale tokens — those are all hardcoded as raw values in the module CSS files.

**Typography tokens that DO exist:**
- `--hds-font-family` — IBM Plex Sans + fallback stack
- `--hds-font-family-code` — IBM Plex Mono + fallback stack
- `--hds-font-weight-normal: 300`
- `--hds-font-weight-bold: 400` (note: "bold" maps to 400, not 700)
- `--hds-font-text-xs-size: 0.875rem`

**Typography tokens that DO NOT exist (gaps):**
- No `--hds-font-size-*` scale (sm, md, lg, xl, 2xl, etc.)
- No `--hds-line-height-*` tokens
- No `--hds-letter-spacing-*` tokens
- No `--hds-font-weight-semibold`, `--hds-font-weight-medium` tokens

**Color tokens relevant to blog:**
- `--hds-color-text-primary: #24124a`
- `--hds-color-text-secondary: rgba(36,18,74,0.72)`
- `--hds-color-text-subdued: rgba(36,18,74,0.52)`
- `--hds-color-heading-solid: var(--hds-color-core-neutral-990)` → `#061b31`
- `--hds-color-surface-bg-quiet` — page background

**Layout tokens:**
- `--hds-space-layout-content-maxWidth: 1264px`
- Spacing scale: `--hds-space-core-*` (8px increments: 100=8, 200=16, 300=24, 400=32...)

---

## Blog.module.css — Index Page Typography Audit

### .main (root)
- `font-family: var(--hds-font-family)` — correct token usage
- `font-weight: 300` — hardcoded, not tokenized

### .BlogIndexPost__title (post list title)
**Desktop (900px+):**
- `font-size: 38px`
- `line-height: 48px` (ratio: 1.26)
- `font-weight: 700`
- `letter-spacing: -0.2px`

**Featured variant (600px+):**
- `font-size: 38px`
- `line-height: 48px` (ratio: 1.26)
- `font-weight: 500`
- `letter-spacing: -1.2px`

**Mobile (<600px):**
- `font-size: 28px`
- `line-height: 36px` (ratio: 1.29)

### .BlogIndexPost__body (excerpt/summary)
**Mobile:**
- `font-size: 15px`
- `line-height: 24px` (ratio: 1.6)
- `font-weight: 400`

**Desktop (600px+):**
- `font-size: 18px`
- `line-height: 28px` (ratio: 1.56)

### .CopyTitle--variantDetail (category label)
- `font-size: 15px`
- `line-height: 1.6`
- `font-weight: 600`
- `letter-spacing: 0.2px`
- `text-transform: uppercase`
- Color: `var(--accentColor)` → `--hds-color-util-brand-500` (#635bff)
- Has a 2px left border bar decoration

### .BlogPostDate
- `font-size: 15px`
- `line-height: 1.6`
- Color: `var(--textColor)` → `--hds-color-text-secondary`
- Has a 2px left border bar decoration (same as category)

### .BlogAuthor__link (author name)
- `font-weight: 600`
- `font-size: 15px`
- `line-height: 1.6`
- Color: `var(--titleColor)` → `--hds-color-core-neutral-1000`

### .BlogAuthor__role
- `font-weight: 400`
- `font-size: 15px`
- `line-height: 1.6`
- Color: `var(--textColor)` → `--hds-color-text-secondary`

### .BlogIndexPost__readMoreLink
- `font-size: 15px`
- `line-height: 24px`
- `font-weight: 600`
- Color: `var(--accentColor)`

### .BlogFooterCta__title
- `font-size: 24px`
- `font-weight: 700`

### .BlogFooterCta__summary
- `font-size: 18px`

### .SegmentedControlButton
- `font-weight: 600`
- `font-size: 15px`
- `height: 32px`

---

## BlogPostDetail.module.css — Post Detail Page Typography Audit

### .title (article H1)
- `font-size: clamp(2.5rem, 5vw, 4rem)` — 40px–64px responsive
- `font-weight: 700`
- `line-height: 1.05`
- `letter-spacing: -0.05em`
- `font-family: var(--hds-font-sans)` — **BROKEN TOKEN** (undefined; falls back to body font)
- Color: `var(--hds-color-text-primary)` — **BROKEN TOKEN** (defined in BlogPostDetail but `--hds-color-text-primary` maps to `#24124a`, not `--hds-color-heading-solid`)

### .lead (summary/lede paragraph)
- `font-size: 1.5rem` (24px)
- `line-height: 1.5`
- `font-weight: 500`
- `letter-spacing: -0.02em`

### .content (article body wrapper)
- `font-size: 1.25rem` (20px)
- `line-height: 1.7`
- `max-width: 720px`
- `font-family: var(--hds-font-sans)` — **BROKEN TOKEN**

### .content p
- `margin-bottom: 32px`

### .content h2
- `font-size: 2.25rem` (36px)
- `font-weight: 700`
- `line-height: 1.1`
- `letter-spacing: -0.04em`
- `margin: 80px 0 32px` (very large top margin)

### .categoryBadge
- `font-size: 0.7rem` (11.2px)
- `font-weight: 700`
- `text-transform: uppercase`
- `letter-spacing: 0.08em`
- Uses pill background, border — decorative style

### .authorName
- `font-weight: 600`
- `font-size: 1.05rem` (~16.8px)

### .authorRole
- `font-size: 0.8rem` (12.8px)
- `font-weight: 500`

### .publishLabel
- `font-size: 0.7rem` (11.2px)
- `font-weight: 700`
- `text-transform: uppercase`
- `letter-spacing: 0.05em`

### .publishDate
- `font-size: 0.95rem` (~15.2px)
- `font-weight: 500`

### .backLink
- `font-size: 0.875rem` (14px)
- `font-weight: 500`

### .shareTitle
- `font-size: 0.65rem` (10.4px)
- `font-weight: 800`
- `text-transform: uppercase`
- `letter-spacing: 0.1em`
- Rotated 90deg — decorative sidebar element

### .relatedTitle
- `font-size: 2.5rem` (40px)
- `font-weight: 700`
- `letter-spacing: -0.04em`

### .relatedPostTitle
- `font-size: 1.25rem` (20px)
- `font-weight: 600`
- `line-height: 1.3`

### .relatedTag
- `font-size: 0.65rem` (10.4px)
- `font-weight: 700`
- `text-transform: uppercase`
- `letter-spacing: 0.05em`

---

## Container / Layout Audit

### Blog index
- `.container` max-width: `calc(1264px + 2px)` — uses `--hds-space-layout-content-maxWidth` token
- `--layoutWidth: 1080px` — set as local variable but not actively used
- `padding-bottom: 120px` on RowLayout

### Post detail
- `.container` max-width: `1000px` — **hardcoded, does not use layout token**
- `.header` max-width: `800px`
- `.content` max-width: `720px` — appropriate reading column width
- `.contentWrapper` grid: `80px 1fr` with `60px` gap (sidebar + content)
- `.heroImageContainer` height: `560px`, border-radius: `32px` — large decorative radius

---

## Broken / Undefined Token References

BlogPostDetail.module.css references several tokens that do not exist in tokens.css:

| Token reference | Status | Should map to |
|---|---|---|
| `--hds-font-sans` | UNDEFINED | `--hds-font-family` |
| `--hds-color-bg-primary` | UNDEFINED | `--hds-color-surface-bg-quiet` |
| `--hds-color-bg-subdued` | UNDEFINED | `--hds-color-surface-bg-subdued` |
| `--hds-color-bg-tertiary` | UNDEFINED | `--hds-color-core-neutral-50` or similar |
| `--hds-color-accent-primary` | UNDEFINED | `--hds-color-util-brand-500` or `--hds-color-primary` |
| `--hds-color-accent-secondary` | UNDEFINED | `--hds-color-core-secondary-500` |
| `--hds-color-border-subtle` | UNDEFINED | `--hds-color-surface-border-quiet` |

These undefined tokens will silently fall back to the browser default (transparent/inherited), causing invisible borders, wrong backgrounds, and incorrect colors. This is an existing bug that the redesign should fix while touching these files.

---

## Local Variable Pattern in Blog.module.css

Blog.module.css uses a local CSS variable layer set on `.main`:

```css
--accentColor: var(--hds-color-util-brand-500);
--titleColor: var(--hds-color-core-neutral-1000);
--textColor: var(--hds-color-text-secondary);
--cardBackground: var(--hds-color-core-neutral-0);
--columnPaddingNormal: 16px;
--columnPaddingMedium: 32px;
--columnPaddingLarge: 64px;
```

This is a valid and reusable pattern. The redesign should continue this approach rather than introducing direct token references inline.

---

## Font Weight Reality Check

IBM Plex Sans is loaded in globals.css at weights **300** and **400** only:

```css
@import '@fontsource/ibm-plex-sans/300.css';
@import '@fontsource/ibm-plex-sans/400.css';
```

The CSS files use `font-weight: 500`, `600`, `700`, and `800` extensively throughout BlogPostDetail.module.css. These weights are not loaded, so the browser will synthesize them or round to 400 — meaning the visual difference between "600" and "700" is currently zero.

**This is a significant existing issue.** The redesign must either:
1. Add IBM Plex Sans weight 600 (or 700) imports to globals.css (require_review), or
2. Work within 300 and 400 only, using size and spacing for hierarchy instead of weight contrast

IBM Plex Sans is available in weights: 100, 200, 300 (loaded), 400 (loaded), 500, 600, 700.

---

## Gaps vs Stripe Benchmark

| Element | Current PharmaLink | Stripe benchmark target | Gap |
|---|---|---|---|
| Article H1 size | clamp(40px–64px) | ~48–56px equivalent | Acceptable range, but line-height 1.05 is too tight |
| Article H1 line-height | 1.05 | ~1.1–1.15 | Minor — increase slightly |
| Article H1 letter-spacing | -0.05em | ~-0.02em | Too tight — reduce |
| Body copy size | 20px (1.25rem) | ~17–18px | Too large; reduces to reduce |
| Body copy line-height | 1.7 | ~1.65–1.7 | Acceptable |
| Body column width | max-width 720px | ~720–740px | Good match |
| Body paragraph spacing | margin-bottom 32px | ~24–28px | Slightly loose |
| H2 in body | 36px, margin-top 80px | ~24px bold, tighter above | Too large, top margin excessive |
| Category label | 15px uppercase | ~13–14px, muted | Too large, wrong color treatment |
| Byline/meta size | ~14–17px mixed | ~14px uniform | Inconsistent scale |
| Index card title | 38px / 28px mobile | ~20–22px bold | Too large for card context |
| Index card excerpt | 15px / 18px | ~14–15px muted | Close, reduce on desktop |
| Index container width | 1264px | ~1200–1264px | Good match |
| Post detail container | 1000px hardcoded | ~960–1000px | Acceptable but not tokenized |
| Hero image radius | 32px | Minimal / no radius | Overly decorative |
| categoryBadge style | pill with background | Plain label, no pill | Style mismatch |

---

## Summary of Issues

1. **Missing font-weight imports** — 500/600/700 not loaded; all bold weights silently fail
2. **Broken token references in BlogPostDetail** — 7 undefined `--hds-*` tokens (see table above)
3. **No typography scale tokens** — all sizes hardcoded; difficult to maintain consistency
4. **Mixed unit systems** — Blog.module.css uses px; BlogPostDetail.module.css uses rem; no consistent approach
5. **Container not tokenized in post detail** — max-width: 1000px is hardcoded
6. **Body copy too large** — 20px (1.25rem) for article body is larger than Stripe benchmark
7. **H2 top margin excessive** — 80px above section headings creates awkward rhythm
8. **Category badge over-designed** — pill with background/border vs Stripe's clean label
9. **Hero image over-styled** — 32px radius, 560px fixed height, heavy drop shadow
10. **Index card titles oversized** — 38px for listing cards vs Stripe's ~20–22px card titles
