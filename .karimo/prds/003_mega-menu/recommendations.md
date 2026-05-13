# PRD Review: 003_mega-menu — Pre-Execution Findings
Generated: 2026-05-13
Reviewer: KARIMO Brief Reviewer (claude-sonnet-4-6)

---

## Critical Findings

---

### C1 — T03/T02: No task wires panel components into Navbar.tsx

**brief_file: T02_navbar-rewire.md, T03_panel-content-components.md**

T02 builds `const tabs = NAV_DATA.map(item => ({ id, label, content: <div>{item.label} panel — coming in T03</div> }))` in `Navbar.tsx` and states "T03 will replace these placeholder content values." However, T03's `files_affected` in `tasks.yaml` contains only `src/components/stripe/Megamenu.tsx`. T03's brief explicitly lists `Navbar.tsx` under "Files You MUST NOT Touch." No subsequent task (T06 adds hamburger only, T07 adds ARIA only) ever imports `AboutUsPanel`, `CommunityPanel`, etc. and passes them into the `tabs` array in `Navbar.tsx`.

**Result:** The mega menu panels will render `<div>Community panel — coming in T03</div>` indefinitely. The panels are never connected to the content components T03 creates.

**Fix:** Add `src/components/stripe/Navbar.tsx` to T03's `files_affected` in `tasks.yaml`. Add a requirement to T03_panel-content-components.md: "After exporting the five panel components, update `Navbar.tsx` to import `{ AboutUsPanel, CommunityPanel, DataInsightsPanel, PodcastPanel, ContactUsPanel }` from `./Megamenu` and replace the placeholder `content` values in the `tabs` array with the real components." Remove the `Navbar.tsx` entry from T03's "Files You MUST NOT Touch" section (replace it with "modify only the tabs array — do not touch hover state or other logic").

---

### C2 — T06: Recommended mobile overlay z-index (1050) is HIGHER than SearchModal (1000), not lower

**brief_file: T06_mobile-responsive.md:38–43**

T06 brief states: "The mobile overlay must have a lower z-index than SearchModal so the search overlay appears above it." Then immediately recommends `z-index: 1050` for the overlay and `z-index: 1049` for the backdrop. The actual `SearchModal.module.css:9` shows `.overlay { z-index: 1000 }`. A value of 1050 is higher than 1000 — the mobile menu would cover the search modal, directly contradicting the stated requirement.

**Actual state:** `src/components/search/SearchModal.module.css` line 9: `z-index: 1000`.

**Fix:** Update T06_mobile-responsive.md to correct the recommended values. Change overlay z-index to `999` (below SearchModal's 1000) or alternatively document that the design intent is for the mobile menu to sit below the search modal and use a value of `1020` only if SearchModal is intentionally raised to 1100+. The simplest correct fix: set mobile overlay to `z-index: 999`, backdrop to `z-index: 998`. Update the MobileMenu.module.css snippet in the brief accordingly. Also update the hamburger button recommendation from `z-index: 1002` to a value consistent with navbar context (or remove — it's inside the navbar which is already z-index: 1000, so `z-index: 1001` is safe there).

---

### C3 — T06: `.hamburgerItem` CSS class referenced in JSX but not defined in CSS snippet

**brief_file: T06_mobile-responsive.md:137**

T06's Navbar.tsx implementation snippet uses `className={\`${styles.navigationItem} ${styles.hamburgerItem}\`}` on the `<li>` wrapping the hamburger button. The Navbar.module.css CSS snippet in the same brief defines `.hamburger`, `.hamburgerBar`, and the `@media` rules — but `.hamburgerItem` is absent. CSS Modules will generate an `undefined` class name at runtime, which will not cause a crash but will emit a TypeScript/linter warning and means no styles will apply to that class.

**Fix:** Add to the Navbar.module.css additions in T06_mobile-responsive.md:
```css
.hamburgerItem {
  display: none;
}
@media (max-width: 940px) {
  .hamburgerItem {
    display: flex;
  }
}
```
Alternatively, remove `styles.hamburgerItem` from the JSX and rely solely on `.hamburger { display: none }` / `@media { display: flex }` to control visibility — the `<li>` wrapping it can keep just `styles.navigationItem`.

---

### C4 — T01: Featured card `ctaHref: "/contact-us"` correct, but Navbar.tsx "Get Started" CTA uses `/contact` (non-existent route)

