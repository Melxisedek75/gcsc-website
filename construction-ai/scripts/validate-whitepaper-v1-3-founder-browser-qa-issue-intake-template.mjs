import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  intake: path.join(root, 'docs', 'whitepaper-v1-3-founder-browser-qa-issue-intake-template.md'),
  report: path.join(root, 'docs', 'whitepaper-v1-3-founder-browser-qa-report-template.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  visualQaEvidence: path.join(root, 'docs', 'whitepaper-v1-3-visual-qa-evidence-template.md'),
  screenshotResults: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-results-template.md'),
  navigationClickResults: path.join(root, 'docs', 'whitepaper-v1-3-navigation-click-evidence-results-template.md'),
  wordingScan: path.join(root, 'docs', 'whitepaper-v1-3-public-wording-scan-current-status.md'),
  publicationGate: path.join(root, 'docs', 'whitepaper-v1-3-publication-gate.md'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
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

const intake = readRequired('founder browser QA issue intake template', files.intake);
const report = readRequired('founder browser QA report template', files.report);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const visualQaEvidence = readRequired('visual QA evidence template', files.visualQaEvidence);
const screenshotResults = readRequired('screenshot evidence results template', files.screenshotResults);
const navigationClickResults = readRequired('navigation click evidence results template', files.navigationClickResults);
const wordingScan = readRequired('public wording scan status', files.wordingScan);
const publicationGate = readRequired('publication gate', files.publicationGate);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal founder browser QA issue intake template',
  'Issue intake is EMPTY_TEMPLATE',
  'Current publication decision remains NO-GO',
  'Intake Record Template',
  'Issue Intake Rows',
  'Accepted Source Evidence',
  'Severity Routing',
  'Allowed Categories',
  'Allowed States',
  'No Approval Rule',
  'Stop Boundary',
  'V13-QA-BROWSER-001',
  'PENDING_ISSUE_ROUTING',
  'PENDING_REDACTION_REVIEW',
  'FIXED_LOCAL_RECHECK_REQUIRED',
  'HOLD_NO_PUBLIC_USE',
]) {
  requirePhrase(intake, phrase, 'founder browser QA issue intake template');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-founder-browser-qa-report-template.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-screenshot-evidence-results-template.md',
  'docs/whitepaper-v1-3-navigation-click-evidence-results-template.md',
  'docs/whitepaper-v1-3-visual-qa-evidence-template.md',
  'docs/whitepaper-v1-3-public-wording-scan-current-status.md',
  'whitepaper.html',
  'index.html',
]) {
  requirePhrase(intake, fileReference, 'founder browser QA issue intake template');
}

for (const severity of ['BLOCKER', 'HIGH', 'MEDIUM', 'LOW']) {
  requirePhrase(intake, severity, 'founder browser QA issue intake template');
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
  'broken navigation',
  'inconsistent Construction Trust Infrastructure wording',
  'missing provider-review context',
  'missing future/review-required context',
]) {
  requirePhrase(intake, category, 'founder browser QA issue intake template');
}

requirePhrase(report, 'Founder Browser QA Report Template', 'founder browser QA report template');
requirePhrase(report, 'PENDING_BROWSER_QA_REPORT', 'founder browser QA report template');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(visualQaEvidence, 'PENDING_VISUAL_QA', 'visual QA evidence template');
requirePhrase(screenshotResults, 'PENDING_CAPTURE', 'screenshot evidence results template');
requirePhrase(navigationClickResults, 'PENDING_CLICK', 'navigation click evidence results template');
requirePhrase(wordingScan, 'Public Wording Scan Current Status', 'public wording scan status');
requirePhrase(publicationGate, 'Default state: NO-GO', 'publication gate');
requirePhrase(evidenceStatus, 'Current decision: NO-GO', 'publication evidence current status');

const blockedPatterns = [
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\bprovider outreach approved\b/i,
  /\blegal\/provider clearance recorded\b/i,
  /\bscreenshot QA complete\b/i,
  /\bnavigation click QA complete\b/i,
  /\bvisual QA complete\b/i,
  /\blive action approved\b/i,
];

for (const pattern of blockedPatterns) {
  rejectPattern(intake, pattern, 'founder browser QA issue intake template');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Founder Browser QA Issue Intake Template') || content.includes('V13-QA-BROWSER-001')) {
    errors.push(`${label} appears to contain internal founder browser QA issue intake content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 founder browser QA issue intake validation passed');
