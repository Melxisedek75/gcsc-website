import { useLocalSearchParams } from 'expo-router';
import { ChatThreadView } from '../../../components/ChatThreadView';

export default function HomeownerChatThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ChatThreadView threadId={id} counterparty="Contractor" />;
}
