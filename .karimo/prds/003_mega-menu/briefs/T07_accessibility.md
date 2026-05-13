# Task Brief: T07

**Title:** Accessibility
**PRD:** mega-menu
**Priority:** should
**Complexity:** 2/10
**Model:** sonnet
**Wave:** 5
**Feature Issue:** (see tasks.yaml)

---

## Objective

Add ARIA attributes and keyboard event handlers to the mega menu so it is operable without a mouse. Top-level triggers must communicate expanded state, keyboard users must be able to open panels with Enter/Space and close with Escape, and focus must return to the trigger after closing.

---

## Context

**Parent Feature:** Phase 13 — Mega Menu Navigation

This task runs in Wave 5, after T06 (mobile menu) is complete — both T06 and T07 edit `Navbar.tsx`, so they are serialised to avoid merge conflicts. T07 also edits `Megamenu.tsx` to add region roles.

**Focus trap (R12) is explicitly out of scope.** Do not implement a focus trap inside open panels.

Files to edit: `src/components/stripe/Navbar.tsx` and `src/components/stripe/Megamenu.tsx`.

---

## Requirements

### 1. ARIA on top-level triggers (`Navbar.tsx`)

Each of the 5 top-level nav `<button>` elements must have:
- `aria-haspopup="true"` — signals it controls a dropdown
- `aria-expanded={activeTab === item.id}` — reflects open/closed state dynamically
- `aria-controls={`panel-${item.id}`}` — links trigger to its panel

The `<nav>` element already has `id="navigation-menu"` — confirm `role="navigation"` is present (add if missing).

### 2. Keyboard handlers on triggers (`Navbar.tsx`)

Add `onKeyDown` to each top-level trigger button:

```tsx
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    setActiveTab(item.id);
  }
  if (e.key === 'Escape') {
    setActiveTab(null);
    e.currentTarget.focus();
  }
}}
```

Also add a document-level `keydown` listener (in the existing `useEffect` that handles Cmd+K for search) to close panel on Escape regardless of focus position:

```tsx
if (e.key === 'Escape' && activeTab) {
  setActiveTab(null);
}
```

### 3. Panel content roles (`Megamenu.tsx`)

On the inner content `<div>` (the one with `ref={activeContentRef}`), add:
- `role="region"`
- `aria-label={`${activeTab} navigation panel`}` 
- `id={`panel-${activeTab}`}`

### 4. Tab key behaviour

Tab between top-level nav items must work naturally — buttons are already focusable. Do NOT add custom Tab key logic. The browser's natural tab order through `<button>` elements is correct.

---

## Files to Edit

### `src/components/stripe/Navbar.tsx`

1. On each top-level trigger `<button>` (the ones that set `activeTab`), add:
   - `aria-haspopup="true"`
   - `aria-expanded={activeTab === item.id}`
   - `aria-controls={`panel-${item.id}`}`
   - `onKeyDown` handler (see above)

2. Confirm `<nav>` has `role="navigation"` — the element uses `className={styles.hdsNavigationMenu}` and `id="navigation-menu"`. Add `role="navigation"` if not present.

3. In the existing `useEffect` keydown listener (currently handles Cmd+K), add:
   ```tsx
   if (e.key === 'Escape' && activeTab) {
     setActiveTab(null);
   }
   ```
   Note: `activeTab` comes from useState — you'll need to include it in the effect's dependency array or use a ref pattern to avoid stale closure.

### `src/components/stripe/Megamenu.tsx`

On the `<div className={styles.dropdownContent} ref={activeContentRef}>` element, add:
- `role="region"`
- `aria-label={activeTab ? `${activeTab} navigation panel` : undefined}`
- `id={activeTab ? `panel-${activeTab}` : undefined}`

---

## Acceptance Criteria

- [ ] `aria-haspopup="true"` present on all 5 top-level trigger buttons
- [ ] `aria-expanded` reflects `activeTab === item.id` correctly (true when open, false when closed)
- [ ] Pressing `Enter` or `Space` on a focused trigger opens its panel
- [ ] Pressing `Escape` closes any open panel
- [ ] `role="region"` present on panel content div in Megamenu
- [ ] `role="navigation"` confirmed on nav element
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes

---

## Do Not

- Implement a focus trap (R12 is out of scope)
- Add `useMemo` or `useCallback` (React Compiler active)
- Touch any files other than `Navbar.tsx` and `Megamenu.tsx`
- Touch `src/styles/tokens.css`, `src/middleware.ts`, or `.env*`
- Add custom Tab key interception — browser native tab order is correct

---

## Validation

```bash
npx tsc --noEmit
npm run lint
```

Manual: Tab to a trigger → Enter opens panel → Escape closes → focus returns to trigger.
