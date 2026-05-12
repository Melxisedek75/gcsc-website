# SmartContractor Public Beta Review Packet

Date: 2026-05-11

## Purpose

This packet is the founder-facing review index for deciding whether SmartContractor is ready to share as a demo-safe public beta. It does not approve real loans, escrow, token collateral, payment capture, or production database policy changes.

## Founder Must Review First

Review these documents before sending a public beta link to testers, partners, or investors:

- `docs/smartcontractor-public-beta-handoff-checklist.md`;
- `docs/smartcontractor-public-launch-runbook.md`;
- `docs/smartcontractor-demo-script.md`;
- `docs/smartcontractor-controlled-user-test-plan.md`;
- `docs/smartcontractor-beta-session-runbook.md`;
- `docs/smartcontractor-beta-session-summary-template.md`;
- `docs/smartcontractor-beta-decision-log.md`;
- `docs/smartcontractor-founder-auth-evidence-template.md`;
- `docs/smartcontractor-legal-financial-review-checklist.md`.

## Demo-Safe Launch Scope

The public beta may show only demo-safe workflows:

- homeowner job intake;
- contractor bid submission;
- simulated starter loan request;
- simulated milestone payment status;
- dispute evidence metadata;
- peer review scoring;
- admin/risk console review.

## Blocked Until Founder Approval

These actions stay blocked until explicit founder approval, proper credentials, legal/provider review, and separate verification:

- real loan origination;
- real escrow or stored-value handling;
- real token collateral lock, liquidation, or automatic repayment;
- production payment capture;
- live Supabase RLS replacement;
- admin membership activation;
- attorney/provider review for lending, escrow, payments, identity, and token-collateral language.

## Local Verification Commands

Run these from `C:\gcsc\construction-ai` before any public beta handoff:

```bash
npm run check:public-beta-review-packet
npm run check:beta-readiness
npm run check
```

Passing local checks means the demo package is internally consistent. It does not mean the project is legally, financially, or operationally approved for real-money launch.

## Evidence To Capture

For the first public beta review, capture only non-secret evidence:

- deployed demo URL;
- GitHub commit hash;
- `npm run check` result;
- browser screenshots of homeowner, contractor, dispute, peer review, admin/risk, and beta readiness flows;
- request IDs for any failed API calls;
- tester feedback summary;
- go/no-go decision in `docs/smartcontractor-beta-decision-log.md`.

Do not capture passwords, API keys, service-role keys, database URLs, private wallet keys, seed phrases, or raw financial identity data.

## Go / No-Go Checklist

Public beta can move forward only when:

- the founder reviewed the full packet;
- local checks passed;
- real-money features remain disabled;
- Auth/admin/RLS state is understood and documented;
- tester scope is limited and demo-only;
- issues from the controlled user test are logged;
- the beta decision log records a clear go/no-go decision.
