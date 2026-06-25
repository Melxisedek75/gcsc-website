import { Tabs } from 'expo-router';

export default function ContractorTabs() {
  return (
    <Tabs>
        <Tabs.Screen name="jobs" options={{ title: 'Jobs' }} />
        <Tabs.Screen name="bid" options={{ title: 'Bids' }} />
        <Tabs.Screen name="milestones" options={{ title: 'Proof' }} />
        <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
