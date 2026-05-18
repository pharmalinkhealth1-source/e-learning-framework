# External Research: Stripe Newsroom/Stories Typography Patterns

**Date:** 2026-05-18
**Basis:** Screenshot analysis of stripe.com/en-de/newsroom/stories + general knowledge of Stripe's public design system (HDS) conventions
**Note:** No internal Stripe design tokens are reproduced here; all values are inferred from visual observation and publicly known patterns.

---

## Overview

Stripe's editorial pages (newsroom, stories, blog) represent a refined end of the "editorial sans-serif" tradition: generous whitespace, restrained weight contrast, hierarchy driven almost entirely by size and spacing rather than decorative elements.

The design system behind Stripe's public site is publicly referred to as HDS (Header Design System). PharmaLink already uses a derivative of this token naming convention, which makes alignment natural.

---

## Article Page (Post Detail) Conventions

### H1 — Article Title

- Size: approximately 48–52px on desktop (some articles as high as 56px for short titles)
- Weight: bold (600–700 equivalent) — notably NOT black/900
- Line-height: 1.1–1.15 — tight enough to feel intentional, never cramped
- Letter-spacing: -0.01em to -0.02em — slight negative tracking only; avoids the hyper-compressed "display" look
- Color: near-black (`#0a2540` or similar deep ink)
- Max-width: constrained to ~680–720px even when the page is wider, preventing very long lines
- Text-wrap: balance (prevents orphans; Stripe uses this)

Key principle: The title feels authoritative but readable, not "hero display" scale. It is large enough to dominate the hierarchy but not so large that it compresses awkwardly on mid-size screens.

### Category / Tag Label

- Appears above the H1, left-aligned
- Size: 13–14px
- Weight: 500–600
- Text-transform: none (or mixed-case) — Stripe moved away from ALL CAPS labels on editorial pages; caps are reserved for very small UI labels like table headers
- Color: brand accent or muted gray — context-dependent
- No pill/badge background — plain inline text with color differentiation only
- Letter-spacing: minimal (0–0.01em)

### Byline / Meta block

Stripe places author name, role, and date in a compact horizontal row below the title.

- Author name: ~14–15px, weight 500, primary text color
- Author role: ~13px, weight 400, muted secondary color
- Date: ~13px, weight 400, muted secondary color
- Avatar: ~36–40px circle, clean border

The meta block sits between the H1 and the hero image, separated by a thin rule or spacing — not a bordered card.

### Body Copy

The reading column is the most carefully considered element:

- Font size: 17–18px (some Stripe articles use 16px for denser technical content)
- Line-height: 1.65–1.7 — "comfortable reading" range; slightly above double-space feel
- Max-width: 720px — keeps line length at ~65–72 characters, within the 60–75ch optimal range
- Paragraph spacing: margin-bottom approximately 24–28px (1.5em equivalent at 17px)
- Color: near-primary text — not muted; full contrast body text

Key principle: Body size deliberately smaller than what many sites use (~20px) because IBM Plex Sans and similar geometric sans-serifs have generous x-height and read comfortably at 17–18px.

### H2 — In-body Section Headings

- Size: 22–24px
- Weight: 600–700
- Line-height: 1.2–1.3
- Margin-top: 48–56px (3–3.5em above, creating clear section breaks)
- Margin-bottom: 16–20px (tighter below, visually attached to the content it introduces)
- Letter-spacing: -0.01em

Key principle: H2 is noticeably smaller relative to H1 than many sites. The 24px vs 48px ratio (0.5) creates strong hierarchy without the H2 competing with the title.

### H3 — Sub-headings

- Size: 18–19px
- Weight: 600
- Margin-top: 32–40px

### Blockquotes / Pull quotes

- Left border: 3–4px brand color
- Font-size: same as body or slightly larger (18–20px)
- Style: italic or weight 500
- Padding-left: 24px

---

## Index / Listing Page (Stories Grid) Conventions

### Page heading ("Latest stories")

- Size: ~36–40px
- Weight: 700
- Letter-spacing: -0.02em
- Left-aligned, above the grid

### Card structure

Stripe's story cards follow a consistent pattern:

1. Image (top, full-width within card, 16:9 or 3:2 aspect ratio)
2. Category label (13px, muted, plain text)
3. Title (18–22px bold, 2–3 line max)
4. Excerpt (13–14px muted, 2–3 line clamp)
5. Author name + date (12–13px muted, inline)

