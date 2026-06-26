import { StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { colors, radius, spacing, typography } from '../../lib/tokens';
import { mockMilestones } from '../../lib/mock';

const STATUS = {
  pending: { label: 'Awaiting upload', color: colors.textMuted },
  submitted: { label: 'Review required', color: colors.warning },
  approved: { label: 'Approved & paid', color: colors.accent },
  rejected: { label: 'Rejected', color: colors.danger },
} as const;

export default function HomeownerMilestones() {
  return (
    <Screen>
      <Header title="Milestones" subtitle="Approve work and release escrowed funds" />

      {mockMilestones.map((m) => {
        const st = STATUS[m.status];
        return (
          <Card key={m.id}>
            <View style={styles.row}>
              <Text style={[typography.caption, { color: colors.textMuted }]}>{m.jobTitle}</Text>
              <Badge label={st.label} color={st.color} />
            </View>
            <Text style={[typography.h3, { color: colors.text }]}>{m.step}</Text>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${m.percent}%` }]} />
            </View>
            <View style={styles.row}>
              <Text style={[typography.caption, { color: colors.textMuted }]}>
                {m.percent}% of project
              </Text>
              <Text style={[typography.bodyStrong, { color: colors.text }]}>{m.amount}</Text>
            </View>

            {m.status === 'submitted' && (
              <View style={styles.actions}>
                <Button label={`Photos (${m.photoCount})`} variant="secondary" />
                <Button label="Approve & release" />
              </View>
            )}
            {m.status === 'approved' && (
              <Text style={[typography.micro, { color: colors.accent }]}>
                Released on-chain · tx confirmed
              </Text>
            )}
            {m.status === 'pending' && (
              <Text style={[typography.micro, { color: colors.textDim }]}>
                Contractor will upload proof when ready
              </Text>
            )}
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressTrack: {
    height: 6,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginVertical: spacing.xs,
  },
  progressFill: { height: '100%', backgroundColor: colors.brand, borderRadius: radius.pill },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
});
