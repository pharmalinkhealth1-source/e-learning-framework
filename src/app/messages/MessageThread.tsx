'use client'

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import type { Conversation, DirectMessage } from '@/types/lms'
import styles from './page.module.css'

interface Props {
  conversation: Conversation
  currentUserId: string
  currentUserName: string
  onBack: () => void
  onMessageSent: () => void
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

export default function MessageThread({
  conversation,
  currentUserId,
  currentUserName,
  onBack,
  onMessageSent,
}: Props) {
  const [messages, setMessages] = useState<DirectMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const conversationId = conversation._id

  const fetchMessages = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const res = await fetch(`/api/messages/conversations/${conversationId}`, {
          cache: 'no-store',
          signal,
        })
        if (!res.ok) return
        const data = await res.json()
        if (Array.isArray(data.messages)) {
          setMessages(data.messages)
        }
      } catch (err) {
        if ((err as any)?.name !== 'AbortError') {
          console.error('Failed to load messages:', err)
        }
      }
    },
    [conversationId]
  )

  useEffect(() => {
    setLoading(true)
    const controller = new AbortController()
    fetchMessages(controller.signal).finally(() => setLoading(false))
    return () => controller.abort()
  }, [fetchMessages])

  // Poll every 4 seconds for new messages.
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/messages/conversations/${conversationId}`, {
        cache: 'no-store',
      })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.messages)) {
          setMessages(data.messages)
        }
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [conversationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const content = draft.trim()
    if (!content || sending) return
    setSending(true)
    const optimistic: DirectMessage = {
      _id: `optimistic-${Date.now()}`,
      conversationId,
      senderId: currentUserId,
      senderName: currentUserName,
      content,
      createdAt: new Date().toISOString(),
      readBy: [currentUserId],
    }
    setMessages((prev) => [...prev, optimistic])
    setDraft('')
    try {
      const res = await fetch(`/api/messages/conversations/${conversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.message) {
          setMessages((prev) =>
            prev.map((m) => (m._id === optimistic._id ? data.message : m))
          )
        }
        onMessageSent()
      } else {
        setMessages((prev) => prev.filter((m) => m._id !== optimistic._id))
        setDraft(content)
      }
    } catch (err) {
      console.error('Failed to send message:', err)
      setMessages((prev) => prev.filter((m) => m._id !== optimistic._id))
      setDraft(content)
    } finally {
      setSending(false)
    }
  }

  const other = conversation.otherParticipant

  return (
    <div className={styles.threadContainer}>
      <header className={styles.threadHeader}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={onBack}
          aria-label="Back to conversations"
        >
          &larr;
        </button>
        <div className={styles.threadHeaderInfo}>
          <span className={styles.threadName}>{other?.name || 'Unknown'}</span>
        </div>
      </header>

      <div className={styles.messages}>
        {loading && messages.length === 0 ? (
          <p className={styles.threadStatus}>Loading messages&hellip;</p>
        ) : messages.length === 0 ? (
          <p className={styles.threadStatus}>No messages yet. Say hello.</p>
        ) : (
          messages.map((m) => {
            const own = m.senderId === currentUserId
            return (
              <div
                key={m._id}
                className={`${styles.bubbleRow} ${own ? styles.bubbleRowOwn : ''}`}
              >
                <div className={`${styles.bubble} ${own ? styles.bubbleOwn : styles.bubbleOther}`}>
                  <p className={styles.bubbleContent}>{m.content}</p>
                  <span className={styles.bubbleTime}>{formatTime(m.createdAt)}</span>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form className={styles.composer} onSubmit={handleSubmit}>
        <input
          className={styles.composerInput}
          type="text"
          placeholder="Type a message…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={sending}
          aria-label="Message"
        />
        <button
          type="submit"
          className={styles.composerBtn}
          disabled={sending || !draft.trim()}
        >
          Send
        </button>
      </form>
    </div>
  )
}
