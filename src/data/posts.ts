import { marked } from 'marked'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

marked.use({
  renderer: {
    heading({ text, depth }) {
      const id = slugify(text.replace(/<[^>]+>/g, ''))
      return `<h${depth} id="${id}">${text}</h${depth}>\n`
    },
    blockquote({ text }) {
      return `<div class="callout">${text}</div>\n`
    },
  },
})

interface Frontmatter {
  title: string
  description: string
  date: string
  readTime: number
  tags: string[]
  excerpt: string
}

function parseFrontmatter(raw: string): { data: Frontmatter; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { data: {} as Frontmatter, content: raw }

  const content = match[2]
  const data: Record<string, unknown> = {}

  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue
    const key = line.slice(0, colonIdx).trim()
    const val = line.slice(colonIdx + 1).trim()

    if (val.startsWith('[') && val.endsWith(']')) {
      data[key] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''))
    } else if (!isNaN(Number(val)) && val !== '') {
      data[key] = Number(val)
    } else {
      data[key] = val.replace(/^["']|["']$/g, '')
    }
  }

  return { data: data as unknown as Frontmatter, content }
}

const rawFiles = import.meta.glob<string>('/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  readTime: number
  tags: string[]
  excerpt: string
  html: string
}

export const blogPosts: BlogPost[] = Object.entries(rawFiles)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw)
    const slug = path.replace('/posts/', '').replace('.md', '')
    const html = marked.parse(content) as string
    return {
      slug,
      title: data.title as string,
      description: data.description as string,
      date: data.date as string,
      readTime: data.readTime as number,
      tags: (data.tags as string[]) ?? [],
      excerpt: data.excerpt as string,
      html,
    }
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug)
}

export function getAllSlugs(): string[] {
  return blogPosts.map(p => p.slug)
}
