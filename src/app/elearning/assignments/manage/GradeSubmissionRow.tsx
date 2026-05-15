'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import type { Submission, SubmissionStatus } from '@/types/lms'

interface Props {
  submission: Submission
  assignmentTitle: string
  maxScore: number
}

export function GradeSubmissionRow({ submission, assignmentTitle, maxScore }: Props) {
  const router = useRouter()
  const [grade, setGrade] = useState<number | ''>(
    typeof submission.grade === 'number' ? submission.grade : ''
  )
  const [feedback, setFeedback] = useState(submission.feedback ?? '')
  const [status, setStatus] = useState<SubmissionStatus>(submission.status)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  async function handleSave() {
    setError(null)
    setSavedAt(null)
    setSaving(true)
    try {
      const res = await fetch(`/api/lms/submissions/${submission._id}/grade`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: grade === '' ? undefined : Number(grade),
          feedback,
          status,
        }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? 'Failed to save grade')
      }
      setSavedAt(new Date().toLocaleTimeString())
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save grade')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.submissionRow}>
      <div className={styles.submissionHeader}>
        <div>
          <p className={styles.submissionStudent}>
            {submission.studentName ?? submission.studentId}
          </p>
          <p className={styles.submissionAssignment}>{assignmentTitle}</p>
        </div>
        <time className={styles.submissionTime}>
          Submitted {new Date(submission.submittedAt).toLocaleString()}
        </time>
      </div>

      {submission.textContent && (
        <div className={styles.submissionPreview}>
          <p>{submission.textContent}</p>
        </div>
      )}
      {submission.linkUrl && (
        <p className={styles.submissionPreview}>
          <strong>Link:</strong>{' '}
          <a href={submission.linkUrl} target="_blank" rel="noreferrer">
            {submission.linkUrl}
          </a>
        </p>
      )}
      {submission.fileUrl && (
        <p className={styles.submissionPreview}>
          <strong>File:</strong>{' '}
          <a href={submission.fileUrl} target="_blank" rel="noreferrer">
            {submission.fileUrl}
          </a>
        </p>
      )}

      <div className={styles.gradeRow}>
        <label className={styles.fieldLabel}>
          <span>Grade (0-{maxScore})</span>
          <input
            type="number"
            min={0}
            max={maxScore}
            className={styles.input}
            value={grade}
            onChange={(e) => {
              const v = e.target.value
              setGrade(v === '' ? '' : Number(v))
            }}
          />
        </label>

        <label className={styles.fieldLabel}>
          <span>Status</span>
          <select
            className={styles.input}
            value={status}
            onChange={(e) => setStatus(e.target.value as SubmissionStatus)}
          >
            <option value="pending">Pending</option>
            <option value="graded">Graded</option>
            <option value="returned">Returned</option>
          </select>
        </label>
      </div>

      <label className={styles.fieldLabel}>
        <span>Feedback</span>
        <textarea
          className={styles.textarea}
          rows={3}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Optional feedback for the student"
        />
      </label>

      {error && <p className={styles.errorMessage}>{error}</p>}
      {savedAt && <p className={styles.successMessage}>Saved at {savedAt}.</p>}

      <button
        type="button"
        className={styles.submitBtn}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Saving…' : 'Save grade'}
      </button>
    </div>
  )
}
