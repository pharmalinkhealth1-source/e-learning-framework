import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/write-client'

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * GET /api/messages/conversations/[id]
 * Fetches messages for a conversation (last 50). Marks unread messages as read.
 */
export async function GET(_req: Request, { params }: RouteContext) {
  const { userId } = await auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })

  try {
    const { id } = await params

    const conversation = await writeClient.fetch<any>(
      `*[_type == "conversation" && _id == $id][0]{ _id, participantIds }`,
      { id }
    )
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }
    if (!conversation.participantIds?.includes(userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const messages = await writeClient.fetch<any[]>(
      `*[_type == "directMessage" && conversationId == $id] | order(createdAt asc) [0...50] {
        _id, conversationId, senderId, senderName, content, createdAt, readBy
      }`,
      { id }
    )

    // Mark messages not yet read by this user as read.
    const unread = messages.filter(
      (m) => m.senderId !== userId && !(m.readBy || []).includes(userId)
    )
    if (unread.length > 0) {
      await Promise.all(
        unread.map((m) =>
          writeClient
            .patch(m._id)
            .setIfMissing({ readBy: [] })
            .append('readBy', [userId])
            .commit({ autoGenerateArrayKeys: true })
            .catch((e) => console.error('Failed to mark read:', e))
        )
      )
    }

    const otherIds: string[] = (conversation.participantIds || []).filter(
      (p: string) => p !== userId
    )
    const participants = otherIds.length
      ? await writeClient.fetch<any[]>(
          `*[_type == "author" && clerkId in $ids] {
            clerkId, name, "avatarUrl": image._externalUrl
          }`,
          { ids: otherIds }
        )
      : []

    return NextResponse.json({ messages, participants })
  } catch (error) {
    console.error('GET messages error:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

/**
 * POST /api/messages/conversations/[id]
 * Sends a message in a conversation.
 * Body: { content: string }
 */
export async function POST(req: Request, { params }: RouteContext) {
  const { userId } = await auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const { content } = (await req.json()) as { content?: string }

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'content required' }, { status: 400 })
    }

    const conversation = await writeClient.fetch<any>(
      `*[_type == "conversation" && _id == $id][0]{ _id, participantIds }`,
      { id }
    )
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }
    if (!conversation.participantIds?.includes(userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const senderProfile = await writeClient.fetch<any>(
      `*[_type == "author" && clerkId == $userId][0]{ name }`,
      { userId }
    )
    const senderName: string = senderProfile?.name || 'Unknown'

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

    await writeClient
      .patch(id)
      .set({ lastMessageAt: now, lastMessagePreview: preview })
      .commit()
      .catch((e) => console.error('Failed to update conversation summary:', e))

    return NextResponse.json({
      message: {
        _id: created._id,
        conversationId: id,
        senderId: userId,
        senderName,
        content: trimmed,
        createdAt: now,
        readBy: [userId],
      },
    })
  } catch (error) {
    console.error('POST message error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
