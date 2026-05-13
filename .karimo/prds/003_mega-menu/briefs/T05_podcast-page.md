# Task Brief: T05

**Title:** Podcast page
**PRD:** mega-menu
**Priority:** must
**Complexity:** 2/10
**Model:** sonnet
**Wave:** 1
**Feature Issue:** (see tasks.yaml)

---

## Objective

Create the `/podcast` route with a hero section (matching the Clinical Luxury visual style of other PharmaLink pages), an embedded Spotify podcast player, and a static list of 4 episode cards. The directory `src/app/podcast/` does not exist yet — both files must be created from scratch.

---

## Context

**Parent Feature:** Phase 13 — Mega Menu Navigation

The new mega menu navigation includes a "Podcast" top-level item that links to `/podcast`. This route must exist and render content. The page uses the same IBM Plex Sans typography and HDS token pattern as other pages in the project (e.g., `src/app/community/page.tsx`). The podcast embedded player uses Spotify's public embed iframe with a public example feed (Lex Fridman Podcast). In future the embed URL will be swapped for the real PharmaLink podcast.

This task is part of **Wave 1** — it has no dependencies and can run in parallel with T01.

---

## Visual Pattern to Follow

Reference page: `src/app/community/page.tsx`

The community page pattern:
- `<main className={styles.main}>`
- Hero section with eyebrow span, `<h1>`, subtitle `<p>`
- MeshGradient background (optional — can be kept simple for podcast page)
- Navbar at the top, Footer/FooterCTA at the bottom
- IBM Plex Sans via HDS font tokens
- All colours via `--hds-*` custom properties
- Dark mode supported via CSS custom properties (no hardcoded hex in component CSS)

The podcast page follows this same structure. No client components needed — this is a fully static page (no Sanity fetching, no auth).

---

## Requirements

1. Create `src/app/podcast/page.tsx` — React Server Component (no `"use client"` directive).
2. Create `src/app/podcast/page.module.css` — CSS Modules file with HDS tokens.
3. Page imports `Navbar`, `Footer`, `FooterCTA` from `@/components/stripe/`.
4. Hero section: eyebrow text "Podcast", `<h1>` "PharmaLink Podcast", subtitle about the show.
5. Embedded Spotify player rendered as an `<iframe>` with `src="https://open.spotify.com/embed/show/2MAi0BvDc6GTFvKFPXnkCL?utm_source=generator"`.
6. Below the player: a static episodes list rendered from a hardcoded array of 4 episode objects.
7. Each episode card shows: episode number, title, guest name, duration, and a "Listen" link to `/podcast`.
8. All colours must use `--hds-*` CSS custom properties — no hardcoded hex.
9. Dark mode must be supported (surfaces use `--hds-color-surface-bg-quiet`, text uses `--hds-color-text-main`, etc.).
10. `npx tsc --noEmit` passes.

---

## Exact Episode Data to Use

Hardcode these 4 episodes in `page.tsx`:

