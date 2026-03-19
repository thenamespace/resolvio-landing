import { useEffect, useRef, useState } from 'react'
import { Copy, Info, Terminal } from 'lucide-react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { Button } from '../components/ui/Button'
import { RecordPickerModal, type PickerItem } from '../components/ui/RecordPickerModal'
import styles from './TryItNow.module.scss'
import { cx } from '../utils/cx'
import { RESOLVIO_API } from '../constants/api'

type Tab = 'forward' | 'reverse'

const FORWARD_EXAMPLES = ['artii.eth', 'thecap.eth', 'happy.rsk.eth', 'vitalik.eth']
const REVERSE_EXAMPLES_SINGLE = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
const REVERSE_EXAMPLES_BULK = [
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  '0x225f137127d9067788314bc7fcc1f36746a3c3B5',
]

const DEFAULT_TEXT_KEYS = ['avatar', 'description', 'com.twitter', 'com.github', 'url', 'email', 'org.telegram', 'com.discord']

const TEXT_PRESETS: PickerItem[] = [
  { id: 'avatar',          label: 'Avatar',        sublabel: 'avatar',          group: 'Profile' },
  { id: 'header',          label: 'Header',        sublabel: 'header',          group: 'Profile' },
  { id: 'description',     label: 'Description',   sublabel: 'description',     group: 'Profile' },
  { id: 'name',            label: 'Display Name',  sublabel: 'name',            group: 'Profile' },
  { id: 'url',             label: 'Website',       sublabel: 'url',             group: 'Profile' },
  { id: 'email',           label: 'Email',         sublabel: 'email',           group: 'Profile' },
  { id: 'com.twitter',     label: 'Twitter / X',   sublabel: 'com.twitter',     group: 'Social'  },
  { id: 'com.github',      label: 'GitHub',        sublabel: 'com.github',      group: 'Social'  },
  { id: 'org.telegram',    label: 'Telegram',      sublabel: 'org.telegram',    group: 'Social'  },
  { id: 'com.discord',     label: 'Discord',       sublabel: 'com.discord',     group: 'Social'  },
  { id: 'com.linkedin',    label: 'LinkedIn',      sublabel: 'com.linkedin',    group: 'Social'  },
  { id: 'com.farcaster',   label: 'Farcaster',     sublabel: 'com.farcaster',   group: 'Social'  },
  { id: 'com.reddit',      label: 'Reddit',        sublabel: 'com.reddit',      group: 'Social'  },
  { id: 'eth.ens.delegate',label: 'ENS Delegate',  sublabel: 'eth.ens.delegate',group: 'Web3'    },
  { id: 'snapshot',        label: 'Snapshot',      sublabel: 'snapshot',        group: 'Web3'    },
]

interface Chain { coin: number; name: string; label: string }
interface TextRecord    { key: string; value?: string; exists: boolean }
interface AddressRecord { coin: number; chain: string; value?: string; exists: boolean }
interface ContentHash   { value?: string; exists: boolean }

interface ForwardResult {
  name: string
  resolver?: string
  texts?: TextRecord[]
  addresses?: AddressRecord[]
  contenthash?: ContentHash
}

interface ReverseResult {
  address: string
  hasReverseRecord: boolean
  name?: string
}

interface BulkReverseResult {
  addresses: ReverseResult[]
}

const RecordBadge = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    })
  }
  return (
    <button className={styles.recordBadge} onClick={copy} title={value}>
      <span className={styles.recordBadgeLabel}>{label}</span>
      <span className={styles.recordBadgeValue}>{value}</span>
      <span className={styles.recordBadgeCopy}>
        {copied ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width={11} height={11}><path d="M5 13l4 4L19 7"/></svg> : <Copy size={11} />}
      </span>
    </button>
  )
}

