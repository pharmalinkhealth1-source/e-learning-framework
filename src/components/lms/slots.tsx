import { ScormPlayer } from './ScormPlayer'

export function ScormPlayerSlot(props: {
  lessonId: string
  entryUrl: string
  scormVersion: '1.2' | '2004'
}) {
  return <ScormPlayer {...props} />
}

// Replaced by T06
export function SurveyFormSlot(_props: { courseId: string }): null {
  return null
}
