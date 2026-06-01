import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  index: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-routing-index.md'),
  providerRegister: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-register.md'),
  legalPacket: path.join(root, 'docs', 'whitepaper-v1-3-legal-provider-review-packet.md'),
  fioBrief: path.join(root, 'docs', 'whitepaper-v1-3-fio-protocol-integration-brief.md'),
  metalBrief: path.join(root, 'docs', 'whitepaper-v1-3-metallicus-xpr-integration-brief.md'),
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

const index = readRequired('reviewer routing index', files.index);
const providerRegister = readRequired('provider question register', files.providerRegister);
const legalPacket = readRequired('legal provider review packet', files.legalPacket);
const fioBrief = readRequired('FIO Protocol brief', files.fioBrief);
const metalBrief = readRequired('Metallicus/XPR brief', files.metalBrief);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Core Review Packet',
  'Attorney / Compliance Reviewer',
  'Escrow Provider Reviewer',
  'Lending / Working Capital Reviewer',
  'KYC / KYB / AML Reviewer',
  'FIO Protocol Technical Reviewer',
  'XPR / WebAuth / Metal / Metallicus Technical Reviewer',
  'Reviewer Response Intake',
  'Stop Boundary',
  'Send only after founder approval',
  'Codex must not contact anyone autonomously',
]) {
  requirePhrase(index, phrase, 'reviewer routing index');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-legal-provider-review-packet.md',
  'docs/whitepaper-v1-3-external-reviewer-cover-sheet.md',
  'docs/whitepaper-v1-3-provider-question-register.md',
  'docs/whitepaper-v1-3-public-draft.md',
  'docs/whitepaper-v1-3-fio-protocol-integration-brief.md',
  'docs/whitepaper-v1-3-metallicus-xpr-integration-brief.md',
  'docs/whitepaper-v1-3-regulated-web3-architecture-map.md',
]) {
  requirePhrase(index, fileReference, 'reviewer routing index');
}

for (const phrase of [
  'Escrow Custody',
  'Lending And Working Capital',
  'KYC, KYB, AML, And Fraud',
  'FIO Protocol',
  'XPR, WebAuth, Metal, And Metallicus',
]) {
  requirePhrase(providerRegister, phrase, 'provider question register');
}

requirePhrase(legalPacket, 'Required Review Outputs', 'legal provider review packet');
requirePhrase(fioBrief, 'Blocked Until Review', 'FIO Protocol brief');
requirePhrase(metalBrief, 'Blocked Until Founder/Legal/Provider Approval', 'Metallicus/XPR brief');

const blockedApprovalPatterns = [
  /\boutreach is approved\b/i,
  /\bpublication is approved\b/i,
  /\bpartnership is approved\b/i,
  /\blive action approved: yes\b/i,
  /\blegal conclusion recorded\b/i,
  /\bprovider commitment recorded\b/i,
  /\bproduction Web3 approved\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(index)) {
    errors.push(`reviewer routing index contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Reviewer Routing Index') || content.includes('Reviewer Response Intake')) {
    errors.push(`${label} appears to contain internal reviewer routing content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 reviewer routing index validation passed');
