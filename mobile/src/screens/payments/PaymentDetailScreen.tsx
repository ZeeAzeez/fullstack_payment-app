import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card } from '../../components/common/Card';
import { Loading } from '../../components/common/Loading';
import { usePayment } from '../../hooks/usePayment';
import { useAuthStore } from '../../store/authStore';
import { PaymentStackParamList } from '../../types/navigation';
import { colors, fontSize, spacing, borderRadius } from '../../constants/theme';
import { formatCurrency, formatDate } from '../../utils/format';
import { PaymentStatus } from '../../types';

type Props = NativeStackScreenProps<PaymentStackParamList, 'PaymentDetail'>;

const STATUS_COLORS: Record<PaymentStatus, string> = {
  PENDING: colors.warning,
  PROCESSING: colors.primary,
  COMPLETED: colors.success,
  FAILED: colors.error,
  REFUNDED: colors.textSecondary,
};

const STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
};

export function PaymentDetailScreen({ route }: Props) {
  const { paymentId } = route.params;
  const currentUserId = useAuthStore((s) => s.user?.id);
  const { data, isLoading, isError } = usePayment(paymentId);

  if (isLoading) return <Loading message="Loading payment..." />;

  if (isError || !data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Payment not found</Text>
        <Text style={styles.errorText}>This payment could not be loaded. Please try again.</Text>
      </View>
    );
  }

  const payment = data.data;
  const isSent = payment.sender.id === currentUserId;
  const statusColor = STATUS_COLORS[payment.status];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Amount card */}
      <Card style={styles.amountCard}>
        <Text style={styles.directionLabel}>{isSent ? 'You sent' : 'You received'}</Text>
        <Text style={[styles.amount, { color: isSent ? colors.error : colors.success }]}>
          {isSent ? '-' : '+'}
          {formatCurrency(payment.amount, payment.currency)}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {STATUS_LABELS[payment.status]}
          </Text>
        </View>
      </Card>

      {/* Details */}
      <Card style={styles.detailsCard}>
        <DetailRow label="Date" value={formatDate(payment.createdAt)} />
        <DetailRow label="Currency" value={payment.currency} />
        {payment.description ? <DetailRow label="Note" value={payment.description} /> : null}
        <View style={styles.divider} />
        <DetailRow label="From" value={`${payment.sender.name}`} sub={payment.sender.email} />
        <DetailRow label="To" value={`${payment.receiver.name}`} sub={payment.receiver.email} />
      </Card>

      {/* Reference */}
      <Card style={styles.referenceCard}>
        <Text style={styles.referenceLabel}>Payment ID</Text>
        <Text style={styles.referenceValue} numberOfLines={1}>
          {payment.id}
        </Text>
      </Card>
    </ScrollView>
  );
}

function DetailRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        <Text style={styles.rowValue}>{value}</Text>
        {sub ? <Text style={styles.rowSub}>{sub}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  amountCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  directionLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  amount: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  detailsCard: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.xs,
  },
  rowLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  rowRight: {
    flex: 2,
    alignItems: 'flex-end',
  },
  rowValue: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: '500',
    textAlign: 'right',
  },
  rowSub: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  referenceCard: {
    gap: spacing.xs,
  },
  referenceLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  referenceValue: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontFamily: 'Courier',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  errorTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
