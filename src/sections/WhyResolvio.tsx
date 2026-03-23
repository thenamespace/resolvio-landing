import { Zap, Shield, Globe, Code2, Layers, BrainCircuit } from 'lucide-react'
import styles from './WhyResolvio.module.scss'


const FEATURES = [
  {
    icon: <Zap size={18} />,
    title: 'Lightning Fast',
    desc: 'Sub-100ms response times with intelligent caching and optimized resolution paths.',
  },
  {
    icon: <Shield size={18} />,
    title: 'Rock Solid',
    desc: '99.9% uptime guarantee with automatic failover and redundant infrastructure.',
  },
  {
    icon: <Globe size={18} />,
    title: 'Multi-Chain',
    desc: 'Support for ENS, DNS, and other naming systems across multiple blockchain networks.',
  },
  {
    icon: <Code2 size={18} />,
    title: 'Developer First',
    desc: 'RESTful API with comprehensive documentation, SDKs, and code examples.',
  },
  {
    icon: <Layers size={18} />,
    title: 'Flexible Queries',
    desc: 'Fetch exactly what you need – addresses, text records, content hashes, or everything.',
  },
  {
    icon: <BrainCircuit size={18} />,
    title: 'AI-Friendly',
    desc: 'Built for the agentic stack – for use by AI agents that need to resolve Web3 identities.',
  },
]

export const WhyResolvio = () => (
  <section id="benefits" className={styles.outer}>
    <div className={styles.header}>
      <span className={styles.label}>Benefits</span>
      <h2 className={styles.heading}>Why Resolvio?</h2>
      <p className={styles.subtitle}>The most complete Web3 name resolution service.</p>
    </div>

    <div className={styles.gridOuter}>
      <div className={styles.grid}>
        {FEATURES.map((f) => (
          <div key={f.title} className={styles.cell}>
            <div className={styles.inner}>
              <div className={styles.iconCircle}>{f.icon}</div>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

  </section>
)
