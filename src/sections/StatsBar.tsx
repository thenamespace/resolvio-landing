import { PackageOpen, FileStack, Bot, Database } from 'lucide-react'
import styles from './StatsBar.module.scss'

const stats = [
  { icon: <PackageOpen size={18} />, value: 'Self-Hostable',  label: 'Bring your own RPC'     },
  { icon: <Database size={18} />,    value: 'Built-in Caching', label: 'Configurable cache durations' },
  { icon: <FileStack size={18} />,    value: 'Bulk Resolution',  label: 'Forward and reverse'        },
  { icon: <Bot size={18} />,         value: 'Agent Ready',      label: 'OpenAPI docs + Skill.md'    },
]

export const StatsBar = () => {
  return (
    <section className={styles.outer} aria-label="API feature highlights">
      <dl className={styles.row}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.innerWrapper}>
            <div className={styles.inner}>
              <span className={styles.icon} aria-hidden="true">{stat.icon}</span>
              <dt className={styles.value}>{stat.value}</dt>
              <dd className={styles.label}>{stat.label}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  )
}
