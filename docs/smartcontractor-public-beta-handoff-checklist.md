# SmartContractor Public Beta Handoff Checklist

Date: 2026-05-06

Purpose: define the smallest safe public beta handoff package that the founder can review before connecting deployment accounts or enabling strict production controls.

## Safe Beta Demo Scope

The public beta demo may show:

- homeowner job intake;
- contractor bid submission;
- simulated starter loan request;
- simulated milestone payment status;
- dispute and evidence metadata flow;
- peer review scoring;
- admin/risk console review queue;
- Founder Action Center readiness blockers.

The demo must keep these disabled:

- real loan origination;
- real escrow or stored-value handling;
- real token collateral lock, liquidation, or automatic repayment;
- production payment-provider capture;
- automatic admin role assignment;
- live Supabase RLS replacement without explicit founder approval.

## Founder Review Packet

Before sharing the beta link outside the core team, the founder should review:

- `docs/smartcontractor-public-launch-runbook.md`;
- `docs/smartcontractor-deploy-platform-decision-brief.md`;
- `docs/smartcontractor-vercel-preflight.md`;
- `docs/smartcontractor-founder-admin-activation-runbook.md`;
- `docs/smartcontractor-legal-financial-review-checklist.md`;
- `docs/smartcontractor-demo-script.md`.

## Local Release Checks

Codex can run these locally without passwords or external accounts:

```bash
cd construction-ai
npm run check
```

If the full check passes, the codebase is ready for a founder-present deployment setup. Passing checks do not mean legal, payment, lending, or escrow approval.

## Founder Action Step

Open the deploy-platform decision brief, choose whether to use Vercel for the first public beta, then connect the deploy account without sharing passwords or secret keys in chat.

## Acceptance Criteria

- Founder can identify the exact safe beta scope.
- Founder knows which documents to review before sharing a beta link.
- Live-risk features remain explicitly disabled.
- The next founder action is deployment-account selection, not database or payment changes.
