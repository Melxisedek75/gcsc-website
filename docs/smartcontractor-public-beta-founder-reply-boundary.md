# SmartContractor Public Beta Founder Reply Boundary

Status: INTERNAL_FOUNDER_REPLY_BOUNDARY_ONLY

This boundary is not approval for Codex to reply to testers, send invites, share a public beta URL, open external accounts, change deploy settings, change Supabase redirects, set up providers, publish publicly, use app stores, or enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral.

## Purpose

Give the founder safe reply boundaries for first-batch public beta tester responses after local triage.

Founder replies must stay demo-only, tester-code-only in tracked notes, no-real-money, no-secret, no-legal-commitment, no-provider-commitment, and routed through support/issue IDs instead of private tester data or raw URLs.

## Source Documents

- `docs/smartcontractor-public-beta-first-response-triage.md`
- `docs/smartcontractor-public-beta-invite-post-send-intake.md`
- `docs/smartcontractor-beta-tester-followup.md`
- `docs/smartcontractor-beta-issue-log-template.md`
- `docs/smartcontractor-public-beta-support-sla.md`
- `docs/smartcontractor-public-beta-support-queue.md`
- `docs/smartcontractor-public-beta-known-issues.md`
- `docs/smartcontractor-public-beta-incident-response.md`

## What This Does Not Approve

This boundary does not approve Codex replies to testers or any of the following:

- Codex replies to testers;
- raw public beta URL storage or sharing;
- tester names, emails, phone numbers, addresses, account IDs, or wallet IDs in tracked docs;
- external account changes;
- deploy setting changes;
- Supabase redirect changes;
- live Supabase writes;
- provider setup;
- real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral;
- legal decisions or provider commitments;
- public launch or app store work;
- destructive actions.

## Reply Preconditions

The founder should reply only when:

- the response is recorded through `docs/smartcontractor-public-beta-first-response-triage.md`;
- the tracked note uses tester code, not private identity;
- any request ID or issue ID is safe and redacted;
- the support owner and rollback owner are known;
- the reply does not include a raw beta URL;
- the reply does not request secrets, private identity documents, payment data, wallet data, contracts, bank data, or legal approvals;
- the reply does not promise production support, real loans, real escrow, payment settlement, token collateral, provider approval, or legal conclusions.

## Allowed Reply Templates

### Acknowledge Issue

```text
Thanks for testing the SmartContractor demo. We recorded this as [SAFE_ISSUE_ID] for tester code [TESTER_CODE]. This is still demo-only: no real payment, no real loan, no real escrow, no repayment routing, no stablecoin settlement, and no token collateral. Please do not send secrets, private IDs, payment data, wallet data, or private project documents.
```

### Ask For Safe Details

```text
Can you send only safe details for [SAFE_ISSUE_ID]: page or flow, device/browser, expected result, actual result, visible request ID if available, and whether a redacted screenshot exists? Please do not send passwords, Magic Link URLs, Authorization headers, cookies, bank/card data, identity documents, private keys, seed phrases, or private customer data.
```

### Hold For Founder Review

```text
Thanks. We are holding this for founder review before taking action. The demo remains no-real-money and does not approve live payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, provider setup, legal decisions, public launch, or app store work.
```

### Resolved Or Queued

```text
Thanks for the report. We linked it to [SAFE_ISSUE_ID]. If it is safe to fix locally, we will validate it before the next beta pass. If it needs external account, legal, provider, live Supabase, real-money, public launch, or app store action, it will stay blocked until the founder handles that outside Codex.
```

## Reply Hold Rules

Use `HOLD_FOR_REDACTION` when a proposed reply or tester response includes a raw URL, tester identity, contact detail, account ID, wallet ID, cookie, Authorization header, Magic Link URL, raw response body, private screenshot, payment data, or secret-looking value.

Use `HOLD_FOR_RECHECK` when the issue ID is missing, the request ID is unsafe or unclear, the triage state is missing, no-real-money evidence is stale, the source commit is unclear, or support/rollback owner is missing.

Use `HOLD_FOR_FOUNDER_REWRITE` when the draft reply could sound like production support, financial advice, legal advice, provider commitment, public launch wording, or permission to use real project/customer/payment data.

Use `BLOCKED_FOR_EXTERNAL_ACTION` when the next step requires Codex to reply to testers, send invites, share URLs, open dashboards, change account settings, deploy, change Supabase redirects, enter secrets, set up providers, enable money features, make legal/provider commitments, publish publicly, use app stores, or perform destructive actions.

## Safe Reply Record

Record only redacted metadata in this format:

```text
reply_record_id:
safe_issue_id:
tester_code:
triage_state:
reply_template_used:
reply_owner:
sent_by_founder:
sent_at_label:
safe_request_id:
redaction_status:
reply_state: SENT_BY_FOUNDER_RECORDED, QUEUED_FOR_FOUNDER_REVIEW, HOLD_FOR_REDACTION, HOLD_FOR_RECHECK, HOLD_FOR_FOUNDER_REWRITE, or BLOCKED_FOR_EXTERNAL_ACTION
next_safe_action:
```

## Required Checks

```powershell
npm run check:public-beta-founder-reply-boundary
npm run check:public-beta-first-response-triage
npm run check:public-beta-invite-post-send-intake
npm run check:beta-tester-followup
npm run check:beta-issue-log
npm run check:public-beta-support-sla
npm run check:public-beta-support-queue
npm run check:public-beta-known-issues
npm run check:public-beta-incident-response
npm run check:real-status-audit
npm run check
```

## Acceptance Check

This reply boundary is accepted only when local docs and validators prove that founder replies remain demo-only, redacted, tester-code-only, issue-id-based, request-id-aware, support-owned, rollback-aware, and blocked from Codex replies to testers, raw URL storage/sharing, private tester data, external account changes, deploy changes, Supabase redirects, live Supabase writes, provider setup, real-money actions, legal/provider commitments, public launch, app stores, or destructive actions.
