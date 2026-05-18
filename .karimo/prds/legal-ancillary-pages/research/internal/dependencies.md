# Internal Research: Dependencies

## 1. Sanity Schema Types Relevant to Legal Pages

### Existing schemas that inform the pattern:

**blogPost** (`src/sanity/schemaTypes/blogPost.ts`)
- Fields: `title` (string), `slug` (slug), `tag` (string), `summary` (text), `content` (array of block), `author` (reference), `publishedAt` (datetime), `mainImage` (image with externalUrl)
- Rich text: `content` is `array of [{ type: 'block' }]` — standard Portable Text

**memberSpotlight** (`src/sanity/schemaTypes/memberSpotlight.ts`)
- Fields: `name`, `slug`, `jobTitle`, `country`, `quote`, `excerpt`, `body` (array of block), `image`, `featured`, `publishedAt`
- Same rich text pattern as blogPost

**forumRules** (`src/sanity/schemaTypes/forumRules.ts`)
- Singleton pattern via `_id: 'forumRules'` convention
- Fields: `version` (string — bump to re-prompt users), `updatedAt` (datetime), `rules` (array of objects with title/body)
- Uses `__experimental_actions` comment (not actually applied — see note in file)
- The singleton is enforced by convention (admin creates one document with fixed _id) rather than Sanity's action restriction API

**siteSettings** (`src/sanity/schemaTypes/siteSettings.ts`)
- True singleton using `__experimental_actions: ['update', 'publish']` (no create/delete)
- Pattern: `@ts-expect-error — experimental singleton action list`

### No existing legal page schema found.

Zero references to `privacy`, `terms`, `cookie`, `legal`, `disclaimer` in any schema file.

## 2. @portabletext/react

**Installed:** Yes — `node_modules/@portabletext/react` is present.

The package is a dependency of `next-sanity` (which is in package.json as `"next-sanity": "^12.4.0"`). It is also directly importable as shown in the codebase:

```tsx
import { PortableText } from '@portabletext/react';
// Used in: blog/[slug]/page.tsx, member-spotlights/[slug]/page.tsx,
//          elearning/courses/[slug]/[moduleSlug]/page.tsx, forum/[slug]/page.tsx
```

Additional @portabletext packages installed: `editor`, `html`, `react`, `toolkit`, `types`, `to-html`, and several plugins. The `toPlainText` utility from `@portabletext/react` is available for ToC generation.

**slugify** is also in package.json (`"slugify": "^1.6.9"`) — already available for generating heading anchor IDs.

## 3. Existing Legal-Page-Related Routes or Files

**None found.** The grep search for `legal|privacy|terms|cookie|gdpr|disclaimer` across all `.ts/.tsx/.css` files returned only:
- `data-insights/page.tsx` — mentions "privacy" in form consent checkbox text
- `(auth)/sign-up/[[...sign-up]]/page.tsx` — sign-up page (Clerk)
- `WaitlistDialog.tsx` — likely a consent checkbox

No route at `/legal-support`, `/privacy-policy`, `/terms`, or similar exists.

## 4. Sanity Client Configuration

`src/sanity/lib/client.ts` — standard Sanity client with project ID and dataset from env.

ISR/revalidation pattern seen in Footer: `{ next: { revalidate: 300 } }` (5-minute cache). Legal pages can use longer revalidation (e.g., 3600 seconds) since content changes infrequently.

## 5. Key Imports for a Legal Page

A new legal page would need:
```tsx
import { client } from '@/sanity/lib/client';
import { PortableText } from '@portabletext/react';
import Navbar from '@/components/stripe/Navbar';
import Footer from '@/components/stripe/Footer';
import { notFound } from 'next/navigation';
```

No new packages are required. All dependencies are already installed.

## 6. slugify Is Available

`slugify` (v1.6.9) is in `package.json`. This is needed for generating heading anchor IDs for a ToC:
```tsx
import slugify from 'slugify';
// slugify(headingText, { lower: true, strict: true })
```

## 7. Framer Motion

`framer-motion` (v12) is installed. Optional for page transitions or scroll-based animations, consistent with about-us and other pages.
