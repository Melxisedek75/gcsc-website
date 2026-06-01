import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  coverSheet: path.join(root, 'docs', 'whitepaper-v1-3-external-reviewer-cover-sheet.md'),
  routingIndex: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-routing-index.md'),
  redactionChecklist: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-redaction-checklist.md'),
  legalPacket: path.join(root, 'docs', 'whitepaper-v1-3-legal-provider-review-packet.md'),
  providerStatus: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-status-matrix.md'),
  reviewerIntake: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-intake-template.md'),
  reviewerSummary: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-summary-shell.md'),
  publicationEvidence: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  blockerMatrix: path.join(root, 'docs', 'whitepaper-v1-3-publication-blocker-status-matrix.md'),
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

const coverSheet = readRequired('external reviewer cover sheet', files.coverSheet);
const routingIndex = readRequired('reviewer routing index', files.routingIndex);
const redactionChecklist = readRequired('reviewer packet redaction checklist', files.redactionChecklist);
const legalPacket = readRequired('legal/provider review packet', files.legalPacket);
const providerStatus = readRequired('provider question status matrix', files.providerStatus);
const reviewerIntake = readRequired('reviewer response intake template', files.reviewerIntake);
const reviewerSummary = readRequired('reviewer response summary shell', files.reviewerSummary);
const publicationEvidence = readRequired('publication evidence current status', files.publicationEvidence);
const blockerMatrix = readRequired('publication blocker status matrix', files.blockerMatrix);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal external reviewer cover sheet',
  'No outreach is approved or sent',
  'Packet Scope',
  'Reviewer Instructions',
  'Explicit Out Of Scope',
  'Redaction Confirmation',
  'Response Intake Path',
  'Stop Boundary',
  'public publication approved | NO by default',
  'outreach approved by founder | NO by default',
  'response intake file prepared | READY_LOCAL_TEMPLATE',
]) {
  requirePhrase(coverSheet, phrase, 'external reviewer cover sheet');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-founder-review-packet.md',
  'docs/whitepaper-v1-3-public-draft.md',
  'docs/whitepaper-v1-3-claim-risk-register.md',
  'docs/whitepaper-v1-3-claim-risk-hardening-checklist.md',
  'docs/whitepaper-v1-3-legal-provider-review-packet.md',
  'docs/whitepaper-v1-3-provider-question-register.md',
  'docs/whitepaper-v1-3-reviewer-routing-index.md',
  'docs/whitepaper-v1-3-provider-question-status-matrix.md',
  'docs/whitepaper-v1-3-reviewer-packet-redaction-checklist.md',
  'docs/whitepaper-v1-3-fio-protocol-integration-brief.md',
  'docs/whitepaper-v1-3-metallicus-xpr-integration-brief.md',
  'docs/whitepaper-v1-3-regulated-web3-architecture-map.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-publication-blocker-status-matrix.md',
  'docs/whitepaper-v1-3-reviewer-response-intake-template.md',
  'docs/whitepaper-v1-3-reviewer-response-summary-shell.md',
]) {
  requirePhrase(coverSheet, fileReference, 'external reviewer cover sheet');
}

for (const decision of [
  'APPROVE_PUBLIC_SAFE_WORDING',
  'REVISE_PUBLIC_SAFE_WORDING',
  'HOLD_FOR_MORE_INFO',
  'BLOCK_FOR_LIVE_USE',
  'NO_GO',
]) {
  requirePhrase(coverSheet, decision, 'external reviewer cover sheet');
}

requirePhrase(routingIndex, 'Codex must not contact anyone autonomously', 'reviewer routing index');
requirePhrase(redactionChecklist, 'Redaction Required Before Reviewer Packet Leaves Local Repo', 'reviewer packet redaction checklist');
requirePhrase(legalPacket, 'Required Review Outputs', 'legal/provider review packet');
requirePhrase(providerStatus, 'No provider response is recorded yet', 'provider question status matrix');
requirePhrase(reviewerIntake, 'public publication approved? | NO by default', 'reviewer response intake template');
requirePhrase(reviewerSummary, 'No reviewer response is recorded yet', 'reviewer response summary shell');
requirePhrase(publicationEvidence, 'Current publication decision remains NO-GO', 'publication evidence current status');
requirePhrase(blockerMatrix, 'Current publication decision remains NO-GO', 'publication blocker status matrix');

const blockedApprovalPatterns = [
  /\boutreach approved by founder \| YES\b/i,
  /\bpublic publication approved \| YES\b/i,
  /\bpublication approved\b(?! \| NO by default)/i,
  /\bpublic replacement approved\b(?! \| NO by default)/i,
  /\blegal\/provider review \| COMPLETE\b/i,
  /\bprovider response recorded\b/i,
  /\blive action approved\b/i,
  /\bpartnership commitment recorded\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(coverSheet)) {
    errors.push(`external reviewer cover sheet contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('External Reviewer Cover Sheet') || content.includes('Reviewer Instructions')) {
    errors.push(`${label} appears to contain internal reviewer cover sheet content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 external reviewer cover sheet validation passed');
