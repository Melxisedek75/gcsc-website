import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  externalRecordRequestCloseout: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-evidence-archive-external-record-request-closeout.md'),
  externalRecordRequest: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-evidence-archive-external-record-request.md'),
  archiveHandoffCloseout: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-evidence-archive-handoff-closeout.md'),
  archiveHandoff: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-evidence-archive-handoff.md'),
  archiveIndexCloseout: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-evidence-archive-index-closeout.md'),
  archiveIndex: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-evidence-archive-index.md'),
  decisionEvidenceArchive: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-evidence-archive.md'),
  decisionEvidenceCloseout: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-evidence-closeout.md'),
  decisionEvidenceSummary: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-evidence-summary.md'),
  decisionEvidenceIntake: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-evidence-intake.md'),
  decisionEvidenceTemplate: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-evidence-template.md'),
  decisionRegister: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-register.md'),
  intake: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-intake-template.md'),
  routing: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-routing-checklist.md'),
  evidenceLog: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-evidence-log.md'),
  summaryShell: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-summary-shell.md'),
  actionQueue: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-action-queue.md'),
  publicationStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  founderReadyRollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  masterIndex: path.join(root, 'docs', 'whitepaper-v1-3-internal-review-master-index.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  changeRequestQueue: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-change-request-queue.md'),
  publicWhitepaper: path.join(root, 'whitepaper.html'),
  publicHomepage: path.join(root, 'index.html'),
};

const errors = [];

function readRequired(label, filePath) {
  if (!fs.existsSync(filePath)) {
    errors.push(`${label} missing: ${path.relative(root, filePath)}`);
    return '';
  }

  return fs.readFileSync(filePath, 'utf8');
}

function requirePhrase(content, phrase, label) {
  if (!content.includes(phrase)) {
    errors.push(`${label} missing required phrase: ${phrase}`);
  }
}

function rejectPattern(content, pattern, label) {
  if (pattern.test(content)) {
    errors.push(`${label} contains forbidden approval phrase: ${pattern.source}`);
  }
}

const externalRecordRequestCloseout = readRequired('provider response decision evidence archive external record request closeout', files.externalRecordRequestCloseout);
const externalRecordRequest = readRequired('provider response decision evidence archive external record request', files.externalRecordRequest);
const archiveHandoffCloseout = readRequired('provider response decision evidence archive handoff closeout', files.archiveHandoffCloseout);
const archiveHandoff = readRequired('provider response decision evidence archive handoff', files.archiveHandoff);
const archiveIndexCloseout = readRequired('provider response decision evidence archive index closeout', files.archiveIndexCloseout);
const archiveIndex = readRequired('provider response decision evidence archive index', files.archiveIndex);
const decisionEvidenceArchive = readRequired('provider response decision evidence archive', files.decisionEvidenceArchive);
const decisionEvidenceCloseout = readRequired('provider response decision evidence closeout', files.decisionEvidenceCloseout);
const decisionEvidenceSummary = readRequired('provider response decision evidence summary', files.decisionEvidenceSummary);
const decisionEvidenceIntake = readRequired('provider response decision evidence intake', files.decisionEvidenceIntake);
const decisionEvidenceTemplate = readRequired('provider response decision evidence template', files.decisionEvidenceTemplate);
const decisionRegister = readRequired('provider response decision register', files.decisionRegister);
const intake = readRequired('provider response intake template', files.intake);
const routing = readRequired('provider response routing checklist', files.routing);
const evidenceLog = readRequired('provider response evidence log', files.evidenceLog);
const summaryShell = readRequired('provider response summary shell', files.summaryShell);
const actionQueue = readRequired('provider response action queue', files.actionQueue);
const publicationStatus = readRequired('publication evidence current status', files.publicationStatus);
const founderReadyRollup = readRequired('founder-ready packet status rollup', files.founderReadyRollup);
const masterIndex = readRequired('internal review master index', files.masterIndex);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const changeRequestQueue = readRequired('reviewer response change request queue', files.changeRequestQueue);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

[
  'Provider Response Decision Evidence Archive External Record Request Closeout',
  'Status: internal provider-response decision evidence archive external record request closeout',
  'No provider response decision evidence archive external record request closeout is recorded yet',
  'External Record Request Closeout Preconditions',
  'External Record Request Closeout Template',
  'V13-PD-EVID-ARCH-EXTREQ-CLOSE-001',
  'V13-PD-EVID-ARCH-EXTREQ-001',
  'V13-PD-EVID-ARCH-HANDOFF-CLOSE-001',
  'V13-PD-EVID-ARCH-HANDOFF-001',
  'V13-PD-EVID-ARCH-IDX-CLOSE-001',
  'V13-PD-EVID-ARCH-IDX-001',
  'V13-PD-EVID-ARCH-001',
  'V13-PD-EVID-CLOSE-001',
  'V13-PD-EVID-SUM-001',
  'V13-PD-EVID-INTAKE-001',
  'V13-PD-EVID-001',
  'V13-PD-001',
  'Required External Record Request Closeout Findings',
  'External Record Request Closeout Routing Rules',
  'Safe External Record Request Closeout Rules',
  'Cross References',
  'No-Shortcut Rules',
  'not publication approval',
  'not live action approval',
  'not legal/provider clearance',
  'not partnership commitment',
  'not provider commitment',
  'not outreach approval',
  'not production release approval',
  'Stop Boundary',
  'PENDING_FOUNDER_REQUEST_SCOPE',
  'PASS_LOCAL_ONLY',
  'NEEDS_LOCAL_REVISION',
  'NEEDS_REDACTION_REVIEW',
  'NEEDS_FOUNDER_ROUTING',
  'NEEDS_PROVIDER_REVIEW',
  'BLOCKED_FOR_LIVE',
  'NO_GO_RECORDED',
  'BLOCKED_NO_OUTREACH',
  'LOCAL_ONLY_PENDING_REDACTION_REVIEW',
  'PENDING_REDACTION_REVIEW',
  'NO_GO',
  'legal/provider clearance recorded? | NO by default',
  'provider commitment recorded? | NO by default',
  'outreach approved? | NO by default',
  'production release approved? | NO by default',
  'live action approved? | NO by default',
].forEach((phrase) => requirePhrase(externalRecordRequestCloseout, phrase, 'provider response decision evidence archive external record request closeout'));

