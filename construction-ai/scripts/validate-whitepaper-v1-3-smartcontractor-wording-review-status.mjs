import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  status: path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-wording-review-status.md'),
  alignment: path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-wording-alignment.md'),
  evidenceLog: path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-wording-evidence-log.md'),
  wordingScan: path.join(root, 'docs', 'whitepaper-v1-3-public-wording-scan-current-status.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  reviewerSummary: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-summary-shell.md'),
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

const status = readRequired('SmartContractor wording review status', files.status);
const alignment = readRequired('SmartContractor wording alignment', files.alignment);
const evidenceLog = readRequired('SmartContractor wording evidence log', files.evidenceLog);
const wordingScan = readRequired('public wording scan status', files.wordingScan);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const reviewerSummary = readRequired('reviewer response summary shell', files.reviewerSummary);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal SmartContractor wording review status',
  'Current publication decision remains NO-GO',
  'Alignment Source',
  'Required Product Position',
  'Product Copy Boundaries',
  'Current Allowed Local Product Claims',
  'Current Blocked Product Claims',
  'Review Status',
  'Stop Boundary',
  'docs/whitepaper-v1-3-smartcontractor-wording-evidence-log.md',
  'SmartContractor wording evidence log | LOCAL_LOG_READY_NO_GO',
  'publication decision | NO-GO',
]) {
  requirePhrase(status, phrase, 'SmartContractor wording review status');
}

for (const phrase of [
  'construction workflow software',
  'partner-reviewed working-capital readiness layer',
  'escrow-ready milestone record layer',
  'future regulated Web3 record layer after review',
  'blocked until founder/legal/provider approval',
]) {
  requirePhrase(status, phrase, 'SmartContractor wording review status');
}

requirePhrase(alignment, 'Product Copy Rule', 'SmartContractor wording alignment');
requirePhrase(evidenceLog, 'SmartContractor Wording Evidence Log', 'SmartContractor wording evidence log');
requirePhrase(evidenceLog, 'SMARTCONTRACTOR_DEMO_ONLY_SCAN', 'SmartContractor wording evidence log');
requirePhrase(wordingScan, 'Current Public File Boundary', 'public wording scan status');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(reviewerSummary, 'Reviewer Response Summary Shell', 'reviewer response summary shell');

const blockedPatterns = [
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\bSmartContractor production release approved\b/i,
  /\bfounder clearance recorded\b/i,
  /\blegal clearance recorded\b/i,
  /\bprovider clearance recorded\b/i,
  /\blive-action clearance recorded\b/i,
  /\bpartnership approved\b/i,
  /\blive action approved\b/i,
];

for (const pattern of blockedPatterns) {
  if (pattern.test(status)) {
    errors.push(`SmartContractor wording review status contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('SmartContractor Wording Review Status') || content.includes('Current Allowed Local Product Claims')) {
    errors.push(`${label} appears to contain internal SmartContractor wording review status content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 SmartContractor wording review status validation passed');
