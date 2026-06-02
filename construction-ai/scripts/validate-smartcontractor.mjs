import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';

const requiredFiles = [
  'server.js',
  'public/smartcontractor.html',
  'public/manifest.webmanifest',
  'public/service-worker.js',
  'public/offline.html',
  'scripts/smoke-auth-ownership.mjs',
  '../docs/gcsc-target-architecture.md',
  '../docs/smartcontractor-api.md',
  '../docs/smartcontractor-admin-enforcement-scaffold.md',
  '../docs/smartcontractor-founder-action-center.md',
  '../docs/smartcontractor-admin-role-model.md',
  '../docs/smartcontractor-admin-role-model-draft.sql',
  '../docs/smartcontractor-auth-smoke-tests.md',
  '../docs/smartcontractor-auth-decision-package.md',
  '../docs/smartcontractor-auth-rls-plan.md',
  '../docs/smartcontractor-backlog.md',
  '../docs/smartcontractor-profile-ownership-draft.sql',
  '../docs/smartcontractor-role-ownership-guards.md',
  '../docs/smartcontractor-supabase-service-role-boundary.md',
  '../docs/smartcontractor-pwa-qa-checklist.md',
  '../docs/smartcontractor-ai-agent-workflows.md',
];

function fail(message) {
  console.error(`SmartContractor check failed: ${message}`);
  process.exit(1);
}

for (const file of requiredFiles) {
  if (!existsSync(file)) fail(`Missing required file: ${file}`);
}

execFileSync(process.execPath, ['--check', 'server.js'], { stdio: 'inherit' });
execFileSync(process.execPath, ['--check', 'public/service-worker.js'], { stdio: 'inherit' });
execFileSync(process.execPath, ['--check', 'scripts/smoke-auth-ownership.mjs'], { stdio: 'inherit' });

const html = readFileSync('public/smartcontractor.html', 'utf8');
const server = readFileSync('server.js', 'utf8');
const authSmoke = readFileSync('scripts/smoke-auth-ownership.mjs', 'utf8');
const appRequireSmokeScripts = [
  'scripts/smoke-auth-ownership.mjs',
  'scripts/smoke-strict-gates.mjs',
  'scripts/smoke-smartcontractor-workflow-readiness.mjs',
  'scripts/smoke-repayment-waterfall-draft-endpoint.mjs',
  'scripts/smoke-repayment-waterfall-review-packet-endpoint.mjs',
  'scripts/smoke-ai-agent-recommendations.mjs',
];
if (
  !server.includes('const key = match[1].trim();') ||
  !server.includes('if (process.env[key] === undefined) process.env[key] = match[2].trim();')
) {
  fail('server.js .env loader must preserve existing process env values so local smoke/dev PORT overrides are respected');
}
if (!server.includes('if (require.main === module)')) {
  fail('server.js must start its listener only when run directly so smoke tests can import the exported app without mutating VERCEL');
}
for (const scriptPath of appRequireSmokeScripts) {
  const script = readFileSync(scriptPath, 'utf8');
  if (script.includes("process.env.VERCEL = '1';")) {
    fail(`${scriptPath} must import the exported app without setting VERCEL as a listener suppression flag`);
  }
}
if (!html.includes('<link rel="manifest" href="/manifest.webmanifest">')) {
  fail('smartcontractor.html must link the PWA manifest');
}
if (!html.includes('navigator.serviceWorker.register')) {
  fail('smartcontractor.html must register the service worker');
}
if (html.includes('SUPABASE_SERVICE_ROLE_KEY')) {
  fail('public HTML must not mention SUPABASE_SERVICE_ROLE_KEY');
}
if (!html.includes('data-tab="admin"') || !html.includes('loadAdminConsole')) {
  fail('smartcontractor.html must include the Admin / Risk Console tab and loader');
}
if (!html.includes('Demo Run Order') || !html.includes('demo-step-grid') || !html.includes('Preview starter working-capital risk without real approval or money movement')) {
  fail('smartcontractor.html must include the safe demo run order for founder/tester onboarding');
}
if (!html.includes('Demo-only homeowner jobs are local test records') || !html.includes('They do not publish a real lead, bind a homeowner, start escrow, or create a contractor obligation')) {
  fail('Homeowner view must visibly block real lead, homeowner binding, escrow start, and contractor obligation');
}
if (!html.includes('Demo-only contractor bids are local test records') || !html.includes('They do not create a signed contract, guarantee price, verify licensing, or trigger payment')) {
  fail('Contractor view must visibly block signed contract, price guarantee, licensing verification, and payment trigger');
}
if (!html.includes('demo-safety-strip') || !html.includes('No real payments') || !html.includes('No token collateral lock')) {
  fail('smartcontractor.html must keep visible demo safety boundary chips near the run order');
}
if (
  !server.includes("app.get('/api/smartcontractor/job-fit-snapshot'") ||
  !server.includes('job_fit_snapshot') ||
  !server.includes('fit_score') ||
  !server.includes('fit_factors') ||
  !server.includes('demo_only_matching_gate') ||
  !server.includes('validateJobFitSnapshotQuery') ||
  !server.includes('job_fit_snapshot_validation_error') ||
  !server.includes('budget_min_usd must be a non-negative finite number') ||
  !server.includes('budget_max_usd must be a non-negative finite number') ||
  !server.includes('budget_max_usd must be greater than or equal to budget_min_usd') ||
  !server.includes('contractor_rating must be a number from 0 to 5') ||
  !server.includes('available_working_capital_usd must be a non-negative finite number') ||
  !server.includes('no_real_lead_routing_attempted') ||
  !server.includes('no_live_action_attempted')
) {
  fail('server.js must expose local job-fit snapshot API with validation, fit score, factors, demo-only matching gate, no-real-lead-routing, and no-live-action boundaries');
}
if (
  !html.includes('/api/smartcontractor/job-fit-snapshot') ||
  !html.includes('jobFitSnapshot') ||
  !html.includes('Job Fit Snapshot') ||
  !html.includes('loadJobFitSnapshot') ||
  !html.includes('fit_factors') ||
  !html.includes('demo_only_matching_gate') ||
  !html.includes('No real lead routing attempted')
) {
  fail('SmartContractor UI must render local Job Fit Snapshot with fit factors and demo-only matching gate');
}
if (
  !html.includes('JOB_FIT_SNAPSHOT_HISTORY_KEY') ||
  !html.includes('jobFitSnapshotHistory') ||
  !html.includes('saveJobFitSnapshotHistory') ||
  !html.includes('renderJobFitSnapshotHistory') ||
  !html.includes('job_fit_snapshot_history') ||
  !html.includes('local_history_only') ||
  !html.includes('metadata_only') ||
  !html.includes('No real lead routing history stored') ||
  !html.includes('No live matching action attempted')
) {
  fail('SmartContractor UI must keep local metadata-only Job Fit Snapshot history with no real routing or live matching action');
}
if (
  !html.includes('job_fit_snapshot_validation_error') ||
  !html.includes('validation_details') ||
  !html.includes('renderJobFitValidationDetails') ||
  !html.includes('error.body?.details') ||
  !html.includes('Validation Details') ||
  !html.includes('No live matching action attempted')
) {
  fail('SmartContractor UI must render Job Fit Snapshot validation details with request trace and blocked matching/live-action markers');
}
if (
  !server.includes("app.get('/api/smartcontractor/bid-readiness-comparison'") ||
  !server.includes('bid_readiness_comparison') ||
  !server.includes('readiness_score') ||
  !server.includes('readiness_factors') ||
  !server.includes('demo_only_selection_gate') ||
  !server.includes('validateBidReadinessComparisonQuery') ||
  !server.includes('bid_readiness_comparison_validation_error') ||
  !server.includes('bid_amount_usd must be a non-negative finite number') ||
  !server.includes('timeline_days must be a non-negative finite integer') ||
  !server.includes('contractor_rating must be a number from 0 to 5') ||
  !server.includes('budget_max_usd must be greater than or equal to budget_min_usd') ||
  !server.includes('no_winning_bid_selected') ||
  !server.includes('no_live_action_attempted')
) {
  fail('server.js must expose local bid readiness comparison API with validation, score, factors, demo-only selection gate, no-winning-bid, and no-live-action boundaries');
}
if (
  !html.includes('/api/smartcontractor/bid-readiness-comparison') ||
  !html.includes('bidReadinessComparison') ||
  !html.includes('Bid Readiness Comparison') ||
  !html.includes('loadBidReadinessComparison') ||
  !html.includes('readiness_factors') ||
  !html.includes('demo_only_selection_gate') ||
  !html.includes('No winning bid selected') ||
  !html.includes('No contractor assignment attempted')
) {
  fail('SmartContractor UI must render local Bid Readiness Comparison with factors and demo-only selection gate');
}
if (
  !html.includes('BID_READINESS_COMPARISON_HISTORY_KEY') ||
  !html.includes('bidReadinessComparisonHistory') ||
  !html.includes('saveBidReadinessComparisonHistory') ||
  !html.includes('renderBidReadinessComparisonHistory') ||
  !html.includes('bid_readiness_comparison_history') ||
  !html.includes('local_history_only') ||
  !html.includes('metadata_only') ||
  !html.includes('No winning bid history stored') ||
  !html.includes('No live selection action attempted')
) {
  fail('SmartContractor UI must keep local metadata-only Bid Readiness Comparison history with no winning-bid history or live selection action');
}
if (
  !html.includes('bid_readiness_comparison_validation_error') ||
  !html.includes('validation_details') ||
  !html.includes('renderBidReadinessValidationDetails') ||
  !html.includes('error.body?.details') ||
  !html.includes('Validation Details') ||
  !html.includes('No live selection action attempted')
) {
  fail('SmartContractor UI must render Bid Readiness Comparison validation details with request trace and blocked selection/live-action markers');
}
if (
  !server.includes("app.get('/api/smartcontractor/milestone-acceptance-snapshot'") ||
  !server.includes('milestone_acceptance_snapshot') ||
  !server.includes('acceptance_score') ||
  !server.includes('acceptance_factors') ||
  !server.includes('demo_only_acceptance_gate') ||
  !server.includes('validateMilestoneAcceptanceSnapshotQuery') ||
  !server.includes('milestone_acceptance_snapshot_validation_error') ||
  !server.includes('evidence_count must be a non-negative finite integer') ||
  !server.includes('requested_release_usd must be a non-negative finite number') ||
  !server.includes('work_status must be one of: submitted, approved, completed, needs_rework') ||
  !server.includes('payment_status must be one of: funded, not_funded, released, disputed') ||
  !server.includes('no_milestone_approval_attempted') ||
  !server.includes('no_escrow_release_attempted') ||
  !server.includes('no_payment_movement_attempted')
) {
  fail('server.js must expose local milestone acceptance snapshot API with validation, score, factors, demo-only acceptance gate, and blocked approval/payment boundaries');
}
if (
  !html.includes('/api/smartcontractor/milestone-acceptance-snapshot') ||
  !html.includes('milestoneAcceptanceSnapshot') ||
  !html.includes('Milestone Acceptance Snapshot') ||
  !html.includes('loadMilestoneAcceptanceSnapshot') ||
  !html.includes('acceptance_factors') ||
  !html.includes('demo_only_acceptance_gate') ||
  !html.includes('No milestone approval attempted') ||
  !html.includes('No escrow release attempted') ||
  !html.includes('No payment movement attempted')
) {
  fail('SmartContractor UI must render local Milestone Acceptance Snapshot with factors and demo-only approval/payment gates');
}
if (
  !html.includes('MILESTONE_ACCEPTANCE_SNAPSHOT_HISTORY_KEY') ||
  !html.includes('milestoneAcceptanceSnapshotHistory') ||
  !html.includes('saveMilestoneAcceptanceSnapshotHistory') ||
  !html.includes('renderMilestoneAcceptanceSnapshotHistory') ||
  !html.includes('milestone_acceptance_snapshot_history') ||
  !html.includes('local_history_only') ||
  !html.includes('metadata_only') ||
  !html.includes('No milestone approval history stored') ||
  !html.includes('No escrow release history stored') ||
  !html.includes('No payment movement history stored')
) {
  fail('SmartContractor UI must keep local metadata-only Milestone Acceptance Snapshot history with no approval, escrow release, or payment movement history');
}
if (
  !html.includes('milestone_acceptance_snapshot_validation_error') ||
  !html.includes('validation_details') ||
  !html.includes('renderMilestoneAcceptanceValidationDetails') ||
  !html.includes('error.body?.details') ||
  !html.includes('Validation Details') ||
  !html.includes('No live action attempted')
) {
  fail('SmartContractor UI must render Milestone Acceptance Snapshot validation details with request trace and blocked live-action markers');
}
if (!html.includes('Demo-only payment intents create local review records only') || !html.includes('They do not charge a card, move XPR, release escrow, settle stablecoins, repay loans, or lock token collateral')) {
  fail('Payment Router must visibly block real charges, XPR movement, escrow release, settlement, repayments, and token locks');
}
if (!html.includes('Demo-only loan requests create local review records only') || !html.includes('They do not approve credit, fund a contractor, route repayment, release escrow, or lock token collateral')) {
  fail('Loan view must visibly block real credit approval, contractor funding, repayment routing, escrow release, and token locks');
}
if (!html.includes('Demo-only disputes create local evidence and peer-review records only') || !html.includes('They do not decide legal liability, release funds, issue refunds, or override escrow')) {
  fail('Dispute Center must visibly block legal liability decisions, fund release, refunds, and escrow override');
}
if (!html.includes('Demo-only admin actions save local draft notes only') || !html.includes('They do not approve loans, reject users, release funds, change live RLS, or update Supabase roles')) {
  fail('Admin view must visibly block real loan/user/fund/RLS/Supabase role actions');
}
if (!html.includes("response.headers.get('X-Request-Id')") || !html.includes('request_id_header') || !html.includes('error.request_id_header')) {
  fail('frontend API helper must preserve X-Request-Id on success and error results for founder/tester traceability');
}
if (!html.includes('function attachRequestTrace(body, response, path, method)') || !html.includes('request_path: path') || !html.includes('request_method: method')) {
  fail('frontend API helper must preserve request path and method on traced success results for founder/tester screenshots');
}
if (!html.includes('http_status: response.status')) {
  fail('frontend API helper must preserve HTTP status on traced success results for founder/tester screenshots');
}
if (!html.includes('adminRiskFilter') || !html.includes('saveAdminDraftNote') || !html.includes('gcsc-admin-drafts')) {
  fail('Admin / Risk Console must include filters, local draft notes, and draft persistence');
}
if (!html.includes('loadAiAgentWorkflowCatalog') || !html.includes('aiAgentWorkflowCatalogGrid') || !html.includes('/api/admin/ai-agents/workflows')) {
  fail('smartcontractor.html must include the AI Agent Workflow Catalog UI');
}
if (!html.includes('AI Agent Workflow Catalog') || !html.includes('starter_loan_review') || !html.includes('BLOCKED_FOR_LIVE')) {
  fail('AI Agent Workflow Catalog UI must expose starter_loan_review and BLOCKED_FOR_LIVE status');
}
if (!html.includes('approve_real_loan') || !html.includes('required_human_review') || !html.includes('data.supported_workflows.map')) {
  fail('AI Agent Workflow Catalog UI must show blocked actions, required human review, and supported workflows');
}
if (!html.includes("['Generated at', data.generated_at || 'pending']")) {
  fail('AI Agent Workflow Catalog UI must show generated_at timestamp');
}
if (!html.includes("['HTTP status', data.http_status || 'pending']")) {
  fail('AI Agent Workflow Catalog UI must show HTTP status for founder/tester traceability');
}
if (!html.includes("['Request ID', data.request_id || 'pending']")) {
  fail('AI Agent Workflow Catalog UI must show response body request_id');
}
if (!html.includes("['Request ID Header', data.request_id_header || 'pending']")) {
  fail('AI Agent Workflow Catalog UI must show response header request_id');
}
if (!html.includes("['Request trace complete', data.request_id && data.request_id_header ? 'true' : 'false']")) {
  fail('AI Agent Workflow Catalog UI must show request trace completeness state');
}
if (!html.includes("['Request path', data.request_path || 'pending']") || !html.includes("['Request method', data.request_method || 'pending']")) {
  fail('AI Agent Workflow Catalog UI must show request path and method for founder/tester traceability');
}
if (!html.includes("['Request ID Header', body.request_id_header || error.request_id_header || 'pending']")) {
  fail('AI Agent Workflow Catalog error UI must show response header request_id');
}
if (!html.includes("['Header request-id returned', typeof (body.request_id_header || error.request_id_header) === 'string' && (body.request_id_header || error.request_id_header).length > 0 ? 'true' : 'false']")) {
  fail('AI Agent Workflow Catalog error UI must show whether a header request id was returned');
}
if (!html.includes("['Request trace complete', body.request_id && (body.request_id_header || error.request_id_header) ? 'true' : 'false']")) {
  fail('AI Agent Workflow Catalog error UI must show request trace completeness state');
}
if (!html.includes("['Backend request-id returned', typeof body.request_id === 'string' && body.request_id.length > 0 ? 'true' : 'false']")) {
  fail('AI Agent Workflow Catalog error UI must show whether a backend request id was returned');
}
if (!html.includes("['HTTP status', error.http_status || 'pending']")) {
  fail('AI Agent Workflow Catalog error UI must show HTTP status for founder/tester traceability');
}
if (!html.includes("['Request path', error.request_path || 'pending']") || !html.includes("['Request method', error.request_method || 'pending']")) {
  fail('AI Agent Workflow Catalog error UI must show request path and method for founder/tester traceability');
}
if (!html.includes("['Backend no-menu flag returned', typeof body.no_supported_workflows === 'boolean' ? 'true' : 'false']")) {
  fail('AI Agent Workflow Catalog error UI must show whether backend no-menu flag was returned');
}
if (!html.includes("['Backend no-execution flag returned', typeof body.no_workflow_execution_attempted === 'boolean' ? 'true' : 'false']")) {
  fail('AI Agent Workflow Catalog error UI must show whether backend no-execution flag was returned');
}
if (!html.includes("['Detail count', details.length]")) {
  fail('AI Agent Workflow Catalog error UI must show detail count for founder/tester traceability');
}
if (!html.includes("['Backend details returned', Array.isArray(body.details) ? 'true' : 'false']")) {
  fail('AI Agent Workflow Catalog error UI must show whether backend details were returned');
}
if (!html.includes("['Backend error returned', typeof body.error === 'string' && body.error.length > 0 ? 'true' : 'false']")) {
  fail('AI Agent Workflow Catalog error UI must show whether a backend error label was returned');
}
if (!html.includes("['Backend safe-scope returned', Array.isArray(body.safe_scope) ? 'true' : 'false']")) {
  fail('AI Agent Workflow Catalog error UI must show whether backend safe-scope was returned');
}
if (!html.includes("['Safety boundaries', (data.safety_boundaries || []).length]")) {
  fail('AI Agent Workflow Catalog UI must show safety boundary count');
}
if (!html.includes('renderAiAgentWorkflowCatalogError') || !html.includes('no_supported_workflows') || !html.includes('no_workflow_execution_attempted')) {
  fail('AI Agent Workflow Catalog UI must show catalog error no-menu and no-execution boundaries');
}
if (!html.includes('No supported workflow menu returned') || !html.includes('No workflow execution attempted')) {
  fail('AI Agent Workflow Catalog UI must make failed catalog discovery safe for screenshots');
}
if (!html.includes('renderAiAgentWorkflowCatalogError(error)')) {
  fail('AI Agent Workflow Catalog UI must route discovery failures through renderAiAgentWorkflowCatalogError');
}
if (!html.includes("const liveGateCount = workflows.filter((workflow) => workflow.live_action_status === 'BLOCKED_FOR_LIVE').length") || !html.includes("['Live gates', `${liveGateCount}/${workflows.length}`]")) {
  fail('AI Agent Workflow Catalog UI must show blocked live-gate count');
}
if (!html.includes("const requiredPermissions = new Set(workflows.map((workflow) => workflow.required_permission).filter(Boolean))") || !html.includes("['Permission scopes', requiredPermissions.size]")) {
  fail('AI Agent Workflow Catalog UI must show required permission scope count');
}
if (!html.includes("const requiredInputRefs = new Set(workflows.flatMap((workflow) => workflow.required_input_refs || []))") || !html.includes("['Input refs', requiredInputRefs.size]")) {
  fail('AI Agent Workflow Catalog UI must show required input ref count');
}
if (!html.includes("const supportedFacts = new Set(workflows.flatMap((workflow) => workflow.supported_facts || []))") || !html.includes("['Supported facts', supportedFacts.size]")) {
  fail('AI Agent Workflow Catalog UI must show supported fact count');
}
if (!html.includes("const auditRequiredCount = workflows.filter((workflow) => workflow.audit_event_required === true).length") || !html.includes("['Audit required', `${auditRequiredCount}/${workflows.length}`]")) {
  fail('AI Agent Workflow Catalog UI must show audit-required workflow count');
}
if (!html.includes("const localOnlyCount = workflows.filter((workflow) => workflow.local_only === true).length") || !html.includes("['Local only', `${localOnlyCount}/${workflows.length}`]")) {
  fail('AI Agent Workflow Catalog UI must show local-only workflow count');
}
if (!html.includes("const workflowAgents = new Set(workflows.map((workflow) => workflow.agent).filter(Boolean))") || !html.includes("['Agent types', workflowAgents.size]")) {
  fail('AI Agent Workflow Catalog UI must show workflow agent type count');
}
if (!html.includes("const workflowEntityTypes = new Set(workflows.map((workflow) => workflow.entity_type).filter(Boolean))") || !html.includes("['Entity types', workflowEntityTypes.size]")) {
  fail('AI Agent Workflow Catalog UI must show workflow entity type count');
}
if (!html.includes("const workflowModes = new Set(workflows.map((workflow) => workflow.mode).filter(Boolean))") || !html.includes("['Workflow modes', workflowModes.size]")) {
  fail('AI Agent Workflow Catalog UI must show workflow mode count');
}
if (!html.includes("const catalogOnlyWorkflowCount = workflows.filter((workflow) => workflow.mode === 'local_structured_review_packet_only').length") || !html.includes("['Catalog-only workflows', catalogOnlyWorkflowCount]")) {
  fail('AI Agent Workflow Catalog UI must show catalog-only workflow count');
}
if (!html.includes("const recommendationWorkflowCount = workflows.length - catalogOnlyWorkflowCount") || !html.includes("['Recommendation workflows', recommendationWorkflowCount]")) {
  fail('AI Agent Workflow Catalog UI must show recommendation workflow count');
}
if (!html.includes("const workflowLiveStatuses = new Set(workflows.map((workflow) => workflow.live_action_status).filter(Boolean))") || !html.includes("['Live statuses', workflowLiveStatuses.size]")) {
  fail('AI Agent Workflow Catalog UI must show workflow live status count');
}
if (!html.includes("const workflowIds = new Set(workflows.map((workflow) => workflow.workflow).filter(Boolean))") || !html.includes("['Workflow IDs', workflowIds.size]")) {
  fail('AI Agent Workflow Catalog UI must show workflow id count');
}
if (!html.includes("const workflowVersions = new Set(workflows.map((workflow) => workflow.version).filter(Boolean))") || !html.includes("['Workflow versions', workflowVersions.size]")) {
  fail('AI Agent Workflow Catalog UI must show workflow version count');
}
if (!html.includes("Entity type: ${escapeHtml(workflow.entity_type || 'unknown')}")) {
  fail('AI Agent Workflow Catalog cards must show workflow entity type');
}
if (!html.includes("Audit required: ${escapeHtml(workflow.audit_event_required ? 'true' : 'false')}")) {
  fail('AI Agent Workflow Catalog cards must show audit-event requirement');
}
if (!html.includes("Local only: ${escapeHtml(workflow.local_only ? 'true' : 'false')}")) {
  fail('AI Agent Workflow Catalog cards must show local-only workflow boundary');
}
if (!html.includes("Human review: ${escapeHtml(workflow.required_human_review ? 'true' : 'false')}")) {
  fail('AI Agent Workflow Catalog cards must show required human review boundary');
}
if (!html.includes("Live status: ${escapeHtml(workflow.live_action_status || 'BLOCKED_FOR_LIVE')}")) {
  fail('AI Agent Workflow Catalog cards must show live-action status boundary');
}
if (!html.includes("Agent: ${escapeHtml(workflow.agent || 'unknown')}")) {
  fail('AI Agent Workflow Catalog cards must show workflow agent owner');
}
if (!html.includes("Workflow ID: ${escapeHtml(workflow.workflow || 'starter_loan_review')}")) {
  fail('AI Agent Workflow Catalog cards must show workflow ID metadata');
}
if (!html.includes("Workflow version: ${escapeHtml(workflow.version || 'draft')}")) {
  fail('AI Agent Workflow Catalog cards must show workflow version metadata');
}
if (!html.includes('Workflow mode: ${escapeHtml(workflow.mode)}')) {
  fail('AI Agent Workflow Catalog cards must show workflow mode metadata');
}
if (!html.includes("const catalogOnly = workflow.mode === 'local_structured_review_packet_only'") || !html.includes("catalog-only review packet; no AI recommendation draft is created from this catalog entry")) {
  fail('AI Agent Workflow Catalog cards must visibly distinguish catalog-only review packets from recommendation workflows');
}
if (!html.includes('Permission scope: ${escapeHtml(workflow.required_permission)}')) {
  fail('AI Agent Workflow Catalog cards must show permission scope metadata');
}
if (!html.includes("Blocked actions: ${escapeHtml((workflow.blocked_actions || ['approve_real_loan']).length)}")) {
  fail('AI Agent Workflow Catalog cards must show blocked action count');
}
if (!html.includes("Input ref count: ${escapeHtml((workflow.required_input_refs || []).length)}")) {
  fail('AI Agent Workflow Catalog cards must show required input ref count');
}
if (!html.includes("Supported facts: ${escapeHtml((workflow.supported_facts || []).length)}")) {
  fail('AI Agent Workflow Catalog cards must show supported fact count');
}
if (!html.includes("Facts: ${escapeHtml((workflow.supported_facts || []).join(', '))}")) {
  fail('AI Agent Workflow Catalog cards must show supported fact names');
}
if (!html.includes("Input refs: ${escapeHtml((workflow.required_input_refs || []).join(', '))}")) {
  fail('AI Agent Workflow Catalog cards must show required input reference names');
}
if (!html.includes("Blocked: ${escapeHtml((workflow.blocked_actions || ['approve_real_loan']).join(', '))}")) {
  fail('AI Agent Workflow Catalog cards must show blocked live action names');
}
if (!html.includes('Repayment Waterfall Review Packet') || !html.includes('loadRepaymentWaterfallReviewPacket') || !html.includes('/api/admin/contract-backed-loan/repayment-waterfall/review-packet')) {
  fail('smartcontractor.html must include the local-only repayment waterfall review packet UI');
}
if (!html.includes('function renderRepaymentWaterfallReviewPacketError(error)') || !html.includes('renderRepaymentWaterfallReviewPacketError(error)')) {
  fail('Repayment waterfall review packet UI must route failed packet requests through a dedicated error renderer');
}
if (!html.includes('repayment_waterfall_review_packet_error') || !html.includes('Repayment Waterfall Packet Unavailable')) {
  fail('Repayment waterfall review packet error UI must show a named unavailable state and machine-readable error status');
}
if (!html.includes('repayment_waterfall_review_packet_error') || !html.includes('request_trace_complete_flag') || !html.includes('requestIdHeader')) {
  fail('Repayment waterfall review packet error UI must expose request trace completeness and request-id header evidence');
}
if (!html.includes('Request path:') || !html.includes('Request method:')) {
  fail('Repayment waterfall review packet error UI must show request path and method for founder/tester traceability');
}
if (!html.includes('No repayment waterfall review packet approval, repayment routing, payment, loan, escrow, stablecoin settlement, token collateral, provider, legal, production, or money movement action is allowed from this error state.')) {
  fail('Repayment waterfall review packet error UI must block live actions from the error state');
}
if (!html.includes('repaymentWaterfallReviewPacketSummary') || !html.includes('repaymentWaterfallReviewPacketGrid') || !html.includes('request_id_header')) {
  fail('Repayment waterfall review packet UI must show request traceability');
}
if (!html.includes('HOLD_FOR_FOUNDER_LEGAL_PROVIDER_REVIEW') || !html.includes('FOUNDER_LEGAL_PROVIDER_SECURITY_REVIEW_REQUIRED')) {
  fail('Repayment waterfall review packet UI must show review hold and blocked next action');
}
if (!html.includes('No real repayment routing is approved') || !html.includes('No escrow custody, stablecoin settlement, token collateral lock or liquidation, provider API call, or money movement is enabled')) {
  fail('Repayment waterfall review packet UI must show safe scope blocking live repayment, escrow, stablecoin, token collateral, provider, and money movement actions');
}
if (!html.includes("['Fixture count', packet.fixture_count || 0]") || !html.includes("['Blocked live actions', (packet.blocked_live_actions || []).length]")) {
  fail('Repayment waterfall review packet UI must summarize fixture and blocked-live-action counts');
}
if (!html.includes("['Local only', packet.local_only ? 'true' : 'false']") || !html.includes("['Deployment status', packet.deployment_status || 'pending']")) {
  fail('Repayment waterfall review packet UI must show local-only and deployment status gates');
}
if (!html.includes('Smart Contract Demo-Only Surfaces') || !html.includes('renderSmartContractDemoSurfaces') || !html.includes('smartContractDemoSurfaces')) {
  fail('Admin workspace must include smart contract demo-only surfaces for fresh core contract alignment');
}
for (const account of ['gcscworkcap1', 'gcscclaim111', 'gcsccredit11', 'gcscadvance1']) {
  if (!html.includes(account)) {
    fail(`Admin smart contract demo-only surfaces must include ${account}`);
  }
}
if (!html.includes('Safe Scope') || !html.includes('Blocked-Live Reasons') || !html.includes('Next Review Step')) {
  fail('Admin smart contract demo-only cards must show safe scope, blocked-live reasons, and next review step');
}
if (!html.includes('reviewPacketAnchor') || !html.includes('Open local review surface') || !html.includes("['Review links', reviewLinkCount]")) {
  fail('Admin smart contract demo-only cards must expose local review packet anchors and summarize review-link count');
}
if (!html.includes('Local Replay Check') || !html.includes('surface.localReplayCheck') || !html.includes('npm run check:smart-contract-local-replay')) {
  fail('Admin smart contract demo-only cards must show the local replay check before any contract-live action');
}
if (!html.includes('Review Packet Target') || !html.includes('surface.reviewPacketTarget') || !html.includes('BLOCKED_FOR_LIVE_REVIEW_ONLY')) {
  fail('Admin smart contract demo-only cards must label review packet targets as blocked-for-live review only');
}
if (!html.includes('Smart Contract Helper Index') || !html.includes('loadSmartContractHelperIndex') || !html.includes('/api/admin/smart-contract-helper-index')) {
  fail('Admin workspace must include a local-only smart contract helper index panel and endpoint loader');
}
if (!html.includes("['Helper exports', data.summary?.helper_export_count || 0]") || !html.includes("['Demo fixtures', data.summary?.demo_fixture_count || 0]")) {
  fail('Smart contract helper index UI must summarize helper export and demo fixture counts');
}
if (!html.includes("['Blocked-live flags', data.summary?.blocked_live_flag_group_count || 0]") || !html.includes("['Deployment status', data.deployment_status || 'pending']")) {
  fail('Smart contract helper index UI must summarize blocked-live flag groups and deployment status');
}
if (!html.includes('renderSmartContractHelperIndexError(error)') || !html.includes('smart_contract_helper_index_error')) {
  fail('Smart contract helper index UI must route failures through a dedicated error state');
}
if (!html.includes('No helper-index approval, XPR deploy, signature, payment, loan, escrow, token collateral, provider, legal, production, or money movement action is allowed from this error state.')) {
  fail('Smart contract helper index error UI must block live actions from the error state');
}
if (!html.includes('helperCategories.map') || !html.includes('Review target: ${escapeHtml(category.review_target)}') || !html.includes('Local check: ${escapeHtml(category.local_check)}')) {
  fail('Smart contract helper index UI must render helper categories with review targets and local checks');
}
if (!html.includes('smartContractHelperCategoryFilter') || !html.includes('state.smartContractHelperCategoryFilter') || !html.includes('category_filter=${encodeURIComponent(helperFilter)}')) {
  fail('Smart contract helper index UI must support local-only category_filter selection');
}
if (!html.includes("['Selected filter', data.selected_helper_category_filter?.id || 'all_helper_categories']") || !html.includes("['Filtered categories', data.filtered_helper_categories?.length || helperCategories.length]")) {
  fail('Smart contract helper index UI must summarize selected filter and filtered category count');
}
if (
  !html.includes('renderSmartContractHelperIndexFilterError') ||
  !html.includes('smart_contract_helper_index_filter_error') ||
  !html.includes('valid_helper_category_filter_ids') ||
  !html.includes('Rejected category_filter') ||
  !html.includes('No live helper-index action attempted') ||
  !html.includes('No live action attempted: ${escapeHtml(body.no_live_action_attempted ?? true)}')
) {
  fail('Smart contract helper index UI must render invalid category_filter details, valid local-only IDs, and no-live-action markers');
}
const helperFilterErrorStart = html.indexOf('function renderSmartContractHelperIndexFilterError');
const helperFilterErrorEnd = html.indexOf('function renderSmartContractHelperIndex()', helperFilterErrorStart);
const helperFilterErrorSource = helperFilterErrorStart >= 0 && helperFilterErrorEnd > helperFilterErrorStart
  ? html.slice(helperFilterErrorStart, helperFilterErrorEnd)
  : '';
