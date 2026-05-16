# SmartContractor Public Beta Invite Founder Send Checklist

Status: INTERNAL_FOUNDER_CONTROLLED_INVITE_SEND_CHECKLIST_ONLY

This checklist is not approval for Codex to send invites, share a public beta URL, open external accounts, change deploy settings, change Supabase redirects, or enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral.

## Purpose

Give the founder one safe, founder-controlled checklist for the narrow moment after the exact first-batch invite approval phrase is recorded.

This keeps actual invite sending outside Codex while preserving tester-code-only scope, redacted evidence, demo-only language, support ownership, rollback ownership, and no-real-money boundaries.

## Preconditions

Use this checklist only when all of these are true:

- `READY_TO_REQUEST_INVITE_APPROVAL` was reached in `docs/smartcontractor-public-beta-invite-evidence-closeout.md`;
- the exact approval phrase from `docs/smartcontractor-public-beta-invite-approval-request-draft.md` was recorded as a fresh standalone founder decision;
- first batch remains 3-5 testers;
- tester-code list is reviewed;
- private tester identity/contact map stays outside tracked repo docs;
- public beta URL is shared only through a founder-controlled channel;
- support owner and rollback owner are confirmed;
- no-real-money banner and disabled payment/loan actions are confirmed;
- redaction status is internal-only or redacted.

## Founder-Controlled Send Steps

1. Open the founder-controlled channel directly.
2. Use tester codes, not names, in tracked notes.
3. Paste only the reviewed demo-only invite wording.
4. Share the public beta URL only inside the founder-controlled channel.
5. Include the no-real-money boundary: no real payment, no real loan, no real escrow, no repayment routing, no stablecoin settlement, no token collateral, and no legal decision.
6. Include the sensitive-data boundary: do not enter passwords, bank data, card data, SSN, government ID photos, private keys, seed phrases, real customer addresses, or private project contracts.
7. Ask testers to report only safe request IDs, tester code, page/flow, device/browser, expected result, actual result, and redacted screenshot status.
8. Record only send metadata in repo docs: tester code, role, send status, channel label, sent_at, support owner, rollback owner, and issue intake link label.

## Do Not Store

Do not store any of these in tracked docs, chat, screenshots, issue logs, or commits:

- real public beta URL;
- tester names;
- tester emails;
- phone numbers;
- addresses;
- account IDs;
- wallet IDs;
- cookies;
- Authorization headers;
- Magic Link URLs;
- raw response bodies;
- private screenshots;
- payment data;
- secret-looking values.

## Hold Rules

Use HOLD_FOR_RECHECK when the public beta URL changed, expired, rotated, points to a different commit, loses request-id/security/no-real-money evidence, or shows live-risk capability.

Use HOLD_FOR_TESTER_SCOPE_REVIEW when the batch is larger than 3-5 testers, includes unreviewed testers, or mixes real identities into tracked docs.

Use HOLD_FOR_REDACTION when any private tester data, raw URL, private screenshot, raw response body, or secret-looking value appears in tracked evidence.

Use BLOCKED_FOR_EXTERNAL_ACTION when the next action requires Codex to send invites, share the URL, open external dashboards, change account settings, enter secrets, deploy, change Supabase redirects, set up providers, enable money features, make legal/provider commitments, publish publicly, or perform destructive action.

## Post-Send Local Record

After the founder sends invites outside Codex, record only this redacted metadata:

```text
invite_batch_id:
approval_phrase_recorded_at:
source_commit:
public_beta_url_label:
tester_codes_sent:
tester_count:
channel_label:
sent_by_founder:
support_owner:
rollback_owner:
known_issue_link_label:
redaction_status:
next_checkin_window:
send_state: SENT_BY_FOUNDER, HOLD_FOR_RECHECK, HOLD_FOR_TESTER_SCOPE_REVIEW, HOLD_FOR_REDACTION, or BLOCKED_FOR_EXTERNAL_ACTION
```

## Required Checks

```powershell
npm run check:public-beta-invite-founder-send-checklist
npm run check:public-beta-invite-approval-request-draft
npm run check:public-beta-invite-evidence-closeout
npm run check:public-beta-invite-release-decision-packet
npm run check:beta-tester-invite
npm run check:beta-issue-log
npm run check:real-status-audit
npm run check
```

## Acceptance Check

This checklist is accepted only when local docs and validators prove that invite sending remains founder-controlled, tester-code-only, demo-only, redacted, and blocked from Codex-sent invites, raw URL storage, external account changes, deploy changes, Supabase redirects, provider setup, real-money features, legal/provider commitments, public launch, app stores, or destructive actions.
