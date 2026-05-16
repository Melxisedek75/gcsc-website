# SmartContractor Public Beta First Batch Support Trend Internal Action Queue

Status: INTERNAL_TREND_ACTION_QUEUE_ONLY

This queue is not approval for Codex to reply to testers, send invites, share a public beta URL, open external accounts, change deploy settings, change Supabase redirects, set up providers, publish publicly, use app stores, or enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral.

## Purpose

Convert a redacted support trend founder decision closeout into a local-only redacted support trend internal action queue.

The queue records only internal action metadata: trend action queue ID, trend decision closeout ID, trend decision intake ID, handoff ID, rollup ID, safe issue IDs, safe request IDs, queue item IDs, closeout IDs, trend category, founder decision summary label, action owner, support owner, rollback owner, redaction status, no-real-money status, blocked action acknowledgement, queue state, and next safe internal action.

It must not store tester identity, raw URLs, inbox data, private screenshots, payment data, legal advice, provider commitments, or any secret-looking value.

## Source Documents

- `docs/smartcontractor-public-beta-first-batch-support-trend-founder-decision-closeout.md`
- `docs/smartcontractor-public-beta-first-batch-support-trend-founder-decision-intake.md`
- `docs/smartcontractor-public-beta-first-batch-support-trend-founder-handoff.md`
- `docs/smartcontractor-public-beta-first-batch-support-trend-rollup.md`
- `docs/smartcontractor-public-beta-first-batch-internal-action-closeout.md`
- `docs/smartcontractor-public-beta-first-batch-internal-action-queue.md`
- `docs/smartcontractor-public-beta-first-batch-support-summary.md`
- `docs/smartcontractor-public-beta-support-sla.md`
- `docs/smartcontractor-public-beta-known-issues.md`
- `docs/smartcontractor-public-beta-incident-response.md`

## What This Does Not Approve

This queue does not approve:

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

## Required Queue Fields

Record only redacted internal action metadata in this format:

```text
trend_action_queue_id:
trend_decision_closeout_id:
trend_decision_intake_id:
handoff_id:
rollup_id:
safe_issue_ids:
safe_request_ids:
queue_item_ids:
closeout_ids:
trend_category:
founder_decision_summary_label:
action_owner:
support_owner:
rollback_owner:
redaction_status:
no_real_money_status:
blocked_action_acknowledgement:
next_safe_internal_action:
queue_state: READY_FOR_INTERNAL_ACTION, HOLD_FOR_REDACTION, HOLD_FOR_RECHECK, HOLD_FOR_FOUNDER_REWRITE, or BLOCKED_FOR_EXTERNAL_ACTION
```

## Allowed Queue States

Use `READY_FOR_INTERNAL_ACTION` only when the support trend founder decision closeout is redacted, all safe issue/request IDs are reconciled, queue item IDs and closeout IDs are linked, trend category and founder decision summary label are present, action/support/rollback owners are recorded, no-real-money status is current, and the next action stays internal.

Use `HOLD_FOR_REDACTION` when any raw URL, tester identity, contact detail, account ID, wallet ID, cookie, Authorization header, Magic Link URL, raw response body, private screenshot, payment data, or secret-looking value appears in tracked evidence.

Use `HOLD_FOR_RECHECK` when the queue lacks a trend action queue ID, trend decision closeout ID, trend decision intake ID, handoff ID, rollup ID, safe issue IDs, safe request IDs, queue item IDs, closeout IDs, trend category, founder decision summary label, action owner, support owner, rollback owner, no-real-money confirmation, or blocked action acknowledgement.

Use `HOLD_FOR_FOUNDER_REWRITE` when the queue could sound like production support, financial advice, legal advice, provider commitment, public launch wording, app store promise, or permission to use real project/customer/payment data.

Use `BLOCKED_FOR_EXTERNAL_ACTION` when the next step requires Codex to reply to testers, send invites, share URLs, open dashboards, change account settings, deploy, change Supabase redirects, enter secrets, set up providers, enable money features, make legal/provider commitments, publish publicly, use app stores, or perform destructive actions.

## Blocked Queue Values

Do not record or act on queue values that say `SEND_TO_TESTER`, `SHARE_BETA_URL`, `ENABLE_REAL_MONEY`, `APPROVE_PUBLIC_LAUNCH`, `CHANGE_SUPABASE`, `SET_UP_PROVIDER`, `LEGAL_APPROVED`, or `APP_STORE_SUBMIT` unless founder-controlled external evidence is later reviewed in a separate live-action decision packet.

Any queue item that requires Codex to reply to testers, change Supabase redirects, publish publicly, make legal/provider commitments, or handle real money must be marked `BLOCKED_FOR_EXTERNAL_ACTION`.

## Safe Evidence Rules

Safe evidence may include tester codes, safe issue IDs, safe request IDs, queue item IDs, closeout IDs, trend category, founder decision summary labels, action owner, support owner, rollback owner, redaction status, no-real-money status, blocked action acknowledgement, queue state, and next safe internal action.

Do not store raw URLs, tester names, tester emails, phone numbers, addresses, account IDs, wallet IDs, cookies, Authorization headers, Magic Link URLs, raw response bodies, private screenshots, payment data, passwords, private keys, seed phrases, service-role keys, database URLs, bearer tokens, or any secret-looking value.

## Required Checks

```powershell
npm run check:public-beta-first-batch-support-trend-internal-action-queue
npm run check:public-beta-first-batch-support-trend-founder-decision-closeout
npm run check:public-beta-first-batch-support-trend-founder-decision-intake
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

This queue is accepted only when local docs and validators prove that first-batch support trend internal action queue items are redacted, tester-code-only, issue/request-id-aware, queue-item-aware, closeout-aware, trend-category-aware, action-owned, support-owned, rollback-aware, no-real-money-confirmed, local-action-only, and blocked from Codex replies to testers, raw URL storage/sharing, private tester data, external account changes, deploy changes, Supabase redirects, live Supabase writes, provider setup, real-money actions, legal/provider commitments, public launch, app stores, or destructive actions.
