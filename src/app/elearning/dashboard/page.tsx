import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchDashboardMetrics, resolveFilters } from '@/sanity/lib/dashboardQueries'
import { DashboardShell } from '@/components/lms/dashboard/DashboardShell'
import type { LmsRole } from '@/types/lms'
import styles from './page.module.css'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; gender?: string; ageGroup?: string; learnerType?: string }>
}) {
  const params = await searchParams
  const { sessionClaims } = await auth()

  const meta = sessionClaims?.metadata as { role?: string; country?: string } | undefined
  const role = meta?.role as LmsRole | undefined
  const userCountry = meta?.country

  if (!role || role === 'learner') redirect('/elearning')

  const filters = resolveFilters(role, userCountry ?? '', {
    country: params.country,
    gender: params.gender,
    ageGroup: params.ageGroup,
    learnerType: params.learnerType,
  })

  const metrics = await fetchDashboardMetrics(filters)

  return (
    <main className={styles.page}>
      <DashboardShell
        role={role}
        userCountry={userCountry}
        searchParams={params}
        metrics={metrics}
      />
    </main>
  )
}
