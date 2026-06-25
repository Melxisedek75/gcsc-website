#!/usr/bin/env node
/**
 * One-shot scaffold for SmartContractor mobile MVP.
 *
 * Generates the file tree the orchestrator's plan calls for:
 *   role selection -> auth shell -> homeowner tabs -> contractor tabs
 *
 * Run once: `node mobile/smartcontractor/scaffold.js`
 * Safe to re-run — overwrites file contents but does not delete anything.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

function write(rel, content) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  console.log('  wrote', rel);
}

const PKG = {
  name: 'smartcontractor-mobile',
  version: '0.0.1',
  private: true,
  main: 'expo-router/entry',
  scripts: {
    start: 'expo start',
    android: 'expo start --android',
    ios: 'expo start --ios',
    web: 'expo start --web',
  },
  dependencies: {
    expo: '~52.0.0',
    'expo-router': '~4.0.0',
    'expo-linking': '~7.0.0',
    'expo-constants': '~17.0.0',
    'expo-status-bar': '~2.0.0',
    react: '18.3.1',
    'react-native': '0.76.0',
    'react-native-safe-area-context': '4.12.0',
    'react-native-screens': '~4.0.0',
  },
  devDependencies: {
    '@types/react': '~18.3.0',
    typescript: '~5.3.0',
  },
};

const APP_JSON = {
  expo: {
    name: 'SmartContractor',
    slug: 'smartcontractor',
    scheme: 'smartcontractor',
    version: '0.0.1',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: { supportsTablet: false, bundleIdentifier: 'com.gcsc.smartcontractor' },
    android: { package: 'com.gcsc.smartcontractor' },
    plugins: ['expo-router'],
    experiments: { typedRoutes: true },
  },
};

const TSCONFIG = {
  extends: 'expo/tsconfig.base',
  compilerOptions: { strict: true },
  include: ['**/*.ts', '**/*.tsx', '.expo/types/**/*.ts', 'expo-env.d.ts'],
};

const GITIGNORE = `node_modules/
.expo/
dist/
web-build/
*.log
.DS_Store
.env
.env.local
ios/
android/
`;

const README = `# SmartContractor Mobile MVP

Expo React Native scaffold matching the orchestrator's plan
(Taskade project \`19k7jDM1LMJzfJuA\` — "📱 SmartContractor Mobile MVP").

## Setup (founder, one time)

\`\`\`powershell
cd C:\\gcsc\\mobile\\smartcontractor
npm install
npx expo start
\`\`\`

Press \`i\` for iOS simulator, \`a\` for Android emulator, or scan the QR with
Expo Go on your phone.

## Structure (Expo Router file-based)

| Path | Story (from Taskade backlog) |
|------|------------------------------|
| \`app/index.tsx\` | Onboarding + role selection |
| \`app/(auth)/sign-in.tsx\` | Auth shell + biometric login |
| \`app/(homeowner)/jobs.tsx\` | Homeowner: browse contractors |
| \`app/(homeowner)/post-job.tsx\` | Homeowner: post job |
| \`app/(homeowner)/milestones.tsx\` | Milestone approve / reject |
| \`app/(homeowner)/chat.tsx\` | In-app chat |
| \`app/(homeowner)/profile.tsx\` | Profile + KYC light |
| \`app/(contractor)/jobs.tsx\` | Contractor: browse jobs |
| \`app/(contractor)/bid.tsx\` | Contractor: bid submission |
| \`app/(contractor)/milestones.tsx\` | Milestone proof upload |
| \`app/(contractor)/chat.tsx\` | In-app chat |
| \`app/(contractor)/profile.tsx\` | Profile + KYB status |

Each screen is a stub — UI placeholder, no business logic yet.
Next iteration: wire navigation, then implement screens one by one.

## Hard rules (from hybrid model)

- No real payments. Stripe **test mode** only when implemented.
- No tokens / GCST / wallet signing in this MVP. WebAuth testnet only.
- No App Store / Google Play publish without founder approval.
- No lending / insurance / DeFi features.
`;

const ROOT_LAYOUT = `import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(homeowner)" />
      <Stack.Screen name="(contractor)" />
    </Stack>
  );
}
`;

