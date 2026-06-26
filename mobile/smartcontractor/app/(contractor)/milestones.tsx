import { StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { colors, radius, spacing, typography } from '../../lib/tokens';
import { mockMilestones } from '../../lib/mock';

const STATUS = {
  pending: { label: 'Upload proof', color: colors.warning },
  submitted: { label: 'Awaiting approval', color: colors.brand },
  approved: { label: 'Paid', color: colors.accent },
  rejected: { label: 'Needs rework', color: colors.danger },
} as const;

export default function ContractorMilestones() {
  return (
    <Screen>
      <Header
        title="Proof of work"
        subtitle="Upload photos, get approval, get paid on-chain"
      />

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

            {m.status === 'pending' && (
              <Button label="Upload photos" fullWidth />
            )}
            {m.status === 'submitted' && (
              <Text style={[typography.micro, { color: colors.brand }]}>
                {m.photoCount} photos sent · AI compliance check passed · awaiting homeowner
              </Text>
            )}
            {m.status === 'approved' && (
              <Text style={[typography.micro, { color: colors.accent }]}>
                Funds released · {m.amount}
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
});
