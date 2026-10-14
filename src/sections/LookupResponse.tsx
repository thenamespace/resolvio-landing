import {
  ArrowRight,
  Check,
  CircleAlert,
  LoaderCircle,
  Braces,
} from 'lucide-react'
import { CopyButton } from '../components/ui/CopyButton'
import styles from './TryItNow.module.scss'

export interface LookupResult {
  body: string
  status: number
  elapsed: number
  url: string
}

export function LookupResponse({
  pending,
  response,
  error,
  isReverse,
  path,
  animate,
}: {
  pending: boolean
  response: LookupResult | null
  error: string
  isReverse: boolean
  path: string
  animate: boolean
}) {
  const state = pending
    ? 'pending'
    : error
      ? 'error'
      : response
        ? 'complete'
        : 'idle'
  return (
    <div
      className={styles.response}
      aria-busy={pending}
      data-state={state}
      data-animate={animate}
    >
      <div className={styles.responseHeader}>
        <h3>
          Response <span>JSON</span>
        </h3>
        <div>
          {response ? (
            <>
              <span
                className={
                  response.status >= 400 ? styles.failed : styles.status
                }
              >
                {response.status >= 400 ? (
                  <CircleAlert size={12} />
                ) : (
                  <Check size={12} />
                )}
                {response.status}
              </span>
              <span>{response.elapsed} ms</span>
              <CopyButton text={response.body} label="Copy JSON" />
            </>
          ) : (
            <span>
              {pending
                ? 'Request in progress'
                : error
                  ? 'Request failed'
                  : 'Ready'}
            </span>
          )}
        </div>
      </div>
      <span className={styles.srOnly} role="status">
        {pending
          ? 'Fetching ENS records.'
          : response
            ? `Lookup complete. HTTP ${response.status}.`
            : ''}
      </span>
      <div className={styles.responseBody}>
        {response ? (
          <div className={styles.result} key={response.url + response.elapsed}>
            <pre
              className={styles.json}
              tabIndex={0}
              aria-label="JSON response"
            >
              <code>{response.body}</code>
            </pre>
            <p className={styles.responseNote}>
              {isReverse ? (
                <>
                  A missing primary name has{' '}
                  <code>hasReverseRecord: false</code>.
                </>
              ) : (
                <>
                  Missing records have <code>exists: false</code>.
                </>
              )}
            </p>
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.lookupFlow} aria-hidden="true">
              <span>{isReverse ? '0x…' : '.eth'}</span>
              <ArrowRight size={16} />
              <span className={styles.flowTarget}>
                {pending ? (
                  <LoaderCircle size={22} className={styles.spinner} />
                ) : error ? (
                  <CircleAlert size={22} />
                ) : (
                  <Braces size={22} />
                )}
              </span>
            </div>
            <h3>
              {pending
                ? 'Resolving your request…'
                : error
                  ? 'No response received'
                  : isReverse
                    ? 'Find the name behind an address.'
                    : 'Start with an ENS name.'}
            </h3>
            <p>
              {pending
                ? 'Fetching records from api.resolvio.xyz.'
                : error
                  ? 'Check the request and try again.'
                  : 'Resolve a lookup to see the live JSON response here.'}
            </p>
            {pending && (
              <div className={styles.skeleton} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.responseFooter}>
        <span>GET</span>
        <code>{response ? new URL(response.url).pathname : path}</code>
      </div>
    </div>
  )
}
