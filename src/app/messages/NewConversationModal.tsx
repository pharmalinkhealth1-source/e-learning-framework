'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './page.module.css'

interface UserResult {
  clerkId: string
  name: string
  avatarUrl?: string
}

interface Props {
  onClose: () => void
  onStart: (recipientId: string) => void | Promise<void>
}

export default function NewConversationModal({ onClose, onStart }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UserResult[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const q = query.trim()
    if (!q) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/messages/users?q=${encodeURIComponent(q)}`, {
          cache: 'no-store',
        })
        if (res.ok) {
          const data = await res.json()
          setResults(Array.isArray(data.users) ? data.users : [])
        }
      } catch (err) {
        console.error('User search failed:', err)
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>New conversation</h2>
          <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <input
          ref={inputRef}
          type="text"
          className={styles.modalSearch}
          placeholder="Search people by name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className={styles.modalResults}>
          {loading && <p className={styles.threadStatus}>Searching…</p>}
          {!loading && query && results.length === 0 && (
            <p className={styles.threadStatus}>No matches.</p>
          )}
          <ul className={styles.userList}>
            {results.map((u) => {
              const initials = (u.name || '?')
                .split(' ')
                .map((p) => p[0])
                .filter(Boolean)
                .slice(0, 2)
                .join('')
                .toUpperCase()
              return (
                <li key={u.clerkId}>
                  <button
                    type="button"
                    className={styles.userItem}
                    onClick={() => onStart(u.clerkId)}
                  >
                    <span className={styles.avatar} aria-hidden="true">
                      {u.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={u.avatarUrl} alt="" className={styles.avatarImg} />
                      ) : (
                        <span className={styles.avatarInitials}>{initials || '?'}</span>
                      )}
                    </span>
                    <span className={styles.userName}>{u.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
