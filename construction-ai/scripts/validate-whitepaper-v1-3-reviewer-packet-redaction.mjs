import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  checklist: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-redaction-checklist.md'),
  routingIndex: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-routing-index.md'),
  responseIntake: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-intake-template.md'),
  legalPacket: path.join(root, 'docs', 'whitepaper-v1-3-legal-provider-review-packet.md'),
  providerRegister: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-register.md'),
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

const checklist = readRequired('reviewer packet redaction checklist', files.checklist);
const routingIndex = readRequired('reviewer routing index', files.routingIndex);
const responseIntake = readRequired('reviewer response intake', files.responseIntake);
const legalPacket = readRequired('legal provider review packet', files.legalPacket);
const providerRegister = readRequired('provider question register', files.providerRegister);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal redaction checklist',
  'Reviewer Packet Redaction Checklist',
  'Redaction Required Before Reviewer Packet Leaves Local Repo',
  'Allowed Packet Content',
  'Blocked Packet Content',
  'Reviewer-Specific Redaction Rules',
  'Redaction Review Record',
  'Required Final Checks',
  'Stop Boundary',
  'secrets removed? | NO by default',
  'private data removed? | NO by default',
  'live-risk instructions removed? | NO by default',
  'public publication approved? | NO by default',
  'outreach approved by founder? | NO by default',
]) {
  requirePhrase(checklist, phrase, 'reviewer packet redaction checklist');
}

for (const phrase of [
  'API keys, service-role keys, private keys, passwords | REMOVE',
  'seed phrases, recovery phrases, wallet private material | REMOVE',
  'bank account numbers, routing numbers, cards, payment credentials | REMOVE',
  'customer names, homeowner addresses, contractor personal data | REMOVE_OR_ANONYMIZE',
  'unapproved partner references | SOFTEN',
]) {
  requirePhrase(checklist, phrase, 'reviewer packet redaction checklist');
}

for (const reviewerType of [
  'attorney / compliance',
  'escrow provider',
  'lending / working capital provider',
  'KYC / KYB / AML provider',
  'FIO technical reviewer',
  'XPR / WebAuth / Metal / Metallicus technical reviewer',
  'website/publication reviewer',
]) {
  requirePhrase(checklist, reviewerType, 'reviewer packet redaction checklist');
}

requirePhrase(routingIndex, 'Codex must not contact anyone autonomously', 'reviewer routing index');
requirePhrase(responseIntake, 'Safe Recording Rules', 'reviewer response intake');
requirePhrase(legalPacket, 'Reviewers should not return secrets', 'legal provider review packet');
requirePhrase(providerRegister, 'KYC, KYB, AML, And Fraud', 'provider question register');

const blockedPatterns = [
  /\boutreach is approved\b/i,
  /\bpublication is approved\b/i,
  /\bpublic publication approved\?\s*\|\s*YES\b/i,
  /\boutreach approved by founder\?\s*\|\s*YES\b/i,
  /\bsecrets removed\?\s*\|\s*YES\b/i,
  /\bprivate data removed\?\s*\|\s*YES\b/i,
  /\blive-risk instructions removed\?\s*\|\s*YES\b/i,
  /\blegal review complete\b/i,
  /\bapproved partnership\b/i,
  /\blive action approved\b/i,
];

for (const pattern of blockedPatterns) {
  if (pattern.test(checklist)) {
    errors.push(`reviewer packet redaction checklist contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Reviewer Packet Redaction Checklist') || content.includes('Redaction Review Record')) {
    errors.push(`${label} appears to contain internal reviewer packet redaction content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 reviewer packet redaction validation passed');
