import type { BlogPost } from '../../data/posts'
import styles from './PostCard.module.scss'

interface Props {
  post: BlogPost
  featured?: boolean
}

export function PostCard({ post, featured = false }: Props) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <a href={`/blog/${post.slug}`} className={featured ? styles.featured : styles.card}>
      <div className={styles.inner}>
        <div className={styles.tags}>
          {post.tags.slice(0, 2).map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
        <h2 className={featured ? styles.featuredTitle : styles.title}>{post.title}</h2>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <div className={styles.meta}>
          <time dateTime={post.date} className={styles.date}>{formattedDate}</time>
          <span className={styles.dot}>·</span>
          <span className={styles.readTime}>{post.readTime} min read</span>
        </div>
      </div>
    </a>
  )
}
