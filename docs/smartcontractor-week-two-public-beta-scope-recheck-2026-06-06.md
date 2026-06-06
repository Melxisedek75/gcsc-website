# SmartContractor Week 2 Public Beta Scope Recheck

Status: LOCAL_RECHECK_ONLY.

This recheck does not approve public beta launch, tester invites, public URL sharing, external sends, deployment, live Supabase changes, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, FIO registration, legal conclusions, provider commitments, public website replacement, production release, or live actions.

## Purpose

Give the founder one local-only public beta scope reading order before any future invite/share/release decision. The goal is to confirm tester scope, demo-only boundaries, consent/privacy, support coverage, known issues, URL smoke evidence, invite holds, and finance/contract safety without starting the beta.

## Source Documents And Surfaces

- `docs/smartcontractor-public-beta-review-packet.md`
- `docs/smartcontractor-public-beta-tester-quickstart.md`
- `docs/smartcontractor-public-beta-tester-faq.md`
- `docs/smartcontractor-public-beta-consent-acknowledgement.md`
- `docs/smartcontractor-public-beta-privacy-notice.md`
- `docs/smartcontractor-public-beta-support-queue.md`
- `docs/smartcontractor-public-beta-known-issues.md`
- `docs/smartcontractor-public-beta-launch-readiness.md`
- `docs/smartcontractor-public-beta-launch-decision-record.md`
- `docs/smartcontractor-public-beta-invite-release-decision-packet.md`
- `docs/smartcontractor-public-beta-first-cohort-launch-packet.md`
- `docs/smartcontractor-week-two-deployment-public-beta-recheck-2026-06-06.md`
- `/api/admin/public-beta-next-step-readiness`
- `/api/admin/public-beta-next-step-execution-checklist`
- `/api/admin/week-two-deployment-public-beta-readiness`
- `/api/admin/week-two-deployment-public-beta-execution-checklist`
- `/api/admin/admin-evidence-export-preview?source_filter=public_beta_next_step_readiness`
- `/api/admin/admin-evidence-export-preview?source_filter=public_beta_next_step_execution_checklist`
- `/api/admin/admin-evidence-export-preview?source_filter=week_two_deployment_public_beta_readiness`
- `/api/admin/admin-evidence-export-preview?source_filter=week_two_deployment_public_beta_execution_checklist`

## Week 2 Public Beta Scope Recheck Sequence

1. Confirm the beta scope is demo-only and no-real-money.
2. Confirm the first tester cohort uses tester codes only and no private identity/contact map in tracked docs.
3. Confirm the invite batch remains HOLD until a separate founder invite-release decision is recorded.
4. Confirm the public URL remains label-only in tracked docs unless founder-controlled smoke evidence exists outside chat.
5. Confirm consent acknowledgement, privacy notice, terms summary, withdrawal, export, correction, deletion, use restriction, and offboarding paths are ready for review.
6. Confirm support queue, support SLA, known issues, incident response, rollback drill, and first-response triage are ready for review.
7. Confirm finance/contract walkthrough language stays demo-only: no payment charges, loan approvals, escrow releases, signed contract authority, repayment routing, stablecoin settlement, token collateral, XPR signature, provider commitment, or legal decision.
8. Confirm public beta launch, tester invites, public URL sharing, external sends, deploy settings, Supabase redirect changes, public file replacement, production release, and live actions remain blocked.
9. Record one safe founder report-back block with no secrets, no public URL, no invite recipient data, no raw tester data, and no legal/provider conclusion.

## Current Hold State Matrix

| Area | Required Local Review | Default State | Blocked Live Action |
|---|---|---|---|
| tester scope | role coverage, tester-code count, no sensitive/private tracked identity map | HOLD_FOR_TESTER_SCOPE_REVIEW | tester invites |
| public URL | URL label, smoke evidence id, deployed commit placeholder, no raw URL in tracked docs | HOLD_FOR_PUBLIC_URL_SMOKE_REVIEW | public URL share |
| consent/privacy | consent, privacy, data requests, offboarding, terms summary | HOLD_FOR_CONSENT_PRIVACY_REVIEW | sensitive data collection |
| support/known issues | support queue, SLA, known issue list, escalation, incident response | HOLD_FOR_SUPPORT_KNOWN_ISSUES_REVIEW | external support send |
| finance/contract safety | disabled real-money checks and demo-only walkthrough language | HOLD_FOR_FINANCE_CONTRACT_BOUNDARY_REVIEW | payment, loan, escrow, repayment, stablecoin, token collateral, XPR |
| release decision | launch readiness and launch decision record | HOLD_FOR_LAUNCH_DECISION_REVIEW | public beta flip |

## Founder Safe Report-Back

Use this template only for local founder review. Do not paste secrets, real public URLs, invite recipient names/contact data, raw tester notes, private identity data, service-role keys, payment data, wallet data, legal advice, provider responses, or production environment values.

```text
Public Beta Scope Week 2 Recheck
Scope: local prep only
tester_scope:
cohort_size:
invite_batch_status:
public_url_status:
consent_privacy_status:
support_known_issues_status:
demo_only_boundary_status:
finance_contract_safety_status:
public_beta_flip_requested: no
tester_invite_requested: no
public_url_share_requested: no
deploy_or_redirect_change_requested: no
external_send_requested: no
real_payment_or_loan_or_escrow_action_taken: no
repayment_or_stablecoin_or_token_collateral_action_taken: no
token_or_xpr_or_fio_action_taken: no
legal_or_provider_conclusion_made: no
decision:
Live-risk actions taken: none
```

