import { readFileSync, existsSync } from 'node:fs';

function fail(message) {
  console.error(`SmartContractor mobile readiness failed: ${message}`);
  process.exit(1);
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    fail(`Invalid JSON in ${path}: ${error.message}`);
  }
}

const requiredFiles = [
  'capacitor.config.json',
  'public/manifest.webmanifest',
  'public/service-worker.js',
  'public/offline.html',
  '../docs/smartcontractor-mobile-roadmap.md',
  '../docs/smartcontractor-mobile-build-system.md',
  '../docs/smartcontractor-android-build.md',
  '../docs/smartcontractor-ios-build.md',
  '../smartcontractor-mobile/README.md',
  '../smartcontractor-mobile/android/CHECKLIST.md',
  '../smartcontractor-mobile/ios/checklist.md',
];

for (const file of requiredFiles) {
  if (!existsSync(file)) fail(`Missing required mobile file: ${file}`);
}

const capacitor = readJson('capacitor.config.json');
if (capacitor.appId !== 'com.gcsc.smartcontractor') {
  fail('Capacitor appId must stay com.gcsc.smartcontractor unless founder approves a package-id change');
}
if (capacitor.appName !== 'SmartContractor') {
  fail('Capacitor appName must stay SmartContractor unless founder approves a naming change');
}
if (capacitor.webDir !== 'public') {
  fail('Capacitor webDir must point to public for the current MVP');
}

const manifest = readJson('public/manifest.webmanifest');
if (manifest.id !== '/smartcontractor.html') {
  fail('PWA manifest id must stay /smartcontractor.html');
}
if (manifest.start_url !== '/smartcontractor.html?source=pwa') {
  fail('PWA start_url must keep the SmartContractor entrypoint');
}
if (manifest.orientation !== 'portrait-primary') {
  fail('PWA orientation should stay portrait-primary for phone-first MVP use');
}

const roadmap = readFileSync('../docs/smartcontractor-mobile-roadmap.md', 'utf8');
if (!roadmap.includes('Capacitor')) {
  fail('Mobile roadmap must document the Capacitor route');
}

const buildSystem = readFileSync('../docs/smartcontractor-mobile-build-system.md', 'utf8');
if (!buildSystem.includes('com.gcsc.smartcontractor') || !buildSystem.includes('Capacitor config exists')) {
  fail('Mobile build-system doc must track the Capacitor config and package id');
}
if (buildSystem.includes('org.xprnet.smartcontractor')) {
  fail('Mobile build-system doc must not reference the retired org.xprnet.smartcontractor package id');
}

const androidPlan = readFileSync('../docs/smartcontractor-android-build.md', 'utf8');
if (!androidPlan.includes('capacitor.config.json') || !androidPlan.includes('npx cap add android')) {
  fail('Android build doc must explain the prepared Capacitor config and add-android command');
}

const iosPlan = readFileSync('../docs/smartcontractor-ios-build.md', 'utf8');
if (!iosPlan.includes('Apple Developer Program') || !iosPlan.includes('com.gcsc.smartcontractor')) {
  fail('iOS build doc must document Apple requirements and bundle id');
}

console.log('SmartContractor mobile readiness passed.');
