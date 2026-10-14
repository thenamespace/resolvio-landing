import { useId, useState, type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cx } from '../../utils/cx'
import styles from './Disclosure.module.scss'

interface DisclosureProps {
  title: ReactNode
  children: ReactNode
  className?: string
  triggerClassName?: string
  contentClassName?: string
  defaultOpen?: boolean
}

export function Disclosure({
  title,
  children,
  className,
  triggerClassName,
  contentClassName,
  defaultOpen = false,
}: DisclosureProps) {
  const id = useId()
  const [open, setOpen] = useState(defaultOpen)
  const [instant, setInstant] = useState(true)

  return (
    <div
      className={cx(styles.disclosure, className)}
      data-open={open}
      data-instant={instant}
    >
      <button
        type="button"
        id={`${id}-trigger`}
        className={cx(styles.trigger, triggerClassName)}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={(event) => {
          setInstant(event.detail === 0)
          setOpen((previous) => !previous)
        }}
      >
        <span>{title}</span>
        <ChevronRight className={styles.chevron} size={18} aria-hidden="true" />
      </button>
      <div
        id={`${id}-panel`}
        className={styles.panel}
        aria-labelledby={`${id}-trigger`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className={styles.clip}>
          <div className={cx(styles.content, contentClassName)}>{children}</div>
        </div>
      </div>
    </div>
  )
}
