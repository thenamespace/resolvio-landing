---
title: "Bulk ENS Resolution: Look Up Multiple Names in One Request"
description: "Learn how to resolve multiple ENS names or reverse-resolve multiple wallet addresses in a single API request using Resolvio's bulk resolution endpoints."
date: "2025-03-31"
readTime: 5
tags: [ENS, API, Performance, Bulk]
excerpt: "Fetching ENS names one by one for a leaderboard or transaction feed is slow. Resolvio's bulk endpoints let you resolve multiple names in a single request."
---

Many Web3 applications need to display ENS names for lists of addresses — leaderboards, transaction histories, governance voter lists, NFT gallery ownership labels. Resolving each address one at a time requires a separate HTTP request. Resolvio’s bulk resolution endpoints let you group these lookups into batches.

## Why Bulk Resolution Matters

Consider a leaderboard with 100 addresses. Resolvio’s default bulk limit is 20, so you can resolve the list in five HTTP requests instead of 100 individual requests. Response times depend on cache hits and upstream resolvers.

## Bulk Reverse Resolution

The most common use case: you have a list of wallet addresses and want to display human-readable names next to each one. Pass them as a comma-separated list to the bulk reverse endpoint:

```bash
curl 'https://api.resolvio.xyz/ens/v2/reverse/bulk?addresses=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045,0x225f137127d9067788314bc7fcc1f36746a3c3B5'
```

This response was recorded from the public API on October 14, 2026. Records can change.

```json
{
  "addresses": [
    {
      "address": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
      "hasReverseRecord": true,
      "name": "vitalik.eth"
    },
    {
      "address": "0x225f137127d9067788314bc7fcc1f36746a3c3b5",
      "hasReverseRecord": true,
      "name": "luc.eth"
    }
  ]
}
```

The response contains an `addresses` array. Inputs are deduplicated case-insensitively, so match results by address rather than position. If a verified primary name is missing, `hasReverseRecord` is false and `name` is omitted. This endpoint does not return an avatar or `displayName`.

## Bulk Forward Resolution

If you have a list of ENS names and need their addresses, use the bulk profile endpoint:

```bash
curl 'https://api.resolvio.xyz/ens/v2/profile/bulk?names=vitalik.eth,nick.eth&texts=avatar&addresses=eth&contenthash=false'
```

This response was recorded on October 14, 2026:

```json
[
  {
    "name": "vitalik.eth",
    "texts": [
      {
        "key": "avatar",
        "value": "https://euc.li/vitalik.eth",
        "exists": true
      }
    ],
    "addresses": [
      {
        "coin": 60,
        "chain": "eth",
        "value": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        "exists": true
      }
    ],
    "contenthash": {
      "exists": false
    },
    "resolver": "0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63"
  },
  {
    "name": "nick.eth",
    "texts": [
      {
        "key": "avatar",
        "value": "https://euc.li/nick.eth",
        "exists": true
      }
    ],
    "addresses": [
      {
        "coin": 60,
        "chain": "eth",
        "value": "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
        "exists": true
      }
    ],
    "contenthash": {
      "exists": false
    },
    "resolver": "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41"
  }
]
```

Each profile contains arrays of text and address records. Match address records by `coin` or `chain` and check `exists` before reading `value`.

## Using Bulk Resolution in Practice

Here's a real-world pattern for enriching a leaderboard with ENS names:

```typescript
interface LeaderboardEntry {
  address: string
  score: number
  displayName?: string
}

interface ReverseRecord {
  address: string
  hasReverseRecord: boolean
  name?: string
}

async function enrichWithENS(entries: LeaderboardEntry[]): Promise<LeaderboardEntry[]> {
  const addresses = [...new Set(entries.map(entry => entry.address.toLowerCase()))]
  const names = new Map<string, string>()

  for (let offset = 0; offset < addresses.length; offset += 20) {
    const query = new URLSearchParams({ addresses: addresses.slice(offset, offset + 20).join(',') })
    const res = await fetch(`https://api.resolvio.xyz/ens/v2/reverse/bulk?${query}`)
    if (!res.ok) throw new Error(`Resolvio returned ${res.status}`)
    const resolved: { addresses: ReverseRecord[] } = await res.json()
    for (const record of resolved.addresses) {
      if (record.hasReverseRecord && record.name) {
        names.set(record.address.toLowerCase(), record.name)
      }
    }
  }

  return entries.map(entry => ({
    ...entry,
    displayName: names.get(entry.address.toLowerCase()) ?? entry.address,
  }))
}
```

## Performance and Caching

Results are cached server-side. The source defaults to five minutes for forward records and thirty minutes for reverse lookups; operators can configure these durations. They do not come from the resolver’s onchain TTL. `noCache=true` requests a refresh, but deployments with a refresh cooldown can reuse recent results.

One HTTP request does not guarantee one upstream RPC call. A failed upstream lookup can fail a whole batch; there is no per-name error envelope.

> Bulk endpoints default to 20 names or addresses per request. For larger lists, split into batches. Self-hosted instances can configure a different limit.

See the [bulk reverse reference](https://docs.namespace.ninja/api-reference/resolvio/bulk-reverse-resolve) and [bulk profile reference](https://docs.namespace.ninja/api-reference/resolvio/get-bulk-ens-profiles).
