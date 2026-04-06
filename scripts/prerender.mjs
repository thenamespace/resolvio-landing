import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

// Load the SSR bundle
const { render, getPageMeta, getAllRoutes } = await import(
  path.join(root, 'dist/server/entry-server.js')
)

// Read the built client index.html (already has hashed assets injected by Vite)
const template = fs.readFileSync(path.join(root, 'dist/client/index.html'), 'utf-8')

const routes = getAllRoutes()

for (const url of routes) {
  const appHtml = render(url)
  const meta = getPageMeta(url)

  // Inject app HTML and update per-page meta tags
  let html = template.replace('<!--app-html-->', appHtml)

  // Update title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)

  // Update description
  html = html.replace(
    /(<meta name="description" content=")[^"]*(")/,
    `$1${meta.description}$2`
  )

  // Update canonical
  html = html.replace(
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${meta.canonical}$2`
  )

  // Update OG tags
  html = html.replace(
    /(<meta property="og:title" content=")[^"]*(")/,
    `$1${meta.title}$2`
  )
  html = html.replace(
    /(<meta property="og:description" content=")[^"]*(")/,
    `$1${meta.description}$2`
  )
  html = html.replace(
    /(<meta property="og:url" content=")[^"]*(")/,
    `$1${meta.canonical}$2`
  )

  // Update Twitter tags
  html = html.replace(
    /(<meta name="twitter:title" content=")[^"]*(")/,
    `$1${meta.title}$2`
  )
  html = html.replace(
    /(<meta name="twitter:description" content=")[^"]*(")/,
    `$1${meta.description}$2`
  )

  // Determine output path
  const outputPath =
    url === '/'
      ? path.join(root, 'dist/client/index.html')
      : path.join(root, 'dist/client', url.slice(1), 'index.html')

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, html)
  console.log(`Pre-rendered: ${url} → ${path.relative(root, outputPath)}`)
}

console.log(`\nPre-render complete: ${routes.length} routes`)
