import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.basename(process.cwd()) === 'construction-ai'
  ? path.resolve(process.cwd(), '..')
  : process.cwd();
const defaultCsvPath = path.join(root, 'docs', 'architecture', '2026-08-component-provenance.csv');
const inventoryPath = path.join(root, 'docs', 'architecture', '2026-08-system-inventory.md');
const baselineCommit = '99f2838a5d80bf1c3c1b368c50bcb4a28ef41521';
const expectedHeaders = ['component', 'relative_path', 'expected_kind', 'provenance', 'notes'];
const allowedExpectedKinds = new Set(['directory', 'file']);
const allowedProvenance = new Set([
  'LOCAL_SOURCE_VERIFIED',
  'LOCAL_ARTIFACT_ONLY',
  'EXTERNAL_SOURCE_NOT_PRESENT',
  'EXTERNAL_STATE_UNVERIFIED',
  'ARCHIVE_OR_REFERENCE',
]);
const requiredComponents = new Map([
  ['construction-ai', { relative_path: 'construction-ai', expected_kind: 'directory', provenance: 'LOCAL_SOURCE_VERIFIED' }],
  ['mobile-smartcontractor', { relative_path: 'mobile/smartcontractor', expected_kind: 'directory', provenance: 'LOCAL_SOURCE_VERIFIED' }],
  ['core-contracts', { relative_path: 'contracts/gcsc-core', expected_kind: 'directory', provenance: 'LOCAL_SOURCE_VERIFIED' }],
  ['meme-contracts', { relative_path: 'contracts/gcsc-meme', expected_kind: 'directory', provenance: 'LOCAL_SOURCE_VERIFIED' }],
  ['gcsctoken111', { relative_path: 'gcsctoken111', expected_kind: 'directory', provenance: 'LOCAL_SOURCE_VERIFIED' }],
  ['gcscbuild11', { relative_path: 'gcscbuild11', expected_kind: 'directory', provenance: 'EXTERNAL_SOURCE_NOT_PRESENT' }],
  ['legacy-v3-service', { relative_path: 'v3', expected_kind: 'directory', provenance: 'EXTERNAL_SOURCE_NOT_PRESENT' }],
]);
const resolveRealPath = fs.realpathSync.native ?? fs.realpathSync;
const canonicalRoot = resolveRealPath(root);

function fail(message) {
  console.error(`system_inventory_validation_failed: ${message}`);
  process.exit(1);
}

function parseCsv(text) {
  if (text.includes('"')) {
    fail('quoted CSV fields are not supported');
  }
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

function isWithinRoot(candidatePath) {
  const relativePath = path.relative(canonicalRoot, candidatePath);
  return relativePath === '' || (
    relativePath !== '..'
    && !relativePath.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relativePath)
  );
}

function hasSymbolicLinkSegment(candidatePath) {
  const relativePath = path.relative(root, candidatePath);
  let currentPath = root;
  for (const segment of relativePath.split(/[\\/]/).filter(Boolean)) {
    currentPath = path.join(currentPath, segment);
    if (fs.lstatSync(currentPath).isSymbolicLink()) {
      return true;
    }
  }
  return false;
}

function resolveCsvPath() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    return defaultCsvPath;
  }
  if (args.length !== 2 || args[0] !== '--inventory-csv' || !isRootRelative(args[1])) {
    fail('inventory CSV path must be root-relative');
  }

  const candidatePath = path.resolve(root, args[1]);
  if (!isWithinRoot(candidatePath)) {
    fail('inventory CSV path must stay inside the repository root');
  }
  if (fs.existsSync(candidatePath)) {
    if (hasSymbolicLinkSegment(candidatePath)) {
      fail('inventory CSV path must not contain a symlink');
    }
    if (!isWithinRoot(resolveRealPath(candidatePath))) {
      fail('inventory CSV resolves outside the repository root');
    }
  }
  return candidatePath;
}

function isTracked(relativePath) {
  const normalizedPath = relativePath.replace(/\\/g, '/');
  const output = execFileSync('git', ['-C', root, 'ls-files', '--', normalizedPath], {
    encoding: 'utf8',
    env: { ...process.env, GIT_LITERAL_PATHSPECS: '1' },
  });
  return output.split(/\r?\n/).some((entry) => (
    entry === normalizedPath || entry.startsWith(`${normalizedPath}/`)
  ));
}

const csvPath = resolveCsvPath();

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
  if (!allowedExpectedKinds.has(row.expected_kind)) {
    fail(`unsupported expected kind for ${row.component}`);
  }
  if (!isRootRelative(row.relative_path)) {
    fail(`path must be root-relative for ${row.component}`);
  }

  const fullPath = path.join(root, row.relative_path);
  const tracked = isTracked(row.relative_path);
  if (!tracked && row.provenance !== 'EXTERNAL_SOURCE_NOT_PRESENT') {
    fail(`untracked path must be EXTERNAL_SOURCE_NOT_PRESENT: ${row.component}`);
  }
  if (tracked && row.provenance === 'EXTERNAL_SOURCE_NOT_PRESENT') {
    fail(`tracked path needs local provenance: ${row.component}`);
  }

  if (row.provenance === 'LOCAL_SOURCE_VERIFIED') {
    if (!fs.existsSync(fullPath) || !tracked) {
      fail(`local source is not tracked for ${row.component}`);
    }
    const sourceStats = fs.lstatSync(fullPath);
    if (sourceStats.isSymbolicLink()) {
      fail(`local source must not be a symlink: ${row.component}`);
    }
    if (!isWithinRoot(resolveRealPath(fullPath))) {
      fail(`local source resolves outside the repository root: ${row.component}`);
    }
    if (row.expected_kind === 'directory' && !sourceStats.isDirectory()) {
      fail(`local source has the wrong kind for ${row.component}`);
    }
    if (row.expected_kind === 'file' && !sourceStats.isFile()) {
      fail(`local source has the wrong kind for ${row.component}`);
    }
  }

}

for (const [component, required] of requiredComponents) {
  const row = rows.find((candidate) => candidate.component === component);
  if (!row
    || row.relative_path !== required.relative_path
    || row.expected_kind !== required.expected_kind
    || row.provenance !== required.provenance) {
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
