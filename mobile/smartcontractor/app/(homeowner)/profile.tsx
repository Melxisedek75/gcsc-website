import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.story}>Profile + KYC light status</Text>
      <Text style={styles.todo}>TODO: implement this screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  title: { fontSize: 24, fontWeight: '700' },
  story: { fontSize: 14, color: '#666' },
  todo: { fontSize: 12, color: '#999', marginTop: 24 },
});
