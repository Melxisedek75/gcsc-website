import React from 'react';
import { ScrollView, Text } from 'react-native';

interface Props {
  children: React.ReactNode;
}
interface State {
  error: Error | null;
}

// Renders any render-time crash as on-screen text instead of a blank/black
// screen. Critical for diagnosing standalone (release) builds where the JS
// error console is not visible.
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error): void {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error);
  }

  render(): React.ReactNode {
    const { error } = this.state;
    if (error) {
      return (
        <ScrollView
          style={{ flex: 1, backgroundColor: '#0b0f1a' }}
          contentContainerStyle={{ padding: 24, paddingTop: 72 }}
        >
          <Text style={{ color: '#ff8a3d', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
            App error (please screenshot)
          </Text>
          <Text selectable style={{ color: '#ffffff', fontSize: 14, marginBottom: 16 }}>
            {String(error.message || error)}
          </Text>
          <Text selectable style={{ color: '#8892a6', fontSize: 11 }}>
            {error.stack}
          </Text>
        </ScrollView>
      );
    }
    return this.props.children as React.ReactElement;
  }
}
