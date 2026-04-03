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

<strong>ENSIP-9</strong> (ENS Improvement Proposal 9, based on SLIP-0044) defines a standard for storing multi-chain addresses in ENS resolvers. Each chain is assigned a numeric <strong>coin type</strong> — Ethereum mainnet is <code>60</code>, Bitcoin is <code>0</code>, Solana is <code>501</code>, and so on. L2s and EVM-compatible chains use a formula based on their chain ID: <code>0x80000000 | chainId</code>.

## Common Coin Types

- <strong>0</strong> — Bitcoin (BTC)
- <strong>60</strong> — Ethereum (ETH) — the default
- <strong>501</strong> — Solana (SOL)
- <strong>2147483658</strong> — Optimism (0x80000000 | 10)
- <strong>2147492101</strong> — Base (0x80000000 | 8453)
- <strong>2147525809</strong> — Arbitrum One (0x80000000 | 42161)
- <strong>2147484614</strong> — Polygon (0x80000000 | 137)
- <strong>2147492936</strong> — Linea (0x80000000 | 59144)

## Querying Multi-Chain Addresses

Resolvio has a list of all supported chains with their coins and chain names

```bash
curl https://api.resolvio.xyz/ens/v2/chains
```

With Resolvio, pass the <code>coinType</code> or <code>chain name</code> parameter to resolve a name to any supported chain:

```bash
# Get specific addresses using coin type parameter (Ethereum, Bitcoin, Optimism, Base, Solana)
curl https://api.resolvio.xyz/ens/v2/addresses/vitalik.eth?coins=60,0,2147483658,2147492101,501

# Get specific addresses using chain name parameter (Ethereum, Bitcoin, Optimism, Base, Solana)
curl "https://api.resolvio.xyz/ens/v2/addresses/vitalik.eth?coins=eth,btc,opt,base,sol"
```

## Getting Most Common Chain Addresses at Once

The profile endpoint returns most common stored addresses in a single call:

```bash
curl https://api.resolvio.xyz/ens/v2/profile/artii.eth
```

```json
{
  "name": "artii.eth",
  "addresses": [
    {
      "coin": 60,
      "chain": "eth",
      "value": "0x1D84...c19f8",
      "exists": true
    },
    {
      "coin": 2147492101,
      "chain": "base",
      "value": "0x1D84...c19f8",
      "exists": true
    }
  ],
}
```


## Building a Cross-Chain Payment Widget

Multi-chain resolution is essential for payment UX. When a user types an ENS name, your app can query all supported chain addresses and let them pick which network to send on:

```typescript
const COIN_TYPES = {
  ethereum: 60,
  optimism: 2147483658,
  base:     2147492101,
  arbitrum: 2147525809,
} as const

async function getChainAddresses(ensName: string) {
  const profile = await fetch(
    `https://api.resolvio.xyz/ens/v2/profile/${ensName}`
  ).then(r => r.json())

  return Object.entries(COIN_TYPES).reduce<Record<string, string | null>>(
    (acc, [chain, coinType]) => {
      acc[chain] = profile.coinAddresses?.[coinType] ?? null
      return acc
    },
    {}
  )
}

// Returns: { ethereum: "0x...", optimism: "0x...", base: null, arbitrum: "0x..." }
```

> Not every ENS name has addresses set for every chain. A null response for a coin type means the name owner hasn't configured that address — always handle null gracefully.

## L2 Subnames and Multi-Chain

ENS is actively expanding to L2s. ENS names and subnames can be issued natively on chains like Linea and Base, with resolution handled by L2-aware resolvers. Resolvio handles these automatically — the same API call works regardless of whether the name's resolver is on mainnet or an L2.
