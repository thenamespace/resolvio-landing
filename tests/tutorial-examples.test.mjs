import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

async function tutorialFunction(slug, name, fetch) {
  const markdown = await readFile(new URL(`../posts/${slug}.md`, import.meta.url), 'utf8')
  const snippet = [...markdown.matchAll(/```typescript\n([\s\S]*?)```/g)]
    .find((match) => match[1].includes(`function ${name}(`))?.[1]
  assert.ok(snippet, `Missing ${name} tutorial example`)
  const { outputText } = ts.transpileModule(snippet, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  })
  return runInNewContext(`${outputText}\n${name}`, { fetch, URLSearchParams })
}

for (const [slug, name] of [
  ['bulk-ens-resolution', 'enrichWithENS'],
  ['ai-agents-ens-identity', 'enrichAddresses'],
]) {
  test(`${name} handles bulk envelopes, duplicates, missing names, and batching`, async () => {
    const addresses = Array.from({ length: 21 }, (_, i) => `0x${(i + 10).toString(16).padStart(40, '0')}`)
    const mixedCase = addresses[0].toUpperCase().replace('0X', '0x')
    const inputs = [mixedCase, ...addresses]
    const batches = []
    const fn = await tutorialFunction(slug, name, async (url) => {
      const batch = new URL(url).searchParams.get('addresses').split(',')
      batches.push(batch)
      return {
        ok: true,
        json: async () => ({ addresses: [...batch].reverse().map(address => ({
          address,
          hasReverseRecord: address === addresses[0],
          ...(address === addresses[0] ? { name: 'example.eth' } : {}),
        })) }),
      }
    })
    const result = name === 'enrichWithENS'
      ? await fn(inputs.map((address, score) => ({ address, score })))
      : await fn(inputs)
    const display = name === 'enrichWithENS'
      ? result.map(entry => entry.displayName)
      : inputs.map(address => result[address])
    assert.deepEqual(Array.from(display), ['example.eth', 'example.eth', ...addresses.slice(1)])
    assert.deepEqual(batches.map(batch => batch.length), [20, 1])
    const calls = batches.length
    await fn([])
    assert.equal(batches.length, calls)

    const failing = await tutorialFunction(slug, name, async () => ({ ok: false, status: 502 }))
    await assert.rejects(() => failing(name === 'enrichWithENS' ? [{ address: addresses[0], score: 1 }] : [addresses[0]]), /502/)
  })
}

test('multichain tutorial requests numeric coins and preserves missing addresses', async () => {
  const fn = await tutorialFunction('multi-chain-ens-resolution', 'getChainAddresses', async (url) => {
    const request = new URL(url)
    assert.equal(request.searchParams.get('coins'), '60,2147483658,2147492101,2147525809')
    assert.equal(request.searchParams.has('noCache'), false)
    assert.ok(request.pathname.includes('%3FnoCache%3Dtrue'))
    return { ok: true, json: async () => ({ addresses: [
      { coin: 2147492101, exists: false },
      { coin: 60, exists: true, value: '0x123' },
    ] }) }
  })
  const result = await fn('example.eth?noCache=true')
  assert.deepEqual({ ...result }, { ethereum: '0x123', optimism: null, base: null, arbitrum: null })
})

test('agent tool handler validates input, encodes names, and reports upstream errors', async () => {
  let calls = 0
  const fn = await tutorialFunction('ai-agents-ens-identity', 'handleToolCall', async (url) => {
    calls++
    assert.equal(new URL(url).search, '')
    return { ok: false, status: 503 }
  })
  await assert.rejects(() => fn('unknown', { name: 'example.eth' }), /Unknown tool/)
  await assert.rejects(() => fn('resolve_ens_name', { name: ' ' }), /required/)
  assert.equal(calls, 0)
  await assert.rejects(() => fn('resolve_ens_name', { name: 'example.eth?noCache=true' }), /503/)
  assert.equal(calls, 1)
})
