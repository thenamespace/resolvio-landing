---
title: "Bulk ENS Resolution: Look Up Multiple Names in One Request"
description: "Learn how to resolve multiple ENS names or reverse-resolve multiple wallet addresses in a single API request using Resolvio's bulk resolution endpoints."
date: "2025-03-31"
readTime: 5
tags: [ENS, API, Performance, Bulk]
excerpt: "Fetching ENS names one by one for a leaderboard or transaction feed is slow. Resolvio's bulk endpoints let you resolve multiple names in a single request."
---

Many Web3 applications need to display ENS names for lists of addresses — leaderboards, transaction histories, governance voter lists, NFT gallery ownership labels. Resolving each address one at a time is slow and hammers rate limits. Resolvio's bulk resolution endpoints solve this with a single API call.

## Why Bulk Resolution Matters

Consider a leaderboard with 100 addresses. Sequential resolution at ~100ms per lookup means 10 seconds of wait time before the page renders. Parallel requests help, but they still consume multiple network round trips and eat rate limit headroom. Bulk resolution batches everything into a single request, typically resolving 50 addresses in under 200ms total.

## Bulk Reverse Resolution

The most common use case: you have a list of wallet addresses and want to display human-readable names next to each one. Pass them as a comma-separated list to the bulk reverse endpoint:

```bash
curl "https://api.resolvio.xyz/ens/v2/reverse/bulk?addresses=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045,0x225f137C3Eb2e12F21e5Be6d21b6f8B07157DebC,0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
```

```json
[
  {
    "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    "name": "vitalik.eth",
    "avatar": "eip155:1/erc1155:...",
    "displayName": "vitalik.eth"
  },
  {
    "address": "0x225f137C3Eb2e12F21e5Be6d21b6f8B07157DebC",
    "name": null,
    "displayName": "0x225f...ebC"
  },
  {
    "address": "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
    "name": "balajis.eth",
    "displayName": "balajis.eth"
  }
]
```

Results are returned in the same order as the input addresses, making it trivial to zip them back with your original data. When an address has no primary ENS name, <code>name</code> is <code>null</code> and <code>displayName</code> falls back to a truncated address.

## Bulk Forward Resolution

If you have a list of ENS names and need their addresses, use the bulk forward endpoint:

```bash
curl "https://api.resolvio.xyz/ens/v2/resolve/bulk?names=vitalik.eth,nick.eth,ens.eth"
```

```json
[
  { "name": "vitalik.eth", "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" },
  { "name": "nick.eth",    "address": "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5" },
  { "name": "ens.eth",     "address": "0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7" }
]
```

## Using Bulk Resolution in Practice

Here's a real-world pattern for enriching a leaderboard with ENS names:

```typescript
interface LeaderboardEntry {
  address: string
  score: number
  displayName?: string
}

async function enrichWithENS(entries: LeaderboardEntry[]): Promise<LeaderboardEntry[]> {
  const addresses = entries.map(e => e.address).join(',')

  const res = await fetch(
    `https://api.resolvio.xyz/ens/v2/reverse/bulk?addresses=${addresses}`
  )
  const resolved = await res.json()

  return entries.map((entry, i) => ({
    ...entry,
    displayName: resolved[i].hasReverseRecord ? resolver[i].name || "",
  }))
}
```

## Performance and Caching

Resolvio batches bulk requests into multicall RPC calls against Ethereum, resolving all names in a single onchain round trip. Results are cached server-side with per-name TTLs, so repeated lookups for the same address are nearly instant.

> Bulk endpoints support up to 50 addresses per request. For larger sets, split into chunks of 50 and run requests in parallel.
