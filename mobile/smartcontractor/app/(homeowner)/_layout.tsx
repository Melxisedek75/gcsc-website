import { Tabs } from 'expo-router';

export default function HomeownerTabs() {
  return (
    <Tabs>
        <Tabs.Screen name="jobs" options={{ title: 'Browse' }} />
        <Tabs.Screen name="post-job" options={{ title: 'Post' }} />
        <Tabs.Screen name="milestones" options={{ title: 'Milestones' }} />
        <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
