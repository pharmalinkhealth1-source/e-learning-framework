import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/write-client'

function deriveAgeGroup(dob: string | undefined | null): string {
  if (!dob) return 'unknown'
  const birth = new Date(dob)
  const age = new Date().getFullYear() - birth.getFullYear()
  if (age < 18) return '<18'
  if (age < 25) return '18-24'
  if (age < 35) return '25-34'
  if (age < 45) return '35-44'
  return '45+'
}

export async function POST(req: Request) {
  const { userId, sessionClaims } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { lessonId, lessonShortId, courseId, completed, timeSpent } = body as {
    lessonId: string
    lessonShortId: string
    courseId: string
    completed: boolean
    timeSpent?: number
  }

  const metadata = sessionClaims?.metadata as Record<string, unknown> | undefined
  const gender = metadata?.gender as string | undefined
  const country = metadata?.country as string | undefined
  const healthWorkerType = metadata?.healthWorkerType as string | undefined
  const completedLessons = (metadata?.completedLessons as string[] | undefined) ?? []

  const clerk = await clerkClient()
  const user = await clerk.users.getUser(userId)
  const dob = user.publicMetadata?.dob as string | undefined
  const ageGroup = deriveAgeGroup(dob)

  await writeClient.createOrReplace({
    _type: 'lessonProgress',
    _id: `lp_${userId}_${lessonId}`,
    userId,
    lessonId,
    lessonShortId,
    courseId,
    completed,
    timeSpent: timeSpent ?? 0,
    completedAt: completed ? new Date().toISOString() : undefined,
    gender,
    ageGroup,
    healthWorkerType,
    country,
  })

  if (completed) {
    if (completedLessons.length <= 25) {
      if (!completedLessons.includes(lessonShortId)) {
        const updated = [...completedLessons, lessonShortId]
        await clerk.users.updateUserMetadata(userId, {
          publicMetadata: { completedLessons: updated },
        })
      }
    }
  }

  return NextResponse.json({ success: true })
}
