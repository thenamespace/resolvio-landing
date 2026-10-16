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

Without resolution infrastructure, your agent either has to use a Web3 library and RPC provider in its runtime or rely on the user to always provide raw addresses. Neither is a good experience.

## ENS as a Machine-Readable Identity Layer

ENS names are ideal for AI agent use because:

- A lookup reports whether the requested records exist; callers must also handle lookup errors
- They carry rich metadata (avatar, social handles, description) that agents can use for context
- A name can stay the same when its owner updates the address records; ownership and records can also change
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
  if (toolName !== 'resolve_ens_name') throw new Error('Unknown tool')
  if (typeof input.name !== 'string' || !input.name.trim()) {
    throw new Error('An ENS name is required')
  }
  const res = await fetch(`https://api.resolvio.xyz/ens/v2/profile/${encodeURIComponent(input.name.trim())}`)
  if (!res.ok) throw new Error(`Resolvio returned ${res.status}`)
  return await res.json()
}
```

The tool definition and handler plug into your agent’s tool loop. See [Claude’s tool-use documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) for returning tool results.

The profile response contains arrays of `texts` and `addresses`. Match by text `key` or address `coin`, and check `exists` before reading `value`.

## Tool Definition for OpenAI Function Calling

```typescript
const tools = [
  {
    type: 'function',
    name: 'resolve_ens_name',
    strict: true,
    description: 'Resolve an ENS name (.eth) to an Ethereum address and profile information.',
    parameters: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: { type: 'string', description: 'ENS name to resolve, e.g. vitalik.eth' },
      },
      required: ['name'],
    },
  },
]
```

Pass this definition as `tools` to the [OpenAI Responses API](https://developers.openai.com/api/docs/guides/function-calling). Your application executes the returned function call with the handler above and sends its result back to the model. These definitions are the ENS tool portion of an agent, not a complete agent loop.

## Reverse Resolution for Agent Summaries

When your agent reads onchain data (transactions, token transfers, governance votes), it encounters raw addresses. Use reverse resolution to make summaries human-readable:

```typescript
interface ReverseRecord {
  address: string
  hasReverseRecord: boolean
  name?: string
}

async function enrichAddresses(addresses: string[]): Promise<Record<string, string>> {
  const unique = [...new Set(addresses.map(address => address.toLowerCase()))]
  const names = new Map<string, string>()
  for (let offset = 0; offset < unique.length; offset += 20) {
    const query = new URLSearchParams({ addresses: unique.slice(offset, offset + 20).join(',') })
    const res = await fetch(`https://api.resolvio.xyz/ens/v2/reverse/bulk?${query}`)
    if (!res.ok) throw new Error(`Resolvio returned ${res.status}`)
    const result: { addresses: ReverseRecord[] } = await res.json()
    for (const record of result.addresses) {
      if (record.hasReverseRecord && record.name) names.set(record.address.toLowerCase(), record.name)
    }
  }
  return Object.fromEntries(addresses.map(address => [address, names.get(address.toLowerCase()) ?? address]))
}
```

## Skills and API Reference

Resolvio publishes support files for AI systems:

- [Resolvio skill](/skill.md) for endpoint selection and integration guidance
- [Plain-text LLM description](/llms.txt) for a concise API summary
- [Full API reference](/llms-full.txt) for response shapes, parameters, and cache behavior
- [OpenAPI schema](https://api.resolvio.xyz/api-docs.json) for tooling

Install the skill with:

```bash
npx skills add thenamespace/skills -s resolvio
```

Any agent that can make GET requests can call the public Resolvio API without an API key. A static manifest is not an MCP server. For human-readable guides, use [Namespace documentation](https://docs.namespace.ninja/user-guide/resolvio).

Before acting on a resolved address, handle missing records and lookup failures. Cached results can be stale; a cache-refresh request is not an immediate-consistency guarantee.
