import { readFileSync, existsSync } from 'node:fs';

function fail(message) {
  console.error(`SmartContractor Android wrapper preflight failed: ${message}`);
  process.exit(1);
}

function read(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function readJson(path) {
  try {
    return JSON.parse(read(path));
  } catch (error) {
    fail(`Invalid JSON in ${path}: ${error.message}`);
  }
}

const capacitor = readJson('capacitor.config.json');
const packageJson = readJson('package.json');
if (capacitor.appId !== 'com.gcsc.smartcontractor') {
  fail('Capacitor appId must remain com.gcsc.smartcontractor before Android generation');
}
if (capacitor.appName !== 'SmartContractor') {
  fail('Capacitor appName must remain SmartContractor before Android generation');
}
if (capacitor.webDir !== 'public') {
  fail('Capacitor webDir must remain public for the current static MVP');
}
if (capacitor.server?.androidScheme !== 'https') {
  fail('Capacitor androidScheme must remain https for app-link and wallet-return planning');
}

const dependencySources = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};
for (const dependencyName of ['@capacitor/core', '@capacitor/cli', '@capacitor/android']) {
  if (!dependencySources[dependencyName]) {
    fail(`package.json must include ${dependencyName} before Android wrapper generation`);
  }
}

const androidBuild = read('../docs/smartcontractor-android-build.md');
const mobileBuild = read('../docs/smartcontractor-mobile-build-system.md');
const preflightDoc = read('../docs/smartcontractor-android-wrapper-preflight.md');
const commands = read('../smartcontractor-mobile/android/CAPACITOR-COMMANDS.md');
const checklist = read('../smartcontractor-mobile/android/CHECKLIST.md');
const androidReadme = read('../smartcontractor-mobile/android/README.md');

if (!commands.includes('cd C:\\gcsc\\construction-ai')) {
  fail('Android Capacitor commands must run from C:\\gcsc\\construction-ai');
}
if (commands.includes('npx cap init')) {
  fail('Commands must not ask for npx cap init because capacitor.config.json already exists');
}
if (!androidReadme.includes('C:\\gcsc\\construction-ai')) {
  fail('Android README must point to the package-owner folder C:\\gcsc\\construction-ai');
}
if (androidReadme.includes('npx cap init')) {
  fail('Android README must not ask for npx cap init because capacitor.config.json already exists');
}
if (!commands.includes('npm install @capacitor/core @capacitor/cli @capacitor/android')) {
  fail('Commands must install core, cli, and android Capacitor packages in one package-owner step');
}
if (!commands.includes('npx cap add android') || !commands.includes('npx cap sync android')) {
  fail('Commands must include add and sync steps for Android wrapper generation');
}

const requiredSafetyPhrases = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'SMARTCONTRACTOR_ROUTE_PROTECTION=strict',
  'SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE=strict',
  'real lending',
  'real escrow',
  'real payment provider production mode',
];

for (const phrase of requiredSafetyPhrases) {
  if (!preflightDoc.includes(phrase)) {
    fail(`Android preflight doc must include safety gate: ${phrase}`);
  }
}

if (!androidBuild.includes('Android wrapper preflight')) {
  fail('Android build plan must link the wrapper preflight');
}
if (!mobileBuild.includes('Android wrapper preflight')) {
  fail('Mobile build-system doc must mention the Android wrapper preflight');
}
if (!checklist.includes('Run `npm run check:android-preflight`')) {
  fail('Android checklist must require the Android preflight validator');
}

const publicFiles = [
  'public/smartcontractor.html',
  'public/manifest.webmanifest',
  'public/service-worker.js',
  'public/offline.html',
];
const secretLike = /(service[_-]?role|private[_-]?key|seed phrase|db password|database password)/i;
for (const file of publicFiles) {
  const content = read(file);
  if (secretLike.test(content)) {
    fail(`Public asset contains forbidden secret-like wording: ${file}`);
  }
}

console.log('SmartContractor Android wrapper preflight passed.');
