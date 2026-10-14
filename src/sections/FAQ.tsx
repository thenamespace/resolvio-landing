import { Disclosure } from '../components/ui/Disclosure'
import styles from './FAQ.module.scss'

const questions = [
  [
    'What is Resolvio?',
    'Resolvio is an ENS name resolution API. It offers forward and reverse resolution for ENS names and subnames, with caching and bulk resolution.',
  ],
  [
    'Who is Resolvio for?',
    'Web3 developers who want to display human-readable names and avatars, wallet and app builders that accept ENS names as input, and AI agent builders whose agents need to resolve names at runtime.',
  ],
  [
    'Is Resolvio open-source?',
    'Yes. The source is available on GitHub. The hosted REST API is a managed service operated by Namespace.',
  ],
  [
    'Can I self-host Resolvio?',
    'Yes. Resolvio is a Node.js server. Clone the repo, install its dependencies, set your Ethereum RPC endpoint, and run it. The hosted API at api.resolvio.xyz is optional.',
  ],
  [
    'Do I need a wallet or an API key to use Resolvio?',
    'No wallet and no API key are required. Public resolution is available without authentication.',
  ],
  [
    'How does Resolvio relate to Namespace and its products?',
    'Resolvio is the resolution layer within the Namespace ENS infrastructure suite. The Namespace app provides subname issuance and management, and the developer documentation covers subnames and Resolvio.',
  ],
  [
    'Are both onchain and offchain subnames supported?',
    'Yes. Resolvio supports onchain subnames and offchain subnames resolved via CCIP-Read. You call the same API and Resolvio handles the resolver lookup.',
  ],
  [
    'How does multi-chain resolution work?',
    'ENS can store addresses for multiple chains. Use the chains or coins parameter on the addresses endpoint, or addresses on the profile endpoint. The chain directory lists supported names and coin types. A supported chain does not mean every ENS name has an address set for it.',
  ],
  [
    'How can AI agents use Resolvio?',
    'The REST API is plain HTTP/JSON. Any agent that can make GET requests can call it directly. Install the Resolvio skill or provide the API reference for endpoint parameters and response formats.',
  ],
  [
    'How does bulk reverse resolution work?',
    'Pass a comma-separated list of addresses to the bulk reverse endpoint. It returns an object containing an addresses array. Inputs are deduplicated, so match results by address rather than array position.',
  ],
  [
    'Which names can I resolve?',
    'ENS names and subnames, including DNS names connected to ENS and offchain subnames supported through CCIP-Read. A domain needs an ENS resolver; this is not a general DNS lookup service.',
  ],
  [
    'What if a record is missing?',
    'Records include an exists field. When it is false, the value is omitted. Texts and addresses are arrays of records, so look up each record by its key or coin type.',
  ],
  [
    'Are responses cached?',
    'Yes. The service defaults to five minutes for forward records and thirty minutes for reverse lookups. Operators can change those durations. A noCache request asks for a refresh, but deployments with a refresh cooldown can reuse recent results.',
  ],
  [
    'How many names can I look up at once?',
    'The default bulk limit is twenty names or addresses per request. Split larger lists into batches. Self-hosted instances can configure a different limit.',
  ],
]
export const FAQ = () => (
  <section id="faq" className={styles.outer} aria-labelledby="faq-heading">
    <h2 id="faq-heading">Frequently Asked Questions</h2>
    <div>
      {questions.map(([question, answer]) => (
        <Disclosure key={question} title={question} className={styles.question} triggerClassName={styles.trigger}>
          <p>{answer}</p>
        </Disclosure>
      ))}
    </div>
  </section>
)
