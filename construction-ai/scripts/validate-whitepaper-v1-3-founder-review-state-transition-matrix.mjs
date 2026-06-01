import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  matrix: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-state-transition-matrix.md'),
  approvalPacket: path.join(root, 'docs', 'whitepaper-v1-3-founder-approval-to-review-packet.md'),
  decisionIntake: path.join(root, 'docs', 'whitepaper-v1-3-founder-decision-intake-template.md'),
  founderCloseout: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-closeout.md'),
  blockerMatrix: path.join(root, 'docs', 'whitepaper-v1-3-publication-blocker-status-matrix.md'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  reviewerRouting: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-routing-index.md'),
  reviewerCoverSheet: path.join(root, 'docs', 'whitepaper-v1-3-external-reviewer-cover-sheet.md'),
  reviewerIntake: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-intake-template.md'),
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

const matrix = readRequired('founder review state transition matrix', files.matrix);
const approvalPacket = readRequired('founder approval-to-review packet', files.approvalPacket);
const decisionIntake = readRequired('founder decision intake template', files.decisionIntake);
const founderCloseout = readRequired('founder review closeout', files.founderCloseout);
const blockerMatrix = readRequired('publication blocker status matrix', files.blockerMatrix);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const reviewerRouting = readRequired('reviewer routing index', files.reviewerRouting);
const reviewerCoverSheet = readRequired('external reviewer cover sheet', files.reviewerCoverSheet);
const reviewerIntake = readRequired('reviewer response intake template', files.reviewerIntake);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal founder review state transition matrix',
  'Current publication decision remains NO-GO',
  'State Matrix',
  'Allowed Transitions',
  'Disallowed Transitions',
  'Evidence Freshness Rules',
  'Linked Controls',
  'Stop Boundary',
  'NO_GO_PUBLICATION_DEFAULT',
  'LOCAL_REVIEW_REQUESTED',
  'LOCAL_REVIEW_ACTIVE',
  'REVISION_REQUESTED',
  'REVIEWER_ROUTING_READY',
  'REVIEWER_PACKET_PREPARED',
  'PUBLICATION_GO_RECORD_REQUIRED',
  'LIVE_ACTION_AUTH_REQUIRED',
  'V1_3_LOCAL_REVIEW_APPROVED',
  'HOLD_FOR_CLARIFICATION',
]) {
  requirePhrase(matrix, phrase, 'founder review state transition matrix');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-founder-approval-to-review-packet.md',
  'docs/whitepaper-v1-3-founder-decision-intake-template.md',
  'docs/whitepaper-v1-3-founder-review-closeout.md',
  'docs/whitepaper-v1-3-publication-blocker-status-matrix.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-reviewer-routing-index.md',
  'docs/whitepaper-v1-3-external-reviewer-cover-sheet.md',
  'docs/whitepaper-v1-3-reviewer-response-intake-template.md',
]) {
  requirePhrase(matrix, fileReference, 'founder review state transition matrix');
}

requirePhrase(approvalPacket, 'V1_3_LOCAL_REVIEW_APPROVED', 'founder approval-to-review packet');
requirePhrase(decisionIntake, 'Exact Local Review Phrase Handling', 'founder decision intake template');
requirePhrase(founderCloseout, 'Founder Decision Choices', 'founder review closeout');
requirePhrase(blockerMatrix, 'Current publication decision remains NO-GO', 'publication blocker status matrix');
requirePhrase(evidenceStatus, 'Current decision: NO-GO', 'publication evidence current status');
requirePhrase(reviewerRouting, 'Codex must not contact anyone autonomously', 'reviewer routing index');
requirePhrase(reviewerCoverSheet, 'No outreach is approved or sent', 'external reviewer cover sheet');
requirePhrase(reviewerIntake, 'public publication approved? | NO by default', 'reviewer response intake template');

const blockedPatterns = [
  /\bCurrent publication decision remains GO\b/i,
  /\bpublic publication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blegal\/provider review \| COMPLETE\b/i,
  /\bprovider outreach \| ALLOWED\b/i,
  /\blive action \| GO\b/i,
  /\bprovider commitment recorded\b/i,
  /\bpartnership commitment recorded\b/i,
  /\bPUBLICATION_GO_RECORD_REQUIRED\b[\s\S]{0,120}\bAllowed Next Step \| publish\b/i,
  /\bLIVE_ACTION_AUTH_REQUIRED\b[\s\S]{0,120}\bAllowed Next Step \| activate\b/i,
];

for (const pattern of blockedPatterns) {
  if (pattern.test(matrix)) {
    errors.push(`founder review state transition matrix contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Founder Review State Transition Matrix') || content.includes('NO_GO_PUBLICATION_DEFAULT')) {
    errors.push(`${label} appears to contain internal founder review state transition matrix content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 founder review state transition matrix validation passed');
