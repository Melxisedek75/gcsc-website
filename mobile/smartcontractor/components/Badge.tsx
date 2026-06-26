import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../lib/tokens';

type Props = {
  label: string;
  color?: string;
  tone?: 'solid' | 'soft';
};

export function Badge({ label, color = colors.brand, tone = 'soft' }: Props) {
  const bg = tone === 'solid' ? color : color + '22';
  const fg = tone === 'solid' ? '#0B0F17' : color;
  return (
    <View style={[styles.wrap, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3 },
});
