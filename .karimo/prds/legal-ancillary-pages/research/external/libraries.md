# External Research: Libraries & Technical Approach

## 1. @portabletext/react — Already Installed

**Package:** `@portabletext/react` (installed as part of `next-sanity`)
**Status:** Already used in 4 pages. No additional installation needed.

### Custom Components for Legal Pages

To generate heading anchor IDs for ToC linking, use the custom components API:

```tsx
import { PortableText, toPlainText, type PortableTextComponents } from '@portabletext/react';
import slugify from 'slugify';

const legalPageComponents: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => (
      <h2 id={slugify(toPlainText(value), { lower: true, strict: true })}>
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3 id={slugify(toPlainText(value), { lower: true, strict: true })}>
        {children}
      </h3>
    ),
    normal: ({ children }) => <p>{children}</p>,
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};
```

**`toPlainText`** converts a Portable Text block to plain text string — available from `@portabletext/react`.
**`slugify`** already in package.json (v1.6.9).

### ToC Heading Extraction (Server-Side)

Extract headings from the body array before rendering:

```tsx
// Server component — no 'use client' needed
function extractHeadings(body: PortableTextBlock[]) {
  return body
    .filter(block => block._type === 'block' && ['h2', 'h3'].includes(block.style))
    .map(block => ({
      id: slugify(toPlainText(block), { lower: true, strict: true }),
      text: toPlainText(block),
      level: block.style as 'h2' | 'h3',
    }));
}
```

This runs at build/request time on the server — no client JS required for a static link list.

---

## 2. Table of Contents Approaches

### Option A: Static Server-Rendered Links (Recommended for Legal Pages)

**No extra library needed.** Generate ToC from Portable Text body on the server, render as plain anchor links. No active-state tracking. Appropriate for legal documents where users primarily navigate to sections, not scroll interactively.

**Pro:** Zero client JS, SEO-friendly, works without JavaScript enabled.
**Con:** No active section highlighting while scrolling.

### Option B: Client-Side with IntersectionObserver

Build a `'use client'` ToC component that uses `IntersectionObserver` to track which heading is currently in the viewport and highlight the corresponding ToC link.

**Pattern used by:** Stripe docs, many documentation sites.
**Implementation cost:** ~40-60 lines of client code. No external library needed.

```tsx
'use client';
import { useState, useEffect } from 'react';

export function LegalTableOfContents({ headings }: { headings: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('');
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0% -70% 0%' }
    );
    
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav aria-label="Page contents">
      <ul>
        {headings.map(({ id, text, level }) => (
          <li key={id} style={{ paddingLeft: level === 'h3' ? '16px' : '0' }}>
            <a href={`#${id}`} aria-current={activeId === id ? 'true' : undefined}>
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

**Recommendation:** Implement Option B for a polished UX consistent with the blog's existing sticky sidebar interaction model.

### Option C: Tocbot Library

**Package:** `tocbot` (npm)
**Status:** Not installed. Works by scanning rendered DOM for headings.
**Assessment:** Overkill for this use case. Requires DOM scanning after render, and PortableText heading IDs must still be set manually. The custom approach above is simpler and more maintainable.

---

## 3. Legal Page Content: Do Not Use Generators

**Assessment: Manual content is required.** Automated legal page generators (Termly, Iubenda, PrivacyPolicies.com, etc.) produce generic templates that:
- Do not address NDPA 2023, Kenya DPA 2019, or Ethiopia PDPP 1321/2024 in combination
- Do not include healthcare professional network specifics
- Do not address PSI/PharmaLink's US nonprofit structure
- Do not cover DMCA designated agent registration

**Recommendation:** Use the research findings in `best-practices.md` as the content outline. A lawyer familiar with US/African data protection law should review the final Privacy Policy, ToS, and Cookie Policy before publication.

**Practical approach for implementation:** Content can be drafted by the team using the minimum content requirements from `best-practices.md` as a checklist. The Sanity CMS allows easy updates when content is reviewed/approved.

---

## 4. Cookie Consent Banner

The Cookie Policy page documents what cookies are used. A separate implementation concern is the **cookie consent banner** (CMP):

**Options:**
- **CookieYes** — free tier available, GDPR/NDPR/Kenya DPA compliant, auto-scans cookies
- **Cookiebot (Usercentrics)** — enterprise-grade, more expensive
- **Custom implementation** — possible but complex (consent storage, geo-targeting)

**Recommendation:** CookieYes free tier for now. It provides a compliant consent banner and auto-generates a cookie policy that can be imported into Sanity. This is a separate implementation task from the legal pages themselves.

For the Next.js app: embed the CookieYes script tag in `src/app/layout.tsx` within `<head>`. This is independent of the legal pages implementation.

---

## 5. Summary of Required Packages

| Package | Status | Purpose |
|---|---|---|
| `@portabletext/react` | Already installed | Render legal page body |
| `slugify` | Already installed | Generate heading anchor IDs |
| No new packages required | — | — |
