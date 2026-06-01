import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  checklist: path.join(root, 'docs', 'whitepaper-v1-3-draft-content-parity-checklist.md'),
  publicDraft: path.join(root, 'docs', 'whitepaper-v1-3-public-draft.md'),
  claimRisk: path.join(root, 'docs', 'whitepaper-v1-3-claim-risk-register.md'),
  publicWordingScan: path.join(root, 'docs', 'whitepaper-v1-3-public-wording-scan-current-status.md'),
  whitepaperDraft: path.join(root, 'whitepaper-v1-3-draft.html'),
  homepageDraft: path.join(root, 'index-v1-3-draft.html'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  publicationGate: path.join(root, 'docs', 'whitepaper-v1-3-publication-gate.md'),
  publicWhitepaper: path.join(root, 'whitepaper.html'),
  publicHomepage: path.join(root, 'index.html'),
};

const sectionPairs = [
  ['## Executive Summary', '<h2>Executive Summary</h2>'],
  ['## The Construction Trust Problem', '<h2>The Construction Trust Problem</h2>'],
  ['## SmartContractor Product Layer', '<h2>SmartContractor Product Layer</h2>'],
  ['## Verified Contractor Workflow', '<h2>Verified Contractor Workflow</h2>'],
  ['## Milestones And Escrow-Ready Records', '<h2>Milestones And Escrow-Ready Records</h2>'],
  ['## Partner-Powered Working Capital Readiness', '<h2>Partner-Powered Working Capital Readiness</h2>'],
  ['## Disputes, Evidence, And Peer Review', '<h2>Disputes, Evidence, And Peer Review</h2>'],
  ['## Reputation And Underwriting Data', '<h2>Reputation And Underwriting Data</h2>'],
  ['## AI Assistance Boundaries', '<h2>AI Assistance Boundaries</h2>'],
  ['## Licensed Partner Model', '<h2>Licensed Partner Model</h2>'],
  ['## Future Regulated Web3 Layer', '<h2>Future Regulated Web3 Layer</h2>'],
  ['## FIO Protocol Roadmap', '<h2>FIO Protocol Roadmap</h2>'],
  ['## XPR, WebAuth, Metal, And Metallicus Research Path', '<h2>XPR, WebAuth, Metal, And Metallicus Research Path</h2>'],
  ['## Value Mirror System', '<h2>Value Mirror System</h2>'],
  ['## Security And Audit Trail', '<h2>Security And Audit Trail</h2>'],
  ['## Roadmap', '<h2>Roadmap</h2>'],
  ['## Review Gates', '<h2>Review Gates</h2>'],
  ['## Risk Factors', '<h2>Risk Factors</h2>'],
];

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

const checklist = readRequired('draft content parity checklist', files.checklist);
const publicDraft = readRequired('public draft', files.publicDraft);
const claimRisk = readRequired('claim risk register', files.claimRisk);
const publicWordingScan = readRequired('public wording scan status', files.publicWordingScan);
const whitepaperDraft = readRequired('whitepaper v1.3 draft HTML', files.whitepaperDraft);
const homepageDraft = readRequired('homepage v1.3 draft HTML', files.homepageDraft);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const publicationGate = readRequired('publication gate', files.publicationGate);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal draft content parity static checklist',
  'Browser content review remains PENDING_BROWSER_CONTENT_REVIEW',
  'Current publication decision remains NO-GO',
  'Purpose',
  'Source Pairing',
  'Static Parity Checks',
  'Manual Content Checks Still Required',
  'Required Source Documents',
  'Stop Boundary',
  'PASS_STATIC_CONTENT_PARITY',
  'PASS_STATIC_SUMMARY_PARITY',
  'PENDING_BROWSER_CONTENT_REVIEW',
  'PENDING_EXTERNAL_REVIEW',
]) {
  requirePhrase(checklist, phrase, 'draft content parity checklist');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-public-draft.md',
  'docs/whitepaper-v1-3-claim-risk-register.md',
  'docs/whitepaper-v1-3-public-wording-scan-current-status.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-publication-gate.md',
  'whitepaper-v1-3-draft.html',
  'index-v1-3-draft.html',
  'whitepaper.html',
  'index.html',
]) {
  requirePhrase(checklist, fileReference, 'draft content parity checklist');
}

for (const [publicHeading, htmlHeading] of sectionPairs) {
  requirePhrase(publicDraft, publicHeading, 'public draft');
  requirePhrase(whitepaperDraft, htmlHeading, 'whitepaper v1.3 draft HTML');
}

for (const phrase of [
  'Construction Trust Infrastructure',
  'not live',
  'provider-reviewed',
  'review-required',
  'No public investment token',
  'does not claim partnership',
  'does not currently originate, approve, fund, service, or guarantee loans',
  'Live escrow custody must be handled by a licensed escrow partner',
]) {
  requirePhrase(whitepaperDraft, phrase, 'whitepaper v1.3 draft HTML');
}

for (const phrase of [
  'Construction Trust Infrastructure',
  'Publication Gate: NO-GO',
  'Scope: No Real Money',
  'future infrastructure candidates',
  'does not approve public publication',
]) {
  requirePhrase(homepageDraft, phrase, 'index-v1-3-draft.html');
}

requirePhrase(claimRisk, 'Blocked Public Vocabulary', 'claim risk register');
requirePhrase(claimRisk, 'Publication Rule', 'claim risk register');
requirePhrase(publicWordingScan, 'Public Wording Scan Current Status', 'public wording scan status');
requirePhrase(evidenceStatus, 'Current decision: NO-GO', 'publication evidence current status');
requirePhrase(publicationGate, 'Default state: NO-GO', 'publication gate');

for (const pattern of [
  /\bCurrent decision:\s*GO\b/i,
  /\bcontent review complete\b/i,
  /\bmanual copy review complete\b/i,
  /\bpublic copy approved\b/i,
  /\bwebsite copy ready\b/i,
  /\blegal\/provider review complete\b/i,
  /\bpublication approved\b/i,
  /\bpublication readiness complete\b/i,
]) {
  rejectPattern(checklist, pattern, 'draft content parity checklist');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Draft Content Parity Checklist') || content.includes('PENDING_BROWSER_CONTENT_REVIEW')) {
    errors.push(`${label} appears to contain internal draft content parity checklist content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 draft content parity checklist validation passed');
