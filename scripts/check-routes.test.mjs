// Routing regression checks for the deployed static output.
//
// Serves dist/client through the same ordering Vercel applies
// (redirects -> filesystem -> rewrites) so that a static asset which is
// missing, or present under a different case, is caught here instead of
// silently falling through the SPA rewrite and answering with index.html.
//
// Run with: npm run test:routes  (requires a prior `npm run build`)

import assert from 'node:assert/strict'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist/client')
const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf-8'))

const CONTENT_TYPES = {
  '.md': 'text/markdown; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
}

// Resolve a URL path against a directory, honouring case even on
// case-insensitive filesystems, so the check behaves the same everywhere.
function resolveCaseSensitive(baseDir, urlPath) {
  let current = baseDir
  for (const segment of urlPath.split('/').filter(Boolean)) {
    let entries
    try {
      entries = fs.readdirSync(current)
    } catch {
      return null
    }
    if (!entries.includes(segment)) return null
    current = path.join(current, segment)
  }
  const stat = fs.statSync(current)
  if (stat.isDirectory()) {
    const indexPath = path.join(current, 'index.html')
    return fs.existsSync(indexPath) ? indexPath : null
  }
  return current
}

function sourceToRegExp(source) {
  // vercel.json sources here are either literal paths or contain a `(.*)` group.
  const pattern = source
    .split('(.*)')
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('(.*)')
  return new RegExp(`^${pattern}$`)
}

function serve() {
  return http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)

    for (const redirect of config.redirects ?? []) {
      if (sourceToRegExp(redirect.source).test(urlPath)) {
        res.writeHead(redirect.permanent === false ? 307 : 308, {
          location: redirect.destination,
        })
        res.end()
        return
      }
    }

    let filePath = resolveCaseSensitive(dist, urlPath)

    if (!filePath) {
      for (const rewrite of config.rewrites ?? []) {
        if (sourceToRegExp(rewrite.source).test(urlPath)) {
          filePath = resolveCaseSensitive(dist, rewrite.destination)
          break
        }
      }
    }

    if (!filePath) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
      res.end('Not Found')
      return
    }

    res.writeHead(200, {
      'content-type': CONTENT_TYPES[path.extname(filePath)] ?? 'application/octet-stream',
    })
    res.end(fs.readFileSync(filePath))
  })
}

test('static routing', async (t) => {
  assert.ok(
    fs.existsSync(dist),
    'dist/client is missing — run `npm run build` before `npm run test:routes`'
  )

  const server = serve()
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const origin = `http://127.0.0.1:${server.address().port}`
  t.after(() => server.close())

  await t.test('GET /skill.md serves the markdown skill file, not SPA HTML', async () => {
    const res = await fetch(`${origin}/skill.md`, { redirect: 'manual' })
    const body = await res.text()

    assert.equal(res.status, 200)
    assert.match(res.headers.get('content-type'), /^text\/markdown/)
    assert.doesNotMatch(body, /<!doctype html/i, 'served the SPA shell instead of the file')
    assert.match(body, /^---\nname: resolvio\n/, 'missing skill frontmatter')
  })

  await t.test('GET /skill.md retains the reverse profile endpoint from PR #10', async () => {
    const body = await (await fetch(`${origin}/skill.md`)).text()

    assert.match(body, /GET \/ens\/v2\/reverse\/:address\/profile/)
    assert.match(body, /hasReverseRecord/)
  })

  await t.test('case-variant paths redirect to a real file, not the SPA shell', async () => {
    for (const variant of ['/Skill.md', '/SKILL.md', '/SKILL.MD']) {
      const redirect = await fetch(`${origin}${variant}`, { redirect: 'manual' })
      assert.equal(redirect.status, 308, `${variant} should redirect`)

      const target = redirect.headers.get('location')
      const res = await fetch(`${origin}${target}`, { redirect: 'manual' })
      const body = await res.text()

      assert.equal(res.status, 200, `${variant} -> ${target} did not resolve`)
      assert.match(
        res.headers.get('content-type'),
        /^text\/markdown/,
        `${variant} -> ${target} did not serve markdown`
      )
      assert.doesNotMatch(body, /<!doctype html/i, `${variant} -> ${target} served the SPA shell`)
    }
  })

  await t.test('every redirect destination resolves to a built file', async () => {
    for (const redirect of config.redirects ?? []) {
      assert.ok(
        resolveCaseSensitive(dist, redirect.destination),
        `redirect destination ${redirect.destination} has no matching file in dist/client`
      )
    }
  })
})
