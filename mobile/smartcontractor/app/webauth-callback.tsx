import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { getCurrentUser } from '../lib/api';
import { colors } from '../lib/tokens';
import { dispatchWebAuthCallbackUrl } from '../lib/webauth';

function buildCallbackUrl(params: Record<string, string | string[] | undefined>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const item of value) query.append(key, item);
    } else if (typeof value === 'string') {
      query.set(key, value);
    }
  }
  const qs = query.toString();
  return `smartcontractor://webauth-callback${qs ? `?${qs}` : ''}`;
}

function getReturnRoute(): string {
  const user = getCurrentUser();
  if (!user?.wallet?.account) return '/(auth)/connect-wallet';
  return user.role === 'contractor' ? '/(contractor)/jobs' : '/(homeowner)/jobs';
}

export default function WebAuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams<Record<string, string | string[]>>();

  useEffect(() => {
    const callbackUrl = buildCallbackUrl(params);
    dispatchWebAuthCallbackUrl(callbackUrl);
    const timer = setTimeout(() => {
      router.replace(getReturnRoute() as never);
    }, 800);
    return () => clearTimeout(timer);
  }, [params, router]);

  return (
    <View style={styles.root}>
      <ActivityIndicator color={colors.brand} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    backgroundColor: colors.bg,
    flex: 1,
    justifyContent: 'center',
  },
});
