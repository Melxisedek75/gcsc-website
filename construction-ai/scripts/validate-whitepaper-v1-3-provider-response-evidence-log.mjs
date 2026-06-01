import fs from 'fs';
import path from 'path';

const root = path.resolve(process.cwd(), '..');

const files = {
  evidenceLog: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-evidence-log.md'),
  intake: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-intake-template.md'),
  routing: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-routing-checklist.md'),
  summaryShell: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-summary-shell.md'),
  actionQueue: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-action-queue.md'),
  decisionRegister: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-register.md'),
  providerStatus: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-status-matrix.md'),
  publicationStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  founderReadyRollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  masterIndex: path.join(root, 'docs', 'whitepaper-v1-3-internal-review-master-index.md'),
  changeRequestQueue: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-change-request-queue.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  publicWhitepaper: path.join(root, 'whitepaper.html'),
  publicHomepage: path.join(root, 'index.html'),
};

const errors = [];

function readRequired(label, filePath) {
  if (!fs.existsSync(filePath)) {
    errors.push(`${label} missing: ${path.relative(root, filePath)}`);
    return '';
  }

  return fs.readFileSync(filePath, 'utf8');
}

function requirePhrase(content, phrase, label) {
  if (!content.includes(phrase)) {
    errors.push(`${label} missing required phrase: ${phrase}`);
  }
}

function rejectPattern(content, pattern, label) {
  if (pattern.test(content)) {
    errors.push(`${label} contains forbidden pattern: ${pattern}`);
  }
}

const evidenceLog = readRequired('provider response evidence log', files.evidenceLog);
const intake = readRequired('provider response intake template', files.intake);
const routing = readRequired('provider response routing checklist', files.routing);
const summaryShell = readRequired('provider response summary shell', files.summaryShell);
const actionQueue = readRequired('provider response action queue', files.actionQueue);
const decisionRegister = readRequired('provider response decision register', files.decisionRegister);
const providerStatus = readRequired('provider question status matrix', files.providerStatus);
const publicationStatus = readRequired('publication evidence current status', files.publicationStatus);
const founderReadyRollup = readRequired('founder-ready packet status rollup', files.founderReadyRollup);
const masterIndex = readRequired('internal review master index', files.masterIndex);
const changeRequestQueue = readRequired('reviewer response change request queue', files.changeRequestQueue);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

[
  'Provider Response Evidence Log',
  'Status: internal provider response evidence log',
  'No provider response evidence is recorded yet',
  'Evidence Intake Preconditions',
  'Evidence Rows Template',
  'Allowed Evidence States',
  'Required Cross-Checks Before Any Local Revision',
  'Safe Follow-Up Targets',
  'No-Shortcut Rules',
  'PENDING_RESPONSE',
  'PENDING_REDACTION_REVIEW',
  'PASS_LOCAL_ONLY',
  'BLOCKED_FOR_LIVE',
  'NEEDS_LOCAL_REVISION',
  'NEEDS_FOUNDER_ROUTING',
  'NEEDS_PROVIDER_REVIEW',
  'NO_GO_RECORDED',
  'founder-provided written response',
  'not publication approval',
  'not live action approval',
  'not legal/provider clearance',
  'not partnership commitment',
  'not outreach approval',
  'not production release approval',
  'Stop Boundary',
].forEach((phrase) => {
  requirePhrase(evidenceLog, phrase, 'provider response evidence log');
});

[
  'escrow provider',
  'lender',
  'KYC-KYB-AML provider',
  'payment processor',
  'insurance-bonding provider',
  'valuation-appraisal provider',
  'Web3 audit reviewer',
  'FIO UX reviewer',
  'XPR-WebAuth-Metallicus technical reviewer',
  'attorney reviewer',
].forEach((providerCategory) => {
  requirePhrase(evidenceLog, providerCategory, 'provider response evidence log');
});

