import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  decisionEvidenceSummary: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-evidence-summary.md'),
  decisionEvidenceIntake: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-evidence-intake.md'),
  decisionEvidenceTemplate: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-evidence-template.md'),
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

const decisionEvidenceSummary = readRequired('provider response decision evidence summary', files.decisionEvidenceSummary);
const decisionEvidenceIntake = readRequired('provider response decision evidence intake', files.decisionEvidenceIntake);
const decisionEvidenceTemplate = readRequired('provider response decision evidence template', files.decisionEvidenceTemplate);
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
  'Provider Response Decision Evidence Summary',
  'Status: internal provider-response decision evidence summary',
  'No provider response decision evidence summary is recorded yet',
  'Summary Preconditions',
  'Summary Record Template',
  'V13-PD-EVID-SUM-001',
  'V13-PD-EVID-INTAKE-001',
  'V13-PD-EVID-001',
  'V13-PD-001',
  'Required Summary Findings',
  'Summary Routing Rules',
  'Safe Summary Rules',
  'Cross References',
  'No-Shortcut Rules',
  'not publication approval',
  'not live action approval',
  'not legal/provider clearance',
  'not partnership commitment',
  'not provider commitment',
  'not outreach approval',
  'not production release approval',
  'Stop Boundary',
  'PENDING_PROVIDER_RESPONSE',
  'PENDING_REDACTION_REVIEW',
  'PASS_LOCAL_ONLY',
  'NEEDS_LOCAL_REVISION',
  'NEEDS_FOUNDER_ROUTING',
  'NEEDS_PROVIDER_REVIEW',
  'BLOCKED_FOR_LIVE',
  'NO_GO_RECORDED',
  'public publication approved? | NO by default',
  'legal/provider clearance recorded? | NO by default',
  'provider commitment recorded? | NO by default',
  'outreach approved? | NO by default',
  'production release approved? | NO by default',
  'live action approved? | NO by default',
].forEach((phrase) => requirePhrase(decisionEvidenceSummary, phrase, 'provider response decision evidence summary'));

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
].forEach((category) => requirePhrase(decisionEvidenceSummary, category, 'provider response decision evidence summary'));

[
  'docs/whitepaper-v1-3-provider-response-intake-template.md',
  'docs/whitepaper-v1-3-provider-response-evidence-log.md',
  'docs/whitepaper-v1-3-provider-response-summary-shell.md',
  'docs/whitepaper-v1-3-provider-response-routing-checklist.md',
  'docs/whitepaper-v1-3-provider-response-action-queue.md',
  'docs/whitepaper-v1-3-provider-response-decision-register.md',
  'docs/whitepaper-v1-3-provider-response-decision-evidence-template.md',
  'docs/whitepaper-v1-3-provider-response-decision-evidence-intake.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md',
  'docs/whitepaper-v1-3-internal-review-master-index.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-reviewer-response-change-request-queue.md',
].forEach((fileReference) => requirePhrase(decisionEvidenceSummary, fileReference, 'provider response decision evidence summary'));

