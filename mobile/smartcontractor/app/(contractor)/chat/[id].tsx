import { useLocalSearchParams } from 'expo-router';
import { ChatThreadView } from '../../../components/ChatThreadView';

export default function ContractorChatThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ChatThreadView threadId={id} counterparty="Homeowner" />;
}
