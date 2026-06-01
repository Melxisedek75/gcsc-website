import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  visualQaEvidence: path.join(root, 'docs', 'whitepaper-v1-3-visual-qa-evidence-template.md'),
  localBrowserReviewNotes: path.join(root, 'docs', 'whitepaper-v1-3-local-browser-review-notes.md'),
  screenshotHandoff: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-qa-founder-handoff.md'),
  screenshotManifest: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-manifest.md'),
  screenshotIntake: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-intake-checklist.md'),
  screenshotResults: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-results-template.md'),
  navigationClickResults: path.join(root, 'docs', 'whitepaper-v1-3-navigation-click-evidence-results-template.md'),
  blockerMatrix: path.join(root, 'docs', 'whitepaper-v1-3-publication-blocker-status-matrix.md'),
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

const visualQaEvidence = readRequired('visual QA evidence template', files.visualQaEvidence);
const localBrowserReviewNotes = readRequired('local browser review notes', files.localBrowserReviewNotes);
const screenshotHandoff = readRequired('screenshot QA founder handoff', files.screenshotHandoff);
const screenshotManifest = readRequired('screenshot evidence manifest', files.screenshotManifest);
const screenshotIntake = readRequired('screenshot evidence intake checklist', files.screenshotIntake);
const screenshotResults = readRequired('screenshot evidence results template', files.screenshotResults);
const navigationClickResults = readRequired('navigation click evidence results template', files.navigationClickResults);
const blockerMatrix = readRequired('publication blocker status matrix', files.blockerMatrix);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal visual QA evidence template',
  'Run Record Template',
  'Visual Evidence Rows Template',
  'Desktop Review',
  'Mobile Review',
  'Content Review',
  'Allowed Result States',
  'Required Before Public Use',
  'Stop Boundary',
  'PENDING_VISUAL_QA',
  'V13-VISUAL-WP-DESKTOP-01',
  'V13-VISUAL-WP-MOBILE-01',
  'V13-VISUAL-HOME-DESKTOP-01',
  'V13-VISUAL-HOME-MOBILE-01',
  'publication gate remains NO-GO',
]) {
  requirePhrase(visualQaEvidence, phrase, 'visual QA evidence template');
}

for (const phrase of [
  'Headless browser availability',
  'PENDING',
  'Browser Screenshot QA Still Required',
  'Public file replacement | BLOCKED',
  'Stop Boundary',
]) {
  requirePhrase(localBrowserReviewNotes, phrase, 'local browser review notes');
}

requirePhrase(screenshotHandoff, 'Screenshot QA is PENDING', 'screenshot QA founder handoff');
requirePhrase(screenshotHandoff, 'V13-WP-DESKTOP-01', 'screenshot QA founder handoff');
requirePhrase(screenshotManifest, 'Screenshot QA remains PENDING', 'screenshot evidence manifest');
requirePhrase(screenshotIntake, 'Screenshot QA remains PENDING', 'screenshot evidence intake checklist');
requirePhrase(screenshotResults, 'No screenshot evidence is recorded', 'screenshot evidence results template');
requirePhrase(screenshotResults, 'PENDING_CAPTURE', 'screenshot evidence results template');
requirePhrase(navigationClickResults, 'No browser click evidence is recorded', 'navigation click evidence results template');
requirePhrase(navigationClickResults, 'PENDING_CLICK', 'navigation click evidence results template');
requirePhrase(blockerMatrix, 'screenshot QA | PENDING', 'publication blocker status matrix');
requirePhrase(blockerMatrix, 'Current publication decision remains NO-GO', 'publication blocker status matrix');

const blockedApprovalPatterns = [
  /\bVISUAL_QA_COMPLETE\b/i,
  /\bSCREENSHOT_QA_COMPLETE\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\bGO for publication\b/i,
  /\bPUBLISH_NOW\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(visualQaEvidence) || pattern.test(localBrowserReviewNotes)) {
    errors.push(`visual QA evidence controls contain approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Visual QA Evidence Template') || content.includes('V13-VISUAL-WP-DESKTOP-01')) {
    errors.push(`${label} appears to contain internal visual QA evidence template content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 visual QA evidence template validation passed');
