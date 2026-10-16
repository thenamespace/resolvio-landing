import { useEffect, useRef, useState } from 'react'
import { Copy, Info, Terminal, ArrowRight, RotateCcw } from 'lucide-react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { Button } from '../components/ui/Button'
import { RecordPickerModal, type PickerItem } from '../components/ui/RecordPickerModal'
import styles from './TryItNow.module.scss'
import { cx } from '../utils/cx'
import { RESOLVIO_API } from '../constants/api'
import { buildRequest, curlCommand, type Operation } from './playground-request'

type Tab = 'forward' | 'reverse'
type ForwardMode = 'single' | 'bulk'

const FORWARD_EXAMPLES = ['vitalik.eth', 'jesse.xyz', 'artii.eth', 'cap.eth', 'kris.cash', 'thecap.base.eth', 'happy.rsk.eth']
const REVERSE_EXAMPLES_SINGLE = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
const REVERSE_EXAMPLES_BULK = [
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  '0x225f137127d9067788314bc7fcc1f36746a3c3B5',
]

const DEFAULT_TEXT_KEYS = ['avatar', 'header', 'email', 'description']

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

// Bulk forward returns ForwardResult[] directly

const RecordBadge = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopyFailed(false)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }).catch(() => setCopyFailed(true))
  }
  return (
    <button className={styles.recordBadge} onClick={copy} title={copyFailed ? 'Could not copy. Select and copy the value manually.' : value}>
      <span className={styles.recordBadgeLabel}>{copyFailed ? 'Copy failed' : label}</span>
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
  const [responseMs, setResponseMs]       = useState<number | null>(null)

  // Forward bulk mode
  const [forwardMode, setForwardMode]             = useState<ForwardMode>('single')
  const [bulkInput, setBulkInput]                 = useState('')
  const [bulkNames, setBulkNames]                 = useState<Set<string>>(new Set())
  const [bulkForwardResult, setBulkForwardResult] = useState<ForwardResult[] | null>(null)

  // Include toggles
  const [useDefault, setUseDefault]       = useState(true)
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

  const requestPending = useRef(false)

  // Derived: chain items for modal (populated after fetch)
  const chainPickerItems: PickerItem[] = chains.map(c => ({
    id: c.name, label: c.label, sublabel: c.name,
  }))

  // Fetch chains from API once
  useEffect(() => {
    if (chainsFetched.current) return
    chainsFetched.current = true
    fetch(`${RESOLVIO_API}/ens/v2/chains`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data: Chain[]) => {
        setChains(data)
        setSelectedChains(new Set(['eth', 'btc', 'base']))
      })
      .catch(() => {
        setError('Could not load the chain list. The picker shows a limited built-in list.')
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
        setSelectedChains(new Set(['eth', 'btc', 'base']))
      })
  }, [])

  // Chains modal: onChange receives full selected array
  const onChainsChange = (next: string[]) => setSelectedChains(new Set(next))

  const parseAddresses = (raw: string) =>
    raw.split(/[\n,]/).map(l => l.trim()).filter(Boolean)

  const requestUrl = (operation: Operation, value: string) => buildRequest(RESOLVIO_API, {
    operation,
    input: value,
    texts: !useDefault && inclTexts ? selectedTexts.join(',') : '',
    addresses: !useDefault && inclAddresses ? [...selectedChains].join(',') : '',
    contenthash: useDefault || inclContent,
  })

  const resolve = async (operation: Operation, value: string) => {
    if (requestPending.current) return
    setForwardResult(null)
    setBulkForwardResult(null)
    setReverseResult(null)
    setBulkResult(null)
    setRawJson('')
    setError(null)
    setResponseMs(null)
    let url: string
    try {
      url = requestUrl(operation, value)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Invalid request')
      return
    }
    requestPending.current = true
    setResolving(true)
    const started = performance.now()
    try {
      const response = await fetch(url)
      const body = await response.text()
      setRawJson(body)
      if (!response.ok) throw new Error(`Request failed (HTTP ${response.status}).`)
      const result = JSON.parse(body)
      setRawJson(JSON.stringify(result, null, 2))
      if (operation === 'profile') setForwardResult(result)
      else if (operation === 'bulk-profile') setBulkForwardResult(result)
      else if (operation === 'reverse') setReverseResult(result)
      else setBulkResult(result)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Request failed')
    } finally {
      setResponseMs(Math.round(performance.now() - started))
      requestPending.current = false
      setResolving(false)
    }
  }

  const resolveForward = (name = input) => {
    setInput(name.trim())
    return resolve('profile', name)
  }

  const resolveBulkForward = () => resolve('bulk-profile', [...bulkNames].join('\n'))

  const toggleBulkName = (name: string) => {
    setBulkNames(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const resolveReverse = (prefill?: string) => {
    const value = prefill ?? reverseInput
    if (prefill) setReverseInput(prefill)
    return resolve(parseAddresses(value).length > 1 ? 'bulk-reverse' : 'reverse', value)
  }

  const hasResult = forwardResult !== null || reverseResult !== null || bulkResult !== null || bulkForwardResult !== null
  const curlCmd = (() => {
    const operation = tab === 'reverse'
      ? (parseAddresses(reverseInput).length > 1 ? 'bulk-reverse' : 'reverse')
      : (forwardMode === 'bulk' ? 'bulk-profile' : 'profile')
    const value = tab === 'reverse' ? reverseInput : forwardMode === 'bulk' ? [...bulkNames].join('\n') : input
    try {
      return curlCommand(requestUrl(operation, value))
    } catch {
      // The preview is empty until the input passes the same validation as submission.
      return null
    }
  })()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }).catch(() => setError('Could not copy. Select the text and copy it manually.'))
  }

  return (
    <section id="playground" className={styles.outer}>

      <div className={styles.header}>
        <span className={styles.label}>Playground</span>
        <h2 className={styles.heading}>Try It Now</h2>
        <p className={styles.subtitle}>
          Test ENS profiles and reverse lookups using the public API.
        </p>
      </div>

      <div className={styles.gridOuter}>
      <div className={styles.grid}>

        {/* Card 1 — tabs */}
        <div className={cx(styles.cell, styles.full)}>
          <div className={styles.inner}>
            <div className={styles.tabs}>
              <button
                disabled={resolving}
                className={cx(styles.tab, tab === 'forward' && styles.tabActive)}
                onClick={() => { setTab('forward'); setForwardResult(null); setReverseResult(null); setBulkResult(null); setBulkForwardResult(null); setError(null); setRawJson('') }}
              >
                <ArrowRight size={14} />{' '}Forward Resolution
              </button>
              <button
                disabled={resolving}
                className={cx(styles.tab, tab === 'reverse' && styles.tabActive)}
                onClick={() => { setTab('reverse'); setForwardResult(null); setReverseResult(null); setBulkResult(null); setBulkForwardResult(null); setError(null); setRawJson('') }}
              >
                <RotateCcw size={14} />{' '}Reverse Resolution
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

                {/* Single: text input */}
                {forwardMode === 'single' && (
                  <input
                    disabled={resolving}
                    aria-label="ENS name"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && resolveForward()}
                    placeholder="vitalik.eth"
                    className={styles.textInput}
                  />
                )}

                {/* Bulk: text input + selected name tags */}
                {forwardMode === 'bulk' && (
                  <>
                    <input
                    disabled={resolving}
                    aria-label="Add ENS name to batch"
                      type="text"
                      value={bulkInput}
                      onChange={(e) => setBulkInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const v = bulkInput.trim()
                          if (v) { toggleBulkName(v); setBulkInput('') }
                        }
                      }}
                      placeholder="type name and press Enter"
                      className={styles.textInput}
                    />
                    {bulkNames.size > 0 && (
                      <div className={styles.bulkNamesList}>
                        {[...bulkNames].map(n => (
                          <span key={n} className={styles.bulkNameTag}>
                            {n}
                            <button disabled={resolving} onClick={() => toggleBulkName(n)}>×</button>
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}

                <p className={styles.examplesLabel}>
                  {forwardMode === 'bulk' ? 'or click to add examples' : 'or try these examples'}
                </p>
                <div className={styles.chips}>
                  {FORWARD_EXAMPLES.map((ex) => (
                    forwardMode === 'bulk'
                      ? <button disabled={resolving} key={ex} className={cx(styles.chip, bulkNames.has(ex) && styles.chipActive)} onClick={() => toggleBulkName(ex)}>{ex}</button>
                      : <button disabled={resolving} key={ex} className={styles.chip} onClick={() => resolveForward(ex)}>{ex}</button>
                  ))}
                </div>

                <div className={styles.checkboxGroup}>

                  {/* Bulk checkbox */}
                  <label className={styles.checkboxRow}>
                    <div className={styles.checkboxLabelWrap}>
                      <p className={styles.checkboxLabel}>Bulk Forward Resolve</p>
                      <div className={styles.infoWrap}>
                        <Info size={13} className={styles.infoIcon} />
                        <div className={styles.tooltip}>
                          <p>Resolve multiple ENS names in a single request. Type a name and press Enter, or click examples to add them to the list.</p>
                        </div>
                      </div>
                    </div>
                    <button
                      disabled={resolving}
                      aria-label="Bulk forward resolve"
                      aria-pressed={forwardMode === 'bulk'}
                      onClick={() => {
                        if (forwardMode === 'bulk') {
                          setForwardMode('single')
                          setBulkNames(new Set())
                          setBulkInput('')
                          setBulkForwardResult(null)
                          setRawJson('')
                        } else {
                          setForwardMode('bulk')
                          setForwardResult(null)
                          setRawJson('')
                        }
                      }}
                      className={cx(styles.checkbox, forwardMode === 'bulk' && styles.checkboxChecked)}
                    >
                      {forwardMode === 'bulk' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
                    </button>
                  </label>

                  {/* Use Default */}
                  <label className={styles.checkboxRow}>
                    <div className={styles.checkboxLabelWrap}>
                      <p className={styles.checkboxLabel}>Use Default</p>
                      <div className={styles.infoWrap}>
                        <Info size={13} className={styles.infoIcon} />
                        <div className={styles.tooltip}>
                          <p>Returns the server default: 12 text keys (avatar, description, com.twitter, …), 8 chains (eth, base, btc, sol, op, arb1, matic, celo), and contenthash.</p>
                          <p>Disable to choose filters. Empty address or text filters use API defaults.</p>
                        </div>
                      </div>
                    </div>
                    <button
                      disabled={resolving}
                      aria-label="Use default records"
                      aria-pressed={useDefault}
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
                          disabled={resolving}
                          aria-label="Address filter"
                          aria-pressed={inclAddresses}
                          onClick={() => !useDefault && setInclAddresses(!inclAddresses)}
                          className={cx(styles.checkbox, inclAddresses && !useDefault && styles.checkboxChecked)}
                        >
                          {inclAddresses && !useDefault && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
                        </button>
                        <div className={styles.recordRowText}>
                          <p className={styles.checkboxLabel}>Address filter</p>
                          <p className={styles.checkboxSub}>
                            {inclAddresses && !useDefault && selectedChains.size ? `${selectedChains.size} chain${selectedChains.size !== 1 ? 's' : ''}` : 'API default'}
                          </p>
                        </div>
                        {inclAddresses && !useDefault && (
                          <button disabled={resolving} className={styles.editBtn} onClick={() => setChainsModalOpen(true)}>Edit</button>
                        )}
                      </div>
                    </div>

                    {/* Text Records */}
                    <div className={styles.recordSection}>
                      <div className={styles.recordRow}>
                        <button
                          disabled={resolving}
                          aria-label="Text filter"
                          aria-pressed={inclTexts}
                          onClick={() => !useDefault && setInclTexts(!inclTexts)}
                          className={cx(styles.checkbox, inclTexts && !useDefault && styles.checkboxChecked)}
                        >
                          {inclTexts && !useDefault && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
                        </button>
                        <div className={styles.recordRowText}>
                          <p className={styles.checkboxLabel}>Text filter</p>
                          <p className={styles.checkboxSub}>
                            {inclTexts && !useDefault && selectedTexts.length ? `${selectedTexts.length} key${selectedTexts.length !== 1 ? 's' : ''}` : 'API default'}
                          </p>
                        </div>
                        {inclTexts && !useDefault && (
                          <button disabled={resolving} className={styles.editBtn} onClick={() => setTextsModalOpen(true)}>Edit</button>
                        )}
                      </div>
                    </div>

                    {/* Content Hash */}
                    <div className={styles.recordRow}>
                      <button
                        disabled={resolving}
                        aria-label="Content hash"
                          aria-pressed={inclContent}
                          onClick={() => !useDefault && setInclContent(!inclContent)}
                        className={cx(styles.checkbox, inclContent && !useDefault && styles.checkboxChecked)}
                      >
                        {inclContent && !useDefault && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
                      </button>
                      <div className={styles.recordRowText}>
                        <p className={styles.checkboxLabel}>Content Hash</p>
                        <p className={styles.checkboxSub}>{useDefault || inclContent ? 'enabled' : 'disabled'}</p>
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

                {forwardMode === 'single' ? (
                  <Button className={styles.resolveBtn} onClick={() => resolveForward()} disabled={resolving || !input.trim()}>
                    {resolving ? 'Resolving...' : 'Resolve ENS'}
                  </Button>
                ) : (
                  <Button className={styles.resolveBtn} onClick={resolveBulkForward} disabled={resolving || bulkNames.size === 0}>
                    {resolving ? 'Resolving...' : `Resolve${bulkNames.size > 0 ? ` (${bulkNames.size})` : ''}`}
                  </Button>
                )}
              </>
            ) : (
              <>
                <h3 className={styles.cardTitle}>Reverse Resolution</h3>
                <p className={styles.examplesLabel} style={{ marginBottom: 6 }}>
                  One address per line, single or up to 20 addresses for bulk
                </p>
                <textarea
                  disabled={resolving}
                  aria-label="Ethereum addresses"
                  onKeyDown={(event) => { if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); void resolveReverse() } }}
                  value={reverseInput}
                  onChange={(e) => setReverseInput(e.target.value)}
                  placeholder={'0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045\n0x225f137127d9067788314bc7fcc1f36746a3c3B5'}
                  className={styles.reverseTextarea}
                  rows={4}
                />
                <p className={styles.examplesLabel}>or try these examples</p>
                <div className={styles.chips}>
                  <button disabled={resolving} className={styles.chip} onClick={() => resolveReverse(REVERSE_EXAMPLES_SINGLE)}>
                    Single address
                  </button>
                  <button disabled={resolving} className={styles.chip} onClick={() => resolveReverse(REVERSE_EXAMPLES_BULK.join('\n'))}>
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
                {curlCmd && (
                  <button className={styles.terminalCopy} onClick={() => copyToClipboard(curlCmd)}>
                    <Copy size={12} />{copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              <div className={styles.requestPreviewBody}>
                {curlCmd
                  ? <code className={styles.curlCode}>{curlCmd}</code>
                  : <span className={styles.curlPlaceholder}>Type a name to start...</span>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 — response */}
        <div className={styles.cell}>
          <div className={styles.inner}>
            <div className={styles.responseHeader}>
              <h3 className={styles.cardTitle}>Response</h3>
              {responseMs !== null && (
                <span className={styles.responseMs}>{responseMs} ms</span>
              )}
            </div>
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
                <div className={styles.errorState} role="alert">
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

              {/* Forward bulk result */}
              {bulkForwardResult && (
                <div className={styles.resultGroups}>
                  {bulkForwardResult.map((profile, i) => {
                    const addrs   = profile.addresses?.filter(a => a.exists) ?? []
                    const texts   = profile.texts?.filter(t => t.exists) ?? []
                    const content = profile.contenthash?.exists ? profile.contenthash : null
                    const isEmpty = addrs.length === 0 && texts.length === 0 && !content
                    return (
                      <div key={i} className={styles.bulkProfileCard}>
                        <p className={styles.bulkProfileName}>{profile.name ?? `Result ${i + 1}`}</p>
                        {isEmpty ? (
                          <p className={styles.noRecord}>No records found</p>
                        ) : (
                          <>
                            {addrs.length > 0 && <div className={styles.recordBadges}>{addrs.map(a => <RecordBadge key={`${a.chain}-${a.coin}`} label={a.chain?.toUpperCase() ?? String(a.coin)} value={a.value!} />)}</div>}
                            {texts.length > 0 && <div className={styles.recordBadges}>{texts.map(t => <RecordBadge key={t.key} label={t.key} value={t.value!} />)}</div>}
                            {content && <div className={styles.recordBadges}><RecordBadge label="contenthash" value={content.value!} /></div>}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

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
              <button aria-label="Show JSON response" aria-pressed={showJson} onClick={() => setShowJson(!showJson)} className={cx(styles.toggle, showJson && styles.toggleOn)}>
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
