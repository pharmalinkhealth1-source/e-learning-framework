'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import type { AssignmentSubmissionType } from '@/types/lms'

interface Props {
  assignmentId: string
  courseId: string
  submissionType: AssignmentSubmissionType
}

export function SubmissionForm({ assignmentId, courseId, submissionType }: Props) {
  const router = useRouter()
  const [textContent, setTextContent] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const payload: Record<string, unknown> = { assignmentId, courseId }
      if (submissionType === 'text') payload.textContent = textContent
      else if (submissionType === 'url') payload.linkUrl = linkUrl
      else if (submissionType === 'file') payload.fileUrl = fileUrl

      const res = await fetch('/api/lms/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? 'Failed to submit')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {submissionType === 'text' && (
        <label className={styles.fieldLabel}>
          <span>Your response</span>
          <textarea
            className={styles.textarea}
            rows={8}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            required
            placeholder="Write your response here…"
          />
        </label>
      )}
      {submissionType === 'url' && (
        <label className={styles.fieldLabel}>
          <span>Link URL</span>
          <input
            type="url"
            className={styles.input}
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            required
            placeholder="https://"
          />
        </label>
      )}
      {submissionType === 'file' && (
        <label className={styles.fieldLabel}>
          <span>File URL</span>
          <input
            type="url"
            className={styles.input}
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            required
            placeholder="https://… (paste a hosted file URL)"
          />
          <small className={styles.hint}>
            Direct file upload requires storage integration (not yet configured). Paste a hosted file URL for now.
          </small>
        </label>
      )}
      {error && <p className={styles.errorMessage}>{error}</p>}
      <button type="submit" className={styles.submitBtn} disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit'}
      </button>
    </form>
  )
}
