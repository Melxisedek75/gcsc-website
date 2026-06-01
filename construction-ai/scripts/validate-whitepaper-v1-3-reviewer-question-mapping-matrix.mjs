import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  matrix: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-question-mapping-matrix.md'),
  providerRegister: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-register.md'),
  providerStatus: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-status-matrix.md'),
  legalProvider: path.join(root, 'docs', 'whitepaper-v1-3-legal-provider-review-packet.md'),
  reviewerRouting: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-routing-index.md'),
  sendReadiness: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-send-readiness-checklist.md'),
  redaction: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-redaction-checklist.md'),
  evidenceAppendix: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-evidence-appendix.md'),
  responseIntake: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-intake-template.md'),
  publicDistributionBoundaryMatrix: path.join(root, 'docs', 'whitepaper-v1-3-public-distribution-boundary-matrix.md'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
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
    errors.push(`${label} contains blocked approval phrase: ${pattern.source}`);
  }
}

const matrix = readRequired('reviewer question mapping matrix', files.matrix);
const providerRegister = readRequired('provider question register', files.providerRegister);
const providerStatus = readRequired('provider question status matrix', files.providerStatus);
const legalProvider = readRequired('legal provider review packet', files.legalProvider);
const reviewerRouting = readRequired('reviewer routing index', files.reviewerRouting);
const sendReadiness = readRequired('reviewer packet send readiness checklist', files.sendReadiness);
const redaction = readRequired('reviewer packet redaction checklist', files.redaction);
const evidenceAppendix = readRequired('reviewer evidence appendix', files.evidenceAppendix);
const responseIntake = readRequired('reviewer response intake', files.responseIntake);
const publicDistributionBoundaryMatrix = readRequired('public distribution boundary matrix', files.publicDistributionBoundaryMatrix);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Reviewer Question Mapping Matrix',
  'No reviewer outreach is approved',
  'No provider outreach is approved',
  'Question Mapping Readiness Checks',
  'PENDING_FOUNDER_CATEGORY_SELECTION',
  'PENDING_PACKET_SCOPE_SELECTION',
  'PENDING_REDACTION_REVIEW',
  'PENDING_SEND_DECISION',
  'BLOCKED_NO_OUTREACH',
  'Reviewer Category Mapping',
  'LOCAL_MAPPING_ONLY',
  'NO_CONTACT_APPROVED',
  'Required Source Documents',
  'No Shortcut Rules',
  'Stop Boundary',
]) {
  requirePhrase(matrix, phrase, 'reviewer question mapping matrix');
}

for (const category of [
  'attorney/compliance',
  'escrow provider',
  'lending/working-capital provider',
  'KYC/KYB/AML provider',
  'insurance/bonding provider',
  'appraisal/valuation reviewer',
  'FIO/XPR/WebAuth/Metal/Metallicus technical reviewer',
]) {
  requirePhrase(matrix, category, 'reviewer question mapping matrix');
}

for (const group of [
  'Escrow Custody',
  'Lending And Working Capital',
  'KYC, KYB, AML, And Fraud',
  'Payment Processing And Stablecoin Settlement',
  'Insurance And Bonding',
  'Appraisal And Valuation',
  'FIO Protocol',
  'XPR, WebAuth, Metal, And Metallicus',
  'Data Privacy And Audit Logs',
]) {
  requirePhrase(matrix, group, 'reviewer question mapping matrix');
  requirePhrase(providerRegister, group, 'provider question register');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-provider-question-register.md',
  'docs/whitepaper-v1-3-provider-question-status-matrix.md',
  'docs/whitepaper-v1-3-legal-provider-review-packet.md',
  'docs/whitepaper-v1-3-reviewer-routing-index.md',
  'docs/whitepaper-v1-3-reviewer-packet-send-readiness-checklist.md',
  'docs/whitepaper-v1-3-reviewer-packet-redaction-checklist.md',
  'docs/whitepaper-v1-3-reviewer-evidence-appendix.md',
  'docs/whitepaper-v1-3-reviewer-response-intake-template.md',
  'docs/whitepaper-v1-3-public-distribution-boundary-matrix.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
]) {
  requirePhrase(matrix, fileReference, 'reviewer question mapping matrix');
}

requirePhrase(providerStatus, 'No provider response is recorded yet', 'provider question status matrix');
requirePhrase(providerStatus, 'docs/whitepaper-v1-3-reviewer-question-mapping-matrix.md', 'provider question status matrix');
requirePhrase(legalProvider, 'Required Review Outputs', 'legal provider review packet');
requirePhrase(reviewerRouting, 'Reviewer Response Intake', 'reviewer routing index');
requirePhrase(sendReadiness, 'PENDING_QUESTION_MAPPING', 'reviewer packet send readiness checklist');
requirePhrase(redaction, 'Redaction Required Before Reviewer Packet Leaves Local Repo', 'reviewer packet redaction checklist');
requirePhrase(evidenceAppendix, 'Evidence Not Yet Complete', 'reviewer evidence appendix');
requirePhrase(responseIntake, 'public publication approved? | NO by default', 'reviewer response intake');
requirePhrase(publicDistributionBoundaryMatrix, 'BLOCKED_FOUNDER_CONTROLLED_SEND', 'public distribution boundary matrix');
requirePhrase(evidenceStatus, 'reviewer packet send readiness | PENDING_FOUNDER_SEND_DECISION', 'publication evidence current status');

for (const pattern of [
  /\breviewer outreach approved\b/i,
  /\bprovider outreach approved\b/i,
  /\blegal review complete\b/i,
  /\bprovider review complete\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blive action approved\b/i,
  /\bpartnership approved\b/i,
]) {
  rejectPattern(matrix, pattern, 'reviewer question mapping matrix');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Reviewer Question Mapping Matrix') || content.includes('LOCAL_MAPPING_ONLY')) {
    errors.push(`${label} appears to contain internal reviewer question mapping matrix content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 reviewer question mapping matrix validation passed');
