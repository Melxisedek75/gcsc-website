import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { Header } from '../../../components/Header';
import { Input } from '../../../components/Input';
import { Screen } from '../../../components/Screen';
import { addBid } from '../../../lib/bids';
import { mockJobs } from '../../../lib/mock';
import { colors, spacing, typography } from '../../../lib/tokens';

export default function BidSubmit() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const job = mockJobs.find((j) => j.id === jobId);

  const [amount, setAmount] = useState('');
  const [timeline, setTimeline] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = amount.trim().length > 0 && timeline.trim().length > 0;

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await addBid({
        jobId: jobId ?? '',
        jobTitle: job?.title ?? 'Unknown job',
        amount: amount.trim(),
        timeline: timeline.trim(),
        message: message.trim(),
      });
      Alert.alert('Bid submitted', 'Homeowner will review. You can track status in My bids.', [
        { text: 'OK', onPress: () => router.replace('/(contractor)/bid') },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to submit bid';
      Alert.alert('Submission failed', msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (!job) {
    return (
      <Screen>
        <Header title="Job not available" subtitle="This job may have been closed." />
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
      <Header title="Submit a bid" subtitle={job.title} />

      <Card variant="alt">
        <View style={styles.row}>
          <Badge label={job.category.toUpperCase()} color={colors.contractor} />
          <Text style={[typography.micro, { color: colors.textDim }]}>{job.postedAgo} ago</Text>
        </View>
        <Text style={[typography.caption, { color: colors.textMuted }]}>{job.location}</Text>
        <View style={styles.detail}>
          <Text style={[typography.micro, { color: colors.textDim }]}>Homeowner budget</Text>
          <Text style={[typography.h3, { color: colors.text }]}>{job.budget}</Text>
        </View>
        <Text style={[typography.body, { color: colors.textMuted }]} numberOfLines={3}>
          {job.description}
        </Text>
      </Card>

      <Input
        label="Your bid amount"
        value={amount}
        onChangeText={setAmount}
        placeholder="$8,500"
      />
      <Input
        label="Timeline"
        value={timeline}
        onChangeText={setTimeline}
        placeholder="3-4 weeks, start in 10 days"
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
        label={submitting ? 'Submitting…' : 'Submit bid'}
        fullWidth
        onPress={handleSubmit}
        disabled={!canSubmit || submitting}
      />
      <Button
        label="Cancel"
        fullWidth
        variant="ghost"
        onPress={() => router.back()}
        disabled={submitting}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between', alignItems: 'center' },
  detail: { gap: spacing.xs, marginTop: spacing.md },
});
