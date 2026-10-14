import styles from './Capabilities.module.scss'

const CAPABILITIES = [
  ['Full profile', 'Texts, addresses, and contenthash resolved in a single API call.'],
  ['Text records', 'Resolve arbitrary key-value records: avatar, email, socials, and any custom key.'],
  ['Address records', 'Resolve cryptocurrency addresses stored in ENS for supported chains.'],
  ['Contenthash', 'Resolve content pointers such as IPFS and IPNS URLs.'],
  ['Reverse resolution', 'Resolve an Ethereum address back to its verified primary ENS name.'],
  ['Reverse profile', 'Resolve an address to its verified ENS profile with avatar, display name, and description when set.'],
  ['Bulk forward resolution', 'Resolve multiple ENS names in a single API call. The default limit is 20.'],
  ['Bulk reverse resolution', 'Resolve multiple addresses to ENS names in a single API call. The default limit is 20.'],
  ['Supported chains', 'List supported chains with their names and numeric coin types.'],
  ['Cache control', 'Request a cache refresh with noCache, subject to the deployment’s refresh cooldown.'],
]

export const Capabilities = () => (
  <section id="capabilities" className={styles.outer} aria-labelledby="capabilities-heading">
    <h2 id="capabilities-heading">What Resolvio resolves.</h2>
    <table>
      <thead><tr><th scope="col">Operation</th><th scope="col">Description</th></tr></thead>
      <tbody>
        {CAPABILITIES.map(([operation, description]) => (
          <tr key={operation}><th scope="row">{operation}</th><td>{description}</td></tr>
        ))}
      </tbody>
    </table>
  </section>
)
