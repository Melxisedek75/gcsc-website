import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { Screen } from '../components/Screen';
import { clearBids } from '../lib/bids';
import { clearDisputes } from '../lib/disputes';
import { clearJobs } from '../lib/jobs';
import { clearLeads } from '../lib/leads';
import { resetOnboarding } from '../lib/onboarding';
import { DEFAULT_SETTINGS, UserSettings, loadSettings, saveSettings } from '../lib/settings';
import { colors, radius, spacing, typography } from '../lib/tokens';

const NOTIF_ROWS: { key: keyof UserSettings; label: string; help: string }[] = [
  { key: 'notifyJobUpdates', label: 'Job updates', help: 'New bids on your jobs, status changes.' },
  { key: 'notifyBidActivity', label: 'Bid activity', help: 'When your bid is shortlisted, accepted, or rejected.' },
  { key: 'notifyMilestoneEvents', label: 'Milestone events', help: 'Proof uploaded, milestone approved, funds released.' },
  { key: 'notifyMessages', label: 'New messages', help: 'In-app chat from the other party.' },
  { key: 'notifyMarketing', label: 'Product news', help: 'Releases and tips. Off by default.' },
];

const LANG_OPTIONS: { value: UserSettings['language']; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
];

const THEME_OPTIONS: { value: UserSettings['theme']; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
];

export default function Settings() {
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [busy, setBusy] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      loadSettings().then((s) => {
        if (!cancelled) setSettings(s);
      });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  async function updateField<K extends keyof UserSettings>(key: K, value: UserSettings[K]) {
    const next: UserSettings = { ...settings, [key]: value };
    setSettings(next);
    await saveSettings(next);
  }

  function handleResetOnboarding() {
    Alert.alert(
      'Replay onboarding',
      'You will see the welcome slides next time you open the app while signed out.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: async () => {
            await resetOnboarding();
            Alert.alert('Done', 'Onboarding will replay on next launch.');
          },
        },
      ],
    );
  }

  function handleClearLocal() {
    Alert.alert(
      'Clear local data?',
      'Removes posted jobs, submitted bids, purchased leads, and disputes from this device. Sign-in stays.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            if (busy) return;
            setBusy(true);
            try {
              await Promise.all([clearJobs(), clearBids(), clearLeads(), clearDisputes()]);
              Alert.alert('Cleared', 'Local data removed.');
            } finally {
              setBusy(false);
            }
          },
        },
      ],
    );
  }

  return (
    <Screen>
      <Header title="Settings" subtitle="Notifications, language, appearance" />

      <Card>
        <Text style={[typography.bodyStrong, { color: colors.text, marginBottom: spacing.sm }]}>
          Notifications
        </Text>
        {NOTIF_ROWS.map((row, i) => {
          const value = settings[row.key] as boolean;
          return (
            <View
              key={row.key}
              style={[styles.row, i < NOTIF_ROWS.length - 1 && styles.divider]}
            >
              <View style={{ flex: 1, paddingRight: spacing.md }}>
                <Text style={[typography.body, { color: colors.text }]}>{row.label}</Text>
                <Text style={[typography.micro, { color: colors.textMuted }]}>{row.help}</Text>
              </View>
              <Switch
                value={value}
                onValueChange={(v) => updateField(row.key, v as never)}
                trackColor={{ true: colors.brand, false: colors.border }}
              />
            </View>
          );
        })}
      </Card>

      <Card>
        <Text style={[typography.bodyStrong, { color: colors.text, marginBottom: spacing.sm }]}>
          Language
        </Text>
        <View style={styles.chips}>
          {LANG_OPTIONS.map((opt) => {
            const active = settings.language === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => updateField('language', opt.value)}
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
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card>
        <Text style={[typography.bodyStrong, { color: colors.text, marginBottom: spacing.sm }]}>
          Appearance
        </Text>
        <View style={styles.chips}>
          {THEME_OPTIONS.map((opt) => {
            const active = settings.theme === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => updateField('theme', opt.value)}
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
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[typography.micro, { color: colors.textDim, marginTop: spacing.sm }]}>
          Theme switching wires up in the next release.
        </Text>
      </Card>

      <Card>
        <Text style={[typography.bodyStrong, { color: colors.text, marginBottom: spacing.sm }]}>
          Reset & data
        </Text>
        <View style={{ gap: spacing.sm }}>
          <Button label="Replay onboarding" variant="ghost" fullWidth onPress={handleResetOnboarding} />
          <Button
            label={busy ? 'Working…' : 'Clear local data'}
            variant="ghost"
            fullWidth
            onPress={handleClearLocal}
            disabled={busy}
          />
        </View>
      </Card>

      <Button
        label="Back"
        fullWidth
        variant="ghost"
        onPress={() => router.back()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border },
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
