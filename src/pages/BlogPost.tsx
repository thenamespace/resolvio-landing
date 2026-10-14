import { useParams } from 'react-router-dom'
import { CallToAction } from '../sections/CallToAction'
import { ArticleContent } from '../components/blog/ArticleContent'
import { getPostBySlug, blogPosts } from '../data/posts'
import { TableOfContents } from '../components/blog/TableOfContents'
import { PostCard } from '../components/blog/PostCard'
import { useSEO } from '../hooks/useSEO'
import styles from './BlogPost.module.scss'

function NotFound() {
  return (
    <main id="main-content" className={styles.notFound}>
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
    <main id="main-content" className={styles.main}>
      <div>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <a href="/" className={styles.breadcrumbLink}>Home</a>
          <span className={styles.breadcrumbSep}>›</span>
          <a href="/blog" className={styles.breadcrumbLink}>Blog</a>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{post.title}</span>
        </nav>
      </div>
      <header>
        <div className={styles.articleHeaderInner}>
          <div className={styles.tags}>
            {post.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.description}>{post.description}</p>
          <div className={styles.meta}>
            <time dateTime={post.date}>{formattedDate}</time>
            <span>·</span>
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </header>
      <details className={styles.mobileContents}>
        <summary>On this page</summary>
        <TableOfContents html={post.html} />
      </details>
      <div>
        <div className={styles.bodyInner}>
          <article className={styles.article} itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="headline" content={post.title} />
            <meta itemProp="description" content={post.description} />
            <meta itemProp="datePublished" content={post.date} />
            <meta itemProp="author" content="Resolvio" />
            <ArticleContent html={post.html} className={styles.articleContent} />
          </article>

          <aside className={styles.sidebar}>
            <TableOfContents html={post.html} />
          </aside>
        </div>
      </div>
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
      <CallToAction />
    </main>
  )
}
