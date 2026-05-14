import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/write-client'
import type { QuizSubmission } from '@/types/lms'

export async function POST(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: QuizSubmission = await req.json()
  const { courseId, lessonId, answers, quizRole } = body

  const [lesson, course] = await Promise.all([
    client.fetch<{ questions: Array<{ correctIndex: number }>; quizRole: string } | null>(
      `*[_type == "lesson" && _id == $lessonId][0] { questions, quizRole }`,
      { lessonId }
    ),
    client.fetch<{ passingScore: number } | null>(
      `*[_type == "course" && _id == $courseId][0] { passingScore }`,
      { courseId }
    ),
  ])

  if (!lesson || !course) {
    return NextResponse.json({ error: 'Lesson or course not found' }, { status: 404 })
  }

  const questions = lesson.questions ?? []
  const correct = answers.filter((ans, i) => ans === questions[i]?.correctIndex).length
  const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0

  const tier =
    quizRole === 'post-test'
      ? score >= (course.passingScore ?? 70)
        ? 'accomplishment'
        : 'participation'
      : null

  const progressId = `lp_${userId}_${lessonId}`
  const existing = await client.fetch<Record<string, unknown> | null>(
    `*[_id == $id][0]`,
    { id: progressId }
  )

  const progressPatch: { _type: string; [key: string]: unknown } = {
    _type: 'lessonProgress',
    _id: progressId,
    userId,
    lessonId,
    courseId,
  }

  if (quizRole === 'pre-test') {
    progressPatch.preTestScore = score
  } else if (quizRole === 'post-test') {
    progressPatch.postTestScore = score
    progressPatch.completed = tier === 'accomplishment'
  }

  if (existing) {
    await writeClient.patch(progressId).set(progressPatch).commit()
  } else {
    await writeClient.create(progressPatch)
  }

  return NextResponse.json({
    score,
    passed: tier === 'accomplishment',
    tier,
  })
}
