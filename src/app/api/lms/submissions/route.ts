import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/write-client'
import { Resend } from 'resend'
import type { LmsRole, Submission } from '@/types/lms'

const resend = new Resend(process.env.RESEND_API_KEY)

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

  const now = new Date().toISOString()

  const created = await writeClient.create({
    _type: 'submission',
    assignmentId,
    studentId: userId,
    studentName,
    courseId,
    submittedAt: now,
    textContent: textContent ?? undefined,
    fileUrl: fileUrl ?? undefined,
    linkUrl: linkUrl ?? undefined,
    status: 'pending',
  })

  // Notify the assignment creator (teacher) — in-app + email
  const assignment = await client.fetch<{ createdBy?: string; title?: string } | null>(
    `*[_type == "assignment" && _id == $assignmentId][0]{ createdBy, title }`,
    { assignmentId }
  )
  if (assignment?.createdBy) {
    const teacherClerkId = assignment.createdBy

    writeClient.create({
      _type: 'notification',
      userId: teacherClerkId,
      type: 'assignment_submitted',
      message: `${studentName ?? 'A student'} submitted an assignment`,
      read: false,
      courseId,
      createdAt: now,
    }).catch(() => {})

    // Fire-and-forget email
    ;(async () => {
      try {
        const clerk = await clerkClient()
        const teacher = await clerk.users.getUser(teacherClerkId)
        const teacherEmail = teacher.emailAddresses[0]?.emailAddress
        if (!teacherEmail) return
        await resend.emails.send({
          from: 'PharmaLink LMS <notifications@pharmalinkhealth.com>',
          to: teacherEmail,
          subject: `Assignment submitted${assignment.title ? `: ${assignment.title}` : ''}`,
          html: `
            <p>Hi ${teacher.firstName ?? 'there'},</p>
            <p><strong>${studentName ?? 'A student'}</strong> has submitted work for
            <strong>${assignment.title ?? 'an assignment'}</strong>.</p>
            <p><a href="https://pharmalinkhealth.com/elearning/assignments/manage">Review submission →</a></p>
            <hr />
            <p style="color:#888;font-size:12px">PharmaLink LMS · You are receiving this because you are a course instructor.</p>
          `,
        })
      } catch {}
    })()
  }

  return NextResponse.json(created)
}
