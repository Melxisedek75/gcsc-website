import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  closeout: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-closeout.md'),
  founderPacket: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-packet.md'),
  claimHardening: path.join(root, 'docs', 'whitepaper-v1-3-claim-risk-hardening-checklist.md'),
  dryRun: path.join(root, 'docs', 'whitepaper-v1-3-publication-readiness-dry-run.md'),
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

const closeout = readRequired('founder review closeout', files.closeout);
const founderPacket = readRequired('founder review packet', files.founderPacket);
const claimHardening = readRequired('claim hardening checklist', files.claimHardening);
const dryRun = readRequired('publication readiness dry run', files.dryRun);
const publicationGate = readRequired('publication gate', files.publicationGate);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Founder Decision Choices',
  'Current Packet State',
  'Recommended current decision',
  'What Can Continue Autonomously',
  'What Remains NO-GO',
  'Founder Review Route',
  'Safe Next Actions',
  'APPROVE_LOCAL_DIRECTION',
  'ROUTE_TO_REVIEWERS',
  'public publication NO-GO',
  'This does not approve public publication',
]) {
  requirePhrase(closeout, phrase, 'founder review closeout');
}

for (const phrase of [
  'Construction Trust Infrastructure first',
  'Founder Review Questions',
]) {
  requirePhrase(founderPacket, phrase, 'founder review packet');
}

for (const phrase of [
  'Hard Block List',
  'Publication Stop Rule',
]) {
  requirePhrase(claimHardening, phrase, 'claim hardening checklist');
}

requirePhrase(dryRun, 'Current result: NO-GO', 'publication readiness dry run');
requirePhrase(publicationGate, 'Default state: NO-GO', 'publication gate');

const disallowedCloseoutPatterns = [
  /\bpublic publication is approved\b/i,
  /\bwebsite replacement is approved\b/i,
  /\blegal approval recorded\b/i,
  /\bprovider approval recorded\b/i,
  /\bpartnership approved\b/i,
  /\blive loans approved\b/i,
  /\blive escrow approved\b/i,
  /\bstablecoin settlement approved\b/i,
  /\btoken collateral approved\b/i,
  /\bFIO registrations approved\b/i,
  /\bwallet signatures approved\b/i,
];

for (const pattern of disallowedCloseoutPatterns) {
  if (pattern.test(closeout)) {
    errors.push(`founder review closeout contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Founder Decision Choices') || content.includes('APPROVE_LOCAL_DIRECTION')) {
    errors.push(`${label} appears to contain internal founder closeout content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 founder review closeout validation passed');
