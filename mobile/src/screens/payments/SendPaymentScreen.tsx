import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { PaymentForm } from '../../components/payments/PaymentForm';
import { useCreatePayment } from '../../hooks/usePayment';
import { useAuthStore } from '../../store/authStore';
import { PaymentFormData } from '../../utils/validation';
import { colors, fontSize, spacing } from '../../constants/theme';
import { formatCurrency } from '../../utils/format';
import { MainTabParamList } from '../../types/navigation';

type NavProp = BottomTabNavigationProp<MainTabParamList, 'SendPayment'>;

export function SendPaymentScreen() {
  const createPayment = useCreatePayment();
  const navigation = useNavigation<NavProp>();
  const user = useAuthStore((s) => s.user);

  const onSubmit = (data: PaymentFormData) => {
    // Amount in form is dollars; API expects cents
    const amountCents = Math.round(data.amount * 100);

    createPayment.mutate(
      {
        amount: amountCents,
        currency: 'USD',
        description: data.description,
        receiverEmail: data.receiverEmail,
      },
      {
        onSuccess: () => {
          Alert.alert(
            '✅ Payment sent!',
            `${formatCurrency(amountCents)} has been sent successfully.`,
            [
              {
                text: 'View History',
                onPress: () => navigation.navigate('PaymentsTab' as any),
              },
              { text: 'Send Another', style: 'cancel' },
            ],
          );
        },
        onError: (error: any) => {
          const msg = error?.response?.data?.error || 'Payment failed. Please try again.';
          Alert.alert('Payment Failed', msg);
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Send Payment</Text>
          <Text style={styles.subtitle}>
            Balance: <Text style={styles.balance}>{formatCurrency(user?.balance ?? 0)}</Text>
          </Text>
        </View>
        <PaymentForm onSubmit={onSubmit} loading={createPayment.isPending} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  balance: {
    fontWeight: '600',
    color: colors.primary,
  },
});
