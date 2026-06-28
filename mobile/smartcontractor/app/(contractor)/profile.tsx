import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { getCurrentUser, saveSession, getToken } from '../../lib/api';
import { logout, updateProfile } from '../../lib/auth';
import { MOCK_REVIEWS, summarize } from '../../lib/reviews';
import { clearSession as clearWebauthSession } from '../../lib/webauth';
import { colors, radius, spacing, typography } from '../../lib/tokens';

export default function ContractorProfile() {
  const router = useRouter();
  const user = getCurrentUser();
  const [busy, setBusy] = useState(false);

  async function handleSignOut() {
    if (busy) return;
    setBusy(true);
    try {
      await logout();
      await clearWebauthSession();
      router.replace('/');
    } finally {
      setBusy(false);
    }
  }

  async function handleDisconnectWallet() {
    if (busy) return;
    setBusy(true);
    try {
      const updated = await updateProfile({ wallet: null });
      await clearWebauthSession();
      const token = getToken();
      if (token) await saveSession(token, updated);
      router.replace('/(auth)/connect-wallet');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to disconnect';
      Alert.alert('Disconnect failed', msg);
    } finally {
      setBusy(false);
    }
  }

  const displayName = user?.full_name || user?.email?.split('@')[0] || 'Contractor';
  const walletLabel = user?.wallet?.account
    ? `${user.wallet.account} · ${user.wallet.permission ?? 'active'}`
    : 'Not connected';

  const rows = [
    { label: 'Email', value: user?.email ?? '—' },
    { label: 'WebAuth wallet', value: walletLabel },
    { label: 'Phone', value: user?.phone || '—' },
    { label: 'Verification', value: user?.verification_status ?? '—' },
  ];

  return (
    <Screen>
      <Header title="Profile" subtitle="Verification, reputation, payouts" />

      <Card>
        <View style={styles.heroRow}>
          <Avatar name={displayName} color={colors.contractor} size={64} />
          <View style={{ flex: 1, gap: spacing.xs }}>
            <Text style={[typography.h2, { color: colors.text }]}>{displayName}</Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}>Contractor</Text>
            <Text style={[typography.micro, { color: colors.accent, marginTop: 4 }]}>
              ● {user?.wallet?.account ? 'wallet linked' : 'wallet not connected'}
            </Text>
          </View>
        </View>
      </Card>

      <Card>
        {rows.map((r, i) => (
          <View key={r.label} style={[styles.row, i < rows.length - 1 && styles.divider]}>
            <Text style={[typography.body, { color: colors.text }]}>{r.label}</Text>
            <Text style={[typography.caption, { color: colors.textMuted }]} numberOfLines={1}>
              {r.value}
            </Text>
          </View>
        ))}
      </Card>

      <ReviewsBlock />

      <View style={{ gap: spacing.sm }}>
        <Button
          label="Activity"
          variant="ghost"
          fullWidth
          onPress={() => router.push('/notifications' as never)}
        />
        <Button
          label="Settings"
          variant="ghost"
          fullWidth
          onPress={() => router.push('/settings' as never)}
        />
        {user?.wallet?.account ? (
          <Button
            label={busy ? 'Working…' : 'Disconnect wallet'}
            variant="ghost"
            fullWidth
            onPress={handleDisconnectWallet}
            disabled={busy}
          />
        ) : (
          <Button
            label="Connect wallet"
            fullWidth
            onPress={() => router.push('/(auth)/connect-wallet')}
            disabled={busy}
          />
        )}
        <Button
          label={busy ? 'Working…' : 'Sign out'}
          variant="ghost"
          fullWidth
          onPress={handleSignOut}
          disabled={busy}
        />
      </View>
    </Screen>
  );
}

function ReviewsBlock() {
  const summary = summarize(MOCK_REVIEWS);
  const max = Math.max(...Object.values(summary.distribution));
  return (
    <Card>
      <View style={styles.reviewsHeader}>
        <View>
          <Text style={[typography.h2, { color: colors.text }]}>{summary.average.toFixed(1)}</Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            {summary.count} reviews
          </Text>
        </View>
        <View style={{ flex: 1, gap: 4, marginLeft: spacing.lg }}>
          {([5, 4, 3, 2, 1] as const).map((star) => {
            const count = summary.distribution[star];
            const pct = max === 0 ? 0 : (count / max) * 100;
            return (
              <View key={star} style={styles.barRow}>
                <Text style={[typography.micro, { color: colors.textMuted, width: 16 }]}>{star}★</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${pct}%` }]} />
                </View>
                <Text style={[typography.micro, { color: colors.textDim, width: 20, textAlign: 'right' }]}>
                  {count}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={{ gap: spacing.md, marginTop: spacing.md }}>
        {MOCK_REVIEWS.slice(0, 3).map((r) => (
          <View key={r.id} style={styles.reviewItem}>
            <View style={styles.row}>
              <Text style={[typography.bodyStrong, { color: colors.text }]}>{r.reviewer}</Text>
              <Text style={[typography.micro, { color: colors.textDim }]}>{r.daysAgo}d ago</Text>
            </View>
            <Text style={[typography.micro, { color: colors.warning }]}>{'★'.repeat(r.rating)}</Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}>{r.jobTitle}</Text>
            <Text style={[typography.body, { color: colors.text }]}>{r.body}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  heroRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.md, gap: spacing.md },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  reviewsHeader: { flexDirection: 'row', alignItems: 'center' },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: colors.warning, borderRadius: radius.pill },
  reviewItem: {
    gap: spacing.xs,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
