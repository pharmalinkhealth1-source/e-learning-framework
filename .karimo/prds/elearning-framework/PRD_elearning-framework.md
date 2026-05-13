# PRD: Bespoke Modular LMS (PRD-A — Core + SCORM + Dashboard)

**Slug:** elearning-framework
**Status:** Draft
**Date:** 2026-05-13
**Author:** KARIMO Interviewer

---

## 1. Overview

Build a production-grade, bespoke Learning Management System on the existing PharmaLink stack (Next.js 16.2.4 App Router, Sanity v5, Clerk). The platform serves pharmacist learners across 15 countries (≤30,000 users) with a full course journey (enrol → pre-test → modules → post-test → certificate), SCORM 1.2/2004 interoperability, role-gated dashboards, and end-of-course CSAT/NPS surveys.

PRD-A covers Phases 1–2 only: core LMS, SCORM bridge, and analytics dashboard. LTI 1.3, Mux video, and LinkedIn sharing are deferred to PRD-B.

---

## 2. Goals

- Learner completes full course journey: enrol → pre-test → modules → post-test → 2-tier certificate
- SCORM 1.2/2004 packages play inside the PlayerShell and commit progress to Sanity via `scorm-again`
- 4 roles (Learner, Program Manager, Partner/Donor, System Admin) with correct country-scoped data visibility
- Dashboard surfaces CSAT, NPS, knowledge gain, DAU, conversion rate, retention — filterable by country/gender/age/learner type
- End-of-course survey (CSAT + NPS) fires at course completion
- `npx tsc --noEmit` passes; WCAG 2.1 AA on PlayerShell; all styling via CSS Modules + `--hds-*` tokens

---

## 3. Non-Goals (PRD-A)

- LTI 1.3 OIDC Tool Provider (PRD-B)
- Mux/Cloudflare Stream video lessons (PRD-B)
- LinkedIn certificate sharing (PRD-B)
- WhatsApp / USSD / IVR / offline channels (separate PRD)
- DHIS2 interoperability (separate PRD)
- Messaging / peer chat forum (existing forum feature — wire up later)
- External database (Postgres/Turso) — Sanity-only persistence in PRD-A

---

## 4. User Stories

**Learner**
- I can register with mandatory fields (name, DOB ≥18, gender, province, health worker type, pharmacy, email, phone) and have a username auto-generated from my phone number
- I can browse courses assigned to my country + global courses
- I can complete a course journey: enrol → pre-test → modules → activities → post-test → certificate
- I receive a Participation certificate on completion; an Accomplishment certificate if I meet the post-test score threshold
- I complete a CSAT + NPS survey at end of course
- SCORM module plays within the unified PlayerShell and tracks my progress

**Program Manager**
- I see dashboard metrics (CSAT, NPS, knowledge gain, DAU, conversion, retention) filtered to my country only
- I can filter by gender, age group, learner type, geography

**Program Director / System Admin**
- I see dashboard metrics across all countries
- I can filter by country, gender, age group, learner type

**Content Editor (Sanity Studio)**
- I can create a Course with Modules and Lessons (text, SCORM) in Sanity Studio
- I can upload a SCORM ZIP for a lesson and have it auto-extracted to Vercel Blob
- I can set a post-test pass threshold per course for Accomplishment certificate

---

## 5. Technical Architecture

### Route Tree

```
src/app/elearning/
├── page.tsx                              # Course catalogue (replace marketing stub)
├── page.module.css
├── courses/
│   ├── [slug]/
│   │   ├── page.tsx                      # Course overview + enrol CTA
│   │   ├── page.module.css
│   │   └── [moduleSlug]/
│   │       ├── page.tsx                  # Lesson renderer (inside PlayerShell)
│   │       └── page.module.css
└── dashboard/
    ├── page.tsx                          # Role-gated analytics dashboard
    └── page.module.css
```

### Sanity Schema Hierarchy

```
course
  └── modules: reference[] → courseModule
        └── lessons: reference[] → lesson (type: text | scorm)
              └── lessonProgress (document, keyed by userId + lessonId)
              └── surveyResponse (document, keyed by userId + courseId)
              └── certificate (document, keyed by userId + courseId)
```

### Clerk Metadata Shape

```typescript
publicMetadata: {
  role: 'learner' | 'program_manager' | 'partner_donor' | 'system_admin'
  country: string          // ISO country code
  completedLessons: string[] // short lesson IDs, max ~150 at 8 chars each
  lms_registered: boolean
}
```

### Data Flow

