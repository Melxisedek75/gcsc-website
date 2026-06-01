import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  register: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  screenshotManifest: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-manifest.md'),
  visualTemplate: path.join(root, 'docs', 'whitepaper-v1-3-visual-qa-evidence-template.md'),
  wordingScan: path.join(root, 'docs', 'whitepaper-v1-3-public-wording-scan-current-status.md'),
  publicDraft: path.join(root, 'docs', 'whitepaper-v1-3-public-draft.md'),
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

const register = readRequired('draft QA issue register', files.register);
const screenshotManifest = readRequired('screenshot evidence manifest', files.screenshotManifest);
const visualTemplate = readRequired('visual QA evidence template', files.visualTemplate);
const wordingScan = readRequired('public wording scan status', files.wordingScan);
const publicDraft = readRequired('public draft narrative', files.publicDraft);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal draft QA issue register',
  'Current publication decision remains NO-GO',
  'Issue Severity',
  'Issue Categories',
  'Issue Register Template',
  'Resolution Rules',
  'Safe Status Values',
  'Stop Boundary',
  'V13-QA-001',
  'HOLD_NO_PUBLIC_USE',
]) {
  requirePhrase(register, phrase, 'draft QA issue register');
}

for (const severity of [
  'BLOCKER',
  'HIGH',
  'MEDIUM',
  'LOW',
]) {
  requirePhrase(register, severity, 'draft QA issue register');
}

for (const category of [
  'visual overlap',
  'mobile overflow',
  'unclear NO-GO boundary',
  'risky finance wording',
  'risky escrow wording',
  'risky Web3 wording',
  'risky partner wording',
  'private-data exposure',
  'missing provider-review context',
]) {
  requirePhrase(register, category, 'draft QA issue register');
}

requirePhrase(screenshotManifest, 'Screenshot Evidence Manifest', 'screenshot evidence manifest');
requirePhrase(visualTemplate, 'Required Before Public Use', 'visual QA evidence template');
requirePhrase(wordingScan, 'Current Public File Boundary', 'public wording scan status');
requirePhrase(publicDraft, 'internal public-safe draft', 'public draft narrative');

const blockedApprovalPatterns = [
  /\bpublic approval\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\bfounder approval recorded\b/i,
  /\blegal approval recorded\b/i,
  /\bprovider approval recorded\b/i,
  /\bscreenshot approval recorded\b/i,
  /\blive action approved\b/i,
  /\bpartnership approved\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(register)) {
    errors.push(`draft QA issue register contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Draft QA Issue Register') || content.includes('V13-QA-001')) {
    errors.push(`${label} appears to contain internal draft QA issue register content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 draft QA issue register validation passed');
