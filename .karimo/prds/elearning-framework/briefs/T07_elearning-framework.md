# Brief: Certificate Generation (2-Tier PDF + Expiry)
**Task ID:** T07
**PRD:** elearning-framework
**Wave:** 3
**Complexity:** 3
**Priority:** must
**Model:** sonnet
**Depends On:** T00, T01, T03, T04, T06
**Require Review:** false

---

## Objective
Generate and store 2-tier PDF certificates (Participation and Accomplishment) using `@react-pdf/renderer`, upload them to Vercel Blob, write a `certificate` document to Sanity, and build the `CertificateViewer` client component shown to learners after survey completion.

---

## Context

**Two-tier logic:**
- Every learner who completes the course receives at minimum a **Certificate of Participation**.
- A learner receives a **Certificate of Accomplishment** only if their `postTestScore >= course.passingScore`.
- The tier is determined server-side by reading the `lessonProgress` document's `postTestScore` field (written by T04's quiz-submit handler).
- This logic runs inside `POST /api/lms/certificate`.

**`@react-pdf/renderer` runs in a Route Handler (Node.js), not the browser.** It is NOT an Edge Runtime function. The Route Handler must NOT use `export const runtime = 'edge'`. It runs in the default Node.js lambda environment on Vercel.

**Vercel Blob — private access for certificates:** PDFs contain learner PII (name, course, score). Use `access: 'private'` when uploading to Vercel Blob. The `blobUrl` stored in the `certificate` Sanity document is a private URL requiring token-based access. The `CertificateViewer` download link should either proxy through an authenticated Route Handler or use a short-lived signed URL from Vercel Blob.

**Certificate document `_id`:** `cert_${userId}_${courseId}` — idempotent. If a certificate already exists, return the existing `blobUrl` and `tier` without regenerating (to prevent duplicate Blob uploads).

**CertificateViewer is shown after survey completion.** The lesson renderer page (from T03) has a `SurveyFormSlot` — after the survey is submitted, the lesson renderer should show the `CertificateViewer`. T07 creates the component; wiring it into the course completion flow is part of this task (updating only the post-survey portion of the completion UI in `[moduleSlug]/page.tsx`).

**Required certificate fields (PDF content):**
- PharmaLink logo / branding (use a static asset if available, or a text placeholder)
- Learner full name (from Clerk user: `firstName + ' ' + lastName`)
- Course name (from Sanity course document)
- Tier label: "Certificate of Participation" or "Certificate of Accomplishment"
- Issue date (formatted: e.g., "13 May 2026")
- Expiry date (formatted: e.g., "13 May 2027" — `issuedAt + 365 days`)
- Unique certificate ID (`cert_${userId}_${courseId}`)

**Certificate expiry:** Set `expiresAt = issuedAt + 365 days` on the Sanity certificate document. This field is defined in the `certificate` schema (T01).

**Post-issuance notification:** After writing the certificate document, write a `notification` document to Sanity and send a certificate-ready email via Clerk. See implementation steps below.

**Learner name:** Fetch from Clerk via `clerkClient().users.getUser(userId)` inside the Route Handler — use `firstName` and `lastName`.

**Upstream data dependencies:**
- T04 writes `postTestScore` to `lessonProgress` — this must exist before T07 can determine tier.
- T06 writes `surveyResponse` — the certificate is only issued after survey submission (per the PRD course journey order: survey before certificate display). Check for `surveyResponse` existence in the Route Handler.

---

## Files to Create / Modify
| Path | Action | Notes |
|------|--------|-------|
| `src/components/lms/CertificateViewer.tsx` | create | `'use client'` — preview + download |
| `src/components/lms/CertificateViewer.module.css` | create | Viewer styles using `--hds-*` tokens |
| `src/app/api/lms/certificate/route.ts` | create | POST — generate PDF, upload Blob, write Sanity doc |

---

## Implementation Steps

### Step 1 — Create `src/app/api/lms/certificate/route.ts`

1. Auth guard: return 401 if no `userId`.

