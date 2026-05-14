import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const notifications = await client.fetch(
    groq`*[_type == "notification" && userId == $userId] | order(createdAt desc) [0..19] {
      _id, type, message, read, createdAt, courseId
    }`,
    { userId }
  )

  return NextResponse.json(notifications)
}
