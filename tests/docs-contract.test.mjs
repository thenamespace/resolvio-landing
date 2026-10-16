import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('full agent reference matches its maintained source', async () => {
  assert.equal(
    await read('public/llms-full.txt'),
    await read('public/references/api.md'),
  )
})

test('published JSON examples parse and profile records have the API array shapes', async () => {
  const files = [
    'public/llms.txt',
    'public/llms-full.txt',
    'public/resolvio.md',
    'public/references/api.md',
    'public/references/examples.md',
    ...(await readdir(new URL('../posts', import.meta.url)))
      .filter((name) => name.endsWith('.md'))
      .map((name) => `posts/${name}`),
  ]
  let examples = 0
  for (const file of files) {
    for (const block of (await read(file)).matchAll(
      /```json\n([\s\S]*?)```/g,
    )) {
      const value = JSON.parse(block[1])
      examples++
      if (value.texts)
        assert.ok(Array.isArray(value.texts), `${file}: texts must be an array`)
      if (value.addresses)
        assert.ok(
          Array.isArray(value.addresses),
          `${file}: addresses must be an array`,
        )
      if (value.contenthash)
        assert.equal(
          typeof value.contenthash.exists,
          'boolean',
          `${file}: contenthash must use exists`,
        )
    }
  }
  assert.ok(examples > 0)
})

test('human API discovery points to Namespace while OpenAPI stays machine-readable', async () => {
  const config = JSON.parse(await read('vercel.json'))
  const link = config.headers
    .find((entry) => entry.source === '/')
    .headers.find((entry) => entry.key === 'Link').value
  assert.match(
    link,
    /docs.namespace.ninja\/user-guide\/resolvio>; rel="service-doc"/,
  )
  assert.match(link, /api-docs.json>; rel="service-desc"/)
  const html = await read('index.html')
  assert.doesNotMatch(
    html,
    /99\.9%|Sub-100ms|Unstoppable Domains|MCP server manifest/,
  )
  assert.match(html, /href="\/skill.md"/)
})

test('original UI keeps corrected endpoint examples, skill discovery, and service claims', async () => {
  const docs = await read('src/sections/DevDocs.tsx')
  assert.match(docs, /\/ens\/v2\/texts\/:name\?keys=avatar,com\.twitter/)
  assert.match(docs, /\/ens\/v2\/addresses\/:name\?chains=eth,base/)
  assert.match(docs, /const SKILL_URL = '\/skill\.md'/)
  assert.match(docs, /npx skills add thenamespace\/skills --skill resolvio/)
  const navigation = await read('src/sections/TopNavigation.tsx')
  assert.match(navigation, /href: '\/skill\.md'/)
  assert.doesNotMatch(docs + navigation, /MCP server manifest/)
  const claims = await Promise.all([
    'src/sections/WhyResolvio.tsx',
    'src/sections/StatsBar.tsx',
    'src/sections/FAQ.tsx',
  ].map(read))
  assert.doesNotMatch(claims.join('\n'), /99\.9%|Sub-100ms|No Dependencies|TTL derived from|returns results in the same order|API key gives you higher rate limits/)
})
