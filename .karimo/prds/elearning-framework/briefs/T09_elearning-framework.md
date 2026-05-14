# Brief: Dashboard UI + Role-Gated Views
**Task ID:** T09
**PRD:** elearning-framework
**Wave:** 4
**Complexity:** 5
**Priority:** must
**Model:** sonnet
**Depends On:** T07, T08
**Require Review:** false

---

## Objective
Build the analytics dashboard UI: a role-gated page at `/elearning/dashboard` with a `DashboardShell`, `FilterBar` (URL-param-driven), `MetricCard` components, certificate list, and chart reuse. This is the final Wave 4 task and the public face of all the metrics data built in T08.

---

## Context

**Role-gating rules:**
- `learner` role: redirect to `/elearning` (not 404, not 403 — a redirect, performed in the Server Component before rendering anything).
- `program_manager`: country filter pre-filled from `sessionClaims.metadata.country` and the country dropdown is disabled (read-only). All data is scoped to their country already by T08's Route Handler.
- `partner_donor`, `system_admin`: all filters available and enabled; no country pre-fill restriction.

**Filter state in URL search params, NOT `useState`.** This is mandatory:
- Filters are shareable links (a program manager can share a specific filtered view)
- SSR-compatible: the Server Component can read filters from `searchParams` and pass them to the initial data fetch
- Use Next.js `useSearchParams()` (in client components) and `searchParams` prop (in Server Components) to read/write filter state
- Filter changes: use `useRouter().push()` or `<Link>` with updated URL params — not local React state

**Do NOT import `CompletionsBar` directly** — it uses `styled-components` which violates the CSS Modules constraint. Instead, build a new `src/components/lms/dashboard/MetricsBar.tsx` using CSS Modules + `--hds-*` tokens. `MetricsBar` accepts `data: { label: string; value: number }[]` and renders a simple horizontal bar chart. Add `src/components/lms/dashboard/MetricsBar.module.css` to files_affected.

**`CertificateList` is admin/manager only.** Do not render it for `partner_donor` role — confirm this with the PRD (certificates are internal data). Render for `system_admin` and `program_manager` only.

**Server Component for the dashboard page.** `src/app/elearning/dashboard/page.tsx` is a Server Component. It:
1. Reads `searchParams` and `auth()` for initial role/country.
2. Redirects if `role === 'learner'`.
3. Fetches initial metrics from `GET /api/lms/dashboard` (or calls `dashboardQueries` directly — either is acceptable).
4. Passes initial data as props to client components.

**FilterBar client component.** Requires `'use client'` for `useRouter()` and `useSearchParams()`. When a filter changes, push a new URL with updated search params. The page re-renders via Next.js navigation, fetching new data server-side.

**DashboardShell.** Can be a Server Component if it has no interactivity — it's a structural wrapper with role badge. The role badge reads from props passed down from the page. `FilterBar` is rendered as a child.

**MetricCard.** Presentational. Displays: label, value (number or percentage), optional trend arrow (up/down based on a `trend` prop). Server or client component — no interactivity needed.

**`'use client'` only on:** `FilterBar.tsx` (needs `useRouter`, `useSearchParams`), and any component with click handlers.

**`searchParams` is a Promise in Next.js 15+/16.x.** In Server Components, `searchParams` must be awaited before accessing properties: `const params = await searchParams`. The resolved object is then passed as props to child components.

**React Compiler:** No `useMemo` or `useCallback`.

---

## Files to Create / Modify
| Path | Action | Notes |
|------|--------|-------|
| `src/app/elearning/dashboard/page.tsx` | create | Server Component — role check, initial data fetch |
| `src/app/elearning/dashboard/page.module.css` | create | Dashboard page layout styles |
| `src/components/lms/dashboard/DashboardShell.tsx` | create | Shell wrapper with role badge + FilterBar |
| `src/components/lms/dashboard/DashboardShell.module.css` | create | Shell styles |
| `src/components/lms/dashboard/MetricCard.tsx` | create | Single metric display |
| `src/components/lms/dashboard/MetricCard.module.css` | create | MetricCard styles |
| `src/components/lms/dashboard/FilterBar.tsx` | create | `'use client'` — URL-param filter dropdowns |
| `src/components/lms/dashboard/FilterBar.module.css` | create | FilterBar styles |
| `src/components/lms/dashboard/CertificateList.tsx` | create | Certificate table for admin/manager |
| `src/components/lms/dashboard/MetricsBar.tsx` | create | CSS Modules horizontal bar chart (replaces CompletionsBar) |
| `src/components/lms/dashboard/MetricsBar.module.css` | create | MetricsBar styles using `--hds-*` tokens |
| `src/components/lms/dashboard/ExpiryAlert.tsx` | create | Expiring certificates alert banner |
| `src/components/lms/dashboard/ExpiryAlert.module.css` | create | ExpiryAlert styles |

