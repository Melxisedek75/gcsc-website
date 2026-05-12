# SmartContractor Public Beta Data Correction Request

## Purpose

This document gives the founder a safe way to handle a public beta tester request to correct a mistake in beta feedback, issue notes, support queue summaries, or redacted demo evidence metadata.

This is for demo only public beta work. It is not a full privacy policy, legal advice, production correction workflow, or permission to edit live production records. Before public launch, the final privacy policy and production correction process need founder review and legal review.

## When To Use This

Use this when a tester says:

- "My beta role was recorded incorrectly."
- "The issue summary has the wrong detail."
- "The support queue note should say something different."
- "The screenshot summary is missing context."

Do not use this for real payments, real loans, escrow, token collateral, legal disputes, production customer accounts, or live database correction. Those features stay blocked because real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

## Safe Correction Fields

The founder can record only these safe fields:

| Field | Safe Example |
|-------|--------------|
| Public beta URL | `PUBLIC_SITE_URL` |
| Tester role | homeowner, contractor, peer reviewer, or founder/admin |
| Issue ID | `BETA-001` |
| Related X-Request-Id | `req-demo-123` |
| Support queue item | safe short label |
| Field to correct | tester role, issue summary, severity, artifact status, or next action |
| Old value | old redacted summary |
| Corrected value | corrected redacted summary |
| Correction reason | typo, wrong role, missing context, duplicate issue, or tester clarification |
| Founder review status | pending, completed, blocked, or escalated |

The corrected value must stay a redacted summary. It must not include private contact details, personal IDs, payment data, wallet data, real customer addresses, SQL, secrets, database URLs, API keys, Magic Link tokens, or service-role keys.

## What Not To Correct Through This Template

This template must not be used to correct:

- production database rows;
- identity documents;
- bank/payment information;
- wallet addresses;
- real loan decisions;
- escrow releases;
- token collateral balances;
- legal claims;
- provider account records;
- external account settings.

If the correction touches any of those areas, stop and route it to founder review and legal review.

## Founder Handling Steps

1. Confirm the request is about demo only public beta feedback.
2. Find the issue ID, X-Request-Id, support queue item, or artifact summary.
3. Confirm the requested correction can be expressed as a redacted summary.
4. Record the old value, corrected value, and correction reason.
5. Update only local beta notes or safe support queue summaries.
6. Do not run no SQL, do not expose no secrets, and do not edit live production systems from this template.
7. Reply to the tester using the template below.

## Correction Log Format

Use this safe log format:

```text
SmartContractor public beta correction log
Scope: demo only
PUBLIC_SITE_URL:
Tester role:
Issue ID:
X-Request-Id:
Support queue item:
Field corrected:
Old value:
Corrected value:
Correction reason:
Live-risk gates: real payments disabled / real loans disabled / escrow disabled / token collateral disabled
Founder review required: yes/no
```

The log must stay safe for internal review. It must not include SQL, secrets, personal IDs, private contact details, payment data, wallet data, real customer addresses, database URLs, API keys, Magic Link tokens, service-role keys, raw recordings, or unredacted screenshots.

## Blocked Actions

This correction template does not authorize:

- live Supabase SQL changes;
- raw database exports;
- production account edits;
- external account changes;
- legal promises;
- processing real payments;
- approving real loans;
- releasing escrow;
- using token collateral;
- changing provider records.

Those actions require founder review, legal review, and the final privacy policy process.

## Tester Reply Template

Subject: SmartContractor public beta correction request received

Message:

Thank you. I received your SmartContractor public beta correction request.

This beta is demo only. I can correct a redacted issue summary, tester role, severity, artifact status, support queue note, or next-action label if it does not include sensitive information.

Please do not send SQL, secrets, personal IDs, private contact details, payment data, wallet data, real customer addresses, database URLs, API keys, Magic Link tokens, service-role keys, raw recordings, or unredacted screenshots.

Current beta boundaries remain active: real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

Status: pending founder review.
