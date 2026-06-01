import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  rollup: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-status-rollup.md'),
  routingIndex: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-routing-index.md'),
  coverSheet: path.join(root, 'docs', 'whitepaper-v1-3-external-reviewer-cover-sheet.md'),
  evidenceAppendix: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-evidence-appendix.md'),
  redactionChecklist: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-redaction-checklist.md'),
  responseIntake: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-intake-template.md'),
  responseSummary: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-summary-shell.md'),
  providerStatus: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-status-matrix.md'),
  blockerMatrix: path.join(root, 'docs', 'whitepaper-v1-3-publication-blocker-status-matrix.md'),
  stateTransitionMatrix: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-state-transition-matrix.md'),
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

const rollup = readRequired('reviewer packet status rollup', files.rollup);
const routingIndex = readRequired('reviewer routing index', files.routingIndex);
const coverSheet = readRequired('external reviewer cover sheet', files.coverSheet);
const evidenceAppendix = readRequired('reviewer evidence appendix', files.evidenceAppendix);
const redactionChecklist = readRequired('reviewer packet redaction checklist', files.redactionChecklist);
const responseIntake = readRequired('reviewer response intake template', files.responseIntake);
const responseSummary = readRequired('reviewer response summary shell', files.responseSummary);
const providerStatus = readRequired('provider question status matrix', files.providerStatus);
const blockerMatrix = readRequired('publication blocker status matrix', files.blockerMatrix);
const stateTransitionMatrix = readRequired('founder review state transition matrix', files.stateTransitionMatrix);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Reviewer Packet Status Rollup',
  'No outreach is approved',
  'Packet Readiness Table',
  'Reviewer Packet Groups',
  'Required Before Any Founder-Controlled Send',
  'Current Response Status',
  'Linked Controls',
  'Stop Boundary',
  'PENDING_FOUNDER_ROUTING',
  'READY_LOCAL_TEMPLATE',
  'PREPARED_LOCAL_NOT_SENT',
  'NOT_SENT',
  'No reviewer response is recorded yet',
  'No provider response is recorded yet',
  'NO_GO_PUBLICATION_DEFAULT',
]) {
  requirePhrase(rollup, phrase, 'reviewer packet status rollup');
}

for (const reviewerGroup of [
  'attorney / compliance',
  'escrow provider',
  'lending / working capital',
  'KYC / KYB / AML',
  'FIO Protocol technical',
  'XPR / WebAuth / Metal / Metallicus technical',
]) {
  requirePhrase(rollup, reviewerGroup, 'reviewer packet status rollup');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-reviewer-routing-index.md',
  'docs/whitepaper-v1-3-external-reviewer-cover-sheet.md',
  'docs/whitepaper-v1-3-reviewer-evidence-appendix.md',
  'docs/whitepaper-v1-3-reviewer-packet-redaction-checklist.md',
  'docs/whitepaper-v1-3-reviewer-response-intake-template.md',
  'docs/whitepaper-v1-3-reviewer-response-summary-shell.md',
  'docs/whitepaper-v1-3-provider-question-status-matrix.md',
  'docs/whitepaper-v1-3-publication-blocker-status-matrix.md',
  'docs/whitepaper-v1-3-founder-review-state-transition-matrix.md',
]) {
  requirePhrase(rollup, fileReference, 'reviewer packet status rollup');
}

requirePhrase(routingIndex, 'Codex must not contact anyone autonomously', 'reviewer routing index');
requirePhrase(coverSheet, 'No outreach is approved or sent', 'external reviewer cover sheet');
requirePhrase(evidenceAppendix, 'No outreach is approved', 'reviewer evidence appendix');
requirePhrase(evidenceAppendix, 'Evidence Package Summary', 'reviewer evidence appendix');
requirePhrase(redactionChecklist, 'Redaction Required Before Reviewer Packet Leaves Local Repo', 'reviewer packet redaction checklist');
requirePhrase(responseIntake, 'No reviewer response is recorded yet', 'reviewer response intake template');
requirePhrase(responseSummary, 'No reviewer response is recorded yet', 'reviewer response summary shell');
requirePhrase(providerStatus, 'No provider response is recorded yet', 'provider question status matrix');
requirePhrase(blockerMatrix, 'Current publication decision remains NO-GO', 'publication blocker status matrix');
requirePhrase(stateTransitionMatrix, 'NO_GO_PUBLICATION_DEFAULT', 'founder review state transition matrix');

const blockedApprovalPatterns = [
  /\boutreach approved\b/i,
  /\boutreach sent\b/i,
  /\bpacket sent\b/i,
  /\bprovider response recorded\b/i,
  /\breviewer response recorded\b/i,
  /\blegal\/provider conclusion \| RECORDED\b/i,
  /\bpublication GO record \| EXISTS\b/i,
  /\blive-action authorization \| EXISTS\b/i,
  /\bpartnership approval\b(?!, public publication approval)/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(rollup)) {
    errors.push(`reviewer packet status rollup contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Reviewer Packet Status Rollup') || content.includes('Packet Readiness Table')) {
    errors.push(`${label} appears to contain internal reviewer packet status content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 reviewer packet status rollup validation passed');
