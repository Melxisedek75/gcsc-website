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
  "audit_event_required": true,
  "local_only": true,
  "live_action_status": "BLOCKED_FOR_LIVE"
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
- `audit_event_required`;
- `local_only`;
- `live_action_status`.

## Workflow Catalog Entry Contract

Catalog entries describe supported local-only workflows; they are not execution approvals.

Every workflow catalog entry must keep these fields visible before UI or recommendation generation treats a workflow as available:

- `catalog.agent`;
- `catalog.workflow`;
- `catalog.version`;
- `catalog.entity_type`;
- `catalog.mode`;
- `catalog.required_permission`;
- `catalog.required_human_review`;
- `catalog.audit_event_required`;
- `catalog.local_only`;
- `catalog.live_action_status`;
- `catalog.supported_facts`;
- `catalog.required_input_refs`;
- `catalog.blocked_actions`.

Example catalog entry:

```json
{
  "catalog.agent": "risk_assessment_agent",
  "catalog.workflow": "starter_loan_review",
  "catalog.version": "draft-2026-05-06",
  "catalog.entity_type": "contractor_loan",
  "catalog.mode": "local_structured_recommendation_only",
  "catalog.required_permission": "loan_review_prepare",
  "catalog.required_human_review": true,
  "catalog.audit_event_required": true,
  "catalog.local_only": true,
  "catalog.live_action_status": "BLOCKED_FOR_LIVE",
  "catalog.supported_facts": ["principal_usd", "risk_score", "verification_status"],
  "catalog.required_input_refs": ["contractor", "loan", "verification_checks"],
  "catalog.blocked_actions": ["approve_real_loan", "release_escrow", "lock_token_collateral"]
}
```

The catalog contract exists so the backend, Admin UI, docs, and smoke tests agree on identity, mode, permission, review, audit, local-only, live-gate, fact, input-reference, and blocked-action boundaries before any AI recommendation can be interpreted by a human reviewer.

## Workflow Catalog Response Contract

Catalog responses are evidence packets for review and UI alignment; they are not live execution packets.

The workflow catalog endpoint response must keep these top-level fields visible:

- `response.request_id`;
- `response.generated_at`;
- `response.status`;
- `response.supported_workflows`;
- `response.safety_boundaries`.

Example response shell:

```json
{
  "response.request_id": "founder-demo-request-id",
  "response.generated_at": "2026-05-15T00:00:00.000Z",
  "response.status": "local_only",
  "response.supported_workflows": ["starter_loan_review", "verification_triage"],
  "response.safety_boundaries": [
    "AI recommendations are draft support only.",
    "Deterministic rules and humans approve.",
    "No real loan, escrow, repayment, stablecoin, token collateral, money movement, legal, or provider action is enabled."
  ]
}
```

This response contract gives founder/tester screenshots a traceable request id, timestamp, local-only status, supported workflow list, and visible safety boundaries before any workflow card, UI summary, or recommendation draft is reviewed.

## Workflow Catalog Error Response Contract

Catalog error responses are local discovery failure evidence only; they must not return supported workflow menus or attempt live audit writes.

The workflow catalog error response must keep these top-level fields visible:

- `catalog_error.request_id`;
- `catalog_error.error`;
- `catalog_error.details`;
- `catalog_error.safe_scope`;
- `catalog_error.no_supported_workflows`;
- `catalog_error.no_workflow_execution_attempted`.

Example error shell:

```json
{
  "catalog_error.request_id": "founder-demo-request-id",
  "catalog_error.error": "catalog_unavailable",
  "catalog_error.details": [
    "workflow catalog could not be loaded from local configuration"
  ],
  "catalog_error.safe_scope": [
    "The request failed local workflow discovery.",
    "No supported workflow menu is returned.",
    "No recommendation draft, live audit write, payment, loan, escrow, collateral, provider, or legal action is attempted."
  ],
  "catalog_error.no_supported_workflows": true,
  "catalog_error.no_workflow_execution_attempted": true
}
```

This error contract lets founder/tester reports distinguish local catalog discovery failures from valid workflow menus and confirms no AI workflow can be interpreted, recommended, executed, audited live, or treated as review evidence from a failed catalog response.

