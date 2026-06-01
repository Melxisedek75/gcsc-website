import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  routing: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-routing-checklist.md'),
  intake: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-intake-template.md'),
  responseEvidenceLog: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-evidence-log.md'),
  responseSummaryShell: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-summary-shell.md'),
  handoffMap: path.join(root, 'docs', 'whitepaper-v1-3-provider-handoff-packet-map.md'),
  providerQuestions: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-register.md'),
  providerStatus: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-status-matrix.md'),
  publicationStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  changeRequestQueue: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-change-request-queue.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  publicWhitepaper: path.join(root, 'whitepaper.html'),
  publicHomepage: path.join(root, 'index.html'),
};

const errors = [];

function readRequired(label, file) {
  if (!fs.existsSync(file)) {
    errors.push(`Missing required ${label}: ${file}`);
    return '';
  }

  return fs.readFileSync(file, 'utf8');
}

function requirePhrase(text, phrase, label) {
  if (!text.includes(phrase)) {
    errors.push(`${label} missing required phrase: ${phrase}`);
  }
}

function rejectPattern(text, pattern, label) {
  if (pattern.test(text)) {
    errors.push(`${label} contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

const routing = readRequired('provider response routing checklist', files.routing);
const intake = readRequired('provider response intake template', files.intake);
const responseEvidenceLog = readRequired('provider response evidence log', files.responseEvidenceLog);
const responseSummaryShell = readRequired('provider response summary shell', files.responseSummaryShell);
const handoffMap = readRequired('provider handoff packet map', files.handoffMap);
const providerQuestions = readRequired('provider question register', files.providerQuestions);
const providerStatus = readRequired('provider question status matrix', files.providerStatus);
const publicationStatus = readRequired('publication evidence current status', files.publicationStatus);
const changeRequestQueue = readRequired('reviewer response change request queue', files.changeRequestQueue);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Provider Response Routing Checklist',
  'Status: internal provider response routing checklist',
  'No provider response is recorded yet',
  'Required Inputs Before Routing',
  'Routing Matrix',
  'Response Category Routing',
  'Required Follow-Up Records',
  'No-Shortcut Rules',
  'HOLD',
  'REVISE',
  'QUESTION_ONLY',
  'BLOCK_FOR_LIVE_USE',
  'NO_GO',
  'founder-provided written response',
  'not publication approval',
  'not live action approval',
  'not legal/provider clearance',
  'not partnership commitment',
  'not outreach approval',
  'not production release approval',
  'Stop Boundary',
]) {
  requirePhrase(routing, phrase, 'provider response routing checklist');
}

for (const providerCategory of [
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
]) {
  requirePhrase(routing, providerCategory, 'provider response routing checklist');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-provider-response-intake-template.md',
  'docs/whitepaper-v1-3-provider-response-evidence-log.md',
  'docs/whitepaper-v1-3-provider-response-summary-shell.md',
  'docs/whitepaper-v1-3-provider-handoff-packet-map.md',
  'docs/whitepaper-v1-3-provider-question-register.md',
  'docs/whitepaper-v1-3-provider-question-status-matrix.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-reviewer-response-change-request-queue.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
]) {
  requirePhrase(routing, fileReference, 'provider response routing checklist');
}

requirePhrase(intake, 'Provider Response Intake Template', 'provider response intake template');
requirePhrase(intake, 'No provider response is recorded yet', 'provider response intake template');
requirePhrase(intake, 'docs/whitepaper-v1-3-provider-response-routing-checklist.md', 'provider response intake template');
requirePhrase(responseEvidenceLog, 'Provider Response Evidence Log', 'provider response evidence log');
requirePhrase(responseEvidenceLog, 'No provider response evidence is recorded yet', 'provider response evidence log');
requirePhrase(responseEvidenceLog, 'docs/whitepaper-v1-3-provider-response-routing-checklist.md', 'provider response evidence log');
requirePhrase(responseSummaryShell, 'Provider Response Summary Shell', 'provider response summary shell');
requirePhrase(responseSummaryShell, 'No provider response summary is recorded yet', 'provider response summary shell');
requirePhrase(responseSummaryShell, 'docs/whitepaper-v1-3-provider-response-routing-checklist.md', 'provider response summary shell');
requirePhrase(handoffMap, 'Provider Handoff Packet Map', 'provider handoff packet map');
requirePhrase(providerQuestions, 'Use Rule', 'provider question register');
requirePhrase(providerStatus, 'No provider response is recorded yet', 'provider question status matrix');
requirePhrase(publicationStatus, 'legal/provider review | PENDING', 'publication evidence current status');
requirePhrase(changeRequestQueue, 'Reviewer Response Change Request Queue', 'reviewer response change request queue');
requirePhrase(changeRequestQueue, 'QUEUE_NOT_ACTIVE', 'reviewer response change request queue');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');

for (const pattern of [
  /\bprovider response recorded\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blive action approved\b/i,
  /\blegal\/provider clearance recorded\b/i,
  /\bprovider commitment recorded\b/i,
  /\bpartnership approved\b/i,
  /\bproduction release approved\b/i,
]) {
  rejectPattern(routing, pattern, 'provider response routing checklist');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Provider Response Routing Checklist') || content.includes('Required Inputs Before Routing')) {
    errors.push(`${label} appears to contain internal provider response routing content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 provider response routing validation passed');
