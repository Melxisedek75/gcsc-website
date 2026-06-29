import { Link, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../lib/i18n';
import { colors, radius, spacing, typography } from '../lib/tokens';

export default function RoleSelect() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Text style={styles.logoMark}>SC</Text>
        </View>
        <Text style={[typography.display, { color: colors.text }]}>SmartContractor</Text>
        <Text style={[typography.body, { color: colors.textMuted }]}>
          {t('app.tagline')}
        </Text>
      </View>

      <View style={styles.cards}>
        <Pressable
          style={({ pressed }) => [
            styles.card,
            { borderColor: colors.homeowner + '55' },
            pressed && { opacity: 0.85 },
          ]}
          onPress={() => router.push('/(homeowner)/jobs')}
        >
          <View style={[styles.cardDot, { backgroundColor: colors.homeowner }]} />
          <Text style={[typography.h3, { color: colors.text }]}>{t('role.homeowner')}</Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            {t('role.homeowner.help')}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.card,
            { borderColor: colors.contractor + '55' },
            pressed && { opacity: 0.85 },
          ]}
          onPress={() => router.push('/(contractor)/jobs')}
        >
          <View style={[styles.cardDot, { backgroundColor: colors.contractor }]} />
          <Text style={[typography.h3, { color: colors.text }]}>{t('role.contractor')}</Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            {t('role.contractor.help')}
          </Text>
        </Pressable>
      </View>

      <Link href="/(auth)/sign-in" style={styles.signIn}>
        {t('app.haveAccount')}
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.xl,
    justifyContent: 'center',
    gap: spacing.xxl,
  },
  hero: { gap: spacing.md },
  logo: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logoMark: { color: colors.bg, fontWeight: '800', fontSize: 20 },
  cards: { gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    gap: spacing.xs,
  },
  cardDot: { width: 8, height: 8, borderRadius: 4, marginBottom: spacing.xs },
  signIn: {
    textAlign: 'center',
    color: colors.brand,
    fontSize: 14,
    fontWeight: '500',
  },
});
