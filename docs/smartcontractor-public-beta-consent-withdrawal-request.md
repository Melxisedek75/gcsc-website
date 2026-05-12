# SmartContractor Public Beta Consent Withdrawal Request

## Purpose

This document gives the founder a safe way to handle a public beta tester who wants to withdraw consent from the SmartContractor demo-only beta.

This is for demo only public beta work. It is not a full privacy policy, legal advice, production consent-management system, or permission to change live production records. Before public launch, final consent and privacy workflows need founder review and legal review.

## When To Use This

Use this when a tester says:

- "I withdraw consent for the beta."
- "Please stop using my beta feedback."
- "I no longer want to participate."
- "Remove my consent acknowledgement."
- "Do not use my screenshots, recordings, quotes, or redacted summary."

Do not use this for real payments, real loans, escrow, token collateral, legal disputes, production customer accounts, or live database consent changes. Those features stay blocked because real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

## Safe Withdrawal Fields

The founder can record only these safe fields:

| Field | Safe Example |
|-------|--------------|
| Public beta URL | `PUBLIC_SITE_URL` |
| Tester role | homeowner, contractor, peer reviewer, or founder/admin |
| Issue ID | `BETA-001` |
| Related X-Request-Id | `req-demo-123` |
| Support queue item | safe short label |
| Consent status | withdraw consent |
| Related document | consent acknowledgement, privacy notice, data deletion request, data export request, data correction request, or use restriction request |
| Artifact status | restricted, pending deletion, retained as redacted summary, or escalated |
| Founder review status | pending, completed, blocked, or escalated |

Do not store private contact details, personal IDs, payment data, wallet data, real customer addresses, no SQL, no secrets, database URLs, API keys, Magic Link tokens, or service-role keys in the withdrawal log.

## What Changes After Withdrawal

After a valid withdrawal request:

- stop inviting the tester to new beta sessions;
- stop using their quotes, screenshots, recordings, or redacted summaries in public materials;
- mark related support queue items as consent withdrawn;
- route any existing public, partner, grant, investor, provider, or legal packet use to founder review and legal review;
- use the data deletion request, data export request, data correction request, or use restriction request process if the tester asks for those specific actions too.

Internal product debugging may keep only a minimal redacted summary when founder review allows it and no deletion request applies.

## Founder Handling Steps

1. Confirm the request is about demo only public beta participation.
2. Find the issue ID, X-Request-Id, support queue item, consent acknowledgement, and related artifact records.
3. Mark the tester as withdrawn for future beta invites.
4. Mark related artifacts as restricted from public, partner, grant, investor, provider, and legal packet use until founder review is complete.
5. If the tester also asks for deletion, export, correction, or use restriction, route to the matching request document.
6. Do not run SQL, live Supabase changes, external account changes, or production privacy actions from this template.
7. Reply to the tester using the template below.

## Withdrawal Log Format

Use this safe log format:

```text
SmartContractor public beta consent withdrawal log
Scope: demo only
PUBLIC_SITE_URL:
Tester role:
Issue ID:
X-Request-Id:
Support queue item:
Consent status: withdraw consent
Related document:
Artifact status:
Live-risk gates: real payments disabled / real loans disabled / escrow disabled / token collateral disabled
Founder review required: yes/no
Legal review required: yes/no
```

The log must not include SQL, secrets, personal IDs, private contact details, payment data, wallet data, real customer addresses, database URLs, API keys, Magic Link tokens, service-role keys, raw recordings, or unredacted screenshots.

## Blocked Actions

This consent withdrawal template does not authorize:

- live Supabase SQL changes;
- production consent changes;
- external account changes;
- legal promises;
- privacy policy changes;
- processing real payments;
- approving real loans;
- releasing escrow;
- using token collateral;
- deleting production records.

Those actions require founder review, legal review, and the final privacy policy process.

## Tester Reply Template

Subject: SmartContractor public beta consent withdrawal received

Message:

Thank you. I received your SmartContractor public beta consent withdrawal request.

This beta is demo only. I will stop inviting you to new beta sessions and mark the related issue ID, X-Request-Id, support queue note, consent acknowledgement, screenshot, recording, quote, or redacted summary as withdrawn or restricted for future beta use.

If you also want deletion, export, correction, or a narrower use restriction, I will handle that through the matching public beta data deletion request, data export request, data correction request, or use restriction request process.

Please do not send SQL, secrets, personal IDs, private contact details, payment data, wallet data, real customer addresses, database URLs, API keys, Magic Link tokens, service-role keys, raw recordings, or unredacted screenshots.

Current beta boundaries remain active: real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

Status: pending founder review.
