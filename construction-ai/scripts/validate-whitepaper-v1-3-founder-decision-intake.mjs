import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  intake: path.join(root, 'docs', 'whitepaper-v1-3-founder-decision-intake-template.md'),
  founderCloseout: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-closeout.md'),
  masterIndex: path.join(root, 'docs', 'whitepaper-v1-3-internal-review-master-index.md'),
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

const intake = readRequired('founder decision intake template', files.intake);
const founderCloseout = readRequired('founder review closeout', files.founderCloseout);
const masterIndex = readRequired('internal review master index', files.masterIndex);
const publicationGate = readRequired('publication gate', files.publicationGate);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal founder decision intake template',
  'Decision Record',
  'Decision Meaning',
  'Required Separate Approvals',
  'Safe Intake Rules',
  'Stop Boundary',
  'HOLD / REVISE / APPROVE_LOCAL_DIRECTION / ROUTE_TO_REVIEWERS / PREPARE_PUBLICATION_LATER',
  'public publication approved? | NO by default',
  'public file replacement approved? | NO by default',
  'live action approved? | NO by default',
]) {
  requirePhrase(intake, phrase, 'founder decision intake template');
}

for (const decision of [
  'HOLD',
  'REVISE',
  'APPROVE_LOCAL_DIRECTION',
  'ROUTE_TO_REVIEWERS',
  'PREPARE_PUBLICATION_LATER',
]) {
  requirePhrase(intake, decision, 'founder decision intake template');
  requirePhrase(founderCloseout, decision, 'founder review closeout');
}

requirePhrase(masterIndex, 'Founder Review Output', 'internal review master index');
requirePhrase(publicationGate, 'Default state: NO-GO', 'publication gate');

const blockedApprovalPatterns = [
  /\bpublic publication approved\?\s*\|\s*YES\b/i,
  /\bpublic file replacement approved\?\s*\|\s*YES\b/i,
  /\blive action approved\?\s*\|\s*YES\b/i,
  /\bautonomous outreach approved\b/i,
  /\blegal conclusion approved\b/i,
  /\bprovider commitment approved\b/i,
  /\bproduction Web3 approved\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(intake)) {
    errors.push(`founder decision intake template contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Founder Decision Intake Template') || content.includes('Decision Meaning')) {
    errors.push(`${label} appears to contain internal founder decision intake content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 founder decision intake validation passed');
