---
title: "Resolve ENS Names via REST API — No Web3 Library Required"
description: "Learn how to resolve ENS names to Ethereum addresses, avatars, and text records using a simple REST API call, without importing ethers.js or viem."
date: "2025-03-17"
readTime: 6
tags: [ENS, API, Tutorial, REST]
excerpt: "Skip the ethers.js overhead. Resolve ENS names to addresses, avatars, and text records with a single HTTP GET request using the Resolvio API."
---

Resolving an ENS name traditionally means importing a full Web3 library, spinning up an RPC connection, and writing several lines of async code. For most applications — especially backend services, AI agents, and microservices — this overhead is unnecessary. The Resolvio REST API lets you resolve any ENS name with a single HTTP call, from any language or runtime.

## The Traditional Approach (and Its Problems)

Using ethers.js v6, resolving a name looks like this:

```typescript
import { ethers } from 'ethers'

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
const address = await provider.resolveName('vitalik.eth')
// "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
```

That works — but it requires: a 300KB+ library, an Ethereum RPC endpoint (and a key to go with it), async/await handling, and it only gives you the address. Getting the avatar or other text records requires additional calls.

## Forward Resolution with Resolvio

The Resolvio API exposes a simple REST endpoint. No libraries, no RPC key, no boilerplate:

```bash
# Simple address resolution
curl https://api.resolvio.xyz/ens/v2/addresses/vitalik.eth?chain=eth

# Full profile (address + avatar + all text records)
curl https://api.resolvio.xyz/ens/v2/profile/vitalik.eth

# Specific text record
curl https://api.resolvio.xyz/ens/v2/texts/vitalik.eth?keys=com.twitter
```

In JavaScript/TypeScript, this is just a fetch call:

```typescript
const res = await fetch('https://api.resolvio.xyz/ens/v2/profile/vitalik.eth')
const profile = await res.json()

console.log(profile.addresses)      
console.log(profile.texts)       
console.log(profile.contenthash)
```

## Reverse Resolution

Reverse resolution maps a wallet address back to its primary ENS name — essential for displaying human-readable names in transaction histories, leaderboards, and profiles.

```bash
curl https://api.resolvio.xyz/ens/v2/reverse/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

```json
{
  "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "hasReverseRecord": true,
  "name": "vitalik.eth"
}
```

## Multi-Chain Address Resolution

ENS names can store addresses for hundreds of chains via ENSIP-9. Pass a <code>chains</code> parameter to resolve to any supported network:

```bash
# Bitcoin,Optimism and Base addresses for an ENS name
curl "https://api.resolvio.xyz/ens/v2/addresses/vitalik.eth?chains=btc,opt,base"
```

## Rate Limits and Production Use

The public API is free and requires no API key for development and moderate production traffic. Results are cached server-side with TTLs derived from each resolver's onchain <code>ttl()</code> value, which means most responses return in under 50ms.

> For high-volume production use, you can easily host an instance of resolvio yourself and remove the api limiting

You can also bypass the cache for a specific request using the <code>noCache=true</code> query parameter — useful when you need the freshest onchain data after a name update.
