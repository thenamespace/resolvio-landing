import { useEffect, useState } from 'react'
import { Network } from 'lucide-react'
import { Button } from '../components/ui/Button'
import styles from './HeroImage.module.scss'

const EXAMPLES = [
  {
    name: 'vitalik.eth',
    avatar: 'https://euc.li/vitalik.eth',
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    twitter: 'VitalikButerin',
    email: null,
  },
  {
    name: 'nick.eth',
    avatar: 'https://euc.li/nick.eth',
    address: '0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5',
    twitter: 'nicksdjohnson',
    email: 'nick@ens.domains',
  },
  {
    name: 'brantly.eth',
    avatar: 'https://euc.li/brantly.eth',
    address: '0x983110309620D911731Ac0932219af06091b6744',
    twitter: 'brantlymillegan',
    email: null,
  },
]

export const HeroImage = () => {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % EXAMPLES.length)
        setVisible(true)
      }, 400)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  const ex = EXAMPLES[idx]

  return (
    <section className={styles.outer}>

      <div className={styles.inner}>
        <div className={styles.badge}>
          <span>Universal Web3 Name Resolution</span>
          <Network size={16} strokeWidth={2.5} />
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
            <span className={styles.codeWindowTitle}>GET /resolve/{ex.name}</span>
          </div>
          <pre className={styles.codeBody}>
            <code className={`${visible ? styles.codeVisible : styles.codeHidden}`}>
              <span className={styles.punct}>{'{'}</span>{'\n'}
              {'  '}<span className={styles.key}>"name"</span><span className={styles.punct}>:</span> <span className={styles.str}>"{ex.name}"</span><span className={styles.punct}>,</span>{'\n'}
              {'  '}<span className={styles.key}>"address"</span><span className={styles.punct}>:</span> <span className={styles.str}>"{ex.address}"</span><span className={styles.punct}>,</span>{'\n'}
              {'  '}<span className={styles.key}>"texts"</span><span className={styles.punct}>:</span> <span className={styles.punct}>{'{'}</span>{'\n'}
              {'    '}<span className={styles.key}>"avatar"</span><span className={styles.punct}>:</span> <span className={styles.str}>"{ex.avatar}"</span><span className={styles.punct}>,</span>{'\n'}
              {'    '}<span className={styles.key}>"com.twitter"</span><span className={styles.punct}>:</span> <span className={styles.str}>"{ex.twitter}"</span>
              {ex.email && (<><span className={styles.punct}>,</span>{'\n'}{'    '}<span className={styles.key}>"email"</span><span className={styles.punct}>:</span> <span className={styles.str}>"{ex.email}"</span></>)}
              {'\n'}
              {'  '}<span className={styles.punct}>{'}'}</span><span className={styles.punct}>,</span>{'\n'}
              {'  '}<span className={styles.key}>"resolvedIn"</span><span className={styles.punct}>:</span> <span className={styles.num}>42</span><span className={styles.punct}>,</span>{'\n'}
              {'  '}<span className={styles.key}>"cached"</span><span className={styles.punct}>:</span> <span className={styles.bool}>true</span>{'\n'}
              <span className={styles.punct}>{'}'}</span>
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
