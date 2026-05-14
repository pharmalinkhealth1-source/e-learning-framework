# User-Provided PRD: Bespoke Modular LMS

> Imported 2026-05-13 — source: user input during /karimo:research

## Executive Summary

Hybrid, high-performance LMS. Sanity v5 for content orchestration, Clerk for identity. Treats legacy standards (SCORM/LTI) as just another content type alongside modern video/text lessons.

**Success Metrics:** <2s LCP, 100% SCORM/LTI data accuracy, zero design drift across lesson types.

## Target Audience

- **Internal Teams:** Brand-consistent video/text courses
- **Enterprise Partners:** SCORM 1.2/2004 legacy modules
- **Academic Institutions:** LTI 1.3 Tool Provider access

## Functional Requirements

### Identity & Progress (Clerk)
- Multi-tenant login via Clerk
- `publicMetadata` stores lightweight "Completed Lessons" array for UI state
- Deep progress (scores, time-on-page) synced to Sanity Activity table via Clerk Webhooks

### Content Management (Sanity v5)
- Hierarchy: Course → Module → Lesson
- Lesson variants:
  - **Text:** Portable Text + HDS styling
  - **Video:** Mux/Cloudflare Stream + custom HDS player wrapper
  - **SCORM:** ZIP upload → auto-extract to S3/Vercel Blob
  - **LTI:** OIDC initiation + Target Link URL config fields

### Unified Player (Next.js App Router)
- Persistent layout shell; lesson content swaps
- **SCORM Bridge:** Client-side adapter injects `API_1484_11` (SCORM 2004) or `API` (SCORM 1.2) into `window` so iframe module talks to Clerk/Sanity
- **LTI 1.3:** Middleware-based OIDC handshake; LMS acts as Tool Provider

## Technical Architecture

**Request path:** `/courses/[slug]/lesson/[id]`
1. Clerk Middleware validates session
2. Server Component fetches Sanity content
3. Render:
   - Custom content → React components (React Compiler optimized)
   - SCORM → iframe + SCORM-to-Clerk bridge
   - LTI → OIDC flow → external provider redirect

### SCORM/LTI Bridge

| Standard | Strategy |
|----------|----------|
| SCORM 1.2/2004 | Client-side `window` bridge; captures `LMSSetValue` calls → Route Handler → saves progress |
| LTI 1.3 | `ltijs` or custom OIDC; supports deep linking + grade pass-back (Canvas, Moodle) |

## Design (HDS System)

- All bespoke UI: `--hds-*` tokens only, CSS Modules
- SCORM iframes: "Stage Backdrop" approach (dark neutral container) to minimize visual clash

## Non-Functional Requirements

- React Compiler for zero-effort memoization
- `npx tsc --noEmit` must pass before deployment
- Sanity schemas → TypeScript interfaces via `sanity-codegen` or similar
- WCAG 2.1 AA on Player Shell

## Phases

| Phase | Scope |
|-------|-------|
| 1 | Core: Sanity schema, Clerk auth + progress, App Router layout + HDS |
| 2 | SCORM: Blob storage, ScormPlayer component, JS API bridge |
| 3 | LTI: OIDC handshake, Tool Provider config in Sanity |
| 4 | Optimization: React Compiler tuning, skeleton screens |

## Appendix: Lesson Schema Sketch

```typescript
// lesson.ts
export default {
  name: 'lesson',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'type', type: 'string', options: { list: ['video', 'text', 'scorm', 'lti'] } },
    { name: 'content', type: 'array', of: [{ type: 'block' }], hidden: ({document}) => document.type !== 'text' },
    { name: 'scormPackage', type: 'file', hidden: ({document}) => document.type !== 'scorm' },
  ]
}
```
