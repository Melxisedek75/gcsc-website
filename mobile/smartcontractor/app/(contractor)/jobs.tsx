import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { mockJobs } from '../../lib/mock';
import { listSavedJobIds, toggleSaved } from '../../lib/saved';
import { colors, radius, spacing, typography } from '../../lib/tokens';

const FILTERS = ['All', 'Saved', 'Near me', 'Renovation', 'Exterior', 'Repair'];

export default function ContractorJobs() {
  const router = useRouter();
  const [filter, setFilter] = useState<string>('All');
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      listSavedJobIds().then((ids) => {
        if (!cancelled) setSavedIds(ids);
      });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  async function handleToggle(jobId: string) {
    const nextOn = await toggleSaved(jobId);
    setSavedIds((prev) =>
      nextOn ? [jobId, ...prev.filter((x) => x !== jobId)] : prev.filter((x) => x !== jobId),
    );
  }

  const visibleJobs = mockJobs
    .filter((j) => j.status === 'open' || j.status === 'bidding')
    .filter((j) => {
      if (filter === 'All') return true;
      if (filter === 'Saved') return savedIds.includes(j.id);
      if (filter === 'Near me') return true;
      return j.category === filter;
    });

  return (
    <Screen>
      <Header
        title="Available jobs"
        subtitle={`${visibleJobs.length} matching · ${savedIds.length} saved`}
      />

      <View style={styles.filters}>
        {FILTERS.map((f) => {
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
                : 'No jobs match this filter.'}
            </Text>
          </Card>
        ) : (
          visibleJobs.map((j) => {
            const saved = savedIds.includes(j.id);
            return (
              <Card key={j.id}>
                <View style={styles.row}>
                  <Badge label={j.category.toUpperCase()} color={colors.contractor} />
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                    <Text style={[typography.micro, { color: colors.textDim }]}>{j.postedAgo} ago</Text>
                    <Pressable onPress={() => handleToggle(j.id)} hitSlop={8}>
                      <Text style={{ fontSize: 22, color: saved ? colors.warning : colors.textDim }}>
                        {saved ? '★' : '☆'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
                <Text style={[typography.h3, { color: colors.text }]}>{j.title}</Text>
                <Text style={[typography.caption, { color: colors.textMuted }]}>{j.location}</Text>
                <Text style={[typography.body, { color: colors.textMuted }]} numberOfLines={2}>
                  {j.description}
                </Text>
                <View style={styles.row}>
                  <View>
                    <Text style={[typography.micro, { color: colors.textDim }]}>Budget</Text>
                    <Text style={[typography.bodyStrong, { color: colors.text }]}>{j.budget}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[typography.micro, { color: colors.textDim }]}>Competition</Text>
                    <Text style={[typography.bodyStrong, { color: colors.text }]}>{j.bids} bids</Text>
                  </View>
                </View>
                <Button
                  label="Submit a bid"
                  fullWidth
                  onPress={() => router.push(`/(contractor)/bid-submit/${j.id}` as never)}
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
