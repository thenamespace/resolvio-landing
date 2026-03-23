import { useState } from 'react'
import { Copy, Terminal, Rocket, BookOpen, Bot, FileJson, Puzzle, FileText, User, Server } from 'lucide-react'
import { Button } from '../components/ui/Button'
import styles from './DevDocs.module.scss'
import { RESOLVIO_API } from '../constants/api'

const QUICK_STEPS = [
  {
    num: '01',
    title: 'No API Key Required',
    desc: 'Start using the API immediately without authentication',
  },
  {
    num: '02',
    title: 'Make Your First Request',
    desc: 'Use any HTTP client to resolve ENS names',
  },
  {
    num: '03',
    title: 'Integrate & Build',
    desc: 'Parse the JSON response and build amazing apps',
  },
]

const CURL_COMMAND = `curl ${RESOLVIO_API}/ens/v2/profile/vitalik.eth`

const ENDPOINTS = [
  { label: 'Resolve ENS profile',      method: 'GET', path: '/ens/v2/profile/:name' },
  { label: 'Bulk forward resolution',  method: 'GET', path: '/ens/v2/profile/bulk?names=vitalik.eth,nick.eth' },
  { label: 'Reverse resolve',          method: 'GET', path: '/ens/v2/reverse/:address' },
  { label: 'Bulk reverse resolution',  method: 'GET', path: '/ens/v2/reverse/bulk?addresses=0x…,0x…' },
  { label: 'Text records',             method: 'GET', path: '/ens/v2/texts/:name?texts=avatar,com.twitter' },
  { label: 'Address records',          method: 'GET', path: '/ens/v2/addresses/:name?addresses=eth,base' },
  { label: 'Content hash',             method: 'GET', path: '/ens/v2/contenthash/:name' },
]

const AGENT_RESOURCES = [
  {
    icon: <FileText size={14} />,
    label: 'LLM description',
    desc: 'Plain-text summary of the API designed for language models',
    url: 'https://resolvio.xyz/llms.txt',
  },
  {
    icon: <Puzzle size={14} />,
    label: 'AI plugin manifest',
    desc: 'Agent plugin discovery file referencing the OpenAPI spec',
    url: 'https://resolvio.xyz/.well-known/ai-plugin.json',
  },
  {
    icon: <FileJson size={14} />,
    label: 'OpenAPI spec (JSON)',
    desc: 'Full machine-readable API specification for automated tooling',
    url: `${RESOLVIO_API}/api-docs.json`,
  },
]

// Skill.md fetched at runtime so the copy always reflects the live file
const SKILL_URL = '/Skill.md'

const SELF_HOST_STEPS = [
  {
    heading: 'Clone & run',
    icon: <Terminal size={15} />,
    commands: [
      'git clone https://github.com/thenamespace/resolvio',
      'cd resolvio',
      'cp .env.example .env   # add your RPC_URL',
      'npm install',
      'npm run start:dev',
    ],
    note: 'API runs at http://localhost:3000',
  },
  {
    heading: 'Docker',
    icon: <Server size={15} />,
    commands: [
      'docker build -t resolvio .',
      'docker run -p 3000:3000 --env-file .env resolvio',
    ],
    note: 'API runs at http://localhost:3000',
  },
]

const ENV_VARS = [
  { name: 'RPC_URL', desc: 'Ethereum mainnet RPC endpoint', required: true },
  { name: 'FORWARD_RESOLVE_CACHE_EXPIRY', desc: 'Forward cache TTL in seconds. 0 disables caching.', required: false },
  { name: 'REVERSE_RESOLVE_CACHE_EXPIRY', desc: 'Reverse cache TTL in seconds. 0 disables caching.', required: false },
  { name: 'MAX_BULK_REVERSE_REQUEST', desc: 'Max addresses per bulk reverse request', required: false },
  { name: 'MAX_BULK_PROFILE_REQUEST', desc: 'Max names per bulk profile request', required: false },
  { name: 'ENABLE_DOCS', desc: 'Expose Swagger UI at /api-docs', required: false },
]

