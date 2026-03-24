import styles from './TopNavigation.module.scss'
import { cx } from '../utils/cx'
import { Button } from '../components/ui/Button'
import logo from '../assets/logo.svg'

interface Props {
  className?: string
  innerClassName?: string
}

export const TopNavigation = ({ className, innerClassName }: Props) => {
  return (
    <nav className={cx(styles.outer, className)}>
      <div className={styles.innerWrapper}>
        <div className={cx(styles.inner, innerClassName)}>
          <a href="/" className={styles.logo}>
            <img src={logo} alt="Resolvio" height={28} />
          </a>
          <div className={styles.right}>
            <div className={styles.navLinks}>
              <a href="#docs" className={styles.navLink}>Docs</a>
              <a href="#benefits" className={styles.navLink}>Benefits</a>
              <a href="#capabilities" className={styles.navLink}>Capabilities</a>
              <a href="#faq" className={styles.navLink}>FAQ</a>
            </div>
            <a href="#playground"><Button size="sm">Try Playground</Button></a>
          </div>
        </div>
      </div>
    </nav>
  )
}
