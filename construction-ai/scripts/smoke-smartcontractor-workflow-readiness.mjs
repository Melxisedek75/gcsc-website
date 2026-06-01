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
  'smartContractorWorkflowReadiness.buildSmartContractorWorkflowReadiness',
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
  'next_review_action',
  'blocked_until',
  'review_packet_target',
  'checkpoint_action_queue',
  'admin_queue_state',
  'READY_FOR_LOCAL_REVIEW',
  'checkpoint_queue_filters',
  'all_review_items',
  'filter_value',
  'selected_checkpoint_queue_filter',
  'filtered_checkpoint_action_queue',
  'valid_checkpoint_queue_filter_ids',
  'selected_checkpoint_queue_review_context',
  'selected_checkpoint_queue_review_links',
  'checkpointReviewPacketLinks',
  'review_packet_targets',
  'local_anchor',
  'route_hint',
  'safe_scope',
].forEach((snippet) => {
  assert(readinessModuleSource.includes(snippet), `workflow-readiness module must include ${snippet}`);
});

const localPayload = buildSmartContractorWorkflowReadiness();
assert(localPayload.status === 'local_demo_ready', 'Workflow readiness module must return local_demo_ready');
assert(localPayload.workflow_steps?.length === 7, 'Workflow readiness module must return seven workflow steps');
assert(localPayload.review_checkpoints?.length === 4, 'Workflow readiness module must return four review checkpoints');
assert(localPayload.checkpoint_action_queue?.length === 4, 'Workflow readiness module must return four checkpoint action queue items');
assert(localPayload.checkpoint_queue_filters?.length === 5, 'Workflow readiness module must return five checkpoint queue filters');
assert(localPayload.selected_checkpoint_queue_filter?.id === 'all_review_items', 'Workflow readiness module must default to all review items filter');
assert(localPayload.filtered_checkpoint_action_queue?.length === 4, 'Workflow readiness module must default filtered queue to four review items');
assert(localPayload.selected_checkpoint_queue_review_context?.queue_item_count === 4, 'Workflow readiness module must default selected review context to four queue items');
assert(localPayload.selected_checkpoint_queue_review_context?.review_packet_targets?.includes('escrow_provider_review_packet'), 'Workflow readiness module must include selected review packet targets');
assert(localPayload.selected_checkpoint_queue_review_links?.length === 4, 'Workflow readiness module must default selected review links to four packet links');
assert(localPayload.selected_checkpoint_queue_review_links.every((link) => link.live_action_status === 'BLOCKED_FOR_LIVE'), 'Workflow readiness module selected review links must keep live actions blocked');
assert(localPayload.selected_checkpoint_queue_review_links.some((link) => link.review_packet_target === 'working_capital_provider_review_packet'), 'Workflow readiness module selected review links must include working-capital packet link');
const workingCapitalPayload = buildSmartContractorWorkflowReadiness({ queue_filter: 'working_capital_review' });
assert(workingCapitalPayload.selected_checkpoint_queue_filter?.id === 'working_capital_review', 'Workflow readiness module must select working-capital queue filter');
assert(workingCapitalPayload.filtered_checkpoint_action_queue?.length === 1, 'Workflow readiness module must filter working-capital queue to one item');
assert(workingCapitalPayload.filtered_checkpoint_action_queue?.[0]?.checkpoint_id === 'working_capital_review_ready', 'Workflow readiness module must map working-capital queue filter to working-capital checkpoint');
assert(workingCapitalPayload.selected_checkpoint_queue_review_context?.queue_item_count === 1, 'Workflow readiness module must filter selected review context to one item');
assert(workingCapitalPayload.selected_checkpoint_queue_review_context?.review_packet_targets?.[0] === 'working_capital_provider_review_packet', 'Workflow readiness module must expose selected working-capital packet target');
assert(workingCapitalPayload.selected_checkpoint_queue_review_links?.length === 1, 'Workflow readiness module must filter selected review links to one packet link');
assert(workingCapitalPayload.selected_checkpoint_queue_review_links?.[0]?.route_hint === '/api/admin/contract-backed-loan/repayment-waterfall/review-packet', 'Workflow readiness module must link working-capital review to repayment waterfall packet route');
assert(workingCapitalPayload.selected_checkpoint_queue_review_context?.blocked_live_actions?.includes('approve_real_loan'), 'Workflow readiness module must expose selected working-capital blocked live actions');
assert(workingCapitalPayload.selected_checkpoint_queue_review_context?.safe_scope?.includes('no_live_payment_loan_escrow_or_token_action'), 'Workflow readiness module must expose selected review context safe scope');

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
    response.body.review_checkpoints.every((checkpoint) => typeof checkpoint.next_review_action === 'string' && checkpoint.next_review_action.length > 20),
    'Every workflow readiness checkpoint must include a concrete next review action'
  );
  assert(
    response.body.review_checkpoints.every((checkpoint) => typeof checkpoint.blocked_until === 'string' && checkpoint.blocked_until.length > 8),
    'Every workflow readiness checkpoint must include blocked_until review gate text'
  );
  assert(
    response.body.review_checkpoints.every((checkpoint) => typeof checkpoint.review_packet_target === 'string' && checkpoint.review_packet_target.length > 12),
    'Every workflow readiness checkpoint must include a review_packet_target'
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
    response.body.review_checkpoints.some((checkpoint) => checkpoint.blocked_until === 'founder_explicit_approval'),
    'Workflow readiness checkpoints must include founder explicit approval as a blocked-until gate'
  );
  assert(
    response.body.review_checkpoints.some((checkpoint) => checkpoint.review_packet_target === 'working_capital_provider_review_packet'),
    'Workflow readiness checkpoints must include the working-capital provider review packet target'
  );
  assert(Array.isArray(response.body?.checkpoint_action_queue), 'Workflow readiness must return checkpoint_action_queue');
  assert(response.body.checkpoint_action_queue.length === 4, 'Workflow readiness must return four checkpoint action queue items');
  assert(
    response.body.checkpoint_action_queue.every((item, index) => item.priority === index + 1),
    'Workflow readiness checkpoint action queue must preserve 1-based review priority'
  );
  assert(
    response.body.checkpoint_action_queue.every((item) => checkpointIds.includes(item.checkpoint_id)),
    'Workflow readiness checkpoint action queue must map every item back to a checkpoint id'
  );
  assert(
    response.body.checkpoint_action_queue.every((item) => item.admin_queue_state === 'READY_FOR_LOCAL_REVIEW'),
    'Workflow readiness checkpoint action queue must remain ready for local review only'
  );
  assert(
    response.body.checkpoint_action_queue.every((item) => item.live_action_status === 'BLOCKED_FOR_LIVE'),
    'Workflow readiness checkpoint action queue must keep live actions blocked'
  );
  assert(
    response.body.checkpoint_action_queue.every((item) => item.next_review_action && item.blocked_until && item.review_packet_target),
    'Workflow readiness checkpoint action queue must include next action, blocked-until gate, and review packet target'
  );
  assert(
    response.body.checkpoint_action_queue.some((item) => item.review_packet_target === 'working_capital_provider_review_packet'),
    'Workflow readiness checkpoint action queue must include working-capital provider packet routing'
  );
  assert(Array.isArray(response.body?.checkpoint_queue_filters), 'Workflow readiness must return checkpoint_queue_filters');
  assert(response.body.checkpoint_queue_filters.length === 5, 'Workflow readiness must return five checkpoint queue filters');
  const filterIds = response.body.checkpoint_queue_filters.map((filter) => filter.id);
  [
    'all_review_items',
    'milestone_evidence',
    'working_capital_review',
    'dispute_packet_review',
    'founder_authority_review',
  ].forEach((id) => assert(filterIds.includes(id), `Workflow readiness checkpoint filters must include ${id}`));
  assert(
    response.body.checkpoint_queue_filters.every((filter) => filter.live_action_status === 'BLOCKED_FOR_LIVE'),
    'Workflow readiness checkpoint queue filters must keep live actions blocked'
  );
  assert(
    response.body.checkpoint_queue_filters.every((filter) => typeof filter.filter_field === 'string' && typeof filter.filter_value === 'string'),
    'Workflow readiness checkpoint queue filters must expose filter field and value'
  );
  assert(
    response.body.checkpoint_queue_filters.some((filter) => filter.id === 'all_review_items' && filter.item_count === 4),
    'Workflow readiness all-review-items filter must count all four queue items'
  );
  assert(
    response.body.checkpoint_queue_filters.filter((filter) => filter.filter_field === 'checkpoint_id').every((filter) => filter.item_count === 1),
    'Workflow readiness checkpoint-id filters must map to one queue item each'
  );
  assert(
    response.body.selected_checkpoint_queue_filter?.id === 'all_review_items',
    'Workflow readiness must default selected checkpoint queue filter to all review items'
  );
  assert(
    response.body.filtered_checkpoint_action_queue?.length === 4,
    'Workflow readiness must default filtered checkpoint action queue to all four items'
  );
  assert(
    response.body.valid_checkpoint_queue_filter_ids?.includes('working_capital_review'),
    'Workflow readiness must expose valid checkpoint queue filter ids'
  );
  assert(
    response.body.review_metrics?.selected_checkpoint_queue_item_count === 4,
    'Workflow readiness review_metrics must count selected checkpoint queue items'
  );
  assert(
    response.body.selected_checkpoint_queue_review_context?.queue_item_count === 4,
    'Workflow readiness must default selected review context to four queue items'
  );
  assert(
    response.body.selected_checkpoint_queue_review_context?.review_packet_targets?.length === 4,
    'Workflow readiness must expose selected review context packet targets'
  );
  assert(
    response.body.selected_checkpoint_queue_review_context?.live_action_status === 'BLOCKED_FOR_LIVE',
    'Workflow readiness selected review context must stay blocked for live actions'
  );
  assert(
    response.body.selected_checkpoint_queue_review_links?.length === 4,
    'Workflow readiness must default selected review packet links to four local links'
  );
  assert(
    response.body.selected_checkpoint_queue_review_links.every((link) => link.live_action_status === 'BLOCKED_FOR_LIVE'),
    'Workflow readiness selected review packet links must keep live actions blocked'
  );
  assert(
    response.body.selected_checkpoint_queue_review_links.some((link) => link.review_packet_target === 'working_capital_provider_review_packet'),
    'Workflow readiness selected review packet links must include working-capital provider packet routing'
  );
  const filteredResponse = await request(baseUrl, '/api/admin/smartcontractor-workflow-readiness?queue_filter=working_capital_review', {
    headers: { 'X-Request-Id': 'gcsc-workflow-filter-selected-smoke' },
  });
  assert(filteredResponse.status === 200, `Expected selected workflow readiness 200, got ${filteredResponse.status}`);
  assert(
    filteredResponse.body?.request_id === 'gcsc-workflow-filter-selected-smoke',
    'Selected workflow readiness must include request_id in the response body'
  );
  assert(
    filteredResponse.body?.selected_checkpoint_queue_filter?.id === 'working_capital_review',
    'Selected workflow readiness must apply working-capital queue filter'
  );
  assert(
    filteredResponse.body?.selected_checkpoint_queue_filter?.live_action_status === 'BLOCKED_FOR_LIVE',
    'Selected workflow readiness filter must keep live actions blocked'
  );
  assert(
    filteredResponse.body?.filtered_checkpoint_action_queue?.length === 1,
    'Selected workflow readiness must return one filtered queue item'
  );
  assert(
    filteredResponse.body?.filtered_checkpoint_action_queue?.[0]?.checkpoint_id === 'working_capital_review_ready',
    'Selected workflow readiness must return the working-capital checkpoint queue item'
  );
  assert(
    filteredResponse.body?.review_metrics?.selected_checkpoint_queue_item_count === 1,
    'Selected workflow readiness review_metrics must count one selected queue item'
  );
  assert(
    filteredResponse.body?.selected_checkpoint_queue_review_context?.queue_item_count === 1,
    'Selected workflow readiness review context must count one selected queue item'
  );
  assert(
    filteredResponse.body?.selected_checkpoint_queue_review_context?.review_packet_targets?.[0] === 'working_capital_provider_review_packet',
    'Selected workflow readiness review context must expose working-capital review packet target'
  );
  assert(
    filteredResponse.body?.selected_checkpoint_queue_review_context?.blocked_live_actions?.includes('approve_real_loan'),
    'Selected workflow readiness review context must expose working-capital blocked live actions'
  );
  assert(
    filteredResponse.body?.selected_checkpoint_queue_review_context?.safe_scope?.includes('no_live_payment_loan_escrow_or_token_action'),
    'Selected workflow readiness review context must expose local-only safe scope'
  );
  assert(
    filteredResponse.body?.selected_checkpoint_queue_review_links?.length === 1,
    'Selected workflow readiness review links must filter to one packet link'
  );
  assert(
    filteredResponse.body?.selected_checkpoint_queue_review_links?.[0]?.review_packet_target === 'working_capital_provider_review_packet',
    'Selected workflow readiness review links must expose the working-capital packet target'
  );
  assert(
    filteredResponse.body?.selected_checkpoint_queue_review_links?.[0]?.local_anchor === '#repayment-waterfall-review-packet',
    'Selected workflow readiness review links must expose the working-capital local anchor'
  );
  assert(
    filteredResponse.body?.selected_checkpoint_queue_review_links?.[0]?.route_hint === '/api/admin/contract-backed-loan/repayment-waterfall/review-packet',
    'Selected workflow readiness review links must expose the working-capital route hint'
  );
  const invalidFilterResponse = await request(baseUrl, '/api/admin/smartcontractor-workflow-readiness?queue_filter=approve_real_loan', {
    headers: { 'X-Request-Id': 'gcsc-workflow-filter-invalid-smoke' },
  });
  assert(invalidFilterResponse.status === 400, `Expected invalid workflow readiness filter 400, got ${invalidFilterResponse.status}`);
  assert(
    invalidFilterResponse.body?.request_id === 'gcsc-workflow-filter-invalid-smoke',
    'Invalid workflow readiness filter must include request_id in the response body'
  );
  assert(
    invalidFilterResponse.body?.status === 'BLOCKED_FOR_LIVE',
    'Invalid workflow readiness filter must stay blocked for live actions'
  );
  assert(
    invalidFilterResponse.body?.error === 'Unsupported workflow readiness queue_filter',
    'Invalid workflow readiness filter must return a clear error label'
  );
  assert(
    invalidFilterResponse.body?.valid_checkpoint_queue_filter_ids?.includes('all_review_items'),
    'Invalid workflow readiness filter must return safe valid filter ids'
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
    response.body.review_metrics?.checkpoint_next_action_count === 4,
    'Workflow readiness review_metrics must count checkpoint next review actions'
  );
  assert(
    response.body.review_metrics?.checkpoint_review_packet_target_count === 4,
    'Workflow readiness review_metrics must count checkpoint review packet targets'
  );
  assert(
    response.body.review_metrics?.checkpoint_action_queue_count === 4,
    'Workflow readiness review_metrics must count checkpoint action queue items'
  );
  assert(
    response.body.review_metrics?.checkpoint_action_queue_blocked_count === 4,
    'Workflow readiness review_metrics must count blocked checkpoint action queue items'
  );
  assert(
    response.body.review_metrics?.checkpoint_queue_filter_count === 5,
    'Workflow readiness review_metrics must count checkpoint queue filters'
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
