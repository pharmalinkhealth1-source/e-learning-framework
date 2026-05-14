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
- Learner "My Learning" view shows enrolled courses, progress, certificates, and expiry alerts
- Module completion gates enforce sequential learning (each module unlocks only after the prior completes)
- Auto-enrollment on registration for country-matched and global courses
- Certificate expiry set at 1 year; expiry warnings surfaced in learner and admin views
- Email notifications sent on enrollment, certificate issuance, and 30-day expiry warning
- In-app notification feed in "My Learning" view
- Mobile-responsive PlayerShell (CSS Module breakpoints)

---

## 3. Non-Goals (PRD-A)

- LTI 1.3 OIDC Tool Provider (PRD-B)
- Mux/Cloudflare Stream video lessons (PRD-B)
- LinkedIn certificate sharing (PRD-B)
- WhatsApp / USSD / IVR / offline channels (separate PRD)
- DHIS2 interoperability (separate PRD)
- Forum/peer messaging integration (wire up in PRD-C)
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

## 4a. User & Course Journeys

### Journey 1: First-Time Registration & Login
1. New user visits `/elearning` → sees course catalogue with locked CTAs
2. Clicks "Register" → `/elearning/register` (T02)
3. Completes mandatory registration form (name, DOB ≥18, gender, province, health worker type, pharmacy, email, phone)
4. Country auto-detected from phone prefix → language pre-filled → user confirms
5. Username auto-generated from phone number (country code, no `+` or leading `0`s)
6. `POST /api/lms/register` sets `publicMetadata: { role: 'learner', country, lms_registered: true, completedLessons: [] }`
7. Auto-enrollment triggered: Sanity query for `course.country includes userCountry || 'global'` → creates `enrollment` documents (T03)
8. Welcome email sent via Clerk (T02)
9. Redirect to `/elearning/my-learning`
10. User sees enrolled course cards with "Start" CTAs

### Journey 2: Full Course Learning Flow
1. `/elearning/my-learning` → select in-progress or new course
2. Course overview page: module list with lock/unlock state, pre-test CTA
3. **Pre-test** (required): complete before any module unlocks — score recorded, no gate
4. **Module 1** unlocks: learner works through lessons (text or SCORM) in order
   - Each lesson completion updates `lessonProgress` + `publicMetadata.completedLessons`
   - SCORM lessons auto-commit via `scorm-again` bridge
5. **Module N+1 locks** until Module N fully complete (all lessons done)
6. After all modules: **Self-assessment** (informational)
7. **Post-test**: score compared to `course.passingScore`
8. **Survey** (CSAT + NPS): fires immediately after post-test
9. **Certificate issued**: Participation (always) or Accomplishment (score ≥ passingScore)
   - Certificate PDF generated, uploaded to Vercel Blob (private)
   - `expiresAt` set to 1 year from `issuedAt`
   - "Certificate ready" email sent via Clerk
   - Notification document written to Sanity
10. Learner redirected to `/elearning/my-learning` — course card shows "Completed" + certificate tier badge

### Journey 3: Learner "My Learning" Dashboard
Route: `/elearning/my-learning` (learner role only; other roles redirect to `/elearning/dashboard`)

1. **Enrolled courses grid**: card per course with title, progress % bar, last activity date, "Continue" or "Start" CTA
2. **Completed courses section**: course card with certificate tier badge (Participation / Accomplishment)
3. **Certificates panel**: table — course name, tier, issued date, expiry date, "Download" button
4. **Expiry alerts**: courses with certificates expiring within 30 days show warning badge
5. **Notification feed**: recent system notifications (enrollment confirmed, certificate ready, expiry warning, inactivity nudge)

### Journey 4: Admin / Program Manager Analytics Flow
Route: `/elearning/dashboard` (admin, program_manager, partner_donor roles; learner redirected to `/elearning/my-learning`)

1. **KPI cards row**: CSAT, NPS, Knowledge Gain, DAU, Conversion Rate, Retention Rate
2. **Filter bar**: country (program_manager pre-filled + disabled), gender, age group, learner type
3. **Charts section**: new users by country (MetricsBar), knowledge base growth over time (MetricsBar)
4. **Expiring certificates alert**: count of certificates expiring within 30 days → click to expand list
5. **Enrollment by country**: MetricsBar showing enrollments per country
6. **Certificate list**: all issued certificates — learner name, course, tier, issue date, expiry date

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
| T02 | Clerk roles + registration + email | 1 | 4 | critical |
| T03 | Course journey + PlayerShell + My Learning | 2a | 5 | critical |
| T04 | Pre/post-test + self-assessment engine | 2b | 4 | critical |
| T05 | SCORM upload + bridge + commit | 2b | 5 | must |
| T06 | End-of-course survey (CSAT + NPS) | 2b | 2 | must |
| T07 | Certificate generation (2-tier PDF + expiry) | 3 | 3 | must |
| T08 | Dashboard GROQ + analytics queries | 3 | 4 | must |
| T09 | Dashboard UI + role-gated views | 4 | 5 | must |
| T10 | Notifications (email + in-app) | 3 | 3 | must |

**Total:** 11 tasks, 39 complexity points
