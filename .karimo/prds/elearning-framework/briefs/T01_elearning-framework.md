# Brief: Sanity Schemas + Typegen
**Task ID:** T01
**PRD:** elearning-framework
**Wave:** 1
**Complexity:** 3
**Priority:** critical
**Model:** sonnet
**Depends On:** none
**Require Review:** true

---

## Objective
Define all six Sanity v5 document/object schemas for the LMS data model, register them, run TypeScript codegen, and create the shared TypeScript type file and local-dev fallback stubs. Every downstream task depends on these types — this is the foundational data contract for the entire LMS.

---

## Context

**Patterns to follow from existing codebase:**
- All schemas use `defineField` / `defineType` with named exports — see `src/sanity/schemaTypes/directoryItem.ts` and `src/sanity/schemaTypes/jobOpening.ts` for current project conventions.
- Schemas are registered in `src/sanity/schemaTypes/index.ts` — add new schemas to the existing `schemaTypes` array, do not replace the file.
- Slug fields use `{ source: 'title' }` — follow the same pattern.
- References use `{ type: 'reference', to: [{ type: 'schemaName' }] }` syntax.
- `src/sanity/lib/client.ts` has a mock fallback map for local dev — `lms-fallbacks.ts` is a separate file that extends this pattern but must NOT modify `client.ts`.
- `writeClient` is exported from `src/sanity/lib/write-client.ts` (token-bearing) — used for all mutations. Do not import it in schema files.
- TypeScript codegen: `npx sanity typegen generate` is built into `sanity ^5.23.0` — no additional install required. Generates `sanity.types.ts` in the project root (or wherever `sanity.config.ts` specifies `schema.types`).

**`quiz.ts` is a Sanity object type, not a document type.** It cannot be queried independently — it is used inline within `lesson.ts` as the `questions[]` field type.

**Naming constraint:** Use `courseModule` as the schema name, NOT `module`. `module` is a Node.js reserved identifier and will cause runtime errors.

**Denormalized fields on progress/survey documents:** `gender`, `ageGroup`, `healthWorkerType`, `country` are NOT sourced from Sanity — they are written at mutation time from Clerk session claims (by T03/T05/T06). Define them as plain `string` fields with no validation in the schema. They exist purely to enable GROQ dashboard filters (T08) without requiring a Clerk API join at query time.

---

## Files to Create / Modify
| Path | Action | Notes |
|------|--------|-------|
| `src/sanity/schemaTypes/course.ts` | create | Document schema |
| `src/sanity/schemaTypes/courseModule.ts` | create | Document schema (NOT `module`) |
| `src/sanity/schemaTypes/lesson.ts` | create | Document schema with 3 types |
| `src/sanity/schemaTypes/quiz.ts` | create | Object type (inline, not document) |
| `src/sanity/schemaTypes/lessonProgress.ts` | create | Document schema |
| `src/sanity/schemaTypes/surveyResponse.ts` | create | Document schema |
| `src/sanity/schemaTypes/certificate.ts` | create | Document schema |
| `src/sanity/schemaTypes/index.ts` | modify | Add 6 new schemas to existing array |
| `src/sanity/lib/lms-fallbacks.ts` | create | Mock data for local dev |
| `src/types/lms.ts` | create | Plain TypeScript interfaces |
| `sanity.types.ts` | auto-generated | Run `npx sanity typegen generate` and commit |

---

## Implementation Steps

### Step 1 — Create `src/sanity/schemaTypes/quiz.ts`
Object type (not `defineDocument`) with:
- `questionText`: `string`, required
- `options`: `array` of `string`
- `correctIndex`: `number`

```typescript
// quiz.ts — Sanity object type, used inline in lesson.ts questions[] field
import { defineField, defineType } from 'sanity'

export const quiz = defineType({
  name: 'quiz',
  type: 'object',
  title: 'Quiz Question',
  fields: [
    defineField({ name: 'questionText', type: 'string', title: 'Question', validation: Rule => Rule.required() }),
    defineField({ name: 'options', type: 'array', title: 'Options', of: [{ type: 'string' }] }),
    defineField({ name: 'correctIndex', type: 'number', title: 'Correct Answer Index' }),
  ],
})
```

