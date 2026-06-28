import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { Screen } from '../components/Screen';
import { NotificationItem, NotificationKind, buildFeed } from '../lib/notifications';
import { colors, spacing, typography } from '../lib/tokens';

const KIND_COLOR: Record<NotificationKind, string> = {
  job_published: colors.homeowner,
  bid_submitted: colors.brand,
  bid_won: colors.accent,
  bid_lost: colors.textMuted,
  lead_purchased: colors.warning,
  dispute_opened: colors.danger,
};

const KIND_LABEL: Record<NotificationKind, string> = {
  job_published: 'JOB',
  bid_submitted: 'BID',
  bid_won: 'WON',
  bid_lost: 'LOST',
  lead_purchased: 'LEAD',
  dispute_opened: 'DISPUTE',
};

function timeAgo(ts: number): string {
  const sec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

export default function Notifications() {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      buildFeed().then((list) => {
        if (cancelled) return;
        setItems(list);
        setLoading(false);
      });
      return () => {
        cancelled = true;
      };
    }, []),
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

  return (
    <Screen>
      <Header title="Activity" subtitle="Recent events across your jobs, bids, and milestones" />

      {items.length === 0 ? (
        <Card variant="alt">
          <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center' }]}>
            No activity yet. Post a job or submit a bid to get started.
          </Text>
        </Card>
      ) : (
        items.map((n) => (
          <Card key={n.id}>
            <View style={styles.row}>
              <Badge label={KIND_LABEL[n.kind]} color={KIND_COLOR[n.kind]} />
              <Text style={[typography.micro, { color: colors.textDim }]}>{timeAgo(n.ts)}</Text>
            </View>
            <Text style={[typography.bodyStrong, { color: colors.text }]}>{n.title}</Text>
            <Text style={[typography.caption, { color: colors.textMuted }]} numberOfLines={2}>
              {n.body}
            </Text>
          </Card>
        ))
      )}

      <Button label="Back" fullWidth variant="ghost" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 200 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