[
  'docs/whitepaper-v1-3-provider-response-intake-template.md',
  'docs/whitepaper-v1-3-provider-response-routing-checklist.md',
  'docs/whitepaper-v1-3-provider-response-summary-shell.md',
  'docs/whitepaper-v1-3-provider-response-action-queue.md',
  'docs/whitepaper-v1-3-provider-response-decision-register.md',
  'docs/whitepaper-v1-3-provider-question-status-matrix.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md',
  'docs/whitepaper-v1-3-internal-review-master-index.md',
  'docs/whitepaper-v1-3-reviewer-response-change-request-queue.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
].forEach((fileReference) => {
  requirePhrase(evidenceLog, fileReference, 'provider response evidence log');
});

requirePhrase(intake, 'Provider Response Intake Template', 'provider response intake template');
requirePhrase(intake, 'No provider response is recorded yet', 'provider response intake template');
requirePhrase(intake, 'docs/whitepaper-v1-3-provider-response-evidence-log.md', 'provider response intake template');
requirePhrase(routing, 'Provider Response Routing Checklist', 'provider response routing checklist');
requirePhrase(routing, 'No-Shortcut Rules', 'provider response routing checklist');
requirePhrase(routing, 'docs/whitepaper-v1-3-provider-response-evidence-log.md', 'provider response routing checklist');
requirePhrase(summaryShell, 'Provider Response Summary Shell', 'provider response summary shell');
requirePhrase(summaryShell, 'No provider response summary is recorded yet', 'provider response summary shell');
requirePhrase(summaryShell, 'docs/whitepaper-v1-3-provider-response-evidence-log.md', 'provider response summary shell');
requirePhrase(actionQueue, 'Provider Response Action Queue', 'provider response action queue');
requirePhrase(actionQueue, 'QUEUE_NOT_ACTIVE', 'provider response action queue');
requirePhrase(actionQueue, 'docs/whitepaper-v1-3-provider-response-evidence-log.md', 'provider response action queue');
requirePhrase(decisionRegister, 'Provider Response Decision Register', 'provider response decision register');
requirePhrase(decisionRegister, 'NO_DECISION_RECORDED', 'provider response decision register');
requirePhrase(decisionRegister, 'docs/whitepaper-v1-3-provider-response-evidence-log.md', 'provider response decision register');
requirePhrase(providerStatus, 'No provider response is recorded yet', 'provider question status matrix');
requirePhrase(publicationStatus, 'legal/provider review | PENDING', 'publication evidence current status');
requirePhrase(publicationStatus, 'provider response evidence log | PENDING_PROVIDER_RESPONSE', 'publication evidence current status');
requirePhrase(founderReadyRollup, 'Current publication decision remains NO-GO', 'founder-ready packet status rollup');
requirePhrase(founderReadyRollup, 'provider response evidence log | PENDING_PROVIDER_RESPONSE', 'founder-ready packet status rollup');
requirePhrase(masterIndex, 'Recommended Reading Order', 'internal review master index');
requirePhrase(masterIndex, 'provider response evidence log | local evidence log only / no provider response evidence recorded', 'internal review master index');
requirePhrase(changeRequestQueue, 'Reviewer Response Change Request Queue', 'reviewer response change request queue');
requirePhrase(changeRequestQueue, 'QUEUE_NOT_ACTIVE', 'reviewer response change request queue');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');

[
  /provider response evidence recorded/i,
  /publication approved/i,
  /public replacement approved/i,
  /live action approved/i,
  /legal\/provider clearance recorded/i,
  /provider commitment recorded/i,
  /partnership approved/i,
  /production release approved/i,
  /outreach approved/i,
].forEach((pattern) => {
  rejectPattern(evidenceLog, pattern, 'provider response evidence log');
});

[
  [publicWhitepaper, 'public whitepaper'],
  [publicHomepage, 'public homepage'],
].forEach(([content, label]) => {
  if (content.includes('Provider Response Evidence Log') || content.includes('V13-PROVIDER-EVIDENCE-YYYYMMDD-001')) {
    errors.push(`${label} appears to contain internal provider response evidence log content`);
  }
});

if (errors.length > 0) {
  console.error('whitepaper v1.3 provider response evidence log validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('whitepaper v1.3 provider response evidence log validation passed');
