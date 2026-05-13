import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const glossaryPath = resolve('..', 'docs', 'whitepaper-v1-2-terms-glossary.md');
const sourceMapPath = resolve('..', 'docs', 'whitepaper-v1-2-source-map.md');
const excerptGuardPath = resolve('..', 'docs', 'whitepaper-v1-2-public-excerpt-guard.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

function fail(message) {
  console.error(`Whitepaper v1.2 terms glossary validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const glossary = readRequired(glossaryPath);
const sourceMap = readRequired(sourceMapPath);
const excerptGuard = readRequired(excerptGuardPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);

for (const section of [
  'GCSC Whitepaper v1.2 Terms Glossary',
  'Purpose',
  'Preferred Terms',
  'Terms Requiring Review',
  'Blocked Terms',
  'Replacement Rules',
  'Pre-Publish Check',
  'Safe Default',
]) {
  assertIncludes(glossary, section, glossaryPath);
}

for (const required of [
  'SmartContractor Marketplace',
  'project contracts',
  'milestones',
  'Contractor Reputation Layer',
  'AI-assisted',
  'AI boundaries',
  'escrow-ready',
  'credit-ready',
  'stablecoin settlement roadmap',
  'tokenized construction agreements',
  'Digital Asset Market Clarity Act',
  'policy context',
  'not a legal conclusion',
  'attorney/provider/founder approval',
  'no real escrow',
  'no real lending',
  'no real token collateral',
  'no token price promise',
  'no guaranteed yield',
  'no automatic AI legal or financial decision',
  'whitepaper-v1-2-public-excerpt-guard.md',
  'whitepaper-v1-2-source-map.md',
  'npm run check:whitepaper-v1-2-terms-glossary',
  'npm run check',
]) {
  assertIncludes(glossary, required, glossaryPath);
}

assertIncludes(sourceMap, 'SmartContractor Marketplace', sourceMapPath);
assertIncludes(excerptGuard, 'Blocked Excerpt Claims', excerptGuardPath);
assertIncludes(context, 'whitepaper v1.2 terms glossary', contextPath);
assertIncludes(context, 'check:whitepaper-v1-2-terms-glossary', contextPath);
assertIncludes(backlog, 'Whitepaper v1.2 terms glossary', backlogPath);
assertIncludes(backlog, 'check:whitepaper-v1-2-terms-glossary', backlogPath);

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(glossary)) {
  fail('Terms glossary must not contain real secret-looking values');
}

console.log(JSON.stringify({ status: 'passed', terms_glossary: glossaryPath, wording_guard_checked: true }, null, 2));
