# Task Brief: T03

**Title:** Panel content components
**PRD:** mega-menu
**Priority:** must
**Complexity:** 3/10
**Model:** sonnet
**Wave:** 3
**Feature Issue:** (see tasks.yaml)

---

## Objective

Replace the three placeholder panel exports in `Megamenu.tsx` with five real PharmaLink panel components (`AboutUsPanel`, `CommunityPanel`, `DataInsightsPanel`, `PodcastPanel`, `ContactUsPanel`), each consuming `NAV_DATA` and rendering a Stripe-fidelity column grid with sub-links and a featured card. Also remove the `layoutId="dropdown-container"` attribute from the `motion.div` to fix an unmount animation glitch.

---

## Context

**Parent Feature:** Phase 13 — Mega Menu Navigation

`Megamenu.tsx` currently exports three placeholder components (`ProductsContent`, `SolutionsContent`, `DevelopersContent`) that contain hardcoded Stripe demo content. These must be fully replaced. The CSS classes used by the panel components (`.columnGrid`, `.columnHeader`, `.navLink`, etc.) are defined by T04 in `Megamenu.module.css`. T03 runs in Wave 3, after T04 completes.

This task is part of **Wave 3** — depends on T01 (data) and T04 (CSS classes). T06 and T07 depend on this task being done.

---

## Critical Bug to Fix: layoutId Removal

**The `layoutId="dropdown-container"` prop on the outer `motion.div` in the `Megamenu` component causes an unmount animation glitch.** When the panel switches between tabs, Framer Motion tries to animate a shared layout transition on the container while simultaneously animating the exit — this produces a jarring visual artifact.

**Fix:** Remove only the `layoutId` prop. Keep all other animation props.

Current (lines 33–40 of `Megamenu.tsx`):
```tsx
<motion.div
  layoutId="dropdown-container"          // <-- REMOVE THIS LINE
  className={styles.dropdownContainer}
  initial={{ opacity: 0, y: -10, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: -10, scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
  ...
>
```

After fix:
```tsx
<motion.div
  className={styles.dropdownContainer}
  initial={{ opacity: 0, y: -10, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: -10, scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
  ...
>
```

---

## Requirements

1. Import `NAV_DATA`, `NavItem`, `NavColumn`, `NavLink`, `FeaturedCard` from `@/lib/nav-data`.
2. Import `Link` from `next/link`.
3. Import `styles` from `./Megamenu.module.css`.
4. Export five named panel components. Each receives no props — they read directly from `NAV_DATA` by `id`.
5. Each panel renders: a `<div className={styles.columnGrid}>` containing one `<div className={styles.column}>` per `NavColumn`, plus one `<div className={styles.featuredCard}>` as the rightmost column.
6. Each column renders: a `<p className={styles.columnHeader}>` for the heading, then a list of sub-links.
7. Each sub-link renders as a `<Link>` with two children: `<span className={styles.navLinkTitle}>` and `<span className={styles.navLinkDescriptor}>`.
8. The `FeaturedCard` renders: title, description, and a `<Link>` CTA with label.
9. `ContactUsPanel` has no sub-link columns — only the featured card.
10. Remove `layoutId="dropdown-container"` from the `motion.div` in the `Megamenu` component (the default export function at the top of the file).
11. Remove all three placeholder exports: `ProductsContent`, `SolutionsContent`, `DevelopersContent`.
12. No `useMemo`, `useCallback`, or React state in the panel components — they are pure render functions.

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `AboutUsPanel`, `CommunityPanel`, `DataInsightsPanel`, `PodcastPanel`, `ContactUsPanel` all exported from `Megamenu.tsx`
- [ ] All panel sub-links consume `NAV_DATA` — no hardcoded label/href strings in JSX
- [ ] All 5 panels render a `FeaturedCard`
- [ ] `ContactUsPanel` renders no sub-link columns (featured card only)
- [ ] `ProductsContent`, `SolutionsContent`, `DevelopersContent` exports removed
- [ ] `layoutId="dropdown-container"` removed from the `motion.div` in `Megamenu` component
- [ ] No browser console warnings about duplicate keys or undefined props on panel open/close
- [ ] All 5 panel components imported in `Navbar.tsx` and passed to `Megamenu` `tabs` prop (no placeholder content remains)
- [ ] `npx tsc --noEmit` passes

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/stripe/Megamenu.tsx` | modify | Replace placeholder exports with 5 real panel components; fix layoutId |
| `src/components/stripe/Navbar.tsx` | modify | Import real panel components and replace placeholder tabs content |

### File Ownership Notes

This is the only task that modifies `Megamenu.tsx`. T02 wires it from Navbar; T07 adds ARIA attributes to it. Ensure the `Megamenu` default export component signature is unchanged: `MegamenuProps` interface with `activeTab: string | null` and `tabs: { id: string; label: string; content: React.ReactNode }[]`.

---

## Implementation Guidance

### CSS Classes Available (defined by T04)

T04 defines the following classes in `Megamenu.module.css`. Use them exactly as listed — do not add new classes in this task.

| Class | Purpose |
|-------|---------|
| `.section` | Outer wrapper for panel content area |
| `.columnGrid` | CSS Grid container for all columns including featured card |
| `.column` | Single content column wrapper |
| `.columnHeader` | Column heading (uppercase, xs text, primary colour) |
| `.columnSeparator` | Optional horizontal rule under column header |
| `.navLink` | `<Link>` wrapper for each sub-link item |
| `.navLinkTitle` | Bold title text within a sub-link |
| `.navLinkDescriptor` | Muted one-line descriptor below title |
| `.featuredCard` | Featured card column wrapper |
| `.featuredCardImage` | Optional image/icon area at top of card |
| `.featuredCardBody` | Card text content area |
| `.featuredCardCta` | CTA link at bottom of card |

### Panel Implementation Pattern

Use a helper approach to avoid repeating the same JSX structure. Example of a fully-wired panel:

```tsx
import Link from 'next/link';
import { NAV_DATA } from '@/lib/nav-data';
import styles from './Megamenu.module.css';

