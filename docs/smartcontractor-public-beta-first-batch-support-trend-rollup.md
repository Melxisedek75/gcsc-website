# SmartContractor Public Beta First Batch Support Trend Rollup

Status: INTERNAL_TREND_ROLLUP_ONLY

This rollup is not approval for Codex to reply to testers, send invites, share a public beta URL, open external accounts, change deploy settings, change Supabase redirects, set up providers, publish publicly, use app stores, or enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral.

## Purpose

Create a redacted support trend rollup from first-batch support summaries, founder support decisions, internal action queue items, and local-only action closeouts.

The rollup records only tester-code-only trend metadata: safe issue IDs, safe request IDs, queue item IDs, closeout IDs, trend category, trend state, support owner, rollback owner, redaction status, no-real-money confirmation, blocked action acknowledgement, and next safe internal step. It must not store tester identity, raw URLs, inbox data, private screenshots, payment data, legal advice, provider commitments, or any secret-looking value.

## Source Documents

- `docs/smartcontractor-public-beta-first-batch-internal-action-closeout.md`
- `docs/smartcontractor-public-beta-first-batch-internal-action-queue.md`
- `docs/smartcontractor-public-beta-first-batch-founder-support-decision-intake.md`
- `docs/smartcontractor-public-beta-first-batch-support-summary.md`
- `docs/smartcontractor-public-beta-support-sla.md`
- `docs/smartcontractor-public-beta-support-queue.md`
- `docs/smartcontractor-public-beta-known-issues.md`
- `docs/smartcontractor-public-beta-incident-response.md`

## What This Does Not Approve

This rollup does not approve:

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

## Required Rollup Fields

Record only redacted metadata in this format:

```text
rollup_id:
trend_window_label:
safe_issue_ids:
safe_request_ids:
queue_item_ids:
closeout_ids:
trend_category:
trend_state: WATCH, NEEDS_LOCAL_QA, NEEDS_DOC_UPDATE, NEEDS_FOUNDER_REVIEW, HOLD_FOR_REDACTION, or BLOCKED_FOR_EXTERNAL_ACTION
support_owner:
rollback_owner:
redaction_status:
no_real_money_status:
blocked_action_acknowledgement:
next_safe_internal_step:
```

## Allowed Trend States

Use `WATCH` when the trend is informational and does not require a local change.

Use `NEEDS_LOCAL_QA` when the trend needs local smoke checks, request-id review, or demo-only reproduction evidence.

Use `NEEDS_DOC_UPDATE` when the trend needs local docs, checklist wording, or validator coverage updates.

Use `NEEDS_FOUNDER_REVIEW` when the trend could affect tester wording, support priority, beta scope, rollout timing, or public claims.

Use `HOLD_FOR_REDACTION` when any raw URL, tester identity, contact detail, account ID, wallet ID, cookie, Authorization header, Magic Link URL, raw response body, private screenshot, payment data, or secret-looking value appears in tracked evidence.

Use `BLOCKED_FOR_EXTERNAL_ACTION` when the next step requires Codex to reply to testers, send invites, share URLs, open dashboards, change account settings, deploy, change Supabase redirects, enter secrets, set up providers, enable money features, make legal/provider commitments, publish publicly, use app stores, or perform destructive actions.

## Safe Trend Categories

Allowed trend categories are:

- `USABILITY`
- `AUTH`
- `MOBILE`
- `SUPPORT_PROCESS`
- `DEMO_BOUNDARY`
- `ROLLBACK_READINESS`

Each trend category must stay inside local docs, local validators, local QA evidence, or redacted planning records.

## Blocked Rollup Outcomes

Do not roll up or act on values that say `SEND_TO_TESTER`, `SHARE_BETA_URL`, `ENABLE_REAL_MONEY`, `APPROVE_PUBLIC_LAUNCH`, `CHANGE_SUPABASE`, `SET_UP_PROVIDER`, `LEGAL_APPROVED`, or `APP_STORE_SUBMIT`.

Any trend that requires Codex to reply to testers, change Supabase redirects, publish publicly, make legal/provider commitments, or handle real money must be marked `BLOCKED_FOR_EXTERNAL_ACTION`.

## Safe Evidence Rules

Safe evidence may include tester codes, safe issue IDs, safe request IDs, queue item IDs, closeout IDs, trend category, trend state, support owner, rollback owner, redaction status, no-real-money status, blocked action acknowledgement, and next safe internal step.

Do not store raw URLs, tester names, tester emails, phone numbers, addresses, account IDs, wallet IDs, cookies, Authorization headers, Magic Link URLs, raw response bodies, private screenshots, payment data, passwords, private keys, seed phrases, service-role keys, database URLs, bearer tokens, or any secret-looking value.

## Required Checks

```powershell
npm run check:public-beta-first-batch-support-trend-rollup
npm run check:public-beta-first-batch-internal-action-closeout
npm run check:public-beta-first-batch-internal-action-queue
npm run check:public-beta-first-batch-founder-support-decision-intake
npm run check:public-beta-first-batch-support-summary
npm run check:public-beta-support-sla
npm run check:public-beta-support-queue
npm run check:public-beta-known-issues
npm run check:public-beta-incident-response
npm run check:real-status-audit
npm run check
```

## Acceptance Check

This rollup is accepted only when local docs and validators prove that first-batch support trends are redacted, tester-code-only, issue/request-id-aware, queue-item-aware, closeout-aware, support-owned, rollback-aware, no-real-money-confirmed, local-action-only, and blocked from Codex replies to testers, raw URL storage/sharing, private tester data, external account changes, deploy changes, Supabase redirects, live Supabase writes, provider setup, real-money actions, legal/provider commitments, public launch, app stores, or destructive actions.
