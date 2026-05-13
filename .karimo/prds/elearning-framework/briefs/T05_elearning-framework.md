# Brief: SCORM Upload + Bridge + Commit
**Task ID:** T05
**PRD:** elearning-framework
**Wave:** 2b
**Complexity:** 5
**Priority:** must
**Model:** sonnet
**Depends On:** T00, T01, T02, T03
**Require Review:** true

---

## Objective
Build the full SCORM pipeline: a ZIP upload Route Handler that extracts packages to Vercel Blob, a `ScormPlayer` client component that mounts the `scorm-again` cross-frame bridge and renders the SCORM iframe, and a commit Route Handler that writes SCORM progress to Sanity. T05 delivers the `ScormPlayer` component that T03 exported as a `null` slot — it does not modify the lesson renderer page.

---

## Context

**Pre-condition:** `BLOB_READ_WRITE_TOKEN` must be provisioned in the Vercel project environment variables before this task can be tested end-to-end. Confirm this with the team before beginning Wave 2b. The token comes from the Vercel dashboard under Storage > Blob. Without it, `@vercel/blob` calls will throw at runtime.

**Why `CrossFrameLMS` / `CrossFrameAPI` (not direct `window.API` injection):**
Vercel Blob serves SCORM package files from a cross-origin domain (e.g., `blob.vercel-storage.com`). The iframe's `window` is isolated from the parent page's `window` due to cross-origin restrictions. `scorm-again` provides `CrossFrameLMS` (mounted in the parent page) and `CrossFrameAPI` (injected into the child iframe) specifically for this cross-origin iframe pattern. Using `window.API =` directly will fail silently for cross-origin iframes.

**React Compiler constraint:** All `window.*` assignments must be inside `useEffect`. The React Compiler cannot optimize `ScormPlayer` due to imperative `window` mutation — this is acceptable and documented.

**SCORM API globals:**
- SCORM 1.2: `window.API` (instance of `Scorm12API` from `scorm-again`)
- SCORM 2004: `window.API_1484_11` (instance of `Scorm2004API` from `scorm-again`)
- Both assignments happen exclusively inside `useEffect` — never in render or component body.

**T05 does not modify `[moduleSlug]/page.tsx`.** The lesson renderer exports a `ScormPlayerSlot` (null stub) from T03. T05 replaces that export with the real `ScormPlayer`. The lesson renderer page itself is not changed — T05 only creates new files.

