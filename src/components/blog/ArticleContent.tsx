import { useEffect, useRef } from 'react'

export function ArticleContent({ html, className }: { html: string; className: string }) {
  const article = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cleanups = Array.from(article.current?.querySelectorAll('pre') ?? []).map(pre => {
      const code = pre.querySelector('code')
      if (!code) return () => {}
      const button = document.createElement('button')
      button.type = 'button'
      button.textContent = 'Copy code'
      button.setAttribute('aria-live', 'polite')
      let timer: ReturnType<typeof setTimeout>
      let disposed = false
      const copy = async () => {
        let label: string
        try {
          await navigator.clipboard.writeText(code.textContent ?? '')
          label = 'Copied'
        } catch {
          label = 'Could not copy'
        }
        if (disposed) return
        button.textContent = label
        clearTimeout(timer)
        timer = setTimeout(() => { button.textContent = 'Copy code' }, 2500)
      }
      button.addEventListener('click', copy)
      pre.prepend(button)
      return () => {
        disposed = true
        clearTimeout(timer)
        button.removeEventListener('click', copy)
        button.remove()
      }
    })
    return () => cleanups.forEach(cleanup => cleanup())
  }, [html])

  return <div ref={article} className={className} itemProp="articleBody" dangerouslySetInnerHTML={{ __html: html }} />
}