const ROLE_SELECT = `import { Link, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RoleSelect() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>SmartContractor</Text>
      <Text style={styles.subtitle}>Trust infrastructure for construction</Text>

      <Pressable
        style={[styles.card, styles.homeowner]}
        onPress={() => router.push('/(homeowner)/jobs')}
      >
        <Text style={styles.cardTitle}>I'm a homeowner</Text>
        <Text style={styles.cardBody}>Post a job, hire verified contractors, approve milestones.</Text>
      </Pressable>

      <Pressable
        style={[styles.card, styles.contractor]}
        onPress={() => router.push('/(contractor)/jobs')}
      >
        <Text style={styles.cardTitle}>I'm a contractor</Text>
        <Text style={styles.cardBody}>Find jobs, submit bids, upload milestone proof.</Text>
      </Pressable>

      <Link href="/(auth)/sign-in" style={styles.signIn}>
        Already have an account? Sign in
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 16 },
  title: { fontSize: 32, fontWeight: '700' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  card: { padding: 20, borderRadius: 12, gap: 6 },
  homeowner: { backgroundColor: '#E8F1FF' },
  contractor: { backgroundColor: '#FFF3E0' },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardBody: { fontSize: 14, color: '#444' },
  signIn: { textAlign: 'center', marginTop: 16, color: '#0066CC' },
});
`;

function stub(title, story) {
  return `import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>${title}</Text>
      <Text style={styles.story}>${story}</Text>
      <Text style={styles.todo}>TODO: implement this screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  title: { fontSize: 24, fontWeight: '700' },
  story: { fontSize: 14, color: '#666' },
  todo: { fontSize: 12, color: '#999', marginTop: 24 },
});
`;
}

function tabsLayout(role, screens) {
  const list = screens
    .map(([name, label]) => `        <Tabs.Screen name="${name}" options={{ title: '${label}' }} />`)
    .join('\n');
  return `import { Tabs } from 'expo-router';

export default function ${role}Tabs() {
  return (
    <Tabs>
${list}
    </Tabs>
  );
}
`;
}

console.log('Scaffolding SmartContractor mobile MVP at', ROOT);

write('package.json', JSON.stringify(PKG, null, 2) + '\n');
write('app.json', JSON.stringify(APP_JSON, null, 2) + '\n');
write('tsconfig.json', JSON.stringify(TSCONFIG, null, 2) + '\n');
write('.gitignore', GITIGNORE);
write('README.md', README);

write('app/_layout.tsx', ROOT_LAYOUT);
write('app/index.tsx', ROLE_SELECT);

write('app/(auth)/sign-in.tsx', stub('Sign in', 'Auth shell + biometric login + WebAuth testnet session'));

write(
  'app/(homeowner)/_layout.tsx',
  tabsLayout('Homeowner', [
    ['jobs', 'Browse'],
    ['post-job', 'Post'],
    ['milestones', 'Milestones'],
    ['chat', 'Chat'],
    ['profile', 'Profile'],
  ])
);
write('app/(homeowner)/jobs.tsx', stub('Browse contractors', 'Homeowner flow: browse contractors + hire intent'));
write('app/(homeowner)/post-job.tsx', stub('Post a job', 'Homeowner flow: post job'));
write('app/(homeowner)/milestones.tsx', stub('Milestones', 'Milestone flow: review proof + approve / reject'));
write('app/(homeowner)/chat.tsx', stub('Chat', 'In-app chat with contractor'));
write('app/(homeowner)/profile.tsx', stub('Profile', 'Profile + KYC light status'));

write(
  'app/(contractor)/_layout.tsx',
  tabsLayout('Contractor', [
    ['jobs', 'Jobs'],
    ['bid', 'Bids'],
    ['milestones', 'Proof'],
    ['chat', 'Chat'],
    ['profile', 'Profile'],
  ])
);
write('app/(contractor)/jobs.tsx', stub('Browse jobs', 'Contractor flow: browse jobs + bid intent'));
write('app/(contractor)/bid.tsx', stub('Submit bid', 'Contractor flow: bid submission'));
write('app/(contractor)/milestones.tsx', stub('Upload proof', 'Milestone flow: upload proof (photo / video)'));
write('app/(contractor)/chat.tsx', stub('Chat', 'In-app chat with homeowner'));
write('app/(contractor)/profile.tsx', stub('Profile', 'Profile + KYB document capture status'));

console.log('\nDone. Next: cd mobile/smartcontractor && npm install && npx expo start');
