import { useState, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import styles from './FAQ.module.scss'
import { cx } from '../utils/cx'

const Code = ({ children, lang = 'javascript' }: { children: string; lang?: string }) => (
  <div className={styles.codeBlock}>
    <SyntaxHighlighter
      language={lang}
      style={githubGist}
      customStyle={{ margin: 0, background: 'transparent', padding: 0, fontSize: '0.8rem', lineHeight: '1.6' }}
    >
      {children}
    </SyntaxHighlighter>
  </div>
)

interface FAQItem {
  q: string
  a: React.ReactNode
}

interface FAQGroup {
  label: string
  items: FAQItem[]
}

const GROUPS: FAQGroup[] = [
  {
    label: 'General',
    items: [
      {
        q: 'What is Resolvio?',
        a: 'Resolvio is a universal Web3 name resolution layer. It offers forward and reverse resolution for ENS (.eth) names and subnames with extra features like a cache service, bulk resolution, and more.',
      },
      {
        q: 'Who is Resolvio for?',
        a: (
          <ul>
            <li><strong>Web3 developers</strong> who want a simple way to display human-readable names and avatars in their UI without building namespace-specific or custom integrations.</li>
            <li><strong>Wallet and app builders</strong> that accept Web3 identities as input (payments, messaging, access control) and need to resolve them reliably.</li>
            <li><strong>AI agent builders</strong> whose agents need to resolve Web3 names at runtime via the REST API.</li>
            <li><strong>Others</strong> — L2 chains, communities, wallets, payment apps, games, and more.</li>
          </ul>
        ),
      },
      {
        q: 'Is Resolvio open-source?',
        a: 'Yes. Resolvio is open-source and MIT-licensed. The source is available on GitHub. The hosted REST API is a managed service operated by Namespace.',
      },
      {
        q: 'Can I self-host Resolvio?',
        a: 'Yes. Resolvio is a lightweight Node.js server with no external dependencies — clone the repo, set your RPC endpoint, and run it. The hosted API at api.resolvio.xyz is optional convenience infrastructure. You are never forced to use it.',
      },
      {
        q: 'Do I need a wallet or an API key to use Resolvio?',
        a: 'No wallet and no API key are required to get started. Public resolution is available immediately with no authentication. An API key is only needed if you want higher rate limits or usage analytics on the hosted REST API.',
      },
      {
        q: 'How does Resolvio relate to Namespace and its products?',
        a: (
          <>
            <p>Resolvio is the resolution layer within the Namespace ENS infrastructure suite. Related products include:</p>
            <ul>
              <li><strong>ENS Components</strong> — a React UI kit for displaying ENS profiles and names.</li>
              <li><strong>Namespace app</strong> — subname issuance and management at scale.</li>
              <li><strong>Developer documentation</strong> — full API reference and guides for subnames and Resolvio.</li>
            </ul>
          </>
        ),
      },
      {
        q: 'Are both onchain and offchain subnames supported?',
        a: 'Yes. Resolvio supports both onchain subnames (stored directly on Ethereum) and offchain subnames (resolved via CCIP-Read from an off-chain data source). The resolution flow is transparent — you call the same API and Resolvio handles the routing automatically.',
      },
      {
        q: 'Does Resolvio support traditional DNS domain names?',
        a: (
          <>
            <p>Yes, but indirectly. Resolvio works with ENS, and ENS supports DNS-linked names via its DNS Registrar. If a traditional domain has been imported or tokenized with ENS and has a resolver set, Resolvio can resolve it.</p>
            <p>For example, if <code>alice.com</code> has been claimed in ENS via the DNS Registrar, <code>resolve('alice.com')</code> will work. A standard DNS domain that has not been claimed in ENS will return <code>NOT_FOUND</code>.</p>
          </>
        ),
      },
    ],
  },
  {
    label: 'Technical',
    items: [
      {
        q: 'Do I need an API key?',
        a: 'No API key is required. You can start making requests immediately. An API key gives you higher rate limits and usage analytics for production apps with high resolution volume.',
      },
      {
        q: 'Are there rate limits?',
        a: 'Rate limits apply to the hosted REST API for unauthenticated usage. If you are building a production app with high resolution volume, an API key gives you higher rate limits and usage analytics. See the docs for details.',
      },
      {
        q: 'How does multi-chain resolution work?',
        a: (
          <>
            <p>ENS supports storing addresses for chains other than Ethereum via ENSIP-9, which maps blockchain types to SLIP-44 coin type integers. Pass the chain name as a query parameter:</p>
            <Code lang="bash">{`# Resolve all addresses for a name
GET https://api.resolvio.xyz/ens/v2/profile/vitalik.eth?addresses=eth,btc,sol

# Resolve addresses only
GET https://api.resolvio.xyz/ens/v2/addresses/vitalik.eth?chains=eth,btc,sol`}</Code>
            <p>Supported chains include ETH, BTC, LTC, DOGE, SOL, MATIC, ARB, BASE, and any other SLIP-44 registered chain type.</p>
          </>
        ),
      },
      {
        q: 'How can AI agents use Resolvio?',
        a: (
          <>
            <p>The REST API is plain HTTP/JSON — any agent that can make GET requests can call it directly. No special setup required.</p>
            <Code lang="bash">GET https://api.resolvio.xyz/ens/v2/profile/vitalik.eth</Code>
          </>
        ),
      },
      {
        q: 'How does caching work?',
        a: 'Resolution results are cached server-side with a TTL derived from the on-chain ttl() value set on the resolver. You can bypass the cache with the noCache query parameter if you need a fresh result.',
      },
      {
        q: 'How does bulk reverse resolution work?',
        a: (
          <>
            <p>Pass a comma-separated list of addresses to the bulk reverse endpoint. Resolvio batches the lookups into a single multicall RPC request and returns results in the same order.</p>
            <Code lang="bash">GET https://api.resolvio.xyz/ens/v2/reverse/bulk?addresses=0xd8dA…,0x225f…</Code>
          </>
        ),
      },
    ],
  },
]

const AccordionItem = ({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
}) => {
  const bodyRef = useRef<HTMLDivElement>(null)

  return (
    <div className={cx(styles.item, isOpen && styles.itemOpen)}>
      <button className={styles.question} onClick={onToggle}>
        <span>{item.q}</span>
        <ChevronDown size={18} className={cx(styles.chevron, isOpen && styles.chevronOpen)} />
      </button>
      <div
        ref={bodyRef}
        className={styles.answerWrap}
        style={{ maxHeight: isOpen ? bodyRef.current?.scrollHeight : 0 }}
      >
        <div className={styles.answer}>{item.a}</div>
      </div>
    </div>
  )
}

export const FAQ = () => {
  const [activeGroup, setActiveGroup] = useState(0)
  const [open, setOpen] = useState<number | null>(null)

  const switchGroup = (idx: number) => { setActiveGroup(idx); setOpen(null) }
  const toggle = (i: number) => setOpen(open === i ? null : i)

  const group = GROUPS[activeGroup]

  return (
    <section id="faq" className={styles.outer}>
      <div className={styles.header}>
        <span className={styles.label}>FAQ</span>
        <h2 className={styles.heading}>Frequently Asked Questions</h2>
        <p className={styles.subtitle}>Everything you need to know about Resolvio and how it works.</p>
      </div>

      <div className={styles.gridOuter}>
        <div className={styles.grid}>

          {/* Tab row */}
          <div className={styles.tabCell}>
            <div className={styles.tabs}>
              {GROUPS.map((g, i) => (
                <button
                  key={g.label}
                  className={cx(styles.tab, activeGroup === i && styles.tabActive)}
                  onClick={() => switchGroup(i)}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Items */}
          {group.items.map((item, i) => (
            <div key={i} className={styles.cell}>
              <AccordionItem item={item} isOpen={open === i} onToggle={() => toggle(i)} />
            </div>
          ))}

        </div>
      </div>
    </section>
  )
}
