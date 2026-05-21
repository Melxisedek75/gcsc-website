import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const serverSource = readFileSync('server.js', 'utf8');

function fail(message) {
  throw new Error(`AI recommendation smoke failed: ${message}`);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function assertNoSecretLeak(label, body) {
  const text = JSON.stringify(body || {}).toLowerCase();
  for (const forbidden of [
    'supabase_service_role_key',
    'service_role',
    'private_key',
    'seed phrase',
    'password',
    'bearer ',
    'sk_live',
    'whsec_',
  ]) {
    assert(!text.includes(forbidden), `${label} must not expose ${forbidden}`);
  }
}

function assertNoRecommendationDraft(label, body) {
  assert(!body?.recommendation, `${label} must not return a recommendation draft`);
  assert(body?.no_recommendation_draft === true, `${label} must explicitly mark no_recommendation_draft`);
  assert(body?.audit_event_attempted === false, `${label} must explicitly mark audit_event_attempted false`);
  assert(Array.isArray(body?.safe_scope) && body.safe_scope.length >= 2, `${label} must include safe_scope boundaries`);
  const safeScopeText = body.safe_scope.join(' ').toLowerCase();
  for (const phrase of ['local validation', 'no recommendation draft', 'no live audit write']) {
    assert(safeScopeText.includes(phrase), `${label} safe_scope must include: ${phrase}`);
  }
}

function assertNoWorkflowCatalogMenu(label, body) {
  assert(!body?.supported_workflows, `${label} must not return supported workflow menus`);
  assert(body?.no_supported_workflows === true, `${label} must explicitly mark no_supported_workflows`);
  assert(
    body?.no_workflow_execution_attempted === true,
    `${label} must explicitly mark no_workflow_execution_attempted`
  );
  assert(Array.isArray(body?.safe_scope) && body.safe_scope.length >= 2, `${label} must include safe_scope boundaries`);
  const safeScopeText = body.safe_scope.join(' ').toLowerCase();
  for (const phrase of ['local workflow discovery', 'no supported workflow menu', 'no recommendation draft', 'no live audit write']) {
    assert(safeScopeText.includes(phrase), `${label} safe_scope must include: ${phrase}`);
  }
}

async function readJson(response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function request(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  return {
    status: response.status,
    headers: response.headers,
    body: await readJson(response),
  };
}

function assertSourceCoverage() {
  for (const snippet of [
    "app.get('/api/admin/ai-agents/workflows'",
    'buildAiAgentWorkflowCatalog',
    'buildAiWorkflowCatalogErrorResponse',
    'SMARTCONTRACTOR_AI_WORKFLOW_CATALOG_ERROR_MODE',
    'no_supported_workflows',
    'no_workflow_execution_attempted',
    'local_structured_recommendation_only',
    "app.post('/api/admin/ai-agents/recommendations'",
    "requireAdminPermissions(['loan_review_prepare'])",
    'buildStarterLoanReviewRecommendation',
    'buildVerificationTriageRecommendation',
    'buildPaymentExceptionReviewRecommendation',
    'buildDisputeEvidenceSummaryRecommendation',
    'buildDraftDocumentPacketRecommendation',
    'buildJobMatchRankingRecommendation',
    'risk_assessment_agent',
    'contractor_matching_agent',
    'compliance_agent',
    'treasury_agent',
    'dispute_triage_agent',
    'document_generation_agent',
    'verification_triage',
    'payment_exception_review',
    'dispute_evidence_summary',
    'draft_document_packet',
    'job_match_ranking',
    'repayment_waterfall_review_packet',
    'required_human_review: true',
    'audit_event_required: true',
    'SMARTCONTRACTOR_AI_AGENT_AUDIT_MODE',
    'skipAuditForSmoke',
    'approve_real_loan',
    'fund_contractor',
    'route_repayment',
    'release_escrow',
    'settle_stablecoin',
    'lock_token_collateral',
    'approve_contractor_verification',
    'override_license_check',
    'activate_provider_account',
    'issue_refund',
    'change_payout_destination',
    'execute_treasury_action',
    'decide_dispute',
    'assign_final_liability',
    'send_legal_document',
    'bind_contract',
    'request_signature',
    'file_lien_waiver',
    'publish_real_lead',
    'assign_contractor',
    'start_escrow',
    'charge_lead_token',
    'move_money',
    'legal_decision',
    'BLOCKED_FOR_LIVE',
  ]) {
    assert(serverSource.includes(snippet), `Missing server coverage snippet: ${snippet}`);
  }
}

assertSourceCoverage();

process.env.VERCEL = '1';
process.env.SMARTCONTRACTOR_AI_AGENT_AUDIT_MODE = 'skip';

const app = require('../server.js');
const server = app.listen(0);

try {
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const requestId = 'gcsc-ai-agent-smoke-123';

  const health = await request(baseUrl, '/api/health');
  assert(health.status === 200, `Expected /api/health 200, got ${health.status}`);
  assert(
    health.body?.features?.includes('ai-agent-local-recommendation'),
    'Health must advertise ai-agent-local-recommendation'
  );
  assert(
    health.body?.features?.includes('ai-agent-workflow-catalog'),
    'Health must advertise ai-agent-workflow-catalog'
  );

  process.env.SMARTCONTRACTOR_AI_WORKFLOW_CATALOG_ERROR_MODE = 'force';
  const catalogError = await request(baseUrl, '/api/admin/ai-agents/workflows', {
    headers: { 'X-Request-Id': requestId },
  });
  process.env.SMARTCONTRACTOR_AI_WORKFLOW_CATALOG_ERROR_MODE = '';
  assert(catalogError.status === 503, `Expected workflow catalog error 503, got ${catalogError.status}`);
  assert(catalogError.headers.get('x-request-id') === requestId, 'Workflow catalog error must echo request id');
  assert(catalogError.body?.request_id === requestId, 'Workflow catalog error must include request_id in the response body');
  assert(catalogError.body?.error === 'Workflow catalog unavailable', 'Workflow catalog error must name the discovery failure');
  assert(
    Array.isArray(catalogError.body?.details) && catalogError.body.details.length > 0,
    'Workflow catalog error must include discovery failure details'
  );
  assertNoWorkflowCatalogMenu('Workflow catalog error response', catalogError.body);
  assertNoSecretLeak('Workflow catalog error response', catalogError.body);

  const workflowCatalog = await request(baseUrl, '/api/admin/ai-agents/workflows', {
    headers: { 'X-Request-Id': requestId },
  });
  assert(workflowCatalog.status === 200, `Expected workflow catalog 200, got ${workflowCatalog.status}`);
  assert(workflowCatalog.headers.get('x-request-id') === requestId, 'Workflow catalog must echo request id');
  assert(workflowCatalog.body?.request_id === requestId, 'Workflow catalog must include request_id in the response body');
  assert(
    typeof workflowCatalog.body?.generated_at === 'string' && workflowCatalog.body.generated_at.length > 0,
    'Workflow catalog must include generated_at timestamp'
  );
  assert(
    workflowCatalog.body?.supported_workflows?.some((workflow) => workflow.workflow === 'starter_loan_review'),
    'Workflow catalog must include starter_loan_review'
  );
  assert(
    workflowCatalog.body?.supported_workflows?.some((workflow) => workflow.workflow === 'verification_triage'),
    'Workflow catalog must include verification_triage'
  );
  assert(
    workflowCatalog.body?.supported_workflows?.some((workflow) => workflow.workflow === 'payment_exception_review'),
    'Workflow catalog must include payment_exception_review'
  );
  assert(
    workflowCatalog.body?.supported_workflows?.some((workflow) => workflow.workflow === 'dispute_evidence_summary'),
    'Workflow catalog must include dispute_evidence_summary'
  );
  assert(
    workflowCatalog.body?.supported_workflows?.some((workflow) => workflow.workflow === 'draft_document_packet'),
    'Workflow catalog must include draft_document_packet'
  );
  assert(
    workflowCatalog.body?.supported_workflows?.some((workflow) => workflow.workflow === 'job_match_ranking'),
    'Workflow catalog must include job_match_ranking'
  );
  assert(
    workflowCatalog.body?.supported_workflows?.some((workflow) => workflow.workflow === 'repayment_waterfall_review_packet'),
    'Workflow catalog must include repayment_waterfall_review_packet'
  );
  const expectedCatalogWorkflowIds = [
    'dispute_evidence_summary',
    'draft_document_packet',
    'job_match_ranking',
    'payment_exception_review',
    'repayment_waterfall_review_packet',
    'starter_loan_review',
    'verification_triage',
  ];
  const catalogWorkflowIds = (workflowCatalog.body.supported_workflows || [])
    .map((workflow) => workflow.workflow)
    .sort();
  assert(
    JSON.stringify(catalogWorkflowIds) === JSON.stringify(expectedCatalogWorkflowIds),
    'Workflow catalog must expose exactly the expected workflow IDs'
  );
  const expectedCatalogWorkflowVersions = {
    dispute_evidence_summary: 'draft-2026-05-15',
    draft_document_packet: 'draft-2026-05-15',
    job_match_ranking: 'draft-2026-05-15',
    payment_exception_review: 'draft-2026-05-15',
    repayment_waterfall_review_packet: 'draft-2026-05-21',
    starter_loan_review: 'draft-2026-05-14',
    verification_triage: 'draft-2026-05-15',
  };
  const catalogWorkflowVersions = Object.fromEntries(
    (workflowCatalog.body.supported_workflows || [])
      .map((workflow) => [workflow.workflow, workflow.version])
      .sort(([left], [right]) => left.localeCompare(right))
  );
  assert(
    JSON.stringify(catalogWorkflowVersions) === JSON.stringify(expectedCatalogWorkflowVersions),
    'Workflow catalog must expose exactly the expected workflow versions'
  );
  const expectedCatalogWorkflowAgents = {
    dispute_evidence_summary: 'dispute_triage_agent',
    draft_document_packet: 'document_generation_agent',
    job_match_ranking: 'contractor_matching_agent',
    payment_exception_review: 'treasury_agent',
    repayment_waterfall_review_packet: 'risk_assessment_agent',
    starter_loan_review: 'risk_assessment_agent',
    verification_triage: 'compliance_agent',
  };
  const catalogWorkflowAgents = Object.fromEntries(
    (workflowCatalog.body.supported_workflows || [])
      .map((workflow) => [workflow.workflow, workflow.agent])
      .sort(([left], [right]) => left.localeCompare(right))
  );
  assert(
    JSON.stringify(catalogWorkflowAgents) === JSON.stringify(expectedCatalogWorkflowAgents),
    'Workflow catalog must expose exactly the expected workflow agents'
  );
  const expectedCatalogWorkflowEntityTypes = {
    dispute_evidence_summary: 'dispute',
    draft_document_packet: 'document_packet',
    job_match_ranking: 'job_match',
    payment_exception_review: 'payment_exception',
    repayment_waterfall_review_packet: 'repayment_waterfall_review_packet',
    starter_loan_review: 'contractor_loan',
    verification_triage: 'verification_check',
  };
  const catalogWorkflowEntityTypes = Object.fromEntries(
    (workflowCatalog.body.supported_workflows || [])
      .map((workflow) => [workflow.workflow, workflow.entity_type])
      .sort(([left], [right]) => left.localeCompare(right))
  );
  assert(
    JSON.stringify(catalogWorkflowEntityTypes) === JSON.stringify(expectedCatalogWorkflowEntityTypes),
    'Workflow catalog must expose exactly the expected workflow entity types'
  );
  const expectedCatalogWorkflowInputRefs = {
    dispute_evidence_summary: ['dispute', 'evidence', 'milestone', 'peer_review'],
    draft_document_packet: ['project_contract', 'milestones', 'scope', 'change_orders'],
    job_match_ranking: ['job', 'contractor', 'license', 'availability'],
    payment_exception_review: ['payment_intent', 'payment_event', 'provider_webhook', 'audit_event'],
    repayment_waterfall_review_packet: [
      'repayment_waterfall_fixtures',
      'endpoint_smoke',
      'review_packet',
      'external_review_gates',
      'blocked_live_actions',
    ],
    starter_loan_review: ['contractor', 'project_contract', 'milestones', 'verification_checks'],
    verification_triage: ['contractor', 'license', 'insurance', 'business_identity'],
  };
  const catalogWorkflowInputRefs = Object.fromEntries(
    (workflowCatalog.body.supported_workflows || [])
      .map((workflow) => [workflow.workflow, workflow.required_input_refs])
      .sort(([left], [right]) => left.localeCompare(right))
  );
  assert(
    JSON.stringify(catalogWorkflowInputRefs) === JSON.stringify(expectedCatalogWorkflowInputRefs),
    'Workflow catalog must expose exactly the expected workflow input refs'
  );
  const expectedCatalogWorkflowSupportedFacts = {
    dispute_evidence_summary: ['dispute_status', 'evidence_status', 'milestone_status', 'peer_review_status'],
    draft_document_packet: [
      'contract_status',
      'milestone_status',
      'scope_status',
      'attorney_review_status',
      'signature_status',
    ],
    job_match_ranking: [
      'job_status',
      'contractor_status',
      'geo_match_status',
      'license_match_status',
      'availability_status',
    ],
    payment_exception_review: ['payment_status', 'webhook_status', 'ledger_status'],
    repayment_waterfall_review_packet: [
      'fixture_count',
      'covered_fixture_states',
      'review_packet_status',
      'deployment_status',
      'pass_fail_status',
      'local_only',
    ],
    starter_loan_review: [
      'principal_usd',
      'requested_amount_usd',
      'risk_score',
      'verification_status',
      'has_signed_project_contract',
      'has_repayment_waterfall',
    ],
    verification_triage: ['license_status', 'insurance_status', 'business_identity_status'],
  };
  const catalogWorkflowSupportedFacts = Object.fromEntries(
    (workflowCatalog.body.supported_workflows || [])
      .map((workflow) => [workflow.workflow, workflow.supported_facts])
      .sort(([left], [right]) => left.localeCompare(right))
  );
  assert(
    JSON.stringify(catalogWorkflowSupportedFacts) === JSON.stringify(expectedCatalogWorkflowSupportedFacts),
    'Workflow catalog must expose exactly the expected workflow supported facts'
  );
  const expectedCatalogWorkflowBlockedActions = {
    dispute_evidence_summary: [
      'decide_dispute',
      'release_escrow',
      'issue_refund',
      'assign_final_liability',
      'move_money',
      'legal_decision',
    ],
    draft_document_packet: [
      'send_legal_document',
      'bind_contract',
      'request_signature',
      'file_lien_waiver',
      'move_money',
      'legal_decision',
    ],
    job_match_ranking: [
      'publish_real_lead',
      'assign_contractor',
      'start_escrow',
      'charge_lead_token',
      'move_money',
      'legal_decision',
    ],
    payment_exception_review: [
      'issue_refund',
      'release_escrow',
      'change_payout_destination',
      'execute_treasury_action',
      'move_money',
      'approve_real_loan',
      'legal_decision',
    ],
    repayment_waterfall_review_packet: [
      'approve_real_loan',
      'fund_contractor',
      'route_repayment',
      'release_escrow',
      'settle_stablecoin',
      'lock_token_collateral',
      'provider_api_call',
      'move_money',
      'legal_decision',
    ],
    starter_loan_review: [
      'approve_real_loan',
      'fund_contractor',
      'route_repayment',
      'release_escrow',
      'settle_stablecoin',
      'lock_token_collateral',
      'move_money',
      'legal_decision',
    ],
    verification_triage: [
      'approve_contractor_verification',
      'override_license_check',
      'activate_provider_account',
      'approve_real_loan',
      'fund_contractor',
      'move_money',
      'legal_decision',
    ],
  };
  const catalogWorkflowBlockedActions = Object.fromEntries(
    (workflowCatalog.body.supported_workflows || [])
      .map((workflow) => [workflow.workflow, workflow.blocked_actions])
      .sort(([left], [right]) => left.localeCompare(right))
  );
  assert(
    JSON.stringify(catalogWorkflowBlockedActions) === JSON.stringify(expectedCatalogWorkflowBlockedActions),
    'Workflow catalog must expose exactly the expected workflow blocked actions'
  );
  const expectedCatalogWorkflowRequiredPermissions = {
    dispute_evidence_summary: 'loan_review_prepare',
    draft_document_packet: 'loan_review_prepare',
    job_match_ranking: 'loan_review_prepare',
    payment_exception_review: 'loan_review_prepare',
    repayment_waterfall_review_packet: 'loan_review_prepare',
    starter_loan_review: 'loan_review_prepare',
    verification_triage: 'loan_review_prepare',
  };
  const catalogWorkflowRequiredPermissions = Object.fromEntries(
    (workflowCatalog.body.supported_workflows || [])
      .map((workflow) => [workflow.workflow, workflow.required_permission])
      .sort(([left], [right]) => left.localeCompare(right))
  );
  assert(
    JSON.stringify(catalogWorkflowRequiredPermissions) === JSON.stringify(expectedCatalogWorkflowRequiredPermissions),
    'Workflow catalog must expose exactly the expected workflow required permissions'
  );
  const expectedCatalogWorkflowModes = {
    dispute_evidence_summary: 'local_structured_recommendation_only',
    draft_document_packet: 'local_structured_recommendation_only',
    job_match_ranking: 'local_structured_recommendation_only',
    payment_exception_review: 'local_structured_recommendation_only',
    repayment_waterfall_review_packet: 'local_structured_review_packet_only',
    starter_loan_review: 'local_structured_recommendation_only',
    verification_triage: 'local_structured_recommendation_only',
  };
  const catalogWorkflowModes = Object.fromEntries(
    (workflowCatalog.body.supported_workflows || [])
      .map((workflow) => [workflow.workflow, workflow.mode])
      .sort(([left], [right]) => left.localeCompare(right))
  );
  assert(
    JSON.stringify(catalogWorkflowModes) === JSON.stringify(expectedCatalogWorkflowModes),
    'Workflow catalog must expose exactly the expected workflow modes'
  );
  const expectedCatalogWorkflowLiveActionStatuses = {
    dispute_evidence_summary: 'BLOCKED_FOR_LIVE',
    draft_document_packet: 'BLOCKED_FOR_LIVE',
    job_match_ranking: 'BLOCKED_FOR_LIVE',
    payment_exception_review: 'BLOCKED_FOR_LIVE',
    repayment_waterfall_review_packet: 'BLOCKED_FOR_LIVE',
    starter_loan_review: 'BLOCKED_FOR_LIVE',
    verification_triage: 'BLOCKED_FOR_LIVE',
  };
  const catalogWorkflowLiveActionStatuses = Object.fromEntries(
    (workflowCatalog.body.supported_workflows || [])
      .map((workflow) => [workflow.workflow, workflow.live_action_status])
      .sort(([left], [right]) => left.localeCompare(right))
  );
  assert(
    JSON.stringify(catalogWorkflowLiveActionStatuses) === JSON.stringify(expectedCatalogWorkflowLiveActionStatuses),
    'Workflow catalog must expose exactly the expected workflow live action statuses'
  );
  const expectedCatalogWorkflowLocalOnlyStatuses = {
    dispute_evidence_summary: true,
    draft_document_packet: true,
    job_match_ranking: true,
    payment_exception_review: true,
    repayment_waterfall_review_packet: true,
    starter_loan_review: true,
    verification_triage: true,
  };
  const catalogWorkflowLocalOnlyStatuses = Object.fromEntries(
    (workflowCatalog.body.supported_workflows || [])
      .map((workflow) => [workflow.workflow, workflow.local_only])
      .sort(([left], [right]) => left.localeCompare(right))
  );
  assert(
    JSON.stringify(catalogWorkflowLocalOnlyStatuses) === JSON.stringify(expectedCatalogWorkflowLocalOnlyStatuses),
    'Workflow catalog must expose exactly the expected workflow local-only statuses'
  );
  const expectedCatalogWorkflowHumanReviewStatuses = {
    dispute_evidence_summary: true,
    draft_document_packet: true,
    job_match_ranking: true,
    payment_exception_review: true,
    repayment_waterfall_review_packet: true,
    starter_loan_review: true,
    verification_triage: true,
  };
  const catalogWorkflowHumanReviewStatuses = Object.fromEntries(
    (workflowCatalog.body.supported_workflows || [])
      .map((workflow) => [workflow.workflow, workflow.required_human_review])
      .sort(([left], [right]) => left.localeCompare(right))
  );
  assert(
    JSON.stringify(catalogWorkflowHumanReviewStatuses) === JSON.stringify(expectedCatalogWorkflowHumanReviewStatuses),
    'Workflow catalog must expose exactly the expected workflow human-review statuses'
  );
  const catalogModeCounts = new Map();
  for (const workflow of workflowCatalog.body.supported_workflows || []) {
    catalogModeCounts.set(workflow.mode, (catalogModeCounts.get(workflow.mode) || 0) + 1);
  }
  assert(
    catalogModeCounts.get('local_structured_review_packet_only') === 1,
    'Workflow catalog must expose exactly one catalog-only review packet workflow'
  );
  assert(
    catalogModeCounts.get('local_structured_recommendation_only') === 6,
    'Workflow catalog must expose exactly six recommendation workflows'
  );
  const catalogLiveBlockedCount = workflowCatalog.body.supported_workflows.filter(
    (workflow) => workflow.live_action_status === 'BLOCKED_FOR_LIVE'
  ).length;
  const catalogLocalOnlyCount = workflowCatalog.body.supported_workflows.filter(
    (workflow) => workflow.local_only === true
  ).length;
  const catalogHumanReviewCount = workflowCatalog.body.supported_workflows.filter(
    (workflow) => workflow.required_human_review === true
  ).length;
  const catalogAuditRequiredCount = workflowCatalog.body.supported_workflows.filter(
    (workflow) => workflow.audit_event_required === true
  ).length;
  const catalogBlockedActionsCoverageCount = workflowCatalog.body.supported_workflows.filter(
    (workflow) => Array.isArray(workflow.blocked_actions) && workflow.blocked_actions.length > 0
  ).length;
  const catalogInputRefsCoverageCount = workflowCatalog.body.supported_workflows.filter(
    (workflow) => Array.isArray(workflow.required_input_refs) && workflow.required_input_refs.length > 0
  ).length;
  const catalogSupportedFactsCoverageCount = workflowCatalog.body.supported_workflows.filter(
    (workflow) => Array.isArray(workflow.supported_facts) && workflow.supported_facts.length > 0
  ).length;
  assert(
    catalogLiveBlockedCount === workflowCatalog.body.supported_workflows.length,
    'Workflow catalog must keep every workflow blocked for live action'
  );
  assert(
    catalogLocalOnlyCount === workflowCatalog.body.supported_workflows.length,
    'Workflow catalog must keep every workflow local-only'
  );
  assert(
    catalogHumanReviewCount === workflowCatalog.body.supported_workflows.length,
    'Workflow catalog must require human review for every workflow'
  );
  assert(
    catalogAuditRequiredCount === workflowCatalog.body.supported_workflows.length,
    'Workflow catalog must require audit capture for every workflow'
  );
  assert(
    catalogBlockedActionsCoverageCount === workflowCatalog.body.supported_workflows.length,
    'Workflow catalog must list blocked live actions for every workflow'
  );
  assert(
    catalogInputRefsCoverageCount === workflowCatalog.body.supported_workflows.length,
    'Workflow catalog must list required input refs for every workflow'
  );
  assert(
    catalogSupportedFactsCoverageCount === workflowCatalog.body.supported_workflows.length,
    'Workflow catalog must list supported facts for every workflow'
  );
  assertNoSecretLeak('Workflow catalog response', workflowCatalog.body);
  const starterLoanWorkflow = workflowCatalog.body.supported_workflows.find(
    (workflow) => workflow.workflow === 'starter_loan_review'
  );
  const verificationWorkflow = workflowCatalog.body.supported_workflows.find(
    (workflow) => workflow.workflow === 'verification_triage'
  );
  const paymentExceptionWorkflow = workflowCatalog.body.supported_workflows.find(
    (workflow) => workflow.workflow === 'payment_exception_review'
  );
  const disputeWorkflow = workflowCatalog.body.supported_workflows.find(
    (workflow) => workflow.workflow === 'dispute_evidence_summary'
  );
  const documentWorkflow = workflowCatalog.body.supported_workflows.find(
    (workflow) => workflow.workflow === 'draft_document_packet'
  );
  const matchingWorkflow = workflowCatalog.body.supported_workflows.find(
    (workflow) => workflow.workflow === 'job_match_ranking'
  );
  const repaymentWaterfallWorkflow = workflowCatalog.body.supported_workflows.find(
    (workflow) => workflow.workflow === 'repayment_waterfall_review_packet'
  );
  assert(starterLoanWorkflow?.agent === 'risk_assessment_agent', 'Workflow catalog must map starter loans to risk_assessment_agent');
  assert(starterLoanWorkflow?.required_human_review === true, 'Workflow catalog must require human review');
  assert(starterLoanWorkflow?.live_action_status === 'BLOCKED_FOR_LIVE', 'Workflow catalog must block live action');
  assert(
    starterLoanWorkflow?.supported_facts?.includes('has_repayment_waterfall'),
    'Workflow catalog must document repayment waterfall facts'
  );
  assert(
    starterLoanWorkflow?.blocked_actions?.includes('approve_real_loan'),
    'Workflow catalog must block real loan approval'
  );
  assert(
    verificationWorkflow?.agent === 'compliance_agent',
    'Workflow catalog must map verification triage to compliance_agent'
  );
  assert(verificationWorkflow?.entity_type === 'verification_check', 'Verification workflow must use verification_check');
  assert(verificationWorkflow?.required_human_review === true, 'Verification workflow must require human review');
  assert(verificationWorkflow?.live_action_status === 'BLOCKED_FOR_LIVE', 'Verification workflow must block live action');
  for (const fact of ['license_status', 'insurance_status', 'business_identity_status']) {
    assert(verificationWorkflow?.supported_facts?.includes(fact), `Verification workflow must document ${fact}`);
  }
  for (const action of ['approve_contractor_verification', 'override_license_check', 'activate_provider_account']) {
    assert(verificationWorkflow?.blocked_actions?.includes(action), `Verification workflow must block ${action}`);
  }
  assert(
    paymentExceptionWorkflow?.agent === 'treasury_agent',
    'Workflow catalog must map payment exceptions to treasury_agent'
  );
  assert(paymentExceptionWorkflow?.entity_type === 'payment_exception', 'Payment workflow must use payment_exception');
  assert(paymentExceptionWorkflow?.required_human_review === true, 'Payment workflow must require human review');
  assert(paymentExceptionWorkflow?.live_action_status === 'BLOCKED_FOR_LIVE', 'Payment workflow must block live action');
  for (const fact of ['payment_status', 'webhook_status', 'ledger_status']) {
    assert(paymentExceptionWorkflow?.supported_facts?.includes(fact), `Payment workflow must document ${fact}`);
  }
  for (const action of ['issue_refund', 'release_escrow', 'change_payout_destination', 'execute_treasury_action']) {
    assert(paymentExceptionWorkflow?.blocked_actions?.includes(action), `Payment workflow must block ${action}`);
  }
  assert(
    disputeWorkflow?.agent === 'dispute_triage_agent',
    'Workflow catalog must map dispute evidence summaries to dispute_triage_agent'
  );
  assert(disputeWorkflow?.entity_type === 'dispute', 'Dispute workflow must use dispute');
  assert(disputeWorkflow?.required_human_review === true, 'Dispute workflow must require human review');
  assert(disputeWorkflow?.live_action_status === 'BLOCKED_FOR_LIVE', 'Dispute workflow must block live action');
  for (const fact of ['dispute_status', 'evidence_status', 'milestone_status', 'peer_review_status']) {
    assert(disputeWorkflow?.supported_facts?.includes(fact), `Dispute workflow must document ${fact}`);
  }
  for (const action of ['decide_dispute', 'release_escrow', 'issue_refund', 'assign_final_liability']) {
    assert(disputeWorkflow?.blocked_actions?.includes(action), `Dispute workflow must block ${action}`);
  }
  assert(
    documentWorkflow?.agent === 'document_generation_agent',
    'Workflow catalog must map document packets to document_generation_agent'
  );
  assert(documentWorkflow?.entity_type === 'document_packet', 'Document workflow must use document_packet');
  assert(documentWorkflow?.required_human_review === true, 'Document workflow must require human review');
  assert(documentWorkflow?.live_action_status === 'BLOCKED_FOR_LIVE', 'Document workflow must block live action');
  for (const fact of ['contract_status', 'milestone_status', 'scope_status', 'attorney_review_status', 'signature_status']) {
    assert(documentWorkflow?.supported_facts?.includes(fact), `Document workflow must document ${fact}`);
  }
  for (const action of ['send_legal_document', 'bind_contract', 'request_signature', 'file_lien_waiver']) {
    assert(documentWorkflow?.blocked_actions?.includes(action), `Document workflow must block ${action}`);
  }
  assert(
    matchingWorkflow?.agent === 'contractor_matching_agent',
    'Workflow catalog must map job matching to contractor_matching_agent'
  );
  assert(matchingWorkflow?.entity_type === 'job_match', 'Matching workflow must use job_match');
  assert(matchingWorkflow?.required_human_review === true, 'Matching workflow must require human review');
  assert(matchingWorkflow?.live_action_status === 'BLOCKED_FOR_LIVE', 'Matching workflow must block live action');
  for (const fact of ['job_status', 'contractor_status', 'geo_match_status', 'license_match_status', 'availability_status']) {
    assert(matchingWorkflow?.supported_facts?.includes(fact), `Matching workflow must document ${fact}`);
  }
  for (const action of ['publish_real_lead', 'assign_contractor', 'start_escrow', 'charge_lead_token']) {
    assert(matchingWorkflow?.blocked_actions?.includes(action), `Matching workflow must block ${action}`);
  }
  assert(
    repaymentWaterfallWorkflow?.agent === 'risk_assessment_agent',
    'Workflow catalog must map repayment waterfall review packet to risk_assessment_agent'
  );
  assert(
    repaymentWaterfallWorkflow?.entity_type === 'repayment_waterfall_review_packet',
    'Repayment waterfall workflow must use repayment_waterfall_review_packet'
  );
  assert(repaymentWaterfallWorkflow?.required_human_review === true, 'Repayment waterfall workflow must require human review');
  assert(repaymentWaterfallWorkflow?.local_only === true, 'Repayment waterfall workflow must stay local-only');
  assert(repaymentWaterfallWorkflow?.live_action_status === 'BLOCKED_FOR_LIVE', 'Repayment waterfall workflow must block live action');
  for (const fact of ['fixture_count', 'covered_fixture_states', 'review_packet_status', 'deployment_status', 'pass_fail_status', 'local_only']) {
    assert(repaymentWaterfallWorkflow?.supported_facts?.includes(fact), `Repayment waterfall workflow must document ${fact}`);
  }
  for (const ref of ['repayment_waterfall_fixtures', 'endpoint_smoke', 'review_packet', 'external_review_gates', 'blocked_live_actions']) {
    assert(repaymentWaterfallWorkflow?.required_input_refs?.includes(ref), `Repayment waterfall workflow must require ${ref}`);
  }
  for (const action of ['route_repayment', 'release_escrow', 'settle_stablecoin', 'lock_token_collateral', 'provider_api_call', 'move_money']) {
    assert(repaymentWaterfallWorkflow?.blocked_actions?.includes(action), `Repayment waterfall workflow must block ${action}`);
  }
  assert(
    workflowCatalog.body?.safety_boundaries?.length === 3,
    'Workflow catalog must expose exactly three safety boundaries'
  );
  const catalogSafetyText = (workflowCatalog.body?.safety_boundaries || []).join(' ').toLowerCase();
  for (const phrase of [
    'draft support only',
    'deterministic rules and humans approve',
    'no real loan',
    'escrow',
    'repayment',
    'stablecoin',
    'token collateral',
    'money movement',
    'legal',
    'provider action',
  ]) {
    assert(catalogSafetyText.includes(phrase), `Workflow catalog safety boundaries must include: ${phrase}`);
  }

  const invalid = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({
      workflow: 'approve_real_loan',
      entity_type: 'contractor_loan',
      entity_id: 'loan-smoke-invalid',
    }),
  });
  assert(invalid.status === 400, `Expected invalid workflow 400, got ${invalid.status}`);
  assert(invalid.headers.get('x-request-id') === requestId, 'Invalid workflow must echo the supplied request id');
  assert(invalid.body?.error === 'Validation failed', 'Invalid workflow must return validation failure');
  assertNoRecommendationDraft('Invalid workflow response', invalid.body);
  assert(
    invalid.body?.details?.includes('workflow must be starter_loan_review, verification_triage, payment_exception_review, dispute_evidence_summary, draft_document_packet, or job_match_ranking'),
    'Invalid workflow must explain the supported local workflows'
  );

  const catalogOnlyWorkflow = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({
      workflow: 'repayment_waterfall_review_packet',
      entity_type: 'repayment_waterfall_review_packet',
      entity_id: 'waterfall-smoke-catalog-only',
      input_refs: ['repayment_waterfall_fixtures', 'review_packet'],
      facts: {
        fixture_count: 6,
        local_only: true,
      },
    }),
  });
  assert(catalogOnlyWorkflow.status === 400, `Expected catalog-only workflow 400, got ${catalogOnlyWorkflow.status}`);
  assert(
    catalogOnlyWorkflow.headers.get('x-request-id') === requestId,
    'Catalog-only workflow rejection must echo the supplied request id'
  );
  assert(
    catalogOnlyWorkflow.body?.error === 'Validation failed',
    'Catalog-only workflow rejection must return validation failure'
  );
  assertNoRecommendationDraft('Catalog-only workflow response', catalogOnlyWorkflow.body);
  assert(
    catalogOnlyWorkflow.body?.details?.includes('workflow repayment_waterfall_review_packet is catalog-only; use GET /api/admin/ai-agents/workflows'),
    'Catalog-only workflow must explain the read-only catalog boundary'
  );

  const missingEntityId = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({
      workflow: 'starter_loan_review',
      entity_type: 'contractor_loan',
      facts: {
        principal_usd: 3500,
        risk_score: 65,
      },
    }),
  });
  assert(missingEntityId.status === 400, `Expected missing entity id 400, got ${missingEntityId.status}`);
  assert(
    missingEntityId.headers.get('x-request-id') === requestId,
    'Missing entity id must echo the supplied request id'
  );
  assert(missingEntityId.body?.error === 'Validation failed', 'Missing entity id must return validation failure');
  assertNoRecommendationDraft('Missing entity id response', missingEntityId.body);
  assert(
    missingEntityId.body?.details?.includes('entity_id is required'),
    'Missing entity id must explain the required entity_id'
  );

  const wrongEntityType = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({
      workflow: 'starter_loan_review',
      entity_type: 'payment_intent',
      entity_id: 'loan-smoke-wrong-entity-type',
      facts: {
        principal_usd: 3500,
        risk_score: 65,
      },
    }),
  });
  assert(wrongEntityType.status === 400, `Expected wrong entity type 400, got ${wrongEntityType.status}`);
  assert(
    wrongEntityType.headers.get('x-request-id') === requestId,
    'Wrong entity type must echo the supplied request id'
  );
  assert(wrongEntityType.body?.error === 'Validation failed', 'Wrong entity type must return validation failure');
  assertNoRecommendationDraft('Wrong entity type response', wrongEntityType.body);
  assert(
    wrongEntityType.body?.details?.includes('entity_type must be contractor_loan'),
    'Wrong entity type must explain the contractor loan boundary'
  );

  const badInputRefs = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({
      workflow: 'starter_loan_review',
      entity_type: 'contractor_loan',
      entity_id: 'loan-smoke-bad-input-refs',
      input_refs: 'contractor',
      facts: {
        principal_usd: 3500,
        risk_score: 65,
      },
    }),
  });
  assert(badInputRefs.status === 400, `Expected bad input refs 400, got ${badInputRefs.status}`);
  assert(badInputRefs.headers.get('x-request-id') === requestId, 'Bad input refs must echo the supplied request id');
  assert(badInputRefs.body?.error === 'Validation failed', 'Bad input refs must return validation failure');
  assertNoRecommendationDraft('Bad input refs response', badInputRefs.body);
  assert(
    badInputRefs.body?.details?.includes('input_refs must be an array of non-empty strings'),
    'Bad input refs must explain the input_refs array boundary'
  );

  const emptyInputRefs = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({
      workflow: 'starter_loan_review',
      entity_type: 'contractor_loan',
      entity_id: 'loan-smoke-empty-input-refs',
      input_refs: [],
      facts: {
        principal_usd: 3500,
        risk_score: 65,
      },
    }),
  });
  assert(emptyInputRefs.status === 400, `Expected empty input refs 400, got ${emptyInputRefs.status}`);
  assert(
    emptyInputRefs.headers.get('x-request-id') === requestId,
    'Empty input refs must echo the supplied request id'
  );
  assert(emptyInputRefs.body?.error === 'Validation failed', 'Empty input refs must return validation failure');
  assertNoRecommendationDraft('Empty input refs response', emptyInputRefs.body);
  assert(
    emptyInputRefs.body?.details?.includes('input_refs must include at least one reference'),
    'Empty input refs must explain the required input reference boundary'
  );

  const nullFacts = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({
      workflow: 'starter_loan_review',
      entity_type: 'contractor_loan',
      entity_id: 'loan-smoke-null-facts',
      input_refs: ['contractor'],
      facts: null,
    }),
  });
  assert(nullFacts.status === 400, `Expected null facts 400, got ${nullFacts.status}`);
  assert(nullFacts.headers.get('x-request-id') === requestId, 'Null facts must echo the supplied request id');
  assert(nullFacts.body?.error === 'Validation failed', 'Null facts must return validation failure');
  assertNoRecommendationDraft('Null facts response', nullFacts.body);
  assert(
    nullFacts.body?.details?.includes('facts must be an object'),
    'Null facts must explain the facts object boundary'
  );

  const badRiskScore = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({
      workflow: 'starter_loan_review',
      entity_type: 'contractor_loan',
      entity_id: 'loan-smoke-bad-risk-score',
      input_refs: ['contractor'],
      facts: {
        principal_usd: 3500,
        risk_score: 'high',
        verification_status: 'passed',
        has_signed_project_contract: true,
        has_repayment_waterfall: true,
      },
    }),
  });
  assert(badRiskScore.status === 400, `Expected bad risk score 400, got ${badRiskScore.status}`);
  assert(badRiskScore.headers.get('x-request-id') === requestId, 'Bad risk score must echo the supplied request id');
  assert(badRiskScore.body?.error === 'Validation failed', 'Bad risk score must return validation failure');
  assertNoRecommendationDraft('Bad risk score response', badRiskScore.body);
  assert(
    badRiskScore.body?.details?.includes('risk_score must be a finite number'),
    'Bad risk score must explain the numeric fact boundary'
  );

  const outOfRangeRiskScore = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({
      workflow: 'starter_loan_review',
      entity_type: 'contractor_loan',
      entity_id: 'loan-smoke-out-of-range-risk-score',
      input_refs: ['contractor'],
      facts: {
        principal_usd: 3500,
        risk_score: 200,
        verification_status: 'passed',
        has_signed_project_contract: true,
        has_repayment_waterfall: true,
      },
    }),
  });
  assert(
    outOfRangeRiskScore.status === 400,
    `Expected out-of-range risk score 400, got ${outOfRangeRiskScore.status}`
  );
  assert(
    outOfRangeRiskScore.headers.get('x-request-id') === requestId,
    'Out-of-range risk score must echo the supplied request id'
  );
  assert(
    outOfRangeRiskScore.body?.error === 'Validation failed',
    'Out-of-range risk score must return validation failure'
  );
  assertNoRecommendationDraft('Out-of-range risk score response', outOfRangeRiskScore.body);
  assert(
    outOfRangeRiskScore.body?.details?.includes('risk_score must be between 0 and 100'),
    'Out-of-range risk score must explain the bounded risk score boundary'
  );

  const valid = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({
      workflow: 'starter_loan_review',
      entity_type: 'contractor_loan',
      entity_id: 'loan-smoke-local-001',
      input_refs: ['contractor', 'project_contract', 'milestones', 'verification_checks'],
      facts: {
        principal_usd: 4200,
        risk_score: 71,
        verification_status: 'passed',
        has_signed_project_contract: true,
        has_repayment_waterfall: true,
      },
    }),
  });

  assert(valid.status === 201, `Expected recommendation 201, got ${valid.status}`);
  assert(valid.headers.get('x-request-id') === requestId, 'Endpoint must echo the supplied request id');
  assert(valid.body?.request_id === requestId, 'Recommendation response body must include request_id');
  assert(
    typeof valid.body?.generated_at === 'string' && valid.body.generated_at.length > 0,
    'Recommendation response body must include generated_at timestamp'
  );
  assert(valid.body?.audit_event_attempted === false, 'Smoke mode must skip live Supabase audit writes');
  assertNoSecretLeak('Valid recommendation response', valid.body);

  const recommendation = valid.body?.recommendation;
  assert(recommendation?.agent === 'risk_assessment_agent', 'Recommendation must come from the risk assessment agent');
  assert(recommendation?.workflow === 'starter_loan_review', 'Recommendation workflow must remain starter_loan_review');
  assert(recommendation?.entity_type === 'contractor_loan', 'Recommendation entity_type must remain contractor_loan');
  assert(recommendation?.entity_id === 'loan-smoke-local-001', 'Recommendation must preserve entity_id');
  assert(recommendation?.required_human_review === true, 'Recommendation must require human review');
  assert(recommendation?.audit_event_required === true, 'Recommendation must require an audit event outside smoke mode');
  assert(recommendation?.local_only === true, 'Recommendation must stay local-only');
  assert(recommendation?.live_action_status === 'BLOCKED_FOR_LIVE', 'Recommendation must block live action');
  assert(Array.isArray(recommendation?.reasons) && recommendation.reasons.length > 0, 'Recommendation must include reasons');
  assert(
    recommendation.reasons.includes('local-only review packet is ready for human review'),
    'Complete local facts must produce a human-review-ready reason'
  );

  const missingEvidence = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    body: JSON.stringify({
      workflow: 'starter_loan_review',
      entity_type: 'contractor_loan',
      entity_id: 'loan-smoke-missing-evidence',
      input_refs: ['contractor'],
      facts: {
        principal_usd: 3600,
        risk_score: 72,
        verification_status: 'missing',
        has_signed_project_contract: false,
        has_repayment_waterfall: false,
      },
    }),
  });
  assert(missingEvidence.status === 201, `Expected missing-evidence recommendation 201, got ${missingEvidence.status}`);
  assertNoSecretLeak('Missing-evidence recommendation response', missingEvidence.body);
  const missingReasons = missingEvidence.body?.recommendation?.reasons || [];
  assert(
    missingReasons.includes('signed project contract evidence is missing'),
    'Missing signed project contract must be called out in reasons'
  );
  assert(
    missingReasons.includes('repayment waterfall needs founder/legal/provider review'),
    'Missing repayment waterfall must be called out in reasons'
  );
  assert(
    missingReasons.includes('business, license, insurance, or identity verification is incomplete'),
    'Missing verification must be called out in reasons'
  );

  const highRisk = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    body: JSON.stringify({
      workflow: 'starter_loan_review',
      entity_type: 'contractor_loan',
      entity_id: 'loan-smoke-high-risk',
      facts: {
        principal_usd: 6500,
        risk_score: 54,
        verification_status: 'passed',
        has_signed_project_contract: true,
        has_repayment_waterfall: true,
      },
    }),
  });
  assert(highRisk.status === 201, `Expected high-risk recommendation 201, got ${highRisk.status}`);
  assertNoSecretLeak('High-risk recommendation response', highRisk.body);
  assert(
    highRisk.body?.recommendation?.recommendation === 'high_risk_manual_review',
    'High-risk facts must stay manual-review only'
  );
  assert(
    highRisk.body?.recommendation?.reasons?.includes('requested amount is above the local starter-loan demo cap'),
    'High-risk facts must call out demo cap overage'
  );
  assert(
    highRisk.body?.recommendation?.reasons?.includes('risk score is below the local review threshold'),
    'High-risk facts must call out low risk score'
  );

  const verificationReady = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({
      workflow: 'verification_triage',
      entity_type: 'verification_check',
      entity_id: 'verification-smoke-local-001',
      input_refs: ['contractor', 'license', 'insurance', 'business_identity'],
      facts: {
        license_status: 'passed',
        insurance_status: 'passed',
        business_identity_status: 'passed',
      },
    }),
  });
  assert(verificationReady.status === 201, `Expected verification recommendation 201, got ${verificationReady.status}`);
  assert(verificationReady.headers.get('x-request-id') === requestId, 'Verification endpoint must echo request id');
  assert(verificationReady.body?.audit_event_attempted === false, 'Verification smoke mode must skip audit writes');
  assertNoSecretLeak('Verification recommendation response', verificationReady.body);
  const verificationRecommendation = verificationReady.body?.recommendation;
  assert(
    verificationRecommendation?.agent === 'compliance_agent',
    'Verification recommendation must come from the compliance agent'
  );
  assert(
    verificationRecommendation?.workflow === 'verification_triage',
    'Verification recommendation workflow must remain verification_triage'
  );
  assert(
    verificationRecommendation?.entity_type === 'verification_check',
    'Verification recommendation entity_type must remain verification_check'
  );
  assert(verificationRecommendation?.entity_id === 'verification-smoke-local-001', 'Verification must preserve entity_id');
  assert(verificationRecommendation?.required_human_review === true, 'Verification must require human review');
  assert(verificationRecommendation?.audit_event_required === true, 'Verification must require audit outside smoke mode');
  assert(verificationRecommendation?.local_only === true, 'Verification must stay local-only');
  assert(
    verificationRecommendation?.live_action_status === 'BLOCKED_FOR_LIVE',
    'Verification must block live action'
  );
  assert(
    verificationRecommendation?.recommendation === 'manual_review',
    'Complete verification facts must remain manual-review only'
  );
  assert(
    verificationRecommendation?.reasons?.includes('local-only verification triage packet is ready for human review'),
    'Complete verification facts must produce a human-review-ready reason'
  );

  const verificationMissingEvidence = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    body: JSON.stringify({
      workflow: 'verification_triage',
      entity_type: 'verification_check',
      entity_id: 'verification-smoke-missing-evidence',
      input_refs: ['contractor'],
      facts: {
        license_status: 'missing',
        insurance_status: 'missing',
        business_identity_status: 'missing',
      },
    }),
  });
  assert(
    verificationMissingEvidence.status === 201,
    `Expected verification missing-evidence recommendation 201, got ${verificationMissingEvidence.status}`
  );
  assertNoSecretLeak('Verification missing-evidence recommendation response', verificationMissingEvidence.body);
  assert(
    verificationMissingEvidence.body?.recommendation?.recommendation === 'collect_missing_verification_evidence',
    'Missing verification evidence must request evidence collection'
  );
  const verificationMissingReasons = verificationMissingEvidence.body?.recommendation?.reasons || [];
  for (const reason of [
    'license verification evidence is incomplete',
    'insurance verification evidence is incomplete',
    'business identity verification evidence is incomplete',
  ]) {
    assert(verificationMissingReasons.includes(reason), `Missing verification evidence must include: ${reason}`);
  }

  const verificationWrongEntityType = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({
      workflow: 'verification_triage',
      entity_type: 'contractor_loan',
      entity_id: 'verification-smoke-wrong-entity-type',
      facts: {
        license_status: 'passed',
        insurance_status: 'passed',
        business_identity_status: 'passed',
      },
    }),
  });
  assert(
    verificationWrongEntityType.status === 400,
    `Expected verification wrong entity type 400, got ${verificationWrongEntityType.status}`
  );
  assert(
    verificationWrongEntityType.headers.get('x-request-id') === requestId,
    'Verification wrong entity type must echo request id'
  );
  assert(
    verificationWrongEntityType.body?.details?.includes('entity_type must be verification_check'),
    'Verification wrong entity type must explain the verification_check boundary'
  );
  assertNoRecommendationDraft('Verification wrong entity type response', verificationWrongEntityType.body);

  const paymentExceptionReady = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({
      workflow: 'payment_exception_review',
      entity_type: 'payment_exception',
      entity_id: 'payment-exception-smoke-local-001',
      input_refs: ['payment_intent', 'payment_event', 'provider_webhook', 'audit_event'],
      facts: {
        payment_status: 'matched',
        webhook_status: 'verified',
        ledger_status: 'reconciled',
      },
    }),
  });
  assert(
    paymentExceptionReady.status === 201,
    `Expected payment exception recommendation 201, got ${paymentExceptionReady.status}`
  );
  assert(paymentExceptionReady.headers.get('x-request-id') === requestId, 'Payment endpoint must echo request id');
  assert(paymentExceptionReady.body?.audit_event_attempted === false, 'Payment smoke mode must skip audit writes');
  assertNoSecretLeak('Payment exception recommendation response', paymentExceptionReady.body);
  const paymentRecommendation = paymentExceptionReady.body?.recommendation;
  assert(paymentRecommendation?.agent === 'treasury_agent', 'Payment recommendation must come from the treasury agent');
  assert(
    paymentRecommendation?.workflow === 'payment_exception_review',
    'Payment recommendation workflow must remain payment_exception_review'
  );
  assert(
    paymentRecommendation?.entity_type === 'payment_exception',
    'Payment recommendation entity_type must remain payment_exception'
  );
  assert(paymentRecommendation?.entity_id === 'payment-exception-smoke-local-001', 'Payment must preserve entity_id');
  assert(paymentRecommendation?.required_human_review === true, 'Payment must require human review');
  assert(paymentRecommendation?.audit_event_required === true, 'Payment must require audit outside smoke mode');
  assert(paymentRecommendation?.local_only === true, 'Payment must stay local-only');
  assert(paymentRecommendation?.live_action_status === 'BLOCKED_FOR_LIVE', 'Payment must block live action');
  assert(
    paymentRecommendation?.recommendation === 'treasury_manual_review',
    'Complete payment exception facts must remain treasury-review only'
  );
  assert(
    paymentRecommendation?.reasons?.includes('local-only payment exception packet is ready for treasury review'),
    'Complete payment facts must produce a treasury-review-ready reason'
  );

  const paymentExceptionMissingEvidence = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    body: JSON.stringify({
      workflow: 'payment_exception_review',
      entity_type: 'payment_exception',
      entity_id: 'payment-exception-smoke-missing-evidence',
      input_refs: ['payment_intent'],
      facts: {
        payment_status: 'unmatched',
        webhook_status: 'missing',
        ledger_status: 'unreconciled',
      },
    }),
  });
  assert(
    paymentExceptionMissingEvidence.status === 201,
    `Expected payment missing-evidence recommendation 201, got ${paymentExceptionMissingEvidence.status}`
  );
  assertNoSecretLeak('Payment missing-evidence recommendation response', paymentExceptionMissingEvidence.body);
  assert(
    paymentExceptionMissingEvidence.body?.recommendation?.recommendation === 'reconcile_payment_exception',
    'Missing payment evidence must request reconciliation'
  );
  const paymentMissingReasons = paymentExceptionMissingEvidence.body?.recommendation?.reasons || [];
  for (const reason of [
    'payment intent status needs reconciliation',
    'provider webhook evidence is incomplete',
    'payment ledger reconciliation is incomplete',
  ]) {
    assert(paymentMissingReasons.includes(reason), `Missing payment evidence must include: ${reason}`);
  }

  const paymentWrongEntityType = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({
      workflow: 'payment_exception_review',
      entity_type: 'contractor_loan',
      entity_id: 'payment-exception-smoke-wrong-entity-type',
      facts: {
        payment_status: 'matched',
        webhook_status: 'verified',
        ledger_status: 'reconciled',
      },
    }),
  });
  assert(
    paymentWrongEntityType.status === 400,
    `Expected payment wrong entity type 400, got ${paymentWrongEntityType.status}`
  );
  assert(paymentWrongEntityType.headers.get('x-request-id') === requestId, 'Payment wrong entity type must echo request id');
  assert(
    paymentWrongEntityType.body?.details?.includes('entity_type must be payment_exception'),
    'Payment wrong entity type must explain the payment_exception boundary'
  );
  assertNoRecommendationDraft('Payment wrong entity type response', paymentWrongEntityType.body);

  const disputeReady = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({
      workflow: 'dispute_evidence_summary',
      entity_type: 'dispute',
      entity_id: 'dispute-smoke-local-001',
      input_refs: ['dispute', 'evidence', 'milestone', 'peer_review'],
      facts: {
        dispute_status: 'open',
        evidence_status: 'complete',
        milestone_status: 'documented',
        peer_review_status: 'available',
      },
    }),
  });
  assert(disputeReady.status === 201, `Expected dispute recommendation 201, got ${disputeReady.status}`);
  assert(disputeReady.headers.get('x-request-id') === requestId, 'Dispute endpoint must echo request id');
  assert(disputeReady.body?.audit_event_attempted === false, 'Dispute smoke mode must skip audit writes');
  assertNoSecretLeak('Dispute recommendation response', disputeReady.body);
  const disputeRecommendation = disputeReady.body?.recommendation;
  assert(disputeRecommendation?.agent === 'dispute_triage_agent', 'Dispute recommendation must come from dispute triage agent');
  assert(
    disputeRecommendation?.workflow === 'dispute_evidence_summary',
    'Dispute recommendation workflow must remain dispute_evidence_summary'
  );
  assert(disputeRecommendation?.entity_type === 'dispute', 'Dispute recommendation entity_type must remain dispute');
  assert(disputeRecommendation?.entity_id === 'dispute-smoke-local-001', 'Dispute must preserve entity_id');
  assert(disputeRecommendation?.required_human_review === true, 'Dispute must require human review');
  assert(disputeRecommendation?.audit_event_required === true, 'Dispute must require audit outside smoke mode');
  assert(disputeRecommendation?.local_only === true, 'Dispute must stay local-only');
  assert(disputeRecommendation?.live_action_status === 'BLOCKED_FOR_LIVE', 'Dispute must block live action');
  assert(
    disputeRecommendation?.recommendation === 'dispute_manual_review',
    'Complete dispute facts must remain manual-review only'
  );
  assert(
    disputeRecommendation?.reasons?.includes('local-only dispute evidence packet is ready for human review'),
    'Complete dispute facts must produce a human-review-ready reason'
  );

  const disputeMissingEvidence = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    body: JSON.stringify({
      workflow: 'dispute_evidence_summary',
      entity_type: 'dispute',
      entity_id: 'dispute-smoke-missing-evidence',
      input_refs: ['dispute'],
      facts: {
        dispute_status: 'open',
        evidence_status: 'missing',
        milestone_status: 'unknown',
        peer_review_status: 'missing',
      },
    }),
  });
  assert(
    disputeMissingEvidence.status === 201,
    `Expected dispute missing-evidence recommendation 201, got ${disputeMissingEvidence.status}`
  );
  assertNoSecretLeak('Dispute missing-evidence recommendation response', disputeMissingEvidence.body);
  assert(
    disputeMissingEvidence.body?.recommendation?.recommendation === 'collect_missing_dispute_evidence',
    'Missing dispute evidence must request evidence collection'
  );
  const disputeMissingReasons = disputeMissingEvidence.body?.recommendation?.reasons || [];
  for (const reason of [
    'dispute evidence metadata is incomplete',
    'milestone or scope status needs documentation',
    'peer review or inspection notes are incomplete',
  ]) {
    assert(disputeMissingReasons.includes(reason), `Missing dispute evidence must include: ${reason}`);
  }

  const disputeWrongEntityType = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({
      workflow: 'dispute_evidence_summary',
      entity_type: 'payment_exception',
      entity_id: 'dispute-smoke-wrong-entity-type',
      facts: {
        dispute_status: 'open',
        evidence_status: 'complete',
        milestone_status: 'documented',
        peer_review_status: 'available',
      },
    }),
  });
  assert(
    disputeWrongEntityType.status === 400,
    `Expected dispute wrong entity type 400, got ${disputeWrongEntityType.status}`
  );
  assert(disputeWrongEntityType.headers.get('x-request-id') === requestId, 'Dispute wrong entity type must echo request id');
  assert(
    disputeWrongEntityType.body?.details?.includes('entity_type must be dispute'),
    'Dispute wrong entity type must explain the dispute boundary'
  );
  assertNoRecommendationDraft('Dispute wrong entity type response', disputeWrongEntityType.body);

  const documentReady = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({
      workflow: 'draft_document_packet',
      entity_type: 'document_packet',
      entity_id: 'document-packet-smoke-local-001',
      input_refs: ['project_contract', 'milestones', 'scope', 'change_orders'],
      facts: {
        contract_status: 'drafted',
        milestone_status: 'documented',
        scope_status: 'documented',
        attorney_review_status: 'pending',
        signature_status: 'pending',
      },
    }),
  });
  assert(documentReady.status === 201, `Expected document recommendation 201, got ${documentReady.status}`);
  assert(documentReady.headers.get('x-request-id') === requestId, 'Document endpoint must echo request id');
  assert(documentReady.body?.audit_event_attempted === false, 'Document smoke mode must skip audit writes');
  assertNoSecretLeak('Document recommendation response', documentReady.body);
  const documentRecommendation = documentReady.body?.recommendation;
  assert(documentRecommendation?.agent === 'document_generation_agent', 'Document recommendation must come from document generation agent');
  assert(
    documentRecommendation?.workflow === 'draft_document_packet',
    'Document recommendation workflow must remain draft_document_packet'
  );
  assert(documentRecommendation?.entity_type === 'document_packet', 'Document recommendation entity_type must remain document_packet');
  assert(documentRecommendation?.entity_id === 'document-packet-smoke-local-001', 'Document must preserve entity_id');
  assert(documentRecommendation?.required_human_review === true, 'Document must require human review');
  assert(documentRecommendation?.audit_event_required === true, 'Document must require audit outside smoke mode');
  assert(documentRecommendation?.local_only === true, 'Document must stay local-only');
  assert(documentRecommendation?.live_action_status === 'BLOCKED_FOR_LIVE', 'Document must block live action');
  assert(
    documentRecommendation?.recommendation === 'document_packet_manual_review',
    'Complete document facts must remain manual-review only'
  );
  assert(
    documentRecommendation?.reasons?.includes('local-only document packet outline is ready for attorney/founder review'),
    'Complete document facts must produce an attorney/founder review-ready reason'
  );

  const documentMissingEvidence = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    body: JSON.stringify({
      workflow: 'draft_document_packet',
      entity_type: 'document_packet',
      entity_id: 'document-packet-smoke-missing-evidence',
      input_refs: ['project_contract'],
      facts: {
        contract_status: 'missing',
        milestone_status: 'unknown',
        scope_status: 'missing',
        attorney_review_status: 'unknown',
        signature_status: 'unknown',
      },
    }),
  });
  assert(
    documentMissingEvidence.status === 201,
    `Expected document missing-evidence recommendation 201, got ${documentMissingEvidence.status}`
  );
  assertNoSecretLeak('Document missing-evidence recommendation response', documentMissingEvidence.body);
  assert(
    documentMissingEvidence.body?.recommendation?.recommendation === 'collect_missing_document_packet_inputs',
    'Missing document packet evidence must request document input collection'
  );
  const documentMissingReasons = documentMissingEvidence.body?.recommendation?.reasons || [];
  for (const reason of [
    'project contract draft metadata is incomplete',
    'milestone schedule needs documentation',
    'scope or change-order references need documentation',
    'attorney review status must remain explicit',
    'signature readiness status must remain explicit',
  ]) {
    assert(documentMissingReasons.includes(reason), `Missing document packet evidence must include: ${reason}`);
  }

  const documentWrongEntityType = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({
      workflow: 'draft_document_packet',
      entity_type: 'dispute',
      entity_id: 'document-packet-smoke-wrong-entity-type',
      facts: {
        contract_status: 'drafted',
        milestone_status: 'documented',
        scope_status: 'documented',
        attorney_review_status: 'pending',
        signature_status: 'pending',
      },
    }),
  });
  assert(
    documentWrongEntityType.status === 400,
    `Expected document wrong entity type 400, got ${documentWrongEntityType.status}`
  );
  assert(documentWrongEntityType.headers.get('x-request-id') === requestId, 'Document wrong entity type must echo request id');
  assert(
    documentWrongEntityType.body?.details?.includes('entity_type must be document_packet'),
    'Document wrong entity type must explain the document_packet boundary'
  );
  assertNoRecommendationDraft('Document wrong entity type response', documentWrongEntityType.body);

  const matchingReady = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({
      workflow: 'job_match_ranking',
      entity_type: 'job_match',
      entity_id: 'job-match-smoke-local-001',
      input_refs: ['job', 'contractor', 'license', 'availability'],
      facts: {
        job_status: 'draft',
        contractor_status: 'verified_local',
        geo_match_status: 'matched',
        license_match_status: 'matched',
        availability_status: 'available',
      },
    }),
  });
  assert(matchingReady.status === 201, `Expected matching recommendation 201, got ${matchingReady.status}`);
  assert(matchingReady.headers.get('x-request-id') === requestId, 'Matching endpoint must echo request id');
  assert(matchingReady.body?.audit_event_attempted === false, 'Matching smoke mode must skip audit writes');
  assertNoSecretLeak('Matching recommendation response', matchingReady.body);
  const matchingRecommendation = matchingReady.body?.recommendation;
  assert(matchingRecommendation?.agent === 'contractor_matching_agent', 'Matching recommendation must come from contractor matching agent');
  assert(
    matchingRecommendation?.workflow === 'job_match_ranking',
    'Matching recommendation workflow must remain job_match_ranking'
  );
  assert(matchingRecommendation?.entity_type === 'job_match', 'Matching recommendation entity_type must remain job_match');
  assert(matchingRecommendation?.entity_id === 'job-match-smoke-local-001', 'Matching must preserve entity_id');
  assert(matchingRecommendation?.required_human_review === true, 'Matching must require human review');
  assert(matchingRecommendation?.audit_event_required === true, 'Matching must require audit outside smoke mode');
  assert(matchingRecommendation?.local_only === true, 'Matching must stay local-only');
  assert(matchingRecommendation?.live_action_status === 'BLOCKED_FOR_LIVE', 'Matching must block live action');
  assert(
    matchingRecommendation?.recommendation === 'job_match_manual_review',
    'Complete matching facts must remain manual-review only'
  );
  assert(
    matchingRecommendation?.reasons?.includes('local-only job match packet is ready for founder/admin review'),
    'Complete matching facts must produce a founder/admin review-ready reason'
  );

  const matchingMissingEvidence = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    body: JSON.stringify({
      workflow: 'job_match_ranking',
      entity_type: 'job_match',
      entity_id: 'job-match-smoke-missing-evidence',
      input_refs: ['job'],
      facts: {
        job_status: 'unknown',
        contractor_status: 'missing',
        geo_match_status: 'unknown',
        license_match_status: 'missing',
        availability_status: 'unknown',
      },
    }),
  });
  assert(
    matchingMissingEvidence.status === 201,
    `Expected matching missing-evidence recommendation 201, got ${matchingMissingEvidence.status}`
  );
  assertNoSecretLeak('Matching missing-evidence recommendation response', matchingMissingEvidence.body);
  assert(
    matchingMissingEvidence.body?.recommendation?.recommendation === 'collect_missing_job_match_inputs',
    'Missing matching evidence must request match input collection'
  );
  const matchingMissingReasons = matchingMissingEvidence.body?.recommendation?.reasons || [];
  for (const reason of [
    'job scope/status metadata is incomplete',
    'contractor profile or verification status is incomplete',
    'job-to-contractor geography needs confirmation',
    'license or trade fit needs confirmation',
    'contractor availability needs confirmation',
  ]) {
    assert(matchingMissingReasons.includes(reason), `Missing matching evidence must include: ${reason}`);
  }

  const matchingWrongEntityType = await request(baseUrl, '/api/admin/ai-agents/recommendations', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({
      workflow: 'job_match_ranking',
      entity_type: 'document_packet',
      entity_id: 'job-match-smoke-wrong-entity-type',
      facts: {
        job_status: 'draft',
        contractor_status: 'verified_local',
        geo_match_status: 'matched',
        license_match_status: 'matched',
        availability_status: 'available',
      },
    }),
  });
  assert(
    matchingWrongEntityType.status === 400,
    `Expected matching wrong entity type 400, got ${matchingWrongEntityType.status}`
  );
  assert(matchingWrongEntityType.headers.get('x-request-id') === requestId, 'Matching wrong entity type must echo request id');
  assert(
    matchingWrongEntityType.body?.details?.includes('entity_type must be job_match'),
    'Matching wrong entity type must explain the job_match boundary'
  );
  assertNoRecommendationDraft('Matching wrong entity type response', matchingWrongEntityType.body);

  for (const action of [
    'approve_real_loan',
    'fund_contractor',
    'route_repayment',
    'release_escrow',
    'settle_stablecoin',
    'lock_token_collateral',
    'move_money',
    'legal_decision',
  ]) {
    assert(recommendation.blocked_actions?.includes(action), `Recommendation must block ${action}`);
  }
  for (const action of [
    'approve_contractor_verification',
    'override_license_check',
    'activate_provider_account',
    'approve_real_loan',
    'move_money',
    'legal_decision',
  ]) {
    assert(verificationRecommendation.blocked_actions?.includes(action), `Verification must block ${action}`);
  }
  for (const action of [
    'issue_refund',
    'release_escrow',
    'change_payout_destination',
    'execute_treasury_action',
    'move_money',
    'legal_decision',
  ]) {
    assert(paymentRecommendation.blocked_actions?.includes(action), `Payment exception must block ${action}`);
  }
  for (const action of [
    'decide_dispute',
    'release_escrow',
    'issue_refund',
    'assign_final_liability',
    'move_money',
    'legal_decision',
  ]) {
    assert(disputeRecommendation.blocked_actions?.includes(action), `Dispute must block ${action}`);
  }
  for (const action of [
    'send_legal_document',
    'bind_contract',
    'request_signature',
    'file_lien_waiver',
    'move_money',
    'legal_decision',
  ]) {
    assert(documentRecommendation.blocked_actions?.includes(action), `Document packet must block ${action}`);
  }
  for (const action of [
    'publish_real_lead',
    'assign_contractor',
    'start_escrow',
    'charge_lead_token',
    'move_money',
    'legal_decision',
  ]) {
    assert(matchingRecommendation.blocked_actions?.includes(action), `Matching must block ${action}`);
  }

  const safeScopeText = (valid.body?.safe_scope || []).join(' ').toLowerCase();
  for (const phrase of [
    'local structured recommendation only',
    'does not approve real loans',
    'fund contractors',
    'route repayment',
    'release escrow',
    'settle stablecoins',
    'lock token collateral',
    'legal decisions',
    'human founder/admin/legal/provider review remains required',
  ]) {
    assert(safeScopeText.includes(phrase.toLowerCase()), `Safe scope must include: ${phrase}`);
  }

  console.log(JSON.stringify({
    status: 'passed',
    endpoint_checked: '/api/admin/ai-agents/recommendations',
    workflow_catalog_endpoint_checked: '/api/admin/ai-agents/workflows',
    request_id_checked: requestId,
    audit_mode_checked: process.env.SMARTCONTRACTOR_AI_AGENT_AUDIT_MODE,
    catalog_safety_boundaries_checked: true,
    catalog_workflow_ids_checked: catalogWorkflowIds,
    catalog_workflow_versions_checked: catalogWorkflowVersions,
    catalog_workflow_agents_checked: catalogWorkflowAgents,
    catalog_workflow_entity_types_checked: catalogWorkflowEntityTypes,
    catalog_workflow_input_refs_checked: catalogWorkflowInputRefs,
    catalog_workflow_supported_facts_checked: catalogWorkflowSupportedFacts,
    catalog_workflow_blocked_actions_checked: catalogWorkflowBlockedActions,
    catalog_workflow_required_permissions_checked: catalogWorkflowRequiredPermissions,
    catalog_workflow_modes_checked: catalogWorkflowModes,
    catalog_workflow_live_action_statuses_checked: catalogWorkflowLiveActionStatuses,
    catalog_workflow_local_only_statuses_checked: catalogWorkflowLocalOnlyStatuses,
    catalog_workflow_human_review_statuses_checked: catalogWorkflowHumanReviewStatuses,
    catalog_workflow_coverage_checked: {
      workflows: workflowCatalog.body.supported_workflows.length,
      live_blocked: catalogLiveBlockedCount,
      local_only: catalogLocalOnlyCount,
      human_review_required: catalogHumanReviewCount,
      audit_required: catalogAuditRequiredCount,
      blocked_actions: catalogBlockedActionsCoverageCount,
      required_input_refs: catalogInputRefsCoverageCount,
      supported_facts: catalogSupportedFactsCoverageCount,
    },
    blocked_actions_checked: recommendation.blocked_actions.length,
    verification_blocked_actions_checked: verificationRecommendation.blocked_actions.length,
    payment_blocked_actions_checked: paymentRecommendation.blocked_actions.length,
    dispute_blocked_actions_checked: disputeRecommendation.blocked_actions.length,
    document_blocked_actions_checked: documentRecommendation.blocked_actions.length,
    matching_blocked_actions_checked: matchingRecommendation.blocked_actions.length,
    live_action_status_checked: recommendation.live_action_status,
  }, null, 2));
} finally {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}
