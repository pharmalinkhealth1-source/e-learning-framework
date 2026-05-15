import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/write-client'

/**
 * GET /api/messages/conversations
 * Returns conversations for the current user, enriched with the other participant's profile.
 */
export async function GET() {
  const { userId } = await auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })

  try {
    const conversations = await client.fetch<any[]>(
      `*[_type == "conversation" && $userId in participantIds] | order(lastMessageAt desc) {
        _id, participantIds, createdAt, lastMessageAt, lastMessagePreview
      }`,
      { userId }
    )

    const otherIds = Array.from(
      new Set(
        conversations.flatMap((c) =>
          (c.participantIds || []).filter((p: string) => p !== userId)
        )
      )
    )

    const authors = otherIds.length
      ? await client.fetch<any[]>(
          `*[_type == "author" && clerkId in $ids] {
            clerkId, name, "avatarUrl": image._externalUrl
          }`,
          { ids: otherIds }
        )
      : []

    const authorMap = new Map<string, { name: string; avatarUrl?: string }>()
    for (const a of authors) {
      if (a?.clerkId) authorMap.set(a.clerkId, { name: a.name, avatarUrl: a.avatarUrl })
    }

    const enriched = conversations.map((c) => {
      const otherId = (c.participantIds || []).find((p: string) => p !== userId) || ''
      const profile = authorMap.get(otherId)
      return {
        ...c,
        otherParticipant: {
          userId: otherId,
          name: profile?.name || 'Unknown user',
          avatarUrl: profile?.avatarUrl,
        },
      }
    })

    return NextResponse.json({ conversations: enriched })
  } catch (error) {
    console.error('GET conversations error:', error)
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}

/**
 * POST /api/messages/conversations
 * Starts or retrieves a conversation with another user.
 * Body: { recipientId: string }
 */
export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })

  try {
    const { recipientId } = (await req.json()) as { recipientId?: string }
    if (!recipientId || typeof recipientId !== 'string') {
      return NextResponse.json({ error: 'recipientId required' }, { status: 400 })
    }
    if (recipientId === userId) {
      return NextResponse.json({ error: 'Cannot start a conversation with yourself' }, { status: 400 })
    }

    const existing = await writeClient.fetch<any>(
      `*[_type == "conversation" && $userId in participantIds && $recipientId in participantIds][0]{ _id }`,
      { userId, recipientId }
    )

    if (existing?._id) {
      return NextResponse.json({ conversationId: existing._id })
    }

    const now = new Date().toISOString()
    const created = await writeClient.create({
      _type: 'conversation',
      participantIds: [userId, recipientId],
      createdAt: now,
      lastMessageAt: now,
    })

    return NextResponse.json({ conversationId: created._id })
  } catch (error) {
    console.error('POST conversation error:', error)
    return NextResponse.json({ error: 'Failed to start conversation' }, { status: 500 })
  }
}
