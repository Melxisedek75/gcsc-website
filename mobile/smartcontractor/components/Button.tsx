import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../lib/tokens';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = 'primary', fullWidth, disabled, style }: Props) {
  const palette = paletteFor(variant);
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: palette.bg, borderColor: palette.border },
        fullWidth && styles.full,
        disabled && styles.disabled,
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      <Text style={[styles.label, { color: palette.fg }]}>{label}</Text>
    </Pressable>
  );
}

function paletteFor(v: Variant) {
  switch (v) {
    case 'secondary':
      return { bg: colors.surfaceAlt, fg: colors.text, border: colors.border };
    case 'ghost':
      return { bg: 'transparent', fg: colors.brand, border: 'transparent' };
    case 'danger':
      return { bg: colors.danger, fg: '#fff', border: colors.danger };
    default:
      return { bg: colors.brand, fg: '#0B0F17', border: colors.brand };
  }
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  full: { width: '100%' },
  disabled: { opacity: 0.5 },
  label: { fontSize: 15, fontWeight: '600' },
});
