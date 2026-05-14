import { auth } from '@clerk/nextjs/server'
import { client } from '@/sanity/lib/client'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { NotificationFeed } from '@/components/lms/NotificationFeed'
import styles from './page.module.css'

interface CourseRef {
  _id: string
  title: string
  slug: { current: string }
  passingScore: number
  totalLessons: number
}

interface Enrollment {
  _id: string
  courseId: string
  enrolledAt: string
  course: CourseRef | null
}

interface Certificate {
  _id: string
  courseId: string
  tier: 'participation' | 'accomplishment'
  issuedAt: string
  expiresAt: string
  blobUrl: string
  courseName: string
}

interface Notification {
  _id: string
  type: string
  message: string
  read: boolean
  createdAt: string
}

export default async function MyLearningPage() {
  const { userId, sessionClaims } = await auth()

  if (!userId) redirect('/sign-in')

  const metadata = sessionClaims?.metadata as Record<string, unknown> | undefined
  const role = metadata?.role as string | undefined

  if (role && role !== 'learner') {
    redirect('/elearning/dashboard')
  }

  const completedLessons = (metadata?.completedLessons as string[] | undefined) ?? []

  const enrollments = await client.fetch<Enrollment[]>(
    `*[_type == "enrollment" && userId == $userId] {
      _id, courseId, enrolledAt,
      "course": *[_type == "course" && _id == ^.courseId][0] {
        _id, title, slug, passingScore,
        "totalLessons": count(modules[]->lessons[])
      }
    }`,
    { userId }
  )

  if (enrollments.length === 0) {
    try {
      await fetch('/api/lms/enroll', { method: 'POST' })
    } catch {
      // Non-fatal if running in SSR context
    }
  }

  const completedCourseIds = new Set<string>()
  for (const e of enrollments) {
    if (!e.course) continue
    const courseTotal = e.course.totalLessons ?? 0
    if (courseTotal > 0 && completedLessons.length >= courseTotal) {
      completedCourseIds.add(e.courseId)
    }
  }

  const certificates = await client.fetch<Certificate[]>(
    `*[_type == "certificate" && clerkUserId == $userId] {
      _id, courseId, tier, issuedAt, expiresAt, blobUrl,
      "courseName": *[_type == "course" && _id == ^.courseId][0].title
    }`,
    { userId }
  )

  const now = new Date()
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000

  const notifications = await client.fetch<Notification[]>(
    `*[_type == "notification" && clerkUserId == $userId] | order(createdAt desc) [0..19] {
      _id, type, message, read, createdAt
    }`,
    { userId }
  )

  const inProgressEnrollments = enrollments.filter(
    (e) => e.course && !completedCourseIds.has(e.courseId)
  )
  const completedEnrollments = enrollments.filter(
    (e) => e.course && completedCourseIds.has(e.courseId)
  )

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>My Learning</h1>
          <Link href="/elearning" className={styles.browseLink}>Browse Courses →</Link>
        </header>

        <NotificationFeed notifications={notifications} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>In Progress</h2>
          {inProgressEnrollments.length === 0 ? (
            <p className={styles.emptyState}>No courses in progress.</p>
          ) : (
            <div className={styles.courseGrid}>
              {inProgressEnrollments.map((e) => {
                if (!e.course) return null
                const total = e.course.totalLessons ?? 0
                const done = completedLessons.filter((id) =>
                  id.startsWith(e.courseId.slice(-8))
                ).length
                const pct = total > 0 ? Math.round((done / total) * 100) : 0
                return (
                  <div key={e._id} className={styles.courseCard}>
                    <h3 className={styles.courseCardTitle}>{e.course.title}</h3>
                    <div
                      className={styles.progressBar}
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${pct}% complete`}
                    >
                      <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                    </div>
                    <p className={styles.progressLabel}>{pct}% complete</p>
                    <Link
                      href={`/elearning/courses/${e.course.slug.current}`}
                      className={styles.ctaBtn}
                    >
                      {pct === 0 ? 'Start' : 'Continue'} →
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {completedEnrollments.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Completed Courses</h2>
            <div className={styles.courseGrid}>
              {completedEnrollments.map((e) => {
                if (!e.course) return null
                const cert = certificates.find((c) => c.courseId === e.courseId)
                return (
                  <div key={e._id} className={`${styles.courseCard} ${styles.completedCard}`}>
                    <h3 className={styles.courseCardTitle}>{e.course.title}</h3>
                    {cert && (
                      <span className={`${styles.tierBadge} ${styles[cert.tier]}`}>
                        {cert.tier === 'accomplishment' ? 'Certificate of Accomplishment' : 'Certificate of Participation'}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {certificates.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Certificates</h2>
            <div className={styles.certTable}>
              <div className={styles.certTableHeader}>
                <span>Course</span>
                <span>Tier</span>
                <span>Issued</span>
                <span>Expires</span>
                <span></span>
              </div>
              {certificates.map((cert) => {
                const expiry = new Date(cert.expiresAt)
                const expiring = expiry.getTime() - now.getTime() < thirtyDaysMs
                return (
                  <div key={cert._id} className={styles.certRow}>
                    <span className={styles.certCourse}>{cert.courseName}</span>
                    <span className={`${styles.tierBadge} ${styles[cert.tier]}`}>
                      {cert.tier}
                    </span>
                    <time>{new Date(cert.issuedAt).toLocaleDateString()}</time>
                    <time className={expiring ? styles.expiryWarning : ''}>
                      {expiry.toLocaleDateString()}
                      {expiring && ' ⚠️'}
                    </time>
                    {cert.blobUrl && (
                      <a
                        href={cert.blobUrl}
                        download
                        className={styles.downloadLink}
                      >
                        Download
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
