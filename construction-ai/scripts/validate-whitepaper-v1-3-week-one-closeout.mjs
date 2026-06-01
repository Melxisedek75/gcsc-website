import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  closeout: path.join(root, 'docs', 'whitepaper-v1-3-week-one-closeout-2026-06-06.md'),
  twoWeekPlan: path.join(root, 'docs', 'superpowers', 'plans', '2026-05-31-gcsc-two-week-autonomous-implementation.md'),
  publicationGate: path.join(root, 'docs', 'whitepaper-v1-3-publication-gate.md'),
  masterIndex: path.join(root, 'docs', 'whitepaper-v1-3-internal-review-master-index.md'),
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

const closeout = readRequired('week-one closeout', files.closeout);
const twoWeekPlan = readRequired('two-week plan', files.twoWeekPlan);
const publicationGate = readRequired('publication gate', files.publicationGate);
const masterIndex = readRequired('internal review master index', files.masterIndex);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: in-progress week-one closeout draft',
  'Completed Safe Tasks',
  'Validators Run',
  'Current Decision State',
  'Public / Live / Legal / Provider / Money / Web3 Blockers',
  'Week-One Remaining Safe Tasks',
  'Stop Boundary',
  'public `whitepaper.html` replacement | NO-GO',
  'public `index.html` replacement | NO-GO',
]) {
  requirePhrase(closeout, phrase, 'week-one closeout');
}

for (const commitId of [
  'd130151c',
  'ddd0edbd',
  '7df58079',
  '28460a4e',
  'cd3f4b55',
  '8ac3d719',
  '47da9fb1',
  '37f5ed46',
  'd66a6a62',
  'd81ca352',
  '9a397a17',
  '6f1b3509',
  '26eef11e',
  'ea7f0614',
  '6473e9ef',
  '3e13e98c',
  '2fc2b008',
  'bb02e686',
  '25a1c52f',
]) {
  requirePhrase(closeout, commitId, 'week-one closeout');
}

for (const checkName of [
  'npm run check:whitepaper-v1-3-plan',
  'npm run check:whitepaper-v1-3-draft-html-smoke',
  'npm run check:whitepaper-v1-3-draft-css-qa',
  'npm run check:whitepaper-v1-3-screenshot-evidence-manifest',
  'npm run check:whitepaper-v1-3-screenshot-evidence-intake',
  'npm run check:whitepaper-v1-3-local-draft-qa-readiness',
  'npm run check:whitepaper-v1-3-publication-evidence-current-status',
  'npm run check:whitepaper-v1-3-publication-blocker-status-matrix',
  'npm run check:whitepaper-v1-3-founder-ready-packet-status-rollup',
  'npm run check:whitepaper-v1-3-reviewer-packet-status-rollup',
  'npm run check:whitepaper-v1-3-external-reviewer-cover-sheet',
  'npm run check:ci-workflow',
]) {
  requirePhrase(closeout, checkName, 'week-one closeout');
}

requirePhrase(twoWeekPlan, 'Week 1: 2026-05-31 To 2026-06-06', 'two-week plan');
requirePhrase(publicationGate, 'Default state: NO-GO', 'publication gate');
requirePhrase(masterIndex, 'Current Decision State', 'internal review master index');

const blockedApprovalPatterns = [
  /\bfinal week-one approval\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blegal approval recorded\b/i,
  /\bprovider approval recorded\b/i,
  /\blive action approved\b/i,
  /\bGO for publication\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(closeout)) {
    errors.push(`week-one closeout contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Week-One Closeout') || content.includes('Completed Safe Tasks')) {
    errors.push(`${label} appears to contain internal closeout content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 week-one closeout validation passed');
