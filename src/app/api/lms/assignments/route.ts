import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/write-client'
import type { Assignment, AssignmentSubmissionType, LmsRole } from '@/types/lms'

const TEACHER_ROLES: LmsRole[] = ['program_manager', 'system_admin']

/**
 * GET /api/lms/assignments?courseId=...
 * Returns assignments for a given course. Auth required.
 */
export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get('courseId')

  if (!courseId) {
    return NextResponse.json({ error: 'Missing courseId' }, { status: 400 })
  }

  const assignments = await client.fetch<Assignment[]>(
    `*[_type == "assignment" && courseId == $courseId] | order(createdAt desc) {
      _id, title, description, courseId, dueDate, submissionType, maxScore, createdBy, createdAt
    }`,
    { courseId }
  )

  return NextResponse.json(assignments)
}

/**
 * POST /api/lms/assignments
 * Creates an assignment. Requires program_manager or system_admin role.
 */
export async function POST(req: Request) {
  const { userId, sessionClaims } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const metadata = sessionClaims?.metadata as Record<string, unknown> | undefined
  const role = metadata?.role as LmsRole | undefined

  if (!role || !TEACHER_ROLES.includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = (await req.json()) as {
    title?: string
    description?: string
    courseId?: string
    dueDate?: string
    submissionType?: AssignmentSubmissionType
    maxScore?: number
  }

  const { title, description, courseId, dueDate, submissionType, maxScore } = body

  if (!title || !courseId || !submissionType) {
    return NextResponse.json(
      { error: 'Missing required fields: title, courseId, submissionType' },
      { status: 400 }
    )
  }

  if (!['file', 'text', 'url'].includes(submissionType)) {
    return NextResponse.json({ error: 'Invalid submissionType' }, { status: 400 })
  }

  const created = await writeClient.create({
    _type: 'assignment',
    title,
    description: description ?? '',
    courseId,
    dueDate: dueDate ?? undefined,
    submissionType,
    maxScore: typeof maxScore === 'number' ? maxScore : 100,
    createdBy: userId,
    createdAt: new Date().toISOString(),
  })

  return NextResponse.json(created)
}
