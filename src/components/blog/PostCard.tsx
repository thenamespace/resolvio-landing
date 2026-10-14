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
    <article className={featured ? styles.featured : styles.card}>
      <div className={styles.inner}>
        <div className={styles.tags}>
          {post.tags.slice(0, 2).map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
        <h2 className={featured ? styles.featuredTitle : styles.title}>
          <a href={`/blog/${post.slug}`}>{post.title}</a>
        </h2>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <div className={styles.meta}>
          <time dateTime={post.date}>{formattedDate}</time>
          <span>·</span>
          <span>{post.readTime} min read</span>
        </div>
      </div>
    </article>
  )
}
