import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  log: path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-wording-evidence-log.md'),
  alignment: path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-wording-alignment.md'),
  status: path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-wording-review-status.md'),
  publicWordingScan: path.join(root, 'docs', 'whitepaper-v1-3-public-wording-scan-current-status.md'),
  publicWordingEvidence: path.join(root, 'docs', 'whitepaper-v1-3-public-wording-scan-evidence-log.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  publicationEvidence: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  founderRollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  masterIndex: path.join(root, 'docs', 'whitepaper-v1-3-internal-review-master-index.md'),
  smartcontractorHtml: path.join(root, 'construction-ai', 'public', 'smartcontractor.html'),
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

const log = readRequired('SmartContractor wording evidence log', files.log);
const alignment = readRequired('SmartContractor wording alignment', files.alignment);
const status = readRequired('SmartContractor wording review status', files.status);
const publicWordingScan = readRequired('public wording scan status', files.publicWordingScan);
const publicWordingEvidence = readRequired('public wording scan evidence log', files.publicWordingEvidence);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const publicationEvidence = readRequired('publication evidence current status', files.publicationEvidence);
const founderRollup = readRequired('founder-ready packet status rollup', files.founderRollup);
const masterIndex = readRequired('internal review master index', files.masterIndex);
const smartcontractorHtml = readRequired('SmartContractor HTML', files.smartcontractorHtml);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'SmartContractor Wording Evidence Log',
  'Current publication decision remains NO-GO',
  'SmartContractor remains demo-only and no-real-money',
  'Current Product Scan State',
  'Scan Evidence Rows',
  'Required Product Treatment Rules',
  'Required Cross References',
  'No Shortcut Rules',
  'Stop Boundary',
  'SMARTCONTRACTOR_DEMO_ONLY_SCAN',
  'LOCAL_RECORD_ONLY',
  'FUTURE_REVIEW_REQUIRED',
  'PRODUCTION_RELEASE_NO_GO',
  'PUBLICATION_STILL_NO_GO',
  'LIVE_ACTION_STILL_BLOCKED',
  'V13-SCWORD-001',
  'V13-SCWORD-008',
]) {
  requirePhrase(log, phrase, 'SmartContractor wording evidence log');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-smartcontractor-wording-alignment.md',
  'docs/whitepaper-v1-3-smartcontractor-wording-review-status.md',
  'docs/whitepaper-v1-3-public-wording-scan-current-status.md',
  'docs/whitepaper-v1-3-public-wording-scan-evidence-log.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md',
  'docs/whitepaper-v1-3-internal-review-master-index.md',
]) {
  requirePhrase(log, fileReference, 'SmartContractor wording evidence log');
}

for (const phrase of [
  'Demo-only loan requests create local review records only',
  'They do not approve credit, fund a contractor, route repayment, release escrow, or lock token collateral',
  'Demo-only payment intents create local review records only',
  'They do not charge a card, move XPR, release escrow, settle stablecoins, repay loans, or lock token collateral',
  'Local-only founder/legal/provider/security packet',
  'No Codex live action',
]) {
  requirePhrase(smartcontractorHtml, phrase, 'SmartContractor HTML');
}

requirePhrase(alignment, 'Product Copy Rule', 'SmartContractor wording alignment');
requirePhrase(status, 'docs/whitepaper-v1-3-smartcontractor-wording-evidence-log.md', 'SmartContractor wording review status');
requirePhrase(status, 'SmartContractor wording evidence log | LOCAL_LOG_READY_NO_GO', 'SmartContractor wording review status');
requirePhrase(publicWordingScan, 'Current Public File Boundary', 'public wording scan status');
requirePhrase(publicWordingEvidence, 'Public Wording Scan Evidence Log', 'public wording scan evidence log');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(publicationEvidence, 'SmartContractor wording evidence log validator | PASS_LOCAL_LOG', 'publication evidence current status');
requirePhrase(publicationEvidence, 'SmartContractor wording evidence log | PENDING_PRODUCT_RELEASE_GO', 'publication evidence current status');
requirePhrase(founderRollup, 'SmartContractor wording evidence log | READY_LOCAL_LOG_NO_GO', 'founder-ready packet status rollup');
requirePhrase(founderRollup, 'SmartContractor wording evidence log | PENDING_PRODUCT_RELEASE_GO', 'founder-ready packet status rollup');
requirePhrase(masterIndex, 'SmartContractor wording evidence log | local product wording evidence only / production release blocked', 'internal review master index');

for (const pattern of [
  /\bSmartContractor production release approved\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blegal clearance recorded\b/i,
  /\bprovider clearance recorded\b/i,
  /\blive action approved\b/i,
  /\bpartnership commitment recorded\b/i,
]) {
  rejectPattern(log, pattern, 'SmartContractor wording evidence log');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('SmartContractor Wording Evidence Log') || content.includes('V13-SCWORD-001')) {
    errors.push(`${label} appears to contain internal SmartContractor wording evidence log content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 SmartContractor wording evidence log validation passed');
