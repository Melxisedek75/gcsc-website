import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { ApiError } from '../../lib/api';
import { verifyCode } from '../../lib/auth';
import { colors, spacing, typography } from '../../lib/tokens';

export default function Verify() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; channel?: string }>();
  const channel = params.channel === 'sms' ? 'sms' : 'email';
  const [email, setEmail] = useState(params.email ?? '');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleVerify() {
    if (submitting) return;
    setError(null);
    if (!email || !code) {
      setError('Email and code required');
      return;
    }
    setSubmitting(true);
    try {
      const user = await verifyCode(email, code);
      if (!user) {
        setError('Verified, but no session returned. Please sign in.');
        router.replace('/(auth)/sign-in');
        return;
      }
      const target = user.role === 'contractor' ? '/(contractor)/jobs' : '/(homeowner)/jobs';
      router.replace(target);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message ?? 'Verification failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <Header
        title="Verify your account"
        subtitle={
          channel === 'sms'
            ? 'Enter the 6-digit code we sent via SMS'
            : 'Enter the 6-digit code we sent to your email'
        }
      />

      <View style={styles.form}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!params.email}
        />
        <Input
          label="Verification code"
          value={code}
          onChangeText={setCode}
          placeholder="123456"
          keyboardType="number-pad"
          autoCapitalize="none"
          maxLength={6}
        />
        {error && <Text style={[typography.caption, { color: colors.danger }]}>{error}</Text>}
      </View>

      <Button
        label={submitting ? 'Verifying…' : 'Verify'}
        fullWidth
        onPress={handleVerify}
        disabled={submitting}
      />

      <Text style={[typography.caption, { color: colors.textMuted, textAlign: 'center' }]}>
        Didn&apos;t get a code? Check spam, or sign up again to resend.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md },
});
