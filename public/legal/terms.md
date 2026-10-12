# Terms of Service

> PLEASE READ THESE TERMS CAREFULLY. SECTION 15 REQUIRES DISPUTES TO BE RESOLVED BY ARBITRATION.

## 1. About these Terms

These Terms of Service ("**Terms**") are an agreement between you and **Namespace Inc.**, a company incorporated in the British Virgin Islands ("**Namespace**", "**we**", "**us**"), which operates Resolvio. They govern your use of:

- the website at **resolvio.xyz**, including the blog and the browser Playground;
- the hosted API at **api.resolvio.xyz**, including all of its endpoints (current and legacy), its interactive documentation and its OpenAPI files;
- the hosted ENS MCP server at **ens-mcp.namespace.ninja**; and
- the machine-readable files we publish for AI agents, such as `llms.txt`, `skill.md`, `/.well-known/ai-plugin.json` and `/.well-known/mcp.json`

(together, the "**Service**").

By accessing or using the Service — including by sending a single request to the API, whether yourself, through your software or through an AI agent — you agree to these Terms and acknowledge our [Privacy Policy](/privacy). If you use the Service on behalf of an organization, you confirm that you are authorized to bind it, and "you" includes that organization. If you do not agree, do not use the Service.

**Self-hosted code.** The Resolvio source code is published at github.com/thenamespace/resolvio. Your use of that code is governed by the license in that repository, not by these Terms. If you run your own instance, you are its operator and these Terms apply only to the Service that we host.

## 2. Eligibility

You must be at least 18 years old (or the age of majority where you live, if higher). You must not be, or act on behalf of, a person or entity that is subject to sanctions administered by the United Nations, the United States, the European Union, the United Kingdom or the British Virgin Islands, or that is located in a country or territory subject to comprehensive sanctions. You must not use the Service in breach of any sanctions or export-control law.

## 3. What the Service does

Resolvio resolves Ethereum Name Service ("**ENS**") names to the records attached to them (such as wallet addresses for many blockchains, text records and contenthash), and resolves Ethereum addresses to their primary ENS names. It does this by reading the ENS smart contracts on Ethereum through Ethereum RPC nodes and, where a name's resolver requires it, by querying third-party offchain gateways using CCIP-Read. It then returns that data to you.

Resolvio is a **read-only information service**. We do not create, own, verify or control ENS names or their records. We do not register or manage names, hold funds or private keys, or sign or send transactions for anyone.

Resolvio is not operated or endorsed by ENS Labs, the ENS DAO or the ENS Foundation, except as they may separately state.

## 4. Free access and limits

**4.1 Free for everyone.** The Service is free to use and requires no account, API key or sign-up. You do not need to contact us or ask for permission before using it, including in production.

**4.2 Technical limits.** To keep the Service stable for everyone, we may set and change technical limits such as rate limits and bulk-request limits, and we may throttle or block traffic that is abusive or threatens the stability of the Service. You must not get around any limit — for example by rotating IP addresses or splitting traffic across identities.

**4.3 Exceptionally high volume.** If your usage grows to an exceptionally high volume that costs us significant amounts to serve, we may contact you to agree a separate arrangement, such as an API key or a paid plan, for usage at that volume. We will give you at least 30 days' notice before any charge applies. If we cannot reach an agreement, we may limit your usage to a level we can continue to serve for free after that notice period. Any paid arrangement will be governed by separate terms.

## 5. Acceptable use

You must not, and must not allow anyone else to:

- (a) use the Service in breach of any applicable law or sanctions;
- (b) attack, overload, probe or interfere with the Service or its infrastructure, including through denial-of-service attacks, excessive automated traffic, or vulnerability scanning without our written permission;
- (c) use the cache-bypass option (`noCache`) or the cache-clearing endpoint other than to refresh data for a legitimate purpose;
- (d) resell, sublicense or offer the hosted Service as a standalone or white-label API without our written consent (building your own products that use results is fine);
- (e) use the Service to facilitate fraud, phishing, impersonation, address poisoning or other scams;
- (f) use results to track, profile, harass or spam individuals in breach of applicable law; or
- (g) state or imply that Namespace endorses or partners with you without our written consent.

**AI agents and automation.** If you connect an AI agent or other automated system to the Service, you are responsible for its actions as if they were your own, including any transaction it makes based on a result.

## 6. Data accuracy and your responsibility

**6.1 How fresh results are.** Resolvio returns ENS data as it is at the moment of lookup, and caches recent results briefly to keep responses fast. You can always request a fresh lookup — see [how caching works](/references/api.md) in our API reference. Because ENS records can be updated by their owners at any time, and some names rely on resolvers and gateways run by third parties, we can't guarantee that every result is complete or up to date.

**6.2 Verify before you send funds.** Blockchain transactions are generally irreversible. You are solely responsible for verifying any address before sending funds or other digital assets, or otherwise relying on a result. For value transfers, we recommend requesting fresh data and verifying the record onchain.

**6.3 Third-party content.** Text records, avatars, URLs and other record content are created by third parties. We do not review or endorse them, and they may be offensive, misleading, infringing or link to malicious content. You are responsible for how you display or use them in your product.

