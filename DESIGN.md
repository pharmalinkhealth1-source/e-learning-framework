---
name: PharmaLink (HDS)
description: Scaling Pan-African Frontline Care through data, training, and community.
colors:
  primary: "#6c30c0"
  secondary: "#e84ac7"
  teal: "#09a5b6"
  surface: "#ffffff"
  surface-subdued: "#f8fafd"
  heading: "#25084a"
  text-main: "#25084a"
  text-secondary: "#425466"
  border: "#e5edf5"
typography:
  display:
    fontFamily: "var(--font-ibm-plex-sans), 'SF Pro Display', sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 4.5rem)"
    fontWeight: 300
    lineHeight: 1.1
  headline:
    fontFamily: "var(--font-ibm-plex-sans), sans-serif"
    fontSize: "2rem"
    fontWeight: 300
    lineHeight: 1.2
  body:
    fontFamily: "var(--font-ibm-plex-sans), sans-serif"
    fontSize: "1rem"
    fontWeight: 300
    lineHeight: 1.6
  label:
    fontFamily: "var(--hds-font-family-code), monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.08em"
    textTransform: "uppercase"
rounded:
  sm: "2px"
  md: "4px"
  lg: "8px"
spacing:
  25: "2px"
  50: "4px"
  100: "8px"
  150: "12px"
  200: "16px"
  300: "24px"
  400: "32px"
  600: "48px"
  800: "64px"
  1000: "80px"
  1200: "96px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    borderRadius: "{rounded.sm}"
    padding: "6px 16px"
    height: "32px"
  button-secondary:
    backgroundColor: "rgba(0,0,0,0.05)"
    textColor: "{colors.heading}"
    borderRadius: "{rounded.sm}"
    padding: "6px 16px"
    height: "32px"
---

# Design System: PharmaLink (HDS)

## 1. Overview

**Creative North Star: "Frontline Precision"**

The interface of a platform that takes African pharmaceutical capacity seriously. Not a patient portal, not a donor dashboard — a professional tool built for the people doing the work and the institutions watching the evidence accumulate. Clarity and authority without sterility.

**Color strategy: Committed.** The primary Purple carries 30–60% of any marketing surface. Pink and Teal are purposeful — data states, human stories, progress indicators. They do not get reduced to 10% accent roles.

**Key characteristics:**
- **Weight contrast through lightness, not boldness.** 300-weight type held in tension with dark navy surfaces and vivid purple creates hierarchy without resorting to fat headings.
- **Borders define, not decorate.** The 1px `#e5edf5` grid lines running through sections are structural — they orient the eye, echo the navbar's containing block, and give data the precision it deserves.
- **Dark mode is a peer, not an afterthought.** Every token has a dark variant. The deep navy (`#061b31`) is not simply inverted white.

---

## 2. Colors

### Light mode

| Role | Token | Value |
|---|---|---|
| Surface default | `--hds-color-surface-bg-quiet` | `#ffffff` |
| Surface subdued | `--hds-color-surface-bg-subdued` | `#f8fafd` |
| Border quiet | `--hds-color-surface-border-quiet` | `#e5edf5` |
| Heading | `--hds-color-text-main` | `#25084a` |
| Body text | `--hds-color-text-primary` | `#0a2540` |
| Subdued text | `--hds-color-text-subdued` | `#4f566b` |
| Primary 700 | `--hds-color-core-primary-700` | `#6c30c0` |
| Primary 500 | `--hds-color-core-primary-500` | `#9762ea` |
| Primary 50 | `--hds-color-core-primary-50` | `#f9f6fe` |
| Secondary 500 | `--hds-color-core-secondary-500` | `#e84ac7` |
| Secondary 600 | `--hds-color-core-secondary-600` | `#cc2da8` |
| Teal highlight | `--hds-color-hero-title-highlight` | `#09a5b6` |
| Hero gradient | `--hds-color-hero-title-gradient` | `linear-gradient(to right, #25084a, #4f2683, #cf1259)` |

### Dark mode (data-theme="dark")

| Role | Token | Value |
|---|---|---|
| Surface default | `--hds-color-surface-bg-quiet` | `#061b31` |
| Surface subdued | `--hds-color-surface-bg-subdued` | `#0a2540` |
| Heading | `--hds-color-text-main` | `#f8fafd` |
| Body text | `--hds-color-text-primary` | `#ffffff` |
| Subdued text | `--hds-color-text-subdued` | `#95a4ba` |
| Hero gradient | `--hds-color-hero-title-gradient` | `linear-gradient(to right, #b9b9f9, #d1baf8, #fcd2f6)` |

### Named rules

**Do not reduce Pink and Teal to tokens-only.** They carry narrative weight. Pink (`#e84ac7`) signals human story, community achievement, or critical CTA. Teal (`#09a5b6`) signals data, progress, and learning outcomes. Both are used at committed saturation, not as micro-accents.

**No pure black. No pure white.** Tint every neutral toward the brand hue. `--hds-color-core-neutral-990` (`#061b31`) is the floor; `--hds-color-core-neutral-0` (`#ffffff`) is the ceiling in light mode. Respect this.

