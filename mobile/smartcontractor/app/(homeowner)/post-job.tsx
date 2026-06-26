import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { colors, radius, spacing, typography } from '../../lib/tokens';

const CATEGORIES = ['Renovation', 'Exterior', 'Repair', 'New build', 'Plumbing', 'Electrical'];

export default function PostJob() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Renovation');
  const [zip, setZip] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');

  return (
    <Screen>
      <Header title="Post a new job" subtitle="Verified contractors will be invited to bid" />

      <Input label="Job title" value={title} onChangeText={setTitle} placeholder="e.g. Bathroom remodel" />

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
        <Text style={[typography.bodyStrong, { color: colors.text }]}>
          How payments work
        </Text>
        <Text style={[typography.caption, { color: colors.textMuted }]}>
          You release funds milestone by milestone. Contractor uploads proof, AI compliance verifies, you
          approve. No upfront deposit risk.
        </Text>
      </Card>

      <Button label="Publish job" fullWidth />
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
