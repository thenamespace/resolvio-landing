import { useState } from 'react'
import { Button } from '../components/ui/Button'
import styles from './TryItNow.module.scss'
import { cx } from '../utils/cx'

type Tab = 'forward' | 'reverse'

const EXAMPLES = ['artii.eth', 'thecap.eth', 'happy.rsk.eth', 'vitalik.eth']

const MOCK_RESPONSE = {
  addresses: [
    { coin: 'ETH', address: '0xd8dA6BF26964aF9D7e69e033E5315D37a496045' },
    { coin: 'BTC', address: '0x038e8...3411703' },
  ],
  textRecords: [
    { key: 'name',   value: 'https://punks.namespace.ninja/punk_610.jpg' },
    { key: 'avatar', value: 'https://punks.namespace.ninja/punk_610.jpg' },
  ],
  contentHash: [
    { type: 'IPFS', value: 'https://punks.namespace.ninja/punk_610.jpg' },
  ],
}

const JSON_RESPONSE = `{
  "name": "vitalik.eth",
  "addresses": {
    "address": "0xd8dA6BF26964aF9D7e69e033E5315D37a496045",
    "coin": 60,
    "name": "eth"
  },
  "texts": {
    "key": "description",
    "value": "Ethereum co-founder"
  },
  "key": "avatar",
  "value": "https://euc.li/vitalik.eth"
}`

