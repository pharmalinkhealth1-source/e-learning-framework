# Task Brief: T003

**Title:** Create ForumRulesModal client component
**PRD:** forum
**Priority:** must
**Complexity:** 4/10
**Model:** sonnet
**Wave:** 2
**Feature Issue:** Forum Rules Acceptance Gate (PRD 004)

---

## Objective

Create the `ForumRulesModal` React client component — a full-screen overlay modal that walks users through 11 rule cards with a progress bar, Back/Next navigation, and a final acceptance section with a checkbox and accept/exit buttons. This component is what users see instead of the forum listing when the server-side gate determines they must accept rules.

---

## Context

**Parent Feature:** Forum Rules Acceptance Gate (PRD 004)

When `forum/page.tsx` (T004) determines a user needs to accept rules, it renders only `<ForumRulesModal rulesDoc={rulesDoc} />` — the entire forum listing is withheld server-side (no flash). The modal receives the rules content from Sanity as props, so rule copy is never hardcoded in the component.

The modal flow ports the approved 11-step Elementor design verbatim. On accept, the component POSTs to `POST /api/forum/rules/accept` (T002) then calls `router.refresh()` to re-run the server component, which now sees the user has accepted and renders the forum listing. On exit ("I Do Not Agree"), the user is redirected to `/`.

This task is part of **Wave 2** — it depends on T002 being complete (the API route the modal calls must exist).

---

## Research Context

### Patterns to Follow

- **Client component pattern:** `'use client'` directive at top; same file structure as `src/components/forum/PostLikeButton.tsx`
- **State + loading pattern:** `PostLikeButton.tsx` uses `React.useState` for loading state, try/finally to reset loading — use same pattern
- **Forum purple:** `#6c30c0` — used throughout the forum page and `PostLikeButton.tsx`
- **Inline styles:** `forum/page.tsx` uses inline style objects extensively — no styled-components or CSS modules needed for this modal. Inline styles are acceptable and consistent.
- **router.refresh():** Use `import { useRouter } from 'next/navigation'` — `router.refresh()` re-runs the server component without a full navigation, causing the gate check to re-evaluate

### Known Issues to Address

- No `ForumRulesModal` component exists — this is a net-new file
- Do not use `styled-components` (PostLikeButton uses it but it adds unnecessary complexity for a one-off modal). Use inline styles instead, consistent with `forum/page.tsx`.

### Recommended Approach

- Full-screen overlay with `position: fixed, inset: 0` — renders on top of everything
- Centered card: `max-width: 640px`, `border-radius: 12px`, white background
- Progress bar: controlled div with `width: (currentStep / totalSteps * 100)%`
- CSS keyframe fade animation on step change via a `key` prop on the card content
- Acceptance section replaces nav on final step (step 11) — conditional render

---

## Requirements

1. Create `src/components/forum/ForumRulesModal.tsx`
2. `'use client'` directive at top
3. Props type: `{ rulesDoc: { version: string; rules: { title: string; body: string }[] } }`
4. State: `currentStep` (number, 1-based), `confirmed` (boolean), `loading` (boolean)
5. Progress bar: width is `(currentStep / rules.length) * 100` percent
6. Step counter: "Step N of 11" text above the rule card
7. Rule card shows `rules[currentStep - 1].title` as `<h3>` and `rules[currentStep - 1].body` as `<p>`
8. Navigation (steps 1-10): Back button (disabled on step 1) and Next button
9. Final step (step 11): hide Back/Next nav; show acceptance section:
   - Legal disclaimer paragraph
   - Checkbox labeled "I Accept & Agree to these Forum Rules"
   - "I Do Not Agree (Exit)" button
   - "Accept & Enter Forum" button (disabled until `confirmed === true`)
10. Accept handler: set loading, POST to `/api/forum/rules/accept` with `{ version: rulesDoc.version }`, on success call `router.refresh()`, on error surface error state and reset loading
11. Exit handler: `router.push('/')`
12. Styles: inline, purple `#6c30c0` as accent, white card, full-screen overlay

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `src/components/forum/ForumRulesModal.tsx` exists and compiles without TypeScript errors
- [ ] Component accepts `rulesDoc` prop with correct type
- [ ] Progress bar width updates on each step
- [ ] "Step N of 11" counter updates on each step
- [ ] Rule card shows correct title and body for the current step
- [ ] Back button is disabled on step 1
- [ ] Next button advances step; Back button decrements step
- [ ] On step 11: Back/Next nav is hidden; acceptance section is shown
- [ ] "Accept & Enter Forum" button is disabled when `confirmed` is false
- [ ] "Accept & Enter Forum" button is enabled when checkbox is checked
- [ ] Clicking "Accept & Enter Forum" calls `POST /api/forum/rules/accept` with `{ version: rulesDoc.version }`
- [ ] On successful API response, `router.refresh()` is called
- [ ] Loading state disables both acceptance buttons during the API call
- [ ] "I Do Not Agree (Exit)" calls `router.push('/')`
- [ ] No flash of forum content (modal is full-screen overlay, not partial)
- [ ] `pnpm typecheck` passes

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/forum/ForumRulesModal.tsx` | create | 11-step rules acceptance modal, client component |

### File Ownership Notes

This is a new file. No conflicts with other tasks. T004 imports from this file — the export name must be `ForumRulesModal` (default export).

---

## Implementation Guidance

### Complete Component Implementation

```tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

type RulesDoc = {
  version: string;
  rules: { title: string; body: string }[];
};

