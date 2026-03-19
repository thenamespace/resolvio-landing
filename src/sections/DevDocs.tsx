import { useState } from 'react'
import { Copy, Terminal, Rocket, BookOpen } from 'lucide-react'
import { Button } from '../components/ui/Button'
import styles from './DevDocs.module.scss'

const QUICK_STEPS = [
  {
    num: '01',
    title: 'No API Key Required',
    desc: 'Start using the API immediately without authentication',
    active: true,
  },
  {
    num: '02',
    title: 'Make Your First Request',
    desc: 'Use any HTTP client to resolve ENS names',
    active: false,
  },
  {
    num: '03',
    title: 'Integrate & Build',
    desc: 'Parse the JSON response and build amazing apps',
    active: false,
  },
]

const CURL_COMMAND = 'curl https://staging.global-resolver.namespace.ninja/api/v1/resolve/ens/name/vitalik.eth/profile'

const ENDPOINTS = [
  {
    label: 'Get complete ENS profile',
    method: 'GET',
    path: '/api/v1/resolve/ens/name/:name/profile',
  },
  {
    label: 'Get cryptocurrency addresses',
    method: 'GET',
    path: '/api/v1/resolve/ens/name/:name/addresses',
  },
  {
    label: 'Get complete ENS profile',
    method: 'GET',
    path: '/api/v1/resolve/ens/name/:name/profile',
  },
  {
    label: 'Get cryptocurrency addresses',
    method: 'GET',
    path: '/api/v1/resolve/ens/name/:name/addresses',
  },
]

export const DevDocs = () => {
  const [copied, setCopied] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const copyMain = () => {
    navigator.clipboard.writeText(CURL_COMMAND)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const copyEndpoint = (idx: number, path: string) => {
    navigator.clipboard.writeText(path)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1500)
  }

  return (
    <section id="docs" className={styles.outer}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.label}>Docs</span>
        <h2 className={styles.heading}>Developer Documentation</h2>
        <p className={styles.subtitle}>Get started in minutes with our simple and powerful API</p>
      </div>

      {/* Grid */}
      <div className={styles.gridOuter}>
        <div className={styles.grid}>

          {/* Quick Start cell */}
          <div className={styles.cell}>
            <div className={styles.inner}>
              <div className={styles.sectionHead}>
                <div className={styles.iconCircle}>
                  <Rocket size={15} />
                </div>
                <h3 className={styles.sectionTitle}>Quick Start</h3>
              </div>

              {/* Step cards */}
              <div className={styles.stepsGrid}>
                {QUICK_STEPS.map((step) => (
                  <div key={step.num} className={`${styles.stepCard} ${step.active ? styles.stepCardActive : ''}`}>
                    <span className={`${styles.stepNum} ${step.active ? styles.stepNumActive : ''}`}>
                      {step.num}
                    </span>
                    <h4 className={styles.stepTitle}>{step.title}</h4>
                    <p className={styles.stepDesc}>{step.desc}</p>
                  </div>
                ))}
              </div>

              {/* Terminal block */}
              <div className={styles.terminal}>
                <div className={styles.terminalBar}>
                  <span className={styles.terminalLabel}>
                    <Terminal size={13} />
                    Terminal
                  </span>
                  <button className={styles.copyBtn} onClick={copyMain}>
                    <Copy size={13} />
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className={styles.terminalBody}>
                  <code>{CURL_COMMAND}</code>
                </div>
              </div>
            </div>
          </div>

          {/* API Endpoints cell */}
          <div className={styles.cell}>
            <div className={styles.inner}>
              <div className={styles.sectionHead}>
                <div className={styles.iconCircle}>
                  <BookOpen size={15} />
                </div>
                <h3 className={styles.sectionTitle}>API Endpoints</h3>
                <Button size="sm" className={styles.docsBtn}>View Full API Documentation</Button>
              </div>

              {/* Endpoint cards grid */}
              <div className={styles.endpointsGrid}>
                {ENDPOINTS.map((ep, i) => (
                  <div key={i} className={styles.endpointCard}>
                    <div className={styles.endpointTop}>
                      <span className={styles.endpointLabel}>{ep.label}</span>
                      <button className={styles.copyBtn} onClick={() => copyEndpoint(i, ep.path)}>
                        <Copy size={13} />
                        {copiedIdx === i ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className={styles.endpointRow}>
                      <span className={styles.methodBadge}>{ep.method}</span>
                      <code className={styles.endpointPath}>{ep.path}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
