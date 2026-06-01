import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  routing: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-evidence-archive-external-record-request-closeout-handoff-closeout-routing.md'),
  closeoutHandoffCloseout: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-evidence-archive-external-record-request-closeout-handoff-closeout.md'),
  closeoutHandoff: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-evidence-archive-external-record-request-closeout-handoff.md'),
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
  responseRouting: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-routing-checklist.md'),
  evidenceLog: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-evidence-log.md'),
  summaryShell: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-summary-shell.md'),
  actionQueue: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-action-queue.md'),
  publicationStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  founderReadyRollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  masterIndex: path.join(root, 'docs', 'whitepaper-v1-3-internal-review-master-index.md'),
  publicWhitepaper: path.join(root, 'whitepaper.html'),
  publicHomepage: path.join(root, 'index.html'),
};

const errors = [];
const routingReference = 'docs/whitepaper-v1-3-provider-response-decision-evidence-archive-external-record-request-closeout-handoff-closeout-routing.md';

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

const routing = readRequired('provider response decision evidence archive external record request closeout handoff closeout routing', files.routing);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

[
  'Provider Response Decision Evidence Archive External Record Request Closeout Handoff Closeout Routing',
  'Status: internal provider-response decision evidence archive external record request closeout handoff closeout routing',
  'No provider response decision evidence archive external record request closeout handoff closeout routing is recorded yet',
  'External Record Request Closeout Handoff Closeout Routing Preconditions',
  'External Record Request Closeout Handoff Closeout Routing Template',
  'V13-PD-EVID-ARCH-EXTREQ-CLOSE-HANDOFF-CLOSE-ROUTE-001',
  'V13-PD-EVID-ARCH-EXTREQ-CLOSE-HANDOFF-CLOSE-001',
  'V13-PD-EVID-ARCH-EXTREQ-CLOSE-HANDOFF-001',
  'V13-PD-EVID-ARCH-EXTREQ-CLOSE-001',
  'V13-PD-EVID-ARCH-EXTREQ-001',
  'Required External Record Request Closeout Handoff Closeout Routing Findings',
  'External Record Request Closeout Handoff Closeout Routing Rules',
  'Safe External Record Request Closeout Handoff Closeout Routing Rules',
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
  'routing destination',
  'founder-controlled routing scope',
  'legal/provider clearance recorded? | NO by default',
  'provider commitment recorded? | NO by default',
  'outreach approved? | NO by default',
  'production release approved? | NO by default',
  'live action approved? | NO by default',
].forEach((phrase) => requirePhrase(routing, phrase, 'provider response decision evidence archive external record request closeout handoff closeout routing'));

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
  'finance provider reviewer',
  'security reviewer',
  'product owner',
].forEach((category) => requirePhrase(routing, category, 'provider response decision evidence archive external record request closeout handoff closeout routing'));

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
  'docs/whitepaper-v1-3-provider-response-decision-evidence-archive-external-record-request-closeout.md',
  'docs/whitepaper-v1-3-provider-response-decision-evidence-archive-external-record-request-closeout-handoff.md',
  'docs/whitepaper-v1-3-provider-response-decision-evidence-archive-external-record-request-closeout-handoff-closeout.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md',
  'docs/whitepaper-v1-3-internal-review-master-index.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-reviewer-response-change-request-queue.md',
].forEach((fileReference) => requirePhrase(routing, fileReference, 'provider response decision evidence archive external record request closeout handoff closeout routing'));

for (const [label, filePath] of Object.entries(files)) {
  if (['routing', 'publicationStatus', 'founderReadyRollup', 'masterIndex', 'publicWhitepaper', 'publicHomepage'].includes(label)) continue;
  const content = readRequired(label, filePath);
  requirePhrase(content, routingReference, label);
}

const publicationStatus = readRequired('publication evidence current status', files.publicationStatus);
const founderReadyRollup = readRequired('founder-ready packet status rollup', files.founderReadyRollup);
const masterIndex = readRequired('internal review master index', files.masterIndex);

requirePhrase(publicationStatus, 'provider response decision evidence archive external record request closeout handoff closeout routing | PENDING_FOUNDER_REQUEST_SCOPE', 'publication evidence current status');
requirePhrase(founderReadyRollup, 'provider response decision evidence archive external record request closeout handoff closeout routing | PENDING_FOUNDER_REQUEST_SCOPE', 'founder-ready packet status rollup');
requirePhrase(masterIndex, 'provider response decision evidence archive external record request closeout handoff closeout routing | local external record request closeout handoff closeout routing template only / no provider response decision evidence archive external record request closeout handoff closeout routing recorded', 'internal review master index');

[
  /\bprovider response decision evidence archive external record request closeout handoff closeout routing approved\b/i,
  /\bprovider response decision evidence archive external record request sent\b/i,
  /\bpublic publication approved\?\s*\|\s*YES\b/i,
  /\bpublic replacement approved\b/i,
  /\blive action approved\?\s*\|\s*YES\b/i,
  /\blegal\/provider clearance recorded\?\s*\|\s*YES\b/i,
  /\bprovider commitment recorded\?\s*\|\s*YES\b/i,
  /\bpartnership approved\b/i,
  /\bproduction release approved\?\s*\|\s*YES\b/i,
  /\boutreach approved\?\s*\|\s*YES\b/i,
].forEach((pattern) => rejectPattern(routing, pattern, 'provider response decision evidence archive external record request closeout handoff closeout routing'));

for (const [content, label] of [
  [publicWhitepaper, 'public whitepaper'],
  [publicHomepage, 'public homepage'],
]) {
  if (content.includes('Provider Response Decision Evidence Archive External Record Request Closeout Handoff Closeout Routing') || content.includes('V13-PD-EVID-ARCH-EXTREQ-CLOSE-HANDOFF-CLOSE-ROUTE-001')) {
    errors.push(`${label} appears to contain internal provider response decision evidence archive external record request closeout handoff closeout routing content`);
  }
}

if (errors.length > 0) {
  console.error('whitepaper v1.3 provider response decision evidence archive external record request closeout handoff closeout routing validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('whitepaper v1.3 provider response decision evidence archive external record request closeout handoff closeout routing validation passed');
