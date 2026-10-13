import { useEffect, useRef } from 'react'
import { ChevronDown, Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { RESOLVIO_DOCS, RESOLVIO_REPO } from '../constants/api'
import logo from '../assets/logo.svg'
import logoWhite from '../assets/logo-w.svg'
import styles from './TopNavigation.module.scss'

export const TopNavigation = () => {
  const { theme, toggleTheme } = useTheme()
  const aiDocs = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (aiDocs.current && event.target instanceof Node && !aiDocs.current.contains(event.target)) {
        aiDocs.current.open = false
      }
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [])
  return (
    <header className={styles.outer}>
      <a className={styles.skip} href="#main-content">
        Skip to content
      </a>
      <nav className={styles.inner} aria-label="Main navigation">
        <a href="/" className={styles.logo}>
          <img
            src={theme === 'dark' ? logoWhite : logo}
            alt="Resolvio home"
            width={130}
            height={28}
          />
        </a>
        <div className={styles.links}>
          <a href={RESOLVIO_DOCS}>Docs</a>
          <details
            className={styles.aiDocs}
            ref={aiDocs}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                event.currentTarget.open = false
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && event.currentTarget.open) {
                event.currentTarget.open = false
                event.currentTarget.querySelector('summary')?.focus()
              }
            }}
          >
            <summary>AI Docs <ChevronDown size={14} aria-hidden="true" /></summary>
            <div className={styles.aiDocsLinks}>
              <a href="/#agents" onClick={() => { if (aiDocs.current) aiDocs.current.open = false }}>Install the skill</a>
              <a href="/skill.md">Skill file <span>Instructions for your agent</span></a>
              <a href="/llms.txt">LLM summary <span>Endpoints at a glance</span></a>
              <a href="/llms-full.txt">Full API reference <span>Parameters and response formats</span></a>
            </div>
          </details>
          <a href="/#playground" className={styles.playground}>Try Playground</a>
          <a href={RESOLVIO_REPO} className={styles.github}>
            GitHub
          </a>
          <button
            onClick={toggleTheme}
            aria-label={
              theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
            }
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
        </div>
      </nav>
    </header>
  )
}
