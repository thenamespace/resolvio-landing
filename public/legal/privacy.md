# Privacy Policy

> **In short:** Resolvio has no accounts, sets no cookies and runs no analytics, advertising or tracking scripts. To answer a request, our servers and hosting providers necessarily see your IP address and what you look up. The Resolvio application keeps lookup results only briefly, in memory, and never links them to who asked. We don't sell personal information.

## 1. Who we are and what this covers

This Privacy Policy explains how **Namespace Inc.**, a company incorporated in the British Virgin Islands ("**Namespace**", "**we**", "**us**"), handles information when you use Resolvio: the website at **resolvio.xyz** (including the Playground), the hosted API at **api.resolvio.xyz**, the hosted ENS MCP server at **ens-mcp.namespace.ninja**, and our files for AI agents (together, the "**Service**"). Namespace is the controller of the personal data described here.

It does not cover self-hosted copies of Resolvio (their operators are responsible for them), other Namespace products, or third-party sites and platforms such as GitHub, Telegram, X or blockchain networks. It should be read together with our [Terms of Service](/terms).

## 2. What we collect

**Request data.** Every request to the Service carries your IP address, the time, the URL requested and standard HTTP headers such as user agent and referrer. For the API, the URL also contains what you are looking up: ENS names, Ethereum addresses, record keys, chains and options. Our hosting providers and our network infrastructure may record this data in access and security logs. The Resolvio application itself does not store IP addresses; its own logs record operational events and errors and may include the names or addresses being resolved.

**Lookup cache.** To make repeated lookups fast, the API keeps results in server memory, keyed by name or address — by default for up to 5 minutes for forward lookups and 30 minutes for reverse lookups. The cache is never written to disk, does not record who made a request, and is wiped whenever the service restarts.

**MCP rate limiting.** The hosted MCP server counts requests per IP address in memory to enforce a limit of 100 requests per minute. These counters are not stored anywhere else.

**Public ENS records.** Results contain records that ENS name holders publish on public blockchains or through offchain gateways, which may include personal data such as a display name, avatar, email address, website, location or social-media handles. We process these records only to answer lookups. We do not use them to build profiles, contact anyone or market to anyone.

**Your browser.** The website sets no cookies. It saves one value in your browser's `localStorage` — your light or dark theme choice — which stays on your device and is never sent to us. Fonts and scripts are served from our own domain.

**When you contact us.** If you message us (for example on Telegram or GitHub), we receive whatever you share, such as your username and message. Public channels are visible to others and are governed by those platforms' own policies.

We do not ask you to create an account or connect a wallet. **We will never ask for your private keys or seed phrase.**

## 3. How we use it

We use this information to answer your requests, cache results, enforce the MCP server's rate limit, fix errors, reply to you, and comply with the law.

We do not sell personal information, share it for targeted advertising, or use it to make automated decisions that significantly affect you.

## 4. Who receives it

- **Hosting providers.** The website is hosted by **Vercel**. The API and the MCP server are hosted on **Google Cloud** in its Frankfurt, Germany region. These providers process request data on our behalf.
- **Ethereum RPC nodes and data indexers.** To resolve a lookup, our servers send the name or address to the Ethereum RPC node(s) the service is configured to use. Some MCP server tools also query the ENSNode indexing service. These requests come from our servers, so whoever operates these services sees what is being looked up but **not your IP address**.
- **Offchain gateways (CCIP-Read).** Some ENS names keep their records on a server chosen by the name's owner. Our servers contact that gateway to fetch the records. The gateway sees the lookup and our server's IP address, not yours.
- **Legal and safety.** We may disclose information if required by law or legal process, or where needed to protect the Service, our users or the public.
- **Business transfers.** If Namespace is involved in a merger, acquisition or sale of assets, information may transfer as part of it, subject to this Policy.

**If you build on Resolvio:** when your app calls the API directly from your users' devices (as our Playground does), we receive those devices' IP addresses. You are responsible for telling your users that you use Resolvio.

## 5. How long we keep it

- **Lookup cache:** minutes, as described in Section 2, and never beyond a restart.
- **Access, security and application logs:** according to the log-retention settings of our hosting providers and network infrastructure.
- **Messages to us:** as long as needed to deal with them, or as long as they remain on the platform you used.


## 6. International transfers

Namespace is based in the British Virgin Islands. The API and the MCP server run in Google Cloud's Frankfurt, Germany region. The website is served by Vercel's global network, so requests to it may be processed in other countries, including the United States.

## 7. ENS records about you

Data written to a public blockchain is visible to everyone and cannot be deleted by anyone, including us. If you hold an ENS name and don't want a record to appear in Resolvio results, remove or change it through your ENS manager or resolver. Our cached copy expires automatically within the times in Section 2.

## 8. Your rights

Depending on where you live (for example under the GDPR, the UK GDPR, the BVI Data Protection Act 2021 or US state privacy laws), you may have the right to access, correct or delete your personal data, to object to or restrict its processing, to data portability, and to complain to a data protection authority. We won't treat you differently for exercising these rights.

To make a request, contact us as described in Section 11. Because we have no accounts, we usually cannot link log entries to a specific person, so we may ask for details such as your IP address and the approximate time of your requests, and we may need to verify your request. We respond within the time limits required by law.

## 9. Security

The website, the API and the MCP server are served only over HTTPS; plain HTTP requests are redirected. The lookup cache is held only in memory. No system is perfectly secure. If you find a vulnerability, please report it to us privately instead of disclosing it publicly.

## 10. Children and changes

The Service is meant for developers and businesses and is not directed to children. We don't knowingly collect personal data from anyone under 16. If you believe a child has sent us personal data, contact us and we will delete it.

We may update this Policy by posting the new version on this page. Where practicable, we will give reasonable notice of material changes.

## 11. Contact

Namespace Inc. · Telegram: [t.me/+qyo3ZZWct2BlMmMy](https://t.me/+qyo3ZZWct2BlMmMy)

For privacy or security requests, please don't post personal details in the group — tell us you have a privacy request and we'll set up a private channel.
