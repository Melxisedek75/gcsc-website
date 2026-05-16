# SmartContractor Public Beta First Batch Founder Support Decision Intake

Status: INTERNAL_FOUNDER_SUPPORT_DECISION_INTAKE_ONLY

This intake is not approval for Codex to reply to testers, send invites, share a public beta URL, open external accounts, change deploy settings, change Supabase redirects, set up providers, publish publicly, use app stores, or enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral.

## Purpose

Capture a redacted founder support decision intake after the first-batch founder support handoff is reviewed outside Codex.

The intake records only internal decision metadata: tester code, safe issue ID, safe request ID, decision summary label, support owner, rollback owner, redaction status, no-real-money status, blocked action acknowledgement, and next safe internal action. It must not store tester identity, raw URLs, inbox data, private screenshots, payment data, legal advice, provider commitments, or any secret-looking value.

## Source Documents

- `docs/smartcontractor-public-beta-first-batch-founder-support-handoff.md`
- `docs/smartcontractor-public-beta-first-batch-support-summary.md`
- `docs/smartcontractor-public-beta-founder-reply-record-closeout.md`
- `docs/smartcontractor-public-beta-founder-reply-boundary.md`
- `docs/smartcontractor-public-beta-first-response-triage.md`
- `docs/smartcontractor-public-beta-support-sla.md`
- `docs/smartcontractor-public-beta-support-queue.md`
- `docs/smartcontractor-public-beta-known-issues.md`
- `docs/smartcontractor-public-beta-incident-response.md`

## What This Does Not Approve

This intake does not approve:

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

## Required Decision Fields

Record only redacted metadata in this format:

```text
decision_intake_id:
handoff_id:
support_summary_id:
response_batch_id:
founder_decision_owner:
safe_issue_ids_decided:
safe_request_ids_decided:
decision_summary_label:
support_owner:
rollback_owner:
redaction_status:
no_real_money_status:
blocked_action_acknowledgement:
next_safe_internal_action:
decision_state: RECORDED_FOR_INTERNAL_QUEUE, HOLD_FOR_REDACTION, HOLD_FOR_RECHECK, HOLD_FOR_FOUNDER_REWRITE, or BLOCKED_FOR_EXTERNAL_ACTION
```

## Allowed Decision States

Use `RECORDED_FOR_INTERNAL_QUEUE` only when the founder decision is captured outside Codex, all fields are redacted, safe issue IDs and safe request IDs are used, support and rollback owners are recorded, no-real-money status is current, and the next action stays internal.

Use `HOLD_FOR_REDACTION` when any raw URL, tester identity, contact detail, account ID, wallet ID, cookie, Authorization header, Magic Link URL, raw response body, private screenshot, payment data, or secret-looking value appears in tracked evidence.

Use `HOLD_FOR_RECHECK` when issue IDs are missing, request IDs are unsafe or unclear, no-real-money evidence is stale, support/rollback owner is missing, or the decision summary label does not match the founder support handoff.

Use `HOLD_FOR_FOUNDER_REWRITE` when the decision could sound like production support, financial advice, legal advice, provider commitment, public launch wording, app store promise, or permission to use real project/customer/payment data.

Use `BLOCKED_FOR_EXTERNAL_ACTION` when the next step requires Codex to reply to testers, send invites, share URLs, open dashboards, change account settings, deploy, change Supabase redirects, enter secrets, set up providers, enable money features, make legal/provider commitments, publish publicly, use app stores, or perform destructive actions.

## Blocked Decision Values

Do not record or act on decision values that say `SEND_TO_TESTER`, `SHARE_BETA_URL`, `ENABLE_REAL_MONEY`, `APPROVE_PUBLIC_LAUNCH`, `CHANGE_SUPABASE`, `SET_UP_PROVIDER`, `LEGAL_APPROVED`, or `APP_STORE_SUBMIT` unless founder-controlled external evidence is later reviewed in a separate live-action decision packet.

Any decision that requires Codex to reply to testers, change Supabase redirects, publish publicly, make legal/provider commitments, or handle real money must be marked `BLOCKED_FOR_EXTERNAL_ACTION`.

## Safe Evidence Rules

Safe evidence may include tester codes, safe issue IDs, safe request IDs, decision summary labels, support owner, rollback owner, redaction status, no-real-money status, blocked action acknowledgement, decision state, and next safe internal action.

Do not store raw URLs, tester names, tester emails, phone numbers, addresses, account IDs, wallet IDs, cookies, Authorization headers, Magic Link URLs, raw response bodies, private screenshots, payment data, passwords, private keys, seed phrases, service-role keys, database URLs, bearer tokens, or any secret-looking value.

## Required Checks

```powershell
npm run check:public-beta-first-batch-founder-support-decision-intake
npm run check:public-beta-first-batch-founder-support-handoff
npm run check:public-beta-first-batch-support-summary
npm run check:public-beta-founder-reply-record-closeout
npm run check:public-beta-founder-reply-boundary
npm run check:public-beta-first-response-triage
npm run check:public-beta-support-sla
npm run check:public-beta-support-queue
npm run check:public-beta-known-issues
npm run check:public-beta-incident-response
npm run check:real-status-audit
npm run check
```

## Acceptance Check

This intake is accepted only when local docs and validators prove that founder support decisions are redacted, tester-code-only, issue/request-id-aware, support-owned, rollback-aware, no-real-money-confirmed, internal-action-only, and blocked from Codex replies to testers, raw URL storage/sharing, private tester data, external account changes, deploy changes, Supabase redirects, live Supabase writes, provider setup, real-money actions, legal/provider commitments, public launch, app stores, or destructive actions.