2. Parse body: `{ courseId: string }`.

3. Check idempotency — fetch existing certificate:
   ```typescript
   const existing = await client.fetch(
     `*[_type == "certificate" && _id == $id][0] { tier, blobUrl }`,
     { id: `cert_${userId}_${courseId}` }
   )
   if (existing) return Response.json({ blobUrl: existing.blobUrl, tier: existing.tier })
   ```

4. Verify survey has been submitted (gate: do not issue certificate without survey):
   ```typescript
   const survey = await client.fetch(
     `*[_type == "surveyResponse" && _id == $id][0]`,
     { id: `sr_${userId}_${courseId}` }
   )
   if (!survey) return Response.json({ error: 'Survey not submitted' }, { status: 400 })
   ```

5. Fetch `postTestScore` from `lessonProgress` for this course's post-test lesson:
   ```groq
   *[_type == "lessonProgress" && userId == $userId && courseId == $courseId && defined(postTestScore)][0] { postTestScore }
   ```

6. Fetch `course.passingScore` and `course.title`:
   ```groq
   *[_type == "course" && _id == $courseId][0] { title, passingScore }
   ```

7. Fetch learner name from Clerk:
   ```typescript
   const user = await clerkClient().users.getUser(userId)
   const learnerName = `${user.firstName} ${user.lastName}`
   ```

8. Determine tier:
   ```typescript
   const tier: 'accomplishment' | 'participation' =
     postTestScore != null && postTestScore >= course.passingScore
       ? 'accomplishment'
       : 'participation'
   ```

9. Generate PDF using `@react-pdf/renderer`:
   ```typescript
   import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer'
   ```
   Build a React PDF document component with the required fields. Use `renderToBuffer()` to generate the PDF as a `Buffer` (Node.js). Do not use `renderToStream()` unless needed for streaming responses.

   PDF layout (simple, professional):
   - Header: PharmaLink branding text or logo (use `<Image>` if a logo asset is available at a known static path)
   - Title: tier-dependent heading ("Certificate of Participation" or "Certificate of Accomplishment")
   - Body: "This certifies that {learnerName} has completed {courseName}"
   - Footer: Issue date + Certificate ID

10. Upload PDF to Vercel Blob (private):
    ```typescript
    import { put } from '@vercel/blob'
    const { url } = await put(
      `certificates/cert_${userId}_${courseId}.pdf`,
      pdfBuffer,
      { access: 'private', contentType: 'application/pdf' }
    )
    ```

11. Write `certificate` document to Sanity via `writeClient`:
    ```typescript
    const issuedAt = new Date()
    const expiresAt = new Date(issuedAt.getTime() + 365 * 24 * 60 * 60 * 1000)
    await writeClient.create({
      _type: 'certificate',
      _id: `cert_${userId}_${courseId}`,
      userId,
      courseId,
      tier,
      score: postTestScore ?? 0,
      issuedAt: issuedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      blobUrl: url,
    })
    ```

12. Write a `notification` document to Sanity (idempotent):
    ```typescript
    const notificationId = `notif_${userId}_certready_${courseId}`
    const existingNotif = await client.fetch(`*[_id == $id][0]`, { id: notificationId })
    if (!existingNotif) {
      await writeClient.create({
        _type: 'notification',
        _id: notificationId,
        userId,
        type: 'certificate_ready',
        message: `Your certificate for ${course.title} is ready to download.`,
        courseId,
        read: false,
        createdAt: new Date().toISOString(),
      })
    }
    ```

13. Send certificate-ready email via Clerk (same pattern as T02 welcome email — check `src/app/api/auth/onboarding/route.ts` for the exact `clerkClient` usage):
    ```typescript
    const clerk = await clerkClient()
    await clerk.emails.createEmail({
      fromEmailName: 'certificates',
      subject: `Your certificate for ${course.title} is ready`,
      body: `Congratulations! Your certificate is ready. Download it from /elearning/my-learning`,
      emailAddressId: userId,
    })
    ```

