# SmartContractor Public Beta First Batch Internal Action Queue

Status: INTERNAL_ACTION_QUEUE_ONLY

This queue is not approval for Codex to reply to testers, send invites, share a public beta URL, open external accounts, change deploy settings, change Supabase redirects, set up providers, publish publicly, use app stores, or enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral.

## Purpose

Convert redacted founder support decision intake records into a redacted internal action queue that Codex can safely work through locally.

The queue records only tester code, safe issue ID, safe request ID, action type, internal owner, support owner, rollback owner, redaction status, no-real-money status, blocked action acknowledgement, and queue state. It must not store tester identity, raw URLs, inbox data, private screenshots, payment data, legal advice, provider commitments, or any secret-looking value.

## Source Documents

- `docs/smartcontractor-public-beta-first-batch-founder-support-decision-intake.md`
- `docs/smartcontractor-public-beta-first-batch-founder-support-handoff.md`
- `docs/smartcontractor-public-beta-first-batch-support-summary.md`
- `docs/smartcontractor-public-beta-founder-reply-record-closeout.md`
- `docs/smartcontractor-public-beta-first-response-triage.md`
- `docs/smartcontractor-public-beta-support-sla.md`
- `docs/smartcontractor-public-beta-support-queue.md`
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

Record only redacted metadata in this format:

```text
queue_item_id:
decision_intake_id:
safe_issue_id:
safe_request_id:
action_type:
internal_owner:
support_owner:
rollback_owner:
redaction_status:
no_real_money_status:
blocked_action_acknowledgement:
queue_state: READY_FOR_INTERNAL_WORK, QUEUED_FOR_FOUNDER_REVIEW, HOLD_FOR_REDACTION, HOLD_FOR_RECHECK, HOLD_FOR_FOUNDER_REWRITE, or BLOCKED_FOR_EXTERNAL_ACTION
next_safe_internal_step:
```

## Allowed Queue States

Use `READY_FOR_INTERNAL_WORK` only when the action is local, redacted, no-secret, no-real-money, issue/request-id-aware, support-owned, rollback-aware, and does not require any external account, live system, legal/provider, public launch, app store, or destructive step.

Use `QUEUED_FOR_FOUNDER_REVIEW` when the action is safe to track locally but needs founder review before wording, support priority, or next internal action changes.

Use `HOLD_FOR_REDACTION` when any raw URL, tester identity, contact detail, account ID, wallet ID, cookie, Authorization header, Magic Link URL, raw response body, private screenshot, payment data, or secret-looking value appears in tracked evidence.

Use `HOLD_FOR_RECHECK` when the issue ID is missing, request ID is unsafe or unclear, no-real-money evidence is stale, support/rollback owner is missing, or the action type does not match the founder decision intake.

Use `HOLD_FOR_FOUNDER_REWRITE` when action wording could sound like production support, financial advice, legal advice, provider commitment, public launch wording, app store promise, or permission to use real project/customer/payment data.

Use `BLOCKED_FOR_EXTERNAL_ACTION` when the next step requires Codex to reply to testers, send invites, share URLs, open dashboards, change account settings, deploy, change Supabase redirects, enter secrets, set up providers, enable money features, make legal/provider commitments, publish publicly, use app stores, or perform destructive actions.

## Safe Action Types

Allowed local action types are:

- `DOC_UPDATE`
- `LOCAL_QA`
- `TRIAGE_RECHECK`
- `SUPPORT_LABEL_UPDATE`
- `ROLLBACK_PREP`

Each action type must stay inside local docs, local validators, local QA evidence, or redacted planning records.

## Blocked Queue Actions

Do not queue or act on values that say `SEND_TO_TESTER`, `SHARE_BETA_URL`, `ENABLE_REAL_MONEY`, `APPROVE_PUBLIC_LAUNCH`, `CHANGE_SUPABASE`, `SET_UP_PROVIDER`, `LEGAL_APPROVED`, or `APP_STORE_SUBMIT`.

Any queue item that requires Codex to reply to testers, change Supabase redirects, publish publicly, make legal/provider commitments, or handle real money must be marked `BLOCKED_FOR_EXTERNAL_ACTION`.

## Safe Evidence Rules

Safe evidence may include tester codes, safe issue IDs, safe request IDs, action type, internal owner, support owner, rollback owner, redaction status, no-real-money status, blocked action acknowledgement, queue state, and next safe internal step.

Do not store raw URLs, tester names, tester emails, phone numbers, addresses, account IDs, wallet IDs, cookies, Authorization headers, Magic Link URLs, raw response bodies, private screenshots, payment data, passwords, private keys, seed phrases, service-role keys, database URLs, bearer tokens, or any secret-looking value.

## Required Checks

```powershell
npm run check:public-beta-first-batch-internal-action-queue
npm run check:public-beta-first-batch-founder-support-decision-intake
npm run check:public-beta-first-batch-founder-support-handoff
npm run check:public-beta-first-batch-support-summary
npm run check:public-beta-founder-reply-record-closeout
npm run check:public-beta-first-response-triage
npm run check:public-beta-support-sla
npm run check:public-beta-support-queue
npm run check:public-beta-known-issues
npm run check:public-beta-incident-response
npm run check:real-status-audit
npm run check
```

## Acceptance Check

This queue is accepted only when local docs and validators prove that first-batch internal actions are redacted, tester-code-only, issue/request-id-aware, support-owned, rollback-aware, no-real-money-confirmed, local-action-only, and blocked from Codex replies to testers, raw URL storage/sharing, private tester data, external account changes, deploy changes, Supabase redirects, live Supabase writes, provider setup, real-money actions, legal/provider commitments, public launch, app stores, or destructive actions.
