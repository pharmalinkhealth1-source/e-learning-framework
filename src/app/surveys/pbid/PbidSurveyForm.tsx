'use client'

import { useState, type ReactNode } from 'react'
import styles from './Survey.module.css'

interface Props {
  config: {
    title?: string
    introText?: string
    completionMessage?: string
  }
}

type FormValue = string | string[]
type FormData = Record<string, FormValue>

const Q100_OPTIONS = [
  'Smart phone',
  'Non-smart phone',
  'Tablet',
  'Laptop computer',
  'Desktop computer',
  'Other',
]

const Q101_2_OPTIONS = [
  'I own the device',
  'Family member',
  'Friend',
  'Workplace/business',
  'Other',
]

const Q102_OPTIONS = [
  'Connection problems',
  'Bandwidth issues/slow connection',
  'Training crashed',
  'Log-in problems',
  'Training would not load',
  'Lack of access to internet-enabled device',
  'Unfamiliar with technology/trouble navigating platform',
  'None of these',
]

const Q103_OPTIONS = [
  'Lack of time',
  'Lack of supervisor support',
  'Challenges understanding the training materials',
  'Problems understanding the language',
  'Ability to get questions answered',
  'Finding a quiet/private space to do training',
  'None of these',
]

const SIGNIFICANCE_OPTIONS = [
  'Very significant',
  'Somewhat significant',
  'Neither significant nor insignificant',
  'Somewhat insignificant',
  'Very insignificant',
]

const Q104_OPTIONS = [
  'Before working hours',
  'During working hours',
  'After working hours',
  'On the weekends',
]

const Q105_OPTIONS = ['At home', 'At work', 'Other']

const Q200_OPTIONS = [
  'Very comprehensive',
  'Somewhat comprehensive',
  'Neither comprehensive nor poorly comprehensive',
  'Somewhat poorly comprehensive',
  'Very poorly comprehensive',
]

const Q201_OPTIONS = [
  'Self-guided/self-paced',
  'Flexible schedule',
  'Technical content/format',
  'Done at home/place of my choosing',
  'Time to complete',
  'Could re-watch/reference sections again',
  'Lack of travel',
  'Lack of group discussions',
  'I had time to prepare/research before quizzes or knowledge checks',
  'Using my own computer/device',
  'Data/bandwidth/network requirements',
  'None of these',
  'Other',
]

const Q202_OPTIONS = [
  'Digital training platform hard to navigate',
  'Doing training outside of work hours',
  'Technical content/format',
  'Lack of per diems',
  'No opportunity to network with other providers',
  'Not having a trainer/clinical supervisor present',
  'Lack of travel',
  'Lack of group discussions',
  'No immediate feedback/time answer questions',
  'Using my own computer/device',
  'Data/bandwidth/network requirements',
  'Lack of printed materials/references',
  'None of these',
  'Other',
]

const Q204_OPTIONS = [
  'Live',
  'Self-paced',
  'Combination of live & self-paced',
  'It makes no difference to me',
  "Don't know",
]

const LIKERT_LABELS = [
  'Strongly disagree (1)',
  'Somewhat disagree (2)',
  'Neither (3)',
  'Somewhat agree (4)',
  'Strongly agree (5)',
]

const LIKERT_QUESTIONS: Array<{ letter: string; name: string; text: string }> = [
  { letter: 'a', name: 'q300', text: 'I found it easy to learn what I needed to know from this training' },
  { letter: 'b', name: 'q301', text: 'The digital training was too long' },
  { letter: 'c', name: 'q302', text: 'I had sufficient opportunities to ask questions during the digital training' },
  { letter: 'd', name: 'q303', text: "I was easily able to have concepts I didn't understand clarified during the digital training" },
  { letter: 'e', name: 'q304', text: 'It was difficult to navigate the course or the course features' },
  { letter: 'f', name: 'q305', text: 'The digital format of the training allowed me to learn at my own pace' },
  { letter: 'g', name: 'q306', text: 'I was able to easily watch all of the videos and recordings during the training' },
  { letter: 'h', name: 'q307', text: 'The digital training was just as good as an in-person, classroom-based training' },
  { letter: 'i', name: 'q308', text: 'If I compare this training to previous in-service trainings I completed, I feel I got the same amount of understanding from the material' },
  { letter: 'j', name: 'q309', text: 'I would recommend to other providers that they use an e-learning training course to learn about pharmacy-based immunization' },
  { letter: 'k', name: 'q310', text: 'Digital training was more convenient for me than in-person trainings' },
  { letter: 'l', name: 'q311', text: 'After finishing the digital training, I feel very well prepared to provide immunizations to my clients' },
  { letter: 'm', name: 'q312', text: 'The digital training improved my knowledge of immunizations a great deal' },
  { letter: 'n', name: 'q313', text: 'I think it will be hard to retain all of the information I learned in the digital training' },
  { letter: 'o', name: 'q314', text: 'The quizzes and knowledge checks were too long' },
  { letter: 'p', name: 'q315', text: 'I still had many unanswered questions about pharmacy-based immunization after finishing the digital training' },
]

