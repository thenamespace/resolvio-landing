import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/ui/Button'
import styles from './HeroImage.module.scss'

type AddrItem  = { coin: number; chain: string; value: string; exists: boolean }
type TextItem  = { key: string; value?: string; exists: boolean }
type ContenthashItem = { value?: string; exists: boolean }
type BulkReverseItem = { address: string; hasReverseRecord: boolean; name?: string }
type Example =
  | { kind: 'forward'; name: string; addresses: AddrItem[]; texts: TextItem[]; contenthash: ContenthashItem; resolver: string }
  | { kind: 'bulk-reverse'; items: BulkReverseItem[] }

const EXAMPLES: Example[] = [
  {
    kind: 'forward',
    name: 'artii.eth',
    addresses: [
      { coin: 60,         chain: 'eth',  value: '0x1D84ad46F1ec91b4Bb3208F645aD2fA7aBEc19f8', exists: true },
      { coin: 2147492101, chain: 'base', value: '0x1D84ad46F1ec91b4Bb3208F645aD2fA7aBEc19f8', exists: true },
    ],
    texts: [
      { key: 'avatar',     value: 'https://avatars.namespace.ninja/artii.eth', exists: true },
      { key: 'email',      value: 'arthy@namespace.ninja',                     exists: true },
      { key: 'com.github', value: 'nenadmitt',                                 exists: true },
    ],
    contenthash: { value: 'ipfs://bafybeid7gdz...fjgha', exists: true },
    resolver: '0x0dcD506D1Be162E50A2b434028A9a148F2686444',
  },
  {
    kind: 'forward',
    name: 'thecap.eth',
    addresses: [
      { coin: 60, chain: 'eth', value: '0x035eBd096AFa6b98372494C7f08f3402324117D3', exists: true },
      { coin: 0,  chain: 'btc', value: 'bc1qjquld863z3yfg...gd6n',                   exists: true },
    ],
    texts: [
      { key: 'description', value: 'builder, thinker, investor, optimist', exists: true },
      { key: 'com.twitter', value: 'TheCapHimself',                        exists: true },
      { key: 'avatar',      value: 'https://euc.li/thecap.eth',            exists: true },
    ],
    contenthash: { value: 'ipfs://bafybeidn...cxjdi', exists: true },
    resolver: '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63',
  },
  {
    kind: 'forward',
    name: 'nick.eth',
    addresses: [
      { coin: 60, chain: 'eth', value: '0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5', exists: true },
    ],
    texts: [
      { key: 'email',       value: 'nick@ens.domains',       exists: true },
      { key: 'com.twitter', value: 'nicksdjohnson',          exists: true },
      { key: 'avatar',      value: 'https://euc.li/nick.eth', exists: true },
    ],
    contenthash: { exists: false },
    resolver: '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63',
  },
  {
    kind: 'forward',
    name: 'brantly.eth',
    addresses: [
      { coin: 60, chain: 'eth', value: '0x983110309620D911731Ac0932219af06091b6744', exists: true },
    ],
    texts: [
      { key: 'com.twitter', value: 'brantlymillegan',            exists: true },
      { key: 'avatar',      value: 'https://euc.li/brantly.eth', exists: true },
      { key: 'url',         value: 'https://brantly.eth.limo',   exists: true },
    ],
    contenthash: { exists: false },
    resolver: '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63',
  },
  {
    kind: 'bulk-reverse',
    items: [
      { address: '0x1D84ad46F1ec91b4Bb3208F645aD2fA7aBEc19f8', hasReverseRecord: true, name: 'artii.eth'  },
      { address: '0x035eBd096AFa6b98372494C7f08f3402324117D3', hasReverseRecord: true, name: 'thecap.eth' },
    ],
  },
]

