import { client } from './client'
import { groq } from 'next-sanity'
import type { DashboardFilters, LmsRole } from '@/types/lms'

type QueryFilters = DashboardFilters & { userRole: LmsRole; userCountry: string }

function buildParams(filters: QueryFilters): Record<string, string | undefined> {
  return {
    gender: filters.gender,
    ageGroup: filters.ageGroup,
    healthWorkerType: filters.learnerType,
    country: filters.userRole === 'program_manager' ? filters.userCountry : filters.country,
  }
}

function roleScope(filters: QueryFilters): string {
  if (filters.userRole === 'program_manager') return ' && country == $country'
  if (filters.country) return ' && country == $country'
  return ''
}

function filterClauses(filters: QueryFilters): string {
  const parts: string[] = []
  if (filters.gender) parts.push('&& gender == $gender')
  if (filters.ageGroup) parts.push('&& ageGroup == $ageGroup')
  if (filters.learnerType) parts.push('&& healthWorkerType == $healthWorkerType')
  return parts.join(' ')
}

export async function getCsatAvg(filters: QueryFilters): Promise<number> {
  const scope = roleScope(filters)
  const clauses = filterClauses(filters)
  const result = await client.fetch<number | null>(
    groq`avg(*[_type == "surveyResponse"${scope} ${clauses}].csatScore)`,
    buildParams(filters)
  )
  return result ?? 0
}

export async function getNpsScore(filters: QueryFilters): Promise<number> {
  const scope = roleScope(filters)
  const clauses = filterClauses(filters)
  const params = buildParams(filters)
  const [promoters, total] = await Promise.all([
    client.fetch<number>(
      groq`count(*[_type == "surveyResponse"${scope} ${clauses} && npsScore >= 9])`,
      params
    ),
    client.fetch<number>(
      groq`count(*[_type == "surveyResponse"${scope} ${clauses}])`,
      params
    ),
  ])
  return total > 0 ? Math.round((promoters / total) * 100) : 0
}

export async function getKnowledgeGain(filters: QueryFilters): Promise<number> {
  const scope = roleScope(filters)
  const clauses = filterClauses(filters)
  const rows = await client.fetch<Array<{ pre: number; post: number }>>(
    groq`*[_type == "lessonProgress"${scope} ${clauses} && defined(postTestScore) && defined(preTestScore)] { "pre": preTestScore, "post": postTestScore }`,
    buildParams(filters)
  )
  if (!rows.length) return 0
  const total = rows.reduce((sum, r) => sum + (r.post - r.pre), 0)
  return Math.round(total / rows.length)
}

export async function getDau(filters: QueryFilters): Promise<number> {
  const scope = roleScope(filters)
  const clauses = filterClauses(filters)
  const yesterday = new Date(Date.now() - 86400000).toISOString()
  return client.fetch<number>(
    groq`count(*[_type == "lessonProgress"${scope} ${clauses} && completedAt > $yesterday])`,
    { ...buildParams(filters), yesterday }
  )
}

export async function getConversionRate(filters: QueryFilters): Promise<number> {
  const scope = roleScope(filters)
  const clauses = filterClauses(filters)
  const params = buildParams(filters)
  const [completed, total] = await Promise.all([
    client.fetch<number>(groq`count(*[_type == "lessonProgress"${scope} ${clauses} && completed == true])`, params),
    client.fetch<number>(groq`count(*[_type == "lessonProgress"${scope} ${clauses}])`, params),
  ])
  return total > 0 ? Math.round((completed / total) * 100) : 0
}

export async function getRetentionRate(filters: QueryFilters): Promise<number> {
  const scope = roleScope(filters)
  const clauses = filterClauses(filters)
  const twelveMonthsAgo = new Date(Date.now() - 365 * 86400000).toISOString()
  return client.fetch<number>(
    groq`count(*[_type == "lessonProgress"${scope} ${clauses} && completedAt > $twelveMonthsAgo])`,
    { ...buildParams(filters), twelveMonthsAgo }
  )
}

export async function getNewUsersByCountry(filters: QueryFilters): Promise<Array<{ country: string; month: string; count: number }>> {
  const scope = roleScope(filters)
  const rows = await client.fetch<Array<{ country: string; month: string }>>(
    groq`*[_type == "lessonProgress"${scope} && defined(country) && defined(completedAt)] {
      country,
      "month": string::slice(completedAt, 0, 7)
    } | order(month desc)`,
    buildParams(filters)
  )
  const map = new Map<string, number>()
  for (const row of rows) {
    const key = `${row.country}__${row.month}`
    map.set(key, (map.get(key) ?? 0) + 1)
  }
  return Array.from(map.entries()).map(([key, count]) => {
    const [country, month] = key.split('__')
    return { country, month, count }
  })
}

export async function getKnowledgeBaseGrowth(_filters: QueryFilters): Promise<number> {
  return client.fetch<number>(groq`count(*[_type == "course"])`, {})
}

export async function getExpiringCertificates(opts: { daysAhead?: number; country?: string } = {}): Promise<Array<{
  _id: string
  clerkUserId: string
  courseId: string
  tier: string
  issuedAt: string
  expiresAt: string
}>> {
  const { daysAhead = 30, country } = opts
  const now = new Date().toISOString()
  const cutoff = new Date(Date.now() + daysAhead * 86400000).toISOString()
  const countryClause = country ? ' && country == $country' : ''
  return client.fetch(
    groq`*[_type == "certificate" && expiresAt < $cutoff && expiresAt > $now${countryClause}] {
      _id, clerkUserId, courseId, tier, issuedAt, expiresAt
    }`,
    { now, cutoff, country }
  )
}

export async function getEnrollmentsByCountry(opts: { country?: string } = {}): Promise<Array<{ country: string; month: string; count: number }>> {
  const { country } = opts
  const countryClause = country ? ' && country == $country' : ''
  const rows = await client.fetch<Array<{ country: string; month: string }>>(
    groq`*[_type == "enrollment"${countryClause} && defined(country) && defined(enrolledAt)] {
      country,
      "month": string::slice(enrolledAt, 0, 7)
    } | order(month desc)`,
    { country }
  )
  const map = new Map<string, number>()
  for (const row of rows) {
    const key = `${row.country}__${row.month}`
    map.set(key, (map.get(key) ?? 0) + 1)
  }
  return Array.from(map.entries()).map(([key, count]) => {
    const [c, month] = key.split('__')
    return { country: c, month, count }
  })
}

export async function getInactiveLearners(opts: { daysSince?: number; country?: string } = {}): Promise<number> {
  const { daysSince = 7, country } = opts
  const cutoff = new Date(Date.now() - daysSince * 86400000).toISOString()
  const countryClause = country ? ' && country == $country' : ''
  return client.fetch<number>(
    groq`count(*[_type == "lessonProgress"${countryClause} && completedAt < $cutoff])`,
    { cutoff, country }
  )
}
