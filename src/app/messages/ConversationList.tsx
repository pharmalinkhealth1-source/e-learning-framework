'use client'

import type { Conversation } from '@/types/lms'
import styles from './page.module.css'

interface Props {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
}

function formatTimestamp(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const now = new Date()
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  if (sameDay) {
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  }
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function ConversationList({ conversations, selectedId, onSelect }: Props) {
  if (conversations.length === 0) {
    return (
      <div className={styles.emptyList}>
        <p>No conversations yet.</p>
        <p className={styles.emptyHint}>Click &ldquo;+ New&rdquo; to start one.</p>
      </div>
    )
  }

  return (
    <ul className={styles.convoList}>
      {conversations.map((c) => {
        const other = c.otherParticipant
        const initials = (other?.name || '?')
          .split(' ')
          .map((p) => p[0])
          .filter(Boolean)
          .slice(0, 2)
          .join('')
          .toUpperCase()
        const isSelected = c._id === selectedId
        return (
          <li key={c._id}>
            <button
              type="button"
              className={`${styles.convoItem} ${isSelected ? styles.convoItemActive : ''}`}
              onClick={() => onSelect(c._id)}
            >
              <span className={styles.avatar} aria-hidden="true">
                {other?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={other.avatarUrl} alt="" className={styles.avatarImg} />
                ) : (
                  <span className={styles.avatarInitials}>{initials || '?'}</span>
                )}
              </span>
              <span className={styles.convoBody}>
                <span className={styles.convoTopRow}>
                  <span className={styles.convoName}>{other?.name || 'Unknown'}</span>
                  <span className={styles.convoTime}>{formatTimestamp(c.lastMessageAt)}</span>
                </span>
                <span className={styles.convoPreview}>
                  {c.lastMessagePreview || <em>No messages yet</em>}
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
