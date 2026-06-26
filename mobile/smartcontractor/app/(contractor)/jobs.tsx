import { StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { colors, radius, spacing, typography } from '../../lib/tokens';
import { mockJobs } from '../../lib/mock';

const FILTERS = ['All', 'Near me', 'Renovation', 'Exterior', 'Repair'];

export default function ContractorJobs() {
  return (
    <Screen>
      <Header title="Available jobs" subtitle="Verified homeowners · escrowed budgets" />

      <View style={styles.filters}>
        {FILTERS.map((f, i) => (
          <View
            key={f}
            style={[styles.chip, i === 0 && { backgroundColor: colors.brand, borderColor: colors.brand }]}
          >
            <Text
              style={[
                typography.caption,
                { color: i === 0 ? colors.bg : colors.textMuted, fontWeight: '600' },
              ]}
            >
              {f}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ gap: spacing.md }}>
        {mockJobs
          .filter((j) => j.status === 'open' || j.status === 'bidding')
          .map((j) => (
            <Card key={j.id}>
              <View style={styles.row}>
                <Badge label={j.category.toUpperCase()} color={colors.contractor} />
                <Text style={[typography.micro, { color: colors.textDim }]}>{j.postedAgo} ago</Text>
              </View>
              <Text style={[typography.h3, { color: colors.text }]}>{j.title}</Text>
              <Text style={[typography.caption, { color: colors.textMuted }]}>{j.location}</Text>
              <Text style={[typography.body, { color: colors.textMuted }]} numberOfLines={2}>
                {j.description}
              </Text>
              <View style={styles.row}>
                <View>
                  <Text style={[typography.micro, { color: colors.textDim }]}>Budget</Text>
                  <Text style={[typography.bodyStrong, { color: colors.text }]}>{j.budget}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[typography.micro, { color: colors.textDim }]}>Competition</Text>
                  <Text style={[typography.bodyStrong, { color: colors.text }]}>{j.bids} bids</Text>
                </View>
              </View>
              <Button label="Submit a bid" fullWidth />
            </Card>
          ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
