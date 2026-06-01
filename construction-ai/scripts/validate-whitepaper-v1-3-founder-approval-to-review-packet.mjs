import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  packet: path.join(root, 'docs', 'whitepaper-v1-3-founder-approval-to-review-packet.md'),
  founderCloseout: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-closeout.md'),
  founderDecisionIntake: path.join(root, 'docs', 'whitepaper-v1-3-founder-decision-intake-template.md'),
  blockerMatrix: path.join(root, 'docs', 'whitepaper-v1-3-publication-blocker-status-matrix.md'),
  publicationGate: path.join(root, 'docs', 'whitepaper-v1-3-publication-gate.md'),
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

const packet = readRequired('founder approval-to-review packet', files.packet);
const founderCloseout = readRequired('founder review closeout', files.founderCloseout);
const founderDecisionIntake = readRequired('founder decision intake template', files.founderDecisionIntake);
const blockerMatrix = readRequired('publication blocker status matrix', files.blockerMatrix);
const publicationGate = readRequired('publication gate', files.publicationGate);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal founder decision packet',
  'Default state: NO-GO',
  'MOVE_TO_REVIEW_FOR_LOCAL_POLISH_ONLY',
  'V1_3_LOCAL_REVIEW_APPROVED',
  'What Founder Is Approving',
  'What Remains NO-GO',
  'Exact Founder Approval Phrase',
  'This phrase does not approve public publication or live integrations',
  'If Founder Does Nothing',
  'Status remains NO-GO for public publication',
  'Stop Boundary',
]) {
  requirePhrase(packet, phrase, 'founder approval-to-review packet');
}

for (const phrase of [
  'replace `whitepaper.html`',
  'editing `index.html`',
  'provider commitments',
  'live payments',
  'live loans',
  'escrow',
  'stablecoin settlement',
  'token collateral',
  'FIO actions',
  'Metallicus partnership claims',
  'XPR signatures',
]) {
  requirePhrase(packet, phrase, 'founder approval-to-review packet');
}

requirePhrase(founderCloseout, 'Founder Decision Choices', 'founder review closeout');
requirePhrase(founderDecisionIntake, 'public publication approved? | NO by default', 'founder decision intake template');
requirePhrase(blockerMatrix, 'Current publication decision remains NO-GO', 'publication blocker status matrix');
requirePhrase(publicationGate, 'Default state: NO-GO', 'publication gate');

const blockedPatterns = [
  /\bPUBLICATION_GO\b/i,
  /\bPUBLIC_FILE_REPLACEMENT_GO\b/i,
  /\bLIVE_PROVIDER_OUTREACH_GO\b/i,
  /\bLIVE_FINANCE_WEB3_GO\b/i,
  /\bpublic publication \| GO\b/i,
  /\bpublic replacement \| GO\b/i,
  /\blive action \| GO\b/i,
  /\blegal\/provider review \| COMPLETE\b/i,
  /\bprovider commitment recorded\b/i,
  /\bpartnership commitment recorded\b/i,
];

for (const pattern of blockedPatterns) {
  if (pattern.test(packet)) {
    errors.push(`founder approval-to-review packet contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('V1_3_LOCAL_REVIEW_APPROVED') || content.includes('Founder Approval To Review Packet')) {
    errors.push(`${label} appears to contain internal founder approval-to-review packet content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 founder approval-to-review packet validation passed');
