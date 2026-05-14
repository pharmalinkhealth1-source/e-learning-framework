# Phase 9: Community Hub Page — Plan

**Phase Goal:** Build a high-fidelity `/community` page matching the Clinical Luxury design system, providing a polished gateway for forum discussions and community engagement.

---

## Wave 1: Foundation — Route, Layout & CSS Module

### Plan 01: Create Community Page Route & CSS Module

```yaml
wave: 1
depends_on: []
files_modified:
  - src/app/community/page.tsx
  - src/app/community/page.module.css
autonomous: true
requirements_addressed: [REQ-FORUM-01]
```

<objective>
Create the `/community` route with the full page shell: Navbar, hero section with grid lines + radial glow, and Footer. Matches the blog/e-learning "Clinical Luxury" pattern exactly.
</objective>

<read_first>
- src/app/blog/page.tsx
- src/app/blog/Blog.module.css
- src/app/elearning/page.tsx
- src/app/elearning/page.module.css
- src/components/stripe/Navbar.tsx
</read_first>

<action>
1. Create `src/app/community/page.tsx` as a `"use client"` component:
   - Import Navbar, Footer, FooterCTA, MeshGradient from `@/components/stripe/`
   - Import styles from `./page.module.css`
   - Render structure: `<main>` → Navbar → heroBackground div → gridLinesContainer (4 lines via `[...Array(4)].map`) → hero section with MeshGradient background → content sections → FooterCTA → Footer
   - Hero content: eyebrow "Community", h1 "Connect. Collaborate. Advance.", subtitle "Join a growing network of pharmaceutical professionals sharing insights, solving challenges, and advancing healthcare across Africa."

2. Create `src/app/community/page.module.css`:
   - Copy the grid lines pattern from Blog.module.css (`.gridLinesContainer`, `.line`, `.line:first-child`, `::after` radial glow)
   - Use `max-width: calc(var(--hds-space-layout-content-maxWidth, 1080px) + 2px)` to match navbar alignment
   - Hero section: `min-height: 70vh`, centered content, brand purple eyebrow `#6c30c0`
   - Title: `font-size: 5rem`, `font-weight: 700`, `line-height: 1.05`, `letter-spacing: -0.04em`, `max-width: 18ch`
   - Include `.heroBackground` with radial gradients matching blog pattern but using purple tones: `radial-gradient(circle at 20% 30%, #6c30c015 0%, transparent 40%), radial-gradient(circle at 80% 70%, #9762ea15 0%, transparent 40%)`
   - Container: `max-width: calc(var(--hds-space-layout-content-maxWidth) + 2px)`, `margin: 0 auto`, `padding-inline: var(--hds-space-layout-content-margin)`
   - Responsive: title scales to `3.5rem` at `max-width: 768px`
</action>

<acceptance_criteria>
- `src/app/community/page.tsx` exists and contains `"use client"`
- `src/app/community/page.tsx` contains `className={styles.gridLinesContainer}`
- `src/app/community/page.tsx` contains `<Navbar />`
- `src/app/community/page.tsx` contains `<Footer />`
- `src/app/community/page.module.css` contains `.gridLinesContainer`
- `src/app/community/page.module.css` contains `radial-gradient`
- `src/app/community/page.module.css` contains `.line:first-child`
- Page renders at `/community` without errors
</acceptance_criteria>

<verification>
```bash
test -f src/app/community/page.tsx && echo "PASS: page exists" || echo "FAIL"
test -f src/app/community/page.module.css && echo "PASS: CSS exists" || echo "FAIL"
grep -q "gridLinesContainer" src/app/community/page.module.css && echo "PASS: grid lines" || echo "FAIL"
grep -q "radial-gradient" src/app/community/page.module.css && echo "PASS: glow" || echo "FAIL"
```
</verification>

<must_haves>
- Grid lines align with navbar solid borders (same max-width)
- Top-left white radial glow via `::after` pseudo-element
- Hero background with purple-tinted radial gradients
- Responsive typography
</must_haves>

---

## Wave 2: Content Sections — Discussions Feed & Stats

### Plan 02: Featured Discussions Section

```yaml
wave: 2
depends_on: [01]
files_modified:
  - src/app/community/page.tsx
  - src/app/community/page.module.css
autonomous: true
requirements_addressed: [REQ-FORUM-01]
```

<objective>
Add a featured discussions section that pulls from the Sanity `forumPost` schema (or renders static placeholders when no posts exist). Include a segmented category filter matching the blog page pattern.
</objective>

