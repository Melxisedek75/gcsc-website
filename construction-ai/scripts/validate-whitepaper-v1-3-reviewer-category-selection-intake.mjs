import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  intake: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-category-selection-intake-template.md'),
  questionMapping: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-question-mapping-matrix.md'),
  sendReadiness: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-send-readiness-checklist.md'),
  statusRollup: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-status-rollup.md'),
  evidenceAppendix: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-evidence-appendix.md'),
  redaction: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-redaction-checklist.md'),
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

const intake = readRequired('reviewer category selection intake template', files.intake);
const questionMapping = readRequired('reviewer question mapping matrix', files.questionMapping);
const sendReadiness = readRequired('reviewer packet send readiness checklist', files.sendReadiness);
const statusRollup = readRequired('reviewer packet status rollup', files.statusRollup);
const evidenceAppendix = readRequired('reviewer evidence appendix', files.evidenceAppendix);
const redaction = readRequired('reviewer packet redaction checklist', files.redaction);
const responseIntake = readRequired('reviewer response intake template', files.responseIntake);
const publicDistributionBoundaryMatrix = readRequired('public distribution boundary matrix', files.publicDistributionBoundaryMatrix);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Reviewer Category Selection Intake Template',
  'No reviewer category is selected',
  'No reviewer packet send is approved',
  'Current reviewer outreach decision remains NO-GO',
  'Selection Readiness Checks',
  'Founder Selection Fields',
  'Reviewer Category Options',
  'Required Source Documents',
  'No Shortcut Rules',
  'Stop Boundary',
  'PENDING_FOUNDER_CATEGORY_SELECTION',
  'PENDING_PACKET_SCOPE_SELECTION',
  'PENDING_QUESTION_MAPPING_CONFIRMATION',
  'PENDING_EVIDENCE_APPENDIX_REVIEW',
  'PENDING_REDACTION_REVIEW',
  'PENDING_SEND_DECISION',
  'BLOCKED_NO_OUTREACH',
  'PENDING_CATEGORY_SELECTION',
  'PENDING_RESPONSE_INTAKE_TARGET',
  'NO by default',
  'UNSELECTED_LOCAL_OPTION',
  'NO_CONTACT_APPROVED',
]) {
  requirePhrase(intake, phrase, 'reviewer category selection intake template');
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
  requirePhrase(intake, category, 'reviewer category selection intake template');
  requirePhrase(questionMapping, category, 'reviewer question mapping matrix');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-reviewer-question-mapping-matrix.md',
  'docs/whitepaper-v1-3-reviewer-packet-send-readiness-checklist.md',
  'docs/whitepaper-v1-3-reviewer-packet-status-rollup.md',
  'docs/whitepaper-v1-3-reviewer-evidence-appendix.md',
  'docs/whitepaper-v1-3-reviewer-packet-redaction-checklist.md',
  'docs/whitepaper-v1-3-reviewer-response-intake-template.md',
  'docs/whitepaper-v1-3-public-distribution-boundary-matrix.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
]) {
  requirePhrase(intake, fileReference, 'reviewer category selection intake template');
}

requirePhrase(questionMapping, 'PENDING_FOUNDER_CATEGORY_SELECTION', 'reviewer question mapping matrix');
requirePhrase(questionMapping, 'docs/whitepaper-v1-3-reviewer-category-selection-intake-template.md', 'reviewer question mapping matrix');
requirePhrase(sendReadiness, 'PENDING_RECIPIENT_CATEGORY', 'reviewer packet send readiness checklist');
requirePhrase(sendReadiness, 'docs/whitepaper-v1-3-reviewer-category-selection-intake-template.md', 'reviewer packet send readiness checklist');
requirePhrase(statusRollup, 'No outreach is approved', 'reviewer packet status rollup');
requirePhrase(evidenceAppendix, 'No outreach is approved', 'reviewer evidence appendix');
requirePhrase(redaction, 'Redaction Required Before Reviewer Packet Leaves Local Repo', 'reviewer packet redaction checklist');
requirePhrase(responseIntake, 'public publication approved? | NO by default', 'reviewer response intake template');
requirePhrase(publicDistributionBoundaryMatrix, 'BLOCKED_FOUNDER_CONTROLLED_SEND', 'public distribution boundary matrix');
requirePhrase(evidenceStatus, 'reviewer category selection intake template validator | PASS_LOCAL_TEMPLATE', 'publication evidence current status');
requirePhrase(evidenceStatus, 'reviewer category selection intake | PENDING_FOUNDER_CATEGORY_SELECTION', 'publication evidence current status');

for (const pattern of [
  /\breviewer category selected\b/i,
  /\breviewer packet send approved\b/i,
  /\breviewer outreach approved\b/i,
  /\bprovider outreach approved\b/i,
  /\blegal review complete\b/i,
  /\bprovider review complete\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blive action approved\b/i,
  /\bpartnership approved\b/i,
]) {
  rejectPattern(intake, pattern, 'reviewer category selection intake template');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Reviewer Category Selection Intake Template') || content.includes('PENDING_CATEGORY_SELECTION')) {
    errors.push(`${label} appears to contain internal reviewer category selection intake content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 reviewer category selection intake validation passed');
