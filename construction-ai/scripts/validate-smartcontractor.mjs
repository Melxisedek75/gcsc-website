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
  'scripts/validate-homepage-v1-3-static-draft.mjs',
  '../index-v1-3-static-draft.html',
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
execFileSync(process.execPath, ['--check', 'scripts/validate-homepage-v1-3-static-draft.mjs'], { stdio: 'inherit' });
execFileSync(process.execPath, ['scripts/validate-homepage-v1-3-static-draft.mjs'], { stdio: 'inherit' });

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
const jobFitValidationStart = html.indexOf('function renderJobFitValidationDetails');
const jobFitValidationEnd = html.indexOf('function renderJobFitSnapshot()', jobFitValidationStart);
const jobFitValidationSource = jobFitValidationStart >= 0 && jobFitValidationEnd > jobFitValidationStart
  ? html.slice(jobFitValidationStart, jobFitValidationEnd)
  : '';
if (
  !jobFitValidationSource ||
  !jobFitValidationSource.includes('job_fit_snapshot_validation_error') ||
  !jobFitValidationSource.includes('validation_details:') ||
  !jobFitValidationSource.includes('Request ID Header:') ||
  !jobFitValidationSource.includes("data.request_path || '/api/smartcontractor/job-fit-snapshot'") ||
  !jobFitValidationSource.includes("data.request_method || 'GET'") ||
  !jobFitValidationSource.includes('HTTP status:') ||
  !jobFitValidationSource.includes('No real lead routing attempted') ||
  !jobFitValidationSource.includes('No contractor assignment attempted') ||
  !jobFitValidationSource.includes('No live matching action attempted') ||
  !jobFitValidationSource.includes('No live action attempted') ||
  !jobFitValidationSource.includes('Validation detail:')
) {
  fail('Job Fit Snapshot validation details must include full request trace metadata and no-live matching markers');
}
const bidReadinessValidationStart = html.indexOf('function renderBidReadinessValidationDetails');
const bidReadinessValidationEnd = html.indexOf('function renderBidReadinessComparison()', bidReadinessValidationStart);
const bidReadinessValidationSource = bidReadinessValidationStart >= 0 && bidReadinessValidationEnd > bidReadinessValidationStart
  ? html.slice(bidReadinessValidationStart, bidReadinessValidationEnd)
  : '';
if (
  !bidReadinessValidationSource ||
  !bidReadinessValidationSource.includes('bid_readiness_comparison_validation_error') ||
  !bidReadinessValidationSource.includes('validation_details:') ||
  !bidReadinessValidationSource.includes('Request ID Header:') ||
  !bidReadinessValidationSource.includes("data.request_path || '/api/smartcontractor/bid-readiness-comparison'") ||
  !bidReadinessValidationSource.includes("data.request_method || 'GET'") ||
  !bidReadinessValidationSource.includes('HTTP status:') ||
  !bidReadinessValidationSource.includes('No winning bid selected') ||
  !bidReadinessValidationSource.includes('No contractor assignment attempted') ||
  !bidReadinessValidationSource.includes('No live selection action attempted') ||
  !bidReadinessValidationSource.includes('No live action attempted') ||
  !bidReadinessValidationSource.includes('Validation detail:')
) {
  fail('Bid Readiness Comparison validation details must include full request trace metadata and no-live selection markers');
}
const milestoneAcceptanceValidationStart = html.indexOf('function renderMilestoneAcceptanceValidationDetails');
const milestoneAcceptanceValidationEnd = html.indexOf('function renderMilestoneAcceptanceSnapshot()', milestoneAcceptanceValidationStart);
const milestoneAcceptanceValidationSource = milestoneAcceptanceValidationStart >= 0 && milestoneAcceptanceValidationEnd > milestoneAcceptanceValidationStart
  ? html.slice(milestoneAcceptanceValidationStart, milestoneAcceptanceValidationEnd)
  : '';
if (
  !milestoneAcceptanceValidationSource ||
  !milestoneAcceptanceValidationSource.includes('milestone_acceptance_snapshot_validation_error') ||
  !milestoneAcceptanceValidationSource.includes('validation_details:') ||
  !milestoneAcceptanceValidationSource.includes('Request ID Header:') ||
  !milestoneAcceptanceValidationSource.includes("data.request_path || '/api/smartcontractor/milestone-acceptance-snapshot'") ||
  !milestoneAcceptanceValidationSource.includes("data.request_method || 'GET'") ||
  !milestoneAcceptanceValidationSource.includes('HTTP status:') ||
  !milestoneAcceptanceValidationSource.includes('No milestone approval attempted') ||
  !milestoneAcceptanceValidationSource.includes('No escrow release attempted') ||
  !milestoneAcceptanceValidationSource.includes('No payment movement attempted') ||
  !milestoneAcceptanceValidationSource.includes('No live action attempted') ||
  !milestoneAcceptanceValidationSource.includes('Validation detail:')
) {
  fail('Milestone Acceptance Snapshot validation details must include full request trace metadata and no-live approval/payment markers');
}
if (!html.includes('Demo-only payment intents create local review records only') || !html.includes('They do not charge a card, move XPR, release escrow, settle stablecoins, repay loans, or lock token collateral')) {
  fail('Payment Router must visibly block real charges, XPR movement, escrow release, settlement, repayments, and token locks');
}
if (!html.includes('Demo-only loan requests create local review records only') || !html.includes('They do not approve credit, fund a contractor, route repayment, release escrow, or lock token collateral')) {
  fail('Loan view must visibly block real credit approval, contractor funding, repayment routing, escrow release, and token locks');
}
if (
  !server.includes("app.get('/api/smartcontractor/repayment-allocation-preview'") ||
  !server.includes('repayment_allocation_preview') ||
  !server.includes('validateRepaymentAllocationPreviewQuery') ||
  !server.includes('milestone_payment_usd must be a positive finite number') ||
  !server.includes('loan_outstanding_usd must be a non-negative finite number') ||
  !server.includes('repayment_allocation_preview_validation_error') ||
  !server.includes('loan_repayment_hold_usd') ||
  !server.includes('contractor_remainder_usd') ||
  !server.includes('loan_remaining_after_preview_usd') ||
  !server.includes('no_real_repayment_routing_attempted') ||
  !server.includes('no_payment_movement_attempted') ||
  !server.includes('no_escrow_release_attempted')
) {
  fail('server.js must expose local repayment allocation preview API with validation, waterfall fields, and blocked repayment/payment/escrow gates');
}
if (
  !html.includes('/api/smartcontractor/repayment-allocation-preview') ||
  !html.includes('Repayment Allocation Preview') ||
  !html.includes('previewRepaymentAllocation') ||
  !html.includes('repaymentAllocationPreviewResult') ||
  !html.includes('loan_repayment_hold_usd') ||
  !html.includes('contractor_remainder_usd') ||
  !html.includes('No real repayment routing attempted') ||
  !html.includes('No payment movement attempted') ||
  !html.includes('No escrow release attempted')
) {
  fail('Loan UI must render local repayment allocation preview with waterfall fields and blocked repayment/payment/escrow markers');
}
if (
  !html.includes('REPAYMENT_ALLOCATION_PREVIEW_HISTORY_KEY') ||
  !html.includes('repaymentAllocationPreviewHistory') ||
  !html.includes('repaymentAllocationPreviewHistorySummary') ||
  !html.includes('repaymentAllocationPreviewHistoryGrid') ||
  !html.includes('clearRepaymentAllocationPreviewHistoryBtn') ||
  !html.includes('saveRepaymentAllocationPreviewHistory(data)') ||
  !html.includes('loadRepaymentAllocationPreviewHistoryFromLocalStorage') ||
  !html.includes('clearRepaymentAllocationPreviewHistory') ||
  !html.includes('renderRepaymentAllocationPreviewHistory') ||
  !html.includes('repayment_allocation_preview_history') ||
  !html.includes('local_history_only') ||
  !html.includes('metadata_only') ||
  !html.includes('No raw payment references, payment tx hashes, loan IDs') ||
  !html.includes('No real repayment routing history stored') ||
  !html.includes('No payment movement history stored') ||
  !html.includes('No escrow release history stored')
) {
  fail('Loan UI must keep local metadata-only repayment allocation preview history without raw payment references, payment tx hashes, loan IDs, or live repayment/payment/escrow actions');
}
if (
  !server.includes("app.get('/api/smartcontractor/repayment-readiness-snapshot'") ||
  !server.includes('repayment_readiness_snapshot') ||
  !server.includes('validateRepaymentReadinessSnapshotQuery') ||
  !server.includes('repayment_readiness_snapshot_validation_error') ||
  !server.includes('evidence_status must be one of: missing, partial, submitted, verified') ||
  !server.includes('dispute_status must be one of: none, open, unresolved') ||
  !server.includes('payment_status must be one of: not_funded, funded, disputed, released') ||
  !server.includes('readiness_score') ||
  !server.includes('readiness_factors') ||
  !server.includes('demo_only_repayment_readiness_gate') ||
  !server.includes('repayment_readiness_snapshot_history') ||
  !server.includes('repayment_readiness_snapshot_metadata_history_only') ||
  !server.includes('no_real_repayment_routing_attempted') ||
  !server.includes('no_payment_movement_attempted') ||
  !server.includes('no_escrow_release_attempted')
) {
  fail('server.js must expose local repayment readiness snapshot API with validation, readiness factors, metadata-history boundaries, and blocked repayment/payment/escrow gates');
}
if (
  !html.includes('/api/smartcontractor/repayment-readiness-snapshot') ||
  !html.includes('Repayment Readiness Snapshot') ||
  !html.includes('previewRepaymentReadiness') ||
  !html.includes('repaymentReadinessSnapshotResult') ||
  !html.includes('repaymentEvidenceStatus') ||
  !html.includes('repaymentDisputeStatus') ||
  !html.includes('repaymentPaymentStatus') ||
  !html.includes('readiness_score') ||
  !html.includes('readiness_factors') ||
  !html.includes('No real repayment routing attempted') ||
  !html.includes('No payment movement attempted') ||
  !html.includes('No escrow release attempted')
) {
  fail('Loan UI must render local repayment readiness snapshot with evidence/dispute/payment factors and blocked repayment/payment/escrow markers');
}
if (
  !html.includes('REPAYMENT_READINESS_SNAPSHOT_HISTORY_KEY') ||
  !html.includes('repaymentReadinessSnapshotHistory') ||
  !html.includes('repaymentReadinessSnapshotHistorySummary') ||
  !html.includes('repaymentReadinessSnapshotHistoryGrid') ||
  !html.includes('clearRepaymentReadinessSnapshotHistoryBtn') ||
  !html.includes('saveRepaymentReadinessSnapshotHistory(data)') ||
  !html.includes('loadRepaymentReadinessSnapshotHistoryFromLocalStorage') ||
  !html.includes('clearRepaymentReadinessSnapshotHistory') ||
  !html.includes('renderRepaymentReadinessSnapshotHistory') ||
  !html.includes('repayment_readiness_snapshot_history') ||
  !html.includes('repayment_readiness_snapshot_metadata_history_only') ||
  !html.includes('No raw payment references, payment tx hashes, loan IDs') ||
  !html.includes('No repayment readiness approvals stored') ||
  !html.includes('No real repayment routing history stored') ||
  !html.includes('No payment movement history stored') ||
  !html.includes('No escrow release history stored')
) {
  fail('Loan UI must keep local metadata-only repayment readiness snapshot history without raw payment references, approvals, or live repayment/payment/escrow actions');
}
const repaymentAllocationPreviewStart = html.indexOf('async function previewRepaymentAllocation()');
const repaymentAllocationPreviewEnd = html.indexOf('async function recordRepayment()', repaymentAllocationPreviewStart);
const repaymentAllocationPreviewSource = repaymentAllocationPreviewStart >= 0 && repaymentAllocationPreviewEnd > repaymentAllocationPreviewStart
  ? html.slice(repaymentAllocationPreviewStart, repaymentAllocationPreviewEnd)
  : '';
if (
  !repaymentAllocationPreviewSource ||
  !repaymentAllocationPreviewSource.includes('repayment_allocation_preview_validation_error') ||
  !repaymentAllocationPreviewSource.includes('Correct local repayment inputs before previewing again') ||
  !repaymentAllocationPreviewSource.includes('error.body?.details') ||
  !repaymentAllocationPreviewSource.includes('Request ID Header:') ||
  !repaymentAllocationPreviewSource.includes("error.request_path || '/api/smartcontractor/repayment-allocation-preview'") ||
  !repaymentAllocationPreviewSource.includes("error.request_method || 'GET'") ||
  !repaymentAllocationPreviewSource.includes('HTTP status:') ||
  !repaymentAllocationPreviewSource.includes('No real repayment routing attempted') ||
  !repaymentAllocationPreviewSource.includes('No payment movement attempted') ||
  !repaymentAllocationPreviewSource.includes('No escrow release attempted') ||
  !repaymentAllocationPreviewSource.includes('No live action attempted') ||
  !repaymentAllocationPreviewSource.includes('Validation detail:')
) {
  fail('Loan UI must render Repayment Allocation Preview validation errors with request trace metadata, validation details, and no-live-action markers');
}
const repaymentReadinessPreviewStart = html.indexOf('async function previewRepaymentReadiness()');
const repaymentReadinessPreviewEnd = html.indexOf('async function previewRepaymentAllocation()', repaymentReadinessPreviewStart);
const repaymentReadinessPreviewSource = repaymentReadinessPreviewStart >= 0 && repaymentReadinessPreviewEnd > repaymentReadinessPreviewStart
  ? html.slice(repaymentReadinessPreviewStart, repaymentReadinessPreviewEnd)
  : '';
if (
  !repaymentReadinessPreviewSource ||
  !repaymentReadinessPreviewSource.includes('repayment_readiness_snapshot_validation_error') ||
  !repaymentReadinessPreviewSource.includes('Correct local readiness inputs before previewing again') ||
  !repaymentReadinessPreviewSource.includes('error.body?.details') ||
  !repaymentReadinessPreviewSource.includes('Request ID Header:') ||
  !repaymentReadinessPreviewSource.includes("error.request_path || '/api/smartcontractor/repayment-readiness-snapshot'") ||
  !repaymentReadinessPreviewSource.includes("error.request_method || 'GET'") ||
  !repaymentReadinessPreviewSource.includes('HTTP status:') ||
  !repaymentReadinessPreviewSource.includes('No real repayment routing attempted') ||
  !repaymentReadinessPreviewSource.includes('No payment movement attempted') ||
  !repaymentReadinessPreviewSource.includes('No escrow release attempted') ||
  !repaymentReadinessPreviewSource.includes('No live action attempted') ||
  !repaymentReadinessPreviewSource.includes('Validation detail:')
) {
  fail('Loan UI must render Repayment Readiness Snapshot validation errors with request trace metadata, validation details, and no-live-action markers');
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
  !html.includes('SMART_CONTRACT_LOCAL_REPLAY_DRY_RUN_HISTORY_KEY') ||
  !html.includes('smartContractLocalReplayDryRunHistory') ||
  !html.includes('smartContractLocalReplayDryRunHistorySummary') ||
  !html.includes('smartContractLocalReplayDryRunHistoryGrid') ||
  !html.includes('clearSmartContractLocalReplayDryRunHistoryBtn') ||
  !html.includes('loadSmartContractLocalReplayDryRunHistoryFromLocalStorage') ||
  !html.includes('saveSmartContractLocalReplayDryRunHistory') ||
  !html.includes('renderSmartContractLocalReplayDryRunHistory') ||
  !html.includes('clearSmartContractLocalReplayDryRunHistory') ||
  !html.includes('smart_contract_local_replay_dry_run_history') ||
  !html.includes('smart_contract_local_replay_dry_run_metadata_history_only') ||
  !html.includes('No local replay dry-run step details, helper exports, demo fixtures, evidence packet sections, handoff summary sections, workbench card details, raw smart-contract helper payloads, secrets, signatures, payment data, loan approvals, escrow releases, repayment routing approvals, stablecoin settlements, token collateral locks, provider commitments, legal decisions, production approvals, external sends, or live-action approvals are stored in this smart contract local replay dry-run history.') ||
  !html.includes('saveAdminLocalEvidenceTimelineEntry(\'smart_contract_local_replay_dry_run\'')
) {
  fail('Smart contract local replay dry-run UI must keep local metadata-only history without storing step details, helper payloads, packet content, handoff content, or enabling live actions');
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
  !html.includes('SMART_CONTRACT_LOCAL_REPLAY_DRY_RUN_EVIDENCE_PACKET_HISTORY_KEY') ||
  !html.includes('smartContractLocalReplayDryRunEvidencePacketHistory') ||
  !html.includes('smartContractLocalReplayDryRunEvidencePacketHistorySummary') ||
  !html.includes('smartContractLocalReplayDryRunEvidencePacketHistoryGrid') ||
  !html.includes('clearSmartContractLocalReplayDryRunEvidencePacketHistoryBtn') ||
  !html.includes('loadSmartContractLocalReplayDryRunEvidencePacketHistoryFromLocalStorage') ||
  !html.includes('saveSmartContractLocalReplayDryRunEvidencePacketHistory') ||
  !html.includes('renderSmartContractLocalReplayDryRunEvidencePacketHistory') ||
  !html.includes('clearSmartContractLocalReplayDryRunEvidencePacketHistory') ||
  !html.includes('smart_contract_local_replay_dry_run_evidence_packet_history') ||
  !html.includes('smart_contract_local_replay_dry_run_evidence_packet_metadata_history_only') ||
  !html.includes('No dry-run packet sections, markdown previews, redaction attestation values, local replay dry-run step details, helper exports, demo fixtures, workbench card details, handoff summary sections, raw smart-contract helper payloads, secrets, signatures, payment data, loan approvals, escrow releases, repayment routing approvals, stablecoin settlements, token collateral locks, provider commitments, legal decisions, production approvals, external sends, or live-action approvals are stored in this smart contract local replay dry-run evidence packet history.') ||
  !html.includes('saveAdminLocalEvidenceTimelineEntry(\'smart_contract_local_replay_dry_run_evidence_packet\'')
) {
  fail('Smart contract local replay dry-run evidence packet UI must keep local metadata-only history without storing packet sections, markdown previews, redaction values, helper payloads, or enabling live actions');
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
  !html.includes('SMART_CONTRACT_REVIEW_WORKBENCH_HISTORY_KEY') ||
  !html.includes('smartContractReviewWorkbenchHistory') ||
  !html.includes('smartContractReviewWorkbenchHistorySummary') ||
  !html.includes('smartContractReviewWorkbenchHistoryGrid') ||
  !html.includes('clearSmartContractReviewWorkbenchHistoryBtn') ||
  !html.includes('loadSmartContractReviewWorkbenchHistoryFromLocalStorage') ||
  !html.includes('saveSmartContractReviewWorkbenchHistory') ||
  !html.includes('renderSmartContractReviewWorkbenchHistory') ||
  !html.includes('clearSmartContractReviewWorkbenchHistory') ||
  !html.includes('smart_contract_review_workbench_history') ||
  !html.includes('smart_contract_review_workbench_metadata_history_only') ||
  !html.includes('saveAdminLocalEvidenceTimelineEntry(\'smart_contract_review_workbench\'') ||
  !html.includes('No workbench card details, helper exports, demo fixtures, dry-run step details, evidence packet sections, handoff summary sections, raw smart-contract helper payloads, secrets, signatures, payment data, loan approvals, escrow releases, repayment routing approvals, stablecoin settlements, token collateral locks, provider commitments, legal decisions, production approvals, external sends, or live-action approvals are stored in this smart contract review workbench history.')
) {
  fail('Smart contract review workbench UI must keep local metadata-only history without storing workbench card details, helper payloads, handoff content, or enabling live actions');
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
  !html.includes('SMART_CONTRACT_REVIEW_WORKBENCH_HANDOFF_SUMMARY_HISTORY_KEY') ||
  !html.includes('smartContractReviewWorkbenchHandoffSummaryHistory') ||
  !html.includes('smartContractReviewWorkbenchHandoffSummaryHistorySummary') ||
  !html.includes('smartContractReviewWorkbenchHandoffSummaryHistoryGrid') ||
  !html.includes('clearSmartContractReviewWorkbenchHandoffSummaryHistoryBtn') ||
  !html.includes('loadSmartContractReviewWorkbenchHandoffSummaryHistoryFromLocalStorage') ||
  !html.includes('saveSmartContractReviewWorkbenchHandoffSummaryHistory') ||
  !html.includes('renderSmartContractReviewWorkbenchHandoffSummaryHistory') ||
  !html.includes('clearSmartContractReviewWorkbenchHandoffSummaryHistory') ||
  !html.includes('smart_contract_review_workbench_handoff_summary_history') ||
  !html.includes('smart_contract_review_workbench_handoff_summary_metadata_history_only') ||
  !html.includes('saveAdminLocalEvidenceTimelineEntry(\'smart_contract_review_workbench_handoff_summary\'') ||
  !html.includes('No handoff summary section details, markdown previews, redaction attestation values, workbench card details, helper exports, demo fixtures, dry-run step details, evidence packet sections, raw smart-contract helper payloads, secrets, signatures, payment data, loan approvals, escrow releases, repayment routing approvals, stablecoin settlements, token collateral locks, provider commitments, legal decisions, production approvals, external sends, or live-action approvals are stored in this smart contract review workbench handoff summary history.')
) {
  fail('Smart contract review workbench handoff summary UI must keep local metadata-only history without storing handoff content, markdown, redaction values, helper payloads, or enabling live actions');
}
if (
  !server.includes("app.get('/api/admin/smart-contract-review-workbench/gate-matrix'") ||
  !server.includes('buildSmartContractReviewWorkbenchGateMatrix') ||
  !server.includes('smart_contract_review_workbench_gate_matrix') ||
  !server.includes('gate_matrix_rows') ||
  !server.includes('gate_matrix_summary') ||
  !server.includes('gate_matrix_gate') ||
  !server.includes('route_set_summary') ||
  !server.includes('route_set_count') ||
  !server.includes('available_endpoint_types') ||
  !server.includes('recommended_review_order') ||
  !server.includes('local_review_route_set') ||
  !server.includes('dry_run_endpoint') ||
  !server.includes('dry_run_packet_endpoint') ||
  !server.includes('smart_contract_review_workbench_gate_matrix_filter_invalid') ||
  !server.includes('Unsupported smart contract review workbench gate matrix category_filter') ||
  !server.includes('smart_contract_review_workbench_gate_matrix_filter_recovery_actions') ||
  !server.includes('selected_helper_category_filter') ||
  !server.includes('no_gate_matrix_content_stored: true') ||
  !server.includes('no_live_replay_action_attempted: true')
) {
  fail('server.js must expose a local smart contract review workbench gate matrix endpoint with matrix rows, filter recovery, summary, route-set summary, review order, blocked gate, no-server-storage, and no-live-replay boundaries');
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
  !html.includes('route_set_summary') ||
  !html.includes('route_set_summary.route_set_count') ||
  !html.includes('route_set_summary.available_endpoint_types') ||
  !html.includes('recommended_review_order') ||
  !html.includes('category_filter=${encodeURIComponent(helperFilter)}') ||
  !html.includes('smart_contract_review_workbench_gate_matrix_filter_recovery_actions') ||
  !html.includes('Apply safe gate matrix filter') ||
  !html.includes('Rejected category_filter') ||
  !html.includes('No gate matrix content stored') ||
  !html.includes('Gate matrix row shortcuts are local review navigation only') ||
  !html.includes('Open local dry run') ||
  !html.includes('Open dry-run packet') ||
  !html.includes('Open local handoff') ||
  !html.includes('Recommended Local Review Order') ||
  !html.includes('recommended_review_order local-only scan sequence') ||
  !html.includes('Review order shortcuts are local navigation only') ||
  !html.includes('Open ordered gate row') ||
  !html.includes('Open ordered dry-run packet') ||
  !html.includes('order.workbench_endpoint') ||
  !html.includes('order.handoff_summary_endpoint') ||
  !html.includes('order.dry_run_endpoint') ||
  !html.includes('order.dry_run_packet_endpoint') ||
  !html.includes('local_review_route_set') ||
  !html.includes("loadSmartContractReviewWorkbenchGateMatrix('${escapeHtml(order.filter_id || 'all_helper_categories')}')") ||
  !html.includes("loadSmartContractLocalReplayDryRunEvidencePacket('${escapeHtml(order.filter_id || 'all_helper_categories')}')") ||
  !html.includes("loadSmartContractLocalReplayDryRun('${escapeHtml(row.filter_id || 'all_helper_categories')}')") ||
  !html.includes("loadSmartContractLocalReplayDryRunEvidencePacket('${escapeHtml(row.filter_id || 'all_helper_categories')}')") ||
  !html.includes("loadSmartContractReviewWorkbenchHandoffSummary('${escapeHtml(row.filter_id || 'all_helper_categories')}')") ||
  !html.includes('saveAdminLocalEvidenceTimelineEntry(\'smart_contract_review_workbench_gate_matrix\'')
) {
  fail('Smart contract review gate matrix UI must expose route-set summary plus local-only row shortcuts and recommended review order shortcuts without live actions');
}
if (
  !html.includes('SMART_CONTRACT_REVIEW_WORKBENCH_GATE_MATRIX_HISTORY_KEY') ||
  !html.includes('smartContractReviewWorkbenchGateMatrixHistory') ||
  !html.includes('smartContractReviewWorkbenchGateMatrixHistorySummary') ||
  !html.includes('smartContractReviewWorkbenchGateMatrixHistoryGrid') ||
  !html.includes('clearSmartContractReviewWorkbenchGateMatrixHistoryBtn') ||
  !html.includes('loadSmartContractReviewWorkbenchGateMatrixHistoryFromLocalStorage') ||
  !html.includes('saveSmartContractReviewWorkbenchGateMatrixHistory') ||
  !html.includes('renderSmartContractReviewWorkbenchGateMatrixHistory') ||
  !html.includes('clearSmartContractReviewWorkbenchGateMatrixHistory') ||
  !html.includes('smart_contract_review_workbench_gate_matrix_history') ||
  !html.includes('smart_contract_review_gate_matrix_metadata_history_only') ||
  !html.includes('saveAdminLocalEvidenceTimelineEntry(\'smart_contract_review_workbench_gate_matrix\'') ||
  !html.includes('No gate matrix row details, review gate row details, recommended review order details, helper exports, demo fixtures, dry-run steps, evidence packet sections, handoff summary sections, raw smart-contract helper payloads, secrets, signatures, payment data, loan approvals, escrow releases, repayment routing approvals, stablecoin settlements, token collateral locks, provider commitments, legal decisions, production approvals, external sends, or live-action approvals are stored in this smart contract review gate matrix history.')
) {
  fail('Smart contract review workbench gate matrix UI must keep local metadata-only history without storing matrix row details, helper payloads, handoff content, or enabling live actions');
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
if (
  !server.includes('tester_finance_contract_boundary_pack') ||
  !server.includes('demo_only_finance_contract_boundary_pack') ||
  !server.includes('No real payments') ||
  !server.includes('No live loan approval') ||
  !server.includes('No escrow release') ||
  !server.includes('No signed contract') ||
  !server.includes('No token collateral')
) {
  fail('server.js beta readiness must expose tester_finance_contract_boundary_pack with demo-only finance and contract boundaries');
}
if (
  !server.includes('tester_finance_contract_quickstart') ||
  !server.includes('finance_contract_tester_quickstart') ||
  !server.includes('Open finance/contract demo screens only') ||
  !server.includes('Capture safe request IDs') ||
  !server.includes('Stop before live interpretation') ||
  !server.includes('safe_tester_actions') ||
  !server.includes('blocked_live_interpretations') ||
  !server.includes('report_back_fields') ||
  !server.includes('no_external_followup_attempted: true') ||
  !server.includes('no_public_beta_flip_attempted: true') ||
  !server.includes('no_live_action_attempted: true')
) {
  fail('server.js beta readiness must expose tester_finance_contract_quickstart with allowed tester actions, blocked live interpretations, report-back fields, and no-live/no-external boundaries');
}
if (
  !server.includes('traditional_first_public_copy_gate') ||
  !server.includes('traditional_first_public_default') ||
  !server.includes('future_web3_integration_port') ||
  !server.includes('public_copy_review_before_publish') ||
  !server.includes('TRADITIONAL_FIRST_PUBLIC_SAFE') ||
  !server.includes('FUTURE_PROVIDER_REVIEW_ONLY') ||
  !server.includes('FOUNDER_REVIEW_REQUIRED') ||
  !server.includes('SmartContractor is a construction trust platform') ||
  !server.includes('Use traditional construction trust wording in public beta') ||
  !server.includes('whitepaper.html and index.html unchanged') ||
  !server.includes('no_public_website_edit_attempted: true') ||
  !server.includes('no_external_provider_claim_attempted: true') ||
  !server.includes('no_live_action_attempted: true')
) {
  fail('server.js beta readiness must expose traditional_first_public_copy_gate with traditional-first public wording, future Web3 review-only ports, and no-public-edit/no-live boundaries');
}
if (
  !server.includes("function founderAuthNextStepReadinessItems()") ||
  !server.includes("app.get('/api/admin/founder-auth-next-step-readiness'") ||
  !server.includes('founder_auth_next_step_readiness') ||
  !server.includes('founderAuthNextStepReadiness') ||
  !server.includes('founder_auth_same_browser_magic_link') ||
  !server.includes('founder_auth_profile_binding_review') ||
  !server.includes('founder_admin_activation_stop_gate') ||
  !server.includes('safe_report_fields') ||
  !server.includes('no_magic_link_url_requested') ||
  !server.includes('no_auth_token_requested') ||
  !server.includes('no_service_role_key_requested') ||
  !server.includes('FOUNDER_MAGIC_LINK_REQUIRED') ||
  !server.includes('PROFILE_BINDING_EVIDENCE_REQUIRED') ||
  !server.includes('BLOCKED_UNTIL_EXPLICIT_LIVE_APPROVAL') ||
  !server.includes('no_secret_requested: true') ||
  !server.includes('no_profile_repair_attempted: true') ||
  !server.includes('no_admin_membership_insert_attempted: true') ||
  !server.includes('no_strict_rls_apply_attempted: true') ||
  !server.includes('no_live_action_attempted: true') ||
  !server.includes("'founder-auth-next-step-readiness'") ||
  !html.includes('Direct read-only endpoint: /api/admin/founder-auth-next-step-readiness') ||
  !authSmoke.includes('/api/admin/founder-auth-next-step-readiness') ||
  !authSmoke.includes('founder-auth-next-step-readiness') ||
  !authSmoke.includes('founderAuthNextStepReadiness.body?.mode')
) {
  fail('server.js and Admin UI must expose founder_auth_next_step_readiness with a direct read-only endpoint, same-browser Magic Link, profile binding, admin activation stop gates, and auth smoke coverage');
}
if (
  !server.includes("function weekTwoAuthAdminReadinessItems()") ||
  !server.includes("app.get('/api/admin/week-two-auth-admin-readiness'") ||
  !server.includes('week_two_auth_admin_readiness') ||
  !server.includes('weekTwoAuthAdminReadiness') ||
  !server.includes('week_two_magic_link_same_browser_checklist') ||
  !server.includes('week_two_founder_profile_binding_checklist') ||
  !server.includes('week_two_admin_membership_live_approval_gate') ||
  !server.includes('week_two_strict_rls_decision_packet_checklist') ||
  !server.includes('FOUNDER_MAGIC_LINK_EVIDENCE_REQUIRED') ||
  !server.includes('FOUNDER_PROFILE_BINDING_EVIDENCE_REQUIRED') ||
  !server.includes('ADMIN_MEMBERSHIP_LIVE_APPROVAL_BLOCKED') ||
  !server.includes('STRICT_RLS_REVIEW_PACKET_READY_LIVE_APPLY_BLOCKED') ||
  !server.includes('checklist_phase_counts') ||
  !server.includes('founder_report_field_count') ||
  !server.includes('no_magic_link_url_requested: true') ||
  !server.includes('no_service_role_key_requested: true') ||
  !server.includes('no_live_supabase_write_attempted: true') ||
  !html.includes('Direct read-only endpoint: /api/admin/week-two-auth-admin-readiness') ||
  !authSmoke.includes('/api/admin/week-two-auth-admin-readiness') ||
  !authSmoke.includes('weekTwoAuthAdminReadiness.body?.mode')
) {
  fail('server.js and Admin UI must expose week_two_auth_admin_readiness with Magic Link, profile, admin membership, strict RLS, and no-live Auth/Admin boundaries');
}
if (
  !server.includes("function weekTwoAuthAdminExecutionChecklistItems()") ||
  !server.includes("app.get('/api/admin/week-two-auth-admin-execution-checklist'") ||
  !server.includes('week_two_auth_admin_execution_checklist') ||
  !server.includes('weekTwoAuthAdminExecutionChecklist') ||
  !server.includes('week_two_auth_admin_report_back_intake') ||
  !server.includes('week_two_auth_admin_selected_user_confirmation') ||
  !server.includes('week_two_auth_admin_live_request_hold') ||
  !server.includes('week_two_auth_admin_post_activation_smoke_order_hold') ||
  !server.includes('CURRENT_THREAD_REPORT_BACK_REQUIRED') ||
  !server.includes('SELECTED_USER_CONFIRMATION_REQUIRED') ||
  !server.includes('LIVE_ADMIN_ACTIVATION_REQUEST_HELD') ||
  !server.includes('POST_ACTIVATION_SMOKE_ORDER_READY_LIVE_BLOCKED') ||
  !server.includes('execution_phase_counts') ||
  !server.includes('execution_checklist_count') ||
  !server.includes('no_raw_identity_storage_attempted: true') ||
  !server.includes('no_selected_user_screenshot_storage_attempted: true') ||
  !server.includes('no_strict_admin_smoke_live_run_attempted: true') ||
  !server.includes('no_xpr_signature_attempted: true') ||
  !server.includes("'week-two-auth-admin-execution-checklist'") ||
  !html.includes('Direct read-only endpoint: /api/admin/week-two-auth-admin-execution-checklist') ||
  !authSmoke.includes('/api/admin/week-two-auth-admin-execution-checklist') ||
  !authSmoke.includes('weekTwoAuthAdminExecutionChecklist.body?.mode')
) {
  fail('server.js and Admin UI must expose week_two_auth_admin_execution_checklist with report-back, selected-user, live request hold, post-smoke order, and no-live Auth/Admin boundaries');
}
if (
  !server.includes("function deploymentNextStepReadinessItems()") ||
  !server.includes("app.get('/api/admin/deployment-next-step-readiness'") ||
  !server.includes('deployment_next_step_readiness') ||
  !server.includes('deploymentNextStepReadiness') ||
  !server.includes('deployment_target_selection_review') ||
  !server.includes('deployment_account_session_boundary') ||
  !server.includes('public_beta_url_smoke_evidence_intake') ||
  !server.includes('supabase_redirect_env_owner_boundary') ||
  !server.includes('READY_FOR_FOUNDER_DEPLOY_TARGET_REVIEW') ||
  !server.includes('BLOCKED_FOR_FOUNDER_ACCOUNT_SESSION_REVIEW') ||
  !server.includes('LOCAL_EVIDENCE_TEMPLATE_READY_URL_PENDING') ||
  !server.includes('BLOCKED_EXTERNAL_ACTION_FOUNDER_ONLY') ||
  !server.includes('vercel_import') ||
  !server.includes('github_pages_setting_change') ||
  !server.includes('supabase_redirect_update') ||
  !server.includes('public_url_share') ||
  !server.includes('tester_invite') ||
  !server.includes('safe_report_fields') ||
  !server.includes('no_external_account_login_attempted') ||
  !server.includes('no_external_account_change_attempted: true') ||
  !server.includes('no_deploy_setting_change_attempted: true') ||
  !server.includes('no_dns_change_attempted: true') ||
  !server.includes('no_supabase_redirect_change_attempted: true') ||
  !server.includes('no_public_url_share_attempted: true') ||
  !server.includes('no_tester_invite_attempted: true') ||
  !server.includes('no_live_action_attempted: true') ||
  !server.includes("'deployment-next-step-readiness'") ||
  !html.includes('Direct read-only endpoint: /api/admin/deployment-next-step-readiness') ||
  !authSmoke.includes('/api/admin/deployment-next-step-readiness') ||
  !authSmoke.includes('deployment-next-step-readiness') ||
  !authSmoke.includes('deploymentNextStepReadiness.body?.mode')
) {
  fail('server.js and Admin UI must expose deployment_next_step_readiness with a direct read-only endpoint, founder-only deploy, account, URL smoke, Supabase redirect, safe report fields, and no-live boundaries');
}
if (
  !server.includes("function weekTwoDeploymentPublicBetaReadinessItems()") ||
  !server.includes("app.get('/api/admin/week-two-deployment-public-beta-readiness'") ||
  !server.includes('week_two_deployment_public_beta_readiness') ||
  !server.includes('weekTwoDeploymentPublicBetaReadiness') ||
  !server.includes('week_two_deploy_target_review_checklist') ||
  !server.includes('week_two_public_url_smoke_template_checklist') ||
  !server.includes('week_two_supabase_redirect_env_boundary_checklist') ||
  !server.includes('week_two_public_beta_invite_gate_checklist') ||
  !server.includes('FOUNDER_DEPLOY_TARGET_REVIEW_REQUIRED') ||
  !server.includes('PUBLIC_URL_SMOKE_TEMPLATE_READY_URL_PENDING') ||
  !server.includes('SUPABASE_REDIRECT_ENV_FOUNDER_ONLY_BLOCKED') ||
  !server.includes('PUBLIC_BETA_INVITE_APPROVAL_BLOCKED') ||
  !server.includes('checklist_phase_counts') ||
  !server.includes('founder_report_field_count') ||
  !server.includes('linked_surfaces') ||
  !server.includes('no_external_account_login_attempted: true') ||
  !server.includes('no_public_beta_flip_attempted: true') ||
  !server.includes('no_production_release_attempted: true') ||
  !html.includes('Direct read-only endpoint: /api/admin/week-two-deployment-public-beta-readiness') ||
  !authSmoke.includes('/api/admin/week-two-deployment-public-beta-readiness') ||
  !authSmoke.includes('weekTwoDeploymentPublicBetaReadiness.body?.mode')
) {
  fail('server.js and Admin UI must expose week_two_deployment_public_beta_readiness with deploy target, URL smoke, Supabase redirect/env, invite gate, and no-live deploy/public beta boundaries');
}
if (
  !server.includes("function weekTwoDeploymentPublicBetaExecutionChecklistItems()") ||
  !server.includes("app.get('/api/admin/week-two-deployment-public-beta-execution-checklist'") ||
  !server.includes('week_two_deployment_public_beta_execution_checklist') ||
  !server.includes('weekTwoDeploymentPublicBetaExecutionChecklist') ||
  !server.includes('week_two_deployment_account_report_back_intake') ||
  !server.includes('week_two_public_url_smoke_report_back_intake') ||
  !server.includes('week_two_public_beta_invite_request_hold') ||
  !server.includes('week_two_supabase_redirect_env_change_hold') ||
  !server.includes('DEPLOYMENT_ACCOUNT_REPORT_BACK_REQUIRED') ||
  !server.includes('PUBLIC_URL_SMOKE_EVIDENCE_REQUIRED_URL_PRIVATE') ||
  !server.includes('PUBLIC_BETA_INVITE_REQUEST_HELD') ||
  !server.includes('SUPABASE_REDIRECT_ENV_CHANGE_HELD') ||
  !server.includes('execution_phase_counts') ||
  !server.includes('deployment_public_beta_execution_checklist_count') ||
  !server.includes('no_external_account_session_storage_attempted: true') ||
  !server.includes('no_real_public_url_storage_attempted: true') ||
  !server.includes('no_live_supabase_write_attempted: true') ||
  !server.includes('no_xpr_signature_attempted: true') ||
  !server.includes("'week-two-deployment-public-beta-execution-checklist'") ||
  !html.includes('Direct read-only endpoint: /api/admin/week-two-deployment-public-beta-execution-checklist') ||
  !authSmoke.includes('/api/admin/week-two-deployment-public-beta-execution-checklist') ||
  !authSmoke.includes('weekTwoDeploymentPublicBetaExecutionChecklist.body?.mode')
) {
  fail('server.js and Admin UI must expose week_two_deployment_public_beta_execution_checklist with deployment account report-back, redacted URL smoke, invite hold, Supabase env hold, and no-live deploy/public beta boundaries');
}
if (
  !server.includes("function legalProviderNextStepReadinessItems()") ||
  !server.includes("app.get('/api/admin/legal-provider-next-step-readiness'") ||
  !server.includes('legal_provider_next_step_readiness') ||
  !server.includes('legalProviderNextStepReadiness') ||
  !server.includes('working_capital_legal_provider_question_prep') ||
  !server.includes('escrow_payment_provider_question_prep') ||
  !server.includes('claimbridge_advance_provider_question_prep') ||
  !server.includes('token_collateral_security_legal_question_prep') ||
  !server.includes('BLOCKED_FOR_EXTERNAL_LEGAL_PROVIDER_REVIEW') ||
  !server.includes('BLOCKED_FOR_ESCROW_PAYMENT_PROVIDER_REVIEW') ||
  !server.includes('BLOCKED_FOR_ADVANCE_PROVIDER_REVIEW') ||
  !server.includes('BLOCKED_FOR_TOKEN_COLLATERAL_REVIEW') ||
  !server.includes('review_area_counts') ||
  !server.includes('safe_report_fields') ||
  !server.includes('legal_conclusion') ||
  !server.includes('provider_commitment') ||
  !server.includes('real_payment') ||
  !server.includes('real_loan') ||
  !server.includes('real_escrow') ||
  !server.includes('repayment_routing') ||
  !server.includes('stablecoin_settlement') ||
  !server.includes('token_collateral_lock') ||
  !server.includes('xpr_signature') ||
  !server.includes('no_external_send_attempted: true') ||
  !server.includes('no_provider_commitment_attempted: true') ||
  !server.includes('no_legal_decision_attempted: true') ||
  !server.includes('no_live_finance_action_attempted: true') ||
  !server.includes('no_xpr_signature_attempted: true') ||
  !server.includes('no_live_action_attempted: true') ||
  !server.includes("'legal-provider-next-step-readiness'") ||
  !html.includes('Legal/Provider Next Step Readiness') ||
  !html.includes('Direct read-only endpoint: /api/admin/legal-provider-next-step-readiness') ||
  !html.includes('data.legal_provider_next_step_readiness') ||
  !authSmoke.includes('/api/admin/legal-provider-next-step-readiness') ||
  !authSmoke.includes('legal-provider-next-step-readiness') ||
  !authSmoke.includes('legalProviderNextStepReadiness.body?.mode') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=legal_provider_next_step_readiness')
) {
  fail('server.js and Admin UI must expose legal_provider_next_step_readiness with a direct read-only endpoint, working-capital, escrow/payment, ClaimBridge/advance, token-collateral question prep, and no-legal/no-provider/no-finance/no-XPR/no-live boundaries');
}
if (
  !server.includes("function weekTwoLegalProviderReadinessItems()") ||
  !server.includes("app.get('/api/admin/week-two-legal-provider-readiness'") ||
  !server.includes('week_two_legal_provider_readiness') ||
  !server.includes('weekTwoLegalProviderReadiness') ||
  !server.includes('week_two_working_capital_review_question_checklist') ||
  !server.includes('week_two_escrow_payment_review_question_checklist') ||
  !server.includes('week_two_claimbridge_advance_review_question_checklist') ||
  !server.includes('week_two_token_collateral_review_question_checklist') ||
  !server.includes('WORKING_CAPITAL_PROVIDER_QUESTIONS_READY_REVIEW_REQUIRED') ||
  !server.includes('ESCROW_PAYMENT_PROVIDER_QUESTIONS_READY_REVIEW_REQUIRED') ||
  !server.includes('CLAIMBRIDGE_ADVANCE_PROVIDER_QUESTIONS_READY_REVIEW_REQUIRED') ||
  !server.includes('TOKEN_COLLATERAL_SECURITY_LEGAL_QUESTIONS_READY_REVIEW_REQUIRED') ||
  !server.includes('checklist_phase_counts') ||
  !server.includes('founder_report_field_count') ||
  !server.includes('linked_surfaces') ||
  !server.includes('provider_submission') ||
  !server.includes('no_provider_submission_attempted: true') ||
  !server.includes('no_smart_contract_deployment_attempted: true') ||
  !server.includes('no_public_claim_approval_attempted: true') ||
  !server.includes("'week-two-legal-provider-readiness'") ||
  !html.includes('Week 2 Legal/Provider Readiness') ||
  !html.includes('Direct read-only endpoint: /api/admin/week-two-legal-provider-readiness') ||
  !html.includes('data.week_two_legal_provider_readiness') ||
  !authSmoke.includes('/api/admin/week-two-legal-provider-readiness') ||
  !authSmoke.includes('week-two-legal-provider-readiness') ||
  !authSmoke.includes('weekTwoLegalProviderReadiness.body?.mode') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_legal_provider_readiness')
) {
  fail('server.js and Admin UI must expose week_two_legal_provider_readiness with Week 2 question checklists, direct endpoint, evidence export source, and no-legal/no-provider/no-finance/no-XPR/no-live boundaries');
}
if (
  !server.includes("function weekTwoLegalProviderExecutionChecklistItems()") ||
  !server.includes("app.get('/api/admin/week-two-legal-provider-execution-checklist'") ||
  !server.includes('week_two_legal_provider_execution_checklist') ||
  !server.includes('weekTwoLegalProviderExecutionChecklist') ||
  !server.includes('week_two_legal_provider_question_packet_report_back_intake') ||
  !server.includes('week_two_provider_response_summary_hold') ||
  !server.includes('week_two_finance_escrow_live_action_request_hold') ||
  !server.includes('week_two_public_claim_legal_wording_decision_hold') ||
  !server.includes('QUESTION_PACKET_REPORT_BACK_REQUIRED') ||
  !server.includes('PROVIDER_RESPONSE_SUMMARY_HELD') ||
  !server.includes('FINANCE_ESCROW_LIVE_ACTION_REQUEST_HELD') ||
  !server.includes('PUBLIC_CLAIM_LEGAL_WORDING_DECISION_HELD') ||
  !server.includes('LEGAL_PROVIDER_EXECUTION_DECISION_RECORDED') ||
  !server.includes('execution_phase_counts') ||
  !server.includes('legal_provider_execution_checklist_count') ||
  !server.includes('no_raw_reviewer_response_stored: true') ||
  !server.includes('no_attorney_advice_stored: true') ||
  !server.includes('no_legal_conclusion_recorded: true') ||
  !server.includes("'week-two-legal-provider-execution-checklist'") ||
  !html.includes('Week 2 Legal/Provider Execution Checklist') ||
  !html.includes('Direct read-only endpoint: /api/admin/week-two-legal-provider-execution-checklist') ||
  !html.includes('data.week_two_legal_provider_execution_checklist') ||
  !html.includes("const weekTwoLegalProviderExecutionChecklistCount = (data.week_two_legal_provider_execution_checklist || []).length") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_legal_provider_execution_checklist')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_legal_provider_execution_checklist')") ||
  !authSmoke.includes('/api/admin/week-two-legal-provider-execution-checklist') ||
  !authSmoke.includes('week-two-legal-provider-execution-checklist') ||
  !authSmoke.includes('weekTwoLegalProviderExecutionChecklist.body?.mode') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_legal_provider_execution_checklist')
) {
  fail('server.js and Admin UI must expose week_two_legal_provider_execution_checklist with packet report-back, response hold, finance/escrow live-action hold, public-claim wording hold, evidence export source, and no-legal/no-provider/no-finance/no-XPR/no-live boundaries');
}
if (
  !server.includes("function publicBetaNextStepReadinessItems()") ||
  !server.includes("app.get('/api/admin/public-beta-next-step-readiness'") ||
  !server.includes('public_beta_next_step_readiness') ||
  !server.includes('publicBetaNextStepReadiness') ||
  !server.includes('public_beta_scope_decision_review') ||
  !server.includes('public_beta_url_smoke_evidence_review') ||
  !server.includes('public_beta_invite_approval_stop_gate') ||
  !server.includes('public_beta_support_triage_readiness') ||
  !server.includes('BLOCKED_UNTIL_PUBLIC_BETA_SCOPE_REVIEW') ||
  !server.includes('URL_PENDING_FOUNDER_DEPLOYMENT_REQUIRED') ||
  !server.includes('BLOCKED_UNTIL_PUBLIC_BETA_INVITE_ACTION_RECORDED') ||
  !server.includes('LOCAL_SUPPORT_TRIAGE_READY_REVIEW') ||
  !server.includes('review_area_counts') ||
  !server.includes('safe_report_fields') ||
  !server.includes('PUBLIC_BETA_INVITE_ACTION_RECORDED') ||
  !server.includes('public_beta_launch') ||
  !server.includes('real_public_url_in_repo') ||
  !server.includes('public_url_share') ||
  !server.includes('tester_invite') ||
  !server.includes('external_send') ||
  !server.includes('sensitive_data_collection') ||
  !server.includes('production_release') ||
  !server.includes('payment_or_loan_action') ||
  !server.includes('legal_or_provider_decision') ||
  !server.includes('no_external_send_attempted: true') ||
  !server.includes('no_public_url_share_attempted: true') ||
  !server.includes('no_tester_invite_attempted: true') ||
  !server.includes('no_deploy_setting_change_attempted: true') ||
  !server.includes('no_supabase_redirect_change_attempted: true') ||
  !server.includes('no_live_finance_action_attempted: true') ||
  !server.includes('no_legal_provider_decision_attempted: true') ||
  !server.includes('no_production_release_attempted: true') ||
  !server.includes('no_live_action_attempted: true') ||
  !server.includes("'public-beta-next-step-readiness'") ||
  !html.includes('Public Beta Next Step Readiness') ||
  !html.includes('Direct read-only endpoint: /api/admin/public-beta-next-step-readiness') ||
  !html.includes('data.public_beta_next_step_readiness') ||
  !authSmoke.includes('/api/admin/public-beta-next-step-readiness') ||
  !authSmoke.includes('public-beta-next-step-readiness') ||
  !authSmoke.includes('publicBetaNextStepReadiness.body?.mode') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=public_beta_next_step_readiness')
) {
  fail('server.js and Admin UI must expose public_beta_next_step_readiness with a direct read-only endpoint, beta scope, URL smoke, invite approval, support triage, and no-share/no-invite/no-live boundaries');
}
if (
  !server.includes("function publicBetaNextStepExecutionChecklistItems()") ||
  !server.includes("app.get('/api/admin/public-beta-next-step-execution-checklist'") ||
  !server.includes('public_beta_next_step_execution_checklist') ||
  !server.includes('publicBetaNextStepExecutionChecklist') ||
  !server.includes('public_beta_scope_report_back_intake') ||
  !server.includes('public_beta_url_smoke_report_back_intake') ||
  !server.includes('public_beta_invite_request_hold') ||
  !server.includes('public_beta_support_triage_hold') ||
  !server.includes('PUBLIC_BETA_SCOPE_REPORT_BACK_REQUIRED') ||
  !server.includes('PUBLIC_BETA_URL_SMOKE_REPORT_BACK_REQUIRED') ||
  !server.includes('PUBLIC_BETA_INVITE_REQUEST_HELD') ||
  !server.includes('PUBLIC_BETA_SUPPORT_TRIAGE_HELD') ||
  !server.includes('PUBLIC_BETA_INVITE_DECISION_RECORDED') ||
  !server.includes('public_beta_execution_checklist_count') ||
  !server.includes('execution_phase_counts') ||
  !server.includes('review_area_counts') ||
  !server.includes('founder_report_field_count') ||
  !server.includes('linked_surfaces') ||
  !server.includes('real_public_url_storage') ||
  !server.includes('public_beta_launch') ||
  !server.includes('external_send') ||
  !server.includes('sensitive_data_collection') ||
  !server.includes('supabase_redirect_update') ||
  !server.includes('service_role_key_entry') ||
  !server.includes('live_supabase_write') ||
  !server.includes('xpr_signature') ||
  !server.includes('no_sensitive_data_collection_attempted: true') ||
  !server.includes('no_live_supabase_write_attempted: true') ||
  !server.includes('no_xpr_signature_attempted: true') ||
  !server.includes("'public-beta-next-step-execution-checklist'") ||
  !html.includes('Public Beta Next-Step Execution Checklist') ||
  !html.includes('Direct read-only endpoint: /api/admin/public-beta-next-step-execution-checklist') ||
  !html.includes('data.public_beta_next_step_execution_checklist') ||
  !html.includes("const publicBetaNextStepExecutionChecklistCount = (data.public_beta_next_step_execution_checklist || []).length") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('public_beta_next_step_execution_checklist')") ||
  !html.includes("setRequestTraceReportSourceSurface('public_beta_next_step_execution_checklist')") ||
  !authSmoke.includes('/api/admin/public-beta-next-step-execution-checklist') ||
  !authSmoke.includes('public-beta-next-step-execution-checklist') ||
  !authSmoke.includes('publicBetaNextStepExecutionChecklist.body?.mode') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=public_beta_next_step_execution_checklist')
) {
  fail('server.js and Admin UI must expose public_beta_next_step_execution_checklist with scope report-back, URL smoke report-back, invite hold, support triage hold, evidence export source, and no-launch/no-share/no-invite/no-live boundaries');
}
if (
  !server.includes('homepage_publication_sequence_gate') ||
  !server.includes('homepage_copy_direction_gate') ||
  !server.includes('homepage_publication_go_gate') ||
  !server.includes('homepage_public_file_replacement_gate') ||
  !server.includes('homepage_deploy_share_separation_gate') ||
  !server.includes('COPY_DIRECTION_REVIEW_ONLY') ||
  !server.includes('PUBLICATION_NO_GO') ||
  !server.includes('NO_PUBLIC_FILE_EDIT') ||
  !server.includes('DEPLOYMENT_AND_SHARE_SEPARATE') ||
  !server.includes('PUBLICATION_GO') ||
  !server.includes('DEPLOYMENT_EXTERNAL_ACTION_RECORDED') ||
  !server.includes('no_public_homepage_edit_attempted: true') ||
  !server.includes('no_public_whitepaper_edit_attempted: true') ||
  !server.includes('no_deploy_setting_change_attempted: true') ||
  !server.includes('no_public_url_share_attempted: true') ||
  !server.includes('no_live_action_attempted: true')
) {
  fail('server.js beta readiness must expose homepage_publication_sequence_gate separating copy review, PUBLICATION_GO, public file replacement, deploy setup, URL smoke, and invite/share gates');
}
if (
  !server.includes('homepage_publication_review_packet') ||
  !server.includes('Homepage publication review packet') ||
  !server.includes('LOCAL_REVIEW_ONLY') ||
  !server.includes('Construction trust infrastructure for verified project records') ||
  !server.includes('Standalone PUBLICATION_GO before any public index.html replacement') ||
  !server.includes('Metallicus/LOAN partnership approved') ||
  !server.includes('public_homepage_replacement') ||
  !server.includes('public_whitepaper_edit') ||
  !server.includes('no_public_homepage_edit_attempted: true') ||
  !server.includes('no_public_whitepaper_edit_attempted: true') ||
  !server.includes('no_deploy_setting_change_attempted: true') ||
  !server.includes('no_public_url_share_attempted: true') ||
  !server.includes('no_live_action_attempted: true')
) {
  fail('server.js beta readiness must expose homepage_publication_review_packet with founder decisions, safe public promise, blocked claims/actions, and no-public/no-deploy/no-live boundaries');
}
if (
  !server.includes('homepage_publication_founder_decision_script') ||
  !server.includes('homepagePublicationFounderDecisionScript') ||
  !server.includes('approve_traditional_first_homepage_direction') ||
  !server.includes('approve_hidden_future_infrastructure_language') ||
  !server.includes('accept_local_browser_qa_evidence') ||
  !server.includes('choose_public_asset_policy') ||
  !server.includes('keep_public_replacement_on_hold') ||
  !server.includes('standalone_publication_go') ||
  !server.includes('APPROVE_TRADITIONAL_FIRST_HOMEPAGE_DIRECTION') ||
  !server.includes('APPROVE_HIDDEN_FUTURE_INFRASTRUCTURE_LANGUAGE') ||
  !server.includes('ACCEPT_LOCAL_BROWSER_QA_EVIDENCE') ||
  !server.includes('REQUIRE_COMPILED_PUBLIC_CSS') ||
  !server.includes('KEEP_PUBLIC_REPLACEMENT_ON_HOLD') ||
  !server.includes('PUBLICATION_GO') ||
  !server.includes('Must be standalone and explicit') ||
  !server.includes('no_public_homepage_edit_attempted: true') ||
  !server.includes('no_public_whitepaper_edit_attempted: true') ||
  !server.includes('no_deploy_setting_change_attempted: true') ||
  !server.includes('no_public_url_share_attempted: true') ||
  !server.includes('no_live_action_attempted: true')
) {
  fail('server.js beta readiness must expose homepage_publication_founder_decision_script with exact founder phrases, allowed/not-allowed outcomes, and no-public/no-deploy/no-live boundaries');
}
if (
  !server.includes('homepage_publication_evidence_checklist') ||
  !server.includes('homepage_visual_qa_evidence') ||
  !server.includes('homepage_final_claim_risk_scan') ||
  !server.includes('homepage_integration_port_state_guard') ||
  !server.includes('homepage_first_viewport_evidence_rail_guard') ||
  !server.includes('homepage_browser_viewport_evidence_guard') ||
  !server.includes('homepage_external_asset_decision') ||
  !server.includes('homepage_archive_rollback_path') ||
  !server.includes('homepage_exact_file_replacement_diff') ||
  !server.includes('homepage_deploy_url_smoke_evidence') ||
  !server.includes('homepage_invite_share_separation') ||
  !server.includes('PASS_BROWSER_SESSION_LOCAL_ONLY') ||
  !server.includes('ASSET_PACKET_PREPARED_FOUNDER_PENDING') ||
  !server.includes('ROLLBACK_PACKET_PREPARED_FOUNDER_PENDING') ||
  !server.includes('DRY_RUN_DIFF_PREPARED_FINAL_APPROVAL_PENDING') ||
  !server.includes('PASS_STATIC_GUARD_LOCAL_ONLY') ||
  !server.includes('REVIEW_REQUIRED') ||
  !server.includes('BLOCKED_EXTERNAL_ACTION') ||
  !server.includes('BLOCKED_FOUNDER_DECISION') ||
  !server.includes('desktop screenshot evidence for index-v1-3-draft.html') ||
  !server.includes('integration_port_state_guard pass in /api/admin/homepage-publication-final-qa-preflight') ||
  !server.includes('Homepage Evidence Rail in index-v1-3-static-draft.html') ||
  !server.includes('first_viewport_product_signal_guard pass in /api/admin/homepage-publication-final-qa-preflight') ||
  !server.includes('desktop 1280 x 720 Browser evidence') ||
  !server.includes('mobile 390 x 844 Browser evidence') ||
  !server.includes('required_browser_viewports exposed by /api/admin/homepage-publication-final-qa-preflight') ||
  !server.includes('desktop_first_viewport_hero_fit: 1280 x 720') ||
  !server.includes('mobile_first_viewport_hero_fit: 390 x 844') ||
  !server.includes('browser_viewport_evidence_guard review row in /api/admin/homepage-publication-final-qa-preflight') ||
  !server.includes('current public index.html archive path') ||
  !server.includes('docs/smartcontractor-public-homepage-asset-decision-packet-2026-06-03.md') ||
  !server.includes('docs/smartcontractor-public-homepage-rollback-packet-2026-06-03.md') ||
  !server.includes('no_public_homepage_edit_attempted: true') ||
  !server.includes('no_deploy_setting_change_attempted: true') ||
  !server.includes('no_public_url_share_attempted: true') ||
  !server.includes('no_live_action_attempted: true')
) {
  fail('server.js beta readiness must expose homepage_publication_evidence_checklist with visual QA, claim scan, asset, rollback, exact diff, deploy smoke, invite/share evidence gates and no-live boundaries');
}
if (
  !server.includes('homepage_static_asset_candidate') ||
  !server.includes('homepageStaticAssetCandidate') ||
  !server.includes('Homepage static asset candidate') ||
  !server.includes('STATIC_CANDIDATE_READY_LOCAL_ONLY') ||
  !server.includes('index-v1-3-static-draft.html') ||
  !server.includes('check:homepage-v1-3-static-draft') ||
  !server.includes('docs/smartcontractor-public-homepage-static-asset-draft-2026-06-03.md') ||
  !server.includes('no_tailwind_cdn') ||
  !server.includes('no_google_fonts') ||
  !server.includes('no_external_asset_urls') ||
  !server.includes('390 x 844') ||
  !server.includes('clean Browser session before public replacement evidence') ||
  !server.includes('no_tester_invite_attempted: true') ||
  !server.includes('no_public_homepage_edit_attempted: true') ||
  !server.includes('no_public_whitepaper_edit_attempted: true') ||
  !server.includes('no_deploy_setting_change_attempted: true') ||
  !server.includes('no_public_url_share_attempted: true') ||
  !server.includes('no_live_action_attempted: true')
) {
  fail('server.js beta readiness must expose homepage_static_asset_candidate with static draft source, validator, browser evidence, asset posture, and blocked public/live boundaries');
}
if (
  !server.includes('homepage_publication_decision_summary') ||
  !server.includes('homepagePublicationDecisionSummary') ||
  !server.includes('Homepage publication decision summary') ||
  !server.includes('LOCAL_READY_PUBLICATION_BLOCKED') ||
  !server.includes('UNCHANGED_PUBLIC_INDEX_HTML') ||
  !server.includes('UNCHANGED_PUBLIC_WHITEPAPER_HTML') ||
  !server.includes('APPROVE_TRADITIONAL_FIRST_HOMEPAGE_DIRECTION') ||
  !server.includes('KEEP_PUBLIC_REPLACEMENT_ON_HOLD') ||
  !server.includes('standalone PUBLICATION_GO not provided') ||
  !server.includes('final exact public-file replacement diff not approved') ||
  !server.includes('Use the static candidate for local founder review') ||
  !server.includes('docs/smartcontractor-homepage-founder-ready-decision-summary-2026-06-03.md') ||
  !server.includes('public_beta_launch') ||
  !server.includes('no_tester_invite_attempted: true') ||
  !server.includes('no_public_homepage_edit_attempted: true') ||
  !server.includes('no_public_whitepaper_edit_attempted: true') ||
  !server.includes('no_deploy_setting_change_attempted: true') ||
  !server.includes('no_public_url_share_attempted: true') ||
  !server.includes('no_live_action_attempted: true')
) {
  fail('server.js beta readiness must expose homepage_publication_decision_summary with local-ready/public-blocked state, founder response phrases, blockers, and no-public/no-live boundaries');
}
if (
  !server.includes('homepage_publication_final_qa_hold') ||
  !server.includes('homepagePublicationFinalQaHold') ||
  !server.includes('Homepage final public QA hold') ||
  !server.includes('FINAL_QA_HOLD_LOCAL_ONLY') ||
  !server.includes('index-v1-3-static-draft.html') ||
  !server.includes("public_target_file: 'index.html'") ||
  !server.includes('publication_allowed: false') ||
  !server.includes('final public-file claim scan on index-v1-3-static-draft.html') ||
  !server.includes('clean Browser desktop/mobile screenshot evidence') ||
  !server.includes('link and CTA route check from the approved local candidate') ||
  !server.includes('archive and rollback hash check for current index.html') ||
  !server.includes('exact diff preview from current index.html to approved candidate') ||
  !server.includes('no_archive_execution_attempted: true') ||
  !server.includes('no_public_homepage_edit_attempted: true') ||
  !server.includes('no_public_whitepaper_edit_attempted: true') ||
  !server.includes('no_deploy_setting_change_attempted: true') ||
  !server.includes('no_public_url_share_attempted: true') ||
  !server.includes('no_tester_invite_attempted: true') ||
  !server.includes('no_live_action_attempted: true')
) {
  fail('server.js beta readiness must expose homepage_publication_final_qa_hold with exact candidate preflight, final QA blockers, publication_allowed false, and no-public/no-live boundaries');
}
if (
  !server.includes('whitepaper_v1_3_publication_gate') ||
  !server.includes('whitepaperV13PublicationGate') ||
  !server.includes('function whitepaperV13PublicationGateStatus()') ||
  !server.includes('const whitepaperV13PublicationGate = whitepaperV13PublicationGateStatus();') ||
  !server.includes("app.get('/api/admin/whitepaper-v1-3-publication-gate'") ||
  !server.includes('const gate = whitepaperV13PublicationGateStatus();') ||
  !server.includes("mode: 'whitepaper_v1_3_publication_gate'") ||
  !server.includes("request_path: '/api/admin/whitepaper-v1-3-publication-gate'") ||
  !server.includes("request_method: 'GET'") ||
  !server.includes('request_id_header: req.id || null') ||
  !server.includes('Whitepaper v1.3 publication gate') ||
  !server.includes("gate_state: 'NO_GO'") ||
  !server.includes('publication_allowed: false') ||
  !server.includes('Default state: NO-GO') ||
  !server.includes('founder publication approval is not recorded') ||
  !server.includes('whitepaper_html_replacement') ||
  !server.includes('index_html_replacement') ||
  !server.includes('pdf_publication') ||
  !server.includes('partner_packet_send') ||
  !server.includes('email_announcement') ||
  !server.includes('social_announcement') ||
  !server.includes('fio_integration_announcement') ||
  !server.includes('metallicus_partnership_announcement') ||
  !server.includes('docs/whitepaper-v1-3-publication-gate.md') ||
  !server.includes('no_publication_attempted: true') ||
  !server.includes('no_archive_execution_attempted: true') ||
  !server.includes('no_external_send_attempted: true') ||
  !server.includes('no_provider_outreach_attempted: true') ||
  !server.includes('no_xpr_signature_attempted: true') ||
  !server.includes('no_fio_registration_attempted: true') ||
  !server.includes('no_live_action_attempted: true')
) {
  fail('server.js beta readiness and direct read-only endpoint must expose whitepaper_v1_3_publication_gate with request trace metadata, NO-GO publication state, blocked public/send/Web3 actions, and no-public/no-live boundaries');
}
if (
  !html.includes('const whitepaperV13PublicationGate = data.whitepaper_v1_3_publication_gate || {}') ||
  !html.includes("const whitepaperV13PublicationGateState = whitepaperV13PublicationGate.gate_state || 'missing'") ||
  !html.includes("['Whitepaper v1.3 gate', whitepaperV13PublicationGateState]") ||
  !html.includes('<h3>Whitepaper v1.3 Publication Gate</h3>') ||
  !html.includes('Publication allowed: ${escapeHtml(whitepaperV13PublicationGate.publication_allowed ?? false)}') ||
  !html.includes('Required before review: ${escapeHtml((whitepaperV13PublicationGate.required_before_review || []).join') ||
  !html.includes('Required before GO: ${escapeHtml((whitepaperV13PublicationGate.required_before_go || []).join') ||
  !html.includes('Blocked public actions: ${escapeHtml((whitepaperV13PublicationGate.blocked_public_actions || []).join') ||
  !html.includes('Direct read-only endpoint: /api/admin/whitepaper-v1-3-publication-gate') ||
  !html.includes('Open whitepaper gate evidence export source') ||
  !html.includes('Select whitepaper gate in Request Trace')
) {
  fail('Controlled Beta Readiness UI must show whitepaper_v1_3_publication_gate with NO-GO state, publication_allowed false, blockers, direct endpoint, export shortcut, and Request Trace shortcut');
}
if (
  !server.includes("app.get('/api/admin/homepage-publication-final-qa-preflight'") ||
  !server.includes('homepage_publication_final_qa_preflight') ||
  !server.includes('LOCAL_PREFLIGHT_READY_PUBLICATION_BLOCKED') ||
  !server.includes('candidate_file_present') ||
  !server.includes('first_viewport_product_signal_guard') ||
  !server.includes('product_section_order_guard') ||
  !server.includes('integration_port_state_guard') ||
  !server.includes('blocked_public_claim_scan') ||
  !server.includes('external_asset_scan') ||
  !server.includes('section_anchor_scan') ||
  !server.includes('local_link_cta_scan') ||
  !server.includes('static_visual_style_guard') ||
  !server.includes('browser_viewport_evidence_guard') ||
  !server.includes('public_file_hash_snapshot') ||
  !server.includes('publication_permission_gate') ||
  !server.includes('blocked_claims_found') ||
  !server.includes('external_asset_urls') ||
  !server.includes('missing_first_viewport_signals') ||
  !server.includes('required_first_viewport_signals') ||
  !server.includes('missing_product_section_signals') ||
  !server.includes('required_product_section_signals') ||
  !server.includes('missing_integration_port_signals') ||
  !server.includes('required_integration_port_signals') ||
  !server.includes('SmartContractor by GCSC') ||
  !server.includes('homepage_evidence_rail') ||
  !server.includes('Project intake') ||
  !server.includes('Milestone evidence') ||
  !server.includes('Dispute packet') ||
  !server.includes('Provider review data') ||
  !server.includes('Traditional Product Review Order') ||
  !server.includes('Integration Readiness Ports') ||
  !server.includes('visual_style_findings') ||
  !server.includes('missing_visual_tokens') ||
  !server.includes('required_visual_tokens') ||
  !server.includes('required_browser_viewports') ||
  !server.includes('desktop_first_viewport_hero_fit') ||
  !server.includes('mobile_first_viewport_hero_fit') ||
  !server.includes('1280 x 720') ||
  !server.includes('390 x 844') ||
  !server.includes('decorative_hero_radial_glow') ||
  !server.includes('viewport_scaled_type') ||
  !server.includes('required_next_evidence') ||
  !server.includes('publication_allowed: false') ||
  !server.includes('no_archive_execution_attempted: true') ||
  !server.includes('no_live_action_attempted: true')
) {
  fail('server.js must expose /api/admin/homepage-publication-final-qa-preflight with local candidate scans, public-file hashes, publication_allowed false, and no-live boundaries');
}
if (
  !server.includes("app.post('/api/admin/beta-readiness/public-copy/validate'") ||
  !server.includes('local_beta_traditional_first_public_copy_validation') ||
  !server.includes('traditional_first_public_copy_validation') ||
  !server.includes('safe_traditional_first_public_copy') ||
  !server.includes('public_copy_missing') ||
  !server.includes('public_copy_blocked_for_redaction') ||
  !server.includes('public_copy_required_fields_missing') ||
  !server.includes('scanTraditionalFirstPublicCopyText') ||
  !server.includes('traditional_first_public_copy_gate') ||
  !server.includes('web3_or_token_public_claim') ||
  !server.includes('live_finance_provider_or_legal_claim') ||
  !server.includes('no_public_copy_storage: true') ||
  !server.includes('no_public_website_edit_attempted: true') ||
  !server.includes('no_external_provider_claim_attempted: true') ||
  !server.includes('no_public_beta_flip_attempted: true') ||
  !server.includes('no_live_action_attempted: true')
) {
  fail('server.js must expose local traditional-first public copy validation with no-storage/no-public-edit/no-provider-claim/no-live boundaries');
}
if (
  !server.includes("app.post('/api/admin/beta-readiness/homepage-publication-decision/validate'") ||
  !server.includes('local_beta_homepage_publication_decision_validation') ||
  !server.includes('homepage_publication_decision_validation') ||
  !server.includes('safe_local_homepage_decision_hold') ||
  !server.includes('homepage_publication_go_detected_review_only') ||
  !server.includes('homepage_decision_blocked_for_redaction') ||
  !server.includes('homepage_decision_recommended_phrases_missing') ||
  !server.includes('scanHomepagePublicationDecisionText') ||
  !server.includes('homepagePublicationDecisionRecommendedPhrases') ||
  !server.includes('APPROVE_TRADITIONAL_FIRST_HOMEPAGE_DIRECTION') ||
  !server.includes('KEEP_PUBLIC_REPLACEMENT_ON_HOLD') ||
  !server.includes('PUBLICATION_GO') ||
  !server.includes('homepage_publication_decision_gate') ||
  !server.includes('publication_go_detected') ||
  !server.includes('no_decision_text_storage: true') ||
  !server.includes('no_public_replacement_attempted: true') ||
  !server.includes('no_deploy_attempted: true') ||
  !server.includes('no_url_share_attempted: true') ||
  !server.includes('no_tester_invite_attempted: true') ||
  !server.includes('no_live_action_attempted: true')
) {
  fail('server.js must expose local homepage publication decision validation with phrase checks, PUBLICATION_GO review-only handling, and no-storage/no-public/no-deploy/no-share/no-live boundaries');
}
if (
  !server.includes("app.post('/api/admin/beta-readiness/finance-contract-quickstart/acknowledgement/validate'") ||
  !server.includes('local_beta_finance_contract_quickstart_acknowledgement_validation') ||
  !server.includes('tester_finance_contract_quickstart_acknowledgement_validation') ||
  !server.includes('safe_local_quickstart_acknowledgement') ||
  !server.includes('quickstart_acknowledgement_missing') ||
  !server.includes('quickstart_acknowledgement_blocked_for_redaction') ||
  !server.includes('quickstart_acknowledgement_required_fields_missing') ||
  !server.includes('FINANCE_CONTRACT_TESTER_QUICKSTART') ||
  !server.includes('quickstart_acknowledgement_gate') ||
  !server.includes('no_acknowledgement_storage: true') ||
  !server.includes('no_server_storage_attempted: true') ||
  !server.includes('no_external_followup_attempted: true') ||
  !server.includes('no_public_beta_flip_attempted: true') ||
  !server.includes('no_live_action_attempted: true')
) {
  fail('server.js must expose local beta finance/contract quickstart acknowledgement validation with no-storage/no-external-followup/no-live-action boundaries');
}
if (
  !server.includes('tester_finance_contract_walkthrough_gate') ||
  !server.includes('quickstart_acknowledgement_gate') ||
  !server.includes('walkthrough_stop_gate') ||
  !server.includes('debrief_handoff_gate') ||
  !server.includes('REQUIRED_BEFORE_WALKTHROUGH') ||
  !server.includes('STOP_ON_LIVE_CONFUSION') ||
  !server.includes('REQUIRED_AFTER_WALKTHROUGH') ||
  !server.includes('/api/admin/beta-readiness/finance-contract-quickstart/acknowledgement/validate') ||
  !server.includes('/api/admin/beta-readiness/finance-contract-walkthrough/live-confusion/validate') ||
  !server.includes('/api/admin/beta-readiness/finance-contract-walkthrough/debrief/validate') ||
  !server.includes('FINANCE_CONTRACT_TESTER_QUICKSTART acknowledgement') ||
  !server.includes('LIVE_CONFUSION_REVIEW_ONLY note or SAFE_REVIEWER_NOTE') ||
  !server.includes('SAFE_DEBRIEF_NOTE') ||
  !server.includes('no_server_storage_attempted: true') ||
  !server.includes('no_external_followup_attempted: true') ||
  !server.includes('no_public_beta_flip_attempted: true') ||
  !server.includes('no_live_action_attempted: true')
) {
  fail('server.js beta readiness must expose tester_finance_contract_walkthrough_gate with before/during/after local-only finance/contract gates and no-live boundaries');
}
if (
  !server.includes('tester_finance_contract_walkthrough_script') ||
  !server.includes('Finance/contract walkthrough opening') ||
  !server.includes('Payment router checkpoint') ||
  !server.includes('Starter-loan checkpoint') ||
  !server.includes('Milestone/escrow checkpoint') ||
  !server.includes('Smart contract review checkpoint') ||
  !server.includes('Stop if tester expects real money or binding contract action')
) {
  fail('server.js beta readiness must expose tester_finance_contract_walkthrough_script with finance/contract tester prompts and stop gates');
}
if (
  !server.includes('tester_finance_contract_walkthrough_triage_matrix') ||
  !server.includes('Real-money expectation triage') ||
  !server.includes('Sensitive data entry triage') ||
  !server.includes('Binding contract expectation triage') ||
  !server.includes('Escrow or refund expectation triage') ||
  !server.includes('Smart contract live-action expectation triage') ||
  !server.includes('SAFE_CONFUSION_NOTE')
) {
  fail('server.js beta readiness must expose tester_finance_contract_walkthrough_triage_matrix with safe tester confusion routing');
}
if (
  !server.includes('tester_finance_contract_walkthrough_debrief_packet') ||
  !server.includes('Finance/contract debrief summary') ||
  !server.includes('Boundary clarity rating') ||
  !server.includes('Confusion triage summary') ||
  !server.includes('Safe issue handoff') ||
  !server.includes('Founder review hold') ||
  !server.includes('SAFE_DEBRIEF_NOTE')
) {
  fail('server.js beta readiness must expose tester_finance_contract_walkthrough_debrief_packet with safe post-walkthrough reporting fields');
}
if (
  !server.includes('tester_finance_contract_reviewer_notes') ||
  !server.includes('reviewer_demo_boundary_prompt') ||
  !server.includes('reviewer_must_capture_request_id') ||
  !server.includes('reviewer_stop_before_live_action') ||
  !server.includes('SAFE_REVIEWER_NOTE')
) {
  fail('server.js beta readiness must expose tester_finance_contract_reviewer_notes with safe reviewer prompts and request-id capture');
}
if (
  !server.includes('tester_finance_contract_live_confusion_safety_pack') ||
  !server.includes('live_confusion_preflight_check') ||
  !server.includes('live_confusion_stop_script') ||
  !server.includes('live_confusion_safe_issue_handoff') ||
  !server.includes('LIVE_CONFUSION_REVIEW_ONLY') ||
  !server.includes('no_public_beta_flip') ||
  !server.includes('no_external_followup')
) {
  fail('server.js beta readiness must expose tester_finance_contract_live_confusion_safety_pack with local-only preflight, stop script, and safe issue handoff');
}
if (
  !server.includes('tester_finance_contract_session_safety_checklist') ||
  !server.includes('session_safety_preflight') ||
  !server.includes('session_safety_during_walkthrough') ||
  !server.includes('session_safety_handoff') ||
  !server.includes('FINANCE_CONTRACT_SESSION_SAFETY') ||
  !server.includes('required_safe_evidence') ||
  !server.includes('stop_if') ||
  !server.includes('no_server_storage_attempted: true') ||
  !server.includes('no_external_followup_attempted: true') ||
  !server.includes('no_public_beta_flip_attempted: true') ||
  !server.includes('no_live_action_attempted: true')
) {
  fail('server.js beta readiness must expose tester_finance_contract_session_safety_checklist with preflight/during/handoff steps and no-live/no-storage boundaries');
}
if (
  !server.includes('tester_finance_contract_safe_handoff_summary') ||
  !server.includes('finance_contract_safe_handoff_summary') ||
  !server.includes('FINANCE_CONTRACT_SAFE_HANDOFF_SUMMARY') ||
  !server.includes('metadata_only_history_sources') ||
  !server.includes('beta_finance_contract_session_safety_validation_history') ||
  !server.includes('beta_finance_contract_live_confusion_validation_history') ||
  !server.includes('beta_finance_contract_reviewer_note_validation_history') ||
  !server.includes('beta_finance_contract_safe_handoff_report_history') ||
  !server.includes('/api/admin/admin-evidence-export-preview?source_filter=beta_finance_contract_session_safety_validation_history') ||
  !server.includes('/api/admin/admin-evidence-export-preview?source_filter=beta_finance_contract_live_confusion_validation_history') ||
  !server.includes('/api/admin/admin-evidence-export-preview?source_filter=beta_finance_contract_reviewer_note_validation_history') ||
  !server.includes('/api/admin/admin-evidence-export-preview?source_filter=beta_finance_contract_safe_handoff_report_history') ||
  !server.includes('no_external_export_attempted: true') ||
  !server.includes('stablecoin_settlement') ||
  !server.includes('token_collateral_lock')
) {
  fail('server.js beta readiness must expose tester_finance_contract_safe_handoff_summary linking validation/export sources with no-live/no-storage/no-external-export boundaries');
}
if (
  !server.includes("app.post('/api/admin/beta-readiness/finance-contract-walkthrough/session-safety/validate'") ||
  !server.includes('local_beta_finance_contract_session_safety_validation') ||
  !server.includes('tester_finance_contract_session_safety_validation') ||
  !server.includes('safe_local_session_safety_review') ||
  !server.includes('session_safety_note_missing') ||
  !server.includes('session_safety_blocked_for_redaction') ||
  !server.includes('session_safety_required_fields_missing') ||
  !server.includes('FINANCE_CONTRACT_SESSION_SAFETY') ||
  !server.includes('session_safety_validation_gate') ||
  !server.includes('no_session_safety_note_storage: true') ||
  !server.includes('no_external_followup_attempted: true') ||
  !server.includes('no_public_beta_flip: true') ||
  !server.includes('no_live_action_attempted: true')
) {
  fail('server.js must expose local beta finance/contract session-safety validation with no-storage/no-external-followup/no-public-beta/no-live boundaries');
}
if (
  !server.includes("app.post('/api/admin/beta-readiness/finance-contract-walkthrough/live-confusion/validate'") ||
  !server.includes('local_beta_finance_contract_live_confusion_validation') ||
  !server.includes('tester_finance_contract_live_confusion_validation') ||
  !server.includes('safe_local_live_confusion_review') ||
  !server.includes('live_confusion_note_missing') ||
  !server.includes('live_confusion_blocked_for_redaction') ||
  !server.includes('live_confusion_required_fields_missing') ||
  !server.includes('LIVE_CONFUSION_REVIEW_ONLY') ||
  !server.includes('no_live_confusion_note_storage: true') ||
  !server.includes('no_public_beta_flip: true') ||
  !server.includes('no_external_followup: true')
) {
  fail('server.js must expose local beta finance/contract live-confusion validation with no-storage/no-public-beta/no-external-followup boundaries');
}
if (
  !server.includes("app.post('/api/admin/beta-readiness/finance-contract-walkthrough/reviewer-note/validate'") ||
  !server.includes('local_beta_finance_contract_reviewer_note_validation') ||
  !server.includes('tester_finance_contract_reviewer_note_validation') ||
  !server.includes('safe_local_reviewer_note') ||
  !server.includes('reviewer_note_missing') ||
  !server.includes('reviewer_note_blocked_for_redaction') ||
  !server.includes('reviewer_note_required_fields_missing') ||
  !server.includes('SAFE_REVIEWER_NOTE') ||
  !server.includes('no_reviewer_note_storage: true') ||
  !server.includes('no_server_storage_attempted: true') ||
  !server.includes('no_live_action_attempted: true')
) {
  fail('server.js must expose local beta finance/contract reviewer note validation with no-storage/no-live-action boundaries');
}
if (
  !server.includes("app.post('/api/admin/beta-readiness/finance-contract-walkthrough/debrief/validate'") ||
  !server.includes('local_beta_finance_contract_debrief_validation') ||
  !server.includes('tester_finance_contract_debrief_draft_validation') ||
  !server.includes('blocked_for_redaction') ||
  !server.includes('safe_local_debrief_review') ||
  !server.includes('input_limit_exceeded') ||
  !server.includes('draft_text_max_4000_exceeded') ||
  !server.includes('input_limits') ||
  !server.includes('input_limit_warnings') ||
  !server.includes('debrief_draft_recovery_actions') ||
  !server.includes('SAFE_DEBRIEF_NOTE') ||
  !server.includes('no_server_storage: true') ||
  !server.includes('no_server_storage_attempted: true') ||
  !server.includes('no_live_action_attempted: true') ||
  !server.includes('payment_charge') ||
  !server.includes('loan_approval') ||
  !server.includes('escrow_release') ||
  !server.includes('signed_contract_creation') ||
  !server.includes('xpr_signature') ||
  !server.includes('provider_commitment') ||
  !server.includes('legal_decision') ||
  !server.includes('public_beta_flip') ||
  !server.includes('production_release')
) {
  fail('server.js must expose local beta finance/contract debrief draft validation with no-storage/no-live-action boundaries and blocked live actions');
}
if (
  !server.includes('founder_live_blocker_handoff_pack') ||
  !server.includes('function founderLiveBlockerHandoffPackStatus()') ||
  !server.includes('const founderLiveBlockerHandoffPack = founderLiveBlockerHandoffPackStatus();') ||
  !server.includes("app.get('/api/admin/founder-live-blocker-handoff-pack'") ||
  !server.includes("mode: 'founder_live_blocker_handoff_pack'") ||
  !server.includes("request_path: '/api/admin/founder-live-blocker-handoff-pack'") ||
  !server.includes("request_method: 'GET'") ||
  !server.includes('handoff_pack: handoffPack') ||
  !server.includes('Auth/Admin blocker') ||
  !server.includes('Deploy blocker') ||
  !server.includes('Contract review next step') ||
  !server.includes('Beta invite blocker')
) {
  fail('server.js beta readiness and direct read-only endpoint must expose founder_live_blocker_handoff_pack for founder blockers, contract review next steps, request trace metadata, and no-live boundaries');
}
if (
  !server.includes('founder_evening_action_summary') ||
  !server.includes('Magic Link login') ||
  !server.includes('Profile/admin membership') ||
  !server.includes('Contract review') ||
  !server.includes('Public beta invite') ||
  !server.includes('Homepage publication') ||
  !server.includes('No live action approval')
) {
  fail('server.js beta readiness must expose founder_evening_action_summary with copyable founder next actions and no-live boundary');
}
if (
  !server.includes('founder_evening_decision_matrix') ||
  !server.includes('Auth/Admin decision') ||
  !server.includes('Deploy/public URL decision') ||
  !server.includes('Homepage publication decision') ||
  !server.includes('Contract review decision') ||
  !server.includes('Public beta invite decision') ||
  !server.includes('Legal/provider decision') ||
  !server.includes('No live action approval')
) {
  fail('server.js beta readiness must expose founder_evening_decision_matrix with founder decision gates and no-live boundary');
}
if (
  !server.includes('founder_evening_command_board') ||
  !server.includes('Founder evening command board') ||
  !server.includes('Step 1 Auth/Admin evidence intake') ||
  !server.includes('Step 2 Contract review scan') ||
  !server.includes('Step 3 Deploy/public URL smoke intake') ||
  !server.includes('Step 4 Public beta invite hold/review') ||
  !server.includes('Step 5 Legal/provider question prep') ||
  !server.includes('Step 6 Homepage publication sequence review') ||
  !server.includes('HOLD_FOR_PUBLICATION_GO') ||
  !server.includes('No live command execution')
) {
  fail('server.js beta readiness must expose founder_evening_command_board with ordered founder evening commands and no-live boundary');
}
if (
  !server.includes('founder_handoff_today') ||
  !server.includes('function founderHandoffTodayItems()') ||
  !server.includes('founderHandoffToday') ||
  !server.includes("app.get('/api/admin/founder-handoff-today'") ||
  !server.includes("mode: 'founder_handoff_today'") ||
  !server.includes("status: 'LOCAL_HANDOFF_ONLY'") ||
  !server.includes("request_path: '/api/admin/founder-handoff-today'") ||
  !server.includes("request_method: 'GET'") ||
  !server.includes('request_id_header: req.id || null') ||
  !server.includes('handoff_item_count') ||
  !server.includes('handoff_state_counts') ||
  !server.includes('required_report_field_count') ||
  !server.includes('auth_admin_live_blocker') ||
  !server.includes('deployment_public_url_blocker') ||
  !server.includes('homepage_publication_blocker') ||
  !server.includes('contract_review_next_step') ||
  !server.includes('legal_provider_finance_blocker') ||
  !server.includes('FOUNDER_EVIDENCE_REQUIRED') ||
  !server.includes('FOUNDER_ACCOUNT_REQUIRED') ||
  !server.includes('PUBLICATION_GO_REQUIRED') ||
  !server.includes('GO_LOCAL_REVIEW_ONLY') ||
  !server.includes('BLOCKED_FOR_EXTERNAL_REVIEW') ||
  !server.includes('no_live_supabase_write_attempted: true') ||
  !server.includes('no_public_file_edit_attempted: true') ||
  !server.includes('no_live_finance_action_attempted: true') ||
  !server.includes('no_legal_provider_decision_attempted: true') ||
  !server.includes('no_production_release_attempted: true')
) {
  fail('server.js beta readiness must expose founder_handoff_today with Auth/Admin, deploy, homepage, contract, legal/provider blockers and no-live boundaries');
}
if (
  !server.includes('week_one_closeout_handoff') ||
  !server.includes('function weekOneCloseoutHandoffItems()') ||
  !server.includes('weekOneCloseoutHandoff') ||
  !server.includes("app.get('/api/admin/week-one-closeout-handoff'") ||
  !server.includes("mode: 'week_one_closeout_handoff'") ||
  !server.includes("status: 'LOCAL_CLOSEOUT_HANDOFF_ONLY'") ||
  !server.includes("request_path: '/api/admin/week-one-closeout-handoff'") ||
  !server.includes("request_method: 'GET'") ||
  !server.includes('request_id_header: req.id || null') ||
  !server.includes('closeout_item_count') ||
  !server.includes('closeout_state_counts') ||
  !server.includes('completed_evidence_count') ||
  !server.includes('required_report_field_count') ||
  !server.includes('week_one_completed_local_surfaces') ||
  !server.includes('week_two_auth_admin_start') ||
  !server.includes('week_two_deploy_public_beta_hold') ||
  !server.includes('week_two_legal_provider_review') ||
  !server.includes('PASS_LOCAL_ONLY') ||
  !server.includes('FOUNDER_EVIDENCE_REQUIRED') ||
  !server.includes('FOUNDER_ACCOUNT_REQUIRED') ||
  !server.includes('BLOCKED_FOR_EXTERNAL_REVIEW') ||
  !server.includes('no_deploy_setting_change_attempted: true') ||
  !server.includes('no_live_action_attempted: true')
) {
  fail('server.js beta readiness must expose week_one_closeout_handoff with Week 1 closeout, Week 2 handoff gates, and no-live boundaries');
}
if (
  !server.includes('investor_founder_package_readiness') ||
  !server.includes('investorFounderPackageReadiness') ||
  !server.includes('investor_package_internal_snapshot') ||
  !server.includes('investor_package_evidence_freshness') ||
  !server.includes('investor_package_claim_review_gate') ||
  !server.includes('investor_package_send_approval_stop') ||
  !server.includes('INTERNAL_PACKAGE_ONLY') ||
  !server.includes('REFRESH_BEFORE_EXTERNAL_USE') ||
  !server.includes('HOLD_FOR_CLAIM_REVIEW') ||
  !server.includes('EXTERNAL_SEND_BLOCKED') ||
  !server.includes('INVESTOR_PACKET_SEND_ACTION_RECORDED') ||
  !server.includes('no_external_send_attempted: true') ||
  !server.includes('no_public_file_edit_attempted: true') ||
  !server.includes('no_live_finance_action_attempted: true') ||
  !server.includes('no_legal_provider_decision_attempted: true') ||
  !server.includes('no_live_action_attempted: true')
) {
  fail('server.js beta readiness must expose investor_founder_package_readiness with internal package, freshness, claim review, send-stop gates, and no-live boundaries');
}
if (
  !server.includes("function weekTwoInvestorFounderPackageAlignmentItems()") ||
  !server.includes("app.get('/api/admin/week-two-investor-founder-package-alignment'") ||
  !server.includes('week_two_investor_founder_package_alignment') ||
  !server.includes('weekTwoInvestorFounderPackageAlignment') ||
  !server.includes('week_two_investor_live_finance_claim_alignment') ||
  !server.includes('week_two_investor_escrow_token_claim_alignment') ||
  !server.includes('week_two_investor_ai_authority_claim_alignment') ||
  !server.includes('week_two_investor_external_send_stop_gate') ||
  !server.includes('LIVE_FINANCE_CLAIMS_REVIEW_REQUIRED') ||
  !server.includes('ESCROW_TOKEN_CLAIMS_REVIEW_REQUIRED') ||
  !server.includes('AI_AUTHORITY_CLAIMS_REVIEW_REQUIRED') ||
  !server.includes('EXTERNAL_SEND_APPROVAL_BLOCKED') ||
  !server.includes('alignment_area_counts') ||
  !server.includes('alignment_state_counts') ||
  !server.includes('founder_report_field_count') ||
  !server.includes('linked_surfaces') ||
  !server.includes('live_finance_claim') ||
  !server.includes('fio_registration') ||
  !server.includes('metallicus_partnership_claim') ||
  !server.includes('ai_credit_approval_claim') ||
  !server.includes('no_investor_outreach_attempted: true') ||
  !server.includes('no_grant_submission_attempted: true') ||
  !server.includes('no_provider_outreach_attempted: true') ||
  !server.includes('no_publication_attempted: true') ||
  !server.includes('no_fio_registration_attempted: true') ||
  !server.includes("'week-two-investor-founder-package-alignment'") ||
  !html.includes('Week 2 Investor/Founder Package Alignment') ||
  !html.includes('Direct read-only endpoint: /api/admin/week-two-investor-founder-package-alignment') ||
  !html.includes('data.week_two_investor_founder_package_alignment') ||
  !authSmoke.includes('/api/admin/week-two-investor-founder-package-alignment') ||
  !authSmoke.includes('week-two-investor-founder-package-alignment') ||
  !authSmoke.includes('weekTwoInvestorFounderPackageAlignment.body?.mode') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_investor_founder_package_alignment')
) {
  fail('server.js and Admin UI must expose week_two_investor_founder_package_alignment with live-finance, escrow/token, AI-authority, external-send gates, direct endpoint, evidence export source, and no-outreach/no-publication/no-finance/no-XPR/FIO/no-live boundaries');
}
if (
  !server.includes("function weekTwoInvestorFounderPackageExecutionChecklistItems()") ||
  !server.includes("app.get('/api/admin/week-two-investor-founder-package-execution-checklist'") ||
  !server.includes('week_two_investor_founder_package_execution_checklist') ||
  !server.includes('weekTwoInvestorFounderPackageExecutionChecklist') ||
  !server.includes('week_two_investor_packet_review_report_back_intake') ||
  !server.includes('week_two_investor_claim_correction_hold') ||
  !server.includes('week_two_investor_external_send_request_hold') ||
  !server.includes('week_two_investor_followup_response_hold') ||
  !server.includes('INVESTOR_PACKET_REVIEW_REPORT_BACK_REQUIRED') ||
  !server.includes('INVESTOR_CLAIM_CORRECTION_HELD') ||
  !server.includes('INVESTOR_EXTERNAL_SEND_REQUEST_HELD') ||
  !server.includes('INVESTOR_FOLLOWUP_RESPONSE_HELD') ||
  !server.includes('execution_phase_counts') ||
  !server.includes('review_area_counts') ||
  !server.includes('investor_founder_package_execution_checklist_count') ||
  !server.includes('no_recipient_contact_data_requested: true') ||
  !server.includes('recipient_data_collection') ||
  !server.includes('INVESTOR_PACKET_SEND_ACTION_RECORDED') ||
  !server.includes("'week-two-investor-founder-package-execution-checklist'") ||
  !html.includes('Week 2 Investor/Founder Package Execution Checklist') ||
  !html.includes('Direct read-only endpoint: /api/admin/week-two-investor-founder-package-execution-checklist') ||
  !html.includes('data.week_two_investor_founder_package_execution_checklist') ||
  !authSmoke.includes('/api/admin/week-two-investor-founder-package-execution-checklist') ||
  !authSmoke.includes('week-two-investor-founder-package-execution-checklist') ||
  !authSmoke.includes('weekTwoInvestorFounderPackageExecutionChecklist.body?.mode') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_investor_founder_package_execution_checklist')
) {
  fail('server.js and Admin UI must expose week_two_investor_founder_package_execution_checklist with packet-review, claim-correction, external-send, follow-up holds and blocked outreach/publication/finance/token/AI/legal/provider/live boundaries');
}
if (
  !server.includes('function paymentIntentOwnershipReadinessItems()') ||
  !server.includes("app.get('/api/admin/payment-intent-ownership-readiness'") ||
  !server.includes('payment_intent_ownership_readiness') ||
  !server.includes('paymentIntentOwnershipReadiness') ||
  !server.includes('payment_intent_ownership_sql_draft_review') ||
  !server.includes('payment_intent_participant_mapping_review') ||
  !server.includes('payment_intent_backend_write_boundary') ||
  !server.includes('payment_intent_live_rls_stop_gate') ||
  !server.includes('SQL_DRAFT_VALIDATED_LOCAL_ONLY') ||
  !server.includes('LIVE_RLS_APPLY_BLOCKED_FOR_FOUNDER') ||
  !server.includes('payment_intents_sql_apply') ||
  !server.includes('no_payment_sql_apply_attempted: true') ||
  !server.includes('no_payment_provider_activation_attempted: true') ||
  !server.includes('no_real_payment_attempted: true') ||
  !server.includes("'payment-intent-ownership-readiness'") ||
  !html.includes('<option value="payment_intent_ownership_readiness">Payment intent ownership readiness</option>') ||
  !html.includes('Payment Intent Ownership Readiness') ||
  !html.includes('Direct read-only endpoint: /api/admin/payment-intent-ownership-readiness') ||
  !html.includes('data.payment_intent_ownership_readiness') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('payment_intent_ownership_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('payment_intent_ownership_readiness')") ||
  !html.includes("payment_intent_ownership_readiness: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('payment_intent_ownership_readiness')") ||
  !authSmoke.includes('/api/admin/payment-intent-ownership-readiness') ||
  !authSmoke.includes('paymentIntentOwnershipReadiness.body?.mode') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=payment_intent_ownership_readiness') ||
  !authSmoke.includes('gcsc-admin-evidence-export-preview-payment-intent-ownership-readiness-smoke')
) {
  fail('server.js and Admin UI must expose payment_intent_ownership_readiness with typed payment_intents ownership SQL draft review, participant mapping, backend-write boundary, live RLS stop gate, evidence export source, Request Trace prefill, and no-SQL/no-payment/no-XPR/no-live boundaries');
}
if (
  !server.includes("function weekTwoLocalValidationPassReadinessItems()") ||
  !server.includes("app.get('/api/admin/week-two-local-validation-pass-readiness'") ||
  !server.includes('week_two_local_validation_pass_readiness') ||
  !server.includes('weekTwoLocalValidationPassReadiness') ||
  !server.includes('week_two_validation_targeted_checks_queue') ||
  !server.includes('week_two_validation_public_file_guard') ||
  !server.includes('week_two_validation_evidence_report_back') ||
  !server.includes('week_two_validation_failure_triage_hold') ||
  !server.includes('TARGETED_VALIDATION_QUEUE_READY') ||
  !server.includes('PUBLIC_FILE_GUARD_REQUIRED') ||
  !server.includes('VALIDATION_EVIDENCE_REPORT_BACK_REQUIRED') ||
  !server.includes('FAILED_CHECK_TRIAGE_HELD') ||
  !server.includes('validation_phase_counts') ||
  !server.includes('required_command_count') ||
  !server.includes('no_strict_rls_apply_attempted: true') ||
  !server.includes('no_destructive_git_action_attempted: true') ||
  !server.includes('public_whitepaper_html_replacement') ||
  !server.includes("'week-two-local-validation-pass-readiness'") ||
  !html.includes('Week 2 Local Validation Pass Readiness') ||
  !html.includes('Direct read-only endpoint: /api/admin/week-two-local-validation-pass-readiness') ||
  !html.includes('data.week_two_local_validation_pass_readiness') ||
  !authSmoke.includes('/api/admin/week-two-local-validation-pass-readiness') ||
  !authSmoke.includes('week-two-local-validation-pass-readiness') ||
  !authSmoke.includes('weekTwoLocalValidationPassReadiness.body?.mode') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_local_validation_pass_readiness')
) {
  fail('server.js and Admin UI must expose week_two_local_validation_pass_readiness with targeted-check, public-file guard, evidence report-back, failed-check triage, and no-live/no-public/no-destructive boundaries');
}
if (
  !server.includes("function weekTwoLocalValidationPassExecutionChecklistItems()") ||
  !server.includes("app.get('/api/admin/week-two-local-validation-pass-execution-checklist'") ||
  !server.includes('week_two_local_validation_pass_execution_checklist') ||
  !server.includes('weekTwoLocalValidationPassExecutionChecklist') ||
  !server.includes('week_two_validation_command_run_order_hold') ||
  !server.includes('week_two_validation_public_file_diff_hold') ||
  !server.includes('week_two_validation_failure_rerun_hold') ||
  !server.includes('week_two_validation_commit_report_hold') ||
  !server.includes('VALIDATION_COMMAND_RUN_ORDER_HELD') ||
  !server.includes('PUBLIC_FILE_DIFF_HELD') ||
  !server.includes('FAILED_VALIDATION_RERUN_HELD') ||
  !server.includes('VALIDATION_COMMIT_REPORT_HELD') ||
  !server.includes('validation_execution_checklist_count') ||
  !server.includes('execution_phase_counts') ||
  !server.includes('required_command_count') ||
  !server.includes('no_external_send_attempted: true') ||
  !server.includes('validation_bypass_approval') ||
  !server.includes("'week-two-local-validation-pass-execution-checklist'") ||
  !html.includes('Week 2 Local Validation Pass Execution Checklist') ||
  !html.includes('Direct read-only endpoint: /api/admin/week-two-local-validation-pass-execution-checklist') ||
  !html.includes('data.week_two_local_validation_pass_execution_checklist') ||
  !authSmoke.includes('/api/admin/week-two-local-validation-pass-execution-checklist') ||
  !authSmoke.includes('week-two-local-validation-pass-execution-checklist') ||
  !authSmoke.includes('weekTwoLocalValidationPassExecutionChecklist.body?.mode') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_local_validation_pass_execution_checklist')
) {
  fail('server.js and Admin UI must expose week_two_local_validation_pass_execution_checklist with command-order, public-file diff, failure-rerun, commit-report holds and blocked raw/log/public/live/destructive boundaries');
}
if (
  !server.includes("function weekTwoTwoWeekCloseoutReadinessItems()") ||
  !server.includes("app.get('/api/admin/week-two-two-week-closeout-readiness'") ||
  !server.includes('week_two_two_week_closeout_readiness') ||
  !server.includes('weekTwoTwoWeekCloseoutReadiness') ||
  !server.includes('week_two_closeout_done_inventory_review') ||
  !server.includes('week_two_closeout_validation_evidence_review') ||
  !server.includes('week_two_closeout_founder_action_queue_review') ||
  !server.includes('week_two_closeout_next_plan_seed_review') ||
  !server.includes('DONE_INVENTORY_REVIEW_READY') ||
  !server.includes('VALIDATION_EVIDENCE_REVIEW_READY') ||
  !server.includes('FOUNDER_ACTION_QUEUE_REVIEW_READY') ||
  !server.includes('NEXT_TWO_WEEK_PLAN_SEED_READY') ||
  !server.includes('closeout_readiness_count') ||
  !server.includes('checklist_phase_counts') ||
  !server.includes('required_evidence_count') ||
  !server.includes('no_magic_link_url_requested: true') ||
  !server.includes('no_admin_membership_insert_attempted: true') ||
  !server.includes('external_send') ||
  !server.includes("'week-two-two-week-closeout-readiness'") ||
  !html.includes('Week 2 Two-Week Closeout Readiness') ||
  !html.includes('Direct read-only endpoint: /api/admin/week-two-two-week-closeout-readiness') ||
  !html.includes('data.week_two_two_week_closeout_readiness') ||
  !authSmoke.includes('/api/admin/week-two-two-week-closeout-readiness') ||
  !authSmoke.includes('week-two-two-week-closeout-readiness') ||
  !authSmoke.includes('weekTwoTwoWeekCloseoutReadiness.body?.mode') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_two_week_closeout_readiness')
) {
  fail('server.js and Admin UI must expose week_two_two_week_closeout_readiness with done inventory, validation evidence, founder action queue, next-plan seed, and no-secret/no-live/no-public/no-external/no-finance/no-XPR/FIO boundaries');
}
if (
  !server.includes("function weekTwoMobileReleaseReadinessItems()") ||
  !server.includes("app.get('/api/admin/week-two-mobile-release-readiness'") ||
  !server.includes('week_two_mobile_release_readiness') ||
  !server.includes('weekTwoMobileReleaseReadiness') ||
  !server.includes('week_two_pwa_install_offline_recheck') ||
  !server.includes('week_two_android_debug_qa_blocker_recheck') ||
  !server.includes('week_two_ios_store_signing_blocker_recheck') ||
  !server.includes('week_two_mobile_release_decision_stop_gate') ||
  !server.includes('PWA_INSTALL_OFFLINE_RECHECK_REQUIRED') ||
  !server.includes('ANDROID_DEBUG_QA_RECHECK_REQUIRED') ||
  !server.includes('IOS_STORE_SIGNING_BLOCKED_FOUNDER_ACCOUNT_REQUIRED') ||
  !server.includes('MOBILE_RELEASE_DECISION_BLOCKED') ||
  !server.includes('MOBILE_RELEASE_DECISION_RECORDED') ||
  !server.includes('readiness_area_counts') ||
  !server.includes('founder_report_field_count') ||
  !server.includes('linked_surfaces') ||
  !server.includes('no_app_store_submission_attempted: true') ||
  !server.includes('no_play_console_submission_attempted: true') ||
  !server.includes('no_testflight_submission_attempted: true') ||
  !server.includes('no_play_testing_release_attempted: true') ||
  !server.includes('no_signing_key_upload_attempted: true') ||
  !server.includes('no_certificate_upload_attempted: true') ||
  !server.includes('no_provisioning_profile_upload_attempted: true') ||
  !server.includes('no_keystore_upload_attempted: true') ||
  !server.includes('no_public_release_attempted: true') ||
  !server.includes('no_xpr_signature_attempted: true') ||
  !server.includes("'week-two-mobile-release-readiness'") ||
  !html.includes('Week 2 Mobile Release Readiness') ||
  !html.includes('Direct read-only endpoint: /api/admin/week-two-mobile-release-readiness') ||
  !html.includes('data.week_two_mobile_release_readiness') ||
  !html.includes("const weekTwoMobileReleaseReadinessCount = (data.week_two_mobile_release_readiness || []).length") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_mobile_release_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_mobile_release_readiness')") ||
  !authSmoke.includes('/api/admin/week-two-mobile-release-readiness') ||
  !authSmoke.includes('week-two-mobile-release-readiness') ||
  !authSmoke.includes('weekTwoMobileReleaseReadiness.body?.mode') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_mobile_release_readiness')
) {
  fail('server.js and Admin UI must expose week_two_mobile_release_readiness with PWA, Android, iOS, store/signing, release-decision gates, direct endpoint, evidence export source, and no-store/no-signing/no-finance/no-XPR/no-live boundaries');
}
if (
  !server.includes("function weekTwoMobileReleaseExecutionChecklistItems()") ||
  !server.includes("app.get('/api/admin/week-two-mobile-release-execution-checklist'") ||
  !server.includes('week_two_mobile_release_execution_checklist') ||
  !server.includes('weekTwoMobileReleaseExecutionChecklist') ||
  !server.includes('week_two_mobile_pwa_install_report_back_intake') ||
  !server.includes('week_two_android_debug_qa_report_back_intake') ||
  !server.includes('week_two_ios_store_signing_request_hold') ||
  !server.includes('week_two_mobile_release_decision_hold') ||
  !server.includes('PWA_INSTALL_REPORT_BACK_REQUIRED') ||
  !server.includes('ANDROID_DEBUG_QA_REPORT_BACK_REQUIRED') ||
  !server.includes('IOS_STORE_SIGNING_REQUEST_HELD') ||
  !server.includes('MOBILE_RELEASE_DECISION_HELD') ||
  !server.includes('execution_phase_counts') ||
  !server.includes('mobile_release_execution_checklist_count') ||
  !server.includes('no_external_account_session_storage_attempted: true') ||
  !server.includes('no_screenshot_upload_attempted: true') ||
  !server.includes('no_device_identifier_storage_attempted: true') ||
  !server.includes('no_payment_or_wallet_data_requested: true') ||
  !server.includes("'week-two-mobile-release-execution-checklist'") ||
  !html.includes('Week 2 Mobile Release Execution Checklist') ||
  !html.includes('Direct read-only endpoint: /api/admin/week-two-mobile-release-execution-checklist') ||
  !html.includes('data.week_two_mobile_release_execution_checklist') ||
  !html.includes("const weekTwoMobileReleaseExecutionChecklistCount = (data.week_two_mobile_release_execution_checklist || []).length") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_mobile_release_execution_checklist')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_mobile_release_execution_checklist')") ||
  !authSmoke.includes('/api/admin/week-two-mobile-release-execution-checklist') ||
  !authSmoke.includes('week-two-mobile-release-execution-checklist') ||
  !authSmoke.includes('weekTwoMobileReleaseExecutionChecklist.body?.mode') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_mobile_release_execution_checklist')
) {
  fail('server.js and Admin UI must expose week_two_mobile_release_execution_checklist with PWA report-back, Android debug QA report-back, iOS store/signing hold, mobile release decision hold, evidence export source, and no-store/no-signing/no-device/no-public/no-XPR/no-live boundaries');
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
if (!html.includes("const financeContractBoundaryPackCount = (data.tester_finance_contract_boundary_pack || []).length") || !html.includes("['Finance/contract pack', financeContractBoundaryPackCount]")) {
  fail('Controlled Beta Readiness UI must summarize tester finance/contract boundary pack count');
}
if (!html.includes("const financeContractQuickstartCount = (data.tester_finance_contract_quickstart || []).length") || !html.includes("['Finance quickstart', financeContractQuickstartCount]")) {
  fail('Controlled Beta Readiness UI must summarize tester finance/contract quickstart count');
}
if (!html.includes("const traditionalFirstPublicCopyGateCount = (data.traditional_first_public_copy_gate || []).length") || !html.includes("['Public copy gate', traditionalFirstPublicCopyGateCount]")) {
  fail('Controlled Beta Readiness UI must summarize traditional-first public copy gate count');
}
if (!html.includes("const homepagePublicationSequenceGateCount = (data.homepage_publication_sequence_gate || []).length") || !html.includes("['Homepage sequence', homepagePublicationSequenceGateCount]")) {
  fail('Controlled Beta Readiness UI must summarize homepage publication sequence gate count');
}
if (
  !html.includes('const homepagePublicationReviewPacket = data.homepage_publication_review_packet || {}') ||
  !html.includes('const homepagePublicationDecisionSummary = data.homepage_publication_decision_summary || {}') ||
  !html.includes("const homepagePublicationDecisionSummaryState = homepagePublicationDecisionSummary.summary_state || 'missing'") ||
  !html.includes("['Homepage summary', homepagePublicationDecisionSummaryState]") ||
  !html.includes("const homepagePublicationReviewPacketSectionCount = (homepagePublicationReviewPacket.required_decisions || []).length") ||
  !html.includes("['Homepage packet', homepagePublicationReviewPacketSectionCount]")
) {
  fail('Controlled Beta Readiness UI must summarize homepage publication decision summary and review packet decision count');
}
if (
  !html.includes("const homepagePublicationFounderDecisionScriptCount = (data.homepage_publication_founder_decision_script || []).length") ||
  !html.includes("['Homepage decisions', homepagePublicationFounderDecisionScriptCount]")
) {
  fail('Controlled Beta Readiness UI must summarize homepage publication founder decision script count');
}
if (
  !html.includes("const homepagePublicationEvidenceChecklistCount = (data.homepage_publication_evidence_checklist || []).length") ||
  !html.includes("['Homepage evidence', homepagePublicationEvidenceChecklistCount]")
) {
  fail('Controlled Beta Readiness UI must summarize homepage publication evidence checklist count');
}
if (
  !html.includes("const homepageStaticAssetCandidateCount = (data.homepage_static_asset_candidate || []).length") ||
  !html.includes("['Static candidate', homepageStaticAssetCandidateCount]")
) {
  fail('Controlled Beta Readiness UI must summarize homepage static asset candidate count');
}
if (
  !html.includes("const homepagePublicationFinalQaHoldCount = (data.homepage_publication_final_qa_hold || []).length") ||
  !html.includes("['Homepage final QA', homepagePublicationFinalQaHoldCount]")
) {
  fail('Controlled Beta Readiness UI must summarize homepage publication final QA hold count');
}
if (
  !html.includes("const deploymentNextStepReadinessCount = (data.deployment_next_step_readiness || []).length") ||
  !html.includes("['Deploy next', deploymentNextStepReadinessCount]")
) {
  fail('Controlled Beta Readiness UI must summarize deployment next-step readiness count');
}
if (
  !html.includes("const weekTwoDeploymentPublicBetaReadinessCount = (data.week_two_deployment_public_beta_readiness || []).length") ||
  !html.includes("['Week 2 deploy/beta', weekTwoDeploymentPublicBetaReadinessCount]")
) {
  fail('Controlled Beta Readiness UI must summarize Week 2 deployment/public beta readiness count');
}
if (
  !html.includes("const weekTwoDeploymentPublicBetaExecutionChecklistCount = (data.week_two_deployment_public_beta_execution_checklist || []).length") ||
  !html.includes("['Deploy/beta execution', weekTwoDeploymentPublicBetaExecutionChecklistCount]")
) {
  fail('Controlled Beta Readiness UI must summarize Week 2 deployment/public beta execution checklist count');
}
if (
  !html.includes("const weekTwoLegalProviderReadinessCount = (data.week_two_legal_provider_readiness || []).length") ||
  !html.includes("['Week 2 legal/provider', weekTwoLegalProviderReadinessCount]")
) {
  fail('Controlled Beta Readiness UI must summarize Week 2 legal/provider readiness count');
}
if (
  !html.includes("const publicBetaNextStepReadinessCount = (data.public_beta_next_step_readiness || []).length") ||
  !html.includes("['Public beta next', publicBetaNextStepReadinessCount]")
) {
  fail('Controlled Beta Readiness UI must summarize public beta next-step readiness count');
}
if (!html.includes("const financeContractWalkthroughGateCount = (data.tester_finance_contract_walkthrough_gate || []).length") || !html.includes("['Finance gate', financeContractWalkthroughGateCount]")) {
  fail('Controlled Beta Readiness UI must summarize tester finance/contract walkthrough gate count');
}
if (!html.includes("const financeContractWalkthroughScriptCount = (data.tester_finance_contract_walkthrough_script || []).length") || !html.includes("['Finance walkthrough', financeContractWalkthroughScriptCount]")) {
  fail('Controlled Beta Readiness UI must summarize tester finance/contract walkthrough script count');
}
if (!html.includes("const financeContractWalkthroughTriageMatrixCount = (data.tester_finance_contract_walkthrough_triage_matrix || []).length") || !html.includes("['Finance triage', financeContractWalkthroughTriageMatrixCount]")) {
  fail('Controlled Beta Readiness UI must summarize tester finance/contract walkthrough triage matrix count');
}
if (!html.includes("const financeContractWalkthroughDebriefPacketCount = (data.tester_finance_contract_walkthrough_debrief_packet || []).length") || !html.includes("['Finance debrief', financeContractWalkthroughDebriefPacketCount]")) {
  fail('Controlled Beta Readiness UI must summarize tester finance/contract walkthrough debrief packet count');
}
if (!html.includes("const financeContractReviewerNotesCount = (data.tester_finance_contract_reviewer_notes || []).length") || !html.includes("['Reviewer notes', financeContractReviewerNotesCount]")) {
  fail('Controlled Beta Readiness UI must summarize tester finance/contract reviewer notes count');
}
if (!html.includes("const financeContractLiveConfusionSafetyPackCount = (data.tester_finance_contract_live_confusion_safety_pack || []).length") || !html.includes("['Live-confusion pack', financeContractLiveConfusionSafetyPackCount]")) {
  fail('Controlled Beta Readiness UI must summarize tester finance/contract live-confusion safety pack count');
}
if (!html.includes("const financeContractSessionSafetyChecklistCount = (data.tester_finance_contract_session_safety_checklist || []).length") || !html.includes("['Session safety', financeContractSessionSafetyChecklistCount]")) {
  fail('Controlled Beta Readiness UI must summarize tester finance/contract session safety checklist count');
}
if (!html.includes("const financeContractSafeHandoffSummaryCount = (data.tester_finance_contract_safe_handoff_summary || []).length") || !html.includes("['Safe handoff summary', financeContractSafeHandoffSummaryCount]")) {
  fail('Controlled Beta Readiness UI must summarize tester finance/contract safe handoff summary count');
}
if (!html.includes("const founderLiveBlockerHandoffPackCount = (data.founder_live_blocker_handoff_pack || []).length") || !html.includes("['Founder handoff pack', founderLiveBlockerHandoffPackCount]")) {
  fail('Controlled Beta Readiness UI must summarize founder live blocker handoff pack count');
}
if (!html.includes("const founderEveningActionSummaryCount = (data.founder_evening_action_summary || []).length") || !html.includes("['Evening actions', founderEveningActionSummaryCount]")) {
  fail('Controlled Beta Readiness UI must summarize founder evening action summary count');
}
if (!html.includes("const founderEveningDecisionMatrixCount = (data.founder_evening_decision_matrix || []).length") || !html.includes("['Decision matrix', founderEveningDecisionMatrixCount]")) {
  fail('Controlled Beta Readiness UI must summarize founder evening decision matrix count');
}
if (!html.includes("const founderEveningCommandBoardCount = (data.founder_evening_command_board || []).length") || !html.includes("['Command board', founderEveningCommandBoardCount]")) {
  fail('Controlled Beta Readiness UI must summarize founder evening command board count');
}
if (!html.includes("const founderHandoffTodayCount = (data.founder_handoff_today || []).length") || !html.includes("['Today handoff', founderHandoffTodayCount]")) {
  fail('Controlled Beta Readiness UI must summarize founder_handoff_today count');
}
if (!html.includes("const weekOneCloseoutHandoffCount = (data.week_one_closeout_handoff || []).length") || !html.includes("['Week 1 closeout', weekOneCloseoutHandoffCount]")) {
  fail('Controlled Beta Readiness UI must summarize week_one_closeout_handoff count');
}
if (!html.includes("const investorFounderPackageReadinessCount = (data.investor_founder_package_readiness || []).length") || !html.includes("['Investor package', investorFounderPackageReadinessCount]")) {
  fail('Controlled Beta Readiness UI must summarize investor_founder_package_readiness count');
}
if (
  !html.includes("const weekTwoInvestorFounderPackageAlignmentCount = (data.week_two_investor_founder_package_alignment || []).length") ||
  !html.includes("['Week 2 investor alignment', weekTwoInvestorFounderPackageAlignmentCount]")
) {
  fail('Controlled Beta Readiness UI must summarize week_two_investor_founder_package_alignment count');
}
if (
  !html.includes("const weekTwoInvestorFounderPackageExecutionChecklistCount = (data.week_two_investor_founder_package_execution_checklist || []).length") ||
  !html.includes("['Investor execution', weekTwoInvestorFounderPackageExecutionChecklistCount]")
) {
  fail('Controlled Beta Readiness UI must summarize week_two_investor_founder_package_execution_checklist count');
}
if (
  !html.includes("const weekTwoLocalValidationPassReadinessCount = (data.week_two_local_validation_pass_readiness || []).length") ||
  !html.includes("['Validation pass', weekTwoLocalValidationPassReadinessCount]")
) {
  fail('Controlled Beta Readiness UI must summarize week_two_local_validation_pass_readiness count');
}
if (
  !html.includes("const weekTwoLocalValidationPassExecutionChecklistCount = (data.week_two_local_validation_pass_execution_checklist || []).length") ||
  !html.includes("['Validation execution', weekTwoLocalValidationPassExecutionChecklistCount]")
) {
  fail('Controlled Beta Readiness UI must summarize week_two_local_validation_pass_execution_checklist count');
}
if (
  !html.includes("const weekTwoTwoWeekCloseoutReadinessCount = (data.week_two_two_week_closeout_readiness || []).length") ||
  !html.includes("['Two-week closeout', weekTwoTwoWeekCloseoutReadinessCount]")
) {
  fail('Controlled Beta Readiness UI must summarize week_two_two_week_closeout_readiness count');
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
if (!html.includes('Tester Finance Contract Boundary Pack') || !html.includes('data.tester_finance_contract_boundary_pack')) {
  fail('Controlled Beta Readiness UI must show backend tester_finance_contract_boundary_pack');
}
if (
  !html.includes('Tester Finance Contract Quickstart') ||
  !html.includes('data.tester_finance_contract_quickstart') ||
  !html.includes('Allowed tester actions') ||
  !html.includes('Blocked live interpretations') ||
  !html.includes('Report-back fields') ||
  !html.includes('No server storage attempted') ||
  !html.includes('No external follow-up attempted') ||
  !html.includes('No live action attempted')
) {
  fail('Controlled Beta Readiness UI must show tester finance/contract quickstart with allowed actions, blocked live interpretations, safe report fields, and no-live/no-external boundaries');
}
if (
  !html.includes('Traditional-First Public Copy Gate') ||
  !html.includes('data.traditional_first_public_copy_gate') ||
  !html.includes('Safe public positioning:') ||
  !html.includes('Internal-only until review:') ||
  !html.includes('Blocked public claims:') ||
  !html.includes('Review source:') ||
  !html.includes('No public website edit attempted') ||
  !html.includes('No external provider claim attempted') ||
  !html.includes('No live action attempted')
) {
  fail('Controlled Beta Readiness UI must show traditional-first public copy gate with safe public positioning, internal-only terms, blocked claims, review source, and no-live boundaries');
}
if (
  !html.includes('Beta Traditional-First Public Copy Validation') ||
  !html.includes('traditionalFirstPublicCopyInput') ||
  !html.includes('validateTraditionalFirstPublicCopy') ||
  !html.includes('/api/admin/beta-readiness/public-copy/validate') ||
  !html.includes('renderTraditionalFirstPublicCopyValidation') ||
  !html.includes('traditional_first_public_copy_validation') ||
  !html.includes('No public copy storage') ||
  !html.includes('No public website edit attempted') ||
  !html.includes('No external provider claim attempted') ||
  !html.includes('No public beta flip attempted') ||
  !html.includes('Blockchain/Web3 public claim') ||
  !html.includes('No live action attempted')
) {
  fail('Controlled Beta Readiness UI must expose local traditional-first public copy validation before public beta/site/deck/invite wording changes');
}
const traditionalFirstPublicCopyValidationStart = html.indexOf('function renderTraditionalFirstPublicCopyValidation');
const traditionalFirstPublicCopyValidationEnd = html.indexOf(
  'function loadTraditionalFirstPublicCopyValidationHistoryFromLocalStorage',
  traditionalFirstPublicCopyValidationStart
);
const traditionalFirstPublicCopyValidationSource =
  traditionalFirstPublicCopyValidationStart === -1 || traditionalFirstPublicCopyValidationEnd === -1
    ? ''
    : html.slice(traditionalFirstPublicCopyValidationStart, traditionalFirstPublicCopyValidationEnd);
if (
  !traditionalFirstPublicCopyValidationSource ||
  !traditionalFirstPublicCopyValidationSource.includes("['Request ID Header', data.request_id_header || 'pending']") ||
  !traditionalFirstPublicCopyValidationSource.includes("['Request path', data.request_path || '/api/admin/beta-readiness/public-copy/validate']") ||
  !traditionalFirstPublicCopyValidationSource.includes("['Request method', data.request_method || 'POST']") ||
  !traditionalFirstPublicCopyValidationSource.includes("['HTTP status', data.http_status || 'pending']") ||
  !traditionalFirstPublicCopyValidationSource.includes("Request ID Header: ${escapeHtml(data.request_id_header || 'pending')}") ||
  !traditionalFirstPublicCopyValidationSource.includes("Request path: ${escapeHtml(data.request_path || '/api/admin/beta-readiness/public-copy/validate')}") ||
  !traditionalFirstPublicCopyValidationSource.includes("Request method: ${escapeHtml(data.request_method || 'POST')}") ||
  !traditionalFirstPublicCopyValidationSource.includes("HTTP status: ${escapeHtml(data.http_status || 'pending')}")
) {
  fail('Controlled Beta Readiness UI must render full request trace metadata for traditional-first public copy validation');
}
if (
  !html.includes('Beta Traditional-First Public Copy Validation History') ||
  !html.includes('traditionalFirstPublicCopyValidationHistorySummary') ||
  !html.includes('traditionalFirstPublicCopyValidationHistoryGrid') ||
  !html.includes('clearTraditionalFirstPublicCopyValidationHistoryBtn') ||
  !html.includes('TRADITIONAL_FIRST_PUBLIC_COPY_VALIDATION_HISTORY_KEY') ||
  !html.includes('traditionalFirstPublicCopyValidationHistory') ||
  !html.includes('saveTraditionalFirstPublicCopyValidationHistory') ||
  !html.includes('loadTraditionalFirstPublicCopyValidationHistoryFromLocalStorage') ||
  !html.includes('renderTraditionalFirstPublicCopyValidationHistory') ||
  !html.includes('clearTraditionalFirstPublicCopyValidationHistory') ||
  !html.includes('traditional_first_public_copy_validation_history') ||
  !html.includes('public_copy_validation_metadata_history_only') ||
  !html.includes('No raw public copy drafts, issue excerpts, secrets, payment data, identity data, provider/legal decisions, public beta approvals, production approvals, external sends, or live-action approvals are stored in this history.')
) {
  fail('Controlled Beta Readiness UI must keep traditional-first public copy validation history as browser-local metadata only');
}
if (
  !html.includes('Homepage Publication Decision Validation') ||
  !html.includes('homepagePublicationDecisionInput') ||
  !html.includes('validateHomepagePublicationDecision') ||
  !html.includes('/api/admin/beta-readiness/homepage-publication-decision/validate') ||
  !html.includes('renderHomepagePublicationDecisionValidation') ||
  !html.includes('homepage_publication_decision_validation') ||
  !html.includes('PUBLICATION_GO Separation') ||
  !html.includes('Recommended Founder Phrases') ||
  !html.includes('No decision text storage') ||
  !html.includes('No public replacement attempted') ||
  !html.includes('No deploy attempted') ||
  !html.includes('No URL share attempted') ||
  !html.includes('No tester invite attempted') ||
  !html.includes('No live action attempted')
) {
  fail('Controlled Beta Readiness UI must expose local homepage publication decision validation with PUBLICATION_GO separation and no-storage/no-public/no-deploy/no-share/no-live boundaries');
}
const homepagePublicationDecisionValidationStart = html.indexOf('function renderHomepagePublicationDecisionValidation');
const homepagePublicationDecisionValidationEnd = html.indexOf(
  'function homepagePublicationDecisionValidationSummaryStatus',
  homepagePublicationDecisionValidationStart
);
const homepagePublicationDecisionValidationSource =
  homepagePublicationDecisionValidationStart === -1 || homepagePublicationDecisionValidationEnd === -1
    ? ''
    : html.slice(homepagePublicationDecisionValidationStart, homepagePublicationDecisionValidationEnd);
if (
  !homepagePublicationDecisionValidationSource ||
  !homepagePublicationDecisionValidationSource.includes("['Request ID Header', data.request_id_header || 'pending']") ||
  !homepagePublicationDecisionValidationSource.includes("['Request path', data.request_path || '/api/admin/beta-readiness/homepage-publication-decision/validate']") ||
  !homepagePublicationDecisionValidationSource.includes("['Request method', data.request_method || 'POST']") ||
  !homepagePublicationDecisionValidationSource.includes("['HTTP status', data.http_status || 'pending']") ||
  !homepagePublicationDecisionValidationSource.includes("Request ID Header: ${escapeHtml(data.request_id_header || 'pending')}") ||
  !homepagePublicationDecisionValidationSource.includes("Request path: ${escapeHtml(data.request_path || '/api/admin/beta-readiness/homepage-publication-decision/validate')}") ||
  !homepagePublicationDecisionValidationSource.includes("Request method: ${escapeHtml(data.request_method || 'POST')}") ||
  !homepagePublicationDecisionValidationSource.includes("HTTP status: ${escapeHtml(data.http_status || 'pending')}")
) {
  fail('Controlled Beta Readiness UI must render full request trace metadata for homepage publication decision validation');
}
if (
  !html.includes('Homepage Publication Decision Validation History') ||
  !html.includes('homepagePublicationDecisionValidationHistorySummary') ||
  !html.includes('homepagePublicationDecisionValidationHistoryGrid') ||
  !html.includes('clearHomepagePublicationDecisionValidationHistoryBtn') ||
  !html.includes('HOMEPAGE_PUBLICATION_DECISION_VALIDATION_HISTORY_KEY') ||
  !html.includes('homepagePublicationDecisionValidationHistory') ||
  !html.includes('saveHomepagePublicationDecisionValidationHistory') ||
  !html.includes('loadHomepagePublicationDecisionValidationHistoryFromLocalStorage') ||
  !html.includes('renderHomepagePublicationDecisionValidationHistory') ||
  !html.includes('clearHomepagePublicationDecisionValidationHistory') ||
  !html.includes('homepage_publication_decision_validation_history') ||
  !html.includes('homepage_publication_decision_validation_metadata_history_only') ||
  !html.includes('No raw founder decision text, PUBLICATION_GO text, issue excerpts, secrets, payment data, identity data, provider/legal decisions, public replacement approvals, deploy approvals, URL-share approvals, tester-invite approvals, production approvals, external sends, or live-action approvals are stored in this history.')
) {
  fail('Controlled Beta Readiness UI must keep homepage publication decision validation history as browser-local metadata only without founder decision text or PUBLICATION_GO text');
}
if (
  !html.includes('Beta Finance Contract Quickstart Acknowledgement Validation') ||
  !html.includes('betaFinanceContractQuickstartAcknowledgementInput') ||
  !html.includes('validateBetaFinanceContractQuickstartAcknowledgement') ||
  !html.includes('/api/admin/beta-readiness/finance-contract-quickstart/acknowledgement/validate') ||
  !html.includes('renderBetaFinanceContractQuickstartAcknowledgementValidation') ||
  !html.includes('FINANCE_CONTRACT_TESTER_QUICKSTART') ||
  !html.includes('No acknowledgement storage') ||
  !html.includes('No external follow-up attempted') ||
  !html.includes('No public beta flip attempted') ||
  !html.includes('No live action attempted')
) {
  fail('Controlled Beta Readiness UI must expose local beta finance/contract quickstart acknowledgement validation before finance/contract walkthroughs');
}

const betaFinanceQuickstartValidationStart = html.indexOf('function renderBetaFinanceContractQuickstartAcknowledgementValidation');
const betaFinanceQuickstartValidationEnd = html.indexOf('async function validateBetaFinanceContractReviewerNote', betaFinanceQuickstartValidationStart);
const betaFinanceQuickstartValidationSource = betaFinanceQuickstartValidationStart === -1 || betaFinanceQuickstartValidationEnd === -1
  ? ''
  : html.slice(betaFinanceQuickstartValidationStart, betaFinanceQuickstartValidationEnd);
if (
  !betaFinanceQuickstartValidationSource ||
  !betaFinanceQuickstartValidationSource.includes("['Request ID Header', data.request_id_header || 'pending']") ||
  !betaFinanceQuickstartValidationSource.includes("['Request path', data.request_path || '/api/admin/beta-readiness/finance-contract-quickstart/acknowledgement/validate']") ||
  !betaFinanceQuickstartValidationSource.includes("['Request method', data.request_method || 'POST']") ||
  !betaFinanceQuickstartValidationSource.includes("['HTTP status', data.http_status || 'pending']") ||
  !betaFinanceQuickstartValidationSource.includes("Request ID Header: ${escapeHtml(data.request_id_header || 'pending')}") ||
  !betaFinanceQuickstartValidationSource.includes("Request path: ${escapeHtml(data.request_path || '/api/admin/beta-readiness/finance-contract-quickstart/acknowledgement/validate')}") ||
  !betaFinanceQuickstartValidationSource.includes("Request method: ${escapeHtml(data.request_method || 'POST')}") ||
  !betaFinanceQuickstartValidationSource.includes("HTTP status: ${escapeHtml(data.http_status || 'pending')}")
) {
  fail('Controlled Beta Readiness UI must render full request trace metadata for quickstart acknowledgement validation');
}
if (
  !html.includes('Tester Finance Contract Walkthrough Gate') ||
  !html.includes('data.tester_finance_contract_walkthrough_gate') ||
  !html.includes('Required before:') ||
  !html.includes('Required evidence:') ||
  !html.includes('Route:') ||
  !html.includes('No server storage attempted') ||
  !html.includes('No public beta flip attempted') ||
  !html.includes('No live action attempted')
) {
  fail('Controlled Beta Readiness UI must show backend tester_finance_contract_walkthrough_gate with required evidence, routes, and no-live boundaries');
}
if (!html.includes('Tester Finance Contract Walkthrough Script') || !html.includes('data.tester_finance_contract_walkthrough_script')) {
  fail('Controlled Beta Readiness UI must show backend tester_finance_contract_walkthrough_script');
}
if (!html.includes('Tester Finance Contract Walkthrough Triage Matrix') || !html.includes('data.tester_finance_contract_walkthrough_triage_matrix')) {
  fail('Controlled Beta Readiness UI must show backend tester_finance_contract_walkthrough_triage_matrix');
}
if (!html.includes('Tester Finance Contract Walkthrough Debrief Packet') || !html.includes('data.tester_finance_contract_walkthrough_debrief_packet')) {
  fail('Controlled Beta Readiness UI must show backend tester_finance_contract_walkthrough_debrief_packet');
}
if (!html.includes('Tester Finance Contract Reviewer Notes') || !html.includes('data.tester_finance_contract_reviewer_notes') || !html.includes('SAFE_REVIEWER_NOTE')) {
  fail('Controlled Beta Readiness UI must show backend tester_finance_contract_reviewer_notes');
}
if (
  !html.includes('Tester Finance Contract Live Confusion Safety Pack') ||
  !html.includes('data.tester_finance_contract_live_confusion_safety_pack') ||
  !html.includes('LIVE_CONFUSION_REVIEW_ONLY') ||
  !html.includes('no_public_beta_flip') ||
  !html.includes('no_external_followup')
) {
  fail('Controlled Beta Readiness UI must show backend tester_finance_contract_live_confusion_safety_pack with no-public-beta/no-external-followup boundaries');
}
if (
  !html.includes('Tester Finance Contract Session Safety Checklist') ||
  !html.includes('data.tester_finance_contract_session_safety_checklist') ||
  !html.includes('FINANCE_CONTRACT_SESSION_SAFETY') ||
  !html.includes('Required safe evidence:') ||
  !html.includes('Stop if:') ||
  !html.includes('No server storage attempted') ||
  !html.includes('No external follow-up attempted') ||
  !html.includes('No public beta flip attempted') ||
  !html.includes('No live action attempted')
) {
  fail('Controlled Beta Readiness UI must show backend tester_finance_contract_session_safety_checklist with safe evidence, stop conditions, report code, and no-live/no-storage boundaries');
}
if (
  !html.includes('Tester Finance Contract Safe Handoff Summary') ||
  !html.includes('data.tester_finance_contract_safe_handoff_summary') ||
  !html.includes('FINANCE_CONTRACT_SAFE_HANDOFF_SUMMARY') ||
  !html.includes('Required sources:') ||
  !html.includes('Handoff fields:') ||
  !html.includes('Metadata-only history sources:') ||
  !html.includes('Review routes:') ||
  !html.includes('No external export attempted') ||
  !html.includes('beta_finance_contract_session_safety_validation_history') ||
  !html.includes('beta_finance_contract_live_confusion_validation_history') ||
  !html.includes('beta_finance_contract_reviewer_note_validation_history') ||
  !html.includes('beta_finance_contract_safe_handoff_report_history')
) {
  fail('Controlled Beta Readiness UI must show backend tester_finance_contract_safe_handoff_summary with linked sources, handoff fields, metadata-only history, review routes, and no-external-export boundaries');
}
if (
  !html.includes('Beta Finance Contract Safe Handoff Report') ||
  !html.includes('buildBetaFinanceContractSafeHandoffReportBtn') ||
  !html.includes('buildBetaFinanceContractSafeHandoffReport') ||
  !html.includes('copyBetaFinanceContractSafeHandoffReport') ||
  !html.includes('renderBetaFinanceContractSafeHandoffReport') ||
  !html.includes('betaFinanceContractSafeHandoffReportSummary') ||
  !html.includes('betaFinanceContractSafeHandoffReportGrid') ||
  !html.includes('betaFinanceContractSafeHandoffReport') ||
  !html.includes('beta_finance_contract_safe_handoff_report_preview') ||
  !html.includes('copyable_markdown') ||
  !html.includes('Copy safe handoff report') ||
  (!html.includes('Metadata histories') && !html.includes('browser-local metadata histories')) ||
  !html.includes('safeHandoffRequestIdsFromEntry') ||
  !html.includes('tester_finance_contract_safe_handoff_summary') ||
  !html.includes('betaFinanceContractReviewerNoteValidationHistory') ||
  !html.includes('betaFinanceContractLiveConfusionValidationHistory') ||
  !html.includes('betaFinanceContractSessionSafetyValidationHistory') ||
  !html.includes('no_external_export_attempted') ||
  !html.includes('No external export attempted') ||
  !html.includes('Raw notes, issue excerpts, secrets, payment data, identity data, signed contract text, XPR signatures, stablecoin approvals, token collateral approvals, provider/legal decisions, public beta approvals, production approvals, external sends, and live-action approvals are not included.')
) {
  fail('Controlled Beta Readiness UI must build a local copyable beta finance/contract safe handoff report from safe backend summary and browser-local metadata histories only');
}
if (
  !html.includes('Beta Finance Contract Safe Handoff Report History') ||
  !html.includes('betaFinanceContractSafeHandoffReportHistorySummary') ||
  !html.includes('betaFinanceContractSafeHandoffReportHistoryGrid') ||
  !html.includes('clearBetaFinanceContractSafeHandoffReportHistoryBtn') ||
  !html.includes('BETA_FINANCE_CONTRACT_SAFE_HANDOFF_REPORT_HISTORY_KEY') ||
  !html.includes('betaFinanceContractSafeHandoffReportHistory') ||
  !html.includes('saveBetaFinanceContractSafeHandoffReportHistory') ||
  !html.includes('loadBetaFinanceContractSafeHandoffReportHistoryFromLocalStorage') ||
  !html.includes('renderBetaFinanceContractSafeHandoffReportHistory') ||
  !html.includes('clearBetaFinanceContractSafeHandoffReportHistory') ||
  !html.includes('beta_finance_contract_safe_handoff_report_history') ||
  !html.includes('safe_handoff_report_metadata_history_only') ||
  !html.includes('no_copyable_markdown_storage') ||
  !html.includes('betaSafeHandoffReportIds') ||
  !html.includes('prefillRequestTraceReportIdsFromSafeHandoffReportHistory') ||
  !html.includes("sourceSurface.value = 'beta_finance_contract_safe_handoff_report_history'") ||
  !html.includes("idsTextarea.scrollIntoView({ behavior: 'smooth', block: 'center' })") ||
  !html.includes("Use this report's safe IDs in Request Trace") ||
  !html.includes('Copyable markdown stored: false') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('beta_finance_contract_safe_handoff_report_history')") ||
  !html.includes('Open safe handoff report evidence export source') ||
  !html.includes('No copyable markdown, raw notes, issue excerpts, secrets, payment data, identity data, signed contract text, XPR signatures, stablecoin approvals, token collateral approvals, provider/legal decisions, public beta approvals, production approvals, external sends, server storage, or live-action approvals are stored in this history.')
) {
  fail('Controlled Beta Readiness UI must keep beta finance/contract safe handoff report history as browser-local metadata only, expose per-report safe IDs to Request Trace, and link to the local evidence export source');
}
if (
  !html.includes('Beta Finance Contract Session Safety Validation') ||
  !html.includes('betaFinanceContractSessionSafetyInput') ||
  !html.includes('validateBetaFinanceContractSessionSafety') ||
  !html.includes('/api/admin/beta-readiness/finance-contract-walkthrough/session-safety/validate') ||
  !html.includes('renderBetaFinanceContractSessionSafetyValidation') ||
  !html.includes('FINANCE_CONTRACT_SESSION_SAFETY') ||
  !html.includes('No session-safety note storage') ||
  !html.includes('No external follow-up attempted') ||
  !html.includes('No public beta flip') ||
  !html.includes('No live action attempted')
) {
  fail('Controlled Beta Readiness UI must expose local beta finance/contract session-safety validation before tester issue handoff');
}

const betaFinanceSessionSafetyValidationStart = html.indexOf('function renderBetaFinanceContractSessionSafetyValidation');
const betaFinanceSessionSafetyValidationEnd = html.indexOf('function loadBetaFinanceContractSessionSafetyValidationHistoryFromLocalStorage', betaFinanceSessionSafetyValidationStart);
const betaFinanceSessionSafetyValidationSource = betaFinanceSessionSafetyValidationStart === -1 || betaFinanceSessionSafetyValidationEnd === -1
  ? ''
  : html.slice(betaFinanceSessionSafetyValidationStart, betaFinanceSessionSafetyValidationEnd);
if (
  !betaFinanceSessionSafetyValidationSource ||
  !betaFinanceSessionSafetyValidationSource.includes("['Request ID Header', data.request_id_header || 'pending']") ||
  !betaFinanceSessionSafetyValidationSource.includes("['Request path', data.request_path || '/api/admin/beta-readiness/finance-contract-walkthrough/session-safety/validate']") ||
  !betaFinanceSessionSafetyValidationSource.includes("['Request method', data.request_method || 'POST']") ||
  !betaFinanceSessionSafetyValidationSource.includes("['HTTP status', data.http_status || 'pending']") ||
  !betaFinanceSessionSafetyValidationSource.includes("Request ID Header: ${escapeHtml(data.request_id_header || 'pending')}") ||
  !betaFinanceSessionSafetyValidationSource.includes("Request path: ${escapeHtml(data.request_path || '/api/admin/beta-readiness/finance-contract-walkthrough/session-safety/validate')}") ||
  !betaFinanceSessionSafetyValidationSource.includes("Request method: ${escapeHtml(data.request_method || 'POST')}") ||
  !betaFinanceSessionSafetyValidationSource.includes("HTTP status: ${escapeHtml(data.http_status || 'pending')}")
) {
  fail('Controlled Beta Readiness UI must render full request trace metadata for session-safety validation');
}
if (
  !html.includes('Beta Finance Contract Session Safety Validation History') ||
  !html.includes('betaFinanceContractSessionSafetyValidationHistorySummary') ||
  !html.includes('betaFinanceContractSessionSafetyValidationHistoryGrid') ||
  !html.includes('clearBetaFinanceContractSessionSafetyValidationHistoryBtn') ||
  !html.includes('BETA_FINANCE_CONTRACT_SESSION_SAFETY_VALIDATION_HISTORY_KEY') ||
  !html.includes('betaFinanceContractSessionSafetyValidationHistory') ||
  !html.includes('saveBetaFinanceContractSessionSafetyValidationHistory') ||
  !html.includes('loadBetaFinanceContractSessionSafetyValidationHistoryFromLocalStorage') ||
  !html.includes('renderBetaFinanceContractSessionSafetyValidationHistory') ||
  !html.includes('clearBetaFinanceContractSessionSafetyValidationHistory') ||
  !html.includes('beta_finance_contract_session_safety_validation_history') ||
  !html.includes('session_safety_validation_metadata_history_only') ||
  !html.includes('No raw session-safety notes, issue excerpts, secrets, payment data, identity data, signed contract text, XPR signatures, stablecoin settlement approvals, token collateral approvals, provider/legal decisions, public beta approvals, external follow-up approvals, production approvals, external sends, or live-action approvals are stored in this history.')
) {
  fail('Controlled Beta Readiness UI must keep beta finance/contract session-safety validation history as browser-local metadata only');
}
if (
  !html.includes('Beta Finance Contract Live Confusion Validation') ||
  !html.includes('betaFinanceContractLiveConfusionInput') ||
  !html.includes('validateBetaFinanceContractLiveConfusion') ||
  !html.includes('/api/admin/beta-readiness/finance-contract-walkthrough/live-confusion/validate') ||
  !html.includes('LIVE_CONFUSION_REVIEW_ONLY') ||
  !html.includes('No live-confusion note storage')
) {
  fail('Controlled Beta Readiness UI must expose local beta finance/contract live-confusion validation before issue handoff');
}

const betaFinanceLiveConfusionValidationStart = html.indexOf('function renderBetaFinanceContractLiveConfusionValidation');
const betaFinanceLiveConfusionValidationEnd = html.indexOf('function loadBetaFinanceContractLiveConfusionValidationHistoryFromLocalStorage', betaFinanceLiveConfusionValidationStart);
const betaFinanceLiveConfusionValidationSource = betaFinanceLiveConfusionValidationStart === -1 || betaFinanceLiveConfusionValidationEnd === -1
  ? ''
  : html.slice(betaFinanceLiveConfusionValidationStart, betaFinanceLiveConfusionValidationEnd);
if (
  !betaFinanceLiveConfusionValidationSource ||
  !betaFinanceLiveConfusionValidationSource.includes("['Request ID Header', data.request_id_header || 'pending']") ||
  !betaFinanceLiveConfusionValidationSource.includes("['Request path', data.request_path || '/api/admin/beta-readiness/finance-contract-walkthrough/live-confusion/validate']") ||
  !betaFinanceLiveConfusionValidationSource.includes("['Request method', data.request_method || 'POST']") ||
  !betaFinanceLiveConfusionValidationSource.includes("['HTTP status', data.http_status || 'pending']") ||
  !betaFinanceLiveConfusionValidationSource.includes("Request ID Header: ${escapeHtml(data.request_id_header || 'pending')}") ||
  !betaFinanceLiveConfusionValidationSource.includes("Request path: ${escapeHtml(data.request_path || '/api/admin/beta-readiness/finance-contract-walkthrough/live-confusion/validate')}") ||
  !betaFinanceLiveConfusionValidationSource.includes("Request method: ${escapeHtml(data.request_method || 'POST')}") ||
  !betaFinanceLiveConfusionValidationSource.includes("HTTP status: ${escapeHtml(data.http_status || 'pending')}")
) {
  fail('Controlled Beta Readiness UI must render full request trace metadata for live-confusion validation');
}
if (
  !html.includes('Beta Finance Contract Live Confusion Validation History') ||
  !html.includes('betaFinanceContractLiveConfusionValidationHistorySummary') ||
  !html.includes('betaFinanceContractLiveConfusionValidationHistoryGrid') ||
  !html.includes('clearBetaFinanceContractLiveConfusionValidationHistoryBtn') ||
  !html.includes('BETA_FINANCE_CONTRACT_LIVE_CONFUSION_VALIDATION_HISTORY_KEY') ||
  !html.includes('betaFinanceContractLiveConfusionValidationHistory') ||
  !html.includes('saveBetaFinanceContractLiveConfusionValidationHistory') ||
  !html.includes('loadBetaFinanceContractLiveConfusionValidationHistoryFromLocalStorage') ||
  !html.includes('renderBetaFinanceContractLiveConfusionValidationHistory') ||
  !html.includes('clearBetaFinanceContractLiveConfusionValidationHistory') ||
  !html.includes('beta_finance_contract_live_confusion_validation_history') ||
  !html.includes('live_confusion_validation_metadata_history_only') ||
  !html.includes('No raw live-confusion notes, issue excerpts, secrets, payment data, identity data, signed contract text, XPR signatures, provider/legal decisions, public beta approvals, external follow-up approvals, production approvals, external sends, or live-action approvals are stored in this history.')
) {
  fail('Controlled Beta Readiness UI must keep beta finance/contract live-confusion validation history as browser-local metadata only');
}
if (
  !html.includes('Beta Finance Contract Reviewer Note Validation') ||
  !html.includes('betaFinanceContractReviewerNoteInput') ||
  !html.includes('validateBetaFinanceContractReviewerNote') ||
  !html.includes('/api/admin/beta-readiness/finance-contract-walkthrough/reviewer-note/validate') ||
  !html.includes('renderBetaFinanceContractReviewerNoteValidation') ||
  !html.includes('SAFE_REVIEWER_NOTE')
) {
  fail('Controlled Beta Readiness UI must expose local beta finance/contract reviewer note validation before issue handoff');
}

const betaFinanceReviewerNoteValidationStart = html.indexOf('function renderBetaFinanceContractReviewerNoteValidation');
const betaFinanceReviewerNoteValidationEnd = html.indexOf('async function validateBetaFinanceContractLiveConfusion', betaFinanceReviewerNoteValidationStart);
const betaFinanceReviewerNoteValidationSource = betaFinanceReviewerNoteValidationStart === -1 || betaFinanceReviewerNoteValidationEnd === -1
  ? ''
  : html.slice(betaFinanceReviewerNoteValidationStart, betaFinanceReviewerNoteValidationEnd);
if (
  !betaFinanceReviewerNoteValidationSource ||
  !betaFinanceReviewerNoteValidationSource.includes("['Request ID Header', data.request_id_header || 'pending']") ||
  !betaFinanceReviewerNoteValidationSource.includes("['Request path', data.request_path || '/api/admin/beta-readiness/finance-contract-walkthrough/reviewer-note/validate']") ||
  !betaFinanceReviewerNoteValidationSource.includes("['Request method', data.request_method || 'POST']") ||
  !betaFinanceReviewerNoteValidationSource.includes("['HTTP status', data.http_status || 'pending']") ||
  !betaFinanceReviewerNoteValidationSource.includes("Request ID Header: ${escapeHtml(data.request_id_header || 'pending')}") ||
  !betaFinanceReviewerNoteValidationSource.includes("Request path: ${escapeHtml(data.request_path || '/api/admin/beta-readiness/finance-contract-walkthrough/reviewer-note/validate')}") ||
  !betaFinanceReviewerNoteValidationSource.includes("Request method: ${escapeHtml(data.request_method || 'POST')}") ||
  !betaFinanceReviewerNoteValidationSource.includes("HTTP status: ${escapeHtml(data.http_status || 'pending')}")
) {
  fail('Controlled Beta Readiness UI must render full request trace metadata for reviewer-note validation');
}
if (
  !html.includes('Beta Finance Contract Reviewer Note Validation History') ||
  !html.includes('betaFinanceContractReviewerNoteValidationHistorySummary') ||
  !html.includes('betaFinanceContractReviewerNoteValidationHistoryGrid') ||
  !html.includes('clearBetaFinanceContractReviewerNoteValidationHistoryBtn') ||
  !html.includes('BETA_FINANCE_CONTRACT_REVIEWER_NOTE_VALIDATION_HISTORY_KEY') ||
  !html.includes('betaFinanceContractReviewerNoteValidationHistory') ||
  !html.includes('saveBetaFinanceContractReviewerNoteValidationHistory') ||
  !html.includes('loadBetaFinanceContractReviewerNoteValidationHistoryFromLocalStorage') ||
  !html.includes('renderBetaFinanceContractReviewerNoteValidationHistory') ||
  !html.includes('clearBetaFinanceContractReviewerNoteValidationHistory') ||
  !html.includes('reviewer_note_validation_metadata_history_only') ||
  !html.includes('No raw reviewer notes, issue excerpts, secrets, payment data, identity data, signed contract text, XPR signatures, provider/legal decisions, public beta approvals, production approvals, external sends, or live-action approvals are stored in this history.')
) {
  fail('Controlled Beta Readiness UI must keep beta finance/contract reviewer note validation history as browser-local metadata only');
}
if (
  !html.includes('Beta Finance Contract Debrief Draft Validation') ||
  !html.includes('betaFinanceContractDebriefDraftInput') ||
  !html.includes('validateBetaFinanceContractDebriefDraft') ||
  !html.includes('/api/admin/beta-readiness/finance-contract-walkthrough/debrief/validate') ||
  !html.includes('renderBetaFinanceContractDebriefDraftValidation') ||
  !html.includes('input_limit_warnings') ||
  !html.includes('debrief_draft_recovery_actions') ||
  !html.includes('Draft Limits And Recovery') ||
  !html.includes('SAFE_DEBRIEF_NOTE') ||
  !html.includes('data.tester_finance_contract_walkthrough_debrief_packet')
) {
  fail('Controlled Beta Readiness UI must expose local beta finance/contract debrief draft validation before issue handoff');
}

const betaFinanceDebriefDraftValidationStart = html.indexOf('function renderBetaFinanceContractDebriefDraftValidation');
const betaFinanceDebriefDraftValidationEnd = html.indexOf('async function loadAuthReadiness', betaFinanceDebriefDraftValidationStart);
const betaFinanceDebriefDraftValidationSource = betaFinanceDebriefDraftValidationStart === -1 || betaFinanceDebriefDraftValidationEnd === -1
  ? ''
  : html.slice(betaFinanceDebriefDraftValidationStart, betaFinanceDebriefDraftValidationEnd);
if (
  !betaFinanceDebriefDraftValidationSource ||
  !betaFinanceDebriefDraftValidationSource.includes("['Request ID Header', data.request_id_header || 'pending']") ||
  !betaFinanceDebriefDraftValidationSource.includes("['Request path', data.request_path || '/api/admin/beta-readiness/finance-contract-walkthrough/debrief/validate']") ||
  !betaFinanceDebriefDraftValidationSource.includes("['Request method', data.request_method || 'POST']") ||
  !betaFinanceDebriefDraftValidationSource.includes("['HTTP status', data.http_status || 'pending']") ||
  !betaFinanceDebriefDraftValidationSource.includes("Request ID Header: ${escapeHtml(data.request_id_header || 'pending')}") ||
  !betaFinanceDebriefDraftValidationSource.includes("Request path: ${escapeHtml(data.request_path || '/api/admin/beta-readiness/finance-contract-walkthrough/debrief/validate')}") ||
  !betaFinanceDebriefDraftValidationSource.includes("Request method: ${escapeHtml(data.request_method || 'POST')}") ||
  !betaFinanceDebriefDraftValidationSource.includes("HTTP status: ${escapeHtml(data.http_status || 'pending')}")
) {
  fail('Controlled Beta Readiness UI must render full request trace metadata for debrief draft validation');
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
if (
  !html.includes('Founder Live Blocker Handoff Pack') ||
  !html.includes('data.founder_live_blocker_handoff_pack') ||
  !html.includes('Direct read-only endpoint: /api/admin/founder-live-blocker-handoff-pack') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('founder_live_blocker_handoff_pack')") ||
  !html.includes("setRequestTraceReportSourceSurface('founder_live_blocker_handoff_pack')") ||
  !html.includes('Open live blocker handoff evidence export source') ||
  !html.includes('Select live blocker handoff in Request Trace')
) {
  fail('Controlled Beta Readiness UI must show backend founder_live_blocker_handoff_pack');
}
if (!html.includes('Founder Evening Action Summary') || !html.includes('data.founder_evening_action_summary')) {
  fail('Controlled Beta Readiness UI must show backend founder_evening_action_summary');
}
if (!html.includes('Founder Evening Decision Matrix') || !html.includes('data.founder_evening_decision_matrix')) {
  fail('Controlled Beta Readiness UI must show backend founder_evening_decision_matrix');
}
if (!html.includes('Founder Evening Command Board') || !html.includes('data.founder_evening_command_board')) {
  fail('Controlled Beta Readiness UI must show backend founder_evening_command_board');
}
if (
  !html.includes('Founder Handoff Today') ||
  !html.includes('data.founder_handoff_today') ||
  !html.includes('Use this compact handoff for the 2026-06-04 founder review') ||
  !html.includes('Direct read-only endpoint: /api/admin/founder-handoff-today') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('founder_handoff_today')") ||
  !html.includes("setRequestTraceReportSourceSurface('founder_handoff_today')") ||
  !html.includes('Required report fields') ||
  !html.includes('No live Supabase write attempted') ||
  !html.includes('No public file edit attempted') ||
  !html.includes('No live finance action attempted') ||
  !html.includes('No legal/provider decision attempted') ||
  !html.includes('No production release attempted')
) {
  fail('Controlled Beta Readiness UI must show founder_handoff_today with report fields and no-live boundaries');
}
if (
  !html.includes('Week 1 Closeout -> Week 2 Handoff') ||
  !html.includes('data.week_one_closeout_handoff') ||
  !html.includes('Direct read-only endpoint: /api/admin/week-one-closeout-handoff') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_one_closeout_handoff')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_one_closeout_handoff')") ||
  !html.includes('Open Week 1 closeout evidence export source') ||
  !html.includes('Select Week 1 closeout in Request Trace') ||
  !html.includes('No deploy setting change attempted') ||
  !html.includes('No live action attempted')
) {
  fail('Controlled Beta Readiness UI must show week_one_closeout_handoff with Week 2 handoff actions and no-live boundaries');
}
if (
  !html.includes('Investor/Founder Package Readiness') ||
  !html.includes('data.investor_founder_package_readiness') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('investor_founder_package_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('investor_founder_package_readiness')") ||
  !html.includes('Open investor package evidence export source') ||
  !html.includes('Select investor package in Request Trace') ||
  !html.includes('Required phrase') ||
  !html.includes('Blocked claims') ||
  !html.includes('No external send attempted') ||
  !html.includes('No legal/provider decision attempted') ||
  !html.includes('No live action attempted')
) {
  fail('Controlled Beta Readiness UI must show investor_founder_package_readiness with package artifacts, claim review, send-stop phrase, and no-live boundaries');
}
if (
  !html.includes('Week 2 Investor/Founder Package Alignment') ||
  !html.includes('data.week_two_investor_founder_package_alignment') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_investor_founder_package_alignment')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_investor_founder_package_alignment')") ||
  !html.includes('Alignment area: ${escapeHtml(item.alignment_area') ||
  !html.includes('Founder report fields: ${escapeHtml((item.founder_report_fields || []).join') ||
  !html.includes('No investor outreach attempted') ||
  !html.includes('No FIO registration attempted') ||
  !html.includes('No external send, investor outreach, grant submission, provider/attorney outreach, public claim approval, live finance claim, real payment, real loan, real escrow, stablecoin settlement, token collateral, token custody, XPR signature, FIO registration, AI authority claim, legal/provider decision, or production action is approved.')
) {
  fail('Controlled Beta Readiness UI must show week_two_investor_founder_package_alignment with alignment areas, report fields, shortcuts, and no-outreach/no-publication/no-finance/no-XPR/FIO/no-live boundaries');
}
if (
  !html.includes('Week 2 Investor/Founder Package Execution Checklist') ||
  !html.includes('data.week_two_investor_founder_package_execution_checklist') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_investor_founder_package_execution_checklist')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_investor_founder_package_execution_checklist')") ||
  !html.includes('Execution phase: ${escapeHtml(item.execution_phase') ||
  !html.includes('Review area: ${escapeHtml(item.review_area') ||
  !html.includes('Founder report fields: ${escapeHtml((item.founder_report_fields || []).join') ||
  !html.includes('No recipient contact data requested') ||
  !html.includes('No recipient contact data, external send, investor outreach, grant submission, provider/attorney outreach, publication, public URL share, public claim approval, live finance, real payment, real loan, real escrow, stablecoin settlement, token collateral, token custody, XPR signature, FIO registration, AI authority claim, legal/provider decision, production, or live action is approved.')
) {
  fail('Controlled Beta Readiness UI must show week_two_investor_founder_package_execution_checklist with execution phases, report fields, shortcuts, and no-recipient/no-outreach/no-publication/no-finance/no-XPR/FIO/no-live boundaries');
}
if (
  !html.includes('Week 2 Local Validation Pass Readiness') ||
  !html.includes('data.week_two_local_validation_pass_readiness') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_local_validation_pass_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_local_validation_pass_readiness')") ||
  !html.includes('Validation phase: ${escapeHtml(item.validation_phase') ||
  !html.includes('Required commands: ${escapeHtml((item.required_commands || []).join') ||
  !html.includes('No strict RLS apply attempted') ||
  !html.includes('No destructive git action attempted') ||
  !html.includes('No secrets, live Supabase writes, strict RLS apply, external account changes, deploy settings, public file edits, public URL sharing, tester invites, live finance, XPR/FIO actions, legal/provider decisions, destructive git actions, production, or live actions are approved.')
) {
  fail('Controlled Beta Readiness UI must show week_two_local_validation_pass_readiness with validation phases, required commands, shortcuts, and no-live/no-public/no-destructive boundaries');
}
if (
  !html.includes('Week 2 Local Validation Pass Execution Checklist') ||
  !html.includes('data.week_two_local_validation_pass_execution_checklist') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_local_validation_pass_execution_checklist')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_local_validation_pass_execution_checklist')") ||
  !html.includes('Execution phase: ${escapeHtml(item.execution_phase') ||
  !html.includes('Review area: ${escapeHtml(item.review_area') ||
  !html.includes('Required commands: ${escapeHtml((item.required_commands || []).join') ||
  !html.includes('No external send attempted') ||
  !html.includes('No secrets, live Supabase writes, strict RLS apply, external account changes, deploy settings, public file edits, public URL sharing, tester invites, live finance, XPR/FIO actions, legal/provider decisions, destructive git actions, production, or live actions are approved.')
) {
  fail('Controlled Beta Readiness UI must show week_two_local_validation_pass_execution_checklist with execution phases, required commands, shortcuts, and no-live/no-public/no-destructive boundaries');
}
if (
  !html.includes('Week 2 Two-Week Closeout Readiness') ||
  !html.includes('data.week_two_two_week_closeout_readiness') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_two_week_closeout_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_two_week_closeout_readiness')") ||
  !html.includes('Checklist phase: ${escapeHtml(item.checklist_phase') ||
  !html.includes('Required evidence: ${escapeHtml((item.required_evidence || []).join') ||
  !html.includes('No Magic Link URL requested') ||
  !html.includes('No admin membership insert attempted') ||
  !html.includes('No external send attempted') ||
  !html.includes('No secrets, Magic Link URLs, service-role keys, live Supabase writes, admin membership inserts, strict RLS apply, external account changes, deploy settings, public file edits, public URL sharing, tester invites, external sends, live finance, real payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR/FIO actions, legal/provider decisions, mobile store/signing actions, destructive git actions, production, or live actions are approved.')
) {
  fail('Controlled Beta Readiness UI must show week_two_two_week_closeout_readiness with closeout phases, required evidence, shortcuts, and no-secret/no-live/no-public/no-external/no-finance/no-XPR/FIO boundaries');
}
if (
  !html.includes('Homepage Publication Sequence Gate') ||
  !html.includes('data.homepage_publication_sequence_gate') ||
  !html.includes('Copy approval, PUBLICATION_GO, public file replacement, deploy setup, URL smoke evidence, and invite/share approval stay separate.') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('homepage_publication_sequence_gate')") ||
  !html.includes("setRequestTraceReportSourceSurface('homepage_publication_sequence_gate')") ||
  !html.includes('No public homepage edit attempted') ||
  !html.includes('No deploy setting change attempted') ||
  !html.includes('No public URL share attempted')
) {
  fail('Controlled Beta Readiness UI must show homepage_publication_sequence_gate with separated publication/deploy/share approvals, export preview shortcuts, Request Trace shortcuts, and no-live boundaries');
}
if (
  !html.includes('Homepage Publication Review Packet') ||
  !html.includes('homepage_publication_review_packet') ||
  !html.includes('Safe public promise') ||
  !html.includes('Required decisions') ||
  !html.includes('Blocked public claims') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('homepage_publication_review_packet')") ||
  !html.includes("setRequestTraceReportSourceSurface('homepage_publication_review_packet')") ||
  !html.includes('No public homepage edit attempted') ||
  !html.includes('No live action attempted')
) {
  fail('Controlled Beta Readiness UI must show homepage_publication_review_packet with founder decisions, safe public promise, blocked claims, and no-live boundaries');
}
if (
  !html.includes('Homepage Publication Decision Summary') ||
  !html.includes('homepage_publication_decision_summary') ||
  !html.includes('Current candidate') ||
  !html.includes('Recommended founder response') ||
  !html.includes('Current public state') ||
  !html.includes('Ready local evidence') ||
  !html.includes('Remaining blockers') ||
  !html.includes('Next safe actions') ||
  !html.includes('Use this summary as the founder-facing state') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('homepage_publication_decision_summary')") ||
  !html.includes("setRequestTraceReportSourceSurface('homepage_publication_decision_summary')") ||
  !html.includes('No tester invite attempted') ||
  !html.includes('No live action attempted')
) {
  fail('Controlled Beta Readiness UI must show homepage_publication_decision_summary with candidate, recommended founder response, public state, blockers, next safe actions, and no-live boundaries');
}
if (
  !html.includes('Homepage Founder Decision Script') ||
  !html.includes('data.homepage_publication_founder_decision_script') ||
  !html.includes('What it allows') ||
  !html.includes('What it does not allow') ||
  !html.includes('Required before next step') ||
  !html.includes('Source docs') ||
  !html.includes('Decision rows are not approvals') ||
  !html.includes('No public homepage edit attempted') ||
  !html.includes('No live action attempted')
) {
  fail('Controlled Beta Readiness UI must show homepage_publication_founder_decision_script with exact phrases, allowed/not-allowed outcomes, source docs, and no-live boundaries');
}
if (
  !html.includes('Homepage Publication Evidence Checklist') ||
  !html.includes('function homepageEvidenceBadgeClass(evidenceState)') ||
  !html.includes('homepageEvidenceBadgeClass(item.evidence_state)') ||
  !html.includes('data.homepage_publication_evidence_checklist') ||
  !html.includes('Checklist states are not approvals') ||
  !html.includes('Required before') ||
  !html.includes('Current blocker') ||
  !html.includes('No public URL share attempted') ||
  !html.includes('No live action attempted')
) {
  fail('Controlled Beta Readiness UI must show homepage_publication_evidence_checklist with pending evidence, blockers, and no-live boundaries');
}
if (
  !html.includes('Homepage Static Asset Candidate') ||
  !html.includes('data.homepage_static_asset_candidate') ||
  !html.includes('homepageEvidenceBadgeClass(item.candidate_state)') ||
  !html.includes('Static candidate states are not approvals') ||
  !html.includes('Source file') ||
  !html.includes('Validator') ||
  !html.includes('Evidence source') ||
  !html.includes('Asset posture') ||
  !html.includes('Browser evidence') ||
  !html.includes('QA caveat') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('homepage_static_asset_candidate')") ||
  !html.includes("setRequestTraceReportSourceSurface('homepage_static_asset_candidate')") ||
  !html.includes('Open static asset candidate evidence export source') ||
  !html.includes('Select static asset candidate in Request Trace') ||
  !html.includes('No tester invite attempted') ||
  !html.includes('No live action attempted')
) {
  fail('Controlled Beta Readiness UI must show homepage_static_asset_candidate with source file, validator, asset posture, Browser evidence, caveat, and no-live boundaries');
}
if (
  !html.includes('Homepage Final Public QA Hold') ||
  !html.includes('data.homepage_publication_final_qa_hold') ||
  !html.includes('homepageEvidenceBadgeClass(item.hold_state)') ||
  !html.includes('Final QA hold states are not approvals') ||
  !html.includes('Candidate file') ||
  !html.includes('Public target file') ||
  !html.includes('Publication allowed') ||
  !html.includes('Required before PUBLICATION_GO') ||
  !html.includes('Already prepared local evidence') ||
  !html.includes('Current hold reason') ||
  !html.includes('No archive execution attempted') ||
  !html.includes('No tester invite attempted') ||
  !html.includes('No live action attempted') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('homepage_publication_final_qa_hold')") ||
  !html.includes('Open final QA hold evidence export source') ||
  !html.includes("setRequestTraceReportSourceSurface('homepage_publication_final_qa_hold')") ||
  !html.includes('Select final QA hold in Request Trace')
) {
  fail('Controlled Beta Readiness UI must show homepage_publication_final_qa_hold with final QA blockers, exact candidate, publication_allowed false, review shortcuts, and no-public/no-live boundaries');
}
if (
  !html.includes('Deployment Next Step Readiness') ||
  !html.includes('data.deployment_next_step_readiness') ||
  !html.includes('Use these rows before turning local homepage/app readiness into Vercel, GitHub Pages, DNS, Supabase redirect, public URL, or tester-invite action.') ||
  !html.includes('Direct read-only endpoint: /api/admin/deployment-next-step-readiness') ||
  !html.includes('No external account change attempted') ||
  !html.includes('No deploy setting change attempted') ||
  !html.includes('No DNS change attempted') ||
  !html.includes('No Supabase redirect change attempted') ||
  !html.includes('No public URL share attempted') ||
  !html.includes('No tester invite attempted') ||
  !html.includes('No live action attempted') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('deployment_next_step_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('deployment_next_step_readiness')") ||
  !html.includes('Open deployment readiness evidence export source') ||
  !html.includes('Select deployment readiness in Request Trace')
) {
  fail('Controlled Beta Readiness UI must show deployment_next_step_readiness with external account, deploy, DNS, Supabase redirect, URL share, tester invite, and no-live boundaries');
}
if (
  !html.includes('Week 2 Deployment/Public Beta Readiness') ||
  !html.includes('data.week_two_deployment_public_beta_readiness') ||
  !html.includes('Use this combined local checklist before founder-controlled deploy target review, public URL smoke evidence, Supabase redirect/env ownership, or tester invite decisions.') ||
  !html.includes('Direct read-only endpoint: /api/admin/week-two-deployment-public-beta-readiness') ||
  !html.includes('No external account login attempted') ||
  !html.includes('No public beta flip attempted') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_deployment_public_beta_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_deployment_public_beta_readiness')") ||
  !html.includes('Open Week 2 deploy/public beta evidence export source') ||
  !html.includes('Select Week 2 deploy/public beta in Request Trace')
) {
  fail('Controlled Beta Readiness UI must show week_two_deployment_public_beta_readiness with deploy target, URL smoke, Supabase redirect/env, invite gate, shortcuts, and no-live boundaries');
}
if (
  !html.includes('Week 2 Deployment/Public Beta Execution Checklist') ||
  !html.includes('weekTwoDeploymentPublicBetaExecutionChecklistCount') ||
  !html.includes('data.week_two_deployment_public_beta_execution_checklist') ||
  !html.includes('Use this local-only checklist after founder report-back for deploy account ownership, redacted public URL smoke evidence, invite request hold, and Supabase redirect/env change hold.') ||
  !html.includes('Direct read-only endpoint: /api/admin/week-two-deployment-public-beta-execution-checklist') ||
  !html.includes('No external account session storage attempted') ||
  !html.includes('No real public URL storage attempted') ||
  !html.includes('No live Supabase write attempted') ||
  !html.includes('No XPR signature attempted') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_deployment_public_beta_execution_checklist')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_deployment_public_beta_execution_checklist')") ||
  !html.includes('Open Week 2 deploy/public beta execution evidence export source') ||
  !html.includes('Select Week 2 deploy/public beta execution in Request Trace')
) {
  fail('Controlled Beta Readiness UI must show week_two_deployment_public_beta_execution_checklist with account report-back, URL smoke, invite hold, Supabase env hold, shortcuts, and no-live boundaries');
}
if (
  !html.includes("const legalProviderNextStepReadinessCount = (data.legal_provider_next_step_readiness || []).length") ||
  !html.includes("['Legal/provider next', legalProviderNextStepReadinessCount]") ||
  !html.includes('Legal/Provider Next Step Readiness') ||
  !html.includes('data.legal_provider_next_step_readiness') ||
  !html.includes('Use these rows before turning local working-capital, escrow/payment, ClaimBridge/advance, or token-collateral questions into attorney/provider review packets.') ||
  !html.includes('Direct read-only endpoint: /api/admin/legal-provider-next-step-readiness') ||
  !html.includes('Review area') ||
  !html.includes('Supporting sources') ||
  !html.includes('No provider commitment attempted') ||
  !html.includes('No legal decision attempted') ||
  !html.includes('No live finance action attempted') ||
  !html.includes('No XPR signature attempted') ||
  !html.includes('No live action attempted') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('legal_provider_next_step_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('legal_provider_next_step_readiness')") ||
  !html.includes('Open legal/provider readiness evidence export source') ||
  !html.includes('Select legal/provider readiness in Request Trace')
) {
  fail('Controlled Beta Readiness UI must show legal_provider_next_step_readiness with question areas, supporting sources, direct endpoint, and no-legal/no-provider/no-finance/no-XPR/no-live boundaries');
}
if (
  !html.includes("const weekTwoLegalProviderReadinessCount = (data.week_two_legal_provider_readiness || []).length") ||
  !html.includes("['Week 2 legal/provider', weekTwoLegalProviderReadinessCount]") ||
  !html.includes('Week 2 Legal/Provider Readiness') ||
  !html.includes('data.week_two_legal_provider_readiness') ||
  !html.includes('Use this combined Week 2 checklist before working-capital, escrow/payment, ClaimBridge/advance, or token-collateral questions move toward attorney/provider review.') ||
  !html.includes('Direct read-only endpoint: /api/admin/week-two-legal-provider-readiness') ||
  !html.includes('Phase: ${escapeHtml(item.checklist_phase') ||
  !html.includes('Founder report fields: ${escapeHtml((item.founder_report_fields') ||
  !html.includes('Linked surfaces: ${escapeHtml((item.linked_surfaces') ||
  !html.includes('No provider submission attempted') ||
  !html.includes('No smart-contract deployment attempted') ||
  !html.includes('No public claim approval attempted') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_legal_provider_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_legal_provider_readiness')") ||
  !html.includes('Open Week 2 legal/provider evidence export source') ||
  !html.includes('Select Week 2 legal/provider in Request Trace')
) {
  fail('Controlled Beta Readiness UI must show week_two_legal_provider_readiness with phases, linked surfaces, direct endpoint, shortcuts, and no-legal/no-provider/no-finance/no-XPR/no-live boundaries');
}
if (
  !html.includes("const publicBetaNextStepReadinessCount = (data.public_beta_next_step_readiness || []).length") ||
  !html.includes("['Public beta next', publicBetaNextStepReadinessCount]") ||
  !html.includes('Public Beta Next Step Readiness') ||
  !html.includes('data.public_beta_next_step_readiness') ||
  !html.includes('Use these rows before turning local readiness into public beta scope, URL smoke, invite approval, or support/triage action.') ||
  !html.includes('Direct read-only endpoint: /api/admin/public-beta-next-step-readiness') ||
  !html.includes('Review area') ||
  !html.includes('Required phrase') ||
  !html.includes('No external send attempted') ||
  !html.includes('No public URL share attempted') ||
  !html.includes('No tester invite attempted') ||
  !html.includes('No deploy setting change attempted') ||
  !html.includes('No Supabase redirect change attempted') ||
  !html.includes('No live finance action attempted') ||
  !html.includes('No legal/provider decision attempted') ||
  !html.includes('No production release attempted') ||
  !html.includes('No live action attempted') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('public_beta_next_step_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('public_beta_next_step_readiness')") ||
  !html.includes('Open public beta readiness evidence export source') ||
  !html.includes('Select public beta readiness in Request Trace')
) {
  fail('Controlled Beta Readiness UI must show public_beta_next_step_readiness with scope, URL smoke, invite approval, support triage, direct endpoint, and no-share/no-invite/no-live boundaries');
}
if (
  !html.includes("const publicBetaNextStepExecutionChecklistCount = (data.public_beta_next_step_execution_checklist || []).length") ||
  !html.includes("['Public beta execution', publicBetaNextStepExecutionChecklistCount]") ||
  !html.includes('Public Beta Next-Step Execution Checklist') ||
  !html.includes('data.public_beta_next_step_execution_checklist') ||
  !html.includes('Use this local-only checklist after founder reports public beta scope, redacted URL smoke, invite request, or support-triage evidence.') ||
  !html.includes('Direct read-only endpoint: /api/admin/public-beta-next-step-execution-checklist') ||
  !html.includes('Execution phase: ${escapeHtml(item.execution_phase') ||
  !html.includes('Founder report fields: ${escapeHtml((item.founder_report_fields') ||
  !html.includes('Linked surfaces: ${escapeHtml((item.linked_surfaces') ||
  !html.includes('No sensitive data collection attempted') ||
  !html.includes('No live Supabase write attempted') ||
  !html.includes('No XPR signature attempted') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('public_beta_next_step_execution_checklist')") ||
  !html.includes("setRequestTraceReportSourceSurface('public_beta_next_step_execution_checklist')") ||
  !html.includes('Open public beta execution evidence export source') ||
  !html.includes('Select public beta execution in Request Trace')
) {
  fail('Controlled Beta Readiness UI must show public_beta_next_step_execution_checklist with execution phases, linked surfaces, shortcuts, and no-launch/no-share/no-invite/no-live boundaries');
}
if (
  !html.includes('Homepage Final QA Preflight') ||
  !html.includes('homepagePublicationFinalQaPreflight') ||
  !html.includes('loadHomepagePublicationFinalQaPreflightBtn') ||
  !html.includes("api('/api/admin/homepage-publication-final-qa-preflight'") ||
  !html.includes('Homepage Final QA Preflight Snapshot') ||
  !html.includes('Publication allowed') ||
  !html.includes('Candidate SHA256') ||
  !html.includes('Public index.html SHA256') ||
  !html.includes('Blocked claims found') ||
  !html.includes('External asset URLs') ||
  !html.includes('Missing first viewport signals') ||
  !html.includes('Required first viewport signals') ||
  !html.includes('SmartContractor by GCSC') ||
  !html.includes('Homepage Evidence Rail') ||
  !html.includes('Project intake') ||
  !html.includes('Milestone evidence') ||
  !html.includes('Dispute packet') ||
  !html.includes('Provider review data') ||
  !html.includes('Missing product section signals') ||
  !html.includes('Required product section signals') ||
  !html.includes('traditional product review order') ||
  !html.includes('Missing integration port signals') ||
  !html.includes('Required integration port signals') ||
  !html.includes('integration readiness ports') ||
  !html.includes('Visual style findings') ||
  !html.includes('Missing visual tokens') ||
  !html.includes('Required visual tokens') ||
  !html.includes('Required Browser viewports') ||
  !html.includes('desktop_first_viewport_hero_fit') ||
  !html.includes('mobile_first_viewport_hero_fit') ||
  !html.includes('1280 x 720') ||
  !html.includes('390 x 844') ||
  !html.includes('Required next evidence') ||
  !html.includes('publication_allowed=false') ||
  !html.includes('No archive execution attempted') ||
  !html.includes('does not store, send, deploy, archive, invite, or move money')
) {
  fail('Controlled Beta Readiness UI must show homepage final QA preflight with hashes, claim/asset scans, required evidence, publication_allowed false, and no-live boundaries');
}
if (
  !authSmoke.includes('tester_finance_contract_boundary_pack') ||
  !authSmoke.includes('demo_only_finance_contract_boundary_pack') ||
  !authSmoke.includes('No real payments') ||
  !authSmoke.includes('No signed contract') ||
  !authSmoke.includes('No token collateral')
) {
  fail('Auth smoke must runtime-check the beta readiness tester finance/contract boundary pack');
}
if (
  !authSmoke.includes('tester_finance_contract_walkthrough_script') ||
  !authSmoke.includes('Finance/contract walkthrough opening') ||
  !authSmoke.includes('Payment router checkpoint') ||
  !authSmoke.includes('Starter-loan checkpoint') ||
  !authSmoke.includes('Milestone/escrow checkpoint') ||
  !authSmoke.includes('Smart contract review checkpoint')
) {
  fail('Auth smoke must runtime-check the beta readiness tester finance/contract walkthrough script');
}
if (
  !authSmoke.includes('tester_finance_contract_walkthrough_triage_matrix') ||
  !authSmoke.includes('Real-money expectation triage') ||
  !authSmoke.includes('Sensitive data entry triage') ||
  !authSmoke.includes('Binding contract expectation triage') ||
  !authSmoke.includes('Escrow or refund expectation triage') ||
  !authSmoke.includes('Smart contract live-action expectation triage')
) {
  fail('Auth smoke must runtime-check the beta readiness tester finance/contract walkthrough triage matrix');
}
if (
  !authSmoke.includes('tester_finance_contract_walkthrough_debrief_packet') ||
  !authSmoke.includes('Finance/contract debrief summary') ||
  !authSmoke.includes('Boundary clarity rating') ||
  !authSmoke.includes('Confusion triage summary') ||
  !authSmoke.includes('Safe issue handoff') ||
  !authSmoke.includes('Founder review hold')
) {
  fail('Auth smoke must runtime-check the beta readiness tester finance/contract walkthrough debrief packet');
}
if (
  !authSmoke.includes('tester_finance_contract_reviewer_notes') ||
  !authSmoke.includes('reviewer_demo_boundary_prompt') ||
  !authSmoke.includes('reviewer_must_capture_request_id') ||
  !authSmoke.includes('reviewer_stop_before_live_action') ||
  !authSmoke.includes('SAFE_REVIEWER_NOTE')
) {
  fail('Auth smoke must runtime-check the beta readiness tester finance/contract reviewer notes');
}
if (
  !authSmoke.includes('tester_finance_contract_live_confusion_safety_pack') ||
  !authSmoke.includes('live_confusion_preflight_check') ||
  !authSmoke.includes('live_confusion_stop_script') ||
  !authSmoke.includes('live_confusion_safe_issue_handoff') ||
  !authSmoke.includes('LIVE_CONFUSION_REVIEW_ONLY') ||
  !authSmoke.includes('no_public_beta_flip') ||
  !authSmoke.includes('no_external_followup')
) {
  fail('Auth smoke must runtime-check the beta readiness tester finance/contract live-confusion safety pack');
}
if (
  !authSmoke.includes('tester_finance_contract_session_safety_checklist') ||
  !authSmoke.includes('session_safety_preflight') ||
  !authSmoke.includes('session_safety_during_walkthrough') ||
  !authSmoke.includes('session_safety_handoff') ||
  !authSmoke.includes('FINANCE_CONTRACT_SESSION_SAFETY') ||
  !authSmoke.includes('required_safe_evidence') ||
  !authSmoke.includes('stop_if') ||
  !authSmoke.includes('no_server_storage_attempted') ||
  !authSmoke.includes('no_external_followup_attempted') ||
  !authSmoke.includes('no_public_beta_flip_attempted') ||
  !authSmoke.includes('no_live_action_attempted')
) {
  fail('Auth smoke must runtime-check the beta readiness tester finance/contract session safety checklist');
}
if (
  !authSmoke.includes('tester_finance_contract_safe_handoff_summary') ||
  !authSmoke.includes('finance_contract_safe_handoff_summary') ||
  !authSmoke.includes('FINANCE_CONTRACT_SAFE_HANDOFF_SUMMARY') ||
  !authSmoke.includes('metadata_only_history_sources') ||
  !authSmoke.includes('beta_finance_contract_session_safety_validation_history') ||
  !authSmoke.includes('beta_finance_contract_live_confusion_validation_history') ||
  !authSmoke.includes('beta_finance_contract_reviewer_note_validation_history') ||
  !authSmoke.includes('beta_finance_contract_safe_handoff_report_history') ||
  !authSmoke.includes('no_external_export_attempted')
) {
  fail('Auth smoke must runtime-check the beta readiness tester finance/contract safe handoff summary');
}
if (
  !authSmoke.includes('/api/admin/beta-readiness/finance-contract-walkthrough/session-safety/validate') ||
  !authSmoke.includes('local_beta_finance_contract_session_safety_validation') ||
  !authSmoke.includes('safe_local_session_safety_review') ||
  !authSmoke.includes('session_safety_blocked_for_redaction') ||
  !authSmoke.includes('FINANCE_CONTRACT_SESSION_SAFETY') ||
  !authSmoke.includes('no_session_safety_note_storage') ||
  !authSmoke.includes('no_external_followup_attempted') ||
  !authSmoke.includes('no_public_beta_flip')
) {
  fail('Auth smoke must runtime-check beta finance/contract session-safety validation safe and blocked paths');
}
if (
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=beta_finance_contract_session_safety_validation_history') ||
  !authSmoke.includes('beta_finance_contract_session_safety_validation_history') ||
  !authSmoke.includes('betaFinanceContractSessionSafetyValidationHistoryGrid') ||
  !authSmoke.includes('session_safety_validation_metadata_history_only') ||
  !authSmoke.includes('raw_session_safety_note') ||
  !authSmoke.includes('session_safety_issue_excerpt')
) {
  fail('Auth smoke must runtime-check beta finance/contract session-safety validation history evidence export source');
}
if (
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=beta_finance_contract_safe_handoff_report_history') ||
  !authSmoke.includes('beta_finance_contract_safe_handoff_report_history') ||
  !authSmoke.includes('betaFinanceContractSafeHandoffReportHistoryGrid') ||
  !authSmoke.includes('safe_handoff_report_metadata_history_only') ||
  !authSmoke.includes('copyable_markdown') ||
  !authSmoke.includes('issue_excerpts') ||
  !authSmoke.includes('stablecoin_approval') ||
  !authSmoke.includes('token_collateral_approval')
) {
  fail('Auth smoke must runtime-check beta finance/contract safe handoff report history evidence export source');
}
if (
  !authSmoke.includes('/api/admin/beta-readiness/finance-contract-walkthrough/live-confusion/validate') ||
  !authSmoke.includes('local_beta_finance_contract_live_confusion_validation') ||
  !authSmoke.includes('safe_local_live_confusion_review') ||
  !authSmoke.includes('live_confusion_blocked_for_redaction') ||
  !authSmoke.includes('LIVE_CONFUSION_REVIEW_ONLY') ||
  !authSmoke.includes('no_live_confusion_note_storage') ||
  !authSmoke.includes('no_public_beta_flip') ||
  !authSmoke.includes('no_external_followup')
) {
  fail('Auth smoke must runtime-check beta finance/contract live-confusion validation safe and blocked paths');
}
if (
  !authSmoke.includes('/api/admin/beta-readiness/public-copy/validate') ||
  !authSmoke.includes('gcsc-beta-public-copy-safe-smoke') ||
  !authSmoke.includes('gcsc-beta-public-copy-unsafe-smoke') ||
  !authSmoke.includes('local_beta_traditional_first_public_copy_validation') ||
  !authSmoke.includes('safe_traditional_first_public_copy') ||
  !authSmoke.includes('public_copy_blocked_for_redaction') ||
  !authSmoke.includes('web3_or_token_public_claim') ||
  !authSmoke.includes('no_public_copy_storage') ||
  !authSmoke.includes('no_public_website_edit_attempted') ||
  !authSmoke.includes('no_external_provider_claim_attempted')
) {
  fail('Auth smoke must runtime-check traditional-first public copy validation safe and blocked paths');
}
if (
  !authSmoke.includes('/api/admin/beta-readiness/homepage-publication-decision/validate') ||
  !authSmoke.includes('gcsc-homepage-decision-safe-smoke') ||
  !authSmoke.includes('gcsc-homepage-decision-publication-go-smoke') ||
  !authSmoke.includes('gcsc-homepage-decision-unsafe-smoke') ||
  !authSmoke.includes('local_beta_homepage_publication_decision_validation') ||
  !authSmoke.includes('safe_local_homepage_decision_hold') ||
  !authSmoke.includes('homepage_publication_go_detected_review_only') ||
  !authSmoke.includes('homepage_decision_blocked_for_redaction') ||
  !authSmoke.includes('publication_go_detected') ||
  !authSmoke.includes('no_decision_text_storage') ||
  !authSmoke.includes('no_public_replacement_attempted') ||
  !authSmoke.includes('no_deploy_attempted') ||
  !authSmoke.includes('no_url_share_attempted') ||
  !authSmoke.includes('no_tester_invite_attempted')
) {
  fail('Auth smoke must runtime-check homepage publication decision validation safe, PUBLICATION_GO review-only, and blocked paths');
}
if (
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=homepage_publication_decision_validation_history') ||
  !authSmoke.includes('gcsc-admin-evidence-export-preview-homepage-decision-history-smoke') ||
  !authSmoke.includes('homepage_publication_decision_validation_history') ||
  !authSmoke.includes('homepagePublicationDecisionValidationHistoryGrid') ||
  !authSmoke.includes('homepage_publication_decision_validation_metadata_history_only') ||
  !authSmoke.includes('raw_founder_decision_text') ||
  !authSmoke.includes('publication_go_text') ||
  !authSmoke.includes('deploy_approval') ||
  !authSmoke.includes('No raw founder decision text, PUBLICATION_GO text, issue excerpts, secrets, payment data, identity data, provider/legal decisions, public replacement approvals, deploy approvals, URL-share approvals, tester-invite approvals, production approvals, external sends, or live-action approvals are stored in this history.')
) {
  fail('Auth smoke must runtime-check homepage publication decision validation history evidence export source');
}
if (
  !authSmoke.includes('/api/admin/beta-readiness/finance-contract-quickstart/acknowledgement/validate') ||
  !authSmoke.includes('gcsc-beta-finance-quickstart-ack-safe-smoke') ||
  !authSmoke.includes('gcsc-beta-finance-quickstart-ack-unsafe-smoke') ||
  !authSmoke.includes('local_beta_finance_contract_quickstart_acknowledgement_validation') ||
  !authSmoke.includes('safe_local_quickstart_acknowledgement') ||
  !authSmoke.includes('quickstart_acknowledgement_blocked_for_redaction') ||
  !authSmoke.includes('FINANCE_CONTRACT_TESTER_QUICKSTART') ||
  !authSmoke.includes('no_acknowledgement_storage') ||
  !authSmoke.includes('no_external_followup_attempted') ||
  !authSmoke.includes('no_public_beta_flip_attempted')
) {
  fail('Auth smoke must runtime-check beta finance/contract quickstart acknowledgement validation safe and blocked paths');
}
if (
  !authSmoke.includes('/api/admin/beta-readiness/finance-contract-walkthrough/reviewer-note/validate') ||
  !authSmoke.includes('local_beta_finance_contract_reviewer_note_validation') ||
  !authSmoke.includes('safe_local_reviewer_note') ||
  !authSmoke.includes('reviewer_note_blocked_for_redaction') ||
  !authSmoke.includes('SAFE_REVIEWER_NOTE') ||
  !authSmoke.includes('no_reviewer_note_storage') ||
  !authSmoke.includes('no_live_action_attempted')
) {
  fail('Auth smoke must runtime-check beta finance/contract reviewer note validation safe and blocked paths');
}
if (
  !authSmoke.includes('/api/admin/beta-readiness/finance-contract-walkthrough/debrief/validate') ||
  !authSmoke.includes('local_beta_finance_contract_debrief_validation') ||
  !authSmoke.includes('safe_local_debrief_review') ||
  !authSmoke.includes('blocked_for_redaction') ||
  !authSmoke.includes('input_limit_exceeded') ||
  !authSmoke.includes('draft_text_max_4000_exceeded') ||
  !authSmoke.includes('SAFE_DEBRIEF_NOTE') ||
  !authSmoke.includes('no_server_storage') ||
  !authSmoke.includes('no_live_action_attempted')
) {
  fail('Auth smoke must runtime-check beta finance/contract debrief draft validation safe and blocked paths');
}
if (
  !html.includes('founderAuthNextStepReadinessCount') ||
  !html.includes('data.founder_auth_next_step_readiness') ||
  !html.includes('Founder Auth Next Step Readiness') ||
  !html.includes('No live Auth/Admin action') ||
  !html.includes('No secret requested') ||
  !html.includes('No admin membership insert attempted') ||
  !html.includes('No strict RLS apply attempted') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('founder_auth_next_step_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('founder_auth_next_step_readiness')") ||
  !html.includes('Open founder Auth next-step evidence export source') ||
  !html.includes('Select founder Auth next-step in Request Trace')
) {
  fail('Controlled Beta Readiness UI must show founder_auth_next_step_readiness with no-secret/no-admin-membership/no-strict-RLS/no-live boundaries and review shortcuts');
}
if (
  !html.includes('weekTwoAuthAdminReadinessCount') ||
  !html.includes('data.week_two_auth_admin_readiness') ||
  !html.includes('Week 2 Auth/Admin Readiness') ||
  !html.includes('No Magic Link URL paste') ||
  !html.includes('No service-role key requested') ||
  !html.includes('No profile repair attempted') ||
  !html.includes('No admin membership insert attempted') ||
  !html.includes('No strict RLS apply attempted') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_auth_admin_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_auth_admin_readiness')") ||
  !html.includes('Open Week 2 Auth/Admin evidence export source') ||
  !html.includes('Select Week 2 Auth/Admin in Request Trace')
) {
  fail('Controlled Beta Readiness UI must show week_two_auth_admin_readiness with no-Magic-Link-token/no-service-role/no-admin-membership/no-strict-RLS/no-live boundaries and review shortcuts');
}
if (
  !html.includes('weekTwoAuthAdminExecutionChecklistCount') ||
  !html.includes('data.week_two_auth_admin_execution_checklist') ||
  !html.includes('Week 2 Auth/Admin Execution Checklist') ||
  !html.includes('No Magic Link URL paste') ||
  !html.includes('No selected-user screenshot storage attempted') ||
  !html.includes('No strict admin smoke live run attempted') ||
  !html.includes('Direct read-only endpoint: /api/admin/week-two-auth-admin-execution-checklist') ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_auth_admin_execution_checklist')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_auth_admin_execution_checklist')") ||
  !html.includes('Open Auth/Admin execution evidence export source') ||
  !html.includes('Select Auth/Admin execution in Request Trace')
) {
  fail('Controlled Beta Readiness UI must show week_two_auth_admin_execution_checklist with no-raw-identity/no-screenshot/no-admin-membership/no-strict-smoke/no-live boundaries and review shortcuts');
}
if (
  !authSmoke.includes('founder_auth_next_step_readiness') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=founder_auth_next_step_readiness') ||
  !authSmoke.includes('adminEvidenceExportPreviewFounderAuthNextStepReadiness') ||
  !authSmoke.includes('founder_auth_same_browser_magic_link') ||
  !authSmoke.includes('founder_auth_profile_binding_review') ||
  !authSmoke.includes('founder_admin_activation_stop_gate') ||
  !authSmoke.includes('FOUNDER_MAGIC_LINK_REQUIRED') ||
  !authSmoke.includes('PROFILE_BINDING_EVIDENCE_REQUIRED') ||
  !authSmoke.includes('BLOCKED_UNTIL_EXPLICIT_LIVE_APPROVAL') ||
  !authSmoke.includes('magic_link_url_paste') ||
  !authSmoke.includes('profiles_auth_user_id_update') ||
  !authSmoke.includes('admin_memberships_insert') ||
  !authSmoke.includes('no_admin_membership_insert_attempted')
) {
  fail('Auth smoke must runtime-check the beta readiness founder Auth next-step readiness gates');
}
if (
  !authSmoke.includes('deployment_next_step_readiness') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=deployment_next_step_readiness') ||
  !authSmoke.includes('adminEvidenceExportPreviewDeploymentNextStepReadiness') ||
  !authSmoke.includes('deployment_target_selection_review') ||
  !authSmoke.includes('deployment_account_session_boundary') ||
  !authSmoke.includes('public_beta_url_smoke_evidence_intake') ||
  !authSmoke.includes('supabase_redirect_env_owner_boundary') ||
  !authSmoke.includes('READY_FOR_FOUNDER_DEPLOY_TARGET_REVIEW') ||
  !authSmoke.includes('BLOCKED_FOR_FOUNDER_ACCOUNT_SESSION_REVIEW') ||
  !authSmoke.includes('LOCAL_EVIDENCE_TEMPLATE_READY_URL_PENDING') ||
  !authSmoke.includes('BLOCKED_EXTERNAL_ACTION_FOUNDER_ONLY') ||
  !authSmoke.includes('vercel_import') ||
  !authSmoke.includes('github_pages_setting_change') ||
  !authSmoke.includes('supabase_redirect_update') ||
  !authSmoke.includes('public_url_share') ||
  !authSmoke.includes('tester_invite') ||
  !authSmoke.includes('no_external_account_change_attempted')
) {
  fail('Auth smoke must runtime-check the beta readiness deployment next-step readiness gates');
}
if (
  !authSmoke.includes('week_two_deployment_public_beta_readiness') ||
  !authSmoke.includes('/api/admin/week-two-deployment-public-beta-readiness') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_deployment_public_beta_readiness') ||
  !authSmoke.includes('adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaReadiness') ||
  !authSmoke.includes('week_two_deploy_target_review_checklist') ||
  !authSmoke.includes('week_two_public_url_smoke_template_checklist') ||
  !authSmoke.includes('week_two_supabase_redirect_env_boundary_checklist') ||
  !authSmoke.includes('week_two_public_beta_invite_gate_checklist') ||
  !authSmoke.includes('FOUNDER_DEPLOY_TARGET_REVIEW_REQUIRED') ||
  !authSmoke.includes('PUBLIC_URL_SMOKE_TEMPLATE_READY_URL_PENDING') ||
  !authSmoke.includes('SUPABASE_REDIRECT_ENV_FOUNDER_ONLY_BLOCKED') ||
  !authSmoke.includes('PUBLIC_BETA_INVITE_APPROVAL_BLOCKED') ||
  !authSmoke.includes('no_public_beta_flip_attempted')
) {
  fail('Auth smoke must runtime-check the beta readiness Week 2 deployment/public beta checklist gates');
}
if (
  !authSmoke.includes('week_two_deployment_public_beta_execution_checklist') ||
  !authSmoke.includes('/api/admin/week-two-deployment-public-beta-execution-checklist') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_deployment_public_beta_execution_checklist') ||
  !authSmoke.includes('adminEvidenceExportPreviewWeekTwoDeploymentPublicBetaExecutionChecklist') ||
  !authSmoke.includes('week_two_deployment_account_report_back_intake') ||
  !authSmoke.includes('week_two_public_url_smoke_report_back_intake') ||
  !authSmoke.includes('week_two_public_beta_invite_request_hold') ||
  !authSmoke.includes('week_two_supabase_redirect_env_change_hold') ||
  !authSmoke.includes('DEPLOYMENT_ACCOUNT_REPORT_BACK_REQUIRED') ||
  !authSmoke.includes('PUBLIC_URL_SMOKE_EVIDENCE_REQUIRED_URL_PRIVATE') ||
  !authSmoke.includes('PUBLIC_BETA_INVITE_REQUEST_HELD') ||
  !authSmoke.includes('SUPABASE_REDIRECT_ENV_CHANGE_HELD') ||
  !authSmoke.includes('no_external_account_session_storage_attempted') ||
  !authSmoke.includes('no_real_public_url_storage_attempted') ||
  !authSmoke.includes('no_live_supabase_write_attempted') ||
  !authSmoke.includes('no_xpr_signature_attempted')
) {
  fail('Auth smoke must runtime-check the beta readiness Week 2 deployment/public beta execution checklist gates');
}
if (
  !authSmoke.includes('founder_live_blocker_handoff_pack') ||
  !authSmoke.includes('/api/admin/founder-live-blocker-handoff-pack') ||
  !authSmoke.includes('gcsc-founder-live-blocker-handoff-pack-endpoint-smoke') ||
  !authSmoke.includes("request_path === '/api/admin/founder-live-blocker-handoff-pack'") ||
  !authSmoke.includes("request_method === 'GET'") ||
  !authSmoke.includes('request_id_header') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=founder_live_blocker_handoff_pack') ||
  !authSmoke.includes('adminEvidenceExportPreviewFounderLiveBlockerHandoffPack') ||
  !authSmoke.includes('Auth/Admin blocker') ||
  !authSmoke.includes('Deploy blocker') ||
  !authSmoke.includes('Contract review next step') ||
  !authSmoke.includes('Beta invite blocker')
) {
  fail('Auth smoke must runtime-check the beta readiness founder live blocker handoff pack');
}
if (
  !authSmoke.includes('founder_evening_action_summary') ||
  !authSmoke.includes('Magic Link login') ||
  !authSmoke.includes('Profile/admin membership') ||
  !authSmoke.includes('Contract review') ||
  !authSmoke.includes('Public beta invite') ||
  !authSmoke.includes('Homepage publication') ||
  !authSmoke.includes('No live action approval')
) {
  fail('Auth smoke must runtime-check the beta readiness founder evening action summary');
}
if (
  !authSmoke.includes('founder_evening_decision_matrix') ||
  !authSmoke.includes('Auth/Admin decision') ||
  !authSmoke.includes('Deploy/public URL decision') ||
  !authSmoke.includes('Homepage publication decision') ||
  !authSmoke.includes('Contract review decision') ||
  !authSmoke.includes('Public beta invite decision') ||
  !authSmoke.includes('Legal/provider decision') ||
  !authSmoke.includes('No live action approval')
) {
  fail('Auth smoke must runtime-check the beta readiness founder evening decision matrix');
}
if (
  !authSmoke.includes('founder_evening_command_board') ||
  !authSmoke.includes('Step 1 Auth/Admin evidence intake') ||
  !authSmoke.includes('Step 2 Contract review scan') ||
  !authSmoke.includes('Step 3 Deploy/public URL smoke intake') ||
  !authSmoke.includes('Step 4 Public beta invite hold/review') ||
  !authSmoke.includes('Step 5 Legal/provider question prep') ||
  !authSmoke.includes('Step 6 Homepage publication sequence review') ||
  !authSmoke.includes('HOLD_FOR_PUBLICATION_GO') ||
  !authSmoke.includes('No live command execution')
) {
  fail('Auth smoke must runtime-check the beta readiness founder evening command board');
}
if (
  !authSmoke.includes('founder_handoff_today') ||
  !authSmoke.includes('/api/admin/founder-handoff-today') ||
  !authSmoke.includes('gcsc-founder-handoff-today-endpoint-smoke') ||
  !authSmoke.includes("request_path === '/api/admin/founder-handoff-today'") ||
  !authSmoke.includes("request_method === 'GET'") ||
  !authSmoke.includes("status === 'LOCAL_HANDOFF_ONLY'") ||
  !authSmoke.includes('request_id_header') ||
  !authSmoke.includes('auth_admin_live_blocker') ||
  !authSmoke.includes('deployment_public_url_blocker') ||
  !authSmoke.includes('homepage_publication_blocker') ||
  !authSmoke.includes('contract_review_next_step') ||
  !authSmoke.includes('legal_provider_finance_blocker') ||
  !authSmoke.includes('FOUNDER_EVIDENCE_REQUIRED') ||
  !authSmoke.includes('FOUNDER_ACCOUNT_REQUIRED') ||
  !authSmoke.includes('PUBLICATION_GO_REQUIRED') ||
  !authSmoke.includes('GO_LOCAL_REVIEW_ONLY') ||
  !authSmoke.includes('BLOCKED_FOR_EXTERNAL_REVIEW') ||
  !authSmoke.includes('no_live_supabase_write_attempted')
) {
  fail('Auth smoke must runtime-check the beta readiness founder handoff today rows');
}
if (
  !authSmoke.includes('week_one_closeout_handoff') ||
  !authSmoke.includes('/api/admin/week-one-closeout-handoff') ||
  !authSmoke.includes('gcsc-week-one-closeout-handoff-endpoint-smoke') ||
  !authSmoke.includes("request_path === '/api/admin/week-one-closeout-handoff'") ||
  !authSmoke.includes("request_method === 'GET'") ||
  !authSmoke.includes("status === 'LOCAL_CLOSEOUT_HANDOFF_ONLY'") ||
  !authSmoke.includes('request_id_header') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_one_closeout_handoff') ||
  !authSmoke.includes('adminEvidenceExportPreviewWeekOneCloseoutHandoff') ||
  !authSmoke.includes('week_one_completed_local_surfaces') ||
  !authSmoke.includes('week_two_auth_admin_start') ||
  !authSmoke.includes('week_two_deploy_public_beta_hold') ||
  !authSmoke.includes('week_two_legal_provider_review') ||
  !authSmoke.includes('PASS_LOCAL_ONLY') ||
  !authSmoke.includes('FOUNDER_EVIDENCE_REQUIRED') ||
  !authSmoke.includes('FOUNDER_ACCOUNT_REQUIRED') ||
  !authSmoke.includes('BLOCKED_FOR_EXTERNAL_REVIEW') ||
  !authSmoke.includes('no_live_action_attempted')
) {
  fail('Auth smoke must runtime-check the beta readiness Week 1 closeout handoff rows');
}
if (
  !authSmoke.includes('week_two_auth_admin_readiness') ||
  !authSmoke.includes('/api/admin/week-two-auth-admin-readiness') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_auth_admin_readiness') ||
  !authSmoke.includes('adminEvidenceExportPreviewWeekTwoAuthAdminReadiness') ||
  !authSmoke.includes('week_two_magic_link_same_browser_checklist') ||
  !authSmoke.includes('week_two_founder_profile_binding_checklist') ||
  !authSmoke.includes('week_two_admin_membership_live_approval_gate') ||
  !authSmoke.includes('week_two_strict_rls_decision_packet_checklist') ||
  !authSmoke.includes('ADMIN_MEMBERSHIP_LIVE_APPROVAL_BLOCKED') ||
  !authSmoke.includes('STRICT_RLS_REVIEW_PACKET_READY_LIVE_APPLY_BLOCKED') ||
  !authSmoke.includes('no_live_supabase_write_attempted') ||
  !authSmoke.includes('no_live_action_attempted')
) {
  fail('Auth smoke must runtime-check the beta readiness Week 2 Auth/Admin readiness endpoint and evidence export source');
}
if (
  !authSmoke.includes('investor_founder_package_readiness') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=investor_founder_package_readiness') ||
  !authSmoke.includes('adminEvidenceExportPreviewInvestorFounderPackageReadiness') ||
  !authSmoke.includes('investor_package_internal_snapshot') ||
  !authSmoke.includes('investor_package_evidence_freshness') ||
  !authSmoke.includes('investor_package_claim_review_gate') ||
  !authSmoke.includes('investor_package_send_approval_stop') ||
  !authSmoke.includes('INTERNAL_PACKAGE_ONLY') ||
  !authSmoke.includes('REFRESH_BEFORE_EXTERNAL_USE') ||
  !authSmoke.includes('HOLD_FOR_CLAIM_REVIEW') ||
  !authSmoke.includes('EXTERNAL_SEND_BLOCKED') ||
  !authSmoke.includes('INVESTOR_PACKET_SEND_ACTION_RECORDED') ||
  !authSmoke.includes('no_external_send_attempted')
) {
  fail('Auth smoke must runtime-check the beta readiness investor/founder package readiness rows');
}
if (
  !authSmoke.includes('homepage_publication_sequence_gate') ||
  !authSmoke.includes('homepage_copy_direction_gate') ||
  !authSmoke.includes('homepage_publication_go_gate') ||
  !authSmoke.includes('homepage_public_file_replacement_gate') ||
  !authSmoke.includes('homepage_deploy_share_separation_gate') ||
  !authSmoke.includes('PUBLICATION_GO') ||
  !authSmoke.includes('DEPLOYMENT_EXTERNAL_ACTION_RECORDED') ||
  !authSmoke.includes('no_public_homepage_edit_attempted') ||
  !authSmoke.includes('no_deploy_setting_change_attempted') ||
  !authSmoke.includes('no_public_url_share_attempted')
) {
  fail('Auth smoke must runtime-check the beta readiness homepage publication sequence gate');
}
if (
  !authSmoke.includes('homepage_publication_review_packet') ||
  !authSmoke.includes('Homepage publication review packet') ||
  !authSmoke.includes('LOCAL_REVIEW_ONLY') ||
  !authSmoke.includes('Standalone PUBLICATION_GO before any public index.html replacement') ||
  !authSmoke.includes('Metallicus/LOAN partnership approved') ||
  !authSmoke.includes('public_homepage_replacement') ||
  !authSmoke.includes('public_whitepaper_edit') ||
  !authSmoke.includes('no_public_homepage_edit_attempted') ||
  !authSmoke.includes('no_public_url_share_attempted')
) {
  fail('Auth smoke must runtime-check the beta readiness homepage publication review packet');
}
if (
  !authSmoke.includes('homepage_publication_founder_decision_script') ||
  !authSmoke.includes('APPROVE_TRADITIONAL_FIRST_HOMEPAGE_DIRECTION') ||
  !authSmoke.includes('APPROVE_HIDDEN_FUTURE_INFRASTRUCTURE_LANGUAGE') ||
  !authSmoke.includes('ACCEPT_LOCAL_BROWSER_QA_EVIDENCE') ||
  !authSmoke.includes('REQUIRE_COMPILED_PUBLIC_CSS') ||
  !authSmoke.includes('KEEP_PUBLIC_REPLACEMENT_ON_HOLD') ||
  !authSmoke.includes('PUBLICATION_GO') ||
  !authSmoke.includes('no_deploy_setting_change_attempted') ||
  !authSmoke.includes('no_public_url_share_attempted') ||
  !authSmoke.includes('no_live_action_attempted')
) {
  fail('Auth smoke must runtime-check the beta readiness homepage publication founder decision script');
}
if (
  !authSmoke.includes('homepage_publication_evidence_checklist') ||
  !authSmoke.includes('homepage_visual_qa_evidence') ||
  !authSmoke.includes('homepage_final_claim_risk_scan') ||
  !authSmoke.includes('homepage_integration_port_state_guard') ||
  !authSmoke.includes('homepage_first_viewport_evidence_rail_guard') ||
  !authSmoke.includes('homepage_browser_viewport_evidence_guard') ||
  !authSmoke.includes('homepage_external_asset_decision') ||
  !authSmoke.includes('homepage_archive_rollback_path') ||
  !authSmoke.includes('homepage_exact_file_replacement_diff') ||
  !authSmoke.includes('homepage_deploy_url_smoke_evidence') ||
  !authSmoke.includes('homepage_invite_share_separation') ||
  !authSmoke.includes('PASS_BROWSER_SESSION_LOCAL_ONLY') ||
  !authSmoke.includes('ASSET_PACKET_PREPARED_FOUNDER_PENDING') ||
  !authSmoke.includes('ROLLBACK_PACKET_PREPARED_FOUNDER_PENDING') ||
  !authSmoke.includes('DRY_RUN_DIFF_PREPARED_FINAL_APPROVAL_PENDING') ||
  !authSmoke.includes('PASS_STATIC_GUARD_LOCAL_ONLY') ||
  !authSmoke.includes('BLOCKED_EXTERNAL_ACTION') ||
  !authSmoke.includes('no_deploy_setting_change_attempted') ||
  !authSmoke.includes('no_live_action_attempted')
) {
  fail('Auth smoke must runtime-check the beta readiness homepage publication evidence checklist');
}
if (
  !authSmoke.includes('homepage_static_asset_candidate') ||
  !authSmoke.includes('homepageStaticCandidate') ||
  !authSmoke.includes('STATIC_CANDIDATE_READY_LOCAL_ONLY') ||
  !authSmoke.includes('index-v1-3-static-draft.html') ||
  !authSmoke.includes('check:homepage-v1-3-static-draft') ||
  !authSmoke.includes('no_tailwind_cdn') ||
  !authSmoke.includes('no_external_asset_urls') ||
  !authSmoke.includes('390 x 844') ||
  !authSmoke.includes('no_tester_invite_attempted') ||
  !authSmoke.includes('no_public_homepage_edit_attempted') ||
  !authSmoke.includes('no_public_url_share_attempted') ||
  !authSmoke.includes('no_live_action_attempted')
) {
  fail('Auth smoke must runtime-check the beta readiness homepage static asset candidate');
}
if (
  !authSmoke.includes('homepage_publication_final_qa_hold') ||
  !authSmoke.includes('homepageFinalQaHold') ||
  !authSmoke.includes('FINAL_QA_HOLD_LOCAL_ONLY') ||
  !authSmoke.includes('index-v1-3-static-draft.html') ||
  !authSmoke.includes('publication_allowed') ||
  !authSmoke.includes('final public-file claim scan') ||
  !authSmoke.includes('clean Browser desktop/mobile screenshot evidence') ||
  !authSmoke.includes('archive and rollback hash check') ||
  !authSmoke.includes('no_archive_execution_attempted') ||
  !authSmoke.includes('no_public_homepage_edit_attempted') ||
  !authSmoke.includes('no_public_url_share_attempted') ||
  !authSmoke.includes('no_tester_invite_attempted') ||
  !authSmoke.includes('no_live_action_attempted')
) {
  fail('Auth smoke must runtime-check the beta readiness homepage final public QA hold');
}
if (
  !authSmoke.includes('/api/admin/homepage-publication-final-qa-preflight') ||
  !authSmoke.includes('homepageFinalQaPreflight') ||
  !authSmoke.includes('homepage_publication_final_qa_preflight') ||
  !authSmoke.includes('LOCAL_PREFLIGHT_READY_PUBLICATION_BLOCKED') ||
  !authSmoke.includes('candidate_file_present') ||
  !authSmoke.includes('first_viewport_product_signal_guard') ||
  !authSmoke.includes('product_section_order_guard') ||
  !authSmoke.includes('integration_port_state_guard') ||
  !authSmoke.includes('blocked_public_claim_scan') ||
  !authSmoke.includes('external_asset_scan') ||
  !authSmoke.includes('section_anchor_scan') ||
  !authSmoke.includes('local_link_cta_scan') ||
  !authSmoke.includes('browser_viewport_evidence_guard') ||
  !authSmoke.includes('public_file_hash_snapshot') ||
  !authSmoke.includes('publication_permission_gate') ||
  !authSmoke.includes('publication_allowed') ||
  !authSmoke.includes('required_first_viewport_signals') ||
  !authSmoke.includes('homepage_evidence_rail') ||
  !authSmoke.includes('SmartContractor by GCSC') ||
  !authSmoke.includes('Project intake') ||
  !authSmoke.includes('Milestone evidence') ||
  !authSmoke.includes('Dispute packet') ||
  !authSmoke.includes('Provider review data') ||
  !authSmoke.includes('required_product_section_signals') ||
  !authSmoke.includes('Traditional Product Review Order') ||
  !authSmoke.includes('required_integration_port_signals') ||
  !authSmoke.includes('Integration Readiness Ports') ||
  !authSmoke.includes('required_browser_viewports') ||
  !authSmoke.includes('desktop_first_viewport_hero_fit') ||
  !authSmoke.includes('mobile_first_viewport_hero_fit') ||
  !authSmoke.includes('1280 x 720') ||
  !authSmoke.includes('390 x 844') ||
  !authSmoke.includes('no_archive_execution_attempted') ||
  !authSmoke.includes('no_live_action_attempted')
) {
  fail('Auth smoke must runtime-check the homepage publication final QA preflight endpoint');
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
  !server.includes('founder_auth_live_action_gate_board') ||
  !server.includes('Same-browser Magic Link gate') ||
  !server.includes('Profile binding gate') ||
  !server.includes('Admin membership approval gate') ||
  !server.includes('Strict RLS and deploy gate') ||
  !server.includes('Regulated finance action gate') ||
  !server.includes('No live founder auth action') ||
  !server.includes('admin_memberships_insert') ||
  !server.includes('strict_rls_apply') ||
  !server.includes('public_beta_flip') ||
  !server.includes('no_live_action_attempted')
) {
  fail('server.js must expose a local Founder Auth Setup report with copyable steps, report sections, live action gate board, blocked admin membership approval, and no-live-action boundary');
}
if (
  !html.includes('/api/admin/founder-auth-setup/report') ||
  !html.includes('founderAuthSetupReport') ||
  !html.includes('Founder Auth Setup Report') ||
  !html.includes('loadFounderAuthSetupReport') ||
  !html.includes('copyable_founder_steps') ||
  !html.includes('founder_auth_live_action_gate_board') ||
  !html.includes('Founder Auth Live Action Gate Board') ||
  !html.includes('No live founder auth action') ||
  !html.includes('report_gate') ||
  !html.includes('founder_admin_membership_approval_blocked')
) {
  fail('Founder Auth Setup UI must render the local report, live action gate board, copyable founder steps, and blocked admin membership approval gate');
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
  !server.includes('strict_admin_smoke_evidence_gate_board') ||
  !server.includes('Same-browser session evidence gate') ||
  !server.includes('Admin membership evidence gate') ||
  !server.includes('Service-role boundary evidence gate') ||
  !server.includes('Strict command output gate') ||
  !server.includes('Post-smoke live-action stop gate') ||
  !server.includes('No live strict admin smoke action') ||
  !server.includes('admin_memberships_insert') ||
  !server.includes('strict_rls_apply') ||
  !server.includes('public_beta_flip') ||
  !server.includes('no_live_action_attempted')
) {
  fail('server.js must expose local strict admin smoke readiness with sections, evidence gate board, copyable commands, founder admin membership requirement, strict gate, and no-live-action boundary');
}
if (
  !html.includes('/api/admin/strict-admin-smoke-readiness') ||
  !html.includes('strictAdminSmokeReadiness') ||
  !html.includes('Strict Admin Smoke Readiness') ||
  !html.includes('loadStrictAdminSmokeReadiness') ||
  !html.includes('data.strict_admin_smoke_evidence_gate_board') ||
  !html.includes('Strict Admin Smoke Evidence Gate Board') ||
  !html.includes('No live strict admin smoke action') ||
  !html.includes('smoke_readiness_sections') ||
  !html.includes('strict_admin_smoke_gate') ||
  !html.includes('copyable_smoke_commands') ||
  !html.includes('founder_admin_membership_required')
) {
  fail('SmartContractor Admin UI must render strict admin smoke readiness, evidence gate board, sections, gate, copyable commands, and founder admin membership requirement');
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
  !html.includes('<optgroup label="Beta safety histories">') ||
  !html.includes('<option value="strict_admin_smoke_readiness">Strict admin smoke readiness</option>') ||
  !html.includes('<option value="strict_admin_smoke_output_template">Strict admin smoke output template</option>') ||
  !html.includes('<option value="founder_auth_setup">Founder Auth Setup</option>') ||
  !html.includes('<option value="founder_auth_setup_report">Founder Auth setup report</option>') ||
  !html.includes('<option value="founder_auth_setup_print_template">Founder Auth setup print template</option>') ||
  !html.includes('<option value="founder_action_center">Founder Action Center</option>') ||
  !html.includes('<option value="founder_auth_next_step_readiness">Founder Auth next-step readiness</option>') ||
  !html.includes('<option value="week_two_auth_admin_execution_checklist">Week 2 Auth/Admin execution checklist</option>') ||
  !html.includes('<option value="deployment_next_step_readiness">Deployment next-step readiness</option>') ||
  !html.includes('<option value="week_two_deployment_public_beta_execution_checklist">Week 2 deploy/public beta execution checklist</option>') ||
  !html.includes('<option value="founder_handoff_today">Founder handoff today</option>') ||
  !html.includes('<option value="founder_live_blocker_handoff_pack">Founder live blocker handoff pack</option>') ||
  !html.includes('<option value="traditional_first_public_copy_validation_history">Traditional-first public copy validation history</option>') ||
  !html.includes('<option value="homepage_publication_decision_validation_history">Homepage publication decision validation history</option>') ||
  !html.includes('<option value="homepage_publication_evidence_checklist">Homepage publication evidence checklist</option>') ||
  !html.includes('<option value="homepage_publication_sequence_gate">Homepage publication sequence gate</option>') ||
  !html.includes('<option value="homepage_publication_review_packet">Homepage publication review packet</option>') ||
  !html.includes('<option value="homepage_publication_decision_summary">Homepage publication decision summary</option>') ||
  !html.includes('<option value="homepage_static_asset_candidate">Homepage static asset candidate</option>') ||
  !html.includes('<option value="homepage_publication_final_qa_hold">Homepage final QA hold</option>') ||
  !html.includes('<option value="beta_finance_contract_safe_handoff_report_history">Beta finance/contract safe handoff report history</option>') ||
  !html.includes('<optgroup label="Product evidence histories">') ||
  !html.includes('<option value="job_fit_snapshot_history">Job fit snapshot history</option>') ||
  !html.includes('<option value="bid_readiness_comparison_history">Bid readiness comparison history</option>') ||
  !html.includes('<option value="milestone_acceptance_snapshot_history">Milestone acceptance snapshot history</option>') ||
  !html.includes('<option value="repayment_allocation_preview_history">Repayment allocation preview history</option>') ||
  !html.includes('<option value="repayment_readiness_snapshot_history">Repayment readiness snapshot history</option>') ||
  !html.includes('<option value="working_capital_review_packet_history">Working capital review packet history</option>') ||
  !html.includes('<option value="contractor_reputation_review_packet_history">Contractor reputation review packet history</option>') ||
  !html.includes('<option value="contractor_verification_review_packet_history">Contractor verification review packet history</option>') ||
  !html.includes('<optgroup label="Provider and contract review histories">') ||
  !html.includes('<option value="provider_evidence_review_chain_history">Provider evidence review chain history</option>') ||
  !html.includes('<option value="smart_contract_review_workbench_gate_matrix_history">Smart contract review gate matrix history</option>') ||
  !html.includes('copyable_report_markdown') ||
  !html.includes('renderRequestTraceReportMissingIdsRecovery') ||
  !html.includes('request_trace_report_missing_ids_recovery_actions') ||
  !html.includes('prefillRequestTraceReportIdsFromSelectedSourceSurface') ||
  !html.includes('setRequestTraceReportSourceSurface') ||
  !html.includes('selected_source_surface_only') ||
  !html.includes('requestTraceReportEntriesForSelectedSourceSurface') ||
  !html.includes('requestTraceReportAdminEvidenceExportPreviewEntriesForSource') ||
  !html.includes("founder_auth_setup: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('founder_auth_setup')") ||
  !html.includes("founder_auth_setup_report: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('founder_auth_setup_report')") ||
  !html.includes("founder_auth_setup_print_template: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('founder_auth_setup_print_template')") ||
  !html.includes("founder_action_center: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('founder_action_center')") ||
  !html.includes("founder_auth_next_step_readiness: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('founder_auth_next_step_readiness')") ||
  !html.includes("week_two_auth_admin_execution_checklist: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('week_two_auth_admin_execution_checklist')") ||
  !html.includes("deployment_next_step_readiness: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('deployment_next_step_readiness')") ||
  !html.includes("week_two_deployment_public_beta_execution_checklist: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('week_two_deployment_public_beta_execution_checklist')") ||
  !html.includes("founder_handoff_today: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('founder_handoff_today')") ||
  !html.includes("founder_live_blocker_handoff_pack: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('founder_live_blocker_handoff_pack')") ||
  !html.includes("homepage_publication_evidence_checklist: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('homepage_publication_evidence_checklist')") ||
  !html.includes("homepage_publication_sequence_gate: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('homepage_publication_sequence_gate')") ||
  !html.includes("homepage_publication_review_packet: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('homepage_publication_review_packet')") ||
  !html.includes("homepage_publication_decision_summary: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('homepage_publication_decision_summary')") ||
  !html.includes("homepage_static_asset_candidate: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('homepage_static_asset_candidate')") ||
  !html.includes("homepage_publication_final_qa_hold: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('homepage_publication_final_qa_hold')") ||
  !html.includes('adminEvidenceExportPreviewIds') ||
  !html.includes('requestTraceReportPrefillStatus') ||
  !html.includes('renderRequestTraceReportPrefillStatus') ||
  !html.includes('request_trace_prefill_status') ||
  !html.includes('selected_source_metadata_only') ||
  !html.includes('all_local_metadata_only') ||
  !html.includes('all_local_metadata_sources') ||
  !html.includes('Metadata entries/candidates scanned') ||
  !html.includes('No safe request IDs found for this selected local metadata source yet') ||
  !html.includes('Use selected source request IDs') ||
  !html.includes('request_trace_selected_source_missing_id_recovery') ||
  !html.includes('Use selected source IDs for recovery') ||
  !html.includes('Selected source metadata entries') ||
  !html.includes('Prefill from browser-local metadata only') ||
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
  fail('SmartContractor Admin UI must render request trace report generation, source-surface history options, selected-source/local-evidence prefill controls, sections, safe request IDs, report gate, copyable markdown, missing-ID recovery actions, redaction recovery actions, and input-limit recovery actions');
}
if (
  !server.includes('strict_admin_smoke_readiness_target') ||
  !server.includes("source_id: 'strict_admin_smoke_readiness'") ||
  !server.includes('Strict admin smoke readiness') ||
  !server.includes("ui_anchor: 'strictAdminSmokeReadinessGrid'") ||
  !server.includes('strict_smoke_gate_count') ||
  !server.includes('strict_admin_smoke_evidence_gate_count') ||
  !server.includes('No Magic Link URLs, Auth tokens, session cookies, service-role keys, raw env values, raw strict admin smoke command output, admin_memberships insert approvals or SQL, profile repair approvals, Auth role change approvals, strict RLS apply approvals, live Supabase changes, deploy/public beta approvals, payment/loan/escrow/token/XPR approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this strict admin smoke readiness preview.') ||
  !server.includes('strict_admin_smoke_raw_output') ||
  !server.includes('admin_memberships_insert_sql') ||
  !server.includes('auth_role_change_approval') ||
  !server.includes('live_supabase_change_approval') ||
  !server.includes('xpr_signature_approval') ||
  !html.includes('<option value="strict_admin_smoke_readiness">Strict admin smoke readiness</option>') ||
  !html.includes("strict_admin_smoke_readiness: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('strict_admin_smoke_readiness')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('strict_admin_smoke_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('strict_admin_smoke_readiness')") ||
  !authSmoke.includes('strict_admin_smoke_readiness') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=strict_admin_smoke_readiness')
) {
  fail('Admin evidence export preview must expose strict_admin_smoke_readiness as metadata-only source with review router, Request Trace prefill, shortcuts, runtime smoke coverage, and blocked Auth/Admin/RLS/deploy/live fields');
}
if (
  !server.includes('strict_admin_smoke_output_template_target') ||
  !server.includes("source_id: 'strict_admin_smoke_output_template'") ||
  !server.includes('Strict admin smoke output template') ||
  !server.includes("ui_anchor: 'strictAdminSmokeReadinessGrid'") ||
  !server.includes('output_template_section_count') ||
  !server.includes('output_capture_gate_status') ||
  !server.includes('No copyable output template text, raw strict admin smoke command output, stdout/stderr details, Magic Link URLs, Auth tokens, session cookies, service-role keys, raw env values, admin_memberships insert approvals or SQL, profile repair approvals, strict RLS apply approvals, live Supabase changes, deploy/public beta approvals, payment/loan/escrow/token/XPR approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this strict admin smoke output template preview.') ||
  !server.includes('copyable_output_template') ||
  !server.includes('raw_stdout') ||
  !server.includes('raw_stderr') ||
  !server.includes('strict_admin_smoke_raw_output') ||
  !server.includes('admin_memberships_insert_sql') ||
  !server.includes('xpr_signature_approval') ||
  !html.includes('<option value="strict_admin_smoke_output_template">Strict admin smoke output template</option>') ||
  !html.includes("strict_admin_smoke_output_template: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('strict_admin_smoke_output_template')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('strict_admin_smoke_output_template')") ||
  !html.includes("setRequestTraceReportSourceSurface('strict_admin_smoke_output_template')") ||
  !authSmoke.includes('strict_admin_smoke_output_template') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=strict_admin_smoke_output_template')
) {
  fail('Admin evidence export preview must expose strict_admin_smoke_output_template as metadata-only source with review router, Request Trace prefill, shortcuts, runtime smoke coverage, and blocked template/raw-output/Auth/Admin/RLS/deploy/live fields');
}
if (
  !server.includes('founder_auth_setup_target') ||
  !server.includes("source_id: 'founder_auth_setup'") ||
  !server.includes('Founder Auth setup') ||
  !server.includes("ui_anchor: 'founderAuthSetupGrid'") ||
  !server.includes('setup_checklist_count') ||
  !server.includes('setup_summary_counts') ||
  !server.includes('membership_summary_status') ||
  !server.includes('current_session_status') ||
  !server.includes('safe_scope_count') ||
  !server.includes('No Magic Link URLs, Auth tokens, session cookies, raw founder identity data, raw current_session payloads, selected-user screenshots, service-role keys, raw env values, admin_memberships insert approvals or SQL, profile repair approvals, Auth role change approvals, strict RLS apply approvals, live Supabase changes, deploy/public beta approvals, payment/loan/escrow/token/XPR approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this founder Auth setup preview.') ||
  !server.includes('raw_current_session') ||
  !server.includes('auth_binding_payload') ||
  !server.includes('selected_user_screenshot') ||
  !server.includes('admin_memberships_insert_sql') ||
  !server.includes('auth_role_change_approval') ||
  !server.includes('live_supabase_change_approval') ||
  !server.includes('xpr_signature_approval') ||
  !html.includes('<option value="founder_auth_setup">Founder Auth Setup</option>') ||
  !html.includes("founder_auth_setup: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('founder_auth_setup')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('founder_auth_setup')") ||
  !html.includes("setRequestTraceReportSourceSurface('founder_auth_setup')") ||
  !authSmoke.includes('founder_auth_setup') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=founder_auth_setup')
) {
  fail('Admin evidence export preview must expose founder_auth_setup as metadata-only source with review router, Request Trace prefill, shortcuts, runtime smoke coverage, and blocked current-session/Auth/Admin/RLS/deploy/live fields');
}
if (
  !server.includes('founder_auth_setup_report_target') ||
  !server.includes("source_id: 'founder_auth_setup_report'") ||
  !server.includes('Founder Auth setup report') ||
  !server.includes("ui_anchor: 'founderAuthSetupGrid'") ||
  !server.includes('report_section_count') ||
  !server.includes('live_action_gate_board_count') ||
  !server.includes('report_gate_status') ||
  !server.includes('safe_report_fields') ||
  !server.includes('No copyable founder steps, report sections, founder Auth live action gate board details, Magic Link URLs, Auth tokens, session cookies, raw founder identity data, selected-user screenshots, service-role keys, raw env values, admin_memberships insert approvals or SQL, profile repair approvals, Auth role change approvals, strict RLS apply approvals, live Supabase changes, deploy/public beta approvals, payment/loan/escrow/token/XPR approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this founder Auth setup report preview.') ||
  !server.includes('copyable_founder_steps') ||
  !server.includes('report_sections') ||
  !server.includes('founder_auth_live_action_gate_board') ||
  !server.includes('selected_user_screenshot') ||
  !server.includes('admin_memberships_insert_sql') ||
  !server.includes('auth_role_change_approval') ||
  !server.includes('live_supabase_change_approval') ||
  !server.includes('xpr_signature_approval') ||
  !html.includes('<option value="founder_auth_setup_report">Founder Auth setup report</option>') ||
  !html.includes("founder_auth_setup_report: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('founder_auth_setup_report')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('founder_auth_setup_report')") ||
  !html.includes("setRequestTraceReportSourceSurface('founder_auth_setup_report')") ||
  !authSmoke.includes('founder_auth_setup_report') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=founder_auth_setup_report')
) {
  fail('Admin evidence export preview must expose founder_auth_setup_report as metadata-only source with review router, Request Trace prefill, shortcuts, runtime smoke coverage, and blocked report/Auth/Admin/RLS/deploy/live fields');
}
if (
  !server.includes('founder_auth_setup_print_template_target') ||
  !server.includes("source_id: 'founder_auth_setup_print_template'") ||
  !server.includes('Founder Auth setup print template') ||
  !server.includes("ui_anchor: 'founderAuthSetupGrid'") ||
  !server.includes('print_template_section_count') ||
  !server.includes('print_export_gate_status') ||
  !server.includes('redaction_requirement_count') ||
  !server.includes('No copyable markdown preview, print template sections, Magic Link URLs, Auth tokens, session cookies, raw founder identity data, selected-user screenshots, service-role keys, raw env values, admin_memberships insert approvals or SQL, profile repair approvals, Auth role change approvals, strict RLS apply approvals, live Supabase changes, deploy/public beta approvals, payment/loan/escrow/token/XPR approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this founder Auth setup print template preview.') ||
  !server.includes('copyable_markdown_preview') ||
  !server.includes('print_template_sections') ||
  !server.includes('selected_user_screenshot') ||
  !server.includes('admin_memberships_insert_sql') ||
  !server.includes('auth_role_change_approval') ||
  !server.includes('live_supabase_change_approval') ||
  !server.includes('xpr_signature_approval') ||
  !html.includes('<option value="founder_auth_setup_print_template">Founder Auth setup print template</option>') ||
  !html.includes("founder_auth_setup_print_template: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('founder_auth_setup_print_template')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('founder_auth_setup_print_template')") ||
  !html.includes("setRequestTraceReportSourceSurface('founder_auth_setup_print_template')") ||
  !authSmoke.includes('founder_auth_setup_print_template') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=founder_auth_setup_print_template')
) {
  fail('Admin evidence export preview must expose founder_auth_setup_print_template as metadata-only source with review router, Request Trace prefill, shortcuts, runtime smoke coverage, and blocked print-template/Auth/Admin/RLS/deploy/live fields');
}
if (
  !server.includes('founder_auth_next_step_readiness_target') ||
  !server.includes("source_id: 'founder_auth_next_step_readiness'") ||
  !server.includes('Founder Auth next-step readiness') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('auth_item_count') ||
  !server.includes('readiness_state_counts') ||
  !server.includes('No Magic Link URLs, Auth tokens, session cookies, raw founder identity data, profile repair approvals, admin_memberships insert approvals, service-role keys, strict RLS apply approvals, deploy setting approvals, public beta approvals, payment data, wallet data, legal/provider decisions, server storage, external sends, or live-action approvals are exported from this founder Auth next-step readiness preview.') ||
  !server.includes('magic_link_url') ||
  !server.includes('profiles_auth_user_id_update_approval') ||
  !server.includes('admin_membership_insert_approval') ||
  !server.includes('strict_rls_apply_approval') ||
  !server.includes('public_beta_approval') ||
  !html.includes('<option value="founder_auth_next_step_readiness">Founder Auth next-step readiness</option>') ||
  !html.includes("founder_auth_next_step_readiness: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('founder_auth_next_step_readiness')")
) {
  fail('Admin evidence export preview must expose founder_auth_next_step_readiness as metadata-only source with review router, Request Trace prefill, and blocked Auth/Admin/RLS/deploy/live fields');
}
if (
  !server.includes('week_two_auth_admin_readiness_target') ||
  !server.includes("source_id: 'week_two_auth_admin_readiness'") ||
  !server.includes('Week 2 Auth/Admin readiness') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('auth_admin_checklist_count') ||
  !server.includes('checklist_phase_counts') ||
  !server.includes('founder_report_field_count') ||
  !server.includes('No Magic Link URLs, Auth tokens, session cookies, raw founder identity data, profile repair approvals, admin_memberships insert approvals or SQL, service-role keys, strict RLS apply approvals, deploy setting approvals, public beta approvals, payment data, wallet data, legal/provider decisions, server storage, external sends, or live-action approvals are exported from this Week 2 Auth/Admin readiness preview.') ||
  !server.includes('selected_user_screenshot') ||
  !server.includes('admin_memberships_update_sql') ||
  !server.includes('supabase_project_setting_change_approval') ||
  !server.includes('xpr_signature_approval') ||
  !html.includes('<option value="week_two_auth_admin_readiness">Week 2 Auth/Admin readiness</option>') ||
  !html.includes("week_two_auth_admin_readiness: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('week_two_auth_admin_readiness')")
) {
  fail('Admin evidence export preview must expose week_two_auth_admin_readiness as metadata-only source with review router, Request Trace prefill, and blocked Auth/Admin/RLS/deploy/live fields');
}
if (
  !server.includes('week_two_auth_admin_execution_checklist_target') ||
  !server.includes("source_id: 'week_two_auth_admin_execution_checklist'") ||
  !server.includes('Week 2 Auth/Admin execution checklist') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('execution_checklist_count') ||
  !server.includes('execution_phase_counts') ||
  !server.includes('No Magic Link URLs, Auth tokens, session cookies, raw founder identity data, selected-user screenshots, profile repair approvals, admin_memberships insert approvals or SQL, service-role keys, raw strict admin smoke output, strict RLS apply approvals, live Supabase changes, deploy approvals, public URL-share approvals, tester-invite approvals, public beta approvals, payment data, wallet data, XPR signatures, legal/provider decisions, server storage, external sends, or live-action approvals are exported from this Week 2 Auth/Admin execution checklist preview.') ||
  !server.includes('strict_admin_smoke_raw_output') ||
  !server.includes('strict_admin_smoke_live_run_approval') ||
  !server.includes('xpr_signature_approval') ||
  !html.includes('<option value="week_two_auth_admin_execution_checklist">Week 2 Auth/Admin execution checklist</option>') ||
  !html.includes("week_two_auth_admin_execution_checklist: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('week_two_auth_admin_execution_checklist')") ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_auth_admin_execution_checklist')
) {
  fail('Admin evidence export preview must expose week_two_auth_admin_execution_checklist as metadata-only source with review router, Request Trace prefill, smoke coverage, and blocked Auth/Admin/live fields');
}
if (
  !server.includes('deployment_next_step_readiness_target') ||
  !server.includes("source_id: 'deployment_next_step_readiness'") ||
  !server.includes('Deployment next-step readiness') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('deployment_item_count') ||
  !server.includes('readiness_state_counts') ||
  !server.includes('No external account login/session details, Vercel account connections, GitHub Pages setting approvals, DNS/Namecheap changes, production env values, service-role keys, Supabase redirect approvals, real public URLs, URL-share approvals, tester-invite approvals, payment data, wallet data, legal/provider decisions, server storage, external sends, or live-action approvals are exported from this deployment next-step readiness preview.') ||
  !server.includes('vercel_import_approval') ||
  !server.includes('github_pages_setting_change_approval') ||
  !server.includes('supabase_redirect_update_approval') ||
  !server.includes('production_env_var_value') ||
  !server.includes('real_public_url') ||
  !server.includes('tester_invite_approval') ||
  !html.includes('<option value="deployment_next_step_readiness">Deployment next-step readiness</option>') ||
  !html.includes("deployment_next_step_readiness: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('deployment_next_step_readiness')")
) {
  fail('Admin evidence export preview must expose deployment_next_step_readiness as metadata-only source with review router, Request Trace prefill, and blocked account/deploy/DNS/env/URL/invite/live fields');
}
if (
  !server.includes('week_two_deployment_public_beta_readiness_target') ||
  !server.includes("source_id: 'week_two_deployment_public_beta_readiness'") ||
  !server.includes('Week 2 deployment/public beta readiness') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('deployment_public_beta_checklist_count') ||
  !server.includes('checklist_phase_counts') ||
  !server.includes('founder_report_field_count') ||
  !server.includes('No external account session details, Vercel account connections, GitHub Pages setting approvals, DNS/Namecheap changes, production env values, service-role keys, Supabase redirect approvals, real public URLs, private URLs, public URL-share approvals, tester-invite approvals, public beta launch approvals, payment data, wallet data, loan/escrow/repayment approvals, stablecoin settlement approvals, token collateral lock approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this Week 2 deployment/public beta readiness preview.') ||
  !server.includes('public_beta_launch_approval') ||
  !server.includes('public_beta_flip_approval') ||
  !server.includes('repayment_routing_approval') ||
  !html.includes('<option value="week_two_deployment_public_beta_readiness">Week 2 deploy/public beta readiness</option>') ||
  !html.includes("week_two_deployment_public_beta_readiness: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('week_two_deployment_public_beta_readiness')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_deployment_public_beta_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_deployment_public_beta_readiness')") ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_deployment_public_beta_readiness') ||
  !authSmoke.includes('gcsc-admin-evidence-export-preview-week-two-deployment-public-beta-readiness-smoke')
) {
  fail('Admin evidence export preview must expose week_two_deployment_public_beta_readiness as metadata-only source with review router, Request Trace prefill, shortcuts, and blocked deploy/URL/invite/Supabase/live fields');
}
if (
  !server.includes('week_two_deployment_public_beta_execution_checklist_target') ||
  !server.includes("source_id: 'week_two_deployment_public_beta_execution_checklist'") ||
  !server.includes('Week 2 deployment/public beta execution checklist') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('deployment_public_beta_execution_checklist_count') ||
  !server.includes('execution_phase_counts') ||
  !server.includes('founder_report_field_count') ||
  !server.includes('No external account login/session details, deployment account sessions, Vercel account connections, GitHub Pages setting approvals, DNS/Namecheap changes, production env values, service-role keys, Supabase redirect approvals, Supabase project setting approvals, real public URLs, URL-share approvals, tester-invite approvals, public beta approvals, production deploy approvals, payment data, wallet data, XPR signatures, legal/provider decisions, server storage, external sends, or live-action approvals are exported from this Week 2 deployment/public beta execution checklist preview.') ||
  !server.includes('deployment_account_session') ||
  !server.includes('vercel_account_connection_approval') ||
  !server.includes('supabase_redirect_approval') ||
  !server.includes('public_beta_flip_approval') ||
  !server.includes('xpr_signature') ||
  !html.includes('<option value="week_two_deployment_public_beta_execution_checklist">Week 2 deploy/public beta execution checklist</option>') ||
  !html.includes("week_two_deployment_public_beta_execution_checklist: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('week_two_deployment_public_beta_execution_checklist')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_deployment_public_beta_execution_checklist')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_deployment_public_beta_execution_checklist')") ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_deployment_public_beta_execution_checklist') ||
  !authSmoke.includes('gcsc-admin-evidence-export-preview-week-two-deployment-public-beta-execution-checklist-smoke')
) {
  fail('Admin evidence export preview must expose week_two_deployment_public_beta_execution_checklist as metadata-only source with review router, Request Trace prefill, shortcuts, and blocked deploy/account/URL/invite/Supabase/XPR/live fields');
}
if (
  !server.includes('legal_provider_next_step_readiness_target') ||
  !server.includes("source_id: 'legal_provider_next_step_readiness'") ||
  !server.includes('Legal/provider next-step readiness') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('legal_provider_item_count') ||
  !server.includes('review_area_counts') ||
  !server.includes('no_provider_commitment_attempted') ||
  !server.includes('no_legal_decision_attempted') ||
  !server.includes('no_xpr_signature_attempted') ||
  !server.includes('No raw reviewer responses, attorney advice, legal conclusions, provider commitments, external-send approvals, provider credentials, payment data, wallet data, credit approvals, loan origination approvals, escrow release approvals, repayment routing approvals, stablecoin settlement approvals, token collateral lock approvals, XPR signatures, public claim approvals, server storage, external sends, or live-action approvals are exported from this legal/provider next-step readiness preview.') ||
  !server.includes('raw_reviewer_response') ||
  !server.includes('attorney_advice') ||
  !server.includes('legal_conclusion') ||
  !server.includes('provider_commitment') ||
  !server.includes('loan_origination_approval') ||
  !server.includes('escrow_release_approval') ||
  !server.includes('xpr_signature_approval') ||
  !server.includes('public_claim_approval') ||
  !html.includes('<option value="legal_provider_next_step_readiness">Legal/provider next-step readiness</option>') ||
  !html.includes("legal_provider_next_step_readiness: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('legal_provider_next_step_readiness')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('legal_provider_next_step_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('legal_provider_next_step_readiness')") ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=legal_provider_next_step_readiness') ||
  !authSmoke.includes('gcsc-admin-evidence-export-preview-legal-provider-next-step-readiness-smoke')
) {
  fail('Admin evidence export preview must expose legal_provider_next_step_readiness as metadata-only source with review router, Request Trace prefill, shortcuts, and blocked reviewer/legal/provider/finance/XPR/live fields');
}
if (
  !server.includes('week_two_legal_provider_readiness_target') ||
  !server.includes("source_id: 'week_two_legal_provider_readiness'") ||
  !server.includes('Week 2 legal/provider readiness') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('legal_provider_checklist_count') ||
  !server.includes('checklist_phase_counts') ||
  !server.includes('founder_report_field_count') ||
  !server.includes('linked_surfaces') ||
  !server.includes('no_provider_submission_attempted') ||
  !server.includes('no_smart_contract_deployment_attempted') ||
  !server.includes('No raw reviewer responses, attorney advice, legal conclusions, provider commitments, provider submissions, external-send approvals, provider credentials, payment data, wallet data, credit approvals, loan origination approvals, escrow release approvals, refund or payout instructions, repayment routing approvals, stablecoin settlement approvals, token collateral lock approvals, token custody approvals, XPR signatures, smart-contract deployment approvals, public claim approvals, server storage, external sends, or live-action approvals are exported from this Week 2 legal/provider readiness preview.') ||
  !server.includes('provider_submission_approval') ||
  !server.includes('refund_instruction_approval') ||
  !server.includes('contractor_payout_approval') ||
  !server.includes('token_custody_approval') ||
  !server.includes('collateral_release_approval') ||
  !server.includes('liquidation_action_approval') ||
  !html.includes('<option value="week_two_legal_provider_readiness">Week 2 legal/provider readiness</option>') ||
  !html.includes("week_two_legal_provider_readiness: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('week_two_legal_provider_readiness')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_legal_provider_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_legal_provider_readiness')") ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_legal_provider_readiness') ||
  !authSmoke.includes('gcsc-admin-evidence-export-preview-week-two-legal-provider-readiness-smoke')
) {
  fail('Admin evidence export preview must expose week_two_legal_provider_readiness as metadata-only source with review router, Request Trace prefill, shortcuts, and blocked legal/provider/finance/collateral/XPR/live fields');
}
if (
  !server.includes('week_two_legal_provider_execution_checklist_target') ||
  !server.includes("source_id: 'week_two_legal_provider_execution_checklist'") ||
  !server.includes('Week 2 legal/provider execution checklist') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('legal_provider_execution_checklist_count') ||
  !server.includes('execution_phase_counts') ||
  !server.includes('review_area_counts') ||
  !server.includes('founder_report_field_count') ||
  !server.includes('no_raw_reviewer_response_stored') ||
  !server.includes('no_attorney_advice_stored') ||
  !server.includes('No raw reviewer responses, attorney advice, legal conclusions, provider commitments, provider submissions, external-send approvals, provider credentials, payment data, wallet data, credit approvals, loan origination approvals, escrow release approvals, refund or payout instructions, repayment routing approvals, stablecoin settlement approvals, token collateral lock approvals, token custody approvals, XPR signatures, smart-contract deployment approvals, public claim approvals, production approvals, server storage, external sends, or live-action approvals are exported from this Week 2 legal/provider execution checklist preview.') ||
  !server.includes('raw_provider_response') ||
  !server.includes('publication_approval') ||
  !server.includes('provider_submission_approval') ||
  !server.includes('refund_instruction_approval') ||
  !server.includes('contractor_payout_approval') ||
  !server.includes('token_custody_approval') ||
  !server.includes('smart_contract_deployment_approval') ||
  !html.includes('<option value="week_two_legal_provider_execution_checklist">Week 2 legal/provider execution checklist</option>') ||
  !html.includes("week_two_legal_provider_execution_checklist: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('week_two_legal_provider_execution_checklist')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_legal_provider_execution_checklist')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_legal_provider_execution_checklist')") ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_legal_provider_execution_checklist') ||
  !authSmoke.includes('gcsc-admin-evidence-export-preview-week-two-legal-provider-execution-checklist-smoke')
) {
  fail('Admin evidence export preview must expose week_two_legal_provider_execution_checklist as metadata-only source with review router, Request Trace prefill, shortcuts, and blocked reviewer/legal/provider/finance/collateral/XPR/publication/live fields');
}
if (
  !server.includes('public_beta_next_step_readiness_target') ||
  !server.includes("source_id: 'public_beta_next_step_readiness'") ||
  !server.includes('Public beta next-step readiness') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('public_beta_item_count') ||
  !server.includes('review_area_counts') ||
  !server.includes('required_phrase') ||
  !server.includes('No real public URLs, private URLs, invite recipient details, tester private data, public URL share approvals, tester-invite approvals, external-send approvals, deploy/Supabase setting approvals, payment data, wallet data, loan/escrow/repayment approvals, legal/provider decisions, server storage, external sends, or live-action approvals are exported from this public beta next-step readiness preview.') ||
  !server.includes('invite_recipient') ||
  !server.includes('tester_contact_details') ||
  !server.includes('public_url_share_approval') ||
  !server.includes('tester_invite_approval') ||
  !server.includes('external_send_approval') ||
  !server.includes('public_beta_launch_approval') ||
  !html.includes('<option value="public_beta_next_step_readiness">Public beta next-step readiness</option>') ||
  !html.includes("public_beta_next_step_readiness: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('public_beta_next_step_readiness')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('public_beta_next_step_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('public_beta_next_step_readiness')") ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=public_beta_next_step_readiness') ||
  !authSmoke.includes('gcsc-admin-evidence-export-preview-public-beta-next-step-readiness-smoke')
) {
  fail('Admin evidence export preview must expose public_beta_next_step_readiness as metadata-only source with review router, Request Trace prefill, shortcuts, and blocked URL/invite/external-send/live fields');
}
if (
  !server.includes('public_beta_next_step_execution_checklist_target') ||
  !server.includes("source_id: 'public_beta_next_step_execution_checklist'") ||
  !server.includes('Public beta next-step execution checklist') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('public_beta_execution_checklist_count') ||
  !server.includes('execution_checklist_count') ||
  !server.includes('execution_phase_counts') ||
  !server.includes('review_area_counts') ||
  !server.includes('founder_report_field_count') ||
  !server.includes('no_sensitive_data_collection_attempted') ||
  !server.includes('no_live_supabase_write_attempted') ||
  !server.includes('no_xpr_signature_attempted') ||
  !server.includes('No public beta launch approvals, real public URLs, public URL-share approvals, tester-invite approvals, invite-recipient data, external-send approvals, sensitive tester data, deploy setting approvals, Supabase redirect approvals, production env values, service-role keys, payment data, wallet data, loan approvals, escrow approvals, repayment routing approvals, stablecoin settlement approvals, token collateral approvals, XPR signatures, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this public beta next-step execution checklist preview.') ||
  !server.includes('invite_recipient_data') ||
  !server.includes('sensitive_tester_data') ||
  !server.includes('deploy_setting_change_approval') ||
  !server.includes('production_env_value') ||
  !server.includes('service_role_key') ||
  !server.includes('token_collateral_approval') ||
  !server.includes('xpr_signature_approval') ||
  !html.includes('<option value="public_beta_next_step_execution_checklist">Public beta next-step execution checklist</option>') ||
  !html.includes("public_beta_next_step_execution_checklist: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('public_beta_next_step_execution_checklist')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('public_beta_next_step_execution_checklist')") ||
  !html.includes("setRequestTraceReportSourceSurface('public_beta_next_step_execution_checklist')") ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=public_beta_next_step_execution_checklist') ||
  !authSmoke.includes('gcsc-admin-evidence-export-preview-public-beta-next-step-execution-checklist-smoke')
) {
  fail('Admin evidence export preview must expose public_beta_next_step_execution_checklist as metadata-only source with review router, Request Trace prefill, shortcuts, and blocked launch/URL/invite/secret/finance/XPR/legal/live fields');
}
if (
  !server.includes('founder_action_center_target') ||
  !server.includes("source_id: 'founder_action_center'") ||
  !server.includes('Founder Action Center') ||
  !server.includes("ui_anchor: 'founderActionGrid'") ||
  !server.includes('action_item_count') ||
  !server.includes('action_phase_counts') ||
  !server.includes('action_status_counts') ||
  !server.includes('week_two_board_count') ||
  !server.includes('week_two_phase_counts') ||
  !server.includes('week_two_status_counts') ||
  !server.includes('week_two_phase_options') ||
  !server.includes('week_two_next_action_count') ||
  !server.includes('founder_decision_needed') ||
  !server.includes('codex_next_safe_action') ||
  !server.includes('evidence_sources') ||
  !server.includes('no_week_two_live_action_attempted') ||
  !server.includes('safety_rule_count') ||
  !server.includes('No founder secrets, passwords, API keys, service-role keys, wallet keys, raw env values, external account session data, connector tokens, Magic Link URLs, Auth tokens, live Supabase approvals, admin membership approvals, deploy/share/invite approvals, payment/loan/escrow/token/XPR approvals, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this founder Action Center preview.') ||
  !server.includes('external_account_session') ||
  !server.includes('connector_token') ||
  !server.includes('admin_membership_insert_approval') ||
  !server.includes('live_supabase_write_approval') ||
  !server.includes('live_supabase_change_approval') ||
  !server.includes('deploy_account_approval') ||
  !server.includes('payment_or_loan_action_approval') ||
  !server.includes('week_two_live_approval') ||
  !server.includes('app_store_submission_approval') ||
  !server.includes('public_release_approval') ||
  !server.includes('xpr_signature_approval') ||
  !html.includes('<option value="founder_action_center">Founder Action Center</option>') ||
  !html.includes("founder_action_center: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('founder_action_center')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('founder_action_center')") ||
  !html.includes("setRequestTraceReportSourceSurface('founder_action_center')") ||
  !authSmoke.includes('founder_action_center') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=founder_action_center')
) {
  fail('Admin evidence export preview must expose founder_action_center as metadata-only source with review router, Request Trace prefill, shortcuts, runtime smoke coverage, and blocked secret/account/Auth/Supabase/deploy/finance/XPR/legal/live fields');
}
if (
  !server.includes('function weekTwoFounderActionBoard') ||
  !server.includes('week_two_founder_action_board') ||
  !server.includes('week_two_summary') ||
  !server.includes('selected_week_two_phase_filter') ||
  !server.includes('valid_week_two_phase_filter_ids') ||
  !server.includes('filtered_week_two_founder_action_board') ||
  !server.includes('filtered_week_two_summary') ||
  !server.includes('filtered_week_two_board_count') ||
  !server.includes('week_two_phase_counts') ||
  !server.includes('week_two_status_counts') ||
  !server.includes('week_two_phase_options') ||
  !server.includes('week_two_next_actions') ||
  !server.includes('no_week_two_live_action_attempted') ||
  !server.includes('week_two_phase_filter_invalid') ||
  !server.includes('rejected_week_two_phase_filter') ||
  !server.includes('all_week_two_phases') ||
  !server.includes('Auth/Admin readiness') ||
  !server.includes('Deployment/public beta prep') ||
  !server.includes('week_two_auth_admin_evidence') ||
  !server.includes('week_two_deployment_public_beta_prep') ||
  !server.includes('week_two_legal_provider_questions') ||
  !server.includes('week_two_investor_packet_claim_review') ||
  !server.includes('week_two_mobile_release_blocker_scan') ||
  !server.includes('admin_memberships_insert') ||
  !server.includes('vercel_import') ||
  !server.includes('legal_conclusion') ||
  !server.includes('investor_outreach') ||
  !server.includes('app_store_submission') ||
  !html.includes('Week 2 Founder Action Board') ||
  !html.includes("founderWeekTwoPhaseFilter: 'all_week_two_phases'") ||
  !html.includes('phase_filter=${encodeURIComponent(selectedPhaseFilter)}') ||
  !html.includes('const weekTwoBoard = data.week_two_founder_action_board || []') ||
  !html.includes('const weekTwoPhaseOptions = data.week_two_phase_options ||') ||
  !html.includes('const selectedWeekTwoPhase = data.selected_week_two_phase_filter ||') ||
  !html.includes('const visibleWeekTwoBoard = data.filtered_week_two_founder_action_board ||') ||
  !html.includes('const weekTwoSummary = data.week_two_summary || {}') ||
  !html.includes('const filteredWeekTwoSummary = data.filtered_week_two_summary ||') ||
  !html.includes('const weekTwoNextActions = data.week_two_next_actions || []') ||
  !html.includes('const filteredWeekTwoNextActions = data.filtered_week_two_next_actions ||') ||
  !html.includes('setFounderWeekTwoPhaseFilter') ||
  !html.includes('Filtered board count:') ||
  !html.includes('Phase filter:') ||
  !html.includes('founder_decision_needed') ||
  !html.includes('codex_next_safe_action') ||
  !html.includes('No Week 2 live action attempted') ||
  !html.includes('Open Week 2 founder evidence export source') ||
  !authSmoke.includes('week_two_founder_action_board') ||
  !authSmoke.includes('week_two_phase_counts') ||
  !authSmoke.includes('week_two_status_counts') ||
  !authSmoke.includes('week_two_phase_options') ||
  !authSmoke.includes('selected_week_two_phase_filter') ||
  !authSmoke.includes('filtered_week_two_founder_action_board') ||
  !authSmoke.includes('filtered_week_two_board_count') ||
  !authSmoke.includes('week_two_phase_filter_invalid') ||
  !authSmoke.includes('/api/admin/founder-action-center?phase_filter=auth_admin') ||
  !authSmoke.includes('no_week_two_live_action_attempted')
) {
  fail('Founder Action Center must expose the Week 2 founder action board through API, Admin UI, metadata-only export fields, and auth smoke runtime coverage');
}
if (
  !server.includes('supabase_boundary_target') ||
  !server.includes("source_id: 'supabase_boundary'") ||
  !server.includes('Supabase Boundary') ||
  !server.includes("ui_anchor: 'supabaseBoundaryGrid'") ||
  !server.includes('boundary_item_count') ||
  !server.includes('boundary_status_counts') ||
  !server.includes('publishable_client_status') ||
  !server.includes('service_role_boundary_status') ||
  !server.includes('auth_admin_boundary_status') ||
  !server.includes('No service-role keys, database passwords, raw env values, Supabase access tokens, Magic Link URLs, Auth/session tokens, admin_memberships insert approvals or SQL, profile repair approvals, strict RLS apply approvals, live Supabase changes, Supabase project settings, deploy/public beta approvals, payment/wallet data, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this Supabase Boundary preview.') ||
  !server.includes('supabase_project_jwt_secret') ||
  !server.includes('supabase_project_setting_change_approval') ||
  !server.includes('supabase_redirect_update_approval') ||
  !server.includes('rls_policy_live_apply_approval') ||
  !html.includes('<option value="supabase_boundary">Supabase Boundary</option>') ||
  !html.includes("supabase_boundary: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('supabase_boundary')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('supabase_boundary')") ||
  !html.includes("setRequestTraceReportSourceSurface('supabase_boundary')") ||
  !authSmoke.includes('supabase_boundary') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=supabase_boundary')
) {
  fail('Admin evidence export preview must expose supabase_boundary as metadata-only source with review router, Request Trace prefill, shortcuts, runtime smoke coverage, and blocked secret/Auth/Admin/RLS/Supabase/deploy/live fields');
}
if (
  !server.includes('mobile_install_readiness_target') ||
  !server.includes("source_id: 'mobile_install_readiness'") ||
  !server.includes('Mobile install readiness') ||
  !server.includes("ui_anchor: 'mobileInstallReadinessGrid'") ||
  !server.includes('pwa_file_count') ||
  !server.includes('pwa_check_count') ||
  !server.includes('evidence_checklist_count') ||
  !server.includes('app_store_submission_status') ||
  !server.includes('play_console_submission_status') ||
  !server.includes('real_money_mobile_release_status') ||
  !server.includes('service_worker_api_boundary_status') ||
  !server.includes('No app-store approvals, Play Console approvals, signing keys, certificates, provisioning profiles, keystores, external account sessions, production deploy approvals, public release approvals, payment/wallet data, real loan approvals, escrow release approvals, stablecoin settlement approvals, token collateral approvals, XPR signatures, legal/provider decisions, server storage, external sends, or live-action approvals are exported from this Mobile Install Readiness preview.') ||
  !server.includes('app_store_submission_approval') ||
  !server.includes('play_console_submission_approval') ||
  !server.includes('signing_key') ||
  !server.includes('apple_developer_account_session') ||
  !server.includes('play_console_account_session') ||
  !server.includes('native_wrapper_release_approval') ||
  !html.includes('<option value="mobile_install_readiness">Mobile install readiness</option>') ||
  !html.includes("mobile_install_readiness: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('mobile_install_readiness')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('mobile_install_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('mobile_install_readiness')") ||
  !authSmoke.includes('mobile_install_readiness') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=mobile_install_readiness')
) {
  fail('Admin evidence export preview must expose mobile_install_readiness as metadata-only source with review router, Request Trace prefill, shortcuts, runtime smoke coverage, and blocked store/account/signing/mobile-release/finance/XPR/legal/live fields');
}
if (
  !server.includes('week_two_mobile_release_readiness_target') ||
  !server.includes("source_id: 'week_two_mobile_release_readiness'") ||
  !server.includes('Week 2 mobile release readiness') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('mobile_release_item_count') ||
  !server.includes('readiness_state_counts') ||
  !server.includes('readiness_area_counts') ||
  !server.includes('founder_report_field_count') ||
  !server.includes('linked_surfaces') ||
  !server.includes('no_signing_key_upload_attempted') ||
  !server.includes('No App Store Connect approvals, Apple Developer approvals, Play Console approvals, TestFlight approvals, Play testing approvals, signing keys, certificates, provisioning profiles, keystores, store metadata approvals, screenshot files, device identifiers, external account sessions, public release approvals, deploy approvals, live Supabase approvals, payment data, wallet data, loan approvals, escrow approvals, stablecoin settlement approvals, token collateral approvals, XPR signatures, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this Week 2 mobile release readiness preview.') ||
  !server.includes('app_store_connect_session') ||
  !server.includes('apple_developer_account_session') ||
  !server.includes('play_console_account_session') ||
  !server.includes('testflight_submission_approval') ||
  !server.includes('play_testing_release_approval') ||
  !server.includes('signing_key') ||
  !server.includes('certificate') ||
  !server.includes('provisioning_profile') ||
  !server.includes('keystore') ||
  !server.includes('device_identifier') ||
  !server.includes('public_release_approval') ||
  !html.includes('<option value="week_two_mobile_release_readiness">Week 2 mobile release readiness</option>') ||
  !html.includes("week_two_mobile_release_readiness: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('week_two_mobile_release_readiness')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_mobile_release_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_mobile_release_readiness')") ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_mobile_release_readiness') ||
  !authSmoke.includes('gcsc-admin-evidence-export-preview-week-two-mobile-release-readiness-smoke')
) {
  fail('Admin evidence export preview must expose week_two_mobile_release_readiness as metadata-only source with review router, Request Trace prefill, shortcuts, and blocked store/account/signing/device/release/finance/XPR/legal/live fields');
}
if (
  !server.includes('week_two_mobile_release_execution_checklist_target') ||
  !server.includes("source_id: 'week_two_mobile_release_execution_checklist'") ||
  !server.includes('Week 2 mobile release execution checklist') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('mobile_release_execution_checklist_count') ||
  !server.includes('execution_phase_counts') ||
  !server.includes('founder_report_field_count') ||
  !server.includes('linked_surfaces') ||
  !server.includes('no_external_account_session_storage_attempted') ||
  !server.includes('no_device_identifier_storage_attempted') ||
  !server.includes('No App Store Connect sessions, Apple Developer sessions, Play Console sessions, external account sessions, TestFlight approvals, Play testing approvals, App Store submission approvals, Play Console submission approvals, signing keys, certificates, provisioning profiles, keystores, store metadata approvals, screenshot files, device identifiers, public release approvals, public URL-share approvals, tester-invite approvals, live Supabase approvals, payment data, wallet data, loan approvals, escrow approvals, stablecoin settlement approvals, token collateral approvals, XPR signatures, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this Week 2 mobile release execution checklist preview.') ||
  !server.includes('app_store_connect_session') ||
  !server.includes('apple_developer_account_session') ||
  !server.includes('play_console_account_session') ||
  !server.includes('testflight_submission_approval') ||
  !server.includes('play_testing_release_approval') ||
  !server.includes('signing_key') ||
  !server.includes('certificate') ||
  !server.includes('provisioning_profile') ||
  !server.includes('keystore') ||
  !server.includes('store_metadata_approval') ||
  !server.includes('device_identifier') ||
  !server.includes('public_url_share_approval') ||
  !html.includes('<option value="week_two_mobile_release_execution_checklist">Week 2 mobile release execution checklist</option>') ||
  !html.includes("week_two_mobile_release_execution_checklist: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('week_two_mobile_release_execution_checklist')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_mobile_release_execution_checklist')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_mobile_release_execution_checklist')") ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_mobile_release_execution_checklist') ||
  !authSmoke.includes('gcsc-admin-evidence-export-preview-week-two-mobile-release-execution-checklist-smoke')
) {
  fail('Admin evidence export preview must expose week_two_mobile_release_execution_checklist as metadata-only source with review router, Request Trace prefill, shortcuts, and blocked store/account/signing/device/release/finance/XPR/legal/live fields');
}
if (
  !server.includes('founder_handoff_today_target') ||
  !server.includes("source_id: 'founder_handoff_today'") ||
  !server.includes('Founder handoff today') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('handoff_item_count') ||
  !server.includes('handoff_state_counts') ||
  !server.includes('No founder secrets, Magic Link URLs, Auth tokens, raw founder notes, live Supabase writes, admin membership approvals, deploy approvals, public URL-share approvals, tester-invite approvals, public file replacement approvals, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this founder handoff today preview.') ||
  !server.includes('admin_membership_approval') ||
  !server.includes('public_index_html_replacement_approval') ||
  !server.includes('live_supabase_write_approval') ||
  !html.includes('<option value="founder_handoff_today">Founder handoff today</option>')
) {
  fail('Admin evidence export preview must expose founder_handoff_today as metadata-only source with review router and blocked secret/Auth/deploy/share/legal/payment/live fields');
}
if (
  !server.includes('founder_live_blocker_handoff_pack_target') ||
  !server.includes("source_id: 'founder_live_blocker_handoff_pack'") ||
  !server.includes('Founder live blocker handoff pack') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('blocker_item_count') ||
  !server.includes('blocker_group_count') ||
  !server.includes('No founder secrets, Magic Link URLs, Auth tokens, raw founder notes, private IDs, live Supabase writes, admin membership approvals, deploy approvals, public URL-share approvals, tester-invite approvals, public file replacement approvals, legal/provider decisions, payment data, wallet data, XPR signatures, XPR registration approvals, server storage, external sends, or live-action approvals are exported from this founder live blocker handoff pack preview.') ||
  !server.includes('deploy_setting_change_approval') ||
  !server.includes('stablecoin_settlement_approval') ||
  !server.includes('token_collateral_lock_approval') ||
  !server.includes('xpr_registration_approval') ||
  !html.includes('<option value="founder_live_blocker_handoff_pack">Founder live blocker handoff pack</option>') ||
  !html.includes("founder_live_blocker_handoff_pack: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('founder_live_blocker_handoff_pack')")
) {
  fail('Admin evidence export preview must expose founder_live_blocker_handoff_pack as metadata-only source with review router, Request Trace prefill, and blocked Auth/deploy/beta/legal/payment/XPR/live fields');
}
if (
  !server.includes('week_one_closeout_handoff_target') ||
  !server.includes("source_id: 'week_one_closeout_handoff'") ||
  !server.includes('Week 1 closeout handoff') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('closeout_item_count') ||
  !server.includes('closeout_state_counts') ||
  !server.includes('No founder secrets, Magic Link URLs, Auth tokens, raw founder notes, live Supabase writes, admin membership approvals, deploy approvals, public URL-share approvals, tester-invite approvals, public file replacement approvals, legal/provider decisions, payment data, wallet data, XPR signatures, server storage, external sends, or live-action approvals are exported from this Week 1 closeout handoff preview.') ||
  !server.includes('supabase_redirect_update_approval') ||
  !server.includes('stablecoin_settlement_approval') ||
  !server.includes('token_collateral_lock_approval') ||
  !html.includes('<option value="week_one_closeout_handoff">Week 1 closeout handoff</option>') ||
  !html.includes("week_one_closeout_handoff: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('week_one_closeout_handoff')")
) {
  fail('Admin evidence export preview must expose week_one_closeout_handoff as metadata-only source with review router, Request Trace prefill, and blocked Auth/deploy/beta/legal/payment/XPR/live fields');
}
if (
  !server.includes('investor_founder_package_readiness_target') ||
  !server.includes("source_id: 'investor_founder_package_readiness'") ||
  !server.includes('Investor/founder package readiness') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('readiness_item_count') ||
  !server.includes('readiness_state_counts') ||
  !server.includes('blocked_claims') ||
  !server.includes('INVESTOR_PACKET_SEND_ACTION_RECORDED') ||
  !server.includes('No founder secrets, recipient names, private recipient contact data, investor notes, Magic Link URLs, Auth tokens, raw founder notes, live Supabase writes, external sends, deck/PDF/email/social publication approvals, public URL-share approvals, provider commitments, legal/provider decisions, payment data, wallet data, XPR signatures, server storage, or live-action approvals are exported from this investor/founder package readiness preview.') ||
  !server.includes('recipient_email') ||
  !server.includes('external_send_approval') ||
  !server.includes('investor_outreach_approval') ||
  !server.includes('grant_submission_approval') ||
  !server.includes('deck_publication_approval') ||
  !server.includes('public_claim_approval') ||
  !server.includes('xpr_signature') ||
  !html.includes('<option value="investor_founder_package_readiness">Investor/founder package readiness</option>') ||
  !html.includes("investor_founder_package_readiness: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('investor_founder_package_readiness')")
) {
  fail('Admin evidence export preview must expose investor_founder_package_readiness as metadata-only source with review router, Request Trace prefill, and blocked recipient/send/publication/legal/payment/XPR/live fields');
}
if (
  !server.includes('week_two_investor_founder_package_alignment_target') ||
  !server.includes("source_id: 'week_two_investor_founder_package_alignment'") ||
  !server.includes('Week 2 investor/founder package alignment') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('investor_founder_alignment_count') ||
  !server.includes('alignment_state_counts') ||
  !server.includes('alignment_area_counts') ||
  !server.includes('founder_report_field_count') ||
  !server.includes('linked_surfaces') ||
  !server.includes('no_investor_outreach_attempted') ||
  !server.includes('no_grant_submission_attempted') ||
  !server.includes('no_provider_outreach_attempted') ||
  !server.includes('no_publication_attempted') ||
  !server.includes('no_fio_registration_attempted') ||
  !server.includes('No recipient names, recipient contact details, private investor notes, raw deck copy, raw PDF copy, raw email copy, raw social copy, external-send approvals, investor outreach approvals, grant submission approvals, provider outreach approvals, attorney outreach approvals, public URL-share approvals, public claim approvals, live finance claims, real payment approvals, loan approvals, escrow approvals, repayment routing approvals, stablecoin settlement approvals, token collateral approvals, token custody approvals, XPR signatures, FIO registrations, Metallicus partnership approvals, approved provider claims, AI credit approval claims, AI legal decision claims, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this Week 2 investor/founder package alignment preview.') ||
  !server.includes('recipient_contact_details') ||
  !server.includes('raw_deck_copy') ||
  !server.includes('attorney_outreach_approval') ||
  !server.includes('live_finance_claim') ||
  !server.includes('fio_registration_approval') ||
  !server.includes('metallicus_partnership_approval') ||
  !server.includes('ai_credit_approval_claim') ||
  !server.includes('ai_legal_decision_claim') ||
  !html.includes('<option value="week_two_investor_founder_package_alignment">Week 2 investor package alignment</option>') ||
  !html.includes("week_two_investor_founder_package_alignment: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('week_two_investor_founder_package_alignment')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_investor_founder_package_alignment')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_investor_founder_package_alignment')") ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_investor_founder_package_alignment') ||
  !authSmoke.includes('gcsc-admin-evidence-export-preview-week-two-investor-founder-package-alignment-smoke')
) {
  fail('Admin evidence export preview must expose week_two_investor_founder_package_alignment as metadata-only source with review router, Request Trace prefill, shortcuts, and blocked recipient/send/publication/live-finance/token/AI/legal/provider/live fields');
}
if (
  !server.includes('week_two_investor_founder_package_execution_checklist_target') ||
  !server.includes("source_id: 'week_two_investor_founder_package_execution_checklist'") ||
  !server.includes('Week 2 investor/founder package execution checklist') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('investor_founder_package_execution_checklist_count') ||
  !server.includes('execution_checklist_count') ||
  !server.includes('execution_phase_counts') ||
  !server.includes('review_area_counts') ||
  !server.includes('founder_report_field_count') ||
  !server.includes('safe_report_fields') ||
  !server.includes('no_recipient_contact_data_requested') ||
  !server.includes('No recipient contact data, investor outreach approvals, grant submission approvals, provider outreach approvals, attorney outreach approvals, external-send approvals, deck publication approvals, PDF publication approvals, email/social publication approvals, public URL-share approvals, public claim approvals, raw founder notes, raw reviewer responses, provider commitments, payment data, wallet data, real finance approvals, loan approvals, escrow approvals, repayment routing approvals, stablecoin settlement approvals, token collateral approvals, token custody approvals, XPR signatures, FIO registrations, Metallicus/provider approval claims, AI authority claims, legal/provider decisions, production approvals, server storage, external sends, or live-action approvals are exported from this Week 2 investor/founder package execution checklist preview.') ||
  !server.includes('recipient_contact_data') ||
  !server.includes('email_publication_approval') ||
  !server.includes('real_finance_approval') ||
  !server.includes('escrow_release_approval') ||
  !server.includes('metallicus_provider_approval_claim') ||
  !server.includes('ai_authority_claim_approval') ||
  !server.includes('provider_commitment_approval') ||
  !html.includes('<option value="week_two_investor_founder_package_execution_checklist">Week 2 investor package execution checklist</option>') ||
  !html.includes("week_two_investor_founder_package_execution_checklist: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('week_two_investor_founder_package_execution_checklist')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_investor_founder_package_execution_checklist')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_investor_founder_package_execution_checklist')") ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_investor_founder_package_execution_checklist') ||
  !authSmoke.includes('gcsc-admin-evidence-export-preview-week-two-investor-founder-package-execution-checklist-smoke')
) {
  fail('Admin evidence export preview must expose week_two_investor_founder_package_execution_checklist as metadata-only source with review router, Request Trace prefill, shortcuts, and blocked recipient/send/publication/finance/token/AI/legal/provider/live fields');
}
if (
  !server.includes('payment_intent_ownership_readiness_target') ||
  !server.includes("source_id: 'payment_intent_ownership_readiness'") ||
  !server.includes('Payment intent ownership readiness') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('payment_ownership_readiness_count') ||
  !server.includes('typed_ownership_column_count') ||
  !server.includes('typed_ownership_columns') ||
  !server.includes('readiness_phase_counts') ||
  !server.includes('no_payment_sql_apply_attempted') ||
  !server.includes('payment_intents_sql_apply_approval') ||
  !server.includes('xpr_transfer_approval') ||
  !server.includes('stablecoin_settlement_approval') ||
  !server.includes('token_collateral_lock_approval') ||
  !html.includes('<option value="payment_intent_ownership_readiness">Payment intent ownership readiness</option>') ||
  !html.includes("payment_intent_ownership_readiness: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('payment_intent_ownership_readiness')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('payment_intent_ownership_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('payment_intent_ownership_readiness')") ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=payment_intent_ownership_readiness') ||
  !authSmoke.includes('gcsc-admin-evidence-export-preview-payment-intent-ownership-readiness-smoke')
) {
  fail('Admin evidence export preview must expose payment_intent_ownership_readiness as metadata-only source with review router, Request Trace prefill, shortcuts, and blocked payment/SQL/provider/token/legal/live fields');
}
if (
  !server.includes('week_two_local_validation_pass_readiness_target') ||
  !server.includes("source_id: 'week_two_local_validation_pass_readiness'") ||
  !server.includes('Week 2 local validation pass readiness') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('validation_readiness_count') ||
  !server.includes('validation_phase_counts') ||
  !server.includes('required_command_count') ||
  !server.includes('required_commands') ||
  !server.includes('no_strict_rls_apply_attempted') ||
  !server.includes('no_destructive_git_action_attempted') ||
  !server.includes('No secrets, raw terminal logs, raw failure excerpts, raw public copy, publication approvals, public file replacement approvals, deploy approvals, public URL-share approvals, tester-invite approvals, live Supabase approvals, strict RLS apply approvals, external account approvals, payment data, wallet data, real finance approvals, loan approvals, escrow approvals, repayment routing approvals, stablecoin settlement approvals, token collateral approvals, XPR signatures, FIO registrations, legal/provider decisions, destructive git approvals, production approvals, server storage, external sends, or live-action approvals are exported from this Week 2 local validation pass readiness preview.') ||
  !server.includes('raw_terminal_log') ||
  !server.includes('raw_failure_excerpt') ||
  !server.includes('public_whitepaper_html_replacement_approval') ||
  !server.includes('strict_rls_apply_approval') ||
  !server.includes('destructive_git_approval') ||
  !html.includes('<option value="week_two_local_validation_pass_readiness">Week 2 local validation pass readiness</option>') ||
  !html.includes("week_two_local_validation_pass_readiness: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('week_two_local_validation_pass_readiness')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_local_validation_pass_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_local_validation_pass_readiness')") ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_local_validation_pass_readiness') ||
  !authSmoke.includes('gcsc-admin-evidence-export-preview-week-two-local-validation-pass-readiness-smoke')
) {
  fail('Admin evidence export preview must expose week_two_local_validation_pass_readiness as metadata-only source with review router, Request Trace prefill, shortcuts, and blocked raw/log/public/live/destructive fields');
}
if (
  !server.includes('week_two_local_validation_pass_execution_checklist_target') ||
  !server.includes("source_id: 'week_two_local_validation_pass_execution_checklist'") ||
  !server.includes('Week 2 local validation pass execution checklist') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('validation_execution_checklist_count') ||
  !server.includes('execution_phase_counts') ||
  !server.includes('required_command_count') ||
  !server.includes('required_commands') ||
  !server.includes('no_external_send_attempted') ||
  !server.includes('No secrets, raw terminal logs, raw failure excerpts, raw public copy, validation bypass approvals, publication approvals, public file replacement approvals, deploy approvals, public URL-share approvals, tester-invite approvals, live Supabase approvals, strict RLS apply approvals, external account approvals, payment data, wallet data, real finance approvals, loan approvals, escrow approvals, repayment routing approvals, stablecoin settlement approvals, token collateral approvals, XPR signatures, FIO registrations, legal/provider decisions, destructive git approvals, production approvals, server storage, external sends, or live-action approvals are exported from this Week 2 local validation pass execution checklist preview.') ||
  !server.includes('validation_bypass_approval') ||
  !server.includes('raw_terminal_log') ||
  !server.includes('raw_failure_excerpt') ||
  !server.includes('public_whitepaper_html_replacement_approval') ||
  !server.includes('strict_rls_apply_approval') ||
  !server.includes('destructive_git_approval') ||
  !html.includes('<option value="week_two_local_validation_pass_execution_checklist">Week 2 validation pass execution checklist</option>') ||
  !html.includes("week_two_local_validation_pass_execution_checklist: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('week_two_local_validation_pass_execution_checklist')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_local_validation_pass_execution_checklist')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_local_validation_pass_execution_checklist')") ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_local_validation_pass_execution_checklist') ||
  !authSmoke.includes('gcsc-admin-evidence-export-preview-week-two-local-validation-pass-execution-checklist-smoke')
) {
  fail('Admin evidence export preview must expose week_two_local_validation_pass_execution_checklist as metadata-only source with review router, Request Trace prefill, shortcuts, and blocked raw/log/public/live/destructive fields');
}
if (
  !server.includes('week_two_two_week_closeout_readiness_target') ||
  !server.includes("source_id: 'week_two_two_week_closeout_readiness'") ||
  !server.includes('Week 2 two-week closeout readiness') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('closeout_readiness_count') ||
  !server.includes('checklist_phase_counts') ||
  !server.includes('required_evidence_count') ||
  !server.includes('no_magic_link_url_requested') ||
  !server.includes('no_admin_membership_insert_attempted') ||
  !server.includes('No secrets, Magic Link URLs, Auth tokens, service-role keys, raw env values, raw terminal logs, raw founder notes, private IDs, recipient contact data, external-send approvals, investor outreach approvals, grant submission approvals, provider outreach approvals, attorney outreach approvals, deploy approvals, public file replacement approvals, public URL-share approvals, tester-invite approvals, live Supabase approvals, admin membership insert approvals, strict RLS apply approvals, App Store or Play Console approvals, payment data, wallet data, real finance approvals, loan approvals, escrow approvals, repayment routing approvals, stablecoin settlement approvals, token collateral approvals, XPR signatures, FIO registrations, legal/provider decisions, destructive git approvals, production approvals, server storage, external sends, or live-action approvals are exported from this Week 2 two-week closeout readiness preview.') ||
  !server.includes('magic_link_url') ||
  !server.includes('auth_token') ||
  !server.includes('admin_membership_insert_approval') ||
  !server.includes('external_send_approval') ||
  !server.includes('signing_key_upload_approval') ||
  !html.includes('<option value="week_two_two_week_closeout_readiness">Week 2 two-week closeout readiness</option>') ||
  !html.includes("week_two_two_week_closeout_readiness: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('week_two_two_week_closeout_readiness')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('week_two_two_week_closeout_readiness')") ||
  !html.includes("setRequestTraceReportSourceSurface('week_two_two_week_closeout_readiness')") ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=week_two_two_week_closeout_readiness') ||
  !authSmoke.includes('gcsc-admin-evidence-export-preview-week-two-two-week-closeout-readiness-smoke')
) {
  fail('Admin evidence export preview must expose week_two_two_week_closeout_readiness as metadata-only source with review router, Request Trace prefill, shortcuts, and blocked secret/auth/raw/external/public/live fields');
}
if (
  !server.includes('homepage_publication_evidence_checklist_target') ||
  !server.includes("source_id: 'homepage_publication_evidence_checklist'") ||
  !server.includes('Homepage publication evidence checklist') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('viewport_guard_present') ||
  !server.includes('required_browser_viewports') ||
  !server.includes('No public replacement approval, PUBLICATION_GO approval text, raw founder notes, screenshot files, deploy approvals, URL-share approvals, tester-invite approvals, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this homepage publication evidence checklist preview.') ||
  !server.includes('publication_go_approval') ||
  !server.includes('raw_browser_screenshot') ||
  !server.includes('tester_invite_approval') ||
  !html.includes('<option value="homepage_publication_evidence_checklist">Homepage publication evidence checklist</option>')
) {
  fail('Admin evidence export preview must expose homepage_publication_evidence_checklist as metadata-only source with review router and blocked public/deploy/share/live fields');
}
if (
  !server.includes('homepage_publication_sequence_gate_target') ||
  !server.includes("source_id: 'homepage_publication_sequence_gate'") ||
  !server.includes('Homepage publication sequence gate') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('sequence_gate_count') ||
  !server.includes('gate_state_counts') ||
  !server.includes('required_decision_count') ||
  !server.includes('required_evidence_count') ||
  !server.includes('evidence_source_count') ||
  !server.includes('No PUBLICATION_GO approval text, public replacement approval, copy direction approval, exact file replacement approval, deploy setup approval, URL-share approval, tester-invite approval, raw founder notes, raw homepage copy, final copy approvals, screenshot files, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this homepage publication sequence gate preview.') ||
  !server.includes('exact_file_replacement_approval') ||
  !server.includes('deploy_setup_approval') ||
  !server.includes('url_smoke_approval') ||
  !server.includes('public_beta_invite_approval') ||
  !server.includes('raw_homepage_copy') ||
  !server.includes('public_index_html_replacement_approval') ||
  !server.includes('public_whitepaper_edit_approval') ||
  !server.includes('deploy_setting_change_approval') ||
  !server.includes('stablecoin_settlement_approval') ||
  !server.includes('token_collateral_lock_approval') ||
  !html.includes('<option value="homepage_publication_sequence_gate">Homepage publication sequence gate</option>') ||
  !html.includes("homepage_publication_sequence_gate: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('homepage_publication_sequence_gate')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('homepage_publication_sequence_gate')") ||
  !html.includes("setRequestTraceReportSourceSurface('homepage_publication_sequence_gate')") ||
  !authSmoke.includes('homepage_publication_sequence_gate') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=homepage_publication_sequence_gate')
) {
  fail('Admin evidence export preview must expose homepage_publication_sequence_gate as metadata-only source with review router, Request Trace prefill, shortcuts, runtime smoke coverage, and blocked publication/deploy/share/invite/live fields');
}
if (
  !server.includes('homepage_publication_review_packet_target') ||
  !server.includes("source_id: 'homepage_publication_review_packet'") ||
  !server.includes('Homepage publication review packet') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('packet_state') ||
  !server.includes('safe_public_promise') ||
  !server.includes('required_decision_count') ||
  !server.includes('required_evidence_source_count') ||
  !server.includes('blocked_public_claim_count') ||
  !server.includes('blocked_live_action_count') ||
  !server.includes('No PUBLICATION_GO approval text, public replacement approval, raw founder notes, raw homepage copy, final copy approvals, public claim approvals, deploy/share/invite approvals, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this homepage publication review packet preview.') ||
  !server.includes('copy_direction_approval') ||
  !server.includes('public_claim_approval') ||
  !server.includes('raw_homepage_copy') ||
  !server.includes('public_index_html_replacement_approval') ||
  !server.includes('public_whitepaper_edit_approval') ||
  !server.includes('deploy_setting_change_approval') ||
  !server.includes('stablecoin_settlement_approval') ||
  !server.includes('token_collateral_lock_approval') ||
  !html.includes('<option value="homepage_publication_review_packet">Homepage publication review packet</option>') ||
  !html.includes("homepage_publication_review_packet: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('homepage_publication_review_packet')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('homepage_publication_review_packet')") ||
  !html.includes("setRequestTraceReportSourceSurface('homepage_publication_review_packet')") ||
  !authSmoke.includes('homepage_publication_review_packet') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=homepage_publication_review_packet')
) {
  fail('Admin evidence export preview must expose homepage_publication_review_packet as metadata-only source with review router, Request Trace prefill, shortcuts, runtime smoke coverage, and blocked copy/public/deploy/share/live fields');
}
if (
  !server.includes('homepage_publication_decision_summary_target') ||
  !server.includes("source_id: 'homepage_publication_decision_summary'") ||
  !server.includes('Homepage publication decision summary') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('recommended_founder_response_count') ||
  !server.includes('ready_local_evidence_count') ||
  !server.includes('remaining_blocker_count') ||
  !server.includes('next_safe_action_count') ||
  !server.includes('No PUBLICATION_GO approval text, public replacement approval, raw founder notes, final copy approvals, screenshot files, deploy/share/invite approvals, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this homepage publication decision summary preview.') ||
  !server.includes('final_copy_approval') ||
  !server.includes('raw_homepage_copy') ||
  !server.includes('public_index_html_replacement_approval') ||
  !server.includes('public_whitepaper_edit_approval') ||
  !server.includes('deploy_setting_change_approval') ||
  !server.includes('stablecoin_settlement_approval') ||
  !server.includes('token_collateral_lock_approval') ||
  !html.includes('<option value="homepage_publication_decision_summary">Homepage publication decision summary</option>') ||
  !html.includes("homepage_publication_decision_summary: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('homepage_publication_decision_summary')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('homepage_publication_decision_summary')") ||
  !html.includes("setRequestTraceReportSourceSurface('homepage_publication_decision_summary')") ||
  !authSmoke.includes('homepage_publication_decision_summary') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=homepage_publication_decision_summary')
) {
  fail('Admin evidence export preview must expose homepage_publication_decision_summary as metadata-only source with review router, Request Trace prefill, shortcuts, runtime smoke coverage, and blocked public replacement, final-copy, deploy/share/live fields');
}
if (
  !server.includes('homepage_static_asset_candidate_target') ||
  !server.includes("source_id: 'homepage_static_asset_candidate'") ||
  !server.includes('Homepage static asset candidate') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('static_candidate_count') ||
  !server.includes('asset_posture_count') ||
  !server.includes('browser_evidence_count') ||
  !server.includes('No PUBLICATION_GO approval text, public replacement approval, raw founder notes, raw HTML/CSS contents, screenshot files, external asset upload approvals, deploy/share/invite approvals, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this homepage static asset candidate preview.') ||
  !server.includes('raw_homepage_html') ||
  !server.includes('raw_css_contents') ||
  !server.includes('external_asset_upload_approval') ||
  !server.includes('public_index_html_replacement_approval') ||
  !server.includes('deploy_setting_change_approval') ||
  !server.includes('stablecoin_settlement_approval') ||
  !server.includes('token_collateral_lock_approval') ||
  !html.includes('<option value="homepage_static_asset_candidate">Homepage static asset candidate</option>') ||
  !html.includes("homepage_static_asset_candidate: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('homepage_static_asset_candidate')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('homepage_static_asset_candidate')") ||
  !html.includes("setRequestTraceReportSourceSurface('homepage_static_asset_candidate')") ||
  !authSmoke.includes('homepage_static_asset_candidate') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=homepage_static_asset_candidate')
) {
  fail('Admin evidence export preview must expose homepage_static_asset_candidate as metadata-only source with review router, Request Trace prefill, shortcuts, runtime smoke coverage, and blocked raw HTML/CSS, external-asset, public replacement, deploy/share/live fields');
}
if (
  !server.includes('homepage_publication_final_qa_hold_target') ||
  !server.includes("source_id: 'homepage_publication_final_qa_hold'") ||
  !server.includes('Homepage final QA hold') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('final_qa_hold_item_count') ||
  !server.includes('hold_state_counts') ||
  !server.includes('publication_allowed') ||
  !server.includes('required_before_publication_go') ||
  !server.includes('No PUBLICATION_GO approval text, public replacement approval, raw founder notes, screenshot files, archive execution approvals, deploy/share/invite approvals, legal/provider decisions, payment data, wallet data, server storage, external sends, or live-action approvals are exported from this homepage final QA hold preview.') ||
  !server.includes('archive_execution_approval') ||
  !server.includes('public_index_html_replacement_approval') ||
  !server.includes('deploy_setting_change_approval') ||
  !server.includes('stablecoin_settlement_approval') ||
  !server.includes('token_collateral_lock_approval') ||
  !html.includes('<option value="homepage_publication_final_qa_hold">Homepage final QA hold</option>') ||
  !html.includes("homepage_publication_final_qa_hold: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('homepage_publication_final_qa_hold')")
) {
  fail('Admin evidence export preview must expose homepage_publication_final_qa_hold as metadata-only source with review router, Request Trace prefill, and blocked public/archive/deploy/share/live fields');
}
if (
  !server.includes('whitepaper_v1_3_publication_gate_target') ||
  !server.includes("source_id: 'whitepaper_v1_3_publication_gate'") ||
  !server.includes('Whitepaper v1.3 publication gate') ||
  !server.includes("ui_anchor: 'betaReadinessGrid'") ||
  !server.includes('required_before_review_count') ||
  !server.includes('required_before_go_count') ||
  !server.includes('no_go_reason_count') ||
  !server.includes('blocked_public_action_count') ||
  !server.includes('No founder publication approval, PUBLICATION_GO approval text, public replacement approval, archive execution approval, raw founder notes, raw whitepaper copy, PDF/deck/email/social send approvals, legal/provider decisions, payment data, wallet data, XPR/FIO actions, server storage, external sends, or live-action approvals are exported from this whitepaper v1.3 publication gate preview.') ||
  !server.includes('founder_publication_approval') ||
  !server.includes('public_whitepaper_html_replacement_approval') ||
  !server.includes('public_index_html_replacement_approval') ||
  !server.includes('archive_execution_approval') ||
  !server.includes('raw_whitepaper_copy') ||
  !server.includes('pdf_publication_approval') ||
  !server.includes('email_announcement_approval') ||
  !server.includes('social_announcement_approval') ||
  !server.includes('xpr_signature') ||
  !server.includes('fio_registration') ||
  !html.includes('<option value="whitepaper_v1_3_publication_gate">Whitepaper v1.3 publication gate</option>') ||
  !html.includes("whitepaper_v1_3_publication_gate: requestTraceReportAdminEvidenceExportPreviewEntriesForSource('whitepaper_v1_3_publication_gate')") ||
  !html.includes("setAdminEvidenceExportPreviewSourceFilter('whitepaper_v1_3_publication_gate')") ||
  !html.includes("setRequestTraceReportSourceSurface('whitepaper_v1_3_publication_gate')") ||
  !authSmoke.includes('whitepaper_v1_3_publication_gate') ||
  !authSmoke.includes('/api/admin/whitepaper-v1-3-publication-gate') ||
  !authSmoke.includes('gcsc-whitepaper-v13-publication-gate-endpoint-smoke') ||
  !authSmoke.includes("request_path === '/api/admin/whitepaper-v1-3-publication-gate'") ||
  !authSmoke.includes("request_method === 'GET'") ||
  !authSmoke.includes('request_id_header') ||
  !authSmoke.includes('/api/admin/admin-evidence-export-preview?source_filter=whitepaper_v1_3_publication_gate')
) {
  fail('Admin evidence export preview and direct endpoint must expose whitepaper_v1_3_publication_gate as metadata-only source with review router, Request Trace prefill, shortcuts, runtime smoke coverage, and blocked publication/archive/send/Web3/live fields');
}
if (
  !html.includes('REQUEST_TRACE_REPORT_HISTORY_KEY') ||
  !html.includes('requestTraceReportHistory') ||
  !html.includes('requestTraceReportHistorySummary') ||
  !html.includes('requestTraceReportHistoryGrid') ||
  !html.includes('clearRequestTraceReportHistoryBtn') ||
  !html.includes('saveRequestTraceReportHistory') ||
  !html.includes('reuseRequestTraceReportHistoryEntry') ||
  !html.includes('Reuse safe IDs in Request Trace') ||
  !html.includes('localStorage.removeItem(REQUEST_TRACE_REPORT_NOTES_KEY)') ||
  !html.includes('renderRequestTraceReportHistory') ||
  !html.includes('request_trace_report_history') ||
  !html.includes('local_history_only') ||
  !html.includes('metadata_only')
) {
  fail('SmartContractor Admin UI must keep a local metadata-only request trace report history with clear/reuse controls and no raw-note/server storage');
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
  !server.includes('traditional_first_public_copy_validation_history') ||
  !server.includes('traditional_first_public_copy_validation_history_target') ||
  !server.includes('traditionalFirstPublicCopyValidationHistoryGrid') ||
  !server.includes('public_copy_validation_metadata_history_only') ||
  !server.includes('raw_public_copy_draft') ||
  !server.includes('copy_text') ||
  !server.includes('No raw public copy drafts, issue excerpts, secrets, payment data, identity data, provider/legal decisions, public beta approvals, production approvals, external sends, or live-action approvals are stored in this history.') ||
  !server.includes('homepage_publication_decision_validation_history') ||
  !server.includes('homepage_publication_decision_validation_history_target') ||
  !server.includes('homepagePublicationDecisionValidationHistoryGrid') ||
  !server.includes('homepage_publication_decision_validation_metadata_history_only') ||
  !server.includes('raw_founder_decision_text') ||
  !server.includes('decision_text') ||
  !server.includes('founder_decision_text') ||
  !server.includes('publication_go_text') ||
  !server.includes('public_replacement_approval') ||
  !server.includes('deploy_approval') ||
  !server.includes('url_share_approval') ||
  !server.includes('tester_invite_approval') ||
  !server.includes('No raw founder decision text, PUBLICATION_GO text, issue excerpts, secrets, payment data, identity data, provider/legal decisions, public replacement approvals, deploy approvals, URL-share approvals, tester-invite approvals, production approvals, external sends, or live-action approvals are stored in this history.') ||
  !server.includes('beta_finance_contract_reviewer_note_validation_history') ||
  !server.includes('betaFinanceContractReviewerNoteValidationHistoryGrid') ||
  !server.includes('reviewer_note_validation_metadata_history_only') ||
  !server.includes('No raw reviewer notes, issue excerpts, secrets, payment data, identity data, signed contract text, XPR signatures, provider/legal decisions, public beta approvals, production approvals, external sends, or live-action approvals are stored in this history.') ||
  !server.includes('beta_finance_contract_live_confusion_validation_history') ||
  !server.includes('beta_finance_contract_live_confusion_validation_history_target') ||
  !server.includes('betaFinanceContractLiveConfusionValidationHistoryGrid') ||
  !server.includes('live_confusion_validation_metadata_history_only') ||
  !server.includes('raw_content_storage_boundary') ||
  !server.includes('No raw live-confusion notes, issue excerpts, secrets, payment data, identity data, signed contract text, XPR signatures, provider/legal decisions, public beta approvals, external follow-up approvals, production approvals, external sends, or live-action approvals are stored in this history.') ||
  !server.includes('beta_finance_contract_session_safety_validation_history') ||
  !server.includes('beta_finance_contract_session_safety_validation_history_target') ||
  !server.includes('betaFinanceContractSessionSafetyValidationHistoryGrid') ||
  !server.includes('session_safety_validation_metadata_history_only') ||
  !server.includes('raw_session_safety_note') ||
  !server.includes('session_safety_issue_excerpt') ||
  !server.includes('No raw session-safety notes, issue excerpts, secrets, payment data, identity data, signed contract text, XPR signatures, stablecoin settlement approvals, token collateral approvals, provider/legal decisions, public beta approvals, external follow-up approvals, production approvals, external sends, or live-action approvals are stored in this history.') ||
  !server.includes('beta_finance_contract_safe_handoff_report_history') ||
  !server.includes('beta_finance_contract_safe_handoff_report_history_target') ||
  !server.includes('betaFinanceContractSafeHandoffReportHistoryGrid') ||
  !server.includes('safe_handoff_report_metadata_history_only') ||
  !server.includes('no_copyable_markdown_storage') ||
  !server.includes('copyable_markdown') ||
  !server.includes('issue_excerpts') ||
  !server.includes('stablecoin_approval') ||
  !server.includes('token_collateral_approval') ||
  !server.includes('No copyable markdown, raw notes, issue excerpts, secrets, payment data, identity data, signed contract text, XPR signatures, stablecoin approvals, token collateral approvals, provider/legal decisions, public beta approvals, production approvals, external sends, server storage, or live-action approvals are stored in this history.') ||
  !server.includes('job_fit_snapshot_history') ||
  !server.includes('job_fit_snapshot_history_target') ||
  !server.includes('jobFitSnapshotHistoryGrid') ||
  !server.includes('job_fit_snapshot_metadata_history_only') ||
  !server.includes('no_real_lead_routing_history_stored') ||
  !server.includes('No raw job details, real lead routing history, contractor assignment approvals, live matching actions, external sends, server storage, or live-action approvals are stored in this history.') ||
  !server.includes('bid_readiness_comparison_history') ||
  !server.includes('bid_readiness_comparison_history_target') ||
  !server.includes('bidReadinessComparisonHistoryGrid') ||
  !server.includes('bid_readiness_comparison_metadata_history_only') ||
  !server.includes('no_winning_bid_history_stored') ||
  !server.includes('No raw bid details, winning bid selection history, contractor assignment approvals, live selection actions, external sends, server storage, or live-action approvals are stored in this history.') ||
  !server.includes('dispute_evidence_review_packet_history') ||
  !server.includes('dispute_evidence_review_packet_history_target') ||
  !server.includes('disputeEvidenceReviewPacketHistoryGrid') ||
  !server.includes('dispute_evidence_review_packet_metadata_history_only') ||
  !server.includes('no_dispute_review_packet_content_stored') ||
  !server.includes('No dispute evidence packet sections, markdown previews, redaction attestation values, raw evidence, peer review details, secrets, payment data, wallet data, provider submissions, legal decisions, liability decisions, escrow releases, refund issues, payment movements, payment routing approvals, Auth/RLS changes, or production approvals are stored in this dispute evidence review packet history.') ||
  !server.includes('milestone_evidence_review_packet_history') ||
  !server.includes('milestone_evidence_review_packet_history_target') ||
  !server.includes('milestoneEvidenceReviewPacketHistoryGrid') ||
  !server.includes('milestone_evidence_review_packet_metadata_history_only') ||
  !server.includes('no_milestone_review_packet_content_stored') ||
  !server.includes('No milestone evidence packet sections, markdown previews, redaction attestation values, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, milestone approvals, escrow releases, payment movements, repayment routing approvals, stablecoin settlements, token collateral locks, Auth/RLS changes, or production approvals are stored in this milestone evidence review packet history.') ||
  !server.includes('working_capital_review_packet_history') ||
  !server.includes('working_capital_review_packet_history_target') ||
  !server.includes('workingCapitalReviewPacketHistoryGrid') ||
  !server.includes('working_capital_review_packet_metadata_history_only') ||
  !server.includes('no_working_capital_review_packet_content_stored') ||
  !server.includes('No working-capital review packet sections, markdown previews, redaction attestation values, contractor identity data, project contract details, repayment waterfall details, funding approval evidence, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, contractor funding actions, loan originations, payment movements, repayment routing approvals, escrow releases, stablecoin settlements, token collateral locks, Auth/RLS changes, or production approvals are stored in this working-capital review packet history.') ||
  !server.includes('contractor_reputation_review_packet_history') ||
  !server.includes('contractor_reputation_review_packet_history_target') ||
  !server.includes('contractorReputationReviewPacketHistoryGrid') ||
  !server.includes('contractor_reputation_review_packet_metadata_history_only') ||
  !server.includes('no_contractor_reputation_review_packet_content_stored') ||
  !server.includes('No contractor reputation packet sections, markdown previews, redaction attestation values, raw media, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, public score approvals, contractor rankings, credit approvals, credit denials, adverse-action outputs, contractor assignments, Auth/RLS changes, or production approvals are stored in this contractor reputation review packet history.') ||
  !server.includes('contractor_verification_review_packet_history') ||
  !server.includes('contractor_verification_review_packet_history_target') ||
  !server.includes('contractorVerificationReviewPacketHistoryGrid') ||
  !server.includes('contractor_verification_review_packet_metadata_history_only') ||
  !server.includes('no_contractor_verification_review_packet_content_stored') ||
  !server.includes('No contractor verification packet sections, markdown previews, redaction attestation values, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, eligibility approvals, eligibility denials, real lead routing, Auth/RLS changes, or production approvals are stored in this contractor verification review packet history.') ||
  !server.includes('readiness_overview_review_packet_history') ||
  !server.includes('readiness_overview_review_packet_history_target') ||
  !server.includes('readinessOverviewReviewPacketHistoryGrid') ||
  !server.includes('readiness_overview_review_packet_metadata_history_only') ||
  !server.includes('no_admin_readiness_overview_review_packet_content_stored') ||
  !server.includes('No readiness overview packet sections, markdown previews, redaction attestation values, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or production approvals are stored in this readiness overview review packet history.') ||
  !server.includes('provider_evidence_packet_history') ||
  !server.includes('provider_evidence_packet_history_target') ||
  !server.includes('providerEvidencePacketHistoryGrid') ||
  !server.includes('provider_packet_metadata_history_only') ||
  !server.includes('no_provider_evidence_packet_content_stored') ||
  !server.includes('No packet sections, markdown previews, redaction findings, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or production approvals are stored in this history.') ||
  !server.includes('provider_evidence_packet_print_template_history') ||
  !server.includes('provider_evidence_packet_print_template_history_target') ||
  !server.includes('providerEvidencePacketPrintTemplateHistoryGrid') ||
  !server.includes('provider_print_template_metadata_history_only') ||
  !server.includes('no_provider_print_template_content_stored') ||
  !server.includes('No print template sections, markdown previews, redaction attestations, raw packet content, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or production approvals are stored in this print template history.') ||
  !server.includes('provider_evidence_packet_redaction_qa_history') ||
  !server.includes('provider_evidence_packet_redaction_qa_history_target') ||
  !server.includes('providerEvidencePacketRedactionQaHistoryGrid') ||
  !server.includes('provider_redaction_qa_metadata_history_only') ||
  !server.includes('no_provider_redaction_qa_content_stored') ||
  !server.includes('No redaction finding details, matched terms, forbidden phrase source text, markdown previews, print template sections, redaction attestations, raw packet content, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, or production approvals are stored in this redaction QA history.') ||
  !server.includes('provider_evidence_review_chain_history') ||
  !server.includes('provider_evidence_review_chain_history_target') ||
  !server.includes('providerEvidenceReviewChainHistoryGrid') ||
  !server.includes('provider_review_chain_metadata_history_only') ||
  !server.includes('no_provider_review_chain_content_stored') ||
  !server.includes('No provider review chain step details, packet sections, print template sections, redaction finding details, matched terms, markdown previews, redaction attestations, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, production approvals, external sends, or live-action approvals are stored in this provider review chain history.') ||
  !server.includes('smart_contract_local_replay_dry_run_history') ||
  !server.includes('smart_contract_local_replay_dry_run_history_target') ||
  !server.includes('smartContractLocalReplayDryRunHistoryGrid') ||
  !server.includes('smart_contract_local_replay_dry_run_metadata_history_only') ||
  !server.includes('no_smart_contract_local_replay_dry_run_content_stored') ||
  !server.includes('No local replay dry-run step details, helper exports, demo fixtures, evidence packet sections, handoff summary sections, workbench card details, raw smart-contract helper payloads, secrets, signatures, payment data, loan approvals, escrow releases, repayment routing approvals, stablecoin settlements, token collateral locks, provider commitments, legal decisions, production approvals, external sends, or live-action approvals are stored in this smart contract local replay dry-run history.') ||
  !server.includes('smart_contract_local_replay_dry_run_evidence_packet_history') ||
  !server.includes('smart_contract_local_replay_dry_run_evidence_packet_history_target') ||
  !server.includes('smartContractLocalReplayDryRunEvidencePacketHistoryGrid') ||
  !server.includes('smart_contract_local_replay_dry_run_evidence_packet_metadata_history_only') ||
  !server.includes('no_dry_run_packet_content_stored') ||
  !server.includes('No dry-run packet sections, markdown previews, redaction attestation values, local replay dry-run step details, helper exports, demo fixtures, workbench card details, handoff summary sections, raw smart-contract helper payloads, secrets, signatures, payment data, loan approvals, escrow releases, repayment routing approvals, stablecoin settlements, token collateral locks, provider commitments, legal decisions, production approvals, external sends, or live-action approvals are stored in this smart contract local replay dry-run evidence packet history.') ||
  !server.includes('smart_contract_review_workbench_history') ||
  !server.includes('smart_contract_review_workbench_history_target') ||
  !server.includes('smartContractReviewWorkbenchHistoryGrid') ||
  !server.includes('smart_contract_review_workbench_metadata_history_only') ||
  !server.includes('no_smart_contract_review_workbench_content_stored') ||
  !server.includes('No workbench card details, helper exports, demo fixtures, dry-run step details, evidence packet sections, handoff summary sections, raw smart-contract helper payloads, secrets, signatures, payment data, loan approvals, escrow releases, repayment routing approvals, stablecoin settlements, token collateral locks, provider commitments, legal decisions, production approvals, external sends, or live-action approvals are stored in this smart contract review workbench history.') ||
  !server.includes('smart_contract_review_workbench_handoff_summary_history') ||
  !server.includes('smart_contract_review_workbench_handoff_summary_history_target') ||
  !server.includes('smartContractReviewWorkbenchHandoffSummaryHistoryGrid') ||
  !server.includes('smart_contract_review_workbench_handoff_summary_metadata_history_only') ||
  !server.includes('no_smart_contract_review_workbench_handoff_summary_content_stored') ||
  !server.includes('No handoff summary section details, markdown previews, redaction attestation values, workbench card details, helper exports, demo fixtures, dry-run step details, evidence packet sections, raw smart-contract helper payloads, secrets, signatures, payment data, loan approvals, escrow releases, repayment routing approvals, stablecoin settlements, token collateral locks, provider commitments, legal decisions, production approvals, external sends, or live-action approvals are stored in this smart contract review workbench handoff summary history.') ||
  !server.includes('smart_contract_review_workbench_gate_matrix_history') ||
  !server.includes('smart_contract_review_workbench_gate_matrix_history_target') ||
  !server.includes('smartContractReviewWorkbenchGateMatrixHistoryGrid') ||
  !server.includes('smart_contract_review_gate_matrix_metadata_history_only') ||
  !server.includes('no_smart_contract_review_gate_matrix_content_stored') ||
  !server.includes('No gate matrix row details, review gate row details, recommended review order details, helper exports, demo fixtures, dry-run steps, evidence packet sections, handoff summary sections, raw smart-contract helper payloads, secrets, signatures, payment data, loan approvals, escrow releases, repayment routing approvals, stablecoin settlements, token collateral locks, provider commitments, legal decisions, production approvals, external sends, or live-action approvals are stored in this smart contract review gate matrix history.') ||
  !server.includes('milestone_acceptance_snapshot_history') ||
  !server.includes('milestone_acceptance_snapshot_history_target') ||
  !server.includes('milestoneAcceptanceSnapshotHistoryGrid') ||
  !server.includes('raw_milestone_evidence') ||
  !server.includes('milestone_approval_history') ||
  !server.includes('No raw milestone evidence, milestone approval history, escrow release history, payment movement history, repayment routing approvals, external sends, server storage, or live-action approvals are stored in this history.') ||
  !server.includes('repayment_allocation_preview_history') ||
  !server.includes('repayment_allocation_preview_history_target') ||
  !server.includes('repaymentAllocationPreviewHistoryGrid') ||
  !server.includes('repayment_allocation_preview_metadata_history_only') ||
  !server.includes('No raw payment references, payment tx hashes, loan IDs, borrower identity data, payment data, wallet data, repayment routing approvals, escrow release approvals, contractor payout approvals, legal/provider decisions, external sends, server storage, or live-action approvals are stored in this history.') ||
  !server.includes('repayment_readiness_snapshot_history') ||
  !server.includes('repayment_readiness_snapshot_history_target') ||
  !server.includes('repaymentReadinessSnapshotHistoryGrid') ||
  !server.includes('repayment_readiness_snapshot_metadata_history_only') ||
  !server.includes('No raw payment references, payment tx hashes, loan IDs, borrower identity data, payment data, wallet data, repayment readiness approvals, repayment routing approvals, escrow release approvals, contractor payout approvals, legal/provider decisions, external sends, server storage, or live-action approvals are stored in this history.') ||
  !server.includes('raw_reviewer_note') ||
  !server.includes('issue_excerpt') ||
  !server.includes('raw_payment_reference') ||
  !server.includes('payment_tx_hash') ||
  !server.includes('loan_id') ||
  !server.includes('borrower_identity_data') ||
  !server.includes('repayment_readiness_approval') ||
  !server.includes('repayment_routing_approval') ||
  !server.includes('escrow_release_approval') ||
  !server.includes('contractor_payout_approval') ||
  !server.includes('raw_live_confusion_note') ||
  !server.includes('live_confusion_issue_excerpt') ||
  !server.includes('raw_session_safety_note') ||
  !server.includes('session_safety_issue_excerpt') ||
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
  !html.includes('<option value="traditional_first_public_copy_validation_history">Traditional-first public copy validation</option>') ||
  !html.includes('<option value="homepage_publication_decision_validation_history">Homepage publication decision validation</option>') ||
  !html.includes('<option value="beta_finance_contract_reviewer_note_validation_history">Beta finance/contract reviewer note validation</option>') ||
  !html.includes('<option value="beta_finance_contract_live_confusion_validation_history">Beta finance/contract live-confusion validation</option>') ||
  !html.includes('<option value="beta_finance_contract_session_safety_validation_history">Beta finance/contract session-safety validation</option>') ||
  !html.includes('<option value="beta_finance_contract_safe_handoff_report_history">Beta finance/contract safe handoff report history</option>') ||
  !html.includes('<option value="job_fit_snapshot_history">Job fit snapshot history</option>') ||
  !html.includes('<option value="bid_readiness_comparison_history">Bid readiness comparison history</option>') ||
  !html.includes('<option value="dispute_evidence_review_packet_history">Dispute evidence review packet history</option>') ||
  !html.includes('<option value="milestone_evidence_review_packet_history">Milestone evidence review packet history</option>') ||
  !html.includes('<option value="working_capital_review_packet_history">Working capital review packet history</option>') ||
  !html.includes('<option value="contractor_reputation_review_packet_history">Contractor reputation review packet history</option>') ||
  !html.includes('<option value="contractor_verification_review_packet_history">Contractor verification review packet history</option>') ||
  !html.includes('<option value="readiness_overview_review_packet_history">Admin readiness overview review packet history</option>') ||
  !html.includes('<option value="provider_evidence_packet_history">Provider evidence packet history</option>') ||
  !html.includes('<option value="provider_evidence_packet_print_template_history">Provider evidence packet print template history</option>') ||
  !html.includes('<option value="provider_evidence_packet_redaction_qa_history">Provider evidence packet redaction QA history</option>') ||
  !html.includes('<option value="provider_evidence_review_chain_history">Provider evidence review chain history</option>') ||
  !html.includes('<option value="smart_contract_local_replay_dry_run_history">Smart contract local replay dry-run history</option>') ||
  !html.includes('<option value="smart_contract_local_replay_dry_run_evidence_packet_history">Smart contract local replay dry-run evidence packet history</option>') ||
  !html.includes('<option value="smart_contract_review_workbench_history">Smart contract review workbench history</option>') ||
  !html.includes('<option value="smart_contract_review_workbench_handoff_summary_history">Smart contract review workbench handoff summary history</option>') ||
  !html.includes('<option value="smart_contract_review_workbench_gate_matrix_history">Smart contract review gate matrix history</option>') ||
  !html.includes('<option value="milestone_acceptance_snapshot_history">Milestone acceptance snapshot history</option>') ||
  !html.includes('<option value="repayment_allocation_preview_history">Repayment allocation preview history</option>') ||
  !html.includes('<option value="repayment_readiness_snapshot_history">Repayment readiness snapshot history</option>') ||
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
  !html.includes('source.raw_content_storage_boundary') ||
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
  !html.includes('smartContractLocalReplayDryRunIds') ||
  !html.includes('smartContractLocalReplayDryRunHistory') ||
  !html.includes('smart_contract_local_replay_dry_run_history') ||
  !html.includes('smartContractLocalReplayDryRunHistoryGrid') ||
  !html.includes('No smart contract local replay dry-run content stored') ||
  !html.includes('No live replay action attempted') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include smart contract local replay dry-run history request IDs as local metadata only without dry-run steps, helper exports, demo fixtures, signatures, finance actions, provider/legal decisions, or live actions');
}
if (
  !html.includes('smartContractLocalReplayDryRunEvidencePacketIds') ||
  !html.includes('smartContractLocalReplayDryRunEvidencePacketHistory') ||
  !html.includes('smart_contract_local_replay_dry_run_evidence_packet_history') ||
  !html.includes('smartContractLocalReplayDryRunEvidencePacketHistoryGrid') ||
  !html.includes('No dry-run packet content stored') ||
  !html.includes('External send') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include smart contract local replay dry-run evidence packet history request IDs as local metadata only without packet sections, markdown previews, redaction values, helper payloads, external sends, or live actions');
}
if (
  !html.includes('smartContractReviewWorkbenchIds') ||
  !html.includes('smartContractReviewWorkbenchHistory') ||
  !html.includes('smart_contract_review_workbench_history') ||
  !html.includes('smartContractReviewWorkbenchHistoryGrid') ||
  !html.includes('No smart contract review workbench content stored') ||
  !html.includes('No live replay action attempted') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include smart contract review workbench history request IDs as local metadata only without workbench cards, helper exports, demo fixtures, dry-run details, packet/handoff content, signatures, finance actions, provider/legal decisions, or live actions');
}
if (
  !html.includes('smartContractReviewWorkbenchHandoffSummaryIds') ||
  !html.includes('smartContractReviewWorkbenchHandoffSummaryHistory') ||
  !html.includes('smart_contract_review_workbench_handoff_summary_history') ||
  !html.includes('smartContractReviewWorkbenchHandoffSummaryHistoryGrid') ||
  !html.includes('No smart contract review workbench handoff summary content stored') ||
  !html.includes('No live replay action attempted') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include smart contract review workbench handoff summary history request IDs as local metadata only without handoff sections, markdown previews, redaction values, workbench cards, helper exports, dry-run details, packet content, signatures, finance actions, provider/legal decisions, or live actions');
}
if (
  !html.includes('smartContractReviewWorkbenchGateMatrixIds') ||
  !html.includes('smartContractReviewWorkbenchGateMatrixHistory') ||
  !html.includes('smart_contract_review_workbench_gate_matrix_history') ||
  !html.includes('smartContractReviewWorkbenchGateMatrixHistoryGrid') ||
  !html.includes('No smart contract review gate matrix content stored') ||
  !html.includes('No live replay action attempted') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include smart contract review gate matrix history request IDs as local metadata only without gate rows, recommended order details, helper exports, dry-run details, packet/handoff content, signatures, finance actions, provider/legal decisions, or live actions');
}
if (
  !html.includes('jobFitSnapshotIds') ||
  !html.includes('jobFitSnapshotHistory') ||
  !html.includes('job_fit_snapshot_history') ||
  !html.includes('jobFitSnapshotHistoryGrid') ||
  !html.includes('No real lead routing history stored') ||
  !html.includes('No live matching action attempted') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include job fit snapshot history request IDs as local metadata only without real lead routing, contractor assignment, live matching, or live actions');
}
if (
  !html.includes('bidReadinessComparisonIds') ||
  !html.includes('bidReadinessComparisonHistory') ||
  !html.includes('bid_readiness_comparison_history') ||
  !html.includes('bidReadinessComparisonHistoryGrid') ||
  !html.includes('No winning bid history stored') ||
  !html.includes('No live selection action attempted') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include bid readiness comparison history request IDs as local metadata only without winning bid selection, contractor assignment, live selection, or live actions');
}
if (
  !html.includes('disputeEvidenceReviewPacketIds') ||
  !html.includes('disputeEvidenceReviewPacketHistory') ||
  !html.includes('dispute_evidence_review_packet_history') ||
  !html.includes('disputeEvidenceReviewPacketHistoryGrid') ||
  !html.includes('No dispute evidence review packet content stored') ||
  !html.includes('Liability decision') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include dispute evidence review packet history request IDs as local metadata only without packet sections, markdown previews, redaction values, raw evidence, liability decisions, escrow/refund/payment actions, provider/legal/Auth/RLS changes, or live actions');
}
if (
  !html.includes('milestoneEvidenceReviewPacketIds') ||
  !html.includes('milestoneEvidenceReviewPacketHistory') ||
  !html.includes('milestone_evidence_review_packet_history') ||
  !html.includes('milestoneEvidenceReviewPacketHistoryGrid') ||
  !html.includes('No milestone evidence review packet content stored') ||
  !html.includes('Milestone acceptance') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include milestone evidence review packet history request IDs as local metadata only without packet sections, markdown previews, redaction values, raw evidence, milestone approvals, escrow/payment/repayment actions, stablecoin settlement, token collateral, provider/legal/Auth/RLS changes, or live actions');
}
if (
  !html.includes('workingCapitalReviewPacketIds') ||
  !html.includes('workingCapitalReviewPacketHistory') ||
  !html.includes('working_capital_review_packet_history') ||
  !html.includes('workingCapitalReviewPacketHistoryGrid') ||
  !html.includes('No packet sections, markdown previews, redaction attestation values') ||
  !html.includes('Credit approval') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include working capital review packet history request IDs as local metadata only without packet sections, markdown previews, redaction values, contractor identity, credit approval, funding, loan origination, repayment routing, provider/legal/Auth/RLS changes, or live actions');
}
if (
  !html.includes('contractorReputationReviewPacketIds') ||
  !html.includes('contractorReputationReviewPacketHistory') ||
  !html.includes('contractor_reputation_review_packet_history') ||
  !html.includes('contractorReputationReviewPacketHistoryGrid') ||
  !html.includes('No contractor reputation packet sections') ||
  !html.includes('public score approvals') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include contractor reputation review packet history request IDs as local metadata only without packet sections, markdown previews, redaction values, raw media/evidence, public score approval, contractor ranking, credit decisions, adverse-action output, contractor assignment, provider/legal/Auth/RLS changes, or live actions');
}
if (
  !html.includes('contractorVerificationReviewPacketIds') ||
  !html.includes('contractorVerificationReviewPacketHistory') ||
  !html.includes('contractor_verification_review_packet_history') ||
  !html.includes('contractorVerificationReviewPacketHistoryGrid') ||
  !html.includes('No contractor verification packet sections') ||
  !html.includes('eligibility approvals') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include contractor verification review packet history request IDs as local metadata only without packet sections, markdown previews, redaction values, raw evidence, eligibility decisions, real lead routing, provider/legal/Auth/RLS changes, or live actions');
}
if (
  !html.includes('readinessOverviewReviewPacketIds') ||
  !html.includes('readinessOverviewReviewPacketHistory') ||
  !html.includes('readiness_overview_review_packet_history') ||
  !html.includes('readinessOverviewReviewPacketHistoryGrid') ||
  !html.includes('No readiness overview packet sections') ||
  !html.includes('credit approvals') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include readiness overview review packet history request IDs as local metadata only without packet sections, markdown previews, redaction values, raw evidence, provider/legal/money/Auth/RLS changes, or live actions');
}
if (
  !html.includes('providerEvidencePacketIds') ||
  !html.includes('providerEvidencePacketHistory') ||
  !html.includes('provider_evidence_packet_history') ||
  !html.includes('providerEvidencePacketHistoryGrid') ||
  !html.includes('No packet sections, markdown previews, redaction findings') ||
  !html.includes('No provider evidence packet content stored') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include provider evidence packet history request IDs as local metadata only without packet sections, markdown previews, redaction findings, raw evidence, provider/legal/money/Auth/RLS changes, or live actions');
}
if (
  !html.includes('providerPrintTemplateIds') ||
  !html.includes('providerEvidencePacketPrintTemplateHistory') ||
  !html.includes('provider_evidence_packet_print_template_history') ||
  !html.includes('providerEvidencePacketPrintTemplateHistoryGrid') ||
  !html.includes('No print template sections, markdown previews') ||
  !html.includes('No provider print template content stored') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include provider evidence packet print template history request IDs as local metadata only without print template sections, markdown previews, redaction attestations, raw packet content, provider/legal/money/Auth/RLS changes, or live actions');
}
if (
  !html.includes('providerRedactionQaIds') ||
  !html.includes('providerEvidencePacketRedactionQaHistory') ||
  !html.includes('provider_evidence_packet_redaction_qa_history') ||
  !html.includes('providerEvidencePacketRedactionQaHistoryGrid') ||
  !html.includes('No redaction finding details, matched terms') ||
  !html.includes('No provider redaction QA content stored') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include provider evidence packet redaction QA history request IDs as local metadata only without redaction finding details, matched terms, forbidden phrase source text, markdown previews, print template sections, raw packet content, provider/legal/money/Auth/RLS changes, or live actions');
}
if (
  !html.includes('providerReviewChainIds') ||
  !html.includes('providerEvidenceReviewChainHistory') ||
  !html.includes('provider_evidence_review_chain_history') ||
  !html.includes('providerEvidenceReviewChainHistoryGrid') ||
  !html.includes('No review chain step details') ||
  !html.includes('No provider review chain content stored') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include provider evidence review chain history request IDs as local metadata only without chain details, packet content, redaction details, provider/legal/money/Auth/RLS changes, external sends, or live actions');
}
if (
  !html.includes('betaReviewerNoteIds') ||
  !html.includes('betaFinanceContractReviewerNoteValidationHistory') ||
  !html.includes('beta_finance_contract_reviewer_note_validation_history') ||
  !html.includes('betaFinanceContractReviewerNoteValidationHistoryGrid') ||
  !html.includes('reviewer_note_validation_metadata_history_only') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include beta finance/contract reviewer note validation history request IDs as local metadata only');
}
if (
  !html.includes('traditionalFirstPublicCopyIds') ||
  !html.includes('traditionalFirstPublicCopyValidationHistory') ||
  !html.includes('traditional_first_public_copy_validation_history') ||
  !html.includes('traditionalFirstPublicCopyValidationHistoryGrid') ||
  !html.includes('public_copy_validation_metadata_history_only') ||
  !html.includes('No raw public copy drafts, issue excerpts, secrets, payment data, identity data, provider/legal decisions, public beta approvals, production approvals, external sends, or live-action approvals are stored in this history.') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include traditional-first public copy validation history request IDs as local metadata only');
}
if (
  !html.includes('homepagePublicationDecisionIds') ||
  !html.includes('homepagePublicationDecisionValidationHistory') ||
  !html.includes('homepage_publication_decision_validation_history') ||
  !html.includes('homepagePublicationDecisionValidationHistoryGrid') ||
  !html.includes('homepage_publication_decision_validation_metadata_history_only') ||
  !html.includes('No raw founder decision text, PUBLICATION_GO text, issue excerpts, secrets, payment data, identity data, provider/legal decisions, public replacement approvals, deploy approvals, URL-share approvals, tester-invite approvals, production approvals, external sends, or live-action approvals are stored in this history.') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include homepage publication decision validation history request IDs as local metadata only');
}
if (
  !html.includes('betaLiveConfusionIds') ||
  !html.includes('betaFinanceContractLiveConfusionValidationHistory') ||
  !html.includes('beta_finance_contract_live_confusion_validation_history') ||
  !html.includes('betaFinanceContractLiveConfusionValidationHistoryGrid') ||
  !html.includes('live_confusion_validation_metadata_history_only') ||
  !html.includes('No raw live-confusion notes, issue excerpts, secrets, payment data, identity data, signed contract text, XPR signatures, provider/legal decisions, public beta approvals, external follow-up approvals, production approvals, external sends, or live-action approvals are stored in this history.') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include beta finance/contract live-confusion validation history request IDs as local metadata only');
}
if (
  !html.includes('betaSessionSafetyIds') ||
  !html.includes('betaFinanceContractSessionSafetyValidationHistory') ||
  !html.includes('beta_finance_contract_session_safety_validation_history') ||
  !html.includes('betaFinanceContractSessionSafetyValidationHistoryGrid') ||
  !html.includes('session_safety_validation_metadata_history_only') ||
  !html.includes('No raw session-safety notes, issue excerpts, secrets, payment data, identity data, signed contract text, XPR signatures, stablecoin settlement approvals, token collateral approvals, provider/legal decisions, public beta approvals, external follow-up approvals, production approvals, external sends, or live-action approvals are stored in this history.') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include beta finance/contract session-safety validation history request IDs as local metadata only');
}
if (
  !html.includes('betaSafeHandoffReportIds') ||
  !html.includes('betaFinanceContractSafeHandoffReportHistory') ||
  !html.includes('beta_finance_contract_safe_handoff_report_history') ||
  !html.includes("sourceSurface.value = 'beta_finance_contract_safe_handoff_report_history'") ||
  !html.includes("idsTextarea.scrollIntoView({ behavior: 'smooth', block: 'center' })") ||
  !html.includes('betaFinanceContractSafeHandoffReportHistoryGrid') ||
  !html.includes('safe_handoff_report_metadata_history_only') ||
  !html.includes('No copyable markdown, raw notes, issue excerpts, secrets, payment data, identity data, signed contract text, XPR signatures, stablecoin approvals, token collateral approvals, provider/legal decisions, public beta approvals, production approvals, external sends, server storage, or live-action approvals are stored in this history.') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include beta finance/contract safe handoff report history request IDs as local metadata only');
}
if (
  !html.includes('repaymentReadinessSnapshotIds') ||
  !html.includes('repaymentReadinessSnapshotHistory') ||
  !html.includes('repayment_readiness_snapshot_history') ||
  !html.includes('repaymentReadinessSnapshotHistoryGrid') ||
  !html.includes('repayment_readiness_snapshot_metadata_history_only') ||
  !html.includes('No raw payment references, payment tx hashes, loan IDs') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include repayment readiness snapshot history request IDs as local metadata only without raw payment references, tx hashes, loan IDs, approvals, or live actions');
}
if (
  !html.includes('repaymentAllocationPreviewIds') ||
  !html.includes('repaymentAllocationPreviewHistory') ||
  !html.includes('repayment_allocation_preview_history') ||
  !html.includes('repaymentAllocationPreviewHistoryGrid') ||
  !html.includes('repayment_allocation_preview_metadata_history_only') ||
  !html.includes('No raw payment references, payment tx hashes, loan IDs') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include repayment allocation preview history request IDs as local metadata only without raw payment references, tx hashes, loan IDs, approvals, or live actions');
}
if (
  !html.includes('milestoneAcceptanceSnapshotIds') ||
  !html.includes('milestoneAcceptanceSnapshotHistory') ||
  !html.includes('milestone_acceptance_snapshot_history') ||
  !html.includes('milestoneAcceptanceSnapshotHistoryGrid') ||
  !html.includes('No milestone approval history stored') ||
  !html.includes('No escrow release history stored') ||
  !html.includes('No payment movement history stored') ||
  !html.includes('Use latest local evidence request IDs')
) {
  fail('Request trace report prefill must include milestone acceptance snapshot history request IDs as local metadata only without milestone approval, escrow release, payment movement, or live-action history');
}
if (
  !html.includes('clearRequestTraceReportPrefillStatus') ||
  !html.includes('Clear prefill status') ||
  !html.includes('request_trace_prefill_status_cleared') ||
  !html.includes('Request IDs: unchanged') ||
  !html.includes('Local notes: unchanged') ||
  !html.includes('Report history: unchanged') ||
  !html.includes('Local prefill status cleared only. Request IDs, local notes, report history, server storage, external send, live lookup, and live actions are unchanged.')
) {
  fail('Request trace report prefill status must include a local-only clear control that leaves request IDs, notes, report history, server storage, external send, live lookup, and live actions unchanged');
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
  !html.includes('DISPUTE_EVIDENCE_REVIEW_PACKET_HISTORY_KEY') ||
  !html.includes('disputeEvidenceReviewPacketHistory') ||
  !html.includes('disputeEvidenceReviewPacketHistorySummary') ||
  !html.includes('disputeEvidenceReviewPacketHistoryGrid') ||
  !html.includes('clearDisputeEvidenceReviewPacketHistoryBtn') ||
  !html.includes('loadDisputeEvidenceReviewPacketHistoryFromLocalStorage') ||
  !html.includes('saveDisputeEvidenceReviewPacketHistory') ||
  !html.includes('renderDisputeEvidenceReviewPacketHistory') ||
  !html.includes('clearDisputeEvidenceReviewPacketHistory') ||
  !html.includes('dispute_evidence_review_packet_history') ||
  !html.includes('dispute_evidence_review_packet_metadata_history_only') ||
  !html.includes("saveAdminLocalEvidenceTimelineEntry('dispute_evidence_review_packet'") ||
  !html.includes('No dispute evidence packet sections, markdown previews, redaction attestation values, raw evidence, peer review details, secrets, payment data, wallet data, provider submissions, legal decisions, liability decisions, escrow releases, refund issues, payment movements, payment routing approvals, Auth/RLS changes, or production approvals are stored in this dispute evidence review packet history.')
) {
  fail('SmartContractor UI must keep a metadata-only local history for dispute evidence review packet loads without storing raw packet content or attempting live dispute/payment actions');
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
  !server.includes('working_capital_repayment_waterfall_board') ||
  !server.includes('Contractor identity gate') ||
  !server.includes('Signed project contract gate') ||
  !server.includes('Milestone evidence gate') ||
  !server.includes('Repayment waterfall gate') ||
  !server.includes('Funding gate') ||
  !server.includes('BLOCKED_FOR_LIVE') ||
  !server.includes('route_repayment') ||
  !server.includes('No live repayment waterfall action') ||
  !server.includes('identity_packet_review') ||
  !server.includes('repayment_waterfall_packet_review') ||
  !server.includes('funding_gate_review') ||
  !server.includes('action_live_status')
) {
  fail('server.js must expose working capital readiness checks, review action queue, repayment waterfall board, and live funding/loan approval gates');
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
  !html.includes('data.working_capital_repayment_waterfall_board') ||
  !html.includes('funding_approval_block') ||
  !html.includes('Working Capital Repayment Waterfall Board') ||
  !html.includes('Working Capital Review Action Queue') ||
  !html.includes('data.working_capital_review_action_queue') ||
  !html.includes('action.next_safe_action') ||
  !html.includes('(action.required_evidence || []).join') ||
  !html.includes('(action.blocked_live_actions || []).join') ||
  !html.includes('Action live status')
) {
  fail('SmartContractor UI must render working capital readiness checks, repayment waterfall board, review action queue, and blocked funding/loan gates from backend data');
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
  !server.includes('contractor_reputation_public_score_board') ||
  !server.includes('Signal ownership gate') ||
  !server.includes('Privacy and moderation gate') ||
  !server.includes('Credit use boundary gate') ||
  !server.includes('Lead routing gate') ||
  !server.includes('Public score release gate') ||
  !server.includes('No live public reputation score action') ||
  !server.includes('publish_reputation_score') ||
  !server.includes('rank_contractors_publicly') ||
  !server.includes('reputation_signal_packet_review') ||
  !server.includes('moderation_appeal_packet_review') ||
  !server.includes('credit_boundary_packet_review') ||
  !server.includes('public_score_gate_review')
) {
  fail('server.js must expose contractor reputation readiness checks, public score board, review action queue, and blocked public score/credit/legal decision gates');
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
  !html.includes('data.contractor_reputation_public_score_board') ||
  !html.includes('reputation_decision_block') ||
  !html.includes('Contractor Reputation Public Score Board') ||
  !html.includes('Contractor Reputation Review Action Queue') ||
  !html.includes('data.reputation_review_action_queue') ||
  !html.includes('action.next_safe_action') ||
  !html.includes('(action.required_evidence || []).join') ||
  !html.includes('(action.blocked_live_actions || []).join') ||
  !html.includes('Action live status')
) {
  fail('SmartContractor UI must render contractor reputation readiness checks, public score board, review action queue, and blocked public score/credit/legal gates from backend data');
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
  !server.includes('contractor_verification_eligibility_board') ||
  !server.includes('License evidence gate') ||
  !server.includes('Insurance evidence gate') ||
  !server.includes('Business identity gate') ||
  !server.includes('Provider lookup gate') ||
  !server.includes('Eligibility/Auth/RLS gate') ||
  !server.includes('No live contractor verification action') ||
  !server.includes('verify_contractor_live') ||
  !server.includes('run_kyb_kyc_lookup') ||
  !server.includes('change_auth_role') ||
  !server.includes('license_packet_review') ||
  !server.includes('insurance_packet_review') ||
  !server.includes('business_identity_packet_review') ||
  !server.includes('provider_boundary_packet_review') ||
  !server.includes('eligibility_gate_review')
) {
  fail('server.js must expose contractor verification readiness checks, eligibility board, review action queue, and blocked provider/legal eligibility gates');
}
if (
  !html.includes('/api/admin/contractor-verification-readiness') ||
  !html.includes('contractorVerificationReadiness') ||
  !html.includes('Contractor Verification Readiness') ||
  !html.includes('data.verification_checklist') ||
  !html.includes('data.contractor_verification_eligibility_board') ||
  !html.includes('verification_decision_block') ||
  !html.includes('Contractor Verification Eligibility Board') ||
  !html.includes('Contractor Verification Review Action Queue') ||
  !html.includes('data.verification_review_action_queue') ||
  !html.includes('action.next_safe_action') ||
  !html.includes('(action.required_evidence || []).join') ||
  !html.includes('(action.blocked_live_actions || []).join') ||
  !html.includes('Action live status')
) {
  fail('SmartContractor UI must render contractor verification readiness checks, eligibility board, review action queue, and blocked provider/legal eligibility gates from backend data');
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
  !html.includes('no_provider_evidence_packet_content_stored') ||
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
  !html.includes('no_provider_print_template_content_stored') ||
  !html.includes('No provider print template content stored') ||
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
  !html.includes('no_provider_redaction_qa_content_stored') ||
  !html.includes('No provider redaction QA content stored') ||
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
if (
  !html.includes('PROVIDER_EVIDENCE_REVIEW_CHAIN_HISTORY_KEY') ||
  !html.includes('providerEvidenceReviewChainHistory') ||
  !html.includes('providerEvidenceReviewChainHistorySummary') ||
  !html.includes('providerEvidenceReviewChainHistoryGrid') ||
  !html.includes('clearProviderEvidenceReviewChainHistoryBtn') ||
  !html.includes('loadProviderEvidenceReviewChainHistoryFromLocalStorage') ||
  !html.includes('saveProviderEvidenceReviewChainHistory') ||
  !html.includes('renderProviderEvidenceReviewChainHistory') ||
  !html.includes('clearProviderEvidenceReviewChainHistory') ||
  !html.includes('provider_evidence_review_chain_history') ||
  !html.includes('provider_review_chain_metadata_history_only') ||
  !html.includes('no_provider_review_chain_content_stored') ||
  !html.includes('saveAdminLocalEvidenceTimelineEntry(\'provider_evidence_review_chain\'') ||
  !html.includes('No review chain step details, packet sections, print template sections, redaction finding details, matched terms, markdown previews, redaction attestations, raw evidence, secrets, payment data, wallet data, provider submissions, legal decisions, credit approvals, escrow releases, Auth/RLS changes, production approvals, external sends, or live-action approvals are stored in this provider review chain history.')
) {
  fail('Provider evidence review chain UI must keep local metadata-only history without storing chain details, packet content, redaction details, or enabling live provider actions');
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
  !authSmoke.includes('route_set_summary') ||
  !authSmoke.includes('route_set_count') ||
  !authSmoke.includes('available_endpoint_types') ||
  !authSmoke.includes('assertGateMatrixRecommendedRouteSet') ||
  !authSmoke.includes('local_review_route_set') ||
  !authSmoke.includes('workbench_endpoint') ||
  !authSmoke.includes('dry_run_endpoint') ||
  !authSmoke.includes('dry_run_packet_endpoint') ||
  !authSmoke.includes('handoff_summary_endpoint') ||
  !authSmoke.includes('smart_contract_review_workbench_gate_matrix_route_set_checked') ||
  !authSmoke.includes('smart_contract_review_workbench_gate_matrix_filter_recovery_actions') ||
  !authSmoke.includes('no_gate_matrix_content_stored') ||
  !authSmoke.includes('no_live_replay_action_attempted')
) {
  fail('auth smoke harness must verify smart contract review workbench gate matrix route-set summary, route-set, success, and invalid-filter demo-only boundaries');
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
  !authSmoke.includes('working_capital_repayment_waterfall_board') ||
  !authSmoke.includes('Contractor identity gate') ||
  !authSmoke.includes('Signed project contract gate') ||
  !authSmoke.includes('Milestone evidence gate') ||
  !authSmoke.includes('Repayment waterfall gate') ||
  !authSmoke.includes('Funding gate') ||
  !authSmoke.includes('BLOCKED_FOR_LIVE') ||
  !authSmoke.includes('route_repayment') ||
  !authSmoke.includes('identity_packet_review') ||
  !authSmoke.includes('repayment_waterfall_packet_review') ||
  !authSmoke.includes('funding_gate_review') ||
  !authSmoke.includes('action_live_status')
) {
  fail('auth smoke harness must verify working capital readiness request-id, repayment waterfall board, review action queue, and live funding/loan boundaries');
}
if (
  !authSmoke.includes('contractor_reputation_readiness') ||
  !authSmoke.includes('/api/admin/contractor-reputation-readiness') ||
  !authSmoke.includes('gcsc-contractor-reputation-readiness-smoke') ||
  !authSmoke.includes('reputation_decision_block') ||
  !authSmoke.includes('reputation_review_action_queue') ||
  !authSmoke.includes('contractor_reputation_public_score_board') ||
  !authSmoke.includes('Signal ownership gate') ||
  !authSmoke.includes('Privacy and moderation gate') ||
  !authSmoke.includes('Credit use boundary gate') ||
  !authSmoke.includes('Lead routing gate') ||
  !authSmoke.includes('Public score release gate') ||
  !authSmoke.includes('publish_reputation_score') ||
  !authSmoke.includes('rank_contractors_publicly') ||
  !authSmoke.includes('reputation_signal_packet_review') ||
  !authSmoke.includes('moderation_appeal_packet_review') ||
  !authSmoke.includes('credit_boundary_packet_review') ||
  !authSmoke.includes('public_score_gate_review') ||
  !authSmoke.includes('action_queue_summary') ||
  !authSmoke.includes('public_reputation_score')
) {
  fail('auth smoke harness must verify contractor reputation readiness request-id, public score board, review action queue, and public score/decision boundaries');
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
  !authSmoke.includes('contractor_verification_eligibility_board') ||
  !authSmoke.includes('License evidence gate') ||
  !authSmoke.includes('Insurance evidence gate') ||
  !authSmoke.includes('Business identity gate') ||
  !authSmoke.includes('Provider lookup gate') ||
  !authSmoke.includes('Eligibility/Auth/RLS gate') ||
  !authSmoke.includes('verify_contractor_live') ||
  !authSmoke.includes('run_kyb_kyc_lookup') ||
  !authSmoke.includes('change_auth_role') ||
  !authSmoke.includes('license_packet_review') ||
  !authSmoke.includes('insurance_packet_review') ||
  !authSmoke.includes('business_identity_packet_review') ||
  !authSmoke.includes('provider_boundary_packet_review') ||
  !authSmoke.includes('eligibility_gate_review') ||
  !authSmoke.includes('action_queue_summary') ||
  !authSmoke.includes('live_license_verification')
) {
  fail('auth smoke harness must verify contractor verification readiness request-id, eligibility board, review action queue, and live provider/legal boundaries');
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
