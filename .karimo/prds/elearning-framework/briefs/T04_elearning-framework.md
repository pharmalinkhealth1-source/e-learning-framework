# Brief: Pre/Post-Test + Self-Assessment Engine
**Task ID:** T04
**PRD:** elearning-framework
**Wave:** 2b
**Complexity:** 4
**Priority:** critical
**Model:** sonnet
**Depends On:** T01, T02, T03
**Require Review:** true

---

## Objective
Build the quiz rendering engine (QuizEngine + QuestionCard client components) and the quiz submission Route Handler. This handles all three quiz roles — pre-test (no gate), post-test (determines certificate tier), and self-assessment (informational only) — consuming schema types already defined in T01.

---

## Context

**Quiz schema is already defined in T01 — do not touch schema files.** T04 only consumes the generated `sanity.types.ts` types. The `lesson` document has `type: 'quiz'`, `questions[]` (array of `quiz` object), and `quizRole: 'pre-test' | 'post-test' | 'self-assessment'`.

**`quizRole` determines behavior:**
- `'pre-test'`: Renders before first module. No pass/fail gate — records `preTestScore` on `lessonProgress` but allows the learner to continue regardless of score.
- `'post-test'`: Renders after last module. Score compared against `course.passingScore` to determine certificate tier. Returns `{ score, passed, tier }` from Route Handler.
- `'self-assessment'`: Renders mid-course. Informational only — shows result but has no effect on progression or certificate tier.

**Tier logic in the Route Handler:**
```
tier = score >= course.passingScore ? 'accomplishment' : 'participation'
```
This is evaluated server-side in `/api/lms/quiz-submit`. The client renders whatever the server returns.

**Wire into lesson renderer from T03:** The `[moduleSlug]/page.tsx` from T03 already has a `type === 'quiz'` branch that renders a placeholder. T04 creates `QuizEngine` and wires it into that branch. However, T04 must NOT modify `[moduleSlug]/page.tsx` in ways that break the `ScormPlayerSlot` or `SurveyFormSlot` exports — those are owned by T03's contract with T05 and T06. Only touch the quiz rendering branch.

**`'use client'` required on QuizEngine:** It has user interaction (radio selection, form submission, state tracking). Use `'use client'` on `QuizEngine.tsx` only. `QuestionCard` is a presentational sub-component also requiring `'use client'` since it is rendered by QuizEngine.

**React Compiler:** Do not use `useMemo` or `useCallback` — React Compiler handles memoization. Exception: if `QuizEngine` has genuinely complex event handler logic that causes correctness issues, document the exception.

**Types from `sanity.types.ts`:** Import the generated Sanity types for `Lesson` (which includes `questions` and `quizRole`). Import `QuizSubmission` from `src/types/lms.ts` (created in T01) for the request body shape.

**Auth guard pattern:** Same as all Route Handlers — `const { userId } = await auth()`, return 401 if `!userId`.

---

## Files to Create / Modify
| Path | Action | Notes |
|------|--------|-------|
| `src/components/lms/QuizEngine.tsx` | create | `'use client'` — quiz orchestrator component |
| `src/components/lms/QuizEngine.module.css` | create | Quiz layout styles using `--hds-*` tokens |
| `src/components/lms/QuestionCard.tsx` | create | `'use client'` — single question + radio options |
| `src/components/lms/QuestionCard.module.css` | create | QuestionCard styles using `--hds-*` tokens |
| `src/app/api/lms/quiz-submit/route.ts` | create | POST Route Handler for quiz submission |

---

## Implementation Steps

### Step 1 — Create `src/components/lms/QuestionCard.tsx`
`'use client'` component. Props:
```typescript
interface QuestionCardProps {
  question: { questionText: string; options: string[]; correctIndex: number }
  questionIndex: number
  selectedAnswer: number | null
  onSelect: (index: number) => void
  showResult?: boolean // true after submission — reveals correct/incorrect
}
```
Renders:
- Question text
- Radio button options (one per `options` item) — use `<input type="radio">` with proper `<label>` association
- When `showResult === true`: highlight the selected answer (correct/incorrect) and reveal the correct answer
- CSS Module styles with `--hds-*` tokens; WCAG AA: each radio has an associated `<label>` with `htmlFor`

### Step 2 — Create `src/components/lms/QuizEngine.tsx`
`'use client'` component. Props:
```typescript
interface QuizEngineProps {
  questions: Array<{ questionText: string; options: string[]; correctIndex: number }>
  quizRole: 'pre-test' | 'post-test' | 'self-assessment'
  lessonId: string
  courseId: string
  onComplete: (result: { score: number; tier: 'participation' | 'accomplishment' | null }) => void
}
```
State:
- `currentQuestionIndex: number` (0-based)
- `answers: number[]` (selected answer index per question)
- `submitted: boolean`
- `result: { score: number; tier: string; passed: boolean } | null`

