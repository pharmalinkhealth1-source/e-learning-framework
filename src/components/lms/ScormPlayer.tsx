'use client'

import { useEffect, useRef } from 'react'
import styles from './ScormPlayer.module.css'

interface ScormPlayerProps {
  lessonId: string
  entryUrl: string
  scormVersion: '1.2' | '2004'
}

export function ScormPlayer({ lessonId, entryUrl, scormVersion }: ScormPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    let lms: { destroy?: () => void } | null = null

    async function init() {
      // All window.* assignments must be inside useEffect — React Compiler constraint
      const { Scorm12API, Scorm2004API, CrossFrameLMS } = await import('scorm-again')

      const commitUrl = `/api/lms/scorm-commit?lessonId=${encodeURIComponent(lessonId)}`
      const settings = { lmsCommitUrl: commitUrl, autocommit: true, dataCommitFormat: 'json' }

      const api = scormVersion === '2004'
        ? new Scorm2004API(settings)
        : new Scorm12API(settings)

      lms = new CrossFrameLMS(api, '*')
    }

    init().catch(console.error)

    return () => {
      if (lms?.destroy) lms.destroy()
    }
  }, [lessonId, scormVersion])

  return (
    <div className={styles.stageBackdrop}>
      <iframe
        ref={iframeRef}
        src={entryUrl}
        className={styles.scormIframe}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        title="SCORM Module"
      />
    </div>
  )
}
