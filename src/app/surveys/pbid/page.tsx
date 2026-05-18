import { client } from '@/sanity/lib/client'
import PbidSurveyGate from './PbidSurveyGate'
import PbidSurveyForm from './PbidSurveyForm'
import styles from './Survey.module.css'

export const metadata = {
  title: 'PBID Digital Training Exit Interview',
  robots: 'noindex, nofollow',
}

interface PbidConfig {
  title?: string
  introText?: string
  completionMessage?: string
  isActive?: boolean
}

/**
 * Standalone landing page for the PBID Digital Training Exit Interview.
 * Renders without site Navbar/Footer. Optional passcode gate is enforced
 * when `PBID_SURVEY_CODE` is set. Reads display copy and the active flag
 * from the `pbidSurveyConfig` singleton.
 */
export default async function PbidSurveyPage() {
  const config: PbidConfig =
    (await client.fetch(`*[_type == "pbidSurveyConfig"][0]`)) ?? {}

  const requiresCode = !!process.env.PBID_SURVEY_CODE

  return (
    <div className={styles.wrapper}>
      <PbidSurveyGate requiresCode={requiresCode}>
        {config.isActive === false ? (
          <div className={styles.card}>
            <p>This survey is currently closed. Please check back later.</p>
          </div>
        ) : (
          <PbidSurveyForm config={config} />
        )}
      </PbidSurveyGate>
    </div>
  )
}
