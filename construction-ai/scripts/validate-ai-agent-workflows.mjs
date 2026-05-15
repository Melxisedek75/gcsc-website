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
assertIncludes(server, 'ai-agent-workflow-catalog', serverPath);
assertIncludes(server, "app.post('/api/admin/ai-agents/recommendations'", serverPath);
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
assertIncludes(smoke, "catalog_safety_boundaries_checked", smokePath);
assertIncludes(envExample, 'SMARTCONTRACTOR_AI_AGENT_AUDIT_MODE=live', envPath);
assertIncludes(envExample, 'skip only for local smoke tests', envPath);

console.log(JSON.stringify({
  status: 'passed',
  doc_checked: docPath,
  workflows_checked: 6,
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