<read_first>
- src/app/blog/page.tsx (SegmentedControl pattern at lines 82-94)
- src/app/blog/Blog.module.css (SegmentedControl styles)
- src/app/forum/page.tsx (existing Sanity query)
- src/sanity/schemaTypes/forumPost.ts
- src/components/forum/PostCard.tsx
</read_first>

<action>
1. Add categories array: `["All Discussions", "Clinical Practice", "Regulatory Updates", "Supply Chain", "Professional Development", "Technology"]`

2. Add segmented control filter bar (styled like blog page):
   - `.segmentedControl` container with horizontal scrolling
   - `.segmentedButton` with `background: transparent`, `border: none`, `padding: 8px 16px`, `border-radius: 100px`, `font-size: 0.875rem`, `color: #425466`, `cursor: pointer`
   - `.segmentedButtonActive` with `background: #6c30c0`, `color: white`
   - useState for `activeCategory`

3. Add discussion cards grid (NOT reusing PostCard — create new CSS module classes):
   - `.discussionsGrid`: `display: grid`, `grid-template-columns: repeat(auto-fill, minmax(340px, 1fr))`, `gap: 24px`
   - `.discussionCard`: white background, `border: 1px solid var(--hds-color-surface-border-quiet)`, `border-radius: 16px`, `padding: 32px`, hover lift effect (`translateY(-4px)`, shadow)
   - Each card shows: category badge, title (h3, 1.25rem, 700 weight), excerpt (1rem, muted color), author row with avatar placeholder + name + date, reply count
   - Use static placeholder data array with 6 discussion entries covering different categories

4. Add section header: "Latest Discussions" with a "Start a Discussion" button (`.primaryBtn` with `#6c30c0` bg, `#4f2683` hover, pill shape)
</action>

<acceptance_criteria>
- `src/app/community/page.tsx` contains `segmentedControl` or `SegmentedControl`
- `src/app/community/page.tsx` contains `discussionsGrid` or `DiscussionsGrid`
- `src/app/community/page.module.css` contains `.discussionCard`
- `src/app/community/page.module.css` contains `.segmentedButton` or equivalent
- Discussion cards have hover transform effect in CSS
- "Start a Discussion" button uses `#6c30c0` background
</acceptance_criteria>

<verification>
```bash
grep -q "discussionCard\|DiscussionCard" src/app/community/page.module.css && echo "PASS: cards" || echo "FAIL"
grep -q "6c30c0" src/app/community/page.module.css && echo "PASS: brand purple" || echo "FAIL"
grep -q "Start a Discussion\|Start a discussion" src/app/community/page.tsx && echo "PASS: CTA" || echo "FAIL"
```
</verification>

### Plan 03: Community Stats & Member Spotlight

```yaml
wave: 2
depends_on: [01]
files_modified:
  - src/app/community/page.tsx
  - src/app/community/page.module.css
autonomous: true
requirements_addressed: [REQ-FORUM-01]
```

<objective>
Add a community metrics bar (members, discussions, countries) and a member spotlight section with profile cards, creating social proof and engagement incentive.
</objective>

<read_first>
- src/app/community/page.tsx (current state after Plan 01)
- src/app/community/page.module.css
- src/app/elearning/page.module.css (pillar card pattern)
</read_first>

<action>
1. Add community stats bar between hero and discussions:
   - `.statsBar`: `display: grid`, `grid-template-columns: repeat(3, 1fr)`, `gap: 1px`, `background: var(--hds-color-surface-border-quiet)`, `border-radius: 16px`, `overflow: hidden`, `margin-bottom: 64px`
   - `.statCard`: `background: white`, `padding: 40px 32px`, `text-align: center`
   - `.statNumber`: `font-size: 3rem`, `font-weight: 700`, `color: #6c30c0`, `letter-spacing: -0.02em`
   - `.statLabel`: `font-size: 1rem`, `color: var(--hds-color-foreground-lowContrast)`, `margin-top: 8px`
   - Stats: "2,400+" Members, "580+" Discussions, "12" Countries
   - Responsive: stack vertically at `max-width: 768px`

