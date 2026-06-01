import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const serverSource = readFileSync('server.js', 'utf8');
const readinessModulePath = 'src/smartcontractor/workflow-readiness.cjs';

function fail(message) {
  console.error(`SmartContractor workflow readiness smoke failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
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

[
  "app.get('/api/admin/smartcontractor-workflow-readiness'",
  "require('./src/smartcontractor/workflow-readiness.cjs')",
  'smartContractorWorkflowReadiness.buildSmartContractorWorkflowReadiness()',
  'buildSmartContractorWorkflowReadiness',
].forEach((snippet) => {
  assert(serverSource.includes(snippet), `server.js must include ${snippet}`);
});

assert(existsSync(readinessModulePath), 'Workflow readiness payload must live in src/smartcontractor/workflow-readiness.cjs');
const readinessModuleSource = readFileSync(readinessModulePath, 'utf8');
const { buildSmartContractorWorkflowReadiness } = require('../src/smartcontractor/workflow-readiness.cjs');

[
  'homeowner_project_request',
  'contractor_bid_review',
  'project_contract_record',
  'escrow_ready_milestones',
  'partner_reviewed_working_capital',
  'dispute_evidence_packet',
  'admin_founder_review',
  'milestone_evidence_ready',
  'working_capital_review_ready',
  'dispute_packet_ready',
  'founder_authority_ready',
  'Construction Trust Infrastructure',
  'BLOCKED_FOR_LIVE',
  'no_real_payments',
  'no_live_loan_approval',
  'no_escrow_release',
  'no_token_collateral_lock',
].forEach((snippet) => {
  assert(readinessModuleSource.includes(snippet), `workflow-readiness module must include ${snippet}`);
});

const localPayload = buildSmartContractorWorkflowReadiness();
assert(localPayload.status === 'local_demo_ready', 'Workflow readiness module must return local_demo_ready');
assert(localPayload.workflow_steps?.length === 7, 'Workflow readiness module must return seven workflow steps');
assert(localPayload.review_checkpoints?.length === 4, 'Workflow readiness module must return four review checkpoints');

process.env.VERCEL = '1';
const app = require('../server.js');
const server = app.listen(0);

try {
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const response = await request(baseUrl, '/api/admin/smartcontractor-workflow-readiness', {
    headers: { 'X-Request-Id': 'gcsc-workflow-readiness-smoke' },
  });

  assert(response.status === 200, `Expected workflow readiness 200, got ${response.status}`);
  assert(
    response.headers.get('x-request-id') === 'gcsc-workflow-readiness-smoke',
    'Workflow readiness must echo a safe X-Request-Id header'
  );
  assert(
    response.headers.get('cache-control') === 'no-store',
    'Workflow readiness must use Cache-Control: no-store for admin readiness data'
  );
  assert(
    response.headers.get('x-smartcontractor-demo-only') === 'true',
    'Workflow readiness must expose a demo-only response header'
  );
  assert(
    response.headers.get('x-smartcontractor-live-actions') === 'blocked',
    'Workflow readiness must expose blocked live-action response header'
  );
  assert(
    response.body?.request_id === 'gcsc-workflow-readiness-smoke',
    'Workflow readiness must include request_id in the response body'
  );
  assert(response.body?.status === 'local_demo_ready', 'Workflow readiness must be local_demo_ready');
  assert(response.body?.positioning === 'Construction Trust Infrastructure', 'Workflow readiness must expose positioning');
  assert(Array.isArray(response.body?.workflow_steps), 'Workflow readiness must return workflow_steps');
  assert(response.body.workflow_steps.length === 7, 'Workflow readiness must return the seven-step product workflow');

  const stepIds = response.body.workflow_steps.map((step) => step.id);
  [
    'homeowner_project_request',
    'contractor_bid_review',
    'project_contract_record',
    'escrow_ready_milestones',
    'partner_reviewed_working_capital',
    'dispute_evidence_packet',
    'admin_founder_review',
  ].forEach((id) => assert(stepIds.includes(id), `Workflow readiness must include step ${id}`));

  assert(
    response.body.workflow_steps.every((step) => step.live_action_status === 'BLOCKED_FOR_LIVE'),
    'Every workflow step must remain BLOCKED_FOR_LIVE'
  );
  assert(
    response.body.workflow_steps.every((step) => Array.isArray(step.required_api_routes) && step.required_api_routes.length > 0),
    'Every workflow step must list required API routes'
  );
  assert(
    response.body.workflow_steps.some((step) => step.required_api_routes.includes('/api/smartcontractor/milestones')),
    'Workflow readiness must link milestone API routes'
  );
  assert(
    response.body.workflow_steps.some((step) => step.required_api_routes.includes('/api/smartcontractor/disputes')),
    'Workflow readiness must link dispute API routes'
  );
  assert(Array.isArray(response.body?.review_checkpoints), 'Workflow readiness must return review_checkpoints');
  assert(response.body.review_checkpoints.length === 4, 'Workflow readiness must return four admin review checkpoints');
  const checkpointIds = response.body.review_checkpoints.map((checkpoint) => checkpoint.id);
  [
    'milestone_evidence_ready',
    'working_capital_review_ready',
    'dispute_packet_ready',
    'founder_authority_ready',
  ].forEach((id) => assert(checkpointIds.includes(id), `Workflow readiness must include checkpoint ${id}`));
  assert(
    response.body.review_checkpoints.every((checkpoint) => checkpoint.status === 'REVIEW_REQUIRED'),
    'Every workflow readiness checkpoint must remain REVIEW_REQUIRED'
  );
  assert(
    response.body.review_checkpoints.every((checkpoint) => Array.isArray(checkpoint.required_evidence) && checkpoint.required_evidence.length >= 3),
    'Every workflow readiness checkpoint must list required evidence'
  );
  assert(
    response.body.review_checkpoints.every((checkpoint) => Array.isArray(checkpoint.blocked_live_actions) && checkpoint.blocked_live_actions.length >= 2),
    'Every workflow readiness checkpoint must list blocked live actions'
  );
  assert(
    response.body.review_checkpoints.some((checkpoint) => checkpoint.required_evidence.includes('milestone_photo_or_note_metadata')),
    'Workflow readiness checkpoints must require milestone evidence metadata'
  );
  assert(
    response.body.review_checkpoints.some((checkpoint) => checkpoint.required_evidence.includes('repayment_waterfall_review_packet')),
    'Workflow readiness checkpoints must require repayment waterfall review packet evidence'
  );
  assert(
    response.body.review_checkpoints.some((checkpoint) => checkpoint.blocked_live_actions.includes('issue_refund')),
    'Workflow readiness checkpoints must keep refunds blocked'
  );
  assert(
    response.body.demo_only_boundaries?.includes('no_real_payments'),
    'Workflow readiness must keep real payments blocked'
  );
  assert(
    response.body.demo_only_boundaries?.includes('no_live_loan_approval'),
    'Workflow readiness must keep live loan approval blocked'
  );
  assert(
    response.body.demo_only_boundaries?.includes('no_escrow_release'),
    'Workflow readiness must keep escrow release blocked'
  );
  assert(
    response.body.demo_only_boundaries?.includes('no_token_collateral_lock'),
    'Workflow readiness must keep token collateral blocked'
  );
  assert(
    response.body.next_safe_code_tasks?.some((task) => task.includes('frontend')),
    'Workflow readiness must point to a frontend product-flow integration task'
  );
  assert(
    response.body.review_metrics?.total_steps === 7,
    'Workflow readiness review_metrics must count seven product workflow steps'
  );
  assert(
    response.body.review_metrics?.blocked_live_action_count >= 20,
    'Workflow readiness review_metrics must count blocked live actions'
  );
  assert(
    response.body.review_metrics?.api_route_count >= 12,
    'Workflow readiness review_metrics must count API routes'
  );
  assert(
    response.body.review_metrics?.ui_surface_count >= 15,
    'Workflow readiness review_metrics must count UI surfaces'
  );
  assert(
    response.body.review_metrics?.workflow_step_ids?.includes('partner_reviewed_working_capital'),
    'Workflow readiness review_metrics must list workflow step ids'
  );
  assert(
    response.body.review_metrics?.checkpoint_count === 4,
    'Workflow readiness review_metrics must count review checkpoints'
  );
  assert(
    response.body.review_metrics?.checkpoint_ids?.includes('working_capital_review_ready'),
    'Workflow readiness review_metrics must list checkpoint ids'
  );
  assert(
    response.body.go_no_go?.current_state === 'GO_LOCAL_DEMO_ONLY',
    'Workflow readiness go/no-go must allow only local demo work'
  );
  assert(
    response.body.go_no_go?.public_beta_state === 'REVIEW_FOUNDER_AUTH_AND_QA',
    'Workflow readiness go/no-go must require founder Auth/Admin and QA review before public beta'
  );
  assert(
    response.body.go_no_go?.real_money_state === 'NO_GO_BLOCKED_FOR_LIVE',
    'Workflow readiness go/no-go must block real-money work'
  );
  assert(
    response.body.go_no_go?.required_before_public_beta?.includes('Founder Auth/Admin smoke evidence'),
    'Workflow readiness go/no-go must require Founder Auth/Admin smoke evidence before public beta'
  );
  [
    'real_payments',
    'live_loan_approval',
    'escrow_release',
    'token_collateral_lock',
  ].forEach((blockedAction) => {
    assert(
      response.body.go_no_go?.blocked_live_actions?.includes(blockedAction),
      `Workflow readiness go/no-go must block ${blockedAction}`
    );
  });
  assert(
    response.body.ui_next_integration?.target_panel === 'Admin workflow readiness panel',
    'Workflow readiness must define the next Admin UI integration panel'
  );
  assert(
    response.body.ui_next_integration?.recommended_method === 'GET /api/admin/smartcontractor-workflow-readiness',
    'Workflow readiness must define the Admin UI API method'
  );
  assert(
    response.body.ui_next_integration?.must_preserve?.includes('X-Request-Id'),
    'Workflow readiness UI integration must preserve X-Request-Id traceability'
  );

  console.log(JSON.stringify({
    status: 'passed',
    endpoint: '/api/admin/smartcontractor-workflow-readiness',
    workflow_steps: response.body.workflow_steps.length,
    request_id: response.body.request_id,
  }, null, 2));
} finally {
  server.close();
}
