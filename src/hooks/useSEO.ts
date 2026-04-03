import { useEffect } from 'react'

interface SEOMeta {
  title: string
  description: string
  canonical?: string
  ogType?: string
  ogImage?: string
  keywords?: string
}

export function useSEO(meta: SEOMeta) {
  useEffect(() => {
    document.title = meta.title

    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('description', meta.description)
    if (meta.keywords) setMeta('keywords', meta.keywords)

    setMeta('og:title', meta.title, 'property')
    setMeta('og:description', meta.description, 'property')
    if (meta.ogType) setMeta('og:type', meta.ogType, 'property')
    if (meta.ogImage) setMeta('og:image', meta.ogImage, 'property')
    if (meta.canonical) setMeta('og:url', meta.canonical, 'property')

    setMeta('twitter:title', meta.title)
    setMeta('twitter:description', meta.description)

    if (meta.canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', meta.canonical)
    }
  }, [meta.title, meta.description, meta.canonical, meta.ogType, meta.ogImage, meta.keywords])
}
