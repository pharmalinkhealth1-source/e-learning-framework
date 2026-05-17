import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { fetchDashboardMetrics, resolveFilters } from '@/sanity/lib/dashboardQueries'
import type { LmsRole } from '@/types/lms'

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
  const filters = resolveFilters(role, userCountry, {
    country: url.searchParams.get('country') ?? undefined,
    gender: url.searchParams.get('gender') ?? undefined,
    ageGroup: url.searchParams.get('ageGroup') ?? undefined,
    learnerType: url.searchParams.get('learnerType') ?? undefined,
  })

  return NextResponse.json(await fetchDashboardMetrics(filters))
}
