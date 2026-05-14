import { client } from '@/sanity/lib/client'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import styles from './page.module.css'

interface Lesson {
  _id: string
  title: string
  slug: { current: string }
  type: string
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
  description: string
  passingScore: number
  modules: Module[]
}

export default async function CourseOverviewPage({ params }: { params: { slug: string } }) {
  const course = await client.fetch<Course | null>(
    `*[_type == "course" && slug.current == $slug][0] {
      _id, title, slug, description, passingScore,
      "modules": modules[]-> {
        _id, title, slug,
        "lessons": lessons[]-> { _id, title, slug, type }
      }
    }`,
    { slug: params.slug }
  )

  if (!course) notFound()

  const firstModule = course.modules?.[0]
  const firstLesson = firstModule?.lessons?.[0]
  const firstLessonHref = firstLesson
    ? `/elearning/courses/${course.slug.current}/${firstModule.slug.current}`
    : null

  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length ?? 0), 0) ?? 0

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.heroMeta}>
            <Link href="/elearning" className={styles.backLink}>← All Courses</Link>
            <span className={styles.badge}>{totalLessons} lessons</span>
          </div>
          <h1 className={styles.title}>{course.title}</h1>
          {course.description && (
            <p className={styles.description}>{course.description}</p>
          )}
          {firstLessonHref && (
            <Link href={firstLessonHref} className={styles.enrollBtn}>
              Start Course →
            </Link>
          )}
        </div>

        <div className={styles.curriculum}>
          <h2 className={styles.curriculumTitle}>Curriculum</h2>
          {course.modules?.map((mod, modIndex) => (
            <div key={mod._id} className={styles.moduleBlock}>
              <h3 className={styles.moduleTitle}>
                <span className={styles.moduleNumber}>{modIndex + 1}</span>
                {mod.title}
              </h3>
              <ul className={styles.lessonList}>
                {mod.lessons?.map((lesson, lessonIndex) => (
                  <li key={lesson._id} className={styles.lessonItem}>
                    <span className={styles.lessonIndex}>{modIndex + 1}.{lessonIndex + 1}</span>
                    <span className={styles.lessonName}>{lesson.title}</span>
                    <span className={styles.lessonType}>{lesson.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
