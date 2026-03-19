import { Button } from '../components/ui/Button'
import sectionGraphic from '../assets/section-graphic.svg'
import styles from './CallToAction.module.scss'

export const CallToAction = () => (
  <section className={styles.outer}>
    <div className={styles.gridOuter}>
      <div className={styles.grid}>

        {/* Left cell */}
        <div className={styles.cell}>
          <div className={styles.cellPad}>
            <div className={styles.inner}>
              <span className={styles.label}>Start Now</span>
              <h2 className={styles.heading}>Ready to get started?</h2>
              <p className={styles.subtitle}>Join developers building the future of Web3 with Resolvio</p>
              <div className={styles.actions}>
                <Button size="sm">Try Now</Button>
                <Button size="sm" variant="secondary">Read the Docs</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right cell */}
        <div className={styles.cell}>
          <div className={styles.cellPad}>
            <div className={styles.graphicWrap}>
              <img src={sectionGraphic} alt="" className={styles.graphic} />
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
)
