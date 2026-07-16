import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { Header } from '../../../components/Header';
import { Input } from '../../../components/Input';
import { Screen } from '../../../components/Screen';
import { placeBackendBid } from '../../../lib/bids';
import { BackendProject, formatBudget, getBackendProject, timeAgoIso } from '../../../lib/jobs';
import { colors, spacing, typography } from '../../../lib/tokens';

function parseDollars(raw: string): number {
  const digits = raw.replace(/[^0-9]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

export default function BidSubmit() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams<{ jobId: string }>();

  const [project, setProject] = useState<BackendProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [timelineDays, setTimelineDays] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!jobId) {
      setIsLoading(false);
      return;
    }
    getBackendProject(jobId)
      .then((res) => {
        if (cancelled) return;
        setProject(res?.project.status === 'open' ? res.project : null);
      })
      .catch(() => {
        if (!cancelled) setProject(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  const amountValue = parseDollars(amount);
  const daysValue = parseDollars(timelineDays);
  const canSubmit = amountValue > 0 && daysValue > 0;

  async function handleSubmit() {
    if (!canSubmit || isSubmitting || !project) return;
    setIsSubmitting(true);
    try {
      await placeBackendBid({
        project_id: project.id,
        amount: amountValue,
        proposed_timeline_days: daysValue,
        message: message.trim(),
      });
      Alert.alert('Bid submitted', 'Homeowner will review. You can track status in My bids.', [
        { text: 'OK', onPress: () => router.replace('/(contractor)/bid') },
      ]);
    } catch (err) {
      const msg = (err as { message?: string }).message ?? 'Failed to submit bid';
      Alert.alert('Submission failed', msg);
    } finally {
      setIsSubmitting(false);
    }
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

  if (!project) {
    return (
      <Screen>
        <Header title="Job not available" subtitle="This job may have been closed or taken." />
        <Button
          label="Back to jobs"
          fullWidth
          onPress={() => router.replace('/(contractor)/jobs')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Submit a bid" subtitle={project.title} />

      <Card variant="alt">
        <View style={styles.row}>
          <Badge label={(project.category || 'general').toUpperCase()} color={colors.contractor} />
          <Text style={[typography.micro, { color: colors.textDim }]}>
            {timeAgoIso(project.created_at)} ago
          </Text>
        </View>
        {project.location ? (
          <Text style={[typography.caption, { color: colors.textMuted }]}>{project.location}</Text>
        ) : null}
        <View style={styles.detail}>
          <Text style={[typography.micro, { color: colors.textDim }]}>Homeowner budget</Text>
          <Text style={[typography.h3, { color: colors.text }]}>{formatBudget(project)}</Text>
        </View>
        <Text style={[typography.body, { color: colors.textMuted }]} numberOfLines={3}>
          {project.description}
        </Text>
      </Card>

      <Input
        label="Your bid amount (USD)"
        value={amount}
        onChangeText={setAmount}
        placeholder="8500"
        keyboardType="number-pad"
      />
      <Input
        label="Timeline (days)"
        value={timelineDays}
        onChangeText={setTimelineDays}
        placeholder="21"
        keyboardType="number-pad"
      />
      <Input
        label="Message to homeowner"
        value={message}
        onChangeText={setMessage}
        placeholder="Scope you propose, materials, why pick you…"
        multiline
        numberOfLines={5}
        style={{ height: 120, textAlignVertical: 'top' }}
      />

      <Card variant="alt">
        <Text style={[typography.bodyStrong, { color: colors.text }]}>How bidding works</Text>
        <Text style={[typography.caption, { color: colors.textMuted }]}>
          Homeowner reviews bids, shortlists, picks one. On selection, escrow opens and milestone
          payments release on your work proof.
        </Text>
      </Card>

      <Button
        label={isSubmitting ? 'Submitting…' : 'Submit bid'}
        fullWidth
        onPress={handleSubmit}
        disabled={!canSubmit || isSubmitting}
      />
      <Button
        label="Cancel"
        fullWidth
        variant="ghost"
        onPress={() => router.back()}
        disabled={isSubmitting}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 200 },
  row: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between', alignItems: 'center' },
  detail: { gap: spacing.xs, marginTop: spacing.md },
});
