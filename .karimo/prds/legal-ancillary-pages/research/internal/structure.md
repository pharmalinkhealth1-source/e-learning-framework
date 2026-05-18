# Internal Research: Route Structure

## Recommended Route Structure

### Option A: Hub + Dynamic Slug (Recommended)

```
src/app/legal-support/
├── page.tsx                    # Hub: /legal-support
├── LegalHub.module.css
└── [slug]/
    ├── page.tsx                # Individual: /legal-support/[slug]
    └── LegalPage.module.css
```

**Why this pattern:**
- Matches existing conventions: `blog/page.tsx` + `blog/[slug]/page.tsx`, `careers/page.tsx` + `careers/[slug]/page.tsx`
- Hub page (`/legal-support`) serves as a navigation index — users landing from footer links see all legal documents
- Individual pages at `/legal-support/privacy-policy`, `/legal-support/terms-of-service`, etc.
- Single Sanity schema manages all legal documents
- Adding new pages requires only creating a Sanity document — no code changes

### Option B: Flat Individually Named Routes

```
src/app/
├── privacy-policy/page.tsx
├── terms-of-service/page.tsx
├── cookie-policy/page.tsx
└── ...
```

**Why NOT this pattern:**
- Every new legal page requires a new route file
- Inconsistent with existing convention (all multi-document sections use hub + [slug])
- Harder to maintain
- Cannot leverage dynamic routing for CMS-driven content

### Option C: Route Group

```
src/app/(legal)/
├── privacy-policy/page.tsx
├── terms-of-service/page.tsx
└── layout.tsx                  # Shared legal layout
```

**Why NOT this pattern:**
- Route groups are used only for `(auth)` in this codebase
- More complex than needed
- Still requires individual files per page

## Recommended Implementation

**Go with Option A.** The Sanity schema should be a `legalPage` document type with a `slug` field. This allows all legal documents to be CMS-managed from a single document list.

### URL Pattern

| Page | URL |
|---|---|
| Hub | `/legal-support` |
| Privacy Policy | `/legal-support/privacy-policy` |
| Terms of Service | `/legal-support/terms-of-service` |
| Cookie Policy | `/legal-support/cookie-policy` |
| Accessibility Statement | `/legal-support/accessibility-statement` |
| Medical Disclaimer | `/legal-support/medical-disclaimer` |
| Community Guidelines | `/legal-support/community-guidelines` |
| DMCA Policy | `/legal-support/dmca-policy` |
| Refund Policy | `/legal-support/refund-policy` |

### Sanity Schema Approach

A `legalPage` document type (not singleton — multiple documents, one per page):

```typescript
{
  name: 'legalPage',
  title: 'Legal Page',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'category', type: 'string' }, // 'policy' | 'terms' | 'guidelines'
    { name: 'effectiveDate', type: 'date' },
    { name: 'lastUpdated', type: 'date' },
    { name: 'summary', type: 'text' },    // Short description for hub page
    { name: 'body', type: 'array', of: [{ type: 'block' }] },
    { name: 'showOnHub', type: 'boolean', initialValue: true },
    { name: 'order', type: 'number' },    // Sort order on hub
  ]
}
```

### Comparison with forumRules Singleton

`forumRules` is a singleton (one document, fixed content). Legal pages need multiple documents, so `forumRules` is not the right model. `blogPost` is the closer analog.

The key difference: legal pages don't have authors or publish dates in the blog sense, but they do have `effectiveDate` and `lastUpdated` — both important for legal compliance.

## Static Generation vs Dynamic

Legal pages rarely change. Use:
```typescript
export const revalidate = 3600; // 1-hour ISR
```

Or for truly static content:
```typescript
export async function generateStaticParams() {
  const slugs = await client.fetch(`*[_type == "legalPage"].slug.current`);
  return slugs.map((slug: string) => ({ slug }));
}
```

This matches the `careers/[slug]/page.tsx` pattern which uses `generateMetadata`.
