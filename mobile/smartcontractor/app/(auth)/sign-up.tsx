import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { ApiError, UserRole } from '../../lib/api';
import { register } from '../../lib/auth';
import { colors, radius, spacing, typography } from '../../lib/tokens';

export default function SignUp() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const initialRole: UserRole = params.role === 'contractor' ? 'contractor' : 'homeowner';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    if (submitting) return;
    setError(null);
    if (!email || !password) {
      setError('Email and password required');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setSubmitting(true);
    try {
      const res = await register({ email, password, role, fullName });
      if (res.verification_required) {
        router.push({
          pathname: '/(auth)/verify',
          params: { email, channel: res.verification_channel },
        });
        return;
      }
      // New accounts have no wallet yet — route to wallet connect so payments
      // (which require a bound wallet) work. connect-wallet forwards to jobs.
      router.replace('/(auth)/connect-wallet');
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message ?? 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <Header title="Create your account" subtitle="Choose your role to get started" />

      <View style={styles.roleRow}>
        <RoleChip
          label="Homeowner"
          active={role === 'homeowner'}
          accent={colors.homeowner}
          onPress={() => setRole('homeowner')}
        />
        <RoleChip
          label="Contractor"
          active={role === 'contractor'}
          accent={colors.contractor}
          onPress={() => setRole('contractor')}
        />
      </View>

      <View style={styles.form}>
        <Input
          label="Full name"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Jane Doe"
        />
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
          placeholder="At least 8 characters"
          secureTextEntry
        />
        {error && <Text style={[typography.caption, { color: colors.danger }]}>{error}</Text>}
      </View>

      <Button
        label={submitting ? 'Creating account…' : 'Create account'}
        fullWidth
        onPress={handleRegister}
        disabled={submitting}
      />

      <Text style={[typography.caption, { color: colors.textMuted, textAlign: 'center' }]}>
        Already have an account?{' '}
        <Link href="/(auth)/sign-in" style={{ color: colors.brand, fontWeight: '600' }}>
          Sign in
        </Link>
      </Text>
    </Screen>
  );
}

interface RoleChipProps {
  label: string;
  active: boolean;
  accent: string;
  onPress: () => void;
}

function RoleChip({ label, active, accent, onPress }: RoleChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { borderColor: active ? accent : colors.surfaceAlt, backgroundColor: active ? accent + '22' : colors.surface },
      ]}
    >
      <Text style={[typography.bodyStrong, { color: active ? colors.text : colors.textMuted }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md },
  roleRow: { flexDirection: 'row', gap: spacing.sm },
  chip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
});