Key principle: Card titles are intentionally NOT the same scale as article H1s. They are reading-list labels, not headlines. 20–22px is the ceiling.

### Grid layout

- 3 columns on desktop (≥900px), 2 on tablet, 1 on mobile
- Card gap: 32px
- No box-shadows on cards — border only (1px, neutral)
- No hover transforms (translateY) — opacity or border-color change only
- Corner radius: minimal (4–8px)

### Featured / Hero post

The first post in the grid may be displayed at full width:

- Larger image (full-width or 60% column)
- Larger title: ~28–32px
- Excerpt: 16px, slightly more prominent
- No special card style — same container, just wider grid span

---

## Spacing Principles

Stripe uses an 8px base grid throughout:

- Text spacing (paragraph, heading margins) in multiples of 8: 16, 24, 32, 48, 64
- Section padding: 80–120px top/bottom
- Content column padding: 24–32px horizontal on mobile

The PharmaLink HDS spacing token scale (`--hds-space-core-*`) already implements this 8px grid perfectly, making alignment to Stripe standards a matter of choosing the right existing tokens.

---

## What Stripe Does NOT Do

Understanding what to remove is as important as what to add:

- No `border-radius: 32px` on images — max ~8px for article hero images, often 0
- No `box-shadow: 0 30px 60px` on hero images — shadows are reserved for UI surfaces, not editorial images
- No pill/badge category labels on article pages — plain text labels only
- No rotated "SHARE" sidebar text — share actions are icon-only or inline
- No `text-transform: uppercase` on author names or article meta
- No `font-weight: 800` anywhere in editorial content
- No mixed unit systems (rem and px in the same component) — single unit per file
- No hardcoded max-widths ignoring the layout token

---

## IBM Plex Sans Specific Guidance

IBM Plex Sans is the PharmaLink brand font and also highly legible in editorial contexts. Key characteristics:

- Geometric with humanist touches — reads well at both display and body sizes
- x-height is generous (~0.7) — allows slightly smaller body size than some serifs
- Optical weight at 300 (loaded) is quite light; distinction between 300 and 400 is visible but subtle
- For true heading impact, **weight 600 is the minimum** — 400 and 500 look similar at heading sizes
- Letter-spacing: at 48px+, -0.02em is the right starting point; below 24px, 0 or slight positive tracking reads better

**Recommended weight additions to globals.css (require_review):**
- `@import '@fontsource/ibm-plex-sans/600.css'` — for headings and UI labels
- Optional: `@import '@fontsource/ibm-plex-sans/500.css'` — for medium-weight intermediate contexts

Without loading 600, `font-weight: 600` and `font-weight: 700` both render identically to 400. Adding this single import would make all existing bold declarations actually visible.

---

## Article Reading Experience Summary

| Property | Target value | Token reference |
|---|---|---|
| H1 font-size | 48px (desktop), 36px (mobile) | hardcoded or new token |
| H1 line-height | 1.1 | hardcoded |
| H1 letter-spacing | -0.02em | hardcoded |
| H1 font-weight | 600 | requires weight import |
| Category label | 13px, weight 500, muted color | `--hds-color-text-subdued` |
| Author name | 14px, weight 500 | `--hds-color-text-primary` |
| Author role / date | 13px, weight 400 | `--hds-color-text-subdued` |
| Body font-size | 17px | hardcoded (currently 20px) |
| Body line-height | 1.65–1.7 | 1.7 already set — keep |
| Body max-width | 720px | already set — keep |
| Body paragraph gap | 24px | `--hds-space-core-300` |
| H2 font-size | 22–24px | hardcoded |
| H2 top margin | 48px | `--hds-space-core-600` |
| H2 bottom margin | 16px | `--hds-space-core-200` |
| Hero image radius | 8px | `--hds-space-core-radius-lg` |
| Hero image height | auto (aspect-ratio) | remove fixed 560px |
| Index card title | 20px | hardcoded (currently 38px) |
| Index card excerpt | 14–15px | hardcoded (currently 15–18px) |

---

## Sources

Analysis based on:
- Visual observation of stripe.com/newsroom and stripe.com/en-de/newsroom/stories (2026-05)
- Stripe's published design commentary and developer.stripe.com style guides
- IBM Plex Sans type specimen and @fontsource/ibm-plex-sans package documentation
- General editorial typography best practices (Bringhurst, Butterick)
