import { useRouter } from 'expo-router';
import { ThreadList } from '../../components/ThreadList';
import { deriveHomeownerThreads } from '../../lib/threads';
import { colors } from '../../lib/tokens';

export default function HomeownerChat() {
  const router = useRouter();
  return (
    <ThreadList
      subtitle="Conversations with contractors on your jobs"
      avatarColor={colors.contractor}
      loadThreads={deriveHomeownerThreads}
      onOpenThread={(t) => router.push(`/(homeowner)/chat/${t.id}` as never)}
      emptyText="No conversations yet. Accept a contractor's bid to start a project conversation."
    />
  );
}
