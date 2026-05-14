import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import styles from './CertificateList.module.css'

interface CertRow {
  _id: string
  clerkUserId: string
  courseId: string
  tier: string
  issuedAt: string
  score: number
}

interface CertificateListProps {
  userCountry?: string
  isManager: boolean
}

export async function CertificateList({ isManager, userCountry }: CertificateListProps) {
  const countryClause = isManager && userCountry ? ' && country == $userCountry' : ''
  const certs = await client.fetch<CertRow[]>(
    groq`*[_type == "certificate"${countryClause}] | order(issuedAt desc) [0..50] {
      _id, clerkUserId, courseId, tier, issuedAt, score
    }`,
    { userCountry }
  )

  if (!certs.length) {
    return <p className={styles.empty}>No certificates issued yet.</p>
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <caption className={styles.caption}>Issued Certificates</caption>
        <thead>
          <tr>
            <th className={styles.th}>Learner ID</th>
            <th className={styles.th}>Course ID</th>
            <th className={styles.th}>Tier</th>
            <th className={styles.th}>Score</th>
            <th className={styles.th}>Issued</th>
          </tr>
        </thead>
        <tbody>
          {certs.map(c => (
            <tr key={c._id} className={styles.row}>
              <td className={styles.td}>{c.clerkUserId}</td>
              <td className={styles.td}>{c.courseId}</td>
              <td className={styles.td}>
                <span className={`${styles.tierBadge} ${c.tier === 'accomplishment' ? styles.accomplishment : styles.participation}`}>
                  {c.tier}
                </span>
              </td>
              <td className={styles.td}>{c.score ?? '—'}%</td>
              <td className={styles.td}>
                {new Date(c.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
