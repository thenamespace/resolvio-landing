# Resolvio API reference

Base URL: https://api.resolvio.xyz
Documentation: https://docs.namespace.ninja/user-guide/resolvio
Endpoint reference: https://docs.namespace.ninja/api-reference/resolvio/get-ens-profile
OpenAPI JSON: https://api.resolvio.xyz/api-docs.json

Public reads require no API key. Resolvio resolves ENS names, ENS-linked DNS names, and onchain or offchain ENS subnames. It is not a general DNS resolver.

## Response conventions

Texts and addresses are arrays, not objects indexed by key or chain. Match texts by `key` and addresses by `coin` or `chain`. Check `exists` before using `value`; missing records omit `value`. Contenthash is an object with `exists` and an optional `value`, not a string.

Example profile response recorded from the public API on 2026-10-13 for `?texts=avatar&addresses=eth&contenthash=false`. Records may change:

```json
{
  "name": "vitalik.eth",
  "texts": [
    { "key": "avatar", "value": "https://euc.li/vitalik.eth", "exists": true }
  ],
  "addresses": [
    { "coin": 60, "chain": "eth", "value": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "exists": true }
  ],
  "contenthash": { "exists": false },
  "resolver": "0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63"
}
```

A missing text record has the shape `{ "key": "requested-key", "exists": false }`. A missing address has `coin`, optional `chain`, and `exists: false`.

## GET /ens/v2/profile/:name

Returns `{ name, texts, addresses, contenthash, resolver? }`.

| Parameter | Meaning |
| --- | --- |
| `texts` | Comma-separated text keys. Empty or omitted uses the standard 12 keys. |
| `addresses` | Comma-separated chain names or coin types. Use this parameter for profile requests. |
| `contenthash` | Whether to include the content hash. Default in current source: `true`. Set explicitly when you need a particular behavior. |
| `noCache` | Request a cache refresh, subject to the deployment's refresh cooldown. |

With no record-selection parameters, the profile uses 12 text keys and 8 chains: `eth,base,arb1,op,matic,celo,btc,sol`. With explicit selection parameters but no `addresses`, addresses default to ETH. An empty text or address list does not exclude that group. `useDefault` is not an API parameter; `chains` belongs to the addresses endpoint.

```bash
curl 'https://api.resolvio.xyz/ens/v2/profile/vitalik.eth?texts=avatar&addresses=eth&contenthash=false'
```

## GET /ens/v2/profile/bulk

Required query: `names`, a comma-separated list. Accepts the same selection parameters as a single profile. Returns a top-level array of profile objects. The default limit is 20 names, configurable by the operator. One failed lookup can fail the entire request; it is not a per-name error envelope.

```bash
curl 'https://api.resolvio.xyz/ens/v2/profile/bulk?names=vitalik.eth,nick.eth&texts=avatar&addresses=eth&contenthash=false'
```

## GET /ens/v2/addresses/:name

Use `chains` for comma-separated chain names, or `coins` for numeric coin types. Do not combine them. Omit both for ETH. Supports `noCache`.

Returns `{ name, addresses: [{ coin, chain?, exists, value? }] }`.

```bash
curl 'https://api.resolvio.xyz/ens/v2/addresses/vitalik.eth?chains=eth,base,btc'
```

## GET /ens/v2/texts/:name

Supply at least one text key in `keys`. There is no default key list on this endpoint. Supports `noCache`.

Returns `{ name, texts: [{ key, exists, value? }] }`.

```bash
curl 'https://api.resolvio.xyz/ens/v2/texts/vitalik.eth?keys=avatar,description,com.twitter'
```

## GET /ens/v2/contenthash/:name

Supports `noCache`. Returns `{ value, exists: true }` or `{ exists: false }`. The value contains the protocol prefix, such as `ipfs://`.

## GET /ens/v2/chains

Returns an array of supported chain descriptors with `name`, `coin`, and `label`. Use `name` with `chains` on the addresses endpoint, or with `addresses` on a profile request. Use `coin` with `coins` on the addresses endpoint. Fetch this list rather than inventing aliases.

## GET /ens/v2/reverse/:address

Accepts an Ethereum address and optional `noCache`. Returns `{ address, hasReverseRecord, name? }`. A primary name is forward-verified. When there is no verified name, `hasReverseRecord` is false and `name` is omitted.

```bash
curl 'https://api.resolvio.xyz/ens/v2/reverse/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
```

## GET /ens/v2/reverse/bulk

Required query: `addresses`, a comma-separated list of Ethereum addresses. Supports `noCache`. Default limit: 20 addresses. Returns `{ addresses: [{ address, hasReverseRecord, name? }] }`.

Input addresses are deduplicated case-insensitively. Match results by the normalized address, not the original array index. No avatar or display-name fields are returned by this endpoint.

## GET /ens/v2/reverse/:address/profile

Reverse-resolves an Ethereum address to a verified primary name, then fetches the profile. Accepts `texts`, `addresses`, `contenthash`, and `noCache` as on the profile endpoint.

Returns `{ address, hasReverseRecord, name, avatar, displayName, description, profile }`. The nested profile uses the same arrays as a forward profile. `displayName` comes from the `name` text record; include it in a custom `texts` selection. Convenience fields are null when their records are unavailable.

When no verified reverse name exists, returns HTTP 200 with `hasReverseRecord: false` and `name`, `avatar`, `displayName`, `description`, and `profile` all null. Validation and upstream errors can still return non-200 responses.

## DELETE /ens/v2/cache/:name

Requests invalidation of cached records for a name. Optional `type`: `texts`, `addresses`, `contenthash`, or `all`. Default: `all`. Returns HTTP 204 with no body. Current source may invalidate additional record groups for `contenthash`.

Use deliberately after a record update, not before routine reads. Deployments with the refresh cooldown may ignore repeated clears during that interval, still returning 204.

## Caching and freshness

Caches are held in application memory. Durations come from server configuration, not an ENS resolver's `ttl()` value.

| Setting | Source default |
| --- | --- |
| `FORWARD_RESOLVE_CACHE_EXPIRY` | 300 seconds |
| `REVERSE_RESOLVE_CACHE_EXPIRY` | 1800 seconds |
| `MAX_BULK_PROFILE_REQUEST` | 20 names |
| `MAX_BULK_REVERSE_REQUEST` | 20 addresses |
| `MIN_CACHE_REFRESH_INTERVAL` | 5 seconds in current main |

Operators can override these values. The refresh cooldown was added to source on 2026-10-12; deployed instances may run different versions. Where enabled, `noCache=true` can reuse entries younger than the cooldown. It does not guarantee an uncached lookup or immediate consistency after a write. Do not assume payment-time freshness from this flag alone.

## Errors and limits

Check the HTTP status before consuming a result. HTTP 400 can indicate invalid inputs, unsupported chains, or a bulk request above the configured limit. A missing record is a successful empty result, not automatically a 404. Upstream failures can produce server errors.

No numeric hosted request-rate quota is published here. Source-level cooldowns are not request rate limits. If the hosted gateway returns HTTP 429, respect `Retry-After` when present and back off. Do not assume an API-key upgrade or unlimited throughput.

## Self-hosting

Follow the current setup instructions at https://github.com/thenamespace/resolvio#readme. Configure an Ethereum RPC provider and the cache or bulk limits you need.
