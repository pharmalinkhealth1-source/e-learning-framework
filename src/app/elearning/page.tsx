import { auth } from '@clerk/nextjs/server'
import { client } from '@/sanity/lib/client'
import Link from 'next/link'
import Navbar from '@/components/stripe/Navbar'
import styles from './page.module.css'

interface CourseCard {
  _id: string
  title: string
  slug: { current: string }
  description: string
  moduleCount: number
}

export default async function ElearningPage() {
  const { sessionClaims } = await auth()
  const userCountry = (sessionClaims?.metadata as Record<string, unknown>)?.country as string | undefined

  const courses = await client.fetch<CourseCard[]>(
    `*[_type == "course" && ($userCountry in country || "global" in country)] {
      _id, title, slug, description, "moduleCount": count(modules)
    }`,
    { userCountry: userCountry ?? '' }
  )

  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>PharmaLink Learning</p>
          <h1 className={styles.title}>Continuing Education for Pharmacy Professionals</h1>
          <p className={styles.subtitle}>
            Evidence-based courses designed for pharmacists and pharmacy staff across Africa.
          </p>
          <Link href="/elearning/my-learning" className={styles.primaryBtn}>
            My Learning
          </Link>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Available Courses</h2>
          {courses.length === 0 ? (
            <p className={styles.emptyState}>No courses available for your region yet.</p>
          ) : (
            <div className={styles.courseGrid}>
              {courses.map((course) => (
                <Link
                  key={course._id}
                  href={`/elearning/courses/${course.slug.current}`}
                  className={styles.courseCard}
                >
                  <div className={styles.courseCardBody}>
                    <span className={styles.badge}>{course.moduleCount ?? 0} modules</span>
                    <h3 className={styles.courseTitle}>{course.title}</h3>
                    {course.description && (
                      <p className={styles.courseDescription}>{course.description}</p>
                    )}
                  </div>
                  <div className={styles.courseCardFooter}>
                    <span className={styles.ctaLink}>View course →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
