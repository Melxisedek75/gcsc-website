import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  queue: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-change-request-queue.md'),
  intake: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-intake-template.md'),
  summary: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-summary-shell.md'),
  routingCloseout: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-routing-closeout.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  founderReadyRollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  internalReviewMasterIndex: path.join(root, 'docs', 'whitepaper-v1-3-internal-review-master-index.md'),
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
    errors.push(`${label} contains blocked approval phrase: ${pattern.source}`);
  }
}

const queue = readRequired('reviewer response change request queue', files.queue);
const intake = readRequired('reviewer response intake template', files.intake);
const summary = readRequired('reviewer response summary shell', files.summary);
const routingCloseout = readRequired('reviewer response routing closeout', files.routingCloseout);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const founderReadyRollup = readRequired('founder-ready packet status rollup', files.founderReadyRollup);
const internalReviewMasterIndex = readRequired('internal review master index', files.internalReviewMasterIndex);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Reviewer Response Change Request Queue',
  'No reviewer response is recorded yet',
  'No change request is active',
  'Current Queue State',
  'Change Request Intake Rules',
  'Change Request Rows Template',
  'Required Cross References',
  'No Shortcut Rules',
  'Stop Boundary',
  'NO_RESPONSE_RECORDED',
  'PENDING_RESPONSE_INTAKE',
  'PENDING_RESPONSE_SUMMARY',
  'QUEUE_NOT_ACTIVE',
  'LOCAL_REVISION_ONLY',
  'PUBLICATION_STILL_NO_GO',
  'LIVE_ACTION_STILL_BLOCKED',
  'V13-RCR-001',
  'V13-RCR-002',
  'V13-RCR-003',
]) {
  requirePhrase(queue, phrase, 'reviewer response change request queue');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-reviewer-response-intake-template.md',
  'docs/whitepaper-v1-3-reviewer-response-summary-shell.md',
  'docs/whitepaper-v1-3-reviewer-response-routing-closeout.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md',
  'docs/whitepaper-v1-3-internal-review-master-index.md',
]) {
  requirePhrase(queue, fileReference, 'reviewer response change request queue');
}

requirePhrase(intake, 'No reviewer response is recorded yet', 'reviewer response intake template');
requirePhrase(summary, 'Required Changes Queue', 'reviewer response summary shell');
requirePhrase(summary, 'docs/whitepaper-v1-3-reviewer-response-change-request-queue.md', 'reviewer response summary shell');
requirePhrase(routingCloseout, 'docs/whitepaper-v1-3-reviewer-response-change-request-queue.md', 'reviewer response routing closeout');
requirePhrase(routingCloseout, 'change request queue', 'reviewer response routing closeout');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(evidenceStatus, 'reviewer response change request queue validator | PASS_LOCAL_QUEUE', 'publication evidence current status');
requirePhrase(evidenceStatus, 'reviewer response change request queue | PENDING_RESPONSE_INTAKE', 'publication evidence current status');
requirePhrase(founderReadyRollup, 'reviewer response change request queue | READY_LOCAL_QUEUE_PENDING_RESPONSE_INTAKE', 'founder-ready packet status rollup');
requirePhrase(founderReadyRollup, 'reviewer response change request queue | PENDING_RESPONSE_INTAKE', 'founder-ready packet status rollup');
requirePhrase(internalReviewMasterIndex, 'reviewer response change request queue | local queue only / no reviewer response recorded', 'internal review master index');

for (const pattern of [
  /\bchange request approved for publication\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blegal clearance recorded\b/i,
  /\bprovider clearance recorded\b/i,
  /\blive action approved\b/i,
  /\bpartnership commitment recorded\b/i,
]) {
  rejectPattern(queue, pattern, 'reviewer response change request queue');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Reviewer Response Change Request Queue') || content.includes('V13-RCR-001')) {
    errors.push(`${label} appears to contain internal reviewer response change request queue content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 reviewer response change request queue validation passed');
