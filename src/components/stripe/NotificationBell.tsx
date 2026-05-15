'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './NotificationBell.module.css';

interface Notification {
  _id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  courseId?: string;
}

const TYPE_ICONS: Record<string, string> = {
  new_message: '💬',
  assignment_submitted: '📝',
  enrollment: '🎓',
  completion: '✅',
  certificate_ready: '🏆',
  certificate_expiring: '⚠️',
  inactivity: '👋',
}

function getHref(n: Notification): string {
  switch (n.type) {
    case 'new_message': return '/messages'
    case 'assignment_submitted': return '/elearning/assignments/manage'
    case 'certificate_expiring': return n.courseId ? `/elearning/courses/${n.courseId}` : '/elearning/dashboard'
    case 'enrollment':
    case 'completion':
    case 'certificate_ready': return '/elearning/dashboard'
    default: return '/elearning/dashboard'
  }
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/lms/notifications')
      if (res.ok) setNotifications(await res.json())
    } catch {}
  }

  useEffect(() => {
    fetchNotifications()
    const id = setInterval(fetchNotifications, 30_000)
    return () => clearInterval(id)
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  const markRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n))
    fetch('/api/lms/notifications/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId: id }),
    }).catch(() => {})
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    fetch('/api/lms/notifications/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true }),
    }).catch(() => {})
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <button
        className={styles.bell}
        onClick={() => setIsOpen(o => !o)}
        aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : 'Notifications'}
        aria-expanded={isOpen}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="dialog" aria-label="Notifications">
          <div className={styles.dropdownHeader}>
            <span className={styles.dropdownTitle}>Notifications</span>
            {unreadCount > 0 && (
              <button className={styles.markAllBtn} onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className={styles.list}>
            {notifications.length === 0 ? (
              <div className={styles.empty}>No notifications yet</div>
            ) : (
              notifications.map(n => (
                <Link
                  key={n._id}
                  href={getHref(n)}
                  className={`${styles.item} ${!n.read ? styles.unread : ''}`}
                  onClick={() => { markRead(n._id); setIsOpen(false) }}
                >
                  <span className={styles.icon}>{TYPE_ICONS[n.type] ?? '🔔'}</span>
                  <div className={styles.body}>
                    <p className={styles.message}>{n.message}</p>
                    <p className={styles.time}>{new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                  {!n.read && <span className={styles.dot} aria-hidden />}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
