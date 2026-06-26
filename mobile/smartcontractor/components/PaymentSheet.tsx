import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  PaymentProgress,
  PaymentReceipt,
  PaymentRequest,
  PaymentStage,
  requestPayment,
} from '../lib/payments';
import { colors, radius, spacing, typography } from '../lib/tokens';
import { Button } from './Button';

type Props = {
  visible: boolean;
  title: string;
  subtitle?: string;
  request: PaymentRequest;
  onClose: () => void;
  onSuccess?: (receipt: PaymentReceipt) => void;
};

const STAGES: { stage: PaymentStage; label: string }[] = [
  { stage: 'requesting', label: 'Contact endpoint' },
  { stage: 'awaiting_signature', label: 'Sign in WebAuth' },
  { stage: 'broadcasting', label: 'Broadcast transfer' },
  { stage: 'verifying', label: 'Verify on Hyperion' },
  { stage: 'confirmed', label: 'Confirmed' },
];

export function PaymentSheet({ visible, title, subtitle, request, onClose, onSuccess }: Props) {
  const [progress, setProgress] = useState<PaymentProgress>({ stage: 'idle', detail: '' });
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!visible) {
      setProgress({ stage: 'idle', detail: '' });
      setReceipt(null);
      setRunning(false);
    }
  }, [visible]);

  const start = async () => {
    setRunning(true);
    setReceipt(null);
    const r = await requestPayment(request, setProgress);
    setReceipt(r);
    setRunning(false);
    if (r.ok && onSuccess) onSuccess(r);
  };

  const currentIdx = STAGES.findIndex((s) => s.stage === progress.stage);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.headerBlock}>
            <Text style={[typography.h2, { color: colors.text }]}>{title}</Text>
            {subtitle && (
              <Text style={[typography.caption, { color: colors.textMuted }]}>{subtitle}</Text>
            )}
          </View>

          <View style={styles.amountBlock}>
            <Text style={[typography.caption, { color: colors.textMuted }]}>Amount</Text>
            <Text style={[typography.display, { color: colors.brand }]}>{request.amount}</Text>
            <Text style={[typography.caption, { color: colors.textDim }]}>
              to {request.recipient}
            </Text>
          </View>

          {progress.stage !== 'idle' && (
            <View style={styles.stages}>
              {STAGES.map((s, i) => {
                const done = receipt?.ok && i <= currentIdx;
                const active = !receipt?.ok && i === currentIdx;
                const pending = i > currentIdx;
                return (
                  <View key={s.stage} style={styles.stageRow}>
                    <View
                      style={[
                        styles.stageDot,
                        done && { backgroundColor: colors.accent },
                        active && { backgroundColor: colors.brand },
                        pending && { backgroundColor: colors.border },
                      ]}
                    >
                      {active && <ActivityIndicator size="small" color={colors.bg} />}
                    </View>
                    <Text
                      style={[
                        typography.body,
                        {
                          color: done ? colors.text : active ? colors.text : colors.textDim,
                          flex: 1,
                        },
                      ]}
                    >
                      {s.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {progress.detail && progress.stage !== 'idle' && (
            <Text style={[typography.micro, { color: colors.textMuted, textAlign: 'center' }]}>
              {progress.detail}
            </Text>
          )}

          {progress.stage === 'failed' && receipt?.error && (
            <View style={styles.errorBox}>
              <Text style={[typography.caption, { color: colors.danger }]}>{receipt.error}</Text>
            </View>
          )}

          <View style={styles.actions}>
            {progress.stage === 'idle' && (
              <>
                <Button label="Cancel" variant="secondary" onPress={onClose} style={{ flex: 1 }} />
                <Button
                  label={`Pay ${request.amount.split(' ')[0]} XPR`}
                  onPress={start}
                  style={{ flex: 1 }}
                />
              </>
            )}
            {receipt?.ok && <Button label="Done" fullWidth onPress={onClose} />}
            {progress.stage === 'failed' && (
              <>
                <Button label="Close" variant="secondary" onPress={onClose} style={{ flex: 1 }} />
                <Button label="Retry" onPress={start} style={{ flex: 1 }} />
              </>
            )}
            {running && progress.stage !== 'failed' && !receipt && (
              <Pressable onPress={onClose} style={styles.cancelLink}>
                <Text style={[typography.caption, { color: colors.textMuted }]}>Cancel</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
  },
  headerBlock: { gap: spacing.xs },
  amountBlock: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
  },
  stages: { gap: spacing.sm },
  stageRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stageDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBox: {
    backgroundColor: colors.danger + '22',
    padding: spacing.md,
    borderRadius: radius.md,
  },
  actions: { flexDirection: 'row', gap: spacing.sm },
  cancelLink: { alignSelf: 'center', padding: spacing.sm },
});
