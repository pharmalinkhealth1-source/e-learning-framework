# Task Brief: T06

**Title:** Mobile responsive
**PRD:** mega-menu
**Priority:** must
**Complexity:** 5/10
**Model:** opus
**Wave:** 4
**Feature Issue:** (see tasks.yaml)

---

## Objective

Build a full-screen mobile menu overlay from scratch, triggered by a hamburger icon button that appears at ≤940px. The overlay contains 5 accordion items driven by `NAV_DATA`, with Framer Motion animation for open/close. Z-index must not conflict with the existing `SearchModal`. No `useMemo` or `useCallback`.

---

## Context

**Parent Feature:** Phase 13 — Mega Menu Navigation

No mobile hamburger menu exists anywhere in the project. At ≤940px, `Navbar.module.css` already hides `.navigationMenuContent` (the desktop mega menu triggers) via a media query. This task adds the missing half: a hamburger button that's visible at ≤940px, and a `MobileMenu` component that opens as a full-screen overlay.

This task is part of **Wave 4** — depends on T02 (Navbar rewire, which established the 5-item structure) and T03 (panel content is done, though mobile doesn't reuse panel components). T07 (accessibility) depends on this task.

**Framer Motion is already installed** — no new dependencies needed.

---

## Z-Index Context

From `Navbar.module.css`:
- `.navigation` has `z-index: 1000`
- `.navigationMenuHomeLink` has `z-index: 1001`

The `SearchModal` (if it has a z-index) likely sits around 1100–1200. **Check `src/components/search/SearchModal.module.css` or inline styles in `SearchModal.tsx` before assigning z-index to the mobile overlay.** The mobile overlay must have a lower z-index than SearchModal so the search overlay appears above it when both could theoretically be open.

Correct z-index values (verified against `src/components/search/SearchModal.module.css` line 9 where `.overlay { z-index: 1000 }`):
- Mobile overlay: `z-index: 999` (below SearchModal's 1000)
- Mobile backdrop: `z-index: 998`
- Hamburger button: `z-index: 1001` (safe within navbar context, which is already z-index: 1000)

The mobile overlay must sit BELOW SearchModal so the search overlay appears above the mobile menu when both are open.

---

## Requirements

### New Files

1. Create `src/components/stripe/MobileMenu.tsx` — the full-screen overlay component.
2. Create `src/components/stripe/MobileMenu.module.css` — CSS Modules for the overlay.

### Modifications to Existing Files

3. Modify `src/components/stripe/Navbar.tsx`:
   - Add `isMobileMenuOpen` state (`useState<boolean>(false)`).
   - Add `mobileMenuRef` ref for the hamburger button (for focus restoration).
   - Render a hamburger `<button>` that's only visible at ≤940px.
   - Render `<MobileMenu>` component with required props.
4. Modify `src/components/stripe/Navbar.module.css`:
   - Add `.hamburger` class (visible at ≤940px, hidden at >940px).
   - Ensure `.navigationMenuContent` is already hidden at ≤940px (it is — confirm only).

### MobileMenu Component Props

```tsx
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}
```

### Behaviour

- Hamburger click: sets `isMobileMenuOpen = true`
- MobileMenu opens with Framer Motion: full-screen overlay fades + slides in from top
- Inside overlay: close button (×) top-right, 5 accordion items
- Accordion item tap: toggles expansion of sub-links
- Sub-link tap: navigate to href, close overlay
- Backdrop click (outside overlay content): close overlay
- Closing overlay: return focus to hamburger button via `triggerRef.current?.focus()`
- No `useMemo` or `useCallback`

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] Hamburger button visible at ≤940px, hidden at >940px
- [ ] Desktop mega menu (`.navigationMenuContent`) remains hidden at ≤940px (no regression)
- [ ] Tapping hamburger opens full-screen overlay with Framer Motion fade+slide animation
- [ ] Overlay renders exactly 5 accordion items matching `NAV_DATA` labels in order
- [ ] Tapping an accordion item toggles sub-link list; tapping again collapses it
- [ ] Each sub-link shows label and descriptor from `NAV_DATA`, and navigates on tap
- [ ] Contact Us item has no sub-link expansion (only featured card content OR direct link)
- [ ] Close button (×) closes overlay
- [ ] Tapping outside overlay content (backdrop) closes overlay
- [ ] Closing overlay returns focus to hamburger button
- [ ] No z-index conflict with SearchModal (confirm by opening SearchModal while mobile menu is open)
- [ ] No `useMemo` or `useCallback` anywhere in new/modified files
- [ ] Dark mode: all overlay surfaces use HDS tokens (no hardcoded hex)
- [ ] `npm run lint` passes

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/stripe/MobileMenu.tsx` | create | Full-screen mobile overlay with accordion |
| `src/components/stripe/MobileMenu.module.css` | create | CSS for mobile overlay |
| `src/components/stripe/Navbar.tsx` | modify | Add hamburger button and MobileMenu render |
| `src/components/stripe/Navbar.module.css` | modify | Add `.hamburger` visibility class |

### File Ownership Notes

`Navbar.tsx` was modified by T02. T06 adds on top of T02's work — ensure T02's hover logic and 5 trigger buttons are preserved. T07 (accessibility) also modifies `Navbar.tsx` after this task.

---

## Implementation Guidance

### Hamburger Button in Navbar.tsx

Add to the `<ul className={styles.navigationButtons}>` list, after the existing items:

```tsx
const hamburgerRef = useRef<HTMLButtonElement>(null);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

// In JSX, inside navigationButtons ul:
<li className={`${styles.navigationItem} ${styles.hamburgerItem}`}>
  <button
    ref={hamburgerRef}
    className={styles.hamburger}
    onClick={() => setIsMobileMenuOpen(true)}
    aria-label="Open navigation menu"
    aria-expanded={isMobileMenuOpen}
  >
    <span className={styles.hamburgerBar} />
    <span className={styles.hamburgerBar} />
    <span className={styles.hamburgerBar} />
  </button>
</li>

<MobileMenu
  isOpen={isMobileMenuOpen}
  onClose={() => setIsMobileMenuOpen(false)}
  triggerRef={hamburgerRef}
/>
```

### Navbar.module.css Additions

```css
/* Hamburger list item — hides the <li> wrapper on desktop, shows on mobile */
.hamburgerItem {
  display: none;
}

@media (max-width: 940px) {
  .hamburgerItem {
    display: flex;
    align-items: center;
  }
}

/* Hamburger button — visible only on mobile */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: var(--hds-space-core-radius-md);
  color: var(--hds-color-text-main);
}

