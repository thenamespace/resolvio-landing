import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Check, Copy, CircleAlert } from 'lucide-react'
import { cx } from '../../utils/cx'
import styles from './CopyButton.module.scss'

export function CopyButton({
  text,
  label = 'Copy',
  className,
}: {
  text: string
  label?: string
  className?: string
}) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [animate, setAnimate] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  async function copy(event: MouseEvent<HTMLButtonElement>) {
    setAnimate(event.detail > 0)
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus('idle'), 2500)
  }
  return (
    <button
      type="button"
      className={cx(styles.button, className)}
      onClick={copy}
      aria-label={label}
      data-status={status}
      data-animate={animate}
    >
      <span className={styles.icon} aria-hidden="true">
        <Copy size={14} data-visible={status === 'idle'} />
        <Check size={14} data-visible={status === 'copied'} />
        <CircleAlert size={14} data-visible={status === 'failed'} />
      </span>
      <span className={styles.labels} aria-hidden="true">
        <span data-visible={status === 'idle'}>{label}</span>
        <span data-visible={status === 'copied'}>Copied</span>
        <span data-visible={status === 'failed'}>Could not copy</span>
      </span>
      <span className={styles.announcement} role="status">
        {status === 'copied'
          ? 'Copied to clipboard'
          : status === 'failed'
            ? 'Could not copy. Select the text and copy it manually.'
            : ''}
      </span>
    </button>
  )
}
