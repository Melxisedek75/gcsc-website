import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { PaymentSheet } from '../../components/PaymentSheet';
import { Screen } from '../../components/Screen';
import { Alert } from 'react-native';
import { JOB_TEMPLATES, JobTemplate } from '../../lib/job-templates';
import { addJob, createBackendProject } from '../../lib/jobs';
import { ApiError } from '../../lib/api';
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
  const [preparing, setPreparing] = useState(false);
  const [projectId, setProjectId] = useState<number | null>(null);

  async function handlePublish() {
    if (preparing) return;
    setPreparing(true);
    try {
      // P0-2: create the backend project first so the job-posting payment can
      // send its project_id on the verification retry.
      const id = await createBackendProject({
        title: title.trim(),
        description: description.trim() || title.trim(),
        category,
        location: zip.trim(),
      });
      setProjectId(id);
      setSheetVisible(true);
    } catch (err) {
      const apiErr = err as ApiError | Error;
      Alert.alert('Could not start', apiErr.message ?? 'Failed to create project');
    } finally {
      setPreparing(false);
    }
  }

  const canPublish = title.trim().length > 0 && budget.trim().length > 0;

  function applyTemplate(t: JobTemplate) {
    setTitle(t.title);
    setCategory(t.category);
    setBudget(t.budget);
    const scope = t.scopeBullets.map((b) => `• ${b}`).join('\n');
    setDescription(`${t.description}\n\nScope:\n${scope}`);
  }

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

      <View style={{ gap: spacing.sm }}>
        <Text style={[typography.caption, { color: colors.textMuted }]}>
          Quick start — tap a template to pre-fill
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.sm, paddingRight: spacing.md }}
        >
          {JOB_TEMPLATES.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => applyTemplate(t)}
              style={({ pressed }) => [styles.tplCard, pressed && { opacity: 0.7 }]}
            >
              <Text style={[typography.micro, { color: colors.textDim }]}>{t.category}</Text>
              <Text
                style={[typography.bodyStrong, { color: colors.text }]}
                numberOfLines={2}
              >
                {t.title}
              </Text>
              <Text style={[typography.caption, { color: colors.brand }]}>{t.budget}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

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
        label={preparing ? 'Preparing…' : 'Publish & fund — 25 XPR'}
        fullWidth
        onPress={handlePublish}
        disabled={!canPublish || preparing}
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
          meta: projectId ? { project_id: projectId } : undefined,
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
  tplCard: {
    width: 200,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
});
