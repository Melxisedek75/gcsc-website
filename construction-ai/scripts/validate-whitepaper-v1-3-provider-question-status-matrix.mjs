import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  matrix: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-status-matrix.md'),
  register: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-register.md'),
  routingIndex: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-routing-index.md'),
  mappingMatrix: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-question-mapping-matrix.md'),
  redaction: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-redaction-checklist.md'),
  responseIntake: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-intake-template.md'),
  responseSummary: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-summary-shell.md'),
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

const matrix = readRequired('provider question status matrix', files.matrix);
const register = readRequired('provider question register', files.register);
const routingIndex = readRequired('reviewer routing index', files.routingIndex);
const mappingMatrix = readRequired('reviewer question mapping matrix', files.mappingMatrix);
const redaction = readRequired('reviewer packet redaction checklist', files.redaction);
const responseIntake = readRequired('reviewer response intake template', files.responseIntake);
const responseSummary = readRequired('reviewer response summary shell', files.responseSummary);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal provider-question status matrix',
  'No provider response is recorded yet',
  'Question Group Status',
  'Question Mapping Status',
  'reviewer question mapping matrix | READY_LOCAL_MATRIX_PENDING_FOUNDER_CATEGORY_SELECTION',
  'Required Before Status Can Change',
  'Safe Routing Rule',
  'Stop Boundary',
  'READY_FOR_FOUNDER_ROUTING',
  'NO_RESPONSE',
]) {
  requirePhrase(matrix, phrase, 'provider question status matrix');
}

for (const group of [
  'Escrow Custody',
  'Lending And Working Capital',
  'KYC, KYB, AML, And Fraud',
  'Payment Processing And Stablecoin Settlement',
  'Insurance And Bonding',
  'Appraisal And Valuation',
  'FIO Protocol',
  'XPR, WebAuth, Metal, And Metallicus',
  'Data Privacy And Audit Logs',
]) {
  requirePhrase(matrix, group, 'provider question status matrix');
  requirePhrase(register, group, 'provider question register');
}

for (const phrase of [
  'Codex must not contact anyone autonomously',
  'Reviewer Response Intake',
]) {
  requirePhrase(routingIndex, phrase, 'reviewer routing index');
}

requirePhrase(redaction, 'Redaction Required Before Reviewer Packet Leaves Local Repo', 'reviewer packet redaction checklist');
requirePhrase(mappingMatrix, 'Reviewer Question Mapping Matrix', 'reviewer question mapping matrix');
requirePhrase(mappingMatrix, 'BLOCKED_NO_OUTREACH', 'reviewer question mapping matrix');
requirePhrase(responseIntake, 'No reviewer response is recorded yet', 'reviewer response intake template');
requirePhrase(responseSummary, 'No reviewer response is recorded yet', 'reviewer response summary shell');

const blockedPatterns = [
  /\bprovider response exists\b/i,
  /\bpublic publication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\bfounder clearance recorded\b/i,
  /\blegal clearance recorded\b/i,
  /\bprovider clearance recorded\b/i,
  /\blive-action clearance recorded\b/i,
  /\bpartnership commitment recorded\b/i,
  /\blive action approved\b/i,
];

for (const pattern of blockedPatterns) {
  if (pattern.test(matrix)) {
    errors.push(`provider question status matrix contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Provider Question Status Matrix') || content.includes('READY_FOR_FOUNDER_ROUTING')) {
    errors.push(`${label} appears to contain internal provider question status matrix content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 provider question status matrix validation passed');
