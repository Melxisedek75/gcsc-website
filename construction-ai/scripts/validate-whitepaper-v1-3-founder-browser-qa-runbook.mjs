import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  runbook: path.join(root, 'docs', 'whitepaper-v1-3-founder-browser-qa-runbook.md'),
  visualQaEvidence: path.join(root, 'docs', 'whitepaper-v1-3-visual-qa-evidence-template.md'),
  screenshotResults: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-results-template.md'),
  navigationClickResults: path.join(root, 'docs', 'whitepaper-v1-3-navigation-click-evidence-results-template.md'),
  localBrowserReviewNotes: path.join(root, 'docs', 'whitepaper-v1-3-local-browser-review-notes.md'),
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

const runbook = readRequired('founder browser QA runbook', files.runbook);
const visualQaEvidence = readRequired('visual QA evidence template', files.visualQaEvidence);
const screenshotResults = readRequired('screenshot evidence results template', files.screenshotResults);
const navigationClickResults = readRequired('navigation click evidence results template', files.navigationClickResults);
const localBrowserReviewNotes = readRequired('local browser review notes', files.localBrowserReviewNotes);
const publicationGate = readRequired('publication gate', files.publicationGate);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal founder browser QA runbook',
  'Browser QA remains PENDING',
  'Current publication decision remains NO-GO',
  'Files To Open',
  'Founder Steps',
  'Required Evidence IDs',
  'Redaction Check',
  'Result States',
  'Stop Boundary',
  'LOCAL_DRAFT_ONLY',
  'SCAN_ONLY',
  'PENDING_CAPTURE',
  'PENDING_CLICK',
  'PENDING_VISUAL_QA',
  'PASS_LOCAL_ONLY_REVIEWED_LATER',
  'FAIL_REWORK_REQUIRED_LATER',
  'BLOCKED_REDACTION_REVIEW_LATER',
]) {
  requirePhrase(runbook, phrase, 'founder browser QA runbook');
}

for (const fileReference of [
  'whitepaper-v1-3-draft.html',
  'index-v1-3-draft.html',
  'whitepaper.html',
  'index.html',
  'docs/whitepaper-v1-3-screenshot-evidence-results-template.md',
  'docs/whitepaper-v1-3-navigation-click-evidence-results-template.md',
  'docs/whitepaper-v1-3-visual-qa-evidence-template.md',
]) {
  requirePhrase(runbook, fileReference, 'founder browser QA runbook');
}

for (const evidenceId of [
  'V13-WP-DESKTOP-01',
  'V13-WP-DESKTOP-02',
  'V13-WP-MOBILE-01',
  'V13-WP-MOBILE-02',
  'V13-HOME-DESKTOP-01',
  'V13-HOME-MOBILE-01',
  'V13-NAV-WP-01',
  'V13-NAV-WP-02',
  'V13-NAV-WP-03',
  'V13-NAV-WP-04',
  'V13-NAV-WP-05',
  'V13-NAV-WP-06',
  'V13-NAV-HOME-01',
  'V13-NAV-HOME-02',
  'V13-NAV-HOME-03',
  'V13-NAV-HOME-04',
  'V13-NAV-HOME-05',
  'V13-VISUAL-WP-DESKTOP-01',
  'V13-VISUAL-WP-DESKTOP-02',
  'V13-VISUAL-WP-MOBILE-01',
  'V13-VISUAL-WP-MOBILE-02',
  'V13-VISUAL-HOME-DESKTOP-01',
  'V13-VISUAL-HOME-MOBILE-01',
]) {
  requirePhrase(runbook, evidenceId, 'founder browser QA runbook');
}

requirePhrase(visualQaEvidence, 'PENDING_VISUAL_QA', 'visual QA evidence template');
requirePhrase(screenshotResults, 'PENDING_CAPTURE', 'screenshot evidence results template');
requirePhrase(navigationClickResults, 'PENDING_CLICK', 'navigation click evidence results template');
requirePhrase(localBrowserReviewNotes, 'Browser Screenshot QA Still Required', 'local browser review notes');
requirePhrase(publicationGate, 'Default state: NO-GO', 'publication gate');
requirePhrase(evidenceStatus, 'Current decision: NO-GO', 'publication evidence current status');

const blockedPatterns = [
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\bprovider outreach approved\b/i,
  /\blegal\/provider clearance recorded\b/i,
  /\bscreenshot QA complete\b/i,
  /\bnavigation click QA complete\b/i,
  /\blive action approved\b/i,
];

for (const pattern of blockedPatterns) {
  rejectPattern(runbook, pattern, 'founder browser QA runbook');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Founder Browser QA Runbook') || content.includes('Required Evidence IDs')) {
    errors.push(`${label} appears to contain internal founder browser QA runbook content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 founder browser QA runbook validation passed');
