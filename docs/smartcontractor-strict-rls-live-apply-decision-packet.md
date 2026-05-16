# SmartContractor Strict RLS Live Apply Decision Packet

Date: 2026-05-15 PT

Status: INTERNAL_STRICT_RLS_LIVE_APPLY_DECISION_ONLY

## Decision Goal

Give the founder one safe decision packet for the future live strict RLS apply step, without running SQL, changing Supabase settings, assigning admin roles, deploying production, enabling real payments, enabling real loans, enabling real escrow, enabling real repayment routing, enabling stablecoin settlement, enabling token collateral, making legal/provider commitments, or launching publicly.

## Source Documents

- `docs/smartcontractor-strict-rls-replacement-draft.sql`
- `docs/smartcontractor-strict-rls-review.md`
- `docs/smartcontractor-strict-admin-smoke-checklist.md`
- `docs/smartcontractor-auth-rls-plan.md`
- `docs/smartcontractor-founder-auth-admin-live-decision-packet.md`

## What This Does Not Approve

This packet is not approval to run live SQL, not approval to apply strict RLS, not approval to change Supabase settings, not approval to assign admin roles, not approval to deploy production, and not approval to enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, production provider API calls, or public launch.

This packet is also not legal, lender, provider, securities, tax, or compliance advice.

## Ready State

The future state can become `READY_TO_REQUEST_STRICT_RLS_LIVE_APPROVAL` only when all of these are true in the current founder-controlled session:

- Founder Auth/Admin live activation is complete.
- The founder/admin user can pass strict admin smoke checks.
- RLS draft checksum/source commit is current.
- The selected Supabase project is confirmed by the founder.
- Supabase backups/rollback owner are confirmed by the founder.
- Payment/provider/loan/escrow/token flows remain disabled.
- The approval is current-thread, standalone, and exact.

## Not Ready States

Use `NOT_READY` when:

- founder Auth/Admin live activation is not complete;
- selected founder/admin user is unclear;
- strict admin smoke has not passed;
- the RLS draft source commit is stale or unknown;
- rollback owner is missing;
- no-real-money flags are not confirmed;
- Supabase project label is unclear;
- the founder approval is old, bundled, paraphrased, screenshot-only, or copied from another thread.

## Blocked For Live Action

Use `BLOCKED_FOR_LIVE_ACTION` when the request includes any extra live/external/legal/money scope, including admin role assignment, production deploy, payment/provider setup, real loans, escrow, repayment routing, stablecoin settlement, token collateral, legal/provider commitments, public launch, destructive data changes, service-role key handling in chat, or raw `.env` sharing.

## Founder Evidence Record

Record only non-secret fields:

```text
strict_rls_recorded_at:
source_commit:
supabase_project_label:
founder_admin_smoke_result:
rls_draft_reviewed:
rollback_owner:
no_real_money_flags_confirmed:
decision: HOLD, REVIEW, or READY_TO_REQUEST_STRICT_RLS_LIVE_APPROVAL
```

Missing source commit, selected Supabase project label, founder/admin smoke result, RLS draft review, rollback owner, no-real-money confirmation, or decision keeps the state in HOLD.

## Live Apply Approval Phrase

Only this exact standalone phrase can support preparing the future live strict RLS apply request:

```text
I approve live strict RLS apply for the reviewed SmartContractor SQL draft only.
```

This phrase is not approval for admin role assignment, production deploy, payment/provider setup, real loans, escrow, repayment routing, stablecoin settlement, token collateral, legal/provider commitments, public launch, or destructive data changes.

If the founder message bundles any extra scope with this phrase, classify the packet as `BLOCKED_FOR_LIVE_ACTION` and ask for a clean separate approval after founder-controlled review.

## Post-Apply Smoke Order

After a future founder-controlled apply, the safe verification order is:

1. Run Founder Auth/Admin verification first.
2. Apply the reviewed SQL only in the founder-controlled Supabase SQL editor.
3. Run strict admin smoke checks immediately after apply.
4. Run browser-denied checks for unauthenticated protected routes.
5. Run owner/participant checks for profile, homeowner, contractor, job, bid, project contract, milestone, loan, dispute, evidence, review, verification, payment-intent, and collateral views.
6. Confirm backend-only payment events, provider events, audit events, and token price snapshots do not expose browser policies.
7. Record request IDs and non-secret results.

If any protected owner/participant flow fails, classify as HOLD_FOR_RLS_REVIEW.

If backend-only tables expose browser policies, classify as BLOCKED_FOR_LIVE_ACTION.

## Rollback/Hold Plan

Rollback must be founder-controlled and reviewed before live apply. Codex may prepare local notes and verification commands, but must not run live SQL, click external dashboards, change Supabase settings, paste secrets, or infer rollback authority.

If rollback owner, rollback command path, backup state, or strict smoke owner is unclear, keep the decision in HOLD.

## Required Checks

Run from `C:\gcsc\construction-ai`:

```powershell
npm run check:strict-rls-live-apply-decision-packet
npm run check:rls-draft
npm run check:strict-admin-smoke
npm run check:founder-auth-admin-live-decision-packet
npm run check:auth
npm run check:strict-gates
npm run check:real-status-audit
npm run check
```

## Acceptance Check

This packet is ready when the founder can see the exact evidence needed before strict RLS live apply, the exact approval phrase, the post-apply smoke order, the rollback/hold plan, and the live boundaries that still require separate explicit founder-controlled approval.