---

## 3. Typography

**Display font:** IBM Plex Sans (Light / 300)
**Code / Label font:** IBM Plex Mono (Regular / 400)

There is no separate body-bold — weight contrast comes from scale and mono-vs-sans switching, not bold headings on top of bold subheadings.

### Scale

| Level | Size | Weight | Line height | Use |
|---|---|---|---|---|
| Display | `clamp(2.5rem, 7vw, 4.5rem)` | 300 | 1.1 | Hero headlines only |
| H1 | `2rem` | 300 | 1.2 | Primary section entrances |
| H2 | `1.5rem` | 300 | 1.3 | Subsection headings |
| H3 | `1.125rem` | 400 | 1.4 | Card headings, panel titles |
| Body | `1rem` | 300 | 1.6 | Long-form content, max 75ch |
| Small | `0.9375rem` | 300 | 1.5 | Navigation labels, secondary copy |
| Eyebrow | `0.75rem` | 400 | 1 | Section labels, monospace, uppercase, `0.08em` tracking |

### Named rules

**Eyebrows are monospace.** Section labels, data labels, and category tags use `var(--hds-font-family-code)` — this is the visual signature that differentiates data from prose.

**300 is the default heading weight.** `--hds-font-weight-bold` in this system is 400, not 700. Hierarchy is built through scale, not weight escalation.

---

## 4. Spacing & Layout

**Scale:** 8px base unit. `--hds-space-core-*` tokens from 2px (25) to 168px (2100).

**Content container:** max-width `1264px`, padding-inline `20px` (desktop). Vertical page borders (`1px solid #e5edf5`) define the content column — these lines are structural and intentionally repeat across sections.

**Section rhythm:** Sections alternate between `#ffffff` and `#f8fafd` backgrounds. Vertical padding varies: hero sections use 96–120px; content sections use 64–80px; compact blocks use 48px. Same padding everywhere is monotony.

**Grid:** 3-column for feature grids (`repeat(3, minmax(0, 1fr))`). `minmax(0, 1fr)` is required — plain `1fr` allows cells to overflow.

---

## 5. Elevation

Surfaces are flat at rest. Depth is contextual.

| Name | Value | Use |
|---|---|---|
| Card rest | `none` | Default card state |
| Card hover | `0 4px 24px rgba(0,0,0,0.08)` | Interactive lift on hover |
| Modal | `0 20px 60px rgba(0,0,0,0.12)` | Overlays and drawers |

**No glassmorphism as decoration.** `backdrop-filter: blur()` is permitted only for the navbar (structural, not decorative — it separates persistent chrome from scrolling content).

---

## 6. Components

### Buttons

- **Shape:** 2px radius (`--hds-space-core-radius-sm`). Precise, not rounded.
- **Primary:** `background: #6c30c0`, white text, 32px height, 6px 16px padding. Trailing arrow icon animates on hover (stem slides in, chevron shifts 3px right).
- **Secondary:** `background: rgba(0,0,0,0.05)`, navy text. No border.
- **Ghost (nav):** Transparent background, underline animates in from right on hover using `::after` with `scaleX` transition.
- **No gradient text on CTAs.** Single solid color only.

### Cards

- **Style:** White surface, `1px solid #e5edf5` border, 4px radius.
- **No side-stripe borders.** No `border-left` color accents. Full borders or nothing.
- **No identical card grids.** Same-sized icon + heading + text cards repeated 3–4 times is a banned pattern. Vary structure, size, or content type.

### Navbar

- 64px height, sticky, `background: var(--hds-color-surface-bg-quiet)`.
- Logo positioned absolutely, extends 2× navbar height with radial-gradient glow mask diffusing into surrounding surface.
- Megamenu: `position: absolute` within the navbar sectionContainer (the containing block). Panel bounds match the content column width.

### Eyebrow labels

```css
font-family: var(--hds-font-family-code);
font-size: 0.75rem;
font-weight: 400;
letter-spacing: 0.08em;
text-transform: uppercase;
color: var(--hds-color-core-primary-700);
```

Used consistently as section entrance labels. Always monospace, always brand purple.

### Tab indicators

Active tab: `::after` gradient underline using `linear-gradient(to right, var(--hds-color-core-secondary-600), var(--hds-color-core-primary-500))`. 2px height, `border-radius: 2px`. No filled-tab pattern.

---

## 7. Absolute bans (project-specific)

- **Gradient text** (`background-clip: text`). Banned entirely. Heading gradients are implemented as `background-clip: text` only on the hero title — do not add more.
- **Side-stripe borders.** `border-left` / `border-right` as colored accent ≥2px on cards or callouts.
- **Identical card grids.** Icon + heading + text, 3–4 cards, same size.
- **Generic medical stock imagery.** No doctor-with-stethoscope. Authentic ground-level photography of African health settings or no photography at all.
- **"Leverage", "robust", "world-class"** — and all synonyms. Not in copy, not in headings, not in alt text.
