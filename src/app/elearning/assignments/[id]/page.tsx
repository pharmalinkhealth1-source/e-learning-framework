import { auth } from '@clerk/nextjs/server'
import { client } from '@/sanity/lib/client'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'
import { SubmissionForm } from './SubmissionForm'
import type { Assignment, LmsRole, Submission } from '@/types/lms'

export default async function AssignmentDetailPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>
}) {
  const { userId, sessionClaims } = await auth()
  if (!userId) redirect('/sign-in')

  const metadata = sessionClaims?.metadata as Record<string, unknown> | undefined
  const role = metadata?.role as LmsRole | undefined

  const resolvedParams = await Promise.resolve(params)
  const { id } = resolvedParams

  const assignment = await client.fetch<Assignment | null>(
    `*[_type == "assignment" && _id == $id][0] {
      _id, title, description, courseId, dueDate, submissionType, maxScore, createdBy, createdAt
    }`,
    { id }
  )

  if (!assignment) notFound()

  const [course, existingSubmission] = await Promise.all([
    client.fetch<{ title?: string } | null>(
      `*[_type == "course" && _id == $courseId][0] { title }`,
      { courseId: assignment.courseId }
    ),
    client.fetch<Submission | null>(
      `*[_type == "submission" && assignmentId == $id && studentId == $userId] | order(submittedAt desc) [0] {
        _id, assignmentId, studentId, studentName, courseId, submittedAt,
        textContent, fileUrl, linkUrl, status, grade, feedback, gradedBy, gradedAt
      }`,
      { id, userId }
    ),
  ])

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleString() : '—'

  const showForm = role === 'learner' || role === undefined

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/elearning/assignments" className={styles.backLink}>
            ← Back to assignments
          </Link>
          <h1 className={styles.pageTitle}>{assignment.title}</h1>
          <p className={styles.subtitle}>
            {course?.title ?? assignment.courseId}
          </p>
        </header>

        <section className={styles.section}>
          <dl className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <dt>Due</dt>
              <dd>{formatDate(assignment.dueDate)}</dd>
            </div>
            <div className={styles.metaItem}>
              <dt>Submission type</dt>
              <dd>{assignment.submissionType}</dd>
            </div>
            <div className={styles.metaItem}>
              <dt>Max score</dt>
              <dd>{assignment.maxScore}</dd>
            </div>
          </dl>

          {assignment.description && (
            <div className={styles.description}>
              <h2 className={styles.sectionTitle}>Instructions</h2>
              <p>{assignment.description}</p>
            </div>
          )}
        </section>

        {existingSubmission ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Submission</h2>
            <div className={styles.submissionCard}>
              <div className={styles.submissionMeta}>
                <span className={`${styles.statusBadge} ${styles[`status_${existingSubmission.status}`]}`}>
                  {existingSubmission.status}
                </span>
                <time className={styles.submittedAt}>
                  Submitted {formatDate(existingSubmission.submittedAt)}
                </time>
              </div>

              {existingSubmission.textContent && (
                <div className={styles.submissionContent}>
                  <h3>Response</h3>
                  <p>{existingSubmission.textContent}</p>
                </div>
              )}
              {existingSubmission.linkUrl && (
                <p>
                  <strong>Link:</strong>{' '}
                  <a href={existingSubmission.linkUrl} target="_blank" rel="noreferrer">
                    {existingSubmission.linkUrl}
                  </a>
                </p>
              )}
              {existingSubmission.fileUrl && (
                <p>
                  <strong>File:</strong>{' '}
                  <a href={existingSubmission.fileUrl} target="_blank" rel="noreferrer">
                    {existingSubmission.fileUrl}
                  </a>
                </p>
              )}

              {existingSubmission.status === 'graded' && (
                <div className={styles.gradeBlock}>
                  <p className={styles.gradeValue}>
                    Grade: <strong>{existingSubmission.grade ?? '—'} / {assignment.maxScore}</strong>
                  </p>
                  {existingSubmission.feedback && (
                    <div className={styles.feedbackBlock}>
                      <h3>Feedback</h3>
                      <p>{existingSubmission.feedback}</p>
                    </div>
                  )}
                </div>
              )}

              {existingSubmission.status === 'returned' && (
                <p className={styles.hint}>
                  Your submission was returned. You may submit again below.
                </p>
              )}
            </div>
          </section>
        ) : null}

        {showForm && (!existingSubmission || existingSubmission.status === 'returned') && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {existingSubmission ? 'Re-submit' : 'Submit your work'}
            </h2>
            <SubmissionForm
              assignmentId={assignment._id}
              courseId={assignment.courseId}
              submissionType={assignment.submissionType}
            />
          </section>
        )}
      </div>
    </main>
  )
}
