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

## Build Order

1. Add local JSON recommendation generator for one workflow only: `starter_loan_review`.
2. Persist recommendation drafts in database only after RLS/admin guards are strict.
3. Write audit events when recommendations are created and when admins review them.
4. Add admin console read-only queue for AI recommendations.
5. Expand to matching, compliance, payment exceptions, disputes, and documents.

## Non-Negotiable Boundaries

- AI recommends; deterministic rules and humans approve.
- No real payment, loan, escrow, refund, payout, token collateral, or liquidation action can be executed by an agent.
- No live Supabase migration or production policy change without explicit founder approval.
- No raw secrets, private keys, seed phrases, service-role keys, or external account passwords can be used by an agent.
- No legal, lending, insurance, escrow, or compliance conclusion is final until reviewed by the right human reviewer.
