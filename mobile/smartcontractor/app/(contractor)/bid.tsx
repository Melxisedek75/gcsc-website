import { StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { colors, spacing, typography } from '../../lib/tokens';
import { mockBids } from '../../lib/mock';

const BID_COLOR = {
  submitted: colors.textMuted,
  shortlisted: colors.warning,
  won: colors.accent,
  lost: colors.danger,
} as const;

const BID_LABEL = {
  submitted: 'Submitted',
  shortlisted: 'Shortlisted',
  won: 'Won',
  lost: 'Not selected',
} as const;

export default function ContractorBids() {
  const wins = mockBids.filter((b) => b.status === 'won').length;
  const pending = mockBids.filter((b) => b.status === 'submitted' || b.status === 'shortlisted').length;

  return (
    <Screen>
      <Header title="My bids" subtitle="Track submitted bids and conversion" />

      <View style={styles.summary}>
        <Card variant="alt" style={styles.stat}>
          <Text style={[typography.h2, { color: colors.brand }]}>{mockBids.length}</Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>Total bids</Text>
        </Card>
        <Card variant="alt" style={styles.stat}>
          <Text style={[typography.h2, { color: colors.warning }]}>{pending}</Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>In review</Text>
        </Card>
        <Card variant="alt" style={styles.stat}>
          <Text style={[typography.h2, { color: colors.accent }]}>{wins}</Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>Won</Text>
        </Card>
      </View>

      {mockBids.map((b) => (
        <Card key={b.id}>
          <View style={styles.row}>
            <Text style={[typography.caption, { color: colors.textMuted }]}>
              {b.submittedAgo} ago
            </Text>
            <Badge label={BID_LABEL[b.status]} color={BID_COLOR[b.status]} />
          </View>
          <Text style={[typography.h3, { color: colors.text }]}>{b.jobTitle}</Text>
          <View style={styles.metaRow}>
            <View>
              <Text style={[typography.micro, { color: colors.textDim }]}>Your bid</Text>
              <Text style={[typography.bodyStrong, { color: colors.text }]}>{b.amount}</Text>
            </View>
            <View>
              <Text style={[typography.micro, { color: colors.textDim }]}>Timeline</Text>
              <Text style={[typography.bodyStrong, { color: colors.text }]}>{b.timeline}</Text>
            </View>
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', gap: spacing.sm },
  stat: { flex: 1, gap: spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaRow: { flexDirection: 'row', gap: spacing.xxl, marginTop: spacing.xs },
});