Behavior:
1. Render questions one at a time with Previous/Next navigation, or all at once — designer choice, but ensure each question is individually accessible.
2. Submit button appears on final question.
3. On submit: `POST /api/lms/quiz-submit` with `{ courseId, lessonId, answers, quizRole }`.
4. On response: set `result` state and call `onComplete(result)`.
5. Show score summary after submission:
   - `'pre-test'`: Show score, message like "You scored X/Y — now begin the course."
   - `'post-test'`: Show score + tier badge ("Certificate of Accomplishment" or "Certificate of Participation").
   - `'self-assessment'`: Show score + informational message, no tier badge.

### Step 3 — Create `src/app/api/lms/quiz-submit/route.ts`
1. Auth guard: return 401 if no `userId`.
2. Parse body as `QuizSubmission`: `{ courseId, lessonId, answers, quizRole }`.
3. Fetch the lesson from Sanity to get `questions[]` and fetch the course to get `passingScore`:
   ```groq
   *[_type == "lesson" && _id == $lessonId][0] { questions, quizRole }
   *[_type == "course" && _id == $courseId][0] { passingScore }
   ```
4. Calculate score: count `answers[i] === questions[i].correctIndex`, divide by `questions.length`, multiply by 100 (percentage, 0–100).
5. Determine tier (only relevant for `post-test`):
   ```typescript
   const tier = quizRole === 'post-test'
     ? (score >= course.passingScore ? 'accomplishment' : 'participation')
     : null
   ```
6. Upsert `lessonProgress` document via `writeClient` (create or replace using `_id: lp_${userId}_${lessonId}`):
   - For `quizRole === 'pre-test'`: set `preTestScore: score`
   - For `quizRole === 'post-test'`: set `postTestScore: score`, `completed: score >= course.passingScore`
   - For `quizRole === 'self-assessment'`: no score field update needed (informational only) — optionally store in a separate field if desired
7. Return `{ score, passed: tier === 'accomplishment', tier }`.

### Step 4 — Wire QuizEngine into the lesson renderer
Open `src/app/elearning/courses/[slug]/[moduleSlug]/page.tsx` (created by T03). Locate the `type === 'quiz'` branch. Replace the placeholder `<div>` with:
```tsx
<QuizEngine
  questions={lesson.questions}
  quizRole={lesson.quizRole}
  lessonId={lesson._id}
  courseId={course._id}
  onComplete={(result) => { /* handle completion — e.g., trigger progress update */ }}
/>
```
Ensure the `ScormPlayerSlot` and `SurveyFormSlot` exports are NOT affected by this change.

---

## Acceptance Criteria
- [ ] Pre-test renders without a pass/fail gate — learner can continue after submission regardless of score
- [ ] Pre-test score recorded as `preTestScore` on `lessonProgress` document
- [ ] Post-test score compared to `course.passingScore` — tier returned correctly
- [ ] Self-assessment renders with informational result only (no tier badge, no gate)
- [ ] `POST /api/lms/quiz-submit` writes `preTestScore` or `postTestScore` to `lessonProgress` document
- [ ] Tier logic correct: `'accomplishment'` if `score >= course.passingScore`, else `'participation'`
- [ ] QuestionCard radio inputs have associated `<label>` elements (WCAG AA)
- [ ] Correct/incorrect state shown after submission
- [ ] QuizEngine uses `'use client'` directive
- [ ] No `useMemo` or `useCallback` used
- [ ] `ScormPlayerSlot` and `SurveyFormSlot` exports in `[moduleSlug]/page.tsx` unchanged
- [ ] `npx tsc --noEmit` passes

---

## Dependencies
Before starting, verify:
- T01 complete: `sanity.types.ts` exists with `Lesson` type including `questions[]` and `quizRole`. `src/types/lms.ts` exports `QuizSubmission`.
- T02 complete: auth pattern available.
- T03 complete: `[moduleSlug]/page.tsx` exists with the `type === 'quiz'` branch, and `ScormPlayerSlot`/`SurveyFormSlot` are exported.

---

## Do Not
- Do NOT modify `src/sanity/schemaTypes/lesson.ts` or any other schema file — the quiz schema is already defined by T01.
- Do NOT modify the `ScormPlayerSlot` or `SurveyFormSlot` exports in `[moduleSlug]/page.tsx`.
- Do NOT use `useMemo` or `useCallback` — React Compiler is active.
- Do NOT add `'use client'` to `[moduleSlug]/page.tsx` — it remains a Server Component.
- Do NOT implement LTI or video lesson types — PRD-B scope.
- Do NOT touch `src/sanity/lib/client.ts`, `src/sanity/lib/write-client.ts`, `sanity.config.ts`, or `.env*` files.

---

*Generated by KARIMO Brief Writer*
*PRD: elearning-framework | Task: T04 | Wave: 2b*
