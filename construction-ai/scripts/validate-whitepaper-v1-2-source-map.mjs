import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const sourceMapPath = resolve('..', 'docs', 'whitepaper-v1-2-source-map.md');
const draftPath = resolve('..', 'docs', 'whitepaper-v1-2-restructure-draft.md');
const editPlanPath = resolve('..', 'docs', 'whitepaper-v1-2-edit-plan.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 source map validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const sourceMap = readRequired(sourceMapPath);
const draft = readRequired(draftPath);
const editPlan = readRequired(editPlanPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Source Map',
  'Purpose',
  'Source Documents',
  'Section Mapping',
  'Language Migration Rules',
  'Safety Boundaries',
  'Verification',
]) {
  assertIncludes(sourceMap, section, sourceMapPath);
}

for (const required of [
  'founder approval required',
  'do not edit `whitepaper.html` yet',
  'whitepaper-v1-2-restructure-draft.md',
  'whitepaper-v1-2-edit-plan.md',
  'Executive Summary',
  'Construction Trust Problem',
  'SmartContractor Marketplace',
  'Project Contracts',
  'Milestones',
  'Escrow-Ready',
  'Contractor Reputation Layer',
  'AI Boundaries',
  'Compliance',
  'Digital Asset Market Clarity Act',
  'GCSC/GCST Token Economics',
  'Stablecoin Settlement',
  'Real Estate DAO',
  'Risk Factors',
  'no real escrow',
  'no real lending',
  'no real token collateral',
  'no token price promise',
  'attorney/provider/founder approval',
  'npm run check:whitepaper-v1-2-source-map',
]) {
  assertIncludes(sourceMap, required, sourceMapPath);
}

assertIncludes(draft, 'Whitepaper v1.2 Proposed Table Of Contents', draftPath);
assertIncludes(editPlan, 'Pass 1: Structure', editPlanPath);
assertIncludes(context, 'whitepaper v1.2 source map', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-source-map', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 source map', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-source-map', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(sourceMap)) {
  fail('Whitepaper source map must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', source_map: sourceMapPath, safety_boundaries_checked: true }, null, 2));
