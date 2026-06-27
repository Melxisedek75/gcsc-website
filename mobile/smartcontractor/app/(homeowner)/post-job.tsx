import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { PaymentSheet } from '../../components/PaymentSheet';
import { Screen } from '../../components/Screen';
import { addJob } from '../../lib/jobs';
import { PAYMENT_CONFIG } from '../../lib/payments';
import { colors, radius, spacing, typography } from '../../lib/tokens';

const CATEGORIES = ['Renovation', 'Exterior', 'Repair', 'New build', 'Plumbing', 'Electrical'];

export default function PostJob() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Renovation');
  const [zip, setZip] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  const [sheetVisible, setSheetVisible] = useState(false);
  const [published, setPublished] = useState(false);

  const canPublish = title.trim().length > 0 && budget.trim().length > 0;

  return (
    <Screen>
      <Header title="Post a new job" subtitle="Verified contractors will be invited to bid" />

      {published && (
        <Card style={{ borderColor: colors.accent }}>
          <Text style={[typography.bodyStrong, { color: colors.accent }]}>
            ✓ Job published & escrow funded
          </Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            See it in My jobs. Verified contractors will be invited within 12h.
          </Text>
        </Card>
      )}

      <Input
        label="Job title"
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Bathroom remodel"
      />

      <View style={{ gap: spacing.sm }}>
        <Text style={[typography.caption, { color: colors.textMuted }]}>Category</Text>
        <View style={styles.chips}>
          {CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <Pressable
                key={c}
                onPress={() => setCategory(c)}
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
                  {c}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Input
        label="ZIP code"
        value={zip}
        onChangeText={setZip}
        placeholder="98103"
        keyboardType="number-pad"
      />
      <Input
        label="Budget range"
        value={budget}
        onChangeText={setBudget}
        placeholder="$5,000 – $10,000"
      />
      <Input
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Scope, materials, timeline expectations…"
        multiline
        numberOfLines={5}
        style={{ height: 120, textAlignVertical: 'top' }}
      />

      <Card variant="alt">
        <Text style={[typography.bodyStrong, { color: colors.text }]}>How payments work</Text>
        <Text style={[typography.caption, { color: colors.textMuted }]}>
          You release funds milestone by milestone. Contractor uploads proof, AI compliance verifies,
          you approve. A small 25 XPR verification fee covers AI compliance + dispute coverage.
        </Text>
      </Card>

      <Button
        label="Publish & fund — 25 XPR"
        fullWidth
        onPress={() => setSheetVisible(true)}
        disabled={!canPublish}
      />

      <PaymentSheet
        visible={sheetVisible}
        title="Publish your job"
        subtitle="Verification fee covers AI compliance check and dispute coverage on first milestone."
        request={{
          mode: 'charge',
          amount: '25.0000 XPR',
          recipient: PAYMENT_CONFIG.ESCROW_RECIPIENT,
          memo: 'gcsc:job-posting',
          endpoint: PAYMENT_CONFIG.JOB_POSTING_ENDPOINT,
        }}
        onClose={() => setSheetVisible(false)}
        onSuccess={async (receipt) => {
          await addJob({
            title: title.trim(),
            category,
            zip: zip.trim(),
            budget: budget.trim(),
            description: description.trim(),
            publishTxHash: receipt.txHash ?? '',
          });
          setPublished(true);
          setTitle('');
          setBudget('');
          setDescription('');
          setZip('');
          setTimeout(() => router.replace('/(homeowner)/jobs'), 1200);
        }}
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
