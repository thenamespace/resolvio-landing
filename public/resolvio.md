# Resolvio

> Universal Web3 name resolution. One API. Every namespace.

Resolvio is a high-performance REST API for resolving ENS (Ethereum Name Service) names to addresses, text records, and content hashes — and for reverse-resolving Ethereum addresses back to ENS names. It is the unified identity resolution layer for Web3, built for developers, wallets, apps, and AI agents.

Resolvio is part of the [Namespace](https://namespace.ninja) ENS infrastructure suite. The hosted API is free to use with no authentication required. The server is open-source (MIT) and self-hostable.

---

## Key Facts

- **Base URL:** https://api.resolvio.xyz
- **Authentication:** None required — public resolution is available immediately
- **Response format:** JSON
- **Latency:** Sub-100ms with server-side caching
- **Uptime:** 99.9% SLA with redundant infrastructure
- **License:** MIT — self-hostable, no lock-in
- **Source:** https://github.com/thenamespace/resolvio

---

## What Resolvio Resolves

| Operation | Description |
|---|---|
| Full profile | Texts + addresses + contenthash in a single RPC call |
| Text records | Arbitrary key-value records: `avatar`, `email`, `description`, socials, custom keys |
| Address records | Cryptocurrency addresses for 100+ chains (ENSIP-9 / SLIP-44) |
| Content hash | IPFS, IPNS, Arweave, and Swarm content pointers |
| Reverse resolution | Ethereum address → primary ENS name |
| Bulk forward | Multiple ENS names resolved concurrently in one API call |
| Bulk reverse | Multiple Ethereum addresses resolved in one batched RPC call |
| Supported chains | List all chains with names and coinType values |
| Cache control | Per-name invalidation and forced fresh resolution |

---

## API Endpoints

### Resolve full profile
```
GET https://api.resolvio.xyz/ens/v2/profile/{name}
```
Query parameters:
- `texts` — comma-separated text keys (e.g. `avatar,email,description`)
- `chains` — comma-separated chain slugs (e.g. `eth,btc,base`)
- `useDefault` — `true` to use sensible defaults for texts and chains
- `noCache` — `true` to bypass cache and force fresh resolution

### Resolve text records only
```
GET https://api.resolvio.xyz/ens/v2/texts/{name}
```

### Resolve address records only
```
GET https://api.resolvio.xyz/ens/v2/addresses/{name}
```

### Resolve content hash only
```
GET https://api.resolvio.xyz/ens/v2/contenthash/{name}
```

### Reverse resolve (address → ENS name)
```
GET https://api.resolvio.xyz/ens/v2/reverse/{address}
```

### Bulk forward resolution
```
GET https://api.resolvio.xyz/ens/v2/profile/bulk?names=vitalik.eth,nick.eth
```

### Bulk reverse resolution
```
GET https://api.resolvio.xyz/ens/v2/reverse/bulk?addresses=0xd8dA…,0x225f…
```

### List supported chains
```
GET https://api.resolvio.xyz/ens/v2/chains
```

### Invalidate cache
```
DELETE https://api.resolvio.xyz/ens/v2/cache/{name}
```

---

## Example Response

```json
{
  "name": "vitalik.eth",
  "addresses": {
    "eth": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
  },
  "texts": {
    "avatar": "https://...",
    "email": "...",
    "description": "..."
  },
  "contenthash": "ipfs://..."
}
```

---

## Multi-Chain Resolution

ENS supports storing addresses for chains other than Ethereum via ENSIP-9, which maps blockchain types to SLIP-44 coin type integers. Pass chain names as query parameters:

```
GET https://api.resolvio.xyz/ens/v2/profile/vitalik.eth?chains=eth,btc,sol
```

Supported chains include ETH, BTC, LTC, DOGE, SOL, MATIC, ARB, BASE, OP, and any other SLIP-44 registered chain.

---

## Who Resolvio Is For

- **Web3 developers** — display human-readable names and avatars in your UI without building custom resolution logic
- **Wallet and app builders** — accept Web3 identities as input for payments, messaging, and access control
- **AI agent developers** — resolve ENS names at runtime via plain HTTP/JSON; no SDK or wallet required
- **L2 chains, communities, payment apps, games** — any service that needs reliable Web3 identity lookup

---

## Subname Support

Resolvio supports both onchain subnames (stored directly on Ethereum) and offchain subnames (resolved via CCIP-Read from an off-chain data source). The resolution flow is transparent — the same API call handles both automatically.

---

## DNS-Linked Names

ENS supports DNS-linked names via its DNS Registrar. If a traditional domain has been imported or tokenized with ENS and has a resolver set, Resolvio can resolve it. Standard DNS domains that have not been claimed in ENS return `NOT_FOUND`.

---

## Self-Hosting

Resolvio is a lightweight Node.js server (NestJS) with no external dependencies other than an Ethereum RPC endpoint.

```bash
git clone https://github.com/thenamespace/resolvio
cd resolvio
cp .env.example .env   # set RPC_URL to your Ethereum mainnet RPC
npm install
npm run start:dev
```

Docker is also supported:
```bash
docker build -t resolvio .
docker run -p 3000:3000 --env-file .env resolvio
```

**Environment variables:**
- `RPC_URL` *(required)* — Ethereum mainnet RPC endpoint
- `FORWARD_RESOLVE_CACHE_EXPIRY` — Forward cache TTL in seconds (0 disables)
- `REVERSE_RESOLVE_CACHE_EXPIRY` — Reverse cache TTL in seconds (0 disables)
- `MAX_BULK_REVERSE_REQUEST` — Max addresses per bulk reverse request
- `MAX_BULK_PROFILE_REQUEST` — Max names per bulk profile request
- `ENABLE_DOCS` — Expose Swagger UI at `/api-docs`
- `IS_TESTNET` — Set to `true` to use Sepolia testnet ENS registry

---

## Rate Limits

Unauthenticated public access has rate limits. An API key is available for production apps with high resolution volume — it provides higher rate limits and usage analytics.

---

## AI Agent Integration

The REST API is plain HTTP/JSON — any agent that can make GET requests can call it directly with no special setup.

```
GET https://api.resolvio.xyz/ens/v2/profile/vitalik.eth
```

Discovery resources for agents and LLMs:
- **LLM summary:** https://resolvio.xyz/llms.txt
- **LLM full reference:** https://resolvio.xyz/llms-full.txt
- **AI plugin manifest:** https://resolvio.xyz/.well-known/ai-plugin.json
- **MCP server manifest:** https://resolvio.xyz/.well-known/mcp.json
- **OpenAPI spec (JSON):** https://api.resolvio.xyz/api-docs.json
- **Interactive API docs:** https://api.resolvio.xyz/api-docs
- **Agent skill definitions (Claude + OpenAI):** https://resolvio.xyz/Skill.md

### MCP Server

Resolvio provides an MCP (Model Context Protocol) server for direct agent integration:

- **MCP endpoint:** https://ens-mcp.namespace.ninja/mcp
- **Repository:** https://github.com/thenamespace/ens-mcp
- **Auth:** None required
- **Tools:** `resolve_ens_name`, `reverse_resolve_address`, `bulk_resolve_ens_names`, `bulk_reverse_resolve_addresses`

---

## Related Products (Namespace Suite)

- **ENS Components** — React UI kit for displaying ENS profiles and names
- **Namespace app** — Subname issuance and management at scale
- **ENS MCP Server** — Model Context Protocol server for ENS resolution
- **ENS Resolver for Sheets** — Resolve ENS names directly in Google Sheets

---

## Links

- Website: https://resolvio.xyz
- API: https://api.resolvio.xyz
- API Docs: https://api.resolvio.xyz/api-docs
- GitHub (server): https://github.com/thenamespace/resolvio
- GitHub (landing): https://github.com/thenamespace/resolvio-landing
- Namespace: https://namespace.ninja
- Contact: support@namespace.ninja
