import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  checklist: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-send-readiness-checklist.md'),
  reviewerRouting: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-routing-index.md'),
  reviewerPacketStatusRollup: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-status-rollup.md'),
  categorySelection: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-category-selection-intake-template.md'),
  reviewerRedaction: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-redaction-checklist.md'),
  externalReviewerCoverSheet: path.join(root, 'docs', 'whitepaper-v1-3-external-reviewer-cover-sheet.md'),
  reviewerEvidenceAppendix: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-evidence-appendix.md'),
  reviewerResponseIntake: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-intake-template.md'),
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

const checklist = readRequired('reviewer packet send readiness checklist', files.checklist);
const reviewerRouting = readRequired('reviewer routing index', files.reviewerRouting);
const reviewerPacketStatusRollup = readRequired('reviewer packet status rollup', files.reviewerPacketStatusRollup);
const categorySelection = readRequired('reviewer category selection intake template', files.categorySelection);
const reviewerRedaction = readRequired('reviewer packet redaction checklist', files.reviewerRedaction);
const externalReviewerCoverSheet = readRequired('external reviewer cover sheet', files.externalReviewerCoverSheet);
const reviewerEvidenceAppendix = readRequired('reviewer evidence appendix', files.reviewerEvidenceAppendix);
const reviewerResponseIntake = readRequired('reviewer response intake', files.reviewerResponseIntake);
const publicDistributionBoundaryMatrix = readRequired('public distribution boundary matrix', files.publicDistributionBoundaryMatrix);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Reviewer Packet Send Readiness Checklist',
  'No reviewer packet send is approved',
  'Reviewer Packet Send Readiness Checks',
  'PENDING_SCOPE_SELECTION',
  'PENDING_RECIPIENT_CATEGORY',
  'PENDING_REDACTION_REVIEW',
  'PENDING_EVIDENCE_APPENDIX_REVIEW',
  'PENDING_DISTRIBUTION_BOUNDARY_REVIEW',
  'PENDING_QUESTION_MAPPING',
  'PENDING_FOUNDER_SEND_DECISION',
  'BLOCKED_NO_SEND',
  'READY_LOCAL_TEMPLATE',
  'Recipient Categories',
  'NO_CONTACT_APPROVED',
  'Required Source Documents',
  'No Shortcut Rules',
  'Stop Boundary',
]) {
  requirePhrase(checklist, phrase, 'reviewer packet send readiness checklist');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-reviewer-routing-index.md',
  'docs/whitepaper-v1-3-reviewer-packet-status-rollup.md',
  'docs/whitepaper-v1-3-reviewer-category-selection-intake-template.md',
  'docs/whitepaper-v1-3-reviewer-packet-redaction-checklist.md',
  'docs/whitepaper-v1-3-external-reviewer-cover-sheet.md',
  'docs/whitepaper-v1-3-reviewer-evidence-appendix.md',
  'docs/whitepaper-v1-3-reviewer-response-intake-template.md',
  'docs/whitepaper-v1-3-public-distribution-boundary-matrix.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
]) {
  requirePhrase(checklist, fileReference, 'reviewer packet send readiness checklist');
}

requirePhrase(reviewerRouting, 'Reviewer Response Intake', 'reviewer routing index');
requirePhrase(reviewerPacketStatusRollup, 'Reviewer Packet Status Rollup', 'reviewer packet status rollup');
requirePhrase(categorySelection, 'Reviewer Category Selection Intake Template', 'reviewer category selection intake template');
requirePhrase(reviewerRedaction, 'Reviewer Packet Redaction Checklist', 'reviewer packet redaction checklist');
requirePhrase(externalReviewerCoverSheet, 'External Reviewer Cover Sheet', 'external reviewer cover sheet');
requirePhrase(reviewerEvidenceAppendix, 'Evidence Not Yet Complete', 'reviewer evidence appendix');
requirePhrase(reviewerResponseIntake, 'public publication approved? | NO by default', 'reviewer response intake');
requirePhrase(publicDistributionBoundaryMatrix, 'BLOCKED_FOUNDER_CONTROLLED_SEND', 'public distribution boundary matrix');
requirePhrase(evidenceStatus, 'reviewer packet send approval | PENDING', 'publication evidence current status');

for (const pattern of [
  /\breviewer packet send approved\b/i,
  /\breviewer outreach approved\b/i,
  /\bprovider outreach approved\b/i,
  /\blegal review complete\b/i,
  /\bprovider review complete\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blive action approved\b/i,
]) {
  rejectPattern(checklist, pattern, 'reviewer packet send readiness checklist');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Reviewer Packet Send Readiness Checklist') || content.includes('BLOCKED_NO_SEND')) {
    errors.push(`${label} appears to contain internal reviewer packet send readiness checklist content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 reviewer packet send readiness checklist validation passed');