---

## Implementation Steps

### Step 1 — Create `src/app/elearning/dashboard/page.tsx`
```typescript
// Server Component — no 'use client'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { getCsatAvg, getNpsScore, getKnowledgeGain, getDau, getConversionRate, getRetentionRate, getNewUsersByCountry, getKnowledgeBaseGrowth } from '@/sanity/lib/dashboardQueries'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; gender?: string; ageGroup?: string; learnerType?: string }>
}) {
  const params = await searchParams
  const { sessionClaims } = await auth()
  const role = sessionClaims?.metadata?.role
  const userCountry = sessionClaims?.metadata?.country

  // Role gate
  if (!role || role === 'learner') {
    redirect('/elearning')
  }

  // For program_manager: override country filter with their own country
  const filters = {
    country: role === 'program_manager' ? userCountry : params.country,
    gender: params.gender,
    ageGroup: params.ageGroup,
    learnerType: params.learnerType,
    userRole: role,
    userCountry: userCountry ?? '',
  }

  // Fetch all metrics in parallel
  const [csatAvg, npsScore, knowledgeGain, dau, conversionRate, retentionRate, newUsersByCountry, knowledgeBaseGrowth] =
    await Promise.all([
      getCsatAvg(filters),
      getNpsScore(filters),
      getKnowledgeGain(filters),
      getDau(filters),
      getConversionRate(filters),
      getRetentionRate(filters),
      getNewUsersByCountry(filters),
      getKnowledgeBaseGrowth(filters),
    ])

  const metrics = { csatAvg, npsScore, knowledgeGain, dau, conversionRate, retentionRate, newUsersByCountry, knowledgeBaseGrowth }

  return (
    <DashboardShell role={role} userCountry={userCountry} searchParams={params} metrics={metrics} />
  )
}
```

### Step 2 — Create `src/components/lms/dashboard/DashboardShell.tsx`
Can be a Server Component (no interactivity). Props:
```typescript
interface DashboardShellProps {
  role: LmsRole
  userCountry?: string
  searchParams: { country?: string; gender?: string; ageGroup?: string; learnerType?: string }
  metrics: DashboardMetrics
}
```
Renders:
- Header: "PharmaLink Analytics Dashboard" heading + role badge (e.g., "Program Manager — Kenya")
- `<FilterBar>` component (client — receives role and userCountry to know which filters to disable)
- Grid of `<MetricCard>` components for all 8 metrics
- `<MetricsBar>` (from `src/components/lms/dashboard/MetricsBar`) for "New Users by Country" bar chart and/or knowledge base growth — pass `data` as `{ label: string; value: number }[]`
- `<CertificateList>` rendered only if `role === 'system_admin' || role === 'program_manager'`
- `<ExpiryAlert>` banner: calls `getExpiringCertificates({ daysAhead: 30 })` — if count > 0, renders "N certificates expiring within 30 days" with expand/collapse list of affected certificates
- `<MetricsBar>` for enrollment by country: calls `getEnrollmentsByCountry()`, aggregates to `{ label: country, value: count }[]`

### Step 3 — Create `src/components/lms/dashboard/FilterBar.tsx`
```typescript
'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
```
Props:
```typescript
interface FilterBarProps {
  role: LmsRole
  userCountry?: string
}
```
Dropdowns:
- **Country:** `<select>` — disabled and pre-filled if `role === 'program_manager'`; enabled with full country list otherwise. On change: push `?country=...` to URL.
- **Gender:** `<select>` with options: All, Male, Female, Non-binary, Prefer not to say. On change: push `?gender=...` to URL.
- **Age Group:** `<select>` with options: All, `<18`, `18-24`, `25-34`, `35-44`, `45+`. On change: push `?ageGroup=...` to URL.
- **Learner Type / Health Worker Type:** `<select>` with options matching the `healthWorkerType` enum from T02 registration. On change: push `?learnerType=...` to URL.

URL update pattern (does NOT use `useState` for filter values):
```typescript
const router = useRouter()
const pathname = usePathname()
const searchParams = useSearchParams()

function updateFilter(key: string, value: string) {
  const params = new URLSearchParams(searchParams.toString())
  if (value) params.set(key, value)
  else params.delete(key)
  router.push(`${pathname}?${params.toString()}`)
}
```
Initial select values: read from `useSearchParams()` (not local state).

