import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { ApiError } from '../../lib/api';
import { login } from '../../lib/auth';
import { primeSessionFromBackend } from '../../lib/webauth';
import { colors, spacing, typography } from '../../lib/tokens';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    if (submitting) return;
    setError(null);
    if (!email || !password) {
      setError('Email and password required');
      return;
    }
    setSubmitting(true);
    try {
      const user = await login(email, password);
      // Payments require a bound wallet — if none yet, go connect one first.
      if (!user.wallet?.account) {
        router.replace('/(auth)/connect-wallet');
        return;
      }
      // Fresh installs have no local WebAuth session; without priming it from
      // the profile wallet the first payment fails with "No WebAuth session".
      await primeSessionFromBackend(user.wallet.account, user.wallet.permission ?? 'active');
      const target = user.role === 'contractor' ? '/(contractor)/jobs' : '/(homeowner)/jobs';
      router.replace(target);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message ?? 'Sign in failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <Header title="Welcome back" subtitle="Sign in to continue to SmartContractor" />

      <View style={styles.form}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />
        {error && (
          <Text style={[typography.caption, { color: colors.danger }]}>{error}</Text>
        )}
        <Text style={[typography.caption, { color: colors.brand, alignSelf: 'flex-end' }]}>
          Forgot password?
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          label={submitting ? 'Signing in…' : 'Sign in'}
          fullWidth
          onPress={handleSignIn}
          disabled={submitting}
        />
        {/* Wallet-first login is a future feature; the button was a no-op and
            confused testers, so it is removed until the flow exists. */}
      </View>

      <Text style={[typography.caption, { color: colors.textMuted, textAlign: 'center' }]}>
        New here?{' '}
        <Link href="/(auth)/sign-up" style={{ color: colors.brand, fontWeight: '600' }}>
          Create account
        </Link>
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md },
  actions: { gap: spacing.sm },
});
