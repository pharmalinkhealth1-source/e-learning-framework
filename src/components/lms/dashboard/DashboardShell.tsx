import type { LmsRole, DashboardMetrics } from '@/types/lms'
import { getEnrollmentsByCountry } from '@/sanity/lib/dashboardQueries'
import { MetricCard } from './MetricCard'
import { MetricsBar } from './MetricsBar'
import { FilterBar } from './FilterBar'
import { CertificateList } from './CertificateList'
import { ExpiryAlert } from './ExpiryAlert'
import styles from './DashboardShell.module.css'

interface DashboardShellProps {
  role: LmsRole
  userCountry?: string
  searchParams: { country?: string; gender?: string; ageGroup?: string; learnerType?: string }
  metrics: DashboardMetrics
}

const ROLE_LABELS: Record<LmsRole, string> = {
  system_admin: 'System Admin',
  program_manager: 'Program Manager',
  partner_donor: 'Partner / Donor',
  learner: 'Learner',
}

export async function DashboardShell({ role, userCountry, searchParams, metrics }: DashboardShellProps) {
  const enrollmentData = await getEnrollmentsByCountry({ country: role === 'program_manager' ? userCountry : searchParams.country })

  // Roll up enrollments to country-level totals for the bar chart
  const enrollmentByCountry = new Map<string, number>()
  for (const row of enrollmentData) {
    enrollmentByCountry.set(row.country, (enrollmentByCountry.get(row.country) ?? 0) + row.count)
  }
  const enrollmentBarData = Array.from(enrollmentByCountry.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)

  const newUserBarData = Object.entries(metrics.newUsersByCountry)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)

  const showCertList = role === 'system_admin' || role === 'program_manager'
  const effectiveCountry = role === 'program_manager' ? userCountry : searchParams.country

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>PharmaLink Analytics Dashboard</h1>
          <p className={styles.subtitle}>
            {userCountry ? `${ROLE_LABELS[role]} — ${userCountry}` : ROLE_LABELS[role]}
          </p>
        </div>
      </header>

      <ExpiryAlert country={effectiveCountry} />

      <FilterBar role={role} userCountry={userCountry} />

      <section className={styles.metricsGrid} aria-label="Key metrics">
        <MetricCard label="CSAT Average" value={metrics.csatAvg.toFixed(1)} unit="/ 5" description="Average satisfaction score" />
        <MetricCard label="NPS Score" value={metrics.npsScore} unit="%" description="Net Promoter Score (promoters = NPS ≥ 9)" />
        <MetricCard label="Knowledge Gain" value={metrics.knowledgeGain} unit="pts" description="Average post-test minus pre-test score" />
        <MetricCard label="Daily Active" value={metrics.dau} description="Learners active in last 24 hours" />
        <MetricCard label="Conversion Rate" value={metrics.conversionRate} unit="%" description="Enrolled learners who completed a lesson" />
        <MetricCard label="Retention (12m)" value={metrics.retentionRate} description="Active learners in last 12 months" />
        <MetricCard label="Courses Available" value={metrics.knowledgeBaseGrowth} description="Total published courses" />
      </section>

      <section className={styles.chartsGrid}>
        <MetricsBar data={newUserBarData} title="New Users by Country" />
        <MetricsBar data={enrollmentBarData} title="Enrollments by Country" />
      </section>

      {showCertList && (
        <section className={styles.section}>
          <CertificateList isManager={role === 'program_manager'} userCountry={userCountry} />
        </section>
      )}
    </div>
  )
}
