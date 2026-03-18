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
          <Button size="sm">Try Playground</Button>
        </div>
      </div>
    </nav>
  )
}
