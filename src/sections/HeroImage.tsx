import { Network } from 'lucide-react'
import { Button } from '../components/ui/Button'
import styles from './HeroImage.module.scss'

export const HeroImage = () => {
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

        <p className={styles.subtitle}>Resolvio provides a complete identity resolution service through a single API. Built for every chain, wallet, app, and AI agent.</p>

        <div className={styles.actions}>
          <a href="#playground"><Button size="lg">Start Resolving</Button></a>
          <a href="#docs"><Button size="lg" variant="secondary">View Docs</Button></a>
        </div>
      </div>

    </section>
  )
}