## Recommendation Response Contract

Recommendation responses are local draft evidence only; they are not approval, funding, escrow, repayment, collateral, provider, or legal execution packets.

The recommendation endpoint response must keep these top-level fields visible:

- `recommendation_response.request_id`;
- `recommendation_response.generated_at`;
- `recommendation_response.recommendation`;
- `recommendation_response.audit_event_attempted`;
- `recommendation_response.safe_scope`.

Example response shell:

```json
{
  "recommendation_response.request_id": "founder-demo-request-id",
  "recommendation_response.generated_at": "2026-05-15T00:00:00.000Z",
  "recommendation_response.recommendation": {
    "workflow": "starter_loan_review",
    "required_human_review": true,
    "local_only": true,
    "live_action_status": "BLOCKED_FOR_LIVE"
  },
  "recommendation_response.audit_event_attempted": false,
  "recommendation_response.safe_scope": [
    "This endpoint creates a local structured recommendation only.",
    "It does not approve real loans, fund contractors, route repayment, release escrow, settle stablecoins, lock token collateral, or make legal decisions.",
    "Human founder/admin/legal/provider review remains required before any live action."
  ]
}
```

This response contract lets founder/tester reports tie a draft recommendation to a request id, generated timestamp, audit-attempt state, and safe-scope warning before any admin reads the recommendation details.

## Recommendation Error Response Contract

Recommendation error responses are local validation evidence only; they must not return recommendation drafts or attempt live audit writes.

The recommendation endpoint error response must keep these top-level fields visible:

- `recommendation_error.request_id`;
- `recommendation_error.error`;
- `recommendation_error.details`;
- `recommendation_error.safe_scope`;
- `recommendation_error.no_recommendation_draft`;
- `recommendation_error.audit_event_attempted`.

Example error shell:

```json
{
  "recommendation_error.request_id": "founder-demo-request-id",
  "recommendation_error.error": "validation_error",
  "recommendation_error.details": [
    "workflow must be starter_loan_review, verification_triage, payment_exception_review, dispute_evidence_summary, draft_document_packet, or job_match_ranking"
  ],
  "recommendation_error.safe_scope": [
    "The request failed local validation.",
    "No recommendation draft is returned.",
    "No live audit write, payment, loan, escrow, collateral, provider, or legal action is attempted."
  ],
  "recommendation_error.no_recommendation_draft": true,
  "recommendation_error.audit_event_attempted": false
}
```

This error contract lets founder/tester reports distinguish local validation failures from draft recommendations and confirms invalid requests cannot create recommendation output, audit writes, live finance actions, or legal/provider actions.

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
- `local_only`;
- `live_action_status`;
- `admin_decision`;
- `created_at`;
- `reviewed_at`;

## Local Recommendation Endpoint

The local implementation currently supports six draft-only recommendation workflows and one catalog-only review packet:

- `GET /api/admin/ai-agents/workflows`
- `POST /api/admin/ai-agents/recommendations`
- supported workflows: `starter_loan_review`, `verification_triage`, `payment_exception_review`, `dispute_evidence_summary`, `draft_document_packet`, `job_match_ranking`
- catalog-only workflow: `repayment_waterfall_review_packet`
- supported entity types: `contractor_loan`, `verification_check`, `payment_exception`, `dispute`, `document_packet`, `job_match`
- permission boundary: `loan_review_prepare`
- mode: local structured recommendation only

The workflow catalog endpoint returns the supported local agent workflows, required facts, blocked actions, and live-action status before an admin or founder generates a recommendation. It is read-only and exists so UI, docs, and smoke tests do not drift from backend support.

The endpoint returns the shared agent envelope for `risk_assessment_agent`, `compliance_agent`, `treasury_agent`, `dispute_triage_agent`, `document_generation_agent`, and `contractor_matching_agent`, including `required_human_review: true`, `blocked_actions`, `audit_event_required`, and `live_action_status: BLOCKED_FOR_LIVE`.

For `starter_loan_review`, it may inspect non-secret request facts such as `principal_usd`, `risk_score`, `verification_status`, `has_signed_project_contract`, and `has_repayment_waterfall`.

