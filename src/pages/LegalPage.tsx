import { getLegalDoc } from '../data/legal'
import { TableOfContents } from '../components/blog/TableOfContents'
import { useSEO } from '../hooks/useSEO'
import blogStyles from './BlogPost.module.scss'
import styles from './LegalPage.module.scss'
import { cx } from '../utils/cx'

export function LegalPage({ slug }: { slug: 'terms' | 'privacy' }) {
  const doc = getLegalDoc(slug)!

  useSEO({
    title: `${doc.title} | Resolvio`,
    description: doc.description,
    canonical: `https://resolvio.xyz/${slug}`,
  })

  return (
    <main className={blogStyles.main}>
      <div className={blogStyles.breadcrumbOuter}>
        <nav className={blogStyles.breadcrumb} aria-label="Breadcrumb">
          <a href="/" className={blogStyles.breadcrumbLink}>Home</a>
          <span className={blogStyles.breadcrumbSep}>›</span>
          <span className={blogStyles.breadcrumbCurrent}>{doc.title}</span>
        </nav>
      </div>

      <header className={blogStyles.articleHeader}>
        <div className={blogStyles.articleHeaderInner}>
          <div className={blogStyles.tags}>
            <span className={blogStyles.tag}>Legal</span>
          </div>
          <h1 className={blogStyles.title}>{doc.title}</h1>
          <p className={blogStyles.description}>{doc.description}</p>
          <div className={blogStyles.meta}>
            <a href={slug === 'terms' ? '/privacy' : '/terms'} className={styles.switchLink}>
              {slug === 'terms' ? 'Privacy Policy →' : 'Terms of Service →'}
            </a>
            <span className={blogStyles.metaDot}>·</span>
            <a href={`/legal/${slug}.md`} className={styles.switchLink}>Markdown</a>
          </div>
        </div>
      </header>

      <div className={blogStyles.body}>
        <div className={blogStyles.bodyInner}>
          <article className={blogStyles.article}>
            <div
              className={cx(blogStyles.articleContent, styles.legalContent)}
              dangerouslySetInnerHTML={{ __html: doc.html }}
            />
          </article>
          <aside className={blogStyles.sidebar}>
            <TableOfContents html={doc.html} />
          </aside>
        </div>
      </div>
    </main>
  )
}
