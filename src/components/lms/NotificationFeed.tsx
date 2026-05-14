'use client'

import { useState } from 'react'
import styles from './NotificationFeed.module.css'

interface SanityNotification {
  _id: string
  type: string
  message: string
  read: boolean
  createdAt: string
}

interface NotificationFeedProps {
  notifications: SanityNotification[]
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function NotificationFeed({ notifications: initial }: NotificationFeedProps) {
  const [items, setItems] = useState(initial)
  const [marking, setMarking] = useState(false)

  const unreadCount = items.filter(n => !n.read).length

  async function markAllRead() {
    setMarking(true)
    const res = await fetch('/api/lms/notifications/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true }),
    })
    if (res.ok) {
      setItems(prev => prev.map(n => ({ ...n, read: true })))
    }
    setMarking(false)
  }

  if (!items.length) {
    return (
      <div className={styles.empty} role="status">
        No notifications
      </div>
    )
  }

  return (
    <section className={styles.feed} aria-label="Notifications">
      <div className={styles.feedHeader}>
        <h2 className={styles.feedTitle}>
          Notifications
          {unreadCount > 0 && (
            <span className={styles.badge} aria-label={`${unreadCount} unread`}>
              {unreadCount}
            </span>
          )}
        </h2>
        {unreadCount > 0 && (
          <button
            className={styles.markAllBtn}
            onClick={markAllRead}
            disabled={marking}
          >
            {marking ? 'Marking…' : 'Mark all read'}
          </button>
        )}
      </div>
      <ul className={styles.list} role="list">
        {items.map(n => (
          <li
            key={n._id}
            className={`${styles.item} ${n.read ? styles.read : styles.unread}`}
          >
            {!n.read && <span className={styles.dot} aria-hidden="true" />}
            <div className={styles.itemBody}>
              <p className={styles.message}>{n.message}</p>
              <time className={styles.time} dateTime={n.createdAt}>
                {relativeTime(n.createdAt)}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
