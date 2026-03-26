import { useState, useRef, useEffect } from 'react'
import styles from './TopNavigation.module.scss'
import { cx } from '../utils/cx'
import { Button } from '../components/ui/Button'
import logo from '../assets/logo.svg'
import logoWhite from '../assets/logo-w.svg'
import { ChevronDown, FileText, Puzzle, FileJson, Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface Props {
  className?: string
  innerClassName?: string
}

const AI_ITEMS = [
  {
    icon: <FileText size={14} />,
    label: 'LLM description',
    desc: 'Plain-text summary for language models',
    href: 'https://resolvio.xyz/llms.txt',
    external: true,
  },
  {
    icon: <Puzzle size={14} />,
    label: 'AI plugin manifest',
    desc: 'Agent plugin discovery file',
    href: 'https://resolvio.xyz/.well-known/ai-plugin.json',
    external: true,
  },
  {
    icon: <Puzzle size={14} />,
    label: 'MCP server manifest',
    desc: 'Model Context Protocol discovery file',
    href: 'https://resolvio.xyz/.well-known/mcp.json',
    external: true,
  },
  {
    icon: <FileJson size={14} />,
    label: 'OpenAPI spec (JSON)',
    desc: 'Machine-readable API specification',
    href: 'https://api.resolvio.xyz/api-docs.json',
    external: true,
  },
]

export const TopNavigation = ({ className, innerClassName }: Props) => {
  const [aiOpen, setAiOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAiOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className={cx(styles.outer, className)}>
      <div className={styles.innerWrapper}>
        <div className={cx(styles.inner, innerClassName)}>
          <a href="/" className={styles.logo}>
            <img src={theme === 'dark' ? logoWhite : logo} alt="Resolvio" height={28} />
          </a>
          <div className={styles.right}>
            <div className={styles.navLinks}>
              <a href="#docs" className={styles.navLink}>Docs</a>
              <a href="#benefits" className={styles.navLink}>Benefits</a>
              <a href="#capabilities" className={styles.navLink}>Capabilities</a>
              <a href="#faq" className={styles.navLink}>FAQ</a>

              <div className={styles.dropdown} ref={dropdownRef}>
                <button
                  className={cx(styles.navLink, styles.dropdownTrigger, aiOpen && styles.dropdownTriggerActive)}
                  onClick={() => setAiOpen(v => !v)}
                >
                  AI-ready
                  <ChevronDown size={13} className={cx(styles.chevron, aiOpen && styles.chevronOpen)} />
                </button>
                {aiOpen && (
                  <div className={styles.dropdownMenu}>
                    {AI_ITEMS.map(item => (
                      <a
                        key={item.label}
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className={styles.dropdownItem}
                        onClick={() => setAiOpen(false)}
                      >
                        <span className={styles.dropdownItemIcon}>{item.icon}</span>
                        <span className={styles.dropdownItemText}>
                          <span className={styles.dropdownItemLabel}>{item.label}</span>
                          <span className={styles.dropdownItemDesc}>{item.desc}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <a href="#playground"><Button size="sm">Try Playground</Button></a>
          </div>
        </div>
      </div>
    </nav>
  )
}
