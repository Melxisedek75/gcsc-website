import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  closeout: path.join(root, 'docs', 'whitepaper-v1-3-week-one-closeout-2026-06-06.md'),
  twoWeekPlan: path.join(root, 'docs', 'superpowers', 'plans', '2026-05-31-gcsc-two-week-autonomous-implementation.md'),
  publicationGate: path.join(root, 'docs', 'whitepaper-v1-3-publication-gate.md'),
  masterIndex: path.join(root, 'docs', 'whitepaper-v1-3-internal-review-master-index.md'),
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

const closeout = readRequired('week-one closeout', files.closeout);
const twoWeekPlan = readRequired('two-week plan', files.twoWeekPlan);
const publicationGate = readRequired('publication gate', files.publicationGate);
const masterIndex = readRequired('internal review master index', files.masterIndex);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: in-progress week-one closeout draft',
  'Completed Safe Tasks',
  'Validators Run',
  'Current Decision State',
  'Public / Live / Legal / Provider / Money / Web3 Blockers',
  'Week-One Remaining Safe Tasks',
  'Stop Boundary',
  'public `whitepaper.html` replacement | NO-GO',
  'public `index.html` replacement | NO-GO',
]) {
  requirePhrase(closeout, phrase, 'week-one closeout');
}

for (const commitId of [
  'd130151c',
  'ddd0edbd',
  '7df58079',
  '28460a4e',
  'cd3f4b55',
  '8ac3d719',
  '47da9fb1',
  '37f5ed46',
  'd66a6a62',
  'd81ca352',
  '9a397a17',
  '6f1b3509',
  '26eef11e',
  'ea7f0614',
  '6473e9ef',
  '3e13e98c',
  '2fc2b008',
  'bb02e686',
  '25a1c52f',
  '56cf0190',
  'ca16aea5',
  '5c986ae9',
  '0bb9c913',
  '72ade41c',
  '4fbc78b7',
  '861b632c',
  '23b21208',
  '16a5b4bd',
  '7b501c84',
  'eb954791',
  '03beeacf',
  'ab8536a9',
  '4d98d587',
  '387f9373',
  '86ef88d2',
  '800ac929',
  '3c3c8598',
  '2e4af384',
  '0a71986b',
  '1aaf0a5e',
  'f39ba4d3',
  'c5512765',
  'de05817e',
  '079107a2',
  '74af8510',
  '04ed5ee8',
  '9106ab6e',
  '66ba2f79',
  '1f80317f',
  '29858c4f',
  '692cefff',
  'db9c1760',
  '98328ed9',
  '054452ab',
  'a3b0a4fc',
  '8318a7da',
  '3e507f61',
  '5afb8ffc',
  '03797180',
  '8e1c2a73',
  '2b16d232',
  '9efb0033',
  'd86f4cc5',
  'd84db064',
  '2264b742',
  '4aaa459a',
  '9e64f614',
  'c0c293cb',
  '25d3a420',
  '85be80c0',
  '795e27b3',
  '91fc1cc0',
]) {
  requirePhrase(closeout, commitId, 'week-one closeout');
}

