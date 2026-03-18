import styles from './StatsBar.module.scss'

const stats = [
  { value: '<100ms', label: 'Response Time' },
  { value: '99.9%',  label: 'Uptime' },
  { value: 'Multi-Chain', label: 'Networks' },
]

export const StatsBar = () => {
  return (
    <section className={styles.outer}>
      <div className={styles.row}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.innerWrapper}>
            <div className={styles.inner}>
              <span className={styles.value}>{stat.value}</span>
              <span className={styles.label}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
