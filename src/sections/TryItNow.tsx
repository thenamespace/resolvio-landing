import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { CopyButton } from '../components/ui/CopyButton'
import { RESOLVIO_API, RESOLVIO_REFERENCE } from '../constants/api'
import { buildRequest, curlCommand, operations } from './playground-request'
import type { Operation } from './playground-request'
import styles from './TryItNow.module.scss'

const ADDRESS = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
interface LookupResponse {
  body: string
  status: number
  elapsed: number
  url: string
}

export const TryItNow = () => {
  const [operation, setOperation] = useState<Operation>('profile')
  const [input, setInput] = useState('vitalik.eth')
  const [texts, setTexts] = useState('avatar,description')
  const [addresses, setAddresses] = useState('eth,base')
  const [contenthash, setContenthash] = useState(false)
  const [pending, setPending] = useState(false)
  const [response, setResponse] = useState<LookupResponse | null>(null)
  const [error, setError] = useState('')
  const controller = useRef<AbortController | null>(null)
  useEffect(() => () => controller.current?.abort(), [])

  const isReverse = operation.includes('reverse')
  const isBulk = operation.startsWith('bulk-')
  const isProfile = ['profile', 'reverse-profile', 'bulk-profile'].includes(
    operation,
  )
  const definition = operations.find((entry) => entry.id === operation)!
  let requestUrl = ''
  let validationMessage = ''
  try {
    requestUrl = buildRequest(RESOLVIO_API, {
      operation,
      input,
      texts,
      addresses,
      contenthash,
    })
  } catch (cause) {
    validationMessage =
      cause instanceof Error ? cause.message : 'Check the request fields.'
  }

  function changeOperation(next: Operation) {
    setOperation(next)
    setInput(
      next.includes('reverse')
        ? ADDRESS
        : next === 'bulk-profile'
          ? 'vitalik.eth\nnick.eth'
          : 'vitalik.eth',
    )
    setResponse(null)
    setError('')
  }

  async function resolve(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    if (!requestUrl) {
      setError(validationMessage)
      return
    }
    controller.current?.abort()
    const requestController = new AbortController()
    controller.current = requestController
    const timeout = setTimeout(() => requestController.abort(), 30000)
    setPending(true)
    setError('')
    setResponse(null)
    const start = performance.now()
    try {
      const result = await fetch(requestUrl, {
        signal: requestController.signal,
      })
      const body: unknown = await result.json()
      setResponse({
        body: JSON.stringify(body, null, 2),
        status: result.status,
        elapsed: Math.round(performance.now() - start),
        url: requestUrl,
      })
      if (!result.ok)
        setError(
          `The API returned HTTP ${result.status}. See the response for details.`,
        )
    } catch (cause) {
      if (controller.current === requestController)
        setError(
          cause instanceof Error && cause.name === 'AbortError'
            ? 'The lookup timed out. Try again.'
            : 'Could not reach the API. Check your connection and try again.',
        )
    } finally {
      clearTimeout(timeout)
      setPending(false)
    }
  }

  return (
    <section
      id="playground"
      className={styles.outer}
      aria-labelledby="playground-heading"
    >
      <div className={styles.toolbar}>
        <h2 id="playground-heading">Try It Now</h2>
        <span>api.resolvio.xyz</span>
      </div>
      <div className={styles.workspace}>
        <form
          className={styles.request}
          onSubmit={resolve}
          onChange={() => {
            setResponse(null)
            setError('')
          }}
        >
          <fieldset disabled={pending}>
            <label htmlFor="operation">Lookup type</label>
            <select
              id="operation"
              value={operation}
              onChange={(event) =>
                changeOperation(event.target.value as Operation)
              }
            >
              {operations.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </select>
            <label htmlFor="lookup-input">
              {isReverse
                ? isBulk
                  ? 'Ethereum addresses'
                  : 'Ethereum address'
                : isBulk
                  ? 'ENS names'
                  : 'ENS name'}
            </label>
            {isBulk ? (
              <textarea
                id="lookup-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={3}
                spellCheck={false}
                aria-describedby="bulk-help"
              />
            ) : (
              <input
                id="lookup-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                spellCheck={false}
                autoCapitalize="none"
                autoComplete="off"
              />
            )}
            {isBulk && (
              <p id="bulk-help" className={styles.help}>
                Up to 20, separated by a comma or a new line.
              </p>
            )}
            {!isReverse && !isBulk && (
              <div className={styles.examples}>
                <span>Examples</span>
                {['vitalik.eth', 'nick.eth', 'cap.eth'].map((name) => (
                  <button
                    type="button"
                    key={name}
                    onClick={() => {
                      setInput(name)
                      setResponse(null)
                      setError('')
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
            {(isProfile || operation === 'texts') && (
              <>
                <label htmlFor="text-keys">
                  Text keys <span>{isProfile ? 'optional' : 'required'}</span>
                </label>
                <input
                  id="text-keys"
                  value={texts}
                  onChange={(event) => setTexts(event.target.value)}
                  placeholder="avatar,description"
                  spellCheck={false}
                />
                {isProfile && (
                  <p className={styles.help}>
                    Leave blank for the standard text records.
                  </p>
                )}
              </>
            )}
            {(isProfile || operation === 'addresses') && (
              <>
                <label htmlFor="chain-names">
                  {isProfile ? 'Addresses' : 'Chains'} <span>optional</span>
                </label>
                <input
                  id="chain-names"
                  value={addresses}
                  onChange={(event) => setAddresses(event.target.value)}
                  placeholder="eth,base,btc"
                  spellCheck={false}
                />
                <p className={styles.help}>
                  Comma-separated{' '}
                  {isProfile ? 'chain names or coin types' : 'chain names'}.
                  Blank uses the API defaults.
                </p>
              </>
            )}
            {isProfile && (
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={contenthash}
                  onChange={(event) => setContenthash(event.target.checked)}
                />
                Include content hash
              </label>
            )}
            <p id="request-error" className={styles.error} role="alert">
              {error}
            </p>
            <button className={styles.resolve} type="submit">
              {pending ? 'Resolving…' : 'Resolve'}
              <span aria-hidden="true">→</span>
            </button>
            <a
              className={styles.reference}
              href={`${RESOLVIO_REFERENCE}/${definition.docs}`}
            >
              Endpoint documentation ↗
            </a>
          </fieldset>
          <div className={styles.command}>
            <div>
              <span>Request</span>
              {requestUrl && (
                <CopyButton text={curlCommand(requestUrl)} label="Copy cURL" />
              )}
            </div>
            <code>
              {requestUrl
                ? curlCommand(requestUrl)
                : 'Complete the fields to preview your request.'}
            </code>
          </div>
        </form>
        <div className={styles.response} aria-busy={pending}>
          <div className={styles.responseHeader}>
            <h3>Response</h3>
            <div>
              {response && (
                <>
                  <span
                    className={
                      response.status >= 400 ? styles.failed : styles.status
                    }
                  >
                    HTTP {response.status}
                  </span>
                  <span>{response.elapsed} ms</span>
                  <CopyButton text={response.body} label="Copy JSON" />
                </>
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
          {response ? (
            <>
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
            </>
          ) : (
            <div className={styles.empty}>
              <span className={styles.braces} aria-hidden="true">
                {'{ }'}
              </span>
              <h3>
                {pending
                  ? 'Looking up ENS records…'
                  : 'The actual API response.'}
              </h3>
              <p>
                {pending
                  ? 'Waiting for api.resolvio.xyz.'
                  : 'Run a lookup to inspect the JSON, then copy the request into your app.'}
              </p>
            </div>
          )}
          <div className={styles.responseFooter}>
            <span>GET</span>
            <code>
              {response
                ? new URL(response.url).pathname
                : `/ens/v2/${definition.path}`}
            </code>
          </div>
        </div>
      </div>
    </section>
  )
}
