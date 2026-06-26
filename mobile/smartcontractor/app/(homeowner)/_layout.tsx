import { Tabs } from 'expo-router';
import { colors } from '../../lib/tokens';

export default function HomeownerTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.homeowner,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen name="jobs" options={{ title: 'Jobs' }} />
      <Tabs.Screen name="post-job" options={{ title: 'Post' }} />
      <Tabs.Screen name="milestones" options={{ title: 'Milestones' }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
