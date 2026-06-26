import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { colors, spacing, typography } from '../../lib/tokens';

const ROWS = [
  { label: 'WebAuth wallet', value: 'wlt.xprnetwork.io / verified' },
  { label: 'Property address', value: 'Seattle, WA · 98103' },
  { label: 'Notification preferences', value: 'Push + email' },
  { label: 'Payment methods', value: '2 active (XPR, USDC)' },
  { label: 'Help & support', value: '' },
  { label: 'Legal & privacy', value: '' },
];

export default function HomeownerProfile() {
  return (
    <Screen>
      <Header title="Profile" subtitle="Account, wallet, preferences" />

      <Card>
        <View style={styles.heroRow}>
          <Avatar name="Sarah Tanner" color={colors.homeowner} size={64} />
          <View style={{ flex: 1 }}>
            <Text style={[typography.h2, { color: colors.text }]}>Sarah Tanner</Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}>
              Homeowner · joined 2026
            </Text>
            <Text style={[typography.micro, { color: colors.accent, marginTop: 4 }]}>
              ● ID verified · ● wallet linked
            </Text>
          </View>
        </View>
      </Card>

      <View style={styles.statsRow}>
        <Card variant="alt" style={styles.statCard}>
          <Text style={[typography.h2, { color: colors.brand }]}>7</Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>Jobs posted</Text>
        </Card>
        <Card variant="alt" style={styles.statCard}>
          <Text style={[typography.h2, { color: colors.accent }]}>$58k</Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>Total released</Text>
        </Card>
      </View>

      <Card>
        {ROWS.map((r, i) => (
          <View key={r.label} style={[styles.row, i < ROWS.length - 1 && styles.divider]}>
            <Text style={[typography.body, { color: colors.text }]}>{r.label}</Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}>{r.value || '›'}</Text>
          </View>
        ))}
      </Card>

      <Button label="Sign out" variant="ghost" fullWidth />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statCard: { flex: 1, gap: spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.md },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border },
});
