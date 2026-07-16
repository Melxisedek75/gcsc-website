import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { BackendProject, formatBudget, listBackendProjects, timeAgoIso } from '../../lib/jobs';
import { listSavedJobIds, toggleSaved } from '../../lib/saved';
import { colors, radius, spacing, typography } from '../../lib/tokens';

export default function ContractorJobs() {
  const router = useRouter();
  const [filter, setFilter] = useState<string>('All');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [projects, setProjects] = useState<BackendProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [open, ids] = await Promise.all([listBackendProjects('open'), listSavedJobIds()]);
      setProjects(open);
      setSavedIds(ids);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not load jobs');
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

  async function handleToggle(jobId: string) {
    const nextOn = await toggleSaved(jobId);
    setSavedIds((prev) =>
      nextOn ? [jobId, ...prev.filter((x) => x !== jobId)] : prev.filter((x) => x !== jobId),
    );
  }

  const categories = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));
  const filters = ['All', 'Saved', ...categories];

  const visibleJobs = projects.filter((p) => {
    if (filter === 'All') return true;
    if (filter === 'Saved') return savedIds.includes(String(p.id));
    return p.category === filter;
  });

  if (isLoading) {
    return (
      <Screen>
        <Header title="Available jobs" subtitle="Loading live jobs…" />
        <View style={styles.loader}>
          <ActivityIndicator color={colors.brand} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header
        title="Available jobs"
        subtitle={`${visibleJobs.length} matching · ${savedIds.length} saved`}
      />

      {loadError ? (
        <Card variant="alt">
          <Text style={[typography.body, { color: colors.danger, textAlign: 'center' }]}>
            {loadError}
          </Text>
          <Button label="Retry" fullWidth onPress={() => load()} />
        </Card>
      ) : null}

      <View style={styles.filters}>
        {filters.map((f) => {
          const active = f === filter;
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.chip,
                active && { backgroundColor: colors.brand, borderColor: colors.brand },
              ]}
            >
              <Text
                style={[
                  typography.caption,
                  { color: active ? colors.bg : colors.textMuted, fontWeight: '600' },
                ]}
              >
                {f}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ gap: spacing.md }}>
        {visibleJobs.length === 0 ? (
          <Card variant="alt">
            <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center' }]}>
              {filter === 'Saved'
                ? 'No saved jobs yet. Tap ☆ on a job to bookmark it.'
                : 'No open jobs right now. New homeowner projects appear here the moment they are posted.'}
            </Text>
          </Card>
        ) : (
          visibleJobs.map((p) => {
            const jobId = String(p.id);
            const saved = savedIds.includes(jobId);
            return (
              <Card key={p.id}>
                <View style={styles.row}>
                  <Badge label={(p.category || 'general').toUpperCase()} color={colors.contractor} />
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                    <Text style={[typography.micro, { color: colors.textDim }]}>
                      {timeAgoIso(p.created_at)} ago
                    </Text>
                    <Pressable onPress={() => handleToggle(jobId)} hitSlop={8}>
                      <Text style={{ fontSize: 22, color: saved ? colors.warning : colors.textDim }}>
                        {saved ? '★' : '☆'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
                <Text style={[typography.h3, { color: colors.text }]}>{p.title}</Text>
                {p.location ? (
                  <Text style={[typography.caption, { color: colors.textMuted }]}>{p.location}</Text>
                ) : null}
                <Text style={[typography.body, { color: colors.textMuted }]} numberOfLines={2}>
                  {p.description}
                </Text>
                <View style={styles.row}>
                  <View>
                    <Text style={[typography.micro, { color: colors.textDim }]}>Budget</Text>
                    <Text style={[typography.bodyStrong, { color: colors.text }]}>
                      {formatBudget(p)}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[typography.micro, { color: colors.textDim }]}>Timeline</Text>
                    <Text style={[typography.bodyStrong, { color: colors.text }]}>
                      {p.timeline_days} days
                    </Text>
                  </View>
                </View>
                <Button
                  label="Submit a bid"
                  fullWidth
                  onPress={() => router.push(`/(contractor)/bid-submit/${p.id}` as never)}
                />
              </Card>
            );
          })
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 200 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
