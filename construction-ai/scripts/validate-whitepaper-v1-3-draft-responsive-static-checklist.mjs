import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  checklist: path.join(root, 'docs', 'whitepaper-v1-3-draft-responsive-static-checklist.md'),
  whitepaperDraft: path.join(root, 'whitepaper-v1-3-draft.html'),
  homepageDraft: path.join(root, 'index-v1-3-draft.html'),
  draftCss: path.join(root, 'whitepaper-v1-3-draft.css'),
  browserQaEvidenceFlow: path.join(root, 'docs', 'whitepaper-v1-3-browser-qa-evidence-flow.md'),
  visualQaEvidence: path.join(root, 'docs', 'whitepaper-v1-3-visual-qa-evidence-template.md'),
  screenshotResults: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-results-template.md'),
  localBrowserReviewNotes: path.join(root, 'docs', 'whitepaper-v1-3-local-browser-review-notes.md'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
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

function rejectPattern(text, pattern, label) {
  if (pattern.test(text)) {
    errors.push(`${label} contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

const checklist = readRequired('draft responsive static checklist', files.checklist);
const whitepaperDraft = readRequired('whitepaper v1.3 draft HTML', files.whitepaperDraft);
const homepageDraft = readRequired('homepage v1.3 draft HTML', files.homepageDraft);
const draftCss = readRequired('whitepaper v1.3 draft CSS', files.draftCss);
const browserQaEvidenceFlow = readRequired('browser QA evidence flow', files.browserQaEvidenceFlow);
const visualQaEvidence = readRequired('visual QA evidence template', files.visualQaEvidence);
const screenshotResults = readRequired('screenshot evidence results template', files.screenshotResults);
const localBrowserReviewNotes = readRequired('local browser review notes', files.localBrowserReviewNotes);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const publicationGate = readRequired('publication gate', files.publicationGate);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal draft responsive static checklist',
  'Responsive browser QA remains PENDING_RESPONSIVE_BROWSER_REVIEW',
  'Current publication decision remains NO-GO',
  'Purpose',
  'Scope',
  'Static Checks',
  'Manual Checks Still Required',
  'Required Source Documents',
  'Stop Boundary',
  'PASS_STATIC',
  'PENDING_RESPONSIVE_BROWSER_REVIEW',
  'PENDING_MOBILE_MANUAL_REVIEW',
  'viewport meta present',
  'horizontal overflow guard present',
  'media can shrink',
  'text can wrap',
  'whitepaper layout collapses below tablet width',
  'mobile buttons avoid narrow inline squeeze',
  'tables have small-screen overflow handling',
  'homepage responsive utilities are present',
]) {
  requirePhrase(checklist, phrase, 'draft responsive static checklist');
}

for (const fileReference of [
  'whitepaper-v1-3-draft.html',
  'index-v1-3-draft.html',
  'whitepaper-v1-3-draft.css',
  'whitepaper.html',
  'index.html',
  'docs/whitepaper-v1-3-browser-qa-evidence-flow.md',
  'docs/whitepaper-v1-3-visual-qa-evidence-template.md',
  'docs/whitepaper-v1-3-screenshot-evidence-results-template.md',
  'docs/whitepaper-v1-3-local-browser-review-notes.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-publication-gate.md',
]) {
  requirePhrase(checklist, fileReference, 'draft responsive static checklist');
}

for (const [label, html] of [
  ['whitepaper-v1-3-draft.html', whitepaperDraft],
  ['index-v1-3-draft.html', homepageDraft],
]) {
  requirePhrase(html, '<meta name="viewport"', label);
  requirePhrase(html, 'Internal Draft - Not Approved For Publication', label);
}

for (const phrase of [
  'overflow-x: hidden',
  'max-width: 100%;',
  'height: auto;',
  'overflow-wrap: anywhere',
  'grid-template-columns: 280px minmax(0, 1fr);',
  '@media (max-width: 920px)',
  '@media (max-width: 520px)',
  '.wp-layout',
  '.wp-grid',
  '.wp-table',
  'overflow-x: auto;',
  '.btn',
  'width: 100%;',
]) {
  requirePhrase(draftCss, phrase, 'whitepaper v1.3 draft CSS');
}

for (const phrase of [
  'img,',
  'svg,',
  'video {',
]) {
  requirePhrase(draftCss, phrase, 'whitepaper v1.3 draft CSS media selector');
}

for (const phrase of [
  'overflow-x-hidden',
  'md:grid-cols-2',
  'md:grid-cols-3',
  'hidden md:flex',
  'hidden md:block',
  'max-w-6xl',
  'flex-wrap',
  'Publication Gate: NO-GO',
]) {
  requirePhrase(homepageDraft, phrase, 'index-v1-3-draft.html');
}

requirePhrase(browserQaEvidenceFlow, 'Browser QA Evidence Flow', 'browser QA evidence flow');
requirePhrase(browserQaEvidenceFlow, 'PENDING_FLOW', 'browser QA evidence flow');
requirePhrase(visualQaEvidence, 'PENDING_VISUAL_QA', 'visual QA evidence template');
requirePhrase(screenshotResults, 'PENDING_CAPTURE', 'screenshot evidence results template');
requirePhrase(localBrowserReviewNotes, 'Browser Screenshot QA Still Required', 'local browser review notes');
requirePhrase(evidenceStatus, 'Current decision: NO-GO', 'publication evidence current status');
requirePhrase(publicationGate, 'Default state: NO-GO', 'publication gate');

for (const pattern of [
  /\bCurrent decision:\s*GO\b/i,
  /\bresponsive QA complete\b/i,
  /\bmobile QA complete\b/i,
  /\bbrowser responsive review complete\b/i,
  /\bscreenshot QA complete\b/i,
  /\bpublication readiness complete\b/i,
  /\bpublic replacement approved\b/i,
]) {
  rejectPattern(checklist, pattern, 'draft responsive static checklist');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Draft Responsive Static Checklist') || content.includes('PENDING_RESPONSIVE_BROWSER_REVIEW')) {
    errors.push(`${label} appears to contain internal draft responsive static checklist content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 draft responsive static checklist validation passed');
