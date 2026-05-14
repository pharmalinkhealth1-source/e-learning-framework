import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const lessonId = req.nextUrl.searchParams.get('lessonId')
  if (!lessonId) return NextResponse.json({ error: 'lessonId required' }, { status: 400 })

  const body = await req.json()
  const completed = body?.cmi?.completion_status === 'completed'
    || body?.cmi?.core?.lesson_status === 'completed'
    || body?.cmi?.core?.lesson_status === 'passed'

  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "lessonProgress" && lessonId == $lessonId && userId == $userId][0] { _id }`,
    { lessonId, userId }
  )

  if (existing) {
    await client.patch(existing._id).set({ scormData: body, ...(completed && { completed: true }) }).commit()
  } else {
    await client.create({
      _type: 'lessonProgress',
      lessonId,
      userId: userId,
      scormData: body,
      completed,
      completedAt: completed ? new Date().toISOString() : undefined,
    })
  }

  return NextResponse.json({ ok: true })
}
