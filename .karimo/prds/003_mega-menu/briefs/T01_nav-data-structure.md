# Task Brief: T01

**Title:** Nav data structure
**PRD:** mega-menu
**Priority:** must
**Complexity:** 1/10
**Model:** sonnet
**Wave:** 1
**Feature Issue:** (see tasks.yaml)

---

## Objective

Create a single TypeScript data file at `src/lib/nav-data.ts` that defines the complete PharmaLink navigation structure as a typed, exported constant. This is the single source of truth for all 5 top-level nav items and their panel content — every downstream task (T02, T03, T06) imports from this file.

---

## Context

**Parent Feature:** Phase 13 — Mega Menu Navigation

The current navbar renders a flat array of 9 links. This restructure organises them into 5 top-level items (About Us, Community, Data Insights, Podcast, Contact Us), each with grouped sub-links and a featured card. The nav data lives in a pure TypeScript file with no runtime imports — no Sanity, no API calls.

This task is part of **Wave 1** — foundational data layer. T02, T03, and T06 all depend on this file being correct before they start.

---

## Requirements

1. File must be at `src/lib/nav-data.ts` (create the `src/lib/` directory if it doesn't exist).
2. Export four TypeScript interfaces: `NavLink`, `NavColumn`, `FeaturedCard`, `NavItem`.
3. Export a `NAV_DATA` constant (as `const` assertion or typed array) with exactly 5 items in this order: `about-us`, `community`, `data-insights`, `podcast`, `contact-us`.
4. Each `NavItem` has: `id` (string), `label` (string), `columns` (array of `NavColumn`, may be empty), `featuredCard` (`FeaturedCard`).
5. Each `NavColumn` has: `heading` (string), `links` (array of `NavLink`).
6. Each `NavLink` has: `label` (string), `href` (string), `descriptor` (string).
7. Each `FeaturedCard` has: `title` (string), `description` (string), `ctaLabel` (string), `ctaHref` (string), `imageSrc` (string, optional).
8. No runtime imports — only TypeScript type definitions and a plain data literal.

---

## Exact Nav Data to Encode

Use this data verbatim. Do not paraphrase or alter labels, hrefs, or descriptors.

### About Us
```
columns: [
  {
    heading: "About Us",
    links: [
      { label: "About PharmaLink", href: "/about-us", descriptor: "Our mission and story" }
    ]
  }
]
featuredCard: {
  title: "Join the Network",
  description: "Connect with pharma professionals worldwide",
  ctaLabel: "Get Started",
  ctaHref: "/sign-up"
}
```

### Community
```
columns: [
  {
    heading: "Community",
    links: [
      { label: "Community Hub",     href: "/community",          descriptor: "News, events & announcements" },
      { label: "Forum",             href: "/forum",              descriptor: "Discuss clinical & industry topics" },
      { label: "Member Spotlights", href: "/member-spotlights",  descriptor: "Stories from our network" },
      { label: "Careers",           href: "/careers",            descriptor: "Jobs across the pharma network" }
    ]
  }
]
featuredCard: {
  title: "Join the Conversation",
  description: "1,200+ pharma professionals active this month",
  ctaLabel: "Browse Forum",
  ctaHref: "/forum"
}
```

### Data Insights
```
columns: [
  {
    heading: "Data Insights",
    links: [
      { label: "Data Insights", href: "/data-insights", descriptor: "Dashboards & analytics" },
      { label: "Directory",     href: "/directory",     descriptor: "Find organisations on the map" },
      { label: "Blog",          href: "/blog",          descriptor: "Articles & research" },
      { label: "e-Learning",    href: "/elearning",     descriptor: "Courses & professional development" }
    ]
  }
]
featuredCard: {
  title: "Explore the Data",
  description: "Interactive dashboards covering global pharma trends",
  ctaLabel: "View Insights",
  ctaHref: "/data-insights"
}
```

### Podcast
```
columns: [
  {
    heading: "Podcast",
    links: [
      { label: "Latest Episodes", href: "/podcast", descriptor: "Industry conversations with leading voices" }
    ]
  }
]
featuredCard: {
  title: "PharmaLink Podcast",
  description: "New episode every week",
  ctaLabel: "Listen Now",
  ctaHref: "/podcast"
}
```

### Contact Us
```
columns: []   // no sub-link columns — featured card only
featuredCard: {
  title: "Get in Touch",
  description: "Lagos · London · New York\ncontact@pharmalink.io",
  ctaLabel: "Send a Message",
  ctaHref: "/contact-us"
}
```

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `src/lib/nav-data.ts` exists
- [ ] `NAV_DATA` exported as a typed constant with exactly 5 items
- [ ] Items in order: `about-us`, `community`, `data-insights`, `podcast`, `contact-us`
- [ ] All 4 TypeScript interfaces exported: `NavLink`, `NavColumn`, `FeaturedCard`, `NavItem`
- [ ] All sub-link `href` values exactly match the approved list above (especially `/elearning` not `/e-learning`, `/contact-us` not `/contact`)
- [ ] `Contact Us` item has empty `columns` array
- [ ] No runtime imports (no React, no next/link, no Sanity)
- [ ] `npx tsc --noEmit` passes with no errors

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/nav-data.ts` | create | Single source of truth for all nav content |

### File Ownership Notes

This file is read-only from the perspective of T03, T06. Only T01 creates it. No other task modifies it.

---

## Implementation Guidance

### Patterns to Follow

This is a pure data file — no components, no hooks, no side effects.

Recommended structure:

```typescript
export interface NavLink {
  label: string;
  href: string;
  descriptor: string;
}

export interface NavColumn {
  heading: string;
  links: NavLink[];
}

export interface FeaturedCard {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  imageSrc?: string;
}

export interface NavItem {
  id: string;
  label: string;
  columns: NavColumn[];
  featuredCard: FeaturedCard;
}

export const NAV_DATA: NavItem[] = [
  // ... 5 items
];
```

### Edge Cases

- `Contact Us` has an empty `columns: []` array — this is intentional. T03 renders it as a featured-card-only panel.
- The `description` in `Contact Us` featured card contains a newline (`\n`). Encode it as a literal `\n` in the string — the rendering component handles whitespace.
- `href` for e-Learning is `/elearning` (no hyphen) — this matches the existing route.

### TypeScript Notes

- The file uses no `"use client"` directive.
- Do not use `as const` assertion unless the types are also adjusted to accept readonly arrays — a typed `NavItem[]` annotation is simpler and sufficient.

---

## Boundaries

### Files You MUST NOT Touch

- `package-lock.json`
- `.env` / `.env*` / `.env.local`
- `src/sanity/lib/client.ts`
- `src/middleware.ts`
- `src/styles/tokens.css`
- `node_modules/`

### Files Requiring Review

None of the files in this task require review sign-off.

---

## Dependencies

### Upstream Tasks

None — T01 has no dependencies. Start immediately.

### Downstream Impact

Tasks that depend on this one: **T02, T03, T04 (indirectly), T06, T07**

All downstream tasks import `NAV_DATA` and the interfaces from `src/lib/nav-data.ts`. If this file has a TypeScript error, all downstream tasks will fail `tsc --noEmit`.

---

## GitHub Context

**Branch:** `worktree/mega-menu-T01`
**Target:** main

---

## Commit Guidelines

```
feat(nav): add typed NAV_DATA structure for mega menu

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before marking done:
- [ ] All success criteria met
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] No `never_touch` files modified
- [ ] `src/lib/nav-data.ts` contains exactly 5 `NAV_DATA` entries

---

*Generated by KARIMO Brief Writer*
*PRD: mega-menu | Task: T01 | Wave: 1*
