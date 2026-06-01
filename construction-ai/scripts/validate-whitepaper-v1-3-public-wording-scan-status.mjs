import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  status: path.join(root, 'docs', 'whitepaper-v1-3-public-wording-scan-current-status.md'),
  riskScan: path.join(root, 'docs', 'whitepaper-v1-3-public-website-risk-scan.md'),
  hardening: path.join(root, 'docs', 'whitepaper-v1-3-claim-risk-hardening-checklist.md'),
  publicDraft: path.join(root, 'docs', 'whitepaper-v1-3-public-draft.md'),
  whitepaperDraft: path.join(root, 'whitepaper-v1-3-draft.html'),
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

const status = readRequired('public wording scan current status', files.status);
const riskScan = readRequired('public website risk scan', files.riskScan);
const hardening = readRequired('claim risk hardening checklist', files.hardening);
const publicDraft = readRequired('public draft narrative', files.publicDraft);
const whitepaperDraft = readRequired('whitepaper v1.3 draft', files.whitepaperDraft);
const homepageDraft = readRequired('homepage v1.3 draft', files.homepageDraft);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal public-wording scan status',
  'Current publication decision remains NO-GO',
  'Files In Scope',
  'Local Draft Scan Rule',
  'Required Context For Sensitive Topics',
  'Current Public File Boundary',
  'Safe Next Actions',
  'Stop Boundary',
  '`whitepaper.html` | legacy public whitepaper | scan only',
  '`index.html` | legacy public homepage | scan only',
  '`whitepaper-v1-3-draft.html` | local v1.3 draft | scan and polish locally',
  '`index-v1-3-draft.html` | local v1.3 homepage draft | scan and polish locally',
]) {
  requirePhrase(status, phrase, 'public wording scan current status');
}

for (const phrase of [
  'working capital | licensed lender/provider review',
  'escrow | escrow-ready records only',
  'FIO Protocol | future optional UX layer',
  'XPR/WebAuth/Metal/Metallicus | candidate infrastructure paths',
  'Value Mirror | performance/value record concept only',
]) {
  requirePhrase(status, phrase, 'public wording scan current status');
}

requirePhrase(riskScan, 'Safe Replacement Principles', 'public website risk scan');
requirePhrase(hardening, 'Publication Stop Rule', 'claim risk hardening checklist');
requirePhrase(publicDraft, 'internal public-safe draft', 'public draft narrative');

const blockedDraftPatterns = [
  /\bguaranteed return\b/i,
  /\brisk-free\b/i,
  /\bpassive income\b/i,
  /\binstant loan approval\b/i,
  /\bautomatic escrow release\b/i,
  /\bGCSC custody of escrow funds\b/i,
  /\blive stablecoin settlement\b/i,
  /\blive token collateral\b/i,
  /\bpublic NFT marketplace\b/i,
  /\bpublic tokenized property equity\b/i,
  /\bapproved partnership\b/i,
  /\bregulator endorsement\b/i,
];

for (const [label, content] of [
  ['whitepaper-v1-3-draft.html', whitepaperDraft],
  ['index-v1-3-draft.html', homepageDraft],
]) {
  for (const pattern of blockedDraftPatterns) {
    if (pattern.test(content)) {
      errors.push(`${label} contains blocked standalone public wording pattern: ${pattern.source}`);
    }
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Public Wording Scan Current Status') || content.includes('Local Draft Scan Rule')) {
    errors.push(`${label} appears to contain internal public wording scan status content`);
  }
}

const blockedStatusPatterns = [
  /\bCurrent publication decision remains GO\b/i,
  /\bpublic replacement approved\b/i,
  /\blegal\/provider review is complete\b/i,
  /\bpartnership approved\b/i,
  /\blive action approved\b/i,
];

for (const pattern of blockedStatusPatterns) {
  if (pattern.test(status)) {
    errors.push(`public wording scan current status contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 public wording scan status validation passed');