for (const checkName of [
  'npm run check:whitepaper-v1-3-plan',
  'npm run check:whitepaper-v1-3-draft-html-smoke',
  'npm run check:whitepaper-v1-3-draft-css-qa',
  'npm run check:whitepaper-v1-3-visual-qa-evidence',
  'npm run check:whitepaper-v1-3-draft-navigation-readiness-closeout',
  'npm run check:whitepaper-v1-3-draft-navigation-click-qa-handoff',
  'npm run check:whitepaper-v1-3-navigation-click-evidence-intake',
  'npm run check:whitepaper-v1-3-navigation-click-evidence-results',
  'npm run check:whitepaper-v1-3-screenshot-evidence-manifest',
  'npm run check:whitepaper-v1-3-screenshot-evidence-intake',
  'npm run check:whitepaper-v1-3-screenshot-evidence-results',
  'npm run check:whitepaper-v1-3-screenshot-capture-readiness-closeout',
  'npm run check:whitepaper-v1-3-local-draft-qa-readiness',
  'npm run check:whitepaper-v1-3-publication-evidence-current-status',
  'npm run check:whitepaper-v1-3-publication-blocker-status-matrix',
  'npm run check:whitepaper-v1-3-archive-rollback-evidence',
  'npm run check:whitepaper-v1-3-final-public-wording-diff',
  'npm run check:whitepaper-v1-3-public-announcement-review',
  'npm run check:whitepaper-v1-3-public-distribution-boundary-matrix',
  'npm run check:whitepaper-v1-3-founder-publication-readiness-handoff',
  'npm run check:whitepaper-v1-3-founder-ready-packet-status-rollup',
  'npm run check:whitepaper-v1-3-founder-action-board',
  'npm run check:whitepaper-v1-3-founder-evening-review-guide',
  'npm run check:whitepaper-v1-3-founder-decision-routing-checklist',
  'npm run check:whitepaper-v1-3-founder-browser-qa-runbook',
  'npm run check:whitepaper-v1-3-founder-browser-qa-report',
  'npm run check:whitepaper-v1-3-founder-browser-qa-issue-intake',
  'npm run check:whitepaper-v1-3-browser-qa-evidence-flow',
  'npm run check:whitepaper-v1-3-draft-static-assets',
  'npm run check:whitepaper-v1-3-draft-external-asset-review-intake',
  'npm run check:whitepaper-v1-3-draft-print-pdf-export-static',
  'npm run check:whitepaper-v1-3-draft-accessibility-static',
  'npm run check:whitepaper-v1-3-draft-responsive-static',
  'npm run check:whitepaper-v1-3-draft-content-parity',
  'npm run check:whitepaper-v1-3-draft-link-cta-static',
  'npm run check:whitepaper-v1-3-internal-review-master-index',
  'npm run check:whitepaper-v1-3-reviewer-evidence-appendix',
  'npm run check:whitepaper-v1-3-reviewer-packet-status-rollup',
  'npm run check:whitepaper-v1-3-reviewer-packet-send-readiness',
  'npm run check:whitepaper-v1-3-reviewer-question-mapping',
  'npm run check:whitepaper-v1-3-reviewer-category-selection-intake',
  'npm run check:whitepaper-v1-3-reviewer-response-routing-closeout',
  'npm run check:whitepaper-v1-3-reviewer-response-change-request-queue',
  'npm run check:whitepaper-v1-3-reviewer-response-re-review-checklist',
  'npm run check:whitepaper-v1-3-reviewer-response-local-revision-evidence-log',
  'npm run check:whitepaper-v1-3-reviewer-response-draft-qa-routing-gate',
  'npm run check:whitepaper-v1-3-public-wording-scan-evidence-log',
  'npm run check:whitepaper-v1-3-smartcontractor-wording-evidence-log',
  'npm run check:whitepaper-v1-3-smartcontractor-product-integration-map',
  'npm run check:whitepaper-v1-3-provider-handoff-packet-map',
  'npm run check:whitepaper-v1-3-provider-response-intake',
  'npm run check:whitepaper-v1-3-provider-response-routing',
  'npm run check:whitepaper-v1-3-provider-response-evidence-log',
  'npm run check:whitepaper-v1-3-provider-response-summary-shell',
  'npm run check:whitepaper-v1-3-provider-response-action-queue',
  'npm run check:whitepaper-v1-3-provider-response-decision-register',
  'npm run check:whitepaper-v1-3-provider-response-decision-evidence-template',
  'npm run check:whitepaper-v1-3-provider-response-decision-evidence-intake',
  'npm run check:whitepaper-v1-3-provider-response-decision-evidence-summary',
  'npm run check:whitepaper-v1-3-provider-response-decision-evidence-closeout',
  'npm run check:whitepaper-v1-3-provider-response-decision-evidence-archive',
  'npm run check:whitepaper-v1-3-provider-response-decision-evidence-archive-index',
  'npm run check:whitepaper-v1-3-provider-response-decision-evidence-archive-index-closeout',
  'npm run check:whitepaper-v1-3-external-reviewer-cover-sheet',
  'npm run check:ci-workflow',
]) {
  requirePhrase(closeout, checkName, 'week-one closeout');
}

