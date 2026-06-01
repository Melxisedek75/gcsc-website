import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  routingCloseout: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-evidence-archive-external-record-request-closeout-handoff-closeout-routing-closeout.md'),
  routing: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-evidence-archive-external-record-request-closeout-handoff-closeout-routing.md'),
  closeoutHandoffCloseout: path.join(root, 'docs', 'whitepaper-v1-3-provider-response-decision-evidence-archive-external-record-request-closeout-handoff-closeout.md'),
  publicationStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  founderReadyRollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  masterIndex: path.join(root, 'docs', 'whitepaper-v1-3-internal-review-master-index.md'),
  publicWhitepaper: path.join(root, 'whitepaper.html'),
  publicHomepage: path.join(root, 'index.html'),
};

const errors = [];
const routingCloseoutReference = 'docs/whitepaper-v1-3-provider-response-decision-evidence-archive-external-record-request-closeout-handoff-closeout-routing-closeout.md';

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

const routingCloseout = readRequired('provider response decision evidence archive external record request closeout handoff closeout routing closeout', files.routingCloseout);
const routing = readRequired('provider response decision evidence archive external record request closeout handoff closeout routing', files.routing);
const closeoutHandoffCloseout = readRequired('provider response decision evidence archive external record request closeout handoff closeout', files.closeoutHandoffCloseout);
const publicationStatus = readRequired('publication evidence current status', files.publicationStatus);
const founderReadyRollup = readRequired('founder-ready packet status rollup', files.founderReadyRollup);
const masterIndex = readRequired('internal review master index', files.masterIndex);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

[
  'Provider Response Decision Evidence Archive External Record Request Closeout Handoff Closeout Routing Closeout',
  'Status: internal provider-response decision evidence archive external record request closeout handoff closeout routing closeout',
  'No provider response decision evidence archive external record request closeout handoff closeout routing closeout is recorded yet',
  'External Record Request Closeout Handoff Closeout Routing Closeout Preconditions',
  'External Record Request Closeout Handoff Closeout Routing Closeout Template',
  'V13-PD-EVID-ARCH-EXTREQ-CLOSE-HANDOFF-CLOSE-ROUTE-CLOSE-001',
  'V13-PD-EVID-ARCH-EXTREQ-CLOSE-HANDOFF-CLOSE-ROUTE-001',
  'V13-PD-EVID-ARCH-EXTREQ-CLOSE-HANDOFF-CLOSE-001',
  'Required External Record Request Closeout Handoff Closeout Routing Closeout Findings',
  'External Record Request Closeout Handoff Closeout Routing Closeout Rules',
  'Safe External Record Request Closeout Handoff Closeout Routing Closeout Rules',
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
  'NEEDS_FOUNDER_CLOSEOUT',
  'NEEDS_PROVIDER_REVIEW',
  'BLOCKED_FOR_LIVE',
  'NO_GO_RECORDED',
  'BLOCKED_NO_OUTREACH',
  'LOCAL_ONLY_PENDING_REDACTION_REVIEW',
  'PENDING_REDACTION_REVIEW',
  'NO_GO',
  'routing closeout destination',
  'founder-controlled routing closeout scope',
  'legal/provider clearance recorded? | NO by default',
  'provider commitment recorded? | NO by default',
  'outreach approved? | NO by default',
  'production release approved? | NO by default',
  'live action approved? | NO by default',
].forEach((phrase) => requirePhrase(routingCloseout, phrase, 'provider response decision evidence archive external record request closeout handoff closeout routing closeout'));

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
].forEach((category) => requirePhrase(routingCloseout, category, 'provider response decision evidence archive external record request closeout handoff closeout routing closeout'));

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
  'docs/whitepaper-v1-3-provider-response-decision-evidence-archive-external-record-request-closeout-handoff-closeout-routing.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md',
  'docs/whitepaper-v1-3-internal-review-master-index.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-reviewer-response-change-request-queue.md',
].forEach((fileReference) => requirePhrase(routingCloseout, fileReference, 'provider response decision evidence archive external record request closeout handoff closeout routing closeout'));

requirePhrase(routing, routingCloseoutReference, 'provider response decision evidence archive external record request closeout handoff closeout routing');
requirePhrase(closeoutHandoffCloseout, 'docs/whitepaper-v1-3-provider-response-decision-evidence-archive-external-record-request-closeout-handoff-closeout-routing.md', 'provider response decision evidence archive external record request closeout handoff closeout');
requirePhrase(publicationStatus, 'provider response decision evidence archive external record request closeout handoff closeout routing closeout | PENDING_FOUNDER_REQUEST_SCOPE', 'publication evidence current status');
requirePhrase(founderReadyRollup, 'provider response decision evidence archive external record request closeout handoff closeout routing closeout | PENDING_FOUNDER_REQUEST_SCOPE', 'founder-ready packet status rollup');
requirePhrase(masterIndex, 'provider response decision evidence archive external record request closeout handoff closeout routing closeout | local external record request closeout handoff closeout routing closeout template only / no provider response decision evidence archive external record request closeout handoff closeout routing closeout recorded', 'internal review master index');

[
  /\bprovider response decision evidence archive external record request closeout handoff closeout routing closeout approved\b/i,
  /\bprovider response decision evidence archive external record request sent\b/i,
  /\bpublic publication approved\?\s*\|\s*YES\b/i,
  /\bpublic replacement approved\b/i,
  /\blive action approved\?\s*\|\s*YES\b/i,
  /\blegal\/provider clearance recorded\?\s*\|\s*YES\b/i,
  /\bprovider commitment recorded\?\s*\|\s*YES\b/i,
  /\bpartnership approved\b/i,
  /\bproduction release approved\?\s*\|\s*YES\b/i,
  /\boutreach approved\?\s*\|\s*YES\b/i,
].forEach((pattern) => rejectPattern(routingCloseout, pattern, 'provider response decision evidence archive external record request closeout handoff closeout routing closeout'));

for (const [content, label] of [
  [publicWhitepaper, 'public whitepaper'],
  [publicHomepage, 'public homepage'],
]) {
  if (content.includes('Provider Response Decision Evidence Archive External Record Request Closeout Handoff Closeout Routing Closeout') || content.includes('V13-PD-EVID-ARCH-EXTREQ-CLOSE-HANDOFF-CLOSE-ROUTE-CLOSE-001')) {
    errors.push(`${label} appears to contain internal provider response decision evidence archive external record request closeout handoff closeout routing closeout content`);
  }
}

if (errors.length > 0) {
  console.error('whitepaper v1.3 provider response decision evidence archive external record request closeout handoff closeout routing closeout validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('whitepaper v1.3 provider response decision evidence archive external record request closeout handoff closeout routing closeout validation passed');
