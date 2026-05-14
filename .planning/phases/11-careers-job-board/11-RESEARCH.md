# Phase 11 Research: Careers & Job Board

## Objective
Implement a professional, high-fidelity Careers portal at `/careers` that matches the Clinical Luxury design system (HDS) and integrates with Sanity CMS.

## Analysis
### Current State
- **Sanity Schema**: `jobOpening` exists but lacks `slug`, `category`, and `publishedAt` fields necessary for a full portal.
- **Pages**: No `/careers` route exists.
- **Design Patterns**: Existing listing pages (`/blog`, `/elearning`, `/member-spotlights`) use a standard pattern:
    - `page.tsx` (Server Component) fetches data.
    - `*Client.tsx` (Client Component) handles interactivity (filtering, sorting).
    - CSS Modules for layout and "Clinical Luxury" visuals (grid lines, glow).

### Required Schema Updates
- Add `slug` (slug type, source: 'title').
- Add `category` (string, options: ['Clinical', 'Technical', 'Operations']).
- Add `publishedAt` (datetime).
- Add `excerpt` (text) for preview cards.
- Add `responsibilities` and `requirements` (array of strings or portable text).

### Component Needs
- `JobCard`: HDS-styled bento card for the listing grid.
- `JobFilters`: Segmented control or branded dropdowns for category/type.
- `JobDetail`: Clean, readable layout for the job description.
- `ApplicationModal`: Clerk-integrated form.

## Domain Research
- **Stripe Careers Reference**: Clean typography, clear category grouping, and "Apply" buttons that feel tactile.
- **HDS Integration**: Must use `TactileButton`, `MeshGradient` (for hero), and `hds-*` tokens.

## Proposed Wave Strategy
1. **Wave 1: Schema & Content**: Update Sanity schema and seed sample data.
2. **Wave 2: Listing Page**: Build the `/careers` gallery with filtering.
3. **Wave 3: Detail Pages**: Build the `/careers/[slug]` individual pages.
4. **Wave 4: Application Flow**: Implement the application logic and Clerk integration.

## Conclusion
Ready to plan. I will extend the schema first to ensure detail pages can be addressed by slug.
