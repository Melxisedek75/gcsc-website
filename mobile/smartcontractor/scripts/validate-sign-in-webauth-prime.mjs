import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const signInPath = path.join(root, 'app', '(auth)', 'sign-in.tsx');
const source = fs.readFileSync(signInPath, 'utf8');

const loginIndex = source.indexOf('await login(email, password)');
const primeMatch = source.match(
  /await\s+primeSessionFromBackend\(\s*user\.wallet\.account,\s*user\.wallet\.permission\s*\?\?\s*'active',?\s*\)/,
);
const primeIndex = primeMatch?.index ?? -1;
const targetIndex = source.indexOf("const target = user.role === 'contractor'");

const checks = [
  [
    'imports primeSessionFromBackend',
    source.includes("import { primeSessionFromBackend } from '../../lib/webauth';"),
  ],
  ['logs in before priming the wallet session', loginIndex >= 0 && loginIndex < primeIndex],
  ['primes the wallet session before routing to jobs', primeIndex >= 0 && primeIndex < targetIndex],
];

const failed = checks.filter(([, passed]) => !passed);
if (failed.length > 0) {
  for (const [label] of failed) console.error(`FAIL: ${label}`);
  process.exit(1);
}

console.log('PASS: sign-in primes the stored WebAuth wallet session before routing');
