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
if (!html.includes('error.http_status = response.status') || !html.includes("http_status: error.http_status || 'unknown'")) {
  fail('AI recommendation error UI must expose HTTP status for founder/tester traceability');
}
if (!html.includes("http_status_known_flag: typeof error.http_status === 'number'")) {
  fail('AI recommendation error UI must expose HTTP-status known-state flag for founder/tester traceability');
}
if (!html.includes('error.request_path = path') || !html.includes("request_path: error.request_path || 'unknown'")) {
  fail('AI recommendation error UI must expose request path for founder/tester traceability');
}
if (!html.includes("request_path_known_flag: typeof error.request_path === 'string'")) {
  fail('AI recommendation error UI must expose request-path known-state flag for founder/tester traceability');
}
if (!html.includes("error.request_method = options.method || 'GET'") || !html.includes("request_method: error.request_method || 'unknown'")) {
  fail('AI recommendation error UI must expose request method for founder/tester traceability');
}
if (!html.includes("request_method_known_flag: typeof error.request_method === 'string'")) {
  fail('AI recommendation error UI must expose request-method known-state flag for founder/tester traceability');
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
if (!html.includes('loadBetaReadiness') || !html.includes('betaReadinessGrid') || !html.includes('/api/admin/beta-readiness')) {
  fail('smartcontractor.html must include the Controlled Beta Readiness UI');
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
if (!html.includes('loadFounderActionCenter') || !html.includes('founderActionGrid')) {
  fail('smartcontractor.html must include the Founder Action Center UI');
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

const server = readFileSync('server.js', 'utf8');
const authSmoke = readFileSync('scripts/smoke-auth-ownership.mjs', 'utf8');
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

console.log('SmartContractor validation passed.');
