import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ total: 0 })

  try {
    const conversations = await client.fetch<Array<{ unread: number | null }>>(
      `*[_type == "conversation" && $userId in participantIds]{
        "unread": participantUnread[userId == $userId][0].count
      }`,
      { userId }
    )

    const total = (conversations || []).reduce(
      (sum, c) => sum + (c.unread ?? 0),
      0
    )

    return NextResponse.json({ total })
  } catch {
    return NextResponse.json({ total: 0 })
  }
}
