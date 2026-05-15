import { auth } from '@clerk/nextjs/server'
import { client } from '@/sanity/lib/client'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'
import type { Assignment, LmsRole, Submission } from '@/types/lms'

interface EnrollmentRef {
  courseId: string
  course: { title?: string } | null
}

interface AssignmentWithCourse extends Assignment {
  courseTitle?: string
}

export default async function AssignmentsPage() {
  const { userId, sessionClaims } = await auth()
  if (!userId) redirect('/sign-in')

  const metadata = sessionClaims?.metadata as Record<string, unknown> | undefined
  const role = metadata?.role as LmsRole | undefined

  if (role && role !== 'learner') {
    redirect('/elearning/dashboard')
  }

  // Get courses the student is enrolled in
  const enrollments = await client.fetch<EnrollmentRef[]>(
    `*[_type == "enrollment" && userId == $userId] {
      courseId,
      "course": *[_type == "course" && _id == ^.courseId][0] { title }
    }`,
    { userId }
  )

  const courseIds = enrollments.map((e) => e.courseId)
  const courseTitleMap = new Map<string, string>()
  for (const e of enrollments) {
    if (e.course?.title) courseTitleMap.set(e.courseId, e.course.title)
  }

  // Get assignments for those courses
  const assignments =
    courseIds.length === 0
      ? []
      : await client.fetch<AssignmentWithCourse[]>(
          `*[_type == "assignment" && courseId in $courseIds] | order(dueDate asc) {
            _id, title, description, courseId, dueDate, submissionType, maxScore, createdBy, createdAt
          }`,
          { courseIds }
        )

  // Get this student's submissions for these assignments
  const assignmentIds = assignments.map((a) => a._id)
  const submissions =
    assignmentIds.length === 0
      ? []
      : await client.fetch<Submission[]>(
          `*[_type == "submission" && studentId == $userId && assignmentId in $assignmentIds] {
            _id, assignmentId, status, grade, submittedAt
          }`,
          { userId, assignmentIds }
        )

  const submissionByAssignment = new Map<string, Submission>()
  for (const s of submissions) submissionByAssignment.set(s.assignmentId, s)

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString() : '—'

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Assignments</h1>
          <Link href="/elearning/my-learning" className={styles.browseLink}>
            My Learning →
          </Link>
        </header>

        {assignments.length === 0 ? (
          <p className={styles.emptyState}>
            You have no assignments yet. Enroll in a course to see assignments here.
          </p>
        ) : (
          <section className={styles.section}>
            <div className={styles.assignmentGrid}>
              {assignments.map((a) => {
                const sub = submissionByAssignment.get(a._id)
                const statusLabel = sub
                  ? sub.status === 'graded'
                    ? `Graded${typeof sub.grade === 'number' ? ` (${sub.grade}/${a.maxScore})` : ''}`
                    : sub.status === 'returned'
                      ? 'Returned'
                      : 'Submitted — Pending'
                  : 'Not submitted'
                const statusClass = sub
                  ? sub.status === 'graded'
                    ? styles.statusGraded
                    : sub.status === 'returned'
                      ? styles.statusReturned
                      : styles.statusPending
                  : styles.statusNotSubmitted

                return (
                  <Link
                    key={a._id}
                    href={`/elearning/assignments/${a._id}`}
                    className={styles.assignmentCard}
                  >
                    <h2 className={styles.assignmentTitle}>{a.title}</h2>
                    <p className={styles.assignmentCourse}>
                      {courseTitleMap.get(a.courseId) ?? a.courseId}
                    </p>
                    <dl className={styles.metaList}>
                      <div className={styles.metaItem}>
                        <dt>Due</dt>
                        <dd>{formatDate(a.dueDate)}</dd>
                      </div>
                      <div className={styles.metaItem}>
                        <dt>Type</dt>
                        <dd>{a.submissionType}</dd>
                      </div>
                      <div className={styles.metaItem}>
                        <dt>Max</dt>
                        <dd>{a.maxScore}</dd>
                      </div>
                    </dl>
                    <span className={`${styles.statusBadge} ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
