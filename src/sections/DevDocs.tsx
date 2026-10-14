import {
  RESOLVIO_DOCS,
  RESOLVIO_REFERENCE,
  RESOLVIO_REPO,
} from '../constants/api'
import { CopyButton } from '../components/ui/CopyButton'
import { Disclosure } from '../components/ui/Disclosure'
import styles from './DevDocs.module.scss'

const INSTALL = 'npx skills add thenamespace/skills -s resolvio'
const endpoints = [
  ['Profiles', 'GET /ens/v2/profile/:name', 'get-ens-profile'],
  [
    'Address records',
    'GET /ens/v2/addresses/:name?chains=eth,base',
    'get-ens-addresses',
  ],
  [
    'Text records',
    'GET /ens/v2/texts/:name?keys=avatar,com.twitter',
    'get-ens-texts',
  ],
  ['Reverse lookup', 'GET /ens/v2/reverse/:address', 'reverse-resolve-single'],
  [
    'Reverse profile',
    'GET /ens/v2/reverse/:address/profile',
    'reverse-resolve-profile',
  ],
  [
    'Bulk profiles',
    'GET /ens/v2/profile/bulk?names=vitalik.eth,nick.eth',
    'get-bulk-ens-profiles',
  ],
]

export const DevDocs = () => (
  <section
    id="developers"
    className={styles.outer}
    aria-labelledby="developer-heading"
  >
    <div className={styles.heading}>
      <h2 id="developer-heading">Developer Documentation</h2>
      <a href={RESOLVIO_DOCS}>
        Read the documentation <span aria-hidden="true">↗</span>
      </a>
    </div>
    <div className={styles.layout}>
      <div>
        <h3 className={styles.audience}>For Humans</h3>
        <p className={styles.intro}>
          Use any HTTP client. Pick an endpoint for its parameters, response
          shape, and examples.
        </p>
        <div className={styles.endpoints}>
          {endpoints.map(([label, route, slug]) => (
            <a key={slug} href={`${RESOLVIO_REFERENCE}/${slug}`}>
              <span>{label}</span>
              <code>{route}</code>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
      <aside id="agents" className={styles.agents}>
        <h3>For Agents</h3>
        <p>Install the Resolvio skill, or give your agent the API reference.</p>
        <div className={styles.command}>
          <code>{INSTALL}</code>
          <CopyButton text={INSTALL} label="Copy command" />
        </div>
        <div className={styles.resources}>
          <a href="/skill.md">Skill file ↗</a>
          <a href="/llms.txt">LLM summary ↗</a>
          <a href="/llms-full.txt">Full API reference ↗</a>
        </div>
        <Disclosure title="Self-host Resolvio" className={styles.selfhost} triggerClassName={styles.selfhostTrigger}>
          <p>
            Self-host the Node.js service with your own Ethereum RPC provider.
            Cache durations and bulk limits are configurable.
          </p>
          <a href={`${RESOLVIO_REPO}#readme`}>Setup instructions ↗</a>
        </Disclosure>
      </aside>
    </div>
  </section>
)
