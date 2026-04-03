import { renderToString } from 'react-dom/server'
import { StrictMode } from 'react'
import { StaticRouter } from 'react-router-dom/server'
import App from './App'
import './styles/main.scss'
import { blogPosts } from './data/posts'

export function render(url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  )
}

export function getPageMeta(url: string): { title: string; description: string; canonical: string } {
  if (url === '/') {
    return {
      title: 'Resolvio - Resolve Web3 Identities',
      description: 'Resolvio provides a complete identity resolution service through a single API. Built for every chain, wallet, app, and AI agent.',
      canonical: 'https://resolvio.xyz/',
    }
  }
  if (url === '/blog') {
    return {
      title: 'Blog — ENS, Web3 Identity & Name Resolution | Resolvio',
      description: 'Developer guides, tutorials, and deep dives on ENS name resolution, Web3 identity, multi-chain addresses, and the Resolvio API.',
      canonical: 'https://resolvio.xyz/blog',
    }
  }
  const slug = url.replace('/blog/', '')
  const post = blogPosts.find(p => p.slug === slug)
  if (post) {
    return {
      title: `${post.title} | Resolvio Blog`,
      description: post.description,
      canonical: `https://resolvio.xyz/blog/${post.slug}`,
    }
  }
  return {
    title: 'Resolvio',
    description: 'Universal Web3 name resolution API.',
    canonical: `https://resolvio.xyz${url}`,
  }
}

export function getAllRoutes(): string[] {
  return ['/', '/blog', ...blogPosts.map(p => `/blog/${p.slug}`)]
}
