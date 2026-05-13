# Task Brief: T02

**Title:** Navbar rewire
**PRD:** mega-menu
**Priority:** must
**Complexity:** 3/10
**Model:** sonnet
**Wave:** 2
**Feature Issue:** (see tasks.yaml)

---

## Objective

Replace the flat 9-item link array in `Navbar.tsx` with the 5 top-level items from `NAV_DATA`, add hover state management, and wire the existing `Megamenu` component so panels open on hover and close after a 150ms debounce on mouseleave. All existing UI elements (ThemeToggle, SearchModal, RotatingAuthButton, "Get Started" CTA) must be preserved exactly.

---

## Context

**Parent Feature:** Phase 13 — Mega Menu Navigation

The current `Navbar.tsx` renders a flat array of 9 string labels using `.map()` into `<Link>` elements. After this task, it renders 5 top-level `<button>` triggers that manage hover state and open/close the `Megamenu` component. The `Megamenu` component already exists and accepts `activeTab` + `tabs` props.

This task is part of **Wave 2** — it depends on T01 (nav data) being complete. T03 (panel content components) runs in Wave 3 and depends on this task. T06 (mobile) runs in Wave 4 and also depends on this task.

**Do NOT touch `Megamenu.tsx` in this task** — that is T03's responsibility. The `layoutId` bug fix specifically belongs to T03.

---

## Context: Current Navbar.tsx State

The current flat nav link array (lines 113–123 of `src/components/stripe/Navbar.tsx`):
```tsx
{['About Us', 'Community', 'Careers', 'Directory', 'e-Learning', 'Data Insights', 'Podcast', 'Blog', 'Contact Us'].map((item) => (
  <li key={item} className={styles.navigationItem}>
    <Link 
      href={`/${item.toLowerCase().replace(/\s+/g, '-').replace('e-learning', 'elearning')}`} 
      className={`${styles.hdsButton} ${styles.hdsNavigationMenuTrigger} ${styles.hdsButtonTransparent}`}
    >
      {item}
    </Link>
  </li>
))}
```

This entire block must be replaced.

---

## Requirements

1. Import `NAV_DATA` and `NavItem` from `src/lib/nav-data.ts`.
2. Import the `Megamenu` component from `./Megamenu`.
3. Add `activeTab` state: `const [activeTab, setActiveTab] = useState<string | null>(null)`.
4. Add a `closeTimer` ref: `const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)`.
5. Implement `handleMouseEnter(id: string)` — clears any pending close timer, sets `activeTab` to the item id.
6. Implement `handleMouseLeave()` — sets a 150ms timeout that calls `setActiveTab(null)`.
7. Replace the `.map()` flat link list with a `.map()` over `NAV_DATA` rendering `<button>` elements (not `<Link>`) as triggers.
8. Each trigger button: `onMouseEnter={() => handleMouseEnter(item.id)}`, `onMouseLeave={handleMouseLeave}`.
9. Render `<Megamenu>` below the `<ul>` inside the nav, passing `activeTab` and a `tabs` array built from `NAV_DATA`.
10. The `Megamenu` wrapper div also needs `onMouseEnter` / `onMouseLeave` handlers to prevent premature close (see Implementation Guidance).
11. **No `useMemo` or `useCallback`** — React Compiler is active.
12. The `<nav>` element must retain `id="navigation-menu"` and `className={styles.hdsNavigationMenu}`.

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] Navbar renders exactly 5 top-level items: About Us, Community, Data Insights, Podcast, Contact Us
- [ ] Each trigger is a `<button>` element (not `<Link>`), with `onMouseEnter` and `onMouseLeave` wired
- [ ] Hovering any item sets `activeTab` and `Megamenu` is rendered
- [ ] Moving mouse off trigger starts 150ms timer; moving into Megamenu panel cancels the timer
- [ ] Moving mouse off both trigger and panel after 150ms closes the panel
- [ ] No `useMemo` or `useCallback` anywhere in the file
- [ ] ThemeToggle still renders
- [ ] SearchModal trigger still renders (search icon button + Cmd+K listener)
- [ ] RotatingAuthButton still renders
- [ ] "Get Started" CTA button still renders
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/stripe/Navbar.tsx` | modify | Replace flat link list with 5 hover-triggered mega menu triggers |
| `src/components/stripe/Navbar.module.css` | modify | Add `.megamenuWrapper` positioning class if needed |

### File Ownership Notes

`Navbar.tsx` is also touched by T06 (mobile) and T07 (accessibility). T02 sets the base structure; T06 adds hamburger logic; T07 adds ARIA attributes. These are sequential — ensure T02 does not leave hardcoded ARIA attributes that T07 would need to revise.

---

## Implementation Guidance

### Hover State Pattern

The key challenge is preventing accidental panel close when the mouse moves from the trigger into the panel. Use a single ref-based timer:

```tsx
const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

const handleMouseEnter = (id: string) => {
  if (closeTimer.current) clearTimeout(closeTimer.current);
  setActiveTab(id);
};

