import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius, spacing, typography } from '../lib/tokens';

type Props = TextInputProps & {
  label?: string;
  helper?: string;
};

export function Input({ label, helper, style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={[typography.caption, { color: colors.textMuted }]}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textDim}
        style={[styles.input, style]}
        {...rest}
      />
      {helper ? <Text style={[typography.micro, { color: colors.textDim }]}>{helper}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: 15,
  },
});
