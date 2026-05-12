# SmartContractor Public Beta Tester Offboarding

## Purpose

This checklist closes a public beta tester session safely after the tester finishes using SmartContractor.

It keeps the project demo only, preserves useful feedback, removes raw sensitive artifacts, and prevents accidental movement into real payments, real loans, escrow, token collateral, legal promises, or production account changes.

## When To Run This

Run this after:

- a homeowner, contractor, peer reviewer, or founder/admin tester finishes a public beta session;
- a tester asks to stop participating;
- a tester sends a deletion request;
- a tester submits screenshots, recordings, issue notes, or support queue feedback;
- a session is stopped because sensitive data or real-money behavior appeared.

## Offboarding Checklist

| Step | Action | Safe Output |
|------|--------|-------------|
| 1 | Record tester role | homeowner, contractor, peer reviewer, or founder/admin |
| 2 | Record beta URL | `PUBLIC_SITE_URL` only |
| 3 | Record session status | completed, stopped, blocked, or needs founder review |
| 4 | Record issue ID | `BETA-###` or `none` |
| 5 | Record X-Request-Id | safe request id or `not available` |
| 6 | Confirm evidence status | redacted screenshot, redacted note, deleted raw artifact, or no artifact |
| 7 | Close or route support queue item | closed, product follow-up, privacy follow-up, legal/provider follow-up, or blocked |
| 8 | Confirm live-risk gates | real payments disabled, real loans disabled, escrow disabled, token collateral disabled |

Do not keep private contact details, personal IDs, payment data, wallet data, real customer addresses, SQL, secrets, Magic Link tokens, database URLs, API keys, or service-role keys.

## Support Queue Closure

Close the support queue item only when:

- the issue has a safe issue ID;
- the tester role is recorded;
- the non-sensitive problem summary is clear;
- the severity is assigned;
- the next action is one of: fixed later, product review, founder review, legal review, provider review, blocked, or no action;
- any raw artifact has been redacted or scheduled for deletion.

If the issue mentions real payment movement, real loan approval, escrow, token collateral, identity documents, or legal claims, mark it founder review required and do not treat it as normal beta feedback.

## Evidence Cleanup

Use the 24-hour review/purge window for raw beta artifacts.

Allowed to keep:

- issue ID;
- tester role;
- PUBLIC_SITE_URL;
- X-Request-Id;
- redacted screenshot;
- short non-sensitive summary;
- severity;
- founder decision;
- whether raw artifacts were deleted.

Delete raw artifacts when they include private contact details, personal IDs, payment data, wallet data, real customer addresses, unredacted screens, or anything the tester asks to delete.

## Access And Account Notes

Magic Link access is for demo only testing.

Offboarding does not require live Supabase SQL, external account changes, password changes, payment provider changes, or deleting production accounts. If real Auth cleanup is needed later, it must be handled as a founder-controlled action after strict Auth/RLS review.

## Blocked Actions

This checklist does not authorize:

- no SQL;
- no secrets;
- changing live Supabase rows;
- deleting production data;
- connecting external accounts;
- making legal promises;
- giving no investment advice;
- giving no legal advice;
- giving no loan approval;
- processing real payments;
- approving real loans;
- releasing escrow;
- using token collateral.

## Founder Summary Template

Use this safe summary after a tester is offboarded:

```text
Public beta offboarding summary
Tester role:
Session status:
PUBLIC_SITE_URL:
Issue ID:
X-Request-Id:
Support queue status:
Evidence status:
Raw artifacts deleted:
Live-risk gates: real payments disabled / real loans disabled / escrow disabled / token collateral disabled
Next safe action:
Founder review required: yes/no
```