export const TryItNow = () => {
  const [tab, setTab]                     = useState<Tab>('forward')
  const [input, setInput]                 = useState('')
  const [reverseInput, setReverseInput]   = useState('')
  const [resolving, setResolving]         = useState(false)
  const [forwardResult, setForwardResult] = useState<ForwardResult | null>(null)
  const [reverseResult, setReverseResult] = useState<ReverseResult | null>(null)
  const [bulkResult, setBulkResult]       = useState<BulkReverseResult | null>(null)
  const [rawJson, setRawJson]             = useState<string>('')
  const [showJson, setShowJson]           = useState(false)
  const [error, setError]                 = useState<string | null>(null)
  const [copied, setCopied]               = useState(false)

  // Include toggles
  const [useDefault, setUseDefault]       = useState(false)
  const [inclAddresses, setInclAddresses] = useState(true)
  const [inclTexts, setInclTexts]         = useState(true)
  const [inclContent, setInclContent]     = useState(true)

  // Chains
  const [chains, setChains]               = useState<Chain[]>([])
  const [selectedChains, setSelectedChains] = useState<Set<string>>(new Set())
  const chainsFetched                     = useRef(false)

  // Text keys
  const [selectedTexts, setSelectedTexts] = useState<string[]>(DEFAULT_TEXT_KEYS)

  // Modal open state
  const [chainsModalOpen, setChainsModalOpen] = useState(false)
  const [textsModalOpen, setTextsModalOpen]   = useState(false)

  // Derived: chain items for modal (populated after fetch)
  const chainPickerItems: PickerItem[] = chains.map(c => ({
    id: c.name, label: c.label, sublabel: c.name,
  }))

  // Fetch chains from API once
  useEffect(() => {
    if (chainsFetched.current) return
    chainsFetched.current = true
    fetch(`${RESOLVIO_API}/ens/v2/chains`)
      .then(r => r.json())
      .then((data: Chain[]) => {
        setChains(data)
        // Default select first 7 chains
        setSelectedChains(new Set(data.slice(0, 7).map(c => c.name)))
      })
      .catch(() => {
        // Fallback to hardcoded defaults
        const fallback: Chain[] = [
          { coin: 60,         name: 'eth',   label: 'Ethereum' },
          { coin: 2147492101, name: 'base',  label: 'Base'     },
          { coin: 0,          name: 'btc',   label: 'Bitcoin'  },
          { coin: 501,        name: 'sol',   label: 'Solana'   },
          { coin: 2147483658, name: 'op',    label: 'Optimism' },
          { coin: 2147525809, name: 'arb1',  label: 'Arbitrum' },
          { coin: 2147483785, name: 'matic', label: 'Polygon'  },
        ]
        setChains(fallback)
        setSelectedChains(new Set(fallback.map(c => c.name)))
      })
  }, [])

  // Chains modal: onChange receives full selected array
  const onChainsChange = (next: string[]) => setSelectedChains(new Set(next))

  const parseAddresses = (raw: string) =>
    raw.split('\n').map(l => l.trim()).filter(Boolean)

  // Build the effective query params — empty when useDefault is on
  const buildParams = () => {
    if (useDefault) return []
    const parts: string[] = []
    if (inclTexts && selectedTexts.length)
      parts.push(`texts=${selectedTexts.join(',')}`)
    if (inclAddresses && selectedChains.size)
      parts.push(`addresses=${[...selectedChains].join(',')}`)
    if (!inclContent)
      parts.push(`contenthash=false`)
    return parts
  }

  const resolveForward = async (name?: string) => {
    const q = (name ?? input).trim()
    if (!q) return
    setInput(q)
    setResolving(true)
    setForwardResult(null)
    setError(null)

    const qs = buildParams().join('&')
    try {
      const res  = await fetch(`${RESOLVIO_API}/ens/v2/profile/${q}${qs ? '?' + qs : ''}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? `HTTP ${res.status}`)
      setForwardResult(data)
      setRawJson(JSON.stringify(data, null, 2))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setResolving(false)
    }
  }

  const resolveReverse = async (prefill?: string) => {
    const addrs = parseAddresses(prefill ?? reverseInput)
    if (!addrs.length) return
    if (prefill) setReverseInput(prefill)
    setResolving(true)
    setReverseResult(null)
    setBulkResult(null)
    setError(null)

    try {
      if (addrs.length === 1) {
        const res  = await fetch(`${RESOLVIO_API}/ens/v2/reverse/${addrs[0]}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.message ?? `HTTP ${res.status}`)
        setReverseResult(data)
        setRawJson(JSON.stringify(data, null, 2))
      } else {
        const res  = await fetch(`${RESOLVIO_API}/ens/v2/reverse/bulk?addresses=${addrs.join(',')}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.message ?? `HTTP ${res.status}`)
        setBulkResult(data)
        setRawJson(JSON.stringify(data, null, 2))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setResolving(false)
    }
  }

  const hasResult = forwardResult !== null || reverseResult !== null || bulkResult !== null

  // curl command for the request preview
  const curlCmd = (() => {
    if (tab === 'reverse') {
      const addrs = parseAddresses(reverseInput)
      if (addrs.length > 1)
        return `curl ${RESOLVIO_API}/ens/v2/reverse/bulk?addresses=${addrs.join(',')}`
      return `curl ${RESOLVIO_API}/ens/v2/reverse/${addrs[0] || '<address>'}`
    }
    const q  = input.trim() || '<ens_name>'
    const qs = buildParams().join('&')
    return `curl ${RESOLVIO_API}/ens/v2/profile/${q}${qs ? '?' + qs : ''}`
  })()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <section id="playground" className={styles.outer}>

      <div className={styles.header}>
        <span className={styles.label}>Demo</span>
        <h2 className={styles.heading}>Try It Now</h2>
        <p className={styles.subtitle}>
          Test ENS resolution with real-time results. Enter any .eth name and see the magic happen.
        </p>
      </div>

      <div className={styles.gridOuter}>
      <div className={styles.grid}>

        {/* Card 1 — tabs */}
        <div className={cx(styles.cell, styles.full)}>
          <div className={styles.inner}>
            <div className={styles.tabs}>
              <button
                className={cx(styles.tab, tab === 'forward' && styles.tabActive)}
                onClick={() => { setTab('forward'); setForwardResult(null); setReverseResult(null); setBulkResult(null); setInput(''); setError(null); setRawJson('') }}
              >
                Forward Resolution
              </button>
              <button
                className={cx(styles.tab, tab === 'reverse' && styles.tabActive)}
                onClick={() => { setTab('reverse'); setForwardResult(null); setReverseResult(null); setBulkResult(null); setError(null); setRawJson('') }}
              >
                Reverse Resolution
              </button>
            </div>
          </div>
        </div>

        {/* Card 2 — request form */}
        <div className={styles.cell}>
          <div className={styles.inner}>
            {tab === 'forward' ? (
              <>
                <h3 className={styles.cardTitle}>Resolution Request</h3>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && resolveForward()}
                  placeholder="vitalik.eth"
                  className={styles.textInput}
                />
                <p className={styles.examplesLabel}>or try these examples</p>
                <div className={styles.chips}>
                  {FORWARD_EXAMPLES.map((ex) => (
                    <button key={ex} className={styles.chip} onClick={() => resolveForward(ex)}>{ex}</button>
                  ))}
                </div>

                <div className={styles.checkboxGroup}>

                  {/* Use Default */}
                  <label className={styles.checkboxRow}>
                    <div className={styles.checkboxLabelWrap}>
                      <p className={styles.checkboxLabel}>Use Default</p>
                      <div className={styles.infoWrap}>
                        <Info size={13} className={styles.infoIcon} />
                        <div className={styles.tooltip}>
                          <p>Returns the server default: 12 text keys (avatar, description, com.twitter, …), 8 chains (eth, base, btc, sol, op, arb1, matic, celo), and contenthash.</p>
                          <p>Disable to specify exactly which records you want.</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setUseDefault(!useDefault)}
                      className={cx(styles.checkbox, useDefault && styles.checkboxChecked)}
                    >
                      {useDefault && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
                    </button>
                  </label>

                  {/* Per-record controls — disabled when useDefault */}
                  <div className={cx(styles.recordControls, useDefault && styles.recordControlsDisabled)}>

                    {/* Addresses */}
                    <div className={styles.recordSection}>
                      <div className={styles.recordRow}>
                        <button
                          onClick={() => !useDefault && setInclAddresses(!inclAddresses)}
                          className={cx(styles.checkbox, inclAddresses && !useDefault && styles.checkboxChecked)}
                        >
                          {inclAddresses && !useDefault && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
                        </button>
                        <div className={styles.recordRowText}>
                          <p className={styles.checkboxLabel}>Addresses</p>
                          <p className={styles.checkboxSub}>
                            {inclAddresses && !useDefault ? `${selectedChains.size} chain${selectedChains.size !== 1 ? 's' : ''}` : 'disabled'}
                          </p>
                        </div>
                        {inclAddresses && !useDefault && (
                          <button className={styles.editBtn} onClick={() => setChainsModalOpen(true)}>
                            Edit
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Text Records */}
                    <div className={styles.recordSection}>
                      <div className={styles.recordRow}>
                        <button
                          onClick={() => !useDefault && setInclTexts(!inclTexts)}
                          className={cx(styles.checkbox, inclTexts && !useDefault && styles.checkboxChecked)}
                        >
                          {inclTexts && !useDefault && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
                        </button>
                        <div className={styles.recordRowText}>
                          <p className={styles.checkboxLabel}>Text Records</p>
                          <p className={styles.checkboxSub}>
                            {inclTexts && !useDefault ? `${selectedTexts.length} key${selectedTexts.length !== 1 ? 's' : ''}` : 'disabled'}
                          </p>
                        </div>
                        {inclTexts && !useDefault && (
                          <button className={styles.editBtn} onClick={() => setTextsModalOpen(true)}>
                            Edit
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Content Hash */}
                    <div className={styles.recordRow}>
                      <button
                        onClick={() => !useDefault && setInclContent(!inclContent)}
                        className={cx(styles.checkbox, inclContent && !useDefault && styles.checkboxChecked)}
                      >
                        {inclContent && !useDefault && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
                      </button>
                      <div className={styles.recordRowText}>
                        <p className={styles.checkboxLabel}>Content Hash</p>
                        <p className={styles.checkboxSub}>{inclContent && !useDefault ? 'enabled' : 'disabled'}</p>
                      </div>
                    </div>

                  </div>{/* end recordControls */}
                </div>{/* end checkboxGroup */}

                {/* Modals */}
                <RecordPickerModal
                  isOpen={chainsModalOpen}
                  onClose={() => setChainsModalOpen(false)}
                  title="Select Chains"
                  items={chainPickerItems}
                  selected={[...selectedChains]}
                  onChange={onChainsChange}
                />
                <RecordPickerModal
                  isOpen={textsModalOpen}
                  onClose={() => setTextsModalOpen(false)}
                  title="Select Text Records"
                  items={TEXT_PRESETS}
                  selected={selectedTexts}
                  onChange={setSelectedTexts}
                  allowCustom
                />

                <Button className={styles.resolveBtn} onClick={() => resolveForward()} disabled={resolving || !input.trim()}>
                  {resolving ? 'Resolving...' : 'Resolve ENS'}
                </Button>
              </>
            ) : (
              <>
                <h3 className={styles.cardTitle}>Reverse Resolution</h3>
                <p className={styles.examplesLabel} style={{ marginBottom: 6 }}>
                  One address per line, single or up to 20 addresses for bulk
                </p>
                <textarea
                  value={reverseInput}
                  onChange={(e) => setReverseInput(e.target.value)}
                  placeholder={'0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045\n0x225f137127d9067788314bc7fcc1f36746a3c3B5'}
                  className={styles.reverseTextarea}
                  rows={4}
                />
                <p className={styles.examplesLabel}>or try these examples</p>
                <div className={styles.chips}>
                  <button className={styles.chip} onClick={() => resolveReverse(REVERSE_EXAMPLES_SINGLE)}>
                    Single address
                  </button>
                  <button className={styles.chip} onClick={() => resolveReverse(REVERSE_EXAMPLES_BULK.join('\n'))}>
                    Bulk (2 addresses)
                  </button>
                </div>
                <Button
                  className={styles.resolveBtn}
                  onClick={() => resolveReverse()}
                  disabled={resolving || !reverseInput.trim()}
                >
                  {resolving ? 'Resolving...' : `Reverse Resolve${parseAddresses(reverseInput).length > 1 ? ` (${parseAddresses(reverseInput).length})` : ''}`}
                </Button>
              </>
            )}

            {/* Request preview */}
            <div className={styles.requestPreview}>
              <div className={styles.requestPreviewBar}>
                <span className={styles.terminalTitle}><Terminal size={13} />Terminal</span>
                <button className={styles.terminalCopy} onClick={() => copyToClipboard(curlCmd)}>
                  <Copy size={12} />{copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className={styles.requestPreviewBody}>
                <code className={styles.curlCode}>{curlCmd}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 — response */}
        <div className={styles.cell}>
          <div className={styles.inner}>
            <h3 className={styles.cardTitle}>Response</h3>
            <div className={styles.responseBox}>
              {!hasResult && !resolving && !error && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>
                    <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="36" y1="8" x2="36" y2="18" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round"/>
                      <circle cx="36" cy="7" r="3" fill="#93C5FD"/>
                      <rect x="14" y="18" width="44" height="34" rx="8" fill="#BFDBFE"/>
                      <circle cx="26" cy="32" r="5" fill="white"/><circle cx="46" cy="32" r="5" fill="white"/>
                      <circle cx="27" cy="33" r="2.5" fill="#60A5FA"/><circle cx="47" cy="33" r="2.5" fill="#60A5FA"/>
                      <circle cx="28" cy="31.5" r="1" fill="white"/><circle cx="48" cy="31.5" r="1" fill="white"/>
                      <rect x="24" y="42" width="24" height="4" rx="2" fill="#93C5FD"/>
                      <rect x="28" y="42" width="4" height="4" fill="white" rx="1"/>
                      <rect x="34" y="42" width="4" height="4" fill="white" rx="1"/>
                      <rect x="40" y="42" width="4" height="4" fill="white" rx="1"/>
                      <rect x="22" y="52" width="28" height="14" rx="4" fill="#BFDBFE"/>
                    </svg>
                  </div>
                  <p>Enter a name or address and click<br />Resolve to see results</p>
                </div>
              )}
              {resolving && (
                <div className={styles.emptyState}>
                  <div className={styles.dots}>
                    {[0,1,2].map(i => <span key={i} style={{ animationDelay: `${i * 0.15}s` }} />)}
                  </div>
                </div>
              )}
              {error && (
                <div className={styles.errorState}>
                  <p className={styles.errorMsg}>{error}</p>
                </div>
              )}

              {/* Forward result */}
              {forwardResult && (() => {
                const addrs   = forwardResult.addresses?.filter(a => a.exists) ?? []
                const texts   = forwardResult.texts?.filter(t => t.exists) ?? []
                const content = forwardResult.contenthash?.exists ? forwardResult.contenthash : null
                const isEmpty = addrs.length === 0 && texts.length === 0 && !content
                return (
                  <div className={styles.resultGroups}>
                    {isEmpty && (
                      <div className={styles.emptyRecords}>
                        <p className={styles.emptyRecordsText}>No records found for <strong>{forwardResult.name}</strong></p>
                      </div>
                    )}
                    {addrs.length > 0 && (
                      <div className={styles.resultGroup}>
                        <p className={styles.resultGroupLabel}>Addresses</p>
                        <div className={styles.recordBadges}>
                          {addrs.map(a => (
                            <RecordBadge
                              key={`${a.chain}-${a.coin}`}
                              label={a.chain?.toUpperCase() ?? String(a.coin)}
                              value={a.value!}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {texts.length > 0 && (
                      <div className={styles.resultGroup}>
                        <p className={styles.resultGroupLabel}>Text Records</p>
                        <div className={styles.recordBadges}>
                          {texts.map(t => (
                            <RecordBadge key={t.key} label={t.key} value={t.value!} />
                          ))}
                        </div>
                      </div>
                    )}
                    {content && (
                      <div className={styles.resultGroup}>
                        <p className={styles.resultGroupLabel}>Content Hash</p>
                        <div className={styles.recordBadges}>
                          <RecordBadge label="contenthash" value={content.value!} />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })()}

              {/* Reverse — single */}
              {reverseResult && (
                <div className={styles.resultGroups}>
                  <div className={styles.resultGroup}>
                    <p className={styles.resultGroupLabel}>Reverse Result</p>
                    <div className={styles.reverseCard}>
                      <p className={styles.reverseAddr}>{reverseResult.address}</p>
                      {reverseResult.hasReverseRecord
                        ? <p className={styles.reverseName}>{reverseResult.name}</p>
                        : <p className={styles.noRecord}>No reverse record</p>
                      }
                    </div>
                  </div>
                </div>
              )}

              {/* Reverse — bulk */}
              {bulkResult && (
                <div className={styles.resultGroups}>
                  <div className={styles.resultGroup}>
                    <p className={styles.resultGroupLabel}>Bulk Results ({bulkResult.addresses.length})</p>
                    {bulkResult.addresses.map((r) => (
                      <div key={r.address} className={styles.reverseCard}>
                        <p className={styles.reverseAddr}>{r.address}</p>
                        {r.hasReverseRecord
                          ? <p className={styles.reverseName}>{r.name}</p>
                          : <p className={styles.noRecord}>No reverse record</p>
                        }
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 4 — JSON toggle */}
        <div className={cx(styles.cell, styles.full)}>
          <div className={styles.inner}>
            <div className={styles.jsonToggleRow}>
              <span className={styles.jsonToggleLabel}><code>{'{ }'}</code> JSON response</span>
              <button onClick={() => setShowJson(!showJson)} className={cx(styles.toggle, showJson && styles.toggleOn)}>
                <span className={styles.toggleThumb} />
              </button>
            </div>
            {showJson && (
              <div className={styles.jsonTerminal}>
                <div className={styles.jsonTerminalBar}>
                  <div className={styles.terminalDots}>
                    <span /><span /><span />
                  </div>
                  <span className={styles.terminalTitle}>
                    <Terminal size={12} />
                    Response
                  </span>
                  <button className={styles.terminalCopy} onClick={() => copyToClipboard(rawJson)}>
                    <Copy size={12} />{copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className={styles.jsonTerminalBody}>
                  {rawJson
                    ? <SyntaxHighlighter language="json" style={githubGist} customStyle={{ margin: 0, background: 'transparent', padding: 0, fontSize: '0.8rem' }}>
                        {rawJson}
                      </SyntaxHighlighter>
                    : <span className={styles.jsonPlaceholder}>Run a query to see the JSON response here</span>
                  }
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
      </div>
    </section>
  )
}
