---
title: "ENS vs DNS: Web3 Naming Systems Compared"
description: "A technical comparison of ENS (Ethereum Name Service) and DNS (Domain Name System) — how they differ in architecture, ownership, censorship resistance, and use cases."
date: "2025-04-07"
readTime: 7
tags: [ENS, DNS, Web3, Comparison]
excerpt: "ENS and DNS both map human-readable names to addresses, but the similarities end there. Here's a clear technical comparison for developers building on the web and Web3."
---

When people first encounter ENS, they often describe it as "blockchain DNS." That analogy is useful for a quick explanation, but it obscures important differences in how the two systems work, who controls them, and what you can build with them. Here's a clear-eyed comparison for developers who work across both.

## What DNS Does

The Domain Name System is a hierarchical, globally distributed database that maps domain names like <code>github.com</code> to IP addresses. It's operated by a network of authoritative nameservers, coordinated by ICANN, and cached by resolvers worldwide. DNS was designed in the 1980s for reliability and speed — and it achieves both, serving billions of queries per second.

DNS records include A records (IPv4 address), AAAA records (IPv6), CNAME (alias), MX (mail), TXT (arbitrary text), and more. Records are managed through your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.).

## How ENS Works Differently

ENS stores name records in smart contracts on Ethereum. Instead of mapping names to IP addresses, it maps names to:

- Ethereum wallet addresses (and addresses on 100+ other chains)
- IPFS, IPNS, Arweave, or Swarm contenthashes (for decentralized websites)
- Arbitrary text records (avatar, email, social handles, description)
- ABI data (for smart contract interfaces)

There is no central registrar. Anyone can register a <code>.eth</code> name by interacting directly with the ENS contracts. Ownership is represented as an ERC-721 or ERC-1155 NFT, transferable peer-to-peer.

## Technical Differences

- <strong>Storage</strong>: DNS records live on authoritative nameservers. ENS records live in Ethereum smart contracts (onchain) or behind CCIP-Read gateways (offchain).
- <strong>Ownership model</strong>: DNS names are leased annually. ENS names are owned as NFTs with yearly renewal prices. Subnames can optionally never expiry. The owner is the NFT holder.
- <strong>Update mechanism</strong>: DNS updates propagate via TTL-based caching (minutes to 48h). ENS updates are onchain transactions, final once confirmed.
- <strong>Censorship resistance</strong>: DNS can be seized, suspended, or blocked at the registrar, registry, or ISP level. ENS names cannot be unilaterally revoked while the owner holds the NFT.
- <strong>Resolution speed</strong>: DNS resolution is microseconds (cached). Raw ENS resolution requires Ethereum RPC calls (~100–500ms). With a caching layer like Resolvio, this drops to &lt;50ms.
- <strong>Cost</strong>: DNS registration is $10–20/year. ENS registration involves gas fees and a registration fee (currently ~$5/year for 5+ character names).
- <strong>Programmability</strong>: DNS is read-only from the application layer. ENS resolvers are smart contracts — resolution logic can be fully customized.

## DNS Names in ENS

ENS also supports traditional DNS names via DNSSEC. If you own <code>yourapp.com</code>, you can claim it in ENS by setting a specific TXT record in your DNS that proves ownership. Once claimed, <code>yourapp.com</code> can have an ENS resolver and store onchain records — your DNS name becomes a Web3 identity too.

> DNS names claimed in ENS resolve through the same Resolvio endpoints as .eth names. No special handling needed.

## When to Use Each

- <strong>Use DNS</strong> for: hosting websites, email delivery, CDN routing, any application that relies on the global internet infrastructure.
- <strong>Use ENS</strong> for: wallet payment addresses, onchain identity, NFT-gated access, decentralized website hosting (via IPFS contenthash), Web3 login (with ENS as the identifier).
- <strong>Use both</strong> when you want your users to have a single name (<code>yourapp.com</code>) that works for both traditional web traffic and onchain payments.

## Resolving Both with Resolvio

Resolvio resolves both <code>.eth</code> names and DNS names that have been registered in ENS, through the same API endpoint. Your application code doesn't need to know which type of name it's resolving.

```bash
# .eth name
curl https://api.resolvio.xyz/ens/v2/resolve/vitalik.eth

# DNS name with ENS resolver
curl https://api.resolvio.xyz/ens/v2/resolve/nick.xyz
```
