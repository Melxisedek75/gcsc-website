# SmartContractor Public Beta Session Postmortem

## Purpose

This template captures what happened after a SmartContractor public beta session while keeping the record demo only and safe for the repo. It turns moderator notes into issue ID values, trust blocker signals, go/no-go scorecard impact, and next action routing without storing private tester data or approving live-risk work.

Use session code, batch code, tester cohort, tester role, flow result, safe X-Request-Id, and support queue references instead of names, email addresses, phone numbers, calendar links, meeting links, wallet data, payment data, or real customer addresses.

## Safe Postmortem Fields

| Field | Safe value |
|-------|------------|
| Session code | Code from the public beta session schedule |
| Batch code | Code from the invite batch tracker |
| Tester cohort | Non-identifying cohort label |
| Tester role | homeowner, contractor, peer reviewer, or founder/admin |
| Flow result | passed, confusing, blocked, stopped, no-show, or rescheduled |
| Issue ID | Safe issue ID from the beta issue log or support queue |
| X-Request-Id | Safe request ID from the UI/API response when available |
| Support queue | Queue status without private contact details |
| Known issues | Known issue code or summary only |
| Trust blocker | The reason the tester would not trust the flow yet |
| Next action | Product fix, technical fix, founder review, legal review, provider review, or blocked |
| Daily status | Safe line for the public beta daily status |
| Weekly closeout | Safe line for the public beta weekly closeout |
| Go/no-go scorecard | Go, review, no-go, or blocked impact |

## Outcome Categories

- passed: tester completed the role flow and could explain the value.
- confusing: tester completed the role flow but language, navigation, or trust was unclear.
- blocked: tester could not complete the role flow because of a product, Auth, deploy, support, or known issues blocker.
- stopped: moderator stopped the session because a no SQL, no secrets, privacy, legal, payment, loan, escrow, token collateral, or provider boundary became unsafe.
- no-show: tester did not attend; do not add private contact details.
- rescheduled: session moved to another session code; do not add calendar links or meeting links.

## Trust Blockers

Track trust blocker signals conservatively:

- homeowner could not tell when milestone approval is safe.
- contractor treated demo starter loan language as real loan approval.
- peer reviewer did not understand evidence review or recommendation impact.
- founder/admin could not map support queue, known issues, daily status, weekly closeout, or go/no-go scorecard updates.
- Auth/admin state appeared confusing or unsafe.
- payment, loan, escrow, token collateral, legal, investment, provider, or production launch language sounded like a real commitment.
- evidence capture risked private contact details, email addresses, phone numbers, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, service-role keys, raw recordings, or unredacted screenshots.

## Issue Mapping

Every issue should be mapped to:

- issue ID;
- session code;
- batch code;
- tester cohort;
- tester role;
- flow result;
- trust blocker;
- safe X-Request-Id when available;
- severity from the beta triage rubric;
- support queue owner category;
- next action;
- go/no-go scorecard impact.

Do not attach raw recordings, unredacted screenshots, private contact details, email addresses, phone numbers, calendar links, meeting links, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, service-role keys, SQL, secrets, or real customer evidence to repo docs.

## Decision Routing

Use these routing labels:

- product fix: copy, UX, workflow, or demo-data clarity can be fixed locally.
- technical fix: local backend/frontend/test/CI work is needed.
- founder review: account, Auth, admin role, deploy, external packet, or business decision is needed.
- legal review: loan, escrow, lien, contractor credit, token collateral, privacy, consent, or terms language needs attorney review.
- provider review: payment, verification, banking, Metal Pay, Stripe, PayPal, Coinbase, BTCPay, ACH, or external API decision is needed.
- blocked: no safe next action exists without founder approval or live-risk work.

## Postmortem Template

```text
SmartContractor public beta session postmortem
Scope: demo only
Session code:
Batch code:
Tester cohort:
Tester role:
Flow result:
Issue ID:
X-Request-Id:
Support queue:
Known issues:
Trust blocker:
Next action:
Daily status update:
Weekly closeout update:
Go/no-go scorecard impact:
Founder review needed:
Legal review needed:
Provider review needed:
Boundaries confirmed: real payments disabled, real loans disabled, escrow disabled, token collateral disabled.
No SQL, no secrets, no private contact details, no email addresses, no phone numbers, no calendar links, no meeting links, no real customer addresses, no payment data, no wallet data, no database URLs, no API keys, no Magic Link tokens, no service-role keys, no raw recordings, and no unredacted screenshots included.
```

## Blocked Data

Do not store or paste:

- no SQL;
- no secrets;
- private contact details;
- email addresses;
- phone numbers;
- calendar links;
- meeting links;
- raw recordings;
- unredacted screenshots;
- real customer addresses;
- payment data;
- wallet data;
- database URLs;
- API keys;
- Magic Link tokens;
- service-role keys.

This postmortem does not authorize external account changes, live Supabase changes, real payments, real loans, escrow, token collateral, legal promises, provider commitments, or production launch claims.

## Founder Summary Template

Use this safe founder summary:

```text
Public beta session postmortem summary
Session code:
Batch code:
Tester cohort:
Tester role:
Flow result:
Top trust blocker:
Issue ID:
X-Request-Id:
Support queue:
Known issues:
Daily status:
Weekly closeout:
Go/no-go scorecard:
Next action:
Founder review:
Legal review:
Provider review:
Real-money gates: real payments disabled, real loans disabled, escrow disabled, token collateral disabled.
Safety: no SQL, no secrets, no private contact details, no email addresses, no phone numbers, no calendar links, no meeting links, no real customer addresses, no payment data, no wallet data, no database URLs, no API keys, no Magic Link tokens, no service-role keys, no raw recordings, and no unredacted screenshots.
```
