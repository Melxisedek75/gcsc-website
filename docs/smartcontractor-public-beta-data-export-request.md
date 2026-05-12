# SmartContractor Public Beta Data Export Request

## Purpose

This document gives the founder a safe way to answer a public beta tester who asks what beta information SmartContractor has about their demo session.

This is for demo only public beta work. It is not a full privacy policy, legal advice, production data-subject request process, or promise that real production data export is ready. Before public launch, the final privacy policy and production export workflow need founder review and legal review.

## When To Use This

Use this when a tester asks:

- "What feedback did you save from my beta session?"
- "Can you send me my beta issue notes?"
- "Can I see what screenshot or recording you kept?"
- "What request ID or support queue item is linked to my test?"

Do not use this for real payments, real loans, escrow, token collateral, legal disputes, production customer data, or live database exports. Those features stay blocked because real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

## Safe Export Fields

The founder can share only a small redacted summary:

| Field | Safe Example |
|-------|--------------|
| Public beta URL | `PUBLIC_SITE_URL` |
| Tester role | homeowner, contractor, peer reviewer, or founder/admin |
| Issue ID | `BETA-001` |
| Related X-Request-Id | `req-demo-123` |
| Support queue status | open, closed, product follow-up, founder review, or blocked |
| Artifact status | no artifact, redacted screenshot, deleted raw artifact, or redacted summary |
| Non-sensitive summary | Short description of the demo issue or feedback |
| Live-risk gates | real payments disabled, real loans disabled, escrow disabled, token collateral disabled |

If the tester does not know the issue ID or X-Request-Id, the founder can still prepare a safe summary by matching tester role, date, and support queue note.

## What Not To Export

Do not export:

- no SQL;
- no secrets;
- personal IDs;
- private contact details;
- payment data;
- wallet data;
- real customer addresses;
- database URLs;
- API keys;
- Magic Link tokens;
- service-role keys;
- unredacted screenshots;
- raw recordings;
- browser cookies;
- database rows copied directly from Supabase.

If any requested artifact contains sensitive information, do not send it. Create a redacted summary instead and mark the request founder review required.

## Founder Handling Steps

1. Confirm the request is about a demo only public beta session.
2. Find the related issue ID, X-Request-Id, support queue note, or redacted screenshot.
3. Remove private contact details, personal IDs, payment data, wallet data, real customer addresses, and secrets.
4. Prepare only the safe export fields listed above.
5. If the request touches privacy policy, legal rights, production accounts, real payments, real loans, escrow, or token collateral, stop and route it to founder review and legal review.
6. Send the tester the reply template below.
7. Record the request in the support queue without private contact details.

## Export Package Format

Use this plain text package:

```text
SmartContractor public beta data export summary
Scope: demo only
PUBLIC_SITE_URL:
Tester role:
Issue ID:
X-Request-Id:
Support queue status:
Artifact status:
Redacted summary:
Live-risk gates: real payments disabled / real loans disabled / escrow disabled / token collateral disabled
Founder review required: yes/no
```

This package should contain only redacted summary information. It must not include SQL, secrets, personal IDs, private contact details, payment data, wallet data, real customer addresses, database URLs, API keys, Magic Link tokens, service-role keys, raw recordings, or unredacted screenshots.

## Blocked Actions

This export template does not authorize:

- live Supabase SQL changes;
- raw database exports;
- production account exports;
- external account changes;
- legal promises;
- processing real payments;
- approving real loans;
- releasing escrow;
- using token collateral;
- sending unredacted artifacts.

Those actions require founder review, legal review, and the final privacy policy process.

## Tester Reply Template

Subject: SmartContractor public beta data export summary

Message:

Thank you. I received your request for a SmartContractor public beta data export summary.

This beta is demo only. I can share a redacted summary of your tester role, issue ID, X-Request-Id, support queue status, artifact status, and non-sensitive feedback summary.

I will not send SQL, secrets, personal IDs, private contact details, payment data, wallet data, real customer addresses, database URLs, API keys, Magic Link tokens, service-role keys, raw recordings, or unredacted screenshots.

Current beta boundaries remain active: real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

Status: pending founder review.
