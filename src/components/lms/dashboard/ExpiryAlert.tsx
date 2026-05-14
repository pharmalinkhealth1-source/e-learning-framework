import { getExpiringCertificates } from '@/sanity/lib/dashboardQueries'
import styles from './ExpiryAlert.module.css'

interface ExpiryAlertProps {
  country?: string
}

export async function ExpiryAlert({ country }: ExpiryAlertProps) {
  const expiring = await getExpiringCertificates({ daysAhead: 30, country })

  if (!expiring.length) return null

  return (
    <div className={styles.alert} role="alert">
      <strong className={styles.alertHeading}>
        ⚠ {expiring.length} certificate{expiring.length !== 1 ? 's' : ''} expiring within 30 days
      </strong>
      <details className={styles.details}>
        <summary className={styles.summary}>View affected certificates</summary>
        <ul className={styles.list}>
          {expiring.map(c => (
            <li key={c._id} className={styles.listItem}>
              <span>Learner: {c.userId}</span>
              <span>Course: {c.courseId}</span>
              <span>Expires: {new Date(c.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}
