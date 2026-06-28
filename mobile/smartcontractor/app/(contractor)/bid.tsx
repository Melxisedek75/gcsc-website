import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { PaymentSheet } from '../../components/PaymentSheet';
import { Screen } from '../../components/Screen';
import { LocalBid, listBids } from '../../lib/bids';
import { LocalLead, addLead, listLeads } from '../../lib/leads';
import { PAYMENT_CONFIG } from '../../lib/payments';
import { colors, spacing, typography } from '../../lib/tokens';

const BID_COLOR: Record<LocalBid['status'], string> = {
  submitted: colors.textMuted,
  shortlisted: colors.warning,
  won: colors.accent,
  lost: colors.danger,
};

const BID_LABEL: Record<LocalBid['status'], string> = {
  submitted: 'Submitted',
  shortlisted: 'Shortlisted',
  won: 'Won',
  lost: 'Not selected',
};

function timeAgo(ts: number): string {
  const sec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (sec < 60) return `${sec}s`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h`;
  return `${Math.floor(sec / 86400)}d`;
}

function explorerUrl(tx: string): string {
  return `https://testnet.explorer.xprnetwork.org/transaction/${tx}`;
}

function shortTx(tx: string): string {
  return tx ? `${tx.slice(0, 8)}…${tx.slice(-6)}` : '—';
}

export default function ContractorBids() {
  const [sheetVisible, setSheetVisible] = useState(false);
  const [leads, setLeads] = useState<LocalLead[]>([]);
  const [bids, setBids] = useState<LocalBid[]>([]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      Promise.all([listLeads(), listBids()]).then(([leadList, bidList]) => {
        if (cancelled) return;
        setLeads(leadList);
        setBids(bidList);
      });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const wins = bids.filter((b) => b.status === 'won').length;
  const pending = bids.filter(
    (b) => b.status === 'submitted' || b.status === 'shortlisted',
  ).length;

  return (
    <Screen>
      <Header title="My bids" subtitle="Track submitted bids and conversion" />

      <View style={styles.summary}>
        <Card variant="alt" style={styles.stat}>
          <Text style={[typography.h2, { color: colors.brand }]}>{bids.length}</Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>Total bids</Text>
        </Card>
        <Card variant="alt" style={styles.stat}>
          <Text style={[typography.h2, { color: colors.warning }]}>{pending}</Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>In review</Text>
        </Card>
        <Card variant="alt" style={styles.stat}>
          <Text style={[typography.h2, { color: colors.accent }]}>{wins}</Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>Won</Text>
        </Card>
      </View>

      <Card>
        <View style={styles.leadRow}>
          <View style={{ flex: 1, gap: spacing.xs }}>
            <Text style={[typography.bodyStrong, { color: colors.text }]}>
              Lead tokens · {leads.length}
            </Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}>
              Each 50 XPR lead unlocks one verified homeowner job + 100% replace guarantee.
            </Text>
          </View>
        </View>
        <Button label="Buy lead — 50 XPR" fullWidth onPress={() => setSheetVisible(true)} />
        {leads.length > 0 && (
          <View style={{ gap: spacing.xs, marginTop: spacing.sm }}>
            {leads.slice(0, 5).map((l) => (
              <Pressable key={l.id} onPress={() => l.txHash && Linking.openURL(explorerUrl(l.txHash))}>
                <Text style={[typography.micro, { color: colors.brand }]}>
                  {l.amount} · tx {shortTx(l.txHash)} ↗
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </Card>

      {bids.length === 0 ? (
        <Card variant="alt">
          <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center' }]}>
            No bids yet. Browse Available jobs and submit your first bid.
          </Text>
        </Card>
      ) : (
        bids.map((b) => (
          <Card key={b.id}>
            <View style={styles.row}>
              <Text style={[typography.caption, { color: colors.textMuted }]}>
                {timeAgo(b.submittedAt)} ago
              </Text>
              <Badge label={BID_LABEL[b.status]} color={BID_COLOR[b.status]} />
            </View>
            <Text style={[typography.h3, { color: colors.text }]}>{b.jobTitle}</Text>
            <View style={styles.metaRow}>
              <View>
                <Text style={[typography.micro, { color: colors.textDim }]}>Your bid</Text>
                <Text style={[typography.bodyStrong, { color: colors.text }]}>{b.amount}</Text>
              </View>
              <View>
                <Text style={[typography.micro, { color: colors.textDim }]}>Timeline</Text>
                <Text style={[typography.bodyStrong, { color: colors.text }]}>{b.timeline}</Text>
              </View>
            </View>
            {b.message ? (
              <Text style={[typography.caption, { color: colors.textMuted }]} numberOfLines={2}>
                {b.message}
              </Text>
            ) : null}
          </Card>
        ))
      )}

      <PaymentSheet
        visible={sheetVisible}
        title="Unlock a verified lead"
        subtitle="One Lead Token = one homeowner job. Replace guarantee on first purchase."
        request={{
          mode: 'charge',
          amount: PAYMENT_CONFIG.LEAD_TOKEN_AMOUNT,
          recipient: PAYMENT_CONFIG.LEAD_TOKEN_RECIPIENT,
          memo: 'gcsc:lead-token',
          endpoint: PAYMENT_CONFIG.LEAD_TOKEN_ENDPOINT,
        }}
        onClose={() => setSheetVisible(false)}
        onSuccess={async (receipt) => {
          await addLead({
            amount: PAYMENT_CONFIG.LEAD_TOKEN_AMOUNT,
            txHash: receipt.txHash ?? '',
          });
          const refreshed = await listLeads();
          setLeads(refreshed);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', gap: spacing.sm },
  stat: { flex: 1, gap: spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaRow: { flexDirection: 'row', gap: spacing.xxl, marginTop: spacing.xs },
  leadRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
