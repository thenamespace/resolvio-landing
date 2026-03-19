import { Github, Mail } from 'lucide-react'
import logo from '../assets/logo.svg'
import styles from './Footer.module.scss'

const PRODUCT_LINKS = ['Playground', 'Api Docs', 'Pricing', 'Solutions']
const RESOURCE_LINKS = ['Documentation', 'Guides', 'Blog', 'Support']

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

export const Footer = () => (
  <footer className={styles.outer}>
    <div className={styles.gridOuter}>
      <div className={styles.grid}>

        {/* Brand cell */}
        <div className={styles.cell}>
          <div className={styles.inner}>
            <a href="/" className={styles.logo}>
              <img src={logo} alt="Resolvio" height={28} />
            </a>
            <p className={styles.tagline}>
              Universal Web3 name resolution service. Resolve ENS, DNS, and other naming systems through a single, powerful API.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialBtn} aria-label="GitHub"><Github size={16} /></a>
              <a href="#" className={styles.socialBtn} aria-label="X"><XIcon /></a>
              <a href="#" className={styles.socialBtn} aria-label="Email"><Mail size={16} /></a>
            </div>
          </div>
        </div>

        {/* Product cell */}
        <div className={styles.cell}>
          <div className={styles.inner}>
            <p className={styles.colHeading}>Product</p>
            <nav className={styles.links}>
              {PRODUCT_LINKS.map((l) => <a key={l} href="#" className={styles.link}>{l}</a>)}
            </nav>
          </div>
        </div>

        {/* Resources cell */}
        <div className={styles.cell}>
          <div className={styles.inner}>
            <p className={styles.colHeading}>Resources</p>
            <nav className={styles.links}>
              {RESOURCE_LINKS.map((l) => <a key={l} href="#" className={styles.link}>{l}</a>)}
            </nav>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <span className={styles.copyright}>© 2025 Resolvio. All rights reserved.</span>
        <div className={styles.legal}>
          <a href="#" className={styles.legalLink}>Privacy Policy</a>
          <span className={styles.divider}>/</span>
          <a href="#" className={styles.legalLink}>Terms of Service</a>
          <span className={styles.divider}>/</span>
          <a href="#" className={styles.legalLink}>Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
)
