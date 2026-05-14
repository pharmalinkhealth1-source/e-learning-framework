'use client'

import styles from './QuestionCard.module.css'

interface QuestionCardProps {
  question: { questionText: string; options: string[]; correctIndex: number }
  questionIndex: number
  selectedAnswer: number | null
  onSelect: (index: number) => void
  showResult?: boolean
}

export function QuestionCard({
  question,
  questionIndex,
  selectedAnswer,
  onSelect,
  showResult = false,
}: QuestionCardProps) {
  return (
    <div className={styles.card}>
      <p className={styles.questionText}>
        <span className={styles.questionNumber}>{questionIndex + 1}.</span>{' '}
        {question.questionText}
      </p>
      <div className={styles.options} role="radiogroup" aria-label={question.questionText}>
        {question.options.map((option, optIndex) => {
          const inputId = `q${questionIndex}-opt${optIndex}`
          const isSelected = selectedAnswer === optIndex
          const isCorrect = optIndex === question.correctIndex
          const isWrong = showResult && isSelected && !isCorrect

          let optionClass = styles.option
          if (showResult) {
            if (isCorrect) optionClass = `${styles.option} ${styles.correct}`
            else if (isWrong) optionClass = `${styles.option} ${styles.wrong}`
          } else if (isSelected) {
            optionClass = `${styles.option} ${styles.selected}`
          }

          return (
            <label key={optIndex} htmlFor={inputId} className={optionClass}>
              <input
                type="radio"
                id={inputId}
                name={`question-${questionIndex}`}
                value={optIndex}
                checked={isSelected}
                onChange={() => onSelect(optIndex)}
                disabled={showResult}
                className={styles.radioInput}
              />
              <span className={styles.optionText}>{option}</span>
              {showResult && isCorrect && (
                <span className={styles.indicator} aria-label="Correct answer">✓</span>
              )}
              {showResult && isWrong && (
                <span className={styles.indicator} aria-label="Wrong answer">✗</span>
              )}
            </label>
          )
        })}
      </div>
    </div>
  )
}
