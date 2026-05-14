# Brief: End-of-Course Survey (CSAT + NPS)
**Task ID:** T06
**PRD:** elearning-framework
**Wave:** 2b
**Complexity:** 2
**Priority:** must
**Model:** sonnet
**Depends On:** T01, T02, T03
**Require Review:** false

---

## Objective
Build the end-of-course CSAT + NPS survey: a `SurveyForm` client component and its Route Handler. The survey fires once per course after post-test completion. T06 delivers the `SurveyForm` component — it does not modify the lesson renderer page (`[moduleSlug]/page.tsx`), which already exports a `SurveyFormSlot` null stub from T03.

---

## Context

**T06 does not modify `[moduleSlug]/page.tsx`.** The slot stubs live in `src/components/lms/slots.tsx` (created by T03). T06 replaces the `SurveyFormSlot` stub in that file with the real `SurveyForm` component. The lesson renderer page is not changed — T06 modifies `src/components/lms/slots.tsx` only.

**Survey questions:**
- Q1 CSAT: "How satisfied are you with this course?" — 1–5 Likert scale (render as star rating or 5 radio buttons)
- Q2 NPS: "How likely are you to recommend this platform to a colleague?" — 0–10 scale (render as 11 radio buttons or a number row)

**Idempotency:** `surveyResponse` document `_id` is `sr_${userId}_${courseId}`. The Route Handler returns `409` if a document with that `_id` already exists. The `SurveyForm` component should check for an existing `surveyResponse` before rendering — if one exists, render a "Thank you for completing the survey" message instead of the form. Check via GROQ on the server side before passing props to the client component.

**Denormalized fields:** When writing `surveyResponse` via `POST /api/lms/survey`, include `gender`, `ageGroup`, `healthWorkerType`, `country` from Clerk session claims. Same pattern as T03 progress and T05 scorm-commit. These fields enable T08 dashboard GROQ filters without a Clerk API join.

**When the survey fires:** After the final post-test submission. The `SurveyFormSlot` in the lesson renderer is rendered on the lesson page — T03 places it after the lesson content area. The survey should only be visible/active after the post-test `lessonProgress` document shows `completed: true`. Pass `completed` state as a prop to control visibility.

**WCAG 2.1 AA:**
- All radio inputs must have associated `<label>` elements with `htmlFor` matching input `id`.
- The NPS 0–10 scale: label each radio with its number and a semantic label (e.g., "0 - Not at all likely", "10 - Extremely likely").
- Keyboard navigable: tab through options, space/enter to select.

**`'use client'` required:** `SurveyForm` has user interaction and form state.

**React Compiler:** No `useMemo` or `useCallback`.

---

## Files to Create / Modify
| Path | Action | Notes |
|------|--------|-------|
| `src/components/lms/SurveyForm.tsx` | create | `'use client'` — CSAT + NPS survey form |
| `src/components/lms/SurveyForm.module.css` | create | Survey form styles using `--hds-*` tokens |
| `src/components/lms/slots.tsx` | modify | Replace `SurveyFormSlot` stub with real `SurveyForm` |
| `src/app/api/lms/survey/route.ts` | create | POST Route Handler for survey submission |

---

## Implementation Steps

### Step 1 — Create `src/components/lms/SurveyForm.tsx`
```typescript
'use client'
```
Props:
```typescript
interface SurveyFormProps {
  courseId: string
  alreadySubmitted: boolean // checked server-side before passing props
}
```

State:
- `csatScore: number | null` (1–5)
- `npsScore: number | null` (0–10)
- `submitted: boolean`
- `error: string | null`

Render logic:
1. If `alreadySubmitted === true` or `submitted === true`: render a thank-you message ("Thank you for completing the survey!"). Do not render the form.
2. Otherwise render:
   - Q1 CSAT: label + 5 radio inputs (values 1–5) or a star-rating component. Each input: `id="csat-{n}"`, `<label htmlFor="csat-{n}">`.
   - Q2 NPS: label + 11 radio inputs (values 0–10). Label each with its number. Annotate 0 as "Not at all likely" and 10 as "Extremely likely".
   - Submit button: disabled until both questions answered.
3. On submit:
   - `POST /api/lms/survey` with `{ courseId, csatScore, npsScore }`.
   - On `200`: set `submitted = true`.
   - On `409`: set `submitted = true` (already submitted, treat as success for UX).
   - On other error: set `error` message.

