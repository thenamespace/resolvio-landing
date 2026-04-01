import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

// Load the SSR bundle
const { render } = await import(path.join(root, 'dist/server/entry-server.js'))

// Read the built client index.html (already has hashed assets injected by Vite)
const template = fs.readFileSync(path.join(root, 'dist/client/index.html'), 'utf-8')

// Render the app to an HTML string
const appHtml = render()

// Inject into the placeholder
const html = template.replace('<!--app-html-->', appHtml)

// Overwrite index.html in the client dist
fs.writeFileSync(path.join(root, 'dist/client/index.html'), html)

console.log('Pre-render complete: dist/client/index.html')
