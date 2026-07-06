// User preferences — notification opt-ins, theme, language.
// AsyncStorage-only until backend has /api/preferences.

import { safeStorage as AsyncStorage } from './storage';

const SETTINGS_KEY = '@gcsc/settings';

export interface UserSettings {
  notifyJobUpdates: boolean;
  notifyBidActivity: boolean;
  notifyMilestoneEvents: boolean;
  notifyMessages: boolean;
  notifyMarketing: boolean;
  theme: 'system' | 'dark' | 'light';
  language: 'en' | 'es';
}

export const DEFAULT_SETTINGS: UserSettings = {
  notifyJobUpdates: true,
  notifyBidActivity: true,
  notifyMilestoneEvents: true,
  notifyMessages: true,
  notifyMarketing: false,
  theme: 'system',
  language: 'en',
};

export async function loadSettings(): Promise<UserSettings> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) return { ...DEFAULT_SETTINGS };
  try {
    const parsed = JSON.parse(raw) as Partial<UserSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function resetSettings(): Promise<void> {
  await AsyncStorage.removeItem(SETTINGS_KEY);
}
