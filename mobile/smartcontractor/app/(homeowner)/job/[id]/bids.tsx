import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../../../components/Badge';
import { Button } from '../../../../components/Button';
import { Card } from '../../../../components/Card';
import { Header } from '../../../../components/Header';
import { Screen } from '../../../../components/Screen';
import { LocalBid, acceptBid, listBidsForJob } from '../../../../lib/bids';
import { colors, spacing, typography } from '../../../../lib/tokens';

const STATUS_LABEL: Record<LocalBid['status'], string> = {
  submitted: 'Submitted',
  shortlisted: 'Shortlisted',
  won: 'Accepted',
  lost: 'Not selected',
};

const STATUS_COLOR: Record<LocalBid['status'], string> = {
  submitted: '#7CA0FF',
  shortlisted: '#E0B341',
  won: '#3FB97A',
  lost: '#7A8499',
};

function timeAgo(ts: number): string {
  const sec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

export default function JobBids() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [bids, setBids] = useState<LocalBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      if (!id) {
        setLoading(false);
        return;
      }
      listBidsForJob(id).then((list) => {
        if (cancelled) return;
        setBids(list);
        setLoading(false);
      });
      return () => {
        cancelled = true;
      };
    }, [id]),
  );

  function handleAccept(b: LocalBid) {
    if (busy) return;
    Alert.alert(
      'Accept this bid?',
      `${b.amount} · ${b.timeline}\n\nAccepting will lock other bids on this job. Escrow opens next.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            setBusy(true);
            try {
              await acceptBid(b.id);
              const refreshed = id ? await listBidsForJob(id) : [];
              setBids(refreshed);
              Alert.alert('Accepted', `${b.amount} bid is now active. Contractor has been notified.`);
            } catch (err) {
              const msg = err instanceof Error ? err.message : 'Failed to accept bid';
              Alert.alert('Error', msg);
            } finally {
              setBusy(false);
            }
          },
        },
      ],
    );
  }

  if (loading) {
    return (
      <Screen>
        <View style={styles.loader}>
          <ActivityIndicator color={colors.brand} />
        </View>
      </Screen>
    );
  }

  const winner = bids.find((b) => b.status === 'won');

  return (
    <Screen>
      <Header
        title="Bids on this job"
        subtitle={
          winner
            ? `${winner.amount} accepted — escrow opens next`
            : `${bids.length} ${bids.length === 1 ? 'bid' : 'bids'} received`
        }
      />

      {bids.length === 0 ? (
        <Card variant="alt">
          <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center' }]}>
            No bids yet. Verified contractors will respond within 24 hours.
          </Text>
        </Card>
      ) : (
        bids.map((b) => {
          const label = STATUS_LABEL[b.status];
          const color = STATUS_COLOR[b.status];
          const canAccept = !winner && b.status !== 'lost';
          return (
            <Card key={b.id}>
              <View style={styles.row}>
                <Text style={[typography.caption, { color: colors.textMuted }]}>
                  {timeAgo(b.submittedAt)}
                </Text>
                <Badge label={label} color={color} />
              </View>
              <View style={styles.metaRow}>
                <View>
                  <Text style={[typography.micro, { color: colors.textDim }]}>Bid</Text>
                  <Text style={[typography.h3, { color: colors.text }]}>{b.amount}</Text>
                </View>
                <View>
                  <Text style={[typography.micro, { color: colors.textDim }]}>Timeline</Text>
                  <Text style={[typography.bodyStrong, { color: colors.text }]}>{b.timeline}</Text>
                </View>
              </View>
              {b.message ? (
                <Text style={[typography.body, { color: colors.textMuted }]} numberOfLines={4}>
                  {b.message}
                </Text>
              ) : null}
              {canAccept ? (
                <Button
                  label={busy ? 'Working…' : 'Accept this bid'}
                  fullWidth
                  onPress={() => handleAccept(b)}
                  disabled={busy}
                />
              ) : null}
              {b.status === 'won' ? (
                <Text style={[typography.micro, { color: colors.accent }]}>
                  ✓ Accepted — milestones unlock in escrow
                </Text>
              ) : null}
              {b.status === 'lost' ? (
                <Text style={[typography.micro, { color: colors.textDim }]}>
                  Not selected — another bid was accepted
                </Text>
              ) : null}
            </Card>
          );
        })
      )}

      <Button
        label="Back to job"
        fullWidth
        variant="ghost"
        onPress={() => router.back()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 200 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaRow: { flexDirection: 'row', gap: spacing.xxl, marginTop: spacing.xs },
});
