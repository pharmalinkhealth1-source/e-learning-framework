import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/write-client'

export async function POST() {
  const { userId, sessionClaims } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const metadata = sessionClaims?.metadata as Record<string, unknown> | undefined
  const country = metadata?.country as string | undefined

  const courses = await client.fetch<Array<{ _id: string }>>(
    `*[_type == "course" && ($country in country || "global" in country)] { _id }`,
    { country: country ?? '' }
  )

  let enrolled = 0
  for (const course of courses) {
    const id = `enrol_${userId}_${course._id}`
    await writeClient.createIfNotExists({
      _type: 'enrollment',
      _id: id,
      userId,
      courseId: course._id,
      enrolledAt: new Date().toISOString(),
      country,
      source: 'auto',
    })
    enrolled++
  }

  return NextResponse.json({ enrolled })
}
