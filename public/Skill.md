# Resolvio - AI Agent Skill Definition

Tool definitions for integrating Resolvio ENS resolution into AI agents and agentic pipelines.

**Base URL:** `https://api.resolvio.xyz`
**Auth:** None required
**OpenAPI spec:** `https://api.resolvio.xyz/api-docs.json`

---

## Tool Definitions - Anthropic / Claude format

```json
[
  {
    "name": "resolve_ens_name",
    "description": "Resolve an ENS name to its full Web3 profile: cryptocurrency addresses (ETH, BTC, Base, and 100+ chains), text records (avatar, email, description, socials, and custom keys), and content hash (IPFS, IPNS, Arweave). Use this whenever a user provides an ENS name (e.g. vitalik.eth) and wants to know the associated address or profile.",
    "input_schema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "The ENS name to resolve, e.g. vitalik.eth"
        },
        "chains": {
          "type": "string",
          "description": "Comma-separated chain slugs to include in the response, e.g. eth,btc,base. Omit to use defaults."
        },
        "texts": {
          "type": "string",
          "description": "Comma-separated text record keys to include, e.g. avatar,email,description. Omit to use defaults."
        },
        "useDefault": {
          "type": "boolean",
          "description": "Set to true to fetch a sensible default set of addresses and text records. Recommended for general use."
        }
      },
      "required": ["name"]
    }
  },
  {
    "name": "reverse_resolve_address",
    "description": "Reverse-resolve an Ethereum address to its primary ENS name. Use this when you have a wallet address (0x...) and want to find the human-readable ENS identity associated with it.",
    "input_schema": {
      "type": "object",
      "properties": {
        "address": {
          "type": "string",
          "description": "The Ethereum address to reverse-resolve, e.g. 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
        }
      },
      "required": ["address"]
    }
  },
  {
    "name": "bulk_resolve_ens_names",
    "description": "Resolve multiple ENS names at once in a single API call. Use when you need to look up addresses or profiles for a list of ENS names simultaneously.",
    "input_schema": {
      "type": "object",
      "properties": {
        "names": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Array of ENS names to resolve, e.g. [\"vitalik.eth\", \"nick.eth\"]"
        },
        "useDefault": {
          "type": "boolean",
          "description": "Set to true to fetch a sensible default set of addresses and text records for each name."
        }
      },
      "required": ["names"]
    }
  },
  {
    "name": "bulk_reverse_resolve_addresses",
    "description": "Reverse-resolve multiple Ethereum addresses to ENS names in a single API call.",
    "input_schema": {
      "type": "object",
      "properties": {
        "addresses": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Array of Ethereum addresses to reverse-resolve, e.g. [\"0xd8dA...\", \"0xab5C...\"]"
        }
      },
      "required": ["addresses"]
    }
  }
]
```

---

## Tool Definitions - OpenAI / function calling format

```json
[
  {
    "type": "function",
    "function": {
      "name": "resolve_ens_name",
      "description": "Resolve an ENS name to its full Web3 profile: cryptocurrency addresses (ETH, BTC, Base, and 100+ chains), text records (avatar, email, description, socials, and custom keys), and content hash (IPFS, IPNS, Arweave).",
      "parameters": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "The ENS name to resolve, e.g. vitalik.eth"
          },
          "chains": {
            "type": "string",
            "description": "Comma-separated chain slugs, e.g. eth,btc,base"
          },
          "texts": {
            "type": "string",
            "description": "Comma-separated text record keys, e.g. avatar,email,description"
          },
          "useDefault": {
            "type": "boolean",
            "description": "Fetch a sensible default set of addresses and text records"
          }
        },
        "required": ["name"]
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "reverse_resolve_address",
      "description": "Reverse-resolve an Ethereum address (0x...) to its primary ENS name.",
      "parameters": {
        "type": "object",
        "properties": {
          "address": {
            "type": "string",
            "description": "The Ethereum address to reverse-resolve"
          }
        },
        "required": ["address"]
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "bulk_resolve_ens_names",
      "description": "Resolve multiple ENS names at once in a single API call.",
      "parameters": {
        "type": "object",
        "properties": {
          "names": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Array of ENS names to resolve"
          },
          "useDefault": {
            "type": "boolean",
            "description": "Fetch a sensible default set of addresses and text records for each name"
          }
        },
        "required": ["names"]
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "bulk_reverse_resolve_addresses",
      "description": "Reverse-resolve multiple Ethereum addresses to ENS names in a single API call.",
      "parameters": {
        "type": "object",
        "properties": {
          "addresses": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Array of Ethereum addresses to reverse-resolve"
          }
        },
        "required": ["addresses"]
      }
    }
  }
]
```

---

## HTTP implementation

When the tool is called, map each function to the corresponding REST call:

| Tool | HTTP call |
|---|---|
| `resolve_ens_name` | `GET https://api.resolvio.xyz/ens/v2/profile/{name}?useDefault=true` |
| `reverse_resolve_address` | `GET https://api.resolvio.xyz/ens/v2/reverse/{address}` |
| `bulk_resolve_ens_names` | `GET https://api.resolvio.xyz/ens/v2/profile/bulk?names={name1},{name2}` |
| `bulk_reverse_resolve_addresses` | `GET https://api.resolvio.xyz/ens/v2/reverse/bulk?addresses={addr1},{addr2}` |

All endpoints return JSON. No authentication required.

## Discovery

- **LLM description:** `https://resolvio.xyz/llms.txt`
- **AI plugin manifest:** `https://resolvio.xyz/.well-known/ai-plugin.json`
- **Full OpenAPI spec:** `https://api.resolvio.xyz/api-docs.json`
