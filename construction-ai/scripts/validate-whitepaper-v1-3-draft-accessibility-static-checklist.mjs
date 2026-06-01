import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  checklist: path.join(root, 'docs', 'whitepaper-v1-3-draft-accessibility-static-checklist.md'),
  whitepaperDraft: path.join(root, 'whitepaper-v1-3-draft.html'),
  homepageDraft: path.join(root, 'index-v1-3-draft.html'),
  draftCss: path.join(root, 'whitepaper-v1-3-draft.css'),
  browserQaEvidenceFlow: path.join(root, 'docs', 'whitepaper-v1-3-browser-qa-evidence-flow.md'),
  visualQaEvidence: path.join(root, 'docs', 'whitepaper-v1-3-visual-qa-evidence-template.md'),
  screenshotResults: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-results-template.md'),
  navigationClickResults: path.join(root, 'docs', 'whitepaper-v1-3-navigation-click-evidence-results-template.md'),
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

function rejectPhrase(text, phrase, label) {
  if (text.includes(phrase)) {
    errors.push(`${label} contains blocked phrase: ${phrase}`);
  }
}

function rejectPattern(text, pattern, label) {
  if (pattern.test(text)) {
    errors.push(`${label} contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

function collectIds(html) {
  const ids = new Set();
  const idPattern = /\bid=["']([^"']+)["']/g;
  let match;
  while ((match = idPattern.exec(html)) !== null) {
    ids.add(match[1]);
  }
  return ids;
}

function checkAnchorsResolve(html, label) {
  const ids = collectIds(html);
  const hrefPattern = /href=["']#([^"']*)["']/g;
  let match;
  while ((match = hrefPattern.exec(html)) !== null) {
    const target = match[1];
    if (target === '') {
      continue;
    }
    if (!ids.has(target)) {
      errors.push(`${label} has broken in-page anchor: #${target}`);
    }
  }
}

function checkInteractiveText(html, label) {
  const linkPattern = /<a\b[^>]*href=["'][^"']*["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = linkPattern.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const tag = match[0];
    if (text.length === 0 && !tag.includes('href="#"')) {
      errors.push(`${label} has link without visible text`);
    }
  }

  const buttonPattern = /<button\b[^>]*>([\s\S]*?)<\/button>/gi;
  while ((match = buttonPattern.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.length === 0) {
      errors.push(`${label} has button without visible text`);
    }
  }
}

const checklist = readRequired('draft accessibility static checklist', files.checklist);
const whitepaperDraft = readRequired('whitepaper v1.3 draft HTML', files.whitepaperDraft);
const homepageDraft = readRequired('homepage v1.3 draft HTML', files.homepageDraft);
readRequired('whitepaper v1.3 draft CSS', files.draftCss);
const browserQaEvidenceFlow = readRequired('browser QA evidence flow', files.browserQaEvidenceFlow);
const visualQaEvidence = readRequired('visual QA evidence template', files.visualQaEvidence);
const screenshotResults = readRequired('screenshot evidence results template', files.screenshotResults);
const navigationClickResults = readRequired('navigation click evidence results template', files.navigationClickResults);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const publicationGate = readRequired('publication gate', files.publicationGate);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal draft accessibility static checklist',
  'Accessibility review remains PENDING_BROWSER_A11Y_REVIEW',
  'Current publication decision remains NO-GO',
  'Purpose',
  'Scope',
  'Static Checks',
  'Manual Checks Still Required',
  'Required Source Documents',
  'Stop Boundary',
  'PASS_STATIC',
  'PENDING_BROWSER_A11Y_REVIEW',
  'PENDING_SCREEN_READER_REVIEW',
  'keyboard tab order',
  'focus visibility',
  'color contrast review',
  'screen-reader landmarks and reading order',
  'mobile zoom and horizontal overflow',
  'reduced-motion behavior',
]) {
  requirePhrase(checklist, phrase, 'draft accessibility static checklist');
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
  'docs/whitepaper-v1-3-navigation-click-evidence-results-template.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-publication-gate.md',
]) {
  requirePhrase(checklist, fileReference, 'draft accessibility static checklist');
}

for (const [label, html] of [
  ['whitepaper-v1-3-draft.html', whitepaperDraft],
  ['index-v1-3-draft.html', homepageDraft],
]) {
  requirePhrase(html, '<html lang="en">', label);
  requirePhrase(html, '<meta name="viewport"', label);
  requirePhrase(html, '<title>', label);
  requirePhrase(html, 'Internal Draft - Not Approved For Publication', label);
  checkAnchorsResolve(html, label);
  checkInteractiveText(html, label);
  rejectPhrase(html, 'css/style.css', label);
  rejectPhrase(html, 'css/whitepaper.css', label);
  rejectPhrase(html, 'assets/gcsc-logo.png', label);
}

requirePhrase(homepageDraft, 'Publication Gate: NO-GO', 'index-v1-3-draft.html');
requirePhrase(browserQaEvidenceFlow, 'Browser QA Evidence Flow', 'browser QA evidence flow');
requirePhrase(browserQaEvidenceFlow, 'PENDING_FLOW', 'browser QA evidence flow');
requirePhrase(visualQaEvidence, 'PENDING_VISUAL_QA', 'visual QA evidence template');
requirePhrase(screenshotResults, 'PENDING_CAPTURE', 'screenshot evidence results template');
requirePhrase(navigationClickResults, 'PENDING_CLICK', 'navigation click evidence results template');
requirePhrase(evidenceStatus, 'Current decision: NO-GO', 'publication evidence current status');
requirePhrase(publicationGate, 'Default state: NO-GO', 'publication gate');

for (const pattern of [
  /\bCurrent decision:\s*GO\b/i,
  /\baccessibility review complete\b/i,
  /\bWCAG compliant\b/i,
  /\bbrowser QA complete\b/i,
  /\bkeyboard QA complete\b/i,
  /\bcontrast QA complete\b/i,
  /\bscreen-reader QA complete\b/i,
  /\bpublication readiness complete\b/i,
  /\bpublic replacement approved\b/i,
]) {
  rejectPattern(checklist, pattern, 'draft accessibility static checklist');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Draft Accessibility Static Checklist') || content.includes('PENDING_BROWSER_A11Y_REVIEW')) {
    errors.push(`${label} appears to contain internal draft accessibility static checklist content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 draft accessibility static checklist validation passed');
