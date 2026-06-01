import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  template: path.join(root, 'docs', 'whitepaper-v1-3-archive-rollback-evidence-template.md'),
  archivePlan: path.join(root, 'docs', 'whitepaper-v1-3-archive-and-rollback-plan.md'),
  archiveChecklist: path.join(root, 'docs', 'whitepaper-v1-3-archive-execution-checklist.md'),
  publicationGate: path.join(root, 'docs', 'whitepaper-v1-3-publication-gate.md'),
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

function rejectPattern(text, pattern, label) {
  if (pattern.test(text)) {
    errors.push(`${label} contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

const template = readRequired('archive rollback evidence template', files.template);
const archivePlan = readRequired('archive and rollback plan', files.archivePlan);
const archiveChecklist = readRequired('archive execution checklist', files.archiveChecklist);
const publicationGate = readRequired('publication gate', files.publicationGate);
const blockerMatrix = readRequired('publication blocker status matrix', files.blockerMatrix);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal archive and rollback evidence template',
  'No archive copy or rollback execution is recorded here',
  'Run Record Template',
  'Archive Evidence Rows Template',
  'Rollback Evidence Rows Template',
  'Allowed Evidence States',
  'Required Before Any PASS',
  'Stop Boundary',
  'publication gate state | NO-GO by default',
  'public files touched in this template | NO',
  'archive commands executed | NO',
  'rollback commands executed | NO',
  'PENDING_ARCHIVE_COPY',
  'PENDING_ROLLBACK_REVIEW',
  'V13-ARCHIVE-WP-01',
  'V13-ROLLBACK-WP-01',
]) {
  requirePhrase(template, phrase, 'archive rollback evidence template');
}

for (const blockedAction of [
  'cannot be used to create archives',
  'replace public files',
  'publish PDFs',
  'run rollback commands',
  'claim evidence completion',
  'register FIO names',
  'sign XPR actions',
]) {
  requirePhrase(template, blockedAction, 'archive rollback evidence template');
}

requirePhrase(archivePlan, 'Archive Strategy', 'archive and rollback plan');
requirePhrase(archiveChecklist, 'Do not run until GO', 'archive execution checklist');
requirePhrase(publicationGate, 'Default state: NO-GO', 'publication gate');
requirePhrase(blockerMatrix, 'archive copy creation | PENDING', 'publication blocker status matrix');
requirePhrase(blockerMatrix, 'rollback verification | PENDING', 'publication blocker status matrix');

for (const pattern of [
  /\bpublication gate state \| GO\b/i,
  /\barchive commands executed \| YES\b/i,
  /\brollback commands executed \| YES\b/i,
  /\bpublic files touched in this template \| YES\b/i,
  /\bevidence is complete\b/i,
  /\bpublic replacement is approved\b/i,
]) {
  rejectPattern(template, pattern, 'archive rollback evidence template');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Archive Rollback Evidence Template') || content.includes('V13-ARCHIVE-WP-01')) {
    errors.push(`${label} appears to contain internal archive rollback evidence template content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 archive rollback evidence template validation passed');
