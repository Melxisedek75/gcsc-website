import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  matrix: path.join(root, 'docs', 'whitepaper-v1-3-public-distribution-boundary-matrix.md'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  founderReadyRollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  masterIndex: path.join(root, 'docs', 'whitepaper-v1-3-internal-review-master-index.md'),
  publicAnnouncementReview: path.join(root, 'docs', 'whitepaper-v1-3-public-announcement-review-template.md'),
  finalPublicWordingDiff: path.join(root, 'docs', 'whitepaper-v1-3-final-public-wording-diff-template.md'),
  draftPrintPdfExport: path.join(root, 'docs', 'whitepaper-v1-3-draft-print-pdf-export-static-checklist.md'),
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

const matrix = readRequired('public distribution boundary matrix', files.matrix);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const founderReadyRollup = readRequired('founder-ready packet status rollup', files.founderReadyRollup);
const masterIndex = readRequired('internal review master index', files.masterIndex);
const publicAnnouncementReview = readRequired('public announcement review template', files.publicAnnouncementReview);
const finalPublicWordingDiff = readRequired('final public wording diff template', files.finalPublicWordingDiff);
const draftPrintPdfExport = readRequired('draft print/PDF export static checklist', files.draftPrintPdfExport);
const publicationGate = readRequired('publication gate', files.publicationGate);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Public Distribution Boundary Matrix',
  'Current publication and distribution decision remains NO-GO',
  'Distribution Channel Matrix',
  'ALLOWED_LOCAL_REVIEW',
  'BLOCKED_NO_DISTRIBUTION',
  'BLOCKED_NO_GO',
  'BLOCKED_EXTERNAL_ROUTE_CHANGE',
  'BLOCKED_FOUNDER_CONTROLLED_SEND',
  'BLOCKED_PROVIDER_OUTREACH',
  'BLOCKED_REVIEWER_OUTREACH',
  'BLOCKED_PARTNERSHIP_CLAIMS',
  'BLOCKED_LIVE_ACTION',
  'Allowed Local Work',
  'Required Source Documents',
  'No Shortcut Rules',
  'Stop Boundary',
]) {
  requirePhrase(matrix, phrase, 'public distribution boundary matrix');
}

for (const fileReference of [
  'whitepaper-v1-3-draft.html',
  'index-v1-3-draft.html',
  'whitepaper.html',
  'index.html',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md',
  'docs/whitepaper-v1-3-internal-review-master-index.md',
  'docs/whitepaper-v1-3-public-announcement-review-template.md',
  'docs/whitepaper-v1-3-final-public-wording-diff-template.md',
  'docs/whitepaper-v1-3-draft-print-pdf-export-static-checklist.md',
  'docs/whitepaper-v1-3-publication-gate.md',
]) {
  requirePhrase(matrix, fileReference, 'public distribution boundary matrix');
}

requirePhrase(evidenceStatus, 'Current decision: NO-GO', 'publication evidence current status');
requirePhrase(founderReadyRollup, 'Current publication decision remains NO-GO', 'founder-ready packet status rollup');
requirePhrase(masterIndex, 'Current Decision State', 'internal review master index');
requirePhrase(publicAnnouncementReview, 'PENDING_ANNOUNCEMENT_REVIEW', 'public announcement review template');
requirePhrase(finalPublicWordingDiff, 'PENDING_FINAL_WORDING_DIFF', 'final public wording diff template');
requirePhrase(draftPrintPdfExport, 'PENDING_PRINT_PDF_EXPORT_REVIEW', 'draft print/PDF export static checklist');
requirePhrase(publicationGate, 'Default state: NO-GO', 'publication gate');

for (const pattern of [
  /\bpublic distribution approved\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\breviewer outreach approved\b/i,
  /\bprovider outreach approved\b/i,
  /\bexternal send approved\b/i,
  /\blive action approved\b/i,
]) {
  rejectPattern(matrix, pattern, 'public distribution boundary matrix');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (
    content.includes('Public Distribution Boundary Matrix') ||
    content.includes('BLOCKED_NO_DISTRIBUTION')
  ) {
    errors.push(`${label} appears to contain internal public distribution boundary content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 public distribution boundary matrix validation passed');
