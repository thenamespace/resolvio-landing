import { blogPosts } from '../data/posts'
import { PostCard } from '../components/blog/PostCard'
import { CallToAction } from '../sections/CallToAction'
import { useSEO } from '../hooks/useSEO'
import styles from './BlogIndex.module.scss'

export function BlogIndex() {
  useSEO({
    title: 'Blog — ENS, Web3 Identity & Name Resolution | Resolvio',
    description: 'Developer guides, tutorials, and deep dives on ENS name resolution, Web3 identity, multi-chain addresses, and the Resolvio API.',
    canonical: 'https://resolvio.xyz/blog',
    ogType: 'website',
    keywords: 'ENS blog, Web3 identity, name resolution, Ethereum Name Service, ENS API, ENS tutorial',
  })

  const [featured, ...rest] = blogPosts

  return (
    <main id="main-content">
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Resolvio Blog</p>
        <h1>Web3 Identity &amp; Name Resolution</h1>
        <p className={styles.subtitle}>Developer guides, deep dives, and tutorials on ENS, on-chain identity, and the Resolvio API.</p>
      </header>
      <div className={styles.content}>
        {featured && <section className={styles.featured} aria-label="Latest article">
          <p className={styles.sectionLabel}>Latest article</p>
          <PostCard post={featured} featured />
        </section>}
        <section className={styles.articles} aria-labelledby="all-articles">
          <h2 id="all-articles" className={styles.sectionLabel}>All articles</h2>
          <div className={styles.grid}>
            {rest.map(post => <PostCard key={post.slug} post={post} />)}
          </div>
        </section>
      </div>
      <CallToAction />
    </main>
  )
}
