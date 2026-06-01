import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  shell: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-summary-shell.md'),
  intake: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-intake-template.md'),
  routing: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-routing-checklist.md'),
  evidenceLog: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-evidence-log.md'),
  actionQueue: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-action-queue.md'),
  changeRequestQueue: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-change-request-queue.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  publicationStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  founderReadyRollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
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

const shell = readRequired('provider response summary shell', files.shell);
const intake = readRequired('provider response intake template', files.intake);
const routing = readRequired('provider response routing checklist', files.routing);
const evidenceLog = readRequired('provider response evidence log', files.evidenceLog);
const actionQueue = readRequired('provider response action queue', files.actionQueue);
const changeRequestQueue = readRequired('reviewer response change request queue', files.changeRequestQueue);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const publicationStatus = readRequired('publication evidence current status', files.publicationStatus);
const founderReadyRollup = readRequired('founder-ready packet status rollup', files.founderReadyRollup);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Provider Response Summary Shell',
  'Status: internal provider-response summary shell',
  'No provider response summary is recorded yet',
  'Source Provider Reference',
  'Provider Decision Summary',
  'Required Provider Follow-Up Queue',
  'Blockers Carried Forward',
  'Safe Output Rules',
  'Stop Boundary',
  'public publication decision | NO by default',
  'legal/provider clearance recorded | NO by default',
  'provider commitment recorded | NO by default',
  'live action decision | NO by default',
  'V13-PS-001',
  'docs/whitepaper-v1-3-provider-response-intake-template.md',
  'docs/whitepaper-v1-3-provider-response-routing-checklist.md',
  'docs/whitepaper-v1-3-provider-response-evidence-log.md',
  'docs/whitepaper-v1-3-provider-response-action-queue.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-reviewer-response-change-request-queue.md',
]) {
  requirePhrase(shell, phrase, 'provider response summary shell');
}

for (const area of [
  'escrow custody boundary',
  'lending and working-capital boundary',
  'KYC-KYB-AML and fraud boundary',
  'payment processing and stablecoin boundary',
  'insurance and bonding boundary',
  'valuation and appraisal boundary',
  'FIO UX boundary',
  'XPR/WebAuth/Metal/Metallicus boundary',
  'legal/provider wording boundary',
  'data/privacy/security boundary',
]) {
  requirePhrase(shell, area, 'provider response summary shell');
}

requirePhrase(intake, 'Provider Response Intake Template', 'provider response intake template');
requirePhrase(intake, 'No provider response is recorded yet', 'provider response intake template');
requirePhrase(intake, 'docs/whitepaper-v1-3-provider-response-summary-shell.md', 'provider response intake template');
requirePhrase(routing, 'Provider Response Routing Checklist', 'provider response routing checklist');
requirePhrase(routing, 'No-Shortcut Rules', 'provider response routing checklist');
requirePhrase(routing, 'docs/whitepaper-v1-3-provider-response-summary-shell.md', 'provider response routing checklist');
requirePhrase(evidenceLog, 'Provider Response Evidence Log', 'provider response evidence log');
requirePhrase(evidenceLog, 'No provider response evidence is recorded yet', 'provider response evidence log');
requirePhrase(evidenceLog, 'docs/whitepaper-v1-3-provider-response-summary-shell.md', 'provider response evidence log');
requirePhrase(actionQueue, 'Provider Response Action Queue', 'provider response action queue');
requirePhrase(actionQueue, 'QUEUE_NOT_ACTIVE', 'provider response action queue');
requirePhrase(actionQueue, 'docs/whitepaper-v1-3-provider-response-summary-shell.md', 'provider response action queue');
requirePhrase(changeRequestQueue, 'Reviewer Response Change Request Queue', 'reviewer response change request queue');
requirePhrase(changeRequestQueue, 'QUEUE_NOT_ACTIVE', 'reviewer response change request queue');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(publicationStatus, 'provider response summary shell | PENDING_PROVIDER_RESPONSE', 'publication evidence current status');
requirePhrase(founderReadyRollup, 'provider response summary shell | PENDING_PROVIDER_RESPONSE', 'founder-ready packet status rollup');

for (const pattern of [
  /\bpublic publication decision\s*\|\s*YES\b/i,
  /\blegal\/provider clearance recorded\s*\|\s*YES\b/i,
  /\bprovider commitment recorded\s*\|\s*YES\b/i,
  /\blive action decision\s*\|\s*YES\b/i,
  /\bfounder clearance recorded\b/i,
  /\bpublication clearance recorded\b/i,
  /\blive-action clearance recorded\b/i,
  /\bpartnership commitment recorded\b/i,
  /\bpublic replacement authorized\b/i,
  /\blive action authorized\b/i,
]) {
  rejectPattern(shell, pattern, 'provider response summary shell');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Provider Response Summary Shell') || content.includes('V13-PS-001')) {
    errors.push(`${label} appears to contain internal provider response summary content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 provider response summary shell validation passed');
