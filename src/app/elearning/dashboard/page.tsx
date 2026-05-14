import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import {
  getCsatAvg,
  getNpsScore,
  getKnowledgeGain,
  getDau,
  getConversionRate,
  getRetentionRate,
  getNewUsersByCountry,
  getKnowledgeBaseGrowth,
} from '@/sanity/lib/dashboardQueries'
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

  const effectiveCountry = role === 'program_manager' ? userCountry : params.country

  const filters = {
    country: effectiveCountry,
    gender: params.gender,
    ageGroup: params.ageGroup,
    learnerType: params.learnerType,
    userRole: role,
    userCountry: userCountry ?? '',
  }

  const [
    csatAvg,
    npsScore,
    knowledgeGain,
    dau,
    conversionRate,
    retentionRate,
    newUsersByCountry,
    knowledgeBaseGrowth,
  ] = await Promise.all([
    getCsatAvg(filters),
    getNpsScore(filters),
    getKnowledgeGain(filters),
    getDau(filters),
    getConversionRate(filters),
    getRetentionRate(filters),
    getNewUsersByCountry(filters),
    getKnowledgeBaseGrowth(filters),
  ])

  const newUsersByCountryMap: Record<string, number> = {}
  for (const row of newUsersByCountry) {
    newUsersByCountryMap[row.country] = (newUsersByCountryMap[row.country] ?? 0) + row.count
  }

  const metrics = {
    csatAvg,
    npsScore,
    knowledgeGain,
    dau,
    conversionRate,
    retentionRate,
    newUsersByCountry: newUsersByCountryMap,
    knowledgeBaseGrowth,
  }

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