1. Clerk Middleware validates session; redirects unauthenticated to sign-in
2. Server Component fetches course/module/lesson from Sanity via GROQ
3. Lesson type determines renderer:
   - `text` → Portable Text + `@portabletext/react`
   - `scorm` → `ScormPlayer` client component + `scorm-again` bridge
4. Progress mutations: `POST /api/lms/progress` → writes `lessonProgress` to Sanity + updates `publicMetadata.completedLessons`
5. Course completion triggers:
   - `POST /api/lms/survey` → writes `surveyResponse` to Sanity
   - `POST /api/lms/certificate` → determines tier (Participation vs Accomplishment), writes `certificate` to Sanity, returns PDF

### SCORM Bridge

- SCORM ZIP upload: `POST /api/lms/scorm-upload` → `jszip` extraction → `@vercel/blob` upload (public)
- `ScormPlayer` mounts `CrossFrameLMS` (parent) + `CrossFrameAPI` (child) via `scorm-again` — required because Vercel Blob is cross-origin
- All `window.*` assignments inside `useEffect` only (React Compiler constraint)
- Commit hooks call `POST /api/lms/scorm-commit` → Sanity `lessonProgress` mutation

### Dashboard

- GROQ queries aggregate `lessonProgress`, `surveyResponse`, `certificate` documents
- Role-scoped: Program Manager GROQ filters `country == $userCountry`; Program Director queries unrestricted
- Reuse existing `src/components/charts/CompletionsBar` where applicable
- Metrics: CSAT (avg Likert), NPS (promoters/total), knowledge gain (pre vs post score delta), DAU, conversion rate, retention, new users by country, course count

---

## 6. Constraints

- CSS Modules + `--hds-*` tokens only — no Tailwind, no `styled-components`
- React Compiler active — no manual `useMemo`/`useCallback` except `ScormPlayer`
- `courseModule` not `module` (Node.js reserved identifier)
- `src/middleware.ts` is `require_review` — changes need review gate
- Sanity `writeClient` for all mutations; `client` (CDN) for reads
- `npx tsc --noEmit` must pass before any deployment
- Unauthenticated users hitting `/elearning/courses/*` or `/elearning/dashboard/*` redirect to Clerk sign-in (no guest access)
- Clerk `publicMetadata` session token cap ~1.2KB; use 8-char short IDs for `completedLessons`; fall back to Sanity GROQ when `completedLessons.length > 25`

---

## 7. New Dependencies

```bash
npm install scorm-again @vercel/blob jszip @react-pdf/renderer
```

---

## 8. Research Findings

See `.karimo/prds/elearning-framework/research/summary.md` for full findings.

**Key decisions from research:**
- `scorm-again` with `CrossFrameLMS`/`CrossFrameAPI` (Vercel Blob = cross-origin iframes)
- `ltijs` incompatible with App Router — deferred to PRD-B using `jose`
- `npx sanity typegen generate` (built-in to sanity ^5.23.0) for TypeScript codegen
- Sanity-only persistence (no external DB) — validate at scale before adding complexity
- Existing `src/components/charts/CompletionsBar` reusable for dashboard

---

## 9. Open Questions

- ~~Post-test pass threshold: fixed or per-course?~~ **Resolved: per-course via `course.passingScore` field in T01 schema.**
- ~~`lessonProgress` document keying: one doc per lesson or array per course?~~ **Resolved: one document per lesson, `_id: lp_userId_lessonId`.**
- **BLOB_READ_WRITE_TOKEN: Must be provisioned in Vercel project before Wave 2b begins.** T05 cannot complete without it. Confirm with team before /karimo:run.
- **Dashboard filter dimensions:** Resolved — gender/ageGroup/healthWorkerType/country denormalized onto lessonProgress and surveyResponse documents at write time. No Clerk API join needed at query time.

---

## Tasks

See `tasks.yaml` for full task definitions.

| ID | Title | Wave | Complexity | Priority |
|----|-------|------|------------|----------|
| T00 | Dependency bootstrap | 1 | 1 | critical |
| T01 | Sanity schemas + typegen | 1 | 3 | critical |
| T02 | Clerk roles + registration | 1 | 4 | critical |
| T03 | Course journey + PlayerShell | 2a | 5 | critical |
| T04 | Pre/post-test + self-assessment engine | 2b | 4 | critical |
| T05 | SCORM upload + bridge + commit | 2b | 5 | must |
| T06 | End-of-course survey (CSAT + NPS) | 2b | 2 | must |
| T07 | Certificate generation (2-tier PDF) | 3 | 3 | must |
| T08 | Dashboard GROQ + analytics queries | 3 | 4 | must |
| T09 | Dashboard UI + role-gated views | 4 | 5 | must |

**Total:** 10 tasks, 36 complexity points
