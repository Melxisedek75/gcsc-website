import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import {
  BackendMilestone,
  MilestoneStatus,
  getEscrowDetail,
  listMyEscrows,
  submitMilestone,
} from '../../lib/escrows';
import { listBackendProjects } from '../../lib/jobs';
import { colors, radius, spacing, typography } from '../../lib/tokens';

const STATUS: Record<MilestoneStatus, { label: string; color: string }> = {
  pending: { label: 'Submit work', color: colors.warning },
  submitted: { label: 'Awaiting approval', color: colors.brand },
  approved: { label: 'Approved', color: colors.accent },
  released: { label: 'Paid', color: colors.accent },
  disputed: { label: 'Disputed', color: colors.danger },
};

interface MilestoneRow extends BackendMilestone {
  projectTitle: string;
  escrowTotal: number;
}

export default function ContractorMilestones() {
  const [rows, setRows] = useState<MilestoneRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [escrows, projects] = await Promise.all([listMyEscrows(), listBackendProjects()]);
      const titles = Object.fromEntries(projects.map((p) => [p.id, p.title]));
      const details = await Promise.all(escrows.map((e) => getEscrowDetail(e.id)));
      const flat: MilestoneRow[] = details.flatMap(({ escrow, milestones }) =>
        milestones.map((m) => ({
          ...m,
          projectTitle: titles[escrow.project_id] ?? `Project #${escrow.project_id}`,
          escrowTotal: escrow.total_amount,
        })),
      );
      setRows(flat);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not load milestones');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      load().then(() => {
        if (cancelled) return;
      });
      return () => {
        cancelled = true;
      };
    }, [load]),
  );

  function handleSubmit(m: MilestoneRow) {
    if (isBusy) return;
    Alert.alert(
      'Submit this milestone?',
      `"${m.title}" will be sent to the homeowner for review and payment approval.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: async () => {
            setIsBusy(true);
            try {
              await submitMilestone(m.id);
              await load();
              Alert.alert('Submitted', 'Homeowner has been notified and will review your work.');
            } catch (err) {
              const msg = (err as { message?: string }).message ?? 'Failed to submit milestone';
              Alert.alert('Error', msg);
            } finally {
              setIsBusy(false);
            }
          },
        },
      ],
    );
  }

  if (isLoading) {
    return (
      <Screen>
        <Header title="Proof of work" subtitle="Loading your milestones…" />
        <View style={styles.loader}>
          <ActivityIndicator color={colors.brand} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Proof of work" subtitle="Submit work, get approval, get paid" />

      {loadError ? (
        <Card variant="alt">
          <Text style={[typography.body, { color: colors.danger, textAlign: 'center' }]}>
            {loadError}
          </Text>
          <Button label="Retry" fullWidth onPress={() => load()} />
        </Card>
      ) : null}

      {rows.length === 0 && !loadError ? (
        <Card variant="alt">
          <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center' }]}>
            No milestones yet. When a homeowner accepts your bid and defines milestones, they
            appear here.
          </Text>
        </Card>
      ) : (
        rows.map((m) => {
          const st = STATUS[m.status] ?? STATUS.pending;
          const percent = m.escrowTotal > 0 ? Math.round((m.amount / m.escrowTotal) * 100) : 0;
          return (
            <Card key={m.id}>
              <View style={styles.row}>
                <Text style={[typography.caption, { color: colors.textMuted }]}>
                  {m.projectTitle}
                </Text>
                <Badge label={st.label} color={st.color} />
              </View>
              <Text style={[typography.h3, { color: colors.text }]}>{m.title}</Text>
              {m.description ? (
                <Text style={[typography.caption, { color: colors.textMuted }]} numberOfLines={2}>
                  {m.description}
                </Text>
              ) : null}

              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${percent}%` }]} />
              </View>
              <View style={styles.row}>
                <Text style={[typography.caption, { color: colors.textMuted }]}>
                  {percent}% of project
                </Text>
                <Text style={[typography.bodyStrong, { color: colors.text }]}>
                  ${m.amount.toLocaleString()}
                </Text>
              </View>

              {m.status === 'pending' && (
                <Button
                  label={isBusy ? 'Working…' : 'Submit for review'}
                  fullWidth
                  onPress={() => handleSubmit(m)}
                  disabled={isBusy}
                />
              )}
              {m.status === 'submitted' && (
                <Text style={[typography.micro, { color: colors.brand }]}>
                  Sent for review · awaiting homeowner approval
                </Text>
              )}
              {m.status === 'approved' && (
                <Text style={[typography.micro, { color: colors.accent }]}>
                  Approved · payment release pending
                </Text>
              )}
              {m.status === 'released' && (
                <Text style={[typography.micro, { color: colors.accent }]}>
                  Funds released · ${m.amount.toLocaleString()}
                </Text>
              )}
              {m.status === 'disputed' && (
                <Text style={[typography.micro, { color: colors.danger }]}>
                  Disputed — see details in chat with the homeowner
                </Text>
              )}
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 200 },
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
