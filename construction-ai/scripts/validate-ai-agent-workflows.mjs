import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-ai-agent-workflows.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const serverPath = resolve('server.js');
const packagePath = resolve('package.json');
const smokePath = resolve('scripts', 'smoke-ai-agent-recommendations.mjs');
const envPath = resolve('.env.example');

const doc = readFileSync(docPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const server = readFileSync(serverPath, 'utf8');
const packageJson = readFileSync(packagePath, 'utf8');
const smoke = readFileSync(smokePath, 'utf8');
const envExample = readFileSync(envPath, 'utf8');

function fail(message) {
  console.error(`AI agent workflow validation failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function assertIncludes(content, snippet, file) {
  assert(
    content.toLowerCase().includes(snippet.toLowerCase()),
    `${file} must include: ${snippet}`
  );
}

const requiredDocPhrases = [
  'local design scaffold only',
  'Shared Agent Contract',
  'Workflow Catalog Entry Contract',
  'Workflow Catalog Response Contract',
  'Workflow Catalog Error Response Contract',
  'Recommendation Response Contract',
  'Recommendation Error Response Contract',
  'Contractor Matching Agent',
  'Risk Assessment Agent',
  'Compliance Agent',
  'Treasury Agent',
  'Dispute Triage Agent',
  'Document Generation Agent',
  'required_human_review',
  'blocked_actions',
  'audit_event_required',
  '"local_only": true',
  '"live_action_status": "BLOCKED_FOR_LIVE"',
  'AI recommends; deterministic rules and humans approve',
  'No real payment, loan, escrow, refund, payout, token collateral, or liquidation action can be executed by an agent',
  'No live Supabase migration or production policy change without explicit founder approval',
];

for (const phrase of requiredDocPhrases) {
  assertIncludes(doc, phrase, docPath);
}

for (const catalogField of [
  'catalog.agent',
  'catalog.workflow',
  'catalog.version',
  'catalog.entity_type',
  'catalog.mode',
  'catalog.required_permission',
  'catalog.required_human_review',
  'catalog.audit_event_required',
  'catalog.local_only',
  'catalog.live_action_status',
  'catalog.supported_facts',
  'catalog.required_input_refs',
  'catalog.blocked_actions',
]) {
  assertIncludes(doc, catalogField, docPath);
}

assertIncludes(
  doc,
  'Catalog entries describe supported local-only workflows; they are not execution approvals.',
  docPath
);

for (const responseField of [
  'response.request_id',
  'response.generated_at',
  'response.status',
  'response.supported_workflows',
  'response.safety_boundaries',
]) {
  assertIncludes(doc, responseField, docPath);
}

assertIncludes(
  doc,
  'Catalog responses are evidence packets for review and UI alignment; they are not live execution packets.',
  docPath
);

for (const catalogErrorField of [
  'catalog_error.request_id',
  'catalog_error.error',
  'catalog_error.details',
  'catalog_error.safe_scope',
  'catalog_error.no_supported_workflows',
  'catalog_error.no_workflow_execution_attempted',
]) {
  assertIncludes(doc, catalogErrorField, docPath);
}

assertIncludes(
  doc,
  'Catalog error responses are local discovery failure evidence only; they must not return supported workflow menus or attempt live audit writes.',
  docPath
);

for (const responseField of [
  'recommendation_response.request_id',
  'recommendation_response.generated_at',
  'recommendation_response.recommendation',
  'recommendation_response.audit_event_attempted',
  'recommendation_response.safe_scope',
]) {
  assertIncludes(doc, responseField, docPath);
}

assertIncludes(
  doc,
  'Recommendation responses are local draft evidence only; they are not approval, funding, escrow, repayment, collateral, provider, or legal execution packets.',
  docPath
);

for (const errorResponseField of [
  'recommendation_error.request_id',
  'recommendation_error.error',
  'recommendation_error.details',
  'recommendation_error.safe_scope',
  'recommendation_error.no_recommendation_draft',
  'recommendation_error.audit_event_attempted',
]) {
  assertIncludes(doc, errorResponseField, docPath);
}

assertIncludes(
  doc,
  'Recommendation error responses are local validation evidence only; they must not return recommendation drafts or attempt live audit writes.',
  docPath
);

const forbiddenDocPhrases = [
  'agent may approve real loans',
  'agent can release escrow',
  'automatic legal approval',
  'guaranteed approval',
  'guaranteed returns',
  'send raw private documents',
];

for (const phrase of forbiddenDocPhrases) {
  assert(
    !doc.toLowerCase().includes(phrase.toLowerCase()),
    `${docPath} contains forbidden phrase: ${phrase}`
  );
}

for (const workflow of [
  'job_match_ranking',
  'repayment_waterfall_review_packet',
  'starter_loan_review',
  'verification_triage',
  'payment_exception_review',
  'dispute_evidence_summary',
  'draft_document_packet',
]) {
  assertIncludes(doc, workflow, docPath);
}

for (const requiredField of [
  '- `local_only`;',
  '- `live_action_status`;',
]) {
  assertIncludes(doc, requiredField, docPath);
}

assertIncludes(backlog, 'AI agent workflow scaffold', backlogPath);
assertIncludes(backlog, 'check:ai-agent-workflows', backlogPath);
assertIncludes(backlog, 'AI starter loan recommendation smoke test', backlogPath);
assertIncludes(backlog, 'check:ai-agent-recommendations', backlogPath);
assertIncludes(context, 'AI agent workflow scaffold', contextPath);
assertIncludes(context, 'check:ai-agent-workflows', contextPath);
assertIncludes(context, 'check:ai-agent-recommendations', contextPath);
assertIncludes(server, "app.get('/api/admin/ai-agents/workflows'", serverPath);
assertIncludes(server, 'buildAiAgentWorkflowCatalog', serverPath);
assertIncludes(server, 'function buildAiWorkflowCatalogErrorResponse', serverPath);
assertIncludes(server, 'SMARTCONTRACTOR_AI_WORKFLOW_CATALOG_ERROR_MODE', serverPath);
assertIncludes(server, 'no_supported_workflows: true', serverPath);
assertIncludes(server, 'no_workflow_execution_attempted: true', serverPath);
assertIncludes(server, 'ai-agent-workflow-catalog', serverPath);
assertIncludes(server, "app.post('/api/admin/ai-agents/recommendations'", serverPath);
assertIncludes(server, 'function aiRecommendationValidationError', serverPath);
assertIncludes(server, 'no_recommendation_draft: true', serverPath);
assertIncludes(server, 'audit_event_attempted: false', serverPath);
assertIncludes(server, 'buildStarterLoanReviewRecommendation', serverPath);
assertIncludes(server, 'buildVerificationTriageRecommendation', serverPath);
assertIncludes(server, 'buildPaymentExceptionReviewRecommendation', serverPath);
assertIncludes(server, 'buildDisputeEvidenceSummaryRecommendation', serverPath);
assertIncludes(server, 'buildDraftDocumentPacketRecommendation', serverPath);
assertIncludes(server, 'buildJobMatchRankingRecommendation', serverPath);
assertIncludes(server, 'risk_assessment_agent', serverPath);
assertIncludes(server, 'contractor_matching_agent', serverPath);
assertIncludes(server, 'compliance_agent', serverPath);
assertIncludes(server, 'treasury_agent', serverPath);
assertIncludes(server, 'dispute_triage_agent', serverPath);
assertIncludes(server, 'document_generation_agent', serverPath);
assertIncludes(server, 'verification_triage', serverPath);
assertIncludes(server, 'payment_exception_review', serverPath);
assertIncludes(server, 'dispute_evidence_summary', serverPath);
assertIncludes(server, 'draft_document_packet', serverPath);
assertIncludes(server, 'job_match_ranking', serverPath);
assertIncludes(server, 'repayment_waterfall_review_packet', serverPath);
assertIncludes(server, 'workflow repayment_waterfall_review_packet is catalog-only; use GET /api/admin/ai-agents/workflows', serverPath);
assertIncludes(server, 'local_structured_review_packet_only', serverPath);
assertIncludes(server, 'repayment_waterfall_fixtures', serverPath);
assertIncludes(server, 'provider_api_call', serverPath);
assertIncludes(server, 'required_human_review: true', serverPath);
assertIncludes(server, 'approve_real_loan', serverPath);
assertIncludes(server, 'release_escrow', serverPath);
assertIncludes(server, 'lock_token_collateral', serverPath);
assertIncludes(server, 'approve_contractor_verification', serverPath);
assertIncludes(server, 'override_license_check', serverPath);
assertIncludes(server, 'activate_provider_account', serverPath);
assertIncludes(server, 'issue_refund', serverPath);
assertIncludes(server, 'change_payout_destination', serverPath);
assertIncludes(server, 'execute_treasury_action', serverPath);
assertIncludes(server, 'decide_dispute', serverPath);
assertIncludes(server, 'assign_final_liability', serverPath);
assertIncludes(server, 'send_legal_document', serverPath);
assertIncludes(server, 'bind_contract', serverPath);
assertIncludes(server, 'request_signature', serverPath);
assertIncludes(server, 'file_lien_waiver', serverPath);
assertIncludes(server, 'publish_real_lead', serverPath);
assertIncludes(server, 'assign_contractor', serverPath);
assertIncludes(server, 'start_escrow', serverPath);
assertIncludes(server, 'charge_lead_token', serverPath);
assertIncludes(server, 'BLOCKED_FOR_LIVE', serverPath);
assertIncludes(server, 'SMARTCONTRACTOR_AI_AGENT_AUDIT_MODE', serverPath);
assertIncludes(server, 'input_refs must be an array of non-empty strings', serverPath);
assertIncludes(packageJson, '"check:ai-agent-recommendations": "node scripts/smoke-ai-agent-recommendations.mjs"', packagePath);
assertIncludes(smoke, "process.env.SMARTCONTRACTOR_AI_AGENT_AUDIT_MODE = 'skip'", smokePath);
assertIncludes(smoke, 'throw new Error(`AI recommendation smoke failed:', smokePath);
assertIncludes(smoke, "audit_event_attempted === false", smokePath);
assertIncludes(smoke, 'assertNoRecommendationDraft', smokePath);
assertIncludes(smoke, 'must not return a recommendation draft', smokePath);
assertIncludes(smoke, 'must explicitly mark no_recommendation_draft', smokePath);
assertIncludes(smoke, 'must explicitly mark audit_event_attempted false', smokePath);
assertIncludes(smoke, 'safe_scope must include:', smokePath);
assertIncludes(smoke, 'no live audit write', smokePath);
assertIncludes(smoke, 'assertNoWorkflowCatalogMenu', smokePath);
assertIncludes(smoke, 'Workflow catalog error response', smokePath);
assertIncludes(smoke, 'no_supported_workflows', smokePath);
assertIncludes(smoke, 'no_workflow_execution_attempted', smokePath);
assertIncludes(smoke, "valid.headers.get('x-request-id')", smokePath);
assertIncludes(smoke, "invalid.headers.get('x-request-id')", smokePath);
assertIncludes(smoke, "missingEntityId.headers.get('x-request-id')", smokePath);
assertIncludes(smoke, "wrongEntityType.headers.get('x-request-id')", smokePath);
assertIncludes(smoke, "badInputRefs.headers.get('x-request-id')", smokePath);
assertIncludes(smoke, "emptyInputRefs.headers.get('x-request-id')", smokePath);
assertIncludes(smoke, "workflow must be starter_loan_review, verification_triage, payment_exception_review, dispute_evidence_summary, draft_document_packet, or job_match_ranking", smokePath);
assertIncludes(smoke, 'missingEntityId', smokePath);
assertIncludes(smoke, 'entity_id is required', smokePath);
assertIncludes(smoke, 'wrongEntityType', smokePath);
assertIncludes(smoke, 'payment_intent', smokePath);
assertIncludes(smoke, 'entity_type must be contractor_loan', smokePath);
assertIncludes(smoke, 'badInputRefs', smokePath);
assertIncludes(smoke, 'input_refs must be an array of non-empty strings', smokePath);
assertIncludes(smoke, 'emptyInputRefs', smokePath);
assertIncludes(smoke, 'loan-smoke-empty-input-refs', smokePath);
assertIncludes(smoke, 'input_refs must include at least one reference', smokePath);
assertIncludes(server, 'input_refs must include at least one reference', serverPath);
assertIncludes(smoke, "nullFacts.headers.get('x-request-id')", smokePath);
assertIncludes(smoke, 'nullFacts', smokePath);
assertIncludes(smoke, 'loan-smoke-null-facts', smokePath);
assertIncludes(smoke, 'facts must be an object', smokePath);
assertIncludes(server, 'facts must be an object', serverPath);
assertIncludes(smoke, "badRiskScore.headers.get('x-request-id')", smokePath);
assertIncludes(smoke, 'badRiskScore', smokePath);
assertIncludes(smoke, 'loan-smoke-bad-risk-score', smokePath);
assertIncludes(smoke, 'risk_score must be a finite number', smokePath);
assertIncludes(server, 'validateOptionalFiniteNumber', serverPath);
assertIncludes(server, 'must be a finite number', serverPath);
assertIncludes(smoke, "outOfRangeRiskScore.headers.get('x-request-id')", smokePath);
assertIncludes(smoke, 'outOfRangeRiskScore', smokePath);
assertIncludes(smoke, 'loan-smoke-out-of-range-risk-score', smokePath);
assertIncludes(smoke, 'risk_score must be between 0 and 100', smokePath);
assertIncludes(server, 'risk_score must be between 0 and 100', serverPath);
assertIncludes(smoke, 'assertNoSecretLeak', smokePath);
assertIncludes(smoke, 'supabase_service_role_key', smokePath);
assertIncludes(smoke, 'private_key', smokePath);
assertIncludes(smoke, 'Workflow catalog response', smokePath);
assertIncludes(smoke, 'repayment_waterfall_review_packet', smokePath);
assertIncludes(smoke, 'catalogModeCounts', smokePath);
assertIncludes(smoke, "catalogModeCounts.get('local_structured_review_packet_only') === 1", smokePath);
assertIncludes(smoke, "catalogModeCounts.get('local_structured_recommendation_only') === 6", smokePath);
assertIncludes(smoke, 'catalogLiveBlockedCount', smokePath);
assertIncludes(smoke, 'catalogLocalOnlyCount', smokePath);
assertIncludes(smoke, 'catalogHumanReviewCount', smokePath);
assertIncludes(smoke, 'catalogAuditRequiredCount', smokePath);
assertIncludes(smoke, 'catalogBlockedActionsCoverageCount', smokePath);
assertIncludes(smoke, 'catalogInputRefsCoverageCount', smokePath);
assertIncludes(smoke, 'catalogSupportedFactsCoverageCount', smokePath);
assertIncludes(smoke, 'Workflow catalog must keep every workflow blocked for live action', smokePath);
assertIncludes(smoke, 'Workflow catalog must keep every workflow local-only', smokePath);
assertIncludes(smoke, 'Workflow catalog must require human review for every workflow', smokePath);
assertIncludes(smoke, 'Workflow catalog must require audit capture for every workflow', smokePath);
assertIncludes(smoke, 'Workflow catalog must list blocked live actions for every workflow', smokePath);
assertIncludes(smoke, 'Workflow catalog must list required input refs for every workflow', smokePath);
assertIncludes(smoke, 'Workflow catalog must list supported facts for every workflow', smokePath);
assertIncludes(smoke, 'catalog_workflow_coverage_checked', smokePath);
assertIncludes(smoke, 'live_blocked', smokePath);
assertIncludes(smoke, 'required_permissions: catalogWorkflowRequiredPermissionCount', smokePath);
assertIncludes(smoke, 'modes: catalogWorkflowModeCount', smokePath);
assertIncludes(smoke, 'live_action_statuses: catalogWorkflowLiveActionStatusCount', smokePath);
assertIncludes(smoke, 'local_only_statuses: catalogWorkflowLocalOnlyStatusCount', smokePath);
assertIncludes(smoke, 'human_review_statuses: catalogWorkflowHumanReviewStatusCount', smokePath);
assertIncludes(smoke, 'audit_required_statuses: catalogWorkflowAuditRequiredStatusCount', smokePath);
assertIncludes(smoke, 'workflow_ids: catalogWorkflowIds.length', smokePath);
assertIncludes(smoke, 'workflow_versions: catalogWorkflowVersionCount', smokePath);
assertIncludes(smoke, 'workflow_agents: catalogWorkflowAgentCount', smokePath);
assertIncludes(smoke, 'workflow_entity_types: catalogWorkflowEntityTypeCount', smokePath);
assertIncludes(smoke, 'required_input_refs', smokePath);
assertIncludes(smoke, 'expectedCatalogWorkflowIds', smokePath);
assertIncludes(smoke, 'catalogWorkflowIds', smokePath);
assertIncludes(smoke, 'Workflow catalog must expose exactly the expected workflow IDs', smokePath);
assertIncludes(smoke, 'catalog_workflow_ids_checked', smokePath);
assertIncludes(smoke, 'catalogWorkflowCount', smokePath);
assertIncludes(smoke, 'Workflow catalog workflow count must match the expected workflow IDs', smokePath);
assertIncludes(smoke, 'catalog_workflow_count_checked', smokePath);
assertIncludes(smoke, 'expectedCatalogWorkflowVersions', smokePath);
assertIncludes(smoke, 'catalogWorkflowVersions', smokePath);
assertIncludes(smoke, 'Workflow catalog must expose exactly the expected workflow versions', smokePath);
assertIncludes(smoke, 'catalog_workflow_versions_checked', smokePath);
assertIncludes(smoke, 'catalogWorkflowVersionCount', smokePath);
assertIncludes(smoke, 'Workflow catalog workflow version count must match the expected workflow versions', smokePath);
assertIncludes(smoke, 'catalog_workflow_version_count_checked', smokePath);
assertIncludes(smoke, 'expectedCatalogWorkflowAgents', smokePath);
assertIncludes(smoke, 'catalogWorkflowAgents', smokePath);
assertIncludes(smoke, 'catalogWorkflowAgentCount', smokePath);
assertIncludes(smoke, 'Workflow catalog must expose exactly the expected workflow agents', smokePath);
assertIncludes(smoke, 'Workflow catalog workflow agent count must match the expected workflow agents', smokePath);
assertIncludes(smoke, 'catalog_workflow_agents_checked', smokePath);
assertIncludes(smoke, 'catalog_workflow_agent_count_checked', smokePath);
assertIncludes(smoke, 'expectedCatalogWorkflowEntityTypes', smokePath);
assertIncludes(smoke, 'catalogWorkflowEntityTypes', smokePath);
assertIncludes(smoke, 'catalogWorkflowEntityTypeCount', smokePath);
assertIncludes(smoke, 'Workflow catalog must expose exactly the expected workflow entity types', smokePath);
assertIncludes(smoke, 'Workflow catalog workflow entity type count must match the expected workflow entity types', smokePath);
assertIncludes(smoke, 'catalog_workflow_entity_types_checked', smokePath);
assertIncludes(smoke, 'catalog_workflow_entity_type_count_checked', smokePath);
assertIncludes(smoke, 'expectedCatalogWorkflowInputRefs', smokePath);
assertIncludes(smoke, 'catalogWorkflowInputRefs', smokePath);
assertIncludes(smoke, 'catalogWorkflowInputRefCount', smokePath);
assertIncludes(smoke, 'Workflow catalog must expose exactly the expected workflow input refs', smokePath);
assertIncludes(smoke, 'Workflow catalog workflow input ref count must match the expected workflow input refs', smokePath);
assertIncludes(smoke, 'catalog_workflow_input_refs_checked', smokePath);
assertIncludes(smoke, 'catalog_workflow_input_ref_count_checked', smokePath);
assertIncludes(smoke, 'expectedCatalogWorkflowSupportedFacts', smokePath);
assertIncludes(smoke, 'catalogWorkflowSupportedFacts', smokePath);
assertIncludes(smoke, 'catalogWorkflowSupportedFactCount', smokePath);
assertIncludes(smoke, 'Workflow catalog must expose exactly the expected workflow supported facts', smokePath);
assertIncludes(smoke, 'Workflow catalog workflow supported fact count must match the expected workflow supported facts', smokePath);
assertIncludes(smoke, 'catalog_workflow_supported_facts_checked', smokePath);
assertIncludes(smoke, 'catalog_workflow_supported_fact_count_checked', smokePath);
assertIncludes(smoke, 'expectedCatalogWorkflowBlockedActions', smokePath);
assertIncludes(smoke, 'catalogWorkflowBlockedActions', smokePath);
assertIncludes(smoke, 'catalogWorkflowBlockedActionCount', smokePath);
assertIncludes(smoke, 'Workflow catalog must expose exactly the expected workflow blocked actions', smokePath);
assertIncludes(smoke, 'Workflow catalog workflow blocked action count must match the expected workflow blocked actions', smokePath);
assertIncludes(smoke, 'catalog_workflow_blocked_actions_checked', smokePath);
assertIncludes(smoke, 'catalog_workflow_blocked_action_count_checked', smokePath);
assertIncludes(smoke, 'expectedCatalogWorkflowRequiredPermissions', smokePath);
assertIncludes(smoke, 'catalogWorkflowRequiredPermissions', smokePath);
assertIncludes(smoke, 'catalogWorkflowRequiredPermissionCount', smokePath);
assertIncludes(smoke, 'Workflow catalog must expose exactly the expected workflow required permissions', smokePath);
assertIncludes(smoke, 'Workflow catalog workflow required permission count must match the expected workflow required permissions', smokePath);
assertIncludes(smoke, 'catalog_workflow_required_permissions_checked', smokePath);
assertIncludes(smoke, 'catalog_workflow_required_permission_count_checked', smokePath);
assertIncludes(smoke, 'expectedCatalogWorkflowDistinctRequiredPermissions', smokePath);
assertIncludes(smoke, 'catalogWorkflowDistinctRequiredPermissions', smokePath);
assertIncludes(smoke, 'catalogWorkflowDistinctRequiredPermissionCount', smokePath);
assertIncludes(smoke, 'Workflow catalog distinct required permissions must match the expected permission scopes', smokePath);
assertIncludes(smoke, 'catalog_workflow_distinct_required_permissions_checked', smokePath);
assertIncludes(smoke, 'catalog_workflow_distinct_required_permission_count_checked', smokePath);
assertIncludes(smoke, 'expectedCatalogWorkflowModes', smokePath);
assertIncludes(smoke, 'catalogWorkflowModes', smokePath);
assertIncludes(smoke, 'catalogWorkflowModeCount', smokePath);
assertIncludes(smoke, 'Workflow catalog must expose exactly the expected workflow modes', smokePath);
assertIncludes(smoke, 'Workflow catalog workflow mode count must match the expected workflow modes', smokePath);
assertIncludes(smoke, 'catalog_workflow_modes_checked', smokePath);
assertIncludes(smoke, 'catalog_workflow_mode_count_checked', smokePath);
assertIncludes(smoke, 'expectedCatalogWorkflowLiveActionStatuses', smokePath);
assertIncludes(smoke, 'catalogWorkflowLiveActionStatuses', smokePath);
assertIncludes(smoke, 'catalogWorkflowLiveActionStatusCount', smokePath);
assertIncludes(smoke, 'Workflow catalog must expose exactly the expected workflow live action statuses', smokePath);
assertIncludes(smoke, 'Workflow catalog workflow live action status count must match the expected workflow live action statuses', smokePath);
assertIncludes(smoke, 'catalog_workflow_live_action_statuses_checked', smokePath);
assertIncludes(smoke, 'catalog_workflow_live_action_status_count_checked', smokePath);
assertIncludes(smoke, 'expectedCatalogWorkflowLocalOnlyStatuses', smokePath);
assertIncludes(smoke, 'catalogWorkflowLocalOnlyStatuses', smokePath);
assertIncludes(smoke, 'catalogWorkflowLocalOnlyStatusCount', smokePath);
assertIncludes(smoke, 'Workflow catalog must expose exactly the expected workflow local-only statuses', smokePath);
assertIncludes(smoke, 'Workflow catalog workflow local-only status count must match the expected workflow local-only statuses', smokePath);
assertIncludes(smoke, 'catalog_workflow_local_only_statuses_checked', smokePath);
assertIncludes(smoke, 'catalog_workflow_local_only_status_count_checked', smokePath);
assertIncludes(smoke, 'expectedCatalogWorkflowHumanReviewStatuses', smokePath);
assertIncludes(smoke, 'catalogWorkflowHumanReviewStatuses', smokePath);
assertIncludes(smoke, 'catalogWorkflowHumanReviewStatusCount', smokePath);
assertIncludes(smoke, 'Workflow catalog must expose exactly the expected workflow human-review statuses', smokePath);
assertIncludes(smoke, 'Workflow catalog workflow human-review status count must match the expected workflow human-review statuses', smokePath);
assertIncludes(smoke, 'catalog_workflow_human_review_statuses_checked', smokePath);
assertIncludes(smoke, 'catalog_workflow_human_review_status_count_checked', smokePath);
assertIncludes(smoke, 'expectedCatalogWorkflowAuditRequiredStatuses', smokePath);
assertIncludes(smoke, 'catalogWorkflowAuditRequiredStatuses', smokePath);
assertIncludes(smoke, 'catalogWorkflowAuditRequiredStatusCount', smokePath);
assertIncludes(smoke, 'Workflow catalog must expose exactly the expected workflow audit-required statuses', smokePath);
assertIncludes(smoke, 'Workflow catalog workflow audit-required status count must match the expected workflow audit-required statuses', smokePath);
assertIncludes(smoke, 'catalog_workflow_audit_required_statuses_checked', smokePath);
assertIncludes(smoke, 'catalog_workflow_audit_required_status_count_checked', smokePath);
assertIncludes(smoke, 'catalogOnlyWorkflow.headers.get', smokePath);
assertIncludes(smoke, 'Catalog-only workflow response', smokePath);
assertIncludes(smoke, 'workflow repayment_waterfall_review_packet is catalog-only; use GET /api/admin/ai-agents/workflows', smokePath);
assertIncludes(smoke, 'Repayment waterfall workflow must use repayment_waterfall_review_packet', smokePath);
assertIncludes(smoke, 'provider_api_call', smokePath);
assertIncludes(smoke, 'Repayment waterfall workflow must block ${action}', smokePath);
assertIncludes(smoke, 'Valid recommendation response', smokePath);
assertIncludes(smoke, 'Missing-evidence recommendation response', smokePath);
assertIncludes(smoke, 'High-risk recommendation response', smokePath);
assertIncludes(smoke, 'local-only review packet is ready for human review', smokePath);
assertIncludes(smoke, 'loan-smoke-missing-evidence', smokePath);
assertIncludes(smoke, 'signed project contract evidence is missing', smokePath);
assertIncludes(smoke, 'repayment waterfall needs founder/legal/provider review', smokePath);
assertIncludes(smoke, 'business, license, insurance, or identity verification is incomplete', smokePath);
assertIncludes(smoke, 'loan-smoke-high-risk', smokePath);
assertIncludes(smoke, 'high_risk_manual_review', smokePath);
assertIncludes(smoke, 'requested amount is above the local starter-loan demo cap', smokePath);
assertIncludes(smoke, 'risk score is below the local review threshold', smokePath);
assertIncludes(smoke, 'verificationReady', smokePath);
assertIncludes(smoke, 'verification-smoke-local-001', smokePath);
assertIncludes(smoke, 'local-only verification triage packet is ready for human review', smokePath);
assertIncludes(smoke, 'verificationMissingEvidence', smokePath);
assertIncludes(smoke, 'verification-smoke-missing-evidence', smokePath);
assertIncludes(smoke, 'collect_missing_verification_evidence', smokePath);
assertIncludes(smoke, 'license verification evidence is incomplete', smokePath);
assertIncludes(smoke, 'insurance verification evidence is incomplete', smokePath);
assertIncludes(smoke, 'business identity verification evidence is incomplete', smokePath);
assertIncludes(smoke, 'verificationWrongEntityType', smokePath);
assertIncludes(smoke, 'verification-smoke-wrong-entity-type', smokePath);
assertIncludes(smoke, 'entity_type must be verification_check', smokePath);
assertIncludes(smoke, 'paymentExceptionReady', smokePath);
assertIncludes(smoke, 'payment-exception-smoke-local-001', smokePath);
assertIncludes(smoke, 'local-only payment exception packet is ready for treasury review', smokePath);
assertIncludes(smoke, 'paymentExceptionMissingEvidence', smokePath);
assertIncludes(smoke, 'payment-exception-smoke-missing-evidence', smokePath);
assertIncludes(smoke, 'reconcile_payment_exception', smokePath);
assertIncludes(smoke, 'payment intent status needs reconciliation', smokePath);
assertIncludes(smoke, 'provider webhook evidence is incomplete', smokePath);
assertIncludes(smoke, 'payment ledger reconciliation is incomplete', smokePath);
assertIncludes(smoke, 'paymentWrongEntityType', smokePath);
assertIncludes(smoke, 'payment-exception-smoke-wrong-entity-type', smokePath);
assertIncludes(smoke, 'entity_type must be payment_exception', smokePath);
assertIncludes(smoke, 'disputeReady', smokePath);
assertIncludes(smoke, 'dispute-smoke-local-001', smokePath);
assertIncludes(smoke, 'local-only dispute evidence packet is ready for human review', smokePath);
assertIncludes(smoke, 'disputeMissingEvidence', smokePath);
assertIncludes(smoke, 'dispute-smoke-missing-evidence', smokePath);
assertIncludes(smoke, 'collect_missing_dispute_evidence', smokePath);
assertIncludes(smoke, 'dispute evidence metadata is incomplete', smokePath);
assertIncludes(smoke, 'milestone or scope status needs documentation', smokePath);
assertIncludes(smoke, 'peer review or inspection notes are incomplete', smokePath);
assertIncludes(smoke, 'disputeWrongEntityType', smokePath);
assertIncludes(smoke, 'dispute-smoke-wrong-entity-type', smokePath);
assertIncludes(smoke, 'entity_type must be dispute', smokePath);
assertIncludes(smoke, 'documentReady', smokePath);
assertIncludes(smoke, 'document-packet-smoke-local-001', smokePath);
assertIncludes(smoke, 'local-only document packet outline is ready for attorney/founder review', smokePath);
assertIncludes(smoke, 'documentMissingEvidence', smokePath);
assertIncludes(smoke, 'document-packet-smoke-missing-evidence', smokePath);
assertIncludes(smoke, 'collect_missing_document_packet_inputs', smokePath);
assertIncludes(smoke, 'project contract draft metadata is incomplete', smokePath);
assertIncludes(smoke, 'milestone schedule needs documentation', smokePath);
assertIncludes(smoke, 'scope or change-order references need documentation', smokePath);
assertIncludes(smoke, 'attorney review status must remain explicit', smokePath);
assertIncludes(smoke, 'signature readiness status must remain explicit', smokePath);
assertIncludes(smoke, 'documentWrongEntityType', smokePath);
assertIncludes(smoke, 'document-packet-smoke-wrong-entity-type', smokePath);
assertIncludes(smoke, 'entity_type must be document_packet', smokePath);
assertIncludes(smoke, 'matchingReady', smokePath);
assertIncludes(smoke, 'job-match-smoke-local-001', smokePath);
assertIncludes(smoke, 'local-only job match packet is ready for founder/admin review', smokePath);
assertIncludes(smoke, 'matchingMissingEvidence', smokePath);
assertIncludes(smoke, 'job-match-smoke-missing-evidence', smokePath);
assertIncludes(smoke, 'collect_missing_job_match_inputs', smokePath);
assertIncludes(smoke, 'job scope/status metadata is incomplete', smokePath);
assertIncludes(smoke, 'contractor profile or verification status is incomplete', smokePath);
assertIncludes(smoke, 'job-to-contractor geography needs confirmation', smokePath);
assertIncludes(smoke, 'license or trade fit needs confirmation', smokePath);
assertIncludes(smoke, 'contractor availability needs confirmation', smokePath);
assertIncludes(smoke, 'matchingWrongEntityType', smokePath);
assertIncludes(smoke, 'job-match-smoke-wrong-entity-type', smokePath);
assertIncludes(smoke, 'entity_type must be job_match', smokePath);
assertIncludes(smoke, "Workflow catalog safety boundaries must include", smokePath);
assertIncludes(smoke, 'workflowCatalog.body?.safety_boundaries?.length === 3', smokePath);
assertIncludes(smoke, 'Workflow catalog must expose exactly three safety boundaries', smokePath);
assertIncludes(smoke, 'expectedCatalogSafetyBoundaries', smokePath);
assertIncludes(smoke, 'catalogSafetyBoundaries', smokePath);
assertIncludes(smoke, 'catalogSafetyBoundaryCount', smokePath);
assertIncludes(smoke, 'Workflow catalog safety boundary count must match the expected safety boundaries', smokePath);
assertIncludes(smoke, 'Workflow catalog must expose exactly the expected safety boundaries', smokePath);
assertIncludes(smoke, 'catalog_safety_boundaries_exact_checked', smokePath);
assertIncludes(smoke, 'catalog_safety_boundary_count_checked', smokePath);
assertIncludes(smoke, 'expectedCatalogResponseStatus', smokePath);
assertIncludes(smoke, 'catalogResponseStatus', smokePath);
assertIncludes(smoke, 'Workflow catalog must expose exactly the expected response status', smokePath);
assertIncludes(smoke, 'catalog_response_status_checked', smokePath);
assertIncludes(smoke, 'expectedCatalogHttpStatus', smokePath);
assertIncludes(smoke, 'catalogHttpStatus', smokePath);
assertIncludes(smoke, 'Workflow catalog must expose exactly the expected HTTP status', smokePath);
assertIncludes(smoke, 'catalog_http_status_checked', smokePath);
assertIncludes(smoke, 'catalogRequestIdHeader', smokePath);
assertIncludes(smoke, 'catalogRequestIdBody', smokePath);
assertIncludes(smoke, 'catalogRequestIdEchoCount', smokePath);
assertIncludes(smoke, 'Workflow catalog request-id header must match the smoke request id', smokePath);
assertIncludes(smoke, 'Workflow catalog body request_id must match the smoke request id', smokePath);
assertIncludes(smoke, 'Workflow catalog request-id echo count must cover header and body request ids', smokePath);
assertIncludes(smoke, 'catalog_request_id_header_checked', smokePath);
assertIncludes(smoke, 'catalog_request_id_body_checked', smokePath);
assertIncludes(smoke, 'catalog_request_id_echo_count_checked', smokePath);
assertIncludes(smoke, 'catalogGeneratedAt', smokePath);
assertIncludes(smoke, 'catalogGeneratedAtMs', smokePath);
assertIncludes(smoke, 'catalogGeneratedAtUtc', smokePath);
assertIncludes(smoke, 'catalogGeneratedAtAgeMs', smokePath);
assertIncludes(smoke, 'catalogGeneratedAtAgeSeconds', smokePath);
assertIncludes(smoke, 'catalogGeneratedAtMaxAgeMs', smokePath);
assertIncludes(smoke, 'catalogGeneratedAtMaxAgeSeconds', smokePath);
assertIncludes(smoke, 'catalogGeneratedAtIsoPattern', smokePath);
assertIncludes(smoke, 'catalogGeneratedAtCanonical', smokePath);
assertIncludes(smoke, 'Workflow catalog generated_at must be a parseable ISO timestamp', smokePath);
assertIncludes(smoke, 'Workflow catalog generated_at must not be future-dated', smokePath);
assertIncludes(smoke, 'Workflow catalog generated_at must be an explicit UTC timestamp', smokePath);
assertIncludes(smoke, 'Workflow catalog generated_at must be fresh for the smoke run', smokePath);
assertIncludes(smoke, 'Workflow catalog generated_at must use millisecond ISO UTC format', smokePath);
assertIncludes(smoke, 'Workflow catalog generated_at must equal its canonical ISO UTC representation', smokePath);
assertIncludes(smoke, 'catalog_generated_at_checked', smokePath);
assertIncludes(smoke, 'catalog_generated_at_not_future_checked', smokePath);
assertIncludes(smoke, 'catalog_generated_at_utc_checked', smokePath);
assertIncludes(smoke, 'catalog_generated_at_age_ms_checked', smokePath);
assertIncludes(smoke, 'catalog_generated_at_age_seconds_checked', smokePath);
assertIncludes(smoke, 'catalog_generated_at_epoch_ms_checked', smokePath);
assertIncludes(smoke, 'catalog_generated_at_max_age_ms_checked', smokePath);
assertIncludes(smoke, 'catalog_generated_at_max_age_seconds_checked', smokePath);
assertIncludes(smoke, 'catalog_generated_at_iso_format_checked', smokePath);
assertIncludes(smoke, 'catalog_generated_at_canonical_checked', smokePath);
assertIncludes(smoke, 'catalog_generated_at_fresh_checked', smokePath);
assertIncludes(smoke, "catalog_safety_boundaries_checked", smokePath);
assertIncludes(envExample, 'SMARTCONTRACTOR_AI_AGENT_AUDIT_MODE=live', envPath);
assertIncludes(envExample, 'skip only for local smoke tests', envPath);

console.log(JSON.stringify({
  status: 'passed',
  doc_checked: docPath,
  workflows_checked: 7,
  local_catalog_workflows_checked: [
    'starter_loan_review',
    'repayment_waterfall_review_packet',
    'verification_triage',
    'payment_exception_review',
    'dispute_evidence_summary',
    'draft_document_packet',
    'job_match_ranking',
  ],
  local_endpoint_checked: '/api/admin/ai-agents/recommendations',
  local_recommendation_workflows_checked: [
    'starter_loan_review',
    'verification_triage',
    'payment_exception_review',
    'dispute_evidence_summary',
    'draft_document_packet',
    'job_match_ranking',
  ],
}, null, 2));
