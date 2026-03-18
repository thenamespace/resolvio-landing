import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.scss'
import { cx } from '../../utils/cx'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size    = 'sm' | 'md' | 'lg'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export const Button = ({ variant = 'primary', size = 'md', className, children, ...rest }: Props) => {
  return (
    <button
      className={cx(styles.btn, styles[variant], styles[size], className)}
      {...rest}
    >
      {children}
    </button>
  )
}
