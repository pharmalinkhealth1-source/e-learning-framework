import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { courseId, csatScore, npsScore, comment } = body as {
    courseId: string
    csatScore: number
    npsScore: number
    comment?: string
  }

  if (!courseId || csatScore == null || npsScore == null) {
    return NextResponse.json({ error: 'courseId, csatScore, npsScore required' }, { status: 400 })
  }
  if (csatScore < 1 || csatScore > 5 || !Number.isInteger(csatScore)) {
    return NextResponse.json({ error: 'csatScore must be integer 1-5' }, { status: 400 })
  }
  if (npsScore < 0 || npsScore > 10 || !Number.isInteger(npsScore)) {
    return NextResponse.json({ error: 'npsScore must be integer 0-10' }, { status: 400 })
  }

  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "surveyResponse" && courseId == $courseId && clerkUserId == $userId][0] { _id }`,
    { courseId, userId }
  )
  if (existing) return NextResponse.json({ error: 'Already submitted' }, { status: 409 })

  const clerk = await clerkClient()
  const user = await clerk.users.getUser(userId)
  const meta = user.publicMetadata as {
    gender?: string
    ageGroup?: string
    healthWorkerType?: string
    country?: string
  }

  await client.create({
    _type: 'surveyResponse',
    courseId,
    clerkUserId: userId,
    csatScore,
    npsScore,
    comment: comment ?? '',
    submittedAt: new Date().toISOString(),
    gender: meta.gender ?? null,
    ageGroup: meta.ageGroup ?? null,
    healthWorkerType: meta.healthWorkerType ?? null,
    country: meta.country ?? null,
  })

  return NextResponse.json({ ok: true })
}
