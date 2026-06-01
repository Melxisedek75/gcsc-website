import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const serverSource = readFileSync('server.js', 'utf8');

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
  'buildSmartContractorWorkflowReadiness',
  'homeowner_project_request',
  'contractor_bid_review',
  'project_contract_record',
  'escrow_ready_milestones',
  'partner_reviewed_working_capital',
  'dispute_evidence_packet',
  'admin_founder_review',
  'Construction Trust Infrastructure',
  'BLOCKED_FOR_LIVE',
  'no_real_payments',
  'no_live_loan_approval',
  'no_escrow_release',
  'no_token_collateral_lock',
].forEach((snippet) => {
  assert(serverSource.includes(snippet), `server.js must include ${snippet}`);
});

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

  console.log(JSON.stringify({
    status: 'passed',
    endpoint: '/api/admin/smartcontractor-workflow-readiness',
    workflow_steps: response.body.workflow_steps.length,
    request_id: response.body.request_id,
  }, null, 2));
} finally {
  server.close();
}
