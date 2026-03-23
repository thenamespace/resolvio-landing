import styles from './Capabilities.module.scss'

const CAPABILITIES = [
  { operation: 'Full profile',            desc: 'Texts, addresses, and contenthash resolved in a single RPC call',                                                       status: 'Live' },
  { operation: 'Text records',            desc: 'Resolve arbitrary key-value records: avatar, email, socials, and any custom key',                                        status: 'Live' },
  { operation: 'Address records',         desc: 'Resolve cryptocurrency addresses for 100+ chains per ENSIP-9',                                                           status: 'Live' },
  { operation: 'Contenthash',             desc: 'Resolve IPFS, IPNS, Arweave, and Swarm content pointers',                                                                status: 'Live' },
  { operation: 'Reverse resolution',      desc: 'Resolve an Ethereum address back to its primary ENS name',                                                               status: 'Live' },
  { operation: 'Bulk forward resolution', desc: 'Resolve multiple ENS names concurrently in a single API call',                                                           status: 'Live' },
  { operation: 'Bulk reverse resolution', desc: 'Resolve multiple addresses to ENS names in a single batched RPC call',                                                   status: 'Live' },
  { operation: 'Supported chains',        desc: 'List all supported chains with names and coinType values',                                                                status: 'Live' },
  { operation: 'Cache control',           desc: 'Per-name cache invalidation via DELETE. Force fresh resolution with noCache to bypass the cache on any request.',        status: 'Live' },
]

export const Capabilities = () => (
  <section id="capabilities" className={styles.outer}>
    <div className={styles.header}>
      <span className={styles.label}>Capabilities</span>
      <h2 className={styles.heading}>What Resolvio resolves.</h2>
      <p className={styles.subtitle}>A precise breakdown of supported operations and outputs.</p>
    </div>

    <div className={styles.divider} />
    <div className={styles.tableWrap}>
      <div className={styles.tableBox}>
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
  </section>
)
