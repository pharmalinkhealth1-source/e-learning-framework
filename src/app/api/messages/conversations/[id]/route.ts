import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/write-client'

interface RouteContext {
  params: Promise<{ id: string }>
}

interface ParticipantUnread {
  userId: string
  count: number
}

interface ConversationDoc {
  _id: string
  participantIds: string[]
  participantUnread?: ParticipantUnread[]
}

export async function GET(_req: Request, { params }: RouteContext) {
  const { userId } = await auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })

  try {
    const { id } = await params

    const conversation = await client.fetch<ConversationDoc | null>(
      `*[_type == "conversation" && _id == $id][0]{
        _id, participantIds, participantUnread
      }`,
      { id }
    )
    if (!conversation) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    if (!conversation.participantIds?.includes(userId)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const messages = await client.fetch<unknown[]>(
      `*[_type == "directMessage" && conversationId == $id] | order(createdAt asc) [0...50] {
        _id, conversationId, senderId, senderName, content, createdAt, readBy
      }`,
      { id }
    )

    // Reset unread count to 0 for this user
    const existing = conversation.participantUnread ?? []
    const updatedUnread = conversation.participantIds.map((pid) => {
      const entry = existing.find((p) => p.userId === pid)
      return { userId: pid, count: pid === userId ? 0 : (entry?.count ?? 0) }
    })
    await writeClient.patch(id).set({ participantUnread: updatedUnread }).commit().catch(() => {})

    const otherIds = conversation.participantIds.filter((p) => p !== userId)
    const participants = otherIds.length
      ? await client.fetch<unknown[]>(
          `*[_type == "author" && clerkId in $ids]{ clerkId, name, "avatarUrl": image._externalUrl }`,
          { ids: otherIds }
        )
      : []

    return NextResponse.json({ messages, participants })
  } catch (error) {
    console.error('GET messages error:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: RouteContext) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const { content } = (await req.json()) as { content?: string }
    if (!content?.trim()) return NextResponse.json({ error: 'content required' }, { status: 400 })

    const conversation = await client.fetch<ConversationDoc | null>(
      `*[_type == "conversation" && _id == $id][0]{ _id, participantIds, participantUnread }`,
      { id }
    )
    if (!conversation) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    if (!conversation.participantIds?.includes(userId)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const senderProfile = await client.fetch<{ name: string } | null>(
      `*[_type == "author" && clerkId == $userId][0]{ name }`,
      { userId }
    )
    const senderName = senderProfile?.name ?? 'Unknown'
    const trimmed = content.trim()
    const now = new Date().toISOString()
    const preview = trimmed.length > 80 ? trimmed.slice(0, 80) + '…' : trimmed

    const created = await writeClient.create({
      _type: 'directMessage',
      conversationId: id,
      senderId: userId,
      senderName,
      content: trimmed,
      createdAt: now,
      readBy: [userId],
    })

    // Increment unread count for all other participants, keep sender count unchanged
    const existing = conversation.participantUnread ?? []
    const updatedUnread = conversation.participantIds.map((pid) => {
      const entry = existing.find((p) => p.userId === pid)
      return { userId: pid, count: pid === userId ? (entry?.count ?? 0) : (entry?.count ?? 0) + 1 }
    })
    await writeClient.patch(id)
      .set({ lastMessageAt: now, lastMessagePreview: preview, participantUnread: updatedUnread })
      .commit()
      .catch(() => {})

    // Notify teacher recipients if sender is a learner
    const senderRole = (sessionClaims?.metadata as Record<string, unknown> | undefined)?.role as string | undefined
    if (senderRole === 'learner') {
      const otherIds = conversation.participantIds.filter((p) => p !== userId)
      const teacherRecipients = otherIds.length
        ? await client.fetch<Array<{ clerkId: string }>>(
            `*[_type == "author" && clerkId in $ids && role in ["program_manager", "system_admin"]]{ clerkId }`,
            { ids: otherIds }
          )
        : []

      await Promise.all(
        teacherRecipients.map((r) =>
          writeClient.create({
            _type: 'notification',
            userId: r.clerkId,
            type: 'new_message',
            message: `New message from ${senderName}`,
            read: false,
            createdAt: now,
          }).catch(() => {})
        )
      )
    }

    return NextResponse.json({
      message: { _id: created._id, conversationId: id, senderId: userId, senderName, content: trimmed, createdAt: now, readBy: [userId] },
    })
  } catch (error) {
    console.error('POST message error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