export default function ForumRulesModal({ rulesDoc }: { rulesDoc: RulesDoc }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [confirmed, setConfirmed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const totalSteps = rulesDoc.rules.length;
  const rule = rulesDoc.rules[currentStep - 1];
  const isFinalStep = currentStep === totalSteps;
  const progressPct = (currentStep / totalSteps) * 100;

  const handleAccept = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/forum/rules/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: rulesDoc.version }),
      });
      if (!res.ok) throw new Error('Failed to record acceptance');
      router.refresh();
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleExit = () => {
    router.push('/');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(10, 10, 20, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '24px',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        maxWidth: '640px',
        width: '100%',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      }}>
        {/* Progress bar */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{
            height: '4px',
            background: '#e5edf5',
            borderRadius: '100px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progressPct}%`,
              background: '#6c30c0',
              borderRadius: '100px',
              transition: 'width 0.3s ease',
            }} />
          </div>
          <p style={{ fontSize: '0.75rem', color: '#8898aa', marginTop: '6px' }}>
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        {/* Rule card */}
        <div key={currentStep} style={{ animation: 'fadeInUp 0.25s ease', minHeight: '160px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '12px' }}>
            {rule.title}
          </h3>
          <p style={{ color: '#425466', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
            {rule.body}
          </p>
        </div>

        {/* Navigation (steps 1-10) */}
        {!isFinalStep && (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setCurrentStep(s => s - 1)}
              disabled={currentStep === 1}
              style={{
                padding: '10px 24px',
                borderRadius: '100px',
                border: '1px solid #e5edf5',
                background: 'white',
                color: '#425466',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                opacity: currentStep === 1 ? 0.4 : 1,
              }}
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(s => s + 1)}
              style={{
                padding: '10px 24px',
                borderRadius: '100px',
                border: 'none',
                background: '#6c30c0',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Next
            </button>
          </div>
        )}

        {/* Acceptance section (step 11 only) */}
        {isFinalStep && (
          <div>
            <p style={{ fontSize: '0.875rem', color: '#425466', lineHeight: 1.6, marginBottom: '20px' }}>
              By accepting, you confirm that you have read and understood all PharmaLink Community Forum
              Rules and agree to comply with them. Violations may result in suspension or removal from the platform.
            </p>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '24px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
                style={{ marginTop: '2px', accentColor: '#6c30c0', width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#1a1a2e', fontWeight: 500 }}>
                I Accept &amp; Agree to these Forum Rules
              </span>
            </label>

            {error && (
              <p style={{ color: '#e53e3e', fontSize: '0.8125rem', marginBottom: '16px' }}>{error}</p>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                onClick={handleExit}
                disabled={loading}
                style={{
                  padding: '10px 24px',
                  borderRadius: '100px',
                  border: '1px solid #e5edf5',
                  background: 'white',
                  color: '#425466',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                I Do Not Agree (Exit)
              </button>
              <button
                onClick={handleAccept}
                disabled={!confirmed || loading}
                style={{
                  padding: '10px 24px',
                  borderRadius: '100px',
                  border: 'none',
                  background: confirmed && !loading ? '#6c30c0' : '#c4b0e0',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: confirmed && !loading ? 'pointer' : 'not-allowed',
                }}
              >
                {loading ? 'Saving…' : 'Accept & Enter Forum'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
```

### Step Animation

The `key={currentStep}` prop on the rule card div causes React to remount the element on each step change, triggering the `fadeInUp` CSS animation. The `<style>` tag at the bottom of the component injects the keyframe. This is the simplest approach that avoids adding an animation library.

### router.refresh() vs router.push()

`router.refresh()` re-runs the server component tree for the current URL. Since T004's gate logic lives in the server component, refreshing causes the server to re-check `forumRulesAcceptedAt` — it now finds the acceptance in Clerk metadata and renders the forum listing instead of the modal. The user sees the forum appear without a full page navigation.

### Error Handling

If the POST fails (network error or 5xx), show the error message and reset `loading` to `false` so the user can retry. Do not reset `confirmed` — they should not have to re-check the checkbox.

### TypeScript Note

The `key` prop on a `div` does not need a type annotation — it is a React built-in prop.

---

## Boundaries

### Files You MUST NOT Touch

- `src/app/forum/page.tsx` (T004's file)
- `src/app/api/forum/rules/accept/route.ts` (T002's file — import it, don't modify it)
- `src/sanity/schemaTypes/` (T001's directory)
- Any existing files in `src/components/forum/`

### Files Requiring Review

None for this task.

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|------------------|------------------------|
| T002 | `POST /api/forum/rules/accept` endpoint | Confirm `src/app/api/forum/rules/accept/route.ts` exists |

### Downstream Impact

Tasks that depend on this one: **T004** (imports `ForumRulesModal` and passes `rulesDoc` prop)

T004 must import the default export as `ForumRulesModal` from `'@/components/forum/ForumRulesModal'`.

---

## GitHub Context

**PRD:** 004_forum
**Branch:** `worktree/forum-T003`
**Worktree:** `.worktrees/forum/T003`
**Brief:** `.karimo/prds/004_forum/briefs/T003_forum.md`

---

## Commit Guidelines

```
feat(forum): add ForumRulesModal client component

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before marking complete:
- [ ] All success criteria met
- [ ] `pnpm typecheck` passes
- [ ] Only `src/components/forum/ForumRulesModal.tsx` created — no other files modified
- [ ] Default export is named `ForumRulesModal`
- [ ] `'use client'` is the first line
- [ ] No hardcoded rule text — all content comes from `rulesDoc.rules` prop

---

*Generated by KARIMO Brief Writer*
*PRD: forum | Task: T003 | Wave: 2*
