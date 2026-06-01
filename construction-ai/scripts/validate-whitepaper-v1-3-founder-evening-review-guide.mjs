import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  guide: path.join(root, 'docs', 'whitepaper-v1-3-founder-evening-review-guide.md'),
  actionBoard: path.join(root, 'docs', 'whitepaper-v1-3-founder-action-board.md'),
  founderCloseout: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-closeout.md'),
  founderReadyRollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  reviewerPacketStatusRollup: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-status-rollup.md'),
  publicationBlockerMatrix: path.join(root, 'docs', 'whitepaper-v1-3-publication-blocker-status-matrix.md'),
  decisionIntake: path.join(root, 'docs', 'whitepaper-v1-3-founder-decision-intake-template.md'),
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

const guide = readRequired('founder evening review guide', files.guide);
const actionBoard = readRequired('founder action board', files.actionBoard);
const founderCloseout = readRequired('founder review closeout', files.founderCloseout);
const founderReadyRollup = readRequired('founder-ready packet status rollup', files.founderReadyRollup);
const reviewerPacketStatusRollup = readRequired('reviewer packet status rollup', files.reviewerPacketStatusRollup);
const publicationBlockerMatrix = readRequired('publication blocker matrix', files.publicationBlockerMatrix);
const decisionIntake = readRequired('founder decision intake template', files.decisionIntake);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal founder evening review guide',
  'Current publication decision remains NO-GO',
  '15-Minute Review Order',
  'Decisions The Founder Can Make Tonight',
  'Exact Phrase For Local Review Only',
  'V1_3_LOCAL_REVIEW_APPROVED',
  'Evidence Still Missing',
  'Safe Report-Back Format',
  'Stop Boundary',
  'PENDING_CLICK',
  'PENDING_CAPTURE',
  'NO_GO_PUBLICATION_DEFAULT',
]) {
  requirePhrase(guide, phrase, 'founder evening review guide');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-founder-action-board.md',
  'docs/whitepaper-v1-3-founder-review-closeout.md',
  'docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md',
  'docs/whitepaper-v1-3-reviewer-packet-status-rollup.md',
  'docs/whitepaper-v1-3-publication-blocker-status-matrix.md',
  'docs/whitepaper-v1-3-founder-decision-intake-template.md',
]) {
  requirePhrase(guide, fileReference, 'founder evening review guide');
}

requirePhrase(actionBoard, 'Founder Action Board', 'founder action board');
requirePhrase(actionBoard, 'Founder Inputs Still Needed', 'founder action board');
requirePhrase(founderCloseout, 'Founder Decision Choices', 'founder review closeout');
requirePhrase(founderReadyRollup, 'Current publication decision remains NO-GO', 'founder-ready packet status rollup');
requirePhrase(reviewerPacketStatusRollup, 'No outreach is approved, sent, scheduled, or implied', 'reviewer packet status rollup');
requirePhrase(publicationBlockerMatrix, 'Current publication decision remains NO-GO', 'publication blocker matrix');
requirePhrase(decisionIntake, 'No founder decision is recorded in this template yet', 'founder decision intake template');

const blockedPatterns = [
  /\bpublication is approved\b/i,
  /\bpublic replacement is approved\b/i,
  /\breviewer packet is sent\b/i,
  /\bprovider outreach is approved\b/i,
  /\blegal conclusion is approved\b/i,
  /\blive action is approved\b/i,
  /\bFIO registration is approved\b/i,
  /\bXPR signature is approved\b/i,
];

for (const pattern of blockedPatterns) {
  rejectPattern(guide, pattern, 'founder evening review guide');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Founder Evening Review Guide') || content.includes('15-Minute Review Order')) {
    errors.push(`${label} appears to contain internal founder evening review guide content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 founder evening review guide validation passed');
