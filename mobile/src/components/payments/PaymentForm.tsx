import { useForm, Controller } from 'react-hook-form';
import { View, Text, StyleSheet } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { paymentSchema, PaymentFormData } from '../../utils/validation';
import { useUserSearch } from '../../hooks/usePayment';
import { colors, fontSize, spacing } from '../../constants/theme';

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  loading?: boolean;
}

export function PaymentForm({ onSubmit, loading }: PaymentFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      receiverEmail: '',
      amount: undefined,
      description: '',
    },
  });

  const receiverEmail = watch('receiverEmail');
  const { data: userSearch, isFetching: isSearching } = useUserSearch(receiverEmail);

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="receiverEmail"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <Input
              label="Recipient Email"
              placeholder="user@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.receiverEmail?.message}
            />
            {isSearching && <Text style={styles.searching}>Looking up user...</Text>}
            {!isSearching && userSearch && value.includes('@') && (
              <Text
                style={[
                  styles.recipientFeedback,
                  { color: userSearch.found ? colors.success : colors.error },
                ]}
              >
                {userSearch.found
                  ? `✓ ${userSearch.user?.name}`
                  : '✗ No account found with this email'}
              </Text>
            )}
          </>
        )}
      />

      <Controller
        control={control}
        name="amount"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Amount (USD)"
            placeholder="0.00"
            keyboardType="decimal-pad"
            onBlur={onBlur}
            onChangeText={(text) => {
              const parsed = parseFloat(text);
              onChange(isNaN(parsed) ? undefined : parsed);
            }}
            value={value !== undefined ? String(value) : ''}
            error={errors.amount?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Note (optional)"
            placeholder="What's this for?"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value || ''}
            error={errors.description?.message}
          />
        )}
      />

      <Button
        title="Send Payment"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        style={styles.submit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  searching: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  recipientFeedback: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  submit: {
    marginTop: spacing.sm,
  },
});
