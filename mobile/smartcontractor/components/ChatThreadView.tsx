import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatMessage, getChatHistory } from '../lib/chat';
import { getBackendProject } from '../lib/jobs';
import { projectIdFromThread } from '../lib/threads';
import { colors, radius, spacing, typography } from '../lib/tokens';

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

type Props = {
  threadId: string | undefined;
  counterparty: string;
};

export function ChatThreadView({ threadId, counterparty }: Props) {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const history = threadId ? getChatHistory(threadId) : null;
    return history?.messages ?? [];
  });
  const [draft, setDraft] = useState('');

  useEffect(() => {
    let cancelled = false;
    const projectId = threadId ? projectIdFromThread(threadId) : null;
    if (!projectId) {
      setIsLoading(false);
      return;
    }
    getBackendProject(projectId)
      .then((res) => {
        if (!cancelled) setJobTitle(res?.project.title ?? null);
      })
      .catch(() => {
        if (!cancelled) setJobTitle(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [threadId]);

  function handleSend() {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: `local-${Date.now()}`, sender: 'me', text, sentAt: Date.now() },
    ]);
    setDraft('');
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <ActivityIndicator color={colors.brand} />
        </View>
      </SafeAreaView>
    );
  }

  if (!jobTitle) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerBar}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={[typography.body, { color: colors.brand }]}>‹ Back</Text>
          </Pressable>
        </View>
        <View style={styles.empty}>
          <Text style={[typography.body, { color: colors.textMuted }]}>Conversation not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={[typography.body, { color: colors.brand }]}>‹ Back</Text>
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={[typography.bodyStrong, { color: colors.text }]}>{counterparty}</Text>
          <Text style={[typography.micro, { color: colors.textMuted }]}>{jobTitle}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.messages} contentContainerStyle={styles.messagesContent}>
          {messages.length === 0 ? (
            <Text style={[typography.caption, { color: colors.textDim, textAlign: 'center' }]}>
              No messages yet — say hello. Messages are stored on this device until chat sync
              launches.
            </Text>
          ) : null}
          {messages.map((m) => {
            const mine = m.sender === 'me';
            return (
              <View
                key={m.id}
                style={[styles.bubbleRow, { justifyContent: mine ? 'flex-end' : 'flex-start' }]}
              >
                <View
                  style={[
                    styles.bubble,
                    mine
                      ? { backgroundColor: colors.brand, borderBottomRightRadius: 4 }
                      : { backgroundColor: colors.surface, borderBottomLeftRadius: 4 },
                  ]}
                >
                  <Text style={[typography.body, { color: mine ? colors.bg : colors.text }]}>
                    {m.text}
                  </Text>
                  <Text
                    style={[
                      typography.micro,
                      { color: mine ? colors.bg + 'AA' : colors.textDim, marginTop: 2 },
                    ]}
                  >
                    {formatTime(m.sentAt)}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message…"
            placeholderTextColor={colors.textDim}
            style={styles.input}
            multiline
          />
          <Pressable
            style={[
              styles.sendButton,
              { backgroundColor: draft.trim() ? colors.brand : colors.border },
            ]}
            onPress={handleSend}
            disabled={!draft.trim()}
          >
            <Text style={[typography.bodyStrong, { color: colors.bg }]}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  messages: { flex: 1 },
  messagesContent: { padding: spacing.md, gap: spacing.sm },
  bubbleRow: { flexDirection: 'row' },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
  },
  composer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    fontSize: 15,
  },
  sendButton: {
    paddingHorizontal: spacing.lg,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
