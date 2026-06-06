# SmartContractor Week 2 Investor/Founder Package Recheck

Status: LOCAL_RECHECK_ONLY.

Date: 2026-06-06 PT.

Purpose: give the founder one local-only reading order and report-back block for investor/founder package claim safety before any investor outreach, grant submission, partner/provider outreach, attorney outreach, deck/PDF/email/social publication, public URL share, public claim approval, production action, or external send.

This recheck does not approve investor outreach, grant submission, partner/provider outreach, attorney outreach, external sends, recipient contact storage, deck/PDF/email/social publication, public URL sharing, public claim approval, public website replacement, public whitepaper publication, fundraising terms, securities conclusions, legal/provider conclusions, provider commitments, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, token custody, XPR signatures, FIO registration, public launch, or production.

## Source Documents And Surfaces

Read in this order:

1. `docs/smartcontractor-investor-founder-package.md`
2. `docs/smartcontractor-founder-one-pager.md`
3. `docs/smartcontractor-demo-script.md`
4. `docs/gcsc-real-status-audit-2026-05-11.md`
5. `docs/gcsc-v1-2-core-architecture-package.md`
6. `docs/gcsc-contract-backed-loan-blueprint.md`
7. `docs/whitepaper-v1-2-claim-review-matrix.md`
8. `docs/whitepaper-v1-2-legal-provider-review-prep.md`
9. `docs/smartcontractor-public-beta-review-packet.md`
10. `docs/smartcontractor-deployment-decision-prep.md`
11. `docs/smartcontractor-week-two-legal-provider-recheck-2026-06-06.md`

Local Admin surfaces:

- `/api/admin/investor-founder-package-readiness`
- `/api/admin/week-two-investor-founder-package-alignment`
- `/api/admin/week-two-investor-founder-package-execution-checklist`
- `/api/admin/admin-evidence-export-preview?source_filter=investor_founder_package_readiness`
- `/api/admin/admin-evidence-export-preview?source_filter=week_two_investor_founder_package_alignment`
- `/api/admin/admin-evidence-export-preview?source_filter=week_two_investor_founder_package_execution_checklist`

## Week 2 Investor/Founder Recheck Sequence

1. Confirm the target audience is one of `investor`, `grant`, `partner`, `provider`, `attorney`, `founder-forwarded`, or `hold`.
2. Confirm the package is still `INTERNAL_PACKAGE_ONLY` until a current audience-specific approval stamp exists.
3. Confirm evidence freshness: source commit, latest check run, evidence date, evidence owner, and stale-metric handling.
4. Confirm claim-source binding for every external-facing claim: claim id, audience, packet version, source file, source commit, evidence id, latest check run, redaction status, owner, approval stamp status, and blocked next action.
5. Confirm live-finance claims are absent or clearly blocked: no real payments, no real loans, no real escrow, no repayment routing, no stablecoin settlement, no token collateral, no production payment readiness.
6. Confirm Web3/token claims are absent or clearly future/review-required: no token return, no token sale, no token collateral live, no XPR/FIO action, no Metallicus/provider partnership claim.
7. Confirm AI authority claims are absent or clearly bounded: no autonomous loan approval, no legal/provider decisions, no production underwriting decision by AI.
8. Confirm recipient context stays private: no names, emails, phone numbers, addresses, private investor notes, provider contacts, attorney details, or private follow-up content in tracked docs.
9. Confirm response readiness is founder-drafting only and never send approval.
10. Confirm any Share/Revise/Hold outcome remains internal readiness only unless the separate `INVESTOR_PACKET_SEND_ACTION_RECORDED` phrase and required non-secret fields are recorded by the founder.

## Current Hold State Matrix

| Area | Current local state | Required founder-controlled evidence | Default if missing |
| --- | --- | --- | --- |
| Audience packet | Internal package exists | one audience, packet version, allowed artifacts, removed artifacts, owner | HOLD_FOR_AUDIENCE_REVIEW |
| Evidence freshness | Package has prior local evidence | current source commit, latest check run, evidence date, stale metric handling | HOLD_FOR_EVIDENCE_REFRESH |
| Claim-source binding | Claim boundaries exist | claim id, source file, source commit, evidence id, redaction status, blocked action | HOLD_FOR_CURRENT_CLAIM_SOURCE_BINDING |
| Redaction | Rules exist | redaction owner, private-data status, blocked recipient fields removed | HOLD_FOR_REDACTION_REVIEW |
| Live-finance claims | Must stay blocked | no-real-money wording, legal/provider references, public beta scope | HOLD_FOR_LIVE_FINANCE_CLAIM_REVIEW |
| Web3/token claims | Must stay future/review-required | no token/yield/collateral/live-XPR/FIO/public partnership claims | HOLD_FOR_WEB3_TOKEN_CLAIM_REVIEW |
| AI authority claims | Must stay bounded | AI assists/recommends only, human/admin/provider/legal decisions remain separate | HOLD_FOR_AI_AUTHORITY_CLAIM_REVIEW |
| External send | Not approved | standalone founder phrase plus required non-secret fields | BLOCKED_FOR_EXTERNAL_SEND |