const short = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-5)}`

export const HeroImage = () => {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const [hovered, setHovered] = useState(false)
  const hoveredRef = useRef(false)
  const codeRef = useRef<HTMLPreElement>(null)

  useEffect(() => { hoveredRef.current = hovered }, [hovered])

  useEffect(() => {
    const timer = setInterval(() => {
      if (hoveredRef.current) return
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % EXAMPLES.length)
        setVisible(true)
      }, 400)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  // Scroll to top after each example loads
  useEffect(() => {
    const el = codeRef.current
    if (!el) return
    const raf = requestAnimationFrame(() => { el.scrollTop = 0 })
    return () => cancelAnimationFrame(raf)
  }, [idx])

  const ex = EXAMPLES[idx]

  return (
    <section className={styles.outer}>

      <div className={styles.inner}>
        <div className={styles.badge}>
          <span>Universal Web3 Name Resolution</span>
        </div>

        <h1 className={styles.heading}>
          Resolve Web3 Identities.<br />One API. Every namespace.
        </h1>

        <p className={styles.subtitle}>Complete identity resolution service through a single API. Built for chains, wallets, apps, and agents.</p>

        <div className={styles.codeWindow}>
          <div className={styles.codeWindowBar}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.codeWindowTitle}>
              {ex.kind === 'forward'
                ? `GET /ens/v2/profile/${ex.name}`
                : `GET /ens/v2/reverse/bulk?addresses=${ex.items.map(it => short(it.address)).join(',')}`}
            </span>
          </div>
          <pre
            ref={codeRef}
            className={`${styles.codeBody} ${hovered ? styles.codeBodyHovered : ''}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <code className={`${visible ? styles.codeVisible : styles.codeHidden}`}>
              {ex.kind === 'bulk-reverse' ? (
                <>
                  <span className={styles.punct}>{'{'}</span>{'\n'}
                  {'  '}<span className={styles.key}>"result"</span><span className={styles.punct}>: [</span>{'\n'}
                  {ex.items.map((item, i) => (
                    <span key={item.address}>
                      {'    '}<span className={styles.punct}>{'{'}</span>{'\n'}
                      {'      '}<span className={styles.key}>"address"</span><span className={styles.punct}>: </span><span className={styles.str}>"{short(item.address)}"</span><span className={styles.punct}>,</span>{'\n'}
                      {'      '}<span className={styles.key}>"hasReverseRecord"</span><span className={styles.punct}>: </span><span className={styles.bool}>{String(item.hasReverseRecord)}</span><span className={styles.punct}>,</span>{'\n'}
                      {'      '}<span className={styles.key}>"name"</span><span className={styles.punct}>: </span>
                      {item.name ? <span className={styles.str}>"{item.name}"</span> : <span className={styles.bool}>null</span>}
                      {'\n'}
                      {'    '}<span className={styles.punct}>{'}'}</span>{i < ex.items.length - 1 ? <span className={styles.punct}>,</span> : null}{'\n'}
                    </span>
                  ))}
                  {'  '}<span className={styles.punct}>{']'}</span>{'\n'}
                  <span className={styles.punct}>{'}'}</span>
                </>
              ) : (
                <>
                  <span className={styles.punct}>{'{'}</span>{'\n'}
                  {'  '}<span className={styles.key}>"name"</span><span className={styles.punct}>: </span><span className={styles.str}>"{ex.name}"</span><span className={styles.punct}>,</span>{'\n'}
                  {'  '}<span className={styles.key}>"addresses"</span><span className={styles.punct}>: [</span>{'\n'}
                  {ex.addresses.map((a, i) => (
                    <span key={a.chain}>
                      {'    '}<span className={styles.punct}>{'{'}</span>{'\n'}
                      {'      '}<span className={styles.key}>"coin"</span><span className={styles.punct}>: </span><span className={styles.num}>{a.coin}</span><span className={styles.punct}>,</span>{'\n'}
                      {'      '}<span className={styles.key}>"chain"</span><span className={styles.punct}>: </span><span className={styles.str}>"{a.chain}"</span><span className={styles.punct}>,</span>{'\n'}
                      {'      '}<span className={styles.key}>"value"</span><span className={styles.punct}>: </span><span className={styles.str}>"{short(a.value)}"</span><span className={styles.punct}>,</span>{'\n'}
                      {'      '}<span className={styles.key}>"exists"</span><span className={styles.punct}>: </span><span className={styles.bool}>true</span>{'\n'}
                      {'    '}<span className={styles.punct}>{'}'}</span>{i < ex.addresses.length - 1 ? <span className={styles.punct}>,</span> : null}{'\n'}
                    </span>
                  ))}
                  {'  '}<span className={styles.punct}>{']'}</span><span className={styles.punct}>,</span>{'\n'}
                  {'  '}<span className={styles.key}>"texts"</span><span className={styles.punct}>: [</span>{'\n'}
                  {ex.texts.map((t, i) => (
                    <span key={t.key}>
                      {'    '}<span className={styles.punct}>{'{'}</span>{'\n'}
                      {'      '}<span className={styles.key}>"key"</span><span className={styles.punct}>: </span><span className={styles.str}>"{t.key}"</span><span className={styles.punct}>,</span>{'\n'}
                      {'      '}<span className={styles.key}>"value"</span><span className={styles.punct}>: </span><span className={styles.str}>"{t.value}"</span><span className={styles.punct}>,</span>{'\n'}
                      {'      '}<span className={styles.key}>"exists"</span><span className={styles.punct}>: </span><span className={styles.bool}>true</span>{'\n'}
                      {'    '}<span className={styles.punct}>{'}'}</span>{i < ex.texts.length - 1 ? <span className={styles.punct}>,</span> : null}{'\n'}
                    </span>
                  ))}
                  {'  '}<span className={styles.punct}>{']'}</span><span className={styles.punct}>,</span>{'\n'}
                  {'  '}<span className={styles.key}>"contenthash"</span><span className={styles.punct}>: {'{'}</span>{'\n'}
                  {ex.contenthash.exists && (
                    <>{'      '}<span className={styles.key}>"value"</span><span className={styles.punct}>: </span><span className={styles.str}>"{ex.contenthash.value}"</span><span className={styles.punct}>,</span>{'\n'}</>
                  )}
                  {'      '}<span className={styles.key}>"exists"</span><span className={styles.punct}>: </span><span className={styles.bool}>{String(ex.contenthash.exists)}</span>{'\n'}
                  {'  '}<span className={styles.punct}>{'}'}</span><span className={styles.punct}>,</span>{'\n'}
                  {'  '}<span className={styles.key}>"resolver"</span><span className={styles.punct}>: </span><span className={styles.str}>"{short(ex.resolver)}"</span>{'\n'}
                  <span className={styles.punct}>{'}'}</span>
                </>
              )}
            </code>
          </pre>
        </div>

        <div className={styles.actions}>
          <a href="#playground"><Button size="lg">Start Resolving</Button></a>
          <a href="#docs"><Button size="lg" variant="secondary">View Docs</Button></a>
        </div>
      </div>

    </section>
  )
}
