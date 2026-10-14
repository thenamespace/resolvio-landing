import styles from './WhyResolvio.module.scss'

const FEATURES = [
  ['Built-in Caching', 'Resolution results are cached with configurable durations for forward and reverse lookups.'],
  ['Self-hostable', 'Run the open-source Node.js service with your own Ethereum RPC provider.'],
  ['Multi-Chain', 'Resolve addresses stored in ENS for Ethereum, Bitcoin, Solana, and other supported chains.'],
  ['Developer First', 'RESTful API with documentation and code examples.'],
  ['Flexible Queries', 'Fetch exactly what you need: addresses, text records, content hashes, or a profile.'],
  ['AI-Friendly', 'For use by AI agents that need to resolve ENS names through HTTP requests.'],
]

export const WhyResolvio = () => (
  <section id="benefits" className={styles.outer} aria-labelledby="benefits-heading">
    <h2 id="benefits-heading">Why Resolvio?</h2>
    <dl>
      {FEATURES.map(([title, description]) => (
        <div key={title}>
          <dt>{title}</dt>
          <dd>{description}</dd>
        </div>
      ))}
    </dl>
  </section>
)
