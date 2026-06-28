import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { LocalJob, listJobs } from '../../lib/jobs';
import { colors, spacing, typography } from '../../lib/tokens';

const STATUS_LABEL: Record<LocalJob['status'], string> = {
  published: 'Published',
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

function explorerUrl(tx: string): string {
  return `https://testnet.explorer.xprnetwork.org/transaction/${tx}`;
}

function shortTx(tx: string): string {
  return tx ? `${tx.slice(0, 8)}…${tx.slice(-6)}` : '—';
}

function timeAgo(ts: number): string {
  const sec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

export default function HomeownerJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState<LocalJob[]>([]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      listJobs().then((list) => {
        if (!cancelled) setJobs(list);
      });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const active = jobs.filter((j) => j.status === 'published' || j.status === 'bidding').length;
  const inProgress = jobs.filter((j) => j.status === 'in_progress').length;
  const completed = jobs.filter((j) => j.status === 'completed').length;

  return (
    <Screen>
      <Header title="My jobs" subtitle="Track posted projects and contractor activity" />

      <View style={styles.summary}>
        <SummaryStat label="Active" value={String(active)} color={colors.accent} />
        <SummaryStat label="In progress" value={String(inProgress)} color={colors.brand} />
        <SummaryStat label="Completed" value={String(completed)} color={colors.textMuted} />
      </View>

      <Button label="+ Post a new job" fullWidth onPress={() => router.push('/(homeowner)/post-job')} />

      {jobs.length === 0 ? (
        <Card variant="alt">
          <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center' }]}>
            No jobs yet. Post your first one to invite verified contractors.
          </Text>
        </Card>
      ) : (
        <View style={{ gap: spacing.md }}>
          {jobs.map((j) => (
            <Pressable
              key={j.id}
              onPress={() =>
                router.push(`/(homeowner)/job/${j.id}` as never)
              }
              style={({ pressed }) => [pressed && { opacity: 0.7 }]}
            >
              <Card>
                <View style={styles.row}>
                  <Badge label={j.category.toUpperCase()} color={colors.homeowner} />
                  <Badge label={STATUS_LABEL[j.status]} color={STATUS_COLOR[j.status]} />
                </View>
                <Text style={[typography.h3, { color: colors.text }]}>{j.title}</Text>
                {j.zip ? (
                  <Text style={[typography.caption, { color: colors.textMuted }]}>ZIP {j.zip}</Text>
                ) : null}
                <Text style={[typography.body, { color: colors.textMuted }]} numberOfLines={2}>
                  {j.description || '—'}
                </Text>
                <View style={styles.meta}>
                  <Text style={[typography.bodyStrong, { color: colors.text }]}>{j.budget}</Text>
                  <Text style={[typography.caption, { color: colors.textDim }]}>
                    {timeAgo(j.publishedAt)}
                  </Text>
                </View>
                {j.publishTxHash ? (
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      Linking.openURL(explorerUrl(j.publishTxHash));
                    }}
                  >
                    <Text style={[typography.micro, { color: colors.brand }]}>
                      tx {shortTx(j.publishTxHash)} ↗
                    </Text>
                  </Pressable>
                ) : null}
              </Card>
            </Pressable>
          ))}
        </View>
      )}
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
