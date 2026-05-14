# Phase 8: D3 Animated Insights — Plan

**Phase Goal:** Add a suite of interactive, animated D3.js data visualizations to the existing `/data-insights` page that tell the PharmaLink impact story — vaccination coverage, course completions, geographic reach — all styled to the Clinical Luxury design system and animated on scroll with framer-motion.

---

## Pre-requisites

| Dependency | Purpose | Install |
|---|---|---|
| `d3` | Core D3 data visualization library | `npm install d3` |
| `@types/d3` | TypeScript definitions for D3 | `npm install -D @types/d3` |

**Design constraint:** All charts use the existing Clinical Luxury palette (`#6c30c0`, `#9762ea`, `#cf1259`, `#09a5b6`, `#0a2540`, `#425466`) with smooth entry animations. Charts render client-side only.

---

## Wave 1: Chart Components

### Plan 01: Animated Donut Chart — Vaccination Coverage

```yaml
wave: 1
depends_on: []
files_created:
  - src/components/charts/VaccinationDonut.tsx
autonomous: true
```

<objective>
Build a reusable animated donut chart component that visualizes vaccination coverage breakdown by country (Nigeria, Kenya, Ethiopia, Ghana). The chart animates its arcs from zero on mount and displays the total count in the centre.
</objective>

<action>
1. Install dependencies: `npm install d3` and `npm install -D @types/d3`.
2. Create `src/components/charts/VaccinationDonut.tsx` as a `"use client"` component:
   - Accept `data` prop: `Array<{ label: string; value: number; color: string }>`.
   - Use `d3.arc()` and `d3.pie()` to compute arc paths.
   - Render an SVG with animated arc transitions via `useEffect` + D3 transitions.
   - Display total value in the center with a counting-up animation.
   - Style with Clinical Luxury colours and typography.
   - Include a legend beneath the chart with colour-coded labels.
3. Use `useRef` for the SVG container and `useEffect` for D3 bindings (idiomatic React + D3 pattern).
</action>

<verification>
- [ ] Donut renders with smooth arc-in animation on mount.
- [ ] Centre number counts up from 0 to total.
- [ ] Legend matches the arc colours.
</verification>

### Plan 02: Animated Bar Chart — Course Completions by Quarter

```yaml
wave: 1
depends_on: []
files_created:
  - src/components/charts/CompletionsBar.tsx
autonomous: true
```

<objective>
Build an animated horizontal bar chart that shows e-learning course completions by quarter, with bars that grow from left to right on mount.
</objective>

<action>
1. Create `src/components/charts/CompletionsBar.tsx` as a `"use client"` component:
   - Accept `data` prop: `Array<{ quarter: string; completions: number }>`.
   - Use `d3.scaleBand()` for the y-axis and `d3.scaleLinear()` for the x-axis.
   - Bars animate width from 0 to their final value with staggered delays.
   - Value labels appear at the end of each bar after animation.
   - Clinical Luxury styling: purple gradient bars, muted axis labels, no harsh gridlines.
   - Responsive: auto-resize via `ResizeObserver`.
</action>

<verification>
- [ ] Bars animate in with staggered delay (top → bottom).
- [ ] Chart resizes gracefully on window resize.
- [ ] Typography and colours match the page aesthetic.
</verification>

### Plan 03: Animated Line Chart — Impact Over Time

```yaml
wave: 1
depends_on: []
files_created:
  - src/components/charts/ImpactLine.tsx
autonomous: true
```

<objective>
Build an animated line chart showing cumulative program impact (pharmacists trained, patients reached) over time, with a path-drawing animation and interactive tooltip on hover.
</objective>

<action>
1. Create `src/components/charts/ImpactLine.tsx` as a `"use client"` component:
   - Accept `data` prop: `Array<{ date: string; pharmacists: number; patients: number }>`.
   - Two lines: one for pharmacists trained, one for patients reached.
   - Use `d3.line()` with `d3.curveMonotoneX` for smooth curves.
   - Path-drawing animation using SVG `stroke-dasharray` / `stroke-dashoffset` technique.
   - Hover crosshair with tooltip showing exact values at the cursor position.
   - Area fill beneath each line with low opacity gradient.
   - Responsive via `ResizeObserver`.
</action>

<verification>
- [ ] Lines draw themselves from left to right on mount.
- [ ] Hovering shows a crosshair and tooltip with date + values.
- [ ] Two distinct line colours with labelled legend.
</verification>

---

## Wave 2: Integration & Animation Triggers

### Plan 04: Integrate Charts into Data Insights Page

```yaml
wave: 2
depends_on: [01, 02, 03]
files_modified:
  - src/app/data-insights/page.tsx
  - src/app/data-insights/DataInsights.module.css
autonomous: true
```

<objective>
Add a new "Impact at a Glance" section to the data-insights page containing the three D3 chart components, wrapped in framer-motion `whileInView` triggers so they animate when scrolled into view. Include static sample data that represents realistic PharmaLink metrics.
</objective>

<action>
1. Update `src/app/data-insights/page.tsx`:
   - Add an "Impact at a Glance" section between the Dashboards section and the text content sections.
   - Import chart components via `next/dynamic` with `ssr: false`.
   - Define sample datasets:
     - **Donut**: Nigeria 45%, Kenya 28%, Ethiopia 18%, Ghana 9%.
     - **Bar**: Q1 2025 → Q4 2025 with quarterly completions.
     - **Line**: Monthly data points from Jan 2024 → Dec 2025.
   - Wrap each chart in `motion.div` with `whileInView={{ opacity: 1, y: 0 }}` and `viewport={{ once: true }}`.
   - Layout: 3-column grid on desktop (donut | bar | line), stacked on mobile.
2. Update `src/app/data-insights/DataInsights.module.css`:
   - Add styles for `.chartsSection`, `.chartsGrid`, `.chartCard`.
   - Each chart card gets a glassmorphism border, subtle shadow, and padding.
   - Responsive breakpoints for tablet (2-column) and mobile (single column).
</action>

<verification>
- [ ] All three charts render within styled cards on the data-insights page.
- [ ] Charts animate only when scrolled into viewport (not on page load).
- [ ] Layout is responsive: 3 cols → 2 cols → 1 col.
- [ ] Production build passes (`npx next build`).
- [ ] No SSR hydration errors from D3.
</verification>

---

## Canonical References

| File | Purpose |
|---|---|
| `src/app/data-insights/page.tsx` | Existing page to augment with D3 charts |
| `src/app/data-insights/DataInsights.module.css` | Existing CSS module to extend |
| `src/app/blog/Blog.module.css` | Grid lines + glassmorphism card reference |
| `src/app/community/page.module.css` | Chart-card layout reference |
