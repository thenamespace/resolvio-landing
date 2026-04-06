import { useParams } from 'react-router-dom'
import { getPostBySlug, blogPosts } from '../data/posts'
import { TableOfContents } from '../components/blog/TableOfContents'
import { PostCard } from '../components/blog/PostCard'
import { useSEO } from '../hooks/useSEO'
import styles from './BlogPost.module.scss'

function NotFound() {
  return (
    <main className={styles.notFound}>
      <h1>Post not found</h1>
      <a href="/blog" className={styles.backLink}>← Back to Blog</a>
    </main>
  )
}

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug) : undefined

  const related = post
    ? blogPosts.filter(p => p.slug !== post.slug && p.tags.some(t => post.tags.includes(t))).slice(0, 3)
    : []

  useSEO(
    post
      ? {
          title: `${post.title} | Resolvio Blog`,
          description: post.description,
          canonical: `https://resolvio.xyz/blog/${post?.slug}`,
          ogType: 'article',
          ogImage: 'https://resolvio.xyz/og-image.png',
          keywords: post.tags.join(', '),
        }
      : {
          title: 'Post Not Found | Resolvio Blog',
          description: 'This blog post could not be found.',
        }
  )

  if (!post) return <NotFound />

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className={styles.main}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumbOuter}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <a href="/" className={styles.breadcrumbLink}>Home</a>
          <span className={styles.breadcrumbSep}>›</span>
          <a href="/blog" className={styles.breadcrumbLink}>Blog</a>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{post.title}</span>
        </nav>
      </div>

      {/* Article header */}
      <header className={styles.articleHeader}>
        <div className={styles.articleHeaderInner}>
          <div className={styles.tags}>
            {post.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.description}>{post.description}</p>
          <div className={styles.meta}>
            <time dateTime={post.date} className={styles.metaItem}>{formattedDate}</time>
            <span className={styles.metaDot}>·</span>
            <span className={styles.metaItem}>{post.readTime} min read</span>
          </div>
        </div>
      </header>

      {/* Body: article + ToC sidebar */}
      <div className={styles.body}>
        <div className={styles.bodyInner}>
          <article className={styles.article} itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="headline" content={post.title} />
            <meta itemProp="description" content={post.description} />
            <meta itemProp="datePublished" content={post.date} />
            <meta itemProp="author" content="Resolvio" />
            <div
              className={styles.articleContent}
              itemProp="articleBody"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </article>

          <aside className={styles.sidebar}>
            <TableOfContents html={post.html} />
          </aside>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section className={styles.related}>
          <div className={styles.relatedInner}>
            <p className={styles.relatedLabel}>Keep reading</p>
            <div className={styles.relatedGrid}>
              {related.map(p => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <div className={styles.ctaOuter}>
        <div className={styles.ctaInner}>
          <p className={styles.ctaLabel}>Resolvio API</p>
          <h2 className={styles.ctaHeading}>Ready to resolve ENS names?</h2>
          <p className={styles.ctaText}>
            Free, no API key required. Resolve any ENS name or address with a single HTTP request.
          </p>
          <div className={styles.ctaActions}>
            <a href="/#playground" className={styles.ctaPrimary}>Try Playground</a>
            <a href="https://api.resolvio.xyz/api-docs" target="_blank" rel="noreferrer" className={styles.ctaSecondary}>
              API Docs →
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
