# SmartContractor AI Agent Workflows

Date: 2026-05-06

Status: local design scaffold only. No live automation, external API calls, legal decisions, real payments, real loans, escrow release, or token collateral actions are enabled by this document.

## Purpose

SmartContractor agents should help admins, homeowners, and contractors make faster decisions without turning critical construction finance decisions into a black box.

The first implementation target is a local, reviewable workflow layer:

- deterministic inputs from SmartContractor records;
- agent recommendation output as structured JSON;
- audit event for every recommendation;
- admin or founder review before money movement, legal/compliance decisions, loan approval, escrow release, token collateral lock, or public user impact.

## Shared Agent Contract

Every agent workflow must use the same envelope:

```json
{
  "agent": "risk_assessment_agent",
  "workflow": "starter_loan_review",
  "version": "draft-2026-05-06",
  "entity_type": "contractor_loan",
  "entity_id": "local-demo-id",
  "input_refs": ["contractor", "job", "loan", "verification_checks", "audit_events"],
  "recommendation": "manual_review",
  "confidence": 0.72,
  "reasons": ["verified business data missing", "starter amount is within MVP cap"],
  "required_human_review": true,
  "blocked_actions": ["approve_real_loan", "release_escrow", "lock_token_collateral"],
  "audit_event_required": true
}
```

Required fields:

- `agent`;
- `workflow`;
- `version`;
- `entity_type`;
- `entity_id`;
- `input_refs`;
- `recommendation`;
- `confidence`;
- `reasons`;
- `required_human_review`;
- `blocked_actions`;
- `audit_event_required`.

## Agent Workflows

### Contractor Matching Agent

Workflow: `job_match_ranking`

Inputs:

- job category, city/state, budget, timeline, milestone count;
- contractor trades, service area, rating, response time, completed jobs;
- verification status and dispute history.

Output:

- ranked contractor candidates;
- match reasons;
- missing verification warnings;
- recommendation to invite, hold, or manual review.

Safety gate:

- agent may recommend matches only;
- agent must not auto-award jobs or charge lead fees.

### Risk Assessment Agent

Workflow: `starter_loan_review`

Inputs:

- contractor profile and business identity status;
- license and insurance checks;
- requested amount, APR, purpose, linked job, repayment history;
- dispute rate, rating, prior milestone completion, token collateral draft fields.

Output:

- risk tier;
- starter loan cap recommendation;
- repayment waterfall warning;
- missing documents;
- manual review reason.

Safety gate:

- agent must not approve real loans;
- agent must not trigger repayment, collateral lock, liquidation, or collections;
- legal and founder review remain required before real lending.

### Compliance Agent

Workflow: `verification_triage`

Inputs:

- identity, business, license, insurance, wallet, and bank verification checks;
- provider status and expiration dates;
- uploaded document metadata only.

Output:

- pass, missing_info, expired, mismatch, or manual_review recommendation;
- document checklist;
- provider follow-up notes.

Safety gate:

- agent must not make final legal compliance decisions;
- agent must not store or send raw sensitive documents to an LLM by default.

### Treasury Agent

Workflow: `payment_exception_review`

Inputs:

- payment intents, payment events, provider webhook status;
- milestone, repayment, fee, refund, and audit ledger records;
- admin review notes.

Output:

- payment exception category;
- suggested reconciliation step;
- recommended provider support packet.

Safety gate:

- agent must not move funds, issue refunds, release escrow, change payout destination, or execute treasury actions.

### Dispute Triage Agent

Workflow: `dispute_evidence_summary`

Inputs:

- dispute reason and status;
- evidence metadata, notes, milestone, scope, change order references;
- peer review records and inspection notes.

Output:

- evidence summary;
- missing evidence checklist;
- suggested peer reviewer type;
- payment hold risk note.

Safety gate:

- agent must not make final dispute decisions;
- agent must not release or refund milestone funds.

### Document Generation Agent

Workflow: `draft_document_packet`

Inputs:

- project contract fields, milestones, parties, scope, change orders, lien waiver status;
- approved templates and jurisdiction notes.

Output:

- draft checklist or document packet outline;
- missing attorney-review flags;
- required signatures.

Safety gate:

- generated text is draft support only and not legal advice;
- attorney review is required before public legal templates are used.

## Local API Shape Draft

Future local endpoints should stay behind admin/auth gates before public launch:

- `POST /api/ai-agents/recommendations`
- `GET /api/ai-agents/recommendations`
- `POST /api/ai-agents/recommendations/:id/admin-decision`

Minimum persistence fields:

