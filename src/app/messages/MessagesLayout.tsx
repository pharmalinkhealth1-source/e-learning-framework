'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Conversation } from '@/types/lms'
import ConversationList from './ConversationList'
import MessageThread from './MessageThread'
import NewConversationModal from './NewConversationModal'
import styles from './page.module.css'

interface Props {
  initialConversations: Conversation[]
  currentUserId: string
  currentUserName: string
}

export default function MessagesLayout({
  initialConversations,
  currentUserId,
  currentUserName,
}: Props) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [selectedId, setSelectedId] = useState<string | null>(
    initialConversations[0]?._id ?? null
  )
  const [modalOpen, setModalOpen] = useState(false)

  const refreshConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/messages/conversations', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      if (Array.isArray(data.conversations)) {
        setConversations(data.conversations)
      }
    } catch (err) {
      console.error('Failed to refresh conversations:', err)
    }
  }, [])

  // Light polling for the conversation list (every 8s) so new threads appear.
  useEffect(() => {
    const interval = setInterval(refreshConversations, 8000)
    return () => clearInterval(interval)
  }, [refreshConversations])

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
  }, [])

  const handleStartConversation = useCallback(
    async (recipientId: string) => {
      try {
        const res = await fetch('/api/messages/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipientId }),
        })
        if (!res.ok) return
        const data = await res.json()
        if (data.conversationId) {
          setModalOpen(false)
          await refreshConversations()
          setSelectedId(data.conversationId)
        }
      } catch (err) {
        console.error('Failed to start conversation:', err)
      }
    },
    [refreshConversations]
  )

  const selectedConversation = useMemo(
    () => conversations.find((c) => c._id === selectedId) || null,
    [conversations, selectedId]
  )

  return (
    <div className={styles.layout}>
      <aside
        className={styles.sidebar}
        data-mobile-hidden={selectedId ? 'true' : 'false'}
      >
        <header className={styles.sidebarHeader}>
          <h1 className={styles.title}>Messages</h1>
          <button
            type="button"
            className={styles.newBtn}
            onClick={() => setModalOpen(true)}
          >
            + New
          </button>
        </header>
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </aside>

      <section
        className={styles.thread}
        data-mobile-hidden={selectedId ? 'false' : 'true'}
      >
        {selectedConversation ? (
          <MessageThread
            key={selectedConversation._id}
            conversation={selectedConversation}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            onBack={() => setSelectedId(null)}
            onMessageSent={refreshConversations}
          />
        ) : (
          <div className={styles.emptyThread}>
            <p>Select a conversation to start messaging.</p>
          </div>
        )}
      </section>

      {modalOpen && (
        <NewConversationModal
          onClose={() => setModalOpen(false)}
          onStart={handleStartConversation}
        />
      )}
    </div>
  )
}
