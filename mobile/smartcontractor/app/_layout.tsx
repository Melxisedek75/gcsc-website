import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { fetchProfile } from '../lib/auth';
import { AuthUser, clearSession, loadSession } from '../lib/api';
import { initI18n } from '../lib/i18n';
import { hasCompletedOnboarding } from '../lib/onboarding';
import { loadWebauthSession, primeSessionFromBackend } from '../lib/webauth';
import { colors } from '../lib/tokens';

type HydrationState = 'pending' | 'ready';

export default function RootLayout() {
  const router = useRouter();
  const [state, setState] = useState<HydrationState>('pending');

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        await initI18n();
        const { token } = await loadSession();
        if (!token) {
          const seen = await hasCompletedOnboarding();
          if (cancelled) return;
          if (!seen) {
            router.replace('/onboarding' as never);
          }
          return;
        }
        let profile: AuthUser;
        try {
          profile = await fetchProfile();
        } catch {
          await clearSession();
          return;
        }
        const local = await loadWebauthSession();
        if (cancelled) return;
        if (!profile.wallet?.account) {
          router.replace('/(auth)/connect-wallet');
          return;
        }
        if (!local || local.account !== profile.wallet.account) {
          await primeSessionFromBackend(
            profile.wallet.account,
            profile.wallet.permission ?? 'active',
          );
        }
        const target = profile.role === 'contractor' ? '/(contractor)/jobs' : '/(homeowner)/jobs';
        router.replace(target);
      } finally {
        if (!cancelled) setState('ready');
      }
    }

    // Failsafe: never let a slow/hanging storage or network call trap the app
    // on the loading spinner. If bootstrap has not finished in time, render the
    // app anyway (the user lands on the role-select / onboarding entry).
    const failsafe = setTimeout(() => {
      if (!cancelled) setState('ready');
    }, 4000);

    hydrate();
    return () => {
      cancelled = true;
      clearTimeout(failsafe);
    };
  }, [router]);

  if (state === 'pending') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.brand} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="dispute" options={{ presentation: 'modal' }} />
      <Stack.Screen name="notifications" options={{ presentation: 'modal' }} />
      <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(homeowner)" />
      <Stack.Screen name="(contractor)" />
    </Stack>
  );
}