### Step 4 — Create `src/components/lms/dashboard/MetricCard.tsx`
Presentational component (Server or Client — no interactivity needed):
```typescript
interface MetricCardProps {
  label: string
  value: number | string
  unit?: string  // '%', 'avg', etc.
  trend?: 'up' | 'down' | 'neutral'
  description?: string
}
```
Renders a card with: metric label, large value display, optional unit, optional trend arrow (↑↓), optional description. CSS Module with `--hds-*` tokens.

### Step 5 — Create `src/components/lms/dashboard/CertificateList.tsx`
Server or Client Component. Fetches certificates from Sanity via GROQ (or receives as prop from the page):
```groq
*[_type == "certificate"] | order(issuedAt desc) [0..50] {
  _id, userId, courseId, tier, issuedAt, score
}
```
For `program_manager`: add `&& country == $userCountry` filter (pass user country when fetching).
Renders as a `<table>` with columns: Learner ID (userId), Course ID, Tier, Issue Date, Score. Use CSS Module table styles with `--hds-*` tokens.

Note: learner names would require a Clerk API join — for PRD-A, display `userId` as the identifier. Adding full name lookup is a future enhancement.

### Step 6 — Create `src/components/lms/dashboard/MetricsBar.tsx`
Build `MetricsBar` using CSS Modules and `--hds-*` tokens. Props interface:
```typescript
interface MetricsBarProps {
  data: { label: string; value: number }[]
}
```
Renders a horizontal bar chart where each `data` entry is a labelled bar scaled relative to the maximum value. Do NOT import from `src/components/charts/CompletionsBar` — that component uses `styled-components` and is incompatible with this project's CSS Modules constraint.

---

## Acceptance Criteria
- [ ] Dashboard page is a Server Component (no `'use client'` at page level)
- [ ] `learner` role redirected to `/elearning` (not 403)
- [ ] `program_manager` sees only own-country data (enforced both in UI and T08 Route Handler)
- [ ] Country dropdown pre-filled and disabled for `program_manager`
- [ ] Filter changes update URL search params (not local state)
- [ ] All 8 metrics displayed as `MetricCard` components
- [ ] `MetricsBar` built with CSS Modules + `--hds-*` tokens; no `styled-components`
- [ ] `CertificateList` rendered only for `system_admin` and `program_manager`
- [ ] `CertificateList` NOT rendered for `partner_donor` or `learner`
- [ ] FilterBar dropdowns update metrics without full page reload (Next.js soft navigation)
- [ ] Filter state reflected in URL params (shareable links)
- [ ] CSS Modules + `--hds-*` tokens throughout; no Tailwind
- [ ] No `useMemo` or `useCallback`
- [ ] `npx tsc --noEmit` passes
- [ ] `ExpiryAlert` banner displays when `getExpiringCertificates` returns count > 0
- [ ] Enrollment by country chart renders via `MetricsBar` using `getEnrollmentsByCountry` data

---

## Dependencies
Before starting, verify:
- T07 complete: `certificate` documents being written to Sanity; `CertificateViewer` component exists (T09's `CertificateList` is separate from T07's `CertificateViewer`).
- T08 complete: `GET /api/lms/dashboard` Route Handler returns `DashboardMetrics` JSON; `dashboardQueries.ts` exports all 8 query functions; role scoping enforced.
- `src/components/charts/CompletionsBar` exists in the codebase but uses `styled-components` — do NOT import it. Build `MetricsBar` instead (Step 6).

---

## Do Not
- Do NOT use `useState` for filter values — URL search params only.
- Do NOT import `CompletionsBar` from `src/components/charts/` — it uses `styled-components` which violates the CSS Modules constraint. Use `MetricsBar` instead.
- Do NOT add `'use client'` to `DashboardPage` or `DashboardShell` — keep them as Server Components.
- Do NOT render `CertificateList` for `partner_donor` or `learner` roles.
- Do NOT compute NPS or any metric in the UI layer — all metric computation is in T08's queries.
- Do NOT use `useMemo` or `useCallback` — React Compiler is active.
- Do NOT touch `src/sanity/lib/client.ts`, `src/sanity/lib/write-client.ts`, `sanity.config.ts`, or `.env*` files.
- Do NOT implement DHIS2 integration, LinkedIn sharing, or WhatsApp — out of PRD-A scope.
- Do NOT access `searchParams` properties before awaiting — in Next.js 15+/16.x, `searchParams` is a Promise in Server Components.

---

*Generated by KARIMO Brief Writer*
*PRD: elearning-framework | Task: T09 | Wave: 4*
