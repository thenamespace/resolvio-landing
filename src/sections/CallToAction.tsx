import { ArrowRight } from 'lucide-react'
import { RESOLVIO_DOCS } from '../constants/api'
import styles from './CallToAction.module.scss'

export const CallToAction = () => (
  <section className={styles.outer} aria-label="Try Resolvio">
    <div className={styles.inner}>
      <div>
        <h2>Ready to resolve ENS names?</h2>
        <p>Free, no API key required. Resolve any ENS name or address with a single HTTP request.</p>
      </div>
      <div className={styles.actions}>
        <a href="/#playground" className={styles.primary}>Try Playground <ArrowRight size={16} aria-hidden="true" /></a>
        <a href={RESOLVIO_DOCS} className={styles.secondary}>Read the Docs</a>
      </div>
    </div>
  </section>
)
