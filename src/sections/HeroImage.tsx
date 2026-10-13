import { RESOLVIO_DOCS } from '../constants/api'
import styles from './HeroImage.module.scss'

export const HeroImage = () => (
  <header className={styles.outer}>
    <div className={styles.intro}>
      <p className={styles.eyebrow}>Free ENS API · No key required</p>
      <h1>Resolve any ENS name or subname in one API call.</h1>
      <p className={styles.description}>
        A single API for chains, wallets, apps and agents that need ENS names,
        addresses and profiles.
      </p>
      <div className={styles.actions}>
        <a href="#playground">Start Resolving</a>
        <a href={RESOLVIO_DOCS}>View Docs</a>
      </div>
    </div>
    <div className={styles.note}>
      <span className={styles.name}>vitalik.eth</span>
      <span className={styles.rule} aria-hidden="true" />
      <span>Addresses, texts, contenthash.</span>
      <p>
        Try a real lookup below.
        <br /> No wallet or API key required.
      </p>
    </div>
  </header>
)
