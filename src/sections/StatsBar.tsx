import { PackageOpen, FileStack, Bot, Database } from 'lucide-react'
import styles from './StatsBar.module.scss'

const stats = [
  { icon: <PackageOpen size={18} />, value: 'No Dependencies',  label: 'Lightweight by design'     },
  { icon: <Database size={18} />,    value: 'Built-in Caching', label: 'Per-name, configurable TTL' },
  { icon: <FileStack size={18} />,    value: 'Bulk Resolution',  label: 'Forward and reverse'        },
  { icon: <Bot size={18} />,         value: 'Agent Ready',      label: 'OpenAPI docs + Skill.md'    },
]

export const StatsBar = () => {
  return (
    <section className={styles.outer}>
      <div className={styles.row}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.innerWrapper}>
            <div className={styles.inner}>
              <span className={styles.icon}>{stat.icon}</span>
              <span className={styles.value}>{stat.value}</span>
              <span className={styles.label}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
