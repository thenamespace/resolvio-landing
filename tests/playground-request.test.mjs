import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import {
  buildRequest,
  curlCommand,
} from '../src/sections/playground-request.ts'

const base = 'https://api.resolvio.xyz'
const defaults = {
  operation: 'profile',
  input: 'vitalik.eth',
  texts: 'avatar,description',
  addresses: 'eth,base',
  contenthash: false,
}
const request = (overrides) =>
  new URL(buildRequest(base, { ...defaults, ...overrides }))

test('profile and record endpoints use their different API parameter names', () => {
  const profile = request({})
  assert.equal(profile.pathname, '/ens/v2/profile/vitalik.eth')
  assert.equal(profile.searchParams.get('addresses'), 'eth,base')
  assert.equal(profile.searchParams.get('texts'), 'avatar,description')
  assert.equal(profile.searchParams.get('contenthash'), 'false')
  assert.equal(profile.searchParams.has('useDefault'), false)
  const addresses = request({ operation: 'addresses' })
  assert.equal(addresses.searchParams.get('chains'), 'eth,base')
  assert.equal(addresses.searchParams.has('addresses'), false)
  const texts = request({ operation: 'texts' })
  assert.equal(texts.searchParams.get('keys'), 'avatar,description')
  assert.equal(texts.searchParams.has('texts'), false)
})

test('empty profile selections omit filters and leave defaults to the API', () => {
  const url = request({ texts: '', addresses: '', contenthash: true })
  assert.equal(url.searchParams.has('texts'), false)
  assert.equal(url.searchParams.has('addresses'), false)
  assert.equal(url.searchParams.get('contenthash'), 'true')
  assert.throws(
    () => request({ operation: 'texts', texts: '' }),
    /at least one text key/,
  )
})

test('reverse profile and bulk requests use the documented routes and envelope inputs', () => {
  const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
  assert.equal(
    request({ operation: 'reverse-profile', input: address }).pathname,
    `/ens/v2/reverse/${address}/profile`,
  )
  const reverse = request({
    operation: 'bulk-reverse',
    input: `${address}\n${address}`,
  })
  assert.equal(reverse.pathname, '/ens/v2/reverse/bulk')
  assert.equal(reverse.searchParams.get('addresses'), `${address},${address}`)
  assert.equal(reverse.searchParams.has('texts'), false)
  const profiles = request({
    operation: 'bulk-profile',
    input: 'vitalik.eth, nick.eth\ncap.eth',
  })
  assert.equal(profiles.pathname, '/ens/v2/profile/bulk')
  assert.equal(
    profiles.searchParams.get('names'),
    'vitalik.eth,nick.eth,cap.eth',
  )
})

test('validation rejects oversized batches and malformed inputs before sending', () => {
  assert.throws(
    () =>
      request({
        operation: 'bulk-profile',
        input: Array(21).fill('vitalik.eth').join(','),
      }),
    /up to 20/,
  )
  assert.throws(
    () => request({ operation: 'reverse', input: '0xd8dA...' }),
    /complete Ethereum address/,
  )
  assert.throws(
    () => request({ input: 'vitalik.eth?noCache=true' }),
    /ENS name/,
  )
  assert.throws(() => request({ input: '' }), /Enter an ENS name/)
  assert.doesNotThrow(() => request({ input: '日本語.eth' }))
})

test('query values cannot inject extra parameters', () => {
  const url = request({ texts: 'avatar&noCache=true' })
  assert.equal(url.searchParams.get('texts'), 'avatar&noCache=true')
  assert.equal(url.searchParams.has('noCache'), false)
})

test('copyable cURL preserves shell-special characters as one literal URL', () => {
  const url =
    "https://api.resolvio.xyz/ens/v2/profile/o'brien.eth?texts=$(echo injected)&addresses=eth"
  const echoed = execFileSync(
    '/bin/sh',
    ['-c', `curl() { printf '%s' "$1"; }; ${curlCommand(url)}`],
    { encoding: 'utf8' },
  )
  assert.equal(echoed, url)
})