## Founder Safe Report-Back

Use this exact shape after local review. Do not paste recipient private data, contact details, investor notes, attorney/provider details, secrets, URLs, approval text, raw responses, payment data, wallet data, or external-send instructions.

```text
Investor/Founder Week 2 Recheck
Scope: local prep only
audience:
packet_version:
source_commit_recorded:
latest_check_run_recorded:
evidence_date_recorded:
redaction_status:
claim_source_binding_status:
live_finance_claim_status:
web3_token_claim_status:
ai_authority_claim_status:
recipient_private_data_in_tracked_docs: no
external_send_requested: no
deck_pdf_email_social_publication_requested: no
public_url_share_requested: no
legal_or_provider_conclusion_made: no
provider_commitment_made: no
real_payment_or_loan_or_escrow_action_taken: no
token_or_xpr_or_fio_action_taken: no
decision:
Live-risk actions taken: none
```

## Decision State Matrix

Use `READY_FOR_FOUNDER_PACKET_DRAFT` only when the audience, packet version, source commit, latest check run, evidence date, redaction status, claim-source binding, stale metric handling, recipient privacy boundary, and blocked next action are recorded.

Use `READY_FOR_REVISION` when a specific owner can revise stale evidence, unsafe wording, missing redaction, missing claim-source binding, audience mismatch, or unsupported metric locally.

Use `HOLD_FOR_CLAIM_REVIEW` when live-finance, Web3/token, AI-authority, provider, legal, public launch, traction, revenue, user, loan-volume, escrow-volume, token, or production-readiness claims are unclear.

Use `BLOCKED_FOR_EXTERNAL_SEND` when the next step is investor outreach, grant submission, partner/provider outreach, attorney outreach, recipient follow-up, deck/PDF/email/social publication, public URL sharing, external upload, public claim approval, or any external channel action.

Use `BLOCKED_FOR_LIVE_OR_LEGAL_ACTION` when the next step needs legal/provider conclusion, provider commitment, fundraising term, securities conclusion, real payment, real loan, real escrow, repayment routing, stablecoin settlement, token collateral, token custody, XPR signature, FIO registration, live Supabase change, production deploy, public launch, or external account action.

## Claim Safety Boundary

Allowed current claims:

- demo-ready local MVP;
- working toward no-real-money public beta;
- contract-backed working-capital concept;
- future provider-reviewed lending, escrow, payment, and verification integrations;
- smart-contract architecture drafted;
- legal/provider review required before live money movement.

Blocked unless separately reviewed and approved:

- active users, revenue, loan volume, escrow volume, production payment readiness, live escrow, live lending, guaranteed savings, guaranteed approvals, investment returns, token yield, token appreciation, token collateral live, provider partnership secured, Metallicus approval, XPR live value transfer, FIO registration, SEC approval, bank-grade compliance complete, or AI automatic loan approval.

## Codex Scope

Codex may update local docs, local validators, local review packets, Admin readiness checklists, and safe report-back templates.

Codex must stop before investor outreach, grant submission, partner/provider outreach, attorney outreach, recipient follow-up, external sends, deck/PDF/email/social publication, public URL sharing, public claim approval, public website replacement, public whitepaper publication, fundraising terms, securities conclusions, legal/provider conclusions, provider commitments, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, token custody, XPR signatures, FIO registration, live Supabase writes, external account login, paid service setup, public launch, production, or destructive actions.

## Required Checks

Run from `C:\gcsc\construction-ai`:

```powershell
npm run check:week-two-investor-founder-package-recheck
npm run check:investor-founder-package
npm run check:founder-one-pager
npm run check:demo-script
npm run check:real-status-audit
npm run check:deployment-decision-prep
npm run check:whitepaper-v1-2-claim-review
npm run check:smartcontractor
npm run check:auth
```

## Acceptance Check

This recheck passes only when the founder has one local-only investor/founder package reading order, a safe no-secret/no-recipient-private-data report-back block, READY/REVISION/HOLD/BLOCKED states, audience packet, evidence freshness, claim-source binding, redaction, live-finance claim, Web3/token claim, AI-authority claim, recipient privacy, and external-send boundaries, plus explicit no-investor-outreach, no-grant-submission, no-provider-outreach, no-attorney-outreach, no-external-send, no-deck/PDF/email/social-publication, no-public-URL-share, no-public-claim-approval, no-public-file-replacement, no-public-whitepaper-publication, no-legal/provider-conclusion, no-provider-commitment, no-real-payment, no-real-loan, no-real-escrow, no-repayment-routing, no-stablecoin-settlement, no-token-collateral, no-token-custody, no-XPR-signature, no-FIO-registration, no-public-launch, and no-production boundaries.
