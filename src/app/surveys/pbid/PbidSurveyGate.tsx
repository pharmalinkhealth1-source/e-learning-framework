'use client'

import { useState, useSyncExternalStore, type FormEvent } from 'react'
import styles from './Survey.module.css'

interface Props {
  children: React.ReactNode
  requiresCode: boolean
}

/**
 * Client-side passcode gate for the PBID survey. When `requiresCode` is true,
 * users must enter a valid access code (verified against `PBID_SURVEY_CODE`
 * via `/api/surveys/pbid/auth`). Successful auth is persisted in
 * `localStorage` under the key `pbid_auth` so users only see the gate once
 * per browser.
 */
// useSyncExternalStore subscribers for the persisted auth flag. The
// subscribe function is a no-op because the value only changes via this
// component's own setter (which calls setAuthedOverride below).
const SSR_SENTINEL = '__ssr__'
const subscribeLocal = () => () => {}
const getAuthSnapshot = (): string => {
  if (typeof window === 'undefined') return SSR_SENTINEL
  return window.localStorage.getItem('pbid_auth') ?? ''
}
const getAuthServerSnapshot = (): string => SSR_SENTINEL

export default function PbidSurveyGate({ children, requiresCode }: Props) {
  // Reads localStorage in a hydration-safe way: returns null on the server and
  // during the first client render, then the real value afterwards.
  const stored = useSyncExternalStore(subscribeLocal, getAuthSnapshot, getAuthServerSnapshot)
  const [authedOverride, setAuthedOverride] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!requiresCode) return <>{children}</>
  if (stored === SSR_SENTINEL && !authedOverride) {
    // Server render / pre-hydration — render nothing to avoid a flash of the
    // gate before localStorage is available.
    return null
  }
  if (stored === 'true' || authedOverride) return <>{children}</>

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/surveys/pbid/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      })
      if (res.ok) {
        window.localStorage.setItem('pbid_auth', 'true')
        setAuthedOverride(true)
      } else {
        setError('Incorrect code. Please try again.')
      }
    } catch {
      setError('Incorrect code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.gateBox}>
      <h2 className={styles.title}>Access Survey</h2>
      <p style={{ color: '#220a47' }}>
        Enter the access code provided by your training coordinator.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.codeInput}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          autoFocus
          aria-label="Access code"
        />
        {error && <div className={styles.errorBox}>{error}</div>}
        <button
          type="submit"
          className={`${styles.btnPrimary} ${loading ? styles.btnDisabled : ''}`}
          disabled={loading}
        >
          {loading ? 'Checking…' : 'Enter'}
        </button>
      </form>
    </div>
  )
}