if (
  !helperFilterErrorSource ||
  helperFilterErrorSource.includes("['Recovery actions', validQueueFilterIds.length]") ||
  !helperFilterErrorSource.includes("['Recovery actions', validFilterIds.length]") ||
  !helperFilterErrorSource.includes('smart_contract_helper_index_filter_recovery_actions') ||
  !helperFilterErrorSource.includes('Apply safe helper filter') ||
  !helperFilterErrorSource.includes('onclick="loadSmartContractHelperIndex')
) {
  fail('Smart contract helper index UI must render safe recovery buttons for invalid category_filter responses without referencing workflow queue state');
}
if (
  !html.includes('copySmartContractHelperCategorySummary') ||
  !html.includes('const selectedHelperCategorySummary = helperCategories.map((category) =>') ||
  !html.includes('`${category.id}|${category.review_target}|${category.local_check}|${category.export_count || 0}`') ||
  !html.includes('Selected Helper Category Summary') ||
  !html.includes('smart_contract_helper_category_summary_local_only') ||
  !html.includes('Copy helper summary') ||
  !html.includes('No server storage, external send, XPR deploy, signature request, payment, loan, escrow, stablecoin, token collateral, provider, legal, production, or money movement action is attempted by this summary.')
) {
  fail('Smart contract helper index UI must expose a local-only copyable selected helper category summary');
}
if (
  !server.includes('local_replay_readiness_summary') ||
  !server.includes('ready_for_local_replay_review') ||
  !server.includes('blocked_for_live_replay') ||
  !server.includes('no_live_replay_action_attempted') ||
  !server.includes('local_replay_review_route_count')
) {
  fail('server.js smart contract helper index must expose local replay readiness summary without live replay actions');
}
if (
  !html.includes('Local Replay Readiness Summary') ||
  !html.includes('local_replay_readiness_summary') ||
  !html.includes("['Replay-ready categories', data.local_replay_readiness_summary?.ready_for_local_replay_review || 0]") ||
  !html.includes('No live replay action attempted') ||
  !html.includes('Open local replay review route')
) {
  fail('Smart contract helper index UI must render local replay readiness summary and local review routes without live actions');
}
if (
  !html.includes('smartContractHelperIndexHistory') ||
  !html.includes('smartContractHelperIndexHistorySummary') ||
  !html.includes('smartContractHelperIndexHistoryGrid') ||
  !html.includes('SMART_CONTRACT_HELPER_INDEX_HISTORY_KEY') ||
  !html.includes('saveSmartContractHelperIndexHistory') ||
  !html.includes('renderSmartContractHelperIndexHistory') ||
  !html.includes('smart_contract_helper_index_history') ||
  !html.includes('local_replay_summary_history_only') ||
  !html.includes('No helper exports, demo fixtures, replay routes, secrets, signatures, payment data, loan approvals, escrow releases, stablecoin settlement approvals, token collateral approvals, provider/legal decisions, or production approvals are stored in this history.') ||
  !html.includes('saveAdminLocalEvidenceTimelineEntry(\'smart_contract_helper_index\'')
) {
  fail('Smart contract helper index UI must keep a local metadata-only history without storing replay payloads or enabling live actions');
}
if (
  !server.includes("app.get('/api/admin/smart-contract-local-replay-dry-run'") ||
  !server.includes('buildSmartContractLocalReplayDryRun') ||
  !server.includes('smart_contract_local_replay_dry_run') ||
  !server.includes('dry_run_steps') ||
  !server.includes('dry_run_gate') ||
  !server.includes('smart_contract_local_replay_dry_run_filter_invalid') ||
  !server.includes('Unsupported smart contract local replay dry run category_filter') ||
  !server.includes('no_server_storage_attempted: true') ||
  !server.includes('no_live_replay_action_attempted: true')
) {
  fail('server.js must expose a local smart contract replay dry-run endpoint with dry_run_steps, dry_run_gate, invalid filter recovery, no-server-storage, and no-live-replay boundaries');
}
if (
  !html.includes('Smart Contract Local Replay Dry Run') ||
  !html.includes('/api/admin/smart-contract-local-replay-dry-run') ||
  !html.includes('smartContractLocalReplayDryRun') ||
  !html.includes('loadSmartContractLocalReplayDryRun') ||
  !html.includes('renderSmartContractLocalReplayDryRun') ||
  !html.includes('dry_run_steps') ||
  !html.includes('dry_run_gate') ||
  !html.includes('renderSmartContractLocalReplayDryRunFilterError') ||
  !html.includes('smart_contract_local_replay_dry_run_filter_recovery_actions') ||
  !html.includes('validSmartContractLocalReplayDryRunFilterIds') ||
  !html.includes('Apply safe replay dry-run filter') ||
  !html.includes('No live smart contract replay action attempted') ||
  !html.includes('saveAdminLocalEvidenceTimelineEntry(\'smart_contract_local_replay_dry_run\'')
) {
  fail('Smart contract helper index UI must render local replay dry-run steps, dry-run gate, invalid category_filter recovery, and metadata-only timeline entries');
}
if (
  !server.includes("app.get('/api/admin/smart-contract-local-replay-dry-run/evidence-packet'") ||
  !server.includes('buildSmartContractLocalReplayDryRunEvidencePacket') ||
  !server.includes('smart_contract_local_replay_dry_run_evidence_packet') ||
  !server.includes('packet_sections') ||
  !server.includes('packet_gate') ||
  !server.includes('copyable_markdown') ||
  !server.includes('redaction_attestation') ||
  !server.includes('smart_contract_local_replay_dry_run_evidence_packet_filter_invalid') ||
  !server.includes('Unsupported smart contract local replay dry run evidence packet category_filter') ||
  !server.includes('no_server_storage_attempted: true') ||
  !server.includes('no_live_replay_action_attempted: true')
) {
  fail('server.js must expose a local smart contract replay dry-run evidence packet endpoint with sections, packet gate, copyable markdown, invalid filter recovery, no-server-storage, and no-live-replay boundaries');
}
if (
  !html.includes('Smart Contract Local Replay Dry Run Evidence Packet') ||
  !html.includes('/api/admin/smart-contract-local-replay-dry-run/evidence-packet') ||
  !html.includes('smartContractLocalReplayDryRunEvidencePacket') ||
  !html.includes('loadSmartContractLocalReplayDryRunEvidencePacket') ||
  !html.includes('renderSmartContractLocalReplayDryRunEvidencePacket') ||
  !html.includes('renderSmartContractLocalReplayDryRunEvidencePacketFilterError') ||
  !html.includes('copySmartContractLocalReplayDryRunEvidencePacketMarkdown') ||
  !html.includes('packet_sections') ||
  !html.includes('packet_gate') ||
  !html.includes('copyable_markdown') ||
  !html.includes('redaction_attestation') ||
  !html.includes('smart_contract_local_replay_dry_run_evidence_packet_filter_recovery_actions') ||
  !html.includes('Apply safe dry-run packet filter') ||
  !html.includes('No dry-run packet content stored') ||
  !html.includes('No live smart contract replay action attempted') ||
  !html.includes('saveAdminLocalEvidenceTimelineEntry(\'smart_contract_local_replay_dry_run_evidence_packet\'')
) {
  fail('Smart contract helper index UI must render local replay dry-run evidence packets, copyable markdown, invalid category_filter recovery, and metadata-only timeline entries');
}
if (
  !server.includes("app.get('/api/admin/smart-contract-review-workbench'") ||
  !server.includes('buildSmartContractReviewWorkbench') ||
  !server.includes('smart_contract_review_workbench') ||
  !server.includes('workbench_cards') ||
  !server.includes('review_gate') ||
  !server.includes('smart_contract_review_workbench_filter_invalid') ||
  !server.includes('Unsupported smart contract review workbench category_filter') ||
  !server.includes('no_server_storage_attempted: true') ||
  !server.includes('no_live_replay_action_attempted: true')
) {
  fail('server.js must expose a local smart contract review workbench endpoint with cards, review gate, invalid filter recovery, no-server-storage, and no-live-replay boundaries');
}
if (
  !html.includes('Smart Contract Review Workbench') ||
  !html.includes('/api/admin/smart-contract-review-workbench') ||
  !html.includes('smartContractReviewWorkbench') ||
  !html.includes('loadSmartContractReviewWorkbench') ||
  !html.includes('renderSmartContractReviewWorkbench') ||
  !html.includes('renderSmartContractReviewWorkbenchFilterError') ||
  !html.includes('workbench_cards') ||
  !html.includes('review_gate') ||
  !html.includes('smart_contract_review_workbench_filter_recovery_actions') ||
  !html.includes('Apply safe workbench filter') ||
  !html.includes('No live smart contract replay action attempted') ||
  !html.includes('saveAdminLocalEvidenceTimelineEntry(\'smart_contract_review_workbench\'')
) {
  fail('Smart contract helper index UI must render a local review workbench with workbench cards, review gate, invalid category_filter recovery, and metadata-only timeline entries');
}
if (
  !server.includes("app.get('/api/admin/smart-contract-review-workbench/handoff-summary'") ||
  !server.includes('buildSmartContractReviewWorkbenchHandoffSummary') ||
  !server.includes('smart_contract_review_workbench_handoff_summary') ||
  !server.includes('handoff_summary_sections') ||
  !server.includes('handoff_gate') ||
  !server.includes('copyable_markdown') ||
  !server.includes('redaction_attestation') ||
  !server.includes('smart_contract_review_workbench_handoff_summary_filter_invalid') ||
  !server.includes('Unsupported smart contract review workbench handoff summary category_filter') ||
  !server.includes('no_handoff_summary_content_stored: true') ||
  !server.includes('no_live_replay_action_attempted: true')
) {
  fail('server.js must expose a local smart contract review workbench handoff summary endpoint with sections, gate, markdown, redaction, invalid filter recovery, no-server-storage, and no-live-replay boundaries');
}
if (
  !html.includes('Smart Contract Review Workbench Handoff Summary') ||
  !html.includes('/api/admin/smart-contract-review-workbench/handoff-summary') ||
  !html.includes('smartContractReviewWorkbenchHandoffSummary') ||
  !html.includes('loadSmartContractReviewWorkbenchHandoffSummary') ||
  !html.includes('renderSmartContractReviewWorkbenchHandoffSummary') ||
  !html.includes('renderSmartContractReviewWorkbenchHandoffSummaryFilterError') ||
  !html.includes('copySmartContractReviewWorkbenchHandoffSummaryMarkdown') ||
  !html.includes('handoff_summary_sections') ||
  !html.includes('handoff_gate') ||
  !html.includes('copyable_markdown') ||
  !html.includes('redaction_attestation') ||
  !html.includes('smart_contract_review_workbench_handoff_summary_filter_recovery_actions') ||
  !html.includes('Apply safe workbench handoff filter') ||
  !html.includes('No handoff summary content stored') ||
  !html.includes('No live smart contract replay action attempted') ||
  !html.includes('saveAdminLocalEvidenceTimelineEntry(\'smart_contract_review_workbench_handoff_summary\'')
) {
  fail('Smart contract helper index UI must render review workbench handoff summaries, copyable markdown, invalid category_filter recovery, and metadata-only timeline entries');
}
if (
  !server.includes("app.get('/api/admin/smart-contract-review-workbench/gate-matrix'") ||
  !server.includes('buildSmartContractReviewWorkbenchGateMatrix') ||
  !server.includes('smart_contract_review_workbench_gate_matrix') ||
  !server.includes('gate_matrix_rows') ||
  !server.includes('gate_matrix_summary') ||
  !server.includes('gate_matrix_gate') ||
  !server.includes('recommended_review_order') ||
  !server.includes('smart_contract_review_workbench_gate_matrix_filter_invalid') ||
  !server.includes('Unsupported smart contract review workbench gate matrix category_filter') ||
  !server.includes('smart_contract_review_workbench_gate_matrix_filter_recovery_actions') ||
  !server.includes('selected_helper_category_filter') ||
  !server.includes('no_gate_matrix_content_stored: true') ||
  !server.includes('no_live_replay_action_attempted: true')
) {
  fail('server.js must expose a local smart contract review workbench gate matrix endpoint with matrix rows, filter recovery, summary, review order, blocked gate, no-server-storage, and no-live-replay boundaries');
}
if (
  !html.includes('Smart Contract Review Gate Matrix') ||
  !html.includes('/api/admin/smart-contract-review-workbench/gate-matrix') ||
  !html.includes('smartContractReviewWorkbenchGateMatrix') ||
  !html.includes('loadSmartContractReviewWorkbenchGateMatrix') ||
  !html.includes('renderSmartContractReviewWorkbenchGateMatrix') ||
  !html.includes('renderSmartContractReviewWorkbenchGateMatrixFilterError') ||
  !html.includes('gate_matrix_rows') ||
  !html.includes('gate_matrix_summary') ||
  !html.includes('gate_matrix_gate') ||
  !html.includes('recommended_review_order') ||
  !html.includes('category_filter=${encodeURIComponent(helperFilter)}') ||
  !html.includes('smart_contract_review_workbench_gate_matrix_filter_recovery_actions') ||
  !html.includes('Apply safe gate matrix filter') ||
  !html.includes('Rejected category_filter') ||
  !html.includes('No gate matrix content stored') ||
  !html.includes('saveAdminLocalEvidenceTimelineEntry(\'smart_contract_review_workbench_gate_matrix\'')
) {
  fail('Smart contract helper index UI must render a filtered local review gate matrix with rows, invalid category_filter recovery, summary, review order, blocked gate, and metadata-only timeline entries');
}
if (!html.includes('no on-chain transaction, no money movement, no collateral lock, no provider action, and no legal or finance decision')) {
  fail('Admin smart contract demo-only surfaces must visibly block live chain, money, collateral, provider, legal, and finance actions');
}
if (!html.includes('AI Starter Loan Recommendation') || !html.includes('requestAiStarterLoanRecommendation') || !html.includes('/api/admin/ai-agents/recommendations')) {
  fail('smartcontractor.html must include a local-only AI starter loan recommendation draft UI');
}
if (!html.includes('aiRecommendationResult') || !html.includes('does not approve real loans') || !html.includes('starter_loan_review')) {
  fail('AI starter loan recommendation UI must keep live loan approval blocked and show starter_loan_review scope');
}
if (!html.includes('AI Job Match Recommendation') || !html.includes('requestAiJobMatchRecommendation') || !html.includes('requestAiJobMatchRecommendationBtn')) {
  fail('smartcontractor.html must include a local-only AI job match recommendation draft UI');
}
if (!html.includes('aiJobMatchRecommendationResult') || !html.includes('job_match_ranking') || !html.includes('contractor_matching_agent')) {
  fail('AI job match recommendation UI must show job_match_ranking scope and contractor_matching_agent ownership');
}
if (!html.includes('publish real leads, assign contractors, start escrow, or charge lead tokens') || !html.includes('collect_missing_job_match_inputs')) {
  fail('AI job match recommendation UI must block live matching actions and expose missing-input collection state');
}
if (!html.includes('AI Verification Triage Recommendation') || !html.includes('requestAiVerificationTriageRecommendation') || !html.includes('requestAiVerificationTriageRecommendationBtn')) {
  fail('smartcontractor.html must include a local-only AI verification triage recommendation draft UI');
}
if (!html.includes('aiVerificationTriageRecommendationResult') || !html.includes('verification_triage') || !html.includes('compliance_agent')) {
  fail('AI verification triage UI must show verification_triage scope and compliance_agent ownership');
}
if (!html.includes('approve contractor verification, activate provider accounts, approve loans, fund contractors, move money, or make legal decisions') || !html.includes('collect_missing_verification_evidence')) {
  fail('AI verification triage UI must block live verification/provider/loan actions and expose missing-evidence collection state');
}
if (!html.includes('AI Payment Exception Recommendation') || !html.includes('requestAiPaymentExceptionRecommendation') || !html.includes('requestAiPaymentExceptionRecommendationBtn')) {
  fail('smartcontractor.html must include a local-only AI payment exception recommendation draft UI');
}
if (!html.includes('aiPaymentExceptionRecommendationResult') || !html.includes('payment_exception_review') || !html.includes('treasury_agent')) {
  fail('AI payment exception UI must show payment_exception_review scope and treasury_agent ownership');
}
if (!html.includes('issue refunds, release escrow, change payouts, take treasury actions, move money, or make legal decisions') || !html.includes('reconcile_payment_exception')) {
  fail('AI payment exception UI must block live payment/treasury actions and expose reconciliation state');
}
if (!html.includes('AI Dispute Evidence Summary Recommendation') || !html.includes('requestAiDisputeEvidenceSummaryRecommendation') || !html.includes('requestAiDisputeEvidenceSummaryRecommendationBtn')) {
  fail('smartcontractor.html must include a local-only AI dispute evidence summary recommendation draft UI');
}
if (!html.includes('aiDisputeEvidenceSummaryRecommendationResult') || !html.includes('dispute_evidence_summary') || !html.includes('dispute_triage_agent')) {
  fail('AI dispute evidence summary UI must show dispute_evidence_summary scope and dispute_triage_agent ownership');
}
if (!html.includes('decide disputes, release escrow, issue refunds, assign liability, move money, or make legal decisions') || !html.includes('collect_missing_dispute_evidence')) {
  fail('AI dispute evidence summary UI must block live dispute/escrow actions and expose missing-evidence state');
}
if (!html.includes('AI Draft Document Packet Recommendation') || !html.includes('requestAiDraftDocumentPacketRecommendation') || !html.includes('requestAiDraftDocumentPacketRecommendationBtn')) {
  fail('smartcontractor.html must include a local-only AI draft document packet recommendation draft UI');
}
if (!html.includes('aiDraftDocumentPacketRecommendationResult') || !html.includes('draft_document_packet') || !html.includes('document_generation_agent')) {
  fail('AI draft document packet UI must show draft_document_packet scope and document_generation_agent ownership');
}
if (!html.includes('send legal documents, bind contracts, request signatures, file lien waivers, move money, or make legal decisions') || !html.includes('collect_missing_document_packet_inputs')) {
  fail('AI draft document packet UI must block live document/legal actions and expose missing-input state');
}
if (
  !html.includes('AI Draft Human Review Checklist') ||
  !html.includes('Review contractor identity, signed project contract, milestone evidence, repayment waterfall, lender/provider boundaries, legal/provider gates, and admin authority before trusting starter-loan drafts') ||
  !html.includes('Review job and contractor fit, license, insurance, and business identity before trusting match or verification drafts') ||
  !html.includes('Review payment provider webhooks, ledger reconciliation, dispute evidence, milestone status, peer-review notes, document scope, attorney-review status, and signature readiness before trusting payment, dispute, or document drafts') ||
  !html.includes('Do not use AI drafts to approve loans, assign contractors, verify contractors, issue refunds, release escrow, change payouts, send legal documents, request signatures, file lien waivers, move money, or make legal decisions')
) {
  fail('AI draft human review checklist must cover all local draft workflows and blocked live actions');
}
const aiRecommendationReviewBindings = (html.match(/required_human_review: recommendation\.recommendation\.required_human_review/g) || []).length;
const aiRecommendationLiveStatusBindings = (html.match(/live_action_status: recommendation\.recommendation\.live_action_status/g) || []).length;
if (aiRecommendationReviewBindings < 6 || aiRecommendationLiveStatusBindings < 6) {
  fail('AI recommendation draft results must show required human review and BLOCKED_FOR_LIVE status for every local draft workflow');
}
const aiRecommendationHumanReviewFlagBindings = (html.match(/required_human_review_flag: Boolean\(recommendation\.recommendation\.required_human_review\)/g) || []).length;
if (aiRecommendationHumanReviewFlagBindings < 6) {
  fail('AI recommendation draft results must show human-review required flag for every local draft workflow');
}
const aiRecommendationLiveBlockedFlagBindings = (html.match(/live_action_blocked_flag: recommendation\.recommendation\.live_action_status === 'BLOCKED_FOR_LIVE'/g) || []).length;
if (aiRecommendationLiveBlockedFlagBindings < 6) {
  fail('AI recommendation draft results must show live-action blocked flag for every local draft workflow');
}
const aiRecommendationAuditBindings = (html.match(/audit_event_required: recommendation\.recommendation\.audit_event_required/g) || []).length;
const aiRecommendationLocalOnlyBindings = (html.match(/local_only: recommendation\.recommendation\.local_only/g) || []).length;
if (aiRecommendationAuditBindings < 6 || aiRecommendationLocalOnlyBindings < 6) {
  fail('AI recommendation draft results must show audit-event requirement and local-only status for every local draft workflow');
}
const aiRecommendationAuditRequiredFlagBindings = (html.match(/audit_event_required_flag: Boolean\(recommendation\.recommendation\.audit_event_required\)/g) || []).length;
if (aiRecommendationAuditRequiredFlagBindings < 6) {
  fail('AI recommendation draft results must show audit-event required flag for every local draft workflow');
}
const aiRecommendationLocalOnlyFlagBindings = (html.match(/local_only_flag: Boolean\(recommendation\.recommendation\.local_only\)/g) || []).length;
if (aiRecommendationLocalOnlyFlagBindings < 6) {
  fail('AI recommendation draft results must show local-only flag for every local draft workflow');
}
const aiRecommendationAgentBindings = (html.match(/agent: recommendation\.recommendation\.agent/g) || []).length;
if (aiRecommendationAgentBindings < 6) {
  fail('AI recommendation draft results must show the owning agent for every local draft workflow');
}
const aiRecommendationWorkflowBindings = (html.match(/workflow: recommendation\.recommendation\.workflow/g) || []).length;
if (aiRecommendationWorkflowBindings < 6) {
  fail('AI recommendation draft results must show the workflow id for every local draft workflow');
}
const aiRecommendationEntityIdBindings = (html.match(/entity_id: recommendation\.recommendation\.entity_id/g) || []).length;
if (aiRecommendationEntityIdBindings < 6) {
  fail('AI recommendation draft results must show entity id for every local draft workflow');
}
const aiRecommendationEntityTypeBindings = (html.match(/entity_type: recommendation\.recommendation\.entity_type/g) || []).length;
if (aiRecommendationEntityTypeBindings < 6) {
  fail('AI recommendation draft results must show entity type for every local draft workflow');
}
const aiRecommendationInputRefBindings = (html.match(/input_refs: recommendation\.recommendation\.input_refs/g) || []).length;
if (aiRecommendationInputRefBindings < 6) {
  fail('AI recommendation draft results must show input refs for every local draft workflow');
}
const aiRecommendationInputRefCountBindings = (html.match(/input_ref_count: \(recommendation\.recommendation\.input_refs \|\| \[\]\)\.length/g) || []).length;
if (aiRecommendationInputRefCountBindings < 6) {
  fail('AI recommendation draft results must show input ref count for every local draft workflow');
}
const aiRecommendationBlockedActionBindings = (html.match(/blocked_live_actions: recommendation\.recommendation\.blocked_actions/g) || []).length;
if (aiRecommendationBlockedActionBindings < 6) {
  fail('AI recommendation draft results must show blocked live actions for every local draft workflow');
}
const aiRecommendationBlockedActionCountBindings = (html.match(/blocked_live_action_count: \(recommendation\.recommendation\.blocked_actions \|\| \[\]\)\.length/g) || []).length;
if (aiRecommendationBlockedActionCountBindings < 6) {
  fail('AI recommendation draft results must show blocked live action count for every local draft workflow');
}
const aiRecommendationAuditAttemptBindings = (html.match(/audit_event_attempted: recommendation\.audit_event_attempted/g) || []).length;
if (aiRecommendationAuditAttemptBindings < 6) {
  fail('AI recommendation draft results must show audit event attempt status for every local draft workflow');
}
const aiRecommendationSafeScopeBindings = (html.match(/safe_scope: recommendation\.safe_scope/g) || []).length;
if (aiRecommendationSafeScopeBindings < 6) {
  fail('AI recommendation draft results must show safe scope for every local draft workflow');
}
const aiRecommendationSafeScopeCountBindings = (html.match(/safe_scope_count: \(recommendation\.safe_scope \|\| \[\]\)\.length/g) || []).length;
if (aiRecommendationSafeScopeCountBindings < 6) {
  fail('AI recommendation draft results must show safe scope count for every local draft workflow');
}
const aiRecommendationVersionBindings = (html.match(/version: recommendation\.recommendation\.version/g) || []).length;
const aiRecommendationConfidenceBindings = (html.match(/confidence: recommendation\.recommendation\.confidence/g) || []).length;
if (aiRecommendationVersionBindings < 6 || aiRecommendationConfidenceBindings < 6) {
  fail('AI recommendation draft results must show recommendation version and confidence for every local draft workflow');
}
const aiRecommendationTextBindings = (html.match(/recommendation: recommendation\.recommendation\.recommendation/g) || []).length;
const aiRecommendationReasonBindings = (html.match(/reasons: recommendation\.recommendation\.reasons/g) || []).length;
if (aiRecommendationTextBindings < 6 || aiRecommendationReasonBindings < 6) {
  fail('AI recommendation draft results must show recommendation text and reasons for every local draft workflow');
}
const aiRecommendationReasonCountBindings = (html.match(/reason_count: \(recommendation\.recommendation\.reasons \|\| \[\]\)\.length/g) || []).length;
if (aiRecommendationReasonCountBindings < 6) {
  fail('AI recommendation draft results must show reason count for every local draft workflow');
}
const aiRecommendationFallbackBindings = (html.match(/fallback_state: '/g) || []).length;
if (aiRecommendationFallbackBindings < 6 || !html.includes('collect_missing_starter_loan_inputs')) {
  fail('AI recommendation draft results must show a fallback state for every local draft workflow');
}
const aiRecommendationRequestIdBindings = (html.match(/request_id: recommendation\.request_id/g) || []).length;
if (aiRecommendationRequestIdBindings < 6) {
  fail('AI recommendation draft results must show response body request_id for every local draft workflow');
}
const aiRecommendationHeaderBindings = (html.match(/request_id_header: recommendation\.request_id_header/g) || []).length;
if (aiRecommendationHeaderBindings < 6) {
  fail('AI recommendation draft results must show response header request_id for every local draft workflow');
}
const aiRecommendationRequestPathBindings = (html.match(/request_path: recommendation\.request_path/g) || []).length;
const aiRecommendationRequestMethodBindings = (html.match(/request_method: recommendation\.request_method/g) || []).length;
if (aiRecommendationRequestPathBindings < 6 || aiRecommendationRequestMethodBindings < 6) {
  fail('AI recommendation draft results must show request path and method for every local draft workflow');
}
const aiRecommendationTraceCompleteFlagBindings = (html.match(/request_trace_complete_flag: Boolean\(recommendation\.request_id && recommendation\.request_id_header\)/g) || []).length;
if (aiRecommendationTraceCompleteFlagBindings < 6) {
  fail('AI recommendation draft results must show request trace completeness flag for every local draft workflow');
}
const aiRecommendationGeneratedAtBindings = (html.match(/generated_at: recommendation\.generated_at/g) || []).length;
if (aiRecommendationGeneratedAtBindings < 6) {
  fail('AI recommendation draft results must show generated_at timestamp for every local draft workflow');
}
if (
  !html.includes('renderAiRecommendationError') ||
  !html.includes('no_recommendation_draft') ||
  !html.includes('audit_event_attempted')
) {
  fail('AI recommendation error UI must show no-draft and audit-attempt boundaries');
}
if (!html.includes('const safeScope = Array.isArray(body.safe_scope) ? body.safe_scope : [];') || !html.includes('safe_scope: safeScope') || !html.includes('details,')) {
  fail('AI recommendation error UI must expose safe_scope and validation details for founder/tester traceability');
}
if (!html.includes('safe_scope_count: safeScope.length')) {
  fail('AI recommendation error UI must expose safe_scope count for founder/tester traceability');
}
if (!html.includes('audit_event_skipped_flag: body.audit_event_attempted === false')) {
  fail('AI recommendation error UI must expose audit-event skipped flag for founder/tester traceability');
}
if (!html.includes('audit_event_known_flag: body.audit_event_attempted === true || body.audit_event_attempted === false')) {
  fail('AI recommendation error UI must expose audit-event known-state flag for founder/tester traceability');
}
if (!html.includes('audit_event_unknown_flag: body.audit_event_attempted !== true && body.audit_event_attempted !== false')) {
  fail('AI recommendation error UI must expose audit-event unknown-state flag for founder/tester traceability');
}
if (!html.includes("no_recommendation_draft_known_flag: typeof body.no_recommendation_draft === 'boolean'")) {
  fail('AI recommendation error UI must expose no-draft known-state flag for founder/tester traceability');
}
if (!html.includes('safe_scope_known_flag: Array.isArray(body.safe_scope)')) {
  fail('AI recommendation error UI must expose safe-scope known-state flag for founder/tester traceability');
}
if (!html.includes('const details = Array.isArray(body.details) ? body.details : [error.message];') || !html.includes('detail_count: details.length')) {
  fail('AI recommendation error UI must expose validation detail count for founder/tester traceability');
}
if (!html.includes('details_known_flag: Array.isArray(body.details)')) {
  fail('AI recommendation error UI must expose validation-detail known-state flag for founder/tester traceability');
}
if (!html.includes("first_detail: Array.isArray(details) && details.length > 0 ? details[0] : ''")) {
  fail('AI recommendation error UI must expose first validation detail for founder/tester traceability');
}
if (!html.includes("first_detail_present_flag: Array.isArray(details) && details.length > 0 && typeof details[0] === 'string' && details[0].length > 0")) {
  fail('AI recommendation error UI must expose first validation detail presence flag for founder/tester traceability');
}
if (!html.includes("first_detail_source: Array.isArray(body.details) ? 'backend_details' : 'ui_fallback'")) {
  fail('AI recommendation error UI must expose first validation detail source for founder/tester traceability');
}
if (!html.includes("error_known_flag: typeof body.error === 'string'")) {
  fail('AI recommendation error UI must expose backend error-label known-state flag for founder/tester traceability');
}
if (!html.includes("const requestIdHeader = body.request_id_header || error.request_id_header || '';") || !html.includes('request_id_header: requestIdHeader')) {
  fail('AI recommendation error UI must expose response header request_id for founder/tester traceability');
}
if (!html.includes("const requestId = typeof body.request_id === 'string' ? body.request_id : '';") || !html.includes('request_id: requestId')) {
  fail('AI recommendation error UI must normalize response-body request-id for founder/tester traceability');
}
if (!html.includes("request_id_known_flag: typeof body.request_id === 'string'")) {
  fail('AI recommendation error UI must expose response-body request-id known-state flag for founder/tester traceability');
}
if (!html.includes('request_id_present_flag: requestId.length > 0')) {
  fail('AI recommendation error UI must expose response-body request-id presence flag for founder/tester traceability');
}
if (!html.includes("request_id_header_known_flag: typeof requestIdHeader === 'string'")) {
  fail('AI recommendation error UI must expose response-header request-id known-state flag for founder/tester traceability');
}
if (!html.includes("request_id_header_present_flag: typeof requestIdHeader === 'string' && requestIdHeader.length > 0")) {
  fail('AI recommendation error UI must expose response-header request-id presence flag for founder/tester traceability');
}
if (!html.includes('request_id_mismatch_flag: Boolean(requestId && requestIdHeader && requestId !== requestIdHeader)')) {
  fail('AI recommendation error UI must expose request-id mismatch flag for founder/tester traceability');
}
if (!html.includes("request_id_match_status: requestId && requestIdHeader ? (requestId === requestIdHeader ? 'matched' : 'mismatched') : 'not_comparable'")) {
  fail('AI recommendation error UI must expose request-id match status for founder/tester traceability');
}
if (!html.includes('request_id_comparison_known_flag: Boolean(requestId && requestIdHeader)')) {
  fail('AI recommendation error UI must expose request-id comparison known flag for founder/tester traceability');
}
if (!html.includes('error.http_status = response.status')) {
  fail('AI recommendation error UI must expose HTTP status for founder/tester traceability');
}
if (!html.includes("const httpStatus = typeof error.http_status === 'number' ? error.http_status : 'unknown';") || !html.includes('http_status: httpStatus')) {
  fail('AI recommendation error UI must normalize HTTP status before founder/tester screenshots use it');
}
if (!html.includes("http_status_known_flag: typeof error.http_status === 'number'")) {
  fail('AI recommendation error UI must expose HTTP-status known-state flag for founder/tester traceability');
}
if (!html.includes("const httpStatusClass = typeof error.http_status === 'number' ? `${Math.floor(error.http_status / 100)}xx` : 'unknown';") || !html.includes('http_status_class: httpStatusClass')) {
  fail('AI recommendation error UI must expose normalized HTTP-status class for founder/tester screenshots');
}
if (!html.includes("const httpStatusRetryable = typeof error.http_status === 'number' && (error.http_status === 408 || error.http_status === 429 || error.http_status >= 500);") || !html.includes('http_status_retryable_flag: httpStatusRetryable')) {
  fail('AI recommendation error UI must expose retryable HTTP-status flag for founder/tester screenshots');
}
if (!html.includes("const httpStatusClientError = typeof error.http_status === 'number' && error.http_status >= 400 && error.http_status < 500;") || !html.includes('http_status_client_error_flag: httpStatusClientError')) {
  fail('AI recommendation error UI must expose client-error HTTP-status flag for founder/tester screenshots');
}
if (!html.includes("const httpStatusServerError = typeof error.http_status === 'number' && error.http_status >= 500;") || !html.includes('http_status_server_error_flag: httpStatusServerError')) {
  fail('AI recommendation error UI must expose server-error HTTP-status flag for founder/tester screenshots');
}
if (!html.includes('error.request_path = path')) {
  fail('AI recommendation error UI must expose request path for founder/tester traceability');
}
if (!html.includes("const requestPath = typeof error.request_path === 'string' ? error.request_path : 'unknown';") || !html.includes('request_path: requestPath')) {
  fail('AI recommendation error UI must normalize request path before founder/tester screenshots use it');
}
if (!html.includes("request_path_known_flag: typeof error.request_path === 'string'")) {
  fail('AI recommendation error UI must expose request-path known-state flag for founder/tester traceability');
}
if (!html.includes("request_path_present_flag: requestPath.length > 0")) {
  fail('AI recommendation error UI must expose request-path presence flag for founder/tester traceability');
}
if (!html.includes("error.request_method = options.method || 'GET'")) {
  fail('AI recommendation error UI must expose request method for founder/tester traceability');
}
if (!html.includes("const requestMethod = typeof error.request_method === 'string' ? error.request_method : 'unknown';") || !html.includes('request_method: requestMethod')) {
  fail('AI recommendation error UI must normalize request method before founder/tester screenshots use it');
}
if (!html.includes("request_method_known_flag: typeof error.request_method === 'string'")) {
  fail('AI recommendation error UI must expose request-method known-state flag for founder/tester traceability');
}
if (!html.includes("request_method_present_flag: requestMethod.length > 0")) {
  fail('AI recommendation error UI must expose request-method presence flag for founder/tester traceability');
}
if (!html.includes('request_trace_complete_flag: Boolean(requestId && requestIdHeader)')) {
  fail('AI recommendation error UI must expose request trace completeness flag for founder/tester traceability');
}
if (!html.includes('request_trace_incomplete_flag: !Boolean(requestId && requestIdHeader)')) {
  fail('AI recommendation error UI must expose request trace incompleteness flag for founder/tester traceability');
}
if (!html.includes("request_trace_status: requestId && requestIdHeader ? 'complete' : 'incomplete'")) {
  fail('AI recommendation error UI must expose human-readable request trace status for founder/tester traceability');
}
if (!html.includes("request_trace_source: requestId && requestIdHeader ? 'body_and_header' : requestId ? 'body_only' : requestIdHeader ? 'header_only' : 'missing'")) {
  fail('AI recommendation error UI must expose request trace source for founder/tester traceability');
}
for (const resultId of [
  'aiRecommendationResult',
  'aiJobMatchRecommendationResult',
  'aiVerificationTriageRecommendationResult',
  'aiPaymentExceptionRecommendationResult',
  'aiDisputeEvidenceSummaryRecommendationResult',
  'aiDraftDocumentPacketRecommendationResult',
]) {
  if (!html.includes(`renderAiRecommendationError('${resultId}', error)`)) {
    fail(`AI recommendation error UI must route ${resultId} failures through renderAiRecommendationError`);
  }
}
if (!html.includes('loadLaunchReadiness') || !html.includes('launchReadinessGrid')) {
  fail('smartcontractor.html must include the Production Readiness Gate UI');
}
if (!html.includes('function renderLaunchReadinessError(error)') || !html.includes('renderLaunchReadinessError(error)')) {
  fail('Production Readiness Gate UI must route failed readiness requests through a dedicated error renderer');
}
if (!html.includes('launch_readiness_error') || !html.includes('Launch Readiness Unavailable')) {
  fail('Production Readiness Gate error UI must show a named unavailable state and machine-readable error status');
}
if (!html.includes('launch_readiness_error') || !html.includes('request_trace_complete_flag') || !html.includes('requestIdHeader')) {
  fail('Production Readiness Gate error UI must expose request trace completeness and request-id header evidence');
}
if (!html.includes('No launch readiness approval, deploy, public launch, real-money pilot, live finance, Supabase, provider, legal, production, payment, loan, escrow, or token action is allowed from this error state.')) {
  fail('Production Readiness Gate error UI must block live actions from the error state');
}
if (!html.includes('loadBetaReadiness') || !html.includes('betaReadinessGrid') || !html.includes('/api/admin/beta-readiness')) {
  fail('smartcontractor.html must include the Controlled Beta Readiness UI');
}
if (!html.includes('function renderBetaReadinessError(error)') || !html.includes('renderBetaReadinessError(error)')) {
  fail('Controlled Beta Readiness UI must route failed readiness requests through a dedicated error renderer');
}
if (!html.includes('beta_readiness_error') || !html.includes('Beta Readiness Unavailable')) {
  fail('Controlled Beta Readiness error UI must show a named unavailable state and machine-readable error status');
}
if (!html.includes('beta_readiness_error') || !html.includes('request_trace_complete_flag') || !html.includes('requestIdHeader')) {
  fail('Controlled Beta Readiness error UI must expose request trace completeness and request-id header evidence');
}
if (!html.includes('No beta readiness approval, invite release, public launch, real-money pilot, live finance, deploy, Supabase, provider, legal, production, or token action is allowed from this error state.')) {
  fail('Controlled Beta Readiness error UI must block live actions from the error state');
}
if (!html.includes('loadWorkflowReadiness') || !html.includes('workflowReadinessGrid') || !html.includes('/api/admin/smartcontractor-workflow-readiness')) {
  fail('smartcontractor.html must include the SmartContractor Workflow Readiness UI');
}
if (!html.includes('function renderWorkflowReadinessError(error)') || !html.includes('renderWorkflowReadinessError(error)')) {
  fail('SmartContractor Workflow Readiness UI must route failed readiness requests through a dedicated error renderer');
}
if (!html.includes('Workflow Readiness Unavailable') || !html.includes('workflow_readiness_error')) {
  fail('SmartContractor Workflow Readiness error UI must show a named unavailable state and machine-readable error status');
}
if (!html.includes('workflow_readiness_error') || !html.includes('request_trace_complete_flag') || !html.includes('requestIdHeader')) {
  fail('SmartContractor Workflow Readiness error UI must expose request trace completeness and request-id header evidence');
}
if (!html.includes('No workflow readiness approval, payment, loan, escrow, refund, provider, legal, production, or token action is allowed from this error state.')) {
  fail('SmartContractor Workflow Readiness error UI must block live actions from the error state');
}
if (
  !html.includes('renderWorkflowReadinessFilterError') ||
  !html.includes('workflow_readiness_filter_error') ||
  !html.includes('valid_checkpoint_queue_filter_ids') ||
  !html.includes('Rejected queue_filter') ||
  !html.includes('No live workflow-readiness action attempted') ||
  !html.includes('No live action attempted: ${escapeHtml(body.no_live_action_attempted ?? true)}')
) {
  fail('SmartContractor Workflow Readiness UI must render invalid queue_filter details, valid local-only IDs, request trace, and no-live-action markers');
}
if (
  !html.includes('workflow_readiness_filter_recovery_actions') ||
  !html.includes("['Recovery actions', validQueueFilterIds.length]") ||
  !html.includes('validQueueFilterIds.map((id) => `<button class="secondary" type="button" onclick="loadWorkflowReadiness') ||
  !html.includes('Apply safe queue filter') ||
  !html.includes('Recovery action count:')
) {
  fail('SmartContractor Workflow Readiness invalid queue_filter UI must render safe local recovery buttons for valid queue filters');
}
if (!html.includes("const workflowMetrics = data.review_metrics || data.summary || {}") || !html.includes("['Workflow steps', workflowMetrics.total_steps]")) {
  fail('SmartContractor Workflow Readiness UI must summarize backend workflow metrics');
}
if (!html.includes('Workflow Readiness Request Trace') || !html.includes("data.request_id || 'missing-request-id'")) {
  fail('SmartContractor Workflow Readiness UI must show backend request_id for traceable founder/tester reports');
}
if (!html.includes('Workflow Go/No-Go Snapshot') || !html.includes('data.go_no_go.current_state') || !html.includes('data.go_no_go.real_money_state')) {
  fail('SmartContractor Workflow Readiness UI must show backend go/no-go states');
}
if (!html.includes('No real payments, live loan approval, escrow release, token collateral lock, provider commitment, legal decision, or production release from this panel.')) {
  fail('SmartContractor Workflow Readiness UI must show no-live-action boundary');
}
if (!html.includes('Workflow UI Integration Guard') || !html.includes('data.ui_next_integration.must_preserve')) {
  fail('SmartContractor Workflow Readiness UI must show the frontend integration guard from the backend');
}
if (!html.includes('data.workflow_steps.map((step)') || !html.includes('step.live_action_status') || !html.includes('step.blocked_live_actions.join')) {
  fail('SmartContractor Workflow Readiness UI must render every backend workflow step with blocked live actions');
}
if (!html.includes('Workflow Review Checkpoints') || !html.includes("['Review checkpoints', workflowMetrics.checkpoint_count]")) {
  fail('SmartContractor Workflow Readiness UI must summarize backend review checkpoints');
}
if (!html.includes('data.review_checkpoints.map((checkpoint)') || !html.includes('checkpoint.required_evidence.join') || !html.includes('checkpoint.blocked_live_actions.join')) {
  fail('SmartContractor Workflow Readiness UI must render every backend review checkpoint with required evidence and blocked live actions');
}
if (!html.includes('checkpoint.next_review_action') || !html.includes('checkpoint.blocked_until') || !html.includes('checkpoint.review_packet_target')) {
  fail('SmartContractor Workflow Readiness UI must render checkpoint next action, blocked-until gate, and review packet target');
}
if (!html.includes('Next review action:') || !html.includes('Blocked until:') || !html.includes('Review packet:')) {
  fail('SmartContractor Workflow Readiness UI must label checkpoint review action fields clearly');
}
if (!html.includes('Workflow Checkpoint Action Queue') || !html.includes("['Checkpoint queue', workflowMetrics.checkpoint_action_queue_count]")) {
  fail('SmartContractor Workflow Readiness UI must summarize the checkpoint action queue');
}
if (!html.includes('checkpointQueueItems.map((item)') || !html.includes('item.admin_queue_state') || !html.includes('item.live_action_status')) {
  fail('SmartContractor Workflow Readiness UI must render filtered checkpoint action queue items with queue and live status');
}
if (!html.includes('Queue priority:') || !html.includes('Admin queue state:') || !html.includes('Packet target:')) {
  fail('SmartContractor Workflow Readiness UI must label checkpoint action queue fields clearly');
}
if (!html.includes('Workflow Queue Filter Groups') || !html.includes("['Queue filters', workflowMetrics.checkpoint_queue_filter_count]")) {
  fail('SmartContractor Workflow Readiness UI must summarize queue filter groups');
}
if (!html.includes("function loadWorkflowReadiness(queueFilter = state.workflowReadinessQueueFilter || 'all_review_items')") || !html.includes("queue_filter=${encodeURIComponent(queueFilter)}")) {
  fail('SmartContractor Workflow Readiness UI must request selected local queue filters through the API');
}
if (!html.includes('data.selected_checkpoint_queue_filter') || !html.includes('data.filtered_checkpoint_action_queue')) {
  fail('SmartContractor Workflow Readiness UI must use backend selected filter and filtered queue results');
}
if (!html.includes('data.selected_checkpoint_queue_review_context') || !html.includes('Selected Queue Review Context')) {
  fail('SmartContractor Workflow Readiness UI must show selected queue review context');
}
if (!html.includes('data.selected_checkpoint_queue_review_links') || !html.includes('Selected Review Packet Links')) {
  fail('SmartContractor Workflow Readiness UI must show selected review packet links');
}
if (!html.includes("['Selected packets', (reviewContext.review_packet_targets || []).length]") || !html.includes("['Selected blocked actions', (reviewContext.blocked_live_actions || []).length]")) {
  fail('SmartContractor Workflow Readiness UI must summarize selected review packet and blocked action counts');
}
if (!html.includes("['Selected links', selectedReviewLinks.length]")) {
  fail('SmartContractor Workflow Readiness UI must summarize selected review packet link count');
}
if (!html.includes('Review packet targets:') || !html.includes('Selected blocked live actions:') || !html.includes('Selected next actions:') || !html.includes('Selected safe scope:')) {
  fail('SmartContractor Workflow Readiness UI must label selected queue review context fields clearly');
}
if (!html.includes('selectedReviewLinks.map((link)') || !html.includes('Packet target:') || !html.includes('Local anchor:') || !html.includes('Route hint:') || !html.includes('Link live status:')) {
  fail('SmartContractor Workflow Readiness UI must label selected review packet link fields clearly');
}
if (!html.includes('Open local anchor') || !html.includes('href="${escapeHtml(link.local_anchor)}"')) {
  fail('SmartContractor Workflow Readiness UI must expose local-only review packet anchor links');
}
if (
  !html.includes('const selectedReviewPacketSummary = selectedReviewLinks.map((link) =>') ||
  !html.includes('`${link.review_packet_target}|${link.local_anchor}|${link.route_hint}`') ||
  !html.includes('Selected Review Packet Summary') ||
  !html.includes('workflow_readiness_packet_summary_local_only') ||
  !html.includes('copyWorkflowReadinessPacketSummary') ||
  !html.includes('Copy summary') ||
  !html.includes('No server storage, external send, payment, loan, escrow, provider, legal, production, stablecoin, or token action is attempted by this summary.')
) {
  fail('SmartContractor Workflow Readiness UI must expose a local-only copyable selected review packet summary');
}
if (!html.includes('Selected Workflow Queue Filter') || !html.includes("['Selected filter', selectedQueueFilter.id || 'all_review_items']") || !html.includes("['Filtered queue items', workflowMetrics.selected_checkpoint_queue_item_count ?? checkpointQueueItems.length]")) {
  fail('SmartContractor Workflow Readiness UI must summarize the selected queue filter and filtered item count');
}
if (!html.includes("onclick=\"loadWorkflowReadiness('") || !html.includes('Apply local filter')) {
  fail('SmartContractor Workflow Readiness UI must expose safe local queue filter actions');
}
if (!html.includes('data.checkpoint_queue_filters.map((filter)') || !html.includes('filter.filter_field') || !html.includes('filter.filter_value')) {
  fail('SmartContractor Workflow Readiness UI must render every queue filter group with filter field and value');
}
if (!html.includes('Filter field:') || !html.includes('Filter value:') || !html.includes('Filter live status:')) {
  fail('SmartContractor Workflow Readiness UI must label queue filter group fields clearly');
}
if (!html.includes('milestone evidence, working-capital review, dispute packet, and founder authority gates stay REVIEW_REQUIRED before beta/legal/provider activation.')) {
  fail('SmartContractor Workflow Readiness UI must explain checkpoint review scope without approving beta/legal/provider activation');
}
if (!html.includes("const smartContractSurfaceGate = (data.checks || []).find((item) => item.id === 'smart_contract_product_surfaces_demo_only')")) {
  fail('Controlled Beta Readiness UI must select the smart_contract_product_surfaces_demo_only gate explicitly');
}
if (!html.includes('Smart Contract Demo Gate') || !html.includes('smartContractSurfaceGate.detail')) {
  fail('Controlled Beta Readiness UI must show an explicit Smart Contract Demo Gate card');
}
if (!html.includes('Accounts: gcscworkcap1, gcscclaim111, gcsccredit11, gcscadvance1')) {
  fail('Controlled Beta Readiness UI must show all four demo-only smart contract accounts in the gate card');
}
if (!html.includes('Blocked live: deployment, ClaimBridge, working capital, escrow-backed advance, repayment routing, token custody')) {
  fail('Controlled Beta Readiness UI must show blocked live smart contract actions in the gate card');
}
if (!html.includes('Beta Readiness Request Trace') || !html.includes("data.request_id || 'missing-request-id'")) {
  fail('Controlled Beta Readiness UI must show backend request_id for traceable founder/tester beta reports');
}
if (!html.includes('Beta Readiness Decision Snapshot') || !html.includes('data.decision.local_controlled_beta_without_real_money') || !html.includes('data.decision.public_beta_without_real_money') || !html.includes('data.decision.real_money_pilot')) {
  fail('Controlled Beta Readiness UI must show backend decision fields in a dedicated decision snapshot');
}
if (!html.includes('No public launch, real-money pilot, or live finance without founder/legal/provider/deploy/Auth/RLS review.')) {
  fail('Controlled Beta Readiness UI must block public launch, real-money pilot, and live finance from the decision snapshot');
}
if (!html.includes('Beta Evidence Safety Snapshot') || !html.includes('Raw tester artifacts stay local until redacted, approved, and cleared by founder/admin review.')) {
  fail('Controlled Beta Readiness UI must show a focused beta evidence safety snapshot');
}
if (!html.includes('External Packet Safety Snapshot') || !html.includes('Public, partner, grant, investor, provider, and legal packets stay review-only until redacted evidence and conservative claims are approved.')) {
  fail('Controlled Beta Readiness UI must show a focused external packet safety snapshot');
}
if (!html.includes('External Packet Follow-up Snapshot') || !html.includes('External packet follow-up stays metadata-only and routes legal/provider/payment/loan/escrow/token/production questions to founder review.')) {
  fail('Controlled Beta Readiness UI must show a focused external packet follow-up snapshot');
}
if (!html.includes('External Packet Owner Handoff Snapshot') || !html.includes('External packet owner handoff stays local-review only and cannot assign secrets, live payments, legal advice, or production authority to autonomous Codex.')) {
  fail('Controlled Beta Readiness UI must show a focused external packet owner handoff snapshot');
}
if (!html.includes("data.generated_at || 'unknown'")) {
  fail('Controlled Beta Readiness UI must show backend generated_at beside the request trace');
}
if (!html.includes('Use this ID in founder/tester beta reports; do not paste tokens or private IDs.')) {
  fail('Controlled Beta Readiness UI must show safe request trace report-back boundary');
}
if (!html.includes("const founderTaskCount = (data.founder_present_tasks || []).length") || !html.includes("['Founder tasks', founderTaskCount]")) {
  fail('Controlled Beta Readiness UI must summarize founder-present task count');
}
if (!html.includes("const founderGateCount = (data.blocked_until_founder || []).length") || !html.includes("['Founder gates', founderGateCount]")) {
  fail('Controlled Beta Readiness UI must summarize founder/live-risk gate count');
}
if (!html.includes("const stopConditionCount = (data.session_stop_conditions || []).length") || !html.includes("['Stop gates', stopConditionCount]")) {
  fail('Controlled Beta Readiness UI must summarize session stop-condition count');
}
if (!html.includes("const artifactExportGuardCount = (data.tester_artifact_export_guard || []).length") || !html.includes("['Export guards', artifactExportGuardCount]")) {
  fail('Controlled Beta Readiness UI must summarize artifact export-guard count');
}
if (!html.includes("const externalPacketManifestCount = (data.tester_artifact_external_packet_manifest || []).length") || !html.includes("['Packet manifest', externalPacketManifestCount]")) {
  fail('Controlled Beta Readiness UI must summarize external packet manifest rule count');
}
if (!html.includes("const externalPacketClaimReviewCount = (data.tester_artifact_external_packet_claim_review || []).length") || !html.includes("['Claim review', externalPacketClaimReviewCount]")) {
  fail('Controlled Beta Readiness UI must summarize external packet claim-review rule count');
}
if (!html.includes("const externalPacketFollowupQueueCount = (data.tester_artifact_external_packet_followup_queue || []).length") || !html.includes("['Packet follow-up', externalPacketFollowupQueueCount]")) {
  fail('Controlled Beta Readiness UI must summarize external packet follow-up queue count');
}
if (!html.includes("const externalPacketEscalationRuleCount = (data.tester_artifact_external_packet_followup_escalation_rules || []).length") || !html.includes("['Packet escalation', externalPacketEscalationRuleCount]")) {
  fail('Controlled Beta Readiness UI must summarize external packet follow-up escalation rule count');
}
if (!html.includes("const externalPacketDecisionSummaryCount = (data.tester_artifact_external_packet_followup_decision_summary || []).length") || !html.includes("['Packet decisions', externalPacketDecisionSummaryCount]")) {
  fail('Controlled Beta Readiness UI must summarize external packet follow-up decision summary count');
}
if (!html.includes("const externalPacketOwnerHandoffCount = (data.tester_artifact_external_packet_followup_owner_handoff || []).length") || !html.includes("['Owner handoffs', externalPacketOwnerHandoffCount]")) {
  fail('Controlled Beta Readiness UI must summarize external packet follow-up owner handoff count');
}
if (!html.includes('Founder Gate Snapshot') || !html.includes('Founder-present tasks: ${escapeHtml(founderTaskCount)}')) {
  fail('Controlled Beta Readiness UI must show a focused Founder Gate Snapshot card');
}
if (!html.includes('No Codex live action: Auth/admin, deploy, Supabase, legal/provider, payments, loans, escrow, repayment, token collateral, or XPR deployment.')) {
  fail('Controlled Beta Readiness UI must show no-live-action boundary in Founder Gate Snapshot');
}
if (!html.includes('Next Safe Steps') || !html.includes('data.next_safe_steps')) {
  fail('Controlled Beta Readiness UI must show next_safe_steps from the backend');
}
if (!html.includes('Required Beta Documents') || !html.includes('data.required_docs.map')) {
  fail('Controlled Beta Readiness UI must show required_docs status from the backend');
}
if (!html.includes('${doc.id}: ${doc.status} (${doc.file})')) {
  fail('Controlled Beta Readiness UI must show required_docs file paths, not only IDs');
}
if (!html.includes('data.document_summary') || !html.includes('data.missing_docs') || !html.includes('Missing docs')) {
  fail('Controlled Beta Readiness UI must show backend document_summary and missing_docs state');
}
if (!html.includes('Validation Commands') || !html.includes('data.validation_commands')) {
  fail('Controlled Beta Readiness UI must show backend validation_commands');
}
if (!html.includes('Safe Report Back') || !html.includes('data.report_back_template')) {
  fail('Controlled Beta Readiness UI must show backend report_back_template');
}
if (!html.includes('Safe Report Fields') || !html.includes('data.safe_report_fields')) {
  fail('Controlled Beta Readiness UI must show backend safe_report_fields');
}
if (!html.includes('Go/No-Go Rules') || !html.includes('data.go_no_go_rules')) {
  fail('Controlled Beta Readiness UI must show backend go_no_go_rules');
}
if (!html.includes('Tester Day Checklist') || !html.includes('data.tester_day_checklist')) {
  fail('Controlled Beta Readiness UI must show backend tester_day_checklist');
}
if (!html.includes('Issue Intake Fields') || !html.includes('data.issue_intake_fields')) {
  fail('Controlled Beta Readiness UI must show backend issue_intake_fields');
}
if (!html.includes('Evidence Retention Policy') || !html.includes('data.evidence_retention_policy')) {
  fail('Controlled Beta Readiness UI must show backend evidence_retention_policy');
}
if (!html.includes('Tester Handoff Packet') || !html.includes('data.tester_handoff_packet')) {
  fail('Controlled Beta Readiness UI must show backend tester_handoff_packet');
}
if (!html.includes('Session Stop Conditions') || !html.includes('data.session_stop_conditions')) {
  fail('Controlled Beta Readiness UI must show backend session_stop_conditions');
}
if (!html.includes('Post-Session Actions') || !html.includes('data.post_session_actions')) {
  fail('Controlled Beta Readiness UI must show backend post_session_actions');
}
if (!html.includes('Public Beta Exit Criteria') || !html.includes('data.public_beta_exit_criteria')) {
  fail('Controlled Beta Readiness UI must show backend public_beta_exit_criteria');
}
if (!html.includes('Pre-Invite Checks') || !html.includes('data.pre_invite_checks')) {
  fail('Controlled Beta Readiness UI must show backend pre_invite_checks');
}
if (!html.includes('Invite Message Checklist') || !html.includes('data.invite_message_checklist')) {
  fail('Controlled Beta Readiness UI must show backend invite_message_checklist');
}
if (!html.includes('Tester Consent Checklist') || !html.includes('data.tester_consent_checklist')) {
  fail('Controlled Beta Readiness UI must show backend tester_consent_checklist');
}
if (!html.includes('Tester Role Briefing') || !html.includes('data.tester_role_briefing')) {
  fail('Controlled Beta Readiness UI must show backend tester_role_briefing');
}
if (!html.includes('Tester Success Signals') || !html.includes('data.tester_success_signals')) {
  fail('Controlled Beta Readiness UI must show backend tester_success_signals');
}
if (!html.includes('Tester Failure Signals') || !html.includes('data.tester_failure_signals')) {
  fail('Controlled Beta Readiness UI must show backend tester_failure_signals');
}
if (!html.includes('Tester Redaction Reminders') || !html.includes('data.tester_redaction_reminders')) {
  fail('Controlled Beta Readiness UI must show backend tester_redaction_reminders');
}
if (!html.includes('Tester Artifact Naming') || !html.includes('data.tester_artifact_naming')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_naming');
}
if (!html.includes('Tester Artifact Index') || !html.includes('data.tester_artifact_index')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_index');
}
if (!html.includes('Tester Artifact Review Queue') || !html.includes('data.tester_artifact_review_queue')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_review_queue');
}
if (!html.includes('Tester Artifact Export Guard') || !html.includes('data.tester_artifact_export_guard')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_export_guard');
}
if (!html.includes('Tester Artifact Purge Policy') || !html.includes('data.tester_artifact_purge_policy')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_purge_policy');
}
if (!html.includes('Tester Artifact Retention Clock') || !html.includes('data.tester_artifact_retention_clock')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_retention_clock');
}
if (!html.includes('Tester Artifact Disposal Ledger') || !html.includes('data.tester_artifact_disposal_ledger')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_disposal_ledger');
}
if (!html.includes('Tester Artifact Access Roles') || !html.includes('data.tester_artifact_access_roles')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_access_roles');
}
if (!html.includes('Tester Artifact Chain Of Custody') || !html.includes('data.tester_artifact_chain_of_custody')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_chain_of_custody');
}
if (!html.includes('Tester Artifact Public Summary Rules') || !html.includes('data.tester_artifact_public_summary_rules')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_public_summary_rules');
}
if (!html.includes('Tester Artifact Anonymization Checklist') || !html.includes('data.tester_artifact_anonymization_checklist')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_anonymization_checklist');
}
if (!html.includes('Tester Artifact Approval Stamp') || !html.includes('data.tester_artifact_approval_stamp')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_approval_stamp');
}
if (!html.includes('Tester Artifact Revocation Rules') || !html.includes('data.tester_artifact_revocation_rules')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_revocation_rules');
}
if (!html.includes('Tester Artifact External Packet Manifest') || !html.includes('data.tester_artifact_external_packet_manifest')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_external_packet_manifest');
}
if (!html.includes('Tester Artifact External Packet Distribution Log') || !html.includes('data.tester_artifact_external_packet_distribution_log')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_external_packet_distribution_log');
}
if (!html.includes('Tester Artifact External Packet Recall Checklist') || !html.includes('data.tester_artifact_external_packet_recall_checklist')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_external_packet_recall_checklist');
}
if (!html.includes('Tester Artifact External Packet Correction Notice') || !html.includes('data.tester_artifact_external_packet_correction_notice')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_external_packet_correction_notice');
}
if (!html.includes('Tester Artifact External Packet Version History') || !html.includes('data.tester_artifact_external_packet_version_history')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_external_packet_version_history');
}
if (!html.includes('Tester Artifact External Packet Claim Review') || !html.includes('data.tester_artifact_external_packet_claim_review')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_external_packet_claim_review');
}
if (!html.includes('Tester Artifact External Packet Audience Review') || !html.includes('data.tester_artifact_external_packet_audience_review')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_external_packet_audience_review');
}
if (!html.includes('Tester Artifact External Packet Recipient Acknowledgement') || !html.includes('data.tester_artifact_external_packet_recipient_acknowledgement')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_external_packet_recipient_acknowledgement');
}
if (!html.includes('Tester Artifact External Packet Follow-up Queue') || !html.includes('data.tester_artifact_external_packet_followup_queue')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_external_packet_followup_queue');
}
if (!html.includes('Tester Artifact External Packet Follow-up Closure Rules') || !html.includes('data.tester_artifact_external_packet_followup_closure_rules')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_external_packet_followup_closure_rules');
}
if (!html.includes('Tester Artifact External Packet Follow-up Escalation Rules') || !html.includes('data.tester_artifact_external_packet_followup_escalation_rules')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_external_packet_followup_escalation_rules');
}
if (!html.includes('Tester Artifact External Packet Follow-up SLA Policy') || !html.includes('data.tester_artifact_external_packet_followup_sla_policy')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_external_packet_followup_sla_policy');
}
if (!html.includes('Tester Artifact External Packet Follow-up Decision Summary') || !html.includes('data.tester_artifact_external_packet_followup_decision_summary')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_external_packet_followup_decision_summary');
}
if (!html.includes('Tester Artifact External Packet Follow-up Owner Handoff') || !html.includes('data.tester_artifact_external_packet_followup_owner_handoff')) {
  fail('Controlled Beta Readiness UI must show backend tester_artifact_external_packet_followup_owner_handoff');
}
if (!html.includes('Founder Review Packet') || !html.includes('data.review_packet')) {
  fail('Controlled Beta Readiness UI must show backend review_packet');
}
if (!html.includes('Founder Present Tasks') || !html.includes('data.founder_present_tasks')) {
  fail('Controlled Beta Readiness UI must show backend founder_present_tasks');
}
if (!html.includes('loadAuthReadiness') || !html.includes('authReadinessGrid')) {
  fail('smartcontractor.html must include the Auth Decision Package UI');
}
if (!html.includes('function renderAuthReadinessError(error)') || !html.includes('renderAuthReadinessError(error)')) {
  fail('Auth Decision Package UI must route failed auth-readiness requests through a dedicated error renderer');
}
if (!html.includes('auth_readiness_error') || !html.includes('Auth Readiness Unavailable')) {
  fail('Auth Decision Package error UI must show a named unavailable state and machine-readable error status');
}
if (!html.includes('auth_readiness_error') || !html.includes('request_trace_complete_flag') || !html.includes('requestIdHeader')) {
  fail('Auth Decision Package error UI must expose request trace completeness and request-id header evidence');
}
if (!html.includes('No auth mode selection, admin activation, strict RLS, deploy, Supabase write, provider, legal, production, payment, loan, escrow, or token action is allowed from this error state.')) {
  fail('Auth Decision Package error UI must block live auth actions from the error state');
}
if (!html.includes('loadFounderAuthSetup') || !html.includes('founderAuthSetupGrid')) {
  fail('smartcontractor.html must include the Founder Auth Setup UI');
}
if (
  !server.includes("app.get('/api/admin/founder-auth-setup/report'") ||
  !server.includes('founder_auth_setup_report') ||
  !server.includes('report_sections') ||
  !server.includes('copyable_founder_steps') ||
  !server.includes('report_gate') ||
  !server.includes('founder_admin_membership_approval_blocked') ||
  !server.includes('no_live_action_attempted')
) {
  fail('server.js must expose a local Founder Auth Setup report with copyable steps, report sections, blocked admin membership approval, and no-live-action boundary');
}
if (
  !html.includes('/api/admin/founder-auth-setup/report') ||
  !html.includes('founderAuthSetupReport') ||
  !html.includes('Founder Auth Setup Report') ||
  !html.includes('loadFounderAuthSetupReport') ||
  !html.includes('copyable_founder_steps') ||
  !html.includes('report_gate') ||
  !html.includes('founder_admin_membership_approval_blocked')
) {
  fail('Founder Auth Setup UI must render the local report, copyable founder steps, and blocked admin membership approval gate');
}
if (
  !server.includes("app.get('/api/admin/founder-auth-setup/print-template'") ||
  !server.includes('founder_auth_setup_print_template') ||
  !server.includes('print_template_sections') ||
  !server.includes('evidence_redaction_attestation') ||
  !server.includes('copyable_markdown_preview') ||
  !server.includes('export_gate') ||
  !server.includes('no_live_action_attempted')
) {
  fail('server.js must expose a local Founder Auth Setup print template with safe evidence sections, redaction attestation, export gate, and no-live-action boundary');
}
if (
  !html.includes('/api/admin/founder-auth-setup/print-template') ||
  !html.includes('founderAuthSetupPrintTemplate') ||
  !html.includes('Founder Auth Setup Print Template') ||
  !html.includes('loadFounderAuthSetupPrintTemplate') ||
  !html.includes('print_template_sections') ||
  !html.includes('copyable_markdown_preview') ||
  !html.includes('evidence_redaction_attestation') ||
  !html.includes('export_gate')
) {
  fail('Founder Auth Setup UI must render the local print template, safe evidence sections, redaction attestation, copyable markdown preview, and export gate');
}
if (
  !server.includes("app.get('/api/admin/strict-admin-smoke-readiness'") ||
  !server.includes('strict_admin_smoke_readiness') ||
  !server.includes('smoke_readiness_sections') ||
  !server.includes('strict_admin_smoke_gate') ||
  !server.includes('copyable_smoke_commands') ||
  !server.includes('founder_admin_membership_required') ||
  !server.includes('no_live_action_attempted')
) {
  fail('server.js must expose local strict admin smoke readiness with sections, copyable commands, founder admin membership requirement, strict gate, and no-live-action boundary');
}
if (
  !html.includes('/api/admin/strict-admin-smoke-readiness') ||
  !html.includes('strictAdminSmokeReadiness') ||
  !html.includes('Strict Admin Smoke Readiness') ||
  !html.includes('loadStrictAdminSmokeReadiness') ||
  !html.includes('smoke_readiness_sections') ||
  !html.includes('strict_admin_smoke_gate') ||
  !html.includes('copyable_smoke_commands') ||
  !html.includes('founder_admin_membership_required')
) {
  fail('SmartContractor Admin UI must render strict admin smoke readiness, sections, gate, copyable commands, and founder admin membership requirement');
}
if (
  !server.includes("app.get('/api/admin/strict-admin-smoke-output-template'") ||
  !server.includes('strict_admin_smoke_output_template') ||
  !server.includes('output_template_sections') ||
  !server.includes('copyable_output_template') ||
  !server.includes('output_capture_gate') ||
  !server.includes('strict_gates_output_capture') ||
  !server.includes('no_live_action_attempted')
) {
  fail('server.js must expose local strict admin smoke output template with output sections, copyable capture template, capture gate, strict-gates capture section, and no-live-action boundary');
}
if (
  !html.includes('/api/admin/strict-admin-smoke-output-template') ||
  !html.includes('strictAdminSmokeOutputTemplate') ||
  !html.includes('Strict Admin Smoke Output Template') ||
  !html.includes('loadStrictAdminSmokeOutputTemplate') ||
  !html.includes('output_template_sections') ||
  !html.includes('copyable_output_template') ||
  !html.includes('output_capture_gate') ||
  !html.includes('strict_gates_output_capture')
) {
  fail('SmartContractor Admin UI must render strict admin smoke output template, output sections, capture gate, strict-gates capture section, and copyable output template');
}
if (
  !server.includes("app.post('/api/admin/strict-admin-smoke-output-draft/validate'") ||
  !server.includes('strict_admin_smoke_output_draft_validation') ||
  !server.includes('draft_validation_sections') ||
  !server.includes('forbidden_content_findings') ||
  !server.includes('draft_validation_gate') ||
  !server.includes('safe_copy_summary') ||
  !server.includes('no_server_storage_attempted') ||
  !server.includes('no_live_action_attempted')
) {
  fail('server.js must expose local strict admin smoke output draft validation with sections, forbidden-content findings, validation gate, safe summary, no-storage, and no-live-action boundaries');
}
if (
  !html.includes('/api/admin/strict-admin-smoke-output-draft/validate') ||
  !html.includes('strictAdminSmokeDraftValidation') ||
  !html.includes('Strict Admin Smoke Draft Validation') ||
  !html.includes('validateStrictAdminSmokeOutputDraft') ||
  !html.includes('draft_validation_sections') ||
  !html.includes('forbidden_content_findings') ||
  !html.includes('draft_validation_gate') ||
  !html.includes('safe_copy_summary')
) {
  fail('SmartContractor Admin UI must render strict admin smoke draft validation, validation sections, forbidden-content findings, validation gate, and safe copy summary');
}
if (
  !html.includes('STRICT_ADMIN_SMOKE_DRAFT_VALIDATION_HISTORY_KEY') ||
  !html.includes('strictAdminSmokeDraftValidationHistory') ||
  !html.includes('strictAdminSmokeDraftValidationHistorySummary') ||
  !html.includes('strictAdminSmokeDraftValidationHistoryGrid') ||
  !html.includes('clearStrictAdminSmokeDraftValidationHistoryBtn') ||
  !html.includes('saveStrictAdminSmokeDraftValidationHistory') ||
  !html.includes('renderStrictAdminSmokeDraftValidationHistory') ||
  !html.includes('strict_admin_smoke_draft_validation_history') ||
  !html.includes('local_history_only') ||
  !html.includes('metadata_only')
) {
  fail('SmartContractor Admin UI must keep a local metadata-only strict admin smoke draft validation history without storing raw draft text');
}
if (
  !server.includes("app.post('/api/admin/request-trace-report'") ||
  !server.includes('request_trace_report') ||
  !server.includes('request_trace_report_sections') ||
  !server.includes('safe_request_ids') ||
  !server.includes('request_trace_report_gate') ||
  !server.includes('input_limit_warnings') ||
  !server.includes('request_trace_report_input_limits') ||
  !server.includes('copyable_report_markdown') ||
  !server.includes('no_server_storage_attempted') ||
  !server.includes('no_live_action_attempted')
) {
  fail('server.js must expose a local request trace report endpoint with sections, safe request IDs, input-limit warnings, report gate, copyable markdown, no-storage, and no-live-action boundaries');
}
if (
  !html.includes('/api/admin/request-trace-report') ||
  !html.includes('requestTraceReport') ||
  !html.includes('Request Trace Report') ||
  !html.includes('generateRequestTraceReport') ||
  !html.includes('request_trace_report_sections') ||
  !html.includes('safe_request_ids') ||
  !html.includes('request_trace_report_gate') ||
  !html.includes('copyable_report_markdown') ||
  !html.includes('renderRequestTraceReportMissingIdsRecovery') ||
  !html.includes('request_trace_report_missing_ids_recovery_actions') ||
  !html.includes('prefillRequestTraceReportIdsFromLocalEvidence') ||
  !html.includes('Use latest local evidence request IDs') ||
  !html.includes('No server storage or live lookup attempted') ||
  !html.includes('renderRequestTraceReportRedactionRecovery') ||
  !html.includes('request_trace_report_redaction_recovery_actions') ||
  !html.includes('clearRequestTraceReportUnsafeInputs') ||
  !html.includes('Clear unsafe local request trace inputs') ||
  !html.includes('No external send or live action attempted') ||
  !html.includes('renderRequestTraceReportInputLimitRecovery') ||
  !html.includes('request_trace_report_input_limit_recovery_actions') ||
  !html.includes('input_limit_warnings') ||
  !html.includes('Trim to safe local request trace limits') ||
  !html.includes('No server storage or external export attempted')
) {
  fail('SmartContractor Admin UI must render request trace report generation, sections, safe request IDs, report gate, copyable markdown, missing-ID recovery actions, redaction recovery actions, and input-limit recovery actions');
}
if (
  !html.includes('REQUEST_TRACE_REPORT_HISTORY_KEY') ||
  !html.includes('requestTraceReportHistory') ||
  !html.includes('requestTraceReportHistorySummary') ||
  !html.includes('requestTraceReportHistoryGrid') ||
  !html.includes('clearRequestTraceReportHistoryBtn') ||
  !html.includes('saveRequestTraceReportHistory') ||
  !html.includes('renderRequestTraceReportHistory') ||
  !html.includes('request_trace_report_history') ||
  !html.includes('local_history_only') ||
  !html.includes('metadata_only')
) {
  fail('SmartContractor Admin UI must keep a local metadata-only request trace report history with clear control and no server storage');
}
if (
  !html.includes('ADMIN_LOCAL_EVIDENCE_TIMELINE_KEY') ||
  !html.includes('adminLocalEvidenceTimeline') ||
  !html.includes('adminLocalEvidenceTimelineSummary') ||
  !html.includes('adminLocalEvidenceTimelineGrid') ||
  !html.includes('clearAdminLocalEvidenceTimelineBtn') ||
  !html.includes('saveAdminLocalEvidenceTimelineEntry') ||
  !html.includes('renderAdminLocalEvidenceTimeline') ||
  !html.includes('admin_local_evidence_timeline') ||
  !html.includes('local_browser_only') ||
  !html.includes('metadata_only') ||
  !html.includes('strict_admin_smoke_draft_validation') ||
  !html.includes('request_trace_report')
) {
  fail('SmartContractor Admin UI must keep a local metadata-only admin evidence timeline for strict draft validation and request trace reports');
}
if (
  !server.includes("app.get('/api/admin/admin-evidence-export-preview'") ||
  !server.includes('admin_evidence_export_preview') ||
  !server.includes('metadata_allowlist') ||
  !server.includes('blocked_fields') ||
  !server.includes('selected_source_filter') ||
  !server.includes('valid_source_filters') ||
  !server.includes('invalid_source_filter') ||
  !server.includes('review_router') ||
  !server.includes('review_targets') ||
  !server.includes('ui_anchor') ||
  !server.includes('next_review_action') ||
  !server.includes('safe_review_router') ||
  !server.includes('export_gate') ||
  !server.includes('raw_draft_text') ||
  !server.includes('copyable_report_markdown') ||
  !server.includes('no_server_storage_attempted') ||
  !server.includes('no_live_action_attempted')
) {
  fail('server.js must expose a local admin evidence export preview endpoint with source filters, review router targets, metadata allowlist, blocked fields, export gate, no-storage, and no-live-action boundaries');
}
if (
  !html.includes('/api/admin/admin-evidence-export-preview') ||
  !html.includes('adminEvidenceExportPreview') ||
  !html.includes('Admin Evidence Export Preview') ||
  !html.includes('adminEvidenceExportPreviewSourceFilter') ||
  !html.includes('loadAdminEvidenceExportPreview') ||
  !html.includes('selected_source_filter') ||
  !html.includes('valid_source_filters') ||
  !html.includes('source_filter') ||
  !html.includes('metadata_allowlist') ||
  !html.includes('blocked_fields') ||
  !html.includes('export_gate') ||
  !html.includes('renderAdminEvidenceExportPreviewFilterRecovery') ||
  !html.includes('admin_evidence_export_preview_filter_recovery_actions') ||
  !html.includes('setAdminEvidenceExportPreviewSourceFilter') ||
  !html.includes('renderAdminEvidenceExportPreviewReviewRouter') ||
  !html.includes('focusAdminEvidenceExportReviewTarget') ||
  !html.includes('admin_evidence_export_preview_review_router') ||
  !html.includes('Open source review target') ||
  !html.includes('No route changes server storage external export or live action attempted') ||
  !html.includes('Use all local evidence sources') ||
  !html.includes('No server storage, external export, or live action attempted')
) {
  fail('SmartContractor Admin UI must render admin evidence export preview, source filters, review router targets, invalid-filter recovery actions, metadata allowlist, blocked fields, and export gate');
}
if (
  !html.includes('ADMIN_EVIDENCE_EXPORT_PREVIEW_HISTORY_KEY') ||
  !html.includes('adminEvidenceExportPreviewHistory') ||
  !html.includes('adminEvidenceExportPreviewHistorySummary') ||
  !html.includes('adminEvidenceExportPreviewHistoryGrid') ||
  !html.includes('clearAdminEvidenceExportPreviewHistoryBtn') ||
  !html.includes('saveAdminEvidenceExportPreviewHistory') ||
  !html.includes('loadAdminEvidenceExportPreviewHistoryFromLocalStorage') ||
  !html.includes('renderAdminEvidenceExportPreviewHistory') ||
  !html.includes('admin_evidence_export_preview_history') ||
  !html.includes('admin_evidence_export_preview') ||
  !html.includes('local_history_only') ||
  !html.includes('metadata_only') ||
  !html.includes('No raw drafts, notes, markdown, secrets, payment data, legal/provider decisions, or live-action approvals are stored in this history.')
) {
  fail('SmartContractor Admin UI must keep local metadata-only admin evidence export preview history and timeline evidence without raw/live-risk storage');
}
if (!html.includes('function renderFounderAuthSetupError(error)') || !html.includes('renderFounderAuthSetupError(error)')) {
  fail('Founder Auth Setup UI must route failed setup requests through a dedicated error renderer');
}
if (!html.includes('founder_auth_setup_error') || !html.includes('Founder Auth Setup Unavailable')) {
  fail('Founder Auth Setup error UI must show a named unavailable state and machine-readable error status');
}
if (!html.includes('founder_auth_setup_error') || !html.includes('request_trace_complete_flag') || !html.includes('requestIdHeader')) {
  fail('Founder Auth Setup error UI must expose request trace completeness and request-id header evidence');
}
if (!html.includes('No founder admin activation, profile repair, admin membership insert, strict RLS, deploy, Supabase write, provider, legal, production, payment, loan, escrow, or token action is allowed from this error state.')) {
  fail('Founder Auth Setup error UI must block live founder auth actions from the error state');
}
if (!html.includes('loadFounderActionCenter') || !html.includes('founderActionGrid')) {
  fail('smartcontractor.html must include the Founder Action Center UI');
}
if (!html.includes('function renderFounderActionCenterError(error)') || !html.includes('renderFounderActionCenterError(error)')) {
  fail('Founder Action Center UI must route failed founder action requests through a dedicated error renderer');
}
if (!html.includes('founder_action_center_error') || !html.includes('Founder Action Center Unavailable')) {
  fail('Founder Action Center error UI must show a named unavailable state and machine-readable error status');
}
if (!html.includes('founder_action_center_error') || !html.includes('request_trace_complete_flag') || !html.includes('requestIdHeader')) {
  fail('Founder Action Center error UI must expose request trace completeness and request-id header evidence');
}
if (!html.includes('No founder action, account change, secret entry, Supabase change, deploy, provider, legal, production, payment, loan, escrow, or token action is allowed from this error state.')) {
  fail('Founder Action Center error UI must block live founder actions from the error state');
}
if (!html.includes('sendMagicLink') || !html.includes('checkAuthSession') || !html.includes('gcsc-auth-access-token')) {
  fail('smartcontractor.html must include Magic Link request, session check, and local token capture scaffold');
}
if (!html.includes('checkLinkedProfile') || !html.includes('Check Linked Profile')) {
  fail('smartcontractor.html must include linked profile ownership check UI');
}

const inlineScripts = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
if (inlineScripts.length === 0) {
  fail('No inline scripts found in public/smartcontractor.html');
}
inlineScripts.forEach((match, index) => {
  new vm.Script(match[1], {
    filename: `public/smartcontractor.html:inline-script-${index + 1}.js`,
  });
});

const manifest = JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8'));
const requiredManifestFields = ['name', 'short_name', 'id', 'start_url', 'scope', 'display', 'icons'];
for (const field of requiredManifestFields) {
  if (!manifest[field]) fail(`Manifest is missing required field: ${field}`);
}
if (manifest.display !== 'standalone') {
  fail('Manifest display must be standalone for PWA install flow');
}
if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
  fail('Manifest must define at least one icon');
}
if (!Array.isArray(manifest.shortcuts) || manifest.shortcuts.length < 3) {
  fail('Manifest should include shortcuts for jobs, loans, and disputes');
}

const serviceWorker = readFileSync('public/service-worker.js', 'utf8');
if (!serviceWorker.includes('/offline.html')) {
  fail('service-worker.js must cache offline.html');
}
if (!serviceWorker.includes("requestUrl.pathname.startsWith('/api/')")) {
  fail('service-worker.js must keep API requests network-only');
}

const offline = readFileSync('public/offline.html', 'utf8');
if (!offline.includes('SmartContractor is offline')) {
  fail('offline.html must include a clear offline message');
}

if (!server.includes("app.get('/api/admin/risk-console'")) {
  fail('server.js must expose /api/admin/risk-console for founder risk review');
}
if (!server.includes('admin-risk-console')) {
  fail('health check must advertise admin-risk-console');
}
if (!server.includes("app.get('/api/admin/access-model'") || !server.includes('adminRoleModel') || !server.includes('adminProtectedSurfaces')) {
  fail('server.js must expose the Admin role model endpoint and model data');
}
if (!server.includes('admin-role-model')) {
  fail('health check must advertise admin-role-model');
}
if (!server.includes('getAdminAccess') || !server.includes('requireAdminPermissions') || !server.includes("app.get('/api/admin/me'")) {
  fail('server.js must include admin enforcement helper and /api/admin/me endpoint');
}
if (!server.includes('admin-enforcement-scaffold')) {
  fail('health check must advertise admin-enforcement-scaffold');
}
if (!server.includes("app.get('/api/admin/launch-readiness'")) {
  fail('server.js must expose /api/admin/launch-readiness for production preflight');
}
if (!server.includes('launch-readiness-gate')) {
  fail('health check must advertise launch-readiness-gate');
}
if (!server.includes("app.get('/api/admin/smart-contract-helper-index'") || !server.includes('buildSmartContractHelperIndex') || !server.includes('helper_export_count')) {
  fail('server.js must expose /api/admin/smart-contract-helper-index with helper index summary counts');
}
if (!server.includes('category_filter') || !server.includes('selected_helper_category_filter') || !server.includes('valid_helper_category_filter_ids') || !server.includes('filtered_helper_categories')) {
  fail('server.js must support safe local-only smart contract helper category filtering');
}
if (!server.includes('Unsupported smart contract helper category_filter') || !server.includes('No live helper-index action was attempted.')) {
  fail('server.js must reject invalid helper category filters without live actions');
}
if (!server.includes('smart-contract-helper-index')) {
  fail('health check must advertise smart-contract-helper-index');
}
if (!server.includes('smart-contract-review-workbench')) {
  fail('health check must advertise smart-contract-review-workbench');
}
if (!server.includes("app.get('/api/admin/auth-readiness'")) {
  fail('server.js must expose /api/admin/auth-readiness for auth decision planning');
}
if (!server.includes('auth-decision-package')) {
  fail('health check must advertise auth-decision-package');
}
if (!server.includes("app.get('/api/admin/founder-action-center'") || !server.includes('founderActionItems')) {
  fail('server.js must expose the Founder Action Center endpoint and action model');
}
if (!server.includes('founder-action-center')) {
  fail('health check must advertise founder-action-center');
}
if (!server.includes("app.post('/api/auth/magic-link'") || !server.includes("app.get('/api/auth/session-check'") || !server.includes('getAuthenticatedUser')) {
  fail('server.js must expose auth implementation scaffold endpoints and token verification helper');
}
if (!server.includes('const authLimiter = rateLimit') || !server.includes("app.post('/api/auth/magic-link', authLimiter")) {
  fail('server.js must rate limit Magic Link auth requests');
}
if (!server.includes('auth-implementation-scaffold')) {
  fail('health check must advertise auth-implementation-scaffold');
}
if (!server.includes('auth-magic-link-rate-limit')) {
  fail('health check must advertise auth-magic-link-rate-limit');
}
if (!server.includes("app.get('/api/auth/profile'") || !server.includes('auth_user_id') || !server.includes('getOptionalAuthenticatedUser')) {
  fail('server.js must expose profile ownership binding scaffold');
}
if (!server.includes('profile-ownership-binding')) {
  fail('health check must advertise profile-ownership-binding');
}
if (!server.includes('assertOwnedRoleRecord') || !server.includes('assertOwnedProfile') || !server.includes('role-ownership-guards')) {
  fail('server.js must include role ownership guards and advertise them in health');
}
if (!server.includes('supabaseAuth') || !server.includes('supabaseAdmin') || !server.includes("app.get('/api/admin/supabase-boundary'")) {
  fail('server.js must separate Supabase auth/admin clients and expose the boundary endpoint');
}
if (!server.includes('supabase-service-role-boundary')) {
  fail('health check must advertise supabase-service-role-boundary');
}
if (
  !server.includes('boundary_checks') ||
  !server.includes('service_role_server_only_check') ||
  !server.includes('browser_publishable_only_check') ||
  !server.includes('live_supabase_change_block') ||
  !server.includes('strict_admin_public_beta_gate')
) {
  fail('server.js must expose Supabase boundary checks and live Supabase change gates');
}
if (
  !html.includes('/api/admin/supabase-boundary') ||
  !html.includes('supabaseBoundaryReadiness') ||
  !html.includes('Supabase Boundary Evidence Checklist') ||
  !html.includes('data.boundary_checks') ||
  !html.includes('supabase_boundary_error')
) {
  fail('SmartContractor UI must render Supabase boundary readiness checks from backend data');
}
if (
  !server.includes("app.get('/api/admin/mobile-install-readiness'") ||
  !server.includes('evidence_checklist') ||
  !server.includes('offline_shell_check') ||
  !server.includes('service_worker_api_boundary_check') ||
  !server.includes('no_store_submission_or_real_money_release') ||
  !server.includes('real_money_mobile_release')
) {
  fail('server.js must expose mobile install readiness evidence checklist and blocked mobile release gates');
}
if (
  !html.includes('/api/admin/mobile-install-readiness') ||
  !html.includes('mobileInstallReadiness') ||
  !html.includes('Mobile Install Evidence Checklist') ||
  !html.includes('data.evidence_checklist') ||
  !html.includes('release_gate')
) {
  fail('SmartContractor UI must render mobile install readiness evidence checklist from backend data');
}
if (
  !server.includes("app.get('/api/admin/dispute-evidence-readiness'") ||
  !server.includes('dispute_evidence_readiness') ||
  !server.includes('dispute_intake_check') ||
  !server.includes('evidence_metadata_check') ||
  !server.includes('peer_review_check') ||
  !server.includes('legal_escrow_payment_block') ||
  !server.includes('dispute_review_action_queue') ||
  !server.includes('dispute_intake_packet_review') ||
  !server.includes('evidence_redaction_packet_review') ||
  !server.includes('peer_review_packet_review') ||
  !server.includes('legal_escrow_payment_gate_review')
) {
  fail('server.js must expose dispute evidence readiness checks, review action queue, and live legal/escrow/payment gates');
}
if (
  !html.includes('/api/admin/dispute-evidence-readiness') ||
  !html.includes('disputeEvidenceReadiness') ||
  !html.includes('Dispute Evidence Readiness') ||
  !html.includes('data.readiness_checks') ||
  !html.includes('data.evidence_checklist') ||
  !html.includes('legal_escrow_payment_block') ||
  !html.includes('Dispute Evidence Review Action Queue') ||
  !html.includes('data.dispute_review_action_queue') ||
  !html.includes('action.next_safe_action') ||
  !html.includes('(action.required_evidence || []).join') ||
  !html.includes('(action.blocked_live_actions || []).join') ||
  !html.includes('Action live status')
) {
  fail('SmartContractor UI must render dispute evidence readiness checks, review action queue, and blocked live dispute gates from backend data');
}
if (
  !server.includes("app.get('/api/admin/dispute-evidence-readiness/review-packet'") ||
  !server.includes('function buildDisputeEvidenceReviewPacket') ||
  !server.includes('dispute_evidence_review_packet') ||
  !server.includes('packet_sections') ||
  !server.includes('redaction_attestation') ||
  !server.includes('copyable_markdown') ||
  !server.includes('review_packet_gate') ||
  !server.includes('no_dispute_review_packet_content_stored')
) {
  fail('server.js must expose a local-only dispute evidence review packet endpoint with sections, redaction attestation, markdown, and blocked live gates');
}
if (
  !html.includes('/api/admin/dispute-evidence-readiness/review-packet') ||
  !html.includes('disputeEvidenceReviewPacket') ||
  !html.includes('loadDisputeEvidenceReviewPacket') ||
  !html.includes('Dispute Evidence Review Packet') ||
  !html.includes('data.packet_sections') ||
  !html.includes('redaction_attestation') ||
  !html.includes('copyable_markdown') ||
  !html.includes('No dispute evidence review packet content is stored on the server') ||
  !html.includes('No live dispute evidence review packet action attempted')
) {
  fail('SmartContractor UI must render the local-only dispute evidence review packet, redaction attestation, markdown preview, and no-live-action boundary');
}
if (
  !server.includes("app.get('/api/admin/milestone-evidence-readiness'") ||
  !server.includes('milestone_evidence_readiness') ||
  !server.includes('project_contract_context_check') ||
  !server.includes('milestone_scope_check') ||
  !server.includes('work_progress_evidence_check') ||
  !server.includes('payment_escrow_release_block') ||
  !server.includes('milestone_review_action_queue') ||
  !server.includes('scope_evidence_packet_review') ||
  !server.includes('visible_progress_packet_review') ||
  !server.includes('payment_status_boundary_review') ||
  !server.includes('escrow_release_gate_review')
) {
  fail('server.js must expose milestone evidence readiness checks, review action queue, and live payment/escrow release gates');
}
if (
  !html.includes('/api/admin/milestone-evidence-readiness') ||
  !html.includes('milestoneEvidenceReadiness') ||
  !html.includes('Milestone Evidence Readiness') ||
  !html.includes('data.milestone_evidence_checklist') ||
  !html.includes('payment_escrow_release_block') ||
  !html.includes('Milestone Evidence Review Action Queue') ||
  !html.includes('data.milestone_review_action_queue') ||
  !html.includes('action.next_safe_action') ||
  !html.includes('(action.required_evidence || []).join') ||
  !html.includes('(action.blocked_live_actions || []).join') ||
  !html.includes('Action live status')
) {
  fail('SmartContractor UI must render milestone evidence readiness checks, review action queue, and blocked payment/escrow gates from backend data');
}
if (
  !server.includes("app.get('/api/admin/milestone-evidence-readiness/review-packet'") ||
  !server.includes('function buildMilestoneEvidenceReviewPacket') ||
  !server.includes('milestone_evidence_review_packet') ||
  !server.includes('packet_sections') ||
  !server.includes('redaction_attestation') ||
  !server.includes('copyable_markdown') ||
  !server.includes('review_packet_gate') ||
  !server.includes('no_milestone_review_packet_content_stored')
) {
  fail('server.js must expose a local-only milestone evidence review packet endpoint with sections, redaction attestation, markdown, and blocked live gates');
}
if (
  !html.includes('/api/admin/milestone-evidence-readiness/review-packet') ||
  !html.includes('milestoneEvidenceReviewPacket') ||
  !html.includes('loadMilestoneEvidenceReviewPacket') ||
  !html.includes('Milestone Evidence Review Packet') ||
  !html.includes('data.packet_sections') ||
  !html.includes('redaction_attestation') ||
  !html.includes('copyable_markdown') ||
  !html.includes('No milestone evidence review packet content is stored on the server') ||
  !html.includes('No live milestone evidence review packet action attempted')
) {
  fail('SmartContractor UI must render the local-only milestone evidence review packet, redaction attestation, markdown preview, and no-live-action boundary');
}
if (
  !html.includes('MILESTONE_EVIDENCE_REVIEW_PACKET_HISTORY_KEY') ||
  !html.includes('milestoneEvidenceReviewPacketHistory') ||
  !html.includes('milestoneEvidenceReviewPacketHistorySummary') ||
  !html.includes('milestoneEvidenceReviewPacketHistoryGrid') ||
  !html.includes('clearMilestoneEvidenceReviewPacketHistoryBtn') ||
  !html.includes('loadMilestoneEvidenceReviewPacketHistoryFromLocalStorage') ||
  !html.includes('saveMilestoneEvidenceReviewPacketHistory') ||
  !html.includes('renderMilestoneEvidenceReviewPacketHistory') ||
  !html.includes('clearMilestoneEvidenceReviewPacketHistory') ||
  !html.includes('milestone_evidence_review_packet_history') ||
  !html.includes('milestone_evidence_review_packet_metadata_history_only') ||
  !html.includes("saveAdminLocalEvidenceTimelineEntry('milestone_evidence_review_packet'") ||
  !html.includes('No milestone evidence packet sections, markdown previews, redaction attestation values, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, milestone approvals, escrow releases, payment movements, repayment routing approvals, stablecoin settlements, token collateral locks, Auth/RLS changes, or production approvals are stored in this milestone evidence review packet history.')
) {
  fail('SmartContractor UI must keep a metadata-only local history for milestone evidence review packet loads without storing raw packet content or attempting live milestone/payment actions');
}
if (
  !server.includes("app.get('/api/admin/working-capital-readiness'") ||
  !server.includes('working_capital_readiness') ||
  !server.includes('contractor_identity_credit_check') ||
  !server.includes('project_contract_collateral_check') ||
  !server.includes('risk_score_affordability_check') ||
  !server.includes('repayment_waterfall_readiness_check') ||
  !server.includes('funding_approval_block') ||
  !server.includes('working_capital_review_action_queue') ||
  !server.includes('identity_packet_review') ||
  !server.includes('repayment_waterfall_packet_review') ||
  !server.includes('funding_gate_review') ||
  !server.includes('action_live_status')
) {
  fail('server.js must expose working capital readiness checks, review action queue, and live funding/loan approval gates');
}
if (
  !server.includes("app.get('/api/admin/working-capital-readiness/review-packet'") ||
  !server.includes('function buildWorkingCapitalReviewPacket') ||
  !server.includes('working_capital_review_packet') ||
  !server.includes('packet_sections') ||
  !server.includes('redaction_attestation') ||
  !server.includes('copyable_markdown') ||
  !server.includes('review_packet_gate') ||
  !server.includes('no_review_packet_content_stored')
) {
  fail('server.js must expose a local-only working capital review packet endpoint with sections, redaction attestation, markdown, and blocked live gates');
}
if (
  !html.includes('/api/admin/working-capital-readiness') ||
  !html.includes('workingCapitalReadiness') ||
  !html.includes('Working Capital Readiness') ||
  !html.includes('data.working_capital_checklist') ||
  !html.includes('funding_approval_block') ||
  !html.includes('Working Capital Review Action Queue') ||
  !html.includes('data.working_capital_review_action_queue') ||
  !html.includes('action.next_safe_action') ||
  !html.includes('(action.required_evidence || []).join') ||
  !html.includes('(action.blocked_live_actions || []).join') ||
  !html.includes('Action live status')
) {
  fail('SmartContractor UI must render working capital readiness checks, review action queue, and blocked funding/loan gates from backend data');
}
if (
  !html.includes('/api/admin/working-capital-readiness/review-packet') ||
  !html.includes('workingCapitalReadinessReviewPacket') ||
  !html.includes('loadWorkingCapitalReviewPacket') ||
  !html.includes('Working Capital Review Packet') ||
  !html.includes('data.packet_sections') ||
  !html.includes('redaction_attestation') ||
  !html.includes('copyable_markdown') ||
  !html.includes('No working-capital review packet content is stored on the server') ||
  !html.includes('No live working-capital review packet action attempted')
) {
  fail('SmartContractor UI must render the local-only working capital review packet, redaction attestation, markdown preview, and no-live-action boundary');
}
if (
  !html.includes('WORKING_CAPITAL_REVIEW_PACKET_HISTORY_KEY') ||
  !html.includes('workingCapitalReviewPacketHistory') ||
  !html.includes('workingCapitalReviewPacketHistorySummary') ||
  !html.includes('workingCapitalReviewPacketHistoryGrid') ||
  !html.includes('saveWorkingCapitalReviewPacketHistory') ||
  !html.includes('renderWorkingCapitalReviewPacketHistory') ||
  !html.includes('clearWorkingCapitalReviewPacketHistory') ||
  !html.includes('working_capital_review_packet_history') ||
  !html.includes('working_capital_review_packet_metadata_history_only') ||
  !html.includes('No packet sections, markdown previews, redaction attestation values') ||
  !html.includes("saveAdminLocalEvidenceTimelineEntry('working_capital_review_packet'")
) {
  fail('SmartContractor UI must keep a metadata-only local history for working capital review packet loads without storing raw packet content or attempting live actions');
}
if (
  !server.includes("app.get('/api/admin/contractor-reputation-readiness'") ||
  !server.includes('contractor_reputation_readiness') ||
  !server.includes('completed_job_history_check') ||
  !server.includes('rating_review_check') ||
  !server.includes('dispute_repayment_signal_check') ||
  !server.includes('bid_accuracy_response_check') ||
  !server.includes('reputation_decision_block') ||
  !server.includes('reputation_review_action_queue') ||
  !server.includes('reputation_signal_packet_review') ||
  !server.includes('moderation_appeal_packet_review') ||
  !server.includes('credit_boundary_packet_review') ||
  !server.includes('public_score_gate_review')
) {
  fail('server.js must expose contractor reputation readiness checks, review action queue, and blocked public score/credit/legal decision gates');
}
if (
  !server.includes("app.get('/api/admin/contractor-reputation-readiness/review-packet'") ||
  !server.includes('function buildContractorReputationReviewPacket') ||
  !server.includes('contractor_reputation_review_packet') ||
  !server.includes('packet_sections') ||
  !server.includes('redaction_attestation') ||
  !server.includes('copyable_markdown') ||
  !server.includes('review_packet_gate') ||
  !server.includes('no_contractor_reputation_review_packet_content_stored')
) {
  fail('server.js must expose a local-only contractor reputation review packet endpoint with sections, redaction attestation, markdown, and blocked live gates');
}
if (
  !html.includes('/api/admin/contractor-reputation-readiness') ||
  !html.includes('contractorReputationReadiness') ||
  !html.includes('Contractor Reputation Readiness') ||
  !html.includes('data.reputation_checklist') ||
  !html.includes('reputation_decision_block') ||
  !html.includes('Contractor Reputation Review Action Queue') ||
  !html.includes('data.reputation_review_action_queue') ||
  !html.includes('action.next_safe_action') ||
  !html.includes('(action.required_evidence || []).join') ||
  !html.includes('(action.blocked_live_actions || []).join') ||
  !html.includes('Action live status')
) {
  fail('SmartContractor UI must render contractor reputation readiness checks, review action queue, and blocked public score/credit/legal gates from backend data');
}
if (
  !html.includes('/api/admin/contractor-reputation-readiness/review-packet') ||
  !html.includes('contractorReputationReviewPacket') ||
  !html.includes('loadContractorReputationReviewPacket') ||
  !html.includes('Contractor Reputation Review Packet') ||
  !html.includes('data.packet_sections') ||
  !html.includes('redaction_attestation') ||
  !html.includes('copyable_markdown') ||
  !html.includes('No contractor reputation review packet content is stored on the server') ||
  !html.includes('No live contractor reputation review packet action attempted')
) {
  fail('SmartContractor UI must render the local-only contractor reputation review packet, redaction attestation, markdown preview, and no-live-action boundary');
}
if (
  !html.includes('CONTRACTOR_REPUTATION_REVIEW_PACKET_HISTORY_KEY') ||
  !html.includes('contractorReputationReviewPacketHistory') ||
  !html.includes('contractorReputationReviewPacketHistorySummary') ||
  !html.includes('contractorReputationReviewPacketHistoryGrid') ||
  !html.includes('saveContractorReputationReviewPacketHistory') ||
  !html.includes('renderContractorReputationReviewPacketHistory') ||
  !html.includes('clearContractorReputationReviewPacketHistory') ||
  !html.includes('contractor_reputation_review_packet_history') ||
  !html.includes('contractor_reputation_review_packet_metadata_history_only') ||
  !html.includes('No contractor reputation packet sections, markdown previews, redaction attestation values, raw media, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, public score approvals, contractor rankings, credit approvals, credit denials, adverse-action outputs, contractor assignments, Auth/RLS changes, or production approvals are stored in this contractor reputation review packet history.') ||
  !html.includes("saveAdminLocalEvidenceTimelineEntry('contractor_reputation_review_packet'")
) {
  fail('SmartContractor UI must keep a metadata-only local history for contractor reputation review packet loads without storing raw packet content or attempting live actions');
}
if (
  !server.includes("app.get('/api/admin/contractor-verification-readiness'") ||
  !server.includes('contractor_verification_readiness') ||
  !server.includes('license_evidence_check') ||
  !server.includes('insurance_evidence_check') ||
  !server.includes('business_identity_check') ||
  !server.includes('compliance_provider_boundary_check') ||
  !server.includes('verification_decision_block') ||
  !server.includes('verification_review_action_queue') ||
  !server.includes('license_packet_review') ||
  !server.includes('insurance_packet_review') ||
  !server.includes('business_identity_packet_review') ||
  !server.includes('provider_boundary_packet_review') ||
  !server.includes('eligibility_gate_review')
) {
  fail('server.js must expose contractor verification readiness checks, review action queue, and blocked provider/legal eligibility gates');
}
if (
  !html.includes('/api/admin/contractor-verification-readiness') ||
  !html.includes('contractorVerificationReadiness') ||
  !html.includes('Contractor Verification Readiness') ||
  !html.includes('data.verification_checklist') ||
  !html.includes('verification_decision_block') ||
  !html.includes('Contractor Verification Review Action Queue') ||
  !html.includes('data.verification_review_action_queue') ||
  !html.includes('action.next_safe_action') ||
  !html.includes('(action.required_evidence || []).join') ||
  !html.includes('(action.blocked_live_actions || []).join') ||
  !html.includes('Action live status')
) {
  fail('SmartContractor UI must render contractor verification readiness checks, review action queue, and blocked provider/legal eligibility gates from backend data');
}
if (
  !server.includes("app.get('/api/admin/contractor-verification-readiness/review-packet'") ||
  !server.includes('function buildContractorVerificationReviewPacket') ||
  !server.includes('contractor_verification_review_packet') ||
  !server.includes('packet_sections') ||
  !server.includes('redaction_attestation') ||
  !server.includes('copyable_markdown') ||
  !server.includes('review_packet_gate') ||
  !server.includes('no_contractor_verification_review_packet_content_stored')
) {
  fail('server.js must expose a local-only contractor verification review packet endpoint with sections, redaction attestation, markdown, and blocked live gates');
}
if (
  !html.includes('/api/admin/contractor-verification-readiness/review-packet') ||
  !html.includes('contractorVerificationReviewPacket') ||
  !html.includes('loadContractorVerificationReviewPacket') ||
  !html.includes('Contractor Verification Review Packet') ||
  !html.includes('data.packet_sections') ||
  !html.includes('redaction_attestation') ||
  !html.includes('copyable_markdown') ||
  !html.includes('No contractor verification review packet content is stored on the server') ||
  !html.includes('No live contractor verification review packet action attempted')
) {
  fail('SmartContractor UI must render the local-only contractor verification review packet, redaction attestation, markdown preview, and no-live-action boundary');
}
if (
  !html.includes('CONTRACTOR_VERIFICATION_REVIEW_PACKET_HISTORY_KEY') ||
  !html.includes('contractorVerificationReviewPacketHistory') ||
  !html.includes('contractorVerificationReviewPacketHistorySummary') ||
  !html.includes('contractorVerificationReviewPacketHistoryGrid') ||
  !html.includes('saveContractorVerificationReviewPacketHistory') ||
  !html.includes('renderContractorVerificationReviewPacketHistory') ||
  !html.includes('clearContractorVerificationReviewPacketHistory') ||
  !html.includes('contractor_verification_review_packet_history') ||
  !html.includes('contractor_verification_review_packet_metadata_history_only') ||
  !html.includes('No contractor verification packet sections, markdown previews, redaction attestation values, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, eligibility approvals, eligibility denials, real lead routing, Auth/RLS changes, or production approvals are stored in this contractor verification review packet history.') ||
  !html.includes("saveAdminLocalEvidenceTimelineEntry('contractor_verification_review_packet'")
) {
  fail('SmartContractor UI must keep a metadata-only local history for contractor verification review packet loads without storing raw packet content or attempting live actions');
}
if (
  !server.includes("app.get('/api/admin/readiness-overview'") ||
  !server.includes('admin_readiness_overview') ||
  !server.includes('surface_filter') ||
  !server.includes('selected_readiness_surface_filter') ||
  !server.includes('valid_readiness_surface_filter_ids') ||
  !server.includes('Unsupported readiness overview surface_filter') ||
  !server.includes('readiness_surfaces') ||
  !server.includes('overview_gate') ||
  !server.includes('review_action_queue_rollup') ||
  !server.includes('review_action_queue_count') ||
  !server.includes('blocked_review_action_queue_count') ||
  !server.includes('provider_legal_money_boundary') ||
  !server.includes('contractor_verification_readiness') ||
  !server.includes('contractor_reputation_readiness') ||
  !server.includes('working_capital_readiness') ||
  !server.includes('working_capital_review_action_queue') ||
  !server.includes('funding_gate_review') ||
  !server.includes('milestone_evidence_readiness') ||
  !server.includes('dispute_evidence_readiness')
) {
  fail('server.js must expose an admin readiness overview across verification, reputation, working-capital, milestone, dispute gates, and blocked review action queues');
}
if (
  !server.includes("app.get('/api/admin/readiness-overview/review-packet'") ||
  !server.includes('function buildAdminReadinessOverviewReviewPacket') ||
  !server.includes('admin_readiness_overview_review_packet') ||
  !server.includes('packet_sections') ||
  !server.includes('redaction_attestation') ||
  !server.includes('copyable_markdown') ||
  !server.includes('review_packet_gate') ||
  !server.includes('no_admin_readiness_overview_review_packet_content_stored')
) {
  fail('server.js must expose a local-only admin readiness overview review packet endpoint with sections, redaction attestation, markdown, and blocked live gates');
}
if (
  !html.includes('/api/admin/readiness-overview') ||
  !html.includes('readinessOverview') ||
  !html.includes('readinessOverviewSurfaceFilter') ||
  !html.includes('Admin Readiness Overview') ||
  !html.includes('selected_readiness_surface_filter') ||
  !html.includes('valid_readiness_surface_filter_ids') ||
  !html.includes('data.readiness_surfaces') ||
  !html.includes('overview_gate') ||
  !html.includes('data.review_action_queue_rollup') ||
  !html.includes('Readiness Review Action Queue Rollup') ||
  !html.includes('surface.review_action_queue_count') ||
  !html.includes('action.surface_id') ||
  !html.includes('action.next_safe_action') ||
  !html.includes('No live readiness queue action attempted') ||
  !html.includes('provider_legal_money_boundary') ||
  !html.includes('selectedReadinessSurfaceSummary') ||
  !html.includes('readiness_overview_surface_summary_local_only') ||
  !html.includes('copyReadinessOverviewSurfaceSummary') ||
  !html.includes('Copy surface summary') ||
  !html.includes('renderReadinessOverviewFilterError') ||
  !html.includes('readiness_overview_filter_recovery_actions') ||
  !html.includes('validReadinessSurfaceFilterIds') ||
  !html.includes('Apply safe readiness filter') ||
  !html.includes('No live readiness overview action attempted')
) {
  fail('SmartContractor UI must render the admin readiness overview, provider/legal/money boundary, local-only selected surface summary, blocked review action queue rollup, and invalid surface_filter recovery actions from backend data');
}
if (
  !html.includes('/api/admin/readiness-overview/review-packet') ||
  !html.includes('readinessOverviewReviewPacket') ||
  !html.includes('loadReadinessOverviewReviewPacket') ||
  !html.includes('Admin Readiness Overview Review Packet') ||
  !html.includes('data.packet_sections') ||
  !html.includes('redaction_attestation') ||
  !html.includes('copyable_markdown') ||
  !html.includes('No admin readiness overview review packet content is stored on the server') ||
  !html.includes('No live admin readiness overview review packet action attempted')
) {
  fail('SmartContractor UI must render the local-only admin readiness overview review packet, redaction attestation, markdown preview, and no-live-action boundary');
}
if (
  !html.includes('readinessOverviewReviewPacketHistory') ||
  !html.includes('readinessOverviewReviewPacketHistorySummary') ||
  !html.includes('readinessOverviewReviewPacketHistoryGrid') ||
  !html.includes('READINESS_OVERVIEW_REVIEW_PACKET_HISTORY_KEY') ||
  !html.includes('saveReadinessOverviewReviewPacketHistory') ||
  !html.includes('renderReadinessOverviewReviewPacketHistory') ||
  !html.includes('readiness_overview_review_packet_history') ||
  !html.includes('readiness_overview_review_packet_metadata_history_only') ||
  !html.includes('No readiness overview packet sections, markdown previews, redaction attestation values, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or production approvals are stored in this readiness overview review packet history.') ||
  !html.includes("saveAdminLocalEvidenceTimelineEntry('admin_readiness_overview_review_packet'")
) {
  fail('SmartContractor UI must keep local metadata-only admin readiness overview review packet history without storing packet content or enabling live actions');
}
if (
  !server.includes('readiness_overview_review_packet_filter_invalid') ||
  !html.includes('renderReadinessOverviewReviewPacketFilterError') ||
  !html.includes('readiness_overview_review_packet_filter_recovery_actions') ||
  !html.includes('validReadinessOverviewReviewPacketFilterIds') ||
  !html.includes('Apply safe overview packet filter') ||
  !html.includes('No live admin readiness overview review packet action attempted') ||
  !html.includes('loadReadinessOverviewReviewPacket')
) {
  fail('SmartContractor UI must render admin readiness overview review packet invalid-filter recovery actions without enabling live actions');
}
const providerEvidencePacketStart = server.indexOf('function buildProviderEvidencePacket(options = {})');
const providerEvidencePacketEnd = server.indexOf('function buildProviderEvidencePacketPrintTemplate(options = {})');
const providerEvidencePacketSource =
  providerEvidencePacketStart >= 0 && providerEvidencePacketEnd > providerEvidencePacketStart
    ? server.slice(providerEvidencePacketStart, providerEvidencePacketEnd)
    : '';
if (
  !server.includes("app.get('/api/admin/provider-evidence-packet'") ||
  !server.includes('provider_evidence_packet') ||
  !server.includes('packet_sections') ||
  !server.includes('redaction_checklist') ||
  !server.includes('packet_gate') ||
  !server.includes('provider_evidence_packet_filter_invalid') ||
  !server.includes('Unsupported provider evidence packet surface_filter') ||
  !providerEvidencePacketSource.includes('no_server_storage_attempted: true') ||
  !providerEvidencePacketSource.includes('no_live_action_attempted: true') ||
  !server.includes('no_live_action_attempted')
) {
  fail('server.js must expose a local provider evidence packet with redaction checklist, packet gate, filters, no-server-storage success boundary, and no-live-action invalid-filter handling');
}
if (
  !html.includes('/api/admin/provider-evidence-packet') ||
  !html.includes('providerEvidencePacket') ||
  !html.includes('Provider Evidence Packet') ||
  !html.includes('providerEvidencePacketSurfaceFilter') ||
  !html.includes('data.packet_sections') ||
  !html.includes('redaction_checklist') ||
  !html.includes('packet_gate') ||
  !html.includes('renderProviderEvidencePacketFilterError') ||
  !html.includes('provider_evidence_packet_filter_recovery_actions') ||
  !html.includes('validProviderEvidencePacketFilterIds') ||
  !html.includes('Apply safe provider packet filter') ||
  !html.includes('No live provider evidence packet action attempted')
) {
  fail('SmartContractor UI must render provider evidence packet sections, redaction checklist, filter, packet gate, and invalid surface_filter recovery actions from backend data');
}
if (
  !html.includes('providerEvidencePacketHistory') ||
  !html.includes('providerEvidencePacketHistorySummary') ||
  !html.includes('providerEvidencePacketHistoryGrid') ||
  !html.includes('PROVIDER_EVIDENCE_PACKET_HISTORY_KEY') ||
  !html.includes('saveProviderEvidencePacketHistory') ||
  !html.includes('renderProviderEvidencePacketHistory') ||
  !html.includes('provider_evidence_packet_history') ||
  !html.includes('provider_packet_metadata_history_only') ||
  !html.includes('No packet sections, markdown previews, redaction findings, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or production approvals are stored in this history.') ||
  !html.includes('saveAdminLocalEvidenceTimelineEntry(\'provider_evidence_packet\'')
) {
  fail('Provider evidence packet UI must keep local metadata-only history without storing packet content or enabling live actions');
}
const providerEvidencePacketPrintTemplateStart = server.indexOf('function buildProviderEvidencePacketPrintTemplate(options = {})');
const providerEvidencePacketPrintTemplateEnd = server.indexOf('function buildProviderEvidencePacketRedactionQa(options = {})');
const providerEvidencePacketPrintTemplateSource =
  providerEvidencePacketPrintTemplateStart >= 0 && providerEvidencePacketPrintTemplateEnd > providerEvidencePacketPrintTemplateStart
    ? server.slice(providerEvidencePacketPrintTemplateStart, providerEvidencePacketPrintTemplateEnd)
    : '';
if (
  !server.includes("app.get('/api/admin/provider-evidence-packet/print-template'") ||
  !server.includes('provider_evidence_packet_print_template') ||
  !server.includes('print_template_sections') ||
  !server.includes('print_redaction_attestation') ||
  !server.includes('export_gate') ||
  !server.includes('provider_evidence_packet_print_template_filter_invalid') ||
  !server.includes('Unsupported provider evidence packet print template surface_filter') ||
  !providerEvidencePacketPrintTemplateSource.includes('no_server_storage_attempted: true') ||
  !providerEvidencePacketPrintTemplateSource.includes('no_live_action_attempted: true') ||
  !server.includes('no_live_action_attempted')
) {
  fail('server.js must expose a local provider evidence packet print template with redaction attestation, export gate, filters, no-server-storage success boundary, and no-live-action invalid-filter handling');
}
if (
  !html.includes('/api/admin/provider-evidence-packet/print-template') ||
  !html.includes('providerEvidencePacketPrintTemplate') ||
  !html.includes('Provider Evidence Packet Print Template') ||
  !html.includes('loadProviderEvidencePacketPrintTemplate') ||
  !html.includes('print_template_sections') ||
  !html.includes('print_redaction_attestation') ||
  !html.includes('export_gate') ||
  !html.includes('renderProviderEvidencePacketPrintTemplateFilterError') ||
  !html.includes('provider_evidence_packet_print_template_filter_recovery_actions') ||
  !html.includes('validProviderEvidencePacketPrintTemplateFilterIds') ||
  !html.includes('Apply safe print template filter') ||
  !html.includes('No live provider print template action attempted')
) {
  fail('SmartContractor UI must render provider evidence packet print template sections, redaction attestation, export gate, and invalid surface_filter recovery actions from backend data');
}
if (
  !html.includes('providerEvidencePacketPrintTemplateHistory') ||
  !html.includes('providerEvidencePacketPrintTemplateHistorySummary') ||
  !html.includes('providerEvidencePacketPrintTemplateHistoryGrid') ||
  !html.includes('PROVIDER_EVIDENCE_PACKET_PRINT_TEMPLATE_HISTORY_KEY') ||
  !html.includes('saveProviderEvidencePacketPrintTemplateHistory') ||
  !html.includes('renderProviderEvidencePacketPrintTemplateHistory') ||
  !html.includes('provider_evidence_packet_print_template_history') ||
  !html.includes('provider_print_template_metadata_history_only') ||
  !html.includes('No print template sections, markdown previews, redaction attestations, raw packet content, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or production approvals are stored in this print template history.') ||
  !html.includes('saveAdminLocalEvidenceTimelineEntry(\'provider_evidence_packet_print_template\'')
) {
  fail('Provider evidence packet print template UI must keep local metadata-only history without storing markdown/template content or enabling live actions');
}
const providerEvidencePacketRedactionQaStart = server.indexOf('function buildProviderEvidencePacketRedactionQa(options = {})');
const providerEvidencePacketRedactionQaEnd = server.indexOf("app.get('/api/admin/smart-contract-helper-index'");
const providerEvidencePacketRedactionQaSource =
  providerEvidencePacketRedactionQaStart >= 0 && providerEvidencePacketRedactionQaEnd > providerEvidencePacketRedactionQaStart
    ? server.slice(providerEvidencePacketRedactionQaStart, providerEvidencePacketRedactionQaEnd)
    : '';
if (
  !server.includes("app.get('/api/admin/provider-evidence-packet/redaction-qa'") ||
  !server.includes('provider_evidence_packet_redaction_qa') ||
  !server.includes('redaction_findings') ||
  !server.includes('redaction_qa_gate') ||
  !server.includes('blocked_external_use') ||
  !server.includes('forbidden_phrase_scan') ||
  !server.includes('provider_evidence_packet_redaction_qa_filter_invalid') ||
  !server.includes('Unsupported provider evidence packet redaction qa surface_filter') ||
  !providerEvidencePacketRedactionQaSource.includes('no_server_storage_attempted: true') ||
  !providerEvidencePacketRedactionQaSource.includes('no_live_action_attempted: true') ||
  !server.includes('no_live_action_attempted')
) {
  fail('server.js must expose a local provider evidence packet redaction QA surface with findings, gate, forbidden phrase scan, filters, no-server-storage success boundary, and no-live-action invalid-filter handling');
}
if (
  !html.includes('/api/admin/provider-evidence-packet/redaction-qa') ||
  !html.includes('providerEvidencePacketRedactionQa') ||
  !html.includes('Provider Evidence Packet Redaction QA') ||
  !html.includes('loadProviderEvidencePacketRedactionQa') ||
  !html.includes('redaction_findings') ||
  !html.includes('redaction_qa_gate') ||
  !html.includes('blocked_external_use') ||
  !html.includes('renderProviderEvidencePacketRedactionQaFilterError') ||
  !html.includes('provider_evidence_packet_redaction_qa_filter_recovery_actions') ||
  !html.includes('validProviderEvidencePacketRedactionQaFilterIds') ||
  !html.includes('Apply safe redaction QA filter') ||
  !html.includes('No live provider redaction QA action attempted')
) {
  fail('SmartContractor UI must render provider evidence packet redaction QA findings, gate, blocked external-use status, and invalid surface_filter recovery actions from backend data');
}
if (
  !html.includes('providerEvidencePacketRedactionQaHistory') ||
  !html.includes('providerEvidencePacketRedactionQaHistorySummary') ||
  !html.includes('providerEvidencePacketRedactionQaHistoryGrid') ||
  !html.includes('PROVIDER_EVIDENCE_PACKET_REDACTION_QA_HISTORY_KEY') ||
  !html.includes('saveProviderEvidencePacketRedactionQaHistory') ||
  !html.includes('renderProviderEvidencePacketRedactionQaHistory') ||
  !html.includes('provider_evidence_packet_redaction_qa_history') ||
  !html.includes('provider_redaction_qa_metadata_history_only') ||
  !html.includes('No redaction finding details, matched terms, forbidden phrase source text, markdown previews, print template sections, redaction attestations, raw packet content, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or production approvals are stored in this redaction QA history.') ||
  !html.includes('saveAdminLocalEvidenceTimelineEntry(\'provider_evidence_packet_redaction_qa\'')
) {
  fail('Provider evidence packet redaction QA UI must keep local metadata-only history without storing finding content, matched terms, markdown, or enabling live actions');
}
const providerEvidenceReviewChainStart = server.indexOf('function buildProviderEvidenceReviewChain(options = {})');
const providerEvidenceReviewChainEnd = server.indexOf("app.get('/api/admin/smartcontractor-workflow-readiness'");
const providerEvidenceReviewChainSource =
  providerEvidenceReviewChainStart >= 0 && providerEvidenceReviewChainEnd > providerEvidenceReviewChainStart
    ? server.slice(providerEvidenceReviewChainStart, providerEvidenceReviewChainEnd)
    : '';
if (
  !server.includes("app.get('/api/admin/provider-evidence-review-chain'") ||
  !server.includes('provider_evidence_review_chain') ||
  !server.includes('chain_steps') ||
  !server.includes('review_gate') ||
  !server.includes('provider_evidence_review_chain_filter_invalid') ||
  !server.includes('Unsupported provider evidence review chain surface_filter') ||
  !providerEvidenceReviewChainSource.includes('buildProviderEvidencePacket(options)') ||
  !providerEvidenceReviewChainSource.includes('buildProviderEvidencePacketPrintTemplate(options)') ||
  !providerEvidenceReviewChainSource.includes('buildProviderEvidencePacketRedactionQa(options)') ||
  !providerEvidenceReviewChainSource.includes('no_server_storage_attempted: true') ||
  !providerEvidenceReviewChainSource.includes('no_live_action_attempted: true') ||
  !server.includes('no_live_action_attempted')
) {
  fail('server.js must expose a local provider evidence review chain that aggregates packet, print template, and redaction QA metadata with filters, review gate, no-server-storage success boundary, and no-live-action invalid-filter handling');
}
if (
  !html.includes('/api/admin/provider-evidence-review-chain') ||
  !html.includes('providerEvidenceReviewChain') ||
  !html.includes('Provider Evidence Review Chain') ||
  !html.includes('loadProviderEvidenceReviewChain') ||
  !html.includes('renderProviderEvidenceReviewChain') ||
  !html.includes('chain_steps') ||
  !html.includes('review_gate') ||
  !html.includes('renderProviderEvidenceReviewChainFilterError') ||
  !html.includes('provider_evidence_review_chain_filter_recovery_actions') ||
  !html.includes('validProviderEvidenceReviewChainFilterIds') ||
  !html.includes('Apply safe review chain filter') ||
  !html.includes('No live provider review chain action attempted') ||
  !html.includes('saveAdminLocalEvidenceTimelineEntry(\'provider_evidence_review_chain\'')
) {
  fail('SmartContractor UI must render provider evidence review chain steps, review gate, invalid surface_filter recovery actions, and metadata-only timeline entries from backend data');
}
for (const header of ['X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy', 'Permissions-Policy']) {
  if (!server.includes(header)) {
    fail(`server.js must set ${header} security header`);
  }
}
if (!server.includes('X-Request-Id') || !server.includes('crypto.randomUUID') || !server.includes('req.id')) {
  fail('server.js must set and reuse X-Request-Id for traceable requests');
}
if (!server.includes('Invalid JSON body') || !server.includes("err instanceof SyntaxError")) {
  fail('server.js must return a clear 400 error for invalid JSON bodies');
}
if (!server.includes("app.use('/api'") || !server.includes('API route not found')) {
  fail('server.js must return a JSON 404 for unknown API routes');
}
if (!authSmoke.includes('SMARTCONTRACTOR_SMOKE_ACCESS_TOKEN') || !authSmoke.includes('wrong-homeowner-blocked') || !authSmoke.includes('wrong-contractor-blocked')) {
  fail('auth smoke harness must support optional real-token and wrong-owner checks');
}
if (!authSmoke.includes('request_id_header') || !authSmoke.includes('gcsc-smoke-request-123')) {
  fail('auth smoke harness must verify X-Request-Id response behavior');
}
if (!authSmoke.includes('magic_link_rate_limit') || !authSmoke.includes('limitedMagicLink.status === 429')) {
  fail('auth smoke harness must verify Magic Link rate limiting behavior');
}
if (!authSmoke.includes('invalid_json_body') || !authSmoke.includes('Invalid JSON body')) {
  fail('auth smoke harness must verify invalid JSON body handling');
}
if (!authSmoke.includes('missing_api_route') || !authSmoke.includes('API route not found')) {
  fail('auth smoke harness must verify unknown API route handling');
}
if (
  !authSmoke.includes('smart_contract_helper_index') ||
  !authSmoke.includes('/api/admin/smart-contract-helper-index?category_filter=all_helper_categories') ||
  !authSmoke.includes('helper_index_filter_invalid') ||
  !authSmoke.includes('Unsupported smart contract helper category_filter')
) {
  fail('auth smoke harness must verify smart contract helper index success and invalid-filter demo-only boundaries');
}
if (
  !authSmoke.includes('smart_contract_local_replay_dry_run') ||
  !authSmoke.includes('/api/admin/smart-contract-local-replay-dry-run?category_filter=local_replay_approval_helpers') ||
  !authSmoke.includes('gcsc-smart-contract-local-replay-dry-run-smoke') ||
  !authSmoke.includes('smart_contract_local_replay_dry_run_filter_invalid') ||
  !authSmoke.includes('Unsupported smart contract local replay dry run category_filter') ||
  !authSmoke.includes('dry_run_steps') ||
  !authSmoke.includes('dry_run_gate') ||
  !authSmoke.includes('no_live_replay_action_attempted')
) {
  fail('auth smoke harness must verify smart contract local replay dry-run success and invalid-filter demo-only boundaries');
}
if (
  !authSmoke.includes('smart_contract_local_replay_dry_run_evidence_packet') ||
  !authSmoke.includes('/api/admin/smart-contract-local-replay-dry-run/evidence-packet?category_filter=local_replay_approval_helpers') ||
  !authSmoke.includes('gcsc-smart-contract-local-replay-dry-run-evidence-packet-smoke') ||
  !authSmoke.includes('smart_contract_local_replay_dry_run_evidence_packet_filter_invalid') ||
  !authSmoke.includes('Unsupported smart contract local replay dry run evidence packet category_filter') ||
  !authSmoke.includes('packet_sections') ||
  !authSmoke.includes('packet_gate') ||
  !authSmoke.includes('copyable_markdown') ||
  !authSmoke.includes('no_live_replay_action_attempted')
) {
  fail('auth smoke harness must verify smart contract local replay dry-run evidence packet success and invalid-filter demo-only boundaries');
}
if (
  !authSmoke.includes('smart_contract_review_workbench') ||
  !authSmoke.includes('/api/admin/smart-contract-review-workbench?category_filter=local_replay_approval_helpers') ||
  !authSmoke.includes('gcsc-smart-contract-review-workbench-smoke') ||
  !authSmoke.includes('smart_contract_review_workbench_filter_invalid') ||
  !authSmoke.includes('Unsupported smart contract review workbench category_filter') ||
  !authSmoke.includes('workbench_cards') ||
  !authSmoke.includes('review_gate') ||
  !authSmoke.includes('no_live_replay_action_attempted')
) {
  fail('auth smoke harness must verify smart contract review workbench success and invalid-filter demo-only boundaries');
}
if (
  !authSmoke.includes('smart_contract_review_workbench_handoff_summary') ||
  !authSmoke.includes('/api/admin/smart-contract-review-workbench/handoff-summary?category_filter=local_replay_approval_helpers') ||
  !authSmoke.includes('gcsc-smart-contract-review-workbench-handoff-summary-smoke') ||
  !authSmoke.includes('smart_contract_review_workbench_handoff_summary_filter_invalid') ||
  !authSmoke.includes('Unsupported smart contract review workbench handoff summary category_filter') ||
  !authSmoke.includes('handoff_summary_sections') ||
  !authSmoke.includes('handoff_gate') ||
  !authSmoke.includes('copyable_markdown') ||
  !authSmoke.includes('no_handoff_summary_content_stored') ||
  !authSmoke.includes('no_live_replay_action_attempted')
) {
  fail('auth smoke harness must verify smart contract review workbench handoff summary success and invalid-filter demo-only boundaries');
}
if (
  !authSmoke.includes('smart_contract_review_workbench_gate_matrix') ||
  !authSmoke.includes('/api/admin/smart-contract-review-workbench/gate-matrix?category_filter=local_replay_approval_helpers') ||
  !authSmoke.includes('gcsc-smart-contract-review-workbench-gate-matrix-filtered-smoke') ||
  !authSmoke.includes('smart_contract_review_workbench_gate_matrix_filter_invalid') ||
  !authSmoke.includes('Unsupported smart contract review workbench gate matrix category_filter') ||
  !authSmoke.includes('gate_matrix_rows') ||
  !authSmoke.includes('gate_matrix_gate') ||
  !authSmoke.includes('smart_contract_review_workbench_gate_matrix_filter_recovery_actions') ||
  !authSmoke.includes('no_gate_matrix_content_stored') ||
  !authSmoke.includes('no_live_replay_action_attempted')
) {
  fail('auth smoke harness must verify smart contract review workbench gate matrix success and invalid-filter demo-only boundaries');
}
if (
  !authSmoke.includes('smartcontractor_workflow_readiness_filtered') ||
  !authSmoke.includes('/api/admin/smartcontractor-workflow-readiness?queue_filter=working_capital_review') ||
  !authSmoke.includes('workflow_readiness_filter_invalid') ||
  !authSmoke.includes('Unsupported workflow readiness queue_filter') ||
  !authSmoke.includes('no_live_action_attempted')
) {
  fail('auth smoke harness must verify workflow readiness queue_filter success and invalid-filter demo-only boundaries');
}
if (
  !authSmoke.includes('dispute_evidence_readiness') ||
  !authSmoke.includes('/api/admin/dispute-evidence-readiness') ||
  !authSmoke.includes('gcsc-dispute-evidence-readiness-smoke') ||
  !authSmoke.includes('legal_escrow_payment_block') ||
  !authSmoke.includes('live_dispute_decision') ||
  !authSmoke.includes('dispute_review_action_queue') ||
  !authSmoke.includes('dispute_intake_packet_review') ||
  !authSmoke.includes('evidence_redaction_packet_review') ||
  !authSmoke.includes('peer_review_packet_review') ||
  !authSmoke.includes('legal_escrow_payment_gate_review') ||
  !authSmoke.includes('action_queue_summary')
) {
  fail('auth smoke harness must verify dispute evidence readiness request-id, review action queue, and live-action boundaries');
}
if (
  !authSmoke.includes('dispute_evidence_review_packet') ||
  !authSmoke.includes('/api/admin/dispute-evidence-readiness/review-packet') ||
  !authSmoke.includes('gcsc-dispute-evidence-review-packet-smoke') ||
  !authSmoke.includes('no_dispute_review_packet_content_stored') ||
  !authSmoke.includes('review_packet_gate') ||
  !authSmoke.includes('copyable_markdown')
) {
  fail('auth smoke harness must verify dispute evidence review packet request-id, no-storage, and no-live-action boundaries');
}
if (
  !authSmoke.includes('milestone_evidence_readiness') ||
  !authSmoke.includes('/api/admin/milestone-evidence-readiness') ||
  !authSmoke.includes('gcsc-milestone-evidence-readiness-smoke') ||
  !authSmoke.includes('payment_escrow_release_block') ||
  !authSmoke.includes('milestone_review_action_queue') ||
  !authSmoke.includes('scope_evidence_packet_review') ||
  !authSmoke.includes('visible_progress_packet_review') ||
  !authSmoke.includes('payment_status_boundary_review') ||
  !authSmoke.includes('escrow_release_gate_review') ||
  !authSmoke.includes('action_queue_summary') ||
  !authSmoke.includes('live_escrow_release')
) {
  fail('auth smoke harness must verify milestone evidence readiness request-id, review action queue, and live payment/escrow boundaries');
}
if (
  !authSmoke.includes('milestone_evidence_review_packet') ||
  !authSmoke.includes('/api/admin/milestone-evidence-readiness/review-packet') ||
  !authSmoke.includes('gcsc-milestone-evidence-review-packet-smoke') ||
  !authSmoke.includes('no_milestone_review_packet_content_stored') ||
  !authSmoke.includes('review_packet_gate') ||
  !authSmoke.includes('copyable_markdown')
) {
  fail('auth smoke harness must verify milestone evidence review packet request-id, no-storage, and no-live-action boundaries');
}
if (
  !authSmoke.includes('working_capital_readiness') ||
  !authSmoke.includes('/api/admin/working-capital-readiness') ||
  !authSmoke.includes('gcsc-working-capital-readiness-smoke') ||
  !authSmoke.includes('funding_approval_block') ||
  !authSmoke.includes('live_loan_approval') ||
  !authSmoke.includes('working_capital_review_action_queue') ||
  !authSmoke.includes('identity_packet_review') ||
  !authSmoke.includes('repayment_waterfall_packet_review') ||
  !authSmoke.includes('funding_gate_review') ||
  !authSmoke.includes('action_live_status')
) {
  fail('auth smoke harness must verify working capital readiness request-id, review action queue, and live funding/loan boundaries');
}
if (
  !authSmoke.includes('contractor_reputation_readiness') ||
  !authSmoke.includes('/api/admin/contractor-reputation-readiness') ||
  !authSmoke.includes('gcsc-contractor-reputation-readiness-smoke') ||
  !authSmoke.includes('reputation_decision_block') ||
  !authSmoke.includes('reputation_review_action_queue') ||
  !authSmoke.includes('reputation_signal_packet_review') ||
  !authSmoke.includes('moderation_appeal_packet_review') ||
  !authSmoke.includes('credit_boundary_packet_review') ||
  !authSmoke.includes('public_score_gate_review') ||
  !authSmoke.includes('action_queue_summary') ||
  !authSmoke.includes('public_reputation_score')
) {
  fail('auth smoke harness must verify contractor reputation readiness request-id, review action queue, and public score/decision boundaries');
}
if (
  !authSmoke.includes('contractor_reputation_review_packet') ||
  !authSmoke.includes('/api/admin/contractor-reputation-readiness/review-packet') ||
  !authSmoke.includes('gcsc-contractor-reputation-review-packet-smoke') ||
  !authSmoke.includes('no_contractor_reputation_review_packet_content_stored') ||
  !authSmoke.includes('review_packet_gate') ||
  !authSmoke.includes('copyable_markdown')
) {
  fail('auth smoke harness must verify contractor reputation review packet request-id, no-storage, and no-live-action boundaries');
}
if (
  !authSmoke.includes('contractor_verification_readiness') ||
  !authSmoke.includes('/api/admin/contractor-verification-readiness') ||
  !authSmoke.includes('gcsc-contractor-verification-readiness-smoke') ||
  !authSmoke.includes('verification_decision_block') ||
  !authSmoke.includes('verification_review_action_queue') ||
  !authSmoke.includes('license_packet_review') ||
  !authSmoke.includes('insurance_packet_review') ||
  !authSmoke.includes('business_identity_packet_review') ||
  !authSmoke.includes('provider_boundary_packet_review') ||
  !authSmoke.includes('eligibility_gate_review') ||
  !authSmoke.includes('action_queue_summary') ||
  !authSmoke.includes('live_license_verification')
) {
  fail('auth smoke harness must verify contractor verification readiness request-id, review action queue, and live provider/legal boundaries');
}
if (
  !authSmoke.includes('contractor_verification_review_packet') ||
  !authSmoke.includes('/api/admin/contractor-verification-readiness/review-packet') ||
  !authSmoke.includes('gcsc-contractor-verification-review-packet-smoke') ||
  !authSmoke.includes('no_contractor_verification_review_packet_content_stored') ||
  !authSmoke.includes('review_packet_gate') ||
  !authSmoke.includes('copyable_markdown')
) {
  fail('auth smoke harness must verify contractor verification review packet request-id, no-storage, and no-live-action boundaries');
}
if (
  !authSmoke.includes('admin_readiness_overview') ||
  !authSmoke.includes('/api/admin/readiness-overview?surface_filter=all_readiness_surfaces') ||
  !authSmoke.includes('/api/admin/readiness-overview?surface_filter=working_capital') ||
  !authSmoke.includes('readiness_overview_filter_invalid') ||
  !authSmoke.includes('Unsupported readiness overview surface_filter') ||
  !authSmoke.includes('gcsc-admin-readiness-overview-smoke') ||
  !authSmoke.includes('provider_legal_money_boundary') ||
  !authSmoke.includes('readiness_surfaces')
) {
  fail('auth smoke harness must verify admin readiness overview filters, request-id, and provider/legal/money boundaries');
}
if (
  !authSmoke.includes('admin_readiness_overview_review_packet') ||
  !authSmoke.includes('/api/admin/readiness-overview/review-packet?surface_filter=all_readiness_surfaces') ||
  !authSmoke.includes('gcsc-admin-readiness-overview-review-packet-smoke') ||
  !authSmoke.includes('no_admin_readiness_overview_review_packet_content_stored') ||
  !authSmoke.includes('review_packet_gate') ||
  !authSmoke.includes('copyable_markdown')
) {
  fail('auth smoke harness must verify admin readiness overview review packet request-id, no-storage, and no-live-action boundaries');
}
if (
  !authSmoke.includes('provider_evidence_packet') ||
  !authSmoke.includes('/api/admin/provider-evidence-packet?surface_filter=contractor_verification') ||
  !authSmoke.includes('gcsc-provider-evidence-packet-smoke') ||
  !authSmoke.includes('provider_evidence_packet_filter_invalid') ||
  !authSmoke.includes('Unsupported provider evidence packet surface_filter') ||
  !authSmoke.includes('redaction_checklist') ||
  !authSmoke.includes('packet_sections')
) {
  fail('auth smoke harness must verify provider evidence packet filters, request-id, redaction checklist, packet sections, and invalid-filter no-live-action boundary');
}
if (
  !authSmoke.includes('provider_evidence_packet_print_template') ||
  !authSmoke.includes('/api/admin/provider-evidence-packet/print-template?surface_filter=contractor_verification') ||
  !authSmoke.includes('gcsc-provider-evidence-packet-print-template-smoke') ||
  !authSmoke.includes('provider_evidence_packet_print_template_filter_invalid') ||
  !authSmoke.includes('Unsupported provider evidence packet print template surface_filter') ||
  !authSmoke.includes('print_redaction_attestation') ||
  !authSmoke.includes('print_template_sections')
) {
  fail('auth smoke harness must verify provider evidence packet print template success and invalid-filter demo-only boundaries');
}
if (
  !authSmoke.includes('provider_evidence_packet_redaction_qa') ||
  !authSmoke.includes('/api/admin/provider-evidence-packet/redaction-qa?surface_filter=contractor_verification') ||
  !authSmoke.includes('gcsc-provider-evidence-packet-redaction-qa-smoke') ||
  !authSmoke.includes('provider_evidence_packet_redaction_qa_filter_invalid') ||
  !authSmoke.includes('Unsupported provider evidence packet redaction qa surface_filter') ||
  !authSmoke.includes('redaction_findings') ||
  !authSmoke.includes('redaction_qa_gate') ||
  !authSmoke.includes('blocked_external_use')
) {
  fail('auth smoke harness must verify provider evidence packet redaction QA success and invalid-filter demo-only boundaries');
}
if (
  !authSmoke.includes('provider_evidence_review_chain') ||
  !authSmoke.includes('/api/admin/provider-evidence-review-chain?surface_filter=contractor_verification') ||
  !authSmoke.includes('gcsc-provider-evidence-review-chain-smoke') ||
  !authSmoke.includes('provider_evidence_review_chain_filter_invalid') ||
  !authSmoke.includes('Unsupported provider evidence review chain surface_filter') ||
  !authSmoke.includes('chain_steps') ||
  !authSmoke.includes('review_gate') ||
  !authSmoke.includes('no_server_storage_attempted')
) {
  fail('auth smoke harness must verify provider evidence review chain success and invalid-filter demo-only boundaries');
}

console.log('SmartContractor validation passed.');