**brief_file: T01_nav-data-structure.md:130 and T02_navbar-rewire.md:198**

T01 correctly specifies `ctaHref: "/contact-us"` for the Contact Us featured card. The route `src/app/contact-us/` exists. However, the existing `Navbar.tsx` line 147 links the "Get Started" CTA to `href="/contact"`, which has NO corresponding route directory (`src/app/contact/` does not exist). T02's brief preserves this button unchanged ("Existing ThemeToggle, SearchModal trigger, RotatingAuthButton preserved"). This means T02 will silently carry forward a broken link.

**Fix:** Add a note to T02_navbar-rewire.md under "Implementation Guidance": "The existing 'Get Started' CTA at the bottom of `navigationButtons` currently links to `/contact` which does not have a route directory. Update `href` to `/contact-us` to match the existing `src/app/contact-us/` route." Update T02's success criteria to include: `"Get Started" CTA links to /contact-us`.

---

## Warnings

---

### W1 — T04/T03: `.featuredCardTitle` and `.featuredCardDescription` defined in T04's CSS replacement but absent from T04's success criteria checklist

**brief_file: T04_megamenu-css-overhaul.md:372 / T03_panel-content-components.md:159**

T03's implementation example uses `styles.featuredCardTitle` and `styles.featuredCardDescription`. Both classes are present in T04's full CSS replacement block (lines 271–283 of brief), so they will exist at runtime. However, T04's acceptance criteria checklist (line 372) only lists `.featuredCard`, `.featuredCardImage`, `.featuredCardBody`, `.featuredCardCta` — omitting `.featuredCardTitle` and `.featuredCardDescription`. If T04 is reviewed against its own checklist, the agent may not verify these two classes are present.

**Fix:** Add to T04's success criteria checklist: `- [ ] .featuredCardTitle and .featuredCardDescription classes defined in Megamenu.module.css`.

---

### W2 — T05: Spotify `<iframe>` requires `frameBorder="0"` attribute; inline `border: 'none'` style may not fully suppress iframe border in all browsers

**brief_file: T05_podcast-page.md:163**

T05's implementation uses `style={{ borderRadius: '12px', border: 'none' }}` on the `<iframe>`. Some browsers render a visible 2px border on iframes unless `frameBorder="0"` is also set as an HTML attribute. For Spotify embeds specifically, omitting `frameBorder="0"` can produce a hairline border on Safari. This is a minor visual regression risk.

**Fix:** Add `frameBorder="0"` to the iframe props in the T05 implementation guidance, alongside the existing `style` prop.

---

### W3 — T07: `activeTab` stale closure in `useEffect` Cmd+K listener — brief acknowledges issue but leaves resolution vague

**brief_file: T07_accessibility.md:97–98**

T07's requirement adds `if (e.key === 'Escape' && activeTab) { setActiveTab(null); }` inside the existing `useEffect` keydown listener (which currently only handles Cmd+K and has an empty dependency array `[]`). The brief notes "you'll need to include it in the effect's dependency array or use a ref pattern." Leaving this decision to the executing agent risks inconsistent implementation. Adding `activeTab` to the dependency array will cause the event listener to re-register on every tab hover, which is wasteful. A ref pattern is cleaner but requires more code change.

**Fix:** Update T07_accessibility.md to prescribe the specific approach: "Use a `useRef` to hold `activeTab` for the keydown handler to avoid re-registering the event listener. Add `const activeTabRef = useRef(activeTab); useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);` and check `activeTabRef.current` inside the keydown handler. This avoids adding `activeTab` to the Cmd+K listener's dependency array."

---

### W4 — T02: `.section` class referenced on `<header>` in current `Navbar.tsx` is not defined in `Navbar.module.css` (pre-existing bug that T02 preserves)

**brief_file: T02_navbar-rewire.md (implicit — preserves existing file structure)**

`Navbar.tsx` line 95 uses `className={\`${styles.navigation} ${styles.section}\`}` on the `<header>` element. `Navbar.module.css` defines `.navigation` but has no `.section` class (only `.sectionContainer`). CSS Modules will silently apply `undefined` for `.section`. This pre-dates the briefs and T02 does not introduce it, but T02 preserves the structure without flagging it.

