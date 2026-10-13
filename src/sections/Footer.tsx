import { RESOLVIO_DOCS, RESOLVIO_REPO } from '../constants/api'
import styles from './Footer.module.scss'

export const Footer = () => (
  <footer className={styles.outer}>
    <div className={styles.inner}>
      <p>
        Resolvio is built by <a href="https://namespace.ninja">Namespace</a>.
      </p>
      <nav aria-label="Footer navigation">
        <a href={RESOLVIO_DOCS}>Docs</a>
        <a href={RESOLVIO_REPO}>GitHub</a>
        <a href="/blog">Blog</a>
        <a href="https://app.namespace.ninja">Namespace app</a>
        <a href="/terms">Terms</a>
        <a href="/privacy">Privacy</a>
      </nav>
    </div>
  </footer>
)
