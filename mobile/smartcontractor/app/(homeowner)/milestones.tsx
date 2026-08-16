import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import {
  BackendEscrow,
  BackendMilestone,
  MilestoneStatus,
  addMilestone,
  approveMilestone,
  getEscrowDetail,
  listMyEscrows,
  releaseMilestone,
} from '../../lib/escrows';
import { listBackendProjects } from '../../lib/jobs';
import { colors, radius, spacing, typography } from '../../lib/tokens';

const STATUS: Record<MilestoneStatus, { label: string; color: string }> = {
  pending: { label: 'Awaiting work', color: colors.textMuted },
  submitted: { label: 'Review required', color: colors.warning },
  approved: { label: 'Approved', color: colors.brand },
  released: { label: 'Paid out', color: colors.accent },
  disputed: { label: 'Disputed', color: colors.danger },
};

interface EscrowSection {
  escrow: BackendEscrow;
  projectTitle: string;
  milestones: BackendMilestone[];
}

type AddMilestoneFormProps = {
  onAdd: (title: string, amount: number) => Promise<void>;
};

function AddMilestoneForm({ onAdd }: AddMilestoneFormProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const amountValue = parseInt(amount.replace(/[^0-9]/g, ''), 10) || 0;
  const canAdd = title.trim().length > 0 && amountValue > 0;

  async function handleAdd() {
    if (!canAdd || isSaving) return;
    setIsSaving(true);
    try {
      await onAdd(title.trim(), amountValue);
      setTitle('');
      setAmount('');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
      <Input label="Milestone title" value={title} onChangeText={setTitle} placeholder="Demolition + prep" />
      <Input
        label="Amount (USD)"
        value={amount}
        onChangeText={setAmount}
        placeholder="2500"
        keyboardType="number-pad"
      />
      <Button
        label={isSaving ? 'Adding…' : 'Add milestone'}
        fullWidth
        variant="secondary"
        onPress={handleAdd}
        disabled={!canAdd || isSaving}
      />
    </View>
  );
}

export default function HomeownerMilestones() {
  const router = useRouter();
  const [sections, setSections] = useState<EscrowSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [escrows, projects] = await Promise.all([listMyEscrows(), listBackendProjects()]);
      const titles = Object.fromEntries(projects.map((p) => [p.id, p.title]));
      const details = await Promise.all(escrows.map((e) => getEscrowDetail(e.id)));
      setSections(
        details.map(({ escrow, milestones }) => ({
          escrow,
          projectTitle: titles[escrow.project_id] ?? `Project #${escrow.project_id}`,
          milestones,
        })),
      );
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

  async function runAction(label: string, action: () => Promise<unknown>) {
    if (isBusy) return;
    setIsBusy(true);
    try {
      await action();
      await load();
    } catch (err) {
      const msg = (err as { message?: string }).message ?? `Failed to ${label}`;
      Alert.alert('Error', msg);
    } finally {
      setIsBusy(false);
    }
  }

  function handleApprove(m: BackendMilestone) {
    Alert.alert('Approve milestone?', `Approve "${m.title}" ($${m.amount.toLocaleString()})?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Approve', onPress: () => runAction('approve', () => approveMilestone(m.id)) },
    ]);
  }

  function handleRelease(m: BackendMilestone) {
    Alert.alert(
      'Release payment?',
      `Release $${m.amount.toLocaleString()} for "${m.title}" to the contractor?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Release', onPress: () => runAction('release', () => releaseMilestone(m.id)) },
      ],
    );
  }

  function reportIssue(section: EscrowSection, m: BackendMilestone) {
    router.push({
      pathname: '/dispute',
      params: {
        scope: 'milestone',
        refId: String(m.id),
        refLabel: `${section.projectTitle} — ${m.title}`,
        role: 'homeowner',
      },
    } as never);
  }

  if (isLoading) {
    return (
      <Screen>
        <Header title="Milestones" subtitle="Loading your escrows…" />
        <View style={styles.loader}>
          <ActivityIndicator color={colors.brand} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Milestones" subtitle="Define work stages, approve, release payment" />

      {loadError ? (
        <Card variant="alt">
          <Text style={[typography.body, { color: colors.danger, textAlign: 'center' }]}>
            {loadError}
          </Text>
          <Button label="Retry" fullWidth onPress={() => load()} />
        </Card>
      ) : null}

      {sections.length === 0 && !loadError ? (
        <Card variant="alt">
          <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center' }]}>
            No escrows yet. Accept a contractor's bid on one of your jobs to open an escrow, then
            define its milestones here.
          </Text>
        </Card>
      ) : (
        sections.map((section) => {
          const allocated = section.milestones.reduce((sum, m) => sum + m.amount, 0);
          const remaining = section.escrow.total_amount - allocated;
          return (
            <Card key={section.escrow.id}>
              <View style={styles.row}>
                <Text style={[typography.bodyStrong, { color: colors.text }]}>
                  {section.projectTitle}
                </Text>
                <Badge
                  label={section.escrow.status.toUpperCase()}
                  color={section.escrow.status === 'completed' ? colors.accent : colors.brand}
                />
              </View>
              <Text style={[typography.caption, { color: colors.textMuted }]}>
                Escrow ${section.escrow.total_amount.toLocaleString()} · $
                {allocated.toLocaleString()} in milestones
                {remaining > 0 ? ` · $${remaining.toLocaleString()} unallocated` : ''}
              </Text>

              {section.milestones.map((m) => {
                const st = STATUS[m.status] ?? STATUS.pending;
                return (
                  <View key={m.id} style={styles.milestone}>
                    <View style={styles.row}>
                      <Text style={[typography.bodyStrong, { color: colors.text }]}>{m.title}</Text>
                      <Badge label={st.label} color={st.color} />
                    </View>
                    <Text style={[typography.caption, { color: colors.textMuted }]}>
                      ${m.amount.toLocaleString()}
                    </Text>
                    {m.status === 'submitted' && (
                      <>
                        <View style={styles.actions}>
                          <Button label="Approve" onPress={() => handleApprove(m)} disabled={isBusy} />
                        </View>
                        <Pressable onPress={() => reportIssue(section, m)}>
                          <Text
                            style={[
                              typography.micro,
                              { color: colors.danger, textAlign: 'center', marginTop: spacing.sm },
                            ]}
                          >
                            Report an issue with this milestone
                          </Text>
                        </Pressable>
                      </>
                    )}
                    {m.status === 'approved' && (
                      <View style={styles.actions}>
                        <Button
                          label="Release payment"
                          onPress={() => handleRelease(m)}
                          disabled={isBusy}
                        />
                      </View>
                    )}
                    {m.status === 'released' && (
                      <Text style={[typography.micro, { color: colors.accent }]}>
                        Released to contractor
                      </Text>
                    )}
                    {m.status === 'disputed' && (
                      <Text style={[typography.micro, { color: colors.danger }]}>
                        Disputed · resolution in progress
                      </Text>
                    )}
                  </View>
                );
              })}

              {section.escrow.status !== 'completed' && (
                <AddMilestoneForm
                  onAdd={async (title, amount) => {
                    try {
                      await addMilestone(section.escrow.id, { title, amount });
                      await load();
                    } catch (err) {
                      const msg = (err as { message?: string }).message ?? 'Failed to add milestone';
                      Alert.alert('Error', msg);
                    }
                  }}
                />
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
  milestone: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
    gap: spacing.xs,
    borderRadius: radius.sm,
  },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
});
