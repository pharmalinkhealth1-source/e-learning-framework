'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { LmsRole } from '@/types/lms'
import styles from './FilterBar.module.css'

const HEALTH_WORKER_TYPES = [
  'community_pharmacist',
  'hospital_pharmacist',
  'regulatory_pharmacist',
  'industry_pharmacist',
  'informatics_pharmacist',
  'pharmacy_manager',
  'other',
] as const

const AGE_GROUPS = ['<18', '18-24', '25-34', '35-44', '45+'] as const

const COUNTRIES = [
  'Kenya', 'Nigeria', 'Ghana', 'Tanzania', 'Uganda', 'Ethiopia',
  'South Africa', 'Rwanda', 'Zambia', 'Zimbabwe',
]

interface FilterBarProps {
  role: LmsRole
  userCountry?: string
}

export function FilterBar({ role, userCountry }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  const isManagerLocked = role === 'program_manager'

  return (
    <div className={styles.filterBar} role="search" aria-label="Dashboard filters">
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-country">Country</label>
        <select
          id="filter-country"
          className={styles.select}
          value={isManagerLocked ? (userCountry ?? '') : (searchParams.get('country') ?? '')}
          onChange={e => updateFilter('country', e.target.value)}
          disabled={isManagerLocked}
          aria-disabled={isManagerLocked}
        >
          {!isManagerLocked && <option value="">All countries</option>}
          {COUNTRIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-gender">Gender</label>
        <select
          id="filter-gender"
          className={styles.select}
          value={searchParams.get('gender') ?? ''}
          onChange={e => updateFilter('gender', e.target.value)}
        >
          <option value="">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-age">Age Group</label>
        <select
          id="filter-age"
          className={styles.select}
          value={searchParams.get('ageGroup') ?? ''}
          onChange={e => updateFilter('ageGroup', e.target.value)}
        >
          <option value="">All</option>
          {AGE_GROUPS.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-type">Learner Type</label>
        <select
          id="filter-type"
          className={styles.select}
          value={searchParams.get('learnerType') ?? ''}
          onChange={e => updateFilter('learnerType', e.target.value)}
        >
          <option value="">All</option>
          {HEALTH_WORKER_TYPES.map(t => (
            <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
