// Replaced by T05
export function ScormPlayerSlot(_props: {
  lessonId: string
  entryUrl: string
  scormVersion: '1.2' | '2004'
}): null {
  return null
}

import { SurveyForm } from './SurveyForm'

export function SurveyFormSlot({ courseId }: { courseId: string }) {
  return <SurveyForm courseId={courseId} />
}
