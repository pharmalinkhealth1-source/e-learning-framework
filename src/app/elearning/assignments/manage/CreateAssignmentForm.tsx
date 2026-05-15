'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import type { AssignmentSubmissionType } from '@/types/lms'

interface CourseOption {
  _id: string
  title: string
}

interface Props {
  courses: CourseOption[]
}

export function CreateAssignmentForm({ courses }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [courseId, setCourseId] = useState(courses[0]?._id ?? '')
  const [dueDate, setDueDate] = useState('')
  const [submissionType, setSubmissionType] = useState<AssignmentSubmissionType>('text')
  const [maxScore, setMaxScore] = useState<number>(100)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSubmitting(true)
    try {
      const res = await fetch('/api/lms/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          courseId,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          submissionType,
          maxScore,
        }),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? 'Failed to create assignment')
      }

      setTitle('')
      setDescription('')
      setDueDate('')
      setSubmissionType('text')
      setMaxScore(100)
      setSuccess(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create assignment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.fieldLabel}>
        <span>Title</span>
        <input
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      <label className={styles.fieldLabel}>
        <span>Description</span>
        <textarea
          className={styles.textarea}
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label className={styles.fieldLabel}>
        <span>Course</span>
        <select
          className={styles.input}
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        >
          {courses.length === 0 ? (
            <option value="">No courses available</option>
          ) : (
            courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))
          )}
        </select>
      </label>

      <div className={styles.fieldRow}>
        <label className={styles.fieldLabel}>
          <span>Due date</span>
          <input
            type="datetime-local"
            className={styles.input}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>

        <label className={styles.fieldLabel}>
          <span>Submission type</span>
          <select
            className={styles.input}
            value={submissionType}
            onChange={(e) => setSubmissionType(e.target.value as AssignmentSubmissionType)}
            required
          >
            <option value="text">Text</option>
            <option value="url">URL</option>
            <option value="file">File</option>
          </select>
        </label>

        <label className={styles.fieldLabel}>
          <span>Max score</span>
          <input
            type="number"
            min={0}
            className={styles.input}
            value={maxScore}
            onChange={(e) => setMaxScore(Number(e.target.value))}
            required
          />
        </label>
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}
      {success && <p className={styles.successMessage}>Assignment created.</p>}

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={submitting || !courseId}
      >
        {submitting ? 'Creating…' : 'Create Assignment'}
      </button>
    </form>
  )
}