export const CommunityPanel = () => {
  const item = NAV_DATA.find(n => n.id === 'community')!;
  const { featuredCard } = item;

  return (
    <div className={styles.section}>
      <div className={styles.columnGrid}>
        {item.columns.map(col => (
          <div key={col.heading} className={styles.column}>
            <p className={styles.columnHeader}>{col.heading}</p>
            {col.links.map(link => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
                <span className={styles.navLinkTitle}>{link.label}</span>
                <span className={styles.navLinkDescriptor}>{link.descriptor}</span>
              </Link>
            ))}
          </div>
        ))}

        <div className={styles.featuredCard}>
          <div className={styles.featuredCardBody}>
            <p className={styles.featuredCardTitle}>{featuredCard.title}</p>
            <p className={styles.featuredCardDescription}>{featuredCard.description}</p>
          </div>
          <Link href={featuredCard.ctaHref} className={styles.featuredCardCta}>
            {featuredCard.ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
};
```

Apply the same pattern for `AboutUsPanel`, `DataInsightsPanel`, `PodcastPanel`.

### Wire into Navbar.tsx

After exporting the 5 panel components from `Megamenu.tsx`, open `Navbar.tsx` and replace the placeholder `tabs` array with real panel components.

Add the following imports at the top of `Navbar.tsx`:

```tsx
import { AboutUsPanel, CommunityPanel, DataInsightsPanel, PodcastPanel, ContactUsPanel } from '@/components/stripe/Megamenu';
```

Then define a panel map before the component return (or inline in the `tabs` build):

```tsx
const PANEL_MAP: Record<string, React.ReactNode> = {
  'about-us': <AboutUsPanel />,
  'community': <CommunityPanel />,
  'data-insights': <DataInsightsPanel />,
  'podcast': <PodcastPanel />,
  'contact-us': <ContactUsPanel />,
};
```

Replace the placeholder `tabs` array (the one with `content: <div>{item.label} panel — coming in T03</div>`) with:

```tsx
const tabs = NAV_DATA.map(item => ({
  id: item.id,
  label: item.label,
  content: PANEL_MAP[item.id],
}));
```

Do not touch any other part of `Navbar.tsx` — preserve hover state, close timer, event handlers, ThemeToggle, SearchModal, RotatingAuthButton, and "Get Started" CTA exactly as T02 left them.

### ContactUsPanel (no columns)

```tsx
export const ContactUsPanel = () => {
  const item = NAV_DATA.find(n => n.id === 'contact-us')!;
  const { featuredCard } = item;

  return (
    <div className={styles.section}>
      <div className={styles.columnGrid}>
        <div className={styles.featuredCard}>
          <div className={styles.featuredCardBody}>
            <p className={styles.featuredCardTitle}>{featuredCard.title}</p>
            <p className={styles.featuredCardDescription}>{featuredCard.description}</p>
          </div>
          <Link href={featuredCard.ctaHref} className={styles.featuredCardCta}>
            {featuredCard.ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
};
```

### Existing Megamenu Default Export

The `Megamenu` component (default export) at lines 12–63 must remain functionally identical except for removing `layoutId`. The `dimensions` state and `activeContentRef` logic can remain — they enable the container width/height transition.

### Existing .pane / .sectionTitle / .list Classes

The old placeholder components used `.pane`, `.section`, `.sectionTitle`, `.list` classes. Once the placeholder exports are removed, these old CSS classes become dead code. Do NOT delete them from the CSS (T04 manages the CSS file) — just stop referencing them from new components.

### No React Compiler Violations

Panel components are pure functions — no hooks needed. Do not add `useState`, `useEffect`, `useMemo`, or `useCallback` to any panel component.

---

## Boundaries

### Files You MUST NOT Touch

- `package-lock.json`
- `.env` / `.env*`
- `src/sanity/lib/client.ts`
- `src/middleware.ts`
- `src/styles/tokens.css`
- `src/components/stripe/Navbar.tsx` — modify only the `tabs` array to import and pass the real panel components; do not touch hover state, event handlers, or any other logic
- `src/components/stripe/Megamenu.module.css` — T04's responsibility (already done)
- `src/lib/nav-data.ts` — T01's responsibility (read-only for T03)

### Files Requiring Review

None of the files in this task are in the `require_review` list.

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|------------------|------------------------|
| T01 | `src/lib/nav-data.ts` — `NAV_DATA`, all interfaces | Check file exists: `ls src/lib/nav-data.ts`; run `npx tsc --noEmit` |
| T04 | CSS classes in `Megamenu.module.css` | Check that `.columnGrid`, `.navLink`, `.featuredCard` are defined in the CSS file |

### Downstream Impact

Tasks that depend on this one: **T06** (mobile, Wave 4), **T07** (accessibility, Wave 5)

---

## GitHub Context

**Branch:** `worktree/mega-menu-T03`
**Target:** main

---

## Commit Guidelines

```
feat(megamenu): add PharmaLink panel components, remove layoutId glitch

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
- [ ] `tokens.css` not modified
- [ ] `Megamenu.module.css` not modified
- [ ] `nav-data.ts` not modified

---

*Generated by KARIMO Brief Writer*
*PRD: mega-menu | Task: T03 | Wave: 3*
