import { useState, useEffect } from 'react'
import styles from './TableOfContents.module.scss'

interface Props {
  html: string
}

interface Heading {
  id: string
  text: string
}

function extractHeadings(html: string): Heading[] {
  const matches = [...html.matchAll(/<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/g)]
  return matches.map(m => ({
    id: m[1],
    text: m[2].replace(/<[^>]+>/g, ''),
  }))
}

export function TableOfContents({ html }: Props) {
  const headings = extractHeadings(html)
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )

    headings.forEach(h => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className={styles.toc} aria-label="Table of contents">
      <p className={styles.label}>On this page</p>
      <ul className={styles.list}>
        {headings.map(h => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={activeId === h.id ? `${styles.link} ${styles.active}` : styles.link}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
