import { marked } from 'marked'

// Importing posts registers the shared marked renderer (heading ids, callouts, code blocks)
import './posts'

const rawFiles = import.meta.glob<string>('/public/legal/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export interface LegalDoc {
  slug: string
  title: string
  description: string
  html: string
}

const DESCRIPTIONS: Record<string, string> = {
  terms: 'The terms that govern your use of the Resolvio website, hosted API, and related services.',
  privacy: 'How Resolvio collects, uses, and protects information when you use the website and hosted API.',
}

export const legalDocs: LegalDoc[] = Object.entries(rawFiles).map(([path, raw]) => {
  const slug = path.replace('/public/legal/', '').replace('.md', '')
  // The H1 is rendered by the page header, so pull it out of the body
  const titleMatch = raw.match(/^#\s+(.+)\n/)
  const content = titleMatch ? raw.slice(titleMatch[0].length) : raw
  return {
    slug,
    title: titleMatch?.[1].trim() ?? slug,
    description: DESCRIPTIONS[slug] ?? '',
    // Links to docs and external sites open in a new tab; links between the legal pages stay in place
    html: (marked.parse(content) as string).replace(
      /<a href="(?!\/(?:terms|privacy)")([^"]*)"/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer"',
    ),
  }
})

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return legalDocs.find(d => d.slug === slug)
}