**Fix:** Add a note in T02_navbar-rewire.md: "Note: the `<header>` currently applies `styles.section` which is not defined in `Navbar.module.css`. Remove `${styles.section}` from the header className when rewriting the component — it has no effect and adds confusion."

---

### W5 — T05: `--hds-font-weight-bold` token resolves to `400` (not a bold weight), used for `<h1>` and `<h2>` headings

**brief_file: T05_podcast-page.md:237, T05_podcast-page.md:267**

`tokens.css` line 28 defines `--hds-font-weight-bold: 400`. The T05 page.module.css uses this token for `.title` (h1) and `.sectionHeading` (h2). At runtime, headings will render at `font-weight: 400` which is regular weight, not visually bold. This is an existing project convention (the token name is misleading) and is not a T05-specific bug, but the executing agent should be aware the heading will not appear bold in the traditional sense.

**Fix (optional):** Add a comment in T05_podcast-page.md implementation guidance: "Note: `--hds-font-weight-bold` is `400` in this project's token system — this is intentional. IBM Plex Sans at 400 with the heading size is the established project style."

---

## Observations

---

### O1 — T04: `--hds-space-core-800` used in legacy `.pane` class (64px) — token exists and is correct

T04's CSS replacement keeps the legacy `.pane` class and uses `var(--hds-space-core-800)` for the gap. This token is confirmed defined in `tokens.css` line 15 as `64px`. No issue.

---

### O2 — T01: `/sign-up` href in About Us featured card resolves correctly via Clerk's `(auth)` route group

T01 specifies `ctaHref: "/sign-up"` for the About Us featured card. The Clerk sign-up route is at `src/app/(auth)/sign-up/[[...sign-up]]/` which App Router exposes at the URL `/sign-up`. The path is correct.

---

### O3 — T04: `[data-theme='dark'] .dropdownContainer` already existed in old CSS with `--hds-color-nav-bg`

The existing `Megamenu.module.css` has a dark mode rule using `--hds-color-nav-bg` which resolves to `--hds-color-surface-bg-quiet`. T04's replacement uses `--hds-color-surface-bg-quiet` directly — semantically identical. T04 correctly resolves this.

---

### O4 — T06 / T07: `MobileMenu.tsx` already adds `aria-expanded` on accordion triggers and `aria-modal` on the overlay

T06's implementation includes `aria-expanded={openItem === item.id}` on accordion buttons and `role="dialog" aria-modal="true"` on the overlay. T07 does not need to revisit these — they are already present in T06's template. T07's brief does not mistakenly ask T07 to duplicate this work. No conflict.

---

### O5 — T04: `--hds-color-nav-bg` is not defined in dark mode `:root[data-theme='dark']` block

`tokens.css` dark mode block (lines 168–208) overrides `--hds-color-surface-bg-quiet` but does NOT re-declare `--hds-color-nav-bg`. Since `--hds-color-nav-bg` is defined in `:root` as `var(--hds-color-surface-bg-quiet)`, it will cascade and pick up the dark override of `--hds-color-surface-bg-quiet` anyway. This is correct CSS custom property behaviour — no action needed.

---

### O6 — Tasks.yaml file order vs wave order: T04 listed before T03 in yaml

`tasks.yaml` lists tasks in order: T01, T02, T04, T03, T05, T06, T07. Numeric IDs skip from T02 to T04, then back to T03. This is not a bug — wave ordering governs execution, not yaml order. The orchestrator should use `wave:` fields. No issue, but worth noting for manual reading.

---

## Summary

**Critical: 4 | Warnings: 5 | Observations: 6**

**Status: HOLD — C1 and C3 are execution-blocking. C2 produces an incorrect z-index that violates the stated requirement. C4 introduces a broken link that T02 will hard-code into the codebase.**

### Mandatory fixes before execution:

| ID | Task | Fix Required |
|----|------|-------------|
| C1 | T02 + T03 | Add Navbar.tsx to T03 files_affected; assign panel-wiring responsibility explicitly |
| C2 | T06 | Correct overlay z-index from 1050 to 999 (SearchModal is 1000) |
| C3 | T06 | Define `.hamburgerItem` CSS class in the Navbar.module.css snippet, or remove it from the JSX |
| C4 | T02 | Change "Get Started" CTA href from `/contact` to `/contact-us` |
