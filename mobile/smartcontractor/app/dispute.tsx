import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Screen } from '../components/Screen';
import { DisputeReason, raiseDispute } from '../lib/disputes';
import { colors, radius, spacing, typography } from '../lib/tokens';

type Params = {
  scope?: 'job' | 'milestone' | 'bid';
  refId?: string;
  refLabel?: string;
  role?: 'homeowner' | 'contractor';
};

const REASONS: { value: DisputeReason; label: string; help: string }[] = [
  { value: 'quality', label: 'Quality of work', help: 'Work does not match agreed scope or finish.' },
  { value: 'incomplete', label: 'Incomplete', help: 'Work claimed complete but parts are missing.' },
  { value: 'not_started', label: 'Not started', help: 'Contractor agreed but never began.' },
  { value: 'overcharge', label: 'Overcharge', help: 'Amount requested exceeds the agreed bid.' },
  { value: 'communication', label: 'No communication', help: 'Counterparty is unresponsive.' },
  { value: 'other', label: 'Other', help: 'Describe in detail below.' },
];

export default function DisputeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<Params>();
  const scope = (params.scope as 'job' | 'milestone' | 'bid') ?? 'job';
  const refId = params.refId ?? '';
  const refLabel = params.refLabel ?? 'Unknown item';
  const role = (params.role as 'homeowner' | 'contractor') ?? 'homeowner';

  const [reason, setReason] = useState<DisputeReason>('quality');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);

  const canSubmit = description.trim().length >= 20;

  async function handleSubmit() {
    if (!canSubmit || busy) return;
    setBusy(true);
    try {
      await raiseDispute({
        scope,
        refId,
        refLabel,
        reason,
        description: description.trim(),
        raisedBy: role,
      });
      Alert.alert(
        'Dispute opened',
        'AI compliance will review proof and chat history within 48 hours. You will be notified of the recommendation.',
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to open dispute';
      Alert.alert('Error', msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <Header title="Report an issue" subtitle={refLabel} />

      <Card variant="alt">
        <Text style={[typography.bodyStrong, { color: colors.text }]}>How disputes work</Text>
        <Text style={[typography.caption, { color: colors.textMuted }]}>
          1. AI compliance reviews milestone proof and chat history.{'\n'}
          2. Non-binding recommendation in 48 hours.{'\n'}
          3. If either party rejects, human mediation kicks in.{'\n'}
          4. Mediator decision is executed by the smart contract.
        </Text>
      </Card>

      <View style={{ gap: spacing.sm }}>
        <Text style={[typography.caption, { color: colors.textMuted }]}>Reason</Text>
        <View style={styles.chips}>
          {REASONS.map((r) => {
            const active = r.value === reason;
            return (
              <Pressable
                key={r.value}
                onPress={() => setReason(r.value)}
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
                  {r.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[typography.micro, { color: colors.textDim }]}>
          {REASONS.find((r) => r.value === reason)?.help}
        </Text>
      </View>

      <Input
        label="What happened? (minimum 20 characters)"
        value={description}
        onChangeText={setDescription}
        placeholder="Describe the issue. Include dates, what was expected, what actually happened."
        multiline
        numberOfLines={6}
        style={{ height: 140, textAlignVertical: 'top' }}
      />

      <Button
        label={busy ? 'Opening dispute…' : 'Open dispute'}
        fullWidth
        onPress={handleSubmit}
        disabled={!canSubmit || busy}
      />
      <Button
        label="Cancel"
        fullWidth
        variant="ghost"
        onPress={() => router.back()}
        disabled={busy}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});
