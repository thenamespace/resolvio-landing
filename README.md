# Resolvio landing page

The public website and API playground for [Resolvio](https://resolvio.xyz), built with React, TypeScript, and Vite. The playground calls `https://api.resolvio.xyz`; it requires no local secrets.

## Development

Use Node.js 24 and the checked-in npm lockfile.

```bash
npm ci
npm run dev
```

## Checks and production build

```bash
npm test
npm run lint
npm run build
```

The build type-checks the app, checks that agent references are synchronized, and prerenders landing, blog, and legal routes into `dist/client`. Use `npm run preview` to inspect the result.

## Playground interactions

Choose Forward for ENS names or Reverse for Ethereum addresses, then select an endpoint. Each direction keeps its input while you switch. Profile filters are under Customize records; required text keys stay visible. Enter submits a single lookup, and Ctrl/Cmd+Enter submits a bulk lookup.

Disclosures, menus, copy feedback, and response arrivals use short CSS transitions. Keyboard actions and reduced-motion preferences skip motion. During browser checks, verify both directions, rapid disclosure toggles, hidden-field tab order, copy feedback, API errors, mobile layouts, and both themes. For prerendered article checks with Vite preview, use a trailing slash so the server returns the article HTML.

## Documentation

Human documentation links point to [Namespace docs](https://docs.namespace.ninja/user-guide/resolvio). The OpenAPI JSON remains a machine-readable resource, not the primary human documentation link.

Edit `public/references/api.md` for the detailed local API contract, then run `npm run docs:sync` to update `public/llms-full.txt`. Update the concise `public/llms.txt`, skill, examples, and relevant blog posts when the contract changes. `npm run docs:check` catches a stale full reference during builds.

Keep response shapes and query parameters aligned with the API. Do not add uptime, latency, rate-limit, API-key-tier, or freshness guarantees without verifying the deployed service.
