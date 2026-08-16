import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.basename(process.cwd()) === 'construction-ai'
  ? path.resolve(process.cwd(), '..')
  : process.cwd();
const csvPath = path.join(root, 'docs', 'architecture', '2026-08-component-provenance.csv');
const inventoryPath = path.join(root, 'docs', 'architecture', '2026-08-system-inventory.md');
const baselineCommit = '99f2838a5d80bf1c3c1b368c50bcb4a28ef41521';
const expectedHeaders = ['component', 'relative_path', 'expected_kind', 'provenance', 'notes'];
const allowedProvenance = new Set([
  'LOCAL_SOURCE_VERIFIED',
  'LOCAL_ARTIFACT_ONLY',
  'EXTERNAL_SOURCE_NOT_PRESENT',
  'EXTERNAL_STATE_UNVERIFIED',
  'ARCHIVE_OR_REFERENCE',
]);
const requiredComponents = new Map([
  ['construction-ai', 'LOCAL_SOURCE_VERIFIED'],
  ['mobile-smartcontractor', 'LOCAL_SOURCE_VERIFIED'],
  ['core-contracts', 'LOCAL_SOURCE_VERIFIED'],
  ['meme-contracts', 'LOCAL_SOURCE_VERIFIED'],
  ['gcsctoken111', 'EXTERNAL_SOURCE_NOT_PRESENT'],
  ['gcscbuild11', 'EXTERNAL_SOURCE_NOT_PRESENT'],
  ['legacy-v3-service', 'EXTERNAL_SOURCE_NOT_PRESENT'],
]);

function fail(message) {
  console.error(`system_inventory_validation_failed: ${message}`);
  process.exit(1);
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift()?.split(',');
  if (headers?.join(',') !== expectedHeaders.join(',')) {
    fail('unexpected CSV headers');
  }

  return lines.map((line, index) => {
    const values = line.split(',');
    if (values.length !== expectedHeaders.length) {
      fail(`row ${index + 2} has an unexpected field count`);
    }

    return Object.fromEntries(expectedHeaders.map((header, valueIndex) => [header, values[valueIndex]]));
  });
}

function isRootRelative(relativePath) {
  return relativePath.length > 0
    && !path.isAbsolute(relativePath)
    && !/^[A-Za-z]:[\\/]/.test(relativePath)
    && !relativePath.split(/[\\/]/).includes('..');
}

function isTracked(relativePath) {
  const output = execFileSync('git', ['-C', root, 'ls-files', '--', relativePath], { encoding: 'utf8' });
  return output.trim().length > 0;
}

if (!fs.existsSync(csvPath) || !fs.existsSync(inventoryPath)) {
  fail('inventory documentation is missing');
}

const inventory = fs.readFileSync(inventoryPath, 'utf8');
for (const requiredText of [
  'C:\\gcsc',
  'EXTERNAL_SOURCE_NOT_PRESENT',
  'check:system-inventory',
  baselineCommit,
  'root worktree was dirty',
]) {
  if (!inventory.includes(requiredText)) {
    fail(`inventory is missing required boundary text: ${requiredText}`);
  }
}

try {
  execFileSync('git', ['-C', root, 'cat-file', '-e', `${baselineCommit}^{commit}`], { stdio: 'ignore' });
} catch {
  fail('inventory baseline commit is not available locally');
}

const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
const seenComponents = new Set();
for (const row of rows) {
  if (seenComponents.has(row.component)) {
    fail(`duplicate component: ${row.component}`);
  }
  seenComponents.add(row.component);

  if (!allowedProvenance.has(row.provenance)) {
    fail(`unsupported provenance state for ${row.component}`);
  }
  if (!isRootRelative(row.relative_path)) {
    fail(`path must be root-relative for ${row.component}`);
  }

  const fullPath = path.join(root, row.relative_path);
  if (row.provenance === 'LOCAL_SOURCE_VERIFIED') {
    if (!fs.existsSync(fullPath) || !isTracked(row.relative_path)) {
      fail(`local source is not tracked for ${row.component}`);
    }
    if (row.expected_kind === 'directory' && !fs.statSync(fullPath).isDirectory()) {
      fail(`local source has the wrong kind for ${row.component}`);
    }
  }

  if (row.provenance === 'EXTERNAL_SOURCE_NOT_PRESENT' && fs.existsSync(fullPath)) {
    fail(`external source is present and needs reclassification: ${row.component}`);
  }
}

for (const [component, provenance] of requiredComponents) {
  const row = rows.find((candidate) => candidate.component === component);
  if (!row || row.provenance !== provenance) {
    fail(`required component is missing or misclassified: ${component}`);
  }
}

console.log(JSON.stringify({
  status: 'system_inventory_validation_passed',
  tracked_root_only: true,
  baseline_commit: baselineCommit,
  baseline_root_dirty: true,
  component_count: rows.length,
}, null, 2));
