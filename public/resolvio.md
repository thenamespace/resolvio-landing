# Resolvio

Resolvio is Namespace's HTTP API for ENS resolution. It reads ENS profiles, addresses, text records, and content hashes, including supported offchain subnames. Reverse lookups return verified primary names for Ethereum addresses.

- [Documentation](https://docs.namespace.ninja/user-guide/resolvio)
- [Endpoint reference](https://docs.namespace.ninja/api-reference/resolvio/get-ens-profile)
- [Machine-readable reference](https://resolvio.xyz/llms-full.txt)
- [Agent skill](https://resolvio.xyz/skill.md)
- [Source and self-hosting](https://github.com/thenamespace/resolvio)

## Make a request

```bash
curl 'https://api.resolvio.xyz/ens/v2/profile/vitalik.eth?texts=avatar&addresses=eth&contenthash=false'
```

Text and address records are arrays with an `exists` flag and optional `value`. Contenthash is an object. Read the endpoint reference for the complete response contract.

Public reads need no API key. Default bulk limits are 20 names or addresses. Cache durations are configurable, with source defaults of five minutes for forward records and thirty minutes for reverse lookups. A refresh request can reuse recent cached data on deployments with a refresh cooldown.
