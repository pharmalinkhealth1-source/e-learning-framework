import { ScormPlayer } from './ScormPlayer'
import { SurveyForm } from './SurveyForm'

export function ScormPlayerSlot(props: {
  lessonId: string
  entryUrl: string
  scormVersion: '1.2' | '2004'
}) {
  return <ScormPlayer {...props} />
}

export function SurveyFormSlot({ courseId }: { courseId: string }) {
  return <SurveyForm courseId={courseId} />
}
