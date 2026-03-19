import { ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui/Button'
import bannerImage from '../assets/banner-image.svg'
import styles from './HeroImage.module.scss'

export const HeroImage = () => {
  return (
    <section className={styles.outer}>

      {/* Constrained text content */}
      <div className={styles.inner}>
        <div className={styles.badge}>
          <span>Universal Web3 Name Resolution</span>
          <ShieldCheck size={16} strokeWidth={2.5} />
        </div>

        <h1 className={styles.heading}>
          Resolve any Web3<br />name identity
        </h1>

        <p className={styles.subtitle}>One API for ENS, DNS and beyond.</p>
      </div>

      {/* Full-width banner */}
      <img src={bannerImage} alt="" aria-hidden="true" className={styles.banner} />

      {/* Constrained buttons */}
      <div className={styles.inner}>
        <div className={styles.actions}>
          <a href="#playground"><Button size="lg">Try Playground</Button></a>
          <a href="#docs"><Button size="lg" variant="secondary">View AI Docs</Button></a>
        </div>
      </div>

    </section>
  )
}