[
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
].forEach((category) => requirePhrase(externalRecordRequestCloseout, category, 'provider response decision evidence archive external record request closeout'));

[
  'docs/whitepaper-v1-3-provider-response-intake-template.md',
  'docs/whitepaper-v1-3-provider-response-evidence-log.md',
  'docs/whitepaper-v1-3-provider-response-summary-shell.md',
  'docs/whitepaper-v1-3-provider-response-routing-checklist.md',
  'docs/whitepaper-v1-3-provider-response-action-queue.md',
  'docs/whitepaper-v1-3-provider-response-decision-register.md',
  'docs/whitepaper-v1-3-provider-response-decision-evidence-template.md',
  'docs/whitepaper-v1-3-provider-response-decision-evidence-intake.md',
  'docs/whitepaper-v1-3-provider-response-decision-evidence-summary.md',
  'docs/whitepaper-v1-3-provider-response-decision-evidence-closeout.md',
  'docs/whitepaper-v1-3-provider-response-decision-evidence-archive.md',
  'docs/whitepaper-v1-3-provider-response-decision-evidence-archive-index.md',
  'docs/whitepaper-v1-3-provider-response-decision-evidence-archive-index-closeout.md',
  'docs/whitepaper-v1-3-provider-response-decision-evidence-archive-handoff.md',
  'docs/whitepaper-v1-3-provider-response-decision-evidence-archive-handoff-closeout.md',
  'docs/whitepaper-v1-3-provider-response-decision-evidence-archive-external-record-request.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md',
  'docs/whitepaper-v1-3-internal-review-master-index.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-reviewer-response-change-request-queue.md',
].forEach((fileReference) => requirePhrase(externalRecordRequestCloseout, fileReference, 'provider response decision evidence archive external record request closeout'));

[
  [externalRecordRequest, 'provider response decision evidence archive external record request'],
  [archiveHandoffCloseout, 'provider response decision evidence archive handoff closeout'],
  [archiveHandoff, 'provider response decision evidence archive handoff'],
  [archiveIndexCloseout, 'provider response decision evidence archive index closeout'],
  [archiveIndex, 'provider response decision evidence archive index'],
  [decisionEvidenceArchive, 'provider response decision evidence archive'],
  [decisionEvidenceCloseout, 'provider response decision evidence closeout'],
  [decisionEvidenceSummary, 'provider response decision evidence summary'],
  [decisionEvidenceIntake, 'provider response decision evidence intake'],
  [decisionEvidenceTemplate, 'provider response decision evidence template'],
  [decisionRegister, 'provider response decision register'],
  [intake, 'provider response intake template'],
  [routing, 'provider response routing checklist'],
  [evidenceLog, 'provider response evidence log'],
  [summaryShell, 'provider response summary shell'],
  [actionQueue, 'provider response action queue'],
].forEach(([content, label]) => {
  requirePhrase(content, 'docs/whitepaper-v1-3-provider-response-decision-evidence-archive-external-record-request-closeout.md', label);
});

requirePhrase(publicationStatus, 'provider response decision evidence archive external record request closeout | PENDING_FOUNDER_REQUEST_SCOPE', 'publication evidence current status');
requirePhrase(founderReadyRollup, 'provider response decision evidence archive external record request closeout | PENDING_FOUNDER_REQUEST_SCOPE', 'founder-ready packet status rollup');
requirePhrase(masterIndex, 'provider response decision evidence archive external record request closeout | local external record request closeout template only / no provider response decision evidence archive external record request closeout recorded', 'internal review master index');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(changeRequestQueue, 'Reviewer Response Change Request Queue', 'reviewer response change request queue');
requirePhrase(changeRequestQueue, 'QUEUE_NOT_ACTIVE', 'reviewer response change request queue');

[
  /\bprovider response decision evidence archive external record request closeout approved\b/i,
  /\bprovider response decision evidence archive external record request sent\b/i,
  /\bpublic publication approved\?\s*\|\s*YES\b/i,
  /\bpublic replacement approved\b/i,
  /\blive action approved\?\s*\|\s*YES\b/i,
  /\blegal\/provider clearance recorded\?\s*\|\s*YES\b/i,
  /\bprovider commitment recorded\?\s*\|\s*YES\b/i,
  /\bpartnership approved\b/i,
  /\bproduction release approved\?\s*\|\s*YES\b/i,
  /\boutreach approved\?\s*\|\s*YES\b/i,
].forEach((pattern) => rejectPattern(externalRecordRequestCloseout, pattern, 'provider response decision evidence archive external record request closeout'));

for (const [content, label] of [
  [publicWhitepaper, 'public whitepaper'],
  [publicHomepage, 'public homepage'],
]) {
  if (content.includes('Provider Response Decision Evidence Archive External Record Request Closeout') || content.includes('V13-PD-EVID-ARCH-EXTREQ-CLOSE-001')) {
    errors.push(`${label} appears to contain internal provider response decision evidence archive external record request closeout content`);
  }
}

if (errors.length > 0) {
  console.error('whitepaper v1.3 provider response decision evidence archive external record request closeout validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('whitepaper v1.3 provider response decision evidence archive external record request closeout validation passed');