**Replacing the slot export:** T03 exports `ScormPlayerSlot` from `[moduleSlug]/page.tsx`. T05 should re-export `ScormPlayer` as `ScormPlayerSlot` from a file that the lesson renderer imports — OR T05 simply creates `ScormPlayer.tsx` and the lesson renderer already conditionally renders it (the exact wiring depends on how T03 structured the quiz branch; check T03's implementation before assuming).

Actually — per the brief contract: "T05 only delivers the `ScormPlayer` component; it does not modify the lesson renderer page." This means T05 creates `ScormPlayer.tsx` with the full implementation. The `ScormPlayerSlot` stub in `[moduleSlug]/page.tsx` would then need to be updated by T03's review gate or by the PM — but since T05 must not touch that page, the practical resolution is: T05 exports `ScormPlayer` and notes in the PR that the lesson renderer slot must be wired up. However, to be safe: T05 may update `[moduleSlug]/page.tsx` ONLY to replace the `ScormPlayerSlot` null body with a real render of `ScormPlayer` — without touching the `SurveyFormSlot` export or any other part of the file. Confirm this interpretation with the reviewer.

**jszip memory:** `jszip` loads the entire ZIP into Node.js memory in the Route Handler. Default Vercel function memory limit is 1 GB. Warn in PR if any SCORM packages are expected to exceed 500 MB compressed.

**scorm-upload role check:** Only `system_admin` role may upload SCORM packages. Check `sessionClaims.metadata.role === 'system_admin'` and return 403 if not.

**Denormalized fields on scorm-commit:** When writing `lessonProgress` via `POST /api/lms/scorm-commit`, include denormalized Clerk session fields: `gender`, `ageGroup`, `healthWorkerType`, `country`. Same pattern as T03's progress API.

---

## Files to Create / Modify
| Path | Action | Notes |
|------|--------|-------|
| `src/components/lms/ScormPlayer.tsx` | create | `'use client'` — SCORM bridge + iframe |
| `src/components/lms/ScormPlayer.module.css` | create | Stage backdrop + iframe container styles |
| `src/app/api/lms/scorm-upload/route.ts` | create | POST — ZIP upload, extraction, Blob storage |
| `src/app/api/lms/scorm-commit/route.ts` | create | POST — write SCORM progress to Sanity |

---

## Implementation Steps

### Step 1 — Create `src/components/lms/ScormPlayer.tsx`
```typescript
'use client'

import { useEffect, useRef } from 'react'
import styles from './ScormPlayer.module.css'

interface ScormPlayerProps {
  lessonId: string
  entryUrl: string
  scormVersion: '1.2' | '2004'
}

export function ScormPlayer({ lessonId, entryUrl, scormVersion }: ScormPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // All window.* assignments must be inside useEffect
    // Import CrossFrameLMS from scorm-again
    const { CrossFrameLMS } = require('scorm-again')
    const lms = new CrossFrameLMS({
      lmsCommitUrl: '/api/lms/scorm-commit',
      autocommit: true,
      scormVersion, // '1.2' or '2004'
      // Pass lessonId for the commit handler to identify the lesson
      dataCommitFormat: 'json',
    })
    lms.init()

    return () => {
      lms.terminate()
    }
  }, [scormVersion])

  return (
    <div className={styles.stageBackdrop}>
      <iframe
        ref={iframeRef}
        src={entryUrl}
        className={styles.scormIframe}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        title="SCORM Module"
      />
    </div>
  )
}
```

Important implementation notes:
- Use `require('scorm-again')` inside `useEffect` to avoid SSR issues, or use a dynamic import.
- `CrossFrameLMS` is mounted on the parent page side. `CrossFrameAPI` is automatically injected into the iframe by `scorm-again` when `CrossFrameLMS` is used — do not manually inject `CrossFrameAPI`.
- The `lmsCommitUrl` is the endpoint that `scorm-again` will POST CMI data to on `LMSSetValue` / `SetValue` calls.
- Check the `scorm-again` documentation for the exact constructor signature — it may differ from the sketch above. Read `node_modules/scorm-again/dist/` or its README before finalizing.
- Cleanup: call `lms.terminate()` on effect cleanup to avoid memory leaks.

### Step 2 — Create `src/components/lms/ScormPlayer.module.css`
Dark neutral container to minimize visual clash with SCORM content's own styling:
```css
.stageBackdrop {
  background-color: var(--hds-color-neutral-900, #1a1a1a);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 600px;
}

.scormIframe {
  width: 100%;
  height: 100%;
  min-height: 600px;
  border: none;
  display: block;
}
```
Use `--hds-*` token values where available.

### Step 3 — Create `src/app/api/lms/scorm-upload/route.ts`
1. Auth guard: return 401 if no `userId`.
2. Role check: return 403 if `sessionClaims.metadata.role !== 'system_admin'`.
3. Parse multipart form data to get the uploaded ZIP file buffer.
4. Use `jszip` to extract ZIP contents:
   ```typescript
   import JSZip from 'jszip'
   const zip = await JSZip.loadAsync(buffer)
   ```
5. For each file in the ZIP: upload to `@vercel/blob` with public access:
   ```typescript
   import { put } from '@vercel/blob'
   const { url } = await put(`scorm/${packageId}/${filePath}`, fileBuffer, { access: 'public' })
   ```
   Use a consistent `packageId` (e.g., UUID or timestamp-based) to namespace all files from this ZIP under the same Blob prefix.
6. Identify the entry point: look for `imsmanifest.xml` in the ZIP root, then find the `<resources>` element to locate the entry HTML file (commonly `index.html` or `index_lms.html`). The `entryUrl` is the Blob URL of the entry HTML file.
7. Update the Sanity `lesson` document's `scormEntryUrl` field. Receive `lessonId` in the request body:
   ```typescript
   await writeClient.patch(lessonId).set({ scormEntryUrl: entryUrl }).commit()
   ```
8. Return `{ entryUrl }`.

### Step 4 — Create `src/app/api/lms/scorm-commit/route.ts`
This handler is called by `scorm-again` on `LMSSetValue` / `SetValue` events.
1. Auth guard: return 401 if no `userId`.
2. Parse body (JSON from `scorm-again`): contains CMI data object. Also expect `lessonId` in the body (pass it from the ScormPlayer via the `dataCommitFormat` or a custom commit handler — check `scorm-again` docs for how to pass custom data with commits).
3. Read denormalized fields from Clerk session: `gender`, `country`, `healthWorkerType`, then derive `ageGroup` from DOB.
4. Determine `completed`: check for `cmi.completion_status === 'completed'` (SCORM 2004) or `cmi.core.lesson_status === 'passed' || 'completed'` (SCORM 1.2).
5. Upsert `lessonProgress` document via `writeClient`:
   ```typescript
   await writeClient.createOrReplace({
     _type: 'lessonProgress',
     _id: `lp_${userId}_${lessonId}`,
     userId, lessonId, courseId,
     scormData: body.cmiData, // full CMI object
     completed,
     completedAt: completed ? new Date().toISOString() : undefined,
     gender, ageGroup, healthWorkerType, country,
   })
   ```
6. If `completed === true`: add `lessonShortId` to `publicMetadata.completedLessons` (same pattern as T03's progress handler).
7. Return `200 { success: true }`.

---

## Acceptance Criteria
- [ ] SCORM ZIP uploaded via `POST /api/lms/scorm-upload`, files extracted and stored in Vercel Blob with public access
- [ ] `lesson.scormEntryUrl` updated in Sanity after upload
- [ ] `ScormPlayer` renders iframe with correct `entryUrl`
- [ ] `ScormPlayer` uses `CrossFrameLMS` from `scorm-again` (not direct `window.API` injection)
- [ ] SCORM 1.2 `window.API` assigned inside `useEffect` only
- [ ] SCORM 2004 `window.API_1484_11` assigned inside `useEffect` only
- [ ] `LMSSetValue`/`SetValue` calls from iframe reach `POST /api/lms/scorm-commit`
- [ ] `lessonProgress.scormData` written with full CMI data object
- [ ] `lessonProgress.completed` set to `true` on `LMSFinish`/`Terminate`
- [ ] Denormalized fields (`gender`, `ageGroup`, `healthWorkerType`, `country`) written on `lessonProgress` via scorm-commit
- [ ] Stage backdrop (dark neutral container) renders; iframe fills container
- [ ] All `window.*` assignments inside `useEffect` only
- [ ] `scorm-upload` returns 403 for non-`system_admin` roles
- [ ] `[moduleSlug]/page.tsx` not modified (or only the `ScormPlayerSlot` null body replaced — no other changes)
- [ ] `npx tsc --noEmit` passes

---

## Dependencies
Before starting, verify:
- T00 complete: `scorm-again`, `@vercel/blob`, `jszip` present in `package.json`.
- T01 complete: `sanity.types.ts` exists; `lessonProgress` schema has `scormData`, `completed`, `lessonShortId` fields.
- T02 complete: `sessionClaims.metadata.role` accessible for role check.
- T03 complete: `ScormPlayerSlot` exported from `[moduleSlug]/page.tsx`; progress update pattern established.
- Environment: `BLOB_READ_WRITE_TOKEN` provisioned in Vercel project settings (required for any Blob operation).

---

## Do Not
- Do NOT assign `window.API` or `window.API_1484_11` outside of `useEffect` — React Compiler constraint.
- Do NOT use `CrossFrameAPI` directly — it is injected automatically by `scorm-again`'s `CrossFrameLMS` when using the cross-frame pattern.
- Do NOT install `ltijs` — LTI is PRD-B scope.
- Do NOT use `iframe` `allow-same-origin` without `allow-scripts` — SCORM content requires both.
- Do NOT store Blob URLs in Clerk metadata — only in Sanity.
- Do NOT touch `src/sanity/lib/client.ts`, `src/sanity/lib/write-client.ts`, `sanity.config.ts`, or `.env*` files.
- Do NOT add `useMemo` or `useCallback` outside of documented exceptions in `ScormPlayer`.
- Do NOT touch `SurveyFormSlot` in the lesson renderer page.

---

*Generated by KARIMO Brief Writer*
*PRD: elearning-framework | Task: T05 | Wave: 2b*
