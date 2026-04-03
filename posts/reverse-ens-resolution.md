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
2. Navigate to "My Account" → "Primary Name"
3. Select the ENS name you own and want as your primary
4. Confirm the transaction (this writes to the .addr.reverse record)

For smart contracts, the reverse record can be set programmatically via the <code>ReverseRegistrar</code> contract — useful for protocols that want their contract addresses to display a human-readable name.

## Reverse Resolution with Resolvio

```bash
# Single address reverse resolution
curl https://api.resolvio.xyz/ens/v2/reverse/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

```json
{
  "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "name": "vitalik.eth",
  "hasReverseRecord": true,
}
```

When an address has no primary ENS name set, <code>name</code> is <code>null</code> and <code>displayName</code> is a truncated version of the address (e.g. <code>0xd8dA...6045</code>).

## Bulk Reverse Resolution

For lists of addresses — transaction feeds, leaderboards, voter lists — use the bulk endpoint:

```bash
curl "https://api.resolvio.xyz/ens/v2/reverse/bulk?addresses=0xd8dA...,0xAb58...,0x225f..."
```

All addresses are resolved in a single request using onchain multicall batching. Results are returned in input order.

## Display Best Practices

- Always show the <code>displayName</code> field — it gracefully falls back to a truncated address when no ENS name is set
- Show the avatar if available — it significantly improves perceived identity
- Cache reverse resolution results on the client for the session; ENS primary names rarely change
- For payments, always confirm the resolved address before sending — never send funds based on a displayed name without re-verifying the forward resolution

> Security note: always verify forward resolution before using a name for payment. The Resolvio API performs this check automatically — if forward and reverse don't match, the name field is null.
