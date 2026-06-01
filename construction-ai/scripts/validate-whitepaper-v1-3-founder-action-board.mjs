import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  actionBoard: path.join(root, 'docs', 'whitepaper-v1-3-founder-action-board.md'),
  decisionIntake: path.join(root, 'docs', 'whitepaper-v1-3-founder-decision-intake-template.md'),
  founderReadyRollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  reviewerPacketStatusRollup: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-status-rollup.md'),
  publicationBlockerMatrix: path.join(root, 'docs', 'whitepaper-v1-3-publication-blocker-status-matrix.md'),
  navigationClickResults: path.join(root, 'docs', 'whitepaper-v1-3-navigation-click-evidence-results-template.md'),
  screenshotResults: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-results-template.md'),
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

const actionBoard = readRequired('founder action board', files.actionBoard);
const decisionIntake = readRequired('founder decision intake template', files.decisionIntake);
const founderReadyRollup = readRequired('founder-ready packet status rollup', files.founderReadyRollup);
const reviewerPacketStatusRollup = readRequired('reviewer packet status rollup', files.reviewerPacketStatusRollup);
const publicationBlockerMatrix = readRequired('publication blocker matrix', files.publicationBlockerMatrix);
const navigationClickResults = readRequired('navigation click evidence results template', files.navigationClickResults);
const screenshotResults = readRequired('screenshot evidence results template', files.screenshotResults);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal founder action board',
  'Current publication decision remains NO-GO',
  'Priority Action Board',
  'Founder Inputs Still Needed',
  'Codex Safe Continuation Queue',
  'Actions Not Authorized',
  'Stop Boundary',
  'public file replacement | BLOCKED',
  'reviewer packet send | BLOCKED',
  'provider outreach | BLOCKED',
  'live finance/Web3 action | BLOCKED',
  'NO_GO_PUBLICATION_DEFAULT',
  'PENDING_CLICK',
  'PENDING_CAPTURE',
]) {
  requirePhrase(actionBoard, phrase, 'founder action board');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-founder-decision-intake-template.md',
  'whitepaper.html',
  'index.html',
]) {
  requirePhrase(actionBoard, fileReference, 'founder action board');
}

requirePhrase(decisionIntake, 'No founder decision is recorded in this template yet', 'founder decision intake template');
requirePhrase(founderReadyRollup, 'Current publication decision remains NO-GO', 'founder-ready packet status rollup');
requirePhrase(reviewerPacketStatusRollup, 'No outreach is approved, sent, scheduled, or implied', 'reviewer packet status rollup');
requirePhrase(publicationBlockerMatrix, 'Current publication decision remains NO-GO', 'publication blocker matrix');
requirePhrase(navigationClickResults, 'PENDING_CLICK', 'navigation click evidence results template');
requirePhrase(screenshotResults, 'PENDING_CAPTURE', 'screenshot evidence results template');

const blockedPatterns = [
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\breviewer packet sent\b/i,
  /\bprovider outreach approved\b/i,
  /\blegal conclusion approved\b/i,
  /\blive action approved\b/i,
  /\bFIO registration approved\b/i,
  /\bXPR signature approved\b/i,
];

for (const pattern of blockedPatterns) {
  rejectPattern(actionBoard, pattern, 'founder action board');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Founder Action Board') || content.includes('Priority Action Board')) {
    errors.push(`${label} appears to contain internal founder action board content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 founder action board validation passed');
