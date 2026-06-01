import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  decisionRegister: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-register.md'),
  intake: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-intake-template.md'),
  routing: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-routing-checklist.md'),
  evidenceLog: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-evidence-log.md'),
  summaryShell: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-summary-shell.md'),
  actionQueue: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-action-queue.md'),
  publicationStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  founderReadyRollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  masterIndex: path.join(root, 'docs', 'whitepaper-v1-3-internal-review-master-index.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  changeRequestQueue: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-change-request-queue.md'),
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
    errors.push(`${label} contains forbidden approval phrase: ${pattern.source}`);
  }
}

const decisionRegister = readRequired('provider response decision register', files.decisionRegister);
const intake = readRequired('provider response intake template', files.intake);
const routing = readRequired('provider response routing checklist', files.routing);
const evidenceLog = readRequired('provider response evidence log', files.evidenceLog);
const summaryShell = readRequired('provider response summary shell', files.summaryShell);
const actionQueue = readRequired('provider response action queue', files.actionQueue);
const publicationStatus = readRequired('publication evidence current status', files.publicationStatus);
const founderReadyRollup = readRequired('founder-ready packet status rollup', files.founderReadyRollup);
const masterIndex = readRequired('internal review master index', files.masterIndex);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const changeRequestQueue = readRequired('reviewer response change request queue', files.changeRequestQueue);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

[
  'Provider Response Decision Register',
  'Status: internal provider-response decision register',
  'No provider response decision is recorded yet',
  'Activation Preconditions',
  'Current Decision State',
  'NO_RESPONSE_RECORDED',
  'NO_DECISION_RECORDED',
  'NOT_RECORDED',
  'NO_GO',
  'BLOCKED_NO_OUTREACH',
  'BLOCKED_NO_RELEASE',
  'BLOCKED_LIVE_ACTIONS',
  'Decision Rows Template',
  'V13-PD-001',
  'BLOCKED_PENDING_PROVIDER_RESPONSE',
  'Allowed Local Decisions',
  'Decisions This Register Cannot Make',
  'Required Routing Links',
  'No-Shortcut Rules',
  'not publication approval',
  'not live action approval',
  'not legal/provider clearance',
  'not partnership commitment',
  'not provider commitment',
  'not outreach approval',
  'not production release approval',
  'Stop Boundary',
].forEach((phrase) => requirePhrase(decisionRegister, phrase, 'provider response decision register'));

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
].forEach((category) => requirePhrase(decisionRegister, category, 'provider response decision register'));

[
  'PUBLICATION_GO',
  'PUBLIC_FILE_REPLACEMENT_GO',
  'LEGAL_OR_PROVIDER_CLEARANCE_RECORDED',
  'PROVIDER_COMMITMENT_RECORDED',
  'OUTREACH_GO',
  'PRODUCTION_RELEASE_GO',
  'LIVE_FINANCE_WEB3_GO',
  'ESCROW_CUSTODY_GO',
  'LOAN_FUNDING_GO',
  'STABLECOIN_SETTLEMENT_GO',
  'TOKEN_COLLATERAL_GO',
  'FIO_REGISTRATION_GO',
  'XPR_SIGNATURE_GO',
  'WALLET_SIGNATURE_GO',
  'PARTNERSHIP_CLAIM_GO',
].forEach((decisionLabel) => requirePhrase(decisionRegister, decisionLabel, 'provider response decision register'));

[
  'docs/whitepaper-v1-3-provider-response-intake-template.md',
  'docs/whitepaper-v1-3-provider-response-routing-checklist.md',
  'docs/whitepaper-v1-3-provider-response-evidence-log.md',
  'docs/whitepaper-v1-3-provider-response-summary-shell.md',
  'docs/whitepaper-v1-3-provider-response-action-queue.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md',
  'docs/whitepaper-v1-3-internal-review-master-index.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-reviewer-response-change-request-queue.md',
].forEach((fileReference) => requirePhrase(decisionRegister, fileReference, 'provider response decision register'));

requirePhrase(intake, 'Provider Response Intake Template', 'provider response intake template');
requirePhrase(intake, 'No provider response is recorded yet', 'provider response intake template');
requirePhrase(intake, 'docs/whitepaper-v1-3-provider-response-decision-register.md', 'provider response intake template');
requirePhrase(routing, 'Provider Response Routing Checklist', 'provider response routing checklist');
requirePhrase(routing, 'No-Shortcut Rules', 'provider response routing checklist');
requirePhrase(routing, 'docs/whitepaper-v1-3-provider-response-decision-register.md', 'provider response routing checklist');
requirePhrase(evidenceLog, 'Provider Response Evidence Log', 'provider response evidence log');
requirePhrase(evidenceLog, 'No provider response evidence is recorded yet', 'provider response evidence log');
requirePhrase(evidenceLog, 'docs/whitepaper-v1-3-provider-response-decision-register.md', 'provider response evidence log');
requirePhrase(summaryShell, 'Provider Response Summary Shell', 'provider response summary shell');
requirePhrase(summaryShell, 'No provider response summary is recorded yet', 'provider response summary shell');
requirePhrase(summaryShell, 'docs/whitepaper-v1-3-provider-response-decision-register.md', 'provider response summary shell');
requirePhrase(actionQueue, 'Provider Response Action Queue', 'provider response action queue');
requirePhrase(actionQueue, 'QUEUE_NOT_ACTIVE', 'provider response action queue');
requirePhrase(actionQueue, 'docs/whitepaper-v1-3-provider-response-decision-register.md', 'provider response action queue');
requirePhrase(publicationStatus, 'provider response decision register | PENDING_PROVIDER_RESPONSE', 'publication evidence current status');
requirePhrase(founderReadyRollup, 'provider response decision register | PENDING_PROVIDER_RESPONSE', 'founder-ready packet status rollup');
requirePhrase(masterIndex, 'provider response decision register | local decision register only / no provider response decision recorded', 'internal review master index');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(changeRequestQueue, 'Reviewer Response Change Request Queue', 'reviewer response change request queue');
requirePhrase(changeRequestQueue, 'QUEUE_NOT_ACTIVE', 'reviewer response change request queue');

[
  /\bprovider response decision recorded\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blive action approved\b/i,
  /\blegal\/provider clearance recorded\b/i,
  /\bprovider commitment recorded\b/i,
  /\bpartnership approved\b/i,
  /\bproduction release approved\b/i,
  /\boutreach approved\b/i,
].forEach((pattern) => rejectPattern(decisionRegister, pattern, 'provider response decision register'));

for (const [content, label] of [
  [publicWhitepaper, 'public whitepaper'],
  [publicHomepage, 'public homepage'],
]) {
  if (content.includes('Provider Response Decision Register') || content.includes('V13-PD-001')) {
    errors.push(`${label} appears to contain internal provider response decision register content`);
  }
}

if (errors.length > 0) {
  console.error('whitepaper v1.3 provider response decision register validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('whitepaper v1.3 provider response decision register validation passed');
