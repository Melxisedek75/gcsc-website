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
  assert(body?.audit_event_attempted !== true, `${label} must not attempt audit event writes`);
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
    'local_structured_recommendation_only',
    "app.post('/api/admin/ai-agents/recommendations'",
    "requireAdminPermissions(['loan_review_prepare'])",
    'buildStarterLoanReviewRecommendation',
    'buildVerificationTriageRecommendation',
    'risk_assessment_agent',
    'compliance_agent',
    'verification_triage',
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

  const workflowCatalog = await request(baseUrl, '/api/admin/ai-agents/workflows', {
    headers: { 'X-Request-Id': requestId },
  });
  assert(workflowCatalog.status === 200, `Expected workflow catalog 200, got ${workflowCatalog.status}`);
  assert(workflowCatalog.headers.get('x-request-id') === requestId, 'Workflow catalog must echo request id');
  assert(workflowCatalog.body?.request_id === requestId, 'Workflow catalog must include request_id in the response body');
  assert(
    workflowCatalog.body?.supported_workflows?.some((workflow) => workflow.workflow === 'starter_loan_review'),
    'Workflow catalog must include starter_loan_review'
  );
  assert(
    workflowCatalog.body?.supported_workflows?.some((workflow) => workflow.workflow === 'verification_triage'),
    'Workflow catalog must include verification_triage'
  );
  assertNoSecretLeak('Workflow catalog response', workflowCatalog.body);
  const starterLoanWorkflow = workflowCatalog.body.supported_workflows.find(
    (workflow) => workflow.workflow === 'starter_loan_review'
  );
  const verificationWorkflow = workflowCatalog.body.supported_workflows.find(
    (workflow) => workflow.workflow === 'verification_triage'
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
    invalid.body?.details?.includes('workflow must be starter_loan_review or verification_triage'),
    'Invalid workflow must explain the supported local workflows'
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
    blocked_actions_checked: recommendation.blocked_actions.length,
    verification_blocked_actions_checked: verificationRecommendation.blocked_actions.length,
    live_action_status_checked: recommendation.live_action_status,
  }, null, 2));
} finally {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}
