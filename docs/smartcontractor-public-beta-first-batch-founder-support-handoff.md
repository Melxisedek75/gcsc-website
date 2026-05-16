# SmartContractor Public Beta First Batch Founder Support Handoff

Status: INTERNAL_FOUNDER_SUPPORT_HANDOFF_ONLY

This handoff is not approval for Codex to reply to testers, send invites, share a public beta URL, open external accounts, change deploy settings, change Supabase redirects, set up providers, publish publicly, use app stores, or enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral.

## Purpose

Prepare a redacted first-batch beta support handoff for founder review after the support summary is recorded.

The handoff turns the first-batch support summary into founder-review-safe fields: tester code, safe issue ID, safe request ID, severity counts, state counts, support owner, rollback owner, redaction status, no-real-money status, blocked action acknowledgement, founder decision needed, and next safe internal action. It must not store tester identity, raw URLs, inbox data, private screenshots, payment data, or any secret-looking value.

## Source Documents

- `docs/smartcontractor-public-beta-first-batch-support-summary.md`
- `docs/smartcontractor-public-beta-founder-reply-record-closeout.md`
- `docs/smartcontractor-public-beta-founder-reply-boundary.md`
- `docs/smartcontractor-public-beta-first-response-triage.md`
- `docs/smartcontractor-public-beta-support-sla.md`
- `docs/smartcontractor-public-beta-support-queue.md`
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
support_summary_id:
response_batch_id:
founder_review_owner:
issue_ids_to_review:
severity_counts_to_review:
reply_states_to_review:
support_owner:
rollback_owner:
redaction_status:
no_real_money_status:
blocked_action_acknowledgement:
founder_decision_needed:
next_safe_internal_action:
handoff_state: READY_FOR_FOUNDER_REVIEW, QUEUED_FOR_FOUNDER_REVIEW, HOLD_FOR_REDACTION, HOLD_FOR_RECHECK, or BLOCKED_FOR_EXTERNAL_ACTION
```

## Handoff States

Use `READY_FOR_FOUNDER_REVIEW` only when all handoff fields are redacted, the issue IDs and request IDs are safe, severity counts and state counts match the support summary, support and rollback owners are recorded, no-real-money status is current, and blocked action acknowledgement is explicit.

Use `QUEUED_FOR_FOUNDER_REVIEW` when the handoff is safe but still needs founder attention before any external reply, support decision, or follow-up wording leaves local docs.

Use `HOLD_FOR_REDACTION` when any raw URL, tester identity, contact detail, account ID, wallet ID, cookie, Authorization header, Magic Link URL, raw response body, private screenshot, payment data, or secret-looking value appears in tracked evidence.

Use `HOLD_FOR_RECHECK` when issue IDs are missing, request IDs are unsafe or unclear, severity counts do not match, state counts do not match, no-real-money evidence is stale, or support/rollback owner is missing.

Use `BLOCKED_FOR_EXTERNAL_ACTION` when the next step requires Codex to reply to testers, send invites, share URLs, open dashboards, change account settings, deploy, change Supabase redirects, enter secrets, set up providers, enable money features, make legal/provider commitments, publish publicly, use app stores, or perform destructive actions.

## Founder Review Checklist

- Confirm the handoff uses tester codes only.
- Confirm safe issue ID and safe request ID values are present when available.
- Confirm severity counts and state counts match the support summary.
- Confirm support owner and rollback owner are assigned.
- Confirm no-real-money status stays current.
- Confirm wording does not sound like production support, financial advice, legal advice, provider commitment, public launch wording, app store promise, or permission to use real project/customer/payment data.
- Confirm the next safe internal action does not require Codex to reply to testers, share raw URLs, change accounts, write to live Supabase, set up providers, handle money, make legal/provider commitments, publish publicly, use app stores, or perform destructive actions.

## Safe Evidence Rules

Safe evidence may include tester codes, safe issue IDs, safe request IDs, severity counts, state counts, support owner, rollback owner, redaction status, no-real-money status, blocked action acknowledgement, founder decision needed, handoff state, and next safe internal action.

Do not store raw URLs, tester names, tester emails, phone numbers, addresses, account IDs, wallet IDs, cookies, Authorization headers, Magic Link URLs, raw response bodies, private screenshots, payment data, passwords, private keys, seed phrases, service-role keys, database URLs, bearer tokens, or any secret-looking value.

## Required Checks

```powershell
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

This handoff is accepted only when local docs and validators prove that first-batch beta support handoff data is redacted, tester-code-only, severity/status-counted, issue/request-id-aware, support-owned, rollback-aware, no-real-money-confirmed, founder-review-ready, and blocked from Codex replies to testers, raw URL storage/sharing, private tester data, external account changes, deploy changes, Supabase redirects, live Supabase writes, provider setup, real-money actions, legal/provider commitments, public launch, app stores, or destructive actions.
