import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  checklist: path.join(root, 'docs', 'whitepaper-v1-3-draft-print-pdf-export-static-checklist.md'),
  finalChecklist: path.join(root, 'docs', 'whitepaper-v1-3-final-publication-checklist.md'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  founderReadyRollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  masterIndex: path.join(root, 'docs', 'whitepaper-v1-3-internal-review-master-index.md'),
  visualQaEvidence: path.join(root, 'docs', 'whitepaper-v1-3-visual-qa-evidence-template.md'),
  screenshotResults: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-results-template.md'),
  browserQaEvidenceFlow: path.join(root, 'docs', 'whitepaper-v1-3-browser-qa-evidence-flow.md'),
  publicationGate: path.join(root, 'docs', 'whitepaper-v1-3-publication-gate.md'),
  whitepaperDraft: path.join(root, 'whitepaper-v1-3-draft.html'),
  draftCss: path.join(root, 'whitepaper-v1-3-draft.css'),
  homepageDraft: path.join(root, 'index-v1-3-draft.html'),
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

const checklist = readRequired('draft print/PDF export static checklist', files.checklist);
const finalChecklist = readRequired('final publication checklist', files.finalChecklist);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const founderReadyRollup = readRequired('founder-ready packet status rollup', files.founderReadyRollup);
const masterIndex = readRequired('internal review master index', files.masterIndex);
const visualQaEvidence = readRequired('visual QA evidence template', files.visualQaEvidence);
const screenshotResults = readRequired('screenshot evidence results template', files.screenshotResults);
const browserQaEvidenceFlow = readRequired('browser QA evidence flow', files.browserQaEvidenceFlow);
const publicationGate = readRequired('publication gate', files.publicationGate);
const whitepaperDraft = readRequired('whitepaper draft HTML', files.whitepaperDraft);
const draftCss = readRequired('draft CSS', files.draftCss);
const homepageDraft = readRequired('homepage draft HTML', files.homepageDraft);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Draft Print PDF Export Static Checklist',
  'PENDING_PRINT_PDF_EXPORT_REVIEW',
  'PENDING_PRINT_PREVIEW_REVIEW',
  'PENDING_LAYOUT_REVIEW',
  'PENDING_EXPORT_METADATA_REVIEW',
  'PENDING_REDACTION_REVIEW',
  'HOLD_NO_PUBLIC_USE',
  'Static Print And Export Checks',
  'Allowed Future States',
  'Future Export Evidence Template',
  'Required Source Documents',
  'No Shortcut Rules',
  'Stop Boundary',
]) {
  requirePhrase(checklist, phrase, 'draft print/PDF export static checklist');
}

for (const fileReference of [
  'whitepaper-v1-3-draft.html',
  'whitepaper-v1-3-draft.css',
  'index-v1-3-draft.html',
  'whitepaper.html',
  'index.html',
  'docs/whitepaper-v1-3-final-publication-checklist.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md',
  'docs/whitepaper-v1-3-internal-review-master-index.md',
  'docs/whitepaper-v1-3-visual-qa-evidence-template.md',
  'docs/whitepaper-v1-3-screenshot-evidence-results-template.md',
  'docs/whitepaper-v1-3-browser-qa-evidence-flow.md',
  'docs/whitepaper-v1-3-publication-gate.md',
]) {
  requirePhrase(checklist, fileReference, 'draft print/PDF export static checklist');
}

requirePhrase(finalChecklist, 'Required Before GO', 'final publication checklist');
requirePhrase(evidenceStatus, 'Current decision: NO-GO', 'publication evidence current status');
requirePhrase(founderReadyRollup, 'Current publication decision remains NO-GO', 'founder-ready packet status rollup');
requirePhrase(masterIndex, 'Current Decision State', 'internal review master index');
requirePhrase(visualQaEvidence, 'PENDING_VISUAL_QA', 'visual QA evidence template');
requirePhrase(screenshotResults, 'PENDING_CAPTURE', 'screenshot evidence results template');
requirePhrase(browserQaEvidenceFlow, 'PENDING_FLOW', 'browser QA evidence flow');
requirePhrase(publicationGate, 'Default state: NO-GO', 'publication gate');
requirePhrase(whitepaperDraft, 'Internal Draft - Not Approved For Publication', 'whitepaper draft HTML');
requirePhrase(whitepaperDraft, 'href="whitepaper-v1-3-draft.css"', 'whitepaper draft HTML');
requirePhrase(draftCss, 'body', 'draft CSS');
requirePhrase(homepageDraft, 'Publication Gate: NO-GO', 'homepage draft HTML');

for (const pattern of [
  /\bPDF published\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\bdistribution approved\b/i,
  /\bexport evidence complete\b/i,
  /\bprint review complete\b/i,
  /\blive action approved\b/i,
]) {
  rejectPattern(checklist, pattern, 'draft print/PDF export static checklist');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (
    content.includes('Draft Print PDF Export Static Checklist') ||
    content.includes('PENDING_PRINT_PDF_EXPORT_REVIEW')
  ) {
    errors.push(`${label} appears to contain internal print/PDF export checklist content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 draft print/PDF export static checklist validation passed');