const handleMouseLeave = () => {
  closeTimer.current = setTimeout(() => setActiveTab(null), 150);
};
```

Apply both `onMouseEnter` and `onMouseLeave` to both the nav list AND the Megamenu wrapper:

```tsx
<div
  onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }}
  onMouseLeave={handleMouseLeave}
>
  <Megamenu activeTab={activeTab} tabs={tabs} />
</div>
```

### Building the `tabs` prop

The `Megamenu` component expects:
```tsx
tabs: { id: string; label: string; content: React.ReactNode }[]
```

For Wave 2, the panel content components (AboutUsPanel etc.) do not yet exist — T03 creates them. Use placeholder content for now so the wiring can be tested:

```tsx
const tabs = NAV_DATA.map(item => ({
  id: item.id,
  label: item.label,
  content: <div>{item.label} panel — coming in T03</div>,
}));
```

T03 will replace these placeholder `content` values.

### Trigger Button Structure

Replace the flat `.map()` block with:

```tsx
{NAV_DATA.map((item) => (
  <li key={item.id} className={styles.navigationItem}>
    <button
      className={`${styles.hdsButton} ${styles.hdsNavigationMenuTrigger} ${styles.hdsButtonTransparent}`}
      onMouseEnter={() => handleMouseEnter(item.id)}
      onMouseLeave={handleMouseLeave}
    >
      {item.label}
    </button>
  </li>
))}
```

### Megamenu Positioning

The `Megamenu` component's `.dropdownWrapper` uses `position: absolute; top: 100%; left: 0`. It must be placed inside the `sectionContainer` div (the one with `position: relative`) so it anchors to the full nav width. Check that `.sectionContainer` in `Navbar.module.css` has `position: relative` — it already does.

Place the Megamenu wrapper immediately after the `<ul>` inside the `<nav>`:

```tsx
<nav className={styles.hdsNavigationMenu} id="navigation-menu">
  <Link href="/" ...>...</Link>

  <div className={styles.navigationMenuContent}>
    <ul ...>
      {NAV_DATA.map(...)}
    </ul>
  </div>

  <div
    onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }}
    onMouseLeave={handleMouseLeave}
  >
    <Megamenu activeTab={activeTab} tabs={tabs} />
  </div>

  <ul className={styles.navigationButtons}>
    ...existing buttons...
  </ul>
</nav>
```

### Existing Imports to Keep

The following imports must remain in `Navbar.tsx`:
- `useState`, `useEffect` from `react` (add `useRef`)
- `Link` from `next/link`
- `Image` from `next/image`
- `styles` from `./Navbar.module.css`
- `ThemeToggle` from `./ThemeToggle`
- `SearchModal` from `../search/SearchModal`

Add:
- `useRef` to the React import
- `Megamenu` from `./Megamenu`
- `NAV_DATA` and `NavItem` from `@/lib/nav-data` (or `../../lib/nav-data` — use the `@/` path alias)

### PLATFORMS Array and RotatingAuthButton

The `PLATFORMS` array and `RotatingAuthButton` component at the top of the file are completely unchanged. Do not modify them.

### CSS Notes

The `@media (max-width: 940px)` rule in `Navbar.module.css` already hides `.navigationMenuContent`. No new breakpoint CSS is needed in this task — T06 handles mobile.

If the Megamenu panel visually overflows outside the nav container, add to `Navbar.module.css`:

```css
.megamenuWrapper {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 999;
}
```

And wrap `<Megamenu>` with `<div className={styles.megamenuWrapper}>`.

### React Compiler Constraint

Do NOT add `useMemo` or `useCallback`. The React Compiler handles memoisation automatically. Simple inline handlers and plain arrays are correct.

---

## Boundaries

### Files You MUST NOT Touch

- `package-lock.json`
- `.env` / `.env*`
- `src/sanity/lib/client.ts`
- `src/middleware.ts`
- `src/styles/tokens.css`
- `src/components/stripe/Megamenu.tsx` — T03's responsibility
- `src/components/stripe/Megamenu.module.css` — T04's responsibility

### Files Requiring Review

None of the files in this task are in the `require_review` list.

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|------------------|------------------------|
| T01 | `src/lib/nav-data.ts` with `NAV_DATA` and interfaces | Run `npx tsc --noEmit` — it must pass; check `src/lib/nav-data.ts` exists |

### Downstream Impact

Tasks that depend on this one: **T03** (panel content, Wave 3), **T06** (mobile, Wave 4), **T07** (accessibility, Wave 5)

---

## GitHub Context

**Branch:** `worktree/mega-menu-T02`
**Target:** main

---

## Commit Guidelines

```
feat(navbar): rewire flat nav to 5-item mega menu triggers

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:
- [ ] All success criteria met
- [ ] `npm run build` passes
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] No `never_touch` files modified
- [ ] `Megamenu.tsx` not modified
- [ ] `tokens.css` not modified

---

*Generated by KARIMO Brief Writer*
*PRD: mega-menu | Task: T02 | Wave: 2*