```typescript
const EPISODES = [
  {
    number: 1,
    title: "The Future of Pharmaceutical Supply Chains in Africa",
    guest: "Dr. Amara Okafor",
    duration: "52 min",
    href: "/podcast",
  },
  {
    number: 2,
    title: "Cold Chain Innovations: Keeping Medicines Safe",
    guest: "Sarah Chen, PhD",
    duration: "41 min",
    href: "/podcast",
  },
  {
    number: 3,
    title: "Regulatory Pathways: Navigating West African Markets",
    guest: "Kofi Mensah",
    duration: "38 min",
    href: "/podcast",
  },
  {
    number: 4,
    title: "Digital Health Records and Pharmacy Modernisation",
    guest: "Dr. Zainab Yusuf",
    duration: "45 min",
    href: "/podcast",
  },
];
```

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `src/app/podcast/page.tsx` exists and renders without error at `/podcast`
- [ ] Hero section present: eyebrow "Podcast", `<h1>` "PharmaLink Podcast", subtitle paragraph
- [ ] Spotify `<iframe>` rendered with `src="https://open.spotify.com/embed/show/2MAi0BvDc6GTFvKFPXnkCL?utm_source=generator"`
- [ ] Exactly 4 episode cards rendered, each showing: episode number, title, guest name, duration
- [ ] All surfaces and text use HDS tokens — no hardcoded hex in `page.module.css`
- [ ] Dark mode: page looks correct with `data-theme='dark'` applied to `:root`
- [ ] `npx tsc --noEmit` passes

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/app/podcast/page.tsx` | create | The /podcast route page component |
| `src/app/podcast/page.module.css` | create | CSS Modules styles for the podcast page |

### File Ownership Notes

These are new files. No other task touches them.

---

## Implementation Guidance

### page.tsx Structure

```tsx
import React from 'react';
import Navbar from '@/components/stripe/Navbar';
import Footer from '@/components/stripe/Footer';
import FooterCTA from '@/components/stripe/FooterCTA';
import styles from './page.module.css';

const EPISODES = [/* ... 4 episodes as defined above ... */];

export default function PodcastPage() {
  return (
    <main className={styles.main}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Podcast</span>
          <h1 className={styles.title}>PharmaLink Podcast</h1>
          <p className={styles.subtitle}>
            Industry conversations with the leading voices shaping pharmaceutical
            practice across Africa and beyond.
          </p>
        </div>
      </section>

      <section className={styles.playerSection}>
        <div className={styles.container}>
          <iframe
            src="https://open.spotify.com/embed/show/2MAi0BvDc6GTFvKFPXnkCL?utm_source=generator"
            width="100%"
            height="352"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ borderRadius: '12px', border: 'none' }}
            title="PharmaLink Podcast on Spotify"
          />
        </div>
      </section>

      <section className={styles.episodesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionHeading}>Latest Episodes</h2>
          <ul className={styles.episodeList}>
            {EPISODES.map((ep) => (
              <li key={ep.number} className={styles.episodeCard}>
                <span className={styles.episodeNumber}>Ep. {ep.number}</span>
                <div className={styles.episodeBody}>
                  <p className={styles.episodeTitle}>{ep.title}</p>
                  <p className={styles.episodeGuest}>{ep.guest}</p>
                </div>
                <div className={styles.episodeMeta}>
                  <span className={styles.episodeDuration}>{ep.duration}</span>
                  <a href={ep.href} className={styles.episodeListen}>Listen →</a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FooterCTA />
      <Footer />
    </main>
  );
}
```

### page.module.css Structure

Key classes to define. Use only `--hds-*` tokens for all colours, spacing, and typography.

```css
.main {
  min-height: 100vh;
  background-color: var(--hds-color-surface-bg-quiet);
}

.hero {
  padding-block: var(--hds-space-core-1200) var(--hds-space-core-600);
  text-align: center;
  background-color: var(--hds-color-surface-bg-subdued);
  border-bottom: 1px solid var(--hds-color-surface-border-quiet);
}

.heroContent {
  max-width: var(--hds-space-layout-content-maxWidth, 1264px);
  margin-inline: auto;
  padding-inline: var(--hds-space-layout-content-margin, 20px);
}

.eyebrow {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--hds-color-button-primary-bg);
  margin-bottom: var(--hds-space-core-150);
}

.title {
  font-family: var(--hds-font-family);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: var(--hds-font-weight-bold);
  color: var(--hds-color-text-primary);
  margin: 0 0 var(--hds-space-core-200) 0;
  line-height: 1.1;
}

.subtitle {
  font-size: 1.125rem;
  color: var(--hds-color-text-secondary);
  max-width: 600px;
  margin-inline: auto;
  line-height: 1.6;
}

.container {
  max-width: var(--hds-space-layout-content-maxWidth, 1264px);
  margin-inline: auto;
  padding-inline: var(--hds-space-layout-content-margin, 20px);
}

