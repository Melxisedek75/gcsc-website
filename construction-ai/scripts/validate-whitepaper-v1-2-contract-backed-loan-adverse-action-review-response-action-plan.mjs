import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const actionPlanPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-action-plan.md');
const routingPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-routing.md');
const intakeLogPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-intake-log.md');
const approvalEvidencePath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template.md');
const noticeBoundaryPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary.md');
const reviewPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review.md');
const taxonomyPath = resolve('..', 'docs', 'whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

function fail(message, details = {}) {
  console.error(JSON.stringify({ status: 'failed', message, ...details }, null, 2));
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail('Missing required file', { path });
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, label) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) {
    fail(`${label} missing required snippet`, { snippet });
  }
}

const actionPlan = readRequired(actionPlanPath);
const routing = readRequired(routingPath);
const intakeLog = readRequired(intakeLogPath);
const approvalEvidence = readRequired(approvalEvidencePath);
const noticeBoundary = readRequired(noticeBoundaryPath);
const review = readRequired(reviewPath);
const taxonomy = readRequired(taxonomyPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciValidator = readRequired(ciValidatorPath);

for (const section of [
  'GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Review Response Action Plan',
  'Status: LOCAL_ONLY_ADVERSE_ACTION_RESPONSE_ACTION_PLAN',
  'Purpose',
  'Inputs',
  'Action Plan Fields',
  'Allowed Action Types',
  'Manual Checkpoints',
  'Live Action Blocks',
  'Owner Handoff Rules',
  'Required Linked Files',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(actionPlan, section, actionPlanPath);
}

for (const snippet of [
  'not legal advice',
  'not provider approval',
  'not lender approval',
  'not approval to send notices',
  'not approval to deny real credit',
  'not approval for credit-bureau reporting',
  'not public wording approval',
  'LOCAL_ONLY_ADVERSE_ACTION_RESPONSE_ACTION_PLAN',
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-routing.md',
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-intake-log.md',
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template.md',
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary.md',
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review.md',
  'docs/whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy.md',
  'action_plan_id',
  'source_response_id',
  'routing_state',
  'action_type',
  'action_owner',
  'source_files',
  'source_file_versions',
  'required_local_change',
  'required_follow_up_evidence',
  'approval_evidence_id',
  'manual_checkpoints',
  'blocked_live_actions',
  'status',
  'due_before',
  'closeout_evidence',
  'RECORD_HOLD',
  'REQUEST_CLARIFICATION_DRAFT',
  'UPDATE_INTERNAL_DOC',
  'UPDATE_APPROVAL_EVIDENCE',
  'PREPARE_NEXT_INTERNAL_PACKET',
  'BLOCK_FOR_FOUNDER_OWNER_REVIEW',
  'founder_reviews_routing_state',
  'legal_provider_scope_confirmed',
  'finance_provider_scope_confirmed',
  'compliance_scope_confirmed',
  'technical_scope_confirmed',
  'redaction_confirmed',
  'approval_evidence_linked',
  'no_live_authority_confirmed',
  'HOLD_ACTION_PLAN',
  'READY_FOR_LOCAL_DOC_REVISION',
  'READY_FOR_INTERNAL_PACKET_PREP',
  'BLOCKED_FOR_FOUNDER_OWNER_REVIEW',
  'CLOSED_LOCAL_ONLY',
  'most restrictive response controls',
  'send notices',
  'deny real credit',
  'approve real credit',
  'report to credit bureaus',
  'create legal determinations',
  'route repayments',
  'activate escrow',
  'settle stablecoins',
  'lock token collateral',
  'create provider obligations',
  'change public files',
  'deploy or change live Supabase',
  'enable payments, loans, XPR signatures, or public launch',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-action-plan',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-routing',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-intake-log',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review',
  'npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy',
  'npm run check:real-status-audit',
  'npm run check',
]) {
  assertIncludes(actionPlan, snippet, actionPlanPath);
}

for (const [content, snippet, label] of [
  [routing, 'GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Review Response Routing', routingPath],
  [intakeLog, 'GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Review Response Intake Log', intakeLogPath],
  [approvalEvidence, 'GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Approval Evidence Template', approvalEvidencePath],
  [noticeBoundary, 'GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Notice Template Boundary', noticeBoundaryPath],
  [review, 'GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Legal/Provider Review', reviewPath],
  [taxonomy, 'GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Reason-Code Taxonomy', taxonomyPath],
]) {
  assertIncludes(content, snippet, label);
}

const checkName = 'check:whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-action-plan';
if (packageJson.scripts?.[checkName] !== 'node scripts/validate-whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-action-plan.mjs') {
  fail(`${packagePath} must define ${checkName}`);
}

assertIncludes(runner, `"${checkName}"`, runnerPath);
assertIncludes(ciValidator, checkName, ciValidatorPath);
assertIncludes(context, 'Whitepaper v1.2 contract-backed loan adverse-action review response action plan', contextPath);
assertIncludes(context, checkName, contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 contract-backed loan adverse-action review response action plan', backlogPath);
assertIncludes(backlog, checkName, backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 contract-backed loan adverse-action review response action plan', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(actionPlan)) {
  fail('Adverse-action review response action plan must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  adverse_action_review_response_action_plan: actionPlanPath,
  action_types_checked: 6,
  manual_checkpoints_checked: 8,
  safety_boundaries_checked: true,
}, null, 2));
