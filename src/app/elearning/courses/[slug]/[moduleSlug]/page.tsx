import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import { ScormPlayerSlot, SurveyFormSlot } from '@/components/lms/slots'
import styles from './page.module.css'

interface Lesson {
  _id: string
  title: string
  type: string
  content: unknown[]
  scormEntryUrl: string | null
  scormVersion: '1.2' | '2004' | null
  questions: unknown[]
  quizRole: string | null
}

interface CourseRef {
  _id: string
}

export default async function LessonRendererPage({
  params,
}: {
  params: { slug: string; moduleSlug: string }
}) {
  const [lesson, course] = await Promise.all([
    client.fetch<Lesson | null>(
      `*[_type == "lesson" && slug.current == $moduleSlug][0] {
        _id, title, type, content, scormEntryUrl, scormVersion, questions, quizRole
      }`,
      { moduleSlug: params.moduleSlug }
    ),
    client.fetch<CourseRef | null>(
      `*[_type == "course" && slug.current == $slug][0] { _id }`,
      { slug: params.slug }
    ),
  ])

  if (!lesson || !course) notFound()

  return (
    <article className={styles.lesson}>
      <h1 className={styles.lessonTitle}>{lesson.title}</h1>

      <div className={styles.lessonContent}>
        {lesson.type === 'text' && lesson.content && (
          <div className={styles.portableText}>
            <PortableText value={lesson.content as Parameters<typeof PortableText>[0]['value']} />
          </div>
        )}

        {lesson.type === 'scorm' && lesson.scormEntryUrl && (
          <ScormPlayerSlot
            lessonId={lesson._id}
            entryUrl={lesson.scormEntryUrl}
            scormVersion={lesson.scormVersion ?? '1.2'}
          />
        )}

        {lesson.type === 'quiz' && (
          <div className={styles.quizPlaceholder}>
            <p>Quiz content — coming in T04.</p>
          </div>
        )}
      </div>

      <SurveyFormSlot courseId={course._id} />
    </article>
  )
}
