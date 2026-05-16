# SmartContractor Public Beta First Batch Support Trend Founder Handoff

Status: FOUNDER_HANDOFF_ONLY

This handoff is not approval for Codex to reply to testers, send invites, share a public beta URL, open external accounts, change deploy settings, change Supabase redirects, set up providers, publish publicly, use app stores, or enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral.

## Purpose

Create a redacted founder handoff from the support trend rollup so the founder can review first-batch beta patterns without exposing tester identity, raw URLs, inbox data, private screenshots, payment data, legal advice, provider commitments, or any secret-looking value.

The handoff records only tester-code-only trend metadata: safe issue IDs, safe request IDs, queue item IDs, closeout IDs, trend category, recommended founder review, support owner, rollback owner, redaction status, no-real-money confirmation, blocked action acknowledgement, and handoff state.

## Source Documents

- `docs/smartcontractor-public-beta-first-batch-support-trend-rollup.md`
- `docs/smartcontractor-public-beta-first-batch-internal-action-closeout.md`
- `docs/smartcontractor-public-beta-first-batch-internal-action-queue.md`
- `docs/smartcontractor-public-beta-first-batch-support-summary.md`
- `docs/smartcontractor-public-beta-support-sla.md`
- `docs/smartcontractor-public-beta-known-issues.md`
- `docs/smartcontractor-public-beta-incident-response.md`

## What This Does Not Approve

This handoff does not approve:

- Codex replies to testers;
- sending or resending invites;
- raw public beta URL storage or sharing;
- tester names, emails, phone numbers, addresses, account IDs, wallet IDs, or inbox identifiers in tracked docs;
- external account changes;
- deploy setting changes;
- Supabase redirect changes;
- live Supabase writes;
- provider setup;
- real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral;
- legal decisions or provider commitments;
- production support promises;
- public launch or app store work;
- destructive actions.

## Required Handoff Fields

Record only redacted metadata in this format:

```text
handoff_id:
rollup_id:
safe_issue_ids:
safe_request_ids:
queue_item_ids:
closeout_ids:
trend_category:
recommended_founder_review:
support_owner:
rollback_owner:
redaction_status:
no_real_money_status:
blocked_action_acknowledgement:
handoff_state: READY_FOR_FOUNDER_REVIEW, HOLD_FOR_REDACTION, HOLD_FOR_RECHECK, HOLD_FOR_FOUNDER_REWRITE, or BLOCKED_FOR_EXTERNAL_ACTION
next_safe_internal_step:
```

## Founder Review Questions

- Does this trend change first-batch tester wording?
- Does this trend change support priority?
- Does this trend change rollback readiness?
- Does this trend require legal/provider review?
- Does this trend require external account, deploy, Supabase, app store, or real-money action?

## Allowed Handoff States

Use `READY_FOR_FOUNDER_REVIEW` only when the handoff is redacted, local-only, no-secret, no-real-money, issue/request-id-aware, queue-item-aware, closeout-aware, support-owned, rollback-aware, and limited to founder review.

Use `HOLD_FOR_REDACTION` when any raw URL, tester identity, contact detail, account ID, wallet ID, cookie, Authorization header, Magic Link URL, raw response body, private screenshot, payment data, or secret-looking value appears in tracked evidence.

Use `HOLD_FOR_RECHECK` when the handoff lacks a rollup ID, safe issue IDs, safe request IDs, queue item IDs, closeout IDs, support owner, rollback owner, no-real-money confirmation, blocked action acknowledgement, or matching trend category.

Use `HOLD_FOR_FOUNDER_REWRITE` when handoff wording could sound like production support, financial advice, legal advice, provider commitment, public launch wording, app store promise, or permission to use real project/customer/payment data.

Use `BLOCKED_FOR_EXTERNAL_ACTION` when the next step requires Codex to reply to testers, send invites, share URLs, open dashboards, change account settings, deploy, change Supabase redirects, enter secrets, set up providers, enable money features, make legal/provider commitments, publish publicly, use app stores, or perform destructive actions.

## Blocked Founder Handoff Outcomes

Do not present any action as ready if it says `SEND_TO_TESTER`, `SHARE_BETA_URL`, `ENABLE_REAL_MONEY`, `APPROVE_PUBLIC_LAUNCH`, `CHANGE_SUPABASE`, `SET_UP_PROVIDER`, `LEGAL_APPROVED`, or `APP_STORE_SUBMIT`.

Any handoff item that requires Codex to reply to testers, change Supabase redirects, publish publicly, make legal/provider commitments, or handle real money must be marked `BLOCKED_FOR_EXTERNAL_ACTION`.

## Safe Evidence Rules

Safe evidence may include tester codes, safe issue IDs, safe request IDs, queue item IDs, closeout IDs, trend category, recommended founder review, support owner, rollback owner, redaction status, no-real-money status, blocked action acknowledgement, handoff state, and next safe internal step.

Do not store raw URLs, tester names, tester emails, phone numbers, addresses, account IDs, wallet IDs, cookies, Authorization headers, Magic Link URLs, raw response bodies, private screenshots, payment data, passwords, private keys, seed phrases, service-role keys, database URLs, bearer tokens, or any secret-looking value.

## Required Checks

```powershell
npm run check:public-beta-first-batch-support-trend-founder-handoff
npm run check:public-beta-first-batch-support-trend-rollup
npm run check:public-beta-first-batch-internal-action-closeout
npm run check:public-beta-first-batch-internal-action-queue
npm run check:public-beta-first-batch-support-summary
npm run check:public-beta-support-sla
npm run check:public-beta-known-issues
npm run check:public-beta-incident-response
npm run check:real-status-audit
npm run check
```

## Acceptance Check

This handoff is accepted only when local docs and validators prove that first-batch support trend founder handoffs are redacted, tester-code-only, issue/request-id-aware, queue-item-aware, closeout-aware, support-owned, rollback-aware, no-real-money-confirmed, founder-review-only, and blocked from Codex replies to testers, raw URL storage/sharing, private tester data, external account changes, deploy changes, Supabase redirects, live Supabase writes, provider setup, real-money actions, legal/provider commitments, public launch, app stores, or destructive actions.
