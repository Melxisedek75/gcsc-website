import { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../lib/tokens';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'alt';
  style?: ViewStyle;
};

export function Card({ children, onPress, variant = 'default', style }: Props) {
  const bg = variant === 'alt' ? colors.surfaceAlt : colors.surface;
  const body = (
    <View style={[styles.card, { backgroundColor: bg }, style]}>{children}</View>
  );
  if (!onPress) return body;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
});
