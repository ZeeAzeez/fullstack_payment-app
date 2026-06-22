import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { Payment } from '../../types';
import { colors, fontSize, spacing, borderRadius } from '../../constants/theme';
import { formatCurrency, formatDate } from '../../utils/format';

interface PaymentCardProps {
  payment: Payment;
  currentUserId: string;
}

export function PaymentCard({ payment, currentUserId }: PaymentCardProps) {
  const isSent = payment.sender.id === currentUserId;
  const statusColors = {
    PENDING: colors.warning,
    PROCESSING: colors.primary,
    COMPLETED: colors.success,
    FAILED: colors.error,
    REFUNDED: colors.textSecondary,
  };

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.participant}>
          {isSent ? `To: ${payment.receiver.name}` : `From: ${payment.sender.name}`}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[payment.status] + '20' }]}>
          <Text style={[styles.statusText, { color: statusColors[payment.status] }]}>
            {payment.status}
          </Text>
        </View>
      </View>
      <Text style={styles.amount}>{formatCurrency(payment.amount, payment.currency)}</Text>
      {payment.description && <Text style={styles.description}>{payment.description}</Text>}
      <Text style={styles.date}>{formatDate(payment.createdAt)}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  participant: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  amount: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: fontSize.xs,
    color: colors.disabled,
  },
});
