---
title: "How AI Agents Use ENS Names for On-Chain Identity"
description: "Discover how AI agents can resolve ENS names, look up wallet addresses, and use Web3 identity data via simple REST API calls — with tool definitions for Claude and OpenAI."
date: "2025-04-14"
readTime: 6
tags: [AI Agents, ENS, LLM, MCP]
excerpt: "AI agents need to understand who they're talking to onchain. ENS names provide the identity layer — and Resolvio makes them accessible to any agent that can make an HTTP request."
---

As AI agents increasingly operate in Web3 contexts — managing wallets, executing transactions, interpreting onchain data — they face a fundamental UX challenge: Ethereum addresses are 42-character hex strings that are meaningless to both humans and language models. ENS names solve this by providing a human-readable, machine-resolvable identity layer. Here's how to wire it up.

## The Identity Problem for AI Agents

Suppose your AI agent receives a user message: "Send 0.1 ETH to vitalik.eth." The agent needs to resolve <code>vitalik.eth</code> to an actual Ethereum address before it can construct a transaction. Or the agent is summarizing onchain activity and wants to display <code>vitalik.eth</code> instead of <code>0xd8dA...</code> in its response.

Without resolution infrastructure, your agent either has to ship a full Web3 library in its runtime (impractical for most LLM deployment environments) or rely on the user to always provide raw addresses. Neither is a good experience.

## ENS as a Machine-Readable Identity Layer

ENS names are ideal for AI agent use because:

- They're unambiguous — a name either resolves or it doesn't
- They carry rich metadata (avatar, social handles, description) that agents can use for context
- They're stable — a user's ENS name persists even as they rotate wallets
- The resolution API is plain HTTP/JSON — no special runtime or library needed

## Tool Definition for Claude

Here's how to define an ENS resolution tool for a Claude agent using the Anthropic SDK:

```typescript
const tools = [
  {
    name: 'resolve_ens_name',
    description: 'Resolve an ENS name to an Ethereum address and profile data. Use this whenever the user provides a .eth name or you need to look up wallet information for a Web3 identity.',
    input_schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The ENS name to resolve, e.g. "vitalik.eth"',
        },
      },
      required: ['name'],
    },
  },
]

async function handleToolCall(toolName: string, input: { name: string }) {
  if (toolName === 'resolve_ens_name') {
    const res = await fetch(`https://api.resolvio.xyz/ens/v2/profile/${input.name}`)
    return await res.json()
  }
}
```

## Tool Definition for OpenAI Function Calling

```typescript
const functions = [
  {
    name: 'resolve_ens_name',
    description: 'Resolve an ENS name (.eth) to an Ethereum address and profile information.',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'ENS name to resolve, e.g. vitalik.eth' },
      },
      required: ['name'],
    },
  },
]
```

## Reverse Resolution for Agent Summaries

When your agent reads onchain data (transactions, token transfers, governance votes), it encounters raw addresses. Use reverse resolution to make summaries human-readable:

```typescript
// Before: "0xd8dA6BF... sent 100 USDC to 0xAb5801..."
// After:  "vitalik.eth sent 100 USDC to balajis.eth"

async function enrichAddresses(addresses: string[]): Promise<Record<string, string>> {
  const res = await fetch(
    `https://api.resolvio.xyz/ens/v2/reverse/bulk?addresses=${addresses.join(',')}`
  )
  const data = await res.json()
  return Object.fromEntries(
    data.map((item: { address: string; displayName: string }) => [item.address, item.displayName])
  )
}
```

## MCP and AI Plugin Support

Resolvio publishes first-class support files for AI systems:

- <strong>MCP server manifest</strong> at <code>/.well-known/mcp.json</code> — for Model Context Protocol clients
- <strong>AI plugin manifest</strong> at <code>/.well-known/ai-plugin.json</code> — for OpenAI plugin-style discovery
- <strong>Plain-text LLM description</strong> at <code>/llms.txt</code> — a concise description any language model can parse
- <strong>Tool definitions in Markdown</strong> at <code>/Skill.md</code> — copy-paste ready function definitions

> Any agent that can make GET requests can call the Resolvio API. No authentication, no SDK, no configuration — just HTTP.
