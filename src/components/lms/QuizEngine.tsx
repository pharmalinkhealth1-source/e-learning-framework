'use client'

import { useState } from 'react'
import { QuestionCard } from './QuestionCard'
import styles from './QuizEngine.module.css'

interface Question {
  questionText: string
  options: string[]
  correctIndex: number
}

interface QuizEngineProps {
  questions: Question[]
  quizRole: 'pre-test' | 'post-test' | 'self-assessment'
  lessonId: string
  courseId: string
  onComplete: (result: { score: number; tier: 'participation' | 'accomplishment' | null }) => void
}

interface SubmitResult {
  score: number
  passed: boolean
  tier: 'participation' | 'accomplishment' | null
}

export function QuizEngine({ questions, quizRole, lessonId, courseId, onComplete }: QuizEngineProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(questions.length).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<SubmitResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const allAnswered = answers.every((a) => a !== null)

  function handleSelect(questionIndex: number, optionIndex: number) {
    if (submitted) return
    setAnswers((prev) => {
      const next = [...prev]
      next[questionIndex] = optionIndex
      return next
    })
  }

  async function handleSubmit() {
    if (!allAnswered || submitting) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/lms/quiz-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, lessonId, answers, quizRole }),
      })

      if (!res.ok) throw new Error('Submission failed')

      const data: SubmitResult = await res.json()
      setResult(data)
      setSubmitted(true)
      onComplete({ score: data.score, tier: data.tier })
    } catch {
      setError('Failed to submit quiz. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function getRoleMessage(): string {
    if (!result) return ''
    const fraction = `${Math.round((result.score / 100) * questions.length)}/${questions.length}`
    switch (quizRole) {
      case 'pre-test':
        return `You scored ${result.score}% (${fraction}). Continue to start the course.`
      case 'post-test':
        return result.passed
          ? `You scored ${result.score}% — you have earned a Certificate of Accomplishment.`
          : `You scored ${result.score}% — you have earned a Certificate of Participation.`
      case 'self-assessment':
        return `You scored ${result.score}% (${fraction}). This is for your personal reference only.`
    }
  }

  return (
    <div className={styles.engine}>
      <div className={styles.header}>
        <span className={styles.roleBadge}>
          {quizRole === 'pre-test' ? 'Pre-Test' : quizRole === 'post-test' ? 'Post-Test' : 'Self-Assessment'}
        </span>
        <span className={styles.progress}>{questions.length} questions</span>
      </div>

      <div className={styles.questions}>
        {questions.map((q, i) => (
          <QuestionCard
            key={i}
            question={q}
            questionIndex={i}
            selectedAnswer={answers[i] ?? null}
            onSelect={(optIdx) => handleSelect(i, optIdx)}
            showResult={submitted}
          />
        ))}
      </div>

      {!submitted && (
        <div className={styles.submitArea}>
          {error && <p className={styles.error}>{error}</p>}
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
          >
            {submitting ? 'Submitting…' : 'Submit Quiz'}
          </button>
          {!allAnswered && (
            <p className={styles.hint}>Answer all questions to submit.</p>
          )}
        </div>
      )}

      {submitted && result && (
        <div className={styles.resultPanel}>
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreNumber}>{result.score}%</span>
            <span className={styles.scoreLabel}>Score</span>
          </div>
          <p className={styles.resultMessage}>{getRoleMessage()}</p>
          {quizRole === 'post-test' && result.tier && (
            <span className={`${styles.tierBadge} ${styles[result.tier]}`}>
              {result.tier === 'accomplishment'
                ? 'Certificate of Accomplishment'
                : 'Certificate of Participation'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
