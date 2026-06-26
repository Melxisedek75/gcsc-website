import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../lib/tokens';

type Props = {
  name: string;
  color?: string;
  size?: number;
};

export function Avatar({ name, color = colors.brand, size = 44 }: Props) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <View
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  initials: { color: '#0B0F17', fontWeight: '700' },
});
