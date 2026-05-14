import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
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
import type { DashboardFilters, LmsRole } from '@/types/lms'

export async function GET(req: NextRequest) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const meta = sessionClaims?.metadata as { role?: string; country?: string } | undefined
  const role = meta?.role as LmsRole | undefined
  const userCountry = meta?.country ?? ''

  if (!role || role === 'learner') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const url = req.nextUrl
  const rawFilters: DashboardFilters = {
    country: url.searchParams.get('country') ?? undefined,
    gender: url.searchParams.get('gender') ?? undefined,
    ageGroup: url.searchParams.get('ageGroup') ?? undefined,
    learnerType: url.searchParams.get('learnerType') ?? undefined,
  }

  // program_manager: force country to their own, ignore query param
  const filters = {
    ...rawFilters,
    country: role === 'program_manager' ? userCountry : rawFilters.country,
    userRole: role,
    userCountry,
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

  // Roll up newUsersByCountry to a simple record for DashboardMetrics shape
  const newUsersByCountryMap: Record<string, number> = {}
  for (const row of newUsersByCountry) {
    newUsersByCountryMap[row.country] = (newUsersByCountryMap[row.country] ?? 0) + row.count
  }

  return NextResponse.json({
    csatAvg,
    npsScore,
    knowledgeGain,
    dau,
    conversionRate,
    retentionRate,
    newUsersByCountry: newUsersByCountryMap,
    knowledgeBaseGrowth,
  })
}
