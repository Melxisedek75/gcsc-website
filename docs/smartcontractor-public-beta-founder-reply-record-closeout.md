# SmartContractor Public Beta Founder Reply Record Closeout

Status: INTERNAL_FOUNDER_REPLY_RECORD_CLOSEOUT_ONLY

This closeout is not approval for Codex to reply to testers, send invites, share a public beta URL, open external accounts, change deploy settings, change Supabase redirects, set up providers, publish publicly, use app stores, or enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral.

## Purpose

Close the local record after the founder sends or queues first-batch beta replies outside Codex.

The closeout keeps the repo limited to redacted metadata: tester code, safe issue ID, safe request ID, reply template label, founder send state, support owner, rollback owner, and next safe action. It must not store tester identity, raw URLs, message inbox data, or any secret-looking value.

## Source Documents

- `docs/smartcontractor-public-beta-founder-reply-boundary.md`
- `docs/smartcontractor-public-beta-first-response-triage.md`
- `docs/smartcontractor-public-beta-invite-post-send-intake.md`
- `docs/smartcontractor-beta-issue-log-template.md`
- `docs/smartcontractor-public-beta-support-sla.md`
- `docs/smartcontractor-public-beta-support-queue.md`
- `docs/smartcontractor-public-beta-known-issues.md`
- `docs/smartcontractor-public-beta-incident-response.md`

## What This Does Not Approve

This closeout does not approve:

- Codex replies to testers;
- sending or resending invites;
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

## Required Closeout Fields

Record only redacted metadata in this format:

```text
reply_closeout_id:
reply_record_id:
response_batch_id:
safe_issue_id:
tester_code:
reply_template_used:
sent_by_founder:
sent_at_label:
safe_request_id:
support_owner:
rollback_owner:
redaction_status:
reply_closeout_state: CLOSED_SENT_BY_FOUNDER, QUEUED_FOR_FOUNDER_REVIEW, HOLD_FOR_REDACTION, HOLD_FOR_RECHECK, HOLD_FOR_FOUNDER_REWRITE, or BLOCKED_FOR_EXTERNAL_ACTION
next_safe_action:
```

## Closeout States

Use `CLOSED_SENT_BY_FOUNDER` only when the founder sent the reply outside Codex, the reply matched an allowed template or founder rewrite, no raw URL was stored, tester identity stayed out of tracked docs, no-real-money wording stayed intact, and any issue/request IDs are safe.

Use `QUEUED_FOR_FOUNDER_REVIEW` when the reply is still pending founder action, needs founder wording review, or needs batching with other first-batch responses.

Use `HOLD_FOR_REDACTION` when any raw URL, tester identity, contact detail, account ID, wallet ID, cookie, Authorization header, Magic Link URL, raw response body, private screenshot, payment data, or secret-looking value appears in tracked evidence.

Use `HOLD_FOR_RECHECK` when the issue ID is missing, the request ID is unsafe or unclear, the reply template is unknown, no-real-money evidence is stale, the triage record is missing, or support/rollback owner is missing.

Use `HOLD_FOR_FOUNDER_REWRITE` when the reply could sound like production support, financial advice, legal advice, provider commitment, public launch wording, app store promise, or permission to use real project/customer/payment data.

Use `BLOCKED_FOR_EXTERNAL_ACTION` when the next step requires Codex to reply to testers, send invites, share URLs, open dashboards, change account settings, deploy, change Supabase redirects, enter secrets, set up providers, enable money features, make legal/provider commitments, publish publicly, use app stores, or perform destructive actions.

## Safe Evidence Rules

Safe evidence may include tester codes, safe issue IDs, safe request IDs, reply template labels, founder send labels, support owner, rollback owner, redaction status, closeout state, and next safe action.

Do not store raw URLs, tester names, tester emails, phone numbers, addresses, account IDs, wallet IDs, cookies, Authorization headers, Magic Link URLs, raw response bodies, private screenshots, payment data, passwords, private keys, seed phrases, service-role keys, database URLs, bearer tokens, or any secret-looking value.

## Required Checks

```powershell
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

This closeout is accepted only when local docs and validators prove that founder reply records are redacted, tester-code-only, issue-id-based, request-id-aware, support-owned, rollback-aware, and blocked from Codex replies to testers, raw URL storage/sharing, private tester data, external account changes, deploy changes, Supabase redirects, live Supabase writes, provider setup, real-money actions, legal/provider commitments, public launch, app stores, or destructive actions.