For catalog-only `repayment_waterfall_review_packet`, it exposes `local_structured_review_packet_only` metadata for the local repayment waterfall fixture/review packet path. It may document non-secret review facts such as `fixture_count`, `covered_fixture_states`, `review_packet_status`, `deployment_status`, `pass_fail_status`, and `local_only`; it requires local input references `repayment_waterfall_fixtures`, `endpoint_smoke`, `review_packet`, `external_review_gates`, and `blocked_live_actions`. It is not accepted by `POST /api/admin/ai-agents/recommendations`.

For `verification_triage`, it may inspect non-secret request facts such as `license_status`, `insurance_status`, and `business_identity_status`.

For `payment_exception_review`, it may inspect non-secret request facts such as `payment_status`, `webhook_status`, and `ledger_status`.

For `dispute_evidence_summary`, it may inspect non-secret request facts such as `dispute_status`, `evidence_status`, `milestone_status`, and `peer_review_status`.

For `draft_document_packet`, it may inspect non-secret request facts such as `contract_status`, `milestone_status`, `scope_status`, `attorney_review_status`, and `signature_status`.

For `job_match_ranking`, it may inspect non-secret request facts such as `job_status`, `contractor_status`, `geo_match_status`, `license_match_status`, and `availability_status`.

It must not approve, fund, route repayment, release escrow, settle stablecoins, lock token collateral, make provider API calls, approve contractor verification, override license checks, activate provider accounts, issue refunds, change payout destinations, execute treasury actions, decide disputes, assign final liability, send legal documents, bind contracts, request signatures, file lien waivers, publish real leads, assign contractors, start escrow, charge lead tokens, move money, or make legal decisions.

`npm run check:ai-agent-recommendations` runs a local smoke test for this endpoint with `SMARTCONTRACTOR_AI_AGENT_AUDIT_MODE=skip`, so CI can verify the recommendation envelope, request-id echo, validation errors, `starter_loan_review` reasons, catalog-only `repayment_waterfall_review_packet` metadata, `verification_triage` reasons, `payment_exception_review` reasons, `dispute_evidence_summary` reasons, `draft_document_packet` reasons, `job_match_ranking` reasons, and blocked-live-money/provider/compliance/treasury/dispute/legal-document/matching gates without writing to live Supabase audit tables.

## Build Order

1. Add local JSON recommendation generator for one workflow only: `starter_loan_review`. DONE locally as `POST /api/admin/ai-agents/recommendations`.
2. Add read-only local workflow catalog for supported agent workflows. DONE locally as `GET /api/admin/ai-agents/workflows`.
3. Add local smoke coverage that proves the endpoint stays local-only and skips live Supabase audit writes during tests. DONE locally as `npm run check:ai-agent-recommendations`.
4. Add local JSON recommendation generator for `verification_triage`. DONE locally as `POST /api/admin/ai-agents/recommendations`.
5. Add local JSON recommendation generator for `payment_exception_review`. DONE locally as `POST /api/admin/ai-agents/recommendations`.
6. Add local JSON recommendation generator for `dispute_evidence_summary`. DONE locally as `POST /api/admin/ai-agents/recommendations`.
7. Add local JSON recommendation generator for `draft_document_packet`. DONE locally as `POST /api/admin/ai-agents/recommendations`.
8. Add local JSON recommendation generator for `job_match_ranking`. DONE locally as `POST /api/admin/ai-agents/recommendations`.
9. Add catalog-only review packet entry for `repayment_waterfall_review_packet`. DONE locally as `GET /api/admin/ai-agents/workflows`.
10. Persist recommendation drafts in database only after RLS/admin guards are strict.
11. Write audit events when recommendations are created and when admins review them.
12. Add admin console read-only queue for AI recommendations.

## Non-Negotiable Boundaries

- AI recommends; deterministic rules and humans approve.
- No real payment, loan, escrow, refund, payout, token collateral, or liquidation action can be executed by an agent.
- No live Supabase migration or production policy change without explicit founder approval.
- No raw secrets, private keys, seed phrases, service-role keys, or external account passwords can be used by an agent.
- No legal, lending, insurance, escrow, or compliance conclusion is final until reviewed by the right human reviewer.
