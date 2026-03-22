import { Zap, Shield, Globe, Code2, Layers, BrainCircuit } from 'lucide-react'
import styles from './WhyResolvio.module.scss'

const CAPABILITIES = [
  { operation: 'Full profile',         desc: 'Texts, addresses, and contenthash resolved in a single RPC call',  status: 'Live' },
  { operation: 'Text records',         desc: 'Resolve arbitrary key-value records: avatar, email, socials, and any custom key', status: 'Live' },
  { operation: 'Address records',      desc: 'Resolve cryptocurrency addresses for 100+ chains per ENSIP-9',     status: 'Live' },
  { operation: 'Contenthash',          desc: 'Resolve IPFS, IPNS, Arweave, and Swarm content pointers',          status: 'Live' },
  { operation: 'Reverse resolution',   desc: 'Resolve an Ethereum address back to its primary ENS name',         status: 'Live' },
  { operation: 'Bulk forward resolution', desc: 'Resolve multiple ENS names concurrently in a single API call',          status: 'Live' },
  { operation: 'Bulk reverse resolution', desc: 'Resolve multiple addresses to ENS names in a single batched RPC call',  status: 'Live' },
  { operation: 'Supported chains',     desc: 'List all supported chains with names and coinType values',          status: 'Live' },
]

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
  <section className={styles.outer}>
    <div className={styles.header}>
      <span className={styles.label}>Benefits</span>
      <h2 className={styles.heading}>Why Resolvio?</h2>
      <p className={styles.subtitle}>The most powerful and developer-friendly Web3 name resolution service</p>
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

    {/* Capabilities table */}
    <div className={styles.gridOuter}>
      <div className={styles.grid}>
        <div className={styles.cellFull}>
          <div className={styles.inner}>
            <div className={styles.capHeader}>
              <span className={styles.label}>Capabilities</span>
              <h3 className={styles.capHeading}>What Resolvio resolves.</h3>
              <p className={styles.capSubtitle}>A precise breakdown of supported operations and outputs.</p>
            </div>
            <table className={styles.capTable}>
              <thead>
                <tr>
                  <th>Operation</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {CAPABILITIES.map((c) => (
                  <tr key={c.operation}>
                    <td className={styles.capName}>{c.operation}</td>
                    <td className={styles.capDesc}>{c.desc}</td>
                    <td><span className={c.status === 'Live' ? styles.badgeLive : styles.badgeBeta}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
)
