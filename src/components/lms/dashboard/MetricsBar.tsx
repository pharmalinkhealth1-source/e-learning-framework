import styles from './MetricsBar.module.css'

interface MetricsBarProps {
  data: { label: string; value: number }[]
  title?: string
}

export function MetricsBar({ data, title }: MetricsBarProps) {
  if (!data.length) return null
  const max = Math.max(...data.map(d => d.value), 1)

  return (
    <div className={styles.chart}>
      {title && <h3 className={styles.chartTitle}>{title}</h3>}
      <ul className={styles.bars} role="list" aria-label={title ?? 'Bar chart'}>
        {data.map(({ label, value }) => (
          <li key={label} className={styles.barRow}>
            <span className={styles.barLabel}>{label}</span>
            <div className={styles.barTrack} aria-label={`${label}: ${value}`}>
              <div
                className={styles.barFill}
                style={{ width: `${(value / max) * 100}%` }}
                role="meter"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={max}
              />
            </div>
            <span className={styles.barValue}>{value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
