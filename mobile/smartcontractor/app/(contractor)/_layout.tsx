import { Tabs } from 'expo-router';
import { colors } from '../../lib/tokens';

export default function ContractorTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.contractor,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen name="jobs" options={{ title: 'Jobs' }} />
      <Tabs.Screen name="bid" options={{ title: 'Bids' }} />
      <Tabs.Screen name="milestones" options={{ title: 'Proof' }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