export const TryItNow = () => {
  const [tab, setTab]                   = useState<Tab>('forward')
  const [input, setInput]               = useState('')
  const [reverseInput, setReverseInput] = useState('')
  const [resolving, setResolving]       = useState(false)
  const [result, setResult]             = useState<typeof MOCK_RESPONSE | null>(null)
  const [showJson, setShowJson]         = useState(false)
  const [inclAddresses, setInclAddresses] = useState(true)
  const [inclTexts, setInclTexts]         = useState(true)
  const [inclContent, setInclContent]     = useState(false)

  const resolve = (name?: string) => {
    const q = name ?? input
    if (!q.trim()) return
    setInput(q)
    setResolving(true)
    setResult(null)
    setTimeout(() => { setResult(MOCK_RESPONSE); setResolving(false) }, 700)
  }

  return (
    <section className={styles.outer}>

      {/* Header text */}
      <div className={styles.header}>
        <span className={styles.label}>Demo</span>
        <h2 className={styles.heading}>Try It Now</h2>
        <p className={styles.subtitle}>
          Test ENS resolution with real-time results. Enter any .eth name and see the magic happen.
        </p>
      </div>

      {/* 4-card grid */}
      <div className={styles.gridOuter}>
      <div className={styles.grid}>

        {/* Card 1 — full width: tabs */}
        <div className={cx(styles.cell, styles.full)}>
          <div className={styles.inner}>
            <div className={styles.tabs}>
              <button
                className={cx(styles.tab, tab === 'forward' && styles.tabActive)}
                onClick={() => { setTab('forward'); setResult(null); setInput('') }}
              >
                Forward Resolution
              </button>
              <button
                className={cx(styles.tab, tab === 'reverse' && styles.tabActive)}
                onClick={() => { setTab('reverse'); setResult(null) }}
              >
                Reverse Resolution
              </button>
            </div>
          </div>
        </div>

        {/* Card 2 — 50%: request form */}
        <div className={styles.cell}>
          <div className={styles.inner}>
            {tab === 'forward' ? (
              <>
                <h3 className={styles.cardTitle}>Resolution Request</h3>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && resolve()}
                  placeholder="ens_name.eth"
                  className={styles.textInput}
                />
                <p className={styles.examplesLabel}>or try these examples</p>
                <div className={styles.chips}>
                  {EXAMPLES.map((ex) => (
                    <button key={ex} className={styles.chip} onClick={() => resolve(ex)}>{ex}</button>
                  ))}
                </div>
                <div className={styles.checkboxGroup}>
                  <p className={styles.checkboxGroupTitle}>Include in Response</p>
                  {[
                    { label: 'Addresses',    sub: 'ETH, BTC, etc.',          val: inclAddresses, set: setInclAddresses },
                    { label: 'Text Records', sub: 'email, url, avatar, etc.', val: inclTexts,     set: setInclTexts },
                    { label: 'Content Hash', sub: 'IPFS, Swarm',              val: inclContent,   set: setInclContent },
                  ].map(({ label, sub, val, set }) => (
                    <label key={label} className={styles.checkboxRow}>
                      <div>
                        <p className={styles.checkboxLabel}>{label}</p>
                        <p className={styles.checkboxSub}>{sub}</p>
                      </div>
                      <button
                        onClick={() => set(!val)}
                        className={cx(styles.checkbox, val && styles.checkboxChecked)}
                      >
                        {val && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
                      </button>
                    </label>
                  ))}
                </div>
                <Button className={styles.resolveBtn} onClick={() => resolve()} disabled={resolving || !input.trim()}>
                  {resolving ? 'Resolving...' : 'Resolve ENS'}
                </Button>
              </>
            ) : (
              <>
                <h3 className={styles.cardTitle}>Addresses to Resolve</h3>
                <input
                  type="text"
                  value={reverseInput}
                  onChange={(e) => setReverseInput(e.target.value)}
                  placeholder="Enter address"
                  className={styles.textInput}
                />
                <p className={styles.examplesLabel}>or try these examples</p>
                <div className={styles.chips}>
                  {EXAMPLES.map((ex) => (
                    <button key={ex} className={styles.chip} onClick={() => setReverseInput(ex)}>{ex}</button>
                  ))}
                </div>
                <Button className={styles.resolveBtn}>Reverse Resolve</Button>
              </>
            )}
          </div>
        </div>

        {/* Card 3 — 50%: response */}
        <div className={styles.cell}>
          <div className={styles.inner}>
            <h3 className={styles.cardTitle}>Response</h3>
            <div className={styles.responseBox}>
              {!result && !resolving && (
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
                  <p>Enter an ENS name and click<br />Resolve to see results</p>
                </div>
              )}
              {resolving && (
                <div className={styles.emptyState}>
                  <div className={styles.dots}>
                    {[0,1,2].map(i => <span key={i} style={{ animationDelay: `${i * 0.15}s` }} />)}
                  </div>
                </div>
              )}
              {result && !showJson && (
                <div className={styles.resultList}>
                  {inclAddresses && result.addresses.map(a => (
                    <div key={a.coin} className={styles.resultRow}>
                      <span className={styles.coin}>{a.coin}</span>
                      <span className={styles.address}>{a.address}</span>
                    </div>
                  ))}
                  {inclTexts && result.textRecords.map(t => (
                    <div key={t.key} className={styles.resultRow}>
                      <span className={styles.coin}>{t.key}</span>
                      <span className={styles.address}>{t.value}</span>
                    </div>
                  ))}
                  {inclContent && result.contentHash.map(c => (
                    <div key={c.type} className={styles.resultRow}>
                      <span className={styles.coin}>{c.type}</span>
                      <span className={styles.address}>{c.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {result && showJson && (
                <pre className={styles.jsonBlock}><code>{JSON_RESPONSE}</code></pre>
              )}
            </div>
          </div>
        </div>

        {/* Card 4 — full width: JSON toggle */}
        <div className={cx(styles.cell, styles.full)}>
          <div className={styles.inner}>
            <div className={styles.jsonToggleRow}>
              <span className={styles.jsonToggleLabel}><code>{'{ }'}</code> JSON response</span>
              <button
                onClick={() => setShowJson(!showJson)}
                className={cx(styles.toggle, showJson && styles.toggleOn)}
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>
          </div>
        </div>

      </div>
      </div>
    </section>
  )
}