requirePhrase(decisionEvidenceIntake, 'Provider Response Decision Evidence Intake', 'provider response decision evidence intake');
requirePhrase(decisionEvidenceIntake, 'No provider response decision evidence intake is recorded yet', 'provider response decision evidence intake');
requirePhrase(decisionEvidenceIntake, 'docs/whitepaper-v1-3-provider-response-decision-evidence-summary.md', 'provider response decision evidence intake');
requirePhrase(decisionEvidenceTemplate, 'Provider Response Decision Evidence Template', 'provider response decision evidence template');
requirePhrase(decisionEvidenceTemplate, 'No provider response decision evidence is recorded yet', 'provider response decision evidence template');
requirePhrase(decisionEvidenceTemplate, 'docs/whitepaper-v1-3-provider-response-decision-evidence-summary.md', 'provider response decision evidence template');
requirePhrase(decisionRegister, 'Provider Response Decision Register', 'provider response decision register');
requirePhrase(decisionRegister, 'NO_DECISION_RECORDED', 'provider response decision register');
requirePhrase(decisionRegister, 'docs/whitepaper-v1-3-provider-response-decision-evidence-summary.md', 'provider response decision register');
requirePhrase(intake, 'Provider Response Intake Template', 'provider response intake template');
requirePhrase(intake, 'No provider response is recorded yet', 'provider response intake template');
requirePhrase(intake, 'docs/whitepaper-v1-3-provider-response-decision-evidence-summary.md', 'provider response intake template');
requirePhrase(routing, 'Provider Response Routing Checklist', 'provider response routing checklist');
requirePhrase(routing, 'No-Shortcut Rules', 'provider response routing checklist');
requirePhrase(routing, 'docs/whitepaper-v1-3-provider-response-decision-evidence-summary.md', 'provider response routing checklist');
requirePhrase(evidenceLog, 'Provider Response Evidence Log', 'provider response evidence log');
requirePhrase(evidenceLog, 'No provider response evidence is recorded yet', 'provider response evidence log');
requirePhrase(evidenceLog, 'docs/whitepaper-v1-3-provider-response-decision-evidence-summary.md', 'provider response evidence log');
requirePhrase(summaryShell, 'Provider Response Summary Shell', 'provider response summary shell');
requirePhrase(summaryShell, 'No provider response summary is recorded yet', 'provider response summary shell');
requirePhrase(summaryShell, 'docs/whitepaper-v1-3-provider-response-decision-evidence-summary.md', 'provider response summary shell');
requirePhrase(actionQueue, 'Provider Response Action Queue', 'provider response action queue');
requirePhrase(actionQueue, 'QUEUE_NOT_ACTIVE', 'provider response action queue');
requirePhrase(actionQueue, 'docs/whitepaper-v1-3-provider-response-decision-evidence-summary.md', 'provider response action queue');
requirePhrase(publicationStatus, 'provider response decision evidence summary | PENDING_PROVIDER_RESPONSE', 'publication evidence current status');
requirePhrase(founderReadyRollup, 'provider response decision evidence summary | PENDING_PROVIDER_RESPONSE', 'founder-ready packet status rollup');
requirePhrase(masterIndex, 'provider response decision evidence summary | local decision evidence summary only / no provider response decision evidence summary recorded', 'internal review master index');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(changeRequestQueue, 'Reviewer Response Change Request Queue', 'reviewer response change request queue');
requirePhrase(changeRequestQueue, 'QUEUE_NOT_ACTIVE', 'reviewer response change request queue');

[
  /\bprovider response decision evidence summary recorded\b/i,
  /\bpublic publication approved\?\s*\|\s*YES\b/i,
  /\bpublic replacement approved\b/i,
  /\blive action approved\?\s*\|\s*YES\b/i,
  /\blegal\/provider clearance recorded\?\s*\|\s*YES\b/i,
  /\bprovider commitment recorded\?\s*\|\s*YES\b/i,
  /\bpartnership approved\b/i,
  /\bproduction release approved\?\s*\|\s*YES\b/i,
  /\boutreach approved\?\s*\|\s*YES\b/i,
].forEach((pattern) => rejectPattern(decisionEvidenceSummary, pattern, 'provider response decision evidence summary'));

for (const [content, label] of [
  [publicWhitepaper, 'public whitepaper'],
  [publicHomepage, 'public homepage'],
]) {
  if (content.includes('Provider Response Decision Evidence Summary') || content.includes('V13-PD-EVID-SUM-001')) {
    errors.push(`${label} appears to contain internal provider response decision evidence summary content`);
  }
}

if (errors.length > 0) {
  console.error('whitepaper v1.3 provider response decision evidence summary validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('whitepaper v1.3 provider response decision evidence summary validation passed');
