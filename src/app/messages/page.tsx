import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import type { Conversation } from '@/types/lms'
import MessagesLayout from './MessagesLayout'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export default async function MessagesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in?redirect_url=/messages')

  const user = await currentUser()
  const currentUserName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
    user?.username ||
    'You'

  let conversations: Conversation[] = []
  try {
    const raw = await client.fetch<any[]>(
      `*[_type == "conversation" && $userId in participantIds] | order(lastMessageAt desc) {
        _id, participantIds, createdAt, lastMessageAt, lastMessagePreview
      }`,
      { userId }
    )

    const otherIds = Array.from(
      new Set(
        raw.flatMap((c) =>
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

    conversations = raw.map((c) => {
      const otherId = (c.participantIds || []).find((p: string) => p !== userId) || ''
      const profile = authorMap.get(otherId)
      return {
        _id: c._id,
        participantIds: c.participantIds || [],
        createdAt: c.createdAt,
        lastMessageAt: c.lastMessageAt,
        lastMessagePreview: c.lastMessagePreview,
        otherParticipant: {
          userId: otherId,
          name: profile?.name || 'Unknown user',
          avatarUrl: profile?.avatarUrl,
        },
      }
    })
  } catch (error) {
    console.error('Failed to load initial conversations:', error)
  }

  return (
    <main className={styles.page}>
      <MessagesLayout
        initialConversations={conversations}
        currentUserId={userId}
        currentUserName={currentUserName}
      />
    </main>
  )
}
