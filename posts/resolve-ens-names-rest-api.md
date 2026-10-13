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

That works, but it requires a Web3 library and an Ethereum RPC endpoint, and this call only gives you the address. Getting the avatar or other text records requires additional calls.

## Forward Resolution with Resolvio

The Resolvio API exposes a simple REST endpoint. No libraries, no RPC key, no boilerplate:

```bash
# Simple address resolution
curl 'https://api.resolvio.xyz/ens/v2/addresses/vitalik.eth?chains=eth'

# Full profile (standard selection of addresses and text records)
curl 'https://api.resolvio.xyz/ens/v2/profile/vitalik.eth'

# Specific text record
curl 'https://api.resolvio.xyz/ens/v2/texts/vitalik.eth?keys=com.twitter'
```

In JavaScript/TypeScript, this is just a fetch call:

```typescript
const res = await fetch('https://api.resolvio.xyz/ens/v2/profile/vitalik.eth')
if (!res.ok) throw new Error(`Resolvio returned ${res.status}`)
const profile = await res.json()

console.log(profile.addresses)
console.log(profile.texts)
console.log(profile.contenthash)
```

The `addresses` and `texts` fields are arrays. Match an address by `coin` or `chain`, or a text record by `key`, then check `exists` before using `value`. Missing records omit `value`. The `contenthash` field is an object with `exists` and an optional `value`.

## Reverse Resolution

Reverse resolution maps a wallet address back to its primary ENS name — essential for displaying human-readable names in transaction histories, leaderboards, and profiles.

```bash
curl 'https://api.resolvio.xyz/ens/v2/reverse/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
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
curl "https://api.resolvio.xyz/ens/v2/addresses/vitalik.eth?chains=btc,op,base"
```

## Caching and Production Use

The public API requires no API key. Results are cached server-side. The source defaults to five minutes for forward records and thirty minutes for reverse lookups; operators can configure these durations. They do not come from the resolver’s onchain TTL. `noCache=true` requests a refresh, but deployments with a refresh cooldown can reuse recent results.

For high-volume production use, you can [self-host Resolvio](https://github.com/thenamespace/resolvio#readme) with your own RPC provider. This gives you control over cache configuration and bulk limits; your upstream provider’s limits still apply.

See the [Namespace documentation](https://docs.namespace.ninja/user-guide/resolvio) for parameters and response formats.