### Step 2 — Create `src/sanity/schemaTypes/course.ts`
Document type with fields:
- `title`: `string`, required
- `slug`: `slug`, source: `title`, required
- `description`: `text`
- `modules`: `array` of `reference` to `courseModule`
- `passingScore`: `number` (0–100, per-course post-test pass threshold for Accomplishment tier)
- `country`: `array` of `string` (ISO country codes; include `"global"` for all-country courses)

### Step 3 — Create `src/sanity/schemaTypes/courseModule.ts`
Document type with fields:
- `title`: `string`, required
- `slug`: `slug`, source: `title`, required
- `lessons`: `array` of `reference` to `lesson`

### Step 4 — Create `src/sanity/schemaTypes/lesson.ts`
Document type with fields:
- `title`: `string`, required
- `slug`: `slug`, source: `title`, required
- `type`: `string`, options list: `['text', 'scorm', 'quiz']`
- `content`: `array` of `block` (Portable Text), hidden when `document.type !== 'text'`
- `scormPackage`: `file`, hidden when `document.type !== 'scorm'`
- `scormEntryUrl`: `string`, hidden when `document.type !== 'scorm'` (URL written by scorm-upload API)
- `scormVersion`: `string`, options list: `['1.2', '2004']`, hidden when `document.type !== 'scorm'`
- `questions`: `array` of `quiz` object type, hidden when `document.type !== 'quiz'`
- `quizRole`: `string`, options list: `['pre-test', 'post-test', 'self-assessment']`, hidden when `document.type !== 'quiz'`

### Step 5 — Create `src/sanity/schemaTypes/lessonProgress.ts`
Document type with fields (note: `_id` is set programmatically as `lp_userId_lessonId` — define it in schema as a `string` field named `_id` is NOT needed; Sanity _id is set via `_id` key in the create mutation). Fields to define:
- `userId`: `string`, required
- `lessonId`: `string`, required
- `lessonShortId`: `string` (8-char short ID for Clerk metadata array)
- `courseId`: `string`, required
- `completed`: `boolean`
- `preTestScore`: `number`
- `postTestScore`: `number`
- `scormData`: `object` (freeform — use `{ type: 'object', fields: [] }` with a JSON-like field or simply `type: 'text'` to store stringified CMI data)
- `timeSpent`: `number` (seconds)
- `completedAt`: `datetime`
- `gender`: `string`
- `ageGroup`: `string`
- `healthWorkerType`: `string`
- `country`: `string`

### Step 6 — Create `src/sanity/schemaTypes/surveyResponse.ts`
Document type with fields (`_id` set programmatically as `sr_userId_courseId`):
- `userId`: `string`, required
- `courseId`: `string`, required
- `csatScore`: `number`, validation: min 1, max 5
- `npsScore`: `number`, validation: min 0, max 10
- `completedAt`: `datetime`
- `gender`: `string`
- `ageGroup`: `string`
- `healthWorkerType`: `string`
- `country`: `string`

### Step 7 — Create `src/sanity/schemaTypes/certificate.ts`
Document type with fields (`_id` set programmatically as `cert_userId_courseId`):
- `userId`: `string`, required
- `courseId`: `string`, required
- `tier`: `string`, options list: `['participation', 'accomplishment']`
- `score`: `number`
- `issuedAt`: `datetime`
- `blobUrl`: `string`

### Step 8 — Register all schemas in `src/sanity/schemaTypes/index.ts`
Import and add to the `schema.types` array in `src/sanity/schemaTypes/index.ts`: `course`, `courseModule`, `lesson`, `quiz`, `lessonProgress`, `surveyResponse`, `certificate`. Do not remove any existing schema registrations.

