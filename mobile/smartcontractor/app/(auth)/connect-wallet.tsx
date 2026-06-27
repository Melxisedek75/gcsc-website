import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { ApiError, getCurrentUser, saveSession, getToken } from '../../lib/api';
import { updateProfile } from '../../lib/auth';
import { connectWallet } from '../../lib/webauth';
import { colors, spacing, typography } from '../../lib/tokens';

export default function ConnectWallet() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConnect() {
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const ws = await connectWallet();
      const updated = await updateProfile({
        wallet: { account: ws.account, permission: ws.permission },
      });
      const token = getToken();
      if (token) {
        await saveSession(token, updated);
      }
      const target = updated.role === 'contractor' ? '/(contractor)/jobs' : '/(homeowner)/jobs';
      router.replace(target);
    } catch (err) {
      const apiErr = err as ApiError | Error;
      setError(apiErr.message ?? 'Failed to connect wallet');
    } finally {
      setSubmitting(false);
    }
  }

  function handleSkip() {
    const user = getCurrentUser();
    const target = user?.role === 'contractor' ? '/(contractor)/jobs' : '/(homeowner)/jobs';
    router.replace(target);
  }

  return (
    <Screen>
      <Header
        title="Connect your wallet"
        subtitle="Sign payments with WebAuth — your XPR testnet account is the payment signer."
      />

      <View style={styles.info}>
        <Text style={[typography.body, { color: colors.text }]}>
          You&apos;ll need the WebAuth app installed. After tapping Connect, WebAuth will open and
          ask you to approve the pairing.
        </Text>
        {error && <Text style={[typography.caption, { color: colors.danger }]}>{error}</Text>}
      </View>

      <View style={styles.actions}>
        <Button
          label={submitting ? 'Waiting for WebAuth…' : 'Connect WebAuth'}
          fullWidth
          onPress={handleConnect}
          disabled={submitting}
        />
        <Text
          style={[typography.caption, { color: colors.textMuted, textAlign: 'center' }]}
          onPress={handleSkip}
        >
          Skip for now
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  info: { gap: spacing.sm },
  actions: { gap: spacing.md },
});