## Decision State Matrix

| State | Meaning | Next Safe Action |
|---|---|---|
| READY_FOR_FOUNDER_BETA_SCOPE_REVIEW | Local docs and validators are ready for founder scope reading | Founder reviews scope only |
| READY_FOR_REVISION | Founder wants wording, scope, or support prep changed locally | Codex edits local docs only |
| HOLD_FOR_TESTER_SCOPE_REVIEW | Tester role/count/code scope is incomplete or unclear | Update tester-code-only scope docs |
| HOLD_FOR_PUBLIC_URL_SMOKE_REVIEW | Hosted URL evidence is absent, stale, wrong environment, or not founder-controlled | Keep URL label-only and wait for founder-controlled smoke evidence |
| HOLD_FOR_CONSENT_PRIVACY_REVIEW | Consent, privacy, terms, data requests, or offboarding are incomplete | Update local review docs only |
| HOLD_FOR_SUPPORT_KNOWN_ISSUES_REVIEW | Support queue, SLA, known issues, escalation, or incident response is incomplete | Update support/known issue docs only |
| HOLD_FOR_FINANCE_CONTRACT_BOUNDARY_REVIEW | Demo-only finance/contract boundary is unclear | Tighten local no-real-money wording |
| BLOCKED_FOR_PUBLIC_BETA_FLIP | Request asks Codex to launch beta or share beta URL | Stop for founder-controlled external action |
| BLOCKED_FOR_LIVE_OR_EXTERNAL_ACTION | Request asks for deploy, invite send, external send, live Supabase, legal/provider, money, token, XPR, FIO, production, or public file action | Stop for founder/legal/provider/live approval |

`PUBLIC_BETA_SCOPE_DECISION_RECORDED` is an internal scope-review marker only. It is not approval to launch beta, share a URL, send invites, deploy, change Supabase redirects, publish public files, collect sensitive data, or enable money/Web3 flows.

## Public URL And Invite Boundary

- Tracked docs may use only `public_beta_url_label`, `url_id`, `smoke_evidence_id`, `tester_batch_id`, and tester codes.
- Do not store real public beta URLs in tracked docs before founder-controlled smoke evidence.
- Do not store invite recipient names, contact data, private tester identity maps, or consent screenshots in tracked docs.
- Tester invite release remains separate from scope review.
- Public URL share remains separate from scope review.
- Public beta launch remains separate from scope review.

## Consent Privacy And Support Boundary

- Consent acknowledgement, privacy notice, terms summary, data deletion, data export, data correction, use restriction, consent withdrawal, and tester offboarding must remain reviewable before any tester wave.
- Support queue, support SLA, known issues, first-response triage, issue escalation, incident response, rollback drill, and post-session follow-up must remain local/redacted.
- Raw tester notes, private contact data, payment data, wallet data, identity documents, screenshots with private data, and sensitive support excerpts stay out of tracked docs.

## Finance Contract Safety Boundary

The beta may only exercise no-real-money flows. Reviewers can inspect project records, milestone records, evidence, dispute packets, contractor verification language, and working-capital readiness language. Codex must stop before payment charges, loan decisions, escrow release, repayment routing, stablecoin settlement, token collateral, token custody, XPR signatures, FIO registration, provider submissions, legal conclusions, signed contract authority, public launch, production release, or live actions.

## Codex Scope

Codex may:

- update local docs and validators;
- run local checks;
- commit scoped local-only files;
- summarize founder-safe report-back fields.

Codex must stop before:

- deployment or external account login;
- public beta URL sharing;
- tester invite sending;
- Supabase redirect or live database changes;
- public website replacement;
- external email/social/deck/PDF publication;
- real payments, loans, escrow, repayment, stablecoin, token collateral, token custody, XPR, or FIO actions;
- legal/provider conclusions or commitments;
- production release.

## Required Checks

- `npm run check:week-two-public-beta-scope-recheck`
- `npm run check:public-beta-review-packet`
- `npm run check:public-beta-tester-quickstart`
- `npm run check:public-beta-tester-faq`
- `npm run check:public-beta-consent-ack`
- `npm run check:public-beta-privacy-notice`
- `npm run check:public-beta-support-queue`
- `npm run check:public-beta-known-issues`
- `npm run check:public-beta-launch-readiness`
- `npm run check:public-beta-launch-decision-record`
- `npm run check:public-beta-invite-release-decision-packet`
- `npm run check:public-beta-first-cohort-launch-packet`
- `npm run check:week-two-deployment-public-beta-recheck`
- `npm run check:smartcontractor`
- `npm run check:auth`

## Acceptance Check

This recheck is accepted only if the founder can review public beta scope locally with no-secret, no-public-URL-share, no-tester-invite, no-sensitive-tester-data, no-live-Supabase, no-deploy, no-public-file-replacement, no-real-money, no-loan, no-escrow, no-repayment, no-stablecoin, no-token-collateral, no-XPR-signature, no-FIO-registration, no-legal/provider, no-public-launch, no-production, and no-live-action boundaries visible in one place.