### Step 9 — Create `src/types/lms.ts`
Plain TypeScript file (no Sanity imports). Define and export:
```typescript
export type LmsRole = 'learner' | 'program_manager' | 'partner_donor' | 'system_admin'
export type CertificateTier = 'participation' | 'accomplishment'
export interface DashboardFilters {
  country?: string
  gender?: string
  ageGroup?: string
  learnerType?: string
}
export interface QuizSubmission {
  courseId: string
  lessonId: string
  answers: number[]
  quizRole: 'pre-test' | 'post-test' | 'self-assessment'
}
export interface DashboardMetrics {
  csatAvg: number
  npsScore: number
  knowledgeGain: number
  dau: number
  conversionRate: number
  retentionRate: number
  newUsersByCountry: Record<string, number>
  knowledgeBaseGrowth: number
}
```

### Step 10 — Create `src/sanity/lib/lms-fallbacks.ts`
Mock data entries for local dev (when Sanity is unavailable). Export typed mock objects for at minimum: one `course`, one `lesson`, one `lessonProgress`. This file provides fallback data for GROQ queries in local dev. Do NOT modify `src/sanity/lib/client.ts`.

### Step 11 — Run typegen and commit
```
npx sanity typegen generate
```
Commit the generated `sanity.types.ts` file to the repository. Run `npx tsc --noEmit` and confirm it passes before committing.

---

## Acceptance Criteria
- [ ] `course.ts` schema created with `title`, `slug`, `description`, `modules[]`, `passingScore`, `country[]` fields
- [ ] `courseModule.ts` schema created (name is `courseModule`, not `module`)
- [ ] `lesson.ts` schema created with `type` enum (`text`, `scorm`, `quiz`), conditional `content`/`scormPackage`/`scormEntryUrl`/`scormVersion`/`questions`/`quizRole` fields
- [ ] `lesson.ts` schema includes `scormVersion` field (options: `'1.2'`, `'2004'`; hidden unless type is `'scorm'`)
- [ ] `quiz.ts` object type created with `questionText`, `options[]`, `correctIndex` fields
- [ ] `lessonProgress.ts` schema created with `preTestScore`, `postTestScore`, `lessonShortId`, `gender`, `ageGroup`, `healthWorkerType`, `country` fields
- [ ] `surveyResponse.ts` schema created with `csatScore` (1–5), `npsScore` (0–10), denormalized fields
- [ ] `certificate.ts` schema created with `tier` enum (`participation`, `accomplishment`), `blobUrl`
- [ ] All six document types + `quiz` object type added to the `schema.types` array in `src/sanity/schemaTypes/index.ts`
- [ ] `src/types/lms.ts` created with `LmsRole`, `CertificateTier`, `DashboardFilters`, `QuizSubmission`, `DashboardMetrics` exports
- [ ] `src/sanity/lib/lms-fallbacks.ts` created with mock entries for local dev
- [ ] `src/sanity/lib/client.ts` NOT modified
- [ ] `npx sanity typegen generate` runs without errors
- [ ] `sanity.types.ts` committed to repo
- [ ] `npx tsc --noEmit` passes

---

## Dependencies
- No upstream task dependencies — this task can start immediately.
- `sanity ^5.23.0` must be installed (already present in the project).

---

## Do Not
- Do NOT name any schema `module` — use `courseModule`.
- Do NOT create `quiz` as a document type — it must be an object type used inline in `lesson.ts`.
- Do NOT modify `src/sanity/lib/client.ts` — create `lms-fallbacks.ts` as a separate file.
- Do NOT modify `src/sanity/lib/write-client.ts`.
- Do NOT use `styled-components` or Tailwind in any file — the `CommentForm.tsx` precedent for `styled-components` must NOT be followed.
- Do NOT use `sanity-codegen` — it is deprecated. Use `npx sanity typegen generate`.
- Do NOT touch `sanity.config.ts` or any `.env*` file.
- Do NOT define `_id` as a schema field — it is set programmatically in mutation calls via the `_id` key.
- Do NOT add `lti` as a lesson type — LTI is PRD-B scope only.

---

*Generated by KARIMO Brief Writer*
*PRD: elearning-framework | Task: T01 | Wave: 1*
