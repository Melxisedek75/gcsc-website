import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const routingPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-founder-response-routing-checklist.md');
const responseIntakePath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-founder-response-intake-template.md');
const handoffPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet.md');
const evidenceLogPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log.md');
const executionQueuePath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue.md');
const deltaLedgerPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger.md');
const localChangePacketPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-final-assembly-local-change-packet.md');
const draftPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft.md');
const reviewReportPath = resolve('..', 'docs', 'whitepaper-v1-2-public-draft-review-report.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');
const ciWorkflowValidatorPath = resolve('scripts', 'validate-ci-workflow.mjs');

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

const routing = readRequired(routingPath);
const responseIntake = readRequired(responseIntakePath);
const handoff = readRequired(handoffPath);
const evidenceLog = readRequired(evidenceLogPath);
const executionQueue = readRequired(executionQueuePath);
const deltaLedger = readRequired(deltaLedgerPath);
const localChangePacket = readRequired(localChangePacketPath);
const draft = readRequired(draftPath);
const reviewReport = readRequired(reviewReportPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = JSON.parse(readRequired(packagePath));
const runner = readRequired(runnerPath);
const ciWorkflowValidator = readRequired(ciWorkflowValidatorPath);

for (const heading of [
  'Whitepaper v1.2 Public Draft Final Assembly Founder Response Routing Checklist',
  'Status: LOCAL_ONLY_FOUNDER_RESPONSE_ROUTING_CHECKLIST',
  'Purpose',
  'Linked Inputs',
  'Routing Fields',
  'Routing States',
  'Routing Rules',
  'Claim And Redaction Gates',
  'Blocked Next Actions',
  'Required Checks',
  'Acceptance Check',
]) {
  assertIncludes(routing, heading, routingPath);
}

for (const snippet of [
  'does not approve public publication',
  'does not approve website edits',
  'does not approve external sharing',
  'does not approve deployment',
  'does not approve live Supabase',
  'does not approve payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'LOCAL_ONLY_FOUNDER_RESPONSE_ROUTING_CHECKLIST',
  'docs/whitepaper-v1-2-public-draft-final-assembly-founder-response-intake-template.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger.md',
  'docs/whitepaper-v1-2-public-draft-final-assembly-local-change-packet.md',
  'docs/whitepaper-v1-2-public-draft.md',
  'docs/whitepaper-v1-2-public-draft-review-report.md',
  'routing_record_id',
  'response_intake_id',
  'handoff_packet_id',
  'source_commit',
  'founder_response_state',
  'route_owner',
  'route_reason',
  'accepted_sections_route',
  'revision_sections_route',
  'hold_sections_route',
  'claim_risk_route',
  'redaction_route',
  'blocked_action_acknowledgement',
  'latest_check_run',
  'next_local_action',
  'ROUTE_TO_LOCAL_WORDING_UPDATE',
  'ROUTE_TO_LOCAL_REVISION',
  'ROUTE_TO_CLAIM_RISK_REVIEW',
  'ROUTE_TO_REDACTION_REVIEW',
  'ROUTE_TO_LEGAL_PROVIDER_REVIEW',
  'ROUTE_TO_PUBLICATION_BLOCKED',
  'ROUTE_TO_INTERNAL_CLOSEOUT_ONLY',
  'founder can approve only internal wording direction',
  'most restrictive source state wins',
  'founder response routing cannot become publication approval',
  'route does not execute changes automatically',
  'no new public claims',
  'redaction confirmed before sharing',
  'publish',
  'edit whitepaper.html',
  'send investor, grant, partner, provider, legal, or finance material',
  'change live Supabase',
  'deploy',
  'enable payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-response-routing-checklist',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-response-intake-template',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger',
  'npm run check:whitepaper-v1-2-public-draft-final-assembly-local-change-packet',
  'npm run check:whitepaper-v1-2-public-draft',
  'npm run check:real-status-audit',
  'npm run check',
]) {
  assertIncludes(routing, snippet, routingPath);
}

for (const [content, snippet, label] of [
  [responseIntake, 'Whitepaper v1.2 Public Draft Final Assembly Founder Response Intake Template', responseIntakePath],
  [handoff, 'Whitepaper v1.2 Public Draft Final Assembly Founder Handoff Packet', handoffPath],
  [evidenceLog, 'Whitepaper v1.2 Public Draft Final Assembly Local Edit Evidence Log', evidenceLogPath],
  [executionQueue, 'Whitepaper v1.2 Public Draft Final Assembly Local Edit Execution Queue', executionQueuePath],
  [deltaLedger, 'Whitepaper v1.2 Public Draft Final Assembly Review Report Delta Ledger', deltaLedgerPath],
  [localChangePacket, 'Whitepaper v1.2 Public Draft Final Assembly Local Change Packet', localChangePacketPath],
  [draft, 'Whitepaper v1.2 Public Draft', draftPath],
  [reviewReport, 'Whitepaper v1.2 Public Draft Review Report', reviewReportPath],
]) {
  assertIncludes(content, snippet, label);
}

if (packageJson.scripts?.['check:whitepaper-v1-2-public-draft-final-assembly-founder-response-routing-checklist'] !== 'node scripts/validate-whitepaper-v1-2-public-draft-final-assembly-founder-response-routing-checklist.mjs') {
  fail(`${packagePath} must define check:whitepaper-v1-2-public-draft-final-assembly-founder-response-routing-checklist`);
}

assertIncludes(runner, '"check:whitepaper-v1-2-public-draft-final-assembly-founder-response-routing-checklist"', runnerPath);
assertIncludes(ciWorkflowValidator, "'check:whitepaper-v1-2-public-draft-final-assembly-founder-response-routing-checklist'", ciWorkflowValidatorPath);
assertIncludes(context, 'Whitepaper v1.2 public draft final assembly founder response routing checklist', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-public-draft-final-assembly-founder-response-routing-checklist', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 public draft final assembly founder response routing checklist', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-public-draft-final-assembly-founder-response-routing-checklist', backlogPath);
assertIncludes(audit, 'Whitepaper v1.2 public draft final assembly founder response routing checklist', auditPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(routing)) {
  fail('Founder response routing checklist must not contain secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  founder_response_routing_checklist: routingPath,
  routing_states_checked: 7,
  safety_boundaries_checked: true,
}, null, 2));
