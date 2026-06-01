import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  intake: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-intake-template.md'),
  routing: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-routing-index.md'),
  closeout: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-closeout.md'),
  evidence: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-template.md'),
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

const intake = readRequired('reviewer response intake template', files.intake);
const routing = readRequired('reviewer routing index', files.routing);
const closeout = readRequired('founder review closeout', files.closeout);
const evidence = readRequired('publication evidence template', files.evidence);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal response intake template',
  'Intake Record',
  'Required Reviewer Findings',
  'Routing Rules',
  'Safe Recording Rules',
  'Stop Boundary',
  'live action approved? | NO by default',
  'public publication approved? | NO by default',
  'HOLD / REVISE / APPROVE_PUBLIC_SAFE_WORDING / BLOCK_FOR_LIVE_USE / NO_GO',
]) {
  requirePhrase(intake, phrase, 'reviewer response intake template');
}

for (const reviewerType of [
  'attorney',
  'escrow provider',
  'lender',
  'KYC-KYB provider',
  'FIO technical reviewer',
  'XPR-WebAuth-Metal technical reviewer',
]) {
  requirePhrase(intake, reviewerType, 'reviewer response intake template');
}

requirePhrase(routing, 'Reviewer Response Intake', 'reviewer routing index');
requirePhrase(closeout, 'ROUTE_TO_REVIEWERS', 'founder review closeout');
requirePhrase(evidence, 'Legal/provider review recorded | PENDING', 'publication evidence template');

const blockedApprovalPatterns = [
  /\bresponse is approved for publication\b/i,
  /\bpublic publication approved\?\s*\|\s*YES\b/i,
  /\blive action approved\?\s*\|\s*YES\b/i,
  /\blegal conclusion recorded\b/i,
  /\bprovider commitment recorded\b/i,
  /\bpartnership approved\b/i,
  /\bproduction Web3 approved\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(intake)) {
    errors.push(`reviewer response intake template contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Reviewer Response Intake Template') || content.includes('Required Reviewer Findings')) {
    errors.push(`${label} appears to contain internal reviewer response intake content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 reviewer response intake validation passed');