- `id`;
- `agent`;
- `workflow`;
- `version`;
- `entity_type`;
- `entity_id`;
- `input_refs`;
- `recommendation`;
- `confidence`;
- `reasons`;
- `required_human_review`;
- `blocked_actions`;
- `admin_decision`;
- `created_at`;
- `reviewed_at`;

## Local Recommendation Endpoint

The local implementation currently supports five draft-only workflows:

- `GET /api/admin/ai-agents/workflows`
- `POST /api/admin/ai-agents/recommendations`
- supported workflows: `starter_loan_review`, `verification_triage`, `payment_exception_review`, `dispute_evidence_summary`, `draft_document_packet`
- supported entity types: `contractor_loan`, `verification_check`, `payment_exception`, `dispute`, `document_packet`
- permission boundary: `loan_review_prepare`
- mode: local structured recommendation only

The workflow catalog endpoint returns the supported local agent workflows, required facts, blocked actions, and live-action status before an admin or founder generates a recommendation. It is read-only and exists so UI, docs, and smoke tests do not drift from backend support.

The endpoint returns the shared agent envelope for `risk_assessment_agent`, `compliance_agent`, `treasury_agent`, `dispute_triage_agent`, and `document_generation_agent`, including `required_human_review: true`, `blocked_actions`, `audit_event_required`, and `live_action_status: BLOCKED_FOR_LIVE`.

For `starter_loan_review`, it may inspect non-secret request facts such as `principal_usd`, `risk_score`, `verification_status`, `has_signed_project_contract`, and `has_repayment_waterfall`.

For `verification_triage`, it may inspect non-secret request facts such as `license_status`, `insurance_status`, and `business_identity_status`.

For `payment_exception_review`, it may inspect non-secret request facts such as `payment_status`, `webhook_status`, and `ledger_status`.

For `dispute_evidence_summary`, it may inspect non-secret request facts such as `dispute_status`, `evidence_status`, `milestone_status`, and `peer_review_status`.

For `draft_document_packet`, it may inspect non-secret request facts such as `contract_status`, `milestone_status`, `scope_status`, `attorney_review_status`, and `signature_status`.

It must not approve, fund, repay, release escrow, settle stablecoins, lock token collateral, approve contractor verification, override license checks, activate provider accounts, issue refunds, change payout destinations, execute treasury actions, decide disputes, assign final liability, send legal documents, bind contracts, request signatures, file lien waivers, move money, or make legal decisions.

`npm run check:ai-agent-recommendations` runs a local smoke test for this endpoint with `SMARTCONTRACTOR_AI_AGENT_AUDIT_MODE=skip`, so CI can verify the recommendation envelope, request-id echo, validation errors, `starter_loan_review` reasons, `verification_triage` reasons, `payment_exception_review` reasons, `dispute_evidence_summary` reasons, `draft_document_packet` reasons, and blocked-live-money/provider/compliance/treasury/dispute/legal-document gates without writing to live Supabase audit tables.

## Build Order

1. Add local JSON recommendation generator for one workflow only: `starter_loan_review`. DONE locally as `POST /api/admin/ai-agents/recommendations`.
2. Add read-only local workflow catalog for supported agent workflows. DONE locally as `GET /api/admin/ai-agents/workflows`.
3. Add local smoke coverage that proves the endpoint stays local-only and skips live Supabase audit writes during tests. DONE locally as `npm run check:ai-agent-recommendations`.
4. Add local JSON recommendation generator for `verification_triage`. DONE locally as `POST /api/admin/ai-agents/recommendations`.
5. Add local JSON recommendation generator for `payment_exception_review`. DONE locally as `POST /api/admin/ai-agents/recommendations`.
6. Add local JSON recommendation generator for `dispute_evidence_summary`. DONE locally as `POST /api/admin/ai-agents/recommendations`.
7. Add local JSON recommendation generator for `draft_document_packet`. DONE locally as `POST /api/admin/ai-agents/recommendations`.
8. Persist recommendation drafts in database only after RLS/admin guards are strict.
9. Write audit events when recommendations are created and when admins review them.
10. Add admin console read-only queue for AI recommendations.
11. Expand to matching.

## Non-Negotiable Boundaries

- AI recommends; deterministic rules and humans approve.
- No real payment, loan, escrow, refund, payout, token collateral, or liquidation action can be executed by an agent.
- No live Supabase migration or production policy change without explicit founder approval.
- No raw secrets, private keys, seed phrases, service-role keys, or external account passwords can be used by an agent.
- No legal, lending, insurance, escrow, or compliance conclusion is final until reviewed by the right human reviewer.
