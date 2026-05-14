'use client'

import { useEffect, useState } from 'react'
import styles from './CertificateViewer.module.css'

interface CertificateViewerProps {
  courseId: string
}

interface CertData {
  blobUrl: string
  tier: 'accomplishment' | 'participation'
}

export function CertificateViewer({ courseId }: CertificateViewerProps) {
  const [loading, setLoading] = useState(true)
  const [certificate, setCertificate] = useState<CertData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/lms/certificate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    })
      .then(async res => {
        const data = await res.json()
        if (!res.ok) {
          if (data.error === 'Survey not submitted') return // silent — survey not done yet
          setError(data.error ?? 'Could not generate certificate')
        } else {
          setCertificate(data)
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false))
  }, [courseId])

  if (loading) {
    return (
      <div className={styles.skeleton} aria-busy="true" aria-label="Generating certificate…">
        <div className={styles.skeletonBar} />
        <div className={styles.skeletonBarShort} />
      </div>
    )
  }

  if (!certificate) {
    if (error) return <p className={styles.error}>{error}</p>
    return null
  }

  const isAccomplishment = certificate.tier === 'accomplishment'

  return (
    <div className={`${styles.viewer} ${isAccomplishment ? styles.accomplishment : styles.participation}`}>
      <div className={styles.badge}>
        {isAccomplishment ? 'Certificate of Accomplishment' : 'Certificate of Participation'}
      </div>
      <p className={styles.congratsText}>
        {isAccomplishment
          ? 'Congratulations! You passed the course assessment.'
          : 'You completed this course. Well done!'}
      </p>
      <a
        href={certificate.blobUrl}
        download
        className={styles.downloadBtn}
      >
        Download Certificate (PDF)
      </a>
    </div>
  )
}
