import { Link, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RoleSelect() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>SmartContractor</Text>
      <Text style={styles.subtitle}>Trust infrastructure for construction</Text>

      <Pressable
        style={[styles.card, styles.homeowner]}
        onPress={() => router.push('/(homeowner)/jobs')}
      >
        <Text style={styles.cardTitle}>I'm a homeowner</Text>
        <Text style={styles.cardBody}>Post a job, hire verified contractors, approve milestones.</Text>
      </Pressable>

      <Pressable
        style={[styles.card, styles.contractor]}
        onPress={() => router.push('/(contractor)/jobs')}
      >
        <Text style={styles.cardTitle}>I'm a contractor</Text>
        <Text style={styles.cardBody}>Find jobs, submit bids, upload milestone proof.</Text>
      </Pressable>

      <Link href="/(auth)/sign-in" style={styles.signIn}>
        Already have an account? Sign in
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 16 },
  title: { fontSize: 32, fontWeight: '700' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  card: { padding: 20, borderRadius: 12, gap: 6 },
  homeowner: { backgroundColor: '#E8F1FF' },
  contractor: { backgroundColor: '#FFF3E0' },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardBody: { fontSize: 14, color: '#444' },
  signIn: { textAlign: 'center', marginTop: 16, color: '#0066CC' },
});
