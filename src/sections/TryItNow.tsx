import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, ArrowUpRight, LoaderCircle } from 'lucide-react'
import { Disclosure } from '../components/ui/Disclosure'
import { LookupResponse } from './LookupResponse'
import type { LookupResult } from './LookupResponse'
import { CopyButton } from '../components/ui/CopyButton'
import { RESOLVIO_API, RESOLVIO_REFERENCE } from '../constants/api'
import { buildRequest, curlCommand, operations } from './playground-request'
import type { Operation } from './playground-request'
import styles from './TryItNow.module.scss'

const ADDRESS = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
export const TryItNow = () => {
  const [operation, setOperation] = useState<Operation>('profile')
  const [input, setInput] = useState('vitalik.eth')
  const [texts, setTexts] = useState('avatar,description')
  const [addresses, setAddresses] = useState('eth,base')
  const [contenthash, setContenthash] = useState(false)
  const [pending, setPending] = useState(false)
  const [response, setResponse] = useState<LookupResult | null>(null)
  const [error, setError] = useState('')
  const [animateResponse, setAnimateResponse] = useState(false)
  const savedDirection = useRef({
    forward: { operation: 'profile' as Operation, input: 'vitalik.eth' },
    reverse: { operation: 'reverse' as Operation, input: ADDRESS },
  })
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

  const validationField = validationMessage.startsWith(
    'Enter at least one text key',
  )
    ? 'text-keys'
    : 'lookup-input'
  const hasValidationError = Boolean(error && validationMessage)

  function changeOperation(next: Operation) {
    setOperation(next)
    setResponse(null)
    setError('')
  }

  function changeDirection(reverse: boolean) {
    if (reverse === isReverse) return
    savedDirection.current[isReverse ? 'reverse' : 'forward'] = {
      operation,
      input,
    }
    const saved = savedDirection.current[reverse ? 'reverse' : 'forward']
    setOperation(saved.operation)
    setInput(saved.input)
    setResponse(null)
    setError('')
  }

  async function resolve(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    if (!requestUrl) {
      setError(validationMessage)
      document.getElementById(validationField)?.focus()
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

  const recordFields = (
    <>
      {(isProfile || operation === 'texts') && (
        <>
          <label htmlFor="text-keys">
            Text keys <span>{isProfile ? 'optional' : 'required'}</span>
          </label>
          <input
            id="text-keys"
            aria-invalid={hasValidationError && validationField === 'text-keys'}
            aria-describedby={
              validationField === 'text-keys' ? 'request-error' : undefined
            }
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
            {isProfile ? 'chain names or coin types' : 'chain names'}. Blank
            uses the API defaults.
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
    </>
  )

  return (
    <section
      id="playground"
      className={styles.outer}
      aria-labelledby="playground-heading"
    >
      <div className={styles.toolbar}>
        <div>
          <h2 id="playground-heading">Try It Now</h2>
          <p>Explore ENS resolution. No API key needed.</p>
        </div>
        <span>api.resolvio.xyz</span>
      </div>
      <div className={styles.workspace}>
        <form
          className={styles.request}
          data-animate={animateResponse}
          onSubmit={resolve}
          onPointerDownCapture={() => setAnimateResponse(true)}
          onKeyDownCapture={() => setAnimateResponse(false)}
          onChange={() => {
            setResponse(null)
            setError('')
          }}
        >
          <fieldset disabled={pending}>
            <div
              className={styles.direction}
              role="group"
              aria-label="Resolution direction"
            >
              <button
                type="button"
                aria-pressed={!isReverse}
                onClick={() => changeDirection(false)}
              >
                <span>Forward</span>
                <small>Name to records</small>
              </button>
              <button
                type="button"
                aria-pressed={isReverse}
                onClick={() => changeDirection(true)}
              >
                <span>Reverse</span>
                <small>Address to name</small>
              </button>
            </div>
            <label htmlFor="operation">
              {isReverse ? 'Reverse lookup' : 'Forward lookup'}
            </label>
            <select
              id="operation"
              value={operation}
              onChange={(event) =>
                changeOperation(event.target.value as Operation)
              }
            >
              {operations
                .filter((entry) => entry.id.includes('reverse') === isReverse)
                .map((entry) => (
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
                aria-invalid={
                  hasValidationError && validationField === 'lookup-input'
                }
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={3}
                autoCapitalize="none"
                autoComplete="off"
                onKeyDown={(event) => {
                  if (
                    (event.metaKey || event.ctrlKey) &&
                    event.key === 'Enter'
                  ) {
                    event.preventDefault()
                    event.currentTarget.form?.requestSubmit()
                  }
                }}
                spellCheck={false}
                aria-describedby="bulk-help request-error"
              />
            ) : (
              <input
                id="lookup-input"
                aria-invalid={
                  hasValidationError && validationField === 'lookup-input'
                }
                aria-describedby="request-error"
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
            {isProfile ? (
              <Disclosure title="Customize records" className={styles.options}>
                {recordFields}
              </Disclosure>
            ) : (
              recordFields
            )}
            <p id="request-error" className={styles.error} role="alert">
              {error}
            </p>
            <button className={styles.resolve} type="submit">
              {pending ? 'Resolving…' : 'Resolve'}
              {pending ? (
                <LoaderCircle
                  className={styles.spinner}
                  size={18}
                  aria-hidden="true"
                />
              ) : (
                <ArrowRight size={18} aria-hidden="true" />
              )}
            </button>
            <a
              className={styles.reference}
              href={`${RESOLVIO_REFERENCE}/${definition.docs}`}
            >
              Endpoint documentation{' '}
              <ArrowUpRight size={13} aria-hidden="true" />
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
        <LookupResponse
          pending={pending}
          response={response}
          error={error}
          isReverse={isReverse}
          path={
            requestUrl
              ? new URL(requestUrl).pathname
              : `/ens/v2/${definition.path}`
          }
          animate={animateResponse}
        />
      </div>
    </section>
  )
}
