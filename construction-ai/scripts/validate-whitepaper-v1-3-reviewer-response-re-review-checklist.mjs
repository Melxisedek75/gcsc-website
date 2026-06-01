import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  checklist: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-re-review-checklist.md'),
  intake: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-intake-template.md'),
  summary: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-summary-shell.md'),
  changeRequestQueue: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-change-request-queue.md'),
  localRevisionEvidenceLog: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-local-revision-evidence-log.md'),
  routingCloseout: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-routing-closeout.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  sendReadiness: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-send-readiness-checklist.md'),
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

const checklist = readRequired('reviewer response re-review checklist', files.checklist);
const intake = readRequired('reviewer response intake template', files.intake);
const summary = readRequired('reviewer response summary shell', files.summary);
const changeRequestQueue = readRequired('reviewer response change request queue', files.changeRequestQueue);
const localRevisionEvidenceLog = readRequired('reviewer response local revision evidence log', files.localRevisionEvidenceLog);
const routingCloseout = readRequired('reviewer response routing closeout', files.routingCloseout);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const sendReadiness = readRequired('reviewer packet send readiness checklist', files.sendReadiness);
const founderReadyRollup = readRequired('founder-ready packet status rollup', files.founderReadyRollup);
const internalReviewMasterIndex = readRequired('internal review master index', files.internalReviewMasterIndex);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Reviewer Response Re-Review Checklist',
  'No reviewer response is recorded yet',
  'No change request is active',
  'No re-review packet is ready',
  'Current Re-Review State',
  'Required Before Re-Review',
  'Re-Review Rows Template',
  'Allowed Re-Review Outcomes',
  'Required Cross References',
  'No Shortcut Rules',
  'Stop Boundary',
  'NO_RESPONSE_RECORDED',
  'PENDING_RESPONSE_INTAKE',
  'PENDING_RESPONSE_SUMMARY',
  'QUEUE_NOT_ACTIVE',
  'LOCAL_REVISION_NOT_STARTED',
  'REREVIEW_NOT_READY',
  'PUBLICATION_STILL_NO_GO',
  'LIVE_ACTION_STILL_BLOCKED',
  'V13-RRV-001',
  'PUBLIC_SAFE_WORDING_ONLY',
]) {
  requirePhrase(checklist, phrase, 'reviewer response re-review checklist');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-reviewer-response-intake-template.md',
  'docs/whitepaper-v1-3-reviewer-response-summary-shell.md',
  'docs/whitepaper-v1-3-reviewer-response-change-request-queue.md',
  'docs/whitepaper-v1-3-reviewer-response-local-revision-evidence-log.md',
  'docs/whitepaper-v1-3-reviewer-response-routing-closeout.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-reviewer-packet-send-readiness-checklist.md',
  'docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md',
  'docs/whitepaper-v1-3-internal-review-master-index.md',
]) {
  requirePhrase(checklist, fileReference, 'reviewer response re-review checklist');
}

requirePhrase(intake, 'No reviewer response is recorded yet', 'reviewer response intake template');
requirePhrase(summary, 'docs/whitepaper-v1-3-reviewer-response-re-review-checklist.md', 'reviewer response summary shell');
requirePhrase(changeRequestQueue, 'docs/whitepaper-v1-3-reviewer-response-re-review-checklist.md', 'reviewer response change request queue');
requirePhrase(localRevisionEvidenceLog, 'Reviewer Response Local Revision Evidence Log', 'reviewer response local revision evidence log');
requirePhrase(localRevisionEvidenceLog, 'REVISION_EVIDENCE_NOT_RECORDED', 'reviewer response local revision evidence log');
requirePhrase(routingCloseout, 'docs/whitepaper-v1-3-reviewer-response-re-review-checklist.md', 'reviewer response routing closeout');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(evidenceStatus, 'reviewer response re-review checklist validator | PASS_LOCAL_CHECKLIST', 'publication evidence current status');
requirePhrase(evidenceStatus, 'reviewer response re-review checklist | PENDING_RESPONSE_INTAKE', 'publication evidence current status');
requirePhrase(sendReadiness, 'BLOCKED_NO_SEND', 'reviewer packet send readiness checklist');
requirePhrase(founderReadyRollup, 'reviewer response re-review checklist | READY_LOCAL_CHECKLIST_PENDING_RESPONSE_INTAKE', 'founder-ready packet status rollup');
requirePhrase(founderReadyRollup, 'reviewer response re-review checklist | PENDING_RESPONSE_INTAKE', 'founder-ready packet status rollup');
requirePhrase(internalReviewMasterIndex, 'reviewer response re-review checklist | local checklist only / no reviewer response recorded', 'internal review master index');

for (const pattern of [
  /\bre-review approved for outreach\b/i,
  /\breviewer outreach approved\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blegal clearance recorded\b/i,
  /\bprovider clearance recorded\b/i,
  /\blive action approved\b/i,
  /\bpartnership commitment recorded\b/i,
]) {
  rejectPattern(checklist, pattern, 'reviewer response re-review checklist');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Reviewer Response Re-Review Checklist') || content.includes('V13-RRV-001')) {
    errors.push(`${label} appears to contain internal reviewer response re-review checklist content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 reviewer response re-review checklist validation passed');
