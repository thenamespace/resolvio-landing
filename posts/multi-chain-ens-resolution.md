---
title: "Multi-Chain ENS Resolution: Resolve Names Across 100+ Blockchains"
description: "Learn how ENS stores addresses for multiple blockchains using ENSIP-9 coin types, and how to resolve ENS names to Bitcoin, Solana, Optimism, Base, and other chain addresses."
date: "2025-04-21"
readTime: 6
tags: [ENS, Multi-Chain, ENSIP-9, L2]
excerpt: "An ENS name can hold addresses for Bitcoin, Solana, Optimism, Base, and 100+ other chains. Here's how ENSIP-9 works and how to query cross-chain addresses with the Resolvio API."
---

Most developers know ENS as a way to resolve <code>.eth</code> names to Ethereum addresses. But ENS was designed from the start to be chain-agnostic. A single ENS name can store addresses for Bitcoin, Solana, Optimism, Base, Arbitrum, and 100+ other networks — all accessible through a single resolution call.

## ENS's Multi-Chain Design: ENSIP-9

<strong>ENSIP-9</strong> (ENS Improvement Proposal 9, based on SLIP-0044) defines a standard for storing multi-chain addresses in ENS resolvers. Each chain is assigned a numeric <strong>coin type</strong> — Ethereum mainnet is <code>60</code>, Bitcoin is <code>0</code>, Solana is <code>501</code>, and so on. ENSIP-11 extends this for EVM-compatible chains using a formula based on their chain ID: <code>0x80000000 | chainId</code>.

## Common Coin Types

- <strong>0</strong> — Bitcoin (BTC)
- <strong>60</strong> — Ethereum (ETH) — the default
- <strong>501</strong> — Solana (SOL)
- <strong>2147483658</strong> — Optimism (0x80000000 | 10)
- <strong>2147492101</strong> — Base (0x80000000 | 8453)
- <strong>2147525809</strong> — Arbitrum One (0x80000000 | 42161)
- <strong>2147483785</strong> — Polygon (0x80000000 | 137)
- <strong>2147542792</strong> — Linea (0x80000000 | 59144)

## Querying Multi-Chain Addresses

Resolvio lists supported chains with their `name`, numeric `coin`, and `label`. The public directory returned 148 entries on October 14, 2026:

```bash
curl 'https://api.resolvio.xyz/ens/v2/chains'
```

With Resolvio, pass the <code>coins</code> or <code>chains</code> parameter to resolve a name to any supported chain:

```bash
# Get specific addresses using coin type parameter (Ethereum, Bitcoin, Optimism, Base, Solana)
curl 'https://api.resolvio.xyz/ens/v2/addresses/vitalik.eth?coins=60,0,2147483658,2147492101,501'

# Get specific addresses using chain name parameter (Ethereum, Bitcoin, Optimism, Base, Solana)
curl "https://api.resolvio.xyz/ens/v2/addresses/vitalik.eth?chains=eth,btc,op,base,sol"
```

## Getting Most Common Chain Addresses at Once

The profile endpoint returns the standard selection of text and address records in a single call. You can select records explicitly:

```bash
curl 'https://api.resolvio.xyz/ens/v2/profile/vitalik.eth?texts=avatar&addresses=eth&contenthash=false'
```

This response was recorded on October 14, 2026:

```json
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
}
```

Use `addresses` on the profile endpoint. On the addresses endpoint, use either `chains` for chain names or `coins` for numeric identifiers. Do not combine them.

## Building a Cross-Chain Payment Widget

Multi-chain resolution is essential for payment UX. When a user types an ENS name, your app can query all supported chain addresses and let them pick which network to send on:

```typescript
const COIN_TYPES = {
  ethereum: 60,
  optimism: 2147483658,
  base:     2147492101,
  arbitrum: 2147525809,
} as const

interface AddressRecord {
  coin: number
  exists: boolean
  value?: string
}

async function getChainAddresses(ensName: string) {
  const query = new URLSearchParams({ coins: Object.values(COIN_TYPES).join(',') })
  const res = await fetch(
    `https://api.resolvio.xyz/ens/v2/addresses/${encodeURIComponent(ensName)}?${query}`
  )
  if (!res.ok) throw new Error(`Resolvio returned ${res.status}`)
  const result: { addresses: AddressRecord[] } = await res.json()

  return Object.entries(COIN_TYPES).reduce<Record<string, string | null>>(
    (acc, [chain, coinType]) => {
      const record = result.addresses.find(address => address.coin === coinType)
      acc[chain] = record?.exists ? record.value ?? null : null
      return acc
    },
    {}
  )
}

// Returns one address or null for each requested chain.
```

> Not every ENS name has addresses set for every chain. The API marks missing records with `exists: false` and omits `value`. This helper returns null for those records. Do not substitute an Ethereum address for a missing address on another chain.

Before sending a payment, confirm the destination address and chain. Cached lookups can be stale; `noCache=true` requests a refresh but may still be subject to a refresh cooldown.

## L2 Subnames and Multi-Chain

ENS is actively expanding to L2s. ENS names and subnames can be issued natively on chains like Linea and Base, with resolution handled by L2-aware resolvers. Resolvio supports offchain resolution through CCIP-Read when the name’s ENS resolver provides it. Support depends on that resolver and its gateway.

See the [address endpoint reference](https://docs.namespace.ninja/api-reference/resolvio/get-ens-addresses).
