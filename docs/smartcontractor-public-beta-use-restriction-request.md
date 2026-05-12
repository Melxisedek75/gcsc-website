# SmartContractor Public Beta Use Restriction Request

## Purpose

This document gives the founder a safe way to honor a public beta tester request to restrict how their demo feedback, screenshots, recordings, quotes, or redacted summaries are used.

This is for demo only public beta work. It is not a full privacy policy, legal advice, production consent-management system, or permission to change live production records. Before public launch, final consent and privacy workflows need founder review and legal review.

## When To Use This

Use this when a tester says:

- "Do not use my feedback in public materials."
- "Do not include my screenshot in a partner packet."
- "Do not quote me in a grant packet or investor packet."
- "Keep my beta notes internal only."
- "Delete or restrict this redacted summary."

Do not use this for real payments, real loans, escrow, token collateral, legal disputes, production customer accounts, or live database restriction changes. Those features stay blocked because real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

## Safe Restriction Fields

The founder can record only these safe fields:

| Field | Safe Example |
|-------|--------------|
| Public beta URL | `PUBLIC_SITE_URL` |
| Tester role | homeowner, contractor, peer reviewer, or founder/admin |
| Issue ID | `BETA-001` |
| Related X-Request-Id | `req-demo-123` |
| Support queue item | safe short label |
| Artifact type | redacted screenshot, redacted summary, quote, or feedback note |
| Restricted use | public materials, partner packet, grant packet, investor packet, provider packet, or all external use |
| Allowed use | internal product debugging only |
| Founder review status | pending, completed, blocked, or escalated |

Do not store private contact details, personal IDs, payment data, wallet data, real customer addresses, no SQL, no secrets, database URLs, API keys, Magic Link tokens, or service-role keys in the restriction log.

## Restricted Uses

If a tester requests restriction, do not use the related artifact or quote in:

- public materials;
- website copy;
- social posts;
- demo videos;
- partner packet;
- grant packet;
- investor packet;
- provider packet;
- legal packet without founder review and legal review.

Internal use may continue only as a redacted summary for product debugging, unless the tester also requested deletion through the public beta data deletion request process.

## Founder Handling Steps

1. Confirm the request is about demo only public beta evidence.
2. Find the issue ID, X-Request-Id, support queue item, artifact, quote, or redacted summary.
3. Mark the artifact as restricted for the requested audience.
4. Remove it from any draft public, partner, grant, investor, or provider packet that has not been sent.
5. If the artifact was already shared externally, route to founder review and legal review before any correction, recall, or follow-up.
6. Keep only a safe internal redacted summary if needed for product debugging.
7. Reply to the tester using the template below.

## Restriction Log Format

Use this safe log format:

```text
SmartContractor public beta use restriction log
Scope: demo only
PUBLIC_SITE_URL:
Tester role:
Issue ID:
X-Request-Id:
Support queue item:
Artifact type:
Restricted use:
Allowed use:
External packet status:
Live-risk gates: real payments disabled / real loans disabled / escrow disabled / token collateral disabled
Founder review required: yes/no
Legal review required: yes/no
```

The log must not include SQL, secrets, personal IDs, private contact details, payment data, wallet data, real customer addresses, database URLs, API keys, Magic Link tokens, service-role keys, raw recordings, or unredacted screenshots.

## Blocked Actions

This restriction template does not authorize:

- live Supabase SQL changes;
- production consent changes;
- external account changes;
- legal promises;
- processing real payments;
- approving real loans;
- releasing escrow;
- using token collateral;
- sending restricted artifacts externally.

Those actions require founder review, legal review, and the final privacy policy process.

## Tester Reply Template

Subject: SmartContractor public beta use restriction received

Message:

Thank you. I received your SmartContractor public beta use restriction request.

This beta is demo only. I will mark the related issue ID, X-Request-Id, support queue note, redacted summary, screenshot, recording, or quote as restricted for the requested use.

I will not use restricted material in public materials, partner packet, grant packet, investor packet, or provider packet unless you later approve it and founder review allows it.

Please do not send SQL, secrets, personal IDs, private contact details, payment data, wallet data, real customer addresses, database URLs, API keys, Magic Link tokens, service-role keys, raw recordings, or unredacted screenshots.

Current beta boundaries remain active: real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

Status: pending founder review.
