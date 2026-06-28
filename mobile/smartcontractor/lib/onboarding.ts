// Tracks whether the user has completed the onboarding flow.
// Persists in AsyncStorage — set once after the first run.

import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@gcsc/onboarding/completed';

export async function hasCompletedOnboarding(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(ONBOARDING_KEY);
  return raw === 'true';
}

export async function markOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}

export async function resetOnboarding(): Promise<void> {
  await AsyncStorage.removeItem(ONBOARDING_KEY);
}
