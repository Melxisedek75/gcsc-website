import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../components/Avatar';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { colors, spacing, typography } from '../../lib/tokens';
import { mockContractors } from '../../lib/mock';

const me = mockContractors[0];

const ROWS = [
  { label: 'License & insurance', value: 'WA #BLDR-44182 · active' },
  { label: 'WebAuth wallet', value: 'wlt.xprnetwork.io / linked' },
  { label: 'Trades & coverage', value: me.trades.join(', ') },
  { label: 'Service radius', value: '25 mi from Seattle' },
  { label: 'Payouts', value: 'XPR + USDC' },
  { label: 'Help & support', value: '' },
];

export default function ContractorProfile() {
  return (
    <Screen>
      <Header title="Profile" subtitle="Verification, reputation, payouts" />

      <Card>
        <View style={styles.heroRow}>
          <Avatar name={me.name} color={me.avatarColor} size={64} />
          <View style={{ flex: 1, gap: spacing.xs }}>
            <Text style={[typography.h2, { color: colors.text }]}>{me.name}</Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}>{me.company}</Text>
            <View style={{ flexDirection: 'row', gap: spacing.xs }}>
              {me.verified && <Badge label="VERIFIED" color={colors.accent} tone="solid" />}
              <Badge label={`★ ${me.rating}`} color={colors.brand} />
            </View>
          </View>
        </View>
      </Card>

      <View style={styles.statsRow}>
        <Card variant="alt" style={styles.statCard}>
          <Text style={[typography.h2, { color: colors.brand }]}>{me.jobs}</Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>Jobs done</Text>
        </Card>
        <Card variant="alt" style={styles.statCard}>
          <Text style={[typography.h2, { color: colors.accent }]}>{me.yearsActive}y</Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>Active</Text>
        </Card>
        <Card variant="alt" style={styles.statCard}>
          <Text style={[typography.h2, { color: colors.homeowner }]}>92%</Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>On-time</Text>
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
