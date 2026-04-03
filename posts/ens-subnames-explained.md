---
title: "ENS Subnames Explained: Building Identity Systems on Ethereum"
description: "Understand ENS subnames — what they are, how onchain and offchain subnames differ, and how to resolve them programmatically using the Resolvio API."
date: "2025-03-24"
readTime: 8
tags: [ENS, Subnames, Identity, Web3]
excerpt: "ENS subnames let protocols issue human-readable names like alice.yourapp.eth to users. Here's how they work — and how to resolve them without writing resolver code."
---

ENS names like <code>vitalik.eth</code> are the most visible part of the Ethereum naming system, but they're just the tip of the iceberg. ENS supports an infinite hierarchy of <strong>subnames</strong> — names nested under a parent, like <code>alice.myprotocol.eth</code> or <code>user123.coolapp.eth</code>. Subnames have become the foundation of Web3 identity systems, letting protocols assign human-readable names to users at scale.

## What Are ENS Subnames?

An ENS subname is any name with more than one label separated by dots. If you own <code>myprotocol.eth</code>, you control the entire namespace under it — you can create <code>alice.myprotocol.eth</code>, <code>bob.myprotocol.eth</code>, and any other subname you like, either directly or by deploying a custom resolver that handles the logic programmatically.

From the resolver's perspective, subnames resolve identically to top-level names. A client calls <code>addr(namehash("alice.myprotocol.eth"))</code> and gets back an Ethereum address. The resolution path is the same; only the data source differs.

## On-Chain vs Off-Chain Subnames

There are two fundamental approaches to issuing subnames:

### On-Chain Subnames

On-chain subnames are stored directly in the ENS Registry on Ethereum mainnet. Each subname is a separate registry entry, and setting records (like an address) requires a transaction. This approach provides the strongest guarantees — every record is verifiable onchain — but comes with gas costs for each issuance and update.

### Off-Chain Subnames (CCIP-Read)

Off-chain subnames use <strong>CCIP-Read</strong> (EIP-3668), a standard that allows an ENS resolver to redirect resolution requests to an external HTTPS endpoint. The parent name owner deploys a resolver that points to their own API. When a client resolves <code>alice.myprotocol.eth</code>, the resolver tells the client to fetch data from <code>https://api.myprotocol.xyz/ens/{sender}/{data}.json</code> and verify the response signature.

Off-chain subnames are essentially free to issue — no gas required per user. The trade-off is that the data is managed by a centralized server, though the resolver can enforce signature verification to prevent tampering.

## Use Cases for Subnames

- <strong>Protocol identity</strong>: Give each user a name like <code>alice.uniswap.eth</code> tied to their account
- <strong>NFT communities</strong>: Issue <code>0001.bayc.eth</code> to token holders
- <strong>DAOs</strong>: Assign <code>alice.compound.eth</code> to governance participants
- <strong>Gaming</strong>: Player usernames like <code>wizard.mygame.eth</code> with in-game metadata in text records
- <strong>Enterprise</strong>: Department identities like <code>payments.company.eth</code> for smart contract routing

## How Subname Resolution Works

For onchain subnames, the resolution is straightforward — the ENS Registry has a direct entry. For offchain subnames, the process involves one extra step:

1. Client calls the resolver contract with the subname's namehash
2. Resolver returns an OffchainLookup error containing a gateway URL
3. Client fetches signed data from the gateway URL
4. Client calls the resolver again with the signed response
5. Resolver verifies the signature and returns the record

Resolvio handles this entire flow automatically. Whether a subname is onchain or offchain, you make the same API call and get the same response format.

## Resolving Subnames with Resolvio

The Resolvio API resolves subnames with zero configuration — just pass the full name:

```bash
# Resolve an offchain subname
curl https://api.resolvio.xyz/ens/v2/profile/alice.namespace.eth

# Resolve an onchain subname on an L2
curl https://api.resolvio.xyz/ens/v2/profile/user.linea.eth
```

```json
{
  "name": "alice.namespace.eth",
  "address": "0xAbC123...",
  "avatar": "https://example.com/avatar.png",
  "records": {
    "com.twitter": "aliceeth",
    "description": "Web3 developer"
  }
}
```

> Resolvio automatically handles CCIP-Read (offchain) lookups. You don't need to implement the gateway fetch-and-verify loop in your code.

## Building Your Own Subname System

If you want to issue subnames under your own <code>.eth</code> name, Namespace provides the infrastructure — offchain resolvers, issuance APIs, and management tooling — so you can launch a subname program without deploying custom smart contracts. Resolvio will resolve your subnames out of the box once you're set up.
