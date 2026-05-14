import { ScormPlayer } from './ScormPlayer'

export function ScormPlayerSlot(props: {
  lessonId: string
  entryUrl: string
  scormVersion: '1.2' | '2004'
}) {
  return <ScormPlayer {...props} />
}

import { SurveyForm } from './SurveyForm'

export function SurveyFormSlot({ courseId }: { courseId: string }) {
  return <SurveyForm courseId={courseId} />
}
