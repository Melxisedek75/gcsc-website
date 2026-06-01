import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  closeout: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-routing-closeout.md'),
  intake: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-intake-template.md'),
  summary: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-summary-shell.md'),
  packetStatus: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-status-rollup.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  publicationEvidence: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  publicationGoRecord: path.join(root, 'docs', 'whitepaper-v1-3-publication-go-record-template.md'),
  stateTransitionMatrix: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-state-transition-matrix.md'),
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

const closeout = readRequired('reviewer response routing closeout', files.closeout);
const intake = readRequired('reviewer response intake template', files.intake);
const summary = readRequired('reviewer response summary shell', files.summary);
const packetStatus = readRequired('reviewer packet status rollup', files.packetStatus);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const publicationEvidence = readRequired('publication evidence current status', files.publicationEvidence);
const publicationGoRecord = readRequired('publication GO record template', files.publicationGoRecord);
const stateTransitionMatrix = readRequired('founder review state transition matrix', files.stateTransitionMatrix);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Reviewer Response Routing Closeout',
  'No reviewer response is recorded yet',
  'Closeout State',
  'Response Decision Routing',
  'Required Evidence Before Any State Change',
  'Blocked Inference Rules',
  'Linked Controls',
  'Stop Boundary',
  'NO_RESPONSE_RECORDED',
  'RESPONSE_INTAKE_REQUIRED',
  'SUMMARY_REQUIRED_AFTER_INTAKE',
  'LOCAL_REVISION_ONLY',
  'PUBLICATION_STILL_NO_GO',
  'LIVE_ACTION_STILL_BLOCKED',
]) {
  requirePhrase(closeout, phrase, 'reviewer response routing closeout');
}

for (const decision of [
  'HOLD',
  'REVISE',
  'APPROVE_PUBLIC_SAFE_WORDING',
  'BLOCK_FOR_LIVE_USE',
  'NO_GO',
]) {
  requirePhrase(closeout, decision, 'reviewer response routing closeout');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-reviewer-response-intake-template.md',
  'docs/whitepaper-v1-3-reviewer-response-summary-shell.md',
  'docs/whitepaper-v1-3-reviewer-packet-status-rollup.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-publication-go-record-template.md',
  'docs/whitepaper-v1-3-founder-review-state-transition-matrix.md',
]) {
  requirePhrase(closeout, fileReference, 'reviewer response routing closeout');
}

requirePhrase(intake, 'No reviewer response is recorded yet', 'reviewer response intake template');
requirePhrase(summary, 'No reviewer response is recorded yet', 'reviewer response summary shell');
requirePhrase(packetStatus, 'No reviewer response is recorded yet', 'reviewer packet status rollup');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(publicationEvidence, 'Current decision: NO-GO', 'publication evidence current status');
requirePhrase(publicationGoRecord, 'Current decision | NO-GO by default', 'publication GO record template');
requirePhrase(stateTransitionMatrix, 'NO_GO_PUBLICATION_DEFAULT', 'founder review state transition matrix');

const blockedApprovalPatterns = [
  /\bpublication approval recorded\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blegal conclusion recorded\b/i,
  /\bprovider commitment recorded\b/i,
  /\blive action approved\b/i,
  /\bpartnership approved\b/i,
  /\bproduction Web3 approved\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(closeout)) {
    errors.push(`reviewer response routing closeout contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Reviewer Response Routing Closeout') || content.includes('Closeout State')) {
    errors.push(`${label} appears to contain internal reviewer response routing content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 reviewer response routing closeout validation passed');