14. Return `{ blobUrl: url, tier }`.

### Step 2 — Create `src/components/lms/CertificateViewer.tsx`
`'use client'` component. Props:
```typescript
interface CertificateViewerProps {
  courseId: string
}
```
State:
- `loading: boolean`
- `certificate: { blobUrl: string; tier: string } | null`
- `error: string | null`

Behavior:
1. On mount, `POST /api/lms/certificate` with `{ courseId }`.
2. While loading: show a spinner or skeleton.
3. On success: render:
   - **Tier badge:** "Certificate of Accomplishment" (styled with `--hds-color-success-*`) or "Certificate of Participation" (neutral styling).
   - **Learner congratulations message.**
   - **Download button:** links to `blobUrl`. Since it's private Vercel Blob, render an `<a href={blobUrl} download>` — the user's browser will handle the download with the blob token embedded in the URL.
4. On error: show error message.

### Step 3 — Wire CertificateViewer into course completion flow
In `[moduleSlug]/page.tsx`, after the `SurveyFormSlot` area: add conditional rendering of `CertificateViewer`. This can be done by adding a state/prop-driven show/hide mechanism — or simply render `CertificateViewer` below `SurveyFormSlot` and let it handle its own loading state (it only fetches after survey is submitted, but the idempotency check in the Route Handler handles the timing).

Only touch the post-survey section of the completion area. Do NOT touch `ScormPlayerSlot`.

---

## Acceptance Criteria
- [ ] Participation certificate issued on course completion regardless of score
- [ ] Accomplishment certificate issued only when `postTestScore >= course.passingScore`
- [ ] Certificate not issued if survey not yet submitted
- [ ] Existing certificate returned without regeneration (idempotent)
- [ ] PDF contains learner name, course name, tier label, issue date, certificate ID
- [ ] PDF generated by `@react-pdf/renderer` in Node.js Route Handler (not Edge runtime)
- [ ] PDF uploaded to Vercel Blob with `access: 'private'`
- [ ] `certificate` document written to Sanity with `_id: cert_userId_courseId`
- [ ] `CertificateViewer` renders tier badge and download button after survey completion
- [ ] CSS Modules + `--hds-*` tokens throughout; no Tailwind
- [ ] `npx tsc --noEmit` passes
- [ ] `certificate.expiresAt` set to `issuedAt + 365 days`
- [ ] Expiry date appears on generated PDF
- [ ] `notification` document written to Sanity on certificate issuance (idempotent)
- [ ] Certificate-ready email sent via Clerk on issuance

---

## Dependencies
Before starting, verify:
- T00 complete: `@react-pdf/renderer` and `@vercel/blob` present in `package.json`.
- T01 complete: `certificate` schema defined in `sanity.types.ts` with `tier`, `blobUrl`, `score`, `issuedAt`.
- T03 complete: `POST /api/lms/progress` established; `[moduleSlug]/page.tsx` structure in place.
- T04 complete: `postTestScore` written to `lessonProgress` documents.
- T06 complete: `surveyResponse` documents written; `POST /api/lms/survey` returns 409 on duplicate.
- Environment: `BLOB_READ_WRITE_TOKEN` provisioned in Vercel project settings.

---

## Do Not
- Do NOT use Edge Runtime (`export const runtime = 'edge'`) on the certificate Route Handler — `@react-pdf/renderer` requires Node.js.
- Do NOT upload PDFs with `access: 'public'` — they contain learner PII.
- Do NOT generate a certificate before the survey is submitted.
- Do NOT use `useMemo` or `useCallback` in `CertificateViewer`.
- Do NOT touch the SCORM-related files from T05.
- Do NOT touch `src/sanity/lib/client.ts`, `src/sanity/lib/write-client.ts`, `sanity.config.ts`, or `.env*` files.
- Do NOT implement LinkedIn sharing — PRD-B scope.

---

*Generated by KARIMO Brief Writer*
*PRD: elearning-framework | Task: T07 | Wave: 3*
