import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  intake: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-intake-template.md'),
  handoffMap: path.join(root, 'docs', 'whitepaper-v1-3-provider-handoff-packet-map.md'),
  providerQuestions: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-register.md'),
  providerStatus: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-status-matrix.md'),
  responseRouting: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-routing-checklist.md'),
  responseEvidenceLog: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-evidence-log.md'),
  responseSummaryShell: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-summary-shell.md'),
  sendReadiness: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-send-readiness-checklist.md'),
  questionMapping: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-question-mapping-matrix.md'),
  publicationStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
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

const intake = readRequired('provider response intake template', files.intake);
const handoffMap = readRequired('provider handoff packet map', files.handoffMap);
const providerQuestions = readRequired('provider question register', files.providerQuestions);
const providerStatus = readRequired('provider question status matrix', files.providerStatus);
const responseRouting = readRequired('provider response routing checklist', files.responseRouting);
const responseEvidenceLog = readRequired('provider response evidence log', files.responseEvidenceLog);
const responseSummaryShell = readRequired('provider response summary shell', files.responseSummaryShell);
const sendReadiness = readRequired('reviewer packet send readiness checklist', files.sendReadiness);
const questionMapping = readRequired('reviewer question mapping matrix', files.questionMapping);
const publicationStatus = readRequired('publication evidence current status', files.publicationStatus);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Provider Response Intake Template',
  'Status: internal provider response intake template',
  'No provider response is recorded yet',
  'Intake Record',
  'Required Provider Findings',
  'Routing Rules',
  'Safe Recording Rules',
  'Cross References',
  'Stop Boundary',
  'HOLD / REVISE / QUESTION_ONLY / BLOCK_FOR_LIVE_USE / NO_GO',
  'live action approved? | NO by default',
  'public publication approved? | NO by default',
  'provider commitment recorded? | NO by default',
  'legal/provider clearance recorded? | NO by default',
]) {
  requirePhrase(intake, phrase, 'provider response intake template');
}

for (const providerCategory of [
  'escrow provider',
  'lender',
  'KYC-KYB-AML provider',
  'payment processor',
  'insurance-bonding provider',
  'valuation-appraisal provider',
  'Web3 audit reviewer',
  'FIO UX reviewer',
  'XPR-WebAuth-Metallicus technical reviewer',
  'attorney reviewer',
]) {
  requirePhrase(intake, providerCategory, 'provider response intake template');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-provider-handoff-packet-map.md',
  'docs/whitepaper-v1-3-provider-question-register.md',
  'docs/whitepaper-v1-3-provider-question-status-matrix.md',
  'docs/whitepaper-v1-3-provider-response-routing-checklist.md',
  'docs/whitepaper-v1-3-provider-response-evidence-log.md',
  'docs/whitepaper-v1-3-provider-response-summary-shell.md',
  'docs/whitepaper-v1-3-reviewer-packet-send-readiness-checklist.md',
  'docs/whitepaper-v1-3-reviewer-question-mapping-matrix.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
]) {
  requirePhrase(intake, fileReference, 'provider response intake template');
}

requirePhrase(handoffMap, 'Provider Handoff Packet Map', 'provider handoff packet map');
requirePhrase(handoffMap, 'PENDING_PROVIDER_REVIEW', 'provider handoff packet map');
requirePhrase(providerQuestions, 'Use Rule', 'provider question register');
requirePhrase(providerStatus, 'No provider response is recorded yet', 'provider question status matrix');
requirePhrase(responseRouting, 'Provider Response Routing Checklist', 'provider response routing checklist');
requirePhrase(responseRouting, 'No-Shortcut Rules', 'provider response routing checklist');
requirePhrase(responseEvidenceLog, 'Provider Response Evidence Log', 'provider response evidence log');
requirePhrase(responseEvidenceLog, 'No provider response evidence is recorded yet', 'provider response evidence log');
requirePhrase(responseEvidenceLog, 'docs/whitepaper-v1-3-provider-response-intake-template.md', 'provider response evidence log');
requirePhrase(responseSummaryShell, 'Provider Response Summary Shell', 'provider response summary shell');
requirePhrase(responseSummaryShell, 'No provider response summary is recorded yet', 'provider response summary shell');
requirePhrase(responseSummaryShell, 'docs/whitepaper-v1-3-provider-response-intake-template.md', 'provider response summary shell');
requirePhrase(sendReadiness, 'BLOCKED_NO_SEND', 'reviewer packet send readiness checklist');
requirePhrase(questionMapping, 'BLOCKED_NO_OUTREACH', 'reviewer question mapping matrix');
requirePhrase(publicationStatus, 'legal/provider review | PENDING', 'publication evidence current status');

for (const pattern of [
  /\bprovider response recorded\b/i,
  /\bpublic publication approved\?\s*\|\s*YES\b/i,
  /\blive action approved\?\s*\|\s*YES\b/i,
  /\bprovider commitment recorded\?\s*\|\s*YES\b/i,
  /\blegal\/provider clearance recorded\?\s*\|\s*YES\b/i,
  /\blegal conclusion recorded\b/i,
  /\bpartnership approved\b/i,
  /\bproduction integration approved\b/i,
]) {
  rejectPattern(intake, pattern, 'provider response intake template');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Provider Response Intake Template') || content.includes('Required Provider Findings')) {
    errors.push(`${label} appears to contain internal provider response intake content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 provider response intake validation passed');
