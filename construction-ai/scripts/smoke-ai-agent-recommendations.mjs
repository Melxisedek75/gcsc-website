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
    'risk_assessment_agent',
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
  assert(
    workflowCatalog.body?.supported_workflows?.some((workflow) => workflow.workflow === 'starter_loan_review'),
    'Workflow catalog must include starter_loan_review'
  );
  assertNoSecretLeak('Workflow catalog response', workflowCatalog.body);
  const starterLoanWorkflow = workflowCatalog.body.supported_workflows.find(
    (workflow) => workflow.workflow === 'starter_loan_review'
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
    invalid.body?.details?.includes('workflow must be starter_loan_review'),
    'Invalid workflow must explain the supported local workflow'
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
    live_action_status_checked: recommendation.live_action_status,
  }, null, 2));
} finally {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}