### Step 2 — Create `src/components/lms/SurveyForm.module.css`
CSS Module using `--hds-*` tokens. Key styles:
- Form container with appropriate padding
- Likert scale items laid out horizontally (flex row)
- NPS scale: responsive horizontal row of numbered options
- Star/radio option hover/focus states using `--hds-color-*` tokens
- Submit button using HDS button token pattern

### Step 3 — Create `src/app/api/lms/survey/route.ts`
1. Auth guard: return 401 if no `userId`.
2. Parse body: `{ courseId: string; csatScore: number; npsScore: number }`.
3. Validate: `csatScore` must be 1–5 integer; `npsScore` must be 0–10 integer. Return 400 for invalid values.
4. Check for existing `surveyResponse` document:
   ```typescript
   const existing = await client.fetch(
     `*[_type == "surveyResponse" && _id == $id][0]`,
     { id: `sr_${userId}_${courseId}` }
   )
   if (existing) return Response.json({ error: 'Already submitted' }, { status: 409 })
   ```
5. Read denormalized fields from Clerk session: `gender`, `country`, `healthWorkerType`. Derive `ageGroup` from DOB.
6. Write `surveyResponse` document via `writeClient`:
   ```typescript
   await writeClient.create({
     _type: 'surveyResponse',
     _id: `sr_${userId}_${courseId}`,
     userId,
     courseId,
     csatScore,
     npsScore,
     completedAt: new Date().toISOString(),
     gender,
     ageGroup,
     healthWorkerType,
     country,
   })
   ```
7. Return `200 { success: true }`.

### Step 4 — Wire `SurveyForm` into `src/components/lms/slots.tsx`

In `src/components/lms/slots.tsx`, replace the `SurveyFormSlot` stub with the real `SurveyForm` component import. The function signature must remain identical to the stub:
```typescript
import { SurveyForm } from './SurveyForm'

// Signature unchanged — T03 contract preserved
export function SurveyFormSlot(props: { courseId: string }) {
  // alreadySubmitted is checked server-side by the page before rendering this slot
  return <SurveyForm courseId={props.courseId} alreadySubmitted={false} />
}
```
Do NOT modify `src/app/elearning/courses/[slug]/[moduleSlug]/page.tsx`.

---

## Acceptance Criteria
- [ ] `SurveyForm` renders after post-test completion
- [ ] CSAT question (1–5) present with radio inputs or equivalent, WCAG AA labelling
- [ ] NPS question (0–10) present with all 11 options, WCAG AA labelling
- [ ] Form not rendered if `alreadySubmitted === true`
- [ ] Submit button disabled until both questions answered
- [ ] `POST /api/lms/survey` writes `surveyResponse` to Sanity with `_id: sr_userId_courseId`
- [ ] `POST /api/lms/survey` returns 409 if survey already submitted for this course
- [ ] `surveyResponse` document includes denormalized `gender`, `ageGroup`, `healthWorkerType`, `country` fields
- [ ] Survey only renders once per course (idempotent)
- [ ] CSS Modules + `--hds-*` tokens throughout; no Tailwind
- [ ] No `useMemo` or `useCallback`
- [ ] `src/components/lms/slots.tsx` updated — `SurveyFormSlot` now renders real `SurveyForm`; `[moduleSlug]/page.tsx` not modified
- [ ] `npx tsc --noEmit` passes

---

## Dependencies
Before starting, verify:
- T01 complete: `surveyResponse` schema defined in `sanity.types.ts` with `csatScore`, `npsScore`, denormalized fields.
- T02 complete: auth pattern and `sessionClaims.metadata` shape available.
- T03 complete: `SurveyFormSlot` stub exported from `src/components/lms/slots.tsx`; `[moduleSlug]/page.tsx` imports from that module.

---

## Do Not
- Do NOT modify `src/app/elearning/courses/[slug]/[moduleSlug]/page.tsx` — slot wiring happens in `src/components/lms/slots.tsx` only.
- Do NOT touch `ScormPlayerSlot` in `src/components/lms/slots.tsx` — that is T05's responsibility.
- Do NOT add NPS promoter logic in this task — NPS calculation (`npsScore >= 9`) is T08's responsibility.
- Do NOT render the survey for non-learner roles — survey is a learner-only interaction.
- Do NOT use `useMemo` or `useCallback` — React Compiler is active.
- Do NOT touch `src/sanity/lib/client.ts`, `src/sanity/lib/write-client.ts`, `sanity.config.ts`, or `.env*` files.
- Do NOT implement CSAT as a text input — must be a Likert scale (1–5 discrete values).

---

*Generated by KARIMO Brief Writer*
*PRD: elearning-framework | Task: T06 | Wave: 2b*
