# Internal Research: Page Structure Patterns

## 1. Page Architecture: Server vs Client Components

**Split pattern is standard.** Most content-heavy routes use a server component as the page entry point (data fetching, metadata) and delegate interactive UI to a `*Client.tsx` sibling.

- `about-us/page.tsx` — pure `'use client'` with Framer Motion (unusual; this page has no Sanity data)
- `blog/[slug]/page.tsx` — async server component, fetches Sanity data, renders inline with `<PortableText>`
- `member-spotlights/[slug]/page.tsx` — async server component with `export const dynamic = 'force-dynamic'`
- `careers/[slug]/page.tsx` — async server component + `JobDetailClient.tsx` for interactive CTA

**Legal pages should follow the blog/[slug] pattern:** server component, Sanity fetch, PortableText render. No client interactivity needed unless a sticky ToC requires scroll tracking.

## 2. PortableText Rendering

`@portabletext/react` is installed and used in four places:
- `blog/[slug]/page.tsx` — bare `<PortableText value={post.content} />` (no custom components)
- `member-spotlights/[slug]/page.tsx` — bare `<PortableText value={spotlight.body} />`
- `elearning/courses/[slug]/[moduleSlug]/page.tsx` — wrapped in a `styles.portableText` div

**No custom component overrides exist anywhere in the codebase.** The default PortableText renderer outputs unstyled HTML elements. The blog CSS at `BlogPostDetail.module.css` styles `.content p`, `.content h2`, `.content h3` directly on the parent wrapper div, so prose styling is applied via CSS on the container rather than via PortableText component overrides.

**blogPost Sanity schema** (`content` field): `array of [{ type: 'block' }]` — standard Portable Text, no custom marks or block types. Legal pages can use the same field definition.

**memberSpotlight schema** (`body` field): same pattern — `array of [{ type: 'block' }]`.

## 3. Best Template Candidates for Legal Pages

### Primary: `blog/[slug]/page.tsx` + `BlogPostDetail.module.css`

This is the closest match to a long-form content page. Key layout structure:
```
<main>
  <Navbar />
  <article>
    <div .container>          {/* max-width: 1264px, mx-auto, px-24 */}
      back link
      <header>                {/* title, category badge, meta */}
      hero image (optional)
      <div .contentWrapper>   {/* grid: 80px sidebar + 1fr content */}
        <div .sidebar>        {/* position: sticky, top: 120px */}
          share buttons
        </div>
        <div .content>        {/* prose styles: 17px/1.7 */}
          <PortableText />
        </div>
      </div>
    </div>
  </article>
  <Footer />
</main>
```

The sidebar is already sticky (`position: sticky; top: 120px; height: fit-content`). This exact pattern can be repurposed as a ToC sidebar for legal pages.

### Secondary: `member-spotlights/[slug]/page.tsx`

Uses a two-column layout with a right sidebar (`contentArea` + `richText` + `sidebar`). The sidebar holds a profile widget and CTA. The grid is CSS-based, not sticky.

## 4. CSS Patterns and Token Usage

**Typography tokens in use:**
- `--hds-font-family`: IBM Plex Sans (primary body font)
- `--hds-color-text-primary`: `#24124a` (main text)
- `--hds-color-text-secondary`: `rgba(36, 18, 74, 0.72)` (secondary/muted)
- `--hds-color-text-subdued`: `rgba(36, 18, 74, 0.52)`
- `--hds-color-surface-bg-quiet`: white in light mode
- `--hds-color-surface-bg-subdued`: `#f8fafd` (slightly off-white, used for related sections)
- `--hds-color-surface-border-quiet`: `#e5edf5`
- `--hds-color-util-brand-500`: `#635bff` (link/accent color)
- `--hds-color-core-primary-700`: `#6C30C0` (brand purple — primary CTA)

**Prose font size:** `17px / line-height 1.7` (set in `.content` in BlogPostDetail.module.css)

**Title font size:** `clamp(36px, 5vw, 52px)` with `font-weight: 600; letter-spacing: -0.02em`

**Container:** `max-width: var(--hds-space-layout-content-maxWidth)` = 1264px, `margin: 0 auto`, `padding: 0 24px`

**No `readable-text` class equivalent exists.** Prose is styled via parent div class selectors (`.content p`, `.content h2`).

## 5. Sticky Sidebar Pattern

The blog post detail page already implements a sticky sidebar:
```css
.sidebar {
  position: sticky;
  top: 120px;         /* clears fixed Navbar */
  height: fit-content;
}
```
The `top: 120px` value accommodates the fixed Navbar. This same approach can be used for a legal page ToC sidebar.

**No ToC component exists.** The blog sidebar currently shows share buttons only. A ToC would need to be built from scratch.

## 6. Route Structure Patterns

**Flat routes:** `about-us/page.tsx`, `contact-us/page.tsx`, `careers/page.tsx`
**Dynamic slug routes:** `blog/[slug]/page.tsx`, `careers/[slug]/page.tsx`, `member-spotlights/[slug]/page.tsx`
**Auth route group:** `(auth)/sign-in/`, `(auth)/sign-up/`

There are no existing route groups beyond `(auth)`. Legal pages could use either:
- Flat: `/legal-support/page.tsx` + `/legal-support/[slug]/page.tsx`
- Route group: `(legal)/privacy-policy/page.tsx` (individual pages without shared hub)

**The flat `legal-support/` pattern is consistent with existing conventions** (careers, blog, member-spotlights all use `section/page.tsx` + `section/[slug]/page.tsx`).

## 7. Footer/Navbar

- `Navbar` imported from `@/components/stripe/Navbar` — used on every page
- `Footer` from `@/components/stripe/Footer` (async, fetches Sanity siteSettings for variant)
- `FooterCompact` from `@/components/stripe/FooterCompact` — used on contact-us (faster, no Sanity fetch)

Legal pages should use `<Footer />` for consistency, or `<FooterCompact />` for simplicity. The compact variant avoids a Sanity dependency.

## 8. Metadata Pattern

Server pages export `generateMetadata` (async, fetches Sanity for dynamic title/description). See `careers/[slug]/page.tsx` for the exact pattern with `Promise<{ slug: string }>` params typing for Next.js 16.
