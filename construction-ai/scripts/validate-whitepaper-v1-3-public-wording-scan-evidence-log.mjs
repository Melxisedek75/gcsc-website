import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  log: path.join(root, 'docs', 'whitepaper-v1-3-public-wording-scan-evidence-log.md'),
  status: path.join(root, 'docs', 'whitepaper-v1-3-public-wording-scan-current-status.md'),
  riskScan: path.join(root, 'docs', 'whitepaper-v1-3-public-website-risk-scan.md'),
  hardening: path.join(root, 'docs', 'whitepaper-v1-3-claim-risk-hardening-checklist.md'),
  finalDiff: path.join(root, 'docs', 'whitepaper-v1-3-final-public-wording-diff-template.md'),
  publicationEvidence: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  founderRollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  masterIndex: path.join(root, 'docs', 'whitepaper-v1-3-internal-review-master-index.md'),
  publicWhitepaper: path.join(root, 'whitepaper.html'),
  publicHomepage: path.join(root, 'index.html'),
  whitepaperDraft: path.join(root, 'whitepaper-v1-3-draft.html'),
  homepageDraft: path.join(root, 'index-v1-3-draft.html'),
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

const log = readRequired('public wording scan evidence log', files.log);
const status = readRequired('public wording scan current status', files.status);
const riskScan = readRequired('public website risk scan', files.riskScan);
const hardening = readRequired('claim-risk hardening checklist', files.hardening);
const finalDiff = readRequired('final public wording diff template', files.finalDiff);
const publicationEvidence = readRequired('publication evidence current status', files.publicationEvidence);
const founderRollup = readRequired('founder-ready packet status rollup', files.founderRollup);
const masterIndex = readRequired('internal review master index', files.masterIndex);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);
const whitepaperDraft = readRequired('whitepaper v1.3 draft', files.whitepaperDraft);
const homepageDraft = readRequired('homepage v1.3 draft', files.homepageDraft);

for (const phrase of [
  'Public Wording Scan Evidence Log',
  'Current publication decision remains NO-GO',
  'Public files remain scan-only',
  'Current Scan State',
  'Scan Evidence Rows',
  'Required Treatment Rules',
  'Required Cross References',
  'No Shortcut Rules',
  'Stop Boundary',
  'LEGACY_SCAN_ONLY',
  'LOCAL_DRAFT_SCAN_ALLOWED',
  'PUBLICATION_STILL_NO_GO',
  'PUBLIC_REPLACEMENT_BLOCKED',
  'LIVE_ACTION_STILL_BLOCKED',
  'V13-PWSCAN-001',
  'V13-PWSCAN-008',
]) {
  requirePhrase(log, phrase, 'public wording scan evidence log');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-public-wording-scan-current-status.md',
  'docs/whitepaper-v1-3-public-website-risk-scan.md',
  'docs/whitepaper-v1-3-claim-risk-hardening-checklist.md',
  'docs/whitepaper-v1-3-final-public-wording-diff-template.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-publication-gate.md',
  'docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md',
  'docs/whitepaper-v1-3-internal-review-master-index.md',
]) {
  requirePhrase(log, fileReference, 'public wording scan evidence log');
}

requirePhrase(status, 'docs/whitepaper-v1-3-public-wording-scan-evidence-log.md', 'public wording scan current status');
requirePhrase(finalDiff, 'docs/whitepaper-v1-3-public-wording-scan-evidence-log.md', 'final public wording diff template');
requirePhrase(publicationEvidence, 'public wording scan evidence log validator | PASS_LOCAL_LOG', 'publication evidence current status');
requirePhrase(publicationEvidence, 'public wording scan evidence log | PENDING_PUBLIC_REPLACEMENT_GO', 'publication evidence current status');
requirePhrase(founderRollup, 'public wording scan evidence log | READY_LOCAL_LOG_NO_GO', 'founder-ready packet status rollup');
requirePhrase(founderRollup, 'public wording scan evidence log | PENDING_PUBLIC_REPLACEMENT_GO', 'founder-ready packet status rollup');
requirePhrase(masterIndex, 'public wording scan evidence log | local scan evidence only / public replacement blocked', 'internal review master index');

requirePhrase(riskScan, 'Safe Replacement Principles', 'public website risk scan');
requirePhrase(hardening, 'Publication Stop Rule', 'claim-risk hardening checklist');
requirePhrase(whitepaperDraft, 'Internal Draft - Not Approved For Publication', 'whitepaper v1.3 draft');
requirePhrase(homepageDraft, 'Publication Gate: NO-GO', 'homepage v1.3 draft');

for (const pattern of [
  /\bpublic wording scan approved for publication\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blegal clearance recorded\b/i,
  /\bprovider clearance recorded\b/i,
  /\blive action approved\b/i,
  /\bpartnership commitment recorded\b/i,
]) {
  rejectPattern(log, pattern, 'public wording scan evidence log');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Public Wording Scan Evidence Log') || content.includes('V13-PWSCAN-001')) {
    errors.push(`${label} appears to contain internal public wording scan evidence log content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 public wording scan evidence log validation passed');
