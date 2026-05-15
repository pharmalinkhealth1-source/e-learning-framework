import { auth } from '@clerk/nextjs/server'
import { client } from '@/sanity/lib/client'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'
import { CreateAssignmentForm } from './CreateAssignmentForm'
import { GradeSubmissionRow } from './GradeSubmissionRow'
import type { Assignment, LmsRole, Submission } from '@/types/lms'

interface CourseOption {
  _id: string
  title: string
}

const TEACHER_ROLES: LmsRole[] = ['program_manager', 'system_admin']

export default async function ManageAssignmentsPage() {
  const { userId, sessionClaims } = await auth()
  if (!userId) redirect('/sign-in')

  const metadata = sessionClaims?.metadata as Record<string, unknown> | undefined
  const role = metadata?.role as LmsRole | undefined

  if (!role || !TEACHER_ROLES.includes(role)) {
    redirect('/elearning')
  }

  const courses = await client.fetch<CourseOption[]>(
    `*[_type == "course"] | order(title asc) { _id, title }`
  )

  // All assignments (most recent first)
  const assignments = await client.fetch<Assignment[]>(
    `*[_type == "assignment"] | order(createdAt desc) {
      _id, title, description, courseId, dueDate, submissionType, maxScore, createdBy, createdAt
    }`
  )

  // All submissions, most recent first
  const submissions = await client.fetch<Submission[]>(
    `*[_type == "submission"] | order(submittedAt desc) {
      _id, assignmentId, studentId, studentName, courseId, submittedAt,
      textContent, fileUrl, linkUrl, status, grade, feedback, gradedBy, gradedAt
    }`
  )

  const assignmentById = new Map<string, Assignment>()
  for (const a of assignments) assignmentById.set(a._id, a)

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Manage Assignments</h1>
          <Link href="/elearning/assignments" className={styles.browseLink}>
            View as student →
          </Link>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Create Assignment</h2>
          <CreateAssignmentForm courses={courses} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Submissions to Grade</h2>
          {submissions.length === 0 ? (
            <p className={styles.emptyState}>No submissions yet.</p>
          ) : (
            <div className={styles.submissionList}>
              {submissions.map((s) => {
                const assignment = assignmentById.get(s.assignmentId)
                return (
                  <GradeSubmissionRow
                    key={s._id}
                    submission={s}
                    assignmentTitle={assignment?.title ?? s.assignmentId}
                    maxScore={assignment?.maxScore ?? 100}
                  />
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