.hamburger:hover {
  background-color: var(--hds-color-surface-bg-subdued);
}

.hamburgerBar {
  display: block;
  width: 20px;
  height: 2px;
  background-color: currentColor;
  border-radius: 1px;
  transition: opacity 0.2s ease;
}

@media (max-width: 940px) {
  .hamburger {
    display: flex;
  }
}

@media (min-width: 941px) {
  .hamburger {
    display: none;
  }
}
```

### MobileMenu.tsx Structure

```tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_DATA } from '@/lib/nav-data';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, triggerRef }) => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  // Return focus to hamburger on close
  useEffect(() => {
    if (!isOpen) {
      triggerRef.current?.focus();
    }
  }, [isOpen, triggerRef]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleLinkClick = () => {
    onClose();
    setOpenItem(null);
  };

  const toggleItem = (id: string) => {
    setOpenItem(prev => prev === id ? null : id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Overlay */}
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Header */}
            <div className={styles.overlayHeader}>
              <span className={styles.overlayTitle}>Menu</span>
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close navigation menu"
              >
                ×
              </button>
            </div>

            {/* Accordion items */}
            <nav className={styles.accordionNav}>
              {NAV_DATA.map(item => (
                <div key={item.id} className={styles.accordionItem}>
                  {item.columns.length > 0 ? (
                    <>
                      <button
                        className={styles.accordionTrigger}
                        onClick={() => toggleItem(item.id)}
                        aria-expanded={openItem === item.id}
                      >
                        <span>{item.label}</span>
                        <span className={`${styles.chevron} ${openItem === item.id ? styles.chevronOpen : ''}`}>
                          ›
                        </span>
                      </button>
                      <AnimatePresence>
                        {openItem === item.id && (
                          <motion.div
                            className={styles.accordionContent}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.columns.flatMap(col => col.links).map(link => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className={styles.accordionLink}
                                onClick={handleLinkClick}
                              >
                                <span className={styles.accordionLinkTitle}>{link.label}</span>
                                <span className={styles.accordionLinkDescriptor}>{link.descriptor}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    // Contact Us — direct link, no accordion
                    <Link
                      href={item.featuredCard.ctaHref}
                      className={styles.accordionDirectLink}
                      onClick={handleLinkClick}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
```

### MobileMenu.module.css

All colours via HDS tokens. Key rules:

```css
.backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 998; /* Below SearchModal (1000) and below overlay */
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--hds-color-surface-bg-quiet);
  z-index: 999; /* Below SearchModal's z-index: 1000 */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.overlayHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--hds-space-core-200) var(--hds-space-core-300);
  border-bottom: 1px solid var(--hds-color-surface-border-quiet);
  height: 64px; /* Match navbar height */
}

.overlayTitle {
  font-family: var(--hds-font-family);
  font-size: var(--hds-font-text-xs-size, 0.875rem);
  font-weight: 500;
  color: var(--hds-color-text-subdued);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.closeButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--hds-color-text-main);
  border-radius: var(--hds-space-core-radius-md);
  line-height: 1;
}

.closeButton:hover {
  background-color: var(--hds-color-surface-bg-subdued);
}

.accordionNav {
  padding: var(--hds-space-core-200) var(--hds-space-core-300);
  display: flex;
  flex-direction: column;
}

.accordionItem {
  border-bottom: 1px solid var(--hds-color-surface-border-quiet);
}

.accordionTrigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--hds-space-core-200) 0;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--hds-font-family);
  font-size: 1.0625rem;
  font-weight: 500;
  color: var(--hds-color-text-main);
  text-align: left;
}

.chevron {
  font-size: 1.25rem;
  color: var(--hds-color-text-subdued);
  transition: transform 0.2s ease;
  display: inline-block;
}

.chevronOpen {
  transform: rotate(90deg);
}

.accordionContent {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-bottom: var(--hds-space-core-150);
}

.accordionLink {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--hds-space-core-150) var(--hds-space-core-200);
  text-decoration: none;
  border-radius: var(--hds-space-core-radius-md);
  transition: background-color 0.15s ease;
}

.accordionLink:hover {
  background-color: var(--hds-color-surface-bg-subdued);
}

.accordionLinkTitle {
  font-size: var(--hds-font-text-xs-size, 0.875rem);
  font-weight: 500;
  color: var(--hds-color-text-main);
}

.accordionLinkDescriptor {
  font-size: 0.75rem;
  color: var(--hds-color-text-subdued);
}

.accordionDirectLink {
  display: block;
  padding: var(--hds-space-core-200) 0;
  font-family: var(--hds-font-family);
  font-size: 1.0625rem;
  font-weight: 500;
  color: var(--hds-color-text-main);
  text-decoration: none;
}

/* Dark mode — surfaces use semantic tokens so overrides are automatic */
/* No additional dark mode rules needed if only using --hds-color-surface-* and --hds-color-text-* tokens */
```

### Z-Index Verification Step

Before writing CSS, check SearchModal's z-index:

```bash
grep -n 'z-index' src/components/search/SearchModal.module.css 2>/dev/null || grep -n 'z-index' src/components/search/SearchModal.tsx 2>/dev/null
```

SearchModal's z-index is confirmed as 1000 (`SearchModal.module.css` line 9). Use 999 for overlay, 998 for backdrop — these are already the correct values in the CSS snippet above.

### Body Scroll Lock

When the overlay opens, `document.body.style.overflow = 'hidden'` prevents background scroll. The `useEffect` cleanup restores it on unmount. This is the correct pattern for this project.

### Contact Us Handling

`Contact Us` in `NAV_DATA` has `columns: []`. The mobile menu renders it as a direct link to `item.featuredCard.ctaHref` (`/contact-us`) rather than an accordion toggle — there are no sub-links to expand.

### React Compiler Constraint

Do NOT add `useMemo` or `useCallback` anywhere. Simple `useState` and inline handlers are correct. The React Compiler handles memoisation.

---

## Boundaries

### Files You MUST NOT Touch

- `package-lock.json`
- `.env` / `.env*`
- `src/sanity/lib/client.ts`
- `src/middleware.ts`
- `src/styles/tokens.css`
- `src/styles/globals.css`
- `src/components/stripe/Megamenu.tsx`
- `src/components/stripe/Megamenu.module.css`
- `src/lib/nav-data.ts`

### Files Requiring Review

None of the files in this task are in the `require_review` list.

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|------------------|------------------------|
| T02 | Navbar has 5-item structure with hover state | Check `Navbar.tsx` renders `NAV_DATA.map()` trigger buttons |
| T03 | Panel components exist | Check `Megamenu.tsx` exports `CommunityPanel` etc. (MobileMenu doesn't import them, but confirms the wave is complete) |

### Downstream Impact

Tasks that depend on this one: **T07** (accessibility, Wave 5) — T07 adds `aria-expanded` to the hamburger button and accordion triggers. T06 should leave these elements with bare minimum ARIA for T07 to complete.

---

## GitHub Context

**Branch:** `worktree/mega-menu-T06`
**Target:** main

---

## Commit Guidelines

```
feat(navbar): add hamburger button and full-screen mobile menu overlay

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
- [ ] No hardcoded hex colours in `MobileMenu.module.css`
- [ ] Z-index verified against SearchModal
- [ ] No `useMemo` or `useCallback` in any modified file

---

*Generated by KARIMO Brief Writer*
*PRD: mega-menu | Task: T06 | Wave: 4*