requirePhrase(twoWeekPlan, 'Week 1: 2026-05-31 To 2026-06-06', 'two-week plan');
requirePhrase(publicationGate, 'Default state: NO-GO', 'publication gate');
requirePhrase(masterIndex, 'Current Decision State', 'internal review master index');
requirePhrase(closeout, 'screenshot capture readiness closeout | local readiness only / no screenshots recorded', 'week-one closeout');
requirePhrase(closeout, 'draft navigation readiness closeout | local static anchor map only / browser click evidence pending', 'week-one closeout');
requirePhrase(closeout, 'draft navigation click QA handoff | prepared / browser clicks pending', 'week-one closeout');
requirePhrase(closeout, 'navigation click evidence intake | prepared / browser clicks pending', 'week-one closeout');
requirePhrase(closeout, 'navigation click evidence results template | prepared / all results PENDING_CLICK', 'week-one closeout');
requirePhrase(closeout, 'visual QA evidence template | prepared / all rows PENDING_VISUAL_QA', 'week-one closeout');
requirePhrase(closeout, 'screenshot evidence results template | prepared / all results PENDING_CAPTURE', 'week-one closeout');
requirePhrase(closeout, 'founder-ready packet rollup | updated with result templates / still NO-GO', 'week-one closeout');
requirePhrase(closeout, 'founder action board | prepared / still NO-GO', 'week-one closeout');
requirePhrase(closeout, 'founder evening review guide | prepared / still NO-GO', 'week-one closeout');
requirePhrase(closeout, 'founder decision routing checklist | prepared / no decision recorded', 'week-one closeout');
requirePhrase(closeout, 'archive rollback evidence template | prepared / no archive or rollback executed', 'week-one closeout');
requirePhrase(closeout, 'final public wording diff template | prepared / no diff recorded', 'week-one closeout');
requirePhrase(closeout, 'public wording scan evidence log | prepared / public replacement blocked', 'week-one closeout');
requirePhrase(closeout, 'SmartContractor wording evidence log | prepared / production release blocked', 'week-one closeout');
requirePhrase(closeout, 'SmartContractor product integration map | prepared / production integration blocked', 'week-one closeout');
requirePhrase(closeout, 'provider handoff packet map | prepared / no outreach or provider decision recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response intake | prepared / no provider response recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response routing | prepared / no provider response routed', 'week-one closeout');
requirePhrase(closeout, 'provider response evidence log | prepared / no provider response evidence recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response summary shell | prepared / no provider response summary recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response action queue | prepared / no provider response action active', 'week-one closeout');
requirePhrase(closeout, 'provider response decision register | prepared / no provider response decision recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response decision evidence template | prepared / no provider response decision evidence recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response decision evidence intake | prepared / no provider response decision evidence intake recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response decision evidence summary | prepared / no provider response decision evidence summary recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response decision evidence closeout | prepared / no provider response decision evidence closeout recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response decision evidence archive | prepared / no provider response decision evidence archive recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response decision evidence archive index | prepared / no provider response decision evidence archive index active', 'week-one closeout');
requirePhrase(closeout, 'provider response decision evidence archive index closeout | prepared / no provider response decision evidence archive index closeout recorded', 'week-one closeout');
requirePhrase(closeout, 'public announcement review template | prepared / no announcement approved or sent', 'week-one closeout');
requirePhrase(closeout, 'public distribution boundary matrix | prepared / all external distribution blocked', 'week-one closeout');
requirePhrase(closeout, 'founder publication readiness handoff | ready local NO-GO handoff / no publication decision recorded', 'week-one closeout');
requirePhrase(closeout, 'founder browser QA runbook | prepared / browser QA execution pending', 'week-one closeout');
requirePhrase(closeout, 'founder browser QA report template | prepared / no filled browser QA report recorded', 'week-one closeout');
requirePhrase(closeout, 'founder browser QA issue intake template | prepared / no routed browser QA issues recorded', 'week-one closeout');
requirePhrase(closeout, 'browser QA evidence flow | prepared / browser evidence not collected', 'week-one closeout');
requirePhrase(closeout, 'draft static asset manifest | prepared / external asset review pending', 'week-one closeout');
requirePhrase(closeout, 'draft external asset review intake checklist | prepared / privacy, performance, fallback, and public-routing review pending', 'week-one closeout');
requirePhrase(closeout, 'draft print/PDF export static checklist | prepared / print preview and export review pending', 'week-one closeout');
requirePhrase(closeout, 'draft accessibility static checklist | prepared / browser accessibility review pending', 'week-one closeout');
requirePhrase(closeout, 'draft responsive static checklist | prepared / responsive browser review pending', 'week-one closeout');
requirePhrase(closeout, 'draft content parity checklist | prepared / browser content review pending', 'week-one closeout');
requirePhrase(closeout, 'draft link and CTA static checklist | prepared / browser click and mobile tap review pending', 'week-one closeout');
requirePhrase(closeout, 'reviewer evidence appendix | prepared / not sent', 'week-one closeout');
requirePhrase(closeout, 'reviewer packet send readiness checklist | prepared / no founder-controlled send decision recorded', 'week-one closeout');
requirePhrase(closeout, 'reviewer question mapping matrix | prepared / no founder-selected category recorded', 'week-one closeout');
requirePhrase(closeout, 'reviewer category selection intake | prepared / no founder-selected category recorded', 'week-one closeout');
requirePhrase(closeout, 'reviewer response change request queue | prepared / no reviewer response recorded', 'week-one closeout');
requirePhrase(closeout, 'reviewer response re-review checklist | prepared / no reviewer response recorded', 'week-one closeout');
requirePhrase(closeout, 'reviewer response local revision evidence log | prepared / no reviewer response recorded', 'week-one closeout');
requirePhrase(closeout, 'reviewer response draft QA routing gate | prepared / no reviewer response recorded', 'week-one closeout');
requirePhrase(closeout, 'no browser click evidence for draft navigation has been recorded', 'week-one closeout');
requirePhrase(closeout, 'visual QA evidence template is prepared, but no screenshot, browser review, or visual result evidence is recorded', 'week-one closeout');
requirePhrase(closeout, 'draft navigation click QA handoff is prepared, but it is not click evidence', 'week-one closeout');
requirePhrase(closeout, 'navigation click evidence intake checklist is prepared, but it is not click evidence', 'week-one closeout');
requirePhrase(closeout, 'navigation click evidence results template is prepared, but all results remain PENDING_CLICK', 'week-one closeout');
requirePhrase(closeout, 'screenshot evidence results template is prepared, but all results remain PENDING_CAPTURE', 'week-one closeout');
requirePhrase(closeout, 'founder-ready packet and internal review index are updated, but they are not publication evidence', 'week-one closeout');
requirePhrase(closeout, 'founder action board is prepared, but it is not publication approval', 'week-one closeout');
requirePhrase(closeout, 'founder evening review guide is prepared, but it is not publication approval or reviewer-send approval', 'week-one closeout');
requirePhrase(closeout, 'founder decision routing checklist is prepared, but no founder decision is recorded', 'week-one closeout');
requirePhrase(closeout, 'archive rollback evidence template is prepared, but no archive copy, hash, or rollback result is recorded', 'week-one closeout');
requirePhrase(closeout, 'final public wording diff template is prepared, but no final public wording diff is recorded', 'week-one closeout');
requirePhrase(closeout, 'public wording scan evidence log is prepared, but no public replacement GO, final public wording diff, archive proof, rollback proof, or founder/publication approval is recorded', 'week-one closeout');
requirePhrase(closeout, 'SmartContractor wording evidence log is prepared, but no SmartContractor production release GO, product/browser QA evidence, legal/provider review, or founder/publication approval is recorded', 'week-one closeout');
requirePhrase(closeout, 'SmartContractor product integration map is prepared, but no SmartContractor production integration GO, product/browser QA evidence, legal/provider review, or live-action authorization is recorded', 'week-one closeout');
requirePhrase(closeout, 'provider handoff packet map is prepared, but no recipient category, redaction review, founder send decision, provider response, legal/provider clearance, or live-action authorization is recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response intake template is prepared, but no provider response, response scope, required changes, legal/provider clearance, public publication approval, provider commitment, or live-action authorization is recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response routing checklist is prepared, but no provider response, routing decision, local change scope, legal/provider clearance, public publication approval, provider commitment, or live-action authorization is recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response evidence log is prepared, but no provider response evidence, redaction review, routing decision, local change scope, legal/provider clearance, public publication approval, provider commitment, or live-action authorization is recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response summary shell is prepared, but no provider response summary, source provider reference, redaction review, routing decision, local change scope, legal/provider clearance, public publication approval, provider commitment, or live-action authorization is recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response action queue is prepared, but no provider response action, source evidence id, source summary id, redaction review, routing decision, local change scope, legal/provider clearance, public publication approval, provider commitment, or live-action authorization is recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response decision register is prepared, but no provider response decision, source intake id, source evidence id, source summary id, source action id, redaction review, routing decision, local change scope, legal/provider clearance, public publication approval, provider commitment, outreach approval, production release approval, or live-action authorization is recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response decision evidence template is prepared, but no provider response decision evidence, decision id, source intake id, source evidence id, source summary id, source action id, redaction review, routing decision, local change scope, legal/provider clearance, public publication approval, provider commitment, outreach approval, production release approval, or live-action authorization is recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response decision evidence intake is prepared, but no provider response decision evidence intake, decision evidence id, decision id, source intake id, source evidence id, source summary id, source action id, redaction review, routing decision, local change scope, legal/provider clearance, public publication approval, provider commitment, outreach approval, production release approval, or live-action authorization is recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response decision evidence summary is prepared, but no provider response decision evidence summary, decision evidence intake id, decision evidence id, decision id, source intake id, source evidence id, source summary id, source action id, redaction review, routing decision, local change scope, legal/provider clearance, public publication approval, provider commitment, outreach approval, production release approval, or live-action authorization is recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response decision evidence closeout is prepared, but no provider response decision evidence closeout, decision evidence summary id, decision evidence intake id, decision evidence id, decision id, source intake id, source evidence id, source summary id, source action id, redaction review, routing decision, local change scope, legal/provider clearance, public publication approval, provider commitment, outreach approval, production release approval, or live-action authorization is recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response decision evidence archive is prepared, but no provider response decision evidence archive, decision evidence closeout id, decision evidence summary id, decision evidence intake id, decision evidence id, decision id, source intake id, source evidence id, source summary id, source action id, redaction review, routing decision, local change scope, legal/provider clearance, public publication approval, provider commitment, outreach approval, production release approval, or live-action authorization is recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response decision evidence archive index is prepared, but no provider response decision evidence archive index, decision evidence archive id, decision evidence closeout id, decision evidence summary id, decision evidence intake id, decision evidence id, decision id, source intake id, source evidence id, source summary id, source action id, redaction review, routing decision, local change scope, legal/provider clearance, public publication approval, provider commitment, outreach approval, production release approval, or live-action authorization is recorded', 'week-one closeout');
requirePhrase(closeout, 'provider response decision evidence archive index closeout is prepared, but no provider response decision evidence archive index closeout, decision evidence archive index id, decision evidence archive id, decision evidence closeout id, decision evidence summary id, decision evidence intake id, decision evidence id, decision id, source intake id, source evidence id, source summary id, source action id, redaction review, routing decision, local change scope, legal/provider clearance, public publication approval, provider commitment, outreach approval, production release approval, or live-action authorization is recorded', 'week-one closeout');
requirePhrase(closeout, 'public announcement review template is prepared, but no announcement, distribution copy, provider outreach, reviewer outreach, email, social, deck, grant, investor, or partner packet is approved or sent', 'week-one closeout');
requirePhrase(closeout, 'public distribution boundary matrix is prepared, but no PDF, deck, social, email, reviewer, provider, investor, grant, website, or public-route distribution GO is recorded', 'week-one closeout');
requirePhrase(closeout, 'founder publication readiness handoff is prepared, but no publication GO or public replacement decision is recorded', 'week-one closeout');
requirePhrase(closeout, 'founder browser QA runbook is prepared, but no browser screenshots, visual review results, or click results are recorded', 'week-one closeout');
requirePhrase(closeout, 'founder browser QA report template is prepared, but no filled browser QA report is recorded', 'week-one closeout');
requirePhrase(closeout, 'founder browser QA issue intake template is prepared, but no browser QA findings have been routed into the draft QA issue register', 'week-one closeout');
requirePhrase(closeout, 'browser QA evidence flow is prepared, but it is not filled browser evidence, redaction review, issue resolution, legal/provider clearance, or publication approval', 'week-one closeout');
requirePhrase(closeout, 'draft static asset manifest is prepared, but Tailwind CDN and Google Fonts usage still require separate publication/public replacement review', 'week-one closeout');
requirePhrase(closeout, 'draft external asset review intake checklist is prepared, but privacy, performance, fallback, public-routing, and production dependency treatment are not reviewed', 'week-one closeout');
requirePhrase(closeout, 'draft print/PDF export static checklist is prepared, but no print preview, PDF export file, hash, layout review, redaction review, or distribution approval is recorded', 'week-one closeout');
requirePhrase(closeout, 'draft accessibility static checklist is prepared, but keyboard, focus, contrast, screen-reader, and browser accessibility evidence are not recorded', 'week-one closeout');
requirePhrase(closeout, 'draft responsive static checklist is prepared, but desktop/mobile viewport screenshots, zoom checks, and manual responsive review are not recorded', 'week-one closeout');
requirePhrase(closeout, 'draft content parity checklist is prepared, but manual browser copy review, screenshot content review, and legal/provider wording signoff are not recorded', 'week-one closeout');
requirePhrase(closeout, 'draft link and CTA static checklist is prepared, but desktop/mobile browser click evidence, CTA behavior review, and mobile tap evidence are not recorded', 'week-one closeout');
requirePhrase(closeout, 'reviewer evidence appendix is prepared, but no reviewer packet is approved or sent', 'week-one closeout');
requirePhrase(closeout, 'reviewer packet send readiness checklist is prepared, but no recipient category, redaction completion, founder-controlled send decision, or send execution is recorded', 'week-one closeout');
requirePhrase(closeout, 'reviewer question mapping matrix is prepared, but no founder-selected category, packet scope, redaction completion, send decision, or reviewer response is recorded', 'week-one closeout');
requirePhrase(closeout, 'reviewer category selection intake is prepared, but no founder-selected category, packet scope, redaction completion, send decision, or response intake target is recorded', 'week-one closeout');
requirePhrase(closeout, 'reviewer response change request queue is prepared, but no response intake, summary, local change request, publication decision, or live authorization is recorded', 'week-one closeout');
requirePhrase(closeout, 'reviewer response re-review checklist is prepared, but no response intake, summary, local change request, draft QA issue, re-review scope, founder-controlled send decision, or re-review result is recorded', 'week-one closeout');
requirePhrase(closeout, 'reviewer response local revision evidence log is prepared, but no response intake, summary, local change request, draft QA issue, local diff, validator run, re-review scope, founder-controlled send decision, or re-review result is recorded', 'week-one closeout');
requirePhrase(closeout, 'reviewer response draft QA routing gate is prepared, but no response intake, summary, local change request, draft QA issue, local revision evidence, re-review scope, founder-controlled send decision, or re-review result is recorded', 'week-one closeout');
requirePhrase(closeout, 'no screenshot files or redaction-reviewed evidence have been recorded', 'week-one closeout');
requirePhrase(closeout, 'keep public announcement review template pending until separate founder publication/distribution/send scope exists', 'week-one closeout');
requirePhrase(closeout, 'keep public distribution boundary matrix NO-GO until a separate founder publication/distribution/send scope exists', 'week-one closeout');
requirePhrase(closeout, 'keep visual QA evidence template pending until browser screenshot/review evidence exists', 'week-one closeout');
requirePhrase(closeout, 'keep founder publication readiness handoff aligned with current evidence status, founder packet, and master index', 'week-one closeout');
requirePhrase(closeout, 'use the founder browser QA runbook only for local browser evidence collection when the founder is ready', 'week-one closeout');
requirePhrase(closeout, 'keep founder browser QA report template empty until actual browser QA evidence exists', 'week-one closeout');
requirePhrase(closeout, 'keep founder browser QA issue intake template empty until actual browser QA findings exist', 'week-one closeout');
requirePhrase(closeout, 'keep browser QA evidence flow as a sequence map until screenshots, click results, visual QA, report rows, and issue routing are actually filled', 'week-one closeout');
requirePhrase(closeout, 'keep draft static asset manifest pending until external draft dependencies are reviewed for any future public replacement path', 'week-one closeout');
requirePhrase(closeout, 'keep draft external asset review intake checklist pending until founder or reviewer records dependency treatment decisions', 'week-one closeout');
requirePhrase(closeout, 'keep draft print/PDF export static checklist pending until print preview, export evidence, hash, layout, and redaction review exist', 'week-one closeout');
requirePhrase(closeout, 'keep draft accessibility static checklist pending until browser/manual accessibility evidence exists', 'week-one closeout');
requirePhrase(closeout, 'keep draft responsive static checklist pending until viewport/manual responsive evidence exists', 'week-one closeout');
requirePhrase(closeout, 'keep draft content parity checklist pending until browser/manual content evidence and legal/provider wording review exist', 'week-one closeout');
requirePhrase(closeout, 'keep draft link and CTA static checklist pending until browser/manual click and mobile tap evidence exists', 'week-one closeout');
requirePhrase(closeout, 'keep public wording scan evidence log pending until public replacement GO, final public wording diff, archive proof, rollback proof, and founder/publication approval exist', 'week-one closeout');
requirePhrase(closeout, 'keep SmartContractor wording evidence log pending until SmartContractor production release GO, product/browser QA evidence, legal/provider review, and founder/publication approval exist', 'week-one closeout');
requirePhrase(closeout, 'keep SmartContractor product integration map pending until SmartContractor production integration GO, product/browser QA evidence, legal/provider review, and live-action authorization exist', 'week-one closeout');
requirePhrase(closeout, 'keep provider handoff packet map pending until recipient category, redaction review, founder send decision, provider response, legal/provider clearance, and live-action authorization exist', 'week-one closeout');
requirePhrase(closeout, 'keep provider response intake template pending until a founder-provided written provider response, response scope, required changes, legal/provider clearance status, and live-action blocker state exist', 'week-one closeout');
requirePhrase(closeout, 'keep provider response routing checklist pending until a founder-provided written provider response, routing decision, local change scope, legal/provider clearance status, and live-action blocker state exist', 'week-one closeout');
requirePhrase(closeout, 'keep provider response evidence log pending until a founder-provided written provider response, redaction review, routing decision, local change scope, legal/provider clearance status, and live-action blocker state exist', 'week-one closeout');
requirePhrase(closeout, 'keep provider response summary shell pending until a founder-provided written provider response, evidence id, redaction review, routing decision, local change scope, legal/provider clearance status, and live-action blocker state exist', 'week-one closeout');
requirePhrase(closeout, 'keep provider response action queue pending until a founder-provided written provider response, evidence id, summary id, redaction review, routing decision, local change scope, legal/provider clearance status, and live-action blocker state exist', 'week-one closeout');
requirePhrase(closeout, 'keep provider response decision register pending until a founder-provided written provider response, intake id, evidence id, summary id, action id, redaction review, routing decision, local change scope, legal/provider clearance status, provider commitment status, outreach status, production release status, and live-action blocker state exist', 'week-one closeout');
requirePhrase(closeout, 'keep provider response decision evidence template pending until a founder-provided written provider response, decision id, intake id, evidence id, summary id, action id, redaction review, routing decision, local change scope, legal/provider clearance status, provider commitment status, outreach status, production release status, and live-action blocker state exist', 'week-one closeout');
requirePhrase(closeout, 'keep provider response decision evidence intake pending until a founder-provided written provider response, decision evidence id, decision id, intake id, evidence id, summary id, action id, redaction review, routing decision, local change scope, legal/provider clearance status, provider commitment status, outreach status, production release status, and live-action blocker state exist', 'week-one closeout');
requirePhrase(closeout, 'keep provider response decision evidence summary pending until a founder-provided written provider response, decision evidence intake id, decision evidence id, decision id, intake id, evidence id, summary id, action id, redaction review, routing decision, local change scope, legal/provider clearance status, provider commitment status, outreach status, production release status, and live-action blocker state exist', 'week-one closeout');
requirePhrase(closeout, 'keep provider response decision evidence closeout pending until a founder-provided written provider response, decision evidence summary id, decision evidence intake id, decision evidence id, decision id, intake id, evidence id, summary id, action id, redaction review, routing decision, local change scope, legal/provider clearance status, provider commitment status, outreach status, production release status, and live-action blocker state exist', 'week-one closeout');
requirePhrase(closeout, 'keep provider response decision evidence archive pending until a founder-provided written provider response, decision evidence closeout id, decision evidence summary id, decision evidence intake id, decision evidence id, decision id, intake id, evidence id, summary id, action id, redaction review, routing decision, local change scope, legal/provider clearance status, provider commitment status, outreach status, production release status, and live-action blocker state exist', 'week-one closeout');
requirePhrase(closeout, 'keep provider response decision evidence archive index pending until a founder-provided written provider response, decision evidence archive id, decision evidence closeout id, decision evidence summary id, decision evidence intake id, decision evidence id, decision id, intake id, evidence id, summary id, action id, redaction review, routing decision, local change scope, legal/provider clearance status, provider commitment status, outreach status, production release status, and live-action blocker state exist', 'week-one closeout');
requirePhrase(closeout, 'keep provider response decision evidence archive index closeout pending until a founder-provided written provider response, decision evidence archive index id, decision evidence archive id, decision evidence closeout id, decision evidence summary id, decision evidence intake id, decision evidence id, decision id, intake id, evidence id, summary id, action id, redaction review, routing decision, local change scope, legal/provider clearance status, provider commitment status, outreach status, production release status, and live-action blocker state exist', 'week-one closeout');
requirePhrase(closeout, 'keep reviewer packet send readiness checklist pending until recipient category, redaction completion, evidence appendix review, and founder-controlled send decision exist', 'week-one closeout');
requirePhrase(closeout, 'keep reviewer question mapping matrix pending until founder selects recipient category, packet scope, redaction completion, send decision, and response intake target', 'week-one closeout');
requirePhrase(closeout, 'keep reviewer category selection intake pending until founder selects recipient category, packet scope, redaction completion, send decision, and response intake target', 'week-one closeout');
requirePhrase(closeout, 'keep reviewer response change request queue pending until response intake, response summary, local change request scope, and blocker routing exist', 'week-one closeout');
requirePhrase(closeout, 'keep reviewer response re-review checklist pending until response intake, response summary, local change request, draft QA issue, re-review scope, and founder-controlled send decision exist', 'week-one closeout');
requirePhrase(closeout, 'keep reviewer response local revision evidence log pending until response intake, response summary, local change request, draft QA issue, local diff, validator run, re-review scope, and founder-controlled send decision exist', 'week-one closeout');
requirePhrase(closeout, 'keep reviewer response draft QA routing gate pending until response intake, response summary, local change request, draft QA issue, local revision evidence, re-review scope, and founder-controlled send decision exist', 'week-one closeout');

const blockedApprovalPatterns = [
  /\bfinal week-one approval\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blegal approval recorded\b/i,
  /\bprovider approval recorded\b/i,
  /\blive action approved\b/i,
  /\bGO for publication\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(closeout)) {
    errors.push(`week-one closeout contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Week-One Closeout') || content.includes('Completed Safe Tasks')) {
    errors.push(`${label} appears to contain internal closeout content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 week-one closeout validation passed');
