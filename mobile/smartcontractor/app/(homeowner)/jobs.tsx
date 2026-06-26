import { StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { colors, spacing, typography } from '../../lib/tokens';
import { mockJobs, statusColor, statusLabel } from '../../lib/mock';

export default function HomeownerJobs() {
  return (
    <Screen>
      <Header title="My jobs" subtitle="Track posted projects and contractor activity" />

      <View style={styles.summary}>
        <SummaryStat label="Active" value="2" color={colors.accent} />
        <SummaryStat label="In review" value="1" color={colors.brand} />
        <SummaryStat label="Completed" value="4" color={colors.textMuted} />
      </View>

      <Button label="+ Post a new job" fullWidth />

      <View style={{ gap: spacing.md }}>
        {mockJobs.map((j) => (
          <Card key={j.id}>
            <View style={styles.row}>
              <Badge label={j.category.toUpperCase()} color={colors.homeowner} />
              <Badge label={statusLabel[j.status]} color={statusColor[j.status]} />
            </View>
            <Text style={[typography.h3, { color: colors.text }]}>{j.title}</Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}>{j.location}</Text>
            <View style={styles.meta}>
              <Text style={[typography.bodyStrong, { color: colors.text }]}>{j.budget}</Text>
              <Text style={[typography.caption, { color: colors.textDim }]}>
                {j.bids} bids · {j.postedAgo} ago
              </Text>
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

function SummaryStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Card variant="alt" style={styles.stat}>
      <Text style={[typography.display, { color, fontSize: 26 }]}>{value}</Text>
      <Text style={[typography.caption, { color: colors.textMuted }]}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', gap: spacing.sm },
  stat: { flex: 1, alignItems: 'flex-start' },
  row: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs },
});
