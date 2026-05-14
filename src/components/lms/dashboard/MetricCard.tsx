import styles from './MetricCard.module.css'

interface MetricCardProps {
  label: string
  value: number | string
  unit?: string
  trend?: 'up' | 'down' | 'neutral'
  description?: string
}

export function MetricCard({ label, value, unit, trend, description }: MetricCardProps) {
  const trendSymbol = trend === 'up' ? '↑' : trend === 'down' ? '↓' : null

  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        {unit && <span className={styles.unit}>{unit}</span>}
        {trendSymbol && (
          <span className={`${styles.trend} ${styles[trend!]}`} aria-hidden="true">
            {trendSymbol}
          </span>
        )}
      </div>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  )
}
