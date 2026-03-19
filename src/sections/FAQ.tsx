import { useState, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './FAQ.module.scss'
import { cx } from '../utils/cx'

const ITEMS = [
  {
    q: 'What Is ENS?',
    a: 'The Ethereum Name Service (ENS) maps human-readable names to blockchain addresses, metadata, and content.',
  },
  {
    q: 'What Does Namespace Do?',
    a: 'Namespace is a universal Web3 name resolution service that resolves ENS names and other naming systems across multiple blockchain networks.',
  },
  {
    q: 'What Are ENS Subnames?',
    a: 'ENS subnames are human-readable names that exist under a parent ENS name (e.g. alice.yourname.eth), allowing communities and apps to issue names under their own domain.',
  },
  {
    q: 'Types Of Subnames?',
    a: 'There are two main types: onchain subnames (stored directly on the Ethereum blockchain) and offchain subnames (stored off-chain using CCIP-Read, which is cheaper and faster).',
  },
  {
    q: 'Difference Between Onchain And Offchain Subnames?',
    a: 'Onchain subnames are fully trustless and stored on Ethereum, while offchain subnames are managed by a resolver off-chain — they cost less gas but rely on an external data source.',
  },
]

const AccordionItem = ({ item, isOpen, onToggle }: { item: typeof ITEMS[0]; isOpen: boolean; onToggle: () => void }) => {
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
        <div className={styles.answer}>
          <p>{item.a}</p>
        </div>
      </div>
    </div>
  )
}

export const FAQ = () => {
  const [open, setOpen] = useState<number>(0)

  return (
    <section className={styles.outer}>
      <div className={styles.header}>
        <span className={styles.label}>FAQ</span>
        <h2 className={styles.heading}>Frequently Asked Questions</h2>
      </div>

      <div className={styles.gridOuter}>
        <div className={styles.grid}>
          {ITEMS.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={i} className={styles.cell}>
                <AccordionItem item={item} isOpen={isOpen} onToggle={() => setOpen(isOpen ? -1 : i)} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
