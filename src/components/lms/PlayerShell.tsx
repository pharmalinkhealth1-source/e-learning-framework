import { auth } from '@clerk/nextjs/server'
import { client } from '@/sanity/lib/client'
import Link from 'next/link'
import styles from './PlayerShell.module.css'

interface Lesson {
  _id: string
  title: string
  slug: { current: string }
  lessonShortId?: string
}

interface Module {
  _id: string
  title: string
  slug: { current: string }
  lessons: Lesson[]
}

interface Course {
  _id: string
  title: string
  slug: { current: string }
  modules: Module[]
}

interface PlayerShellProps {
  slug: string
  children: React.ReactNode
}

function deriveAgeGroup(dob: string | undefined): string {
  if (!dob) return 'unknown'
  const birth = new Date(dob)
  const age = new Date().getFullYear() - birth.getFullYear()
  if (age < 18) return '<18'
  if (age < 25) return '18-24'
  if (age < 35) return '25-34'
  if (age < 45) return '35-44'
  return '45+'
}

export default async function PlayerShell({ slug, children }: PlayerShellProps) {
  const { userId, sessionClaims } = await auth()
  const metadata = sessionClaims?.metadata as Record<string, unknown> | undefined

  const completedLessonsRaw = metadata?.completedLessons as string[] | undefined
  const completedLessons = completedLessonsRaw ?? []

  const course = await client.fetch<Course | null>(
    `*[_type == "course" && slug.current == $slug][0] {
      _id, title, slug,
      "modules": modules[]-> {
        _id, title, slug,
        "lessons": lessons[]-> { _id, title, slug }
      }
    }`,
    { slug }
  )

  if (!course) return <>{children}</>

  const allLessons = course.modules?.flatMap((m) => m.lessons ?? []) ?? []
  const totalLessons = allLessons.length

  let completedSet: Set<string>

  if (completedLessons.length > 25) {
    const fromSanity = await client.fetch<string[]>(
      `*[_type == "lessonProgress" && userId == $userId && courseId == $courseId && completed == true].lessonShortId`,
      { userId, courseId: course._id }
    )
    completedSet = new Set(fromSanity.filter(Boolean))
  } else {
    completedSet = new Set(completedLessons)
  }

  const completedCount = allLessons.filter((l) => completedSet.has(l._id.slice(-8))).length
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const moduleLessonCounts = course.modules?.map((m) => m.lessons?.length ?? 0) ?? []

  function isModuleLocked(modIndex: number): boolean {
    if (modIndex === 0) return false
    const prevModule = course!.modules[modIndex - 1]
    if (!prevModule?.lessons?.length) return false
    return !prevModule.lessons.every((l) => completedSet.has(l._id.slice(-8)))
  }

  return (
    <div className={styles.shell}>
      <nav className={styles.sidebar} aria-label="Course navigation">
        <div className={styles.sidebarHeader}>
          <Link href={`/elearning/courses/${slug}`} className={styles.courseTitle}>
            {course.title}
          </Link>
          <div
            className={styles.progressBar}
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Course progress: ${progressPct}%`}
          >
            <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
          </div>
          <span className={styles.progressLabel}>{progressPct}% complete</span>
          {/* notification bell slot */}
        </div>

        <div className={styles.moduleList}>
          {course.modules?.map((mod, modIndex) => {
            const locked = isModuleLocked(modIndex)
            return (
              <div key={mod._id} className={styles.moduleSection}>
                <div className={`${styles.moduleHeader} ${locked ? styles.locked : ''}`}>
                  {locked ? (
                    <span className={styles.lockIcon} aria-hidden="true">🔒</span>
                  ) : (
                    <span className={styles.moduleIndex} aria-hidden="true">{modIndex + 1}</span>
                  )}
                  <span className={styles.moduleName}>{mod.title}</span>
                </div>
                <ul className={styles.lessonList} role="list">
                  {mod.lessons?.map((lesson) => {
                    const done = completedSet.has(lesson._id.slice(-8))
                    const href = `/elearning/courses/${slug}/${mod.slug.current}`
                    return (
                      <li key={lesson._id} className={styles.lessonItem}>
                        {locked ? (
                          <span
                            className={`${styles.lessonLink} ${styles.lessonLocked}`}
                            aria-disabled="true"
                            aria-label={`${lesson.title} — locked`}
                          >
                            <span className={styles.lessonDot} aria-hidden="true">○</span>
                            {lesson.title}
                          </span>
                        ) : (
                          <Link
                            href={href}
                            className={`${styles.lessonLink} ${done ? styles.done : ''}`}
                            aria-label={`${lesson.title}${done ? ' — completed' : ''}`}
                          >
                            <span className={styles.lessonDot} aria-hidden="true">
                              {done ? '✓' : '○'}
                            </span>
                            {lesson.title}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </nav>

      <main className={styles.content} tabIndex={-1} id="lesson-content">
        {children}
      </main>
    </div>
  )
}