.playerSection {
  padding-block: var(--hds-space-core-600);
}

.episodesSection {
  padding-block: var(--hds-space-core-600) var(--hds-space-core-1200);
}

.sectionHeading {
  font-family: var(--hds-font-family);
  font-size: 1.5rem;
  font-weight: var(--hds-font-weight-bold);
  color: var(--hds-color-text-primary);
  margin: 0 0 var(--hds-space-core-400) 0;
}

.episodeList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--hds-space-core-150);
}

.episodeCard {
  display: flex;
  align-items: center;
  gap: var(--hds-space-core-300);
  padding: var(--hds-space-core-200) var(--hds-space-core-300);
  background-color: var(--hds-color-surface-bg-subdued);
  border: 1px solid var(--hds-color-surface-border-quiet);
  border-radius: var(--hds-space-core-radius-lg);
  transition: border-color 0.15s ease;
}

.episodeCard:hover {
  border-color: var(--hds-color-button-primary-bg);
}

.episodeNumber {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--hds-color-button-primary-bg);
  min-width: 40px;
}

.episodeBody {
  flex: 1;
}

.episodeTitle {
  font-size: var(--hds-font-text-xs-size, 0.875rem);
  font-weight: 500;
  color: var(--hds-color-text-main);
  margin: 0 0 4px 0;
}

.episodeGuest {
  font-size: 0.75rem;
  color: var(--hds-color-text-subdued);
  margin: 0;
}

.episodeMeta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.episodeDuration {
  font-size: 0.75rem;
  color: var(--hds-color-text-subdued);
}

.episodeListen {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--hds-color-button-primary-bg);
  text-decoration: none;
  transition: opacity 0.15s ease;
}

.episodeListen:hover {
  opacity: 0.75;
}
```

### Spotify iframe Notes

- The `allow` attribute must include `"autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"` for Spotify embeds to work correctly.
- `loading="lazy"` defers the iframe until it's near the viewport.
- The `style={{ borderRadius: '12px', border: 'none' }}` is an inline style on the iframe element itself — Spotify's embed has its own DOM and CSS Modules cannot style inside it.
- `title` attribute is required for accessibility.

### TypeScript Notes

- The page is a React Server Component — no `"use client"` needed.
- The `EPISODES` array type can be inferred — no explicit interface needed unless you want one.
- The `<iframe>` element in React accepts a `title` prop and all standard HTML iframe attributes.

### Next.js Notes

Before writing any code, read the relevant Next.js 16 App Router guide in `node_modules/next/dist/docs/` (as per `AGENTS.md`). The App Router file conventions (page.tsx in the route directory) are unchanged from App Router conventions, but verify anything unusual.

---

## Boundaries

### Files You MUST NOT Touch

- `package-lock.json`
- `.env` / `.env*`
- `src/sanity/lib/client.ts`
- `src/middleware.ts`
- `src/styles/tokens.css`
- `src/styles/globals.css`
- Any existing page or component

### Files Requiring Review

None of the files in this task are in the `require_review` list.

---

## Dependencies

### Upstream Tasks

None — T05 has no dependencies. Start immediately.

### Downstream Impact

Tasks that depend on this one: None directly. The `/podcast` route is referenced by the `NAV_DATA` in T01 (`href: "/podcast"`), but T01 only stores the href string — it doesn't validate that the route exists.

---

## GitHub Context

**Branch:** `worktree/mega-menu-T05`
**Target:** main

---

## Commit Guidelines

```
feat(podcast): create /podcast page with embedded player and episode list

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
- [ ] No hardcoded hex colours in `page.module.css`
- [ ] Spotify iframe src is exactly `https://open.spotify.com/embed/show/2MAi0BvDc6GTFvKFPXnkCL?utm_source=generator`

---

*Generated by KARIMO Brief Writer*
*PRD: mega-menu | Task: T05 | Wave: 1*
