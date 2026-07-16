import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../../../components/Badge';
import { Button } from '../../../../components/Button';
import { Card } from '../../../../components/Card';
import { Header } from '../../../../components/Header';
import { Screen } from '../../../../components/Screen';
import { BackendBidStatus, EnrichedBid, acceptBackendBid } from '../../../../lib/bids';
import { getBackendProject, timeAgoIso } from '../../../../lib/jobs';
import { colors, spacing, typography } from '../../../../lib/tokens';

const STATUS_LABEL: Record<BackendBidStatus, string> = {
  pending: 'Submitted',
  accepted: 'Accepted',
  rejected: 'Not selected',
};

const STATUS_COLOR: Record<BackendBidStatus, string> = {
  pending: '#7CA0FF',
  accepted: '#3FB97A',
  rejected: '#7A8499',
};

export default function JobBids() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [bids, setBids] = useState<EnrichedBid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await getBackendProject(id);
      setBids((res?.bids as EnrichedBid[]) ?? []);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not load bids');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

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

  function handleAccept(b: EnrichedBid) {
    if (isBusy) return;
    Alert.alert(
      'Accept this bid?',
      `$${b.amount.toLocaleString()} · ${b.proposed_timeline_days} days\n\nAccepting rejects other bids on this job and opens escrow.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            setIsBusy(true);
            try {
              const res = await acceptBackendBid(b.id);
              await load();
              Alert.alert(
                'Accepted',
                `Escrow #${res.escrow_id} opened. Add milestones so the contractor can start submitting work.`,
              );
            } catch (err) {
              const msg = (err as { message?: string }).message ?? 'Failed to accept bid';
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
        <View style={styles.loader}>
          <ActivityIndicator color={colors.brand} />
        </View>
      </Screen>
    );
  }

  const winner = bids.find((b) => b.status === 'accepted');

  return (
    <Screen>
      <Header
        title="Bids on this job"
        subtitle={
          winner
            ? `$${winner.amount.toLocaleString()} accepted — escrow open`
            : `${bids.length} ${bids.length === 1 ? 'bid' : 'bids'} received`
        }
      />

      {loadError ? (
        <Card variant="alt">
          <Text style={[typography.body, { color: colors.danger, textAlign: 'center' }]}>
            {loadError}
          </Text>
          <Button label="Retry" fullWidth onPress={() => load()} />
        </Card>
      ) : null}

      {bids.length === 0 && !loadError ? (
        <Card variant="alt">
          <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center' }]}>
            No bids yet. Verified contractors will respond soon.
          </Text>
        </Card>
      ) : (
        bids.map((b) => {
          const label = STATUS_LABEL[b.status];
          const color = STATUS_COLOR[b.status];
          const canAccept = !winner && b.status === 'pending';
          const isVerified = b.contractor_verification?.ready_for_bids === true;
          return (
            <Card key={b.id}>
              <View style={styles.row}>
                <Text style={[typography.caption, { color: colors.textMuted }]}>
                  {b.contractor?.full_name ?? `Contractor #${b.contractor_id}`} ·{' '}
                  {timeAgoIso(b.created_at)} ago
                </Text>
                <Badge label={label} color={color} />
              </View>
              <View style={styles.metaRow}>
                <View>
                  <Text style={[typography.micro, { color: colors.textDim }]}>Bid</Text>
                  <Text style={[typography.h3, { color: colors.text }]}>
                    ${b.amount.toLocaleString()}
                  </Text>
                </View>
                <View>
                  <Text style={[typography.micro, { color: colors.textDim }]}>Timeline</Text>
                  <Text style={[typography.bodyStrong, { color: colors.text }]}>
                    {b.proposed_timeline_days} days
                  </Text>
                </View>
              </View>
              {b.message ? (
                <Text style={[typography.body, { color: colors.textMuted }]} numberOfLines={4}>
                  {b.message}
                </Text>
              ) : null}
              {canAccept ? (
                <>
                  <Button
                    label={isBusy ? 'Working…' : 'Accept this bid'}
                    fullWidth
                    onPress={() => handleAccept(b)}
                    disabled={isBusy}
                  />
                  {!isVerified ? (
                    <Text style={[typography.micro, { color: colors.warning }]}>
                      Contractor has not completed document verification — acceptance will be
                      blocked until their license and insurance are approved.
                    </Text>
                  ) : null}
                </>
              ) : null}
              {b.status === 'accepted' ? (
                <Text style={[typography.micro, { color: colors.accent }]}>
                  ✓ Accepted — manage milestones in the Milestones tab
                </Text>
              ) : null}
              {b.status === 'rejected' ? (
                <Text style={[typography.micro, { color: colors.textDim }]}>
                  Not selected — another bid was accepted
                </Text>
              ) : null}
            </Card>
          );
        })
      )}

      <Button label="Back to job" fullWidth variant="ghost" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 200 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaRow: { flexDirection: 'row', gap: spacing.xxl, marginTop: spacing.xs },
});
