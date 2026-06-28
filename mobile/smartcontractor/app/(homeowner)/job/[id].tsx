import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { Header } from '../../../components/Header';
import { Screen } from '../../../components/Screen';
import { LocalJob, getJob } from '../../../lib/jobs';
import { colors, spacing, typography } from '../../../lib/tokens';

const STATUS_LABEL: Record<LocalJob['status'], string> = {
  published: 'Published — waiting for bids',
  bidding: 'In bidding',
  in_progress: 'In progress',
  completed: 'Completed',
};

const STATUS_COLOR: Record<LocalJob['status'], string> = {
  published: '#7CA0FF',
  bidding: '#E0B341',
  in_progress: '#3FB97A',
  completed: '#7A8499',
};

type Milestone = {
  label: string;
  pctOfBudget: number;
  state: 'pending' | 'active' | 'done';
};

const DEFAULT_MILESTONES: Milestone[] = [
  { label: 'Materials & site prep', pctOfBudget: 30, state: 'pending' },
  { label: 'Rough work complete', pctOfBudget: 35, state: 'pending' },
  { label: 'Finish & sign-off', pctOfBudget: 35, state: 'pending' },
];

function explorerUrl(tx: string): string {
  return `https://testnet.explorer.xprnetwork.org/transaction/${tx}`;
}

function shortTx(tx: string): string {
  return tx ? `${tx.slice(0, 10)}…${tx.slice(-8)}` : '—';
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString();
}

export default function JobDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [job, setJob] = useState<LocalJob | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      if (!id) {
        setLoading(false);
        return;
      }
      getJob(id).then((result) => {
        if (cancelled) return;
        setJob(result);
        setLoading(false);
      });
      return () => {
        cancelled = true;
      };
    }, [id]),
  );

  if (loading) {
    return (
      <Screen>
        <View style={styles.loader}>
          <ActivityIndicator color={colors.brand} />
        </View>
      </Screen>
    );
  }

  if (!job) {
    return (
      <Screen>
        <Header title="Job not found" subtitle="This job may have been removed." />
        <Button label="Back to my jobs" fullWidth onPress={() => router.replace('/(homeowner)/jobs')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title={job.title} subtitle={STATUS_LABEL[job.status]} />

      <Card>
        <View style={styles.row}>
          <Badge label={job.category.toUpperCase()} color={colors.homeowner} />
          <Badge label={STATUS_LABEL[job.status]} color={STATUS_COLOR[job.status]} />
        </View>

        <View style={styles.detail}>
          <Text style={[typography.micro, { color: colors.textDim }]}>Budget</Text>
          <Text style={[typography.h3, { color: colors.text }]}>{job.budget || '—'}</Text>
        </View>

        {job.zip ? (
          <View style={styles.detail}>
            <Text style={[typography.micro, { color: colors.textDim }]}>Location</Text>
            <Text style={[typography.body, { color: colors.text }]}>ZIP {job.zip}</Text>
          </View>
        ) : null}

        <View style={styles.detail}>
          <Text style={[typography.micro, { color: colors.textDim }]}>Published</Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            {formatDate(job.publishedAt)}
          </Text>
        </View>

        {job.description ? (
          <View style={styles.detail}>
            <Text style={[typography.micro, { color: colors.textDim }]}>Description</Text>
            <Text style={[typography.body, { color: colors.text }]}>{job.description}</Text>
          </View>
        ) : null}
      </Card>

      <Card>
        <Text style={[typography.bodyStrong, { color: colors.text }]}>Milestones</Text>
        <Text style={[typography.caption, { color: colors.textMuted }]}>
          Released to contractor only after your approval at each step.
        </Text>
        <View style={styles.milestoneList}>
          {DEFAULT_MILESTONES.map((m, i) => (
            <View key={m.label} style={styles.milestoneRow}>
              <View style={[styles.dot, { backgroundColor: colors.border }]}>
                <Text style={[typography.micro, { color: colors.textMuted }]}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[typography.body, { color: colors.text }]}>{m.label}</Text>
                <Text style={[typography.caption, { color: colors.textMuted }]}>
                  {m.pctOfBudget}% of budget
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

      {job.publishTxHash ? (
        <Card variant="alt">
          <Text style={[typography.bodyStrong, { color: colors.text }]}>On-chain proof</Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            Publish fee transaction on XPR Network testnet.
          </Text>
          <Pressable onPress={() => Linking.openURL(explorerUrl(job.publishTxHash))}>
            <Text style={[typography.caption, { color: colors.brand }]}>
              tx {shortTx(job.publishTxHash)} ↗
            </Text>
          </Pressable>
        </Card>
      ) : null}

      <View style={{ gap: spacing.sm }}>
        <Button label="View bids" fullWidth variant="ghost" disabled />
        <Button
          label="Back to my jobs"
          fullWidth
          variant="ghost"
          onPress={() => router.replace('/(homeowner)/jobs')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 200 },
  row: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  detail: { gap: spacing.xs, marginTop: spacing.md },
  milestoneList: { gap: spacing.md, marginTop: spacing.sm },
  milestoneRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  dot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
