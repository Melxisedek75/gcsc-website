import { useRouter } from 'expo-router';
import { ThreadList } from '../../components/ThreadList';
import { deriveContractorThreads } from '../../lib/threads';
import { colors } from '../../lib/tokens';

export default function ContractorChat() {
  const router = useRouter();
  return (
    <ThreadList
      subtitle="Conversations with homeowners on your bids"
      avatarColor={colors.homeowner}
      loadThreads={deriveContractorThreads}
      onOpenThread={(t) => router.push(`/(contractor)/chat/${t.id}` as never)}
      emptyText="No conversations yet. Bid on a job to start talking with its homeowner."
    />
  );
}
