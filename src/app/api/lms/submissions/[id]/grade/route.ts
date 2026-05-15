import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/write-client'
import type { LmsRole, SubmissionStatus } from '@/types/lms'

const TEACHER_ROLES: LmsRole[] = ['program_manager', 'system_admin']

/**
 * PATCH /api/lms/submissions/[id]/grade
 * Grades a submission. Requires program_manager or system_admin role.
 * Body: { grade, feedback, status }
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  const { userId, sessionClaims } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const metadata = sessionClaims?.metadata as Record<string, unknown> | undefined
  const role = metadata?.role as LmsRole | undefined

  if (!role || !TEACHER_ROLES.includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const resolvedParams = await Promise.resolve(params)
  const { id } = resolvedParams

  if (!id) {
    return NextResponse.json({ error: 'Missing submission id' }, { status: 400 })
  }

  const body = (await req.json()) as {
    grade?: number
    feedback?: string
    status?: SubmissionStatus
  }

  const { grade, feedback, status } = body

  if (status && !['pending', 'graded', 'returned'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const patch: Record<string, unknown> = {
    gradedBy: userId,
    gradedAt: new Date().toISOString(),
  }
  if (typeof grade === 'number') patch.grade = grade
  if (typeof feedback === 'string') patch.feedback = feedback
  if (status) patch.status = status

  const updated = await writeClient.patch(id).set(patch).commit()

  return NextResponse.json(updated)
}
