import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  goTemplate: path.join(root, 'docs', 'whitepaper-v1-3-publication-go-record-template.md'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  evidenceTemplate: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-template.md'),
  gate: path.join(root, 'docs', 'whitepaper-v1-3-publication-gate.md'),
  decisionPacket: path.join(root, 'docs', 'whitepaper-v1-3-publication-decision-packet.md'),
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

const goTemplate = readRequired('publication GO record template', files.goTemplate);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const evidenceTemplate = readRequired('publication evidence template', files.evidenceTemplate);
const gate = readRequired('publication gate', files.gate);
const decisionPacket = readRequired('publication decision packet', files.decisionPacket);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal future GO-record template',
  'Current decision remains NO-GO',
  'Future Publication GO Record Template',
  'Use Rule',
  'Required GO Evidence',
  'Founder Phrase Box',
  'External Review Evidence Index',
  'Execution Checklist After GO Only',
  'Stop Boundary',
  'Current decision | NO-GO by default',
  'Public replacement authorized? | NO by default',
  'founder publication decision | PENDING',
  'legal/provider review | PENDING',
  'screenshot QA desktop/mobile | PENDING',
  'rollback verification | PENDING',
  'FOUNDER_PUBLICATION_GO: [TO_FILL ONLY AFTER FOUNDER APPROVAL]',
]) {
  requirePhrase(goTemplate, phrase, 'publication GO record template');
}

for (const phrase of [
  'Current decision: NO-GO',
  'Evidence Still Missing Before Any GO',
]) {
  requirePhrase(evidenceStatus, phrase, 'publication evidence current status');
}

requirePhrase(evidenceTemplate, 'Future GO Record', 'publication evidence template');
requirePhrase(gate, 'Default state: NO-GO', 'publication gate');
requirePhrase(decisionPacket, 'Keep publication decision as **NO-GO**', 'publication decision packet');

const blockedPatterns = [
  /\bCurrent decision\s*\|\s*GO\b/i,
  /\bPublic replacement authorized\?\s*\|\s*YES\b/i,
  /\bfounder publication decision \| COMPLETE\b/i,
  /\blegal\/provider review \| COMPLETE\b/i,
  /\brollback verification \| COMPLETE\b/i,
  /\bFOUNDER_PUBLICATION_GO:\s*(?!\[TO_FILL ONLY AFTER FOUNDER APPROVAL\])\S+/i,
  /\blive action approved\b/i,
  /\bpartnership approved\b/i,
];

for (const pattern of blockedPatterns) {
  if (pattern.test(goTemplate)) {
    errors.push(`publication GO record template contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Future Publication GO Record Template') || content.includes('FOUNDER_PUBLICATION_GO')) {
    errors.push(`${label} appears to contain internal publication GO record template content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 publication GO record template validation passed');