**6.4 Blockchain risk.** You accept the risks inherent in blockchains and ENS, including smart-contract bugs, protocol changes, chain reorganizations, compromised or malicious resolvers and gateways, expired or transferred names, and look-alike names.

**6.5 No advice.** Nothing provided through the Service is financial, investment, legal or tax advice.

## 7. Privacy and your end users

To operate and secure the Service, we and our infrastructure providers process request data, such as IP addresses, the names and addresses queried, timestamps and user agents, as explained in our [Privacy Policy](/privacy). If you send your end users' queries to the Service, or let their devices call it directly, you are responsible for giving them any notices required by law.

## 8. Availability and changes to the Service

Any uptime or speed figure we publish is a target, not a guarantee, and no service level agreement applies unless agreed in a separate written agreement. We work hard to keep Resolvio fast and reliable — for example, it can automatically switch to backup Ethereum RPC nodes if the primary one fails, and it caches recent results so lookups stay quick. Like any online service, it may still occasionally be unavailable, for example during maintenance or when a blockchain, gateway or hosting provider has problems. We may modify, suspend or discontinue any part of the Service at any time, including endpoints, response formats, default record sets, limits and the legacy `/ens/v1` endpoints. We will try to give reasonable notice of breaking changes through the documentation, but we are not obliged to do so.

## 9. Intellectual property

Namespace owns the Service, the website and its content, and the Resolvio and Namespace names and logos. This excludes open-source code, which is governed by its own license, and third-party data. Subject to these Terms, we grant you a limited, revocable, non-exclusive, non-transferable right to access and use the Service, and you grant us the right to process your queries as needed to provide it. You may state factually that your product uses Resolvio (for example, "ENS resolution by Resolvio"), but you may not otherwise use our names or logos without our permission. If you send us feedback, we may use it freely and without obligation to you.

## 10. Disclaimers

THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE". TO THE FULLEST EXTENT PERMITTED BY LAW, NAMESPACE DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED OR STATUTORY, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, ACCURACY, NON-INFRINGEMENT, AND UNINTERRUPTED, SECURE OR ERROR-FREE OPERATION. WE DO NOT WARRANT THAT ANY RESULT IS ACCURATE OR CURRENT, OR THAT ANY ADDRESS BELONGS TO THE PERSON YOU EXPECT.

## 11. Limitation of liability

To the fullest extent permitted by law, Namespace and its affiliates, directors, officers, employees and contractors are not liable for any indirect, incidental, special, consequential or punitive damages, or for any loss of profits, revenue, data, goodwill or digital assets — including funds sent to an incorrect address — arising from or relating to the Service, even if advised of the possibility of such damages.

Our total liability for all claims relating to the Service is limited to the greater of (a) the amount you paid us for the Service in the 12 months before the claim arose and (b) USD 50. Nothing in these Terms limits liability that cannot be limited under applicable law, such as liability for fraud.

## 12. Indemnity

You will indemnify and hold harmless Namespace and its affiliates, directors, officers, employees and contractors against any claims, losses, liabilities and expenses (including reasonable legal fees) arising from your use of the Service, your products or integrations, your end users or AI agents, your breach of these Terms, or your violation of any law or third-party right.

## 13. Suspension and termination

We may suspend, throttle or end your access to the Service at any time, with or without notice — including by blocking IP addresses or networks — if you breach these Terms, if your use is abusive or threatens the security or stability of the Service, or if the law requires it. Exceptionally high volume is handled under Section 4.3, not this section. You may stop using the Service at any time. Sections 6 and 9 to 17 survive termination.

## 14. Changes to these Terms

We may update these Terms from time to time by posting the new version on this page. Where practicable, we will give reasonable notice of material changes. If you continue to use the Service after changes take effect, you accept the updated Terms.

## 15. Governing law and disputes

These Terms, and any non-contractual obligations arising out of or in connection with them, are governed by the laws of the British Virgin Islands. Before starting arbitration, each party will try to resolve a dispute informally for 30 days after written notice.

Any dispute arising out of or in connection with these Terms, including any question about their existence, validity or termination, will be referred to and finally resolved by arbitration administered by the BVI International Arbitration Centre (BVI IAC) under its Arbitration Rules in force when the arbitration begins. The seat of arbitration is Road Town, Tortola, British Virgin Islands. The tribunal will consist of one arbitrator, and the language of the arbitration is English. Nothing in this section prevents either party from seeking urgent interim relief from a court of competent jurisdiction.

## 16. General

These Terms, together with the Privacy Policy, are the entire agreement between you and Namespace regarding the Service. A separate written agreement with Namespace prevails over these Terms to the extent of any conflict, and these Terms prevail over our documentation, FAQs and agent files. If any provision is found unenforceable, the remainder stays in effect. Our failure to enforce a provision is not a waiver. You may not assign these Terms without our consent; we may assign them to an affiliate or successor. Neither party is liable for delays caused by events beyond its reasonable control. Nothing in these Terms creates a partnership, agency or employment relationship. These Terms are written in English, and the English version prevails over any translation.

## 17. Contact

Namespace Inc. · Telegram: [t.me/+qyo3ZZWct2BlMmMy](https://t.me/+qyo3ZZWct2BlMmMy)

Please don't post confidential information in the group — tell us you need a private channel and we'll set one up.
