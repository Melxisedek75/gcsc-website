# SmartContractor Public Beta Data Deletion Request

## Purpose

This document gives the founder a safe way to receive, track, and complete a public beta tester request to delete beta evidence or feedback.

This is for demo only public beta work. It is not a full privacy policy, legal advice, or production data-subject request process. Before public launch, the final privacy policy and deletion workflow need founder review and legal review.

## When To Use This

Use this when a tester says one of these:

- "Please delete my beta feedback."
- "Please delete my screenshot or recording."
- "Please remove my tester notes from the support queue."
- "I sent something private by mistake."

Do not use this for real payments, real loans, escrow, token collateral, legal disputes, or production customer data. Those features stay blocked because real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

## Safe Request Fields

The founder can ask the tester for only these safe fields:

| Field | Safe Example |
|-------|--------------|
| Public beta URL | `PUBLIC_SITE_URL` |
| Tester role | homeowner, contractor, peer reviewer, or founder/admin |
| Issue ID | `BETA-001` |
| Request date | `YYYY-MM-DD` |
| Related X-Request-Id | `req-demo-123` |
| Artifact type | redacted screenshot, short screen recording, support queue note, or feedback form |
| Requested action | delete raw artifacts, delete feedback note, or keep only redacted summary |
| Founder review status | pending, completed, blocked, or escalated |

If the tester does not know the issue ID or X-Request-Id, the founder can still process the request by matching the tester role, date, and artifact type.

## What Not To Include

The tester must not send:

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
- service-role keys.

If a tester already sent sensitive information, stop using the artifact, mark the request as founder review required, and delete raw artifacts after the review/purge decision.

## Founder Handling Steps

1. Open the public beta support queue.
2. Find the issue ID, tester role, X-Request-Id, or artifact name.
3. Confirm the request is about demo only beta evidence.
4. Remove or redact the raw artifact from local founder/admin review storage.
5. Keep only a safe summary if it is needed for product debugging.
6. Record the action in the beta daily status or support queue without private contact details.
7. Reply to the tester using the template below.

## Review And Purge Window

Raw beta artifacts should be reviewed and either deleted or converted into a redacted summary within a 24-hour review/purge window.

Safe retained summaries can keep:

- issue ID;
- tester role;
- non-sensitive bug summary;
- severity;
- X-Request-Id;
- founder decision;
- whether raw artifacts were deleted.

Safe retained summaries must not keep private contact details, payment data, wallet data, personal IDs, real customer addresses, or unredacted screenshots.

## Blocked Actions

This deletion template does not authorize:

- live Supabase SQL changes;
- deleting production database rows;
- changing external accounts;
- processing real payments;
- approving real loans;
- releasing escrow;
- using token collateral;
- making legal promises.

Those actions require founder review, legal review, and the final privacy policy process.

## Tester Reply Template

Subject: SmartContractor public beta deletion request received

Message:

Thank you. I received your public beta deletion request for the demo only SmartContractor test.

I will review the related support queue item, issue ID, X-Request-Id, or artifact, then delete raw artifacts or keep only a redacted product summary if needed for debugging.

Please do not send passwords, private contact details, personal IDs, payment data, wallet data, real customer addresses, SQL, API keys, or Magic Link tokens.

Current beta boundaries remain active: real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

Status: pending founder review.
