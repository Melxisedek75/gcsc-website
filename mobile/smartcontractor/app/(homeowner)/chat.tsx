import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../components/Avatar';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { colors, radius, spacing, typography } from '../../lib/tokens';
import { mockThreads } from '../../lib/mock';

export default function HomeownerChat() {
  return (
    <Screen>
      <Header title="Messages" subtitle="Conversations with contractors on your jobs" />

      {mockThreads.map((t) => (
        <Card key={t.id}>
          <View style={styles.row}>
            <Avatar name={t.counterparty} color={colors.contractor} />
            <View style={styles.content}>
              <View style={styles.top}>
                <Text style={[typography.bodyStrong, { color: colors.text }]}>{t.counterparty}</Text>
                <Text style={[typography.micro, { color: colors.textDim }]}>{t.lastAgo}</Text>
              </View>
              <Text style={[typography.micro, { color: colors.textMuted, marginBottom: 2 }]}>
                {t.jobTitle}
              </Text>
              <View style={styles.top}>
                <Text
                  style={[typography.caption, { color: colors.textMuted, flex: 1 }]}
                  numberOfLines={1}
                >
                  {t.lastMessage}
                </Text>
                {t.unread > 0 && (
                  <View style={styles.unread}>
                    <Text style={styles.unreadText}>{t.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  content: { flex: 1, gap: 2 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  unread: {
    minWidth: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.brand,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: { color: colors.bg, fontWeight: '700', fontSize: 11 },
});
