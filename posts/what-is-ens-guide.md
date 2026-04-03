---
title: "What is ENS? A Developer's Complete Guide to Ethereum Name Service"
description: "Learn what ENS (Ethereum Name Service) is, how it works, and how developers can use it to resolve human-readable names to wallet addresses and onchain data."
date: "2025-03-10"
readTime: 7
tags: [ENS, Ethereum, Web3, Explainer]
excerpt: "ENS turns cryptographic wallet addresses into human-readable names like vitalik.eth. Here's everything a developer needs to know about how it works under the hood."
---

If you've spent any time in the Ethereum ecosystem, you've almost certainly seen names like <strong>vitalik.eth</strong> or <strong>uniswap.eth</strong>. These are ENS names — human-readable identifiers that map to Ethereum addresses, IPFS contenthashes, and a rich set of onchain records. For developers building wallets, dApps, or AI agents, understanding ENS is foundational.

## What is ENS?

ENS stands for <strong>Ethereum Name Service</strong>. It is a decentralized naming protocol built on top of Ethereum that allows any wallet address (or smart contract) to be given a human-readable name. Think of it as DNS for the blockchain — but owned by no single company, stored onchain, and extensible by anyone.

ENS names live under the <code>.eth</code> top-level domain, though ENS also supports traditional DNS names (like <code>yourapp.com</code>) that have been imported into the protocol. Names are registered as NFTs on Ethereum, which means they can be transferred, traded, and owned with full self-custody.

## How ENS Names Work

ENS is built around two core contracts: the <strong>Registry</strong> and <strong>Resolvers</strong>. The Registry maps each name to a resolver contract address. The resolver is where the actual records live — the Ethereum address, avatar, email, and any other data attached to the name.

When you resolve a name like <code>vitalik.eth</code>, the process looks like this:

1. Compute the namehash of vitalik.eth (a deterministic hash of the name's labels)
2. Query the ENS Registry to find the resolver contract for that namehash
3. Call the resolver's addr() function to get the Ethereum address
4. Optionally call text() for additional records (avatar, email, Twitter, etc.)

This resolution process requires multiple RPC calls to Ethereum mainnet. That's why using a dedicated resolution API — like Resolvio — is far simpler than implementing this manually.

## ENS Records and Text Fields

Beyond a simple address mapping, ENS names can store a rich set of records. The most commonly used ones are:

- <strong>addr(60)</strong> — The primary Ethereum address (coin type 60)
- <strong>addr(N)</strong> — Addresses on other chains (Bitcoin, Solana, etc.) via ENSIP-9
- <strong>text("avatar")</strong> — Profile picture (URL, IPFS, or NFT reference)
- <strong>text("email")</strong> — Contact email
- <strong>text("url")</strong> — Website URL
- <strong>text("com.twitter")</strong> — Twitter/X handle
- <strong>text("com.github")</strong> — GitHub username
- <strong>contenthash</strong> — IPFS/IPNS/Arweave hash for a decentralized website

## ENS Subnames

ENS supports subnames — names under a parent name, separated by dots. For example, <code>alice.myprotocol.eth</code> is a subname of <code>myprotocol.eth</code>. The parent name owner controls who can create subnames and under what rules.

Subnames can be stored fully onchain (as registry entries on Ethereum) or offchain via CCIP-Read — a standard that lets a resolver fetch data from an external API at resolution time. Off-chain subnames are far cheaper to issue and are popular for protocols that want to give users human-readable names without gas costs.

## ENS vs Traditional DNS

- <strong>Ownership</strong>: ENS names are self-custodied NFTs. DNS names are leased from registrars and can be revoked.
- <strong>Censorship resistance</strong>: ENS is permissionless. No central authority can revoke a name.
- <strong>Programmability</strong>: ENS resolvers are smart contracts. Any custom resolution logic can be built in.
- <strong>Multi-chain</strong>: ENS natively stores addresses for 100+ blockchain networks in one name.
- <strong>Cost</strong>: ENS names require gas for registration and updates. DNS is cheaper for simple use.

## Resolving ENS Names Without Writing Web3 Code

Traditionally, resolving ENS required importing ethers.js or viem and connecting to an Ethereum RPC provider. This adds bundle size, complexity, and requires managing RPC keys. With <strong>Resolvio</strong>, you can resolve any ENS name with a single HTTP GET request — no web3 library required.

```bash
# Resolve vitalik.eth to an Ethereum address
curl https://api.resolvio.xyz/ens/v2/addresses/vitalik.eth?chains=eth,base,btc,solana

# Get the full profile (address, avatar, socials, etc.)
curl https://api.resolvio.xyz/ens/v2/profile/vitalik.eth
```

```json
{
  "name": "vitalik.eth",
  "texts": [
    {
      "key": "avatar",
      "value": "https://euc.li/vitalik.eth",
      "exists": true
    },
    {
      "key": "email",
      "exists": false
    },
    {
      "key": "description",
      "value": "mi pinxe lo crino tcati",
      "exists": true
    },
  ],
  "addresses": [
    {
      "coin": 60,
      "chain": "eth",
      "value": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      "exists": true
    },
    {
      "coin": 2147492101,
      "chain": "base",
      "exists": false
    }
  ],
  "contenthash": {
    "value": "ipfs://bafybeiaql2jo3fu5b7c4lmpoi5drh5sam7yt652shwdgwbky4o7uw33u2u",
    "exists": true
  },
  "resolver": "0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63"
}
```

## Getting Started

The Resolvio API is free, requires no API key, and supports ENS forward resolution, reverse resolution, bulk lookups, and multi-chain address queries. It's the fastest way to add ENS resolution to any app, script, or AI agent.

> Try it now: curl https://api.resolvio.xyz/ens/v2/profile/YOUR-NAME.eth and see the full record set returned in milliseconds.
