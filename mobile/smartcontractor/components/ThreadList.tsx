import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { DerivedThread } from '../lib/threads';
import { colors, spacing, typography } from '../lib/tokens';
import { Avatar } from './Avatar';
import { Card } from './Card';
import { Header } from './Header';
import { Screen } from './Screen';

type Props = {
  subtitle: string;
  avatarColor: string;
  loadThreads: () => Promise<DerivedThread[]>;
  onOpenThread: (thread: DerivedThread) => void;
  emptyText: string;
};

export function ThreadList({ subtitle, avatarColor, loadThreads, onOpenThread, emptyText }: Props) {
  const [threads, setThreads] = useState<DerivedThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      loadThreads()
        .then((list) => {
          if (cancelled) return;
          setThreads(list);
          setLoadError(null);
        })
        .catch((err) => {
          if (cancelled) return;
          setLoadError(err instanceof Error ? err.message : 'Could not load conversations');
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }, [loadThreads]),
  );

  return (
    <Screen>
      <Header title="Messages" subtitle={subtitle} />

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : loadError ? (
        <Card variant="alt">
          <Text style={[typography.body, { color: colors.danger, textAlign: 'center' }]}>
            {loadError}
          </Text>
        </Card>
      ) : threads.length === 0 ? (
        <Card variant="alt">
          <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center' }]}>
            {emptyText}
          </Text>
        </Card>
      ) : (
        threads.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => onOpenThread(t)}
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
          >
            <Card>
              <View style={styles.row}>
                <Avatar name={t.counterparty} color={avatarColor} />
                <View style={styles.content}>
                  <View style={styles.top}>
                    <Text style={[typography.bodyStrong, { color: colors.text }]}>
                      {t.counterparty}
                    </Text>
                    <Text style={[typography.micro, { color: colors.textDim }]}>{t.lastAgo}</Text>
                  </View>
                  <Text style={[typography.micro, { color: colors.textMuted, marginBottom: 2 }]}>
                    {t.jobTitle}
                  </Text>
                  <Text
                    style={[typography.caption, { color: colors.textMuted }]}
                    numberOfLines={1}
                  >
                    {t.subtitle}
                  </Text>
                </View>
              </View>
            </Card>
          </Pressable>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loader: { alignItems: 'center', justifyContent: 'center', minHeight: 120 },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  content: { flex: 1, gap: 2 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
});