export const DevDocs = () => {
  const [tab, setTab] = useState<'humans' | 'agents' | 'self'>('humans')
  const [copied, setCopied] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [copiedResource, setCopiedResource] = useState<number | null>(null)
  const [skillContent, setSkillContent] = useState<string | null>(null)
  const [copiedSkill, setCopiedSkill] = useState(false)

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

  const copyResource = (idx: number, url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedResource(idx)
    setTimeout(() => setCopiedResource(null), 1500)
  }

  const handleAgentTab = () => {
    setTab('agents')
    if (!skillContent) {
      fetch(SKILL_URL).then(r => r.text()).then(setSkillContent)
    }
  }

  const copySkill = () => {
    if (!skillContent) return
    navigator.clipboard.writeText(skillContent)
    setCopiedSkill(true)
    setTimeout(() => setCopiedSkill(false), 1500)
  }

  return (
    <section id="docs" className={styles.outer}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.label}>Docs</span>
        <h2 className={styles.heading}>Developer Documentation</h2>
        <p className={styles.subtitle}>Get started in minutes with our simple and powerful API</p>
        {/* Audience tabs */}
        <div className={styles.audienceTabs}>
          <button
            className={tab === 'humans' ? styles.audienceTabActive : styles.audienceTab}
            onClick={() => setTab('humans')}
          >
            <User size={14} />
            For Humans
          </button>
          <button
            className={`${tab === 'agents' ? styles.audienceTabActive : styles.audienceTab} ${styles.audienceTabAgents}`}
            onClick={handleAgentTab}
          >
            <Bot size={14} />
            <span className={styles.gradientAgents}>For Agents</span>
          </button>
          <button
            className={`${tab === 'self' ? styles.audienceTabActive : styles.audienceTab} ${styles.audienceTabSelf}`}
            onClick={() => setTab('self')}
          >
            <Server size={14} />
            <span className={styles.gradientSelf}>Self-host Resolvio</span>
          </button>
        </div>
      </div>

      {tab === 'humans' && (
        <div className={styles.gridOuter}>
          <div className={styles.grid}>

            {/* Quick Start */}
            <div className={styles.cell}>
              <div className={styles.inner}>
                <div className={styles.sectionHead}>
                  <div className={styles.iconCircle}><Rocket size={15} /></div>
                  <h3 className={styles.sectionTitle}>Quick Start</h3>
                </div>
                <div className={styles.stepsGrid}>
                  {QUICK_STEPS.map((step) => (
                    <div key={step.num} className={styles.stepCard}>
                      <span className={styles.stepNum}>{step.num}</span>
                      <h4 className={styles.stepTitle}>{step.title}</h4>
                      <p className={styles.stepDesc}>{step.desc}</p>
                    </div>
                  ))}
                </div>
                <div className={styles.terminal}>
                  <div className={styles.terminalBar}>
                    <span className={styles.terminalLabel}>
                      <Terminal size={13} />Terminal
                    </span>
                    <button className={styles.copyBtn} onClick={copyMain}>
                      <Copy size={13} />{copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className={styles.terminalBody}>
                    <code>{CURL_COMMAND}</code>
                  </div>
                </div>
              </div>
            </div>

            {/* API Endpoints */}
            <div className={styles.cell}>
              <div className={styles.inner}>
                <div className={styles.sectionHead}>
                  <div className={styles.iconCircle}><BookOpen size={15} /></div>
                  <h3 className={styles.sectionTitle}>API Endpoints</h3>
                  <a href={`${RESOLVIO_API}/api-docs`} target="_blank" rel="noreferrer">
                    <Button size="sm" className={styles.docsBtn}>View Full API Documentation</Button>
                  </a>
                </div>
                <div className={styles.endpointsGrid}>
                  {ENDPOINTS.map((ep, i) => (
                    <div key={i} className={styles.endpointCard}>
                      <div className={styles.endpointTop}>
                        <span className={styles.endpointLabel}>{ep.label}</span>
                        <button className={styles.copyBtn} onClick={() => copyEndpoint(i, ep.path)}>
                          <Copy size={13} />{copiedIdx === i ? 'Copied' : 'Copy'}
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
      )}

      {tab === 'agents' && (
        <div className={styles.gridOuter}>
          <div className={styles.grid}>

            {/* Discovery resources */}
            <div className={styles.cell}>
              <div className={styles.inner}>
                <div className={styles.sectionHead}>
                  <div className={styles.iconCircle}><FileJson size={15} /></div>
                  <h3 className={styles.sectionTitle}>Discovery Resources</h3>
                </div>
                <p className={styles.agentIntro}>
                  Point your agent at any of these URLs. The plugin manifest and OpenAPI spec can be used directly by most agent frameworks to auto-configure tool calls.
                </p>
                <div className={styles.resourceList}>
                  {AGENT_RESOURCES.map((r, i) => (
                    <div key={i} className={styles.resourceRow}>
                      <div className={styles.resourceLeft}>
                        <span className={styles.resourceLabel}>
                          {r.icon}{r.label}
                        </span>
                        <span className={styles.resourceDesc}>{r.desc}</span>
                      </div>
                      <div className={styles.resourceRight}>
                        <a href={r.url} target="_blank" rel="noreferrer" className={styles.resourceUrl}>{r.url}</a>
                        <button className={styles.copyBtn} onClick={() => copyResource(i, r.url)}>
                          <Copy size={13} />{copiedResource === i ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skill.md */}
            <div className={styles.cell}>
              <div className={styles.inner}>
                <div className={styles.sectionHead}>
                  <div className={styles.iconCircle}><Bot size={15} /></div>
                  <h3 className={styles.sectionTitle}>Tool Definitions — Skill.md</h3>
                  <a href={SKILL_URL} download className={styles.docsBtn}>
                    <Button size="sm">Download Skill.md</Button>
                  </a>
                </div>
                <p className={styles.agentIntro}>
                  Ready-made tool definitions for Anthropic and OpenAI function-calling formats. Copy and paste directly into your agent system prompt or tool registry.
                </p>
                <div className={styles.skillBlock}>
                  <div className={styles.terminalBar}>
                    <span className={styles.terminalLabel}>
                      <FileText size={13} />Skill.md
                    </span>
                    <button className={styles.copyBtn} onClick={copySkill} disabled={!skillContent}>
                      <Copy size={13} />{copiedSkill ? 'Copied' : 'Copy all'}
                    </button>
                  </div>
                  <div className={styles.skillBody}>
                    {skillContent
                      ? <pre><code>{skillContent}</code></pre>
                      : <span className={styles.skillLoading}>Loading…</span>
                    }
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {tab === 'self' && (
        <div className={styles.gridOuter}>
          <div className={styles.grid}>

            {/* Setup steps */}
            <div className={styles.cell}>
              <div className={styles.inner}>
                {SELF_HOST_STEPS.map((step) => (
                  <div key={step.heading} className={styles.selfSection}>
                    <div className={styles.sectionHead}>
                      <div className={styles.iconCircle}>{step.icon}</div>
                      <h3 className={styles.sectionTitle}>{step.heading}</h3>
                    </div>
                    <div className={styles.terminal}>
                      <div className={styles.terminalBar}>
                        <span className={styles.terminalLabel}><Terminal size={13} />Terminal</span>
                      </div>
                      <div className={styles.terminalBody}>
                        {step.commands.map((cmd, i) => (
                          <code key={i} className={styles.terminalLine}>{cmd}</code>
                        ))}
                      </div>
                    </div>
                    <p className={styles.selfNote}>{step.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Environment variables */}
            <div className={styles.cell}>
              <div className={styles.inner}>
                <div className={styles.sectionHead}>
                  <div className={styles.iconCircle}><FileText size={15} /></div>
                  <h3 className={styles.sectionTitle}>Environment Variables</h3>
                  <a href="https://github.com/thenamespace/resolvio" target="_blank" rel="noreferrer">
                    <Button size="sm" className={styles.docsBtn}>View on GitHub</Button>
                  </a>
                </div>
                <p className={styles.agentIntro}>Only <code>RPC_URL</code> is required. All other variables have sensible defaults.</p>
                <div className={styles.envTable}>
                  {ENV_VARS.map((v) => (
                    <div key={v.name} className={styles.envRow}>
                      <div className={styles.envName}>
                        <code>{v.name}</code>
                        {v.required && <span className={styles.envRequired}>required</span>}
                      </div>
                      <p className={styles.envDesc}>{v.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  )
}
