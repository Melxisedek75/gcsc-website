import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { Milestone, mockMilestones } from '../../lib/mock';
import { colors, radius, spacing, typography } from '../../lib/tokens';

const STATUS: Record<Milestone['status'], { label: string; color: string }> = {
  pending: { label: 'Awaiting upload', color: colors.textMuted },
  submitted: { label: 'Review required', color: colors.warning },
  approved: { label: 'Approved & paid', color: colors.accent },
  rejected: { label: 'Rejected', color: colors.danger },
};

function mockTxHash(): string {
  return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export default function HomeownerMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones);

  function showPhotos(m: Milestone) {
    if (m.photoCount === 0) {
      Alert.alert('No photos yet', 'Contractor has not uploaded proof for this milestone.');
      return;
    }
    const lines = Array.from({ length: m.photoCount }, (_, i) => `• photo_${String(i + 1).padStart(2, '0')}.jpg`);
    Alert.alert(`${m.photoCount} photos`, lines.join('\n'));
  }

  function approve(m: Milestone) {
    Alert.alert(
      'Approve & release',
      `Release ${m.amount} for "${m.step}"?\n\nThis signs an on-chain transaction in WebAuth.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            const tx = mockTxHash();
            setMilestones((prev) =>
              prev.map((x) => (x.id === m.id ? { ...x, status: 'approved' } : x)),
            );
            Alert.alert('Released', `tx ${tx.slice(0, 10)}…${tx.slice(-6)}`);
          },
        },
      ],
    );
  }

  return (
    <Screen>
      <Header title="Milestones" subtitle="Approve work and release escrowed funds" />

      {milestones.map((m) => {
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
                <Button label={`Photos (${m.photoCount})`} variant="secondary" onPress={() => showPhotos(m)} />
                <Button label="Approve & release" onPress={() => approve(m)} />
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
            {m.status === 'rejected' && (
              <Text style={[typography.micro, { color: colors.danger }]}>
                Rejected · awaiting contractor revision
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