/**
 * Three-section stepped exit-interview survey form for the Takeda PBID
 * digital training. Manages all answers in a single `formData` object keyed
 * by question id. Handles conditional question visibility, dynamic radio
 * options derived from prior checkbox selections, per-page validation, and
 * submission to `/api/surveys/pbid`.
 */
export default function PbidSurveyForm({ config }: Props) {
  const [formData, setFormData] = useState<FormData>({})
  const [currentPage, setCurrentPage] = useState(0)
  const [errors, setErrors] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const toggleCheckbox = (name: string, value: string) => {
    setFormData((prev) => {
      const current = (prev[name] as string[]) || []
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [name]: next }
    })
  }

  const setRadio = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const setText = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const hasCheckbox = (name: string, value: string): boolean => {
    const vals = (formData[name] as string[]) || []
    return vals.includes(value)
  }

  const getRadio = (name: string): string => {
    const v = formData[name]
    return typeof v === 'string' ? v : ''
  }

  const getText = (name: string): string => {
    const v = formData[name]
    return typeof v === 'string' ? v : ''
  }

  // Conditional visibility flags
  const showQ101 = ((formData['q100'] as string[]) || []).length >= 2
  const showQ101_2 = getRadio('q101') === 'Non-smart phone'
  const showQ102_2 = (() => {
    const vals = (formData['q102'] as string[]) || []
    return vals.length > 0 && !(vals.length === 1 && vals[0] === 'None of these')
  })()
  const showQ103_2 = (() => {
    const vals = (formData['q103'] as string[]) || []
    return vals.length > 0 && !(vals.length === 1 && vals[0] === 'None of these')
  })()
  const showQ105_2 = getRadio('q105') === 'Other'
  const showQ201_1 = hasCheckbox('q201', 'Other')
  const showQ201_2 = (() => {
    const vals = (formData['q201'] as string[]) || []
    const without13 = vals.filter((v) => v !== 'None of these')
    return without13.length >= 2
  })()
  const showQ203_1 = hasCheckbox('q202', 'Other')
  const showQ203_2 = (() => {
    const vals = (formData['q202'] as string[]) || []
    const without13 = vals.filter((v) => v !== 'None of these')
    return without13.length >= 2
  })()

  const validatePage = (page: number): string[] => {
    const errs: string[] = []
    if (page === 0) {
      if (((formData['q100'] as string[]) || []).length < 1) errs.push('Q100: Select at least one device.')
      if (showQ101 && !getRadio('q101')) errs.push('Q101: Select your most-used device.')
      if (((formData['q102'] as string[]) || []).length < 1) errs.push('Q102: Select at least one option.')
      if (showQ102_2 && !getRadio('q102-2')) errs.push('Q102 follow-up: Rate the significance of technical challenges.')
      if (((formData['q103'] as string[]) || []).length < 1) errs.push('Q103: Select at least one option.')
      if (showQ103_2 && !getRadio('q103-2')) errs.push('Q103 follow-up: Rate the significance of logistical challenges.')
      if (!getRadio('q104')) errs.push('Q104: Select when you did most of the training.')
      if (!getRadio('q105')) errs.push('Q105: Select where you did most of the training.')
      if (showQ105_2 && !getText('q105-2').trim()) errs.push('Q105: Please specify the other location.')
    } else if (page === 1) {
      if (!getRadio('q200')) errs.push('Q200: Rate how comprehensive the training was.')
      if (((formData['q201'] as string[]) || []).length < 1) errs.push('Q201: Select at least one option.')
      if (showQ201_2 && !getRadio('q201-2-radio')) errs.push('Q201 follow-up: Choose what you liked most.')
      if (((formData['q202'] as string[]) || []).length < 1) errs.push('Q202: Select at least one option.')
      if (showQ203_2 && !getRadio('q203-2-radio')) errs.push('Q202 follow-up: Choose what you disliked most.')
      if (!getRadio('q204')) errs.push('Q204: Select your training format preference.')
    } else if (page === 2) {
      for (const q of LIKERT_QUESTIONS) {
        if (!getRadio(q.name)) errs.push(`${q.letter.toUpperCase()}: Please rate this statement.`)
      }
    }
    return errs
  }

  const handleNext = () => {
    const errs = validatePage(currentPage)
    if (errs.length) {
      setErrors(errs)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setErrors([])
    setCurrentPage((p) => p + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrevious = () => {
    setErrors([])
    setCurrentPage((p) => Math.max(0, p - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    const errs = validatePage(2)
    if (errs.length) {
      setErrors(errs)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setErrors([])
    setSubmitting(true)
    try {
      const res = await fetch('/api/surveys/pbid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: formData }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      setErrors(['Submission failed. Please try again.'])
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className={styles.card}>
        <div className={styles.successBox}>
          <h2 className={styles.title}>Thank you!</h2>
          <p>
            {config.completionMessage ||
              'Your survey has been submitted successfully. We appreciate your feedback.'}
          </p>
        </div>
      </div>
    )
  }

  const renderCheckboxGroup = (name: string, options: string[]) => (
    <div>
      {options.map((opt) => (
        <label key={opt} className={styles.optionItem}>
          <input
            type="checkbox"
            name={name}
            value={opt}
            checked={hasCheckbox(name, opt)}
            onChange={() => toggleCheckbox(name, opt)}
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  )

  const renderRadioGroup = (name: string, options: string[]) => (
    <div>
      {options.map((opt) => (
        <label key={opt} className={styles.optionItem}>
          <input
            type="radio"
            name={name}
            value={opt}
            checked={getRadio(name) === opt}
            onChange={() => setRadio(name, opt)}
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  )

  const renderQuestion = (label: string, body: ReactNode, conditional = false) => (
    <div className={conditional ? styles.conditionalBlock : styles.questionBlock}>
      <label className={styles.questionLabel}>{label}</label>
      {body}
    </div>
  )

  // Derived dynamic option sets
  const q101Options = (formData['q100'] as string[]) || []
  const q201_2Options = ((formData['q201'] as string[]) || []).filter(
    (v) => v !== 'None of these' && v !== 'Other'
  )
  const q203_2Options = ((formData['q202'] as string[]) || []).filter(
    (v) => v !== 'None of these' && v !== 'Other'
  )

  const progressPct = ((currentPage + 1) / 3) * 100

  return (
    <div className={styles.card}>
      {config.title && <h1 className={styles.title}>{config.title}</h1>}
      {config.introText && (
        <p style={{ color: '#220a47', whiteSpace: 'pre-wrap' }}>{config.introText}</p>
      )}

      <div className={styles.progressBar} aria-hidden="true">
        <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
      </div>
      <p style={{ fontSize: '0.85rem', color: '#555', marginTop: 0 }}>
        Section {currentPage + 1} of 3
      </p>

      {errors.length > 0 && (
        <div className={styles.errorBox} role="alert">
          <strong>Please complete the following before continuing:</strong>
          <ul style={{ margin: '8px 0 0 18px' }}>
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {currentPage === 0 && (
        <section>
          <h2 className={styles.sectionHeader}>Section 1: Training Logistics</h2>

          {renderQuestion(
            'Q100. What device(s) did you use to complete the digital training modules? (Select all that apply)',
            renderCheckboxGroup('q100', Q100_OPTIONS)
          )}

          {showQ101 &&
            renderQuestion(
              'Q101. Which of these devices did you use most frequently for the digital training? (Restricted to selections from the previous question)',
              renderRadioGroup('q101', q101Options),
              true
            )}

          {showQ101_2 &&
            renderQuestion(
              'Q101a. Who owns this device?',
              renderRadioGroup('q101-2', Q101_2_OPTIONS),
              true
            )}

          {renderQuestion(
            'Q102. Did you experience any of the following technical challenges? (Select all that apply)',
            renderCheckboxGroup('q102', Q102_OPTIONS)
          )}

          {showQ102_2 &&
            renderQuestion(
              'Q102a. How significant of a barrier were technical challenges to your completing the eLearning training in a timely manner?',
              renderRadioGroup('q102-2', SIGNIFICANCE_OPTIONS),
              true
            )}

          {renderQuestion(
            'Q103. Did you experience any of the following logistical or contextual challenges? (Select all that apply)',
            renderCheckboxGroup('q103', Q103_OPTIONS)
          )}

          {showQ103_2 &&
            renderQuestion(
              'Q103a. How significant of a barrier were logistical or contextual challenges to your completing the digital training in a timely manner?',
              renderRadioGroup('q103-2', SIGNIFICANCE_OPTIONS),
              true
            )}

          {renderQuestion(
            'Q104. When did you do most of the training modules?',
            renderRadioGroup('q104', Q104_OPTIONS)
          )}

          {renderQuestion(
            'Q105. Where did you do most of the training modules?',
            renderRadioGroup('q105', Q105_OPTIONS)
          )}

          {showQ105_2 &&
            renderQuestion(
              'Q105a. If other, specify',
              <input
                type="text"
                className={styles.textInput}
                value={getText('q105-2')}
                onChange={(e) => setText('q105-2', e.target.value)}
              />,
              true
            )}
        </section>
      )}

      {currentPage === 1 && (
        <section>
          <h2 className={styles.sectionHeader}>Section 2: Training Experience</h2>

          {renderQuestion(
            'Q200. Overall, how comprehensive did you think that the digital training for pharmacy-based immunization was?',
            renderRadioGroup('q200', Q200_OPTIONS)
          )}

          {renderQuestion(
            'Q201. What did you like about the training? (Select all that apply)',
            renderCheckboxGroup('q201', Q201_OPTIONS)
          )}

          {showQ201_1 &&
            renderQuestion(
              'Q201a. If other, please specify',
              <input
                type="text"
                className={styles.textInput}
                value={getText('q201-1')}
                onChange={(e) => setText('q201-1', e.target.value)}
              />,
              true
            )}

          {showQ201_2 &&
            renderQuestion(
              'Q201b. Of everything you liked about the training, what did you like MOST? (Restricted to your selections from the question above)',
              renderRadioGroup('q201-2-radio', q201_2Options),
              true
            )}

          {renderQuestion(
            'Q202. What did you dislike about the training? (Select all that apply)',
            renderCheckboxGroup('q202', Q202_OPTIONS)
          )}

          {showQ203_1 &&
            renderQuestion(
              'Q203a. If other, please specify',
              <input
                type="text"
                className={styles.textInput}
                value={getText('q203-1')}
                onChange={(e) => setText('q203-1', e.target.value)}
              />,
              true
            )}

          {showQ203_2 &&
            renderQuestion(
              'Q203b. Of all the things you disliked about the training, what did you dislike the MOST? (Restricted to your selections from the question above)',
              renderRadioGroup('q203-2-radio', q203_2Options),
              true
            )}

          {renderQuestion(
            'Q204. Would you prefer a digital training that is live or one that is self-paced, or some combination?',
            renderRadioGroup('q204', Q204_OPTIONS)
          )}
        </section>
      )}

      {currentPage === 2 && (
        <section>
          <h2 className={styles.sectionHeader}>Section 3: Training Evaluation</h2>
          <p style={{ color: '#220a47' }}>
            On a scale from 1-5 (1 being &lsquo;Strongly Disagree&rsquo; and 5 being &lsquo;Strongly
            Agree&rsquo;) indicate how much you agree with each of the following statements:
          </p>

          <div className={styles.likertHeader}>
            <div className={styles.likertQ}>Statement</div>
            <div className={styles.likertOptions}>
              {LIKERT_LABELS.map((lbl) => (
                <div key={lbl} className={styles.likertCell} style={{ cursor: 'default' }}>
                  {lbl}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.likertTable}>
            {LIKERT_QUESTIONS.map((q) => (
              <div key={q.name} className={styles.likertRow}>
                <div className={styles.likertQ}>
                  {q.letter}. {q.text}
                </div>
                <div className={styles.likertOptions}>
                  {[1, 2, 3, 4, 5].map((n) => {
                    const val = String(n)
                    const checked = getRadio(q.name) === val
                    return (
                      <div
                        key={n}
                        className={styles.likertCell}
                        onClick={() => setRadio(q.name, val)}
                        role="radio"
                        aria-checked={checked}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault()
                            setRadio(q.name, val)
                          }
                        }}
                      >
                        <input
                          type="radio"
                          name={q.name}
                          value={val}
                          checked={checked}
                          onChange={() => setRadio(q.name, val)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span>{n}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className={styles.navFooter}>
        <button
          type="button"
          className={`${styles.btnSecondary} ${currentPage === 0 ? styles.btnDisabled : ''}`}
          onClick={handlePrevious}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        {currentPage < 2 ? (
          <button type="button" className={styles.btnPrimary} onClick={handleNext}>
            Next
          </button>
        ) : (
          <button
            type="button"
            className={`${styles.btnSubmit} ${submitting ? styles.btnDisabled : ''}`}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting…' : 'Submit Survey'}
          </button>
        )}
      </div>
    </div>
  )
}
