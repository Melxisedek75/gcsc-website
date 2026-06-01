import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  gate: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-draft-qa-routing-gate.md'),
  intake: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-intake-template.md'),
  summary: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-summary-shell.md'),
  changeRequestQueue: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-change-request-queue.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  localRevisionEvidenceLog: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-local-revision-evidence-log.md'),
  reReviewChecklist: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-re-review-checklist.md'),
  routingCloseout: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-routing-closeout.md'),
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

const gate = readRequired('reviewer response draft QA routing gate', files.gate);
const intake = readRequired('reviewer response intake template', files.intake);
const summary = readRequired('reviewer response summary shell', files.summary);
const changeRequestQueue = readRequired('reviewer response change request queue', files.changeRequestQueue);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const localRevisionEvidenceLog = readRequired('reviewer response local revision evidence log', files.localRevisionEvidenceLog);
const reReviewChecklist = readRequired('reviewer response re-review checklist', files.reReviewChecklist);
const routingCloseout = readRequired('reviewer response routing closeout', files.routingCloseout);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const founderReadyRollup = readRequired('founder-ready packet status rollup', files.founderReadyRollup);
const internalReviewMasterIndex = readRequired('internal review master index', files.internalReviewMasterIndex);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Reviewer Response Draft QA Routing Gate',
  'No reviewer response is recorded yet',
  'No draft QA issue from reviewer response is active',
  'Current Gate State',
  'Required Routing Sequence',
  'Draft QA Routing Rows Template',
  'Routing Rules',
  'Required Cross References',
  'No Shortcut Rules',
  'Stop Boundary',
  'NO_RESPONSE_RECORDED',
  'PENDING_RESPONSE_INTAKE',
  'PENDING_RESPONSE_SUMMARY',
  'QUEUE_NOT_ACTIVE',
  'DRAFT_QA_ROUTING_NOT_ACTIVE',
  'DRAFT_QA_ISSUE_NOT_LINKED',
  'REVISION_EVIDENCE_NOT_RECORDED',
  'REREVIEW_NOT_READY',
  'PUBLICATION_STILL_NO_GO',
  'LIVE_ACTION_STILL_BLOCKED',
  'V13-RQA-001',
]) {
  requirePhrase(gate, phrase, 'reviewer response draft QA routing gate');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-reviewer-response-intake-template.md',
  'docs/whitepaper-v1-3-reviewer-response-summary-shell.md',
  'docs/whitepaper-v1-3-reviewer-response-change-request-queue.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-reviewer-response-local-revision-evidence-log.md',
  'docs/whitepaper-v1-3-reviewer-response-re-review-checklist.md',
  'docs/whitepaper-v1-3-reviewer-response-routing-closeout.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md',
  'docs/whitepaper-v1-3-internal-review-master-index.md',
]) {
  requirePhrase(gate, fileReference, 'reviewer response draft QA routing gate');
}

requirePhrase(intake, 'No reviewer response is recorded yet', 'reviewer response intake template');
requirePhrase(summary, 'Reviewer Response Summary Shell', 'reviewer response summary shell');
requirePhrase(changeRequestQueue, 'docs/whitepaper-v1-3-reviewer-response-draft-qa-routing-gate.md', 'reviewer response change request queue');
requirePhrase(issueRegister, 'docs/whitepaper-v1-3-reviewer-response-draft-qa-routing-gate.md', 'draft QA issue register');
requirePhrase(localRevisionEvidenceLog, 'docs/whitepaper-v1-3-reviewer-response-draft-qa-routing-gate.md', 'reviewer response local revision evidence log');
requirePhrase(reReviewChecklist, 'docs/whitepaper-v1-3-reviewer-response-draft-qa-routing-gate.md', 'reviewer response re-review checklist');
requirePhrase(routingCloseout, 'docs/whitepaper-v1-3-reviewer-response-draft-qa-routing-gate.md', 'reviewer response routing closeout');
requirePhrase(evidenceStatus, 'reviewer response draft QA routing gate validator | PASS_LOCAL_GATE', 'publication evidence current status');
requirePhrase(evidenceStatus, 'reviewer response draft QA routing gate | PENDING_RESPONSE_INTAKE', 'publication evidence current status');
requirePhrase(founderReadyRollup, 'reviewer response draft QA routing gate | READY_LOCAL_GATE_PENDING_RESPONSE_INTAKE', 'founder-ready packet status rollup');
requirePhrase(founderReadyRollup, 'reviewer response draft QA routing gate | PENDING_RESPONSE_INTAKE', 'founder-ready packet status rollup');
requirePhrase(internalReviewMasterIndex, 'reviewer response draft QA routing gate | local routing gate only / no reviewer response recorded', 'internal review master index');

for (const pattern of [
  /\bdraft QA routing approved for publication\b/i,
  /\breviewer outreach approved\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blegal clearance recorded\b/i,
  /\bprovider clearance recorded\b/i,
  /\blive action approved\b/i,
  /\bpartnership commitment recorded\b/i,
]) {
  rejectPattern(gate, pattern, 'reviewer response draft QA routing gate');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Reviewer Response Draft QA Routing Gate') || content.includes('V13-RQA-001')) {
    errors.push(`${label} appears to contain internal reviewer response draft QA routing gate content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 reviewer response draft QA routing gate validation passed');
