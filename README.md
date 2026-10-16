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

Choose Forward Resolution for ENS profiles or Reverse Resolution for Ethereum addresses. Forward resolution supports a single name or a batch of up to 20 names. Turn off Use Default to choose chain and text filters in the record-picker dialogs. Empty filters use API defaults. Each direction keeps its input while you switch. Enter submits a single name; Ctrl/Cmd+Enter submits reverse lookups.

The original landing and blog layouts are retained. During browser checks, verify both directions, record pickers, input preservation, copy feedback, API errors, mobile layouts, and both themes. For prerendered article checks with Vite preview, use a trailing slash so the server returns the article HTML.

## Documentation

Human documentation links point to [Namespace docs](https://docs.namespace.ninja/user-guide/resolvio). The OpenAPI JSON remains a machine-readable resource, not the primary human documentation link.

Edit `public/references/api.md` for the detailed local API contract, then run `npm run docs:sync` to update `public/llms-full.txt`. Update the concise `public/llms.txt`, skill, examples, and relevant blog posts when the contract changes. `npm run docs:check` catches a stale full reference during builds.

Keep response shapes and query parameters aligned with the API. Do not add uptime, latency, rate-limit, API-key-tier, or freshness guarantees without verifying the deployed service.
