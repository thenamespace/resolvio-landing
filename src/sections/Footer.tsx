import { Github } from 'lucide-react'
import logo from '../assets/logo.svg'
import styles from './Footer.module.scss'

const PRODUCT_LINKS = [
  { label: 'Resolvio Playground',     href: '#playground' },
  { label: 'Offchain Subnames',       href: 'https://docs.namespace.ninja/developer-guide/guide/create-offchain-subnames' },
  { label: 'Onchain Subnames',        href: 'https://docs.namespace.ninja/developer-guide/guide/mint-l1-l2-subnames'     },
  { label: 'ENS Resolver for Sheets', href: 'https://github.com/thenamespace/ens-sheets'                                 },
  { label: 'ENS Widget',              href: 'https://docs.namespace.ninja/user-guide/ens-widget'                         },
  { label: 'ENS MCP Server',          href: 'https://github.com/thenamespace/ens-mcp'                                    },
  { label: 'Custom Solutions',        href: '#'                                                                           },
]

const RESOURCE_LINKS = [
  { label: 'Blog',           href: 'https://paragraph.com/@namespace'          },
  { label: 'Resolvio Docs',  href: 'https://api.resolvio.xyz/api-docs'         },
  { label: 'Resolvio Repo',  href: 'https://github.com/thenamespace/resolvio'  },
  { label: 'Subname Docs',   href: 'https://docs.namespace.ninja'              },
]

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
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
              Resolvio is part of Namespace. Namespace builds ENS identity and tooling: subname infrastructure, ENS components (Reach UI kit), ENS MCP server, and custom solutions for chains, wallets, and apps. Resolvio is the unified resolution layer that ties it all together.
            </p>
            <div className={styles.socials}>
              <a href="https://github.com/thenamespace/resolvio" target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="GitHub"><Github size={16} /></a>
              <a href="https://x.com/namespace_eth" target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="X"><XIcon /></a>
              <a href="https://t.me/+u2X1_QbR-CVmMGIy" target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="Telegram (builders)"><TelegramIcon /></a>
            </div>
          </div>
        </div>

        {/* Product cell */}
        <div className={styles.cell}>
          <div className={styles.inner}>
            <p className={styles.colHeading}>Products and Services</p>
            <nav className={styles.links}>
              {PRODUCT_LINKS.map((l) => <a key={l.label} href={l.href} className={styles.link}>{l.label}</a>)}
            </nav>
          </div>
        </div>

        {/* Resources cell */}
        <div className={styles.cell}>
          <div className={styles.inner}>
            <p className={styles.colHeading}>Resources</p>
            <nav className={styles.links}>
              {RESOURCE_LINKS.map((l) => (
                <a key={l.label} href={l.href} className={styles.link} target={l.href.startsWith('http') ? '_blank' : undefined} rel={l.href.startsWith('http') ? 'noreferrer' : undefined}>{l.label}</a>
              ))}
            </nav>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <span className={styles.copyright}>© 2025 Resolvio. All rights reserved.</span>
      </div>
    </div>
  </footer>
)