2. Add member spotlight section after discussions:
   - Section header: "Community Spotlight"
   - `.membersGrid`: `display: grid`, `grid-template-columns: repeat(4, 1fr)`, `gap: 24px`
   - `.memberCard`: `text-align: center`, `padding: 32px 24px`, white bg, `border-radius: 16px`, border, hover lift
   - Each card: avatar circle (64px, `background: linear-gradient(135deg, #6c30c0, #9762ea)` with initials), name (bold), role/title (muted), location (small)
   - 4 static placeholder members representing different African countries
   - Responsive: 2 columns at 1024px, 1 column at 640px
</action>

<acceptance_criteria>
- `src/app/community/page.module.css` contains `.statsBar`
- `src/app/community/page.module.css` contains `.statNumber`
- `src/app/community/page.module.css` contains `.memberCard`
- `src/app/community/page.module.css` contains `.membersGrid`
- Stats section shows 3 metric cards
- Member spotlight shows 4 profile cards
- Responsive breakpoints exist for both sections
</acceptance_criteria>

<verification>
```bash
grep -q "statsBar" src/app/community/page.module.css && echo "PASS: stats" || echo "FAIL"
grep -q "memberCard" src/app/community/page.module.css && echo "PASS: members" || echo "FAIL"
grep -c "@media" src/app/community/page.module.css | xargs -I{} test {} -ge 3 && echo "PASS: responsive" || echo "FAIL"
```
</verification>

<must_haves>
- Stats numbers use brand purple (#6c30c0)
- Member avatars use purple gradient
- All sections follow 8pt spacing grid
- Hover effects on all interactive cards
</must_haves>

---

## Wave 3: Polish & Integration

### Plan 04: Navbar Route Fix & Final Polish

```yaml
wave: 3
depends_on: [01, 02, 03]
files_modified:
  - src/components/stripe/Navbar.tsx
  - src/app/community/page.tsx
  - src/app/community/page.module.css
autonomous: true
requirements_addressed: [REQ-FORUM-01]
```

<objective>
Ensure the "Community" navbar link resolves correctly to `/community`, add framer-motion entrance animations, and verify the complete page builds without errors.
</objective>

<read_first>
- src/components/stripe/Navbar.tsx (line 96-99, route generation logic)
- src/app/community/page.tsx
- src/app/blog/page.tsx (motion animation patterns)
</read_first>

<action>
1. Verify Navbar routing: The current link generation at line 99 does:
   `href={/${item.toLowerCase().replace(/\s+/g, '-').replace('e-learning', 'elearning')}}`
   For "Community" this produces `/community` — which is correct. No change needed unless it differs.

2. Add framer-motion entrance animations to community page sections:
   - Import `{ motion }` from `framer-motion`
   - Hero content: `initial={{ opacity: 0, y: 20 }}`, `animate={{ opacity: 1, y: 0 }}`, `transition={{ duration: 0.6 }}`
   - Stats bar cards: staggered with `delay: i * 0.1`
   - Discussion cards: `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true }}`
   - Member cards: similar whileInView pattern

3. Add "Join the Conversation" subscribe/CTA section before FooterCTA:
   - `.joinSection`: `padding: 80px 0`, `background: linear-gradient(135deg, #6c30c010, #9762ea08)`, `border-top: 1px solid var(--hds-color-surface-border-quiet)`
   - Centered content: heading "Ready to Join the Conversation?", subtitle, email input + subscribe button (pill shape, same as blog subscribe pattern)
   - Input: `.emailInput` with `border: 1px solid var(--hds-color-surface-border-quiet)`, `border-radius: 100px`, `padding: 14px 24px`
   - Button: `.joinBtn` with `#6c30c0` bg, `#4f2683` hover

4. Run `npx next build` to verify no compilation errors.
</action>

<acceptance_criteria>
- Clicking "Community" in navbar navigates to `/community`
- `src/app/community/page.tsx` contains `from 'framer-motion'`
- `src/app/community/page.tsx` contains `motion.div` or `motion(` 
- `src/app/community/page.module.css` contains `.joinSection`
- `npx next build` completes without errors referencing community page
</acceptance_criteria>

<verification>
```bash
grep -q "framer-motion" src/app/community/page.tsx && echo "PASS: animations" || echo "FAIL"
grep -q "joinSection" src/app/community/page.module.css && echo "PASS: join CTA" || echo "FAIL"
# Navbar routing check
node -e "console.log('Community'.toLowerCase().replace(/\s+/g, '-'))" | grep -q "community" && echo "PASS: route" || echo "FAIL"
```
</verification>

<must_haves>
- No dead navbar links
- Smooth entrance animations (not jarring)
- Join CTA section with email capture
- Clean production build
</must_haves>
