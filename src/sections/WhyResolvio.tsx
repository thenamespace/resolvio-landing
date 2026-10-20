import { Zap, Shield, Globe, Code2, Layers, BrainCircuit } from 'lucide-react'
import styles from './WhyResolvio.module.scss'


const FEATURES = [
  {
    icon: <Zap size={18} />,
    title: 'Built-in Caching',
    desc: 'Reuse cached results with configurable forward and reverse cache durations.',
  },
  {
    icon: <Shield size={18} />,
    title: 'Open Source',
    desc: 'Use the public API or self-host Resolvio with your own Ethereum RPC endpoint.',
  },
  {
    icon: <Globe size={18} />,
    title: 'Multi-Chain',
    desc: 'Read multi-chain address records stored in ENS, including ENS-enabled DNS names.',
  },
  {
    icon: <Code2 size={18} />,
    title: 'Developer First',
    desc: 'HTTP endpoints with an OpenAPI specification, guides, and integration examples.',
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
      <p className={styles.subtitle}>ENS records for apps, wallets, and agents.</p>
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
