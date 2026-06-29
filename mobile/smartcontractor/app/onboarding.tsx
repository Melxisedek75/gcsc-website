import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { t } from '../lib/i18n';
import { markOnboardingComplete } from '../lib/onboarding';
import { colors, radius, spacing, typography } from '../lib/tokens';

type Slide = {
  title: string;
  body: string;
  accent: string;
};

const SLIDES: Slide[] = [
  {
    title: 'Trust the work, not the handshake',
    body:
      'SmartContractor turns every job into a milestone-by-milestone contract. Money is released only when the work is verified — never upfront.',
    accent: colors.brand,
  },
  {
    title: 'Verified contractors. Real proof.',
    body:
      'Every contractor on the platform is license-checked and insurance-verified. Each milestone is signed off with on-chain proof you can inspect any time.',
    accent: colors.accent,
  },
  {
    title: 'Pay with XPR. No surprises.',
    body:
      'Funds sit in escrow on XPR Network. You approve each milestone in WebAuth — biometric tap, sub-second confirmation, no fees from us.',
    accent: colors.homeowner,
  },
  {
    title: "You're in control",
    body:
      'Cancel any time before approving the next milestone. AI compliance has your back on disputes. Get started in under two minutes.',
    accent: colors.contractor,
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  async function handleNext() {
    if (isLast) {
      await markOnboardingComplete();
      router.replace('/');
      return;
    }
    setIndex((i) => i + 1);
  }

  async function handleSkip() {
    await markOnboardingComplete();
    router.replace('/');
  }

  async function handleHaveAccount() {
    await markOnboardingComplete();
    router.replace('/(auth)/sign-in');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <Pressable onPress={handleSkip} hitSlop={12}>
          <Text style={[typography.caption, { color: colors.textMuted }]}>{t('onboarding.skip')}</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={[styles.badge, { backgroundColor: slide.accent + '22' }]}>
          <Text style={[typography.micro, { color: slide.accent, fontWeight: '700' }]}>
            {index + 1} / {SLIDES.length}
          </Text>
        </View>
        <Text style={[typography.display, { color: colors.text }]}>{slide.title}</Text>
        <Text style={[typography.body, { color: colors.textMuted }]}>{slide.body}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === index
                  ? { backgroundColor: slide.accent, width: 24 }
                  : { backgroundColor: colors.border },
              ]}
            />
          ))}
        </View>
        <Button label={isLast ? t('onboarding.getStarted') : t('onboarding.next')} fullWidth onPress={handleNext} />
        <Pressable onPress={handleHaveAccount} hitSlop={8}>
          <Text style={[typography.caption, { color: colors.brand, textAlign: 'center' }]}>
            {t('onboarding.haveAccount')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  top: { flexDirection: 'row', justifyContent: 'flex-end' },
  content: { gap: spacing.lg, flex: 1, justifyContent: 'center' },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  footer: { gap: spacing.lg },
  dots: { flexDirection: 'row', gap: spacing.xs, justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
