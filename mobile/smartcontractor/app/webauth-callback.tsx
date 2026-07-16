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
    // WebAuth bounces back here after signing; the Proton Link SDK receives the
    // actual result over its own channel. Just hand the URL to any waiting
    // listener, then immediately dismiss this screen and return to whatever the
    // user was on (e.g. the in-flight payment). Navigating to /jobs here used to
    // unmount the payment mid-transaction and caused a WebAuth re-open loop.
    dispatchWebAuthCallbackUrl(buildCallbackUrl(params));
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(getReturnRoute() as never);
    }
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
