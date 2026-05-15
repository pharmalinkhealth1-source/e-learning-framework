import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/write-client'
import type { LmsRole, Submission } from '@/types/lms'

const TEACHER_ROLES: LmsRole[] = ['program_manager', 'system_admin']

/**
 * GET /api/lms/submissions?assignmentId=...
 * - Teachers (program_manager, system_admin): all submissions for the assignment.
 * - Learners: only their own submissions for the assignment.
 */
export async function GET(req: Request) {
  const { userId, sessionClaims } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const metadata = sessionClaims?.metadata as Record<string, unknown> | undefined
  const role = metadata?.role as LmsRole | undefined

  const { searchParams } = new URL(req.url)
  const assignmentId = searchParams.get('assignmentId')

  if (!assignmentId) {
    return NextResponse.json({ error: 'Missing assignmentId' }, { status: 400 })
  }

  const isTeacher = role ? TEACHER_ROLES.includes(role) : false

  const query = isTeacher
    ? `*[_type == "submission" && assignmentId == $assignmentId] | order(submittedAt desc) {
        _id, assignmentId, studentId, studentName, courseId, submittedAt,
        textContent, fileUrl, linkUrl, status, grade, feedback, gradedBy, gradedAt
      }`
    : `*[_type == "submission" && assignmentId == $assignmentId && studentId == $userId] | order(submittedAt desc) {
        _id, assignmentId, studentId, studentName, courseId, submittedAt,
        textContent, fileUrl, linkUrl, status, grade, feedback, gradedBy, gradedAt
      }`

  const submissions = await client.fetch<Submission[]>(query, { assignmentId, userId })

  return NextResponse.json(submissions)
}

/**
 * POST /api/lms/submissions
 * Student submits work for an assignment.
 */
export async function POST(req: Request) {
  const { userId, sessionClaims } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as {
    assignmentId?: string
    courseId?: string
    textContent?: string
    fileUrl?: string
    linkUrl?: string
  }

  const { assignmentId, courseId, textContent, fileUrl, linkUrl } = body

  if (!assignmentId || !courseId) {
    return NextResponse.json(
      { error: 'Missing required fields: assignmentId, courseId' },
      { status: 400 }
    )
  }

  const metadata = sessionClaims?.metadata as Record<string, unknown> | undefined
  const studentName =
    (metadata?.fullName as string | undefined) ??
    (metadata?.name as string | undefined) ??
    undefined

  const created = await writeClient.create({
    _type: 'submission',
    assignmentId,
    studentId: userId,
    studentName,
    courseId,
    submittedAt: new Date().toISOString(),
    textContent: textContent ?? undefined,
    fileUrl: fileUrl ?? undefined,
    linkUrl: linkUrl ?? undefined,
    status: 'pending',
  })

  return NextResponse.json(created)
}
