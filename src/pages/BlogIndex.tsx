import { blogPosts } from '../data/posts'
import { PostCard } from '../components/blog/PostCard'
import { useSEO } from '../hooks/useSEO'
import styles from './BlogIndex.module.scss'

const allTags = [...new Set(blogPosts.flatMap(p => p.tags))]

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
    <main className={styles.main}>
      <div className={styles.heroOuter}>
        <div className={styles.hero}>
          <svg className={styles.heroDeco} aria-hidden="true" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,280 C200,220 400,320 600,260 C800,200 1000,280 1200,240 L1200,400 L0,400 Z" fill="currentColor" opacity="0.04" />
            <path d="M0,300 C150,260 350,340 550,290 C750,240 950,300 1200,270 L1200,400 L0,400 Z" fill="currentColor" opacity="0.05" />
            <path d="M0,240 C250,180 450,280 650,220 C850,160 1050,240 1200,200" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.12" />
            <path d="M0,270 C200,210 420,300 620,250 C820,200 1020,260 1200,230" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.1" />
            <path d="M0,310 C180,270 380,340 580,300 C780,260 980,310 1200,285" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.08" />
          </svg>
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>Resolvio Blog</span>
            <h1 className={styles.heading}>Web3 Identity &amp;<br />Name Resolution</h1>
            <p className={styles.subtitle}>
              Developer guides, deep dives, and tutorials on ENS,
              on-chain identity, and the Resolvio API.
            </p>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{blogPosts.length}</span>
              <span className={styles.statLabel}>Articles</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>{allTags.length}</span>
              <span className={styles.statLabel}>Topics</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {Math.round(blogPosts.reduce((a, p) => a + p.readTime, 0) / blogPosts.length)}m
              </span>
              <span className={styles.statLabel}>Avg. read</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.featuredSection} aria-label="Featured post">
          <PostCard post={featured} featured />
        </section>

        <section className={styles.gridSection} aria-label="All posts">
          <div className={styles.gridOuter}>
            <div className={styles.grid}>
              {rest.map(post => (
                <div key={post.slug} className={styles.cell}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
