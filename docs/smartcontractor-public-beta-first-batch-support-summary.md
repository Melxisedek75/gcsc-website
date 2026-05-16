# SmartContractor Public Beta First Batch Support Summary

Status: INTERNAL_FIRST_BATCH_SUPPORT_SUMMARY_ONLY

This summary is not approval for Codex to reply to testers, send invites, share a public beta URL, open external accounts, change deploy settings, change Supabase redirects, set up providers, publish publicly, use app stores, or enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral.

## Purpose

Summarize redacted first-batch beta support state after founder reply closeout records are created outside Codex.

The summary keeps the repo limited to tester code, safe issue ID, safe request ID, severity counts, state counts, support owner, rollback owner, redaction status, no-real-money status, and next safe actions. It must not store tester identity, raw URLs, message inbox data, support inbox data, private screenshots, payment data, or any secret-looking value.

## Source Documents

- `docs/smartcontractor-public-beta-founder-reply-record-closeout.md`
- `docs/smartcontractor-public-beta-founder-reply-boundary.md`
- `docs/smartcontractor-public-beta-first-response-triage.md`
- `docs/smartcontractor-public-beta-invite-post-send-intake.md`
- `docs/smartcontractor-beta-issue-log-template.md`
- `docs/smartcontractor-public-beta-support-sla.md`
- `docs/smartcontractor-public-beta-support-queue.md`
- `docs/smartcontractor-public-beta-known-issues.md`
- `docs/smartcontractor-public-beta-incident-response.md`

## What This Does Not Approve

This summary does not approve:

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
- public launch or app store work;
- destructive actions.

## Required Summary Fields

Record only redacted metadata in this format:

```text
support_summary_id:
invite_batch_id:
response_batch_id:
summary_window_label:
tester_codes_in_scope:
issue_ids_in_scope:
safe_request_ids_seen:
severity_counts: P0=, P1=, P2=, P3=
state_counts: CLOSED_SENT_BY_FOUNDER=, QUEUED_FOR_FOUNDER_REVIEW=, HOLD_FOR_REDACTION=, HOLD_FOR_RECHECK=, HOLD_FOR_FOUNDER_REWRITE=, BLOCKED_FOR_EXTERNAL_ACTION=
support_owner:
rollback_owner:
redaction_status:
no_real_money_status:
next_safe_actions:
summary_state: SUMMARY_RECORDED, QUEUED_FOR_FOUNDER_REVIEW, HOLD_FOR_REDACTION, HOLD_FOR_RECHECK, or BLOCKED_FOR_EXTERNAL_ACTION
```

## Summary States

Use `SUMMARY_RECORDED` only when the summary uses redacted metadata, tester codes, safe issue IDs, safe request IDs, severity counts, state counts, current support owner, current rollback owner, and no-real-money status.

Use `QUEUED_FOR_FOUNDER_REVIEW` when the first-batch support summary is ready for founder review, but founder still needs to confirm wording, support ownership, or next safe actions outside Codex.

Use `HOLD_FOR_REDACTION` when any raw URL, tester identity, contact detail, account ID, wallet ID, cookie, Authorization header, Magic Link URL, raw response body, private screenshot, payment data, or secret-looking value appears in tracked evidence.

Use `HOLD_FOR_RECHECK` when issue IDs are missing, request IDs are unsafe or unclear, severity counts do not match the triage record, state counts do not match the reply closeout record, no-real-money evidence is stale, or support/rollback owner is missing.

Use `QUEUED_FOR_FOUNDER_REVIEW` when wording could sound like production support, financial advice, legal advice, provider commitment, public launch wording, app store promise, or permission to use real project/customer/payment data.

Use `BLOCKED_FOR_EXTERNAL_ACTION` when the next step requires Codex to reply to testers, send invites, share URLs, open dashboards, change account settings, deploy, change Supabase redirects, enter secrets, set up providers, enable money features, make legal/provider commitments, publish publicly, use app stores, or perform destructive actions.

## Safe Evidence Rules

Safe evidence may include tester codes, safe issue IDs, safe request IDs, severity counts, state counts, reply template labels, founder send labels, support owner, rollback owner, redaction status, no-real-money status, summary state, and next safe actions.

Do not store raw URLs, tester names, tester emails, phone numbers, addresses, account IDs, wallet IDs, cookies, Authorization headers, Magic Link URLs, raw response bodies, private screenshots, payment data, passwords, private keys, seed phrases, service-role keys, database URLs, bearer tokens, or any secret-looking value.

## Required Checks

```powershell
npm run check:public-beta-first-batch-support-summary
npm run check:public-beta-founder-reply-record-closeout
npm run check:public-beta-founder-reply-boundary
npm run check:public-beta-first-response-triage
npm run check:public-beta-invite-post-send-intake
npm run check:beta-issue-log
npm run check:public-beta-support-sla
npm run check:public-beta-support-queue
npm run check:public-beta-known-issues
npm run check:public-beta-incident-response
npm run check:real-status-audit
npm run check
```

## Acceptance Check

This summary is accepted only when local docs and validators prove that first-batch beta support state is redacted, tester-code-only, severity/status-counted, issue/request-id-aware, support-owned, rollback-aware, no-real-money-confirmed, and blocked from Codex replies to testers, raw URL storage/sharing, private tester data, external account changes, deploy changes, Supabase redirects, live Supabase writes, provider setup, real-money actions, legal/provider commitments, public launch, app stores, or destructive actions.
