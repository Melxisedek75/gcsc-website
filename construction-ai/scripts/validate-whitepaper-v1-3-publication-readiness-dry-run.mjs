import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  dryRun: path.join(root, 'docs', 'whitepaper-v1-3-publication-readiness-dry-run.md'),
  publicationEvidence: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-template.md'),
  publicationStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  finalChecklist: path.join(root, 'docs', 'whitepaper-v1-3-final-publication-checklist.md'),
  publicationGate: path.join(root, 'docs', 'whitepaper-v1-3-publication-gate.md'),
  archiveChecklist: path.join(root, 'docs', 'whitepaper-v1-3-archive-execution-checklist.md'),
  archiveRollbackEvidence: path.join(root, 'docs', 'whitepaper-v1-3-archive-rollback-evidence-template.md'),
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

const dryRun = readRequired('publication readiness dry run', files.dryRun);
const publicationEvidence = readRequired('publication evidence template', files.publicationEvidence);
const publicationStatus = readRequired('publication evidence current status', files.publicationStatus);
const finalChecklist = readRequired('final publication checklist', files.finalChecklist);
const publicationGate = readRequired('publication gate', files.publicationGate);
const archiveChecklist = readRequired('archive execution checklist', files.archiveChecklist);
const archiveRollbackEvidence = readRequired('archive rollback evidence template', files.archiveRollbackEvidence);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal dry run. Current result: NO-GO.',
  'This dry run checks whether v1.3 publication materials are organized enough for future founder/legal/provider review.',
  'It does not replace public files, publish a PDF, change routing, contact providers, or approve live integrations.',
  'Dry Run Result',
  'Public File Replacement Check',
  'Autonomous Codex must not replace:',
  '`whitepaper.html`;',
  '`index.html`.',
  'Required Before Future GO',
  'NO-GO Reasons',
  'Safe Next Actions',
  'publication gate | NO-GO',
  'founder approval | PENDING',
  'legal/provider review | PENDING',
  'browser screenshot QA | PENDING',
  'archive/rollback execution | PENDING',
  'Founder approval is not recorded',
  'Legal/provider review is not recorded',
  'Public routing replacement is not approved',
]) {
  requirePhrase(dryRun, phrase, 'publication readiness dry run');
}

for (const phrase of [
  'Status: internal evidence template. Default decision remains NO-GO.',
  'Public file to replace later | `whitepaper.html`',
  'Homepage file to replace later | `index.html`',
  'Current decision | NO-GO',
  'Publication gate updated from NO-GO to GO | PENDING',
  'Explicit Non-Approval',
  'This evidence template does not approve:',
  'replacing `whitepaper.html`',
  'replacing `index.html`',
]) {
  requirePhrase(publicationEvidence, phrase, 'publication evidence template');
}

for (const phrase of [
  'Current publication decision remains NO-GO',
  'Evidence Still Missing Before Any GO',
  'Current decision: NO-GO',
  'Safe Next Actions',
  'Stop Boundary',
]) {
  requirePhrase(publicationStatus, phrase, 'publication evidence current status');
}

for (const phrase of [
  'Status: final checklist template. Default state is NO-GO.',
  'Required Before GO',
  'Founder review packet reviewed | NO-GO',
  'Legal/provider review completed where needed | NO-GO',
  'Finance-provider review completed where needed | NO-GO',
  'Technical/security review completed where needed | NO-GO',
  'Publication gate updated to GO | NO-GO',
  'Old whitepaper archive file prepared | NO-GO',
  'Public HTML replacement reviewed | NO-GO',
  'All NO-GO rows must become GO, REVIEWED, or NOT APPLICABLE with evidence before public publication.',
  'Do Not Publish If',
]) {
  requirePhrase(finalChecklist, phrase, 'final publication checklist');
}

for (const phrase of [
  'Default state: NO-GO.',
  'Move to REVIEW only after all local docs and validators pass.',
  'Move to GO only after founder approval and required external reviews are recorded.',
  'Blocked Public Actions',
  'replacing `whitepaper.html`',
  'announcing FIO integration',
  'announcing Metallicus partnership',
  'announcing live lending',
  'announcing live escrow',
]) {
  requirePhrase(publicationGate, phrase, 'publication gate');
}

for (const phrase of [
  'Status: internal execution checklist. Do not execute until publication gate is GO.',
  'This checklist does not approve file replacement, public publication, website deployment, PDF release, external announcement, legal claims, provider commitments, live payments, loans, escrow, stablecoin settlement, token collateral, FIO actions, or XPR signatures.',
  'Required Before Running',
  'Do not run until GO:',
  'This checklist remains blocked while publication gate is NO-GO.',
]) {
  requirePhrase(archiveChecklist, phrase, 'archive execution checklist');
}

for (const phrase of [
  'publication gate state | NO-GO by default',
  'public files touched in this template | NO',
  'archive commands executed | NO',
  'rollback commands executed | NO',
]) {
  requirePhrase(archiveRollbackEvidence, phrase, 'archive rollback evidence template');
}

for (const [label, text] of [
  ['publication readiness dry run', dryRun],
  ['publication evidence template', publicationEvidence],
  ['publication evidence current status', publicationStatus],
  ['final publication checklist', finalChecklist],
  ['publication gate', publicationGate],
  ['archive execution checklist', archiveChecklist],
  ['archive rollback evidence template', archiveRollbackEvidence],
]) {
  for (const pattern of [
    /\bCurrent result:\s*GO\b/i,
    /\bCurrent decision:\s*GO\b/i,
    /\bDefault state:\s*GO\b/i,
    /\bfounder approval \|\s*RECORDED\b/i,
    /\blegal\/provider review \|\s*COMPLETE\b/i,
    /\bbrowser screenshot QA \|\s*COMPLETE\b/i,
    /\barchive\/rollback execution \|\s*COMPLETE\b/i,
    /\bPublication gate updated to GO \|\s*GO\b/i,
    /\bOld whitepaper archive file prepared \|\s*GO\b/i,
    /\bPublic HTML replacement reviewed \|\s*GO\b/i,
    /\barchive commands executed \|\s*YES\b/i,
    /\brollback commands executed \|\s*YES\b/i,
    /\bpublic files touched in this template \|\s*YES\b/i,
    /\bpublic replacement is approved\b/i,
    /\bpublication approved\b/i,
  ]) {
    rejectPattern(text, pattern, label);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (
    content.includes('GCSC Whitepaper v1.3 Publication Readiness Dry Run') ||
    content.includes('Status: internal dry run. Current result: NO-GO.') ||
    content.includes('Publication gate updated from NO-GO to GO | PENDING') ||
    content.includes('publication gate state | NO-GO by default')
  ) {
    errors.push(`${label} appears to contain internal publication readiness content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 publication readiness dry-run validation passed');
