import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { fetchProfile } from '../lib/auth';
import { AuthUser, clearSession, loadSession } from '../lib/api';
import { loadWebauthSession } from '../lib/webauth';
import { colors } from '../lib/tokens';

type HydrationState = 'pending' | 'ready';

export default function RootLayout() {
  const router = useRouter();
  const [state, setState] = useState<HydrationState>('pending');

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const { token } = await loadSession();
        if (!token) {
          return;
        }
        let profile: AuthUser;
        try {
          profile = await fetchProfile();
        } catch {
          await clearSession();
          return;
        }
        await loadWebauthSession();
        if (cancelled) return;
        if (!profile.wallet?.account) {
          router.replace('/(auth)/connect-wallet');
          return;
        }
        const target = profile.role === 'contractor' ? '/(contractor)/jobs' : '/(homeowner)/jobs';
        router.replace(target);
      } finally {
        if (!cancelled) setState('ready');
      }
    }

    hydrate();
    return () => {
      cancelled = true;
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
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(homeowner)" />
      <Stack.Screen name="(contractor)" />
    </Stack>
  );
}
