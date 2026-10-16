---
title: "Reverse ENS Resolution: From Wallet Address to Human-Readable Name"
description: "Learn what reverse ENS resolution is, how to set up a primary ENS name for a wallet, and how to look up ENS names from Ethereum addresses using the Resolvio API."
date: "2025-04-28"
readTime: 5
tags: [ENS, Reverse Resolution, Tutorial]
excerpt: "Reverse resolution turns 0xd8dA... into vitalik.eth. Here's how it works under the hood, how to set your primary ENS name, and how to query it via API."
---

Forward ENS resolution maps a name (<code>vitalik.eth</code>) to an address (<code>0xd8dA...</code>). Reverse resolution does the opposite — it maps an Ethereum address back to its primary ENS name. This is essential for any application that displays wallet activity: transaction feeds, governance dashboards, NFT marketplaces, and leaderboards.

## How Reverse Resolution Works

ENS implements reverse resolution through a special domain: the <code>.addr.reverse</code> namespace. Every Ethereum address maps to a corresponding reverse record at <code>[address].addr.reverse</code>. For example, Vitalik's address maps to <code>d8da6bf26964af9d7eed9e03e53415d37aa96045.addr.reverse</code>.

The <code>name()</code> function on that reverse record returns the user's claimed primary name. The resolution process then performs a <strong>forward verification step</strong>: it resolves the returned name forward and checks that the resulting address matches the original address. This prevents spoofing — a user can't claim someone else's name as their reverse record without controlling the forward resolution too.

## Setting Up a Primary ENS Name

To have a primary ENS name, a wallet owner must explicitly set it. In the ENS app (<code>app.ens.domains</code>):

1. Connect the wallet whose address you want to map
2. Open the primary name settings
3. Select an ENS name that resolves to your address
4. Confirm the transaction to set the reverse record

For smart contracts, the reverse record can be set programmatically via the <code>ReverseRegistrar</code> contract — useful for protocols that want their contract addresses to display a human-readable name.

## Reverse Resolution with Resolvio

```bash
# Single address reverse resolution
curl 'https://api.resolvio.xyz/ens/v2/reverse/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
```

```json
{
  "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "name": "vitalik.eth",
  "hasReverseRecord": true
}
```

When no verified primary name is found, `hasReverseRecord` is false and `name` is omitted. The single reverse endpoint does not return `displayName` or an avatar.

To fetch profile data too, use `/ens/v2/reverse/:address/profile`. It adds `avatar`, `displayName`, `description`, and a nested `profile`. The display name comes from the `name` text record. If no verified name exists, those fields and `name` are null.

## Bulk Reverse Resolution

For lists of addresses — transaction feeds, leaderboards, voter lists — use the bulk endpoint:

```bash
curl "https://api.resolvio.xyz/ens/v2/reverse/bulk?addresses=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045,0x225f137127d9067788314bc7fcc1f36746a3c3B5"
```

The response is an object containing an `addresses` array of reverse records. The default limit is 20 addresses. Inputs are deduplicated case-insensitively, so match results by address rather than position.

## Display Best Practices

- Show the verified `name` when present and format the original address as a fallback. If you use the reverse-profile endpoint, its `displayName` may also be null.
- Show the avatar if available from the reverse-profile endpoint.
- Account for server-side caching before adding a client cache. Reverse lookups default to a thirty-minute server cache, configurable by the operator.
- For payments, always confirm the resolved address before sending — never send funds based on a displayed name without re-verifying the forward resolution

> Resolvio forward-verifies primary names. When verification fails, the single reverse endpoint omits `name`. Verification does not guarantee freshness: cached data can be stale, and `noCache=true` requests may be subject to a refresh cooldown.

See the [reverse lookup reference](https://docs.namespace.ninja/api-reference/resolvio/reverse-resolve-single).
