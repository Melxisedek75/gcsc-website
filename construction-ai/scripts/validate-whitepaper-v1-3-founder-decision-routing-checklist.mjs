import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  checklist: path.join(root, 'docs', 'whitepaper-v1-3-founder-decision-routing-checklist.md'),
  decisionIntake: path.join(root, 'docs', 'whitepaper-v1-3-founder-decision-intake-template.md'),
  actionBoard: path.join(root, 'docs', 'whitepaper-v1-3-founder-action-board.md'),
  eveningGuide: path.join(root, 'docs', 'whitepaper-v1-3-founder-evening-review-guide.md'),
  publicationBlockerMatrix: path.join(root, 'docs', 'whitepaper-v1-3-publication-blocker-status-matrix.md'),
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

const checklist = readRequired('founder decision routing checklist', files.checklist);
const decisionIntake = readRequired('founder decision intake template', files.decisionIntake);
const actionBoard = readRequired('founder action board', files.actionBoard);
const eveningGuide = readRequired('founder evening review guide', files.eveningGuide);
const publicationBlockerMatrix = readRequired('publication blocker matrix', files.publicationBlockerMatrix);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal founder decision routing checklist',
  'No founder decision is recorded here',
  'Intake Source',
  'Routing Matrix',
  'Required Checks Before Acting',
  'Local-Only Follow-Up Queue',
  'Escalation Rules',
  'Stop Boundary',
  'public publication approved? | NO by default',
  'public file replacement approved? | NO by default',
  'live action approved? | NO by default',
  'reviewer send approved? | NO by default',
  'ROUTE_TO_REVIEWERS',
  'PREPARE_PUBLICATION_LATER',
]) {
  requirePhrase(checklist, phrase, 'founder decision routing checklist');
}

for (const blockedAction of [
  'public publication or public file replacement',
  'actual reviewer packet send',
  'provider outreach',
  'legal, securities, lending, escrow, tax, insurance, appraisal, or contractor-licensing conclusion',
  'real payment, loan, escrow, stablecoin settlement, token collateral',
  'secrets, API keys, passwords, service-role keys, private keys, seed phrases, or payment data',
]) {
  requirePhrase(checklist, blockedAction, 'founder decision routing checklist');
}

requirePhrase(decisionIntake, 'No founder decision is recorded in this template yet', 'founder decision intake template');
requirePhrase(actionBoard, 'Founder Inputs Still Needed', 'founder action board');
requirePhrase(eveningGuide, 'Safe Report-Back Format', 'founder evening review guide');
requirePhrase(publicationBlockerMatrix, 'Current publication decision remains NO-GO', 'publication blocker matrix');

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
  rejectPattern(checklist, pattern, 'founder decision routing checklist');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Founder Decision Routing Checklist') || content.includes('Routing Matrix')) {
    errors.push(`${label} appears to contain internal founder decision routing checklist content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 founder decision routing checklist validation passed');
