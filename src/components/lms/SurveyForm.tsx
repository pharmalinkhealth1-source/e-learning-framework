'use client'

import { useState } from 'react'
import styles from './SurveyForm.module.css'

interface SurveyFormProps {
  courseId: string
}

export function SurveyForm({ courseId }: SurveyFormProps) {
  const [csat, setCsat] = useState<number | null>(null)
  const [nps, setNps] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (csat === null || nps === null) return
    setLoading(true)
    setError(null)

    const res = await fetch('/api/lms/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, csatScore: csat, npsScore: nps, comment }),
    })

    if (res.ok || res.status === 409) {
      setSubmitted(true)
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Submission failed')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className={styles.thanks} role="status">
        <p>Thanks for your feedback!</p>
      </div>
    )
  }

  return (
    <form className={styles.surveyForm} onSubmit={handleSubmit} aria-label="Course feedback">
      <h2 className={styles.heading}>How was this course?</h2>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Overall satisfaction (1 = poor, 5 = excellent)</legend>
        <div className={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map(n => (
            <label key={n} className={`${styles.ratingLabel} ${csat === n ? styles.selected : ''}`}>
              <input
                type="radio"
                name="csat"
                value={n}
                checked={csat === n}
                onChange={() => setCsat(n)}
                className={styles.radioInput}
              />
              {n}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>How likely are you to recommend this course? (0 = not likely, 10 = very likely)</legend>
        <div className={styles.npsRow}>
          {Array.from({ length: 11 }, (_, i) => i).map(n => (
            <label key={n} className={`${styles.npsLabel} ${nps === n ? styles.selected : ''}`}>
              <input
                type="radio"
                name="nps"
                value={n}
                checked={nps === n}
                onChange={() => setNps(n)}
                className={styles.radioInput}
              />
              {n}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.fieldset}>
        <label className={styles.legend} htmlFor="survey-comment">
          Additional comments (optional)
        </label>
        <textarea
          id="survey-comment"
          className={styles.textarea}
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
          maxLength={1000}
        />
      </div>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={csat === null || nps === null || loading}
      >
        {loading ? 'Submitting…' : 'Submit feedback'}
      </button>
    </form>
  )
}
