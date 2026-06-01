import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  shell: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-summary-shell.md'),
  intake: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-intake-template.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  redaction: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-redaction-checklist.md'),
  routingIndex: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-routing-index.md'),
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

const shell = readRequired('reviewer response summary shell', files.shell);
const intake = readRequired('reviewer response intake template', files.intake);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const redaction = readRequired('reviewer packet redaction checklist', files.redaction);
const routingIndex = readRequired('reviewer routing index', files.routingIndex);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal reviewer-response summary shell',
  'No reviewer response is recorded yet',
  'Source Intake Reference',
  'Decision Summary',
  'Required Changes Queue',
  'Blockers Carried Forward',
  'Safe Output Rules',
  'Stop Boundary',
  'public publication decision | NO by default',
  'live action decision | NO by default',
  'V13-RS-001',
]) {
  requirePhrase(shell, phrase, 'reviewer response summary shell');
}

for (const area of [
  'public-safe wording',
  'legal/provider boundary',
  'working-capital wording',
  'escrow-ready record wording',
  'FIO UX wording',
  'XPR/WebAuth/Metal/Metallicus wording',
  'Value Mirror wording',
  'data/privacy/security wording',
]) {
  requirePhrase(shell, area, 'reviewer response summary shell');
}

requirePhrase(intake, 'Safe Recording Rules', 'reviewer response intake template');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(redaction, 'Redaction Required Before Reviewer Packet Leaves Local Repo', 'reviewer packet redaction checklist');
requirePhrase(routingIndex, 'Codex must not contact anyone autonomously', 'reviewer routing index');

const blockedPatterns = [
  /\bpublic publication decision\s*\|\s*YES\b/i,
  /\blive action decision\s*\|\s*YES\b/i,
  /\bfounder clearance recorded\b/i,
  /\blegal clearance recorded\b/i,
  /\bprovider clearance recorded\b/i,
  /\bpublication clearance recorded\b/i,
  /\blive-action clearance recorded\b/i,
  /\bpartnership commitment recorded\b/i,
  /\bpublic replacement authorized\b/i,
  /\blive action authorized\b/i,
];

for (const pattern of blockedPatterns) {
  if (pattern.test(shell)) {
    errors.push(`reviewer response summary shell contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Reviewer Response Summary Shell') || content.includes('V13-RS-001')) {
    errors.push(`${label} appears to contain internal reviewer response summary content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 reviewer response summary shell validation passed');
